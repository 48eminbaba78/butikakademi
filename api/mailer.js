// ═══════════════════════════════════════════════════════════
// ROSTRUM AKADEMI — UNIFIED EMAIL DISPATCHER
// Endpoint: /api/mailer
// Types: student_welcome | application_update | password_reset
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SB_URL = process.env.SUPABASE_URL || 'https://imyhenrwmsmyikpollur.supabase.co';
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = `Rostrum Akademi <${process.env.SENDER_EMAIL || 'onboarding@resend.dev'}>`;
const SITE_URL = process.env.SITE_URL || 'https://butik-akademi.vercel.app';

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping');
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Resend error ' + res.status);
  }
  return res.json();
}

function wrap(inner) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Rostrum Akademi</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
${inner}
<tr><td style="padding:24px 40px;text-align:center;background:#fafafa;border-top:1px solid #ebebeb">
  <p style="margin:0;font-size:12px;color:#aaa">Bu e-posta Rostrum Akademi tarafından gönderildi.</p>
  <p style="margin:4px 0 0;font-size:12px;color:#ccc">Beklemiyor idiysen lütfen görmezden gel.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function welcomeEmail({ student_name, username, password, login_url, coach_name }) {
  const url = login_url || `${SITE_URL}/app.html`;
  return wrap(`
<tr><td style="background:linear-gradient(135deg,#f0a500 0%,#e08800 100%);padding:40px;text-align:center">
  <div style="font-size:48px;margin-bottom:12px">🎓</div>
  <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px">Rostrum Akademi'ye Hoş Geldin!</h1>
  <p style="color:rgba(255,255,255,.85);margin:0;font-size:15px">${coach_name ? coach_name + ' seni platforma ekledi' : 'Hesabın hazır'}</p>
</td></tr>
<tr><td style="padding:36px 40px">
  <p style="margin:0 0 20px;font-size:15px;color:#444">Merhaba${student_name ? ' <strong>' + student_name + '</strong>' : ''},</p>
  <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6">Aşağıdaki bilgilerle platforma giriş yapabilirsin. Bu bilgileri güvenli bir yerde sakla.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border:1px solid #e8e8e8;border-radius:12px;margin-bottom:28px">
    <tr>
      <td width="50%" style="padding:18px 20px;vertical-align:top;border-right:1px solid #e8e8e8">
        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">Kullanıcı Adı</div>
        <div style="font-size:22px;font-weight:800;color:#f0a500;font-family:monospace,monospace">${username}</div>
      </td>
      <td width="50%" style="padding:18px 20px;vertical-align:top">
        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">Şifre</div>
        <div style="font-size:22px;font-weight:800;color:#f0a500;font-family:monospace,monospace">${password}</div>
      </td>
    </tr>
    <tr><td colspan="2" style="padding:14px 20px;border-top:1px solid #e8e8e8">
      <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">Giriş Adresi</div>
      <a href="${url}" style="font-size:13px;color:#3b82f6;text-decoration:none">${url}</a>
    </td></tr>
  </table>
  <div style="text-align:center">
    <a href="${url}" style="display:inline-block;background:#f0a500;color:#fff;padding:15px 40px;border-radius:10px;font-size:16px;font-weight:800;text-decoration:none">Platforma Giriş Yap →</a>
  </div>
</td></tr>`);
}

function applicationEmail({ student_name, status, coach_name }) {
  const accepted = status === 'accepted';
  const color = accepted ? '#22c55e' : '#ef4444';
  const icon = accepted ? '🎉' : '📋';
  const title = accepted ? 'Başvurunuz Kabul Edildi!' : 'Başvurunuz Hakkında Bilgi';
  const body = accepted
    ? `<strong>${coach_name || 'Koçunuz'}</strong> başvurunuzu kabul etti! Yakında hesap bilgilerinizi alacaksınız.`
    : `<strong>${coach_name || 'Koçumuz'}</strong> şu an için yeni öğrenci kabul etmiyor. Daha fazla bilgi için koçla iletişime geçebilirsiniz.`;

  return wrap(`
<tr><td style="background:linear-gradient(135deg,${color} 0%,${color}bb 100%);padding:40px;text-align:center">
  <div style="font-size:48px;margin-bottom:12px">${icon}</div>
  <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">${title}</h1>
</td></tr>
<tr><td style="padding:36px 40px">
  <p style="margin:0 0 16px;font-size:15px;color:#444">Merhaba${student_name ? ' <strong>' + student_name + '</strong>' : ''},</p>
  <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.7">${body}</p>
  ${accepted ? `<div style="text-align:center"><a href="${SITE_URL}/app.html" style="display:inline-block;background:${color};color:#fff;padding:15px 40px;border-radius:10px;font-size:15px;font-weight:800;text-decoration:none">Platforma Git →</a></div>` : ''}
</td></tr>`);
}

function newMessageEmail({ student_name, message_preview, login_url }) {
  const url = login_url || `${SITE_URL}/app.html`;
  const preview = message_preview || '';
  return wrap(`
<tr><td style="background:linear-gradient(135deg,#E8613A 0%,#d45025 100%);padding:40px;text-align:center">
  <div style="font-size:48px;margin-bottom:12px">💬</div>
  <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px">Yeni Mesaj</h1>
  <p style="color:rgba(255,255,255,.85);margin:0;font-size:15px">${student_name ? `<strong>${student_name}</strong> sana yazdı` : 'Öğrenciniz sana yazdı'}</p>
</td></tr>
<tr><td style="padding:36px 40px">
  <p style="margin:0 0 20px;font-size:15px;color:#444">Merhaba,</p>
  ${preview ? `<div style="background:#fef7f5;border-left:4px solid #E8613A;padding:16px 20px;border-radius:0 10px 10px 0;margin-bottom:28px;font-size:14px;color:#555;line-height:1.65">${preview}</div>` : ''}
  <div style="text-align:center">
    <a href="${url}" style="display:inline-block;background:#E8613A;color:#fff;padding:15px 40px;border-radius:10px;font-size:15px;font-weight:800;text-decoration:none">Mesajı Gör →</a>
  </div>
</td></tr>`);
}

function templateShareEmail({ coach_name, template_name, task_count, tasks_json }) {
  return wrap(`
<tr><td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:40px;text-align:center">
  <div style="font-size:48px;margin-bottom:12px">📋</div>
  <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">Yeni Şablon Paylaşıldı</h1>
</td></tr>
<tr><td style="padding:36px 40px">
  <p style="margin:0 0 16px;font-size:15px;color:#444"><strong>${coach_name || 'Bir koç'}</strong> bir program şablonu paylaştı:</p>
  <div style="background:#f8f8f8;border:1px solid #e8e8e8;border-radius:12px;padding:20px;margin-bottom:24px">
    <div style="font-size:16px;font-weight:800;color:#111;margin-bottom:4px">${template_name || 'İsimsiz Şablon'}</div>
    <div style="font-size:13px;color:#888">${task_count || 0} görev</div>
  </div>
  <pre style="background:#f8f8f8;border:1px solid #e8e8e8;border-radius:8px;padding:16px;font-size:11px;line-height:1.5;overflow:auto;max-height:400px;white-space:pre-wrap;word-break:break-all">${tasks_json || ''}</pre>
</td></tr>`);
}

function passwordResetEmail({ action_link }) {
  return wrap(`
<tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px;text-align:center">
  <div style="font-size:48px;margin-bottom:12px">🔐</div>
  <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px">Şifre Sıfırlama</h1>
  <p style="color:rgba(255,255,255,.85);margin:0;font-size:14px">Rostrum Akademi hesabın için</p>
</td></tr>
<tr><td style="padding:36px 40px">
  <p style="margin:0 0 16px;font-size:15px;color:#444">Merhaba,</p>
  <p style="margin:0 0 28px;font-size:14px;color:#666;line-height:1.6">Rostrum Akademi hesabın için şifre sıfırlama talebinde bulundun. Aşağıdaki butona tıkla:</p>
  <div style="text-align:center;margin-bottom:28px">
    <a href="${action_link}" style="display:inline-block;background:#6366f1;color:#fff;padding:15px 40px;border-radius:10px;font-size:16px;font-weight:800;text-decoration:none">Şifremi Sıfırla →</a>
  </div>
  <p style="margin:0;font-size:13px;color:#999;line-height:1.5">Bu link <strong>1 saat</strong> geçerlidir. Şifre sıfırlamak istemediysen bu e-postayı görmezden gelebilirsin.</p>
</td></tr>`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, ...data } = req.body;

  try {
    if (type === 'student_welcome') {
      if (!data.to) return res.status(400).json({ error: 'to alanı gerekli' });
      const subject = `${data.student_name ? data.student_name + ', p' : 'P'}latformumuza hoş geldin! 🎓`;
      await sendEmail(data.to, subject, welcomeEmail(data));
      return res.status(200).json({ success: true });
    }

    if (type === 'application_update') {
      if (!data.to) return res.status(400).json({ error: 'to alanı gerekli' });
      const subject = data.status === 'accepted'
        ? '🎉 Başvurunuz kabul edildi!'
        : '📋 Başvurunuz hakkında bilgi — Rostrum Akademi';
      await sendEmail(data.to, subject, applicationEmail(data));
      return res.status(200).json({ success: true });
    }

    if (type === 'password_reset') {
      if (!data.email) return res.status(400).json({ error: 'email alanı gerekli' });
      if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'Sunucu yapılandırma hatası' });

      const admin = createClient(SB_URL, SB_SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: data.email,
        options: { redirectTo: `${SITE_URL}/app.html` }
      });

      if (linkErr) throw new Error(linkErr.message);

      const action_link = linkData?.properties?.action_link;
      if (!action_link) throw new Error('Sıfırlama linki oluşturulamadı');

      await sendEmail(data.email, '🔐 Rostrum Akademi — Şifre Sıfırlama', passwordResetEmail({ action_link }));
      return res.status(200).json({ success: true });
    }

    if (type === 'new_message') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token gerekli' });
      if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'Sunucu yapılandırma hatası' });
      const admin = createClient(SB_URL, SB_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data: { user }, error: authErr } = await admin.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: 'Yetkisiz' });
      const { data: sender } = await admin.from('users').select('role, coach_id').eq('id', user.id).single();
      if (!sender || sender.role !== 'student') return res.status(403).json({ error: 'Sadece öğrenciler bildirim gönderebilir' });
      if (sender.coach_id !== data.coach_id) return res.status(403).json({ error: 'Geçersiz koç ID' });
      const { data: coach } = await admin.from('users').select('email').eq('id', data.coach_id).single();
      if (!coach?.email) return res.status(404).json({ error: 'Koç bulunamadı' });
      await sendEmail(coach.email, `💬 ${data.student_name || 'Öğrenciniz'} sana mesaj gönderdi`, newMessageEmail({ ...data, login_url: `${SITE_URL}/app.html` }));
      return res.status(200).json({ success: true });
    }

    if (type === 'template_share') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token gerekli' });
      if (!SB_SERVICE_KEY) return res.status(500).json({ error: 'Sunucu yapılandırma hatası' });
      const admin = createClient(SB_URL, SB_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data: { user }, error: authErr } = await admin.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: 'Yetkisiz' });
      const { data: caller } = await admin.from('users').select('role, full_name').eq('id', user.id).single();
      if (!caller || !['coach', 'developer'].includes(caller.role)) return res.status(403).json({ error: 'Yetkisiz' });
      const to = process.env.ADMIN_EMAIL || 'simkoc1@rostrumakademi.com';
      await sendEmail(to, `📋 Yeni şablon: ${data.template_name || 'İsimsiz'} — ${caller.full_name || 'Koç'}`, templateShareEmail({ ...data, coach_name: caller.full_name }));
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Geçersiz tip: ' + type });
  } catch (e) {
    console.error('[mailer] type=' + type, e.message);
    return res.status(500).json({ error: e.message });
  }
}
