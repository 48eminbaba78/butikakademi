import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Caller doğrulama
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });

  const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Yetkisiz' });

  const { data: caller } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
  if (!caller || !['coach', 'developer'].includes(caller.role)) {
    return res.status(403).json({ error: 'Sadece koçlar öğrenci ekleyebilir' });
  }

  const { email, password, full_name, username, color, target, progress, week_start, coach_id, exam_profile, yks_area } = req.body;
  if (!email || !password || !full_name || !username) {
    return res.status(400).json({ error: 'Zorunlu alanlar eksik' });
  }

  // Admin API ile kullanıcı oluştur
  const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: 'student' }
  });
  if (createErr) return res.status(400).json({ error: createErr.message });

  const userId = newUser.user.id;
  const passHash = crypto.createHash('sha256').update(password).digest('hex');

  const { error: profileErr } = await supabaseAdmin.from('users').upsert({
    id: userId,
    full_name,
    username,
    password_hash: passHash,
    role: 'student',
    email,
    color: color || '#4da6ff',
    target: target || '',
    progress: progress || 0,
    week_start: week_start || 0,
    coach_id,
    exam_profile: exam_profile || 'YKS',
    yks_area: yks_area || 'SAY'
  });

  if (profileErr) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return res.status(400).json({ error: profileErr.message });
  }

  return res.status(200).json({ userId });
}
