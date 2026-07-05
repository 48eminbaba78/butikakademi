-- ============================================================================
-- BUTIK AKADEMI — SUPABASE DATABASE SCHEMA & MIGRATIONS
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. INSTITUTIONS TABLE (New Corporate Layer)
-- ----------------------------------------------------------------------------
create table if not exists public.institutions (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    logo_url text,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 2. USERS TABLE (Coaches, Students, Institution Managers, Admins)
-- ----------------------------------------------------------------------------
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    full_name varchar(255) not null,
    username varchar(100) unique not null,
    password_hash varchar(255) not null,
    role varchar(50) not null check (role in ('coach', 'student', 'developer', 'institution')),
    email varchar(255) unique,
    color varchar(50) default '#f0a500',
    target text default 'Hedef belirtilmemiş',
    progress integer default 0,
    week_start integer default 0, -- 0: Monday, 6: Sunday
    coach_id uuid references public.users(id) on delete set null, -- If user is student, links to coach
    institution_id uuid references public.institutions(id) on delete set null, -- Institution link
    exam_profile varchar(50) default 'YKS' check (exam_profile in ('YKS', 'LGS', 'KPSS', 'ALES')), -- New multi-exam profile
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 3. WORKSPACES TABLE (Coach custom SaaS profile)
-- ----------------------------------------------------------------------------
create table if not exists public.workspaces (
    id uuid primary key default uuid_generate_v4(),
    coach_id uuid references public.users(id) on delete cascade unique,
    brand_name varchar(255) not null,
    brand_color varchar(50) default '#f0a500',
    onboarding_done boolean default false,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 4. RESOURCES TABLE (Question Banks and Video Playlists)
-- ----------------------------------------------------------------------------
create table if not exists public.resources (
    id uuid primary key default uuid_generate_v4(),
    exam_type varchar(50) not null, -- TYT, AYT-SAY, LGS, KPSS, ALES, etc.
    subject varchar(100) not null,  -- Matematik, Türkçe, Fen, etc.
    publisher varchar(255),         -- Mert Hoca, Karakök, etc.
    name varchar(255) not null,      -- AYT Matematik Kampı 2025, etc.
    year integer default extract(year from now()),
    tests jsonb default '[]'::jsonb, -- Test lists: [{label: 'Test 1', soru: 12}] or videos [{label: 'Ders 1', url: '...', soru: 45}]
    active boolean default true,
    resource_type varchar(50) not null check (resource_type in ('book', 'playlist')),
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 5. TASKS TABLE (Student Study Schedule Tasks)
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid not null references public.users(id) on delete cascade,
    coach_id uuid references public.users(id) on delete set null,
    date date not null,
    type varchar(50) not null check (type in ('konu', 'soru', 'deneme', 'diger')),
    exam_type varchar(50), -- TYT, LGS, KPSS, etc.
    subject varchar(255) not null,
    duration integer default 60, -- minutes
    note text,
    done boolean default false,
    student_note text,
    task_items jsonb, -- Selected tests: [{label: 'Test 1', done: false}]
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 6. APPOINTMENTS TABLE (Coaching Meetings)
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid not null references public.users(id) on delete cascade,
    coach_id uuid not null references public.users(id) on delete cascade,
    date date not null,
    time time not null,
    duration integer default 45, -- minutes
    type varchar(100) not null,
    note text,
    meet_link text,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 7. EXAMS TABLE (Practice Test Net Tracking)
-- ----------------------------------------------------------------------------
create table if not exists public.exams (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid not null references public.users(id) on delete cascade,
    coach_id uuid references public.users(id) on delete set null,
    name varchar(255) not null, -- e.g., "LGS Denemesi #1"
    date date not null,
    exam_type varchar(50) not null, -- YKS, LGS, KPSS, ALES
    nets jsonb not null default '{}'::jsonb, -- e.g., {"Matematik": 17.5, "Türkçe": 18.0}
    exam_details jsonb,
    student_note text,
    coach_comment text,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 8. MESSAGES TABLE (Real-time Messaging between Student & Coach)
-- ----------------------------------------------------------------------------
create table if not exists public.messages (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid not null references public.users(id) on delete cascade,
    coach_id uuid not null references public.users(id) on delete cascade,
    from_role varchar(50) not null check (from_role in ('coach', 'student')),
    text text not null,
    read boolean default false,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 9. COACH_TODOS TABLE (Coach Tasks Checklist)
-- ----------------------------------------------------------------------------
create table if not exists public.coach_todos (
    id uuid primary key default uuid_generate_v4(),
    coach_id uuid not null references public.users(id) on delete cascade,
    date date not null,
    task varchar(255) not null,
    note text,
    done boolean default false,
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 10. LEADS TABLE (Platform Registration Leads)
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
    id uuid primary key default uuid_generate_v4(),
    first_name varchar(100) not null,
    last_name varchar(100),
    brand_name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(50),
    plan varchar(50) default 'pro',
    student_count integer default 10,
    status varchar(50) default 'pending' check (status in ('pending', 'contacted', 'approved', 'rejected')),
    notes text,
    source varchar(100) default 'app_signup',
    created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 11. MATCH_REQUESTS TABLE (Marketplace matchmaking requests)
-- ----------------------------------------------------------------------------
create table if not exists public.match_requests (
    id uuid primary key default uuid_generate_v4(),
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


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.users enable row level security;
alter table public.workspaces enable row level security;
alter table public.tasks enable row level security;
alter table public.appointments enable row level security;
alter table public.exams enable row level security;
alter table public.messages enable row level security;
alter table public.coach_todos enable row level security;
alter table public.match_requests enable row level security;

-- 1. Users Policies
create policy "Users can read themselves and related student/coach profiles"
    on public.users for select
    using (
        auth.uid() = id 
        or coach_id = auth.uid() 
        or id = (select coach_id from public.users where id = auth.uid())
        or role = 'developer'
    );

create policy "Coaches can insert/update their students"
    on public.users for all
    using (auth.uid() = coach_id or auth.uid() = id or role = 'developer');

-- 2. Tasks Policies
create policy "Students and coaches can read their tasks"
    on public.tasks for select
    using (student_id = auth.uid() or coach_id = auth.uid() or auth.uid() = (select coach_id from public.users where id = student_id));

create policy "Coaches can manage tasks"
    on public.tasks for all
    using (coach_id = auth.uid() or auth.uid() = (select coach_id from public.users where id = student_id));

-- 3. Messages Policies
create policy "Students and coaches can read their messages"
    on public.messages for select
    using (student_id = auth.uid() or coach_id = auth.uid());

create policy "Students and coaches can send messages"
    on public.messages for insert
    with check (auth.uid() = student_id or auth.uid() = coach_id);

-- 4. Exams Policies
create policy "Exams are viewable by student and their coach"
    on public.exams for select
    using (student_id = auth.uid() or coach_id = auth.uid());

create policy "Coaches can manage exams"
    on public.exams for all
    using (coach_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 12. INSTITUTIONAL POLICIES & SCHEMA UPGRADES
-- ----------------------------------------------------------------------------
alter table public.institutions add column if not exists seat_limit integer default 10;

create policy "Institutions can read and update their own details"
    on public.institutions for all
    using (id = (select institution_id from public.users where id = auth.uid()));

create policy "Institutions can manage their own coaches and students"
    on public.users for all
    using (
        institution_id = (select institution_id from public.users where id = auth.uid())
        or id = auth.uid()
    );

-- ----------------------------------------------------------------------------
-- 13. SEED DATA (For Testing Institutional Features)
-- ----------------------------------------------------------------------------
-- Run these statements in your SQL editor to create a test institution and manager:
--
-- INSERT INTO public.institutions (id, name, seat_limit) 
-- VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Rostrum Akademi Kadıköy', 10) 
-- ON CONFLICT DO NOTHING;
--
-- INSERT INTO public.users (id, full_name, username, password_hash, role, email, institution_id) 
-- VALUES ('748d1e38-9ce0-482f-87a4-bb20e8b15d2a', 'Ahmet Kurumsal', 'kurum', 'kurum123', 'institution', 'ahmet@rostrumakademi.com', 'd290f1ee-6c54-4b01-90e6-d701748f0851') 
-- ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. PLATFORM SETTINGS TABLE (Branding, Pricing, SEO Customization)
-- ----------------------------------------------------------------------------
create table if not exists public.platform_settings (
    key varchar(100) primary key,
    value jsonb not null,
    created_at timestamptz default now()
);

-- RLS policies for platform_settings
alter table public.platform_settings enable row level security;

create policy "Platform settings are viewable by anyone"
    on public.platform_settings for select
    using (true);

create policy "Platform settings are manageable by developers"
    on public.platform_settings for all
    using (auth.uid() in (select id from public.users where role = 'developer'));

-- Default seeds
insert into public.platform_settings (key, value) values
('branding', '{"title": "Rostrum Akademi", "slogan": "Zaman kazandıran eğitim yönetim sistemi", "hero_desc": "Haftalık program, deneme takibi, gerçek zamanlı mesajlaşma, PDF raporlar.", "primary_color": "#f0a500", "accent_color": "#e8622a"}'::jsonb),
('pricing', '{"pro_price": 299, "corporate_price": 199, "commission_rate": 10}'::jsonb),
('seo', '{"meta_description": "Rostrum Akademi ile eğitim yönetim süreçlerinizi hızlandırın.", "meta_keywords": "koçluk, yks, lgs, kpss, dershane"}'::jsonb)
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- 15. MISSING TABLES & ALIGNMENTS (From Platform Status Analysis Report)
-- ----------------------------------------------------------------------------

-- Announcements table (aligned with admin panel saveAnnounce)
create table if not exists public.announcements (
    id uuid primary key default uuid_generate_v4(),
    message text not null,
    type varchar(50) default 'info' check (type in ('info', 'warning', 'success')),
    active boolean default true,
    link text,
    link_text varchar(255),
    created_at timestamptz default now()
);
alter table public.announcements enable row level security;
create policy "Announcements are viewable by everyone" on public.announcements for select using (true);
create policy "Announcements are manageable by developers" on public.announcements for all using (auth.uid() in (select id from public.users where role = 'developer'));

-- Payments table
create table if not exists public.payments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete set null,
    student_id uuid references public.users(id) on delete set null,
    amount decimal(10,2) not null,
    status varchar(50) default 'completed' check (status in ('pending', 'completed', 'failed')),
    method varchar(50) default 'kart' check (method in ('nakit', 'havale', 'kart', 'iyzico')),
    payment_date date default current_date,
    description text,
    created_at timestamptz default now()
);
alter table public.payments enable row level security;
create policy "Users can view their own payments" on public.payments for select using (user_id = auth.uid() or student_id = auth.uid() or auth.uid() in (select id from public.users where role = 'developer'));
create policy "Anyone can insert payments" on public.payments for insert with check (true);
create policy "Developers can manage payments" on public.payments for all using (auth.uid() in (select id from public.users where role = 'developer'));

-- Subscriptions table
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    student_id uuid references public.users(id) on delete cascade,
    plan varchar(50) not null check (plan in ('monthly', 'quarterly', 'yearly')),
    amount decimal(10,2) not null,
    start_date date default current_date,
    end_date date,
    status varchar(50) default 'active' check (status in ('active', 'trial', 'paused', 'cancelled')),
    notes text,
    created_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "Users can view their own subscriptions" on public.subscriptions for select using (user_id = auth.uid() or student_id = auth.uid() or auth.uid() in (select id from public.users where role = 'developer'));
create policy "Anyone can insert subscriptions" on public.subscriptions for insert with check (true);
create policy "Developers can manage subscriptions" on public.subscriptions for all using (auth.uid() in (select id from public.users where role = 'developer'));

-- System logs table (For errors and usage analytics)
create table if not exists public.system_logs (
    id uuid primary key default uuid_generate_v4(),
    type varchar(50) not null check (type in ('error', 'click', 'pageview')),
    message text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
alter table public.system_logs enable row level security;
create policy "Anyone can insert system logs" on public.system_logs for insert with check (true);
create policy "Only developers can view system logs" on public.system_logs for select using (auth.uid() in (select id from public.users where role = 'developer'));

-- Tickets table
create table if not exists public.tickets (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete set null,
    subject varchar(255) not null,
    body text not null,
    category varchar(100),
    priority varchar(50) default 'normal',
    status varchar(50) default 'open' check (status in ('open', 'resolved', 'closed')),
    reply text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table public.tickets enable row level security;
create policy "Users can view and create their own tickets" on public.tickets for all using (user_id = auth.uid() or auth.uid() in (select id from public.users where role = 'developer'));

-- Blog posts table (aligned with admin panel saveBlogPost)
create table if not exists public.blog_posts (
    id uuid primary key default uuid_generate_v4(),
    title varchar(255) not null,
    slug varchar(255) unique not null,
    excerpt text,
    content text not null,
    category varchar(100),
    cover_emoji varchar(50) default '📝',
    read_time integer default 5,
    author varchar(100) default 'Rostrum Akademi',
    published boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table public.blog_posts enable row level security;
create policy "Blog posts are viewable by anyone" on public.blog_posts for select using (true);
create policy "Blog posts are manageable by developers" on public.blog_posts for all using (auth.uid() in (select id from public.users where role = 'developer'));

-- Site content table
create table if not exists public.site_content (
    key varchar(100) primary key,
    value jsonb not null,
    updated_at timestamptz default now()
);
alter table public.site_content enable row level security;
create policy "Site content is viewable by anyone" on public.site_content for select using (true);
create policy "Site content is manageable by developers" on public.site_content for all using (auth.uid() in (select id from public.users where role = 'developer'));

-- Student speeds table
create table if not exists public.student_speeds (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid references public.users(id) on delete cascade,
    coach_id uuid references public.users(id) on delete cascade,
    exam_type varchar(50),
    subject varchar(100),
    secs_per_question integer default 60,
    updated_at timestamptz default now()
);
alter table public.student_speeds enable row level security;
create policy "Student speeds viewable by student and coach" on public.student_speeds for select using (student_id = auth.uid() or coach_id = auth.uid() or auth.uid() in (select id from public.users where role = 'developer'));
create policy "Student speeds manageable by coach" on public.student_speeds for all using (coach_id = auth.uid() or auth.uid() in (select id from public.users where role = 'developer'));

-- Contact messages table (NEW)
create table if not exists public.contact_messages (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    email varchar(255) not null,
    subject varchar(255),
    message text not null,
    status varchar(50) default 'pending' check (status in ('pending', 'read', 'archived')),
    created_at timestamptz default now()
);
alter table public.contact_messages enable row level security;
create policy "Anyone can insert contact messages" on public.contact_messages for insert with check (true);
create policy "Only developers can read contact messages" on public.contact_messages for select using (auth.uid() in (select id from public.users where role = 'developer'));

-- ----------------------------------------------------------------------------
-- 16. SUPABASE AUTH USER SYNCHRONIZATION TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, username, role, email, password_hash, exam_profile)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_meta_data->>'role', 'coach'),
    new.email,
    'supabase_managed',
    'YKS'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 17. DATABASE RPC FUNCTIONS FOR SECURE PASSWORD MANAGEMENT
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

create or replace function public.create_new_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_username text,
  p_role text,
  p_target text,
  p_color text,
  p_progress integer,
  p_week_start integer,
  p_coach_id uuid,
  p_institution_id uuid,
  p_exam_profile text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_encrypted_password text;
begin
  -- Check if email already exists in auth.users
  select id into v_user_id from auth.users where email = p_email;
  if v_user_id is not null then
    raise exception 'Bu e-posta adresiyle zaten bir kullanıcı kayıtlı!';
  end if;

  v_user_id := uuid_generate_v4();
  v_encrypted_password := crypt(p_password, gen_salt('bf', 10));

  -- Insert into auth.users
  insert into auth.users (
    instance_id,
    id,
    role,
    aud,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    v_encrypted_password,
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('full_name', p_full_name, 'role', p_role),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into public.users
  insert into public.users (
    id,
    full_name,
    username,
    password_hash,
    role,
    email,
    color,
    target,
    progress,
    week_start,
    coach_id,
    institution_id,
    exam_profile
  ) values (
    v_user_id,
    p_full_name,
    p_username,
    'supabase_managed',
    p_role,
    p_email,
    p_color,
    p_target,
    p_progress,
    p_week_start,
    p_coach_id,
    p_institution_id,
    p_exam_profile
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    username = excluded.username,
    password_hash = 'supabase_managed',
    role = excluded.role,
    email = excluded.email,
    color = excluded.color,
    target = excluded.target,
    progress = excluded.progress,
    week_start = excluded.week_start,
    coach_id = excluded.coach_id,
    institution_id = excluded.institution_id,
    exam_profile = excluded.exam_profile;

  return v_user_id;
end;
$$;

create or replace function public.update_auth_user_password(
  p_user_id uuid,
  p_new_password text
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_encrypted_password text;
begin
  v_encrypted_password := crypt(p_new_password, gen_salt('bf', 10));
  
  update auth.users
  set encrypted_password = v_encrypted_password,
      updated_at = now()
  where id = p_user_id;
  
  update public.users
  set password_hash = 'supabase_managed'
  where id = p_user_id;
  
  return found;
end;
$$;

-- ----------------------------------------------------------------------------
-- 18. ONE-TIME MIGRATION TO SUPABASE AUTH & PASSWORD ENCRYPTION
-- ----------------------------------------------------------------------------
do $$
declare
  r record;
  v_user_id uuid;
  v_encrypted_password text;
begin
  -- Assign email to any user who doesn't have one
  update public.users 
  set email = username || '@rostrumakademi.com' 
  where email is null or email = '';

  for r in 
    select id, full_name, username, password_hash, role, email 
    from public.users
    where password_hash <> 'supabase_managed'
  loop
    -- Check if user exists in auth.users by email
    select id into v_user_id from auth.users where email = r.email;
    
    if v_user_id is null then
      -- Encrypt password
      v_encrypted_password := crypt(r.password_hash, gen_salt('bf', 10));
      
      -- Insert into auth.users using same id and email
      insert into auth.users (
        instance_id,
        id,
        role,
        aud,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
      ) values (
        '00000000-0000-0000-0000-000000000000',
        r.id,
        'authenticated',
        'authenticated',
        r.email,
        v_encrypted_password,
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('full_name', r.full_name, 'role', r.role),
        now(),
        now(),
        '',
        '',
        '',
        ''
      );
    end if;
    
    -- Update the public.users record
    update public.users 
    set password_hash = 'supabase_managed'
    where id = r.id;
  end loop;
end;
$$;


-- ----------------------------------------------------------------------------
-- 14. KONU HAFTA SORU TABLE (For Weekly Subject Question Targets)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.konu_hafta_soru (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  subject text NOT NULL,
  konu text NOT NULL,
  hafta integer NOT NULL CHECK (hafta BETWEEN 1 AND 40),
  sayi integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, konu, hafta)
);
ALTER TABLE public.konu_hafta_soru ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- 15. KONU MASTERY TABLE (7-Star Hakimiyet Sistemi)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.konu_mastery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  subject text NOT NULL,
  konu text NOT NULL,
  stars integer NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 7),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','active','td')),
  ka_date timestamptz,
  td_date timestamptz,
  last_review_date timestamptz,
  review_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, konu)
);
ALTER TABLE public.konu_mastery ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 16. KONU TEKRAR LOG TABLE (10-Günlük Periyot Takibi)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.konu_tekrar_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  subject text NOT NULL,
  konu text NOT NULL,
  period_start date NOT NULL,
  review_count integer DEFAULT 0 CHECK (review_count BETWEEN 0 AND 6),
  notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, konu, period_start)
);
ALTER TABLE public.konu_tekrar_log ENABLE ROW LEVEL SECURITY;
