-- ============================================================
-- TUNISIAN LENS — COMPLETE DATABASE & STORAGE SCHEMA
-- Run this in your Supabase project's SQL Editor (supabase.com)
-- ============================================================

-- 1. Create custom profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  role text default 'contributor' check (role in ('admin', 'curator', 'contributor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

-- Profiles are publicly readable
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using (true);

-- Users can only edit their own profile
drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger to auto-create profile row on sign up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created 
  after insert on auth.users 
  for each row execute procedure public.handle_new_user();


-- 2. Create photos table with EXIF metadata fields & RLS
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  story text,
  region text not null check (region in ('North', 'Sahel', 'Tunis & Suburbs', 'South & Sahara')),
  location_name text not null,
  image_url text not null,
  storage_path text not null,
  aspect_ratio text default 'aspect-[4/5]',
  status text default 'published' check (status in ('published', 'flagged', 'review')),
  tags text[] default '{}'::text[],
  
  -- Detected EXIF fields
  camera text,
  lens text,
  aperture text,
  shutter_speed text,
  focal_length text,
  iso integer,
  latitude double precision,
  longitude double precision,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for photos
alter table public.photos enable row level security;

-- Everyone can read published photos
drop policy if exists "Published photos are public" on public.photos;
create policy "Published photos are public" 
  on public.photos for select 
  using (status = 'published');

-- Authenticated photographers can insert their own photos
drop policy if exists "Authenticated users can upload photos" on public.photos;
create policy "Authenticated users can upload photos" 
  on public.photos for insert 
  with check (auth.uid() = user_id);

-- Authors can update their photos
drop policy if exists "Authors can modify their photos" on public.photos;
create policy "Authors can modify their photos" 
  on public.photos for update 
  using (auth.uid() = user_id);

-- Authors can delete their photos
drop policy if exists "Authors can delete their photos" on public.photos;
create policy "Authors can delete their photos" 
  on public.photos for delete 
  using (auth.uid() = user_id);


-- 3. Storage Bucket ('photos') & Storage Policies
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Photos Bucket" on storage.objects;
create policy "Public Access to Photos Bucket"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "Authenticated Users can Upload to Photos Bucket" on storage.objects;
create policy "Authenticated Users can Upload to Photos Bucket"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Users can update and delete their own uploads" on storage.objects;
create policy "Users can update and delete their own uploads"
  on storage.objects for update
  using (
    bucket_id = 'photos'
    and auth.uid() = owner
  );

drop policy if exists "Users can delete their own uploads" on storage.objects;
create policy "Users can delete their own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and auth.uid() = owner
  );


-- ============================================================
-- 4. HARDENED PASSWORD SECURITY POLICY & HOOKS
-- ============================================================
-- Recommended Supabase Auth Settings (Dashboard -> Authentication -> Password Policy):
-- Minimum Length: 10
-- Require Uppercase: Enabled
-- Require Lowercase: Enabled
-- Require Numbers: Enabled
-- Require Symbols: Enabled
-- Pwned Passwords Check: Enabled (HIBP verification)

-- Optional PL/pgSQL helper to check password complexity for backend edge functions
create or replace function public.check_password_complexity(pwd text)
returns boolean as $$
begin
  -- Minimum 10 chars, uppercase, lowercase, digit, and symbol
  if length(pwd) < 10 then
    return false;
  end if;
  if pwd !~ '[A-Z]' then
    return false;
  end if;
  if pwd !~ '[a-z]' then
    return false;
  end if;
  if pwd !~ '[0-9]' then
    return false;
  end if;
  if pwd !~ '[!@#$%^&*()_+\-=\[\]{};'':"\\|,.<>\/?~`]' then
    return false;
  end if;
  return true;
end;
$$ language plpgsql security definer;

