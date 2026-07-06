import { createClient } from '@supabase/supabase-js';
import { BRAND_BRAIN, THEME_ROTATION } from './brand.js';

export function sb() {
  const url = process.env.SUPABASE_URL || 'https://imyhenrwmsmyikpollur.supabase.co';
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function isAuthed(req) {
  var panelKey = (req.headers['x-panel-key'] || '').trim();
  var bearer = (req.headers['authorization'] || '').replace('Bearer ', '').trim();
  var cronKey = '';
  if (req.query && req.query.key) cronKey = req.query.key;
  var secret = (process.env.CRON_SECRET || '').trim();
  var pw = (process.env.PANEL_PASSWORD || '').trim();
  return (
    (panelKey && panelKey === pw) ||
    (secret && (cronKey === secret || bearer === secret))
  );
}

export function trNow() {
  return new Date(Date.now() + 3 * 3600 * 1000);
}
export function trDateStr(d) {
  return d.toISOString().slice(0, 10);
}
export function trToUtc(dateStr, hourTR) {
  return new Date(dateStr + 'T' + String(hourTR).padStart(2, '0') + ':00:00+03:00').toISOString();
}

var SVG_RULES = '\n## SVG HİKAYE GÖRSELİ KURALLARI (ÇOK ÖNEMLİ)\n- Boyut: viewBox="0 0 1080 1920" (Instagram hikaye, 9:16). width/height yazma, sadece viewBox.\n- Arka plan: koyu (#0d0d0f - #1a1a1e arası), degrade kullanabilirsin.\n- SADECE şu fontları kullan: font-family="Arial, sans-serif" (sunucuda başka font yok).\n- Harici görsel, harici font, <image href="http...">, <script> KESİNLİKLE YOK. Saf vektör.\n- Metinler BÜYÜK ve okunaklı olsun (başlık 70-110px, gövde 40-55px). Telefonda okunacak.\n- Türkçe karakterler (ç, ğ, ı, ö, ş, ü) doğru yazılsın.\n- Üstte veya altta "ROSTRUM AKADEMİ" logosu metin olarak (ROSTRUM normal, AKADEMİ bold, altın renk).\n- Ekranın üst %10 ve alt %15\'ine kritik metin koyma (Instagram arayüzü kapatır).\n- Marka renklerini kullan: altın #f0a500 (ana vurgu), mor #c084fc, yeşil #3ecf8e, mavi #60b4ff.\n- Kompozisyon: tek net mesaj, bol boşluk, 3-5 metin bloğunu geçme. Basit geometrik şekiller/çizgiler serbest.\n- Metin satırları SVG\'de otomatik sarmaz: uzun cümleleri kendin birden çok <text> elemanına böl, her satır max ~20 karakter (büyük punto) / ~35 karakter (küçük punto).\n';

function buildPrompt(dateStr, theme, recentSummaries, yksInfo, idea) {
  var ideaBlock = idea
    ? '\n\n## KURUCUNUN ÖZEL FİKRİ (ÖNCELİKLİ)\nBu story şu fikir üzerine kurulmalı, günün temasını bu fikirle harmanla:\n"' + idea + '"\n'
    : '';
  return 'Bugünün görevi: ' + dateStr + ' tarihinde Instagram\'da yayınlanacak Rostrum Akademi HİKAYE postunu üret.\n\nGünün içerik sütunu: ' + theme.name + '\n' + yksInfo + ideaBlock + '\n\nSon günlerde paylaşılan içerikler (BUNLARI TEKRARLAMA, farklı bir açı bul):\n' + (recentSummaries || '(henüz yok)') + '\n' + SVG_RULES + '\nÇIKTI FORMATI — SADECE geçerli JSON döndür, başka hiçbir şey yazma (markdown bloğu da yok):\n{\n  "theme": "' + theme.key + '",\n  "headline": "görseldeki ana mesajın 5-8 kelimelik özeti",\n  "caption": "hikayeye eşlik edecek kısa metin + CTA (link sticker\'a / DM\'e yönlendir), max 3 satır",\n  "svg": "<svg viewBox=\\"0 0 1080 1920\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"\n}';
}

export async function generateForDate(dateStr, opts) {
  opts = opts || {};
  var client = sb();

  var existing = await client.from('story_queue').select('id,status').eq('post_date', dateStr).maybeSingle();
  if (existing.data && !opts.force) {
    return { skipped: true, reason: 'Bu tarih icin zaten bir post var (' + existing.data.status + ').' };
  }

  var day = new Date(dateStr + 'T12:00:00Z').getUTCDay();
  var theme = THEME_ROTATION[day];

  var recent = await client
    .from('story_queue')
    .select('post_date,theme,caption')
    .order('post_date', { ascending: false })
    .limit(7);
  var recentSummaries = (recent.data || [])
    .map(function(p) { return '- ' + p.post_date + ' [' + p.theme + ']: ' + (p.caption || '').slice(0, 80); })
    .join('\n');

  var yksDate = process.env.YKS_DATE || '2027-06-19';
  var daysToYks = Math.ceil((new Date(yksDate) - new Date(dateStr)) / 86400000);
  var yksInfo = daysToYks > 0 && daysToYks < 400
    ? 'YKS\'ye yaklaşık ' + daysToYks + ' gün var — uygun düşerse bağ kurabilirsin (zorunlu değil).'
    : '';

  var resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': (process.env.ANTHROPIC_API_KEY || '').trim(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: BRAND_BRAIN,
      messages: [{ role: 'user', content: buildPrompt(dateStr, theme, recentSummaries, yksInfo, opts.idea || '') }],
    }),
  });

  if (!resp.ok) {
    var t = await resp.text();
    throw new Error('Anthropic API hatasi ' + resp.status + ': ' + t.slice(0, 300));
  }

  var data = await resp.json();
  var raw = (data.content || []).map(function(b) { return b.text || ''; }).join('');
  var clean = raw.replace(/```json|```/g, '').trim();

  var parsed;
  try {
    parsed = JSON.parse(clean);
  } catch(e) {
    var row = {
      post_date: dateStr, theme: theme.key, caption: clean.slice(0, 4000), svg: null,
      status: 'error', error_msg: 'AI ciktisi JSON olarak ayristirilamadi.',
      publish_at: trToUtc(dateStr, theme.hourTR),
    };
    if (existing.data) await client.from('story_queue').update(row).eq('id', existing.data.id);
    else await client.from('story_queue').insert(row);
    return { ok: false, error: 'parse' };
  }

  if (!parsed.svg || !parsed.svg.includes('<svg')) {
    throw new Error('AI ciktisinda gecerli SVG yok.');
  }

  var row = {
    post_date: dateStr,
    theme: theme.key,
    caption: parsed.caption || parsed.headline || '',
    svg: parsed.svg,
    status: 'draft',
    error_msg: null,
    publish_at: trToUtc(dateStr, theme.hourTR),
    updated_at: new Date().toISOString(),
  };

  if (existing.data) {
    await client.from('story_queue').update(row).eq('id', existing.data.id);
    return { ok: true, id: existing.data.id, regenerated: true };
  }
  var ins = await client.from('story_queue').insert(row).select('id').single();
  return { ok: true, id: ins.data && ins.data.id };
}

async function svgToPngUrl(client, id, svgText) {
  var { Resvg } = await import('@resvg/resvg-js');
  var resvg = new Resvg(svgText, {
    fitTo: {
      mode: 'width',
      value: 1080
    }
  });
  var png = resvg.render().asPng();

  var path = 'story-' + id + '-' + Date.now() + '.png';
  var up = await client.storage.from('stories').upload(path, png, {
    contentType: 'image/png',
    upsert: true,
  });
  if (up.error) throw new Error('Storage yukleme hatasi: ' + up.error.message);

  var d = client.storage.from('stories').getPublicUrl(path);
  return d.data.publicUrl;
}

async function publishToInstagram(pngUrl) {
  var igId = process.env.IG_USER_ID;
  var token = process.env.META_ACCESS_TOKEN;
  var base = 'https://graph.facebook.com/v21.0/' + igId;

  var create = await fetch(base + '/media', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ image_url: pngUrl, media_type: 'STORIES', access_token: token }),
  });
  var createData = await create.json();
  if (!create.ok || !createData.id) {
    throw new Error('Meta container hatasi: ' + JSON.stringify(createData).slice(0, 300));
  }

  for (var i = 0; i < 10; i++) {
    await new Promise(function(r) { setTimeout(r, 2000); });
    var st = await fetch('https://graph.facebook.com/v21.0/' + createData.id + '?fields=status_code&access_token=' + token);
    var stData = await st.json();
    if (stData.status_code === 'FINISHED') break;
    if (stData.status_code === 'ERROR') throw new Error('Meta isleme hatasi: ' + JSON.stringify(stData));
  }

  var pub = await fetch(base + '/media_publish', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ creation_id: createData.id, access_token: token }),
  });
  var pubData = await pub.json();
  if (!pub.ok || !pubData.id) {
    throw new Error('Meta yayinlama hatasi: ' + JSON.stringify(pubData).slice(0, 300));
  }
  return pubData.id;
}

export async function publishDue() {
  if (process.env.PUBLISH_ENABLED !== 'true') {
    return [{ disabled: true, note: 'PUBLISH_ENABLED=true degil — Instagram yayini kapali (test modu).' }];
  }

  var client = sb();
  var now = new Date().toISOString();

  var due = await client
    .from('story_queue')
    .select('*')
    .eq('status', 'approved')
    .lte('publish_at', now)
    .order('publish_at', { ascending: true })
    .limit(3);

  var results = [];
  for (var post of (due.data || [])) {
    try {
      var pngUrl = post.png_url || (await svgToPngUrl(client, post.id, post.svg));
      var mediaId = await publishToInstagram(pngUrl);
      await client.from('story_queue').update({
        status: 'published', png_url: pngUrl, error_msg: null,
        updated_at: new Date().toISOString(),
      }).eq('id', post.id);
      results.push({ id: post.id, ok: true, mediaId: mediaId });
    } catch (e) {
      await client.from('story_queue').update({
        status: 'error', error_msg: String(e.message || e).slice(0, 500),
        updated_at: new Date().toISOString(),
      }).eq('id', post.id);
      results.push({ id: post.id, ok: false, error: String(e.message || e) });
    }
  }
  return results;
}
