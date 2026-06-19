import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { 
  Megaphone, 
  MessageSquare, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  FileText, 
  Upload, 
  Link2,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  Clock,
  BookMarked
} from 'lucide-react'

export default function ContentManager({ currentUserId }) {
  const [activeSubTab, setActiveSubTab] = useState('announce') // 'announce', 'tickets', 'resources'
  const [announcements, setAnnouncements] = useState([])
  const [tickets, setTickets] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showAnnModal, setShowAnnModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showResModal, setShowResModal] = useState(false)
  const [selectedAnn, setSelectedAnn] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Forms
  const [annForm, setAnnForm] = useState({
    message: '',
    type: 'info',
    active: true,
    link: '',
    linkText: ''
  })
  const [ticketReply, setTicketReply] = useState('')
  const [ticketStatus, setTicketStatus] = useState('resolved')

  const [resForm, setResForm] = useState({
    name: '',
    publisher: '',
    examType: 'YKS',
    subject: 'Matematik',
    resourceType: 'book',
    active: true,
    testsRaw: '' // comma-separated or json like Test 1: 12, Test 2: 15
  })

  useEffect(() => {
    fetchData()
  }, [activeSubTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeSubTab === 'announce') {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
        setAnnouncements(data || [])
      }
      if (activeSubTab === 'tickets') {
        const { data } = await supabase
          .from('tickets')
          .select('*, user:user_id(full_name, role, email)')
          .order('created_at', { ascending: false })
        setTickets(data || [])
      }
      if (activeSubTab === 'resources') {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false })
        setResources(data || [])
      }
    } catch (err) {
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

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
      console.error('Failed to log audit:', err)
    }
  }

  // ANNOUNCEMENT ACTIONS
  const handleAnnSubmit = async (e) => {
    e.preventDefault()
    if (!annForm.message) return alert('Duyuru mesajı boş olamaz!')
    try {
      const payload = {
        message: annForm.message,
        type: annForm.type,
        active: annForm.active,
        link: annForm.link || null,
        link_text: annForm.linkText || null
      }

      if (selectedAnn) {
        const { error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', selectedAnn.id)
        if (error) throw error
        logAudit('Duyuru güncellendi', 'announcements', selectedAnn.id)
        alert('Duyuru başarıyla güncellendi.')
      } else {
        const { data, error } = await supabase
          .from('announcements')
          .insert(payload)
          .select()
        if (error) throw error
        logAudit('Yeni duyuru oluşturuldu', 'announcements', data[0].id)
        alert('Yeni duyuru başarıyla eklendi.')
      }

      setShowAnnModal(false)
      setSelectedAnn(null)
      setAnnForm({ message: '', type: 'info', active: true, link: '', linkText: '' })
      fetchData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  const toggleAnnActive = async (ann) => {
    const nextState = !ann.active
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ active: nextState })
        .eq('id', ann.id)
      if (error) throw error

      setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, active: nextState } : a))
      logAudit(nextState ? 'Duyuru aktif edildi' : 'Duyuru pasif edildi', 'announcements', ann.id)
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  const deleteAnn = async (id) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
      setAnnouncements(prev => prev.filter(a => a.id !== id))
      logAudit('Duyuru silindi', 'announcements', id)
      alert('Duyuru silindi.')
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  // SUPPORT TICKETS ACTIONS
  const handleSendTicketReply = async (e) => {
    e.preventDefault()
    if (!ticketReply.trim()) return alert('Cevap içeriği boş olamaz!')
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          reply: ticketReply,
          status: ticketStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTicket.id)
      
      if (error) throw error

      logAudit(`Destek talebi cevaplandı (${ticketStatus})`, 'tickets', selectedTicket.id)
      alert('Cevap gönderildi ve talep durumu güncellendi.')
      setShowReplyModal(false)
      setTicketReply('')
      setSelectedTicket(null)
      fetchData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  // RESOURCES ACTIONS
  const handleResSubmit = async (e) => {
    e.preventDefault()
    if (!resForm.name || !resForm.publisher) return alert('Kitap/Oynatma listesi ismi ve yayıncı zorunludur!')
    try {
      // Parse testsRaw: format "Test 1: 12, Test 2: 18" -> [{label: "Test 1", soru: 12}, ...]
      let testsJson = []
      if (resForm.testsRaw.trim()) {
        testsJson = resForm.testsRaw.split(',').map(item => {
          const parts = item.split(':')
          return {
            label: parts[0]?.trim() || 'Bölüm',
            soru: parseInt(parts[1]?.trim()) || 10
          }
        })
      } else {
        // seed with default tests
        testsJson = [
          { label: 'Test 1', soru: 12 },
          { label: 'Test 2', soru: 12 },
          { label: 'Test 3', soru: 12 }
        ]
      }

      const payload = {
        name: resForm.name,
        publisher: resForm.publisher,
        exam_type: resForm.examType,
        subject: resForm.subject,
        resource_type: resForm.resourceType,
        active: resForm.active,
        tests: testsJson
      }

      const { data, error } = await supabase
        .from('resources')
        .insert(payload)
        .select()
      
      if (error) throw error

      logAudit(`Yeni kaynak eklendi: ${resForm.name}`, 'resources', data[0].id)
      alert('Kaynak başarıyla kütüphaneye eklendi.')
      setShowResModal(false)
      setResForm({ name: '', publisher: '', examType: 'YKS', subject: 'Matematik', resourceType: 'book', active: true, testsRaw: '' })
      fetchData()
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  const deleteResource = async (id) => {
    if (!confirm('Bu kaynağı silmek istediğinizden emin misiniz?')) return
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id)
      if (error) throw error
      setResources(prev => prev.filter(r => r.id !== id))
      logAudit('Kaynak kütüphaneden silindi', 'resources', id)
      alert('Kaynak silindi.')
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-400 border border-red-500/20'
      case 'normal': return 'bg-brand/10 text-brand border border-brand/20'
      case 'low': return 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
      default: return 'bg-text-dim/10 text-text-mid'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Sub tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">İçerik ve İletişim Yönetimi</h1>
          <p className="text-sm text-text-mid">Duyuruları düzenleyin, destek biletlerini yanıtlayın ve eğitim materyallerini yönetin.</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl border border-border-accent shrink-0">
          <button 
            onClick={() => { setActiveSubTab('announce'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'announce' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Megaphone size={14} /> Duyurular
          </button>
          <button 
            onClick={() => { setActiveSubTab('tickets'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 relative ${
              activeSubTab === 'tickets' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <MessageSquare size={14} /> Destek Talepleri
            {tickets.filter(t => t.status === 'open').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {tickets.filter(t => t.status === 'open').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveSubTab('resources'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'resources' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <BookOpen size={14} /> Kaynak Kütüphanesi
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENT TAB */}
      {activeSubTab === 'announce' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-surface-1 border border-border-accent rounded-xl p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Yayındaki Duyurular & Bannerlar</h3>
              <p className="text-xs text-text-mid">Mobil ve web uygulamalarının en üstünde görünecek duyuru çubukları.</p>
            </div>
            <button 
              onClick={() => { setSelectedAnn(null); setAnnForm({ message: '', type: 'info', active: true, link: '', linkText: '' }); setShowAnnModal(true); }}
              className="bg-brand hover:bg-brand/90 text-bg text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5"
            >
              <Plus size={14} /> Duyuru Oluştur
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-mid text-sm">Veriler yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="bg-surface-1 border border-border-accent rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-border-accent-hover transition shadow-md">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                          ann.type === 'warning' ? 'bg-brand/10 text-brand border border-brand/20' :
                          ann.type === 'success' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                          'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                        }`}>
                          {ann.type === 'info' ? 'Bilgilendirme' : ann.type === 'warning' ? 'Önemli Uyarı' : 'Kampanya / Başarı'}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-text-dim font-medium">
                          <Clock size={12} /> {new Date(ann.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <p className="text-xs text-text-primary font-medium leading-relaxed">{ann.message}</p>
                      {ann.link && (
                        <div className="flex items-center gap-1 text-[10px] text-brand hover:underline font-bold">
                          <Link2 size={12} />
                          <a href={ann.link} target="_blank" rel="noreferrer">{ann.link_text || 'Detayları İncele'}</a>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center border-t border-border-accent/60 pt-3">
                      <button 
                        onClick={() => toggleAnnActive(ann)}
                        className={`text-xs font-bold transition ${
                          ann.active ? 'text-brand-green' : 'text-text-dim'
                        }`}
                      >
                        {ann.active ? '● Yayında (Aktif)' : '○ Gizlenmiş (Pasif)'}
                      </button>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setSelectedAnn(ann);
                            setAnnForm({
                              message: ann.message,
                              type: ann.type,
                              active: ann.active,
                              link: ann.link || '',
                              linkText: ann.link_text || ''
                            });
                            setShowAnnModal(true);
                          }}
                          className="p-1.5 bg-surface-2 hover:bg-surface-3 border border-border-accent text-text-mid hover:text-text-primary rounded-lg transition"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => deleteAnn(ann.id)}
                          className="p-1.5 bg-surface-2 hover:bg-surface-3 border border-border-accent text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 py-12 text-center text-text-dim text-xs">
                  Sistemde kayıtlı aktif duyuru bulunmuyor.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TICKETS TAB */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary">Destek Talepleri (Destek Ticket'ları)</h3>
            <p className="text-xs text-text-mid">Kullanıcılar tarafından iletilen sorunlar, öneriler ve idari destek istekleri.</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-mid text-sm">Veriler yükleniyor...</div>
          ) : (
            <div className="bg-surface-1 border border-border-accent rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Gönderen</th>
                      <th className="px-6 py-4">Konu</th>
                      <th className="px-6 py-4">Kategori / Öncelik</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-accent">
                    {tickets.length > 0 ? (
                      tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-surface-2/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-text-primary text-xs">{ticket.user?.full_name || 'Bilinmeyen Kullanıcı'}</div>
                            <div className="text-[10px] text-text-dim">
                              {ticket.user?.role === 'coach' ? 'Mentör' : 'Öğrenci'} • {ticket.user?.email || 'e-posta yok'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-text-primary text-xs truncate max-w-xs">{ticket.subject}</div>
                            <div className="text-[10px] text-text-dim truncate max-w-xs mt-0.5">{ticket.body}</div>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <div className="text-[10px] text-brand-purple font-semibold">{ticket.category || 'Genel Destek'}</div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority === 'high' ? 'Yüksek' : ticket.priority === 'normal' ? 'Normal' : 'Düşük'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ticket.status === 'open' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              ticket.status === 'resolved' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                              'bg-text-dim/10 text-text-mid border border-border-accent'
                            }`}>
                              {ticket.status === 'open' ? 'Açık (Bekliyor)' :
                               ticket.status === 'resolved' ? 'Çözüldü' : 'Kapatıldı'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-text-dim">
                            {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => { setSelectedTicket(ticket); setTicketReply(ticket.reply || ''); setTicketStatus(ticket.status || 'resolved'); setShowReplyModal(true); }}
                              className="bg-surface-2 hover:bg-surface-3 border border-border-accent text-xs font-semibold px-3 py-1.5 rounded-lg text-text-primary transition"
                            >
                              {ticket.reply ? 'Cevabı Düzenle' : 'Cevapla'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-text-dim text-xs">
                          Destek bilet talebi bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeSubTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-surface-1 border border-border-accent rounded-xl p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Soru Bankaları & Eğitim Kanalları Veritabanı</h3>
              <p className="text-xs text-text-mid">Mentörlerin öğrencilere ödev verirken seçtikleri piyasadaki aktif kaynak listesi.</p>
            </div>
            <button 
              onClick={() => { setResForm({ name: '', publisher: '', examType: 'YKS', subject: 'Matematik', resourceType: 'book', active: true, testsRaw: '' }); setShowResModal(true); }}
              className="bg-brand hover:bg-brand/90 text-bg text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5"
            >
              <Plus size={14} /> Yeni Kitap / Oynatma Listesi Ekle
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-mid text-sm">Veriler yükleniyor...</div>
          ) : (
            <div className="bg-surface-1 border border-border-accent rounded-xl p-4 shadow-lg space-y-3">
              <h3 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-2">Kayıtlı Yayınlar ({resources.length})</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.length > 0 ? (
                  resources.map((res) => (
                    <div key={res.id} className="bg-surface-2 border border-border-accent rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-border-accent-hover transition">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full">
                            {res.exam_type} • {res.subject}
                          </span>
                          <span className="text-[10px] text-text-dim flex items-center gap-1">
                            <BookMarked size={12} />
                            {res.resource_type === 'book' ? 'Soru Bankası' : 'Oynatma Listesi'}
                          </span>
                        </div>
                        <h4 className="font-bold text-text-primary text-sm mt-2">{res.name}</h4>
                        <p className="text-xs text-text-mid">{res.publisher}</p>
                      </div>

                      <div className="bg-surface-3 rounded-lg p-2.5 text-[11px] text-text-mid space-y-1">
                        <p className="font-bold text-[10px] text-text-dim uppercase">Test / Ders İçeriği</p>
                        <p className="text-text-primary text-xs">
                          {res.tests ? `${res.tests.length} Test/Bölüm` : '0 içerik'}
                        </p>
                        <div className="truncate text-[10px] text-text-dim">
                          {res.tests ? res.tests.map(t => `${t.label} (${t.soru} Soru)`).join(', ') : ''}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-border-accent/40 pt-2 mt-1">
                        <span className={`text-[10px] ${res.active ? 'text-brand-green' : 'text-text-dim'}`}>
                          {res.active ? '● Aktif' : '○ Pasif'}
                        </span>
                        <button 
                          onClick={() => deleteResource(res.id)}
                          className="p-1 hover:bg-red-500/10 text-text-dim hover:text-red-400 border border-transparent rounded transition"
                          title="Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-3 py-12 text-center text-text-dim text-xs">
                    Kütüphanede kayıtlı kaynak bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD/EDIT ANNOUNCEMENT */}
      {showAnnModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border-accent bg-surface-2">
              <h2 className="text-sm font-bold text-text-primary">{selectedAnn ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}</h2>
              <button onClick={() => setShowAnnModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleAnnSubmit} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Duyuru Mesajı *</label>
                <textarea 
                  required
                  placeholder="Duyuruyu yazın..."
                  value={annForm.message}
                  onChange={(e) => setAnnForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full h-24 bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Türü</label>
                  <select 
                    value={annForm.type}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="info">Bilgilendirme (Mavi)</option>
                    <option value="warning">Uyarı (Turuncu)</option>
                    <option value="success">Başarı / İndirim (Yeşil)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Durum</label>
                  <select 
                    value={annForm.active ? 'true' : 'false'}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, active: e.target.value === 'true' }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="true">Aktif (Yayınla)</option>
                    <option value="false">Taslak (Pasif)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Link URL (Opsiyonel)</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={annForm.link}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Link Buton Metni</label>
                  <input 
                    type="text" 
                    placeholder="Detaylar →"
                    value={annForm.linkText}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, linkText: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition"
              >
                Duyuruyu Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TICKET REPLY */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border-accent bg-surface-2">
              <h2 className="text-sm font-bold text-text-primary">Destek Talebi Cevaplama</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleSendTicketReply} className="p-4 space-y-4">
              <div className="bg-surface-2 border border-border-accent rounded-lg p-3 space-y-2 text-xs">
                <p className="font-bold text-brand uppercase text-[10px]">Kullanıcı Mesajı</p>
                <div className="text-text-mid">
                  <span className="font-semibold text-text-primary">{selectedTicket.user?.full_name}</span>: {selectedTicket.body}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yanıtınız *</label>
                <textarea 
                  required
                  placeholder="Kullanıcıya iletilecek cevap yazısı..."
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  className="w-full h-32 bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yeni Durum</label>
                <select 
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                >
                  <option value="resolved">✅ Çözüldü Olarak İşaretle</option>
                  <option value="closed">🔒 Kapat (Pasif Et)</option>
                  <option value="open">⏳ Açık Bırak</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition"
              >
                Cevabı Gönder & Durumu Güncelle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RESOURCE */}
      {showResModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border-accent bg-surface-2">
              <h2 className="text-sm font-bold text-text-primary">Yeni Kitap / Kaynak Ekle</h2>
              <button onClick={() => setShowResModal(false)} className="text-text-dim hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={handleResSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Kaynak Adı *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="AYT Matematik Soru Bankası"
                    value={resForm.name}
                    onChange={(e) => setResForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yayıncı *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Karakök Yayınları"
                    value={resForm.publisher}
                    onChange={(e) => setResForm(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Sınav Türü</label>
                  <select 
                    value={resForm.examType}
                    onChange={(e) => setResForm(prev => ({ ...prev, examType: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="YKS">YKS</option>
                    <option value="LGS">LGS</option>
                    <option value="KPSS">KPSS</option>
                    <option value="ALES">ALES</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Ders / Konu</label>
                  <input 
                    type="text" 
                    placeholder="Matematik, Fizik, Türkçe..."
                    value={resForm.subject}
                    onChange={(e) => setResForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Kaynak Türü</label>
                  <select 
                    value={resForm.resourceType}
                    onChange={(e) => setResForm(prev => ({ ...prev, resourceType: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="book">Soru Bankası Kitabı</option>
                    <option value="playlist">YouTube Video Oynatma Listesi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Yayın Durumu</label>
                  <select 
                    value={resForm.active ? 'true' : 'false'}
                    onChange={(e) => setResForm(prev => ({ ...prev, active: e.target.value === 'true' }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2 text-xs text-text-primary focus:border-brand outline-none"
                  >
                    <option value="true">Aktif (Seçilebilir)</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">
                  Bölüm / Testler Listesi (Virgülle Ayırın)
                </label>
                <textarea 
                  placeholder="Örn: Test 1:12, Test 2:10, Test 3:15"
                  value={resForm.testsRaw}
                  onChange={(e) => setResForm(prev => ({ ...prev, testsRaw: e.target.value }))}
                  className="w-full h-20 bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none resize-none"
                />
                <span className="text-[9px] text-text-dim">Format: "Başlık:SoruSayısı" şeklinde yazın ve her testi virgülle ayırın.</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition"
              >
                Kaynağı Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
