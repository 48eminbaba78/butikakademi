-- ═══════════════════════════════════════════════════════════
-- ROSTRUM AKADEMİ — V9 MİGRASYON
-- Row Level Security (RLS) Güvenlik Sıkılaştırması
-- ═══════════════════════════════════════════════════════════

-- 1. Tüm ana tablolarda RLS'i zorunlu olarak aktif hale getirme
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces FORCE ROW LEVEL SECURITY;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks FORCE ROW LEVEL SECURITY;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams FORCE ROW LEVEL SECURITY;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;

ALTER TABLE public.coach_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_todos FORCE ROW LEVEL SECURITY;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_requests FORCE ROW LEVEL SECURITY;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings FORCE ROW LEVEL SECURITY;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements FORCE ROW LEVEL SECURITY;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets FORCE ROW LEVEL SECURITY;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts FORCE ROW LEVEL SECURITY;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content FORCE ROW LEVEL SECURITY;

ALTER TABLE public.student_speeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_speeds FORCE ROW LEVEL SECURITY;

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts FORCE ROW LEVEL SECURITY;

ALTER TABLE public.content_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_memory FORCE ROW LEVEL SECURITY;


-- 2. Açık RLS Politikalarını Sıkılaştırma (V7 ve V8'deki USING (true) politikaları)

-- Platform Settings (Sadece developer rolü yazabilir/güncelleyebilir)
DROP POLICY IF EXISTS "platform_settings_insert" ON public.platform_settings;
DROP POLICY IF EXISTS "platform_settings_update" ON public.platform_settings;
CREATE POLICY "platform_settings_insert" ON public.platform_settings 
  FOR INSERT WITH CHECK (auth.uid() in (select id from public.users where role = 'developer'));
CREATE POLICY "platform_settings_update" ON public.platform_settings 
  FOR UPDATE USING (auth.uid() in (select id from public.users where role = 'developer'));

-- Konu Hafta Soru (Herkes okuyabilir, sadece koç/developer düzenleyebilir)
DROP POLICY IF EXISTS "konu_hafta_soru_all" ON public.konu_hafta_soru;
CREATE POLICY "konu_hafta_soru_select" ON public.konu_hafta_soru 
  FOR SELECT USING (true);
CREATE POLICY "konu_hafta_soru_modify" ON public.konu_hafta_soru 
  FOR ALL USING (auth.uid() in (select id from public.users where role in ('coach', 'developer')));

-- Instagram Posts (Sadece koç ve developer okuyup düzenleyebilir)
DROP POLICY IF EXISTS "ig_posts_all" ON public.instagram_posts;
CREATE POLICY "ig_posts_select" ON public.instagram_posts 
  FOR SELECT USING (auth.uid() in (select id from public.users where role in ('coach', 'developer')));
CREATE POLICY "ig_posts_modify" ON public.instagram_posts 
  FOR ALL USING (auth.uid() in (select id from public.users where role in ('coach', 'developer')));

-- Content Memory (Sadece koç ve developer okuyup düzenleyebilir)
DROP POLICY IF EXISTS "content_memory_all" ON public.content_memory;
CREATE POLICY "content_memory_select" ON public.content_memory 
  FOR SELECT USING (auth.uid() in (select id from public.users where role in ('coach', 'developer')));
CREATE POLICY "content_memory_modify" ON public.content_memory 
  FOR ALL USING (auth.uid() in (select id from public.users where role in ('coach', 'developer')));

ANALYZE;
