# 🚀 API Integration Guide

This document provides a comprehensive overview of the external APIs integrated into this repository. It includes endpoint references, purposes, and practical examples for each service.

---

## 1. YouTube Data API v3
**Purpose:** Fetches video metadata, channel statistics, and search functionality.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/videos` | `GET` | Retrieve list of videos or specific video details. |
| `/search` | `GET` | Search for videos, channels, or playlists. |
| `/channels` | `GET` | Get detailed information about specific YouTube channels. |

### Example Usage
**Fetch Video Details:**
```http
GET [https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID&key=YOUR_API_KEY](https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID&key=YOUR_API_KEY)

fetch('[https://api.lanyard.rest/v1/users/DISCORD_ID](https://api.lanyard.rest/v1/users/DISCORD_ID)')
  .then(res => res.json())
  .then(data => console.log(data.data.discord_status));

GET [https://api.spotify.com/v1/me/player/currently-playing](https://api.spotify.com/v1/me/player/currently-playing)
Authorization: Bearer ACCESS_TOKEN

GET [https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto](https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto)

const { data, error } = await supabase
  .from('profiles')
  .select('username, bio')
  .eq('id', user_id);
