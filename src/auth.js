// ═══════════════════════════════════════════════
// ROSTRUM AKADEMI — AUTHENTICATION SERVICES
// ═══════════════════════════════════════════════

import { db } from './config.js';
import { S, session } from './state.js';
import { loadAllData, invalidateCache } from './api.js';
import { showLoading, sha256, normalizeUsername, showToast } from './helpers.js';

// Prevents concurrent or duplicate session initialization calls
let _sessionHandled = false;

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
  if (window.location.hash.includes('type=recovery')) {
    console.log('[Auth] Recovery session active, skipping checkOAuthSession');
    return;
  }
  if (_sessionHandled) return;
  _sessionHandled = true;
  let _timeoutId = null;
  try {
    console.log('[Auth] 1/4 getSession...');
    const { data: { session: oauthSess } } = await db.auth.getSession();
    console.log('[Auth] 2/4 session:', oauthSess?.user?.email || 'yok');
    if (!oauthSess?.user) {
      _sessionHandled = false;
      return;
    }
    if (document.getElementById('appShell')?.classList.contains('visible')) {
      _sessionHandled = false;
      return;
    }

    showLoading(true);

    // 10 saniye içinde tamamlanmazsa spinner'ı kapat, kullanıcı manuel giriş yapabilsin
    _timeoutId = setTimeout(() => {
      console.warn('[Auth] timeout — Supabase yanıt vermedi, spinner kapatılıyor');
      _sessionHandled = false;
      showLoading(false);
    }, 10000);

    console.log('[Auth] 3/4 profil yükleniyor...');
    const { data: profile, error: pErr } = await db.from('users').select('*').eq('id', oauthSess.user.id).maybeSingle();
    console.log('[Auth] 4/4 profil:', profile?.role, pErr?.message || '');
    clearTimeout(_timeoutId);

    let needsOnboarding = false;
    if (profile) {
      if (profile.role === 'coach') {
        const { data: ws } = await db.from('workspaces').select('*').eq('coach_id', profile.id).maybeSingle();
        if (!ws || !ws.onboarding_done) needsOnboarding = true;
      }
    } else {
      needsOnboarding = true;
    }

    if (profile && !needsOnboarding) {
      await finishLogin(profile);
    } else {
      showLoading(false);
      document.getElementById('newUserOnboarding').style.display = 'flex';
      document.getElementById('onbEmail').textContent = oauthSess.user.email;
      document.getElementById('onbName').value = oauthSess.user.user_metadata?.full_name || '';
      window._oauthUser = oauthSess.user;
    }
  } catch (e) {
    clearTimeout(_timeoutId);
    _sessionHandled = false;
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

let _signUpStep = 0;

export function setRegBrandColor(color, el) {
  document.getElementById('regBrandColor').value = color;
  el.parentElement.querySelectorAll('div').forEach(x => x.style.outline = 'none');
  el.style.outline = '3px solid white';
}

export function nextRegWizardStep() {
  const errEl = document.getElementById('regErr0');
  if (errEl) errEl.style.display = 'none';

  if (_signUpStep === 0) {
    if (!window._regRole) {
      if (errEl) {
        errEl.textContent = 'Lütfen bir hesap türü seçin.';
        errEl.style.display = 'block';
      }
      return;
    }
    if (window._regRole === 'student') {
      _signUpStep = 3; // Skip coach steps
    } else {
      _signUpStep = 1;
    }
  } else if (_signUpStep === 1) {
    const brand = document.getElementById('regBrandName').value.trim();
    if (!brand) {
      alert('Lütfen akademi / koçluk adını girin.');
      return;
    }
    _signUpStep = 2;
  } else if (_signUpStep === 2) {
    _signUpStep = 3;
  }

  showRegWizardStep(_signUpStep);
}

export function prevRegWizardStep() {
  if (_signUpStep === 3) {
    if (window._regRole === 'student') {
      _signUpStep = 0;
    } else {
      _signUpStep = 2;
    }
  } else if (_signUpStep === 2) {
    _signUpStep = 1;
  } else if (_signUpStep === 1) {
    _signUpStep = 0;
  }
  showRegWizardStep(_signUpStep);
}

function showRegWizardStep(step) {
  document.getElementById('regWizardStep0').style.display = step === 0 ? 'block' : 'none';
  document.getElementById('regWizardStepCoach1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('regWizardStepCoach2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('regWizardStepFinal').style.display = step === 3 ? 'block' : 'none';
}

export async function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPass').value;

  if (!name || !email || !pass) return regErr('Tüm hesap bilgileri zorunludur');
  if (pass.length < 8) return regErr('Şifre en az 8 karakter olmalıdır');

  showLoading(true);
  try {
    let metadata = {
      full_name: name,
      role: window._regRole
    };

    if (window._regRole === 'coach') {
      const brand = document.getElementById('regBrandName').value.trim();
      const color = document.getElementById('regBrandColor').value || '#f0a500';
      const phone = document.getElementById('regPhone').value.trim();
      const selectedExamLabels = [...document.querySelectorAll('#regExamTypesWrap .ob-exam-sel input')].map(i=>i.value);
      const examTypes = selectedExamLabels.length > 0 ? selectedExamLabels.join(',') : 'YKS';
      const studentCount = document.getElementById('regStudentCountRange').value || '1-5';

      metadata.ob_brand = brand;
      metadata.ob_color = color;
      metadata.ob_phone = phone;
      metadata.ob_examtypes = examTypes;
      metadata.ob_studentcount = studentCount;
    }

    const { data: signUpData, error: signUpErr } = await db.auth.signUp({
      email,
      password: pass,
      options: {
        data: metadata
      }
    });

    if (signUpErr) throw signUpErr;

    if (signUpData?.user) {
      showLoading(false);
      document.getElementById('regName').value = '';
      document.getElementById('regEmail').value = '';
      document.getElementById('regPass').value = '';
      if (document.getElementById('regBrandName')) document.getElementById('regBrandName').value = '';
      if (document.getElementById('regPhone')) document.getElementById('regPhone').value = '';
      
      const succ = document.getElementById('regSuccess');
      succ.textContent = 'Kayıt başarılı! E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğrulama yaptıktan sonra giriş yapın.';
      succ.style.display = 'block';
      setTimeout(() => (succ.style.display = 'none'), 10000);
      
      // Reset step
      _signUpStep = 0;
      showRegWizardStep(0);
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
  const _loginTimeout = setTimeout(() => {
    showLoading(false);
    loginErr('Bağlantı zaman aşımına uğradı. Supabase yanıt vermiyor — lütfen tekrar deneyin.');
  }, 15000);
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
        clearTimeout(_loginTimeout);
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
        clearTimeout(_loginTimeout);
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
  } finally {
    clearTimeout(_loginTimeout);
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

    // Otomatik Workspace oluşturma (Kayıt sırasındaki metadatadan)
    if (session.role === 'coach' || session.role === 'developer') {
      if (!S.workspace) {
        console.log('[Auth] Workspace not found, auto-creating from signup metadata...');
        const { data: { user } } = await db.auth.getUser();
        if (user) {
          const brand_name = user.user_metadata?.ob_brand || 'Akademi';
          const brand_color = user.user_metadata?.ob_color || '#f0a500';
          const phone = user.user_metadata?.ob_phone || null;
          const exam_types = user.user_metadata?.ob_examtypes || 'YKS';
          const student_count_range = user.user_metadata?.ob_studentcount || '1-5';

          const wsPayload = {
            coach_id: rows.id,
            brand_name,
            brand_color,
            phone,
            exam_types,
            student_count_range,
            onboarding_done: false
          };
          const { data: newWs, error: createWsErr } = await db.from('workspaces').upsert(wsPayload, { onConflict: 'coach_id' }).select().maybeSingle();
          if (createWsErr) {
            console.error('[finishLogin] Create workspace error:', createWsErr);
          } else if (newWs) {
            S.workspace = newWs;
          }
        }
      }
    }
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
    // Öğrenci ilk girişte profil formu göster
    if (session.role === 'student') {
      const { data: existingProfile } = await db.from('student_profiles').select('id').eq('id', session.studentId || rows.id).maybeSingle();
      if (!existingProfile) {
        const hashTab = window.location.hash.substring(1);
        const firstTab = (hashTab && document.getElementById('view-' + hashTab)) ? hashTab : 'portal';
        setTimeout(() => { window.switchTab(firstTab); window.showStudentWelcome && window.showStudentWelcome(); }, 100);
        return;
      }
    }
    const hashTab = window.location.hash.substring(1);
    const defaultTab = { coach: 'home', student: 'portal', developer: 'home', parent: 'parent-home' }[session.role] || 'portal';
    const firstTab = (hashTab && document.getElementById('view-' + hashTab)) ? hashTab : defaultTab;
    setTimeout(() => window.switchTab(firstTab), 50);
  } catch (e) {
    showLoading(false);
    console.error('[doLogin] HATA:', e);
    loginErr('Hata: ' + e.message);
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appShell').classList.remove('visible');
  }
}

export function doLogout() {
  if (window._fcInstance) {
    window._fcInstance.destroy();
    window._fcInstance = null;
  }
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
    const resp = await fetch('/api/mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'password_reset', email })
    });
    const d = await resp.json();
    if (!resp.ok) throw new Error(d.error || 'Sunucu hatası');
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

export async function updateUserPassword() {
  const newPass = document.getElementById('newPasswordInput').value;
  if (!newPass || newPass.length < 8) {
    alert('Şifre en az 8 karakter olmalıdır.');
    return;
  }
  showLoading(true);
  try {
    // 1. Supabase Auth şifresini güncelle
    const { error } = await db.auth.updateUser({ password: newPass });
    if (error) throw error;
    
    // 2. public.users tablosundaki hash'i de güncelle
    const hash = await sha256(newPass);
    const { data: { user } } = await db.auth.getUser();
    if (user) {
      await db.from('users').update({ password_hash: hash }).eq('id', user.id);
    }

    alert('Şifreniz başarıyla güncellendi! Lütfen yeni şifrenizle giriş yapın.');
    window.cm('resetPasswordModal');
    await db.auth.signOut();
    window.location.hash = '';
    window.location.reload();
  } catch (e) {
    alert('Şifre güncellenirken hata oluştu: ' + e.message);
  } finally {
    showLoading(false);
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
window.updateUserPassword = updateUserPassword;
window.nextRegWizardStep = nextRegWizardStep;
window.prevRegWizardStep = prevRegWizardStep;
window.setRegBrandColor = setRegBrandColor;

db.auth.onAuthStateChange(async (event, sessionData) => {
  const isRecovery = event === 'PASSWORD_RECOVERY' || window.location.hash.includes('type=recovery');
  if (isRecovery) {
    console.log('[Auth] Password recovery flow active, showing resetPasswordModal');
    showLoading(false);
    window.om('resetPasswordModal');
    return;
  }
  // SIGNED_IN: handles Google OAuth redirect (fires when Supabase processes OAuth tokens from URL)
  if (event === 'SIGNED_IN' && sessionData?.user) {
    if (document.getElementById('appShell')?.classList.contains('visible')) return;
    await checkOAuthSession();
  }
  // SIGNED_OUT: session expired or refresh token invalid — clear any stuck spinner
  if (event === 'SIGNED_OUT') {
    _sessionHandled = false;
    showLoading(false);
  }
});

// Kullanıcı adı ve E-posta inputlarını senkronize tutan (mirroring) yardımcı işlev
function setupLoginMirroring() {
  const emailEl = document.getElementById('loginEmail');
  const userEl = document.getElementById('loginUser');
  if (emailEl && userEl) {
    emailEl.addEventListener('input', (e) => {
      userEl.value = e.target.value;
    });
    userEl.addEventListener('input', (e) => {
      emailEl.value = e.target.value;
    });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLoginMirroring);
} else {
  setupLoginMirroring();
}

// ── Kayit.html'den gelen yeni koçları otomatik giriş yaptır ──
if (new URLSearchParams(window.location.search).get('new_coach') === '1') {
  const _autoEmail = sessionStorage.getItem('ra_new_coach_email');
  const _autoPass  = sessionStorage.getItem('ra_new_coach_pass');
  if (_autoEmail && _autoPass) {
    sessionStorage.removeItem('ra_new_coach_email');
    sessionStorage.removeItem('ra_new_coach_pass');
    const _autoLoginFn = () => {
      const emailEl = document.getElementById('loginEmail');
      const passEl  = document.getElementById('loginPass');
      if (emailEl && passEl) {
        emailEl.value = _autoEmail;
        passEl.value  = _autoPass;
        setTimeout(() => window.doLogin && window.doLogin(), 400);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _autoLoginFn);
    } else {
      _autoLoginFn();
    }
  }
}
