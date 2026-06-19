import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { 
  Search, 
  UserPlus, 
  Key, 
  Trash2, 
  Shield, 
  Mail, 
  Phone,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  Check,
  X,
  UserCheck
} from 'lucide-react'

export default function UserManagement({ currentUserId }) {
  const [activeSubTab, setActiveSubTab] = useState('users') // 'users' or 'leads'
  const [users, setUsers] = useState([])
  const [leads, setLeads] = useState([])
  const [coaches, setCoaches] = useState([]) // for student mentor assignment dropdown
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [leadFilter, setLeadFilter] = useState('all')

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)

  // Forms
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    role: 'coach',
    examProfile: 'YKS',
    coachId: '',
    target: 'Hedef belirtilmemiş',
    color: '#f0a500'
  })
  const [resetPasswordVal, setResetPasswordVal] = useState('')
  const [leadNotes, setLeadNotes] = useState('')
  const [leadStatus, setLeadStatus] = useState('pending')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [uRes, lRes] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false })
      ])

      if (uRes.data) {
        setUsers(uRes.data)
        setCoaches(uRes.data.filter(u => u.role === 'coach'))
      }
      if (lRes.data) {
        setLeads(lRes.data)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper to log audit actions
  const logAudit = async (action, targetType, targetId) => {
    try {
      await supabase.from('audit_logs').insert({
        admin_id: currentUserId || null,
        action,
        target_type: targetType,
        target_id: targetId,
        ip_address: 'System (Web Panel)'
      })
    } catch (err) {
      console.error('Failed to log audit action:', err)
    }
  }

  // Suspend / Activate Account
  const toggleUserActive = async (user) => {
    const nextState = !(user.active !== false)
    try {
      const { error } = await supabase
        .from('users')
        .update({ active: nextState })
        .eq('id', user.id)

      if (error) throw error

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: nextState } : u))
      logAudit(
        nextState ? 'Kullanıcı hesabı aktif edildi' : 'Kullanıcı hesabı askıya alındı',
        'users',
        user.id
      )
      alert(`Kullanıcı başarıyla ${nextState ? 'aktif edildi' : 'askıya alındı'}.`)
    } catch (err) {
      alert('İşlem başarısız: ' + err.message)
    }
  }

  // Password Reset
  const handlePasswordReset = async () => {
    if (!resetPasswordVal.trim()) return alert('Parola boş olamaz!')
    try {
      const { data, error } = await supabase.rpc('update_auth_user_password', {
        p_user_id: selectedUser.id,
        p_new_password: resetPasswordVal
      })

      if (error) throw error

      logAudit('Kullanıcı parolası güncellendi (RPC)', 'users', selectedUser.id)
      alert('Kullanıcı parolası başarıyla sıfırlandı.')
      setShowResetModal(false)
      setResetPasswordVal('')
    } catch (err) {
      alert('Sıfırlama başarısız: ' + err.message)
    }
  }

  // Delete User
  const handleDeleteUser = async (userId, fullName) => {
    if (!confirm(`${fullName} isimli kullanıcıyı tamamen silmek istediğinizden emin misiniz?`)) return
    try {
      // First delete from auth.users (requires DB level or RPC since admin client is restricted, but deleting from public.users is supported and might set null/cascade)
      const { error } = await supabase.from('users').delete().eq('id', userId)
      if (error) throw error

      setUsers(prev => prev.filter(u => u.id !== userId))
      logAudit('Kullanıcı silindi', 'users', userId)
      alert('Kullanıcı başarıyla silindi.')
    } catch (err) {
      alert('Silme başarısız: ' + err.message)
    }
  }

  // Create New User (via RPC)
  const handleCreateUser = async (e) => {
    e.preventDefault()
    const { email, password, fullName, username, role, target, color, examProfile, coachId } = newUserForm
    if (!email || !password || !fullName || !username) {
      return alert('Lütfen tüm zorunlu alanları doldurun!')
    }

    try {
      const { data: userId, error } = await supabase.rpc('create_new_user', {
        p_email: email,
        p_password: password,
        p_full_name: fullName,
        p_username: username.toLowerCase().trim(),
        p_role: role,
        p_target: target,
        p_color: color,
        p_progress: 0,
        p_week_start: 0,
        p_coach_id: role === 'student' && coachId ? coachId : null,
        p_institution_id: null,
        p_exam_profile: examProfile
      })

      if (error) throw error

      // If coach account, auto-generate workspace
      if (role === 'coach') {
        await supabase.from('workspaces').insert({
          coach_id: userId,
          brand_name: `${fullName} Akademi`,
          brand_color: color
        })
      }

      logAudit(`Yeni kullanıcı oluşturuldu (Rol: ${role})`, 'users', userId)
      alert('Kullanıcı başarıyla oluşturuldu!')
      setShowAddModal(false)
      setNewUserForm({
        email: '',
        password: '',
        fullName: '',
        username: '',
        role: 'coach',
        examProfile: 'YKS',
        coachId: '',
        target: 'Hedef belirtilmemiş',
        color: '#f0a500'
      })
      fetchData()
    } catch (err) {
      alert('Kullanıcı oluşturulamadı: ' + err.message)
    }
  }

  // Update Lead Status (e.g. Approved/Rejected/Contacted)
  const updateLeadStatus = async (lead, nextStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: nextStatus })
        .eq('id', lead.id)
      
      if (error) throw error

      // Auto-create account if status set to approved
      if (nextStatus === 'approved') {
        const username = lead.first_name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100)
        const password = 'Koc' + Math.floor(1000 + Math.random() * 9000)

        // Create coach via RPC
        const { data: userId, error: rpcErr } = await supabase.rpc('create_new_user', {
          p_email: lead.email,
          p_password: password,
          p_full_name: `${lead.first_name} ${lead.last_name || ''}`,
          p_username: username,
          p_role: 'coach',
          p_target: 'Hedef belirtilmemiş',
          p_color: '#f0a500',
          p_progress: 0,
          p_week_start: 0,
          p_coach_id: null,
          p_institution_id: null,
          p_exam_profile: 'YKS'
        })

        if (rpcErr) throw rpcErr

        // Create workspace
        await supabase.from('workspaces').insert({
          coach_id: userId,
          brand_name: lead.brand_name || `${lead.first_name} Akademi`,
          brand_color: '#f0a500'
        })

        // Update lead notes with generated credentials
        const updatedNotes = `Hesap başarıyla oluşturuldu.\nKullanıcı Adı: ${username}\nGeçici Şifre: ${password}\n\n${lead.notes || ''}`
        await supabase.from('leads').update({ notes: updatedNotes }).eq('id', lead.id)

        logAudit('Başvuru onaylandı ve koç hesabı kuruldu', 'leads', lead.id)
        alert(`Başvuru onaylandı!\n\nKullanıcı Adı: ${username}\nŞifre: ${password}\n\nLütfen bu bilgileri koça iletin.`)
      } else {
        logAudit(`Başvuru durumu güncellendi: ${nextStatus}`, 'leads', lead.id)
      }

      fetchData()
      setShowLeadDetailModal(false)
    } catch (err) {
      alert('Başvuru güncellenirken hata oluştu: ' + err.message)
    }
  }

  // Update Lead Details from Modal
  const saveLeadDetail = async () => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          status: leadStatus,
          notes: leadNotes
        })
        .eq('id', selectedLead.id)

      if (error) throw error

      if (leadStatus === 'approved' && selectedLead.status !== 'approved') {
        // Run full approval flow if state transitions to approved
        await updateLeadStatus(selectedLead, 'approved')
      } else {
        alert('Değişiklikler kaydedildi.')
        fetchData()
        setShowLeadDetailModal(false)
      }
    } catch (err) {
      alert('Kaydetme başarısız: ' + err.message)
    }
  }

  // Filters logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    if (roleFilter === 'all') return matchesSearch
    return matchesSearch && u.role === roleFilter
  })

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    if (leadFilter === 'all') return matchesSearch
    return matchesSearch && l.status === leadFilter
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'developer': return 'bg-red-500/10 text-red-400 border border-red-500/20'
      case 'institution': return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
      case 'coach': return 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
      case 'student': return 'bg-brand/10 text-brand border border-brand/20'
      default: return 'bg-text-dim/10 text-text-mid'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'developer': return 'Süper Admin'
      case 'institution': return 'Kurumsal (Moderatör)'
      case 'coach': return 'Mentör (Koç)'
      case 'student': return 'Öğrenci'
      default: return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Sub Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Kullanıcı ve Rol Yönetimi</h1>
          <p className="text-sm text-text-mid">Sistem kullanıcılarını ve üyelik başvurularını yönetin.</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl border border-border-accent shrink-0">
          <button 
            onClick={() => { setActiveSubTab('users'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'users' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            Aktif Kullanıcılar ({users.length})
          </button>
          <button 
            onClick={() => { setActiveSubTab('leads'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition relative ${
              activeSubTab === 'leads' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            Başvurular
            {leads.filter(l => l.status === 'pending').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {leads.filter(l => l.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-1 border border-border-accent rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-md">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-dim">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder={activeSubTab === 'users' ? "İsim, e-posta veya kullanıcı adı ara..." : "İsim, okul adı veya e-posta ara..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-border-accent rounded-lg text-sm text-text-primary focus:border-brand outline-none transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {activeSubTab === 'users' ? (
            <div className="flex items-center gap-1.5 w-full justify-end">
              <Filter size={14} className="text-text-dim shrink-0" />
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2.5 text-text-mid focus:border-brand outline-none"
              >
                <option value="all">Tüm Roller</option>
                <option value="developer">Süper Admin</option>
                <option value="institution">Kurumsal Moderatör</option>
                <option value="coach">Mentör (Koç)</option>
                <option value="student">Öğrenci</option>
              </select>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-brand hover:bg-brand/90 text-bg text-xs font-bold px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0"
              >
                <UserPlus size={14} /> Yeni Kullanıcı
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 w-full justify-end">
              <Filter size={14} className="text-text-dim shrink-0" />
              <select 
                value={leadFilter} 
                onChange={(e) => setLeadFilter(e.target.value)}
                className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2.5 text-text-mid focus:border-brand outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">⏳ Bekleyen</option>
                <option value="contacted">📞 İletişimde</option>
                <option value="approved">✅ Onaylanan</option>
                <option value="rejected">❌ Reddedilen</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-12 text-text-mid text-sm">Veriler yükleniyor...</div>
      ) : activeSubTab === 'users' ? (
        /* Users List Tab */
        <div className="bg-surface-1 border border-border-accent rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Kullanıcı Bilgisi</th>
                  <th className="px-6 py-4">İletişim</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Profil</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-accent">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-2/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-bg shrink-0 shadow-sm"
                            style={{ backgroundColor: u.color || '#f0a500' }}
                          >
                            {(u.full_name || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-text-primary">{u.full_name}</div>
                            <div className="text-xs text-text-dim">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-text-mid text-xs flex items-center gap-1.5">
                          <Mail size={12} className="text-text-dim" />
                          {u.email || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadgeColor(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-mid font-medium">
                        {u.role === 'student' ? (
                          u.exam_profile ? `${u.exam_profile} Profili` : 'YKS'
                        ) : u.role === 'coach' ? (
                          'Mentör'
                        ) : 'Yönetici'}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleUserActive(u)}
                          className="flex items-center gap-1.5 transition text-xs"
                        >
                          {u.active !== false ? (
                            <span className="text-brand-green font-bold flex items-center gap-1">
                              <ToggleRight size={20} className="text-brand-green" /> Aktif
                            </span>
                          ) : (
                            <span className="text-text-dim flex items-center gap-1">
                              <ToggleLeft size={20} className="text-text-dim" /> Askıda
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => { setSelectedUser(u); setShowResetModal(true); }}
                            className="p-1.5 bg-surface-2 border border-border-accent hover:border-brand-purple/40 text-brand-purple hover:bg-brand-purple/10 rounded-lg transition"
                            title="Şifre Sıfırla"
                          >
                            <Key size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.full_name)}
                            className="p-1.5 bg-surface-2 border border-border-accent hover:border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-text-dim text-xs">
                      Aranan kriterlere uygun kullanıcı bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leads Tab */
        <div className="bg-surface-1 border border-border-accent rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Koç / Marka Adı</th>
                  <th className="px-6 py-4">İletişim Bilgileri</th>
                  <th className="px-6 py-4">Plan / Öğrenci</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Başvuru Tarihi</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-accent">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-2/40 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-text-primary">{l.first_name} {l.last_name}</div>
                          <div className="text-xs text-brand font-medium">{l.brand_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-text-mid space-y-0.5">
                          <p className="flex items-center gap-1.5">
                            <Mail size={12} className="text-text-dim" /> {l.email}
                          </p>
                          {l.phone && (
                            <p className="flex items-center gap-1.5 text-text-dim">
                              <Phone size={12} className="text-text-dim" /> {l.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-text-mid">
                          <span className="font-bold text-brand-purple">{l.plan?.toUpperCase() || 'PRO'}</span>
                          <span className="text-text-dim"> • {l.student_count || 0} Öğrenci</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          l.status === 'pending' ? 'bg-brand/10 text-brand border border-brand/20' :
                          l.status === 'approved' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                          l.status === 'contacted' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                          'bg-text-dim/10 text-text-dim'
                        }`}>
                          {l.status === 'pending' ? '⏳ Bekliyor' :
                           l.status === 'approved' ? '✅ Onaylandı' :
                           l.status === 'contacted' ? '📞 Görüşüldü' : '❌ Reddedildi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-dim">
                        {new Date(l.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => { 
                              setSelectedLead(l); 
                              setLeadNotes(l.notes || ''); 
                              setLeadStatus(l.status);
                              setShowLeadDetailModal(true); 
                            }}
                            className="bg-surface-2 hover:bg-surface-3 border border-border-accent text-xs px-3 py-1.5 rounded-lg transition font-medium text-text-primary"
                          >
                            Detay
                          </button>
                          {l.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateLeadStatus(l, 'approved')}
                                className="p-1.5 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-lg hover:bg-brand-green/20 transition"
                                title="Onayla & Hesap Kur"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => updateLeadStatus(l, 'rejected')}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                                title="Reddet"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-text-dim text-xs">
                      Kayıtlı başvuru bulunmamuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-5 border-b border-border-accent bg-surface-2">
              <h2 className="text-base font-extrabold text-text-primary">Yeni Kullanıcı Hesabı Ekle</h2>
              <button onClick={() => setShowAddModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Ad Soyad *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ahmet Yılmaz"
                    value={newUserForm.fullName}
                    onChange={(e) => {
                      const val = e.target.value
                      const userGen = val.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
                      setNewUserForm(prev => ({ ...prev, fullName: val, username: userGen }))
                    }}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Kullanıcı Adı *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ahmtylmz"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">E-posta Adresi *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="ahmet@rostrumakademi.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Giriş Parolası *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Şifre belirleyin"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Sistem Rolü</label>
                  <select 
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="coach">Mentör (Koç)</option>
                    <option value="student">Öğrenci</option>
                    <option value="institution">Kurumsal Yönetici</option>
                    <option value="developer">Süper Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Arayüz Rengi</label>
                  <input 
                    type="color" 
                    value={newUserForm.color}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg h-9 text-xs text-text-primary focus:border-brand outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Student Specific Fields */}
              {newUserForm.role === 'student' && (
                <div className="grid grid-cols-2 gap-4 border-t border-border-accent pt-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand uppercase tracking-wide">Sınav Profili</label>
                    <select 
                      value={newUserForm.examProfile}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, examProfile: e.target.value }))}
                      className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                    >
                      <option value="YKS">YKS (TYT/AYT)</option>
                      <option value="LGS">LGS</option>
                      <option value="KPSS">KPSS</option>
                      <option value="ALES">ALES</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand uppercase tracking-wide">Mentör Ataması</label>
                    <select 
                      value={newUserForm.coachId}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, coachId: e.target.value }))}
                      className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                    >
                      <option value="">Atama Yapma (Boş bırak)</option>
                      {coaches.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-3 rounded-lg transition"
              >
                Kullanıcı Hesabını Aktif Et & Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border-accent bg-surface-2">
              <h2 className="text-sm font-bold text-text-primary">Parola Sıfırla: {selectedUser?.full_name}</h2>
              <button onClick={() => setShowResetModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yeni Güvenli Parola</label>
                <input 
                  type="text" 
                  placeholder="Minimum 6 karakter belirleyin"
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                />
              </div>
              <button 
                onClick={handlePasswordReset}
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition"
              >
                Parolayı Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LEAD DETAILS */}
      {showLeadDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border-accent bg-surface-2">
              <h2 className="text-sm font-bold text-text-primary">Başvuru Detayları</h2>
              <button onClick={() => setShowLeadDetailModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">İsim</p>
                  <p className="font-bold text-text-primary mt-0.5">{selectedLead.first_name} {selectedLead.last_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">Marka / Akademi</p>
                  <p className="font-bold text-brand mt-0.5">{selectedLead.brand_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">E-posta</p>
                  <p className="font-bold text-text-primary mt-0.5 break-all">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">Telefon</p>
                  <p className="font-bold text-text-primary mt-0.5">{selectedLead.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">Plan</p>
                  <p className="font-bold text-brand-purple mt-0.5">{selectedLead.plan?.toUpperCase() || 'PRO'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-dim font-semibold uppercase">Öğrenci Sayısı</p>
                  <p className="font-bold text-text-primary mt-0.5">{selectedLead.student_count || 0}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yönetici Notları (İç Log)</label>
                <textarea 
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full h-24 bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none resize-none"
                  placeholder="Görüşme notları, hesap detayları..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Başvuru Durumu</label>
                <select 
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                >
                  <option value="pending">⏳ Bekliyor</option>
                  <option value="contacted">📞 İletişimde</option>
                  <option value="approved">✅ Onaylandı & Koç Hesabı Kur</option>
                  <option value="rejected">❌ Reddedildi</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={saveLeadDetail}
                  className="flex-1 bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition"
                >
                  Değişiklikleri Kaydet
                </button>
                <a 
                  href={`mailto:${selectedLead.email}?subject=Rostrum Akademi Başvurusu&body=Merhaba ${selectedLead.first_name},`}
                  className="px-4 bg-surface-2 border border-border-accent hover:bg-surface-3 text-text-mid hover:text-text-primary text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center"
                >
                  E-posta Gönder
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
