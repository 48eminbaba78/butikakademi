-- ═══════════════════════════════════════════════════════════
-- BUTIK AKADEMİ — V7 MİGRASYON
-- Satış Takip Sütunları ve Instagram Otomasyon Ayarları
-- ═══════════════════════════════════════════════════════════

-- 1. Alter public.leads to add sales and tracking columns
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pitch_text text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email_clicked boolean DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS instagram varchar(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS website varchar(255);

-- 2. Insert default platform settings for Instagram connection and rules
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
ON CONFLICT (key) DO NOTHING;
