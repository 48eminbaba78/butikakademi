-- ═══════════════════════════════════════════════════════════
-- ROSTRUM AKADEMİ — V7 MİGRASYON
-- Satış Takip Sütunları ve Instagram Otomasyon Ayarları
-- ═══════════════════════════════════════════════════════════

-- 1. leads tablosuna satış takip sütunları ekle
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pitch_text text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email_clicked boolean DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS instagram varchar(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS website varchar(255);

-- 2. platform_settings tablosu için RLS politikaları
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_settings_select" ON public.platform_settings;
DROP POLICY IF EXISTS "platform_settings_insert" ON public.platform_settings;
DROP POLICY IF EXISTS "platform_settings_update" ON public.platform_settings;

CREATE POLICY "platform_settings_select" ON public.platform_settings
  FOR SELECT USING (true);

CREATE POLICY "platform_settings_insert" ON public.platform_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "platform_settings_update" ON public.platform_settings
  FOR UPDATE USING (true);

-- 3. Instagram varsayılan ayarları
INSERT INTO public.platform_settings (key, value)
VALUES
  (
    'instagram_credentials',
    '{"instagram_access_token": "", "instagram_account_id": "", "facebook_page_id": ""}'::jsonb
  ),
  (
    'instagram_automation_rules',
    '[
      {
        "trigger": "ROSTRUM",
        "reply_comment": "DM kutunuzu kontrol edin! 📬",
        "send_dm": "Merhaba! Rostrum Akademi deneme sürümünüzü başlatmak için tıklayın: https://rostrumakademi.app?ref=instagram"
      },
      {
        "trigger": "DENEME",
        "reply_comment": "Harika! Deneme linkini DM olarak gönderdim. 🚀",
        "send_dm": "Selamlar! 14 günlük ücretsiz deneme paneline buradan ulaşabilirsiniz: https://rostrumakademi.app/setup.html"
      }
    ]'::jsonb
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. tasks tablosuna öğrenci sonuç alanı
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS student_result jsonb;

-- 5. exams tablosuna ders bazlı D/Y/B ve yanlış konu detayları
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS exam_details jsonb;

-- 6. Konu haritası: haftalık soru sayısı girişi
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
DROP POLICY IF EXISTS "konu_hafta_soru_all" ON public.konu_hafta_soru;
CREATE POLICY "konu_hafta_soru_all" ON public.konu_hafta_soru FOR ALL USING (true) WITH CHECK (true);
