// POST { blobUrl }
// 1. Downloads the uploaded audio/video from Vercel Blob (server-to-server,
//    no size limit here — the 25MB ceiling below is Whisper's own limit).
// 2. Sends it to Groq's hosted Whisper (large-v3-turbo) for transcription
//    with segment-level timestamps. Groq has a free daily tier — see README.
// 3. Rewrites every segment through a Groq-hosted LLM so Urdu-script or
//    mixed speech comes out as natural, conversational Roman Urdu instead of
//    Urdu script or a stiff literal transliteration.
//
// Requires GROQ_API_KEY as an environment variable. Never exposed to the browser.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Speech-to-text is not configured on the server yet.' });
  }
  const { blobUrl } = req.body || {};
  if (!blobUrl) return res.status(400).json({ error: 'blobUrl is required' });

  try {
    const fileRes = await fetch(blobUrl);
    if (!fileRes.ok) throw new Error('Could not read the uploaded file from storage.');
    const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
    const contentType = fileRes.headers.get('content-type') || 'video/mp4';

    if (fileBuffer.byteLength > 25 * 1024 * 1024) {
      return res.status(400).json({
        error: 'This file is too large to transcribe right now (25MB limit). Try a shorter clip, or an audio-only export of it.'
      });
    }

    const form = new FormData();
    form.append('file', new Blob([fileBuffer], { type: contentType }), 'audio-input');
    form.append('model', 'whisper-large-v3-turbo');
    form.append('response_format', 'verbose_json');
    form.append('timestamp_granularities[]', 'segment');

    const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form
    });

    if (!whisperRes.ok) {
      console.error('Groq Whisper error:', await whisperRes.text());
      return res.status(502).json({ error: 'Transcription failed. Please try again in a moment.' });
    }

    const whisperData = await whisperRes.json();
    const rawSegments = whisperData.segments || [];
    if (!rawSegments.length) {
      return res.status(422).json({
        error: 'No voice was detected in this file. Please upload a video or audio file containing spoken audio.'
      });
    }

    const segments = await Promise.all(rawSegments.map(async (seg) => {
      const original = (seg.text || '').trim();
      const romanText = await toRomanUrdu(original);
      return {
        start: +Number(seg.start).toFixed(2),
        end: +Number(seg.end).toFixed(2),
        text: romanText || original,
        lang: classifyLang(original)
      };
    }));

    return res.status(200).json({ segments, detectedLanguage: whisperData.language || 'unknown' });
  } catch (err) {
    console.error('transcribe error:', err);
    return res.status(500).json({ error: 'Something went wrong while transcribing. Please try again.' });
  }
};

function classifyLang(text) {
  const hasUrduScript = /[\u0600-\u06FF]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  if (hasUrduScript && hasLatin) return 'Mixed';
  if (hasUrduScript) return 'Urdu';
  return 'English';
}

async function toRomanUrdu(text) {
  if (!text) return text;
  const prompt = `Convert the following speech transcript into natural, conversational Pakistani Roman Urdu (Urdu written in Latin/English letters, the way Pakistani creators actually text) — not formal Urdu, not a stiff literal transliteration. Keep any words that were genuinely spoken in English as English. Do not add information that wasn't said. Return ONLY the converted line, nothing else, no quotation marks.

Transcript: """${text}"""`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300
      })
    });
    if (!res.ok) return text;
    const data = await res.json();
    return (data.choices?.[0]?.message?.content || text).trim().replace(/^"+|"+$/g, '');
  } catch {
    return text; // fall back to the raw transcript if the rewrite step fails
  }
}
