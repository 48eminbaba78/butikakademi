// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — AUTHENTICATION SERVICES
// ═══════════════════════════════════════════════

import { db } from './config.js';
import { S, session } from './state.js';
import { loadAllData, invalidateCache } from './api.js';
import { showLoading, sha256, normalizeUsername, showToast } from './helpers.js';

export function loginErr(msg) {
  const el = document.getElementById('loginErr');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 5000);
}

export function regErr(msg) {
  const el = document.getElementById('regErr');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 5000);
}

export function setAuthMode(mode) {
  document.getElementById('loginPanel').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('registerPanel').style.display = mode === 'register' ? 'block' : 'none';
  document.getElementById('lmtLogin').classList.toggle('active', mode === 'login');
  document.getElementById('lmtRegister').classList.toggle('active', mode === 'register');
}

export function setLoginMode(mode) {
  window._loginMode = mode;
  document.querySelectorAll('#loginTabs .login-tab').forEach((t, i) => t.classList.toggle('active', i === (mode === 'email' ? 0 : 1)));
  document.getElementById('loginEmailField').style.display = mode === 'email' ? 'block' : 'none';
  document.getElementById('loginUserField').style.display = mode === 'username' ? 'block' : 'none';
}

export function setRegRole(role) {
  window._regRole = role;
  document.getElementById('rrbCoach').classList.toggle('sel', role === 'coach');
  document.getElementById('rrbStudent').classList.toggle('sel', role === 'student');
}

export function setOnbRole(role) {
  window._onbRole = role;
  document.getElementById('onbRoleCoach').classList.toggle('sel', role === 'coach');
  document.getElementById('onbRoleStudent').classList.toggle('sel', role === 'student');
}

export async function loginWithGoogle() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    showGoogleSimulator();
    return;
  }
  await triggerRealGoogleLogin();
}

export async function triggerRealGoogleLogin() {
  closeGoogleSimulator();
  showLoading(true);
  try {
    const { error } = await db.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/app.html',
        queryParams: { access_type: 'offline', prompt: 'select_account' }
      }
    });
    if (error) {
      showLoading(true);
      console.warn('Google Auth failed:', error);
      loginErr('Google Girişi Başlatılamadı: ' + error.message);
    }
  } catch (e) {
    showLoading(false);
    loginErr('Google Girişi Başlatılamadı: ' + e.message);
  }
}

export function showGoogleSimulator() {
  document.getElementById('googleSimulatorModal').style.display = 'flex';
}

export function closeGoogleSimulator() {
  document.getElementById('googleSimulatorModal').style.display = 'none';
}

export async function simOAuthLogin(type) {
  closeGoogleSimulator();
  showLoading(true);

  if (type === 'demokoc') {
    const { data, error } = await db.from('users').select('*').eq('username', 'demokoc').maybeSingle();
    if (error || !data) {
      showLoading(false);
      loginErr('Demo koç profili bulunamadı!');
      return;
    }
    await finishLogin(data);
  } else if (type === 'demoogrenci') {
    const { data, error } = await db.from('users').select('*').eq('username', 'demoogrenci').maybeSingle();
    if (error || !data) {
      showLoading(false);
      loginErr('Demo öğrenci profili bulunamadı!');
      return;
    }
    await finishLogin(data);
  } else if (type === 'new') {
    showLoading(false);
    document.getElementById('newUserOnboarding').style.display = 'flex';

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const mockEmail = `yeni.kullanici${randomId}@gmail.com`;

    document.getElementById('onbEmail').textContent = mockEmail;
    document.getElementById('onbName').value = `Yeni Kullanıcı ${randomId}`;

    window._oauthUser = {
      id: `mock-google-id-${randomId}`,
      email: mockEmail,
      user_metadata: {
        full_name: `Yeni Kullanıcı ${randomId}`
      }
    };
  }
}

export async function checkOAuthSession() {
  try {
    const { data: { session: oauthSess } } = await db.auth.getSession();
    if (!oauthSess?.user) return;

    if (document.getElementById('appShell')?.classList.contains('visible')) return;

    showLoading(true);
    const { data: profile } = await db.from('users').select('*').eq('id', oauthSess.user.id).maybeSingle();

    const isNewGoogleUser = profile && 
      profile.password_hash === 'supabase_managed' && 
      profile.username === profile.email.split('@')[0] &&
      (profile.target === 'Hedef belirtilmemiş' || !profile.target);

    if (profile && !isNewGoogleUser) {
      await finishLogin(profile);
    } else {
      showLoading(false);
      document.getElementById('newUserOnboarding').style.display = 'flex';
      document.getElementById('onbEmail').textContent = oauthSess.user.email;
      document.getElementById('onbName').value = oauthSess.user.user_metadata?.full_name || '';
      window._oauthUser = oauthSess.user;
    }
  } catch (e) {
    showLoading(false);
    console.warn('[checkOAuthSession]', e);
  }
}

export async function completeOnboarding() {
  const name = document.getElementById('onbName').value.trim();
  if (!name) {
    document.getElementById('onbErr').textContent = 'Ad soyad zorunlu';
    document.getElementById('onbErr').style.display = 'block';
    return;
  }
  if (!window._onbRole) {
    document.getElementById('onbErr').textContent = 'Hesap türü seçin';
    document.getElementById('onbErr').style.display = 'block';
    return;
  }
  document.getElementById('onbErr').style.display = 'none';
  showLoading(true);
  const user = window._oauthUser;
  const username = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

  const payload = {
    id: user.id,
    full_name: name,
    email: user.email,
    role: window._onbRole,
    username: username + '_' + Math.random().toString(36).slice(2, 6),
    password_hash: 'supabase_managed',
    color: window._onbRole === 'coach' ? '#f0a500' : '#4da6ff',
    week_start: 0,
    progress: 0,
    target: ''
  };

  const { data: newProfile, error } = await db.from('users').upsert(payload).select().single();
  if (error) {
    showLoading(false);
    document.getElementById('onbErr').textContent = 'Hata: ' + error.message;
    document.getElementById('onbErr').style.display = 'block';
    return;
  }
  document.getElementById('newUserOnboarding').style.display = 'none';
  await finishLogin(newProfile);
}

export async function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPass').value;

  if (!name || !email || !pass) return regErr('Tüm alanlar zorunlu');
  if (pass.length < 8) return regErr('Şifre en az 8 karakter olmalıdır');
  if (!window._regRole) return regErr('Hesap türü seçin');

  showLoading(true);
  try {
    const { data: signUpData, error: signUpErr } = await db.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          role: window._regRole
        }
      }
    });

    if (signUpErr) throw signUpErr;

    if (signUpData?.user) {
      showLoading(false);
      document.getElementById('regName').value = '';
      document.getElementById('regEmail').value = '';
      document.getElementById('regPass').value = '';
      const succ = document.getElementById('regSuccess');
      succ.textContent = 'Kayıt başarılı! E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğrulama yaptıktan sonra giriş yapın.';
      succ.style.display = 'block';
      setTimeout(() => (succ.style.display = 'none'), 10000);
      setAuthMode('login');
    }
  } catch (e) {
    showLoading(false);
    regErr('Kayıt Hatası: ' + e.message);
  }
}

export async function doLogin() {
  const usernameOrEmail = (document.getElementById('loginEmail').value || document.getElementById('loginUser').value || '').trim();
  const pass = document.getElementById('loginPass').value;

  if (!usernameOrEmail || !pass) return loginErr('Kullanıcı adı ve şifre zorunlu');

  showLoading(true);
  try {
    let email = usernameOrEmail;
    if (!email.includes('@')) {
      const normalizedUser = normalizeUsername(usernameOrEmail);
      email = normalizedUser + '@rostrumakademi.com';
    } else {
      email = email.toLowerCase();
    }

    const { data: authData, error: authErr } = await db.auth.signInWithPassword({ email, password: pass });
    if (!authErr && authData?.user) {
      const { data: profile, error: pErr } = await db.from('users').select('*').eq('id', authData.user.id).maybeSingle();
      if (pErr) console.error('Profile fetch error:', pErr);
      if (profile) {
        await finishLogin(profile);
        return;
      }
      showLoading(false);
      return loginErr('Hesabınız veritabanında aktif değil.');
    }

    // Fallback: kimlik bilgisiyle güvenli lookup (security definer RPC)
    try {
      const lookupUser = normalizeUsername(usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail);
      const passHash = await sha256(pass);
      const { data: rpcRows } = await db.rpc('get_user_by_credentials', {
        p_username: lookupUser,
        p_password_hash: passHash
      });
      const rows = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows;
      if (rows) {
        await finishLogin(rows);
        return;
      }
    } catch (e) {
      console.warn('Fallback RPC error:', e);
    }

    showLoading(false);
    return loginErr(authErr ? 'Giriş başarısız: ' + authErr.message : 'Kullanıcı adı veya şifre hatalı.');
  } catch (e) {
    showLoading(false);
    console.error('[doLogin]', e);
    return loginErr('Giriş hatası: ' + e.message);
  }
}

export async function finishLogin(rows) {
  showLoading(false);
  const coachId = (rows.role === 'coach' || rows.role === 'developer') ? rows.id : (rows.role === 'student' || rows.role === 'parent') ? rows.coach_id : null;
  
  session.role = rows.role;
  session.studentId = rows.role === 'student' ? rows.id : null;
  session.dbUser = rows;
  session.coachId = coachId;

  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').classList.add('visible');

  try {
    await loadAllData();
    if (session.role === 'student') {
      S.activeStuId = rows.id;
      session.studentId = rows.id;
      if (!S.students.find(s => s.id === rows.id)) {
        S.students.push({
          id: rows.id,
          name: rows.full_name || rows.username || 'Öğrenci',
          target: rows.target || '',
          color: rows.color || '#4da6ff',
          progress: rows.progress || 0,
          weekStart: rows.week_start || 0,
          username: rows.username,
          coachId: rows.coach_id
        });
      }
    }
    if (session.role === 'parent') {
      const { data: child } = await db.from('users').select('*').eq('parent_id', rows.id).single();
      if (child) {
        S.activeStuId = child.id;
        session.studentId = child.id;
        session.childName = child.full_name || child.username;
      }
    }
    window.setupShell();
    
    document.getElementById('aiChatBubble').style.display = 'flex';
    if ((session.role === 'coach' || session.role === 'developer') && (!S.workspace || !S.workspace.onboarding_done)) {
      window.switchTab('home');
      window.showOnboarding();
      return;
    }
    const hashTab = window.location.hash.substring(1);
    const defaultTab = { coach: 'home', student: 'portal', developer: 'dev-dashboard', parent: 'parent-home' }[session.role] || 'portal';
    const firstTab = (hashTab && document.getElementById('view-' + hashTab)) ? hashTab : defaultTab;
    setTimeout(() => window.switchTab(firstTab), 50);
  } catch (e) {
    console.error('[doLogin] HATA:', e);
    loginErr('Hata: ' + e.message);
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appShell').classList.remove('visible');
  }
}

export function doLogout() {
  if (window.destroyRealtime) window.destroyRealtime();
  db.auth.signOut().catch(() => {});
  invalidateCache();
  
  session.role = null;
  session.studentId = null;
  session.dbUser = null;
  session.coachId = null;
  session.childName = null;
  
  S.workspace = null;
  
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appShell').classList.remove('visible');
  document.getElementById('aiChatBubble').style.display = 'none';
  document.getElementById('aiChatPanel').classList.remove('open');
  if (document.getElementById('loginEmail')) document.getElementById('loginEmail').value = '';
  if (document.getElementById('loginUser')) document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  window.location.hash = '';
}

export function showForgotPassword() {
  window.om('forgotPassModal');
}

export async function sendResetEmail() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) return;
  const msgEl = document.getElementById('forgotMsg');
  try {
    const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/app.html' });
    if (error) throw error;
    msgEl.style.display = 'block';
    msgEl.style.background = 'var(--green-dim)';
    msgEl.style.color = 'var(--green)';
    msgEl.textContent = 'Sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.';
  } catch (e) {
    msgEl.style.display = 'block';
    msgEl.style.background = 'var(--red-dim)';
    msgEl.style.color = 'var(--red)';
    msgEl.textContent = 'Hata: ' + (e.message || 'Bir sorun oluştu.');
  }
}

// Expose to window for HTML inline event handlers
window.loginErr = loginErr;
window.regErr = regErr;
window.setAuthMode = setAuthMode;
window.setLoginMode = setLoginMode;
window.setRegRole = setRegRole;
window.setOnbRole = setOnbRole;
window.loginWithGoogle = loginWithGoogle;
window.triggerRealGoogleLogin = triggerRealGoogleLogin;
window.showGoogleSimulator = showGoogleSimulator;
window.closeGoogleSimulator = closeGoogleSimulator;
window.simOAuthLogin = simOAuthLogin;
window.checkOAuthSession = checkOAuthSession;
window.completeOnboarding = completeOnboarding;
window.doRegister = doRegister;
window.doLogin = doLogin;
window.finishLogin = finishLogin;
window.doLogout = doLogout;
window.showForgotPassword = showForgotPassword;
window.sendResetEmail = sendResetEmail;

// Real-time auth state change listener to resolve OAuth redirect race conditions
db.auth.onAuthStateChange(async (event, sessionData) => {
  console.log('[Supabase Auth State Change]', event, sessionData);
  if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && sessionData?.user) {
    if (document.getElementById('appShell')?.classList.contains('visible')) return;
    await checkOAuthSession();
  }
});
