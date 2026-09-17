// Handles the token exchange for direct browser-to-Blob-storage uploads.
// The actual file bytes never pass through this function or through
// Vercel's normal request-body limit (4.5MB) — only this small token
// request/response does. This is what lets us accept full-size videos.
//
// Requires BLOB_READ_WRITE_TOKEN, which Vercel adds automatically once you
// create a Blob store for this project (Project -> Storage -> Create -> Blob).

const { handleUpload } = require('@vercel/blob/client');

module.exports = async (req, res) => {
  try {
    const body = req.body;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // TODO: once real auth exists, check the logged-in user here before
        // allowing an upload, and scope the pathname to their user id.
        return {
          allowedContentTypes: [
            'video/mp4', 'video/quicktime', 'video/webm',
            'audio/mpeg', 'audio/mp3', 'audio/wav'
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 300 * 1024 * 1024 // 300MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Blob upload completed:', blob.url);
      }
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('blob-upload error:', error);
    return res.status(400).json({ error: error.message });
  }
};
