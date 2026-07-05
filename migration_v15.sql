-- ═══════════════════════════════════════════════════════════
-- MIGRATION V15 — GÜVENLİK: ÖDEME RLS SIKILAŞTIRMA + MANUEL ÖDEME ALANLARI
-- Supabase SQL Editor'de çalıştırın.
-- ═══════════════════════════════════════════════════════════

-- ── 1. GÜVENLİK AÇIĞI KAPAT: "Anyone can insert" politikaları kaldır ──
-- Önceki politikalar herkesin (anonim dahil) ödeme/abonelik kaydı
-- eklemesine izin veriyordu. Artık sadece giriş yapmış kullanıcılar
-- kendi adına, developer ise herkes adına ekleyebilir.

drop policy if exists "Anyone can insert payments" on public.payments;
create policy "Authenticated users can insert own payments"
  on public.payments for insert
  with check (
    auth.uid() is not null
    and (
      user_id = auth.uid()
      or student_id = auth.uid()
      or auth.uid() in (select id from public.users where role = 'developer')
    )
  );

drop policy if exists "Anyone can insert subscriptions" on public.subscriptions;
create policy "Authenticated users can insert own subscriptions"
  on public.subscriptions for insert
  with check (
    auth.uid() is not null
    and (
      user_id = auth.uid()
      or student_id = auth.uid()
      or auth.uid() in (select id from public.users where role = 'developer')
    )
  );

-- ── 2. MANUEL ÖDEME TAKİBİ İÇİN EK ALANLAR ──
-- Lansman öncesi ödemeler manuel alınacağı için (havale/EFT/elden),
-- ödemenin nasıl alındığını ve kimin kaydettiğini izlemek gerekiyor.

alter table public.payments
  add column if not exists method varchar(30) default 'manual'
    check (method in ('manual', 'havale', 'eft', 'nakit', 'lemonsqueezy', 'iyzico', 'other')),
  add column if not exists note text,
  add column if not exists recorded_by uuid references public.users(id),
  add column if not exists verified boolean default false;

comment on column public.payments.method is 'Ödeme yöntemi: manual/havale/eft/nakit/lemonsqueezy/iyzico/other';
comment on column public.payments.note is 'Manuel ödeme notu (dekont no, açıklama vs.)';
comment on column public.payments.recorded_by is 'Ödemeyi kaydeden kullanıcı (genelde developer)';
comment on column public.payments.verified is 'Developer tarafından doğrulandı mı';

-- ── 3. INSTAGRAM POSTS TABLOSU GARANTİSİ ──
-- site_admin.html instagram_posts tablosunu kullanıyor;
-- eksikse oluştur (idempotent).

create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  type varchar(20) default 'story' check (type in ('story', 'post', 'carousel')),
  status varchar(20) default 'draft' check (status in ('draft', 'pending', 'approved', 'published', 'failed')),
  caption text,
  image_url text,
  slides jsonb,
  theme varchar(50),
  published_ig_id text,
  error_message text,
  created_at timestamptz default now(),
  published_at timestamptz
);

alter table public.instagram_posts enable row level security;

drop policy if exists "Developers manage instagram posts" on public.instagram_posts;
create policy "Developers manage instagram posts"
  on public.instagram_posts for all
  using (auth.uid() in (select id from public.users where role = 'developer'));

-- ── 4. PERFORMANS: sık kullanılan sorgular için index ──
create index if not exists idx_instagram_posts_status on public.instagram_posts(status);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_date on public.payments(payment_date desc);
