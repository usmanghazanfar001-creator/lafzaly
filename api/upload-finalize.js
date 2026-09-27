// POST { chunkUrls: string[], filename } -> fetches every chunk blob (in the
// exact order the client uploaded them), concatenates them into the
// original file, and stores that as the real, final blob. Cleans up the
// temporary chunk blobs afterward. Returns { url } — the same shape the
// frontend previously got from Vercel's client-upload feature, so nothing
// downstream (transcribe.js) needed to change.

const { put, del } = require('@vercel/blob');
const { getSessionUser } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to upload a video.' });

  const { chunkUrls, filename } = req.body || {};
  if (!Array.isArray(chunkUrls) || !chunkUrls.length || !filename) {
    return res.status(400).json({ error: 'chunkUrls and filename are required' });
  }

  try {
    const buffers = [];
    for (const url of chunkUrls) {
      const chunkRes = await fetch(url);
      if (!chunkRes.ok) throw new Error('A chunk went missing while assembling the file.');
      buffers.push(Buffer.from(await chunkRes.arrayBuffer()));
    }

    const fullBuffer = Buffer.concat(buffers);
    const finalBlob = await put(filename, fullBuffer, { access: 'public', addRandomSuffix: true });

    // Best-effort cleanup of the temporary chunks — don't fail the request
    // over this, a few orphaned small chunk blobs are harmless.
    del(chunkUrls).catch(err => console.warn('chunk cleanup failed (non-fatal):', err.message));

    return res.status(200).json({ url: finalBlob.url });
  } catch (err) {
    console.error('upload-finalize error:', err);
    return res.status(500).json({ error: 'Could not assemble the uploaded file. Please try again.' });
  }
};
