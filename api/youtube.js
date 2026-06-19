// ═══════════════════════════════════════════════════════════
// BUTIK AKADEMI — YOUTUBE PLAYLIST IMPORT PROXY (Vercel Serverless Function)
// Endpoint: /api/youtube
// YouTube API key sunucu tarafında güvenli kalır. UX'i iyileştirir.
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { playlistId, pageToken } = req.query;

    if (!playlistId) {
      return res.status(400).json({ error: 'playlistId parametresi zorunludur.' });
    }

    const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_KEY) {
      return res.status(500).json({ error: 'YouTube API anahtarı sunucu tarafında yapılandırılmamış.' });
    }

    // 1. Playlist elemanlarını çek (Maksimum 50 adet)
    let playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_KEY}`;
    if (pageToken) {
      playlistItemsUrl += `&pageToken=${pageToken}`;
    }

    const plRes = await fetch(playlistItemsUrl);
    if (!plRes.ok) {
      const plErr = await plRes.text();
      console.error('YouTube API Playlist error:', plErr);
      return res.status(502).json({ error: 'YouTube oynatma listesi alınamadı. Liste gizli olabilir veya ID hatalıdır.' });
    }

    const plData = await plRes.json();
    const items = plData.items || [];
    
    if (items.length === 0) {
      return res.status(200).json({ items: [], nextPageToken: null });
    }

    // Video ID'lerini topla
    const videoIds = items.map(item => item.snippet?.resourceId?.videoId).filter(Boolean).join(',');

    // 2. Videoların detaylarını (Süre - contentDetails) çek
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_KEY}`;
    const vidRes = await fetch(videoDetailsUrl);
    
    let durationMap = {};
    if (vidRes.ok) {
      const vidData = await vidRes.json();
      const vidItems = vidData.items || [];
      vidItems.forEach(v => {
        const id = v.id;
        const durationStr = v.contentDetails?.duration; // ISO 8601 Format: PT1H2M10S
        durationMap[id] = parseISO8601DurationToMinutes(durationStr);
      });
    } else {
      console.error('YouTube API Video Details error:', await vidRes.text());
    }

    // 3. Temiz veri seti oluştur
    const formattedItems = items.map(item => {
      const vid = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title || 'Bilinmeyen Video';
      return {
        title: title,
        url: `https://www.youtube.com/watch?v=${vid}`,
        duration: durationMap[vid] || 0
      };
    });

    return res.status(200).json({
      items: formattedItems,
      nextPageToken: plData.nextPageToken || null
    });

  } catch (err) {
    console.error('YouTube Proxy error:', err);
    return res.status(500).json({ error: 'Sunucu hatası: ' + (err.message || 'Bilinmeyen hata') });
  }
}

// ISO 8601 Süre formatını (Örn: PT1H30M15S) dakikaya çevirir
// Örn: PT1H2M10S, PT15M, PT2H vb.
function parseISO8601DurationToMinutes(durationStr) {
  if (!durationStr) return 0;
  
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  const seconds = parseInt(matches[3] || 0);

  // Toplam dakikayı hesapla, saniyeleri yuvarla
  const totalMinutes = (hours * 60) + minutes + Math.round(seconds / 60);
  return totalMinutes || 1; // En az 1 dakika olarak varsayalım
}
