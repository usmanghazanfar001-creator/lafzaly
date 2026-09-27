// POST (raw binary body) -> stores one chunk of a larger file as a temporary
// blob and returns its URL. Called repeatedly by the browser, once per
// chunk, as a workaround for a known Vercel platform issue where direct
// browser-to-Blob-storage uploads (the official "client upload" feature)
// fail with a CORS error on some Blob store configurations. Every chunk is
// small enough to fit through a normal serverless function request (well
// under the 4.5MB body limit), so this never needs the broken
// browser-direct path at all — everything goes server-to-Blob, which we've
// confirmed works.
//
// Query params: uploadId, chunkIndex (both required, used only for a
// readable/unique storage path — the client tracks ordering itself via the
// returned URLs).
// Requires BLOB_READ_WRITE_TOKEN (same as before).

const { put } = require('@vercel/blob');
const { getSessionUser } = require('./_auth');

module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to upload a video.' });

  const { uploadId, chunkIndex } = req.query || {};
  if (!uploadId || chunkIndex === undefined) {
    return res.status(400).json({ error: 'uploadId and chunkIndex are required' });
  }

  try {
    const buffer = await readRawBody(req);
    const blob = await put(`chunks/${uploadId}/${chunkIndex}`, buffer, { access: 'public', addRandomSuffix: false });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('upload-chunk error:', err);
    return res.status(500).json({ error: 'Failed to store this chunk. Please try again.' });
  }
};
