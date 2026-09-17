// Shared Turso (libSQL) client for all API routes.
// Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to be set as
// environment variables in the Vercel project (Settings -> Environment Variables).
// Never expose these to the browser — this file only runs server-side.

const { createClient } = require('@libsql/client');

let client;
function getDb() {
  if (!client) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL is not set');
    }
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
  }
  return client;
}

module.exports = { getDb };
