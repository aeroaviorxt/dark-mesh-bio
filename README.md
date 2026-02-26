# 🎴 avrxt-me: Premium Link-in-Bio Engine

A state-of-the-art, high-performance Link-in-Bio system built with **Next.js 15+**, **Supabase**, and **Tailwind CSS**. Designed for creators who want a premium, self-hosted digital profile with real-time integrations.

---

## 🚀 Quick Start Instructions

1.  **Fork & Clone**:
    ```bash
    git clone https://github.com/aviorxtaero/avrxt-me.git
    cd avrxt-me
    npm install
    ```
2.  **Environment Setup**:
    Copy `.env.local.example` (if provided) or create `.env.local` using the template below.
3.  **Supabase Setup**: Follow the detailed guide below.
4.  **Run Locally**:
    ```bash
    npm run dev
    ```

---

## 🏗️ Supabase Setup Instructions

1.  **Create Project**: Sign up at [Supabase](https://supabase.com) and create a new project.
2.  **SQL Execution**: Open the **SQL Editor** in your Supabase dashboard and paste the following script to initialize your database:

```sql
-- avrxt-me Supabase Schema Setup

-- 1. me_config table (Core Configuration)
CREATE TABLE IF NOT EXISTS public.me_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.me_config ENABLE ROW LEVEL SECURITY;

-- 2. spotify_tokens table
CREATE TABLE IF NOT EXISTS public.spotify_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- 3. spotify_history table
CREATE TABLE IF NOT EXISTS public.spotify_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_name TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_url TEXT,
    played_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(song_name, artist)
);

ALTER TABLE public.spotify_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Public can read config" ON public.me_config FOR SELECT USING (true);
CREATE POLICY "Auth users can modify config" ON public.me_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can see tokens" ON public.spotify_tokens FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can see history" ON public.spotify_history FOR SELECT USING (true);
CREATE POLICY "Auth users can update history" ON public.spotify_history FOR ALL USING (auth.role() = 'authenticated');

-- Initial Seed
INSERT INTO public.me_config (key, data)
VALUES ('main_config', '{
    "profile": {
        "handle": "YourName",
        "bio": "Open Source Link-in-Bio Engine",
        "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
        "bannerUrl": "",
        "location": "Global",
        "weatherEnabled": false,
        "presence": { "mode": "manual", "discordId": "" },
        "status": { "text": "Live", "color": "green" }
    },
    "links": [],
    "music": { "title": "Welcome", "artist": "Setup your music", "coverUrl": "", "audioUrl": "", "spotifyEnabled": false },
    "gallery": [],
    "resources": [],
    "widgets": { "quotesEnabled": true, "notesEnabled": false },
    "auth": { "discordRoleEnabled": false, "discordServerId": "", "discordRoleId": "" }
}') ON CONFLICT (key) DO NOTHING;
```

3.  **Storage Buckets**:
    - Go to **Storage**.
    - Create a new bucket named `images`.
    - Set the bucket to **Public**.
4.  **Auth Configuration**:
    - Go to **Authentication -> Providers**.
    - **GitHub**: Enable it and add your Client ID and Secret (from GitHub Developer Settings).
    - **Discord**: Enable it and add your Client ID and Secret (from Discord Developer Portal).
    - **Redirect URI**: Set your Supabase Redirect URI (found in Supabase Auth settings) in your GitHub/Discord app settings. It usually looks like:
      `https://your-project-id.supabase.co/auth/v1/callback`

---

## 🎧 Spotify Setup Instructions

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2.  **Create an App**.
3.  **Client ID & Secret**: Copy these into your `.env.local`.
4.  **Redirect URIs**: Add the following:
    - `http://localhost:3000/api/spotify/callback` (Local)
    - `https://your-domain.com/api/spotify/callback` (Production)
5.  **Usage**: In your admin panel, click "Connect Spotify" to authorize.

---

## 🤖 Discord OAuth & Role Auth

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2.  **Client ID & Secret**: Copy these to your Supabase Auth settings.
3.  **Redirect URIs**:
    - Add `https://your-project-id.supabase.co/auth/v1/callback` to your Discord App OAuth2 settings.
4.  **Presence System (Lanyard)**:
    - **IMPORTANT**: To use the real-time presence system, you **MUST** join the [Lanyard Discord Server](https://discord.gg/lanyard).
    - The system uses the [Lanyard API](https://github.com/Phineas/lanyard) to fetch your status, activities, and Spotify data via WebSockets.
5.  **Discord Bot (Optional for Role-Based Auth)**:
    - Create a Bot in your application.
    - Copy the **Bot Token** to your `.env.local` as `DISCORD_BOT_TOKEN`.
    - Invite the bot to your server with `Guild Members` intent.
    - Use the **Security Protocols** section in the Admin Panel to restrict access to a specific Server ID and Role ID.

---

## � YouTube Data API Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a Project**.
3.  **Enable API**: Search for "YouTube Data API v3" and enable it.
4.  **Credentials**: Create an **API Key**.
5.  Copy the Key to your `.env.local` as `YOUTUBE_API_KEY`. This allows you to search for music tracks in the admin panel.

---

## � Redirect URL Examples

| Service | Environment | Redirect URL |
| :--- | :--- | :--- |
| **Supabase Auth** (GitHub/Discord) | Project Settings | `https://your-project.supabase.co/auth/v1/callback` |
| **Spotify** | App Dashboard | `http://localhost:3000/api/spotify/callback` |
| **Spotify** | Production | `https://your-domain.com/api/spotify/callback` |
| **Supabase Site URL** | Auth Settings | `https://your-domain.com` |

---

## 📝 License
MIT License. Created by [avrxtcloud](https://github.com/avrxtcloud).
