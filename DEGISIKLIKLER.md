# 🛠️ ROSTRUM AKADEMİ — YAPILAN DÜZELTMELER (v15)

Tarih: 5 Temmuz 2026

---

## ✅ 1. GÜVENLİK DÜZELTMELERİ

### API dosyaları artık env değişkeni kullanıyor
Şu dosyalarda hardcoded Supabase anahtarları `process.env`'e taşındı
(geçiş kırılmasın diye fallback bırakıldı — Vercel'de env set edince fallback devre dışı kalır):

- `api/publish-instagram.js`
- `api/instagram-webhook.js`
- `api/ai-chat.js`
- `api/send-email.js`
- `api/generate-pdf-report.js`

### Webhook verify token env'e taşındı
`IG_WEBHOOK_VERIFY_TOKEN` env değişkeni eklendi (fallback: eski değer).

### RLS güvenlik açığı kapatıldı (migration_v15.sql)
`payments` ve `subscriptions` tablolarındaki **"Anyone can insert"** politikaları
kaldırıldı. Bu politikalar anonim kullanıcıların bile ödeme kaydı eklemesine
izin veriyordu. Artık sadece giriş yapmış kullanıcı kendi adına, developer
herkes adına ekleyebilir.

### .gitignore güçlendirildi
Tüm `.env*` dosyaları ve debug scriptleri ignore listesinde.

> ⚠️ **YAPMAN GEREKEN**: `.env.local` içindeki Vercel OIDC token git geçmişinde
> olabilir. Supabase Dashboard → Settings → API'den **anon key'i döndürmeni**
> (rotate) öneririm. Anon key frontend'de public olmak zorunda (Supabase tasarımı
> böyle) — asıl koruma RLS'tir, o yüzden migration_v15 kritik.

---

## ✅ 2. INSTAGRAM 401/500 BUG DÜZELTMELERİ

### Token doğrulama eklendi (`api/publish-instagram.js`)
Artık her yayın öncesi Graph API'ye hızlı bir doğrulama isteği atılıyor:
- Token süresi dolmuşsa (Meta error code 190) → **net 401 + Türkçe mesaj**:
  *"Instagram access token süresi dolmuş. Bağlantı Ayarları'ndan yeni uzun ömürlü token girin."*
- Diğer token hataları da kod numarasıyla raporlanıyor.

### 401 / 500 ayrımı yapıldı
Eskiden her hata 500 dönüyordu. Artık:
- Yetkilendirme hataları → **401** + `tokenError: true` alanı
- Gerçek sunucu hataları → **500**

### Admin panel UI güncellendi (`site_admin.html`)
Token hatası geldiğinde panel artık:
- 🔑 emojili net uyarı gösteriyor ("token süresi dolmuş...")
- Postu `failed` statüsüne çekip `error_message` alanına hatayı yazıyor
- Böylece hangi postun neden yayınlanamadığı takip edilebiliyor

---

## ✅ 3. MANUEL ÖDEME TAKİBİ (migration_v15.sql)

Lansmanda ödemeler manuel alınacağı için `payments` tablosuna eklenen alanlar:

| Alan | Açıklama |
|------|----------|
| `method` | havale / eft / nakit / manual / lemonsqueezy / iyzico |
| `note` | Dekont no, açıklama vs. |
| `recorded_by` | Ödemeyi kaydeden kullanıcı (sen) |
| `verified` | Doğrulandı mı (boolean) |

Ayrıca `instagram_posts` tablosu garanti altına alındı (yoksa oluşturuluyor,
`error_message` ve `published_at` alanları dahil) ve performans indexleri eklendi.

---

## ✅ 4. TEMİZLİK

- Root'taki **30 adet** debug/test scripti (`__test_*.cjs`, `__debug_*.js`,
  `_update_ig.mjs` vs.) → `scratch/_arsiv_debug/` klasörüne taşındı.
  Root artık çok daha temiz. Silmedim; lazım olursa oradalar.
- Dev paneli: **dokunulmadı** — tek dev sensin ve her şeyi görmek istediğini
  söyledin, o yüzden hiçbir özellik kaldırılmadı.

---

## 📋 KURULUM ADIMLARI (SIRAYLA)

### 1. Vercel Environment Variables ekle
Vercel Dashboard → butik-akademi → Settings → Environment Variables:

```
SUPABASE_URL              = https://imyhenrwmsmyikpollur.supabase.co
SUPABASE_ANON_KEY         = (Supabase Dashboard → Settings → API → anon key)
SUPABASE_SERVICE_ROLE_KEY = (zaten ekliymiş — kontrol et)
IG_WEBHOOK_VERIFY_TOKEN   = rostrum_webhook_verify_token_2026  (veya yenisini üret)
```

### 2. Migration'ı çalıştır
Supabase Dashboard → SQL Editor → `migration_v15.sql` içeriğini yapıştır → Run.

### 3. Deploy et
```bash
git add -A
git commit -m "fix: env vars, IG token validation, payments RLS, cleanup (v15)"
git push
```

### 4. Instagram token'ı test et
Admin panel → Yapay Zeka & Pazarlama → bir story'yi yayınlamayı dene.
- Token geçersizse artık net "🔑 token süresi dolmuş" mesajı göreceksin.
- Token yenilemek için: Meta for Developers → Graph API Explorer →
  uzun ömürlü token üret (60 gün geçerli) → Bağlantı Ayarları'na yapıştır.

### 5. (Önerilen) Anon key rotate
Supabase → Settings → API → "Generate new anon key" → yeni anahtarı:
- Vercel env'e (`SUPABASE_ANON_KEY`)
- `config.js` ve `src/config.js` dosyalarına (frontend)
yapıştır → tekrar deploy.

---

## 🔜 SONRAKİ ADIMLAR (BU PAKETTE YOK, PLANLI)

1. **ui.js modülarizasyonu** (492KB → parçalı lazy-load) — ayrı bir oturum ister
2. **Supabase sürüm eşitleme** (root 2.39 → 2.108)
3. **Admin panele manuel ödeme kayıt UI'ı** (migration hazır, ekran eklenebilir)
4. **LemonSqueezy** — ilk gelir sonrası, sen hazır olunca
