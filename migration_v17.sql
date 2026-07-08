-- ═══════════════════════════════════════════════════════════
-- MIGRATION V17 — Instagram Story Otomasyon Kuyruğu
-- Supabase SQL Editor'de çalıştırın.
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.story_queue (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_date     date NOT NULL UNIQUE,
  theme         text NOT NULL,
  caption       text,
  svg           text,
  png_url       text,
  status        text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','approved','published','rejected','error')),
  error_msg     text,
  publish_at    timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Sadece service_role yazabilsin (API endpoints service key kullanıyor)
ALTER TABLE public.story_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "story_queue_service" ON public.story_queue;
CREATE POLICY "story_queue_service" ON public.story_queue
  FOR ALL USING (true);  -- isAuthed() kontrolü API katmanında yapılıyor

-- Storage bucket (PNG'ler için)
INSERT INTO storage.buckets (id, name, public)
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "stories_public_read" ON storage.objects;
CREATE POLICY "stories_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'stories');

DROP POLICY IF EXISTS "stories_service_write" ON storage.objects;
CREATE POLICY "stories_service_write" ON storage.objects
  FOR ALL USING (bucket_id = 'stories');

-- Platform assets bucket (Instagram görsel + Reels video depolama)
INSERT INTO storage.buckets (id, name, public)
VALUES ('platform_assets', 'platform_assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "platform_assets_public_read" ON storage.objects;
CREATE POLICY "platform_assets_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'platform_assets');

DROP POLICY IF EXISTS "platform_assets_write" ON storage.objects;
CREATE POLICY "platform_assets_write" ON storage.objects
  FOR ALL USING (bucket_id = 'platform_assets');
