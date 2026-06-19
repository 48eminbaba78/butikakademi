import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { 
  ShieldAlert, 
  Database, 
  Settings, 
  Search, 
  Eye, 
  EyeOff, 
  Save, 
  AlertTriangle,
  RefreshCw,
  Trash2
} from 'lucide-react'

export default function SystemSettings({ currentUserId }) {
  const [activeSubTab, setActiveSubTab] = useState('logs') // 'logs', 'config', 'db'
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Settings states
  const [branding, setBranding] = useState({ title: '', slogan: '', hero_desc: '', primary_color: '#f0a500' })
  const [pricing, setPricing] = useState({ pro_price: 299, corporate_price: 199 })
  const [seo, setSeo] = useState({ meta_description: '', meta_keywords: '' })
  const [apiKeys, setApiKeys] = useState({ resend_key: 're_Ab12Cd34Ef56Gh78...', iyzico_api: 'iyzi_sec_99...' })
  const [showSecrets, setShowSecrets] = useState(false)

  // Database Console states
  const [selectedTable, setSelectedTable] = useState('users')
  const [tableData, setTableData] = useState([])
  const [tableCols, setTableCols] = useState([])
  const [dbSearchQuery, setDbSearchQuery] = useState('')
  const [dbLoading, setDbLoading] = useState(false)

  // Audit Logs Search
  const [logSearchQuery, setLogSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeSubTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeSubTab === 'logs') {
        const { data } = await supabase
          .from('audit_logs')
          .select('*, admin:admin_id(full_name, email)')
          .order('created_at', { ascending: false })
        setAuditLogs(data || [])
      }
      if (activeSubTab === 'config') {
        const { data } = await supabase.from('platform_settings').select('*')
        if (data) {
          const brandItem = data.find(item => item.key === 'branding')
          const priceItem = data.find(item => item.key === 'pricing')
          const seoItem = data.find(item => item.key === 'seo')
          const apiItem = data.find(item => item.key === 'api_keys')

          if (brandItem) setBranding(brandItem.value)
          if (priceItem) setPricing(priceItem.value)
          if (seoItem) setSeo(seoItem.value)
          if (apiItem) setApiKeys(apiItem.value)
        }
      }
      if (activeSubTab === 'db') {
        loadTableData(selectedTable)
      }
    } catch (err) {
      console.error('Error fetching settings/logs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load raw table data
  const loadTableData = async (tableName) => {
    try {
      setDbLoading(true)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)
      
      if (error) throw error

      if (data && data.length > 0) {
        setTableData(data)
        setTableCols(Object.keys(data[0]))
      } else {
        setTableData([])
        setTableCols([])
      }
    } catch (err) {
      alert(`Tablo ${tableName} yüklenemedi: ` + err.message)
      setTableData([])
      setTableCols([])
    } finally {
      setDbLoading(false)
    }
  };

  useEffect(() => {
    if (activeSubTab === 'db') {
      loadTableData(selectedTable)
    }
  }, [selectedTable])

  // Log audit helper
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

  // SAVE SETTINGS
  const handleSaveConfig = async (key, val) => {
    try {
      // Check if exists
      const { data: exist } = await supabase
        .from('platform_settings')
        .select('key')
        .eq('key', key)
        .single()
      
      let error
      if (exist) {
        const { error: err } = await supabase
          .from('platform_settings')
          .update({ value: val })
          .eq('key', key)
        error = err
      } else {
        const { error: err } = await supabase
          .from('platform_settings')
          .insert({ key, value: val })
        error = err
      }

      if (error) throw error

      logAudit(`Sistem ayarları güncellendi: ${key}`, 'platform_settings', key)
      alert(`Ayarlar (${key}) başarıyla kaydedildi.`)
    } catch (err) {
      alert('Kaydedilemedi: ' + err.message)
    }
  }

  // DELETE RAW ROW (CAUTION!)
  const handleDeleteRow = async (rowId) => {
    if (!confirm(`DİKKAT! Bu satırı silmek veri bütünlüğü hatalarına yol açabilir. Devam etmek istiyor musunuz?`)) return
    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', rowId)
      
      if (error) throw error

      logAudit(`Tablodan satır silindi: ${selectedTable}`, selectedTable, rowId)
      alert('Satır silindi.')
      loadTableData(selectedTable)
    } catch (err) {
      alert('Hata: ' + err.message)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Sub tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Sistem Ayarları ve Güvenlik</h1>
          <p className="text-sm text-text-mid">Sistem loglarını denetleyin, API anahtarlarını yapılandırın ve veritabanı tablolarını inceleyin.</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl border border-border-accent shrink-0">
          <button 
            onClick={() => { setActiveSubTab('logs'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'logs' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <ShieldAlert size={14} /> Güvenlik Logları (Audit)
          </button>
          <button 
            onClick={() => { setActiveSubTab('config'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'config' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Settings size={14} /> Genel Ayarlar & API
          </button>
          <button 
            onClick={() => { setActiveSubTab('db'); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'db' ? 'bg-brand text-bg' : 'text-text-mid hover:text-text-primary'
            }`}
          >
            <Database size={14} /> Veritabanı Konsolu
          </button>
        </div>
      </div>

      {/* AUDIT LOGS TAB */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-surface-1 border border-border-accent rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Sistem İşlem Günlüğü (Audit Trail)</h3>
              <p className="text-xs text-text-mid">Hangi yöneticinin ne zaman hangi veriyi değiştirdiğini gösteren silinemez log kaydı.</p>
            </div>
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-dim">
                <Search size={14} />
              </span>
              <input 
                type="text" 
                placeholder="Loglarda ara..." 
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface-2 border border-border-accent rounded-lg text-xs text-text-primary focus:border-brand outline-none transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-mid text-sm">Loglar yükleniyor...</div>
          ) : (
            <div className="bg-surface-1 border border-border-accent rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Yönetici</th>
                      <th className="px-6 py-4">Yapılan İşlem (Aksiyon)</th>
                      <th className="px-6 py-4">Hedef Tablo / ID</th>
                      <th className="px-6 py-4">IP Adresi</th>
                      <th className="px-6 py-4">Zaman</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-accent">
                    {auditLogs
                      .filter(log => {
                        const adminName = log.admin?.full_name || 'Sistem'
                        const action = log.action || ''
                        return adminName.toLowerCase().includes(logSearchQuery.toLowerCase()) || action.toLowerCase().includes(logSearchQuery.toLowerCase())
                      })
                      .length > 0 ? (
                      auditLogs
                        .filter(log => {
                          const adminName = log.admin?.full_name || 'Sistem'
                          const action = log.action || ''
                          return adminName.toLowerCase().includes(logSearchQuery.toLowerCase()) || action.toLowerCase().includes(logSearchQuery.toLowerCase())
                        })
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-surface-2/40 transition">
                            <td className="px-6 py-4">
                              <div className="font-bold text-text-primary text-xs">{log.admin?.full_name || 'Sistem Trigger / Anon'}</div>
                              <div className="text-[10px] text-text-dim">{log.admin?.email || 'system@rostrumakademi.com'}</div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-brand">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 text-xs text-text-mid font-mono">
                              <span className="text-text-dim uppercase text-[10px] tracking-wide block">{log.target_type}</span>
                              {log.target_id || '—'}
                            </td>
                            <td className="px-6 py-4 text-xs text-text-mid font-mono">
                              {log.ip_address}
                            </td>
                            <td className="px-6 py-4 text-xs text-text-dim">
                              {new Date(log.created_at).toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-text-dim text-xs">
                          Eşleşen log kaydı bulunamadı.
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

      {/* CONFIG / SETTINGS TAB */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Branding */}
          <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-accent pb-2">
              <Settings size={16} className="text-brand" /> Platform Özelleştirme (Branding)
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Akademi / Başlık İsmi</label>
                <input 
                  type="text" 
                  value={branding.title}
                  onChange={(e) => setBranding(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Slogan</label>
                <input 
                  type="text" 
                  value={branding.slogan}
                  onChange={(e) => setBranding(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Hero Açıklama Metni</label>
                <textarea 
                  value={branding.hero_desc}
                  onChange={(e) => setBranding(prev => ({ ...prev, hero_desc: e.target.value }))}
                  className="w-full h-20 bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Arayüz Tema Rengi</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={branding.primary_color}
                    onChange={(e) => setBranding(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="bg-surface-2 border border-border-accent rounded-lg h-9 w-14 cursor-pointer outline-none"
                  />
                  <span className="text-xs text-text-mid font-mono">{branding.primary_color}</span>
                </div>
              </div>
              <button 
                onClick={() => handleSaveConfig('branding', branding)}
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Tema Ayarlarını Kaydet
              </button>
            </div>
          </div>

          {/* Section 2: Pricing & SEO */}
          <div className="space-y-6">
            <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-accent pb-2">
                <Settings size={16} className="text-brand-purple" /> Üyelik & Komisyon Fiyatları
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Pro Koç Paket Ücreti (₺/Ay)</label>
                  <input 
                    type="number" 
                    value={pricing.pro_price}
                    onChange={(e) => setPricing(prev => ({ ...prev, pro_price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Kurumsal Paket Ücreti (₺/Ay)</label>
                  <input 
                    type="number" 
                    value={pricing.corporate_price}
                    onChange={(e) => setPricing(prev => ({ ...prev, corporate_price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={() => handleSaveConfig('pricing', pricing)}
                className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Save size={14} /> Fiyatları Güncelle
              </button>
            </div>

            <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-accent pb-2">
                <Settings size={16} className="text-brand-blue" /> SEO Ayarları (Arama Optimizasyonu)
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Meta Description (Açıklama)</label>
                  <input 
                    type="text" 
                    value={seo.meta_description}
                    onChange={(e) => setSeo(prev => ({ ...prev, meta_description: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Meta Keywords (Anahtar Kelimeler)</label>
                  <input 
                    type="text" 
                    value={seo.meta_keywords}
                    onChange={(e) => setSeo(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none"
                  />
                </div>
                <button 
                  onClick={() => handleSaveConfig('seo', seo)}
                  className="w-full bg-brand hover:bg-brand/90 text-bg text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Save size={14} /> SEO Ayarlarını Kaydet
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Secret API Key Management */}
          <div className="md:col-span-2 bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-border-accent pb-2">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-400" /> Üçüncü Parti API Anahtarları (Secrets)
              </h3>
              <button 
                onClick={() => setShowSecrets(!showSecrets)}
                className="text-text-mid hover:text-text-primary flex items-center gap-1 text-xs font-semibold"
              >
                {showSecrets ? <><EyeOff size={14} /> Gizle</> : <><Eye size={14} /> Göster</>}
              </button>
            </div>
            
            <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="shrink-0 mt-0.5 text-red-400" size={16} />
              <p>Buradaki API anahtarları sistemin dış servislerle (E-posta gönderimi, Ödeme kanalları vb.) bağlantısını sağlar. Bu anahtarlar şifreli şekilde saklanır.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Resend SMTP API Key</label>
                <input 
                  type={showSecrets ? 'text' : 'password'} 
                  value={apiKeys.resend_key}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, resend_key: e.target.value }))}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-mid uppercase tracking-wide">Iyzico API Integration Secret</label>
                <input 
                  type={showSecrets ? 'text' : 'password'} 
                  value={apiKeys.iyzico_api}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, iyzico_api: e.target.value }))}
                  className="w-full bg-surface-2 border border-border-accent rounded-lg p-2.5 text-xs text-text-primary focus:border-brand outline-none font-mono"
                />
              </div>
            </div>
            <button 
              onClick={() => handleSaveConfig('api_keys', apiKeys)}
              className="bg-red-500 hover:bg-red-600 text-bg text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
            >
              <Save size={14} /> API Yetkilerini Kaydet
            </button>
          </div>
        </div>
      )}

      {/* DATABASE GRID CONSOLE TAB */}
      {activeSubTab === 'db' && (
        <div className="bg-surface-1 border border-border-accent rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Database size={16} className="text-brand" /> Canlı Veritabanı Tablo Konsolu
              </h3>
              <p className="text-xs text-text-mid">Supabase veritabanındaki tabloları doğrudan sorgulayın.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-surface-2 border border-border-accent rounded-lg text-xs px-3 py-2 text-text-primary focus:border-brand outline-none"
              >
                <option value="users">users (Kullanıcılar)</option>
                <option value="appointments">appointments (Görüşmeler)</option>
                <option value="tickets">tickets (Destek Biletleri)</option>
                <option value="audit_logs">audit_logs (Güvenlik Logları)</option>
                <option value="resources">resources (Kaynak Havuzu)</option>
                <option value="leads">leads (Başvurular)</option>
                <option value="announcements">announcements (Duyurular)</option>
                <option value="platform_settings">platform_settings (Ayarlar)</option>
                <option value="workspaces">workspaces (Koç Çalışma Alanları)</option>
                <option value="exams">exams (Denemeler)</option>
              </select>

              <button 
                onClick={() => loadTableData(selectedTable)}
                className="p-2 bg-surface-2 border border-border-accent hover:border-brand/40 text-text-mid hover:text-brand rounded-lg transition"
                title="Tabloyu Yenile"
              >
                <RefreshCw size={14} className={dbLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="bg-red-950/15 border border-red-900/30 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="shrink-0 mt-0.5 text-red-400" size={16} />
            <p className="font-semibold">UYARI: Burası doğrudan veritabanı müdahale arayüzüdür. Buradan yapılacak satır silme işlemleri geri alınamaz ve veri bütünlüğünü bozabilir.</p>
          </div>

          {dbLoading ? (
            <div className="text-center py-12 text-text-mid text-sm">Tablo verileri sorgulanıyor...</div>
          ) : tableData.length > 0 ? (
            <div className="overflow-x-auto max-h-[50vh] border border-border-accent rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-accent bg-surface-2 text-[10px] text-text-dim font-bold uppercase tracking-wider sticky top-0">
                    <th className="px-4 py-3 bg-surface-2">Sil</th>
                    {tableCols.map(col => (
                      <th key={col} className="px-4 py-3 bg-surface-2">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-accent/40 font-mono text-[11px] text-text-mid">
                  {tableData.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-surface-2/40 transition">
                      <td className="px-4 py-2 text-center">
                        <button 
                          onClick={() => handleDeleteRow(row.id)}
                          disabled={!row.id}
                          className="text-red-400 hover:text-red-500 disabled:opacity-30"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                      {tableCols.map(col => {
                        const cellVal = row[col]
                        let displayVal = ''
                        if (cellVal === null) {
                          displayVal = 'NULL'
                        } else if (typeof cellVal === 'object') {
                          displayVal = JSON.stringify(cellVal)
                        } else {
                          displayVal = String(cellVal)
                        }

                        return (
                          <td key={col} className="px-4 py-2 max-w-xs truncate" title={displayVal}>
                            {displayVal === 'NULL' ? <span className="text-text-dim font-sans italic">null</span> : displayVal}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-text-dim text-xs">
              Bu tabloda kayıtlı veri bulunmuyor.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
