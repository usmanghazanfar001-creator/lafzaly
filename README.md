# Lafzaly — Roman Urdu Caption Generator

A frontend prototype of Lafzaly: an AI-powered Roman Urdu caption and subtitle
generator for Pakistani creators on TikTok, Instagram Reels, YouTube Shorts and
Facebook.

## What's in this repo

A single static `index.html` (HTML/CSS/vanilla JS, no build step) containing:

- A full marketing landing page
- A dashboard with a text-to-caption generator (template-based Roman Urdu engine)
- A video captioning workspace: real file upload, real video playback, live
  synced caption overlay, editable timestamped transcript, style presets, and
  real SRT/VTT export
- Caption history, saved captions, settings, and a mock auth flow

## Status

This is a **frontend prototype**. Video playback, caption sync, and SRT/VTT
export are fully functional against whatever file you upload. AI caption
generation and speech-to-text transcription are mocked (template-based /
canned demo data) so the app runs with no backend or API keys.

See `lafzaly-architecture.md` (in the project docs) for the plan to wire up a
real backend: Next.js + Supabase (Auth/DB/Storage) + a pluggable AI/speech-to-text
provider interface + server-side FFmpeg processing.

## Deploy

This repo deploys to Vercel with zero configuration — it's static HTML at the
root, so Vercel's "Other" framework preset serves it directly. Every push to
`main` redeploys automatically once the GitHub repo is connected to a Vercel
project.

## Local preview

Just open `index.html` in a browser — no server or build step required.
