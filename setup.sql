-- avrxt-me Supabase Schema Setup
-- Run this in your Supabase SQL Editor to prepare your database

-- 1. me_config table (Core Configuration)
CREATE TABLE IF NOT EXISTS public.me_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for me_config
ALTER TABLE public.me_config ENABLE ROW LEVEL SECURITY;

-- 2. spotify_tokens table (Spotify Integration)
CREATE TABLE IF NOT EXISTS public.spotify_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- 3. spotify_history table (Now Playing History)
CREATE TABLE IF NOT EXISTS public.spotify_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_name TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_url TEXT,
    played_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(song_name, artist)
);

ALTER TABLE public.spotify_history ENABLE ROW LEVEL SECURITY;

-- --- RLS POLICIES ---

-- me_config: Public can read, only authenticated users can write
CREATE POLICY "Public can read config" ON public.me_config FOR SELECT USING (true);
CREATE POLICY "Auth users can modify config" ON public.me_config FOR ALL USING (auth.role() = 'authenticated');

-- spotify_tokens: Restricted access, used by admin actions
CREATE POLICY "Auth users can see tokens" ON public.spotify_tokens FOR ALL USING (auth.role() = 'authenticated');

-- spotify_history: Public can read history
CREATE POLICY "Public can see history" ON public.spotify_history FOR SELECT USING (true);
CREATE POLICY "Auth users can update history" ON public.spotify_history FOR ALL USING (auth.role() = 'authenticated');

-- --- STORAGE BUCKETS ---
-- Please create an 'images' bucket manually in Supabase dashboard and set it to PUBLIC.
-- SQL for bucket creation (usually requires superuser):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- 4. Initial Configuration Seed
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
    "music": {
        "title": "Welcome",
        "artist": "Setup your music",
        "coverUrl": "",
        "audioUrl": "",
        "spotifyEnabled": false
    },
    "gallery": [],
    "resources": [],
    "widgets": {
        "quotesEnabled": true,
        "notesEnabled": false
    },
    "auth": {
        "discordRoleEnabled": false,
        "discordServerId": "",
        "discordRoleId": ""
    }
}') ON CONFLICT (key) DO NOTHING;
