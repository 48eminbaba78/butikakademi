-- ═══════════════════════════════════════════════════════════
-- ROSTRUM AKADEMİ — V8 MİGRASYON
-- Instagram içerik yönetim tabloları
-- ═══════════════════════════════════════════════════════════

-- 1. instagram_posts tablosu
CREATE TABLE IF NOT EXISTS public.instagram_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  content_type text NOT NULL,            -- 'countdown' | 'tactic' | 'comparison' | 'seasonal'
  theme_category text NOT NULL,          -- 'pain_point' | 'feature' | 'insight' | 'social_proof'
  caption text,
  hashtags text,
  story_slides jsonb DEFAULT '[]'::jsonb, -- [{slide: 1, text: "..."}, ...]
  scheduled_at timestamptz,
  status text DEFAULT 'draft',           -- 'draft' | 'pending' | 'approved' | 'published'
  week_number int DEFAULT 1,             -- 1-4
  preview_data jsonb DEFAULT '{}'::jsonb -- SVG önizleme verisi
);

-- 2. content_memory tablosu
CREATE TABLE IF NOT EXISTS public.content_memory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  last_published_type text,
  last_published_theme text,
  monthly_social_proof_count int DEFAULT 0,
  current_week int DEFAULT 1,
  yks_days_remaining int DEFAULT 360
);

-- 3. RLS politikaları
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ig_posts_all" ON public.instagram_posts;
CREATE POLICY "ig_posts_all" ON public.instagram_posts USING (true) WITH CHECK (true);

ALTER TABLE public.content_memory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "content_memory_all" ON public.content_memory;
CREATE POLICY "content_memory_all" ON public.content_memory USING (true) WITH CHECK (true);

-- 4. Başlangıç verisi — content_memory
INSERT INTO public.content_memory (current_week, yks_days_remaining, monthly_social_proof_count)
VALUES (1, 360, 0)
ON CONFLICT DO NOTHING;

-- 5. Başlangıç taslakları — instagram_posts
INSERT INTO public.instagram_posts (content_type, theme_category, status, week_number, caption, hashtags, preview_data)
VALUES
  ('countdown', 'pain_point', 'draft', 1,
   'Haftada kaç saat programlarla uğraşıyorsunuz?

Çoğu koç bu soruya ''çok'' diyor — ama saymadıkça görmüyor. Öğrenci takibi, veli mesajları, ders planları… hepsi ayrı ayrı, hepsi yeniden.

Rostrum Akademi bu süreçleri tek panelde toplar. Koç haftalık planları dakikalar içinde kurar, öğrenci netlerini anlık görür, veliye tek tıkla rapor gönderir.

→ Erken erişim için bağlantı profilde.',
   '#ykskoçu #özelkoç #yks2027 #öğrencitakibi #koçlukplatformu #sınavkoçu',
   '{"type":"countdown","days_left":360,"quote":"İyi bir koç öğrencilerini yönetir, harika bir koç zamanını.","author":"Rostrum Akademi"}'::jsonb),

  ('tactic', 'feature', 'draft', 2,
   'Bir öğrencinizin Matematik neti 3 hafta üst üste düşse, ne zaman fark edersiniz?

Eğer cevabınız ''veliden haber alınca'' ise — bu post tam size.

Rostrum Akademi''de her deneme sonrası TYT/AYT netleri sisteme girilir, düşüş otomatik işaretlenir. Koç müdahale edecek vakti bulur, öğrenci sürüklenmez.

→ 14 günlük deneme için bağlantı profilde.',
   '#ykskoçu #özelkoç #yks2027 #tytpuanı #aytpuanı #sınavkoçu #ykshazırlık',
   '{"type":"tactic","days_left":359,"quote":"Öğrencinin neti düştüğünde, onu ilk gören koçtur.","author":"Rostrum Akademi","title":"NET ANALİZİ","subtitle":"Düşüşü Erken Gör, Erken Müdahale Et","points":[{"title":"Düşüş Tespiti","desc":"3 haftada düşen net otomatik işaretlenir."},{"title":"Konu Analizi","desc":"Hangi ünite sorun çıkarıyor, sistem gösterir."},{"title":"Hızlı Müdahale","desc":"Koç uyarıldığında öğrenci henüz sürüklenmemiştir."}]}'::jsonb),

  ('comparison', 'insight', 'draft', 3,
   'YKS 2027 iki ayrı sınav — ama çoğu koç programı tek bir boyutta düşünüyor.

TYT netini yukarı çekerken AYT konuları geride kalır. AYT''ye odaklanırken TYT körleşir. Bu denge, koçun en zor işi.

Rostrum Akademi''de TYT ve AYT takibi ayrı tutulur, haftalık program bu dengeye göre kurulur.

→ Erken erişim listesine katıl, bağlantı profilde.',
   '#ykskoçu #özelkoç #yks2027 #tytpuanı #aytpuanı #ykshazırlık #sınavkoçu',
   '{"type":"comparison","days_left":358,"quote":"TYT yüksek net AYT''yi taşımaz — ikisini birlikte yönetmek gerek.","author":"Rostrum Akademi","title":"TYT vs AYT DENGESİ","subtitle":"İki Sınavı Aynı Anda Götürmek"}'::jsonb),

  ('seasonal', 'social_proof', 'draft', 4,
   'Bir koç, öğrenci takibini kağıttan sisteme taşıdıktan sonra şunu söyledi: "Artık öğrencim nerede olduğunu görüyorum, ne yapacağımı biliyorum."

Bu cümle çok şey anlatıyor.

Koçluk bilgi meselesi değil — izleme ve müdahale meselesi. Sistemi olan koç, zamanında görür.

→ Erken erişim listesi için bağlantı profilde.',
   '#ykskoçu #özelkoç #yks2027 #koçlukplatformu #sınavkoçu #ykshazırlık',
   '{"type":"seasonal","days_left":357,"quote":"Sistemi olan koç, zamanında görür.","author":"Rostrum Akademi","title":"KOÇUN SESİ","subtitle":"Dijitale Geçenler Ne Söylüyor"}'::jsonb)
ON CONFLICT DO NOTHING;
