-- ═══════════════════════════════════════════════════════════
-- BUTIK AKADEMİ — V4 MİGRASYON
-- Koç ve Öğrenci Detaylı Profil Tabloları ve RLS Politikaları
-- ═══════════════════════════════════════════════════════════

-- 1. Create coach_profiles table
create table if not exists public.coach_profiles (
    id uuid primary key references public.users(id) on delete cascade,
    bio text,
    subjects text, -- Comma-separated subjects like "Matematik, Fizik, Türkçe"
    experience text,
    education text,
    photo_url text,
    instagram varchar(255),
    linkedin varchar(255),
    updated_at timestamptz default now()
);

-- 2. Create student_profiles table
create table if not exists public.student_profiles (
    id uuid primary key references public.users(id) on delete cascade,
    bio text,
    school varchar(255),
    grade varchar(100),
    target_university varchar(255),
    target_department varchar(255),
    struggling_subjects text,
    daily_capacity integer, -- in hours
    updated_at timestamptz default now()
);

-- 3. Enable RLS
alter table public.coach_profiles enable row level security;
alter table public.student_profiles enable row level security;

-- 4. RLS Policies for coach_profiles
drop policy if exists "Anyone can read coach profiles" on public.coach_profiles;
create policy "Anyone can read coach profiles" on public.coach_profiles
    for select using (true);

drop policy if exists "Coaches can manage own profile" on public.coach_profiles;
create policy "Coaches can manage own profile" on public.coach_profiles
    for all using (
        id = auth.uid()
        or (select role from public.users where id = auth.uid()) = 'developer'
    );

-- 5. RLS Policies for student_profiles
drop policy if exists "Students can manage own profile" on public.student_profiles;
create policy "Students can manage own profile" on public.student_profiles
    for all using (
        id = auth.uid()
        or (select coach_id from public.users where id = student_profiles.id) = auth.uid()
        or (select role from public.users where id = auth.uid()) = 'developer'
    );

-- 6. Indexes
create index if not exists idx_coach_profiles_updated ON public.coach_profiles(updated_at);
create index if not exists idx_student_profiles_updated ON public.student_profiles(updated_at);
