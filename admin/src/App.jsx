import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import MatchingTracker from './components/MatchingTracker'
import ContentManager from './components/ContentManager'
import SystemSettings from './components/SystemSettings'

import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut, 
  Lock, 
  User, 
  Sparkles,
  HelpCircle,
  Menu,
  X
} from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Login form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMethod, setLoginMethod] = useState('supabase') // 'supabase' or 'demo'
  const [errorMsg, setErrorMsg] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    // 1. Check local session storage for local admin session
    const localAdmin = sessionStorage.getItem('site_admin_user')
    if (localAdmin) {
      setCurrentUser(JSON.parse(localAdmin))
      setSession({ local: true })
      return
    }

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUserProfile(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUserProfile(session.user.id)
      } else if (!sessionStorage.getItem('site_admin_user')) {
        setCurrentUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (!error && data) {
        setCurrentUser(data)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  // Handle local SHA-256 equivalent login or string comparison
  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoginLoading(true)

    if (loginMethod === 'demo') {
      // Demo / Local Admin Fallback (matching admin / admin2026)
      if (email.trim() === 'admin' && password === 'admin2026') {
        const demoUser = {
          id: '00000000-0000-0000-0000-000000000000',
          full_name: 'Yönetici (Demo)',
          email: 'admin@rostrumakademi.com',
          role: 'developer',
          color: '#f0a500'
        }
        sessionStorage.setItem('site_admin_user', JSON.stringify(demoUser))
        setCurrentUser(demoUser)
        setSession({ local: true })
        setLoginLoading(false)
      } else {
        setErrorMsg('Demo kullanıcı adı veya şifre hatalı!')
        setLoginLoading(false)
      }
    } else {
      // Supabase Auth Login
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })

        if (error) throw error

        // Query user role to verify authorization
        const { data: profile, error: pErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (pErr || !profile) {
          await supabase.auth.signOut()
          throw new Error('Sistemde yetki profiliniz bulunamadı.')
        }

        if (profile.role !== 'developer' && profile.role !== 'institution') {
          await supabase.auth.signOut()
          throw new Error('Bu yönetim paneline erişim yetkiniz bulunmamaktadır.')
        }

        setCurrentUser(profile)
      } catch (err) {
        setErrorMsg(err.message || 'Giriş başarısız!')
      } finally {
        setLoginLoading(false)
      }
    }
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('site_admin_user')
    await supabase.auth.signOut()
    setSession(null)
    setCurrentUser(null)
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />
      case 'users':
        return <UserManagement currentUserId={currentUser?.id} />
      case 'matching':
        return <MatchingTracker currentUserId={currentUser?.id} />
      case 'content':
        return <ContentManager currentUserId={currentUser?.id} />
      case 'settings':
        return <SystemSettings currentUserId={currentUser?.id} />
      default:
        return <Dashboard setActiveTab={setActiveTab} />
    }
  }

  // Render Login Screen if no session
  if (!session || !currentUser) {
    return (
      <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-4 selection:bg-brand selection:text-bg">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="bg-surface-1 border border-border-accent w-full max-w-md rounded-2xl p-8 shadow-2xl relative z-10 hover:border-border-accent-hover transition duration-300">
          <div className="text-center mb-8">
            <div className="text-2xl font-black tracking-tight text-text-primary">
              ROSTRUM<span className="text-brand">AKADEMİ</span>
            </div>
            <p className="text-xs text-text-mid font-semibold uppercase tracking-wider mt-1.5">Yönetici Kontrol Paneli</p>
          </div>

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-400 text-xs rounded-xl p-3 mb-6 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex bg-surface-2 p-1 rounded-lg border border-border-accent mb-4">
              <button 
                type="button"
                onClick={() => { setLoginMethod('supabase'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                  loginMethod === 'supabase' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
                }`}
              >
                Supabase Auth
              </button>
              <button 
                type="button"
                onClick={() => { setLoginMethod('demo'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                  loginMethod === 'demo' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
                }`}
              >
                Demo Girişi
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide flex items-center gap-1">
                <User size={12} className="text-text-dim" />
                {loginMethod === 'demo' ? 'Kullanıcı Adı' : 'E-posta Adresi'}
              </label>
              <input 
                type={loginMethod === 'demo' ? 'text' : 'email'} 
                required
                placeholder={loginMethod === 'demo' ? "admin" : "ornek@rostrumakademi.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-border-accent rounded-xl p-3 text-sm text-text-primary placeholder:text-text-dim outline-none focus:border-brand transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide flex items-center gap-1">
                <Lock size={12} className="text-text-dim" /> Şifre
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-2 border border-border-accent rounded-xl p-3 text-sm text-text-primary placeholder:text-text-dim outline-none focus:border-brand transition"
              />
            </div>

            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full bg-brand hover:bg-brand/90 text-bg font-extrabold text-sm py-3.5 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Giriş Yapılıyor...' : <>Giriş Yap <Sparkles size={16} /></>}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-border-accent text-center text-[10px] text-text-dim flex items-center justify-center gap-1">
            <HelpCircle size={12} />
            <span>Sürüm v2.1.0 • Supabase Güvenlik Altyapısı</span>
          </div>
        </div>
      </div>
    )
  }

  // Render Admin App Shell
  return (
    <div className="min-h-screen bg-bg text-text-primary flex selection:bg-brand selection:text-bg">
      {/* SIDEBAR - DESKTOP */}
      <aside className="w-64 bg-surface-1 border-r border-border-accent flex-col fixed inset-y-0 left-0 z-30 hidden lg:flex">
        {/* Brand Header */}
        <div className="p-6 border-b border-border-accent">
          <div className="text-lg font-black tracking-tight text-text-primary">
            ROSTRUM<span className="text-brand">AKADEMİ</span>
          </div>
          <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider block mt-1">
            Yönetim Arayüzü
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider px-3 mb-2">Ana Menü</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'dashboard' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <LayoutDashboard size={16} /> Genel Bakış (Dashboard)
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <Users size={16} /> Kullanıcı & Rol Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('matching')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'matching' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <TrendingUp size={16} /> Eşleştirme & Süreç Takibi
          </button>

          <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider px-3 pt-6 mb-2">Ayarlar & İçerik</p>
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'content' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <FileText size={16} /> İçerik & İletişim
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'settings' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <Settings size={16} /> Sistem & Ayarlar
          </button>
        </nav>

        {/* Sidebar Footer User Section */}
        <div className="p-4 border-t border-border-accent bg-surface-2/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-bg shrink-0 shadow-sm"
              style={{ backgroundColor: currentUser.color || '#f0a500' }}
            >
              {(currentUser.full_name || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">{currentUser.full_name}</p>
              <span className="text-[9px] text-brand font-semibold uppercase tracking-wider">
                {currentUser.role === 'developer' ? 'Süper Admin' : 'Kurumsal'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-text-dim hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            title="Güvenli Çıkış"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & SIDEBAR */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-surface-1 border-b border-border-accent z-40 flex items-center justify-between px-4">
        <div className="text-base font-black tracking-tight text-text-primary">
          ROSTRUM<span className="text-brand">AKADEMİ</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-mid hover:text-text-primary rounded-lg border border-border-accent bg-surface-2 transition"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          {/* Overlay */}
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
          {/* Sidebar Drawer */}
          <div className="w-64 bg-surface-1 border-r border-border-accent flex flex-col relative z-40 pt-16 h-full animate-slide-right">
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              <button 
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
                  activeTab === 'dashboard' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
                  activeTab === 'users' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <Users size={16} /> Kullanıcı Yönetimi
              </button>
              <button 
                onClick={() => { setActiveTab('matching'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
                  activeTab === 'matching' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <TrendingUp size={16} /> Eşleştirme & Takip
              </button>
              <button 
                onClick={() => { setActiveTab('content'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
                  activeTab === 'content' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <FileText size={16} /> İçerik & İletişim
              </button>
              <button 
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition ${
                  activeTab === 'settings' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                <Settings size={16} /> Sistem & Ayarlar
              </button>
            </nav>

            <div className="p-4 border-t border-border-accent bg-surface-2/45 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-bg shrink-0 shadow-sm"
                  style={{ backgroundColor: currentUser.color || '#f0a500' }}
                >
                  {(currentUser.full_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary truncate">{currentUser.full_name}</p>
                  <span className="text-[9px] text-brand font-semibold uppercase">
                    {currentUser.role === 'developer' ? 'Süper Admin' : 'Kurumsal'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="p-2 text-text-dim hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  )
}

export default App
