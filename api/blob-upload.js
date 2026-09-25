// Handles the token exchange for direct browser-to-Blob-storage uploads.
// Requires a logged-in user — video captioning is now an authenticated
// feature (needed to enforce per-user daily/duration limits at all).
//
// Requires BLOB_READ_WRITE_TOKEN, which Vercel adds automatically once you
// create a Blob store for this project (Project -> Storage -> Create -> Blob).

const { handleUpload } = require('@vercel/blob/client');
const { getSessionUser } = require('./_auth');

module.exports = async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please log in to upload a video.' });

    const body = req.body;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'video/mp4', 'video/quicktime', 'video/webm',
          'audio/mpeg', 'audio/mp3', 'audio/wav'
        ],
        addRandomSuffix: true,
        maximumSizeInBytes: 300 * 1024 * 1024
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('Blob upload completed:', blob.url, 'user:', user.id);
      }
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('blob-upload error:', error);
    return res.status(400).json({ error: error.message });
  }
};
