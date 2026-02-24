-- TUNISIAN LENS MARKETPLACE SCHEMA

-- 1. Profiles Table (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('client', 'photographer', 'admin', 'visitor')) DEFAULT 'visitor',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Photographers Table
CREATE TABLE IF NOT EXISTS public.photographers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  bio TEXT,
  location TEXT,
  categories TEXT[], -- Using array for multiple categories
  rating DECIMAL DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  connects_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Portfolios Table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL,
  category TEXT,
  location TEXT,
  deadline DATE,
  connects_required INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('open', 'closed', 'completed')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  proposed_price DECIMAL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, photographer_id) -- Prevent double application
);

-- 6. Connect Transactions Table
CREATE TABLE IF NOT EXISTS public.connect_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT CHECK (reason IN ('job_apply', 'bonus', 'purchase', 'refund')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE connect_transactions ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be refined in Supabase Dashboard)
-- Anyone can read profiles and photographers
CREATE POLICY "Public profiles are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Photographer profiles are viewable by everyone" ON photographers FOR SELECT USING (true);
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

-- Triggers (Optional but useful)
-- Sync users table with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'visitor'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
