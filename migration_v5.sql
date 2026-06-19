-- ═══════════════════════════════════════════════════════════
-- BUTIK AKADEMİ — V5 MİGRASYON
-- Veritabanı Eksiklerini Tamamlama, RLS ve Auth Eşleştirmesi
-- ═══════════════════════════════════════════════════════════

-- 1. Create pgcrypto extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create public.institutions if not exists
CREATE TABLE IF NOT EXISTS public.institutions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) not null,
    logo_url text,
    created_at timestamptz DEFAULT now()
);

-- 3. Drop and recreate users_role_check constraint to include 'parent'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('coach', 'student', 'developer', 'institution', 'parent'));

-- 4. Alter public.users to add missing columns
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email varchar(255) UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS exam_profile varchar(50) DEFAULT 'YKS' CHECK (exam_profile IN ('YKS', 'LGS', 'KPSS', 'ALES'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- 5. Create missing tables
-- 5.1. match_requests (Marketplace matchmaking requests)
CREATE TABLE IF NOT EXISTS public.match_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(50),
    exam_profile varchar(50) not null check (exam_profile in ('YKS', 'LGS', 'KPSS', 'ALES')),
    budget decimal(10,2),
    frequency varchar(100), -- weekly, bi-weekly
    style varchar(255), -- disciplined, friendly, result-oriented
    status varchar(50) default 'pending' check (status in ('pending', 'matched', 'completed')),
    matched_coach_id uuid references public.users(id) on delete set null,
    created_at timestamptz default now()
);

-- 5.2. platform_settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key varchar(100) PRIMARY KEY,
    value jsonb not null,
    created_at timestamptz default now()
);

-- 5.3. system_logs
CREATE TABLE IF NOT EXISTS public.system_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type varchar(50) not null check (type in ('error', 'click', 'pageview')),
    message text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 5.4. contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) not null,
    email varchar(255) not null,
    subject varchar(255),
    message text not null,
    status varchar(50) default 'pending' check (status in ('pending', 'read', 'archived')),
    created_at timestamptz default now()
);

-- 5.5. Add role column to public.leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS role varchar(50) DEFAULT 'coach';

-- 6. Create Security Definer functions to avoid RLS infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS varchar
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_user_coach(user_id uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT coach_id FROM public.users WHERE id = user_id;
$$;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- 8. Define RLS Policies

-- 8.1. public.users Policies
DROP POLICY IF EXISTS "Users can read themselves and related student/coach profiles" ON public.users;
DROP POLICY IF EXISTS "Users can read themselves, related profiles, or developers" ON public.users;
CREATE POLICY "Users can read themselves, related profiles, or developers"
    ON public.users FOR SELECT
    USING (
        auth.uid() = id 
        or coach_id = auth.uid() 
        or id = public.get_user_coach(auth.uid())
        or public.get_user_role(auth.uid()) = 'developer'
        or public.get_user_role(auth.uid()) = 'institution'
    );

DROP POLICY IF EXISTS "Coaches can insert/update their students" ON public.users;
DROP POLICY IF EXISTS "Coaches can manage students and developers/institutions manage everyone" ON public.users;
CREATE POLICY "Coaches can manage students and developers/institutions manage everyone"
    ON public.users FOR ALL
    USING (
        auth.uid() = coach_id 
        or auth.uid() = id 
        or public.get_user_role(auth.uid()) = 'developer'
        or public.get_user_role(auth.uid()) = 'institution'
    );

-- 8.2. platform_settings Policies
DROP POLICY IF EXISTS "Platform settings are viewable by anyone" ON public.platform_settings;
CREATE POLICY "Platform settings are viewable by anyone" ON public.platform_settings
    FOR SELECT USING (true);
    
DROP POLICY IF EXISTS "Platform settings are manageable by developers" ON public.platform_settings;
CREATE POLICY "Platform settings are manageable by developers" ON public.platform_settings
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'developer'
    );

-- 8.3. system_logs Policies
DROP POLICY IF EXISTS "Anyone can insert system logs" ON public.system_logs;
CREATE POLICY "Anyone can insert system logs" ON public.system_logs
    FOR INSERT WITH CHECK (true);
    
DROP POLICY IF EXISTS "Only developers can view system logs" ON public.system_logs;
CREATE POLICY "Only developers can view system logs" ON public.system_logs
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'developer'
    );

-- 8.4. contact_messages Policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
    
DROP POLICY IF EXISTS "Only developers can read contact messages" ON public.contact_messages;
CREATE POLICY "Only developers can read contact messages" ON public.contact_messages
    FOR SELECT USING (
        public.get_user_role(auth.uid()) = 'developer'
    );

-- 8.5. match_requests Policies
DROP POLICY IF EXISTS "Anyone can insert match requests" ON public.match_requests;
CREATE POLICY "Anyone can insert match requests" ON public.match_requests
    FOR INSERT WITH CHECK (true);
    
DROP POLICY IF EXISTS "Only developers and matched coaches can select match requests" ON public.match_requests;
CREATE POLICY "Only developers and matched coaches can select match requests" ON public.match_requests
    FOR SELECT USING (
        matched_coach_id = auth.uid()
        or public.get_user_role(auth.uid()) = 'developer'
    );
    
DROP POLICY IF EXISTS "Only developers can manage match requests" ON public.match_requests;
CREATE POLICY "Only developers can manage match requests" ON public.match_requests
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'developer'
    );

-- 8.6. public.institutions Policies
DROP POLICY IF EXISTS "Institutions are viewable by anyone" ON public.institutions;
CREATE POLICY "Institutions are viewable by anyone" ON public.institutions
    FOR SELECT USING (true);
    
DROP POLICY IF EXISTS "Only developers can manage institutions" ON public.institutions;
CREATE POLICY "Only developers can manage institutions" ON public.institutions
    FOR ALL USING (
        public.get_user_role(auth.uid()) = 'developer'
    );

-- 8. Sync/Insert Test Accounts into auth.users

-- 8.1. dev (developer)
INSERT INTO auth.users (
  instance_id, id, role, aud, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '131e3415-3bee-43ed-9275-ca042aa2299e',
  'authenticated',
  'authenticated',
  'dev@rostrumakademi.com',
  crypt('dev123', gen_salt('bf', 10)),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Developer", "role": "developer"}'::jsonb,
  now(),
  now(),
  '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_user_meta_data = excluded.raw_user_meta_data;

UPDATE public.users SET email = 'dev@rostrumakademi.com', password_hash = 'supabase_managed' WHERE id = '131e3415-3bee-43ed-9275-ca042aa2299e';

-- 8.2. demokoc (coach)
INSERT INTO auth.users (
  instance_id, id, role, aud, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '82730b64-a96f-4a63-af00-37063850e4c7',
  'authenticated',
  'authenticated',
  'demokoc@rostrumakademi.com',
  crypt('koc123', gen_salt('bf', 10)),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Demo Koç", "role": "coach"}'::jsonb,
  now(),
  now(),
  '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_user_meta_data = excluded.raw_user_meta_data;

UPDATE public.users SET email = 'demokoc@rostrumakademi.com', password_hash = 'supabase_managed' WHERE id = '82730b64-a96f-4a63-af00-37063850e4c7';

-- 8.3. demoogrenci (student)
INSERT INTO auth.users (
  instance_id, id, role, aud, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c5da0db6-a052-473e-b511-a227c2adb7b2',
  'authenticated',
  'authenticated',
  'demoogrenci@rostrumakademi.com',
  crypt('ogrenci123', gen_salt('bf', 10)),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Demo Öğrenci", "role": "student"}'::jsonb,
  now(),
  now(),
  '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_user_meta_data = excluded.raw_user_meta_data;

UPDATE public.users SET email = 'demoogrenci@rostrumakademi.com', password_hash = 'supabase_managed' WHERE id = 'c5da0db6-a052-473e-b511-a227c2adb7b2';

-- 8.4. demoveli (parent)
INSERT INTO public.users (id, username, full_name, role, password_hash, color, target, progress, week_start, created_at)
VALUES (
  'e387c2fb-e9a9-4674-bf43-cf8cf325c9b9',
  'demoveli',
  'Demo Veli',
  'parent',
  'supabase_managed',
  '#3ecf8e',
  '',
  0,
  0,
  now()
) ON CONFLICT (username) DO UPDATE SET
  role = 'parent',
  password_hash = 'supabase_managed';

INSERT INTO auth.users (
  instance_id, id, role, aud, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e387c2fb-e9a9-4674-bf43-cf8cf325c9b9',
  'authenticated',
  'authenticated',
  'demoveli@rostrumakademi.com',
  crypt('veli123', gen_salt('bf', 10)),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Demo Veli", "role": "parent"}'::jsonb,
  now(),
  now(),
  '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_user_meta_data = excluded.raw_user_meta_data;

UPDATE public.users SET email = 'demoveli@rostrumakademi.com', parent_id = null WHERE id = 'e387c2fb-e9a9-4674-bf43-cf8cf325c9b9';
UPDATE public.users SET parent_id = 'e387c2fb-e9a9-4674-bf43-cf8cf325c9b9' WHERE id = 'c5da0db6-a052-473e-b511-a227c2adb7b2';
