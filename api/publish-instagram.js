// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — INSTAGRAM RENDER & PUBLISH SERVERLESS API
// Endpoint: /api/publish-instagram
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { Resvg } from '@resvg/resvg-js';

const SB_URL = 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34';
const db = createClient(SB_URL, SB_KEY);

function getPostSvg(type, daysLeft, quote, author, title) {
  const words = quote.split(' ');
  let lines = [];
  let currentLine = '';
  words.forEach(w => {
    if ((currentLine + ' ' + w).length > 25) { lines.push(currentLine); currentLine = w; }
    else { currentLine = currentLine ? currentLine + ' ' + w : w; }
  });
  if (currentLine) lines.push(currentLine);
  lines = lines.slice(0, 3);
  const textElements = lines.map((line, idx) => 
    `<text x="250" y="${220 + (idx * 30)}" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.3">${line}</text>`
  ).join('\n');

  if(type === 'countdown') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <rect width="500" height="500" fill="#07060a"/>
      <defs>
        <radialGradient id="mesh1" cx="20%" cy="20%" r="60%"><stop offset="0%" stop-color="#f0a500" stop-opacity="0.1"/><stop offset="100%" stop-color="#07060a" stop-opacity="0"/></radialGradient>
        <radialGradient id="mesh2" cx="80%" cy="80%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.08"/><stop offset="100%" stop-color="#07060a" stop-opacity="0"/></radialGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f0a500"/><stop offset="100%" stop-color="#c084fc"/></linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#mesh1)"/>
      <rect width="500" height="500" fill="url(#mesh2)"/>
      <path d="M 0,90 L 500,90 M 0,410 L 500,410 M 90,0 L 90,500 M 410,0 L 410,500" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1"/>
      <text x="250" y="60" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="3">ROSTRUM AKADEMİ</text>
      <circle cx="250" cy="72" r="2" fill="#f0a500"/>
      <g transform="translate(250, 140)">
        <circle cx="0" cy="0" r="45" fill="none" stroke="#2d2a3a" stroke-width="2"/>
        <circle cx="0" cy="0" r="45" fill="none" stroke="url(#textGrad)" stroke-width="4" stroke-dasharray="280" stroke-dashoffset="70"/>
        <text x="0" y="6" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="30" font-weight="900">${daysLeft}</text>
        <text x="0" y="20" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="6" font-weight="700" letter-spacing="1">GÜN KALDI</text>
      </g>
      <g>${textElements}
        <text x="250" y="${260 + (lines.length * 30)}" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="11" font-weight="500" font-style="italic">— ${author}</text>
      </g>
      <rect x="190" y="440" width="120" height="20" rx="10" fill="#17151e" stroke="#2d2a3a" stroke-width="0.5"/>
      <text x="250" y="454" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="7" font-weight="600" letter-spacing="0.5">rostrumakademi.app</text>
    </svg>`;
  } 
  
  if (type === 'tactic') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <rect width="500" height="500" fill="#07060a"/>
      <defs>
        <radialGradient id="mesh3" cx="50%" cy="20%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.12"/><stop offset="100%" stop-color="#07060a" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#mesh3)"/>
      <text x="250" y="50" text-anchor="middle" fill="#c084fc" font-family="system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="3">BRANŞ TAKTİKLERİ</text>
      <text x="250" y="85" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="22" font-weight="900" letter-spacing="-0.5">LİMİT &amp; SÜREKLİLİK</text>
      <text x="250" y="105" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="11">YKS Matematik Net Artıran 3 Kural</text>
      <g transform="translate(40, 130)">
        <rect width="420" height="70" rx="8" fill="#121018" stroke="#2d2a3a" stroke-width="1"/>
        <text x="20" y="40" fill="#f0a500" font-family="system-ui, sans-serif" font-size="24" font-weight="900">1</text>
        <text x="50" y="30" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Grafik Çizmeyi İhmal Etmeyin</text>
        <text x="50" y="48" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Limit sorularında sağdan/soldan yaklaşmayı grafik üzerinden görün.</text>
      </g>
      <g transform="translate(40, 215)">
        <rect width="420" height="70" rx="8" fill="#121018" stroke="#2d2a3a" stroke-width="1"/>
        <text x="20" y="40" fill="#f0a500" font-family="system-ui, sans-serif" font-size="24" font-weight="900">2</text>
        <text x="50" y="30" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Sağdan &amp; Soldan Eşitlik Kuralı</text>
        <text x="50" y="48" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Limit olması için sağ ve sol limitlerin eşit olması zorunludur.</text>
      </g>
      <g transform="translate(40, 300)">
        <rect width="420" height="70" rx="8" fill="#121018" stroke="#2d2a3a" stroke-width="1"/>
        <text x="20" y="40" fill="#f0a500" font-family="system-ui, sans-serif" font-size="24" font-weight="900">3</text>
        <text x="50" y="30" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="13" font-weight="700">Süreklilik Bağlantısı</text>
        <text x="50" y="48" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Süreklilik için o noktada limit olması ve değere eşit olması gerekir.</text>
      </g>
      <text x="250" y="420" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Rostrum Akademi YouTube Entegrasyonu ile Hemen Programla!</text>
      <rect x="190" y="445" width="120" height="20" rx="10" fill="#17151e" stroke="#2d2a3a" stroke-width="0.5"/>
      <text x="250" y="459" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="7" font-weight="600" letter-spacing="0.5">rostrumakademi.app</text>
    </svg>`;
  }

  if (type === 'comparison') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <rect width="500" height="500" fill="#07060a"/>
      <text x="250" y="50" text-anchor="middle" fill="#f0a500" font-family="system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="3">BÜYÜK KARŞILAŞTIRMA</text>
      <text x="250" y="85" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">Kağıt Programlar vs Rostrum Akademi</text>
      <g transform="translate(30, 120)">
        <rect width="200" height="280" rx="12" fill="#151214" stroke="#4a1a1f" stroke-width="1.5"/>
        <text x="100" y="40" text-anchor="middle" fill="#ff5c7a" font-family="system-ui, sans-serif" font-size="16" font-weight="800">❌ KAĞIT PROGRAM</text>
        <circle cx="100" cy="90" r="30" fill="#ff5c7a" fill-opacity="0.1"/>
        <text x="100" y="96" text-anchor="middle" fill="#ff5c7a" font-family="system-ui, sans-serif" font-size="22" font-weight="900">📝</text>
        <g fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">
          <text x="100" y="160">• Çabuk kaybolur &amp; yırtılır</text>
          <text x="100" y="185">• Süre hesabı manuel yapılır</text>
          <text x="100" y="210">• Veliye raporlanamaz</text>
          <text x="100" y="235">• Sürekli zaman kaybettirir</text>
        </g>
      </g>
      <g transform="translate(270, 120)">
        <rect width="200" height="280" rx="12" fill="#101815" stroke="#1f4a38" stroke-width="1.5"/>
        <text x="100" y="40" text-anchor="middle" fill="#3ecf8e" font-family="system-ui, sans-serif" font-size="16" font-weight="800">✅ DİJİTAL PDF</text>
        <circle cx="100" cy="90" r="30" fill="#3ecf8e" fill-opacity="0.1"/>
        <text x="100" y="96" text-anchor="middle" fill="#3ecf8e" font-family="system-ui, sans-serif" font-size="22" font-weight="900">📱</text>
        <g fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle">
          <text x="100" y="160">• Kaybolmaz, cepte taşınır</text>
          <text x="100" y="185">• Akıllı süre tahmini yapar</text>
          <text x="100" y="210">• Veliye otomatik grafik iletir</text>
          <text x="100" y="235">• Koça haftada 4 saat kazandırır</text>
        </g>
      </g>
      <text x="250" y="435" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Koçluğunuzu Dijitalleştirin, Zaman Kazanın!</text>
      <rect x="190" y="450" width="120" height="20" rx="10" fill="#17151e" stroke="#2d2a3a" stroke-width="0.5"/>
      <text x="250" y="464" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="7" font-weight="600" letter-spacing="0.5">rostrumakademi.app</text>
    </svg>`;
  }

  if (type === 'seasonal') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <rect width="500" height="500" fill="#07060a"/>
      <defs>
        <radialGradient id="meshSummer" cx="80%" cy="20%" r="60%"><stop offset="0%" stop-color="#ff8c00" stop-opacity="0.15"/><stop offset="100%" stop-color="#07060a" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#meshSummer)"/>
      <text x="250" y="50" text-anchor="middle" fill="#ff8c00" font-family="system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="3">YAZ KAMPINDAYIZ ☀️</text>
      <text x="250" y="85" text-anchor="middle" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="20" font-weight="900">Sıcakta Odaklanma Rehberi</text>
      <g transform="translate(250, 150)" stroke="#ff8c00" stroke-width="1.5" fill="none">
        <circle cx="0" cy="0" r="15"/>
        <line x1="0" y1="-20" x2="0" y2="-28"/>
        <line x1="0" y1="20" x2="0" y2="28"/>
        <line x1="-20" y1="0" x2="-28" y2="0"/>
        <line x1="20" y1="0" x2="28" y2="0"/>
        <line x1="-14" y1="-14" x2="-20" y2="-20"/>
        <line x1="14" y1="14" x2="20" y2="20"/>
        <line x1="-14" y1="14" x2="-20" y2="20"/>
        <line x1="14" y1="-14" x2="20" y2="-20"/>
      </g>
      <g transform="translate(50, 220)" fill="#f0eaf8" font-family="system-ui, sans-serif" font-size="12">
        <circle cx="20" cy="15" r="8" fill="#ff8c00" stroke="none"/>
        <text x="20" y="19" text-anchor="middle" fill="#000" font-size="10" font-weight="900">1</text>
        <text x="40" y="18" font-weight="700">Sabah Erken Çalışın (06:00 - 09:00)</text>
        <text x="40" y="34" fill="#a09ab8" font-size="10">Günün en serin saatlerinde odaklanma gücünüzü 2 katına çıkarın.</text>
        <circle cx="20" cy="75" r="8" fill="#ff8c00" stroke="none"/>
        <text x="20" y="79" text-anchor="middle" fill="#000" font-size="10" font-weight="900">2</text>
        <text x="40" y="78" font-weight="700">Masanızı ve Zihninizi Sadeleştirin</text>
        <text x="40" y="94" fill="#a09ab8" font-size="10">Sadece çalışacağınız dersin kaynağı ve serin suyunuz masada kalsın.</text>
        <circle cx="20" cy="135" r="8" fill="#ff8c00" stroke="none"/>
        <text x="20" y="139" text-anchor="middle" fill="#000" font-size="10" font-weight="900">3</text>
        <text x="40" y="138" font-weight="700">Pomodoro Metodu ile Beyni Dinlendirin</text>
        <text x="40" y="154" fill="#a09ab8" font-size="10">25 dakika çalışıp 5 dakika serin molalar vererek zihni zinde tutun.</text>
      </g>
      <text x="250" y="425" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="10">Hayallerine giden yolda yaz kampını Rostrum Akademi ile yönet! 🚀</text>
      <rect x="190" y="445" width="120" height="20" rx="10" fill="#17151e" stroke="#2d2a3a" stroke-width="0.5"/>
      <text x="250" y="459" text-anchor="middle" fill="#a09ab8" font-family="system-ui, sans-serif" font-size="7" font-weight="600" letter-spacing="0.5">rostrumakademi.app</text>
    </svg>`;
  }

  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { draftId, caption, type, daysLeft, quote, author, title } = req.body;

  if (!draftId || !type) {
    return res.status(400).json({ message: 'draftId and type are required' });
  }

  try {
    // 1. Credentials'ı Supabase'den oku (admin panelinden kaydedilen)
    const { data: credData, error: credError } = await db
      .from('platform_settings')
      .select('value')
      .eq('key', 'instagram_credentials')
      .maybeSingle();

    if (credError) {
      return res.status(500).json({ message: 'Kimlik bilgileri okunamadı: ' + credError.message });
    }

    const creds = credData?.value;
    if (!creds?.instagram_account_id || !creds?.instagram_access_token) {
      return res.status(400).json({
        message: 'Instagram kimlik bilgileri eksik. Lütfen admin panelinde Yapay Zeka & Pazarlama → Bağlantı Ayarları bölümünden Account ID ve Access Token girin ve kaydedin.'
      });
    }

    const accountId = creds.instagram_account_id;
    const accessToken = creds.instagram_access_token;

    // 2. SVG → PNG render
    console.log('[API] SVG oluşturuluyor ve PNG\'ye dönüştürülüyor...');
    const svgContent = getPostSvg(type, daysLeft, quote, author, title);

    if (!svgContent) {
      return res.status(400).json({ message: 'SVG içeriği oluşturulamadı' });
    }

    const resvg = new Resvg(svgContent, { fitTo: { mode: 'width', value: 1080 } });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // 3. Supabase Storage'a yükle
    const fileName = `ig-post-${Date.now()}.png`;
    const { error: uploadError } = await db.storage
      .from('platform_assets')
      .upload(`instagram_posts/${fileName}`, pngBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return res.status(500).json({
        message: `Storage yüklemesi başarısız: ${uploadError.message}. Supabase Storage'da "platform_assets" adında public bir bucket oluşturduğunuzdan emin olun.`
      });
    }

    const { data: { publicUrl } } = db.storage
      .from('platform_assets')
      .getPublicUrl(`instagram_posts/${fileName}`);

    console.log('[API] PNG URL:', publicUrl);

    // 4. Instagram Graph API v20.0 ile yayınla
    // 4.1: Container oluştur
    const containerRes = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: publicUrl, caption, access_token: accessToken })
    });

    const containerData = await containerRes.json();
    if (containerData.error) {
      return res.status(400).json({ message: 'Meta Graph API Hatası (Container): ' + containerData.error.message });
    }

    const creationId = containerData.id;

    // 4.2: Container hazır olana kadar bekle (max 30 saniye)
    let statusCode = 'IN_PROGRESS';
    let attempts = 0;
    while (statusCode === 'IN_PROGRESS' && attempts < 10) {
      await new Promise(r => setTimeout(r, 3000));
      const statusRes = await fetch(
        `https://graph.facebook.com/v20.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      statusCode = statusData.status_code || 'ERROR';
      attempts++;
      console.log(`[API] Container status (${attempts}): ${statusCode}`);
    }

    if (statusCode !== 'FINISHED') {
      return res.status(400).json({ message: `Container hazırlanamadı. Son durum: ${statusCode}` });
    }

    // 4.3: Yayınla
    const publishRes = await fetch(`https://graph.facebook.com/v20.0/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken })
    });

    const publishData = await publishRes.json();
    if (publishData.error) {
      return res.status(400).json({ message: 'Meta Graph API Hatası (Publish): ' + publishData.error.message });
    }

    return res.status(200).json({ success: true, id: publishData.id, imageUrl: publicUrl });

  } catch (err) {
    console.error('Publish Instagram API error:', err);
    return res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
  }
}
