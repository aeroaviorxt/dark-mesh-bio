# 🛠️ Absolute Deployment & Setup Guide

Welcome to the definitive guide for deploying your own **Dark Mesh Bio** instance. This document provides a deep, step-by-step walkthrough to ensure your premium identity is perfectly configured.

---

## 🏗️ 1. Supabase Initialization (The Core)

Supabase handles your database, authentication, and file storage.

### Step A: Project Creation
1. Sign up at [Supabase](https://supabase.com).
2. Create a new Organization and a new **Project**.
3. Once the project is ready, navigate to **Settings -> API**.
4. Securely copy the following to your `.env.local`:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `API Key (anon)` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` -> `SUPABASE_SERVICE_ROLE_KEY` (Keep this secret!)

### Step B: Database Schema
1. Go to the **SQL Editor** in the left sidebar.
2. Click **New Query** and paste the **SQL Script** provided at the end of this guide.
3. Click **Run**. This creates the `me_config`, `spotify_tokens`, and `spotify_history` tables with pre-configured security policies (RLS).

### Step C: Storage Setup
1. Go to **Storage**.
2. Create a new Bucket named `images`.
3. Set the bucket privacy to **Public** (Crucial for avatar and banner rendering).

---

## 🤖 2. Discord Application & Presence

This powers your login and the real-time "Lanyard" presence system.

### Step A: Developer Portal
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**.
3. Navigate to **OAuth2 -> General**.
4. Copy your **Client ID** and **Client Secret** to your Supabase Auth settings (**Authentication -> Providers -> Discord**).
5. Add your Supabase Redirect URI to the Discord Redirects list:
   `https://[your-project-id].supabase.co/auth/v1/callback`

### Step B: Lanyard Presence System
1. **Join the Server**: You **MUST** be a member of the [Lanyard Discord Server](https://discord.gg/lanyard) for the API to track your status.
2. **Discord Settings**: Ensure "Display current activity as a status message" is **ON** in your Discord Privacy settings.
3. **Usage**: The system automatically pulls your data using your Discord ID (configured in the Admin Panel).

---

## 🎧 3. Spotify Integration

Powers the live listener widget and the 3D music cards.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create App**.
3. **Redirect URIs**: Add both:
   - `http://localhost:3000/api/spotify/callback`
   - `https://your-domain.com/api/spotify/callback`
4. Copy the **Client ID** and **Client Secret** to your `.env.local`.
5. **Connection**: Once your site is live, go to `/admin`, navigate to the Music tab, and click **Connect Spotify**.

---

## 🌦️ 4. Weather API (Automated)

The project uses the **Open-Meteo API**.
- **Setup**: No API key is required.
- **How it works**: Simply set your **Location** in the Admin Profile settings. The system fetches real-time telemetry based on that string.

---

## 📹 5. YouTube Data API (Search)

Required for finding background music in the Admin Panel.

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3**.
3. Create an **API Key** under Credentials.
4. Add it to `.env.local` as `YOUTUBE_API_KEY`.

---

## 🕹️ 6. Feature Breakdown

### The `/me` Profile
- **Glassmorphic UI**: High-end transparency and blur effects.
- **Haptic Music cards**: 3D album art that reacts to mouse movement.
- **Live Status**: Real-time "Online/Offline/Idle" indicator via Lanyard.
- **Visual Feed**: A grid of resources, gallery items, and automated weather.

### The `/me/admin` Dashboard
- **Real-time Preview**: See changes instantly before saving.
- **Link Architect**: Drag-and-drop (coming soon) management of social footprints.
- **Security Protocols**: Toggle Discord role restrictions and server locking.
- **Media Manager**: Direct uploads to Supabase Storage.

---

## 🚀 7. Vercel Hosting (Production)

1. Push your code to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. **Environment Variables**: Add every variable from your `.env.local` to the Vercel project settings.
4. **Build & Deploy**: Vercel will automatically handle the Next.js optimization.

---

## 📊 Supabase SQL Script

```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.me_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.me_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read config" ON public.me_config FOR SELECT USING (true);
CREATE POLICY "Auth users can modify config" ON public.me_config FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.spotify_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can see tokens" ON public.spotify_tokens FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.spotify_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_name TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_url TEXT,
    played_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(song_name, artist)
);

ALTER TABLE public.spotify_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can see history" ON public.spotify_history FOR SELECT USING (true);
CREATE POLICY "Auth users can update history" ON public.spotify_history FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.me_config (key, data)
VALUES ('main_config', '{"profile": {"handle": "Name", "bio": "Bio", "location": "Global", "weatherEnabled": false, "presence": {"mode": "manual", "discordId": ""}, "status": {"text": "Live", "color": "green"}}, "links": [], "music": {"spotifyEnabled": false, "title": "Welcome", "artist": "Setup"}, "auth": {"discordRoleEnabled": false}}')
ON CONFLICT (key) DO NOTHING;
```

---

## 🆘 Need Help?
If you encounter any issues during the deployment, feel free to reach out:
📧 **Email**: [hey@avrxt.in](mailto:hey@avrxt.in)

---
