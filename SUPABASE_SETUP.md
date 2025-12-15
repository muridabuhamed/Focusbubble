# 🚀 Supabase Setup Guide

Your app is now configured to use **Supabase** instead of Firebase! Supabase provides:

- ✅ **PostgreSQL Database** (more powerful than Firestore)
- ✅ **Google OAuth** (and many other providers)
- ✅ **Real-time** subscriptions
- ✅ **Row Level Security** (RLS)
- ✅ **100% Open Source**

## Step 1: Create Supabase Project

1. Go to: https://supabase.com/
2. Click **"Start your project"** or **"Sign in"**
3. Click **"New project"**
4. Fill in:
   - **Name:** FocusBubble
   - **Database Password:** (create a strong password)
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for setup

## Step 2: Get Your Credentials

1. In your Supabase project dashboard
2. Go to **Settings** (gear icon) → **API**
3. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

## Step 3: Add Credentials to .env.local

Open `.env.local` and paste your values:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

## Step 4: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New query"**
3. Paste and run this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT,
  email TEXT NOT NULL,
  avatar TEXT,
  focus_level TEXT DEFAULT 'Focus Beginner',
  streak INTEGER DEFAULT 0,
  total_hours DECIMAL DEFAULT 0,
  goals TEXT[] DEFAULT '{}',
  last_session_date TIMESTAMPTZ,
  is_pro BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (history of all focus sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  focus_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocklists table (user's blocked apps)
CREATE TABLE blocklists (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  apps JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocklists ENABLE ROW LEVEL SECURITY;

-- Users: Can only read/write their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions: Can only read/write their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blocklists: Can only read/write their own blocklist
CREATE POLICY "Users can view own blocklist" ON blocklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own blocklist" ON blocklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blocklist" ON blocklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_completed_at_idx ON sessions(completed_at DESC);
```

4. Click **"Run"** - you should see "Success. No rows returned"

## Step 5: Enable Google Authentication

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **"Enable Google provider"**
4. You'll need Google OAuth credentials:

### Getting Google OAuth Credentials:

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Application type: **Web application**
6. Name: FocusBubble
7. **Authorized redirect URIs**: Add this:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Replace with your Supabase project URL)
8. Click **"Create"**
9. Copy **Client ID** and **Client Secret**
10. Paste them in Supabase Google provider settings
11. Click **"Save"**

## Step 6: Test Everything!

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click **"Continue with Google"**

4. Sign in with your Google account

5. Complete a focus session

6. Check Supabase dashboard:
   - **Table Editor** → **users** → See your profile!
   - **Table Editor** → **sessions** → See your sessions!

## What You Get:

### ✅ Auto-Sync Across Devices
- Sign in on phone → see all your data
- Complete session on laptop → syncs everywhere

### ✅ Secure Database
- Row Level Security (RLS) enabled
- Users can only access their own data
- SQL-based, not NoSQL

### ✅ Real-Time Updates (optional)
- Can add live leaderboard
- See friends' progress in real-time

### ✅ Better Performance
- PostgreSQL is fast and reliable
- Indexes for quick queries
- Better than Firestore for complex queries

## Troubleshooting:

### Error: "Invalid API key"
- Check your SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
- Make sure no extra spaces
- Restart dev server after changes

### Error: "relation does not exist"
- Run the SQL queries in Step 4
- Make sure all tables are created

### Google Sign-In not working
- Check Google OAuth credentials
- Make sure redirect URI matches exactly
- Enable Google provider in Supabase

## Next Steps:

Want more features?
- 📊 **Analytics Dashboard** - Track progress over time
- 🏆 **Real-time Leaderboard** - Use Supabase real-time
- 📈 **Advanced Stats** - SQL queries for insights
- 🔔 **Email Notifications** - Supabase can send emails

You're all set! Supabase is more powerful and flexible than Firebase! 🚀
