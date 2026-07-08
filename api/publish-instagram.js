// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — INSTAGRAM PUBLISH API
// Tek görsel (isStory), çoklu slayt carousel (isCarousel) destekler.
// Görseller tarayıcıda üretilip base64 olarak gönderilir.
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = process.env.SUPABASE_URL || 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);


// ── Token geçerlilik kontrolü: yayın öncesi hızlı test ──
async function validateToken(accountId, accessToken) {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/${accountId}?fields=id,username&access_token=${accessToken}`
  );
  const data = await res.json();
  if (data.error) {
    const code = data.error.code;
    if (code === 190) {
      throw new Error('TOKEN_EXPIRED: Instagram access token süresi dolmuş. Admin paneli → Yapay Zeka & Pazarlama → Bağlantı Ayarları bölümünden yeni uzun ömürlü token girin.');
    }
    throw new Error(`TOKEN_INVALID [${code}]: ${data.error.message}`);
  }
  return data.username;
}

async function uploadImage(base64, fileName) {
  const buffer = Buffer.from(base64, 'base64');
  const { error } = await db.storage
    .from('platform_assets')
    .upload(`instagram_posts/${fileName}`, buffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true
    });
  if (error) throw new Error('Storage yüklemesi başarısız: ' + error.message);
  const { data: { publicUrl } } = db.storage
    .from('platform_assets')
    .getPublicUrl(`instagram_posts/${fileName}`);
  return publicUrl;
}

async function createMediaContainer(accountId, accessToken, params) {
  const res = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, access_token: accessToken })
  });
  const data = await res.json();
  if (data.error) {
    console.error('[Meta] Container error full:', JSON.stringify(data.error));
    throw new Error(`Meta Container Hatası [${data.error.code}/${data.error.error_subcode||''}]: ${data.error.message}`);
  }
  return data.id;
}

async function waitForContainer(containerId, accessToken, maxAttempts = 12) {
  let statusCode = 'IN_PROGRESS';
  let attempts = 0;
  while (statusCode === 'IN_PROGRESS' && attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();
    statusCode = data.status_code || 'ERROR';
    attempts++;
    console.log(`[API] Container ${containerId} status (${attempts}): ${statusCode}`);
  }
  if (statusCode !== 'FINISHED') {
    throw new Error(`Container hazırlanamadı. Durum: ${statusCode}`);
  }
}

async function publishContainer(accountId, accessToken, creationId) {
  const res = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: creationId, access_token: accessToken })
  });
  const data = await res.json();
  if (data.error) throw new Error('Meta Publish Hatası: ' + data.error.message);
  return data.id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { caption, imageBase64, isStory, slides, isCarousel, isReels, videoUrl } = req.body;

  if (!imageBase64 && !videoUrl && (!slides || slides.length === 0)) {
    return res.status(400).json({ message: 'imageBase64, videoUrl veya slides parametresi eksik.' });
  }

  try {
    // 1. Credentials
    const { data: credData, error: credError } = await db
      .from('platform_settings')
      .select('value')
      .eq('key', 'instagram_credentials')
      .maybeSingle();

    if (credError) return res.status(500).json({ message: 'Kimlik bilgileri okunamadı: ' + credError.message });

    const creds = credData?.value;
    if (!creds?.instagram_account_id || !creds?.instagram_access_token) {
      return res.status(400).json({
        message: 'Instagram kimlik bilgileri eksik. Admin paneli → Yapay Zeka & Pazarlama → Bağlantı Ayarları bölümünden girin.'
      });
    }

    const accountId = creds.instagram_account_id;
    const accessToken = creds.instagram_access_token;
    const ts = Date.now();

    // Yayın öncesi token'ı doğrula — süresi dolmuşsa net hata dön
    try {
      const igUsername = await validateToken(accountId, accessToken);
      console.log('[API] Token geçerli, hesap: @' + igUsername);
    } catch (tokenErr) {
      console.error('[API] Token doğrulama hatası:', tokenErr.message);
      return res.status(401).json({ message: tokenErr.message, tokenError: true });
    }

    // ── REELS (video URL) ──
    if (isReels) {
      if (!videoUrl) return res.status(400).json({ message: 'videoUrl gerekli' });
      console.log('[API] Reels başlatılıyor, video URL:', videoUrl);
      const containerId = await createMediaContainer(accountId, accessToken, {
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption || '',
        share_to_feed: true,
      });
      console.log('[API] Reels container:', containerId, '— işleniyor...');
      await waitForContainer(containerId, accessToken, 30);
      const publishedId = await publishContainer(accountId, accessToken, containerId);
      console.log('[API] Reels yayınlandı! ID:', publishedId);
      return res.status(200).json({ success: true, id: publishedId });
    }

    // ── HIKAYE (tek görsel) ──
    if (isStory) {
      const imageUrl = await uploadImage(imageBase64, `story-${ts}.jpg`);
      console.log('[API] Hikaye URL:', imageUrl);
      const containerId = await createMediaContainer(accountId, accessToken, {
        image_url: imageUrl, media_type: 'STORIES'
      });
      await waitForContainer(containerId, accessToken);
      const publishedId = await publishContainer(accountId, accessToken, containerId);
      console.log('[API] Hikaye yayınlandı! ID:', publishedId);
      return res.status(200).json({ success: true, id: publishedId, imageUrl });
    }

    // ── CAROUSEL (5 slayt) ──
    if (isCarousel && slides && slides.length > 0) {
      console.log(`[API] Carousel başlatılıyor: ${slides.length} slayt`);

      // Her slaytı yükle ve child container oluştur (child'lar için bekleme yok)
      const childIds = [];
      for (let i = 0; i < slides.length; i++) {
        const imageUrl = await uploadImage(slides[i], `carousel-${ts}-slide${i+1}.jpg`);
        console.log(`[API] Slayt ${i+1} URL:`, imageUrl);
        const childId = await createMediaContainer(accountId, accessToken, {
          image_url: imageUrl,
          is_carousel_item: true
        });
        childIds.push(childId);
        console.log(`[API] Slayt ${i+1} child container: ${childId}`);
      }

      // Carousel container oluştur
      const carouselId = await createMediaContainer(accountId, accessToken, {
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption: caption || ''
      });
      console.log('[API] Carousel container ID:', carouselId);
      await waitForContainer(carouselId, accessToken, 15);

      // Yayınla
      const publishedId = await publishContainer(accountId, accessToken, carouselId);
      console.log('[API] Carousel yayınlandı! ID:', publishedId);
      return res.status(200).json({ success: true, id: publishedId, slideCount: slides.length });
    }

    // ── TEK GÖRSEL POST ──
    const imageUrl = await uploadImage(imageBase64, `post-${ts}.jpg`);
    console.log('[API] Post URL:', imageUrl);
    const containerId = await createMediaContainer(accountId, accessToken, {
      image_url: imageUrl,
      caption: caption || ''
    });
    await waitForContainer(containerId, accessToken);
    const publishedId = await publishContainer(accountId, accessToken, containerId);
    console.log('[API] Post yayınlandı! ID:', publishedId);
    return res.status(200).json({ success: true, id: publishedId, imageUrl });

  } catch (err) {
    console.error('[API] Publish Instagram error:', err);
    const isAuthError = /190|TOKEN_|OAuth|access token/i.test(err.message);
    return res.status(isAuthError ? 401 : 500).json({
      message: isAuthError
        ? 'Instagram yetkilendirme hatası: ' + err.message
        : 'Sunucu hatası: ' + err.message,
      tokenError: isAuthError
    });
  }
}
