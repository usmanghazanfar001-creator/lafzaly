// Shared Neon (Postgres) client for all API routes.
// Requires DATABASE_URL — the connection string from your Neon project
// dashboard (Settings/Connection Details), set as a Vercel environment
// variable. Never exposed to the browser.
//
// This exposes the same execute({sql, args}) shape the rest of the app was
// already written against (with '?' placeholders, SQLite-style) so the other
// API files didn't need individual rewrites when switching from Turso to
// Neon — this file converts '?' -> '$1,$2,...' and calls Neon's parameterized
// query() method, which mirrors node-postgres and returns { rows }.

const { neon } = require('@neondatabase/serverless');

let client;
function getDb() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    const sql = neon(process.env.DATABASE_URL);
    client = {
      async execute({ sql: text, args = [] }) {
        let i = 0;
        const pgText = text.replace(/\?/g, () => `$${++i}`);
        const result = await sql.query(pgText, args);
        // Defensive: Neon's query() mirrors node-postgres and returns
        // { rows: [...] }, but fall back gracefully if a future version
        // ever returns a bare array instead.
        return { rows: result.rows || result || [] };
      }
    };
  }
  return client;
}

module.exports = { getDb };
