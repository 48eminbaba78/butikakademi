import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { 
  UserPlus, 
  Users, 
  Calendar, 
  Clipboard, 
  Search, 
  MapPin, 
  Trash2, 
  Clock, 
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react'

export default function MatchingTracker({ currentUserId }) {
  const [activeSubTab, setActiveSubTab] = useState('match') // 'match', 'calendar', 'reports'
  const [students, setStudents] = useState([])
  const [coaches, setCoaches] = useState([])
  const [appointments, setAppointments] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [mentorFilter, setMentorFilter] = useState('all')

  // Selections
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [targetCoachId, setTargetCoachId] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeSubTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 1. Fetch all users for students and coaches
      const { data: usersData } = await supabase.from('users').select('*')
      if (usersData) {
        const studList = usersData.filter(u => u.role === 'student')
        const coachList = usersData.filter(u => u.role === 'coach')
        setStudents(studList)
        setCoaches(coachList)
      }

      // 2. Fetch based on selected sub tab to optimize
      if (activeSubTab === 'calendar') {
        const { data: appts } = await supabase
          .from('appointments')
          .select('*, student:student_id(full_name, email), coach:coach_id(full_name)')
          .order('date', { ascending: false })
          .order('time', { ascending: false })
        setAppointments(appts || [])
      }

      if (activeSubTab === 'reports') {
        // Fetch appointments notes
        const { data: apptNotes } = await supabase
          .from('appointments')
          .select('id, date, note, student:student_id(full_name), coach:coach_id(full_name)')
          .not('note', 'is', null)
          .neq('note', '')
        
        // Fetch exam comments
        const { data: examComments } = await supabase
          .from('exams')
          .select('id, date, name, coach_comment, student:student_id(full_name), coach:coach_id(full_name)')
          .not('coach_comment', 'is', null)
          .neq('coach_comment', '')

        // Format and merge reports
        const list = []
        if (apptNotes) {
          apptNotes.forEach(an => {
            list.push({
              id: `appt-${an.id}`,
              type: 'Görüşme Notu',
              title: 'Haftalık Seans Görüşmesi',
              date: an.date,
              student: an.student?.full_name || 'Bilinmeyen Öğrenci',
              coach: an.coach?.full_name || 'Bilinmeyen Mentör',
              content: an.note
            })
          })
        }
        if (examComments) {
          examComments.forEach(ec => {
            list.push({
              id: `exam-${ec.id}`,
              type: 'Deneme Yorumu',
              title: `${ec.name} Denemesi`,
              date: ec.date,
              student: ec.student?.full_name || 'Bilinmeyen Öğrenci',
              coach: ec.coach?.full_name || 'Bilinmeyen Mentör',
              content: ec.coach_comment
            })
          })
        }

        // Sort by date descending
        list.sort((a, b) => new Date(b.date) - new Date(a.date))
        setReports(list)
      }
    } catch (err) {
      console.error('Error fetching tracker data:', err)
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

  // Handle Assign Mentor
  const handleAssignMentor = async (studentId, coachId, coachName, studentName) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ coach_id: coachId || null })
        .eq('id', studentId)

      if (error) throw error

      logAudit(
        coachId ? `Öğrenci mentöre atandı: ${studentName} -> ${coachName}` : `Öğrenci mentör ataması kaldırıldı: ${studentName}`,
        'users',
        studentId
      )

      alert('Atama başarıyla güncellendi.')
      setSelectedStudent(null)
      setTargetCoachId('')
      fetchData()
    } catch (err) {
      alert('Eşleştirme hatası: ' + err.message)
    }
  }

  // Update Appointment Status
  const handleUpdateMeetingStatus = async (apptId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', apptId)
      
      if (error) throw error

      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a))
      logAudit(`Görüşme durumu güncellendi: ${newStatus}`, 'appointments', apptId)
      alert('Görüşme durumu güncellendi.')
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  // Filtering matching lists
  const unassignedStudents = students.filter(s => !s.coach_id && (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const assignedStudents = students.filter(s => {
    if (!s.coach_id) return false
    const matchesSearch = (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    if (mentorFilter === 'all') return matchesSearch
    return matchesSearch && s.coach_id === mentorFilter
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and sub tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Eşleştirme ve Süreç Takibi</h1>
          <p className="text-sm text-text-mid">Öğrencilerin koç atamalarını yapın, seans notlarını ve takvimi yönetin.</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl border border-border-accent shrink-0">
          <button 
            onClick={() => { setActiveSubTab('match'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'match' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Users size={14} /> Eşleştirmeler
          </button>
          <button 
            onClick={() => { setActiveSubTab('calendar'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'calendar' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Calendar size={14} /> Görüşme Takvimi
          </button>
          <button 
            onClick={() => { setActiveSubTab('reports'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'reports' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Clipboard size={14} /> Seans Notları & Raporlar
          </button>
        </div>
      </div>

      {/* MATCHING TAB */}
      {activeSubTab === 'match' && (
        <div className="space-y-6">
          {/* Dashboard Summary Mini Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-1 border border-border-accent rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Eşleşmiş Öğrenciler</p>
                <h4 className="text-xl font-black text-text-primary mt-0.5">{students.filter(s => s.coach_id).length}</h4>
              </div>
            </div>
            <div className="bg-surface-1 border border-border-accent rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-2.5 bg-brand/10 text-brand rounded-lg">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Mentör Bekleyenler</p>
                <h4 className="text-xl font-black text-brand mt-0.5">{students.filter(s => !s.coach_id).length}</h4>
              </div>
            </div>
            <div className="bg-surface-1 border border-border-accent rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Toplam Mentör</p>
                <h4 className="text-xl font-black text-text-primary mt-0.5">{coaches.length}</h4>
              </div>
            </div>
          </div>

          {/* Unassigned Students Section */}
          {unassignedStudents.length > 0 && (
            <div className="bg-surface-1 border border-red-500/20 rounded-xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-red-200 flex items-center gap-2">
                <AlertCircle size={16} className="text-brand" /> Atama Bekleyen Yeni Öğrenciler ({unassignedStudents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {unassignedStudents.map(student => (
                  <div key={student.id} className="bg-surface-2 border border-border-accent rounded-lg p-4 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{student.full_name}</h4>
                      <p className="text-xs text-text-dim">@{student.username} • {student.email}</p>
                      <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-brand/10 text-brand rounded-full">
                        {student.exam_profile || 'YKS'} Öğrencisi
                      </span>
                    </div>
                    <div>
                      {selectedStudent?.id === student.id ? (
                        <div className="space-y-2 animate-fade-in">
                          <select 
                            value={targetCoachId}
                            onChange={(e) => setTargetCoachId(e.target.value)}
                            className="w-full bg-surface-3 border border-border-accent rounded-lg p-2 text-xs text-text-primary outline-none focus:border-brand"
                          >
                            <option value="">Koç Seçin...</option>
                            {coaches.map(c => (
                              <option key={c.id} value={c.id}>{c.full_name}</option>
                            ))}
                          </select>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => {
                                const c = coaches.find(co => co.id === targetCoachId)
                                handleAssignMentor(student.id, targetCoachId, c ? c.full_name : '', student.full_name)
                              }}
                              disabled={!targetCoachId}
                              className="flex-1 bg-brand-green text-bg font-bold py-1.5 rounded text-xs transition disabled:opacity-50"
                            >
                              Kaydet
                            </button>
                            <button 
                              onClick={() => setSelectedStudent(null)}
                              className="bg-surface-3 border border-border-accent px-2.5 py-1.5 rounded text-xs text-text-mid"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setSelectedStudent(student); setTargetCoachId(''); }}
                          className="w-full bg-brand text-bg text-xs font-bold py-2 rounded-lg transition"
                        >
                          Mentör Ataması Yap
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Students Directory */}
          <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <h3 className="text-sm font-bold text-text-primary">Eşleşme Rehberi (Aktif Eşleşmeler)</h3>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Eşleşmiş öğrenci ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2 text-text-primary focus:border-brand outline-none"
                />
                <select 
                  value={mentorFilter} 
                  onChange={(e) => setMentorFilter(e.target.value)}
                  className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2 text-text-mid focus:border-brand outline-none"
                >
                  <option value="all">Tüm Mentörler</option>
                  {coaches.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                    <th className="px-6 py-3">Öğrenci</th>
                    <th className="px-6 py-3">Sınav Profili</th>
                    <th className="px-6 py-3">Atanmış Mentör (Koç)</th>
                    <th className="px-6 py-3">Eşleşme Durumu</th>
                    <th className="px-6 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-accent">
                  {assignedStudents.length > 0 ? (
                    assignedStudents.map((student) => {
                      const coach = coaches.find(c => c.id === student.coach_id)
                      return (
                        <tr key={student.id} className="hover:bg-surface-2/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-text-primary">{student.full_name}</div>
                            <div className="text-xs text-text-dim">@{student.username} • {student.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full border border-brand-blue/20">
                              {student.exam_profile || 'YKS'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {coach ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-xs">
                                  {coach.full_name[0].toUpperCase()}
                                </div>
                                <span className="font-bold text-text-primary text-xs">{coach.full_name}</span>
                              </div>
                            ) : (
                              <span className="text-text-dim text-xs">Atanmamış</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">
                              Eşleşti
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {selectedStudent?.id === student.id ? (
                              <div className="flex items-center gap-1.5 justify-end animate-fade-in">
                                <select 
                                  value={targetCoachId}
                                  onChange={(e) => setTargetCoachId(e.target.value)}
                                  className="bg-surface-3 border border-border-accent rounded p-1 text-xs text-text-primary outline-none focus:border-brand"
                                >
                                  <option value="">Mentör Değiştir...</option>
                                  {coaches.map(c => (
                                    <option key={c.id} value={c.id}>{c.full_name}</option>
                                  ))}
                                </select>
                                <button 
                                  onClick={() => {
                                    const c = coaches.find(co => co.id === targetCoachId)
                                    handleAssignMentor(student.id, targetCoachId, c ? c.full_name : '', student.full_name)
                                  }}
                                  disabled={!targetCoachId}
                                  className="bg-brand-green text-bg text-[10px] font-bold px-2 py-1 rounded transition disabled:opacity-50"
                                >
                                  Ok
                                </button>
                                <button 
                                  onClick={() => setSelectedStudent(null)}
                                  className="bg-surface-3 border border-border-accent text-[10px] text-text-mid px-2 py-1 rounded"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => { setSelectedStudent(student); setTargetCoachId(''); }}
                                  className="bg-surface-2 border border-border-accent hover:border-brand/30 text-xs px-2.5 py-1 rounded-lg text-text-mid hover:text-brand transition"
                                >
                                  Değiştir
                                </button>
                                <button 
                                  onClick={() => handleAssignMentor(student.id, null, '', student.full_name)}
                                  className="p-1 border border-border-accent hover:border-red-500/30 text-text-dim hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                                  title="Eşleşmeyi Kaldır"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-text-dim text-xs">
                        Aktif eşleşme bulunmuyor veya arama kriteriyle eşleşen veri yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeSubTab === 'calendar' && (
        <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h3 className="text-sm font-bold text-text-primary">Merkezi Görüşme Takvimi</h3>
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Öğrenci veya mentör ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2 text-text-primary focus:border-brand outline-none w-full md:max-w-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Öğrenci</th>
                  <th className="px-6 py-3">Atanmış Mentör</th>
                  <th className="px-6 py-3">Görüşme Zamanı</th>
                  <th className="px-6 py-3">Süre / Tür</th>
                  <th className="px-6 py-3">Görüşme Linki</th>
                  <th className="px-6 py-3">Durum</th>
                  <th className="px-6 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-accent">
                {appointments
                  .filter(a => {
                    const studentName = a.student?.full_name || ''
                    const coachName = a.coach?.full_name || ''
                    return studentName.toLowerCase().includes(searchQuery.toLowerCase()) || coachName.toLowerCase().includes(searchQuery.toLowerCase())
                  })
                  .length > 0 ? (
                  appointments
                    .filter(a => {
                      const studentName = a.student?.full_name || ''
                      const coachName = a.coach?.full_name || ''
                      return studentName.toLowerCase().includes(searchQuery.toLowerCase()) || coachName.toLowerCase().includes(searchQuery.toLowerCase())
                    })
                    .map((appt) => (
                      <tr key={appt.id} className="hover:bg-surface-2/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-text-primary text-xs">{appt.student?.full_name || 'Bilinmeyen Öğrenci'}</div>
                          <div className="text-[10px] text-text-dim">{appt.student?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-xs text-text-mid">
                          {appt.coach?.full_name || 'Bilinmeyen Mentör'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-text-primary font-medium">
                            <Calendar size={12} className="text-brand" /> {new Date(appt.date).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-text-dim mt-0.5">
                            <Clock size={10} className="text-text-dim" /> {appt.time.substring(0, 5)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-text-primary">{appt.duration} dk</div>
                          <div className="text-[10px] text-brand-purple font-medium mt-0.5">{appt.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          {appt.meet_link ? (
                            <a 
                              href={appt.meet_link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-brand-blue hover:underline flex items-center gap-1 font-semibold"
                            >
                              Görüşmeye Katıl <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-text-dim text-xs">Girilmemiş</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            appt.status === 'completed' ? 'bg-brand-green/10 text-brand-green' :
                            appt.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                            'bg-brand/10 text-brand'
                          }`}>
                            {appt.status === 'completed' ? 'Gerçekleşti' :
                             appt.status === 'cancelled' ? 'İptal Edildi' : 'Bekliyor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {appt.status !== 'completed' && (
                              <button 
                                onClick={() => handleUpdateMeetingStatus(appt.id, 'completed')}
                                className="bg-brand-green/10 border border-brand-green/20 hover:bg-brand-green/20 text-brand-green text-[10px] font-bold px-2 py-1 rounded"
                              >
                                ✓ Tamamla
                              </button>
                            )}
                            {appt.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleUpdateMeetingStatus(appt.id, 'cancelled')}
                                className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded"
                              >
                                ✕ İptal Et
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-text-dim text-xs">
                      Planlanmış görüşme bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeSubTab === 'reports' && (
        <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-text-primary">Seans Notları ve Gelişim Raporları</h3>
            <span className="text-xs text-text-dim font-medium">Toplam {reports.length} rapor kaydı</span>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="bg-surface-2 border border-border-accent rounded-xl p-4 space-y-3 shadow-sm hover:border-border-accent-hover transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-border-accent/40 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        report.type === 'Görüşme Notu' ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                      }`}>
                        {report.type}
                      </span>
                      <h4 className="text-xs font-black text-text-primary">{report.title}</h4>
                    </div>
                    <div className="text-[10px] text-text-dim flex items-center gap-1.5">
                      <Calendar size={12} className="text-text-dim" /> {new Date(report.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px] text-text-mid">
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-brand shrink-0" />
                      <span>Öğrenci: <b>{report.student}</b></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-brand-purple shrink-0" />
                      <span>Koç: <b>{report.coach}</b></span>
                    </div>
                  </div>

                  <div className="bg-surface-3 border border-border-accent/60 rounded-lg p-3 text-xs text-text-primary leading-relaxed whitespace-pre-line flex gap-2">
                    <MessageSquare size={14} className="text-text-dim shrink-0 mt-0.5" />
                    <div>{report.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-text-dim text-xs">
                Koçlar tarafından girilmiş seans notu veya deneme analizi yorumu bulunmuyor.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
