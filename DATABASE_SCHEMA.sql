-- ============================================================
-- FOCUSBUBBLE DATABASE SCHEMA FOR SUPABASE
-- ============================================================
-- Run this SQL in your Supabase SQL Editor
-- Project URL: https://dsxaklljzwgmhfbtvjla.supabase.co
-- ============================================================

-- 1. USERS TABLE
-- Stores user profile information
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT,
  email TEXT NOT NULL,
  avatar TEXT NOT NULL,
  focus_level TEXT NOT NULL DEFAULT 'Focus Beginner',
  streak INTEGER NOT NULL DEFAULT 0,
  total_hours NUMERIC(10, 2) NOT NULL DEFAULT 0,
  goals TEXT[] DEFAULT '{}',
  last_session_date TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Row Level Security (RLS) for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own data" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own data" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================================
-- 2. SESSIONS TABLE
-- Stores completed focus session history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  focus_score INTEGER NOT NULL CHECK (focus_score >= 0 AND focus_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON public.sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_completed ON public.sessions(user_id, completed_at DESC);

-- Row Level Security for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions" 
  ON public.sessions FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" 
  ON public.sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3. BLOCKLISTS TABLE
-- Stores user's blocked apps/websites
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blocklists (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  apps JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blocklists_user_id ON public.blocklists(user_id);

-- Row Level Security for blocklists
ALTER TABLE public.blocklists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own blocklist
CREATE POLICY "Users can view own blocklist" 
  ON public.blocklists FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can upsert their own blocklist
CREATE POLICY "Users can upsert own blocklist" 
  ON public.blocklists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blocklist" 
  ON public.blocklists FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. HELPER FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blocklists table
DROP TRIGGER IF EXISTS update_blocklists_updated_at ON public.blocklists;
CREATE TRIGGER update_blocklists_updated_at
  BEFORE UPDATE ON public.blocklists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. SAMPLE DATA QUERIES (FOR TESTING)
-- ============================================================

-- View all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check users
-- SELECT id, name, email, streak, total_hours FROM public.users;

-- Check sessions
-- SELECT user_id, duration_minutes, focus_score, completed_at FROM public.sessions ORDER BY completed_at DESC;

-- Check blocklists
-- SELECT user_id, jsonb_array_length(apps) as blocked_count FROM public.blocklists;

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
-- Next steps:
-- 1. Add your SUPABASE_ANON_KEY to .env.local
-- 2. Enable Google OAuth in Supabase Authentication settings
-- 3. Run: npm run dev
-- ============================================================
