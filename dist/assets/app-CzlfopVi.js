(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const r={students:[],tasks:{},appointments:[],exams:[],messages:{},coachTodos:{},weekOffset:0,calMonth:new Date().getMonth(),calYear:new Date().getFullYear(),calSelDay:null,activeStuId:null,msgThread:null,workspace:null,studentSpeeds:[],konuHaftaSoru:[]},h={role:null,studentId:null,dbUser:null,coachId:null,childName:null};window.S=r;window.session=h;window._loginMode="email";window.STU_DEFAULT_PASS="Rostrum"+Math.floor(1e3+Math.random()*9e3);window.DAYS_TR=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];window.MONTHS_TR=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];window.EXAM_DEFS={TYT:["Türkçe","Matematik","Fen","Sosyal"],"AYT-SAY":["Matematik","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Edebiyat","Tarih","Coğrafya"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.EXAM_SORU={TYT:{Türkçe:40,Matematik:40,Fen:20,Sosyal:20},"AYT-SAY":{Matematik:40,Fizik:14,Kimya:13,Biyoloji:13},"AYT-EA":{Matematik:40,Edebiyat:24,Tarih:10,Coğrafya:6},"AYT-SOZ":{Edebiyat:24,Tarih1:10,Tarih2:11,Coğrafya1:6,Coğrafya2:11,Felsefe:12,Din:6}};window.EXAM_KONU_MAP={TYT_Türkçe:["Dil Bilgisi"],TYT_Matematik:["TYT Matematik","Geometri"],TYT_Fen:["TYT Fizik","TYT Kimya","TYT Biyoloji"],TYT_Sosyal:[],"AYT-SAY_Matematik":["AYT Matematik","Geometri"],"AYT-SAY_Fizik":["AYT Fizik"],"AYT-SAY_Kimya":["AYT Kimya"],"AYT-SAY_Biyoloji":["AYT Biyoloji"],"AYT-EA_Matematik":["AYT Matematik","Geometri"],"AYT-EA_Edebiyat":["Dil Bilgisi"]};window.SUBJECT_MAP={TYT:["Türkçe","Matematik","Geometri","Fizik","Kimya","Biyoloji","Tarih","Coğrafya","Felsefe","Din"],"AYT-SAY":["Matematik","Geometri","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Geometri","Edebiyat","Tarih","Coğrafya","Felsefe"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.currentTab="";window._clipboardTask=null;window._editingTaskId=null;window._regRole=null;window._onbRole=null;window._oauthUser=null;const aa="https://imyhenrwmsmyikpollur.supabase.co",ia="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34",b=supabase.createClient(aa,ia);window.db=b;function ue(){var e;try{localStorage.setItem("ba_ui_"+(((e=h.dbUser)==null?void 0:e.id)||"x"),JSON.stringify({weekOffset:r.weekOffset,activeStuId:r.activeStuId,calMonth:r.calMonth,calYear:r.calYear}))}catch{}}function Ue(){ue()}function L(e){let t=document.getElementById("loadingOverlay");if(e&&!t){if(t=document.createElement("div"),t.id="loadingOverlay",t.style.cssText="position:fixed;inset:0;background:rgba(15,14,12,.8);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)",t.innerHTML='<div style="width:36px;height:36px;border:3px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div><div style="font-size:13px;color:var(--text-mid)">Yükleniyor...</div>',!document.getElementById("spinStyle")){const n=document.createElement("style");n.id="spinStyle",n.textContent="@keyframes spin{to{transform:rotate(360deg)}}",document.head.appendChild(n)}document.body.appendChild(t)}else!e&&t&&t.remove()}function u(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function H(e){return e instanceof Date?e.toISOString().split("T")[0]:e}function U(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}function Se(){return H(new Date)}function _t(e){return e>=20?"good":e>=12?"mid":"low"}function Ge(e){return{deneme:"📊 Deneme",soru:"📚 Soru",konu:"🎯 Konu",diger:"⭐ Diğer"}[e]||e}function Y(e){document.getElementById(e).classList.add("open")}function O(e){document.getElementById(e).classList.remove("open")}function k(e){const t=document.getElementById("toast");t.textContent=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),2300)}document.addEventListener("click",e=>{e.target.classList.contains("modal-bg")&&e.target.classList.remove("open")});document.addEventListener("keydown",e=>{e.key==="Escape"&&document.querySelectorAll(".modal-bg.open").forEach(t=>t.classList.remove("open"))});function V(e,t=0){const n=new Date,a=n.getDay(),o=(a===0?6:a-1)-t,s=new Date(n);return s.setDate(n.getDate()-(o+7)%7+e*7),s.setHours(0,0,0,0),s}function oa(){const e=r.students.find(t=>t.id===r.activeStuId);return(e==null?void 0:e.weekStart)??0}async function Ie(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return[...new Uint8Array(t)].map(n=>n.toString(16).padStart(2,"0")).join("")}function $e(e){return e?e.trim().toLowerCase().replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u").replace(/i̇/g,"i").replace(/ı/g,"i").replace(/i/g,"i").replace(/\s+/g,"").replace(/\u0307/g,""):""}function sa(){if(!("Notification"in window)){console.log("Bu tarayıcı anlık bildirimleri desteklemiyor.");return}Notification.permission!=="granted"&&Notification.permission!=="denied"?Notification.requestPermission().then(e=>{e==="granted"&&k("Bildirim izinleri onaylandı ✓")}):Notification.permission==="granted"?k("Bildirim izinleri zaten açık ✓"):k("Bildirim izinleri tarayıcı ayarlarından engellenmiş.")}window.saveUI=ue;window.saveS=Ue;window.showLoading=L;window.esc=u;window.fmtDate=H;window.addDays=U;window.todayStr=Se;window.netColor=_t;window.typeLabel=Ge;window.om=Y;window.cm=O;window.showToast=k;window.getWeekStart=V;window.getStudentWeekStart=oa;window.sha256=Ie;window.normalizeUsername=$e;window.requestNotificationPermission=sa;async function ra(e,t={}){let n=b.from(e).select("*");Object.entries(t).forEach(([o,s])=>{n=n.eq(o,s)});const{data:a,error:i}=await n;return i&&console.error(e,i),a||[]}const da=4*60*1e3;function zt(){return"ra_d_"+(h.coachId||h.studentId||"x")}function en(){try{localStorage.removeItem(zt())}catch{}}function Xt(){try{localStorage.setItem(zt(),JSON.stringify({ts:Date.now(),students:r.students,tasks:r.tasks,appointments:r.appointments,exams:r.exams,messages:r.messages,coachTodos:r.coachTodos,studentSpeeds:r.studentSpeeds,workspace:r.workspace,konuHaftaSoru:r.konuHaftaSoru}))}catch{}}function la(){try{const e=localStorage.getItem(zt());if(!e)return!1;const t=JSON.parse(e);return!t.ts||Date.now()-t.ts>da?!1:(t.students&&(r.students=t.students),t.tasks&&(r.tasks=t.tasks),t.appointments&&(r.appointments=t.appointments),t.exams&&(r.exams=t.exams),t.messages&&(r.messages=t.messages),t.coachTodos&&(r.coachTodos=t.coachTodos),t.studentSpeeds&&(r.studentSpeeds=t.studentSpeeds),t.workspace&&(r.workspace=t.workspace),t.konuHaftaSoru&&(r.konuHaftaSoru=t.konuHaftaSoru),!0)}catch{return!1}}async function Qt(){var j;const e=h.coachId,t=h.role,n=t==="coach"||t==="developer"?b.from("workspaces").select("*").eq("coach_id",e).single():Promise.resolve({data:null});let a=b.from("users").select("*").eq("role","student");t==="student"?a=a.eq("id",h.studentId):(t==="coach"||t==="developer")&&(a=a.eq("coach_id",e));const i=a,o=new Date;o.setDate(o.getDate()-60);const s=o.toISOString().split("T")[0],d=new Date;d.setDate(d.getDate()-30);const c=d.toISOString().split("T")[0],l=t==="student"?b.from("tasks").select("*").eq("student_id",h.studentId).gte("date",s):t==="coach"||t==="developer"?b.from("tasks").select("*").eq("coach_id",e).gte("date",s):b.from("tasks").select("*").gte("date",s),p=t==="student"?b.from("appointments").select("*").eq("student_id",h.studentId).gte("date",c):t==="coach"||t==="developer"?b.from("appointments").select("*").eq("coach_id",e).gte("date",c):b.from("appointments").select("*").gte("date",c),m=t==="student"?b.from("exams").select("*").eq("student_id",h.studentId):t==="coach"||t==="developer"?b.from("exams").select("*").eq("coach_id",e):b.from("exams").select("*"),g=t==="student"?b.from("messages").select("*").eq("student_id",h.studentId).order("created_at",{ascending:!1}).limit(200):t==="coach"||t==="developer"?b.from("messages").select("*").eq("coach_id",e).order("created_at",{ascending:!1}).limit(200):b.from("messages").select("*").order("created_at",{ascending:!1}).limit(200),x=t==="coach"||t==="developer"?b.from("coach_todos").select("*").eq("coach_id",e):Promise.resolve({data:[]}),I=t==="student"?b.from("student_speeds").select("*").eq("student_id",h.studentId):t==="coach"||t==="developer"?b.from("student_speeds").select("*").eq("coach_id",e):b.from("student_speeds").select("*"),f=t==="coach"||t==="developer"?b.from("konu_mastery").select("*").eq("coach_id",e):t==="student"?b.from("konu_mastery").select("*").eq("student_id",h.studentId):Promise.resolve({data:[]}),y=t==="coach"||t==="developer"?b.from("konu_tekrar_log").select("*").eq("coach_id",e):t==="student"?b.from("konu_tekrar_log").select("*").eq("student_id",h.studentId):Promise.resolve({data:[]}),[v,$,S,B,D,T,_,z,E,M]=await Promise.all([n,i,l,p,m,g,x,I,f,y]);(t==="coach"||t==="developer")&&(r.workspace=v.data||null),r.students=($.data||[]).map(w=>({id:w.id,name:w.full_name||w.username||"Öğrenci",target:w.target||"",color:w.color||"#4da6ff",progress:w.progress||0,weekStart:w.week_start||0,username:w.username,coachId:w.coach_id})),r.tasks={},(S.data||[]).forEach(w=>{const A=`${w.student_id}_${w.date}`;r.tasks[A]||(r.tasks[A]=[]),r.tasks[A].push({_id:w.id,type:w.type,exam:w.exam_type,subject:w.subject,duration:w.duration,note:w.note,done:w.done,student_note:w.student_note||"",student_result:w.student_result||null,task_items:w.task_items})}),r.appointments=(B.data||[]).map(w=>({id:w.id,studentId:w.student_id,date:w.date,time:w.time,duration:w.duration,type:w.type,note:w.note,meetLink:w.meet_link})),r.exams=(D.data||[]).map(w=>({id:w.id,studentId:w.student_id,name:w.name,date:w.date,type:w.exam_type,nets:w.nets||{},examDetails:w.exam_details||{},note:w.student_note,coachComment:w.coach_comment})),r.messages={},(T.data||[]).forEach(w=>{r.messages[w.student_id]||(r.messages[w.student_id]=[]),r.messages[w.student_id].push({_id:w.id,from:w.from_role,text:w.text,read:w.read,time:new Date(w.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})})}),Object.keys(r.messages).forEach(w=>r.messages[w].sort((A,C)=>A._id>C._id?1:-1)),r.coachTodos={},(_.data||[]).forEach(w=>{r.coachTodos[w.date]||(r.coachTodos[w.date]=[]),r.coachTodos[w.date].push({_id:w.id,task:w.task,note:w.note,done:w.done})}),r.studentSpeeds=z.data||[],r.konuMastery={},(E.data||[]).forEach(w=>{r.konuMastery[w.student_id]||(r.konuMastery[w.student_id]={}),r.konuMastery[w.student_id][w.subject]||(r.konuMastery[w.student_id][w.subject]={}),r.konuMastery[w.student_id][w.subject][w.konu]=w}),r.konuTekrarLog={},(M.data||[]).forEach(w=>{r.konuTekrarLog[w.student_id]||(r.konuTekrarLog[w.student_id]={}),r.konuTekrarLog[w.student_id][w.subject]||(r.konuTekrarLog[w.student_id][w.subject]={}),r.konuTekrarLog[w.student_id][w.subject][w.konu]||(r.konuTekrarLog[w.student_id][w.subject][w.konu]={}),r.konuTekrarLog[w.student_id][w.subject][w.konu][w.period_start]=w});try{const w=JSON.parse(localStorage.getItem("ba_ui_"+((j=h.dbUser)==null?void 0:j.id))||"{}");w.weekOffset!==void 0&&(r.weekOffset=w.weekOffset),w.activeStuId&&(r.activeStuId=w.activeStuId),w.calMonth!==void 0&&(r.calMonth=w.calMonth,r.calYear=w.calYear)}catch{}}async function tn(){if(la()){Qt().then(()=>{if(Xt(),window.currentTab)try{window.switchTab(window.currentTab)}catch{}}).catch(t=>console.error("Arka plan yenileme hatası:",t));return}L(!0);try{await Qt(),Xt()}catch(t){console.error("loadAllData error",t)}L(!1)}window.dbQ=ra;window.loadAllData=tn;window.invalidateCache=en;let ze=!1;function oe(e){const t=document.getElementById("loginErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function Ye(e){const t=document.getElementById("regErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function nn(e){document.getElementById("loginPanel").style.display=e==="login"?"block":"none",document.getElementById("registerPanel").style.display=e==="register"?"block":"none",document.getElementById("lmtLogin").classList.toggle("active",e==="login"),document.getElementById("lmtRegister").classList.toggle("active",e==="register")}function ca(e){window._loginMode=e,document.querySelectorAll("#loginTabs .login-tab").forEach((t,n)=>t.classList.toggle("active",n===(e==="email"?0:1))),document.getElementById("loginEmailField").style.display=e==="email"?"block":"none",document.getElementById("loginUserField").style.display=e==="username"?"block":"none"}function pa(e){window._regRole=e,document.getElementById("rrbCoach").classList.toggle("sel",e==="coach"),document.getElementById("rrbStudent").classList.toggle("sel",e==="student")}function ma(e){window._onbRole=e,document.getElementById("onbRoleCoach").classList.toggle("sel",e==="coach"),document.getElementById("onbRoleStudent").classList.toggle("sel",e==="student")}async function ua(){if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.protocol==="file:"){on();return}await an()}async function an(){Bt(),L(!0);try{const{error:e}=await b.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/app.html",queryParams:{access_type:"offline",prompt:"select_account"}}});e&&(L(!0),console.warn("Google Auth failed:",e),oe("Google Girişi Başlatılamadı: "+e.message))}catch(e){L(!1),oe("Google Girişi Başlatılamadı: "+e.message)}}function on(){document.getElementById("googleSimulatorModal").style.display="flex"}function Bt(){document.getElementById("googleSimulatorModal").style.display="none"}async function ga(e){if(Bt(),L(!0),e==="demokoc"){const{data:t,error:n}=await b.from("users").select("*").eq("username","demokoc").maybeSingle();if(n||!t){L(!1),oe("Demo koç profili bulunamadı!");return}await Te(t)}else if(e==="demoogrenci"){const{data:t,error:n}=await b.from("users").select("*").eq("username","demoogrenci").maybeSingle();if(n||!t){L(!1),oe("Demo öğrenci profili bulunamadı!");return}await Te(t)}else if(e==="new"){L(!1),document.getElementById("newUserOnboarding").style.display="flex";const t=Math.floor(1e3+Math.random()*9e3),n=`yeni.kullanici${t}@gmail.com`;document.getElementById("onbEmail").textContent=n,document.getElementById("onbName").value=`Yeni Kullanıcı ${t}`,window._oauthUser={id:`mock-google-id-${t}`,email:n,user_metadata:{full_name:`Yeni Kullanıcı ${t}`}}}}async function sn(){var t,n,a;if(ze)return;let e=null;try{console.log("[Auth] 1/4 getSession...");const{data:{session:i}}=await b.auth.getSession();if(console.log("[Auth] 2/4 session:",((t=i==null?void 0:i.user)==null?void 0:t.email)||"yok"),!(i!=null&&i.user)||(n=document.getElementById("appShell"))!=null&&n.classList.contains("visible")||ze)return;ze=!0,L(!0),e=setTimeout(()=>{console.warn("[Auth] timeout — Supabase yanıt vermedi, spinner kapatılıyor"),ze=!1,L(!1)},1e4),console.log("[Auth] 3/4 profil yükleniyor...");const{data:o,error:s}=await b.from("users").select("*").eq("id",i.user.id).maybeSingle();console.log("[Auth] 4/4 profil:",o==null?void 0:o.role,(s==null?void 0:s.message)||""),clearTimeout(e);let d=!1;if(o){if(o.role==="coach"){const{data:c}=await b.from("workspaces").select("*").eq("coach_id",o.id).maybeSingle();(!c||!c.onboarding_done)&&(d=!0)}}else d=!0;o&&!d?await Te(o):(L(!1),document.getElementById("newUserOnboarding").style.display="flex",document.getElementById("onbEmail").textContent=i.user.email,document.getElementById("onbName").value=((a=i.user.user_metadata)==null?void 0:a.full_name)||"",window._oauthUser=i.user)}catch(i){clearTimeout(e),ze=!1,L(!1),console.warn("[checkOAuthSession]",i)}}async function va(){const e=document.getElementById("onbName").value.trim();if(!e){document.getElementById("onbErr").textContent="Ad soyad zorunlu",document.getElementById("onbErr").style.display="block";return}if(!window._onbRole){document.getElementById("onbErr").textContent="Hesap türü seçin",document.getElementById("onbErr").style.display="block";return}document.getElementById("onbErr").style.display="none",L(!0);const t=window._oauthUser,n=e.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""),a={id:t.id,full_name:e,email:t.email,role:window._onbRole,username:n+"_"+Math.random().toString(36).slice(2,6),password_hash:"supabase_managed",color:window._onbRole==="coach"?"#f0a500":"#4da6ff",week_start:0,progress:0,target:""},{data:i,error:o}=await b.from("users").upsert(a).select().single();if(o){L(!1),document.getElementById("onbErr").textContent="Hata: "+o.message,document.getElementById("onbErr").style.display="block";return}document.getElementById("newUserOnboarding").style.display="none",await Te(i)}async function ya(){const e=document.getElementById("regName").value.trim(),t=document.getElementById("regEmail").value.trim().toLowerCase(),n=document.getElementById("regPass").value;if(!e||!t||!n)return Ye("Tüm alanlar zorunlu");if(n.length<8)return Ye("Şifre en az 8 karakter olmalıdır");if(!window._regRole)return Ye("Hesap türü seçin");L(!0);try{const{data:a,error:i}=await b.auth.signUp({email:t,password:n,options:{data:{full_name:e,role:window._regRole}}});if(i)throw i;if(a!=null&&a.user){L(!1),document.getElementById("regName").value="",document.getElementById("regEmail").value="",document.getElementById("regPass").value="";const o=document.getElementById("regSuccess");o.textContent="Kayıt başarılı! E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğrulama yaptıktan sonra giriş yapın.",o.style.display="block",setTimeout(()=>o.style.display="none",1e4),nn("login")}}catch(a){L(!1),Ye("Kayıt Hatası: "+a.message)}}async function fa(){const e=(document.getElementById("loginEmail").value||document.getElementById("loginUser").value||"").trim(),t=document.getElementById("loginPass").value;if(!e||!t)return oe("Kullanıcı adı ve şifre zorunlu");L(!0);const n=setTimeout(()=>{L(!1),oe("Bağlantı zaman aşımına uğradı. Supabase yanıt vermiyor — lütfen tekrar deneyin.")},12e3);try{let a=e;a.includes("@")?a=a.toLowerCase():a=$e(e)+"@rostrumakademi.com";const{data:i,error:o}=await b.auth.signInWithPassword({email:a,password:t});if(!o&&(i!=null&&i.user)){const{data:s,error:d}=await b.from("users").select("*").eq("id",i.user.id).maybeSingle();if(d&&console.error("Profile fetch error:",d),s){await Te(s);return}return L(!1),oe("Hesabınız veritabanında aktif değil.")}try{const s=$e(e.includes("@")?e.split("@")[0]:e),d=await Ie(t),{data:c}=await b.rpc("get_user_by_credentials",{p_username:s,p_password_hash:d}),l=Array.isArray(c)?c[0]:c;if(l){await Te(l);return}}catch(s){console.warn("Fallback RPC error:",s)}return L(!1),oe(o?"Giriş başarısız: "+o.message:"Kullanıcı adı veya şifre hatalı.")}catch(a){return L(!1),console.error("[doLogin]",a),oe("Giriş hatası: "+a.message)}finally{clearTimeout(n)}}async function Te(e){L(!1);const t=e.role==="coach"||e.role==="developer"?e.id:e.role==="student"||e.role==="parent"?e.coach_id:null;h.role=e.role,h.studentId=e.role==="student"?e.id:null,h.dbUser=e,h.coachId=t,document.getElementById("loginScreen").style.display="none",document.getElementById("appShell").classList.add("visible");try{if(await tn(),h.role==="student"&&(r.activeStuId=e.id,h.studentId=e.id,r.students.find(o=>o.id===e.id)||r.students.push({id:e.id,name:e.full_name||e.username||"Öğrenci",target:e.target||"",color:e.color||"#4da6ff",progress:e.progress||0,weekStart:e.week_start||0,username:e.username,coachId:e.coach_id})),h.role==="parent"){const{data:o}=await b.from("users").select("*").eq("parent_id",e.id).single();o&&(r.activeStuId=o.id,h.studentId=o.id,h.childName=o.full_name||o.username)}if(window.setupShell(),document.getElementById("aiChatBubble").style.display="flex",(h.role==="coach"||h.role==="developer")&&(!r.workspace||!r.workspace.onboarding_done)){window.switchTab("home"),window.showOnboarding();return}const n=window.location.hash.substring(1),a={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[h.role]||"portal",i=n&&document.getElementById("view-"+n)?n:a;setTimeout(()=>window.switchTab(i),50)}catch(n){L(!1),console.error("[doLogin] HATA:",n),oe("Hata: "+n.message),document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible")}}function xa(){window.destroyRealtime&&window.destroyRealtime(),b.auth.signOut().catch(()=>{}),en(),h.role=null,h.studentId=null,h.dbUser=null,h.coachId=null,h.childName=null,r.workspace=null,document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible"),document.getElementById("aiChatBubble").style.display="none",document.getElementById("aiChatPanel").classList.remove("open"),document.getElementById("loginEmail")&&(document.getElementById("loginEmail").value=""),document.getElementById("loginUser")&&(document.getElementById("loginUser").value=""),document.getElementById("loginPass").value="",window.location.hash=""}function ba(){window.om("forgotPassModal")}async function ha(){const e=document.getElementById("forgotEmail").value.trim();if(!e)return;const t=document.getElementById("forgotMsg");try{const{error:n}=await b.auth.resetPasswordForEmail(e,{redirectTo:window.location.origin+"/app.html"});if(n)throw n;t.style.display="block",t.style.background="var(--green-dim)",t.style.color="var(--green)",t.textContent="Sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin."}catch(n){t.style.display="block",t.style.background="var(--red-dim)",t.style.color="var(--red)",t.textContent="Hata: "+(n.message||"Bir sorun oluştu.")}}window.loginErr=oe;window.regErr=Ye;window.setAuthMode=nn;window.setLoginMode=ca;window.setRegRole=pa;window.setOnbRole=ma;window.loginWithGoogle=ua;window.triggerRealGoogleLogin=an;window.showGoogleSimulator=on;window.closeGoogleSimulator=Bt;window.simOAuthLogin=ga;window.checkOAuthSession=sn;window.completeOnboarding=va;window.doRegister=ya;window.doLogin=fa;window.finishLogin=Te;window.doLogout=xa;window.showForgotPassword=ba;window.sendResetEmail=ha;b.auth.onAuthStateChange(async(e,t)=>{var n;if(e==="SIGNED_IN"&&(t!=null&&t.user)){if((n=document.getElementById("appShell"))!=null&&n.classList.contains("visible"))return;await sn()}e==="SIGNED_OUT"&&(ze=!1,L(!1))});function Fe(e){if(!e||e<=0)return"0 sa";const t=Math.floor(e/60),n=e%60;return t>0&&n>0?`${t} sa ${n} dk`:t>0?`${t} sa`:`${n} dk`}window.formatMinToHours=Fe;function X(e){return new Promise(t=>{let n=document.getElementById("customConfirmModal");n||(n=document.createElement("div"),n.id="customConfirmModal",n.className="modal-bg",n.style.zIndex="999999",n.innerHTML=`
        <div class="modal" style="max-width:360px;text-align:center;padding:24px 20px;border-radius:16px;background:var(--surface);border:1px solid var(--border)">
          <div style="font-size:32px;margin-bottom:12px">⚠️</div>
          <div id="confirmMessage" style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:20px;line-height:1.5"></div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" id="confirmCancelBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px">İptal</button>
            <button class="btn btn-accent" id="confirmOkBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px;background:#ef4444;border-color:#ef4444;color:#fff">Tamam</button>
          </div>
        </div>
      `,document.body.appendChild(n),n.addEventListener("click",d=>{d.target===n&&(n.classList.remove("open"),t(!1))})),n.querySelector("#confirmMessage").textContent=e;const a=n.querySelector("#confirmOkBtn"),i=n.querySelector("#confirmCancelBtn"),o=a.cloneNode(!0),s=i.cloneNode(!0);a.parentNode.replaceChild(o,a),i.parentNode.replaceChild(s,i),n.classList.add("open"),o.focus(),o.onclick=()=>{n.classList.remove("open"),t(!0)},s.onclick=()=>{n.classList.remove("open"),t(!1)}})}window.customConfirm=X;function Mt(){const e=h.dbUser;if(!e||h.role!=="coach"&&h.role!=="developer"||e.email==="ceylanemin1928@gmail.com"||e.email==="simkoc1@rostrumakademi.com"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.__testMode)return;if((e.plan||"trial")==="trial"){const n=e.trial_ends_at?new Date(e.trial_ends_at):new Date(new Date(e.created_at).getTime()+12096e5);new Date>n&&At()}}function At(){let e=document.getElementById("trialExpiredModal");e?e.classList.add("open"):(e=document.createElement("div"),e.id="trialExpiredModal",e.className="modal-bg open",e.style.zIndex="9999999",e.innerHTML=`
      <div class="modal" style="max-width:460px;text-align:center;padding:32px 24px;border-radius:18px;background:var(--surface);border:2.5px solid var(--accent);box-shadow:var(--shadow-lg)">
        <div style="font-size:54px;margin-bottom:18px">⏳</div>
        <h2 style="font-size:20px;font-weight:900;margin-bottom:12px;color:var(--accent)">Deneme Süreniz Doldu</h2>
        <p style="font-size:13px;color:var(--text-mid);line-height:1.7;margin-bottom:24px">
          Rostrum Akademi'nin 14 günlük ücretsiz deneme süresi sona ermiştir. 
          Çalışmalarınıza devam etmek ve size uygun paketi seçmek için lütfen kurucu/destek ekibimizle iletişime geçin.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;align-items:stretch">
          <button class="btn btn-accent" onclick="openSupportChatDirect()" style="justify-content:center;padding:12px;font-size:14px;font-weight:700">
            💬 Kurucuya / Ekibe Yaz (Canlı Destek)
          </button>
          <div style="font-size:11px;color:var(--text-dim);margin-top:6px">
            E-posta: <b>ceylanemin1928@gmail.com</b>
          </div>
        </div>
      </div>
    `,document.body.appendChild(e))}window.openSupportChatDirect=gt;window.checkCoachSubscription=Mt;window.showTrialExpiredScreen=At;const Tt=[{id:"home",lbl:"🏠",name:"Ana Sayfa"},{id:"students",lbl:"👤",name:"Öğrencilerim"},{id:"todolist",lbl:"📅",name:"Ajanda"},{id:"coach-resources",lbl:"📚",name:"Kaynaklarım"},{id:"coach-applications",lbl:"📩",name:"Başvurular"}],rn=[{id:"portal",lbl:"🏠",name:"Ana Sayfa"},{id:"sportal",lbl:"📋",name:"Programım"},{id:"sexams",lbl:"📊",name:"Denemeler"},{id:"smessages",lbl:"💬",name:"Koçuma Yaz"},{id:"sprofil",lbl:"👤",name:"Profilim"}],dn=[{id:"dev-tickets",lbl:"🎫",name:"Destek"}],ln=[{id:"parent-home",lbl:"🏠",name:"Ana Sayfa"},{id:"parent-progress",lbl:"📊",name:"İlerleme"},{id:"parent-messages",lbl:"💬",name:"Koça Yaz"},{id:"parent-ai",lbl:"🤖",name:"AI Asistan"}];function ka(){var e;(e=document.getElementById("mainSidebar"))==null||e.classList.toggle("open")}function wa(){var e;(e=document.getElementById("tnUserMenu"))==null||e.classList.toggle("open")}function cn(){var e;(e=document.getElementById("tnUserMenu"))==null||e.classList.remove("open")}document.addEventListener("click",e=>{const t=document.getElementById("tnUserWrap");t&&!t.contains(e.target)&&cn()});function $a(){var l;Mt();const e=h.role==="coach"?Tt:h.role==="developer"?[...Tt,...dn]:h.role==="parent"?ln:rn;document.getElementById("sidebarNav").innerHTML=e.map(p=>`
    <div class="tn-nav-item" id="sbi_${p.id}" onclick="switchTab('${p.id}')">
      <span>${p.lbl}</span>
      <span>${p.name}</span>
    </div>`).join(""),document.getElementById("mobileNav").innerHTML=e.slice(0,5).map(p=>`
    <button class="mnav-btn" id="mntab_${p.id}" onclick="switchTab('${p.id}')">${p.lbl}<span style="font-size:9px;display:block">${p.name}</span></button>`).join(""),document.getElementById("mainContent").innerHTML=[...e,{id:"student-detail"},{id:"profile"},{id:"settings"},{id:"coach-resources"},{id:"coach-applications"},{id:"coach-notes"},{id:"coach-profile"},{id:"messages"},{id:"todolist"},{id:"program"},{id:"appointments"},{id:"exams"}].map(p=>`<div class="view" id="view-${p.id}"></div>`).join("");const t=h.dbUser,n=h.role==="student"?r.students.find(p=>p.id===h.studentId):null,a=(t==null?void 0:t.full_name)||(n==null?void 0:n.name)||"",i=a.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),o={coach:"#f0a500",student:(n==null?void 0:n.color)||"#4da6ff",developer:"#c084fc",parent:"#3ecf8e"},s={coach:"KOÇ",student:"ÖĞRENCİ",developer:"DEV",parent:"VELİ"};if(document.getElementById("sbAv").textContent=i,document.getElementById("sbAv").style.background=o[h.role]||"#888",document.getElementById("sbName").textContent=a,document.getElementById("sbRole").textContent=s[h.role]||h.role,(h.role==="coach"||h.role==="developer")&&((l=r.workspace)!=null&&l.brand_name)){const p=document.querySelector(".sb-logo-text");p&&(p.textContent=r.workspace.brand_name);const m=document.querySelector(".tn-logo .sb-logo-icon");m&&(m.textContent=r.workspace.brand_name.slice(0,1).toUpperCase())}const d=document.getElementById("sb-site-admin");d&&(d.style.display=h.role==="developer"?"flex":"none");const c=document.getElementById("tnCoachProfileItem");c&&(c.style.display=h.role==="coach"||h.role==="developer"?"flex":"none"),Un(),setTimeout(Pn,600),(h.role==="coach"||h.role==="developer")&&b.from("match_requests").select("id",{count:"exact",head:!0}).eq("matched_coach_id",h.coachId).eq("status","pending").then(({count:p})=>{if(p>0){const m=document.getElementById("sbi_coach-applications");if(m&&!m.querySelector(".sb-badge")){const g=document.createElement("span");g.className="sb-badge",g.textContent=p,m.appendChild(g)}}})}function ne(e,t=!0){var l,p;if(!e)return;currentTab=e,t&&(window.location.hash=e),document.querySelectorAll(".tn-nav-item").forEach(m=>m.classList.remove("active"));const n=document.getElementById("sbi_"+e)||document.getElementById("sb-"+e);n&&n.classList.add("active"),document.querySelectorAll(".view").forEach(m=>m.classList.remove("active"));const a=document.getElementById("view-"+e);a&&a.classList.add("active");const o=[...Tt,...rn,...dn,...ln,{id:"profile",name:"Profil"},{id:"settings",name:"Ayarlar"},{id:"student-detail",name:((l=r.students.find(m=>m.id===r.activeStuId))==null?void 0:l.name)||"Öğrenci"},{id:"program",name:"Program"},{id:"appointments",name:"Randevular"},{id:"exams",name:"Denemeler"}].find(m=>m.id===e),s=document.getElementById("tbarTitle");s&&(s.textContent=(o==null?void 0:o.name)||e);const d={home:pn,students:We,messages:An,"coach-applications":Zt,"coach-notes":ea,todolist:Tn,portal:pt,sportal:_e,sexams:Nt,smessages:Et,sprofil:Hn,profile:vn,settings:yn,"student-detail":()=>{r.activeStuId?mn(r.activeStuId):ne("students")},program:()=>{r.activeStuId?Dt(r.activeStuId):ne("students")},exams:()=>{r.activeStuId?Re():ne("students")},appointments:()=>{r.activeStuId?Ve():ne("students")},"dev-dashboard":Cn,"dev-users":mt,"dev-resources":Ze,"dev-finance":ut,"dev-announce":Je,"dev-tickets":Ne,"parent-home":Vn,"parent-progress":Zn,"parent-messages":Et,"parent-ai":Jn,"coach-profile":Rn,"dev-matches":Ut,"coach-resources":Xe};try{(p=d[e])==null||p.call(d)}catch(m){console.error("[switchTab] Render error for tab:",e,m),a&&(a.innerHTML=`<div style="padding:24px;color:var(--text)"><b>Hata Oluştu ⚠️</b><p style="color:var(--text-mid);margin-top:6px">${u(m.message)}</p><pre style="font-size:10px;color:var(--text-dim);white-space:pre-wrap;margin-top:8px">${u((m.stack||"").slice(0,400))}</pre></div>`)}e==="messages"||e==="smessages"?Kt():Ot();const c=document.getElementById("aiChatBubble");c&&(e==="dev-tickets"||e.startsWith("dev-")?c.style.display="none":(h.role==="student"||h.role==="coach"||h.role==="parent")&&(c.style.display="flex"))}function pn(){var t,n;const e=document.getElementById("view-home");if(e)try{const a=new Date,i=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],o=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],s=H(a);let d=0;Object.values(r.messages).forEach(T=>{d+=T.filter(_=>_.from==="student"&&!_.read).length});const c=r.appointments.filter(T=>T.date===s).sort((T,_)=>T.time.localeCompare(_.time)),l=[],p=V(0,0);(r.students||[]).forEach(T=>{let _=0,z=0;for(let A=0;A<7;A++){const C=H(U(p,A)),N=r.tasks[`${T.id}_${C}`]||[];_+=N.length,z+=N.filter(P=>P.done).length}const E=_>0?Math.round(z/_*100):0;_>0&&E<30&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"tasks",icon:"📋",title:"Düşük Görev",desc:`Bu haftaki görev tamamlama oranı <b>%${E}</b>'de kaldı (${z}/${_} görev tamamlandı).`});const M=(r.exams||[]).filter(A=>A.studentId===T.id).sort((A,C)=>new Date(C.date).getTime()-new Date(A.date).getTime()),j={};if(M.forEach(A=>{j[A.type]||(j[A.type]=[]),j[A.type].push(A)}),Object.entries(j).forEach(([A,C])=>{if(C.length>=2){const N=C[0],P=C[1],K=Object.values(N.nets||{}).reduce((J,W)=>J+Number(W||0),0),R=Object.values(P.nets||{}).reduce((J,W)=>J+Number(W||0),0),F=K-R;F<-5&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"exams",icon:"📉",title:`Net Düşüşü (${A})`,desc:`Son denemede <b>${K} net</b> yaptı. Önceki denemesine (${R} net) göre <b>${Math.abs(F).toFixed(1)} net düşüş</b>.`})}}),_===0&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"noplan",icon:"📭",title:"Program Yok",desc:"Bu hafta için henüz hiç görev eklenmemiş."}),_>0&&z===0){let A=!1;for(let C=0;C<3;C++){const N=H(U(a,-C));if((r.tasks[`${T.id}_${N}`]||[]).length>0){A=!0;break}}A&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"inactive",icon:"💤",title:"3 Gündür Pasif",desc:"Son 3 gündür hiçbir görev tamamlanmadı. İletişime geç!"})}_>0&&z===_&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"perfect",icon:"🏆",title:"Harika Hafta!",desc:`Bu haftaki tüm ${_} görevi tamamladı! Tebrik et.`}),(r.studentSpeeds||[]).filter(A=>A.student_id===T.id).forEach(A=>{let C=120;A.exam_type==="TYT"?["Türkçe","Sosyal"].includes(A.subject)?C=100:["Matematik","Fen"].includes(A.subject)&&(C=130):A.exam_type&&A.exam_type.startsWith("AYT")&&(C=180),A.secs_per_question>C&&l.push({studentId:T.id,studentName:T.name,color:T.color,type:"speed",icon:"⚡",title:`Hız Aşımı (${A.exam_type} - ${A.subject})`,desc:`Soru çözüm hızı <b>${A.secs_per_question} sn/soru</b> (Limit: ${C} sn).`})})});let m="";if(l.length===0)m=`
      <div style="text-align:center;padding:16px;color:var(--text-dim);font-size:13px">
        ✅ Harika! Şu an için kritik bir performans düşüşü veya uyarı bulunmuyor.
      </div>`;else{const T={perfect:{badge:"#3ecf8e",badgeBg:"rgba(62,207,142,.12)",border:"rgba(62,207,142,.25)"},noplan:{badge:"#f0a500",badgeBg:"rgba(240,165,0,.1)",border:"rgba(240,165,0,.2)"},inactive:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},tasks:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},exams:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},speed:{badge:"#f0a500",badgeBg:"rgba(240,165,0,.1)",border:"rgba(240,165,0,.2)"}};m=l.map(_=>{const z=T[_.type]||T.tasks;return`<div style="cursor:pointer;padding:10px 12px;margin-bottom:8px;border-radius:8px;background:${z.badgeBg};border:1px solid ${z.border};display:flex;align-items:center;gap:10px;transition:opacity .15s" onclick="openStudentDetail('${_.studentId}')" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
        <div style="font-size:18px;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0">${_.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px">
            <span style="font-size:13px;font-weight:700">${u(_.studentName)}</span>
            <span style="font-size:10px;font-weight:700;color:${z.badge};white-space:nowrap">${_.title}</span>
          </div>
          <div style="font-size:11px;color:var(--text-mid);line-height:1.4">${_.desc}</div>
        </div>
      </div>`}).join("")}const g=a.getHours(),x=g<6?"İyi geceler":g<12?"Günaydın":g<18?"İyi günler":"İyi akşamlar",I=`${String(g).padStart(2,"0")}:${String(a.getMinutes()).padStart(2,"0")}`,f=c.find(T=>T.time>=I),y=new Date(2026,5,14),v=Math.max(0,Math.ceil((y-a)/(1e3*60*60*24))),$=V(0,0);let S=0,B=0;r.students.forEach(T=>{for(let _=0;_<7;_++){const z=r.tasks[`${T.id}_${H(U($,_))}`]||[];S+=z.length,B+=z.filter(E=>E.done).length}});const D=S>0?Math.round(B/S*100):0;e.innerHTML=`
    <!-- HERO -->
    <div class="home-hero">
      <div class="home-hero-left">
        <div class="home-hero-greeting">${x},</div>
        <div class="home-hero-name">${u(((n=(t=h.dbUser)==null?void 0:t.full_name)==null?void 0:n.split(" ")[0])||"Koç")} 👋</div>
        <div class="home-hero-date">${i[a.getDay()]}, ${a.getDate()} ${o[a.getMonth()]} ${a.getFullYear()}</div>
      </div>
      <div class="home-hero-right">
        <div class="home-yks-badge">
          <div class="home-yks-num">${v}</div>
          <div class="home-yks-meta">gün kaldı<br><b>YKS 2026</b></div>
        </div>
      </div>
    </div>

    <!-- STAT KARTLARI -->
    <div class="home-stats-v2">
      <div class="hsv2-card" onclick="switchTab('students')" title="Öğrencilere git">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap hsv2-amber">👥</span>
          <span class="hsv2-trend">→</span>
        </div>
        <div class="hsv2-val">${r.students.length}</div>
        <div class="hsv2-lbl">Aktif Öğrenci</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('students')" title="Öğrencilere git — randevu sekmesi">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap hsv2-blue">📅</span>
          <span class="hsv2-trend" style="color:var(--blue)">${f?f.time:"—"}</span>
        </div>
        <div class="hsv2-val" style="color:var(--blue)">${c.length}</div>
        <div class="hsv2-lbl">Bugün Randevu</div>
        <div class="hsv2-sub">${f?`Sıradaki: ${f.time}`:"Randevu tamamlandı"}</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('messages')" title="Mesajlara git">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${d>0?"hsv2-red":"hsv2-green"}">💬</span>
          ${d>0?`<span class="hsv2-badge-red">${d} yeni</span>`:'<span class="hsv2-badge-green">Temiz</span>'}
        </div>
        <div class="hsv2-val" style="color:${d>0?"var(--red)":"var(--green)"}">${d}</div>
        <div class="hsv2-lbl">Okunmamış Mesaj</div>
        <div class="hsv2-sub">${d>0?"Yanıt bekliyor":"Tüm mesajlar okundu"}</div>
      </div>
      <div class="hsv2-card" title="Haftalık görev durumu">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${D>=70?"hsv2-green":D>=40?"hsv2-amber":"hsv2-red"}">📋</span>
          <span class="hsv2-trend" style="color:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}">%${D}</span>
        </div>
        <div class="hsv2-val" style="color:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}">${B}<span style="font-size:18px;font-weight:500;color:var(--text-dim)">/${S}</span></div>
        <div class="hsv2-lbl">Haftalık Görev</div>
        <div class="hsv2-progress"><div class="hsv2-bar" style="width:${D}%;background:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}"></div></div>
      </div>
    </div>

    <!-- ALT GRID: Uyarılar + Randevular -->
    <div class="home-bottom-grid">
      <div class="home-section-card ${l.length>0?"hsc-has-alerts":""}">
        <div class="hsc-head">
          <span class="hsc-head-icon">${l.length>0?"⚠️":"✅"}</span>
          <span class="hsc-head-title">Erken Uyarılar</span>
          <span class="hsc-pill ${l.length>0?"hsc-pill-red":"hsc-pill-green"}">${l.length>0?l.length+" uyarı":"Temiz"}</span>
        </div>
        <div class="hsc-body">${m}</div>
      </div>
      <div class="home-section-card">
        <div class="hsc-head">
          <span class="hsc-head-icon">📅</span>
          <span class="hsc-head-title">Bugünün Randevuları</span>
          <span class="hsc-pill">${c.length} randevu</span>
        </div>
        <div class="hsc-body">
          ${c.length===0?'<div class="hsc-empty">Bugün randevu yok</div>':""}
          ${c.map(T=>{const _=r.students.find(E=>E.id===T.studentId),z=T.time<I;return`<div class="hsc-appt-row ${z?"hsc-appt-past":""}">
              <div class="hsc-appt-time">${T.time}</div>
              <div class="hsc-appt-bar" style="background:${(_==null?void 0:_.color)||"var(--accent)"}"></div>
              <div style="flex:1;min-width:0">
                <div class="hsc-appt-name">${u((_==null?void 0:_.name)||"?")}</div>
                <div class="hsc-appt-meta">${u(T.type)} · ${T.duration} dk${T.meet_link?` · <a href="${u(T.meet_link)}" target="_blank" style="color:var(--blue);text-decoration:none">${T.meet_link.includes("zoom")?"Zoom":"Meet"} →</a>`:""}</div>
              </div>
              ${z?'<span class="hsc-appt-done">✓</span>':""}
            </div>`}).join("")}
        </div>
      </div>
    </div>

    <!-- HIZLI ERİŞİM -->
    <div style="display:flex;gap:8px;max-width:900px;margin:0 auto 4px;justify-content:center">
      ${[{tab:"messages",icon:"💬",label:"Mesajlar",sub:d>0?d+" okunmamış":"Temiz"},{tab:"coach-notes",icon:"📝",label:"Notlarım",sub:"Kişisel notlar"},{tab:"todolist",icon:"📅",label:"Ajanda",sub:"Tüm randevular"},{tab:"coach-applications",icon:"📩",label:"Başvurular",sub:"Eşleşme talepleri"}].map(({tab:T,icon:_,label:z,sub:E})=>`
        <div onclick="switchTab('${T}')" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:9px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:border-color .15s;flex:1;justify-content:center" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <span style="font-size:16px">${_}</span>
          <div><div style="font-size:12px;font-weight:700">${z}</div><div style="font-size:10px;color:var(--text-dim)">${E}</div></div>
        </div>`).join("")}
    </div>`}catch(a){console.error("[renderHome] HATA:",a),e.innerHTML=`<div style='padding:24px;color:var(--text)'><b>İyi günler 👋</b><p style='color:var(--text-mid);margin-top:6px'>Hata: ${u(a.message)}</p></div>`}}function We(){const e=document.getElementById("view-students"),t=V(0,0),n={};r.students.forEach(s=>{let d=0,c=0,l=0,p=0;for(let m=0;m<7;m++)(r.tasks[`${s.id}_${H(U(t,m))}`]||[]).forEach(x=>{d++,l+=Number(x.duration||0),x.done&&(c++,p+=Number(x.duration||0))});n[s.id]={total:d,done:c,totalMin:l,doneMin:p}});const a=r.students.length,i=r.students.filter(s=>{const d=n[s.id];return d&&d.total>0}).length,o=r.students.filter(s=>{const d=n[s.id];return d&&d.total>0&&d.done===d.total}).length;e.innerHTML=`<div style="max-width:640px;margin:0 auto">
    <!-- Üst başlık -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-.3px">Öğrencilerim</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:3px">${a} öğrenci · ${i} bu hafta aktif · ${o} hafta tamamladı</div>
      </div>
      <button class="btn btn-accent" onclick="openStudentModal()" style="gap:6px;font-size:13px;padding:9px 18px">
        <span style="font-size:16px;line-height:1">+</span> Yeni Öğrenci
      </button>
    </div>

    <!-- Arama -->
    <div style="position:relative;margin-bottom:16px">
      <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:var(--text-dim)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" placeholder="Öğrenci ara..." id="stuSearchInput" oninput="filterStudentSearch()" autocomplete="off"
        style="width:100%;padding:11px 14px 11px 40px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box;transition:border .15s"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
    </div>

    <!-- Öğrenci listesi -->
    <div id="stuSearchResults" style="display:flex;flex-direction:column;gap:8px">
      ${r.students.length===0?`
        <div style="text-align:center;padding:64px 20px;color:var(--text-dim)">
          <div style="width:56px;height:56px;border-radius:16px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 16px">👤</div>
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">Henüz öğrenciniz yok</div>
          <div style="font-size:12px">Yeni öğrenci eklemek için sağ üstteki butonu kullanın.</div>
        </div>
      `:r.students.map(s=>{const d=n[s.id]||{total:0,done:0},c=d.total>0?Math.round(d.done/d.total*100):0,l=c>=80?"var(--green)":c>=40?"var(--accent)":"var(--red)",p=d.total>0&&d.done===d.total,m=r.exams.filter(x=>x.studentId===s.id).sort((x,I)=>I.date.localeCompare(x.date))[0],g=m?Object.values(m.nets||{}).reduce((x,I)=>x+I,0).toFixed(1):null;return`<div class="stu-row" id="sturow_${s.id}" onclick="openStudentDetail('${s.id}')" style="padding:12px 16px;align-items:center;gap:12px;border-radius:10px">
          <div style="width:38px;height:38px;border-radius:10px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0">${s.name[0]}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--text)">${u(s.name)}</div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:1px">${u(s.target||"Hedef belirtilmemiş")}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;font-size:11px;color:var(--text-mid)">
            <span style="font-weight:700;color:${l}">%${c}</span>
            <span style="color:var(--border2)">·</span>
            <span>${d.done}/${d.total} görev</span>
            ${g?`<span style="color:var(--border2)">·</span><span><b style="color:var(--text)">${g}</b> net</span>`:""}
            ${p?'<span style="color:var(--border2)">·</span><span style="color:var(--green);font-weight:600">✓ Tamam</span>':""}
          </div>
          <svg style="width:13px;height:13px;color:var(--border2);flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        </div>`}).join("")}
    </div>
    <div id="stuSearchNoResults" style="display:none;text-align:center;padding:48px 20px;color:var(--text-dim)">
      <div style="font-size:13px">Aramanızla eşleşen öğrenci bulunamadı.</div>
    </div>
  </div>`}function Ta(){const e=document.getElementById("stuSearchInput").value.trim().toLowerCase(),t=document.getElementById("stuSearchNoResults");let n=0;r.students.forEach(a=>{const i=document.getElementById("sturow_"+a.id);if(i){const o=a.name.toLowerCase().includes(e);i.style.display=o?"flex":"none",o&&n++}}),t&&(t.style.display=e&&n===0?"block":"none")}function mn(e){if(!r.students.find(p=>p.id===e))return;r.activeStuId=e;const t=r.students.find(p=>p.id===r.activeStuId),n=V(0,t.weekStart||0);let a=0,i=0,o=0;for(let p=0;p<7;p++){const m=r.tasks[`${t.id}_${H(U(n,p))}`]||[];a+=m.length,i+=m.filter(g=>g.done).length,o+=m.reduce((g,x)=>g+Number(x.duration||0),0)}const s=a>0?Math.round(i/a*100):0,d=s>=80?"var(--green)":s>=50?"var(--accent)":"var(--red)",c=document.getElementById("view-student-detail");c.innerHTML=`
    <button class="back-link" onclick="switchTab('students')">← Öğrencilerim</button>

    <!-- Öğrenci başlık -->
    <div style="display:flex;align-items:flex-start;gap:18px;padding-bottom:24px;border-bottom:1px solid var(--border);margin-bottom:0">
      <div style="width:52px;height:52px;border-radius:12px;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;flex-shrink:0">${t.name[0]}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:20px;font-weight:800;letter-spacing:-.3px;line-height:1.2">${u(t.name)}</div>
        <div style="font-size:13px;color:var(--text-mid);margin-top:3px">${u(t.target||"Hedef belirtilmemiş")}</div>
        <div style="display:flex;gap:28px;margin-top:14px;flex-wrap:wrap">
          <div><div style="font-size:22px;font-weight:800;color:var(--accent);line-height:1;letter-spacing:-.5px">${a}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Bu Hafta</div></div>
          <div><div style="font-size:22px;font-weight:800;color:var(--green);line-height:1;letter-spacing:-.5px">${i}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Tamamlanan</div></div>
          <div><div style="font-size:22px;font-weight:800;color:${d};line-height:1;letter-spacing:-.5px">%${s}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Oran</div></div>
          <div><div style="font-size:22px;font-weight:800;color:var(--blue);line-height:1;letter-spacing:-.5px">${Math.round(o/60)}s</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Çalışma</div></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;padding-top:4px">
        <button class="btn btn-ghost btn-sm" onclick="switchTab('messages');setTimeout(()=>selectThread('${t.id}'),100)" style="gap:5px">💬 Mesaj</button>
        <button class="btn btn-ghost btn-sm" onclick="openStudentModal('${t.id}')" style="gap:5px">✏️ Düzenle</button>
      </div>
    </div>

    <!-- Sekme navigasyonu -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:24px;overflow-x:auto">
      ${[{label:"Program",icon:"📋",fn:`openStudentProgram('${t.id}')`},{label:"Denemeler",icon:"📊",fn:`openStudentExams('${t.id}')`},{label:"Randevular",icon:"📅",fn:`openStudentAppointments('${t.id}')`},{label:"Notlar",icon:"📝",fn:`openStudentNotes('${t.id}')`},{label:"Kaynaklar",icon:"📖",fn:`openStudentKaynaklar('${t.id}')`},{label:"Konu Haritası",icon:"🗺️",fn:`openKonuHaritasi('${t.id}')`},{label:"Hız",icon:"⚡",fn:`openSpeedModal('${t.id}')`},{label:"Rapor",icon:"📄",fn:`openReportModal('${t.id}')`}].map(p=>`<button onclick="${p.fn}" style="display:flex;align-items:center;gap:6px;padding:14px 18px;background:none;border:none;border-bottom:2px solid transparent;font-size:13px;font-weight:600;color:var(--text-mid);cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s" onmouseover="this.style.color='var(--text)';this.style.borderBottomColor='var(--border2)'" onmouseout="this.style.color='var(--text-mid)';this.style.borderBottomColor='transparent'">${p.icon} ${p.label}</button>`).join("")}
    </div>

    <!-- Haftalık ilerleme -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:16px;box-shadow:var(--shadow)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text)">Haftalık İlerleme</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${i} tamamlandı · ${a-i} kaldı · ${Math.round(o/60)} saat</div>
        </div>
        <div style="font-size:28px;font-weight:800;color:${d};letter-spacing:-.5px">%${s}</div>
      </div>
      <div style="height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${s}%;background:${d};border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px">
        <span style="font-size:11px;color:var(--text-dim)">0%</span>
        <span style="font-size:11px;color:var(--text-dim)">100%</span>
      </div>
    </div>

    <!-- AI COPILOT SECTION -->
    <div class="card" style="margin-top:16px; border: 1px dashed var(--accent); padding: 18px; border-radius: 14px; background: var(--surface)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px">
        <span style="font-size:24px">🤖</span>
        <div>
          <h3 style="margin:0; font-family:'Inter',sans-serif; font-size:16px; font-weight:800">Yapay Zeka Copilot</h3>
          <p style="margin:2px 0 0 0; font-size:11px; color:var(--text-dim)">Öğrencinin haftalık performans verilerini analiz ederek kişiselleştirilmiş bir mesaj taslağı hazırlayın.</p>
        </div>
      </div>
      
      <div style="margin-bottom:12px">
        <button id="aiCopilotBtn" class="btn btn-accent btn-sm" onclick="generateAICopilotDraft('${t.id}')">🤖 Durum Analizi Yap ve Taslak Oluştur</button>
      </div>
      
      <div id="aiCopilotResultArea" style="display:none; margin-top:12px">
        <div id="aiCopilotAnalysisBox" style="background:var(--surface2); border:1px solid var(--border); padding:12px; border-radius:8px; font-size:12px; margin-bottom:12px; line-height:1.5">
          <!-- Analiz buraya gelecek -->
        </div>
        <div style="background:var(--accent-dim); border:1px solid var(--accent); color:var(--accent); padding:10px; border-radius:8px; font-size:11px; margin-bottom:10px">
          💡 <b>Önemli Not:</b> Yapay zekanın hazırladığı taslak aşağıdadır. Gönderebilmek için taslağı en az bir karakter değiştirecek şekilde düzenlemelisiniz.
        </div>
        <div class="field">
          <label style="font-size:11px; font-weight:700">Mesaj Taslağı (Düzenlenmesi Zorunlu)</label>
          <textarea id="aiCopilotTextarea" style="width:100%; min-height:150px; font-family:inherit; font-size:13px; line-height:1.5; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--surface2); color:var(--text)" oninput="checkCopilotDraftEdited()"></textarea>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px">
          <button id="aiCopilotSendBtn" class="btn btn-accent btn-sm" onclick="sendCopilotDraft('${t.id}')" style="background:var(--green); border-color:var(--green); color:white" disabled>✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder</button>
          <span id="aiCopilotEditWarning" style="color:var(--red); font-size:11px; font-weight:bold">Öğrenciye gönderebilmek için taslak üzerinde en az bir değişiklik yapmalısınız.</span>
        </div>
      </div>
    </div>`,currentTab!=="student-detail"&&ne("student-detail");const l=document.getElementById("tbarTitle");l&&(l.textContent=t.name)}const Be=[{stars:0,label:"Başlanmadı",color:"#6b7280",bg:"rgba(107,114,128,.08)",border:"rgba(107,114,128,.2)"},{stars:1,label:"Anlamadım",color:"#ef4444",bg:"rgba(239,68,68,.08)",border:"rgba(239,68,68,.2)"},{stars:2,label:"Temel Zorluk",color:"#f97316",bg:"rgba(249,115,22,.08)",border:"rgba(249,115,22,.2)"},{stars:3,label:"Temel OK",color:"#eab308",bg:"rgba(234,179,8,.08)",border:"rgba(234,179,8,.2)"},{stars:4,label:"Orta Seviye",color:"#84cc16",bg:"rgba(132,204,22,.08)",border:"rgba(132,204,22,.2)"},{stars:5,label:"İleri Seviye",color:"#22c55e",bg:"rgba(34,197,94,.08)",border:"rgba(34,197,94,.2)"},{stars:6,label:"Uzman",color:"#10b981",bg:"rgba(16,185,129,.08)",border:"rgba(16,185,129,.2)"},{stars:7,label:"Tekrar Dışı (TD)",color:"#3b82f6",bg:"rgba(59,130,246,.1)",border:"rgba(59,130,246,.3)"}];function un(e){const t=new Date(e),n=t.getDate(),a=n<=10?1:n<=20?11:21;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Ea(e=6){const t=[],n=new Date;let a=new Date(n);for(let i=0;i<e;i++){const o=un(a);t.find(l=>l.start===o)||t.unshift({start:o,label:Sa(o)});const[s,d,c]=o.split("-").map(Number);if(c===21?a=new Date(s,d-1,11):c===11?a=new Date(s,d-1,1):a=new Date(s,d-2,21),t.length>=e)break}return t.slice(-e)}function Sa(e){const[t,n,a]=e.split("-").map(Number),i=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],o=a===1?10:a===11?20:new Date(t,n,0).getDate();return`${a}-${o} ${i[n-1]}`}async function Ia(e){const t=r.students.find(f=>f.id===e);if(!t)return;const n=document.getElementById("view-student-detail");n.innerHTML=`<button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button><div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`;const a=h.role==="coach"||h.role==="developer",i=Object.keys(De);let o=i[0],s="mastery";function d(f,y){var v,$;return(($=(v=r.konuMastery[e])==null?void 0:v[f])==null?void 0:$[y])||null}function c(f,y){var v,$;return(($=(v=r.konuTekrarLog[e])==null?void 0:v[f])==null?void 0:$[y])||{}}async function l(f,y,v,$){const S=d(f,y),B=new Date().toISOString(),D=$||(v>=7?"td":v>0?"active":"not_started"),T={student_id:e,coach_id:h.coachId,subject:f,konu:y,stars:v,status:D,updated_at:B,...D==="active"&&!(S!=null&&S.ka_date)?{ka_date:B}:{},...D==="td"&&!(S!=null&&S.td_date)?{td_date:B}:{},...D==="active"&&(S==null?void 0:S.status)==="td"?{td_date:null}:{}},{data:_,error:z}=await b.from("konu_mastery").upsert(T,{onConflict:"student_id,subject,konu"}).select().single();if(z){k("Hata: "+z.message);return}return r.konuMastery[e]||(r.konuMastery[e]={}),r.konuMastery[e][f]||(r.konuMastery[e][f]={}),r.konuMastery[e][f][y]=_,_}async function p(f,y,v,$){const S=new Date().toISOString(),B={student_id:e,coach_id:h.coachId,subject:f,konu:y,period_start:v,review_count:$,updated_at:S},{data:D,error:T}=await b.from("konu_tekrar_log").upsert(B,{onConflict:"student_id,subject,konu,period_start"}).select().single();if(T){k("Hata: "+T.message);return}return r.konuTekrarLog[e]||(r.konuTekrarLog[e]={}),r.konuTekrarLog[e][f]||(r.konuTekrarLog[e][f]={}),r.konuTekrarLog[e][f][y]||(r.konuTekrarLog[e][f][y]={}),r.konuTekrarLog[e][f][y][v]=D,D}function m(f){const y=De[f]||[],v=y.map((_,z)=>{const E=d(f,_),M=(E==null?void 0:E.stars)||0,j=(E==null?void 0:E.status)||"not_started",w=Be[M],A=j==="td",C=z%2===0?"var(--surface)":"var(--surface2)",N=c(f,_),P=Object.values(N).reduce((W,Q)=>W+(Q.review_count||0),0),K=E!=null&&E.last_review_date?new Date(E.last_review_date).toLocaleDateString("tr-TR",{day:"2-digit",month:"short"}):"—",R=a?Array.from({length:7},(W,Q)=>{const ee=Q+1,pe=ee<=M,ft=JSON.stringify(_),xt=JSON.stringify(f);return`<span class="km-star${pe?" km-star-on":""}" data-stars="${ee}" 
          onclick="window._kmSetStars(${xt},${ft},${ee})"
          title="${Be[ee].label}"
          style="cursor:pointer;font-size:16px;line-height:1;transition:transform .1s;display:inline-block"
          onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'"
        >${pe?"⭐":"☆"}</span>`}).join(""):Array.from({length:7},(W,Q)=>`<span style="font-size:14px;opacity:${Q<M?1:.25}">${Q<M?"⭐":"☆"}</span>`).join("");let F="";return A?F='<span style="font-size:9px;font-weight:800;color:#3b82f6;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);border-radius:4px;padding:1px 5px;margin-left:4px">TD</span>':E!=null&&E.ka_date&&(F='<span style="font-size:9px;font-weight:700;color:#10b981;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);border-radius:4px;padding:1px 5px;margin-left:4px">KA✓</span>'),`<tr id="${"km_"+btoa(encodeURIComponent(f+"|"+_)).replace(/[^a-zA-Z0-9]/g,"")}" style="background:${w.bg};border-bottom:1px solid ${w.border};transition:background .3s">
        <td style="padding:10px 14px;font-size:12px;font-weight:600;color:var(--text);min-width:200px;position:sticky;left:0;z-index:1;background:${C};border-right:1px solid var(--border)">
          ${u(_)}${F}
        </td>
        <td style="padding:8px 12px;white-space:nowrap">
          ${R}
        </td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:${w.color};white-space:nowrap">
          ${M>0?w.label:'<span style="color:var(--text-dim)">—</span>'}
        </td>
        <td style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-mid);white-space:nowrap">
          ${P>0?`<b style="color:var(--text)">${P}×</b>`:"—"}
        </td>
        <td style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-dim);white-space:nowrap">${K}</td>
        ${a?`<td style="padding:8px 8px;text-align:center;white-space:nowrap">
          <button onclick="window._kmToggleKA(${JSON.stringify(f)},${JSON.stringify(_)})" 
            style="font-size:10px;padding:3px 7px;border-radius:5px;border:1px solid var(--border);background:var(--surface2);color:var(--text-mid);cursor:pointer;margin-right:4px" 
            title="Konu Anlatımı tamamlandı">KA</button>
          <button onclick="window._kmToggleTD(${JSON.stringify(f)},${JSON.stringify(_)})" 
            style="font-size:10px;padding:3px 7px;border-radius:5px;border:1px solid ${A?"#3b82f6":"var(--border)"};background:${A?"rgba(59,130,246,.15)":"var(--surface2)"};color:${A?"#3b82f6":"var(--text-mid)"};cursor:pointer;font-weight:${A?"800":"400"}" 
            title="Tekrar Dışı">TD</button>
        </td>`:""}
      </tr>`}).join(""),$=y.map(_=>d(f,_)),S=Array(8).fill(0);$.forEach(_=>S[(_==null?void 0:_.stars)||0]++);const B=$.filter(_=>(_==null?void 0:_.status)==="td").length,D=$.filter(_=>(_==null?void 0:_.status)==="active").length;return`<div style="display:flex;gap:12px;flex-wrap:wrap;padding:12px 16px;background:var(--surface2);border-bottom:1px solid var(--border);align-items:center">
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:var(--text)">${y.length}</b> konu</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#3b82f6">${B}</b> TD</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#22c55e">${D}</b> aktif</span>
      <span style="font-size:11px;color:var(--text-dim)"><b style="color:#6b7280">${S[0]}</b> başlanmadı</span>
      <div style="flex:1;height:6px;background:var(--surface3);border-radius:99px;overflow:hidden;min-width:80px;max-width:200px">
        <div style="height:100%;width:${y.length>0?Math.round(B/y.length*100):0}%;background:#3b82f6;border-radius:99px"></div>
      </div>
      <span style="font-size:11px;color:#3b82f6;font-weight:700">${y.length>0?Math.round(B/y.length*100):0}% TD</span>
    </div>`+`<div style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:var(--surface2)">
            <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);border-right:1px solid var(--border);position:sticky;left:0;z-index:2;background:var(--surface2);white-space:nowrap;min-width:200px">KONU</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">HAKİMİYET</th>
            <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">SEVİYE</th>
            <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">TEKRAR</th>
            <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">SON TEKRAR</th>
            ${a?'<th style="padding:8px 8px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap">İŞLEMLER</th>':""}
          </tr>
        </thead>
        <tbody>${v}</tbody>
      </table>
    </div>`}function g(f){const y=De[f]||[],v=Ea(6),$=un(new Date),S=`<tr style="background:var(--surface2)">
      <th style="padding:8px 14px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);border-right:1px solid var(--border);position:sticky;left:0;z-index:2;background:var(--surface2);white-space:nowrap;min-width:200px">KONU</th>
      <th style="padding:8px 8px;text-align:left;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap;min-width:60px">⭐</th>
      ${v.map(D=>`<th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:${D.start===$?"var(--accent)":"var(--text-dim)"};background:${D.start===$?"var(--accent-dim)":"var(--surface2)"};white-space:nowrap;min-width:100px;border-left:1px solid var(--border)">${D.label}</th>`).join("")}
      <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text-dim);white-space:nowrap;border-left:2px solid var(--border)">TOPLAM</th>
    </tr>`,B=y.map((D,T)=>{const _=d(f,D),z=(_==null?void 0:_.stars)||0,M=((_==null?void 0:_.status)||"not_started")==="td",j=Be[z],w=T%2===0?"var(--surface)":"var(--surface2)",A=c(f,D);let C=0;const N=v.map(K=>{const R=A[K.start],F=(R==null?void 0:R.review_count)||0;C+=F;const J=K.start===$;if(a){const W=Array.from({length:6},(Q,ee)=>{const pe=ee<F,ft=JSON.stringify(D),xt=JSON.stringify(f),na=JSON.stringify(K.start);return`<span class="kt-box${pe?" kt-box-on":""}"
              onclick="window._ktToggleBox(${xt},${ft},${na},${ee+1})"
              style="display:inline-block;width:14px;height:14px;border-radius:3px;border:1.5px solid ${pe?j.color:"var(--border2)"};background:${pe?j.bg:"transparent"};cursor:pointer;transition:all .15s;margin:1px"
              title="${ee+1}. tekrar"
            ></span>`}).join("");return`<td style="padding:6px 10px;border-left:1px solid var(--border);background:${J?"var(--accent-dim)":w};text-align:center">${W}</td>`}else{const W=Array.from({length:6},(Q,ee)=>{const pe=ee<F;return`<span style="display:inline-block;width:12px;height:12px;border-radius:3px;border:1.5px solid ${pe?j.color:"var(--border2)"};background:${pe?j.bg:"transparent"};margin:1px"></span>`}).join("");return`<td style="padding:6px 10px;border-left:1px solid var(--border);background:${J?"var(--accent-dim)":w};text-align:center">${W}</td>`}}).join(""),P=M?'<span style="font-size:9px;font-weight:800;color:#3b82f6;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);border-radius:4px;padding:1px 5px;margin-left:4px">TD</span>':"";return`<tr style="background:${w}">
        <td style="padding:8px 14px;font-size:12px;font-weight:600;color:var(--text);border-right:1px solid var(--border);position:sticky;left:0;z-index:1;background:${w};white-space:nowrap">
          ${u(D)}${P}
        </td>
        <td style="padding:8px 8px;white-space:nowrap">
          <span style="font-size:11px">${"⭐".repeat(Math.max(0,z))}</span>
        </td>
        ${N}
        <td style="padding:8px 10px;text-align:center;font-size:12px;font-weight:800;color:${C>0?j.color:"var(--text-dim)"};border-left:2px solid var(--border)">${C||0}</td>
      </tr>`}).join("");return`<div style="overflow-x:auto"><table style="border-collapse:collapse;width:max-content;min-width:100%"><thead>${S}</thead><tbody>${B}</tbody></table></div>`}window._kmSetStars=async function(f,y,v){const $=d(f,y),S=($==null?void 0:$.status)==="td"&&v<7?"active":null;await l(f,y,v,S);const B="km_"+btoa(encodeURIComponent(f+"|"+y)).replace(/[^a-zA-Z0-9]/g,"");if(document.getElementById(B)){const T=m(f);document.getElementById("khTable").innerHTML=T}k(`${y}: ${Be[v].label} ✓`)},window._kmToggleKA=async function(f,y){const v=d(f,y),$=new Date().toISOString(),S=!!(v!=null&&v.ka_date),B={student_id:e,coach_id:h.coachId,subject:f,konu:y,stars:(v==null?void 0:v.stars)||1,status:(v==null?void 0:v.status)||"active",ka_date:S?null:$,updated_at:$},{data:D,error:T}=await b.from("konu_mastery").upsert(B,{onConflict:"student_id,subject,konu"}).select().single();if(T){k("Hata: "+T.message);return}r.konuMastery[e]||(r.konuMastery[e]={}),r.konuMastery[e][f]||(r.konuMastery[e][f]={}),r.konuMastery[e][f][y]=D,document.getElementById("khTable").innerHTML=m(f),k(S?"KA tarihi kaldırıldı":"KA ✓ tamamlandı olarak işaretlendi")},window._kmToggleTD=async function(f,y){const v=d(f,y),$=(v==null?void 0:v.status)==="td",S=$?(v==null?void 0:v.stars)>=7?5:v==null?void 0:v.stars:7;await l(f,y,S,$?"active":"td"),document.getElementById("khTable").innerHTML=s==="mastery"?m(f):g(f),k($?`${y} tekrar listesine geri döndü`:`${y} → TD ✓`)},window._ktToggleBox=async function(f,y,v,$){const B=c(f,y)[v],T=((B==null?void 0:B.review_count)||0)>=$?$-1:$;if(await p(f,y,v,T),T>0){const _=d(f,y),z=new Date().toISOString(),E={student_id:e,coach_id:h.coachId,subject:f,konu:y,stars:(_==null?void 0:_.stars)||0,status:(_==null?void 0:_.status)||"active",last_review_date:z,review_count:((_==null?void 0:_.review_count)||0)+1,updated_at:z},{data:M}=await b.from("konu_mastery").upsert(E,{onConflict:"student_id,subject,konu"}).select().single();M&&(r.konuMastery[e]||(r.konuMastery[e]={}),r.konuMastery[e][f]||(r.konuMastery[e][f]={}),r.konuMastery[e][f][y]=M)}document.getElementById("khTable").innerHTML=g(f)};function x(){const f=window._khActiveSub||o;document.getElementById("khTable").innerHTML=s==="mastery"?m(f):g(f)}const I=i.map(f=>`<button class="kh-tab" onclick="window._khActiveSub='${f}';document.querySelectorAll('.kh-tab').forEach(b=>{b.style.color='var(--text-mid)';b.style.borderBottom='2px solid transparent';b.style.fontWeight='600'});this.style.color='var(--accent)';this.style.borderBottom='2px solid var(--accent)';this.style.fontWeight='700';window._khRefresh()"
      style="padding:10px 16px;border:none;border-bottom:2px solid ${f===o?"var(--accent)":"transparent"};background:none;font-size:12px;font-weight:${f===o?"700":"600"};color:${f===o?"var(--accent)":"var(--text-mid)"};cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s">${f}</button>`).join("");window._khActiveSub=o,window._khRefresh=x,n.innerHTML=`
    <button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <div style="font-size:18px;font-weight:800;letter-spacing:-.2px">${u(t.name)} — Konu Haritası</div>
      <div style="display:flex;gap:8px;align-items:center">
        <div style="display:flex;border:1.5px solid var(--border);border-radius:8px;overflow:hidden;font-size:12px">
          <button id="kmViewMastery" onclick="window._kmSwitchView('mastery')" style="padding:7px 14px;border:none;border-right:1px solid var(--border);background:var(--accent);color:#fff;font-weight:700;cursor:pointer;font-family:inherit">⭐ Hakimiyet</button>
          <button id="kmViewTekrar" onclick="window._kmSwitchView('tekrar')" style="padding:7px 14px;border:none;background:var(--surface);color:var(--text-mid);font-weight:600;cursor:pointer;font-family:inherit">🔄 Tekrar Takvimi</button>
        </div>
      </div>
    </div>

    <!-- Yıldız açıklama rehberi (collapsible) -->
    <details style="margin-bottom:12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden">
      <summary style="padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;color:var(--text-mid);list-style:none;display:flex;align-items:center;gap:6px">
        ℹ️ Yıldız Seviye Rehberi
        <svg style="width:14px;height:14px;margin-left:auto" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div style="padding:12px 16px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:8px">
        ${Be.slice(1).map(f=>`
          <div style="display:flex;align-items:center;gap:6px;font-size:11px">
            <span style="font-weight:800;color:${f.color}">⭐${f.stars}</span>
            <span style="color:var(--text-mid)">${f.label}</span>
          </div>`).join('<span style="color:var(--border2)">·</span>')}
      </div>
    </details>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--shadow)">
      <div style="display:flex;border-bottom:1px solid var(--border);overflow-x:auto;padding:0 4px">${I}</div>
      <div id="khTable" style="overflow-x:auto;max-height:calc(100vh - 310px);overflow-y:auto">${m(o)}</div>
    </div>`,window._kmSwitchView=function(f){s=f;const y=document.getElementById("kmViewMastery"),v=document.getElementById("kmViewTekrar");f==="mastery"?(y.style.background="var(--accent)",y.style.color="#fff",y.style.fontWeight="700",v.style.background="var(--surface)",v.style.color="var(--text-mid)",v.style.fontWeight="600"):(v.style.background="var(--accent)",v.style.color="#fff",v.style.fontWeight="700",y.style.background="var(--surface)",y.style.color="var(--text-mid)",y.style.fontWeight="600"),window._khRefresh()}}function Dt(e){var i,o;r.activeStuId=e;const t=document.getElementById("view-program"),n=((i=r.students.find(s=>s.id===r.activeStuId))==null?void 0:i.name)||"";t.innerHTML=`<button class="back-link" onclick="switchTab('student-detail')">← ${n}</button>`,t.innerHTML+=document.createElement("div").innerHTML,currentTab!=="program"&&ne("program");const a=document.getElementById("tbarTitle");a&&(a.textContent=(((o=r.students.find(s=>s.id===r.activeStuId))==null?void 0:o.name)||"")+" · Program"),G()}function _a(e){var n;r.activeStuId=e,currentTab!=="exams"&&ne("exams");const t=document.getElementById("tbarTitle");t&&(t.textContent=(((n=r.students.find(a=>a.id===r.activeStuId))==null?void 0:n.name)||"")+" · Denemeler"),Re()}function za(e){var n;r.activeStuId=e,currentTab!=="appointments"&&ne("appointments");const t=document.getElementById("tbarTitle");t&&(t.textContent=(((n=r.students.find(a=>a.id===r.activeStuId))==null?void 0:n.name)||"")+" · Randevular"),Ve()}let ce={};async function Ba(e){const t=r.students.find(a=>a.id===e);if(!t)return;r.activeStuId=e,currentTab!=="student-detail"&&ne("student-detail");const n=document.getElementById("view-student-detail");if(n.innerHTML=`<button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button>
    <div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`,!ce[e]){const{data:a}=await b.from("student_books").select("*").eq("student_id",e).order("created_at",{ascending:!0});ce[e]=a||[]}Lt(e)}function Lt(e){const t=r.students.find(p=>p.id===e),n=ce[e]||[],a=document.getElementById("view-student-detail"),i=h.role==="coach"||h.role==="developer",o=n.reduce((p,m)=>p+m.total_tests,0),s=n.reduce((p,m)=>p+m.completed_tests,0),d=o>0?Math.round(s/o*100):0,c=d>=75?"var(--green)":d>=40?"var(--accent)":"var(--red)",l=n.length?n.map(p=>{const m=p.total_tests>0?Math.min(100,Math.round(p.completed_tests/p.total_tests*100)):0,g=m>=75?"var(--green)":m>=40?"var(--accent)":"var(--red)";return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;margin-bottom:7px">${u(p.name)}</div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;height:7px;background:var(--surface3);border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${m}%;background:${g};border-radius:99px;transition:width .4s"></div>
            </div>
            <span style="font-size:12px;font-weight:800;color:${g};white-space:nowrap;min-width:36px;text-align:right">%${m}</span>
          </div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:4px">${p.completed_tests} / ${p.total_tests} test tamamlandı</div>
        </div>
        ${i?`<div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-ghost btn-xs" onclick="editStudentBook('${e}','${p.id}')">✏️</button>
          <button class="btn btn-danger btn-xs" onclick="deleteStudentBook('${e}','${p.id}')" style="opacity:.4" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.4">🗑</button>
        </div>`:""}
      </div>
    </div>`}).join(""):'<div class="empty"><p>Henüz kaynak eklenmemiş.</p></div>';a.innerHTML=`
    <button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-.2px">${u(t.name)} — Kaynaklar</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${n.length} kaynak · ${s}/${o} test tamamlandı</div>
      </div>
      ${i?`<button class="btn btn-accent btn-sm" onclick="addStudentBook('${e}')">+ Kaynak Ekle</button>`:""}
    </div>
    ${n.length>1?`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="flex:1">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Genel İlerleme</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="flex:1;height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${d}%;background:${c};border-radius:99px;transition:width .4s"></div>
          </div>
          <span style="font-size:14px;font-weight:800;color:${c};white-space:nowrap">%${d}</span>
        </div>
      </div>
    </div>`:""}
    ${l}`}function Ma(e){document.getElementById("sbModalTitle").textContent="Kaynak Ekle",document.getElementById("sbId").value="",document.getElementById("sbStuId").value=e,document.getElementById("sbName").value="",document.getElementById("sbTotal").value="0",document.getElementById("sbCompleted").value="0",document.getElementById("sbPctPreview").innerHTML="",Y("sbModal")}function Aa(e,t){const n=(ce[e]||[]).find(a=>a.id===t);n&&(document.getElementById("sbModalTitle").textContent="Kaynağı Düzenle",document.getElementById("sbId").value=t,document.getElementById("sbStuId").value=e,document.getElementById("sbName").value=n.name,document.getElementById("sbTotal").value=n.total_tests,document.getElementById("sbCompleted").value=n.completed_tests,gn(),Y("sbModal"))}function gn(){var o,s;const e=parseInt((o=document.getElementById("sbTotal"))==null?void 0:o.value)||0,t=parseInt((s=document.getElementById("sbCompleted"))==null?void 0:s.value)||0,n=document.getElementById("sbPctPreview");if(!n||!e){n&&(n.innerHTML="");return}const a=Math.min(100,Math.round(t/e*100)),i=a>=75?"var(--green)":a>=40?"var(--accent)":"var(--red)";n.innerHTML=`<div style="display:flex;align-items:center;gap:10px">
    <div style="flex:1;height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${a}%;background:${i};border-radius:99px;transition:width .3s"></div>
    </div>
    <span style="font-size:13px;font-weight:800;color:${i}">%${a}</span>
  </div>`}async function Da(){const e=document.getElementById("sbName").value.trim();if(!e)return k("Kaynak adı girin!");const t=Math.max(0,parseInt(document.getElementById("sbTotal").value)||0),n=Math.min(t,Math.max(0,parseInt(document.getElementById("sbCompleted").value)||0)),a=document.getElementById("sbStuId").value,i=document.getElementById("sbId").value,o={name:e,total_tests:t,completed_tests:n};if(i){const{error:s}=await b.from("student_books").update(o).eq("id",i);if(s)return k("Hata: "+s.message);const d=(ce[a]||[]).find(c=>c.id===i);d&&Object.assign(d,o),k("Güncellendi ✓")}else{const{data:s,error:d}=await b.from("student_books").insert({...o,student_id:a,coach_id:h.coachId}).select().single();if(d)return k("Hata: "+d.message);ce[a]||(ce[a]=[]),ce[a].push(s),k("Kaynak eklendi ✓")}O("sbModal"),Lt(a)}async function La(e,t){if(!await X("Bu kaynağı silmek istiyor musunuz?"))return;const{error:n}=await b.from("student_books").delete().eq("id",t);if(n)return k("Hata: "+n.message);ce[e]=(ce[e]||[]).filter(a=>a.id!==t),Lt(e),k("Silindi ✓")}function vn(){var i,o;const e=document.getElementById("view-profile"),t=h.dbUser,n=((t==null?void 0:t.full_name)||"?").split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase(),a=h.role==="coach"?"Koç":h.role==="developer"?"Developer":"Öğrenci";e.innerHTML=`
    <div style="max-width:480px;margin:0 auto">
      <!-- Mini user card -->
      <div style="display:flex;align-items:center;gap:14px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:20px;box-shadow:var(--shadow)">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0">${n}</div>
        <div>
          <div style="font-size:16px;font-weight:800;letter-spacing:-.2px">${u((t==null?void 0:t.full_name)||"")}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${a} · ${u(((i=r.workspace)==null?void 0:i.brand_name)||"Rostrum Akademi")}</div>
        </div>
      </div>

      <!-- Form -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:16px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Ad Soyad</label>
          <input id="pf_name" value="${u((t==null?void 0:t.full_name)||"")}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Kullanıcı Adı</label>
          <input id="pf_user" value="${u((t==null?void 0:t.username)||"")}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        ${h.role==="coach"||h.role==="developer"?`<div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Akademi Adı</label>
          <input id="pf_brand" value="${u(((o=r.workspace)==null?void 0:o.brand_name)||"")}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`:""}
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Yeni Şifre <span style="font-weight:400;text-transform:none">(boş bırakılırsa değişmez)</span></label>
          <input type="password" id="pf_pass" placeholder="••••••••" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <button class="btn btn-accent" onclick="saveProfile()" style="align-self:flex-start;padding:9px 20px">Kaydet</button>
      </div>
    </div>`}async function Ca(){var i,o;const e=document.getElementById("pf_name").value.trim(),t=document.getElementById("pf_pass").value,n=(o=(i=document.getElementById("pf_brand"))==null?void 0:i.value)==null?void 0:o.trim();if(!e)return k("Ad boş olamaz!");const a={full_name:e};t&&(a.password_hash=await Ie(t)),await b.from("users").update(a).eq("id",h.dbUser.id),n&&(h.role==="coach"||h.role==="developer")&&(await b.from("workspaces").update({brand_name:n}).eq("coach_id",h.coachId),r.workspace={...r.workspace||{},brand_name:n},document.querySelector(".sb-logo-text").textContent=n),h.dbUser={...h.dbUser,full_name:e},document.getElementById("sbName").textContent=e,k("Profil kaydedildi ✓")}function yn(){var n;const e=document.getElementById("view-settings"),t=document.documentElement.getAttribute("data-theme")==="dark";e.innerHTML=`
    <div style="max-width:500px;margin:0 auto">
      <div class="settings-block">
        <div class="settings-block-title">Görünüm</div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Mod</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-sm ${t?"btn-accent":"btn-ghost"}" onclick="setTheme('dark');renderSettings()">🌙 Karanlık</button>
            <button class="btn btn-sm ${t?"btn-ghost":"btn-accent"}" onclick="setTheme('light');renderSettings()">☀️ Aydınlık</button>
          </div>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Accent Rengi</div></div>
          <div class="accent-palette">
            ${On.map(a=>`<div class="ac-dot" onclick="applyAccent('${a.val}','${a.dim}')" style="background:${a.val}" title="${a.name}"></div>`).join("")}
          </div>
        </div>
      </div>
      
      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Yapay Zeka (AI) Ayarları</div>
        <div class="setting-item" style="flex-direction:column;align-items:flex-start;gap:10px">
          <div>
            <div class="setting-item-lbl">Gemini API Anahtarı</div>
            <div class="setting-item-sub" style="font-size:11px;line-height:1.5;margin-top:2px">Yerel olarak çalıştığınızda AI Asistanı kullanabilmek için kendi API anahtarınızı girmelisiniz. Bu anahtar tarayıcınızda güvenle saklanır.</div>
          </div>
          <div style="display:flex;gap:8px;width:100%">
            <input type="text" id="geminiApiKeyInput" value="${u(localStorage.getItem("gemini_api_key")||"")}" placeholder="AIzaSy..." style="flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:12px;outline:none" autocomplete="off">
            <button class="btn btn-accent btn-sm" onclick="saveGeminiKey()">Kaydet</button>
          </div>
          <div style="font-size:11px;color:var(--text-dim)">
            API anahtarınız yok mu? <a href="https://aistudio.google.com/" target="_blank" style="color:var(--blue);text-decoration:none">Google AI Studio'dan ücretsiz alın →</a>
          </div>
        </div>
      </div>

      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Bildirim Ayarları</div>
        <div class="setting-item">
          <div>
            <div class="setting-item-lbl">Anlık Bildirimler (Push)</div>
            <div class="setting-item-sub" style="font-size:11px;line-height:1.5;margin-top:2px">Yeni mesajlar, ödevler ve deneme yorumları için tarayıcı bildirimlerini etkinleştirin.</div>
          </div>
          <button class="btn btn-accent btn-sm" onclick="requestNotificationPermission()">Etkinleştir</button>
        </div>
      </div>

      <div class="settings-block" style="margin-top:20px">
        <div class="settings-block-title">Hesap</div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Kullanıcı Adı</div><div class="setting-item-sub">${u(((n=h.dbUser)==null?void 0:n.username)||"")}</div></div>
          <button class="btn btn-ghost btn-sm" onclick="switchTab('profile')">Düzenle</button>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Oturumu Kapat</div></div>
          <button class="btn btn-danger btn-sm" onclick="doLogout()">Çıkış</button>
        </div>
      </div>
    </div>`}function ja(){const e=document.getElementById("geminiApiKeyInput").value.trim();e?(localStorage.setItem("gemini_api_key",e),k("API Anahtarı kaydedildi ✓")):(localStorage.removeItem("gemini_api_key"),k("API Anahtarı kaldırıldı."))}let we="";function G(){const e=document.getElementById("view-program"),t=r.students.find(d=>d.id===r.activeStuId),n=(t==null?void 0:t.weekStart)??0,a=V(r.weekOffset,n),i=U(a,6),o=Se();r.students.map(d=>`<option value="${d.id}" ${d.id===r.activeStuId?"selected":""}>${u(d.name)}</option>`).join("");let s="";for(let d=0;d<7;d++){const c=U(a,d),l=H(c),p=l===o,m=`${r.activeStuId}_${l}`,g=r.tasks[m]||[],x=g.reduce(($,S)=>$+Number(S.duration),0),I=g.reduce(($,S)=>$+(S.done?Number(S.duration):0),0),f=DAYS_TR[(n+d)%7],y=g.map(($,S)=>`
      <div class="task-card task-${$.type} ${$.done?"done":""}" onclick="openTaskDetail('${l}',${S},'coach')" style="cursor:pointer">
        <div class="tc-check ${$.done?"on":""}" onclick="event.stopPropagation();toggleTask('${l}',${S})"></div>
        <div class="tc-body">
          <div class="tc-type">${Ge($.type)}${$.exam?" · "+$.exam:""}</div>
          <div class="tc-subject">${u($.subject)}</div>
          <div class="tc-meta">${$.duration} dk</div>
        </div>
        <button class="tc-menu-btn" onclick="event.stopPropagation();showTaskMenu('${l}',${S},this)">⋯</button>
      </div>`).join(""),v=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(n+d)%7];s+=`<div class="day-col ${p?"today":""}">
      <div class="day-hd">
        <div>
          <div class="day-name-lbl">${v}</div>
          <div class="day-num">${c.getDate()}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="day-badge" style="font-size:8.5px">${Fe(I)} / ${Fe(x)}</span>
          ${_clipboardTask?`<button class="btn btn-ghost btn-xs" onclick="pasteTaskFromClipboard('${l}')" style="font-size:9px;color:var(--accent);border-color:rgba(240,165,0,.3);background:var(--accent-dim);padding:2px 6px">Yapıştır</button>`:""}
        </div>
      </div>
      <div class="day-tasks-list">${y||""}</div>
      <button class="add-day-btn" onclick="openTaskModal('${l}','${f}')" ${r.activeStuId?"":"disabled"}>+ Görev Ekle</button>
    </div>`}e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${t?u(t.name):"Öğrenci"}</button>
    <div class="card prog-banner">
      <div class="prog-avatar" style="background:${(t==null?void 0:t.color)||"#555"};color:#0f0e0c">${t?t.name[0]:"?"}</div>
      <div class="prog-meta">
        <h2>${t?u(t.name):"Öğrenci Seçin"}</h2>
        <p>${t?u(t.target):"Program görüntülemek için öğrenci seçin"}</p>
      </div>
      <div class="prog-actions">
        <button class="btn btn-ghost btn-sm" onclick="saveWeekAsTemplate()" style="display:none">Şablon Kaydet</button>
        <button class="btn btn-ghost btn-sm" onclick="applyTemplateToWeek()" style="display:none">Şablon Uygula</button>
        <button class="btn btn-ghost btn-sm" onclick="openWeeklyPDFModal()">📄 PDF</button>
        <button class="btn btn-danger btn-sm" onclick="openClearWeekModal()">Temizle</button>
      </div>
    </div>
    <div class="week-nav" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn btn-ghost btn-sm" onclick="chWeek(-1)">←</button>
        <span class="week-lbl">${a.getDate()} ${MONTHS_TR[a.getMonth()]} — ${i.getDate()} ${MONTHS_TR[i.getMonth()]} ${i.getFullYear()}</span>
        <button class="btn btn-ghost btn-sm" onclick="chWeek(1)">→</button>
        <button class="btn btn-ghost btn-sm" onclick="goToday()">Bugün</button>
      </div>
      ${_clipboardTask?'<button class="btn btn-accent btn-sm" onclick="pasteTaskToWholeWeek()" style="font-size:12px;padding:6px 12px;gap:6px">📋 Kopyalananı Tüm Haftaya Yapıştır</button>':""}
    </div>
    <div class="week-grid">${s}</div>`}function Pa(e){r.activeStuId=e||null,Ue(),G()}function Ha(e){r.weekOffset+=e,Ue(),G()}function Ra(){r.weekOffset=0,Ue(),G()}let ae=[];function Na(){if(!r.activeStuId)return k("Önce öğrenci seçin");const e=r.students.find(i=>i.id===r.activeStuId),t=(e==null?void 0:e.weekStart)??0,n=V(r.weekOffset,t);ae=[];let a="";for(let i=0;i<7;i++){const o=U(n,i),s=H(o);DAYS_TR[(t+i)%7];const d=(r.tasks[`${r.activeStuId}_${s}`]||[]).length>0,c=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(t+i)%7];a+=`<button class="day-sel-btn" id="dsbtn_${i}" data-ds="${s}" onclick="toggleDaySel(${i},'${s}')">
      <div>${c}</div>
      <div style="font-size:14px;font-weight:800">${o.getDate()}</div>
      ${d?'<div style="font-size:9px;color:var(--accent);margin-top:2px">●</div>':'<div style="font-size:9px;opacity:0">·</div>'}
    </button>`}document.getElementById("daySelectorGrid").innerHTML=a,Y("clearWeekModal")}function Ya(e,t){const n=document.getElementById("dsbtn_"+e),a=ae.indexOf(t);a===-1?(ae.push(t),n.classList.add("sel")):(ae.splice(a,1),n.classList.remove("sel"))}function Ka(){const e=document.querySelectorAll(".day-sel-btn");ae.length===7?(ae=[],e.forEach(t=>t.classList.remove("sel"))):(ae=[],e.forEach((t,n)=>{ae.push(t.dataset.ds),t.classList.add("sel")}))}async function Oa(){if(!ae.length)return k("Önce gün seçin");if(await X(`${ae.length} günün görevleri silinsin mi?`)){for(const e of ae)await b.from("tasks").delete().eq("student_id",r.activeStuId).eq("date",e),delete r.tasks[`${r.activeStuId}_${e}`];ue(),O("clearWeekModal"),G(),k(`${ae.length} gün temizlendi`)}}const De={"Dil Bilgisi":["Sözcükte Anlam","Cümlede Anlam","Ses Bilgisi","Yazım Kuralları","Noktalama İşaretleri","Sözcükte Yapı","İsim","Sıfat","Zamir","Zarf","İsim-Sıfat Tamlamaları","Edat-Bağlaç-Ünlem","Fiiller – Fiil Çekimleri – Fiillerde Zaman Kayması","Ek Fiil – Ek Eylem","Fiilde Çatı","Fiilimsiler","Cümlenin Öğeleri","Cümle Türleri","Anlatım Bozuklukları"],"TYT Matematik":["Sayılar ve Basamak","Bölünebilme","EBOB-EKOK","Kesirler ve Ondalıklı Sayılar","Mutlak Değer","Üslü Sayılar","Köklü Sayılar","Oran-Orantı","Problemler – Yaş-İşçi-Havuz","Problemler – Kar-Zarar-Yüzde","Problemler – Hareket","Problemler – Karışım","Birinci Dereceden Denklemler","Kümeler","Mantık","Fonksiyonlar","Polinomlar","İkinci Dereceden Denklemler","Permütasyon-Kombinasyon","Olasılık","İstatistik ve Veri"],"AYT Matematik":["Polinomlar","Karmaşık Sayılar","Logaritma","Trigonometri","Diziler","Limit ve Süreklilik","Türev","İntegral","Matrisler ve Determinant"],Geometri:["Doğruda Açı","Üçgende Açı ve Kenar","Üçgende Alan","Üçgende Benzerlik","Özel Üçgenler (Pisagor)","Dörtgenler","Dörtgende Alan","Çember ve Daire","Çemberde Açı","Analitik Geometri – Nokta ve Doğru","Analitik Geometri – Çember","Katı Cisimler","Uzay Geometrisi"],"TYT Fizik":["Fizik Bilimine Giriş","Madde ve Özellikleri","Basınç","Kaldırma Kuvveti","Isı Sıcaklık Genleşme","Hareket","Newton Hareket Yasaları","İş Güç Enerji","Elektrik","Manyetizma","Optik","Dalgalar"],"AYT Fizik":["Vektörler","Bağıl ve Bileşik Hareket","Newton'ın Hareket Yasaları","Sabit İvmeli Hareket","Tek Boyutta Atışlar","İki Boyutta Atışlar","Enerji","İtme ve Momentum","Tork ve Denge","Kütle ve Ağırlık Merkezi","Basit Makineler","Elektriksel Kuvvet ve Elektrik Alan","Elektriksel Potansiyel Enerji","Düzgün Elektrik Alan ve Sığa","Manyetik Alan","Manyetik Kuvvet","Manyetik İndüksiyon","Alternatif Akım ve Transformatörler","Düzgün Çembersel Hareket","Eylemsizlik Momenti ve Açısal Momentum","Genel Çekim Yasası ve Kepler","Basit Harmonik Hareket","Dalga Mekaniği","Elektromanyetik Dalgalar","Atom Modelleri ve Atomun Yapısı","Büyük Patlama ve Atom Altı Parçacıklar","Radyoaktivite","Özel Görelilik Teorisi","Modern Fizik"],"TYT Kimya":["Kimyanın Sembolik Dili","Atom Modelleri","Periyodik Cetvel","Etkileşimler","Maddenin Halleri","Kimyanın Temel Kanunları","Mol Kavramı","Kimyasal Hesaplamalar","Kimyasal Tepkime Türleri","Karışımlar","Asitler ve Bazlar","Tuzlar","Doğa ve Kimya","Kimya Her Yerde"],"AYT Kimya":["Modern Atom","Gazlar","Sıvı Çözeltiler ve Çözünürlük","Tepkimelerde Hız","Tepkimelerde Denge","Sulu Çözelti Dengeleri","Kimya ve Elektrik","Karbon Kimyası","Organik Bileşikler","Enerji Kaynakları"],"TYT Biyoloji":["Canlıların Temel Bileşenleri","İnorganik Bileşikler","Karbohidratlar","Lipitler (Yağlar)","Proteinler","Hormonlar","Vitaminler","Enzimler","Nükleik Asitler","DNA-RNA","ATP Metabolizma","Hücre Organelleri","Hücre Zarı Madde Geçişleri","Ekoloji","Güncel Çevre Sorunları","Canlıların Sınıflandırılması","Hücre Bölünmeleri","Mitoz","Mayoz","Kalıtım"],"AYT Biyoloji":["Sinir Sistemi","Endokrin Sistemi","Duyu Organları","Destek Hareket Sistemi","Dolaşım Sistemi","Bağışıklık Sistemi","Solunum Sistemi","Üriner Sistemi","Üreme Sistemi","Komünite Ekolojisi","Popülasyon Ekolojisi","Genden Proteine","Enerji Dönüşümleri","Bitki Biyolojisi","Canlı ve Çevre"]};function Fa(e,t){const n=`${e||""} ${t||""}`.trim();return De[n]||De[t||""]||null}let se=[];function qa(e,t){const n=se.indexOf(t);n===-1?(se.push(t),e.style.borderColor="var(--red)",e.style.background="rgba(255,92,122,.12)",e.style.color="var(--red)"):(se.splice(n,1),e.style.borderColor="var(--border)",e.style.background="var(--surface)",e.style.color="var(--text-mid)")}window.toggleKonuChip=qa;let le=[];function Ua(){const e=document.getElementById("tmNewResourceToggle").checked;fn(e)}function fn(e){document.getElementById("tmSearchSection").style.display=e?"none":"",document.getElementById("tmManualSection").style.display=e?"":"none",document.getElementById("tmTestWrap").style.display="none";const t=document.getElementById("tmToggleSlider");t&&(t.style.background=e?"var(--accent)":"var(--border)",t.style.setProperty("--tw-after-x",e?"16px":"0px"))}function Ga(){const e=document.getElementById("tmManualTestInput"),t=e.value.trim();t&&(le.push(t),e.value="",xn())}function Wa(e){le.splice(e,1),xn()}function xn(){const e=document.getElementById("tmManualTestChips");e&&(e.innerHTML=le.map((t,n)=>`
    <span style="display:inline-flex;align-items:center;gap:5px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.3);color:var(--accent);padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600">
      ${u(t)}
      <button onclick="removeManualTest(${n})" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:14px;padding:0;line-height:1">×</button>
    </span>`).join(""))}function Va(e,t){if(!r.activeStuId)return k("Önce öğrenci seçin");we=e,_editingTaskId=null,q=null,document.querySelector("#taskModal h2").innerHTML=`Görev Ekle — <span id="tmDay">${t}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Programa Ekle",document.getElementById("tmSubjectFree").value="",document.getElementById("tmDuration").value="60",document.getElementById("tmNote").value="",document.getElementById("tmExam").value="",document.getElementById("tmType").value="deneme",document.getElementById("tmSubjectSel").style.display="none",document.getElementById("tmSubjectFree").style.display="",document.getElementById("soruBankasiWrap").style.display="none",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookVal").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const n=document.getElementById("tmTestSummary");n&&(n.style.display="none");const a=document.getElementById("tmNewResourceToggle");a&&(a.checked=!1,fn(!1)),document.getElementById("tmManualKaynak").value="",document.getElementById("tmManualTestInput").value="",document.getElementById("tmManualTestChips").innerHTML="",le=[],hn(),Y("taskModal")}let te={},je=!1;async function bn(){if(je)return;const{data:e}=await b.from("resources").select("*").eq("active",!0).order("name");e&&(e.forEach(t=>{let n=[t.subject];t.subject==="Tarih"?n.push("Tarih1","Tarih2"):t.subject==="Coğrafya"?n.push("Coğrafya1","Coğrafya2"):(t.subject==="Din Kültürü"||t.subject==="Din")&&(n=["Din","Din Kültürü"]),n.forEach(a=>{const i=`${t.exam_type}_${a}`;te[i]||(te[i]=[]),te[i].push({name:t.name,yil:t.year,testler:Array.isArray(t.tests)?t.tests:[],publisher:t.publisher})})}),je=!0)}let Ke=[],q=null;function Ct(){const e=document.getElementById("tmExam").value,t=document.getElementById("tmType").value,n=document.getElementById("tmSubjectSel"),a=document.getElementById("tmSubjectFree");q=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").innerHTML="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const i=document.getElementById("tmTestSummary");i&&(i.style.display="none"),e&&SUBJECT_MAP[e]?(n.innerHTML=SUBJECT_MAP[e].map(d=>`<option value="${d}">${d}</option>`).join(""),n.style.display="",a.style.display="none"):(n.style.display="none",a.style.display="");const o=(t==="soru"||t==="konu")&&e;document.getElementById("soruBankasiWrap").style.display=o?"":"none";const s=document.getElementById("tmBookSearch");s&&(s.placeholder=t==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara..."),je=!1,te={},o&&lt("")}function Za(){q=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const e=document.getElementById("tmType").value,t=document.getElementById("tmExam").value;je=!1,te={},(e==="soru"||e==="konu")&&t&&lt("")}document.getElementById("tmType").addEventListener("change",Ct);async function lt(e){const t=document.getElementById("tmExam").value,n=document.getElementById("tmSubjectSel").value||"",a=document.getElementById("tmType").value,i=document.getElementById("tmBookList"),o=a==="konu"?"playlist":"book";if(!je){i.style.display="block",i.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">⏳ Yükleniyor...</div>';const{data:l}=await b.from("resources").select("*").eq("active",!0).eq("resource_type",o).order("name");te={},l&&l.forEach(p=>{let m=[p.subject];p.subject==="Tarih"?m.push("Tarih1","Tarih2"):p.subject==="Coğrafya"?m.push("Coğrafya1","Coğrafya2"):(p.subject==="Din Kültürü"||p.subject==="Din")&&(m=["Din","Din Kültürü"]),m.forEach(g=>{const x=`${p.exam_type}_${g}`;te[x]||(te[x]=[]),te[x].push({name:p.name,yil:p.year,testler:Array.isArray(p.tests)?p.tests:[],publisher:p.publisher,resource_type:p.resource_type||"book"})})}),je=!0}const s=`${t}_${n}`,d=te[s]||[],c=e.toLowerCase();if(Ke=d.filter(l=>{var p;return!c||l.name.toLowerCase().includes(c)||((p=l.publisher)==null?void 0:p.toLowerCase().includes(c))}),!e&&!Ke.length){i.style.display="none";return}if(!Ke.length){i.style.display="block",i.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">Kaynak bulunamadı</div>';return}i.style.display="block",i.innerHTML=Ke.map((l,p)=>`
    <div onclick="selectBook(${p})" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;transition:background .15s"
      onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:13px;font-weight:700">${u(l.name)}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px">${u(l.publisher||"")} · ${l.testler.length} test</div>
      </div>
      <span style="font-size:10px;font-weight:700;background:var(--green-dim);color:var(--green);padding:2px 7px;border-radius:99px;margin-left:8px;flex-shrink:0">${l.yil}</span>
    </div>`).join("")}function Ja(){const e=document.getElementById("tmBookSearch").value;if(e.length===0){document.getElementById("tmBookList").style.display="none";return}lt(e)}function Xa(e){q=Ke[e],document.getElementById("tmBookVal").value=q.name,document.getElementById("tmBookSearch").value=q.name,document.getElementById("tmBookList").style.display="none",jt(),document.getElementById("tmTestWrap").style.display=""}function jt(){if(!q)return;const e=document.getElementById("tmTestList"),t=q.resource_type==="playlist",n=q.name||"";e.innerHTML=q.testler.map((a,i)=>{const o=a.label||a,s=o.trim()===""||o.trim()===n.trim()?`Ders ${i+1}`:o,d=a.soru||0,c=a.url||"";a.topic;const l=Qn(o),p=l==="done"?"ti-status-done":l==="pending"?"ti-status-pending":"",m=l==="done"?'<span class="ti-badge ti-badge-done">✓ Tamamlandı</span>':l==="pending"?'<span class="ti-badge ti-badge-pending">⏳ Atandı</span>':"";return t?`<label class="${p}" style="display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--border)"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="width:22px;height:22px;border-radius:6px;background:var(--surface3);color:var(--text-mid);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(s)}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
            <span style="font-size:10px;color:var(--text-dim)">${d>0?`⏱ ${d} dk`:"⏱ ?"}</span>
            ${m}
          </div>
        </div>
        ${c?`<a href="${u(c)}" target="_blank" onclick="event.stopPropagation()"
          style="display:flex;align-items:center;gap:3px;font-size:11px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:5px 10px;border-radius:7px;text-decoration:none;flex-shrink:0;white-space:nowrap"
          onmouseover="this.style.background='#cc000044'" onmouseout="this.style.background='#cc000022'">▶ İzle</a>`:'<span style="font-size:10px;color:var(--text-dim);flex-shrink:0;padding:5px 8px;border:1px solid var(--border);border-radius:7px">Linksiz</span>'}
      </label>`:`<label class="${p}" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:background .1s"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600">${u(s)}</span>
          ${m}
        </div>
        ${d>0?`<span style="font-size:10px;color:var(--text-dim);background:var(--surface3);padding:2px 7px;border-radius:99px;flex-shrink:0">${d} soru</span>`:""}
      </label>`}).join(""),He()}function Qa(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!0),He()}function ei(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!1),He()}function He(){if(!q)return;const e=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")],t=document.getElementById("tmTestSummary"),n=document.getElementById("tmTestSummaryText"),a=document.getElementById("tmSuggestedDuration"),i=document.getElementById("tmSpeedRow"),o=q.resource_type==="playlist";if(e.length===0){t.style.display="none";return}let s=0,d=0;e.forEach(m=>{const g=parseInt(m.value),x=q.testler[g];o?d+=(x==null?void 0:x.soru)||0:s+=(x==null?void 0:x.soru)||0});const c=document.querySelector("[data-mspeed].speed-active"),l=c?parseFloat(c.dataset.mspeed):1;let p=0;if(o)p=d>0?Math.ceil(d/l):0,n.textContent=`${e.length} video · ${d} dk`,i&&(i.style.display="");else{const m=document.getElementById("tmExam").value,g=document.getElementById("tmSubjectSel").value||"",x=`${r.activeStuId}_${m}_${g}`,I=it[x]||180;p=s>0?Math.ceil(s*I/60):0,n.textContent=`${e.length} test · ${s} soru${p>0?" · Önerilen: "+p+" dk":""}`,i&&(i.style.display="none")}a.style.display=p>0?"":"none",Qe=p,a.setAttribute("data-dur",p),t.style.display="",p>0&&(document.getElementById("tmDuration").value=p)}function ti(e){document.querySelectorAll("[data-mspeed]").forEach(t=>{const n=t.dataset.mspeed===e;t.classList.toggle("speed-active",n),t.style.borderColor=n?"var(--accent)":"var(--border)",t.style.background=n?"var(--accent-dim)":"var(--surface2)",t.style.color=n?"var(--accent)":"var(--text-mid)"}),He()}let Qe=0;function ni(){Qe>0&&(document.getElementById("tmDuration").value=Qe,k("Süre uygulandı: "+Qe+" dk"))}let it={};async function hn(){if(!r.activeStuId)return;const{data:e}=await b.from("student_speeds").select("*").eq("student_id",r.activeStuId);it={},(e||[]).forEach(t=>{const n=`${t.student_id}_${t.exam_type}_${t.subject}`;it[n]=t.secs_per_question})}async function kn(e,t,n,a){const{data:i}=await b.from("student_speeds").select("id").eq("student_id",e).eq("exam_type",t).eq("subject",n).single();i?await b.from("student_speeds").update({secs_per_question:a,updated_at:new Date().toISOString()}).eq("id",i.id):await b.from("student_speeds").insert({student_id:e,coach_id:h.coachId,exam_type:t,subject:n,secs_per_question:a}),it[`${e}_${t}_${n}`]=a,k("Hız kaydedildi ✓")}document.getElementById("tmType").addEventListener("change",Ct);let bt=!1;async function ai(){var n;if(bt)return;bt=!0;const e=document.querySelector('#taskModal button[onclick*="saveTask"]'),t=e?e.textContent:"Programa Ekle";e&&(e.disabled=!0,e.textContent="Kaydediliyor...");try{const a=document.getElementById("tmType").value,i=document.getElementById("tmSubjectSel"),o=document.getElementById("tmSubjectFree"),s=document.getElementById("tmExam").value,d=parseInt(document.getElementById("tmDuration").value)||60,c=document.getElementById("tmNote").value.trim();if((n=document.getElementById("tmNewResourceToggle"))==null?void 0:n.checked){const v=document.getElementById("tmManualKaynak").value.trim();if(!v)return k("Kaynak adı girin!");const $=i.style.display!=="none"?i.value:o.value.trim(),S=$?`${$} - ${v}`:v,B=le.map(E=>({label:E,url:"",soru:0}));let D=c;le.length>0&&(D=`${le.length} test: ${le.slice(0,3).join(", ")}${le.length>3?` +${le.length-3} daha`:""}`);const T={student_id:r.activeStuId,coach_id:h.coachId,date:we,type:a,exam_type:s,subject:S,duration:d,note:D,done:!1,task_items:B.length>0?B:null};L(!0);const{error:_}=await b.from("tasks").insert(T);if(L(!1),_)return k("Hata: "+_.message);const z=`${r.activeStuId}_${we}`;r.tasks[z]||(r.tasks[z]=[]),r.tasks[z].push({type:a,exam:s,subject:S,duration:d,note:D,done:!1,task_items:T.task_items}),O("taskModal"),G(),k("Görev eklendi ✓");return}const p=document.getElementById("tmBookVal").value,m=(q==null?void 0:q.resource_type)==="playlist";let g="";if((a==="soru"||a==="konu")&&p){const v=i.style.display!=="none"?i.value:"";g=v?`${v} - ${p}`:`${p}`}else g=(i.style.display!=="none"?i.value:o.value).trim();if(!g)return k("Ders adı girin!");const x=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")];let I=c,f=[];if(x.length>0&&q){const v=x.map($=>{const S=q.testler[parseInt($.value)];return(S==null?void 0:S.label)||S||""});if(f=x.map($=>{const S=q.testler[parseInt($.value)];return{label:(S==null?void 0:S.label)||S||"",url:(S==null?void 0:S.url)||"",soru:(S==null?void 0:S.soru)||0}}),m){const $=S=>S.length>14?S.slice(0,13)+"…":S;I=`${v.length} video: ${v.slice(0,5).map($).join(", ")}${v.length>5?` +${v.length-5}`:""}`}else{const $=S=>S.length>14?S.slice(0,13)+"…":S;I=`${v.length} test: ${v.slice(0,5).map($).join(", ")}${v.length>5?` +${v.length-5}`:""}`}}const y={student_id:r.activeStuId,coach_id:h.coachId,date:we,type:a,exam_type:s,subject:g,duration:d,note:I,done:!1,task_items:f.length>0?f:null};if(_editingTaskId){L(!0);const{error:v}=await b.from("tasks").update({type:y.type,exam_type:y.exam_type,subject:y.subject,duration:y.duration,note:y.note,task_items:y.task_items}).eq("id",_editingTaskId);if(L(!1),v)return k("Hata: "+v.message);const $=`${r.activeStuId}_${we}`;if(r.tasks[$]){const S=r.tasks[$].findIndex(B=>B._id===_editingTaskId);S!==-1&&(r.tasks[$][S]={_id:_editingTaskId,type:y.type,exam:y.exam_type,subject:y.subject,duration:y.duration,note:y.note,done:r.tasks[$][S].done,student_note:r.tasks[$][S].student_note||"",task_items:y.task_items})}O("taskModal"),G(),k("Görev güncellendi ✓"),_editingTaskId=null}else{const{data:v,error:$}=await b.from("tasks").insert(y).select().single();if($)return k("Hata: "+$.message);const S=`${r.activeStuId}_${we}`;r.tasks[S]||(r.tasks[S]=[]),r.tasks[S].push({_id:v.id,type:v.type,exam:v.exam_type,subject:v.subject,duration:v.duration,note:v.note,done:!1,student_note:"",task_items:v.task_items||null}),O("taskModal"),G(),k("Görev eklendi ✓")}}finally{bt=!1,e&&(e.disabled=!1,e.textContent=t)}}async function ii(e,t){var o;const n=`${r.activeStuId}_${e}`,a=(o=r.tasks[n])==null?void 0:o[t];if(!a)return;const i=!a.done;await b.from("tasks").update({done:i}).eq("id",a._id),a.done=i,G()}let et=null;function Pt(){et&&(et.remove(),et=null)}document.addEventListener("click",Pt);function oi(e,t,n){Pt();const a=n.getBoundingClientRect(),i=document.createElement("div");i.className="tc-dropdown",i.innerHTML=`
    <button onclick="closeTaskMenu();openCoachTaskEdit('${e}',${t})">✏️ Düzenle</button>
    <button onclick="closeTaskMenu();copyTaskToClipboard('${e}',${t})">📋 Kopyala</button>
    <button onclick="closeTaskMenu();copyTaskToWholeWeek('${e}',${t})">📅 Tüm Haftaya Kopyala</button>
    <button class="danger" onclick="closeTaskMenu();deleteTask('${e}',${t})">🗑 Kaldır</button>`;const o=a.bottom+4,s=Math.min(a.left,window.innerWidth-155);i.style.cssText=`top:${o}px;left:${s}px;`,document.body.appendChild(i),et=i,setTimeout(()=>i.addEventListener("click",d=>d.stopPropagation()),0)}async function si(e,t){var s;const n=`${r.activeStuId}_${e}`,a=(s=r.tasks[n])==null?void 0:s[t];if(!a)return;const{data:i,error:o}=await b.from("tasks").insert({student_id:r.activeStuId,coach_id:h.coachId,date:e,type:a.type,exam_type:a.exam||null,subject:a.subject,duration:a.duration,note:a.note||null,done:!1,task_items:a.task_items||null}).select().single();if(o)return k("Kopyalama başarısız");r.tasks[n]||(r.tasks[n]=[]),r.tasks[n].push({_id:i.id,type:i.type,exam:i.exam_type,subject:i.subject,duration:i.duration,note:i.note,done:!1,student_note:"",task_items:i.task_items||null}),G(),k("Görev kopyalandı")}async function ri(e,t){var i;const n=`${r.activeStuId}_${e}`,a=(i=r.tasks[n])==null?void 0:i[t];a&&(await b.from("tasks").delete().eq("id",a._id),r.tasks[n].splice(t,1),G(),k("Görev silindi"))}let Le=0,ie={studentId:"",type:""};window._draggingApptId=null;const wn={"Haftalık Değerlendirme":"#E8613A","TYT Koçluğu":"#3B82F6","AYT Koçluğu":"#8B5CF6",Mentörlük:"#10B981","Deneme Analizi":"#F59E0B",Motivasyon:"#EC4899","Genel Görüşme":"#64748B"},Ae=0,$n=24,de=60;function tt(e){return wn[e]||"#64748B"}function di(e){const t=r.students.find(o=>o.id===e.studentId),n=new Date(e.date+"T"+(e.time||"09:00")),a=new Date(n.getTime()+(e.duration||45)*6e4),i=o=>o.getFullYear()+String(o.getMonth()+1).padStart(2,"0")+String(o.getDate()).padStart(2,"0")+"T"+String(o.getHours()).padStart(2,"0")+String(o.getMinutes()).padStart(2,"0")+"00";return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(((t==null?void 0:t.name)||"Öğrenci")+" – Koçluk")}&dates=${i(n)}/${i(a)}&details=${encodeURIComponent(e.type||"")}`}function li(){Le--,ge()}function ci(){Le++,ge()}function pi(){Le=0,ge()}function mi(e,t){ie[e]=t,ge()}function ui(){let e=r.appointments;ie.studentId&&(e=e.filter(o=>o.studentId===ie.studentId)),ie.type&&(e=e.filter(o=>o.type===ie.type));const t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Rostrum Akademi//TR","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Rostrum Ajanda"];e.forEach(o=>{const s=r.students.find(p=>p.id===o.studentId),d=new Date(o.date+"T"+(o.time||"09:00")),c=new Date(d.getTime()+(o.duration||45)*6e4),l=p=>p.getFullYear()+String(p.getMonth()+1).padStart(2,"0")+String(p.getDate()).padStart(2,"0")+"T"+String(p.getHours()).padStart(2,"0")+String(p.getMinutes()).padStart(2,"0")+"00";t.push("BEGIN:VEVENT",`DTSTART:${l(d)}`,`DTEND:${l(c)}`,`SUMMARY:${(s==null?void 0:s.name)||"Öğrenci"} – ${o.type||"Koçluk"}`),o.note&&t.push(`DESCRIPTION:${o.note.replace(/\n/g,"\\n")}`),(o.meetLink||o.meet_link)&&t.push(`URL:${o.meetLink||o.meet_link}`),t.push(`UID:rostrum-${o.id}@rostrumakademi.com`,"END:VEVENT")}),t.push("END:VCALENDAR");const n=new Blob([t.join(`\r
`)],{type:"text/calendar;charset=utf-8"}),a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download="rostrum-ajanda.ics",i.click(),URL.revokeObjectURL(a),k("Ajanda indirildi ✓")}function gi(e,t){t.stopPropagation();const n=document.getElementById("apptDetailPopup");if(n){const x=n.dataset.id;if(n.remove(),x===e)return}const a=r.appointments.find(x=>x.id===e);if(!a)return;const i=r.students.find(x=>x.id===a.studentId),o=tt(a.type),s=document.createElement("div");s.id="apptDetailPopup",s.dataset.id=e;const d=window.innerWidth,c=window.innerHeight,l=264;let p=Math.min(t.clientX+12,d-l-12),m=Math.min(t.clientY+12,c-220);s.style.cssText=`position:fixed;left:${p}px;top:${m}px;z-index:600;width:${l}px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.18);animation:viewIn .15s ease`;const g=a.meetLink||a.meet_link;s.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:10px;height:10px;border-radius:50%;background:${o};flex-shrink:0"></div>
      <div style="flex:1;font-size:14px;font-weight:800">${u((i==null?void 0:i.name)||"?")}</div>
      <button onclick="document.getElementById('apptDetailPopup')?.remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:18px;line-height:1;padding:0">×</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:12px;font-size:12px;color:var(--text-mid)">
      <div>🕐 <b style="color:var(--text)">${a.time||"—"}</b> · ${a.duration} dk</div>
      <div>📋 <span style="background:${o}20;color:${o};padding:1px 8px;border-radius:99px;font-weight:700;font-size:11px">${u(a.type||"")}</span></div>
      ${a.note?`<div>📝 <span style="color:var(--text)">${u(a.note)}</span></div>`:""}
      <div>📅 ${new Date(a.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${g?`<a href="${u(g)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--blue);background:var(--blue-dim);padding:4px 10px;border-radius:99px;text-decoration:none">🎥 ${g.includes("zoom")?"Zoom":"Meet"}</a>`:""}
      <a href="${di(a)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--green);background:var(--green-dim);padding:4px 10px;border-radius:99px;text-decoration:none">📅 GCal</a>
      <button onclick="document.getElementById('apptDetailPopup')?.remove();openAgendaApptModal('${a.id}')" style="font-size:11px;font-weight:700;color:var(--text);background:var(--surface2);padding:4px 10px;border-radius:99px;border:1px solid var(--border);cursor:pointer;font-family:inherit">✏️ Düzenle</button>
      <button onclick="deleteAgendaAppt('${a.id}')" style="font-size:11px;font-weight:700;color:var(--red,#ef4444);background:#ef444410;padding:4px 10px;border-radius:99px;border:none;cursor:pointer;font-family:inherit">🗑</button>
    </div>`,document.body.appendChild(s),setTimeout(()=>{document.addEventListener("click",function x(I){s.contains(I.target)||(s.remove(),document.removeEventListener("click",x))})},50)}async function vi(e,t){e.preventDefault();const n=window._draggingApptId;if(!n)return;window._draggingApptId=null;const a=e.currentTarget,i=a.getBoundingClientRect(),o=a.closest("[data-tl-scroll]"),s=o?o.scrollTop:0,c=(e.clientY-i.top+s)/de*60+Ae*60,l=Math.max(Ae,Math.min($n-1,Math.floor(c/60))),p=Math.round(c%60/15)*15,m=p>=60?0:p,g=`${String(l).padStart(2,"0")}:${String(m).padStart(2,"0")}`,{error:x}=await b.from("appointments").update({date:t,time:g}).eq("id",n);if(x){k("Hata: "+x.message);return}const I=r.appointments.find(f=>f.id===n);I&&(I.date=t,I.time=g),ge(),k("Randevu taşındı ✓")}function Tn(){ge()}function ge(){const e=document.getElementById("view-todolist");if(!e)return;const t=new Date,n=t.getDay()===0?6:t.getDay()-1,a=new Date(t);a.setDate(t.getDate()-n+Le*7),a.setHours(0,0,0,0);const i=Array.from({length:7},(E,M)=>{const j=new Date(a);return j.setDate(a.getDate()+M),j}),o=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],s=H(t),d=`${i[0].getDate()} ${MONTHS_TR[i[0].getMonth()]} – ${i[6].getDate()} ${MONTHS_TR[i[6].getMonth()]} ${i[6].getFullYear()}`,c=window.innerWidth<700;let l=r.appointments;ie.studentId&&(l=l.filter(E=>E.studentId===ie.studentId)),ie.type&&(l=l.filter(E=>E.type===ie.type));const p="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;font-family:inherit",m="font-size:11px;padding:4px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-family:inherit",g='<option value="">Tüm Öğrenciler</option>'+r.students.map(E=>`<option value="${E.id}"${ie.studentId===E.id?" selected":""}>${u(E.name)}</option>`).join(""),x='<option value="">Tüm Tipler</option>'+Object.keys(wn).map(E=>`<option value="${E}"${ie.type===E?" selected":""}>${E}</option>`).join(""),I=`
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex-shrink:0">
      <button onclick="agendaPrev()" style="${p}">‹</button>
      <span style="font-size:13px;font-weight:800;min-width:200px;text-align:center">${d}</span>
      <button onclick="agendaNext()" style="${p}">›</button>
      ${Le!==0?'<button onclick="agendaToday()" style="font-size:11px;padding:3px 10px;border-radius:99px;border:1px solid var(--accent);color:var(--accent);background:var(--accent-dim);cursor:pointer;font-family:inherit">Bugüne Dön</button>':""}
      <div style="flex:1"></div>
      <select style="${m}" onchange="agendaSetFilter('studentId',this.value)">${g}</select>
      <select style="${m}" onchange="agendaSetFilter('type',this.value)">${x}</select>
      <button onclick="exportAgendaICS()" style="font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-family:inherit;color:var(--text)">📥 ICS</button>
      <button class="btn btn-accent btn-sm" onclick="openAgendaApptModal(null)">+ Randevu</button>
    </div>`;if(c){const E=i.map(M=>{const j=H(M),w=l.filter(C=>C.date===j).sort((C,N)=>(C.time||"").localeCompare(N.time||""));return`<div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;color:${j===s?"var(--accent)":"var(--text-dim)"};margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">${M.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
        ${w.length?w.map(C=>{const N=r.students.find(K=>K.id===C.studentId),P=tt(C.type);return`<div onclick="openApptPopup('${C.id}',event)" style="display:flex;gap:12px;padding:12px;border-radius:12px;background:var(--surface);border:1px solid var(--border);border-left:4px solid ${P};margin-bottom:6px;cursor:pointer">
            <div style="font-size:12px;font-weight:800;color:${P};min-width:38px">${C.time||""}</div>
            <div><div style="font-size:13px;font-weight:700">${u((N==null?void 0:N.name)||"?")}</div><div style="font-size:11px;color:var(--text-dim)">${u(C.type||"")} · ${C.duration}dk</div></div>
          </div>`}).join(""):'<div style="font-size:12px;color:var(--text-dim);padding:8px 0">—</div>'}
        <button onclick="openAgendaApptModal(null,'${j}')" style="width:100%;border:1.5px dashed var(--border);border-radius:8px;background:none;cursor:pointer;color:var(--text-dim);font-size:11px;padding:6px;font-family:inherit">+ Randevu Ekle</button>
      </div>`}).join("");e.innerHTML=`<div style="display:flex;flex-direction:column;gap:10px;height:calc(100vh - 104px);overflow:hidden">${I}<div style="overflow-y:auto;flex:1">${E}</div></div>`;return}const f=Array.from({length:$n-Ae},(E,M)=>Ae+M),y=f.length*de,v=i.map((E,M)=>{const w=H(E)===s;return`<div style="flex:1;min-width:0;text-align:center;padding:6px 4px;border-left:1px solid var(--border)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:${w?"var(--accent)":"var(--text-dim)"}">${o[M]}</div>
      <div style="font-size:18px;font-weight:800;line-height:1.3;${w?"width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;margin:2px auto":"color:var(--text)"}">${E.getDate()}</div>
    </div>`}).join(""),$=i.map(E=>{const M=H(E),j=M===s,w=l.filter(P=>P.date===M),A=f.map((P,K)=>`<div style="position:absolute;top:${K*de}px;left:0;right:0;height:1px;background:var(--border);pointer-events:none"></div>`).join(""),C=f.map((P,K)=>`<div style="position:absolute;top:${K*de+de/2}px;left:0;right:0;height:1px;background:var(--border);opacity:.4;pointer-events:none"></div>`).join(""),N=w.map(P=>{const[K,R]=(P.time||"09:00").split(":").map(Number),F=Math.max(0,(K-Ae)*de+R/60*de),J=Math.max((P.duration||45)*de/60,24),W=tt(P.type),Q=r.students.find(ee=>ee.id===P.studentId);return`<div
        draggable="true"
        ondragstart="event.stopPropagation();window._draggingApptId='${P.id}';event.dataTransfer.effectAllowed='move'"
        onclick="openApptPopup('${P.id}',event)"
        style="position:absolute;top:${F}px;left:3px;right:3px;height:${J}px;background:${W}20;border-left:3px solid ${W};border-radius:6px;padding:3px 6px;cursor:pointer;overflow:hidden;box-sizing:border-box;transition:transform .1s,box-shadow .1s;z-index:2"
        onmouseover="this.style.transform='scaleX(1.02)';this.style.boxShadow='0 2px 10px ${W}44'"
        onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="font-size:10px;font-weight:800;color:${W};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${u((Q==null?void 0:Q.name)||"?")}</div>
        ${J>34?`<div style="font-size:9px;color:${W}bb">${P.time}${J>48?" · "+P.duration+"dk":""}</div>`:""}
      </div>`}).join("");return`<div style="flex:1;min-width:0;position:relative;height:${y}px;${j?"background:var(--accent-dim)":""};border-left:1px solid var(--border)"
      ondragover="event.preventDefault()"
      ondrop="handleApptDrop(event,'${M}')"
      onclick="if(event.target===this)openAgendaApptModal(null,'${M}')">
      ${A}${C}${N}
    </div>`}).join(""),S=f.map((E,M)=>`<div style="position:absolute;top:${M*de}px;right:6px;transform:translateY(-50%);font-size:9px;font-weight:700;color:var(--text-dim);white-space:nowrap;background:var(--surface);padding:0 2px">${String(E).padStart(2,"0")}:00</div>`).join(""),B=r.appointments.filter(E=>E.date>s||E.date===s&&(E.time||"")>=H(t).slice(0,5)).sort((E,M)=>(E.date||"").localeCompare(M.date||"")||(E.time||"").localeCompare(M.time||"")).slice(0,10),D=B.filter(E=>E.date===s),T=B.filter(E=>E.date>s);function _(E,M){const j=r.students.find(A=>A.id===E.studentId),w=tt(E.type);return`<div onclick="openApptPopup('${E.id}',event)" style="padding:8px 10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;border-left:3px solid ${w};box-shadow:var(--shadow);transition:transform .1s" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
      ${M?`<div style="font-size:9px;font-weight:700;color:var(--text-dim);margin-bottom:2px;text-transform:uppercase;letter-spacing:.4px">${M}</div>`:""}
      <div style="font-size:11px;font-weight:800;color:${w}">${E.time||"—"}</div>
      <div style="font-size:12px;font-weight:700;color:var(--text)">${u((j==null?void 0:j.name)||"?")}</div>
      <div style="font-size:10px;color:var(--text-dim)">${u(E.type||"")} · ${E.duration}dk</div>
    </div>`}e.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px;height:calc(100vh - 104px);overflow:hidden">
      ${I}
      <div style="display:flex;gap:12px;flex:1;overflow:hidden">

        <!-- Timeline -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">
          <!-- Day header row -->
          <div style="display:flex;flex-shrink:0;border-bottom:2px solid var(--border)">
            <div style="width:44px;flex-shrink:0"></div>
            ${v}
          </div>
          <!-- Scrollable body -->
          <div data-tl-scroll style="overflow-y:auto;flex:1;position:relative">
            <div style="display:flex;min-height:${y}px">
              <!-- Hour gutter -->
              <div style="width:44px;flex-shrink:0;position:relative;border-right:1px solid var(--border)">${S}</div>
              <!-- Day columns -->
              <div style="display:flex;flex:1">${$}</div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div style="width:200px;flex-shrink:0;display:flex;flex-direction:column;gap:6px;overflow-y:auto">
          ${D.length?`<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--accent);padding:2px 0">Bugün</div>${D.map(E=>_(E,"")).join("")}`:""}
          ${T.length?`<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);padding:${D.length?"8px":"2px"} 0 2px">Yaklaşan</div>${T.map(E=>{const M=new Date(E.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short",weekday:"short"});return _(E,M)}).join("")}`:""}
          ${B.length?"":'<div style="font-size:12px;color:var(--text-dim);padding:8px 0">Yaklaşan randevu yok</div>'}
        </div>
      </div>
    </div>`;const z=e.querySelector("[data-tl-scroll]");if(z&&Le===0){const E=t.getHours(),M=Math.max(0,(E-Ae-1)*de);setTimeout(()=>{z.scrollTop=M},50)}}function yi(e,t){const n=e?r.appointments.find(a=>a.id===e):null;document.getElementById("amTitle").textContent=n?"Randevuyu Düzenle":"Yeni Randevu",document.getElementById("amId").value=e||"",document.getElementById("amStudent").innerHTML=r.students.map(a=>`<option value="${a.id}" ${(n==null?void 0:n.studentId)===a.id?"selected":""}>${u(a.name)}</option>`).join(""),document.getElementById("amDate").value=n?n.date:t||H(new Date),document.getElementById("amTime").value=n?n.time:"14:00",document.getElementById("amDuration").value=n?n.duration:"45",document.getElementById("amType").value=n?n.type:"Haftalık Değerlendirme",document.getElementById("amNote").value=n&&n.note||"",document.getElementById("amMeetLink").value=n&&(n.meetLink||n.meet_link)||"",Y("apptModal")}async function fi(e){await X("Randevu silinsin mi?")&&(await b.from("appointments").delete().eq("id",e),r.appointments=r.appointments.filter(t=>t.id!==e),ge(),k("Randevu silindi"))}function En(){We()}function xi(e){r.activeStuId=e,r.weekOffset=0,ue(),Dt(e)}function bi(e){const t=e?r.students.find(a=>a.id===e):null;document.getElementById("smTitle").textContent=t?"Öğrenciyi Düzenle":"Yeni Öğrenci",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.pass)||STU_DEFAULT_PASS,document.getElementById("smWeekStart").value=(t==null?void 0:t.weekStart)??0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(a=>a.classList.toggle("sel",a.dataset.c===((t==null?void 0:t.color)||"#f0a500")));const n=document.getElementById("smRoleField");n&&(n.style.display="none"),document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudent()"),Y("studentModal")}document.getElementById("smProg").addEventListener("input",function(){document.getElementById("smProgVal").textContent=this.value+"%"});document.getElementById("smColorPick").addEventListener("click",function(e){const t=e.target.closest(".color-opt");t&&(document.querySelectorAll(".color-opt").forEach(n=>n.classList.remove("sel")),t.classList.add("sel"))});async function hi(){var d;const e=document.getElementById("smName").value.trim();if(!e)return k("İsim girin!");const t=((d=document.querySelector(".color-opt.sel"))==null?void 0:d.dataset.c)||"#f0a500",n=document.getElementById("smId").value,a=$e(document.getElementById("smUsername").value.trim())||$e(e.split(" ")[0])+Math.floor(Math.random()*100),i=document.getElementById("smPass").value||STU_DEFAULT_PASS,o=await Ie(i),s={full_name:e,target:document.getElementById("smTarget").value.trim()||"Hedef belirtilmemiş",color:t,progress:Number(document.getElementById("smProg").value),password_hash:o,week_start:Number(document.getElementById("smWeekStart").value),coach_id:h.coachId};if(n){const{error:c}=await b.rpc("update_student_profile",{p_student_id:n,p_full_name:e,p_target:s.target,p_color:t,p_progress:s.progress,p_week_start:s.week_start,p_username:a,p_plain_password:i,p_password_hash:o});if(c)return k("Hata: "+c.message);const l=r.students.find(p=>p.id===n);l&&Object.assign(l,{name:s.full_name,target:s.target,color:t,progress:s.progress,pass:s.password_hash,weekStart:s.week_start,username:a}),k("Güncellendi ✓"),ue(),O("studentModal"),We()}else{const c=a+"@rostrumakademi.com",{data:{session:l}}=await b.auth.getSession(),p=await fetch("/api/create-student",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${(l==null?void 0:l.access_token)||""}`},body:JSON.stringify({email:c,password:i,full_name:s.full_name,username:a,color:s.color,target:s.target,progress:s.progress,week_start:s.week_start,coach_id:s.coach_id,exam_profile:"YKS"})}),m=await p.json();if(!p.ok)return k("Hata: "+m.error);const g=m.userId;r.students.push({id:g,name:s.full_name,target:s.target,color:s.color,progress:s.progress||0,pass:o,weekStart:s.week_start||0,username:a}),r.activeStuId||(r.activeStuId=g),ue(),O("studentModal"),Sn(s.full_name,a,i)}}function Sn(e,t,n){let a=document.getElementById("inviteModal");a||(a=document.createElement("div"),a.id="inviteModal",a.className="modal-bg",document.body.appendChild(a),a.addEventListener("click",d=>{d.target===a&&a.classList.remove("open")}));const o=`${window.location.origin+window.location.pathname.replace("app.html","")}app.html`,s=encodeURIComponent(`Merhaba ${e}! 🎓

Seni Rostrum Akademi platformuna ekledim.

📱 Giriş adresi: ${o}
👤 Kullanıcı adı: ${t}
🔑 Şifre: ${n}

Giriş yaptıktan sonra programını görebileceksin!`);a.innerHTML=`<div class="modal" style="max-width:480px">
    <button class="modal-close" onclick="cm('inviteModal');renderStudentsSearch()">×</button>
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:40px;margin-bottom:8px">🎉</div>
      <h2>${u(e)} eklendi!</h2>
      <p style="font-size:13px;color:var(--text-mid);margin-top:6px">Öğrencine aşağıdaki bilgileri paylaş</p>
    </div>

    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Kullanıcı Adı</div>
          <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${u(t)}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Şifre</div>
          <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${u(n)}</div>
        </div>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Giriş Adresi</div>
        <div style="font-size:12px;color:var(--blue);word-break:break-all">${o}</div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="copyInvite('${u(t)}','${u(n)}','${o}')">📋 Kopyala</button>
      <a href="https://wa.me/?text=${s}" target="_blank" class="btn btn-accent" style="flex:1;justify-content:center;text-decoration:none">💬 WhatsApp ile Gönder</a>
    </div>
    <button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:8px" onclick="cm('inviteModal');renderStudentsSearch()">Tamam</button>
  </div>`,Y("inviteModal")}function ki(e,t,n){const a=`Giriş adresi: ${n}
Kullanıcı adı: ${e}
Şifre: ${t}`;navigator.clipboard.writeText(a).then(()=>k("Kopyalandı ✓")).catch(()=>{const i=document.createElement("textarea");i.value=a,document.body.appendChild(i),i.select(),document.execCommand("copy"),i.remove(),k("Kopyalandı ✓")})}async function wi(e){var n;if(!await X("Bu öğrenciyi silmek istediğinizden emin misiniz?"))return;const{error:t}=await b.from("users").delete().eq("id",e);if(t)return k("Hata: "+t.message);r.students=r.students.filter(a=>a.id!==e),r.activeStuId===e&&(r.activeStuId=((n=r.students[0])==null?void 0:n.id)||null),ue(),En(),k("Silindi")}function Ve(){var t;const e=document.getElementById("view-appointments");e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${((t=r.students.find(n=>n.id===r.activeStuId))==null?void 0:t.name)||"Öğrenci"}</button>
    <div class="sh"><h2>Randevular</h2><button class="btn btn-accent" onclick="openApptModal()">+ Yeni Randevu</button></div>
    <div class="appts-layout">
      <div class="card cp">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <span style="font-family:'Inter',sans-serif;font-size:17px;font-weight:700" id="calMonthLbl"></span>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(-1)">‹</button>
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(1)">›</button>
          </div>
        </div>
        <div class="cal-dow-row">${["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(n=>`<div class="cal-dow">${n}</div>`).join("")}</div>
        <div class="cal-days-grid" id="calDaysGrid"></div>
      </div>
      <div>
        <div class="card cp">
          <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)" id="apptListTitle">Yaklaşan Görüşmeler</div>
          <div id="apptList"></div>
          <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="S.calSelDay=null;renderCalDays();renderApptList()">Tümünü Göster</button>
        </div>
      </div>
    </div>`,ct(),Ht()}function ct(){const e=r.calYear,t=r.calMonth;document.getElementById("calMonthLbl").textContent=`${MONTHS_TR[t]} ${e}`;const n=new Date(e,t,1).getDay(),a=new Date(e,t+1,0).getDate(),i=Se(),o=new Set(r.appointments.filter(c=>{const l=new Date(c.date);return l.getFullYear()===e&&l.getMonth()===t}).map(c=>new Date(c.date).getDate())),s=n===0?6:n-1;let d="";for(let c=0;c<s;c++)d+='<div class="cal-day empty"></div>';for(let c=1;c<=a;c++){const l=`${e}-${String(t+1).padStart(2,"0")}-${String(c).padStart(2,"0")}`;d+=`<div class="cal-day ${l===i?"today":""} ${l===r.calSelDay&&l!==i?"selected":""} ${o.has(c)?"has-appt":""}" onclick="selCalDay('${l}')">${c}</div>`}document.getElementById("calDaysGrid").innerHTML=d}function $i(e){r.calSelDay=r.calSelDay===e?null:e,ct(),Ht()}function Ti(e){r.calMonth+=e,r.calMonth>11&&(r.calMonth=0,r.calYear++),r.calMonth<0&&(r.calMonth=11,r.calYear--),Ue(),ct()}function Ht(){const e=Se();let t=r.appointments,n="Yaklaşan Görüşmeler";if(r.calSelDay?(t=t.filter(a=>a.date===r.calSelDay),n=new Date(r.calSelDay+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long"})):t=t.filter(a=>a.date>=e).sort((a,i)=>a.date.localeCompare(i.date)).slice(0,10),document.getElementById("apptListTitle").textContent=n,!t.length){document.getElementById("apptList").innerHTML='<div class="empty"><p>Randevu yok</p></div>';return}document.getElementById("apptList").innerHTML=t.map(a=>{const i=r.students.find(d=>d.id===a.studentId),s=a.date===e?"BUGÜN":new Date(a.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"});return`<div class="appt-item" style="border-left-color:${(i==null?void 0:i.color)||"#555"}">
      <div class="appt-when">${s} • ${a.time} (${a.duration} dk)</div>
      <div class="appt-name">${u((i==null?void 0:i.name)||"?")}</div>
      <div class="appt-type">${u(a.type)}</div>
      ${a.note?`<div class="appt-note">${u(a.note)}</div>`:""}
      ${a.meet_link?`<div style="margin-top:6px;display:flex;gap:6px;align-items:center">
        <a href="${u(a.meet_link)}" target="_blank" style="font-size:11px;background:var(--blue-dim);color:var(--blue);padding:3px 10px;border-radius:99px;text-decoration:none;font-weight:700">${a.meet_link.includes("zoom")?"🎥 Zoom":"📹 Meet"}</a>
        <button class="btn btn-ghost btn-xs" onclick="copyToClipboard('${u(a.meet_link)}')">Kopyala</button>
      </div>`:""}
      <div class="appt-actions">
        <button class="btn btn-ghost btn-xs" onclick="openApptModal('${a.id}')">✏️</button>
        <button class="btn btn-danger btn-xs" onclick="deleteAppt('${a.id}')">🗑</button>
      </div>
    </div>`}).join("")}function Ei(e){const t=e?r.appointments.find(n=>n.id===e):null;document.getElementById("amTitle").textContent=t?"Randevuyu Düzenle":"Yeni Randevu",document.getElementById("amId").value=e||"",document.getElementById("amStudent").innerHTML=r.students.map(n=>`<option value="${n.id}" ${(t==null?void 0:t.studentId)===n.id?"selected":""}>${u(n.name)}</option>`).join(""),document.getElementById("amDate").value=t?t.date:H(new Date),document.getElementById("amTime").value=t?t.time:"14:00",document.getElementById("amDuration").value=t?t.duration:"45",document.getElementById("amType").value=t?t.type:"Haftalık Değerlendirme",document.getElementById("amNote").value=(t==null?void 0:t.note)||"",document.getElementById("amMeetLink").value=(t==null?void 0:t.meet_link)||"",Y("apptModal")}async function Si(){var o;const e=document.getElementById("amStudent").value,t=document.getElementById("amDate").value,n=document.getElementById("amTime").value;if(!e||!t||!n)return k("Tüm alanları doldurun!");const a=document.getElementById("amId").value,i={student_id:e,coach_id:h.coachId,date:t,time:n,duration:parseInt(document.getElementById("amDuration").value),type:document.getElementById("amType").value,note:document.getElementById("amNote").value.trim(),meet_link:document.getElementById("amMeetLink").value.trim()};if(a){await b.from("appointments").update(i).eq("id",a);const s=r.appointments.find(d=>d.id===a);s&&Object.assign(s,{studentId:e,date:t,time:n,duration:i.duration,type:i.type,note:i.note}),k("Güncellendi ✓")}else{const{data:s,error:d}=await b.from("appointments").insert(i).select().single();if(d)return k("Hata: "+d.message);r.appointments.push({id:s.id,studentId:s.student_id,date:s.date,time:s.time,duration:s.duration,type:s.type,note:s.note}),k("Randevu eklendi ✓")}O("apptModal"),currentTab==="todolist"?ge():(o=document.getElementById("view-appointments"))!=null&&o.classList.contains("active")&&Ve()}async function Ii(e){await X("Bu randevuyu silmek istediğinizden emin misiniz?")&&(await b.from("appointments").delete().eq("id",e),r.appointments=r.appointments.filter(t=>t.id!==e),Ve(),k("Silindi"))}function ot(e){return 100+(Number(e.Türkçe||0)+Number(e.Matematik||0)+Number(e.Fen||0)+Number(e.Sosyal||0))*(400/120)}function In(e,t){const n=a=>Number(t[a]||0);return e==="AYT-SAY"?100+(n("Matematik")+n("Fizik")+n("Kimya")+n("Biyoloji"))*5:e==="AYT-EA"?100+(n("Matematik")+n("Edebiyat")+n("Tarih")+n("Coğrafya"))*5:e==="AYT-SOZ"?100+(n("Edebiyat")+n("Tarih1")+n("Tarih2")+n("Coğrafya1")+n("Coğrafya2")+n("Felsefe")+n("Din"))*5:null}const _n={"AYT-SAY":"SAY","AYT-EA":"EA","AYT-SOZ":"SÖZ"},st={TYT:"#3B82F6",SAY:"#8B5CF6",EA:"#10B981",SÖZ:"#F59E0B"};function zn(e,t){const{type:n,nets:a}=e;if(n==="TYT"){const c=ot(a),l=st.TYT;return`<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <span style="background:${l}18;border:1px solid ${l}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${l};text-transform:uppercase">TYT Puan</span>
        <span style="font-size:18px;font-weight:900;color:${l}">${c.toFixed(2)}</span>
      </span>
    </div>`}const i=_n[n];if(!i)return"";const o=st[i]||"#64748B",s=In(n,a),d=t.filter(c=>c.type==="TYT"&&c.date<=e.date).sort((c,l)=>l.date.localeCompare(c.date))[0];if(d){const c=ot(d.nets),l=c*.4+s*.6;return`<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="background:${o}18;border:1px solid ${o}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${o};text-transform:uppercase">${i} Puan</span>
        <span style="font-size:18px;font-weight:900;color:${o}">${l.toFixed(2)}</span>
      </span>
      <span style="font-size:11px;color:var(--text-dim)">TYT×0.4 <b>${(c*.4).toFixed(1)}</b> · AYT×0.6 <b>${(s*.6).toFixed(1)}</b></span>
    </div>`}return`<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span style="background:${o}18;border:1px solid ${o}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
      <span style="font-size:10px;font-weight:700;color:${o};text-transform:uppercase">AYT ${i} Ham</span>
      <span style="font-size:18px;font-weight:900;color:${o}">${s.toFixed(2)}</span>
    </span>
    <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT etkisi dahil değil</span>
  </div>`}function _i(){var c,l;const e=document.getElementById("emPuanDisplay");if(!e)return;const t=(c=document.getElementById("emExamType"))==null?void 0:c.value;if(!t)return;const n={};if((EXAM_DEFS[t]||[]).forEach(p=>{const m=Z[p]||{};n[p]=Math.max(0,(m.dogru||0)-(m.yanlis||0)/4)}),t==="TYT"){const p=ot(n),m=st.TYT;e.innerHTML=`<div style="background:${m}12;border:1px solid ${m}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:11px;font-weight:700;color:${m};text-transform:uppercase;letter-spacing:.4px">🎯 TYT Puan</span>
      <span style="font-size:24px;font-weight:900;color:${m};letter-spacing:-.5px">${p.toFixed(2)}</span>
    </div>`;return}const a=_n[t],i=st[a]||"#64748B",o=In(t,n);if(o===null){e.innerHTML="";return}const s=(l=document.getElementById("emStudent"))==null?void 0:l.value,d=s?[...r.exams].filter(p=>p.studentId===s&&p.type==="TYT").sort((p,m)=>m.date.localeCompare(p.date))[0]:null;if(d){const p=ot(d.nets),m=p*.4+o*.6;e.innerHTML=`<div style="background:${i}12;border:1px solid ${i}35;border-radius:10px;padding:10px 14px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:700;color:${i};text-transform:uppercase;letter-spacing:.4px">🎯 ${a} Puan</span>
        <span style="font-size:24px;font-weight:900;color:${i};letter-spacing:-.5px">${m.toFixed(2)}</span>
        <span style="font-size:11px;color:var(--text-dim)">TYT×0.4=${(p*.4).toFixed(1)} · AYT×0.6=${(o*.6).toFixed(1)}</span>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px">TYT: ${d.date} tarihli deneme baz alındı</div>
    </div>`}else e.innerHTML=`<div style="background:${i}12;border:1px solid ${i}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="font-size:11px;font-weight:700;color:${i};text-transform:uppercase;letter-spacing:.4px">🎯 AYT ${a} Ham</span>
      <span style="font-size:24px;font-weight:900;color:${i};letter-spacing:-.5px">${o.toFixed(2)}</span>
      <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT puanı bulunamadı</span>
    </div>`}function Re(){const e=document.getElementById("view-exams"),t=r.students.find(o=>o.id===r.activeStuId),n=[...r.exams].filter(o=>o.studentId===r.activeStuId).sort((o,s)=>s.date.localeCompare(o.date));let a="";if(n.length>1){const o=[...n].sort((d,c)=>d.date.localeCompare(c.date)).slice(-8),s=Math.max(...o.map(d=>(EXAM_DEFS[d.type]||[]).reduce((l,p)=>{var m;return l+Number(((m=d.nets)==null?void 0:m[p])||0)},0)),1);a=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text-mid)">📈 Net Gelişim · Son ${o.length} deneme</div>
      <div class="bar-chart">
        ${o.map(d=>{const l=(EXAM_DEFS[d.type]||[]).reduce((m,g)=>{var x;return m+Number(((x=d.nets)==null?void 0:x[g])||0)},0),p=Math.max(Math.round(l/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${l.toFixed(0)}</div>
            <div class="bar" style="height:${p}%;background:${(t==null?void 0:t.color)||"var(--accent)"}"></div>
            <div class="bar-label" title="${u(d.name)}">${u(d.name.replace(/Deneme /,"#").replace(/TYT |AYT /,""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const i=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],d=s.reduce((c,l)=>{var p;return c+Number(((p=o.nets)==null?void 0:p[l])||0)},0).toFixed(1);return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:14px;font-weight:700">${u(o.name)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-dim)">Toplam Net</div>
            <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;line-height:1">${d}</div>
          </div>
          <button class="btn btn-ghost btn-xs" onclick="openCommentModal('${o.id}')">💬 Yorumla</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${s.map(c=>{var m;const l=Number(((m=o.nets)==null?void 0:m[c])||0),p=l>=20?"var(--green)":l>=12?"var(--accent)":"var(--red)";return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:8px 12px;min-width:70px;text-align:center">
            <div style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px">${c}</div>
            <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:${p}">${l}</div>
          </div>`}).join("")}
      </div>
      ${zn(o,n)}
      ${o.note?`<div style="margin-top:10px;font-size:12px;color:var(--text-mid);font-style:italic">"${u(o.note)}"</div>`:""}
      ${(()=>{if(!o.examDetails||!Object.keys(o.examDetails).length)return"";const c=s.map(l=>{const p=o.examDetails[l];if(!p)return"";const m=Math.max(0,(p.dogru||0)-(p.yanlis||0)/4).toFixed(2),g=p.yanlis_konular||[];return`<div style="padding:6px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${g.length?"5px":"0"}">
              <span style="font-size:11px;font-weight:700;color:var(--text-mid)">${u(l)}</span>
              <span style="font-size:11px;color:var(--text-dim)">D:<b style="color:var(--green)">${p.dogru||0}</b> Y:<b style="color:var(--red)">${p.yanlis||0}</b> B:<b>${p.bos||0}</b> · Net <b style="color:var(--accent)">${m}</b></span>
            </div>
            ${g.length?`<div style="display:flex;flex-wrap:wrap;gap:3px">${g.map(x=>`<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(255,92,122,.1);color:var(--red);border:1px solid rgba(255,92,122,.2)">${u(x)}</span>`).join("")}</div>`:""}
          </div>`}).filter(Boolean).join("");return c?`<div style="margin-top:10px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px 14px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📋 Ders Detayları</div>
          ${c}
        </div>`:""})()}
      ${o.coachComment?`<div style="margin-top:8px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.2);border-radius:8px;padding:9px 12px;font-size:12px"><span style="font-weight:700;color:var(--accent)">Koç: </span>${u(o.coachComment)}</div>`:""}
    </div>`}).join(""):'<div class="empty"><p>Henüz deneme sonucu yok</p></div>';e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${t?u(t.name):"Öğrenci"}</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800">${t?u(t.name)+"  — ":""} Denemeler</div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${n.length} deneme kaydı</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openKonuRaporu('${r.activeStuId}')">📊 Konu Raporu</button>
      </div>
    </div>
    ${a}
    ${i}`}let Bn=null,he="TYT";const zi=["TYT","AYT-SAY","AYT-EA","AYT-SOZ"];function Mn(){const t=r.exams.filter(s=>s.studentId===Bn).filter(s=>s.type===he&&s.examDetails&&Object.keys(s.examDetails).length),n={};t.forEach(s=>{Object.entries(s.examDetails).forEach(([d,c])=>{(c.yanlis_konular||[]).forEach(l=>{const p=d+"§"+l;n[p]=(n[p]||0)+1})})});const a=Object.entries(n).sort((s,d)=>d[1]-s[1]).map(([s,d])=>{const[c,l]=s.split("§"),p=Math.round(d/Math.max(t.length,1)*100),m=d>=3?"var(--red)":d===2?"var(--accent)":"var(--text-mid)";return`<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-size:12px;color:var(--text-dim);white-space:nowrap">${u(c)}</td>
        <td style="padding:8px 10px;font-size:13px;font-weight:600">${u(l)}</td>
        <td style="padding:8px 10px;text-align:center">
          <span style="font-size:14px;font-weight:800;color:${m}">${d}</span>
          <span style="font-size:10px;color:var(--text-dim)">/${t.length}</span>
        </td>
        <td style="padding:8px 10px;min-width:90px">
          <div style="height:6px;border-radius:3px;background:var(--surface2);overflow:hidden">
            <div style="height:100%;width:${p}%;background:${m};border-radius:3px;transition:width .3s"></div>
          </div>
        </td>
      </tr>`}),i=zi.map(s=>`<button onclick="window._krType='${s}';_krRenderBody()" style="padding:6px 14px;border-radius:20px;border:1px solid ${s===he?"var(--accent)":"var(--border)"};background:${s===he?"var(--accent-dim)":"transparent"};color:${s===he?"var(--accent)":"var(--text-dim)"};font-size:12px;cursor:pointer;font-weight:${s===he?700:400}">${s}</button>`).join(""),o=a.length?`<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px">${t.length} denemeden derlendi · <b>${a.length}</b> farklı yanlış konu · 🔴 ≥3 tekrar kritik</div>
       <div style="overflow-x:auto">
       <table style="width:100%;border-collapse:collapse">
         <thead><tr style="border-bottom:2px solid var(--border)">
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Ders</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Konu</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:center;text-transform:uppercase;letter-spacing:.5px">Tekrar</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Sıklık</th>
         </tr></thead>
         <tbody>${a.join("")}</tbody>
       </table></div>`:`<div style="text-align:center;padding:40px;color:var(--text-dim);font-size:13px">${t.length?"Bu denemeler için henüz konu işaretlenmemiş.":he+" tipi deneme kaydı yok."}</div>`;document.getElementById("konuRaporuBody").innerHTML=`
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${i}</div>
    ${o}`}window._krRenderBody=Mn;function Bi(e){Bn=e;const t=r.exams.find(n=>n.studentId===e&&n.examDetails&&Object.keys(n.examDetails).length);he=(t==null?void 0:t.type)||"TYT",Mn(),Y("konuRaporuModal")}window.openKonuRaporu=Bi;function Mi(e){const t=r.exams.find(n=>n.id===e);document.getElementById("cmExamId").value=e,document.getElementById("cmText").value=(t==null?void 0:t.coachComment)||"",Y("commentModal")}async function Ai(){const e=document.getElementById("cmExamId").value,t=document.getElementById("cmText").value.trim();await b.from("exams").update({coach_comment:t}).eq("id",e);const n=r.exams.find(a=>a.id===e);n&&(n.coachComment=t),O("commentModal"),Re(),k("Yorum kaydedildi ✓")}async function Di(e){await X("Bu denemeyi silmek istediğinizden emin misiniz?")&&(await b.from("exams").delete().eq("id",e),r.exams=r.exams.filter(t=>t.id!==e),Re(),k("Silindi"))}function An(){const e=document.getElementById("view-messages");e.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>Mesajlar</h2></div>
    <div class="msg-layout">
      <div class="msg-sidebar">
        <div class="msg-sidebar-hd">Öğrenciler</div>
        ${r.students.map(t=>{const n=r.messages[t.id]||[],a=n[n.length-1],i=n.filter(o=>o.from==="student"&&!o.read).length;return`<div class="msg-contact ${r.msgThread===t.id?"active":""}" onclick="selectThread('${t.id}')">
            <div class="msg-contact-avatar" style="background:${t.color}">${t.name[0]}</div>
            <div style="flex:1;min-width:0">
              <div class="msg-contact-name">${u(t.name.split(" ")[0])}</div>
              <div class="msg-contact-last">${a?u(a.text.slice(0,35)):"Mesaj yok"}</div>
            </div>
            ${i?`<span class="msg-unread">${i}</span>`:""}
          </div>`}).join("")}
      </div>
      <div class="msg-main" id="msgMain">
        ${r.msgThread?xe(r.msgThread,"coach"):'<div class="no-chat-sel">Öğrenci seçin</div>'}
      </div>
    </div>`,r.msgThread&&be()}async function Li(e){r.msgThread=e;const t=(r.messages[e]||[]).filter(n=>n.from==="student"&&!n.read&&n._id).map(n=>n._id);t.length&&await b.from("messages").update({read:!0}).in("id",t),(r.messages[e]||[]).forEach(n=>{n.from==="student"&&(n.read=!0)}),document.getElementById("msgMain").innerHTML=xe(e,"coach"),document.querySelectorAll(".msg-contact").forEach(n=>n.classList.remove("active")),r.students.forEach((n,a)=>{var i;n.id===e&&((i=document.querySelectorAll(".msg-contact")[a])==null||i.classList.add("active"))}),be(),Kt()}function xe(e,t){const n=r.students.find(o=>o.id===e),i=(r.messages[e]||[]).map(o=>`<div class="msg-bubble ${t==="coach"&&o.from==="coach"||t==="student"&&o.from==="student"?"out":"in"}">${u(o.text)}<div class="msg-bubble-time">${o.time}</div></div>`).join("");return`<div class="msg-main-hd">
    <div style="width:30px;height:30px;border-radius:8px;background:${(n==null?void 0:n.color)||"#555"};color:#0f0e0c;font-family:'Inter',sans-serif;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">${(n==null?void 0:n.name[0])||"?"}</div>
    <div class="msg-main-hd-name">${u((n==null?void 0:n.name)||"")}</div>
  </div>
  <div class="msg-body" id="msgBody">${i||'<div class="empty"><p>Henüz mesaj yok</p></div>'}</div>
  <div class="msg-input-area">
    <textarea class="msg-input" id="msgInput" placeholder="Mesaj yaz..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg('${e}','${t}');}"></textarea>
    <button class="btn btn-accent" onclick="sendMsg('${e}','${t}')">Gönder</button>
  </div>`}async function Ci(e,t){var d,c;const n=document.getElementById("msgInput"),a=n.value.trim();if(!a)return;const i=h.coachId||((d=r.students.find(l=>l.id===e))==null?void 0:d.coachId)||((c=r.students.find(l=>l.id===h.studentId))==null?void 0:c.coachId),{data:o,error:s}=await b.from("messages").insert({student_id:e,coach_id:i,from_role:t,text:a,read:!1}).select().single();if(s){console.error("sendMsg error:",s),k("Hata: "+s.message);return}r.messages[e]||(r.messages[e]=[]),r.messages[e].push({_id:o.id,from:t,text:a,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),n.value="",currentTab==="messages"&&(document.getElementById("msgMain").innerHTML=xe(e,"coach"),be()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=xe(e,"student"),be())}function be(){setTimeout(()=>{const e=document.getElementById("msgBody");e&&(e.scrollTop=e.scrollHeight)},60)}function pt(){var g;const e=document.getElementById("view-portal");if(!e)return;let t=r.students.find(x=>x.id===h.studentId);if(!t&&r.students.length>0&&(t=r.students[0]),!t){e.innerHTML=`<div style="text-align:center;padding:60px 20px;color:var(--text-mid)">
      <div style="font-size:36px;margin-bottom:12px">⏳</div>
      <p style="font-size:14px">Profil yükleniyor...</p>
    </div>`,setTimeout(()=>{r.students.length&&pt()},800);return}h.studentId||(h.studentId=t.id),r.activeStuId=t.id;const n=Se(),a=`${t.id}_${n}`,i=r.tasks[a]||[],o=i.filter(x=>x.done).length,s=r.appointments.filter(x=>x.studentId===t.id&&x.date>=n).sort((x,I)=>x.date.localeCompare(I.date))[0],d=(r.messages[t.id]||[]).filter(x=>x.from==="coach"&&!x.read).length,c=((g=r.konuMastery)==null?void 0:g[t.id])||{},l=[],p=new Date;p.setDate(p.getDate()-30),Object.entries(c).forEach(([x,I])=>{Object.entries(I).forEach(([f,y])=>{if(y.status==="td"||y.status==="not_started")return;const v=y.last_review_date?new Date(y.last_review_date):null,$=v?Math.floor((Date.now()-v.getTime())/864e5):999,S=y.stars<=2,B=$>20;(S||B)&&l.push({konu:f,subject:x,stars:y.stars,daysSince:$})})}),l.sort((x,I)=>x.stars-I.stars||I.daysSince-x.daysSince);const m=l.length>0?`
    <div class="card cp" style="border-color:rgba(239,68,68,.3)">
      <div class="portal-sec-title">🔄 Tekrar Gereken Konular <span style="font-size:11px;background:rgba(239,68,68,.12);color:#ef4444;padding:2px 8px;border-radius:99px;font-weight:700">${l.length}</span></div>
      ${l.slice(0,5).map(x=>{const I=Be[x.stars];return x.daysSince<999&&`${x.daysSince}`,`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px;color:${I.color};font-weight:800;white-space:nowrap">${"⭐".repeat(x.stars)||"○"}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(x.konu)}</div>
            <div style="font-size:10px;color:var(--text-dim)">${u(x.subject)} · Son: ${x.daysSince<999?x.daysSince+"g önce":"Hiç"}</div>
          </div>
        </div>`}).join("")}
      ${l.length>5?`<div style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:center">+${l.length-5} daha…</div>`:""}
    </div>`:"";e.innerHTML=`
    <div class="portal-hero">
      <div class="portal-avatar" style="background:${t.color}">${t.name[0]}</div>
      <div class="portal-info">
        <h1>Merhaba, ${u(t.name.split(" ")[0])}! 👋</h1>
        <p>${u(t.target)} · ${new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>
    </div>
    <div class="portal-grid">
      <div class="card cp">
        <div class="portal-sec-title">📋 Bugünün Görevleri</div>
        ${i.length?`
          ${i.map((x,I)=>`
            <div class="task-card task-${x.type} ${x.done?"done":""}" style="margin-bottom:6px">
              <div class="tc-check ${x.done?"on":""}" onclick="stuToggleTask('${n}',${I})"></div>
              <div class="tc-body">
                <div class="tc-type">${Ge(x.type)}${x.exam?" · "+x.exam:""}</div>
                <div class="tc-subject">${u(x.subject)}</div>
                <div class="tc-meta">${x.duration} dk${x.note?" · "+u(x.note):""}</div>
              </div>
            </div>`).join("")}
          <div style="margin-top:8px;font-size:12px;color:var(--text-mid)">${o}/${i.length} tamamlandı</div>
        `:'<div class="empty"><p>Bugün için görev atanmamış</p></div>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card cp">
          <div class="portal-sec-title">📈 İlerleme</div>
          <div style="font-family:'Inter',sans-serif;font-size:36px;font-weight:800;color:${t.color};margin-bottom:6px">%${t.progress}</div>
          <div class="prog-bar-wrap"><div class="prog-bar" style="width:${t.progress}%;background:${t.color}"></div></div>
        </div>
        <div class="card cp">
          <div class="portal-sec-title">📅 Sonraki Randevu</div>
          ${s?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:3px">${new Date(s.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          <div style="font-family:'Inter',sans-serif;font-size:20px;font-weight:700">${s.time}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px">${u(s.type)} · ${s.duration} dk</div>`:'<div style="font-size:13px;color:var(--text-dim)">Yaklaşan randevu yok</div>'}
        </div>
        ${d>0?`<div class="card cp" style="border-color:var(--accent);cursor:pointer" onclick="switchTab('smessages')">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div><div style="font-weight:700">${d} yeni mesaj</div><div style="font-size:12px;color:var(--text-mid)">Koçundan</div></div>
          </div>
        </div>`:""}
        ${m}
      </div>
    </div>`}async function ji(e,t){var s;const n=r.students.find(d=>d.id===h.studentId);if(!n)return;const a=`${n.id}_${e}`,i=(s=r.tasks[a])==null?void 0:s[t];if(!i)return;const o=!i.done;await b.from("tasks").update({done:o}).eq("id",i._id),i.done=o,pt()}function _e(){const e=r.students.find(d=>d.id===h.studentId);if(!e)return;const t=document.getElementById("view-sportal"),n=e.weekStart??0,a=V(r.weekOffset,n),i=U(a,6),o=Se();let s="";for(let d=0;d<7;d++){const c=U(a,d),l=H(c),p=l===o,m=`${e.id}_${l}`,g=r.tasks[m]||[],x=g.reduce((v,$)=>v+Number($.duration),0),I=g.reduce((v,$)=>v+($.done?Number($.duration):0),0);DAYS_TR[(n+d)%7];const f=g.map((v,$)=>`
      <div class="task-card task-${v.type} ${v.done?"done":""}" onclick="openTaskDetail('${l}',${$},'student')" style="cursor:pointer">
        <div class="tc-check ${v.done?"on":""}" onclick="event.stopPropagation();stuToggleTask2('${l}',${$})"></div>
        <div class="tc-body">
          <div class="tc-type">${Ge(v.type)}${v.exam?" · "+v.exam:""}</div>
          <div class="tc-subject">${u(v.subject)}</div>
          <div class="tc-meta">${v.duration} dk</div>
        </div>
      </div>`).join(""),y=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(n+d)%7];s+=`<div class="day-col ${p?"today":""}">
      <div class="day-hd">
        <div><div class="day-name-lbl">${y}</div><div class="day-num">${c.getDate()}</div></div>
        <span class="day-badge" style="font-size:8.5px">${Fe(I)} / ${Fe(x)}</span>
      </div>
      <div class="day-tasks-list">${f||'<div class="empty" style="padding:8px 0"><p style="font-size:11px">Görev yok</p></div>'}</div>
    </div>`}t.innerHTML=`
    <div class="week-nav" style="margin-bottom:14px">
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(-1)">← Önceki</button>
      <span class="week-lbl">${a.getDate()} ${MONTHS_TR[a.getMonth()]} — ${i.getDate()} ${MONTHS_TR[i.getMonth()]} ${i.getFullYear()}</span>
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(1)">Sonraki →</button>
      <button class="btn btn-ghost btn-sm" onclick="S.weekOffset=0;saveUI();renderSPortal()">Bugün</button>
    </div>
    <div class="week-grid">${s}</div>`}async function Pi(e,t){var s;const n=r.students.find(d=>d.id===h.studentId);if(!n)return;const a=`${n.id}_${e}`,i=(s=r.tasks[a])==null?void 0:s[t];if(!i)return;const o=!i.done;await b.from("tasks").update({done:o}).eq("id",i._id),i.done=o,_e()}function Hi(e){r.weekOffset+=e,ue(),_e()}function Rt(e,t,n){var x,I,f,y;const i=`${h.role==="student"?h.studentId:r.activeStuId}_${e}`,o=(x=r.tasks[i])==null?void 0:x[t];if(!o)return;let s=document.getElementById("taskDetailModal");s||(s=document.createElement("div"),s.id="taskDetailModal",s.className="modal-bg",document.body.appendChild(s),s.addEventListener("click",v=>{v.target===s&&s.classList.remove("open")}));const d={soru:"var(--blue)",konu:"#c084fc",deneme:"var(--accent)",diger:"var(--text-mid)"},c={soru:"Soru Bankası",konu:"Konu Anlatımı",deneme:"Deneme",diger:"Diğer"},l=d[o.type]||"var(--accent)",p=o.type==="konu",m=o.task_items||[];let g="";m.length>0?g=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${p?"Videolar":"Testler"} (${m.length})</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:200px;overflow-y:auto">
        ${m.map((v,$)=>`
          <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);${$===m.length-1?"border-bottom:none":""};cursor:pointer;transition:background .1s"
            onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
            <input type="checkbox" ${v.done?"checked":""} onchange="toggleDetailItem('${e}',${t},${$},'${n}')"
              style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;">
            <div style="width:20px;height:20px;border-radius:6px;background:${l}22;color:${l};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:4px">${$+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;line-height:1.4;${v.done?"text-decoration:line-through;color:var(--text-dim);":""}">${u(v.label||`Ders ${$+1}`)}</div>
              <div style="font-size:11px;color:var(--text-mid);margin-top:2px">⏱ ${v.soru>0?p?v.soru+" dk":v.soru+" soru":"?"}</div>
            </div>
            ${v.url?`<a href="${u(v.url)}" target="_blank" onclick="event.stopPropagation()"
              style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:6px 12px;border-radius:8px;text-decoration:none;flex-shrink:0;white-space:nowrap">▶ İzle</a>`:""}
          </label>`).join("")}
      </div>
    </div>`:o.note&&(o.note.includes("test:")||o.note.includes("video:"))&&(g=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${p?"Videolar":"Testler"}</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--text-mid)">${u(o.note)}</div>
    </div>`),s.innerHTML=`<div class="modal">
    <button class="modal-close" onclick="cm('taskDetailModal')">×</button>

    <!-- Görev başlık -->
    <div style="border-left:3px solid ${l};padding-left:12px;margin-bottom:20px">
      <div style="font-size:10px;font-weight:700;color:${l};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${c[o.type]||o.type}${o.exam?" · "+o.exam:""}</div>
      <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;line-height:1.2">${u(o.subject)}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px">${new Date(e+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
    </div>

    <!-- Tamamlandı toggle -->
    <div id="tdDoneBox" style="background:var(--surface2);border:1.5px solid ${o.done?"var(--green)":"var(--border)"};border-radius:11px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;cursor:pointer;transition:all .2s" onclick="toggleTaskDetail('${e}',${t},'${n}')">
      <div style="font-size:13px;font-weight:700;color:${o.done?"var(--green)":"var(--text)"}">${o.done?"✓ Tamamlandı":"Tamamlandı mı?"}</div>
      <div style="width:22px;height:22px;border-radius:6px;border:2px solid ${o.done?"var(--green)":"var(--border)"};background:${o.done?"var(--green)":"transparent"};display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .2s">${o.done?"✓":""}</div>
    </div>

    <!-- Test/Video listesi -->
    ${g}

    <!-- Sonuç Gir (soru/deneme türleri için) -->
    ${o.type==="soru"||o.type==="deneme"?`
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📊 Sonucu Gir</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:4px">✓ Doğru</div>
          <input type="number" id="tdDogru" min="0" value="${((I=o.student_result)==null?void 0:I.dogru)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);margin-bottom:4px">✗ Yanlış</div>
          <input type="number" id="tdYanlis" min="0" value="${((f=o.student_result)==null?void 0:f.yanlis)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);margin-bottom:4px">— Boş</div>
          <input type="number" id="tdBos" min="0" value="${((y=o.student_result)==null?void 0:y.bos)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
      </div>
      ${o.student_result?`<div style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:right">Son güncelleme: ${new Date(o.student_result.ts||Date.now()).toLocaleDateString("tr-TR")}</div>`:""}
    </div>
    ${(()=>{var $;const v=Fa(o.exam,o.subject);return v?(se=[...(($=o.student_result)==null?void 0:$.yanlis_konular)||[]],`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📌 Yanlış Konular</div>
        <div style="display:flex;flex-wrap:wrap;gap:0">${v.map(S=>{const B=se.includes(S);return`<span onclick="toggleKonuChip(this,'${S.replace(/'/g,"\\'")}')"
            style="display:inline-block;padding:5px 11px;margin:3px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;user-select:none;border:1px solid ${B?"var(--red)":"var(--border)"};background:${B?"rgba(255,92,122,.12)":"var(--surface)"};color:${B?"var(--red)":"var(--text-mid)"}">
            ${u(S)}</span>`}).join("")}</div>
      </div>`):""})()}
    `:""}

    <!-- Not -->
    <div class="field">
      <label>Notum</label>
      <textarea id="tdNote" placeholder="Zorlandığım konular, dikkatimi çeken şeyler..." style="min-height:72px">${o.student_note||""}</textarea>
    </div>

    <div style="display:flex; gap:10px; margin-top:12px">
      ${n==="coach"?`<button class="btn btn-ghost" style="flex:1; justify-content:center; padding:12px; font-weight:700;" onclick="cm('taskDetailModal'); openCoachTaskEdit('${e}',${t})">⚙ Düzenle</button>`:""}
      <button class="btn btn-accent" style="flex:2; justify-content:center; padding:12px; font-weight:700;" onclick="saveTaskDetail('${e}',${t},'${n}')">Kaydet</button>
    </div>
  </div>`,Y("taskDetailModal")}async function Ri(e,t,n){var s;const i=`${h.role==="student"?h.studentId:r.activeStuId}_${e}`,o=(s=r.tasks[i])==null?void 0:s[t];o&&(o.done=!o.done,o.task_items&&Array.isArray(o.task_items)&&o.task_items.forEach(d=>{d.done=o.done}),await b.from("tasks").update({done:o.done,task_items:o.task_items||null}).eq("id",o._id),Rt(e,t,n),n==="student"?_e():G())}async function Ni(e,t,n,a){var c;const o=`${h.role==="student"?h.studentId:r.activeStuId}_${e}`,s=(c=r.tasks[o])==null?void 0:c[t];if(!s||!s.task_items)return;s.task_items[n].done=!s.task_items[n].done;const d=s.task_items.every(l=>l.done);s.done=d,L(!0),await b.from("tasks").update({task_items:s.task_items,done:s.done}).eq("id",s._id),L(!1),Rt(e,t,a),a==="student"?_e():G(),k("İlerleme kaydedildi ✓")}function Yi(e,t){var i,o,s;e.closest("div").querySelectorAll("button[data-speed]").forEach(d=>{const c=d.dataset.speed===t;d.style.borderColor=c?"var(--accent)":"var(--border)",d.style.background=c?"var(--accent-dim)":"var(--surface2)",d.style.color=c?"var(--accent)":"var(--text-mid)"}),document.getElementById("tdSpeed").value=t;const n=parseFloat(t),a=document.getElementById("speedCalc");if(a){const d=parseInt(((s=(o=(i=a.closest("[id=speedInfo]"))==null?void 0:i.textContent)==null?void 0:o.match(/Toplam (\d+) dk/))==null?void 0:s[1])||0);a.textContent=Math.ceil(d/n)+" dk",document.getElementById("tdDuration").value=Math.ceil(d/n)}}async function Ki(e,t,n){var m,g;const i=`${h.role==="student"?h.studentId:r.activeStuId}_${e}`,o=(m=r.tasks[i])==null?void 0:m[t];if(!o)return;const s=((g=document.getElementById("tdNote"))==null?void 0:g.value.trim())||"",d={student_note:s},c=document.getElementById("tdDogru"),l=document.getElementById("tdYanlis"),p=document.getElementById("tdBos");if(c!==null){const x=parseInt(c.value)||0,I=parseInt(l.value)||0,f=parseInt(p.value)||0;(x>0||I>0||f>0||se.length>0)&&(d.student_result={dogru:x,yanlis:I,bos:f,yanlis_konular:[...se],ts:new Date().toISOString()},o.student_result=d.student_result)}await b.from("tasks").update(d).eq("id",o._id),o.student_note=s,O("taskDetailModal"),k("Kaydedildi ✓"),n==="student"?_e():G()}function Nt(){const e=r.students.find(o=>o.id===h.studentId);if(!e)return;const t=document.getElementById("view-sexams"),n=[...r.exams].filter(o=>o.studentId===e.id).sort((o,s)=>s.date.localeCompare(o.date));let a="";if(n.length>1){const o=[...n].sort((d,c)=>d.date.localeCompare(c.date)).slice(-8),s=Math.max(...o.map(d=>(EXAM_DEFS[d.type]||[]).reduce((l,p)=>{var m;return l+Number(((m=d.nets)==null?void 0:m[p])||0)},0)),1);a=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px">📈 Net Gelişimim</div>
      <div class="bar-chart">
        ${o.map(d=>{const l=(EXAM_DEFS[d.type]||[]).reduce((m,g)=>{var x;return m+Number(((x=d.nets)==null?void 0:x[g])||0)},0),p=Math.max(Math.round(l/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${l.toFixed(0)}</div>
            <div class="bar" style="height:${p}%;background:${e.color}"></div>
            <div class="bar-label">${u(d.name.replace("Deneme ","#").replace("TYT ","").replace("AYT ",""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const i=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],d=s.reduce((l,p)=>{var m;return l+Number(((m=o.nets)==null?void 0:m[p])||0)},0).toFixed(1),c=s.map(l=>{var m;const p=Number(((m=o.nets)==null?void 0:m[l])||0);return`<div class="net-box"><div class="net-label">${l}</div><div class="net-val ${_t(p)}">${p}</div></div>`}).join("");return`<div class="exam-item">
      <div class="exam-header">
        <div><div class="exam-name">${u(o.name)}</div><div class="exam-date">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
        <button class="btn btn-ghost btn-xs" onclick="openStudentExamModal('${o.id}')">✏️ Düzenle</button>
      </div>
      ${o.note?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:8px;font-style:italic">"${u(o.note)}"</div>`:""}
      <div class="nets-grid">${c}</div>
      <div style="margin-top:8px"><div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800">Toplam: ${d}</div></div>
      ${zn(o,n)}
      ${o.coachComment?`<div class="coach-comment-box"><strong>Koç Yorumu</strong>${u(o.coachComment)}</div>`:""}
    </div>`}).join(""):'<div class="empty"><p>Henüz deneme sonucu eklemediniz.<br>İlk sonucunuzu girin!</p></div>';t.innerHTML=`
    <div class="sh"><h2>Denemelerim</h2><button class="btn btn-accent" onclick="openStudentExamModal()">+ Sonuç Gir</button></div>
    ${a}${i}`}function Dn(e){var n;const t=e?r.exams.find(a=>a.id===e):null;document.getElementById("emTitle").textContent=t?"Sonucu Düzenle":"Deneme Sonucu Gir",document.getElementById("emId").value=e||"",document.getElementById("emName").value=(t==null?void 0:t.name)||"",document.getElementById("emDate").value=(t==null?void 0:t.date)||H(new Date),document.getElementById("emStudentWrap").style.display="none",document.getElementById("emStudent").innerHTML=`<option value="${h.studentId}">${u(((n=r.students.find(a=>a.id===h.studentId))==null?void 0:n.name)||"")}</option>`,document.getElementById("emExamType").value=(t==null?void 0:t.type)||"TYT",document.getElementById("emNote").value=(t==null?void 0:t.note)||"",Yt(),t!=null&&t.examDetails&&Object.entries(t.examDetails).forEach(([a,i])=>{const o=document.getElementById(`ed_${a}_d`),s=document.getElementById(`ed_${a}_y`),d=document.getElementById(`ed_${a}_b`);o&&(o.value=i.dogru||0,s.value=i.yanlis||0,d.value=i.bos||0),Z[a]={...i},Ln(a),(i.yanlis_konular||[]).forEach(c=>{document.querySelectorAll(`#konu_acc_${a.replace(/\s/g,"_")} span`).forEach(p=>{p.textContent.trim()===c&&(p.style.borderColor="var(--red)",p.style.background="rgba(255,92,122,.12)",p.style.color="var(--red)")})})}),Y("examModal")}function Oi(e){document.getElementById("emStudentWrap").style.display="",document.getElementById("emStudent").innerHTML=r.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Dn(e),document.getElementById("emStudentWrap").style.display=""}let Z={};function Fi(e,t,n){Z[t]||(Z[t]={dogru:0,yanlis:0,bos:0,yanlis_konular:[]});const a=Z[t].yanlis_konular,i=a.indexOf(n);i===-1?(a.push(n),e.style.borderColor="var(--red)",e.style.background="rgba(255,92,122,.12)",e.style.color="var(--red)"):(a.splice(i,1),e.style.borderColor="var(--border)",e.style.background="var(--surface)",e.style.color="var(--text-mid)")}window.toggleExamKonuChip=Fi;function Ln(e){var l,p,m,g;const t=parseInt((l=document.getElementById(`ed_${e}_d`))==null?void 0:l.value)||0,n=parseInt((p=document.getElementById(`ed_${e}_y`))==null?void 0:p.value)||0,a=parseInt((m=document.getElementById(`ed_${e}_b`))==null?void 0:m.value)||0;Z[e]||(Z[e]={yanlis_konular:[]}),Z[e].dogru=t,Z[e].yanlis=n,Z[e].bos=a;const i=document.getElementById("emExamType").value,o=((g=EXAM_SORU[i])==null?void 0:g[e])||40,s=t+n+a,d=document.getElementById(`ed_${e}_net`),c=document.getElementById(`ed_${e}_warn`);d&&(d.textContent=Math.max(0,t-n/4).toFixed(2)),c&&(c.style.display=s>o?"":"none"),_i()}window.updateExamNet=Ln;function qi(e){const t=document.getElementById(`konu_acc_${e.replace(/\s/g,"_")}`);t&&(t.style.display=t.style.display==="none"?"":"none")}window.toggleKonuAccordion=qi;function Yt(){const e=document.getElementById("emExamType").value,t=EXAM_DEFS[e]||[];Z={};const n=document.getElementById("emPuanDisplay");n&&(n.innerHTML=""),document.getElementById("netInputsWrap").innerHTML=t.map(a=>{var c;const i=((c=EXAM_SORU[e])==null?void 0:c[a])||40,s=(EXAM_KONU_MAP[`${e}_${a}`]||[]).flatMap(l=>De[l]||[]),d=s.length?`
      <div style="margin-top:8px">
        <button type="button" onclick="toggleKonuAccordion('${a}')"
          style="font-size:11px;font-weight:700;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px">
          📌 Yanlış Konular <span style="font-size:10px">▾</span>
        </button>
        <div id="konu_acc_${a.replace(/\s/g,"_")}" style="display:none;margin-top:6px;display:flex;flex-wrap:wrap;gap:0">
          ${s.map(l=>`<span onclick="toggleExamKonuChip(this,'${a}','${l.replace(/'/g,"\\'")}')"
            style="display:inline-block;padding:4px 10px;margin:2px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;user-select:none;border:1px solid var(--border);background:var(--surface);color:var(--text-mid)">${u(l)}</span>`).join("")}
        </div>
      </div>`:"";return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:12px 14px;margin-bottom:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px">${u(a)}</span>
        <span style="font-size:10px;color:var(--text-dim)">${i} soru · Net: <b id="ed_${a}_net" style="color:var(--accent)">0.00</b></span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:3px">✓ Doğru</div>
          <input type="number" id="ed_${a}_d" min="0" max="${i}" value="0"
            oninput="updateExamNet('${a}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);margin-bottom:3px">✗ Yanlış</div>
          <input type="number" id="ed_${a}_y" min="0" max="${i}" value="0"
            oninput="updateExamNet('${a}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);margin-bottom:3px">— Boş</div>
          <input type="number" id="ed_${a}_b" min="0" max="${i}" value="0"
            oninput="updateExamNet('${a}')"
            style="width:100%;padding:7px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
      </div>
      <div id="ed_${a}_warn" style="display:none;font-size:10px;color:var(--red);margin-top:4px">⚠ D+Y+B toplamı ${i} soruyu geçiyor!</div>
      ${d}
    </div>`}).join("")}async function Ui(){var d,c;const e=document.getElementById("emName").value.trim();if(!e)return k("Sınav adı girin!");const t=document.getElementById("emExamType").value,n={};(EXAM_DEFS[t]||[]).forEach(l=>{const p=Z[l]||{};n[l]=Math.max(0,(p.dogru||0)-(p.yanlis||0)/4)});const a=document.getElementById("emId").value,i=document.getElementById("emStudent").value,o={name:e,date:document.getElementById("emDate").value,student_id:i,coach_id:h.coachId||((d=r.students.find(l=>l.id===i))==null?void 0:d.coachId),exam_type:t,nets:n,exam_details:Z,student_note:document.getElementById("emNote").value.trim()};async function s(l,p,m){var g,x,I;if(p){const{error:f}=await b.from("exams").update(l).eq("id",m);if((g=f==null?void 0:f.message)!=null&&g.includes("exam_details")){const{exam_details:y,...v}=l;return b.from("exams").update(v).eq("id",m)}return{error:f}}else{const f=await b.from("exams").insert(l).select().single();if((I=(x=f.error)==null?void 0:x.message)!=null&&I.includes("exam_details")){const{exam_details:y,...v}=l;return b.from("exams").insert(v).select().single()}return f}}if(a){const{error:l}=await s(o,!0,a);if(l)return k("Hata: "+l.message);const p=r.exams.find(m=>m.id===a);p&&Object.assign(p,{name:o.name,date:o.date,studentId:i,type:t,nets:n,examDetails:Z,note:o.student_note}),k("Güncellendi ✓")}else{const{data:l,error:p}=await s(o,!1,null);if(p)return k("Hata: "+p.message);r.exams.push({id:l.id,studentId:l.student_id,name:l.name,date:l.date,type:l.exam_type,nets:l.nets||{},examDetails:l.exam_details||{},note:l.student_note,coachComment:""}),k("Deneme eklendi ✓")}if(O("examModal"),h.role==="student"?Nt():Re(),h.role==="coach"||h.role==="developer")try{const l=[];Object.values(Z||{}).forEach(m=>{var g;(g=m==null?void 0:m.yanlis_konular)!=null&&g.length&&l.push(...m.yanlis_konular)}),se!=null&&se.length&&l.push(...se);const p=[...new Set(l)];if(p.length>0&&i){const m=((c=r.konuMastery)==null?void 0:c[i])||{},g=[];if(Object.entries(m).forEach(([x,I])=>{Object.entries(I).forEach(([f,y])=>{p.includes(f)&&(y.status==="td"?g.push({konu:f,subject:x,type:"td_broken",stars:y.stars}):y.stars>=5&&g.push({konu:f,subject:x,type:"high_star_wrong",stars:y.stars}))})}),g.length>0){const x=g.filter(y=>y.type==="td_broken"),I=g.filter(y=>y.type==="high_star_wrong");let f="⚠️ Mastery Önerileri: ";x.length>0&&(f+=`${x.map(y=>y.konu).join(", ")} TD'den düştü! `),I.length>0&&(f+=`${I.map(y=>y.konu).join(", ")} için yıldız düşürmeyi düşün.`),setTimeout(()=>{const y=document.createElement("div");y.style.cssText="position:fixed;bottom:80px;right:16px;max-width:360px;background:var(--surface);border:1.5px solid var(--accent);border-radius:12px;padding:14px 16px;box-shadow:var(--shadow-lg);z-index:99999;animation:slideIn .3s ease",y.innerHTML=`
              <div style="display:flex;align-items:flex-start;gap:10px">
                <span style="font-size:20px;flex-shrink:0">⚠️</span>
                <div style="flex:1">
                  <div style="font-size:13px;font-weight:800;margin-bottom:6px">Deneme → Konu Mastery Önerisi</div>
                  ${x.length>0?`<div style="font-size:11px;color:var(--red);margin-bottom:4px">🔴 TD'den düşenler: <b>${x.map(v=>v.konu).join(", ")}</b></div>`:""}
                  ${I.length>0?`<div style="font-size:11px;color:var(--accent)">🟡 Yıldız düşürmeyi düşün: <b>${I.map(v=>v.konu).join(", ")}</b></div>`:""}
                  <div style="font-size:10px;color:var(--text-dim);margin-top:6px">Değişiklik yapmak için Konu Haritası'na git</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="border:none;background:none;color:var(--text-dim);cursor:pointer;font-size:16px;line-height:1;flex-shrink:0">×</button>
              </div>`,document.body.appendChild(y),setTimeout(()=>y.remove(),12e3)},600)}}}catch(l){console.error("[mastery suggestion]",l)}}async function Et(){const e=r.students.find(a=>a.id===h.studentId);if(!e)return;const t=(r.messages[e.id]||[]).filter(a=>a.from==="coach"&&!a.read&&a._id).map(a=>a._id);t.length&&await b.from("messages").update({read:!0}).in("id",t),(r.messages[e.id]||[]).forEach(a=>{a.from==="coach"&&(a.read=!0)});const n=document.getElementById("view-smessages");n.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>💬 Koçuma Yaz</h2></div>
    <div class="card" style="max-width:700px;overflow:hidden">
      <div class="msg-main" id="msgMain" style="display:flex;flex-direction:column;min-height:420px">
        ${xe(e.id,"student")}
      </div>
    </div>`,be()}let nt=null;function Kt(){Ot();const e=h.role==="coach"||h.role==="developer"?r.msgThread:h.studentId;e&&(nt=b.channel("messages_"+e).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`student_id=eq.${e}`},t=>{const n=t.new;r.messages[e]||(r.messages[e]=[]),!r.messages[e].find(a=>a._id===n.id)&&(r.messages[e].push({_id:n.id,from:n.from_role,text:n.text,read:n.read,time:new Date(n.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}),currentTab==="messages"&&r.msgThread===e&&(document.getElementById("msgMain").innerHTML=xe(e,"coach"),be()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=xe(e,"student"),be()))}).subscribe())}function Ot(){nt&&(b.removeChannel(nt),nt=null)}async function Cn(){const e=document.getElementById("view-dev-dashboard");e.innerHTML='<div class="sh"><h2>🖥️ Sistem Dashboard</h2></div><div class="empty"><p>Yükleniyor...</p></div>';const[t,n,a,i,o,s]=await Promise.all([b.from("users").select("id,role,created_at"),b.from("tasks").select("id,done,created_at"),b.from("exams").select("id,created_at"),b.from("messages").select("id,created_at"),b.from("tickets").select("id,status,created_at"),b.from("payments").select("id,amount,status,payment_date")]),d=t.data||[],c=n.data||[],l=a.data||[],p=i.data||[],m=o.data||[],g=s.data||[],x=d.filter(B=>B.role==="coach").length,I=d.filter(B=>B.role==="student").length,f=g.filter(B=>B.status==="completed").reduce((B,D)=>B+Number(D.amount),0),y=m.filter(B=>B.status==="open").length,v=Array.from({length:7},(B,D)=>{const T=new Date;return T.setDate(T.getDate()-6+D),H(T)}),$=v.map(B=>c.filter(D=>{var T;return(T=D.created_at)==null?void 0:T.startsWith(B)}).length),S=Math.max(...$,1);e.innerHTML=`
    <div class="sh"><h2>🖥️ Sistem Dashboard</h2><span style="font-size:12px;color:var(--text-dim)">${new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>

    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Öğrenci</div><div class="stat-val" style="color:var(--blue)">${I}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Koç</div><div class="stat-val" style="color:var(--accent)">${x}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Görev</div><div class="stat-val">${c.length}</div><div style="font-size:11px;color:var(--green);margin-top:3px">✓ ${c.filter(B=>B.done).length} tamamlandı</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Deneme</div><div class="stat-val">${l.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Mesaj</div><div class="stat-val">${p.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Gelir</div><div class="stat-val" style="color:var(--green)">${f.toLocaleString("tr-TR")} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Açık Ticket</div><div class="stat-val" style="color:${y>0?"var(--red)":"var(--green)"}">${y}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">📅 Son 7 Gün Görev Aktivitesi</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:80px">
          ${v.map((B,D)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="font-size:10px;color:var(--text-mid);font-weight:600">${$[D]}</div>
            <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${Math.max(Math.round($[D]/S*100),4)}%;min-height:3px;opacity:.8"></div>
            <div style="font-size:9px;color:var(--text-dim)">${new Date(B+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">🎫 Son Ticket'lar</div>
        ${m.slice(-5).reverse().map(B=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span style="color:var(--text-mid)">#${B.id.slice(0,6)}</span>
            <span class="role-badge" style="background:${B.status==="open"?"var(--red-dim)":B.status==="resolved"?"var(--green-dim)":"var(--accent-dim)"};color:${B.status==="open"?"var(--red)":B.status==="resolved"?"var(--green)":"var(--accent)"}">${B.status}</span>
          </div>`).join("")||'<div style="font-size:12px;color:var(--text-dim)">Ticket yok</div>'}
      </div>
    </div>`}async function mt(){const e=document.getElementById("view-dev-users"),{data:t}=await b.from("users").select("*").order("created_at");e.innerHTML=`
    <div class="sh"><h2>👥 Kullanıcı Yönetimi</h2>
      <button class="btn btn-accent" onclick="openDevUserModal()">+ Kullanıcı Ekle</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:1px solid var(--border);color:var(--text-dim);font-size:11px;text-transform:uppercase;letter-spacing:.5px">
            <th style="text-align:left;padding:10px 12px">Ad Soyad</th>
            <th style="text-align:left;padding:10px 12px">Kullanıcı Adı</th>
            <th style="text-align:left;padding:10px 12px">Rol</th>
            <th style="text-align:left;padding:10px 12px">Şifre</th>
            <th style="text-align:left;padding:10px 12px">Kayıt</th>
            <th style="padding:10px 12px"></th>
          </tr>
        </thead>
        <tbody>
          ${(t||[]).map(n=>`
            <tr style="border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
              <td style="padding:10px 12px;font-weight:700">${u(n.full_name)}</td>
              <td style="padding:10px 12px;color:var(--text-mid)">${u(n.username)}</td>
              <td style="padding:10px 12px"><span class="role-badge ${n.role==="coach"?"role-coach":n.role==="developer"?"role-dev":"role-student"}">${n.role}</span></td>
              <td style="padding:10px 12px;color:var(--text-dim);font-size:11px">${u(n.password_hash)}</td>
              <td style="padding:10px 12px;color:var(--text-dim);font-size:11px">${new Date(n.created_at).toLocaleDateString("tr-TR")}</td>
              <td style="padding:10px 12px;display:flex;gap:6px">
                <button class="btn btn-ghost btn-xs" onclick="openDevUserModal('${n.id}')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteUser('${n.id}')">🗑</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`}async function Gi(e){const t=e?(await b.from("users").select("*").eq("id",e).single()).data:null;document.getElementById("smTitle").textContent=t?"Kullanıcıyı Düzenle":"Yeni Kullanıcı",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.full_name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.password_hash)||"",document.getElementById("smWeekStart").value=(t==null?void 0:t.week_start)||0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(a=>a.classList.toggle("sel",a.dataset.c===((t==null?void 0:t.color)||"#f0a500")));let n=document.getElementById("smRoleField");n||(n=document.createElement("div"),n.id="smRoleField",n.className="field",n.innerHTML='<label>Rol</label><select id="smRole" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none"><option value="student">Öğrenci</option><option value="coach">Koç</option><option value="developer">Developer</option></select>',document.getElementById("smName").closest(".modal").insertBefore(n,document.getElementById("smName").parentElement)),document.getElementById("smRole").value=(t==null?void 0:t.role)||"student",document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudentDev()"),Y("studentModal")}async function Wi(e){await X("Bu kullanıcıyı silmek istediğinizden emin misiniz?")&&(await b.from("users").delete().eq("id",e),k("Kullanıcı silindi"),mt())}let Oe=[];async function Ze(){const e=document.getElementById("view-dev-resources"),{data:t}=await b.from("resources").select("*").order("resource_type,exam_type,subject,name");Oe=t||[];const n=Oe.filter(i=>i.resource_type!=="playlist"),a=Oe.filter(i=>i.resource_type==="playlist");e.innerHTML=`
    <div class="sh"><h2>📚 Kaynak & Müfredat Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openResourceModal(null,'book')">+ Soru Bankası</button>
        <button class="btn btn-accent btn-sm" onclick="openPlaylistModal()">▶ Playlist / Video Ekle</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Soru Bankası</div><div class="stat-val">${n.length}</div></div>
      <div class="stat-card"><div class="stat-label">Playlist</div><div class="stat-val">${a.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Kaynak</div><div class="stat-val">${Oe.length}</div></div>
    </div>

    <!-- PLAYLİSTLER -->
    <div style="margin-bottom:24px">
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        ▶ Konu Anlatımı Playlistleri <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${a.length} playlist</span>
      </div>
      ${a.length===0?'<div class="empty"><p>Henüz playlist eklenmemiş</p></div>':""}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${a.map(i=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(i.name)}</div>
                <div style="font-size:11px;color:var(--text-dim)">${u(i.publisher)} · ${i.exam_type} ${i.subject} · ${(i.tests||[]).length} video</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${i.id}','playlist')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${i.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </div>

    <!-- SORU BANKALARI -->
    <div>
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        📚 Soru Bankaları <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${n.length} kitap</span>
      </div>
      ${n.length===0?'<div class="empty"><p>Henüz kitap eklenmemiş</p></div>':""}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${n.map(i=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:2px">${i.exam_type} · ${i.subject}</div>
                <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(i.name)}</div>
                <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${u(i.publisher)} · ${(i.tests||[]).length} test</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <span style="font-size:10px;padding:2px 7px;border-radius:99px;background:${i.active?"var(--green-dim)":"var(--red-dim)"};color:${i.active?"var(--green)":"var(--red)"}">${i.active?"Aktif":"Pasif"}</span>
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${i.id}','book')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${i.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </div>`}function Vi(){let e=document.getElementById("playlistModal");e||(e=document.createElement("div"),e.id="playlistModal",e.className="modal-bg",document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),e.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('playlistModal')">×</button>
    <h2>▶ Playlist / Video Ekle</h2>

    <!-- YouTube Import -->
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span style="background:#ff0000;color:white;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">YT</span>
        YouTube'dan Otomatik Çek
      </div>
      <div style="font-size:12px;color:var(--text-mid);margin-bottom:10px">Oynatma listesi (Playlist) URL'sini yapıştırın, video listesi otomatik olarak yüklensin.</div>
      <div style="display:flex;gap:8px">
        <input id="ytPlaylistUrl" placeholder="https://youtube.com/playlist?list=PL..." style="flex:1;font-size:12px">
        <button class="btn btn-accent btn-sm" onclick="fetchYouTubePlaylist()">Çek →</button>
      </div>
      <div id="ytStatus" style="font-size:12px;color:var(--text-mid);margin-top:8px"></div>
    </div>

    <!-- Manuel Giriş -->
    <div style="font-size:13px;font-weight:700;margin-bottom:12px">✏️ Manuel Giriş</div>
    <div class="field-row">
      <div class="field"><label>Sınav</label>
        <select id="plExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
      </div>
      <div class="field"><label>Ders</label><input id="plSubject" placeholder="Matematik, Fizik..."></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Hoca / Kanal Adı</label><input id="plPublisher" placeholder="Mert Hoca, Eyüp B..."></div>
      <div class="field"><label>Playlist Adı</label><input id="plName" placeholder="AYT Matematik Kampı 2025"></div>
    </div>
    <div class="field">
      <label>Videolar <span style="color:var(--text-dim);font-weight:400">(Her satıra: Video Başlığı | YouTube Linki | Süre(dk))</span></label>
      <textarea id="plVideos" style="min-height:200px;font-size:12px;font-family:monospace" placeholder="Ders 1 - Polinomlar | https://youtube.com/watch?v=xxx | 45&#10;Ders 2 - Türev | https://youtube.com/watch?v=yyy | 38&#10;Ders 3 - İntegral | https://youtube.com/watch?v=zzz | 52"></textarea>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePlaylist()">Playlist Kaydet</button>
  </div>`,Y("playlistModal")}async function Zi(){const e=document.getElementById("ytPlaylistUrl").value.trim(),t=document.getElementById("ytStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL giriniz</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ Geçersiz URL — "list=..." parametresi bulunamadı</span>';const a=n[1];t.innerHTML="⏳ Yükleniyor...";try{let i=[],o="";do{let s=`/api/youtube?playlistId=${a}`;o&&(s+=`&pageToken=${o}`);const d=await fetch(s);if(!d.ok){const l=await d.json();throw new Error(l.error||"Oynatma listesi yüklenemedi.")}const c=await d.json();c.items&&(i=i.concat(c.items)),o=c.nextPageToken||""}while(o&&i.length<200);document.getElementById("plVideos").value=i.map(s=>`${s.title} | ${s.url} | ${s.duration}`).join(`
`),t.innerHTML=`<span style="color:var(--green)">✓ ${i.length} video yüklendi!</span>`}catch(i){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${i.message}</span>`}}async function Ji(){const e=document.getElementById("plName").value.trim(),t=document.getElementById("plSubject").value.trim(),n=document.getElementById("plPublisher").value.trim();if(!e||!t||!n)return k("Tüm alanları doldurun!");const a=document.getElementById("plVideos").value.split(`
`).map(d=>d.trim()).filter(Boolean);if(!a.length)return k("En az 1 video girin!");const i=a.map(d=>{const c=d.split("|").map(l=>l.trim());return{label:c[0]||"",url:c[1]||"",topic:"",soru:parseInt(c[2])||0}}).filter(d=>d.label),o={exam_type:document.getElementById("plExam").value,subject:t,publisher:n,name:e,year:new Date().getFullYear(),tests:i,active:!0,resource_type:"playlist"},{error:s}=await b.from("resources").insert(o);if(s)return k("Hata: "+s.message);k(`✓ "${e}" eklendi — ${i.length} video`),O("playlistModal"),Ze()}function Xi(e,t="book"){const n=e?Oe.find(s=>s.id===e):null;let a=document.getElementById("resourceModal");a||(a=document.createElement("div"),a.id="resourceModal",a.className="modal-bg",document.body.appendChild(a),a.addEventListener("click",s=>{s.target===a&&a.classList.remove("open")}));const i=((n==null?void 0:n.resource_type)||t)==="playlist";a.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('resourceModal')">×</button>
    <h2 id="rmTitle">${n?"Düzenle":"Ekle"} — ${i?"Playlist":"Soru Bankası"}</h2>
    <input type="hidden" id="rmId" value="${e||""}">
    <input type="hidden" id="rmType" value="${i?"playlist":"book"}">
    <div class="field-row">
      <div class="field"><label>Sınav</label>
        <select id="rmExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
      </div>
      <div class="field"><label>Ders</label><input id="rmSubject" placeholder="Matematik, Fizik..."></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${i?"Hoca / Kanal":"Yayınevi"}</label><input id="rmPublisher"></div>
      <div class="field"><label>Ad</label><input id="rmName"></div>
    </div>
    ${i?`
    <div class="field">
      <label>Videolar <span style="color:var(--text-dim);font-weight:400">(Başlık | Link | Süre)</span></label>
      <textarea id="rmTests" style="min-height:180px;font-size:11px;font-family:monospace"></textarea>
    </div>`:`
    <div class="field">
      <label>Testler <span style="color:var(--text-dim);font-weight:400">(Her satır: Test Adı | Soru Sayısı)</span></label>
      <textarea id="rmTests" style="min-height:180px;font-size:12px;font-family:monospace"></textarea>
    </div>`}
    <div class="field-row">
      <div class="field"><label>Durum</label>
        <select id="rmActive"><option value="true">Aktif</option><option value="false">Pasif</option></select>
      </div>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveResource()">Kaydet</button>
  </div>`,document.getElementById("rmExam").value=(n==null?void 0:n.exam_type)||"TYT",document.getElementById("rmSubject").value=(n==null?void 0:n.subject)||"",document.getElementById("rmPublisher").value=(n==null?void 0:n.publisher)||"",document.getElementById("rmName").value=(n==null?void 0:n.name)||"",document.getElementById("rmActive").value=String((n==null?void 0:n.active)!==!1);const o=(n==null?void 0:n.tests)||[];i?document.getElementById("rmTests").value=o.map(s=>`${s.label||s} | ${s.url||""} | ${s.soru||0}`).join(`
`):document.getElementById("rmTests").value=o.map(s=>`${s.label||s} | ${s.soru||0}`).join(`
`),Y("resourceModal")}async function Qi(){const e=document.getElementById("rmName").value.trim(),t=document.getElementById("rmSubject").value.trim();if(!e||!t)return k("Ad ve ders zorunlu!");const n=document.getElementById("rmId").value,a=document.getElementById("rmType").value==="playlist",i=document.getElementById("rmTests").value.split(`
`).map(d=>d.trim()).filter(Boolean);let o=[];a?o=i.map(d=>{const c=d.split("|").map(l=>l.trim());return{label:c[0]||"",url:c[1]||"",topic:"",soru:parseInt(c[2])||0}}):o=i.map(d=>{const c=d.split("|").map(l=>l.trim());return{label:c[0]||"",soru:parseInt(c[1])||0}});const s={exam_type:document.getElementById("rmExam").value,subject:t,publisher:document.getElementById("rmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:o,active:document.getElementById("rmActive").value==="true",resource_type:a?"playlist":"book"};n?(await b.from("resources").update(s).eq("id",n),k("Güncellendi ✓")):(await b.from("resources").insert(s),k("Kaynak eklendi ✓")),O("resourceModal"),Ze()}async function eo(e){await X("Bu kaynağı silmek istediğinizden emin misiniz?")&&(await b.from("resources").delete().eq("id",e),k("Silindi"),Ze())}async function ut(){const e=document.getElementById("view-dev-finance"),[{data:t},{data:n}]=await Promise.all([b.from("subscriptions").select("*,users(full_name,color)").order("created_at",{ascending:!1}),b.from("payments").select("*,users(full_name)").order("payment_date",{ascending:!1}).limit(20)]),a=(n||[]).filter(o=>o.status==="completed").reduce((o,s)=>o+Number(s.amount),0),i=(t||[]).filter(o=>o.status==="active").length;e.innerHTML=`
    <div class="sh"><h2>💰 Finans Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openPaymentModal()">+ Ödeme Ekle</button>
        <button class="btn btn-accent btn-sm" onclick="openSubModal()">+ Abonelik</button>
      </div>
    </div>
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Tahsilat</div><div class="stat-val" style="color:var(--green)">${a.toLocaleString("tr-TR")} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Aktif Abonelik</div><div class="stat-val">${i}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam İşlem</div><div class="stat-val">${(n||[]).length}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">📋 Abonelikler</div>
        ${(t||[]).map(o=>{var s;return`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:13px;font-weight:700">${u(((s=o.users)==null?void 0:s.full_name)||"?")}</div>
              <div style="font-size:11px;color:var(--text-dim)">${o.plan} · ${o.start_date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:13px;font-weight:700;color:var(--green)">${Number(o.amount).toLocaleString("tr-TR")} ₺</div>
              <span style="font-size:10px;padding:2px 7px;border-radius:99px;background:${o.status==="active"?"var(--green-dim)":"var(--red-dim)"};color:${o.status==="active"?"var(--green)":"var(--red)"}">${o.status}</span>
            </div>
          </div>`}).join("")||'<div class="empty"><p>Abonelik yok</p></div>'}
      </div>
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">💳 Son Ödemeler</div>
        ${(n||[]).slice(0,10).map(o=>{var s;return`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:12px;font-weight:700">${u(((s=o.users)==null?void 0:s.full_name)||"?")}</div>
              <div style="font-size:11px;color:var(--text-dim)">${o.payment_date} · ${o.method}</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--green)">${Number(o.amount).toLocaleString("tr-TR")} ₺</div>
          </div>`}).join("")||'<div class="empty"><p>Ödeme yok</p></div>'}
      </div>
    </div>`}function to(){let e=document.getElementById("paymentModal");e||(e=document.createElement("div"),e.id="paymentModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('paymentModal')">×</button>
      <h2>Ödeme Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="pmStudent">${r.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join("")}</select></div>
      <div class="field-row">
        <div class="field"><label>Tutar (₺)</label><input type="number" id="pmAmount" placeholder="1500"></div>
        <div class="field"><label>Yöntem</label><select id="pmMethod"><option>nakit</option><option>havale</option><option>kart</option><option>iyzico</option></select></div>
      </div>
      <div class="field"><label>Tarih</label><input type="date" id="pmDate" value="${H(new Date)}"></div>
      <div class="field"><label>Açıklama</label><input id="pmDesc" placeholder="Mayıs ayı ücreti"></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePayment()">Kaydet</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pmStudent").innerHTML=r.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Y("paymentModal")}async function no(){const e=parseFloat(document.getElementById("pmAmount").value);if(!e)return k("Tutar girin!");await b.from("payments").insert({student_id:document.getElementById("pmStudent").value,amount:e,method:document.getElementById("pmMethod").value,payment_date:document.getElementById("pmDate").value,description:document.getElementById("pmDesc").value,status:"completed"}),k("Ödeme kaydedildi ✓"),O("paymentModal"),ut()}function ao(){let e=document.getElementById("subModal");e||(e=document.createElement("div"),e.id="subModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('subModal')">×</button>
      <h2>Abonelik Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="sbStudent"></select></div>
      <div class="field-row">
        <div class="field"><label>Plan</label><select id="sbPlan"><option value="monthly">Aylık</option><option value="quarterly">3 Aylık</option><option value="yearly">Yıllık</option></select></div>
        <div class="field"><label>Aylık Tutar (₺)</label><input type="number" id="sbAmount" placeholder="1500"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Başlangıç</label><input type="date" id="sbStart" value="${H(new Date)}"></div>
        <div class="field"><label>Bitiş (isteğe bağlı)</label><input type="date" id="sbEnd"></div>
      </div>
      <div class="field"><label>Durum</label><select id="sbStatus"><option value="active">Aktif</option><option value="trial">Deneme</option><option value="paused">Durduruldu</option><option value="cancelled">İptal</option></select></div>
      <div class="field"><label>Not</label><input id="sbNotes" placeholder="..."></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveSub()">Kaydet</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("sbStudent").innerHTML=r.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Y("subModal")}async function io(){const e=parseFloat(document.getElementById("sbAmount").value);if(!e)return k("Tutar girin!");await b.from("subscriptions").insert({student_id:document.getElementById("sbStudent").value,plan:document.getElementById("sbPlan").value,amount:e,start_date:document.getElementById("sbStart").value,end_date:document.getElementById("sbEnd").value||null,status:document.getElementById("sbStatus").value,notes:document.getElementById("sbNotes").value}),k("Abonelik eklendi ✓"),O("subModal"),ut()}async function Je(){const e=document.getElementById("view-dev-announce"),{data:t}=await b.from("announcements").select("*").order("created_at",{ascending:!1}),n={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"};e.innerHTML=`
    <div class="sh"><h2>📣 Duyuru Yönetimi</h2>
      <button class="btn btn-accent" onclick="openAnnounceModal()">+ Duyuru Ekle</button>
    </div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Aktif duyurular tüm kullanıcıların ana ekranında gösterilir.</div>
    ${(t||[]).length===0?'<div class="empty"><p>Henüz duyuru yok</p></div>':""}
    ${(t||[]).map(a=>`
      <div class="card" style="padding:16px 20px;margin-bottom:10px;border-left:3px solid ${n[a.type]||"var(--accent)"}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px">${u(a.title)}</div>
            <div style="font-size:13px;color:var(--text-mid);margin-bottom:8px">${u(a.body)}</div>
            <div style="display:flex;gap:8px">
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${n[a.type]+"22"};color:${n[a.type]}">${a.type}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:var(--surface2);color:var(--text-dim)">${a.target}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${a.active?"var(--green-dim)":"var(--red-dim)"};color:${a.active?"var(--green)":"var(--red)"}">${a.active?"Aktif":"Pasif"}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-xs" onclick="toggleAnnounce('${a.id}',${!a.active})">${a.active?"Pasife Al":"Aktifleştir"}</button>
            <button class="btn btn-danger btn-xs" onclick="devDeleteAnnounce('${a.id}')">🗑</button>
          </div>
        </div>
      </div>`).join("")}`}function oo(){let e=document.getElementById("announceModal");e||(e=document.createElement("div"),e.id="announceModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('announceModal')">×</button>
      <h2>Yeni Duyuru</h2>
      <div class="field"><label>Başlık</label><input id="anTitle" placeholder="Önemli Güncelleme"></div>
      <div class="field"><label>İçerik</label><textarea id="anBody" placeholder="Duyuru metni..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Tür</label><select id="anType"><option value="info">Bilgi</option><option value="warning">Uyarı</option><option value="success">Başarı</option><option value="urgent">Acil</option></select></div>
        <div class="field"><label>Hedef</label><select id="anTarget"><option value="all">Herkes</option><option value="students">Öğrenciler</option><option value="coaches">Koçlar</option></select></div>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveAnnounce()">Yayınla</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),Y("announceModal")}async function so(){const e=document.getElementById("anTitle").value.trim(),t=document.getElementById("anBody").value.trim();if(!e||!t)return k("Başlık ve içerik zorunlu!");await b.from("announcements").insert({title:e,body:t,type:document.getElementById("anType").value,target:document.getElementById("anTarget").value,active:!0}),k("Duyuru yayınlandı ✓"),O("announceModal"),Je()}async function ro(e,t){await b.from("announcements").update({active:t}).eq("id",e),Je()}async function lo(e){await X("Bu duyuruyu silmek istediğinizden emin misiniz?")&&(await b.from("announcements").delete().eq("id",e),k("Silindi"),Je())}let Ce=null,rt=null,re=null,ht=null,Me=[],ve=[],ye="welcome";async function Ne(){const e=document.getElementById("view-dev-tickets");if(!e)return;const{data:t,error:n}=await b.from("tickets").select("*,users!tickets_user_id_fkey(full_name,role)").order("updated_at",{ascending:!1});Me=t||[],!re&&Me.length>0&&(re=Me[0].id),e.innerHTML=`
    <div class="sh" style="margin-bottom:12px">
      <h2>🎫 Destek & Geri Bildirim Masası</h2>
    </div>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; height: 600px; max-height: calc(100vh - 180px); margin-top: 10px">
      <!-- Left Pane: Chats List -->
      <div style="overflow-y: auto; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 8px; padding: 12px">
        <div style="font-size: 11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px">Konuşmalar</div>
        ${Me.length===0?`
          <div style="text-align:center; padding:40px 10px; color:var(--text-dim); font-size:12px">Kayıtlı destek talebi yok.</div>
        `:Me.map(a=>{var x,I,f;const i=a.id===re,o=((x=a.users)==null?void 0:x.full_name)||"Kullanıcı",s=((I=a.users)==null?void 0:I.role)==="coach"?"KOÇ":((f=a.users)==null?void 0:f.role)==="parent"?"VELİ":"ÖĞRENCİ";let d="Mesaj yok";try{const y=JSON.parse(a.body);Array.isArray(y)&&y.length>0?d=y[y.length-1].text:d=a.body}catch{d=a.body}const c=d.length>28?d.slice(0,26)+"...":d,l=a.status==="open"?'<span style="font-size:9px; background:#ef444422; color:#ef4444; padding:2px 6px; border-radius:99px; font-weight:700">Yeni</span>':a.status==="resolved"?'<span style="font-size:9px; background:#10b98122; color:#10b981; padding:2px 6px; border-radius:99px; font-weight:700">Cevaplandı</span>':'<span style="font-size:9px; background:var(--border2); color:var(--text-dim); padding:2px 6px; border-radius:99px; font-weight:700">Kapatıldı</span>',p=i?"var(--accent-dim)":"var(--surface)",m=i?"1.5px solid var(--accent)":"1px solid var(--border)",g=i?"10px 11px":"10px 12px";return`
            <div onclick="selectDevTicket('${a.id}')" style="background:${p}; border:${m}; border-radius:10px; padding:${g}; cursor:pointer; display:flex; flex-direction:column; gap:4px; transition:all .15s">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span style="font-weight:700; font-size:12px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px">${u(o)}</span>
                <span style="font-size:9px; font-weight:800; color:var(--text-dim)">${s}</span>
              </div>
              <div style="font-size:11px; color:var(--text-mid); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${u(c)}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px">
                <span style="font-size:9px; color:var(--text-dim)">${new Date(a.updated_at).toLocaleDateString("tr-TR")}</span>
                ${l}
              </div>
            </div>
          `}).join("")}
      </div>

      <!-- Right Pane: Active Chat Area -->
      <div id="devChatArea" style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden">
        <!-- Rendered dynamically by loadDevChatArea() -->
      </div>
    </div>
  `,mo(),ht&&clearInterval(ht),ht=setInterval(po,4e3)}function co(e){re=e,Ne()}async function po(){if(!re||!document.getElementById("devChatArea"))return;const{data:t,error:n}=await b.from("tickets").select("*,users!tickets_user_id_fkey(full_name,role)").eq("id",re).single();if(n||!t)return;let a=[];try{a=JSON.parse(t.body),Array.isArray(a)||(a=[{sender:"user",text:t.body,time:t.created_at}])}catch{a=[{sender:"user",text:t.body,time:t.created_at}]}const i=document.getElementById("devChatMessages");if(i){const o=i.scrollTop,s=i.scrollHeight-i.clientHeight-o<40;i.innerHTML=a.map(d=>{const c=d.sender==="emin",l=c?"Kurucu / Destek":d.sender==="ai"?"Yapay Zeka":d.name||"Kullanıcı",p=c?"var(--blue)":d.sender==="ai"?"var(--surface2)":"var(--accent)",m=c?"#fff":d.sender==="ai"?"var(--text)":"var(--on-accent)",g=c?"flex-end":"flex-start",x=c?"14px 14px 4px 14px":"14px 14px 14px 4px",I=new Date(d.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
        <div style="align-self:${g}; max-width:80%; display:flex; flex-direction:column; align-items:${c?"flex-end":"flex-start"}">
          <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${l}</div>
          <div style="padding:10px 14px; border-radius:${x}; background:${p}; color:${m}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${u(d.text)}</div>
          <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${I}</div>
        </div>
      `}).join(""),s&&(i.scrollTop=i.scrollHeight)}}function mo(){var s,d,c;const e=document.getElementById("devChatArea");if(!e)return;const t=Me.find(l=>l.id===re);if(!t){e.innerHTML=`
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text-dim); padding:20px; text-align:center">
        <div style="font-size:48px; margin-bottom:12px">🎫</div>
        <div style="font-weight:700">Aktif Sohbet Seçilmedi</div>
        <div style="font-size:12px; margin-top:4px">Soldaki listeden bir destek sohbeti seçerek yanıtlayabilirsiniz.</div>
      </div>
    `;return}const n=((s=t.users)==null?void 0:s.full_name)||"Kullanıcı",a=((d=t.users)==null?void 0:d.role)==="coach"?"KOÇ":((c=t.users)==null?void 0:c.role)==="parent"?"VELİ":"ÖĞRENCİ";let i=[];try{i=JSON.parse(t.body),Array.isArray(i)||(i=[{sender:"user",text:t.body,time:t.created_at}])}catch{i=[{sender:"user",text:t.body,time:t.created_at}]}e.innerHTML=`
    <!-- Active Chat Header -->
    <div style="padding:14px 20px; border-bottom: 1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface2)">
      <div>
        <div style="font-weight:800; font-size:14px; color:var(--text)">${u(n)} <span style="font-size:10px; font-weight:700; color:var(--text-dim); margin-left:6px">${a}</span></div>
        <div style="font-size:11px; color:var(--text-mid); margin-top:2px">Konu: ${u(t.subject)}</div>
      </div>
      <div style="display:flex; gap:10px; align-items:center">
        <select onchange="updateTicketStatus('${t.id}',this.value)" style="background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-size:12px; color:var(--text); cursor:pointer; outline:none">
          <option value="open" ${t.status==="open"?"selected":""}>Açık (İşlem Bekliyor)</option>
          <option value="resolved" ${t.status==="resolved"?"selected":""}>Cevaplandı / Çözüldü</option>
          <option value="closed" ${t.status==="closed"?"selected":""}>Kapatıldı</option>
        </select>
        <button class="btn btn-danger btn-xs" onclick="devDeleteTicket('${t.id}')" style="padding:6px; border-radius:8px">🗑</button>
      </div>
    </div>

    <!-- Message Logs -->
    <div id="devChatMessages" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; background:var(--surface)">
      ${i.map(l=>{const p=l.sender==="emin",m=p?"Kurucu / Destek":l.sender==="ai"?"Yapay Zeka":l.name||"Kullanıcı",g=p?"var(--blue)":l.sender==="ai"?"var(--surface2)":"var(--accent)",x=p?"#fff":l.sender==="ai"?"var(--text)":"var(--on-accent)",I=p?"flex-end":"flex-start",f=p?"14px 14px 4px 14px":"14px 14px 14px 4px",y=new Date(l.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
          <div style="align-self:${I}; max-width:80%; display:flex; flex-direction:column; align-items:${p?"flex-end":"flex-start"}">
            <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${m}</div>
            <div style="padding:10px 14px; border-radius:${f}; background:${g}; color:${x}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${u(l.text)}</div>
            <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${y}</div>
          </div>
        `}).join("")}
    </div>

    <!-- Footer Reply Input -->
    <div style="padding:12px 16px; border-top:1px solid var(--border); display:flex; gap:8px; background:var(--surface2); align-items:flex-end">
      <textarea id="devReplyInput" placeholder="Sohbete yanıt yazın..." rows="1" style="flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:10px 14px; font-size:13px; font-family:inherit; color:var(--text); resize:none; max-height:80px; outline:none" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendDevReply()}"></textarea>
      <button class="btn btn-accent" onclick="sendDevReply()" style="padding:8px 16px; font-size:13px; border-radius:10px; align-self:stretch; justify-content:center">Gönder</button>
    </div>
  `;const o=document.getElementById("devChatMessages");o&&(o.scrollTop=o.scrollHeight)}async function uo(){const e=document.getElementById("devReplyInput"),t=e.value.trim();if(!t||!re)return;e.value="",L(!0);const{data:n}=await b.from("tickets").select("body").eq("id",re).single();let a=[];if(n&&n.body)try{a=JSON.parse(n.body)}catch{a=[{sender:"user",text:n.body,time:new Date().toISOString()}]}const i={sender:"emin",text:t,time:new Date().toISOString(),name:"Kurucu / Destek"};a.push(i);const{error:o}=await b.from("tickets").update({body:JSON.stringify(a),reply:t,status:"resolved",updated_at:new Date().toISOString()}).eq("id",re);if(L(!1),o){k("Hata: "+o.message);return}k("Yanıt gönderildi ✓"),Ne()}async function go(e,t){await b.from("tickets").update({status:t,updated_at:new Date().toISOString()}).eq("id",e),k("Durum güncellendi ✓"),Ne()}async function vo(e){await X("Bu talebi silmek istediğinizden emin misiniz?")&&(await b.from("tickets").delete().eq("id",e),k("Silindi"),re=null,Ne())}function yo(){gt()}async function gt(){let e=document.getElementById("supportChatModal");e||(e=document.createElement("div"),e.id="supportChatModal",e.className="modal-bg",e.style.zIndex="99999999",e.innerHTML=`
      <div class="modal" style="max-width:500px;width:100%;height:600px;display:flex;flex-direction:column;padding:0;overflow:hidden;border-radius:18px;border:1px solid var(--border)">
        <!-- Header -->
        <div style="padding:16px 20px;background:linear-gradient(135deg,rgba(240,165,0,.1),rgba(232,98,42,.05));border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div>
              <div style="font-weight:800;font-size:15px;color:var(--text)">Rostrum Destek Merkezi</div>
              <div style="font-size:11px;color:var(--green);font-weight:700" id="supportStatusLabel">● Çevrimiçi Asistan</div>
            </div>
          </div>
          <button class="modal-close" onclick="closeSupportChat()" style="position:static;font-size:22px;background:none;border:none;color:var(--text-mid);cursor:pointer;padding:4px">✕</button>
        </div>

        <!-- Chat messages view -->
        <div id="supportMessages" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;background:var(--surface)">
          <!-- Dynamic Messages -->
        </div>

        <!-- Typing Indicator -->
        <div id="supportTyping" class="ai-typing" style="margin: 0 20px 10px; padding:8px 12px; border-radius:10px; display:none; gap:4px; align-items:center; background:var(--surface2)">
          <span></span><span></span><span></span>
        </div>

        <!-- Footer input bar -->
        <div style="padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:8px;align-items:flex-end;background:var(--surface2)">
          <textarea id="supportInput" placeholder="Mesajınızı yazın..." rows="1" style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 14px;font-size:13px;font-family:inherit;color:var(--text);resize:none;max-height:80px;outline:none" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendSupportMessage()}"></textarea>
          <button class="btn btn-accent" onclick="sendSupportMessage()" style="padding:8px 16px;font-size:13px;border-radius:10px;align-self:stretch;justify-content:center">Gönder</button>
        </div>
      </div>
    `,document.body.appendChild(e),e.addEventListener("click",t=>{var a;const n=(a=document.getElementById("trialExpiredModal"))==null?void 0:a.classList.contains("open");t.target===e&&!n&&jn()})),Y("supportChatModal"),await dt(),Ce&&clearInterval(Ce),Ce=setInterval(dt,4e3)}function jn(){O("supportChatModal"),Ce&&(clearInterval(Ce),Ce=null)}async function dt(){var o,s;const e=(o=h.dbUser)==null?void 0:o.id;if(!e)return;const t=document.getElementById("supportMessages");if(!t)return;const{data:n,error:a}=await b.from("tickets").select("*").eq("user_id",e).eq("status","open").order("created_at",{ascending:!1}).limit(1);if(a){console.error("Error fetching ticket:",a);return}const i=n&&n[0];if(i){rt=i.id,ye="emin";const d=document.getElementById("supportStatusLabel");d&&(d.textContent="● Kurucu / Destek Ekibi");let c=[];try{c=JSON.parse(i.body),Array.isArray(c)||(c=[{sender:"user",text:i.body,time:i.created_at}])}catch{c=[{sender:"user",text:i.body,time:i.created_at}]}i.reply&&((s=c[c.length-1])==null?void 0:s.text)!==i.reply&&c.push({sender:"emin",text:i.reply,time:i.updated_at}),qe(c)}else if(ye==="welcome"){const d=document.getElementById("supportStatusLabel");d&&(d.textContent="● Çevrimiçi Asistan"),t.innerHTML=`
        <div style="text-align:center;padding:40px 20px">
          <div style="font-size:48px;margin-bottom:12px">🎓</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">Rostrum Destek Asistanına Hoş Geldiniz!</div>
          <div style="font-size:12px;color:var(--text-mid);line-height:1.6;margin-bottom:24px">
            Uygulama ile ilgili teknik, pedagojik veya fiyatlandırma sorularınızı sorabilirsiniz.
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;align-items:stretch;max-width:280px;margin:0 auto">
            <button class="btn btn-accent" onclick="startAISupportChat()" style="justify-content:center;padding:10px;font-size:13px">
              🤖 Yapay Zeka Asistanı ile Konuş
            </button>
            <button class="btn btn-ghost" onclick="startEminSupportChat()" style="justify-content:center;padding:10px;font-size:13px;border-color:var(--border)">
              ✉️ Kurucuya / Destek Ekibine Yaz
            </button>
          </div>
        </div>
      `}else if(ye==="ai"){const d=document.getElementById("supportStatusLabel");d&&(d.textContent="● Yapay Zeka"),qe(ve)}}function qe(e){const t=document.getElementById("supportMessages");if(!t)return;const n=t.scrollTop,a=t.scrollHeight-t.clientHeight-n<40;t.innerHTML=e.map(i=>{const o=i.sender==="user",s=o?"Siz":i.sender==="ai"?"Yapay Zeka Asistanı":"Kurucu / Destek Ekibi",d=o?"var(--accent)":"var(--surface2)",c=o?"none":"1px solid var(--border)",l=o?"var(--on-accent)":"var(--text)",p=o?"flex-end":"flex-start",m=o?"14px 14px 4px 14px":"14px 14px 14px 4px",g=new Date(i.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
      <div style="align-self:${p};max-width:80%;display:flex;flex-direction:column;align-items:${o?"flex-end":"flex-start"}">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;font-weight:600">${s}</div>
        <div style="padding:10px 14px;border-radius:${m};background:${d};border:${c};color:${l};font-size:13px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap">${u(i.text)}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:4px">${g}</div>
      </div>
    `}).join(""),a&&(t.scrollTop=t.scrollHeight)}function fo(){ye="ai",ve=[{sender:"ai",text:"Merhaba! Ben Rostrum Akademi Yapay Zeka Asistanıyım. 🤖 Size nasıl yardımcı olabilirim?",time:new Date().toISOString()}],qe(ve)}function xo(){ye="emin_start";const e=document.getElementById("supportMessages");e&&(e.innerHTML=`
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;margin-bottom:12px">✉️</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">Kurucuya / Destek Ekibine Yaz</div>
        <div style="font-size:12px;color:var(--text-mid);line-height:1.6;margin-bottom:24px">
          Soru, görüş veya abonelik taleplerinizi iletin. Kurucu ekibimiz mesajlarınızı inceleyip en kısa sürede bu ekrandan yanıtlayacaktır.
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;max-width:320px;margin:0 auto">
          <input type="text" id="eminSubject" placeholder="Konu (Örn: Paket Satın Alma)" style="padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px">
          <textarea id="eminInitialMessage" placeholder="Mesajınız..." style="padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);min-height:80px;font-size:13px"></textarea>
          <button class="btn btn-accent" onclick="submitEminInitialMessage()" style="justify-content:center;padding:10px;font-size:13px">
            Gönder ve Bağlan
          </button>
        </div>
      </div>
    `)}async function bo(){var l,p;const e=document.getElementById("eminSubject"),t=document.getElementById("eminInitialMessage"),n=e?e.value.trim():"Müşteri Destek Sohbeti",a=t?t.value.trim():"";if(!a)return k("Mesaj boş olamaz!");const i=(l=h.dbUser)==null?void 0:l.id,o=((p=h.dbUser)==null?void 0:p.full_name)||"Kullanıcı",s={sender:"user",text:a,time:new Date().toISOString(),name:o};L(!0);const{data:d,error:c}=await b.from("tickets").insert({user_id:i,subject:n,body:JSON.stringify([s]),category:"emin",status:"open"}).select().single();if(L(!1),c){k("Hata: "+c.message);return}rt=d.id,ye="emin",k("Talebiniz destek ekibine iletildi ✓"),await dt()}async function ho(){var n;const e=document.getElementById("supportInput"),t=e.value.trim();if(t){if(e.value="",ye==="ai"){const a={sender:"user",text:t,time:new Date().toISOString()};ve.push(a),qe(ve);const i=document.getElementById("supportTyping");i&&(i.style.display="flex");try{const o=await Pe(t,{},h.role||"coach");ve.push({sender:"ai",text:o,time:new Date().toISOString()})}catch{ve.push({sender:"ai",text:"Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra deneyin.",time:new Date().toISOString()})}finally{i&&(i.style.display="none"),qe(ve)}}else if(ye==="emin"){const a=((n=h.dbUser)==null?void 0:n.full_name)||"Kullanıcı",i={sender:"user",text:t,time:new Date().toISOString(),name:a};L(!0);const{data:o}=await b.from("tickets").select("body").eq("id",rt).single();let s=[];if(o&&o.body)try{s=JSON.parse(o.body)}catch{s=[{sender:"user",text:o.body,time:new Date().toISOString(),name:a}]}s.push(i);const{error:d}=await b.from("tickets").update({body:JSON.stringify(s),status:"open",updated_at:new Date().toISOString()}).eq("id",rt);if(L(!1),d){k("Gönderim hatası: "+d.message);return}await dt()}}}async function Pn(){const{data:e}=await b.from("announcements").select("*").eq("active",!0),t=h.role,n=(e||[]).filter(o=>o.target==="all"||o.target==="students"&&t==="student"||o.target==="coaches"&&t==="coach");if(!n.length)return;const a={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"},i=document.createElement("div");i.style.cssText="position:fixed;top:64px;right:16px;z-index:400;display:flex;flex-direction:column;gap:8px;max-width:340px",i.id="announceBanner",n.slice(0,3).forEach(o=>{const s=document.createElement("div");s.style.cssText=`background:var(--surface);border:1px solid var(--border);border-left:3px solid ${a[o.type]||"var(--accent)"};border-radius:10px;padding:12px 14px;box-shadow:var(--shadow);animation:fadeUp .3s ease`,s.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div><div style="font-size:13px;font-weight:700;margin-bottom:3px">${u(o.title)}</div><div style="font-size:12px;color:var(--text-mid)">${u(o.body)}</div></div>
      <button onclick="this.closest('div[style]').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;flex-shrink:0">×</button>
    </div>`,i.appendChild(s)}),document.body.appendChild(i),setTimeout(()=>i.remove(),8e3)}(()=>{const e=document.createElement("style");e.textContent=".role-dev{background:rgba(192,132,252,.15);color:#c084fc;}",document.head.appendChild(e)})();function ko(){let e=document.getElementById("onboardingModal");e||(e=document.createElement("div"),e.id="onboardingModal",e.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)",document.body.appendChild(e)),Ft(0,e)}const St=[{icon:"🎉",title:"Rostrum Akademi'ye Hoş Geldiniz!",body:"Koçluk platformunuzu birkaç adımda kuruyoruz. Sadece 2 dakika.",fields:[],nextLabel:"Başlayalım →"},{icon:"🏷️",title:"Markanızı Tanıyalım",body:"Öğrencileriniz uygulamaya girdiğinde ne görsün?",fields:[{id:"ob_brand",label:"Akademi / Koçluk Adı",placeholder:"Örn: Ayşe Koçluk, EminHoca Akademi",type:"text"},{id:"ob_color",label:"Marka Rengi",type:"color",value:"#f0a500"}],nextLabel:"Devam →"},{icon:"🔐",title:"Şifrenizi Güncelleyin",body:"Güvenli bir şifre belirleyin.",fields:[{id:"ob_pass1",label:"Yeni Şifre",placeholder:"En az 6 karakter",type:"password"},{id:"ob_pass2",label:"Şifre Tekrar",placeholder:"Aynı şifreyi girin",type:"password"}],nextLabel:"Devam →"},{icon:"👨‍🎓",title:"İlk Öğrencinizi Ekleyin",body:"Şimdi ya da sonra ekleyebilirsiniz.",fields:[{id:"ob_stuname",label:"Öğrenci Adı Soyadı",placeholder:"Muzaffer Sabri Koçar",type:"text"},{id:"ob_stuuser",label:"Kullanıcı Adı",placeholder:"muzaffer",type:"text"},{id:"ob_stupass",label:"Öğrenci Şifresi",placeholder:"ogrenci123",type:"text"}],nextLabel:"Devam →",skipLabel:"Şimdilik Geç"},{icon:"✅",title:"Hazırsınız!",body:"Platformunuz kuruldu. Hemen kullanmaya başlayabilirsiniz.",fields:[],nextLabel:"Panele Git →"}];function Ft(e,t){const n=St[e],a=St.length,i=Array.from({length:a},(o,s)=>`<div style="width:${s===e?24:8}px;height:8px;border-radius:99px;background:${s===e?"var(--accent)":"var(--border2)"};transition:width .3s"></div>`).join("");t.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border2);border-radius:24px;width:100%;max-width:480px;padding:40px;animation:fadeUp .3s ease">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-size:52px;margin-bottom:12px">${n.icon}</div>
      <h2 style="font-family:'Inter',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px">${n.title}</h2>
      <p style="font-size:14px;color:var(--text-mid);line-height:1.6">${n.body}</p>
    </div>
    ${n.fields.map(o=>`
      <div class="field">
        <label>${o.label}</label>
        ${o.type==="color"?`<div style="display:flex;gap:10px;flex-wrap:wrap">${["#f0a500","#e8622a","#4da6ff","#3ecf8e","#c084fc","#f472b6","#0f172a"].map(s=>`<div onclick="document.getElementById('${o.id}').value='${s}';this.parentElement.querySelectorAll('div').forEach(x=>x.style.outline='none');this.style.outline='3px solid white'" style="width:32px;height:32px;background:${s};border-radius:8px;cursor:pointer;transition:transform .1s" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform=''"></div>`).join("")}<input type="hidden" id="${o.id}" value="${o.value||"#f0a500"}"></div>`:`<input type="${o.type||"text"}" id="${o.id}" placeholder="${o.placeholder||""}" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:12px 14px;font-size:14px;font-family:inherit;color:var(--text);outline:none">`}
      </div>`).join("")}
    <div style="display:flex;gap:10px;margin-top:24px">
      ${e>0?`<button onclick="renderOnboardingStep(${e-1},document.getElementById('onboardingModal'))" style="background:var(--surface2);border:1px solid var(--border);color:var(--text-mid);border-radius:10px;padding:12px 20px;font-family:inherit;font-weight:700;cursor:pointer">← Geri</button>`:""}
      ${n.skipLabel?`<button onclick="advanceOnboarding(${e},true)" style="background:transparent;border:1px solid var(--border);color:var(--text-dim);border-radius:10px;padding:12px 20px;font-family:inherit;font-weight:600;cursor:pointer">${n.skipLabel}</button>`:""}
      <button onclick="advanceOnboarding(${e},false)" style="flex:1;background:var(--accent);color:#0f0e0c;border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer">${n.nextLabel}</button>
    </div>
    <div style="display:flex;gap:6px;justify-content:center;margin-top:20px">${i}</div>
  </div>`}async function wo(e,t){var i,o,s,d,c,l,p,m,g,x,I,f,y;const n=document.getElementById("onboardingModal");if(!t){if(e===1){const v=(o=(i=document.getElementById("ob_brand"))==null?void 0:i.value)==null?void 0:o.trim(),$=((s=document.getElementById("ob_color"))==null?void 0:s.value)||"#f0a500";if(v){await b.from("workspaces").upsert({coach_id:h.coachId,brand_name:v,brand_color:$},{onConflict:"coach_id"}),r.workspace={...r.workspace||{},coach_id:h.coachId,brand_name:v,brand_color:$};const S=document.querySelector(".sb-logo-text");S&&(S.textContent=v)}}if(e===2){const v=(d=document.getElementById("ob_pass1"))==null?void 0:d.value,$=(c=document.getElementById("ob_pass2"))==null?void 0:c.value;if(v&&v.length<6){k("En az 6 karakter!");return}if(v&&v!==$){k("Şifreler uyuşmuyor!");return}v&&await b.from("users").update({password_hash:v}).eq("id",h.coachId)}if(e===3){const v=(p=(l=document.getElementById("ob_stuname"))==null?void 0:l.value)==null?void 0:p.trim(),$=((g=(m=document.getElementById("ob_stuuser"))==null?void 0:m.value)==null?void 0:g.trim())||((x=v==null?void 0:v.split(" ")[0])==null?void 0:x.toLowerCase()),S=((I=document.getElementById("ob_stupass"))==null?void 0:I.value)||"ogrenci123",B=await Ie(S);if(v){const D=$+"@rostrumakademi.com",{data:{session:T}}=await b.auth.getSession(),_=await fetch("/api/create-student",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${(T==null?void 0:T.access_token)||""}`},body:JSON.stringify({email:D,password:S,full_name:v,username:$,color:"#4da6ff",target:"",progress:0,week_start:0,coach_id:h.coachId,exam_profile:"YKS"})}),z=await _.json();_.ok&&z.userId?r.students.push({id:z.userId,name:v,target:"",color:"#4da6ff",progress:0,pass:B,weekStart:0,username:$,coachId:h.coachId}):k("Öğrenci eklenemedi: "+(z.error||"Bilinmeyen hata"))}}}const a=e+1;if(a>=St.length){await b.from("workspaces").upsert({coach_id:h.coachId,brand_name:((f=r.workspace)==null?void 0:f.brand_name)||"Akademi",brand_color:((y=r.workspace)==null?void 0:y.brand_color)||"#f0a500",onboarding_done:!0},{onConflict:"coach_id"}),r.workspace&&(r.workspace.onboarding_done=!0),n.remove(),ne("home"),k("🎉 Hoş geldiniz! Platformunuz hazır.");return}Ft(a,n)}let kt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),kt=e;const t=document.createElement("button");t.id="pwaInstallBtn",t.className="btn btn-ghost btn-sm",t.innerHTML="📲 Yükle",t.style.cssText="font-size:11px;padding:5px 10px",t.onclick=async()=>{kt.prompt();const{outcome:n}=await kt.userChoice;n==="accepted"&&(t.remove(),k("Uygulama yüklendi ✓"))},document.querySelector(".tbar-right").insertBefore(t,document.querySelector(".user-pill"))});async function Hn(){const e=r.students.find(T=>T.id===h.studentId);if(!e)return;const t=document.getElementById("view-sprofil");if(!t)return;const{data:n,error:a}=await b.from("student_profiles").select("*").eq("id",h.studentId).maybeSingle();a&&console.error("Öğrenci profili yüklenirken hata:",a);const i=(n==null?void 0:n.bio)||"",o=(n==null?void 0:n.school)||"",s=(n==null?void 0:n.grade)||"",d=(n==null?void 0:n.target_university)||"",c=(n==null?void 0:n.target_department)||"",l=(n==null?void 0:n.struggling_subjects)||"",p=(n==null?void 0:n.daily_capacity)||"",m=r.exams.filter(T=>T.studentId===e.id).sort((T,_)=>T.date.localeCompare(_.date)),g=m[m.length-1],x=g?(EXAM_DEFS[g.type]||[]).reduce((_,z)=>{var E;return _+Number(((E=g.nets)==null?void 0:E[z])||0)},0).toFixed(1):"—",I=V(0,e.weekStart??0);let f=0,y=0;for(let T=0;T<7;T++){const _=r.tasks[`${e.id}_${H(U(I,T))}`]||[];f+=_.length,y+=_.filter(z=>z.done).length}const v=f>0?Math.round(y/f*100):0;let $=0;Object.keys(r.tasks).filter(T=>T.startsWith(e.id+"_")).forEach(T=>{$+=r.tasks[T].filter(_=>_.done).length});let S="";if(m.length>0){const T=m.slice(-6),_=Math.max(...T.map(z=>(EXAM_DEFS[z.type]||[]).reduce((M,j)=>{var w;return M+Number(((w=z.nets)==null?void 0:w[j])||0)},0)),1);S=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📈 Net Gelişim Grafiği</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:12px">
          ${T.map(z=>{const M=(EXAM_DEFS[z.type]||[]).reduce((P,K)=>{var R;return P+Number(((R=z.nets)==null?void 0:R[K])||0)},0),j=Math.max(Math.round(M/_*100),4),w=T[T.indexOf(z)-1],A=w?(EXAM_DEFS[w.type]||[]).reduce((P,K)=>{var R;return P+Number(((R=w.nets)==null?void 0:R[K])||0)},0):M,C=M>A?"↑":M<A?"↓":"",N=M>A?"var(--green)":M<A?"var(--red)":"var(--text-dim)";return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
              <div style="font-size:10px;font-weight:700;color:var(--text-mid)">${M.toFixed(0)}</div>
              <div style="font-size:9px;color:${N};font-weight:800">${C}</div>
              <div style="width:100%;background:${e.color};border-radius:4px 4px 0 0;height:${j}%;min-height:4px"></div>
              <div style="font-size:9px;color:var(--text-dim);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%">${u(z.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim())}</div>
            </div>`}).join("")}
        </div>
      </div>`}let B="";if(m.length>0){const T=g.type,z=(EXAM_DEFS[T]||[]).map(E=>{var A;const M=m.filter(C=>C.type===T).map(C=>{var N;return Number(((N=C.nets)==null?void 0:N[E])||0)}),j=M.length?M.reduce((C,N)=>C+N,0)/M.length:0,w=Number(((A=g.nets)==null?void 0:A[E])||0);return{f:E,avg:j.toFixed(1),last:w,color:_t(w)}});B=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📊 Ders Bazında Performans (${T})</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px">
          ${z.map(E=>`
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text-dim);font-weight:700;margin-bottom:4px;text-transform:uppercase">${E.f}</div>
              <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:var(--${E.color==="good"?"green":E.color==="mid"?"accent":"red"})">${E.last}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-top:2px">ort: ${E.avg}</div>
            </div>`).join("")}
        </div>
      </div>`}const D=r.appointments.filter(T=>T.studentId===e.id&&T.date>=Se()).sort((T,_)=>T.date.localeCompare(_.date)).slice(0,3);t.innerHTML=`
    <!-- HERO -->
    <div class="portal-hero" style="margin-bottom:16px">
      <div class="portal-avatar" style="background:${e.color};width:72px;height:72px;border-radius:18px;font-size:28px">${e.name[0]}</div>
      <div class="portal-info" style="flex:1">
        <h1>${u(e.name)}</h1>
        <p>${u(e.target)}</p>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-row" style="margin-bottom:16px">
      <div class="stat-card">
        <div class="stat-label">Genel İlerleme</div>
        <div class="stat-val" style="color:${e.color}">%${e.progress}</div>
        <div class="prog-bar-wrap" style="margin-top:8px"><div class="prog-bar" style="width:${e.progress}%;background:${e.color}"></div></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Bu Hafta Görev</div>
        <div class="stat-val">${y}<span style="font-size:14px;color:var(--text-dim)">/${f}</span></div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">%${v} tamamlandı</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Son Deneme Neti</div>
        <div class="stat-val" style="color:var(--accent)">${x}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">${g?u(g.name):"Deneme yok"}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Tamamlanan</div>
        <div class="stat-val">${$}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">görev</div>
      </div>
    </div>

    ${S}
    ${B}

    <!-- YAKLAŞAN RANDEVULAR -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📅 Yaklaşan Randevularım</div>
      ${D.length?D.map(T=>`
        <div style="background:var(--surface2);border:1px solid var(--border);border-left:3px solid ${e.color};border-radius:9px;padding:12px;margin-top:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px">${new Date(T.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          <div style="font-family:'Inter',sans-serif;font-size:17px;font-weight:700">${T.time} <span style="font-size:13px;color:var(--text-mid)">· ${T.duration} dk</span></div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${u(T.type)}</div>
        </div>`).join(""):'<div style="font-size:13px;color:var(--text-dim);margin-top:8px">Yaklaşan randevu yok</div>'}
    </div>

    <!-- DETAYLI PROFIL BILGILERI -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📝 Detaylı Profil Bilgilerim</div>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Okul</label>
          <input type="text" id="spSchool" value="${u(o)}" placeholder="Okulunuz" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Sınıf / Seviye</label>
          <input type="text" id="spGrade" value="${u(s)}" placeholder="Örn: 12. Sınıf, Mezun" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hedef Üniversite</label>
          <input type="text" id="spTargetUni" value="${u(d)}" placeholder="Örn: Boğaziçi Üniversitesi" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hedef Bölüm</label>
          <input type="text" id="spTargetDept" value="${u(c)}" placeholder="Örn: Bilgisayar Mühendisliği" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Zorlandığım Dersler</label>
          <input type="text" id="spStruggling" value="${u(l)}" placeholder="Örn: Fizik, Geometri" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Günlük Çalışma Kapasitesi (Saat)</label>
          <input type="number" id="spCapacity" value="${u(p)}" placeholder="Örn: 6" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Biyografi / Kendinden Bahset</label>
        <textarea id="spBio" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(i)}</textarea>
      </div>

      <button class="btn btn-accent" style="width:100%; padding:10px;" onclick="saveStudentProfile()">Profil Bilgilerini Güncelle ✓</button>
    </div>

    <!-- ŞİFRE DEĞİŞTİR -->
    <div class="card cp">
      <div class="portal-sec-title">🔒 Şifre Değiştir</div>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
        <input type="password" id="newPass1" placeholder="Yeni şifre" style="flex:1;min-width:140px;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none">
        <input type="password" id="newPass2" placeholder="Şifreyi tekrar gir" style="flex:1;min-width:140px;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none">
        <button class="btn btn-accent" onclick="changePassword()">Kaydet</button>
      </div>
    </div>`}async function $o(){const e=h.dbUser.id,t=document.getElementById("spBio").value.trim(),n=document.getElementById("spSchool").value.trim(),a=document.getElementById("spGrade").value.trim(),i=document.getElementById("spTargetUni").value.trim(),o=document.getElementById("spTargetDept").value.trim(),s=document.getElementById("spStruggling").value.trim(),d=parseInt(document.getElementById("spCapacity").value)||null,c={id:e,bio:t,school:n,grade:a,target_university:i,target_department:o,struggling_subjects:s,daily_capacity:d,updated_at:new Date().toISOString()},{error:l}=await b.from("student_profiles").upsert(c);k(l?"Profil kaydedilemedi: "+l.message:"Profil başarıyla güncellendi ✓")}async function To(){const e=document.getElementById("newPass1").value,t=document.getElementById("newPass2").value;if(!e)return k("Şifre girin!");if(e!==t)return k("Şifreler uyuşmuyor!");if(e.length<4)return k("En az 4 karakter olmalı");const{error:n}=await b.from("users").update({password_hash:e}).eq("id",h.studentId);if(n)return k("Hata: "+n.message);k("Şifre güncellendi ✓"),document.getElementById("newPass1").value="",document.getElementById("newPass2").value=""}async function Rn(){var x;const e=document.getElementById("view-coach-profile");if(!e)return;e.innerHTML='<div class="loading">Profil bilgileri yükleniyor...</div>';const t=h.dbUser.id;let n=null,a=null;const i=await b.from("coach_profiles").select("*").eq("id",t).maybeSingle();if(n=i.data,a=i.error,a){const I=localStorage.getItem(`coach_profile_${t}`);if(I)try{n=JSON.parse(I),a=null}catch{}if(a){e.innerHTML=`<div style="padding:20px;color:var(--red)">Profil yüklenirken hata oluştu: ${u(a.message)}</div>`;return}}else if(!n){const I=localStorage.getItem(`coach_profile_${t}`);if(I)try{n=JSON.parse(I)}catch{}}const o=(n==null?void 0:n.bio)||"",s=(n==null?void 0:n.subjects)||"",d=(n==null?void 0:n.education)||"",c=(n==null?void 0:n.experience)||"",l=(n==null?void 0:n.photo_url)||"",p=(n==null?void 0:n.instagram)||"",m=(n==null?void 0:n.linkedin)||"",g=window.location.origin+window.location.pathname.replace("app.html","koc_bul.html")+`?coach=${t}`;e.innerHTML=`
    <div style="max-width:900px;margin:0 auto">
    <div style="margin-bottom: 20px;">
      <h2 style="font-family:'Inter',sans-serif; margin-bottom: 6px;">👤 Koç Profilim</h2>
      <p style="font-size: 13px; color: var(--text-mid); margin-bottom: 15px;">
        "Koç Bul" sayfasında görünecek bilgilerinizi buradan düzenleyebilirsiniz.
      </p>
      
      <div style="margin-bottom: 16px; background: var(--surface2); border: 1px dashed var(--border); padding: 12px; border-radius: 9px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Kamuya Açık Profil Linkiniz</label>
        <div style="display:flex; gap:8px;">
          <input type="text" readonly value="${g}" id="coachBulLink" style="flex:1; background:var(--surface3); border:1px solid var(--border); border-radius:9px; padding:10px 13px; font-size:13px; color:var(--text-mid); outline:none;">
          <button class="btn btn-ghost" onclick="navigator.clipboard.writeText(document.getElementById('coachBulLink').value); showToast('Link kopyalandı ✓')">🔗 Kopyala</button>
          <a href="${g}" target="_blank" class="btn btn-accent" style="text-decoration:none; display:inline-flex; align-items:center;">👁 Göster</a>
        </div>
      </div>

      <div class="coach-profile-container">
        <!-- Sol Sütun: Form -->
        <div class="card coach-profile-form" style="margin:0; padding:20px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Uzmanlık Alanı / Dersler (Virgülle ayırın)</label>
              <input type="text" id="cpSubjects" value="${u(s)}" placeholder="Örn: Matematik, Fizik, Türkçe" oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Profil Fotoğrafı URL'si</label>
              <input type="text" id="cpPhotoUrl" value="${u(l)}" placeholder="https://..." oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hakkımda / Biyografi</label>
            <textarea id="cpBio" oninput="updateProfilePreview()" style="width:100%; min-height:100px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(o)}</textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Eğitim Bilgisi</label>
              <textarea id="cpEducation" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(d)}</textarea>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Deneyim / Başarılar</label>
              <textarea id="cpExperience" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(c)}</textarea>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Instagram Kullanıcı Adı (İsteğe bağlı)</label>
              <div style="display:flex; align-items:center; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:0 13px;">
                <span style="color:var(--text-dim); margin-right:4px;">@</span>
                <input type="text" id="cpInstagram" value="${u(p)}" placeholder="kullaniciadi" oninput="updateProfilePreview()" style="flex:1; background:none; border:none; padding:10px 0; font-size:14px; color:var(--text); outline:none;">
              </div>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">LinkedIn Profil URL (İsteğe bağlı)</label>
              <input type="text" id="cpLinkedin" value="${u(m)}" placeholder="https://linkedin.com/in/..." oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
          </div>

          <button class="btn btn-accent" style="width:100%; padding:12px; font-size:14px;" onclick="saveCoachProfile()">Kaydet ✓</button>
        </div>

        <!-- Sağ Sütun: Canlı Önizleme -->
        <div class="coach-preview-column">
          <div style="position: sticky; top: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; text-align: center;">CANLI ÖNİZLEME</div>
            <div class="profile-preview-card">
              <div class="preview-card-header">
                <div class="preview-avatar" id="prevAvatar"></div>
                <div class="preview-header-info">
                  <div class="preview-name" id="prevName">${u(((x=h.dbUser)==null?void 0:x.full_name)||"Koç")}</div>
                  <div class="preview-role">Mentör & Koç</div>
                  <div class="preview-socials" id="prevSocials"></div>
                </div>
              </div>
              
              <div class="preview-subjects-wrap" id="prevSubjects"></div>
              
              <div class="preview-tabs">
                <button class="prev-tab-btn active" id="btn-prev-bio" onclick="switchPreviewTab('bio')">Biyografi</button>
                <button class="prev-tab-btn" id="btn-prev-edu" onclick="switchPreviewTab('edu')">Eğitim</button>
                <button class="prev-tab-btn" id="btn-prev-exp" onclick="switchPreviewTab('exp')">Deneyim</button>
              </div>
              
              <div class="preview-tab-content" id="prevTabContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,qt()}let at="bio";function qt(){var g,x,I,f,y,v,$,S;const e=((g=document.getElementById("cpPhotoUrl"))==null?void 0:g.value.trim())||"",t=((x=document.getElementById("cpSubjects"))==null?void 0:x.value.trim())||"",n=((I=document.getElementById("cpBio"))==null?void 0:I.value.trim())||"",a=((f=document.getElementById("cpEducation"))==null?void 0:f.value.trim())||"",i=((y=document.getElementById("cpExperience"))==null?void 0:y.value.trim())||"",o=((v=document.getElementById("cpInstagram"))==null?void 0:v.value.trim())||"",s=(($=document.getElementById("cpLinkedin"))==null?void 0:$.value.trim())||"",d=((S=h.dbUser)==null?void 0:S.full_name)||"Koç",c=document.getElementById("prevAvatar");if(c)if(e)c.style.backgroundImage=`url('${e}')`,c.style.backgroundColor="transparent",c.innerHTML="";else{c.style.backgroundImage="",c.style.backgroundColor="var(--accent-dim)";const B=d.split(" ").map(D=>D[0]).join("").slice(0,2).toUpperCase();c.innerHTML=B||"?"}const l=document.getElementById("prevSocials");if(l){let B="";if(o&&(B+=`<a href="https://instagram.com/${o}" target="_blank" class="preview-social-link" title="Instagram">📸 @${o}</a>`),s){let D="LinkedIn";s.includes("/in/")&&(D="in/"+s.split("/in/")[1].split("/")[0]),B+=`<a href="${s}" target="_blank" class="preview-social-link" title="LinkedIn">💼 ${D}</a>`}l.innerHTML=B}const p=document.getElementById("prevSubjects");if(p)if(t){const B=t.split(",").map(D=>D.trim()).filter(Boolean);p.innerHTML=B.map(D=>`<span class="preview-tag">${u(D)}</span>`).join("")}else p.innerHTML='<span class="preview-tag" style="background:none; border:1px dashed var(--border); color:var(--text-dim)">Ders / Uzmanlık Belirtilmedi</span>';const m=document.getElementById("prevTabContent");if(m){let B="";at==="bio"?B=n||"Biyografi bilgisi henüz girilmedi.":at==="edu"?B=a||"Eğitim bilgisi henüz girilmedi.":at==="exp"&&(B=i||"Deneyim/başarılar henüz girilmedi."),m.innerHTML=Nn(u(B))}}function Eo(e){at=e;const t=document.getElementById("btn-prev-bio"),n=document.getElementById("btn-prev-edu"),a=document.getElementById("btn-prev-exp");t&&t.classList.toggle("active",e==="bio"),n&&n.classList.toggle("active",e==="edu"),a&&a.classList.toggle("active",e==="exp"),qt()}function Nn(e){return e.replace(/\n/g,"<br>")}async function So(){const e=h.dbUser.id,t=document.getElementById("cpBio").value.trim(),n=document.getElementById("cpSubjects").value.trim(),a=document.getElementById("cpEducation").value.trim(),i=document.getElementById("cpExperience").value.trim(),o=document.getElementById("cpPhotoUrl").value.trim(),s=document.getElementById("cpInstagram").value.trim(),d=document.getElementById("cpLinkedin").value.trim(),c={id:e,bio:t,subjects:n,education:a,experience:i,photo_url:o,instagram:s,linkedin:d,updated_at:new Date().toISOString()};localStorage.setItem(`coach_profile_${e}`,JSON.stringify(c));const{error:l}=await b.from("coach_profiles").upsert(c);l?(console.warn("Database save failed, profile saved locally in localStorage:",l),k("Profil yerel tarayıcıya kaydedildi (Veritabanı RLS hatası: "+l.message+")")):k("Profil başarıyla güncellendi ✓")}async function Ut(){const e=document.getElementById("view-dev-matches");if(!e)return;e.innerHTML='<div class="loading">Eşleşmeler yükleniyor...</div>';const{data:t,error:n}=await b.from("match_requests").select("*, matched_coach:matched_coach_id(full_name, username)").order("created_at",{ascending:!1});if(n){e.innerHTML=`<div style="padding:20px;color:var(--red)">Eşleşme başvuruları yüklenirken hata oluştu: ${u(n.message)}</div>`;return}const a={pending:"⏳ Bekliyor",matched:"🤝 Eşleştirildi",completed:"✅ Tamamlandı"},i={pending:"rgba(240, 165, 0, 0.15)",matched:"rgba(96, 180, 255, 0.15)",completed:"rgba(62, 207, 142, 0.15)"},o={pending:"var(--accent)",matched:"var(--accent4)",completed:"var(--green)"};e.innerHTML=`
    <div class="card" style="margin-bottom:20px;">
      <h2 style="font-family:'Inter',sans-serif; margin-bottom: 6px;">🤝 Danışan Eşleşme Başvuruları</h2>
      <p style="font-size:13px; color:var(--text-mid); margin-bottom:15px;">
        Koç Bulucu (koc_bul.html) sayfası üzerinden gelen öğrencilerin koç eşleşme taleplerini buradan yönetebilirsiniz.
      </p>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:var(--text);">
          <thead>
            <tr style="border-bottom:1px solid var(--border); text-align:left;">
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">ÖĞRENCİ BİLGİLERİ</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">SINAV / STİL</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">TALEP EDİLEN KOÇ</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">DURUM</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">TARİH</th>
              <th style="padding:10px; font-size:11px; color:var(--text-mid);">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            ${t.length===0?`
              <tr>
                <td colspan="6" style="padding:20px; text-align:center; color:var(--text-mid);">Henüz eşleşme başvurusu bulunmuyor.</td>
              </tr>
            `:t.map(s=>`
              <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:10px;">
                  <div style="font-weight:700;">${u(s.student_name)}</div>
                  <div style="font-size:11px; color:var(--text-mid);">${u(s.email)}</div>
                  <div style="font-size:11px; color:var(--text-mid);">${u(s.phone||"—")}</div>
                </td>
                <td style="padding:10px;">
                  <span style="background:var(--accent-dim); color:var(--accent); font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px;">${u(s.exam_profile)}</span>
                  <div style="font-size:11px; color:var(--text-mid); margin-top:4px;">Stil: ${u(s.style||"Belirtilmemiş")}</div>
                </td>
                <td style="padding:10px;">
                  ${s.matched_coach?`
                    <div style="font-weight:600; color:var(--accent2);">${u(s.matched_coach.full_name)}</div>
                    <div style="font-size:11px; color:var(--text-mid);">@${u(s.matched_coach.username)}</div>
                  `:'<span style="color:var(--text-dim);">Herhangi Biri</span>'}
                </td>
                <td style="padding:10px;">
                  <span style="background:${i[s.status]}; color:${o[s.status]}; font-size:11px; font-weight:700; padding:4px 10px; border-radius:99px; display:inline-block;">
                    ${a[s.status]||s.status}
                  </span>
                </td>
                <td style="padding:10px; font-size:11px; color:var(--text-mid);">
                  ${new Date(s.created_at).toLocaleDateString("tr-TR")}
                </td>
                <td style="padding:10px;">
                  <select onchange="updateMatchRequestStatus('${s.id}', this.value)" style="background:var(--surface3); border:1px solid var(--border); border-radius:6px; color:var(--text); padding:4px 8px; font-size:12px; outline:none; cursor:pointer;">
                    <option value="pending" ${s.status==="pending"?"selected":""}>⏳ Bekliyor</option>
                    <option value="matched" ${s.status==="matched"?"selected":""}>🤝 Eşleştirildi</option>
                    <option value="completed" ${s.status==="completed"?"selected":""}>✅ Tamamlandı</option>
                  </select>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}async function Io(e,t){const{error:n}=await b.from("match_requests").update({status:t}).eq("id",e);n?k("Durum güncellenirken hata: "+n.message):(k("Durum güncellendi ✓"),Ut())}async function _o(e){const t=r.students.find(s=>s.id===e);if(!t)return;const{data:n}=await b.from("student_speeds").select("*").eq("student_id",e),a={};(n||[]).forEach(s=>{a[`${s.exam_type}_${s.subject}`]=s.secs_per_question});const i=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];let o=document.getElementById("speedModal");o||(o=document.createElement("div"),o.id="speedModal",o.className="modal-bg",document.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&o.classList.remove("open")})),o.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('speedModal')">×</button>
    <h2>⚡ ${u(t.name)} — Soru Çözme Hızı</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Her ders için öğrencinin soru başına harcadığı saniyeyi girin. Görev eklerken süre otomatik hesaplanır.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
      ${i.map(({exam:s,sub:d})=>{const c=`${s}_${d}`,l=a[c]||180,p=Math.floor(l/60);return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">
          <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${s}</div>
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">${d}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" id="spd_${c}" value="${l}" min="10" max="600" step="5"
              style="width:70px;background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:13px;font-weight:700;color:var(--text);text-align:center">
            <span style="font-size:11px;color:var(--text-dim)">sn/soru</span>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${p>0?p+"dk ":""}</div>
        </div>`}).join("")}
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:16px" onclick="saveAllSpeeds('${e}')">Tümünü Kaydet</button>
  </div>`,Y("speedModal")}async function zo(e){const t=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];for(const{exam:n,sub:a}of t){const i=`${n}_${a}`,o=document.getElementById("spd_"+i);if(!o)continue;const s=parseInt(o.value)||180;await kn(e,n,a,s)}O("speedModal"),k("Hız ayarları kaydedildi ✓")}async function Bo(e){var s;const t=r.students.find(d=>d.id===e);if(!t)return;const n=`student_notes_${e}`,{data:a}=await b.from("platform_settings").select("value").eq("key",n).maybeSingle(),i=((s=a==null?void 0:a.value)==null?void 0:s.notes)||"";let o=document.getElementById("studentNotesModal");o||(o=document.createElement("div"),o.id="studentNotesModal",o.className="modal-bg",document.body.appendChild(o),o.addEventListener("click",d=>{d.target===o&&o.classList.remove("open")})),o.innerHTML=`<div class="modal">
    <button class="modal-close" onclick="cm('studentNotesModal')">×</button>
    <h2>📝 ${u(t.name)} — Notlar</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Öğrenciyle ilgili gözlemler, önemli bilgiler, hatırlatmalar…</p>
    <div class="field">
      <textarea id="studentNoteText" style="min-height:260px;font-size:13px;line-height:1.7;resize:vertical" placeholder="Örnek: Türkçe paragrafta hız sorunu var. Veli baskılı, motivasyon takip edilmeli. Son denemede geometri 4 yanlış...">${u(i)}</textarea>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveStudentNote('${e}')">Kaydet</button>
  </div>`,Y("studentNotesModal")}async function Mo(e){const t=document.getElementById("studentNoteText").value,n=`student_notes_${e}`;await b.from("platform_settings").upsert({key:n,value:{notes:t}},{onConflict:"key"}),k("Not kaydedildi ✓"),O("studentNotesModal")}function Ao(e){let t=document.getElementById("reportModal");t||(t=document.createElement("div"),t.id="reportModal",t.className="modal-bg",t.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('reportModal')">×</button>
      <h2>📄 Performans Raporu</h2>
      <input type="hidden" id="rpStuId">
      <div class="field"><label>Dönem</label>
        <select id="rpPeriod">
          <option value="weekly">Bu Hafta</option>
          <option value="monthly" selected>Bu Ay</option>
          <option value="custom">Tarih Aralığı</option>
        </select>
      </div>
      <div id="rpCustomDates" style="display:none">
        <div class="field-row">
          <div class="field"><label>Başlangıç</label><input type="date" id="rpStart"></div>
          <div class="field"><label>Bitiş</label><input type="date" id="rpEnd"></div>
        </div>
      </div>
      <div class="field"><label>Koç Notu (isteğe bağlı)</label>
        <textarea id="rpNote" placeholder="Bu dönem için genel değerlendirmenizi yazın..." style="min-height:90px"></textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="previewReport()">👁 Önizle</button>
          <button class="btn btn-accent" style="flex:1;justify-content:center" onclick="generatePDF()">⬇️ PDF İndir</button>
        </div>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;background:#25d366;color:#fff;border:none;gap:6px" onclick="sendWhatsAppReport()">💬 Veliye WhatsApp Gönder</button>
      </div>
    </div>`,document.body.appendChild(t),t.addEventListener("click",i=>{i.target===t&&t.classList.remove("open")}),document.getElementById("rpPeriod").addEventListener("change",function(){document.getElementById("rpCustomDates").style.display=this.value==="custom"?"":"none"})),document.getElementById("rpStuId").value=e;const n=new Date,a=new Date(n.getFullYear(),n.getMonth(),1);document.getElementById("rpStart").value=H(a),document.getElementById("rpEnd").value=H(n),document.getElementById("rpNote").value="",Y("reportModal")}function Yn(){const e=document.getElementById("rpPeriod").value,t=new Date;if(e==="weekly"){const n=V(0,0);return{start:H(n),end:H(U(n,6))}}else return e==="monthly"?{start:H(new Date(t.getFullYear(),t.getMonth(),1)),end:H(t)}:{start:document.getElementById("rpStart").value,end:document.getElementById("rpEnd").value}}function Gt(e,t=!1){var B,D,T,_;const n=r.students.find(z=>z.id===e);if(!n)return"";const{start:a,end:i}=Yn(),o=document.getElementById("rpNote").value.trim(),s=((B=r.workspace)==null?void 0:B.brand_name)||"Rostrum Akademi",d=((D=r.workspace)==null?void 0:D.brand_color)||"#f0a500",c=((T=h.dbUser)==null?void 0:T.full_name)||"Koç",l=[],p=new Date(a);for(;H(p)<=i;){const z=`${e}_${H(p)}`;(r.tasks[z]||[]).forEach(E=>l.push({...E,date:H(p)})),p.setDate(p.getDate()+1)}const m=l.length,g=l.filter(z=>z.done).length,x=m>0?Math.round(g/m*100):0,I=l.filter(z=>z.done).reduce((z,E)=>z+Number(E.duration||0),0),f={};l.forEach(z=>{const E=z.subject||"Diğer";f[E]||(f[E]={total:0,done:0}),f[E].total++,z.done&&f[E].done++});const y=r.exams.filter(z=>z.studentId===e&&z.date>=a&&z.date<=i).sort((z,E)=>z.date.localeCompare(E.date)),v=r.appointments.filter(z=>z.studentId===e&&z.date>=a&&z.date<=i).sort((z,E)=>z.date.localeCompare(E.date)),$=`${new Date(a+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})} – ${new Date(i+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}`;let S="";if(y.length>1){const z=Math.max(...y.map(w=>(EXAM_DEFS[w.type]||[]).reduce((A,C)=>{var N;return A+Number(((N=w.nets)==null?void 0:N[C])||0)},0)),1),E=400,M=80,j=Math.min(40,(E-20)/y.length-4);S=`<svg width="${E}" height="${M+30}" style="overflow:visible">
      ${y.map((w,A)=>{const C=(EXAM_DEFS[w.type]||[]).reduce((K,R)=>{var F;return K+Number(((F=w.nets)==null?void 0:F[R])||0)},0),N=Math.max(Math.round(C/z*(M-10)),4),P=10+A*((E-20)/y.length);return`<rect x="${P}" y="${M-N}" width="${j}" height="${N}" rx="3" fill="${d}" opacity="0.85"/>
          <text x="${P+j/2}" y="${M-N-4}" text-anchor="middle" font-size="10" fill="#333">${C.toFixed(0)}</text>
          <text x="${P+j/2}" y="${M+14}" text-anchor="middle" font-size="9" fill="#666">${u(w.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim()||String(A+1))}</text>`}).join("")}
    </svg>`}return`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;font-size:13px;line-height:1.5;}
  .page{max-width:800px;margin:0 auto;padding:${t?"30px":"20px 30px"};}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:18px;border-bottom:3px solid ${d};margin-bottom:24px;}
  .brand{font-size:22px;font-weight:800;color:${d};letter-spacing:-0.5px;}
  .brand-sub{font-size:11px;color:#888;margin-top:3px;}
  .report-title{text-align:right;}
  .report-title h1{font-size:18px;font-weight:700;color:#1a1a1a;}
  .report-title p{font-size:11px;color:#888;margin-top:3px;}
  .student-hero{background:linear-gradient(135deg,${d}15,${d}05);border:1.5px solid ${d}30;border-radius:12px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;gap:16px;}
  .stu-avatar{width:52px;height:52px;border-radius:12px;background:${d};color:#fff;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .stu-name{font-size:20px;font-weight:800;}
  .stu-target{font-size:12px;color:#666;margin-top:3px;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
  .stat-box{background:#f8f8f8;border:1px solid #e8e8e8;border-radius:10px;padding:12px 14px;text-align:center;}
  .stat-box .val{font-size:26px;font-weight:800;color:${d};}
  .stat-box .lbl{font-size:10px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:.5px;}
  .section{margin-bottom:20px;}
  .section-title{font-size:14px;font-weight:700;color:${d};margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid ${d}20;display:flex;align-items:center;gap:6px;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th{background:${d}15;color:#333;font-weight:700;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.4px;}
  td{padding:7px 10px;border-bottom:1px solid #f0f0f0;}
  tr:last-child td{border-bottom:none;}
  .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;}
  .badge-green{background:#e8faf3;color:#16a34a;}
  .badge-yellow{background:#fef9ec;color:#ca8a04;}
  .badge-red{background:#fef2f2;color:#dc2626;}
  .prog-bar{height:8px;background:#eee;border-radius:99px;overflow:hidden;margin-top:4px;}
  .prog-fill{height:100%;border-radius:99px;background:${d};}
  .note-box{background:#fffbeb;border:1.5px solid ${d}40;border-radius:10px;padding:14px 16px;}
  .note-box .note-header{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:${d};margin-bottom:6px;}
  .footer{margin-top:30px;padding-top:14px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:10px;color:#aaa;}
  .progress-circle{position:relative;width:64px;height:64px;flex-shrink:0;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.no-print{display:none!important;}}
</style>
</head>
<body>
<div class="page">
  <!-- HEADER -->
  <div class="header">
    <div>
      <div class="brand">${u(s)}</div>
      <div class="brand-sub">Koç: ${u(c)}</div>
    </div>
    <div class="report-title">
      <h1>Performans Raporu</h1>
      <p>${$}</p>
      <p>Oluşturulma: ${new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</p>
    </div>
  </div>

  <!-- ÖĞRENCİ -->
  <div class="student-hero">
    <div class="stu-avatar">${n.name[0]}</div>
    <div>
      <div class="stu-name">${u(n.name)}</div>
      <div class="stu-target">${u(n.target)}</div>
      <div style="margin-top:8px">
        <div style="font-size:11px;color:#666;margin-bottom:3px">Genel İlerleme %${n.progress}</div>
        <div class="prog-bar" style="width:200px"><div class="prog-fill" style="width:${n.progress}%"></div></div>
      </div>
    </div>
  </div>

  <!-- ÖZET İSTATİSTİKLER -->
  <div class="stats-grid">
    <div class="stat-box"><div class="val">${m}</div><div class="lbl">Toplam Görev</div></div>
    <div class="stat-box"><div class="val" style="color:#16a34a">${g}</div><div class="lbl">Tamamlanan</div></div>
    <div class="stat-box"><div class="val">%${x}</div><div class="lbl">Tamamlanma</div></div>
    <div class="stat-box"><div class="val">${Math.round(I/60)}</div><div class="lbl">Çalışma (saat)</div></div>
  </div>

  <!-- DERS BAZINDA ÇALIŞMA -->
  ${Object.keys(f).length>0?`
  <div class="section">
    <div class="section-title">📚 Ders Bazında Çalışma</div>
    <table>
      <thead><tr><th>Ders</th><th>Toplam</th><th>Tamamlanan</th><th>Oran</th><th></th></tr></thead>
      <tbody>
        ${Object.entries(f).sort((z,E)=>E[1].total-z[1].total).map(([z,E])=>{const M=Math.round(E.done/E.total*100),j=M>=80?"badge-green":M>=50?"badge-yellow":"badge-red";return`<tr>
            <td><strong>${u(z)}</strong></td>
            <td>${E.total}</td>
            <td>${E.done}</td>
            <td><span class="badge ${j}">%${M}</span></td>
            <td style="width:120px"><div class="prog-bar"><div class="prog-fill" style="width:${M}%"></div></div></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- DENEMELER -->
  ${y.length>0?`
  <div class="section">
    <div class="section-title">📊 Deneme Sonuçları</div>
    ${S?`<div style="margin-bottom:16px;padding:12px;background:#f8f8f8;border-radius:8px">${S}</div>`:""}
    <table>
      <thead><tr><th>Sınav</th><th>Tarih</th><th>Tür</th>${(EXAM_DEFS[(_=y[0])==null?void 0:_.type]||[]).map(z=>`<th>${z}</th>`).join("")}<th>Toplam</th></tr></thead>
      <tbody>
        ${y.map(z=>{const E=EXAM_DEFS[z.type]||[],M=E.reduce((j,w)=>{var A;return j+Number(((A=z.nets)==null?void 0:A[w])||0)},0).toFixed(1);return`<tr>
            <td><strong>${u(z.name)}</strong></td>
            <td>${new Date(z.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</td>
            <td>${u(z.type)}</td>
            ${E.map(j=>{var A;const w=Number(((A=z.nets)==null?void 0:A[j])||0);return`<td><span class="badge ${w>=20?"badge-green":w>=12?"badge-yellow":"badge-red"}">${w}</span></td>`}).join("")}
            <td><strong>${M}</strong></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- RANDEVULAR -->
  ${v.length>0?`
  <div class="section">
    <div class="section-title">📅 Görüşmeler</div>
    <table>
      <thead><tr><th>Tarih</th><th>Saat</th><th>Tür</th><th>Süre</th></tr></thead>
      <tbody>
        ${v.map(z=>`<tr>
          <td>${new Date(z.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"short",day:"numeric",month:"short"})}</td>
          <td>${z.time}</td>
          <td>${u(z.type)}</td>
          <td>${z.duration} dk</td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- KOÇ NOTU -->
  ${o?`
  <div class="section">
    <div class="note-box">
      <div class="note-header">Koç Değerlendirmesi</div>
      <div style="font-size:13px;line-height:1.7;color:#333">${u(o).replace(/\n/g,"<br>")}</div>
      <div style="margin-top:10px;font-size:11px;color:#888">— ${u(c)}</div>
    </div>
  </div>`:""}

  <!-- FOOTER -->
  <div class="footer">
    <span>${u(s)} · ${u(c)}</span>
    <span>${u(n.name)} · ${$}</span>
    <span>Rostrum Akademi Platformu</span>
  </div>
</div>
</body>
</html>`}function Do(){const e=document.getElementById("rpStuId").value,t=Gt(e,!0),n=window.open("","_blank","width=900,height=700");n.document.write(t),n.document.close()}function Lo(){const e=document.getElementById("rpStuId").value;r.students.find(a=>a.id===e);const t=Gt(e,!1),n=window.open("","_blank");n.document.write(t),n.document.close(),setTimeout(()=>{n.focus(),n.print()},500),O("reportModal"),k('PDF oluşturuluyor — "PDF olarak kaydet" seçin')}async function Co(){const e=document.getElementById("rpStuId").value,t=r.students.find(s=>s.id===e);if(!t)return;const n=`${window.location.origin}/api/generate-pdf-report?studentId=${e}`,a=`Merhaba, ${t.name} isimli öğrencimizin bu dönemki performans ve gelişim raporu hazırlandı. Aşağıdaki bağlantıdan raporu detaylıca görüntüleyebilirsiniz:

🔗 ${n}`,o=`https://api.whatsapp.com/send?text=${encodeURIComponent(a)}`;window.open(o,"_blank"),O("reportModal"),k("WhatsApp yönlendirmesi açıldı ✓")}function jo(){let e=document.getElementById("weeklyPDFModal");e||(e=document.createElement("div"),e.id="weeklyPDFModal",e.className="modal-bg",e.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('weeklyPDFModal')">×</button>
      <h2>🖨️ Haftalık Program PDF</h2>
      <div class="field">
        <label>Koç Notu (isteğe bağlı)</label>
        <textarea id="pdfNote" placeholder="Bu haftaki programla ilgili notunuzu ekleyin..." style="min-height:90px"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px" onclick="generateWeeklyPDF()">PDF Oluştur →</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pdfNote").value="",Y("weeklyPDFModal")}function Po(){const e=document.getElementById("pdfNote").value.trim();O("weeklyPDFModal"),Kn(r.activeStuId,e)}function Kn(e,t){var z,E;const n=r.students.find(M=>M.id===e);if(!n)return;const a=(n==null?void 0:n.weekStart)??0,i=V(r.weekOffset,a),o=U(i,6),s=((z=r.workspace)==null?void 0:z.brand_name)||"Rostrum Akademi",d=((E=r.workspace)==null?void 0:E.brand_color)||"#f0a500",c=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],l=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],p={deneme:"#f59e0b",soru:"#3b82f6",konu:"#10b981",diger:"#8b5cf6"},m={deneme:"#fffbeb",soru:"#eff6ff",konu:"#f0fdf4",diger:"#faf5ff"},g={deneme:"Deneme",soru:"Soru Bankası",konu:"Konu Anlatımı",diger:"Diğer"},x=H(new Date);let I=0,f=0,y=0,v="";for(let M=0;M<7;M++){const j=U(i,M),w=H(j),A=r.tasks[`${e}_${w}`]||[];I+=A.length,f+=A.filter(R=>R.done).length,y+=A.reduce((R,F)=>R+Number(F.duration||0),0);const C=w===x,N=c[(a+M)%7].slice(0,3).toUpperCase(),P=A.reduce((R,F)=>R+Number(F.duration||0),0),K=A.map(R=>{const F=p[R.type]||"#94a3b8",J=m[R.type]||"#f8fafc",W=g[R.type]||"Diğer";return`<div style="margin-bottom:5px;border-radius:7px;background:${J};border:1px solid ${F}28;border-left:3px solid ${F}">
        <div style="padding:6px 8px">
          <div style="font-size:7.5px;font-weight:800;color:${F};text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${W}${R.exam?` · ${R.exam}`:""}</div>
          <div style="font-size:10px;font-weight:700;color:#111;line-height:1.3">${u(R.subject)}</div>
          ${R.note?`<div style="font-size:7.5px;color:#999;margin-top:2px;line-height:1.4;word-break:break-word">${u(R.note)}</div>`:""}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
            <span style="display:inline-flex;align-items:center;gap:4px;font-size:8px;color:#bbb">
              <span style="display:inline-block;width:11px;height:11px;border:1.5px solid #d0cec9;border-radius:3px;flex-shrink:0"></span>
              ${R.duration} dk
            </span>
            ${R.done?'<span style="font-size:8px;font-weight:700;color:#22c55e">✓ Tamam</span>':""}
          </div>
        </div>
      </div>`}).join("");v+=`<div style="padding:0 5px;border-right:${M<6?"1px solid #ede9e3":"none"}">
      <div style="padding-bottom:7px;margin-bottom:7px;border-bottom:2px solid ${C?d:"#ede9e3"}">
        <div style="font-size:8px;font-weight:800;color:${C?d:"#bbb"};text-transform:uppercase;letter-spacing:.8px">${N}</div>
        <div style="font-size:22px;font-weight:900;color:${C?d:"#111"};line-height:1;margin-top:1px">${j.getDate()}</div>
        ${P>0?`<div style="font-size:7px;color:#ccc;margin-top:2px">${P}dk · ${A.length}g</div>`:""}
      </div>
      ${A.length===0?'<div style="font-size:13px;color:#e8e4dc;text-align:center;padding:14px 0">—</div>':K}
    </div>`}const $=I>0?Math.round(f/I*100):0,S=$>=80?"#22c55e":$>=50?d:"#f59e0b",B=n.name.split(" ").map(M=>M[0]).join("").slice(0,2).toUpperCase();let D="";for(let M=0;M<7;M++){const j=U(i,M),w=H(j),A=r.tasks[`${e}_${w}`]||[];if(A.length===0)continue;const C=c[(a+M)%7],N=A.map((P,K)=>{const R=p[P.type]||"#94a3b8",F=g[P.type]||"Diğer";return`<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #eee">
        <div style="display:flex;align-items:baseline;gap:8px">
          <span style="font-size:12px;font-weight:800;color:${R}">${K+1}. ${F}${P.exam?` (${P.exam})`:""}</span>
          <span style="font-size:12px;font-weight:700;color:#111">${u(P.subject)}</span>
          <span style="font-size:11px;color:#666;margin-left:auto">${P.duration} dk</span>
        </div>
        ${P.note?`<div style="font-size:10px;color:#555;margin-top:4px;padding-left:14px;border-left:2px solid ${R}40;line-height:1.5">${u(P.note).replace(/\n/g,"<br>")}</div>`:""}
      </div>`}).join("");D+=`<div style="margin-bottom:24px">
      <h3 style="font-size:14px;font-weight:800;color:${d};border-bottom:2px solid ${d}40;padding-bottom:4px;margin-bottom:10px">${j.getDate()} ${l[j.getMonth()]} - ${C}</h3>
      <div>${N}</div>
    </div>`}const T=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',-apple-system,Arial,sans-serif;background:#fff;color:#111;}
    @media print{
      .no-print{display:none!important;}
      @page{size:A4 landscape;margin:5mm;}
      .page-break{page-break-before:always;}
    }
  </style>
  </head><body>

  <!-- ACCENT BAR -->
  <div style="height:5px;background:${d}"></div>

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px 11px;border-bottom:1px solid #ede9e3">
    <div>
      <div style="font-size:18px;font-weight:900;color:${d};letter-spacing:-.3px">${u(s)}</div>
      <div style="font-size:9.5px;color:#bbb;margin-top:2px;letter-spacing:.2px">Haftalık Çalışma Programı</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:800;color:#111">${u(n.name)}</div>
        ${n.target?`<div style="font-size:8.5px;color:#aaa;margin-top:1px">🎯 ${u(n.target)}</div>`:""}
        <div style="font-size:8.5px;color:#bbb;margin-top:1px">${i.getDate()} ${l[i.getMonth()]} – ${o.getDate()} ${l[o.getMonth()]} ${o.getFullYear()}</div>
      </div>
      <div style="width:40px;height:40px;border-radius:10px;background:${d};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;letter-spacing:-.5px;flex-shrink:0">${B}</div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div style="display:flex;align-items:center;gap:0;padding:7px 18px;background:#faf9f8;border-bottom:1px solid #ede9e3">
    <div style="display:flex;align-items:center;gap:18px">
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:${d};letter-spacing:-.5px">${I}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Görev</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#22c55e;letter-spacing:-.5px">${f}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Tamamlanan</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#3b82f6;letter-spacing:-.5px">${Math.round(y/60)}<span style="font-size:10px">sa</span></div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Süre</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:90px;height:7px;background:#ede9e3;border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${$}%;background:${S};border-radius:99px"></div>
        </div>
        <div style="font-size:14px;font-weight:900;color:${S};min-width:36px">%${$}</div>
      </div>
    </div>
  </div>

  <!-- WEEK GRID -->
  <div style="display:grid;grid-template-columns:repeat(7,1fr);padding:10px 8px 6px">${v}</div>

  <!-- COACH NOTE -->
  ${t?`<div style="margin:2px 14px 10px;padding:10px 14px;background:${d}0d;border-left:3px solid ${d};border-radius:0 8px 8px 0">
    <div style="font-size:8px;font-weight:800;color:${d};text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">Koç Notu</div>
    <div style="font-size:10px;color:#444;line-height:1.6">${u(t)}</div>
  </div>`:""}

  <!-- FOOTER -->
  <div style="display:flex;align-items:center;gap:14px;padding:7px 16px;border-top:1px solid #ede9e3;background:#faf9f8">
    <span style="font-size:8px;color:#ccc;margin-right:4px;font-weight:600">TÜRLER:</span>
    ${Object.entries(g).map(([M,j])=>`<div style="display:flex;align-items:center;gap:4px;font-size:8.5px;color:#888"><div style="width:8px;height:8px;border-radius:2px;background:${p[M]}"></div>${j}</div>`).join("")}
    <div style="margin-left:auto;font-size:8px;color:#ccc">${u(s)} · ${new Date().toLocaleDateString("tr-TR")}</div>
  </div>

  <!-- PRINT BUTTON -->
  <div class="no-print" style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-top:1px solid #ede9e3">
    <button onclick="window.print()" style="background:${d};color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.2px">🖨️ PDF İndir / Yazdır</button>
    <span style="font-size:11px;color:#bbb">Tarayıcı ayarlarından "Arka plan grafikleri"ni aktif edin</span>
  </div>

  <!-- PAGE 2: DETAILED LIST VIEW -->
  ${D?`
  <div class="page-break" style="padding:40px 30px;max-width:1000px;margin:0 auto">
    <div style="font-size:18px;font-weight:900;color:${d};margin-bottom:20px;border-bottom:2px solid ${d};padding-bottom:10px">📋 Günlük Detaylı Görev Açıklamaları</div>
    ${D}
  </div>`:""}

  </body></html>`,_=window.open("","_blank","width=1200,height=850");_.document.write(T),_.document.close(),setTimeout(()=>_.focus(),300)}function Ho(){const e="abcdefghijklmnopqrstuvwxyz",t=()=>Array.from({length:3},()=>e[Math.floor(Math.random()*e.length)]).join("");return`https://meet.google.com/${t()}-${t()}-${t()}`}function Ro(){return`https://zoom.us/j/${Math.floor(Math.random()*9e9)+1e9}`}function No(e){navigator.clipboard.writeText(e).then(()=>k("Link kopyalandı ✓")).catch(()=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),k("Link kopyalandı ✓")})}const On=[{name:"Altın",val:"#f0a500",dim:"rgba(240,165,0,.12)"},{name:"Turuncu",val:"#e8622a",dim:"rgba(232,98,42,.12)"},{name:"Mavi",val:"#4da6ff",dim:"rgba(77,166,255,.12)"},{name:"Yeşil",val:"#3ecf8e",dim:"rgba(62,207,142,.12)"},{name:"Mor",val:"#c084fc",dim:"rgba(192,132,252,.12)"},{name:"Pembe",val:"#f472b6",dim:"rgba(244,114,182,.12)"},{name:"Kırmızı",val:"#ff5c5c",dim:"rgba(255,92,92,.12)"},{name:"Turkuaz",val:"#06b6d4",dim:"rgba(6,182,212,.12)"}];function Fn(){try{const e=JSON.parse(localStorage.getItem("ba_theme")||"{}");e.theme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme"),e.accent&&qn(e.accent,e.accentDim,!1)}catch{}}function qn(e,t,n=!0){if(document.documentElement.style.setProperty("--accent",e),document.documentElement.style.setProperty("--accent-dim",t||"rgba(240,165,0,.12)"),n)try{const a=JSON.parse(localStorage.getItem("ba_theme")||"{}");a.accent=e,a.accentDim=t,localStorage.setItem("ba_theme",JSON.stringify(a))}catch{}}function Yo(e){e==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme");try{const t=JSON.parse(localStorage.getItem("ba_theme")||"{}");t.theme=e,localStorage.setItem("ba_theme",JSON.stringify(t))}catch{}document.querySelectorAll(".theme-btn").forEach(t=>{const n=t.dataset.theme===e;t.style.background=n?"var(--accent-dim)":"",t.style.borderColor=n?"var(--accent)":"",t.style.color=n?"var(--accent)":""})}function Ko(){let e=document.getElementById("themePanel");if(e){e.remove();return}e=document.createElement("div"),e.id="themePanel";const t=document.documentElement.getAttribute("data-theme")!=="light";e.style.cssText="position:fixed;top:60px;right:12px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:18px;z-index:300;box-shadow:var(--shadow-lg);min-width:230px;animation:fadeUp .2s ease",e.innerHTML=`
    <div style="font-family:'Inter',sans-serif;font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text)">🎨 Tema Ayarları</div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Mod</div>
    <div style="display:flex;gap:6px;margin-bottom:16px">
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="dark" onclick="setTheme('dark')" style="${t?"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)":""}">🌙 Karanlık</button>
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="light" onclick="setTheme('light')" style="${t?"":"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)"}">☀️ Aydınlık</button>
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Accent Rengi</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px">
      ${On.map(n=>`<div onclick="applyAccent('${n.val}','${n.dim}');document.getElementById('themePanel').remove()" title="${n.name}"
        style="width:28px;height:28px;border-radius:8px;background:${n.val};cursor:pointer;transition:transform .1s"
        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''"></div>`).join("")}
    </div>
    <button onclick="document.getElementById('themePanel').remove()" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text-mid);border-radius:8px;padding:7px;font-family:inherit;font-size:12px;cursor:pointer">Kapat</button>`,document.body.appendChild(e),setTimeout(()=>document.addEventListener("click",function n(a){!e.contains(a.target)&&!a.target.closest("[onclick*=openThemePanel]")&&(e.remove(),document.removeEventListener("click",n))},!0),150)}let vt=[],wt=!1;function Un(){const e=document.getElementById("aiChatBubble"),t=document.querySelector(".ai-header-name"),n=document.getElementById("aiMessages");if(!e||!t||!n)return;vt=[],n.innerHTML=`
    <div class="ai-welcome">
      <div class="ai-welcome-emoji">🎓</div>
      <div class="ai-welcome-title"></div>
      <div class="ai-welcome-sub"></div>
      <div class="ai-quick-btns"></div>
    </div>`;const a=n.querySelector(".ai-welcome"),i=a.querySelector(".ai-welcome-title"),o=a.querySelector(".ai-welcome-sub"),s=a.querySelector(".ai-quick-btns");h.role==="coach"||h.role==="developer"?(e.title="Yapay Zeka Koç Asistanı",t.textContent="Yapay Zeka Koç Asistanı",i.textContent="Merhaba Hocam! Ben Koç Asistanınız",o.textContent="Öğrenci analizleri, veri okuma, ders çalışma programı taslakları hazırlama ve pedagojik konularda size yardımcı olabilirim.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Seçili öğrencinin genel durum analizini yap')">📊 Öğrenci Analizi</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Pedagojik motivasyon teknikleri öner')">💡 Pedagojik Öneri</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zorlanan bir öğrenci için haftalık program şablonu oluştur')">📋 Program Şablonu</button>
    `):h.role==="parent"?(e.title="Yapay Zeka Veli Bilgilendirme Asistanı",t.textContent="Yapay Zeka Veli Asistanı",i.textContent="Merhaba! Ben Veli Asistanıyım",o.textContent="Çocuğunuzun ders çalışma durumu, deneme netleri ve evde ona nasıl destek olabileceğiniz konularında bilgi alabilirsiniz.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çocuğumun bu haftaki gelişimini özetle')">📊 Gelişim Özeti</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Evde verimli ders çalışma ortamı nasıl sağlanır?')">🏠 Ev Ortamı</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Sınav stresiyle başa çıkmak için veli olarak ne yapmalıyım?')">🧘 Stres Yönetimi</button>
    `):(e.title="Yapay Zeka Ders Asistanı",t.textContent="Yapay Zeka Ders Asistanı",i.textContent="Merhaba! Ben Ders Asistanın (Yapay Zeka)",o.textContent="7/24 anlık soru çözümü, konu anlatımı, özet çıkarma ve mini pratik sınav konularında sana yardımcı olan mekanik bir asistanım. Ben bir yapay zekayım ve koçunun yerini alamam; duygusal veya motivasyonel konularda koçuna danışmalısın.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çözemediğim bir Matematik/Fen sorusu var. Sokratik tarzda, adım adım ipuçları vererek çözmeme yardım eder misin?')">📝 Çözemediğim Soru Var</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bir konunun özetini çıkarmak istiyorum. Hangi ders ve konudan özet çıkarmak istediğimi sorup yardımcı olur musun?')">📖 Konu Özeti Çıkar</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zayıf olduğum konular üzerinde çalışıp pratik yapmak istiyorum. Hangi derslerden yardıma ihtiyacım olduğunu sorup pratik yapalım.')">🎯 Zayıf Konuları Çalış</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bana seçtiğim bir konudan 3 soruluk hızlı bir mini quiz yapar mısın? Soruları tek tek sor.')">⚡ Hızlı Sınav Yap</button>
    `)}function Oo(){const e=document.getElementById("aiChatPanel"),t=document.getElementById("aiChatBubble");if(e.classList.contains("open"))e.classList.remove("open"),t.style.display="flex";else{e.classList.add("open"),t.style.display="none";const n=document.getElementById("aiMessages");n.scrollTop=n.scrollHeight,document.getElementById("aiInput").focus()}}function Fo(e){document.getElementById("aiInput").value=e,Gn()}function It(){var t;const e={};try{const n=r.students.find(s=>s.id===r.activeStuId);n&&(e.studentName=n.name,e.target=n.target||""),h.role==="parent"&&h.childName&&(e.studentName=h.childName);const a=(r.exams||[]).filter(s=>s.studentId===r.activeStuId).slice(-5);a.length&&(e.recentExams=a.map(s=>({name:s.type+" "+(s.name||""),date:s.date||"",nets:s.nets||{}})));let i=[];if(Object.entries(r.tasks||{}).forEach(([s,d])=>{s.startsWith(r.activeStuId+"_")&&(i=i.concat(d))}),i.length){const s=i.filter(d=>d.done).length;e.taskCompletionRate=Math.round(s/i.length*100),e.weeklyTaskCount=i.length}const o=Object.keys(EXAM_DEFS);a.length&&(e.examProfile=((t=a[0])==null?void 0:t.type)||o[0])}catch(n){console.warn("AI context error:",n)}return e}function ke(e,t){vt.push({role:e,content:t});const n=document.getElementById("aiMessages"),a=n.querySelector(".ai-welcome");a&&a.remove();const i=new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),o=document.createElement("div");o.className=`ai-msg ${e}`,o.innerHTML=`${u(t).replace(/\n/g,"<br>")}<div class="ai-msg-time">${i}</div>`,n.appendChild(o),n.scrollTop=n.scrollHeight}async function Gn(){if(wt)return;const e=document.getElementById("aiInput"),t=e.value.trim();if(t){e.value="",ke("user",t),wt=!0,document.getElementById("aiTyping").classList.add("show"),document.getElementById("aiSendBtn").disabled=!0;try{const n=It(),a=h.role||"student",i=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1","/api/ai-chat"),o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:vt.slice(-10),context:n,userRole:a})});if(o.ok){const s=await o.json();ke("assistant",s.reply||"Yanıt alınamadı.")}else{const s=await Pe(t,n,a);ke("assistant",s)}}catch(n){console.error("AI error:",n);try{const a=It(),i=await Pe(t,a,h.role||"student");ke("assistant",i)}catch{const i=localStorage.getItem("gemini_api_key");ke("assistant","🔒 Bu özellik ileride aktif olacaktır. Yakında kullanıma açılacak.")}}finally{wt=!1,document.getElementById("aiTyping").classList.remove("show"),document.getElementById("aiSendBtn").disabled=!1}}}let $t=null;async function Wn(e){try{const t=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${e}`);if(!t.ok)return null;const a=(await t.json()).models||[];let i=a.find(o=>o.name.toLowerCase().includes("flash")&&o.supportedGenerationMethods.includes("generateContent"));if(i||(i=a.find(o=>o.supportedGenerationMethods.includes("generateContent"))),i)return i.name.replace("models/","")}catch(t){console.warn("Auto-detect model failed:",t)}return null}async function Pe(e,t,n){var p,m,g,x,I,f;let a=localStorage.getItem("gemini_api_key");if(!a)try{const{data:y}=await b.from("platform_settings").select("value").eq("key","ai_settings").maybeSingle();y&&y.value&&y.value.gemini_api_key&&(a=y.value.gemini_api_key)}catch(y){console.warn("DB Gemini API key load error:",y)}const i=a;if(!i)throw new Error("API anahtarı eksik.");let o="gemini-1.5-flash";if(i)if($t)o=$t;else{const y=await Wn(i);y&&($t=y,o=y,console.log("[Gemini API] Otomatik model tespiti başarılı:",o))}let s=`Sen "Rostrum Akademi Yapay Zeka Asistanı"sın. Türkiye eğitim sistemine (YKS, LGS) hakim, rolüne göre öğrencilere, velilere veya koçlara destek veren bir yapay zekasın.

Rostrum Akademi İşleyişi, Üyelik ve Fiyatlandırma Bilgileri:
1. Kayıt olan tüm koçlara 14 gün ücretsiz deneme süresi tanımlanır. Bu süre bitiminde panel kilitlenir.
2. Otomatik ödeme/kredi kartı altyapısı yoktur; paket satın alma, ödeme ve lisans uzatma işlemleri tamamen manuel olarak yürütülür.
3. Kullanıcılar paket satın almak, deneme sürelerini uzatmak veya üyeliklerini aktif etmek için Kurucu Emin Ceylan (ceylanemin1928@gmail.com) ile iletişime geçmelidir.
4. Destek panelinde bulunan "Kurucuya / Destek Ekibine Yaz" seçeneği ile doğrudan kurucu ekibe mesaj gönderebilir ve bu ekran üzerinden onunla canlı yazışabilirler.
5. Güncel Paket Fiyatları:
   - Başlangıç Paketi (Starter): Aylık 299 TL
   - Koç Pro Paketi (Pro): Aylık 599 TL
   - Kurumsal Paket (Enterprise): Aylık 1499 TL`;n==="parent"?s+=`
VELİ MODU: Veliye saygılı ve güven verici konuş. Çocuğun durumunu yapıcı aktar.`:n==="student"?s+=`
ÖĞRENCİ MODU (YAPAY ZEKA DERS ASİSTANI):
1. Kendini her zaman net bir şekilde bir Yapay Zeka Ders Asistanı (makine) olarak tanıt. Asla insanmış gibi davranma. "Ben senin koçunum", "Ben senin rehberinim" deme.
2. Kesinlikle duygusal veya motivasyonel koçluk yapma. Öğrencilere "Seni anlıyorum", "Seninle gurur duyuyorum" gibi duygusal/samimi ifadeler kullanma. Öğrenci motivasyon veya program önerisi isterse, bunu yapamayacağını belirt ve: "Ben sadece akademik konularda yardımcı olabilecek mekanik bir yapay zekayım. Bu konuyu kendi koçunla görüşmelisin." diyerek koçuna yönlendir.
3. Sokratik Yöntemi Kullan: Öğrenci bir soruyu çözemediğini söylediğinde veya yardım istediğinde doğrudan cevabı veya tüm adımları hemen yazma! Adım adım ilerle, ipucu ver, öğrenciye açıklayıcı sorular sorarak onun doğru cevabı bulmasını sağla.
4. Sadece mekanik destek ver: Soru çözümü, konu anlatımı, özet çıkarma ve mini testler yap. Ders programı oluşturmayı kesinlikle reddet ve koçuna yönlendir.`:n==="coach"&&(s+=`
KOÇ MODU (YAPAY ZEKA COPILOT):
Karşındaki kişi bir Eğitim Koçudur. Ona profesyonel bir meslektaş gibi hitap et (Hocam, Meslektaşım vb.). Seçili olan öğrenci hakkında veri odaklı analizler, tavsiyeler ve pedagojik öneriler sun.`),n==="coach"&&t.studentName?s+=`
Şu anda seçili olan ve üzerinde çalışılan öğrenci: ${t.studentName}`:t.studentName&&(s+=`
Öğrenci: ${t.studentName}`),t.recentExams&&(s+=`
Son denemeler: ${JSON.stringify(t.recentExams)}`),t.taskCompletionRate!==void 0&&(s+=`
Görev tamamlama: %${t.taskCompletionRate}`),t.target&&(s+=`
Hedef: ${t.target}`);const d=[{role:"user",parts:[{text:s}]},{role:"model",parts:[{text:"Anladım! Rostrum Akademi Yapay Zeka Asistanı olarak hazırım."}]},...vt.slice(-8).map(y=>({role:y.role==="user"?"user":"model",parts:[{text:y.content}]}))],c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${o}:generateContent?key=${i}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:d,generationConfig:{temperature:.7,maxOutputTokens:1500}})});if(!c.ok){let y=`HTTP ${c.status}`;try{const v=await c.json();(p=v==null?void 0:v.error)!=null&&p.message&&(y=v.error.message)}catch{}throw new Error(y)}const l=await c.json();return((f=(I=(x=(g=(m=l==null?void 0:l.candidates)==null?void 0:m[0])==null?void 0:g.content)==null?void 0:x.parts)==null?void 0:I[0])==null?void 0:f.text)||"Yanıt üretilemedi."}let Wt="";async function qo(e){const t=r.students.find(a=>a.id===e);if(!t)return;const n=document.getElementById("aiCopilotBtn");n.disabled=!0,n.textContent="⌛ Analiz Ediliyor ve Taslak Oluşturuluyor...";try{const a=V(0,t.weekStart||0);let i=0,o=0,s=0;for(let $=0;$<7;$++){const S=r.tasks[`${t.id}_${H(U(a,$))}`]||[];i+=S.length,o+=S.filter(B=>B.done).length,s+=S.reduce((B,D)=>B+Number(D.duration||0),0)}const d=i>0?Math.round(o/i*100):0,l=(r.exams||[]).filter($=>$.studentId===e).slice(-5).map($=>({name:$.type+" "+($.name||""),date:$.date||"",nets:$.nets||{}})),p={};(r.studentSpeeds||[]).filter($=>$.student_id===e).forEach($=>{p[`${$.exam_type}_${$.subject}`]=$.secs_per_question});const m=`Lütfen şu öğrenci için haftalık durum analizi ve öğrenciye gönderilecek haftalık değerlendirme mesajı taslağı oluştur:
Öğrenci Adı: ${t.name}
Hedef: ${t.target||"Belirtilmemiş"}
Bu haftaki görev tamamlama oranı: %${d} (${o}/${i} görev tamamlandı, toplam ${Math.round(s/60)} saat çalışıldı)
Son denemeler: ${JSON.stringify(l)}
Soru Çözüm Hızları (saniye/soru): ${JSON.stringify(p)}

ANALİZ VE TASLAK KURALLARI (TÜRKÇE YAZ):
1. Analiz kısmını koçun göreceği şekilde kısa, net ve yapıcı tut. Zayıf konuları ve sınav netlerindeki değişimleri vurgula.
2. Öğrenciye gönderilecek mesaj taslağını samimi ve destekleyici yaz, fakat koçun kendi yorumlarını ekleyebileceği şablon alanları bırak. Örneğin: "[Buraya öğrenciyle son görüşmenizden özel bir not ekleyin]" veya "[Zorlandığı konuyla ilgili kendi ek önerilerinizi girin]".
3. Mesaj taslağı tamamen Türkçe, samimi ve yapıcı olmalıdır. Asla yapay zeka olduğunu belli eden klişeler içermesin.
4. Çıktıyı tam olarak şu iki etiket arasında yapılandır:
[ANALİZ]
(Koç için durum analizi ve anomali tespiti)
[TASLAK]
(Öğrenciye gönderilecek haftalık değerlendirme taslağı)`;let g="";const x={studentName:t.name,target:t.target,recentExams:l,taskCompletionRate:d,weeklyTaskCount:i};try{const $=await fetch("/api/ai-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:m}],context:x,userRole:"coach"})});$.ok?g=(await $.json()).reply:g=await Pe(m,x,"coach")}catch{g=await Pe(m,x,"coach")}let I="Analiz üretilemedi.",f="Taslak üretilemedi.";const y=g.indexOf("[ANALİZ]"),v=g.indexOf("[TASLAK]");y!==-1&&v!==-1?y<v?(I=g.substring(y+8,v).trim(),f=g.substring(v+8).trim()):(f=g.substring(v+8,y).trim(),I=g.substring(y+8).trim()):f=g,document.getElementById("aiCopilotAnalysisBox").innerHTML=`<b>📊 Yapay Zeka Durum Analizi:</b><br>${I.replace(/\n/g,"<br>")}`,document.getElementById("aiCopilotTextarea").value=f,Wt=f,document.getElementById("aiCopilotResultArea").style.display="block",document.getElementById("aiCopilotSendBtn").disabled=!0,document.getElementById("aiCopilotEditWarning").style.display="inline"}catch(a){console.error("generateAICopilotDraft error:",a),k("Taslak oluşturulurken hata: "+a.message)}finally{n.disabled=!1,n.textContent="🤖 Durum Analizi Yap ve Taslak Oluştur"}}function Uo(){const e=document.getElementById("aiCopilotTextarea").value.trim(),t=document.getElementById("aiCopilotSendBtn"),n=document.getElementById("aiCopilotEditWarning");e&&e!==Wt?(t.disabled=!1,n.style.display="none"):(t.disabled=!0,n.style.display="inline")}async function Go(e){var a;const t=document.getElementById("aiCopilotTextarea").value.trim();if(!t)return;const n=document.getElementById("aiCopilotSendBtn");n.disabled=!0,n.textContent="Gönderiliyor...";try{const i=h.coachId||((a=r.students.find(d=>d.id===e))==null?void 0:a.coachId),{data:o,error:s}=await b.from("messages").insert({student_id:e,coach_id:i,from_role:"coach",text:t,read:!1}).select().single();if(s)throw s;r.messages[e]||(r.messages[e]=[]),r.messages[e].push({_id:o.id,from:"coach",text:t,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),k("Taslak mesaj başarıyla düzenlendi ve öğrenciye gönderildi!"),document.getElementById("aiCopilotResultArea").style.display="none",document.getElementById("aiCopilotTextarea").value="",Wt=""}catch(i){console.error("sendCopilotDraft error:",i),k("Gönderim hatası: "+i.message),n.disabled=!1}finally{n.textContent="✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder"}}function Vn(){const e=r.students.find(d=>d.id===r.activeStuId),t=h.childName||(e==null?void 0:e.name)||"Öğrenci",n=document.getElementById("view-parent-home");if(!n)return;let a=[];Object.entries(r.tasks||{}).forEach(([d,c])=>{d.startsWith(r.activeStuId+"_")&&(a=a.concat(c))});const i=a.filter(d=>d.done).length,o=a.length?Math.round(i/a.length*100):0,s=(r.exams||[]).filter(d=>d.studentId===r.activeStuId).slice(-3);n.innerHTML=`
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="margin-bottom:24px">
        <div style="font-size:24px;font-weight:800;margin-bottom:4px">👋 Merhaba!</div>
        <div style="color:var(--text-mid);font-size:14px">${u(t)}'in koçluk paneli</div>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px">
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--accent)">${o}%</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Görev Tamamlama</div>
          <div style="background:var(--surface2);border-radius:8px;height:6px;margin-top:10px;overflow:hidden">
            <div style="height:100%;width:${o}%;background:var(--green);border-radius:8px;transition:width .5s"></div>
          </div>
        </div>
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--blue)">${i}/${a.length}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Tamamlanan Görevler</div>
        </div>
        <div class="card" style="text-align:center;padding:20px">
          <div style="font-size:32px;font-weight:800;color:var(--green)">${s.length}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:4px">Son Denemeler</div>
        </div>
      </div>
      
      ${s.length?`
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:12px">📊 Son Deneme Sonuçları</div>
        ${s.map(d=>{const c=Object.values(d.nets||{}).reduce((l,p)=>l+(parseFloat(p)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(d.name||d.type)}</div><div style="font-size:11px;color:var(--text-mid)">${d.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${c.toFixed(1)} net</div>
          </div>`}).join("")}
      </div>`:""}
      
      <div class="card" style="padding:20px;background:linear-gradient(135deg,rgba(240,165,0,.05),rgba(62,207,142,.05))">
        <div style="font-size:15px;font-weight:700;margin-bottom:8px">🤖 AI Asistandan Yardım Alın</div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:12px">Çocuğunuzun ilerlemesi hakkında anında rapor alabilirsiniz.</div>
        <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;width:100%;padding:12px">🤖 AI Asistan ile Konuş</button>
      </div>
    </div>`}function Zn(){const e=document.getElementById("view-parent-progress");if(!e)return;const t=r.students.find(o=>o.id===r.activeStuId),n=h.childName||(t==null?void 0:t.name)||"Öğrenci",a=(r.exams||[]).filter(o=>o.studentId===r.activeStuId);let i=[];Object.entries(r.tasks||{}).forEach(([o,s])=>{o.startsWith(r.activeStuId+"_")&&(i=i.concat(s))}),e.innerHTML=`
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="font-size:20px;font-weight:800;margin-bottom:20px">📊 ${u(n)} - İlerleme Raporu</div>
      
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📋 Haftalık Görevler</div>
        ${i.length?i.slice(-10).map(o=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:20px;height:20px;border-radius:50%;background:${o.done?"var(--green)":"var(--surface2)"};border:2px solid ${o.done?"var(--green)":"var(--border)"};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">${o.done?"✓":""}</div>
            <div style="flex:1;font-size:13px">${u(o.subject)} <span style="font-size:11px;color:var(--text-dim)">(${Ge(o.type)})</span></div>
            <div style="font-size:11px;color:var(--text-mid)">${o.done?"Tamamlandı":"Bekliyor"}</div>
          </div>`).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz görev bulunmuyor.</div>'}
      </div>
      
      <div class="card" style="padding:20px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📊 Deneme Geçmişi</div>
        ${a.length?a.slice(-10).map(o=>{const s=Object.values(o.nets||{}).reduce((d,c)=>d+(parseFloat(c)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(o.name||o.type)}</div><div style="font-size:11px;color:var(--text-mid)">${o.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${s.toFixed(1)} net</div>
          </div>`}).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz deneme sonucu yok.</div>'}
      </div>
    </div>`}function Jn(){const e=document.getElementById("view-parent-ai");e&&(e.innerHTML=`
    <div style="padding:24px;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🤖</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">AI Koç Asistanı</div>
      <div style="font-size:13px;color:var(--text-mid);margin-bottom:24px;line-height:1.7">Çocuğunuzun eğitim süreci hakkında sorular sorun, deneme analizleri isteyin veya öneriler alın.</div>
      <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;padding:14px 32px;font-size:15px">💬 AI Asistan ile Konuşmaya Başla</button>
    </div>`)}async function Wo(){var g;const e=document.getElementById("smId").value,t=document.getElementById("smName").value.trim(),n=$e(document.getElementById("smUsername").value.trim()),a=document.getElementById("smPass").value,i=document.getElementById("smRole").value,o=document.getElementById("smTarget").value.trim(),s=((g=document.querySelector(".color-opt.sel"))==null?void 0:g.dataset.c)||"#f0a500",d=Number(document.getElementById("smWeekStart").value),c=Number(document.getElementById("smProg").value);if(!t||!n||!a)return k("Ad, kullanıcı adı ve şifre zorunlu!");const l=a.length===64?a:await Ie(a),p=n+"@rostrumakademi.com",m={full_name:t,username:n,password_hash:l,role:i,target:o,color:s,week_start:d,progress:c};if(L(!0),e){const{error:x}=await b.from("users").update(m).eq("id",e);if(L(!1),x)return k("Hata: "+x.message);k("Kullanıcı güncellendi ✓")}else{const{data:x,error:I}=await b.rpc("create_new_user",{p_email:p,p_password:a,p_full_name:t,p_username:n,p_role:i,p_target:o,p_color:s,p_progress:c,p_week_start:d,p_coach_id:null,p_institution_id:null,p_exam_profile:"YKS"});if(L(!1),I)return k("Hata: "+I.message);k("Kullanıcı başarıyla oluşturuldu ✓")}O("studentModal"),mt()}let fe=[],me={search:"",exam:"",subject:""};function Vt(e){const t=me.search;return e.filter(n=>!(t&&!n.name.toLowerCase().includes(t)&&!(n.publisher||"").toLowerCase().includes(t)||me.exam&&n.exam_type!==me.exam||me.subject&&n.subject!==me.subject))}function Vo(){var i,o,s;me.search=(((i=document.getElementById("crSearch"))==null?void 0:i.value)||"").toLowerCase().trim(),me.exam=((o=document.getElementById("crExam"))==null?void 0:o.value)||"",me.subject=((s=document.getElementById("crSubject"))==null?void 0:s.value)||"";const e=document.getElementById("cr-tab-content");if(!e)return;const t=document.querySelector(".cr-tab.active"),n=(t==null?void 0:t.id)==="crt-playlists"?"playlists":(t==null?void 0:t.id)==="crt-analytics"?"analytics":"books",a=Vt(fe);e.innerHTML=yt(n,a)}function yt(e,t){const n=t.filter(d=>d.resource_type==="book"),a=t.filter(d=>d.resource_type==="playlist"),i={Matematik:"#3B82F6",Fizik:"#8B5CF6",Kimya:"#06B6D4",Biyoloji:"#10B981",Geometri:"#6366F1",Türkçe:"#F59E0B",Edebiyat:"#EC4899",Tarih:"#EF4444",Coğrafya:"#84CC16",Felsefe:"#14B8A6","Din Kültürü":"#F97316",Din:"#F97316",Genel:"#6B7280"},o={Matematik:"∑",Fizik:"⚛",Kimya:"🧪",Biyoloji:"🌿",Geometri:"△",Türkçe:"T",Edebiyat:"✒",Tarih:"🏛",Coğrafya:"🌍",Felsefe:"💭","Din Kültürü":"☪",Din:"☪",Genel:"📌"};function s(d,c){if(!d.length)return'<div style="text-align:center;padding:48px;color:var(--text-dim);font-size:13px">Kaynak bulunamadı.</div>';const l={};return d.forEach(p=>{const m=p.exam_type||"Diğer";l[m]||(l[m]={});const g=p.subject||"Genel";l[m][g]||(l[m][g]=[]),l[m][g].push(p)}),Object.entries(l).map(([p,m])=>`
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#fff;background:var(--accent);padding:3px 10px;border-radius:99px">${p}</span>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
        ${Object.entries(m).map(([g,x])=>{const I=i[g]||"#6B7280",f=o[g]||"📌";return`<div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">
              <div style="width:22px;height:22px;border-radius:6px;background:${I}20;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${I};flex-shrink:0">${f}</div>
              <span style="font-size:12px;font-weight:700;color:${I}">${g}</span>
              <span style="font-size:10px;color:var(--text-dim)">${x.length} kaynak</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;padding-left:28px">
              ${x.map(y=>`
                <div style="display:flex;align-items:center;padding:10px 14px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);gap:12px;cursor:default;transition:all .15s;box-shadow:var(--shadow)" onmouseover="this.style.borderColor='${I}';this.style.boxShadow='0 2px 12px ${I}22'" onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='var(--shadow)'">
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${u(y.name)}${y.coach_id?' <span style="font-size:10px;font-weight:700;color:var(--accent);background:var(--accent-dim);padding:1px 6px;border-radius:99px;margin-left:4px">Özel</span>':""}</div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                      <span style="font-size:11px;font-weight:600;color:var(--text-dim);background:var(--surface2);padding:1px 8px;border-radius:99px;border:1px solid var(--border)">${u(y.publisher||"—")}</span>
                      <span style="font-size:11px;color:var(--text-dim)">${(y.tests||[]).length} ${c==="book"?"test":"video"}</span>
                    </div>
                  </div>
                  ${y.coach_id?`<div style="display:flex;gap:4px;flex-shrink:0">
                    <button class="btn btn-ghost btn-xs" onclick="openResourceModalCoach('${y.id}','${c}')">✏️</button>
                    <button class="btn btn-danger btn-xs" onclick="deleteResourceCoach('${y.id}')">🗑</button>
                  </div>`:""}
                </div>`).join("")}
            </div>
          </div>`}).join("")}
        </div>
      </div>`).join("")}return e==="books"?`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px">
        <div style="font-size:13px;color:var(--text-dim)">${n.length} soru bankası</div>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'book')">+ Soru Bankası</button>
        </div>
      </div>
      ${s(n,"book")}`:e==="playlists"?`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px">
        <div style="font-size:13px;color:var(--text-dim)">${a.length} oynatma listesi</div>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'playlist')">+ Playlist Ekle</button>
        </div>
      </div>
      ${s(a,"playlist")}`:`
      <div style="margin-bottom:16px">
        <h3 style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">Kaynak Analitiği Raporu</h3>
        <p style="font-size:11px;color:var(--text-dim)">Öğrencilerinizin en sık kullandığı ve en yüksek tamamlama oranına sahip kaynakları inceleyin.</p>
      </div>
      <div class="analytics-grid">
        ${Xn(t).map(c=>{const l=c.totalCount>0?Math.round(c.doneCount/c.totalCount*100):0,p=l>=80?"var(--green)":l>=50?"var(--accent)":"var(--text-dim)";return`<div class="analytics-card">
            <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">${c.exam_type} · ${c.subject}</div>
            <div style="font-size:14px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:8px">${u(c.name)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-mid);margin-bottom:6px"><span>Tamamlama</span><span style="font-weight:700;color:${p}">%${l}</span></div>
            <div style="height:5px;background:var(--surface3);border-radius:99px;overflow:hidden;margin-bottom:10px"><div style="height:100%;width:${l}%;background:${p};border-radius:99px"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim)"><span>Atanma: <b>${c.assignedCount}</b></span><span>Öğrenci: <b>${c.studentsCount}</b></span></div>
          </div>`}).join("")||'<div style="grid-column:span 3;text-align:center;padding:40px;color:var(--text-dim)">Kayıtlı performans verisi bulunamadı.</div>'}
      </div>`}async function Xe(){const e=document.getElementById("view-coach-resources");if(!e)return;if(!fe.length){e.innerHTML='<div style="max-width:720px;margin:0 auto;padding:40px;text-align:center;color:var(--text-dim);font-size:13px">Kaynaklar yükleniyor…</div>';const{data:a,error:i}=await b.from("resources").select("*").or(`coach_id.eq.${h.coachId},coach_id.is.null`).order("resource_type,exam_type,subject,name");i&&console.error(i),fe=a||[]}me={search:"",exam:"",subject:""};let t="books";const n=document.querySelector(".cr-tab.active");n&&(n.id==="crt-playlists"?t="playlists":n.id==="crt-analytics"&&(t="analytics")),e.innerHTML=`<div style="max-width:720px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <h2 style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800">Kaynaklarım</h2>
        <p style="font-size:12px;color:var(--text-mid);margin-top:2px">Soru bankaları, video listeleri ve kaynak analitiği.</p>
      </div>
    </div>

    <div class="cr-tabs">
      <button class="cr-tab ${t==="books"?"active":""}" id="crt-books" onclick="switchCRTab('books')">Soru Bankaları</button>
      <button class="cr-tab ${t==="playlists"?"active":""}" id="crt-playlists" onclick="switchCRTab('playlists')">Oynatma Listeleri</button>
      <button class="cr-tab ${t==="analytics"?"active":""}" id="crt-analytics" onclick="switchCRTab('analytics')">Kaynak Analizi</button>
    </div>

    <div class="cr-filter-bar">
      <div class="cr-filter-search">
        <span style="color:var(--text-dim);font-size:14px">🔍</span>
        <input type="text" id="crSearch" placeholder="Kaynak veya yayınevi ara..." oninput="updateCRFilter()" autocomplete="off">
      </div>
      <select class="cr-filter-select" id="crExam" onchange="updateCRFilter()">
        <option value="">Tüm Sınavlar</option>
        <option value="TYT">TYT</option>
        <option value="AYT-SAY">AYT Sayısal</option>
        <option value="AYT-EA">AYT EA</option>
        <option value="AYT-SOZ">AYT Sözel</option>
      </select>
      <select class="cr-filter-select" id="crSubject" onchange="updateCRFilter()">
        <option value="">Tüm Dersler</option>
        <option>Matematik</option><option>Fizik</option><option>Kimya</option><option>Biyoloji</option>
        <option>Geometri</option><option>Türkçe</option><option>Edebiyat</option><option>Tarih</option>
        <option>Coğrafya</option><option>Felsefe</option><option>Din</option>
      </select>
    </div>

    <div id="cr-tab-content">
      ${yt(t,fe)}
    </div>
  </div>`}function Zo(e){var n;document.querySelectorAll(".cr-tab").forEach(a=>a.classList.remove("active")),(n=document.getElementById("crt-"+e))==null||n.classList.add("active");const t=Vt(fe);document.getElementById("cr-tab-content").innerHTML=yt(e,t)}function Xn(e){const t={};return e.forEach(n=>{t[n.name]={name:n.name,exam_type:n.exam_type,subject:n.subject,assignedCount:0,totalCount:0,doneCount:0,students:new Set}}),Object.entries(r.tasks).forEach(([n,a])=>{const i=n.split("_")[0];a.forEach(o=>{e.forEach(s=>{if(o.subject&&o.subject.includes(s.name)){const d=t[s.name];d&&(d.assignedCount++,d.students.add(i),o.task_items&&Array.isArray(o.task_items)?o.task_items.forEach(c=>{d.totalCount++,(c.done||o.done)&&d.doneCount++}):(d.totalCount++,o.done&&d.doneCount++))}})})}),Object.values(t).map(n=>({...n,studentsCount:n.students.size})).filter(n=>n.assignedCount>0).sort((n,a)=>a.assignedCount-n.assignedCount)}function Jo(e,t="book"){const n=t==="playlist";let a=document.getElementById("coachResourceModal");a||(a=document.createElement("div"),a.id="coachResourceModal",a.className="modal-bg",a.innerHTML=`<div class="modal modal-lg">
      <button class="modal-close" onclick="cm('coachResourceModal')">×</button>
      <h2 id="crmTitle">Kaynak Ekle</h2>
      <input type="hidden" id="crmId">
      <input type="hidden" id="crmType">
      <div class="field-row">
        <div class="field"><label>Sınav</label>
          <select id="crmExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
        </div>
        <div class="field"><label>Ders</label>
          <select id="crmSubject">
            <option>Matematik</option><option>Fizik</option><option>Kimya</option><option>Biyoloji</option>
            <option>Geometri</option><option>Türkçe</option><option>Edebiyat</option><option>Tarih</option>
            <option>Coğrafya</option><option>Felsefe</option><option>Din</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Yayınevi / Hoca</label><input id="crmPublisher" placeholder="Karakök, Eyüp B..."></div>
        <div class="field"><label>Kaynak Adı</label><input id="crmName" placeholder="Soru Bankası / Kamp Adı"></div>
      </div>
      
      <div id="crmYtImportBox" style="border:1.5px solid rgba(255,0,0,.2);background:rgba(255,0,0,.04);border-radius:12px;padding:14px;margin-bottom:14px;display:none">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="background:#ff0000;color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:4px;letter-spacing:.5px">YT</span>
            <span style="font-size:13px;font-weight:700">YouTube Playlist'ten Otomatik Çek</span>
          </div>
          <a href="/nasil-yapilir.html" target="_blank" style="font-size:11px;color:var(--accent);text-decoration:none;font-weight:600">❓ Nasıl yapılır?</a>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <input id="crmYtUrl" placeholder="https://youtube.com/playlist?list=PL..." style="flex:1;font-size:12px;border-radius:8px">
          <button type="button" class="btn btn-accent btn-sm" onclick="fetchYtPlaylistCoach()" style="white-space:nowrap">▶ Çek</button>
        </div>
        <div id="crmYtStatus" style="font-size:11px;color:var(--text-mid);margin-bottom:6px"></div>
        <!-- Video önizleme listesi -->
        <div id="crmVideoPreview" style="display:none;background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:260px;overflow-y:auto"></div>
      </div>

      <!-- Kitap için textarea, playlist için gizli (veri dahili tutulur) -->
      <div class="field" id="crmTestsField">
        <label id="crmTestsLabel">Testler</label>
        <textarea id="crmTests" style="min-height:180px; font-size:12px; font-family:monospace" placeholder="Format:
Sayılar - Test 1 | 12
Sayılar - Test 2 | 14"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%; justify-content:center; padding:12px; margin-top:4px" onclick="saveResourceCoach()">Kaydet</button>
    </div>`,document.body.appendChild(a),a.addEventListener("click",i=>{i.target===a&&a.classList.remove("open")})),document.getElementById("crmId").value=e||"",document.getElementById("crmType").value=t,document.getElementById("crmTitle").textContent=(e?"Kaynağı Düzenle":"Kaynak Ekle")+(n?" — Playlist":" — Soru Bankası"),document.getElementById("crmTestsLabel").innerHTML=n?'Videolar <span style="color:var(--text-dim);font-weight:400">(Format: Video Adı | Link | Süre(dk))</span>':'Testler <span style="color:var(--text-dim);font-weight:400">(Format: Test Adı | Soru Sayısı)</span>',document.getElementById("crmTests").placeholder=n?`Ders 1 | https://youtube.com/watch?v=xxx | 45
Ders 2 | https://youtube.com/watch?v=yyy | 38`:`Sayılar - Test 1 | 12
Sayılar - Test 2 | 14`,document.getElementById("crmYtImportBox").style.display=n&&!e?"":"none",document.getElementById("crmTestsField").style.display=n?"none":"",document.getElementById("crmYtUrl").value="",document.getElementById("crmYtStatus").textContent="",document.getElementById("crmVideoPreview").style.display="none",document.getElementById("crmVideoPreview").innerHTML="",window._crmFetchedVideos=[],e?b.from("resources").select("*").eq("id",e).single().then(({data:i})=>{if(i){document.getElementById("crmExam").value=i.exam_type,document.getElementById("crmSubject").value=i.subject,document.getElementById("crmPublisher").value=i.publisher||"",document.getElementById("crmName").value=i.name||"";const o=i.tests||[];n?(document.getElementById("crmTestsField").style.display="",document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.url||""} | ${s.soru||0}`).join(`
`)):document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.soru||0}`).join(`
`)}}):(document.getElementById("crmExam").value="TYT",document.getElementById("crmSubject").value="Matematik",document.getElementById("crmPublisher").value="",document.getElementById("crmName").value="",document.getElementById("crmTests").value=""),Y("coachResourceModal")}async function Xo(){const e=document.getElementById("crmYtUrl").value.trim(),t=document.getElementById("crmYtStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL girin</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ list= parametresi bulunamadı</span>';const a=n[1];t.innerHTML="⏳ Çekiliyor...";try{let i=[],o="";do{let d=`/api/youtube?playlistId=${a}`;o&&(d+=`&pageToken=${o}`);const c=await fetch(d);if(!c.ok)throw new Error("Playlist çekilemedi.");const l=await c.json();l.items&&(i=i.concat(l.items)),o=l.nextPageToken||"",t.innerHTML=`⏳ ${i.length} video yükleniyor...`}while(o&&i.length<200);window._crmFetchedVideos=i;const s=document.getElementById("crmVideoPreview");if(s.style.display="",s.innerHTML=i.map((d,c)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--border)">
        <div style="width:20px;height:20px;border-radius:5px;background:var(--surface3);color:var(--text-mid);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${c+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(d.title)}</div>
          <div style="font-size:10px;color:var(--text-dim)">⏱ ${d.duration||"?"} dk</div>
        </div>
        <a href="${u(d.url)}" target="_blank" style="font-size:10px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:3px 8px;border-radius:6px;text-decoration:none;flex-shrink:0">▶</a>
      </div>`).join(""),i.length>0&&!document.getElementById("crmName").value){const d=i[0].title;document.getElementById("crmName").value=d.split(" | ")[0].split(" - ")[0].trim().slice(0,50)}t.innerHTML=`<span style="color:var(--green)">✓ ${i.length} video çekildi!</span>`}catch(i){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${i.message}</span>`}}async function Qo(){const e=document.getElementById("crmName").value.trim(),t=document.getElementById("crmSubject").value;if(!e||!t)return k("Ad ve ders zorunlu!");const n=document.getElementById("crmId").value,a=document.getElementById("crmType").value==="playlist",i=document.getElementById("crmTests").value.split(`
`).map(c=>c.trim()).filter(Boolean),o=window._crmFetchedVideos||[];let s=[];if(a){if(o.length>0?s=o.map(c=>({label:c.title||"",url:c.url||"",topic:"",soru:parseInt(c.duration)||0})):s=i.map(c=>{const l=c.split("|").map(p=>p.trim());return{label:l[0]||"",url:l[1]||"",topic:"",soru:parseInt(l[2])||0}}),!s.length)return k("Video listesi boş! Önce playlist çekin.")}else s=i.map(c=>{const l=c.split("|").map(p=>p.trim());return{label:l[0]||"",soru:parseInt(l[1])||0}});const d={exam_type:document.getElementById("crmExam").value,subject:t,publisher:document.getElementById("crmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:s,active:!0,resource_type:a?"playlist":"book",coach_id:h.coachId};L(!0),n?(await b.from("resources").update(d).eq("id",n),k("Güncellendi ✓")):(await b.from("resources").insert(d),k("Kaynak eklendi ✓")),L(!1),O("coachResourceModal"),fe=[],Xe()}async function es(e){await X("Bu kaynağı silmek istediğinizden emin misiniz?")&&(L(!0),await b.from("resources").delete().eq("id",e),L(!1),k("Silindi"),fe=[],Xe())}function ts(e){const t=e.target.files[0];if(!t)return;L(!0);const n=new FileReader;n.onload=async a=>{try{const i=new Uint8Array(a.target.result),o=XLSX.read(i,{type:"array"}),s=o.SheetNames[0],d=o.Sheets[s],c=XLSX.utils.sheet_to_json(d);if(c.length===0)return L(!1),k("Excel dosyası boş!");const l={};c.forEach(g=>{const x=g["Kaynak Adı"]||g.Name||g["Kitap Adı"]||g["Playlist Adı"]||"",f=(g["Kaynak Türü"]||g.Type||g.Tür||"book").toLowerCase().includes("playlist")?"playlist":"book",y=g.Yayınevi||g.Publisher||g.Hoca||"",v=g.Sınav||g.Exam||"TYT",$=g.Ders||g.Subject||"",S=g["Öğe Adı"]||g.Test||g.Video||g["Test Adı"]||g["Video Adı"]||"",B=parseInt(g["Soru Sayısı"]||g.Soru||g.Süre||g["Süre (dk)"]||0),D=g.URL||g.Link||"";if(!x||!$||!S)return;const T=`${x}_${v}_${$}_${f}`;l[T]||(l[T]={exam_type:v,subject:$,publisher:y,name:x,resource_type:f,tests:[]}),l[T].tests.push({label:S,soru:B,url:D,topic:""})});const p=Object.values(l);if(p.length===0)return L(!1),k("Uyumlu veri bulunamadı! Sütun başlıklarını kontrol edin.");let m=0;for(const g of p){const{error:x}=await b.from("resources").insert({...g,year:new Date().getFullYear(),active:!0,coach_id:h.coachId});x||m++}L(!1),k(`✓ Excel'den ${m} kaynak başarıyla aktarıldı!`),fe=[],Xe()}catch(i){L(!1),console.error(i),k("Excel okuma hatası: "+i.message)}},n.readAsArrayBuffer(t)}function ns(e){const t=e.target.files[0];if(!t)return;L(!0);const n=new FileReader;n.onload=async a=>{try{const i=new Uint8Array(a.target.result),o=XLSX.read(i,{type:"array"}),s=o.Sheets[o.SheetNames[0]],d=XLSX.utils.sheet_to_json(s);if(d.length===0)return L(!1),k("Excel dosyası boş!");let c=0;for(const l of d){const p=l["Ad Soyad"]||l.Ad||l.Name||"",m=l.Hedef||l.Target||"Hedef belirtilmemiş";let g=l["Kullanıcı Adı"]||l.Username||"",x=l.Şifre||l.Password||STU_DEFAULT_PASS;if(!p)continue;g||(g=p.toLowerCase().replace(/\s+/g,"")+Math.floor(Math.random()*100),g=$e(g));const I=await Ie(x),f=g+"@rostrumakademi.com",{data:y,error:v}=await b.rpc("create_new_user",{p_email:f,p_password:x,p_full_name:p,p_username:g,p_role:"student",p_target:m,p_color:"#4da6ff",p_progress:0,p_week_start:0,p_coach_id:h.coachId,p_institution_id:null,p_exam_profile:"YKS"});!v&&y&&(r.students.push({id:y,name:p,target:m,color:"#4da6ff",progress:0,pass:I,weekStart:0,username:g}),c++)}L(!1),k(`✓ Excel'den ${c} öğrenci başarıyla eklendi!`),ue(),We()}catch(i){L(!1),console.error(i),k("Excel okuma hatası: "+i.message)}},n.readAsArrayBuffer(t)}function Qn(e){if(!r.activeStuId||!q)return null;let t=null;return Object.entries(r.tasks).forEach(([n,a])=>{n.startsWith(r.activeStuId+"_")&&a.forEach(i=>{i.subject&&i.subject.includes(q.name)&&(i.task_items&&Array.isArray(i.task_items)?i.task_items.forEach(o=>{(o.label||o)===e&&(o.done||i.done?t="done":t!=="done"&&(t="pending"))}):i.note&&i.note.includes(e)&&(i.done?t="done":t!=="done"&&(t="pending")))})}),t}async function as(e,t){var c;const a=`${r.activeStuId}_${e}`,i=(c=r.tasks[a])==null?void 0:c[t];if(!i)return;we=e,_editingTaskId=i._id,q=null,document.querySelector("#taskModal h2").innerHTML=`Görev Düzenle — <span id="tmDay">${e}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Güncelle",document.getElementById("tmType").value=i.type,document.getElementById("tmExam").value=i.exam||"",document.getElementById("tmDuration").value=i.duration||60,document.getElementById("tmNote").value=i.note||"";const o=i.exam||"",s=i.type;{const l=document.getElementById("tmSubjectSel"),p=document.getElementById("tmSubjectFree");document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const m=document.getElementById("tmTestSummary");m&&(m.style.display="none"),o&&typeof SUBJECT_MAP<"u"&&SUBJECT_MAP[o]?(l.innerHTML=SUBJECT_MAP[o].map(I=>`<option value="${I}">${I}</option>`).join(""),l.style.display="",p.style.display="none"):(l.style.display="none",p.style.display="");const g=(s==="soru"||s==="konu")&&o;document.getElementById("soruBankasiWrap").style.display=g?"":"none";const x=document.getElementById("tmBookSearch");x&&(x.placeholder=s==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara...")}if((s==="soru"||s==="konu")&&o){const l=document.getElementById("tmSubjectSel");let p="",m=i.subject;if(i.subject.includes(" - ")){const f=i.subject.split(" - ");p=f[0].trim(),m=f.slice(1).join(" - ").trim()}p&&SUBJECT_MAP[o]&&SUBJECT_MAP[o].includes(p)&&(l.value=p),document.getElementById("tmBookVal").value=m,document.getElementById("tmBookSearch").value=m,L(!0),await bn(),L(!1);const g=`${o}_${p}`;let I=(te[g]||[]).find(f=>f.name===m);if(I||Object.values(te).forEach(f=>{const y=f.find(v=>v.name===m);y&&(I=y)}),I){q=I,document.getElementById("tmTestWrap").style.display="",jt();const f=(i.task_items||[]).map(v=>v.label||v);document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(v=>{var B;const $=parseInt(v.value),S=((B=q.testler[$])==null?void 0:B.label)||q.testler[$];f.includes(S)?v.checked=!0:v.checked=!1}),He()}}else{const l=document.getElementById("tmSubjectSel"),p=document.getElementById("tmSubjectFree");l.style.display!=="none"?l.value=i.subject:p.value=i.subject,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none"}Y("taskModal")}async function is(){const e=prompt("Şablon adı giriniz:");if(!e)return;const t=r.students.find(s=>s.id===r.activeStuId),n=(t==null?void 0:t.weekStart)??0,a=V(r.weekOffset,n),i=[];for(let s=0;s<7;s++){const d=U(a,s),c=H(d),l=`${r.activeStuId}_${c}`;(r.tasks[l]||[]).forEach(m=>{i.push({day_index:s,type:m.type,exam_type:m.exam||null,subject:m.subject,duration:m.duration,note:m.note||"",task_items:m.task_items||null})})}if(i.length===0)return k("Bu haftada kaydedilecek görev bulunmuyor!");L(!0);const{error:o}=await b.from("program_templates").insert({coach_id:h.coachId,name:e,description:`${i.length} görev içeriyor.`,tasks:i});if(L(!1),o)return k("Şablon kaydedilemedi: "+o.message);k("Hafta şablon olarak kaydedildi ✓")}async function os(){L(!0);const{data:e,error:t}=await b.from("program_templates").select("*").eq("coach_id",h.coachId);if(L(!1),t)return k("Şablonlar yüklenemedi.");if(!e||e.length===0)return k("Kayıtlı şablonunuz bulunmuyor. Önce haftayı şablon olarak kaydedin.");let n=document.getElementById("applyTemplateModal");n||(n=document.createElement("div"),n.id="applyTemplateModal",n.className="modal-bg",n.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('applyTemplateModal')">×</button>
      <h2>Şablon Uygula</h2>
      <div class="field"><label>Şablon Seçin</label>
        <select id="atmSelect"></select>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:12px" onclick="confirmApplyTemplate()">Uygula</button>
    </div>`,document.body.appendChild(n),n.addEventListener("click",a=>{a.target===n&&n.classList.remove("open")})),document.getElementById("atmSelect").innerHTML=e.map(a=>`<option value="${a.id}">${u(a.name)} (${a.tasks.length} Görev)</option>`).join(""),Y("applyTemplateModal")}async function ss(){const e=document.getElementById("atmSelect").value;if(!e)return;L(!0);const{data:t,error:n}=await b.from("program_templates").select("*").eq("id",e).single();if(n||!t)return L(!1),k("Şablon yüklenemedi.");const a=r.students.find(s=>s.id===r.activeStuId),i=(a==null?void 0:a.weekStart)??0,o=V(r.weekOffset,i);for(const s of t.tasks){const d=H(U(o,s.day_index)),c={student_id:r.activeStuId,coach_id:h.coachId,date:d,type:s.type,exam_type:s.exam_type,subject:s.subject,duration:s.duration,note:s.note,done:!1,task_items:s.task_items},{data:l,error:p}=await b.from("tasks").insert(c).select().single();if(!p&&l){const m=`${r.activeStuId}_${d}`;r.tasks[m]||(r.tasks[m]=[]),r.tasks[m].push({_id:l.id,type:l.type,exam:l.exam_type,subject:l.subject,duration:l.duration,note:l.note,done:!1,student_note:"",task_items:l.task_items})}}L(!1),O("applyTemplateModal"),G(),k("Şablon başarıyla uygulandı ✓")}function rs(e,t){var o;const a=`${r.activeStuId}_${e}`,i=(o=r.tasks[a])==null?void 0:o[t];i&&(_clipboardTask={type:i.type,exam:i.exam,subject:i.subject,duration:i.duration,note:i.note,task_items:i.task_items},k("Görev panoya kopyalandı ✓"),G())}async function ds(e){if(!_clipboardTask)return;const t={student_id:r.activeStuId,coach_id:h.coachId,date:e,type:_clipboardTask.type,exam_type:_clipboardTask.exam||null,subject:_clipboardTask.subject,duration:_clipboardTask.duration,note:_clipboardTask.note,done:!1,task_items:_clipboardTask.task_items};L(!0);const{data:n,error:a}=await b.from("tasks").insert(t).select().single();if(L(!1),a)return k("Hata: "+a.message);const i=`${r.activeStuId}_${e}`;r.tasks[i]||(r.tasks[i]=[]),r.tasks[i].push({_id:n.id,type:n.type,exam:n.exam_type,subject:n.subject,duration:n.duration,note:n.note,done:!1,student_note:"",task_items:n.task_items}),G(),k("Görev yapıştırıldı ✓")}async function ls(e,t){var p;const n=`${r.activeStuId}_${e}`,a=(p=r.tasks[n])==null?void 0:p[t];if(!a)return;const i=r.students.find(m=>m.id===r.activeStuId),o=(i==null?void 0:i.weekStart)??0,s=V(r.weekOffset,o),d=[];for(let m=0;m<7;m++){const g=U(s,m),x=H(g);x!==e&&d.push({student_id:r.activeStuId,coach_id:h.coachId,date:x,type:a.type,exam_type:a.exam||null,subject:a.subject,duration:a.duration,note:a.note,done:!1,task_items:a.task_items})}if(d.length===0)return;L(!0);const{data:c,error:l}=await b.from("tasks").insert(d).select();if(L(!1),l)return k("Hata: "+l.message);(c||[]).forEach(m=>{const g=`${r.activeStuId}_${m.date}`;r.tasks[g]||(r.tasks[g]=[]),r.tasks[g].push({_id:m.id,type:m.type,exam:m.exam_type,subject:m.subject,duration:m.duration,note:m.note,done:!1,student_note:"",task_items:m.task_items})}),G(),k("Görev tüm haftaya kopyalandı ✓")}async function cs(){if(!_clipboardTask)return;const e=r.students.find(s=>s.id===r.activeStuId),t=(e==null?void 0:e.weekStart)??0,n=V(r.weekOffset,t),a=[];for(let s=0;s<7;s++){const d=U(n,s),c=H(d);a.push({student_id:r.activeStuId,coach_id:h.coachId,date:c,type:_clipboardTask.type,exam_type:_clipboardTask.exam||null,subject:_clipboardTask.subject,duration:_clipboardTask.duration,note:_clipboardTask.note,done:!1,task_items:_clipboardTask.task_items})}L(!0);const{data:i,error:o}=await b.from("tasks").insert(a).select();if(L(!1),o)return k("Hata: "+o.message);(i||[]).forEach(s=>{const d=`${r.activeStuId}_${s.date}`;r.tasks[d]||(r.tasks[d]=[]),r.tasks[d].push({_id:s.id,type:s.type,exam:s.exam_type,subject:s.subject,duration:s.duration,note:s.note,done:!1,student_note:"",task_items:s.task_items})}),_clipboardTask=null,G(),k("Görev tüm haftaya yapıştırıldı ✓")}Fn();Yt();window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==currentTab){if(!e){e={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[h.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&ne(e,!1)}});async function Zt(){const e=document.getElementById("view-coach-applications");if(!e)return;e.innerHTML=`<div style="padding:24px;max-width:800px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Eşleşme Başvuruları</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">koc-bul sayfasından gelen öğrenci başvuruları</div>
    <div id="appsList" style="display:flex;flex-direction:column;gap:10px">
      <div style="text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;const{data:t,error:n}=await b.from("match_requests").select("*").eq("matched_coach_id",h.coachId).order("created_at",{ascending:!1}),a=document.getElementById("appsList");if(n||!t){a.innerHTML=`<div style="padding:20px;color:var(--red);background:var(--red-dim);border-radius:10px">Başvurular yüklenemedi: ${(n==null?void 0:n.message)||"Bilinmeyen hata"}</div>`;return}if(t.length===0){a.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-dim)">
      <div style="font-size:32px;margin-bottom:12px">📭</div>
      <div style="font-size:14px;font-weight:600">Henüz başvuru yok</div>
      <div style="font-size:12px;margin-top:4px">Koc-bul sayfasındaki profilinize öğrenci başvurduğunda burada görünecek.</div>
    </div>`;const c=document.querySelector("#sbi_coach-applications .sb-badge");c&&c.remove();return}const i={pending:"#f0a500",accepted:"#3ecf8e",rejected:"#ff5c7a"},o={pending:"Beklemede",accepted:"Kabul Edildi",rejected:"Reddedildi"};a.innerHTML=t.map(c=>`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px">
        <div>
          <div style="font-size:15px;font-weight:700">${u(c.student_name||"İsimsiz")}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(c.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
        </div>
        <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;background:${i[c.status]||"#888"}22;color:${i[c.status]||"#888"};white-space:nowrap">
          ${o[c.status]||c.status}
        </span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">E-posta</div>
          <a href="mailto:${u(c.email||"")}" style="font-size:13px;font-weight:600;color:var(--accent);text-decoration:none">${u(c.email||"—")}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Telefon</div>
          <a href="tel:${u(c.phone||"")}" style="font-size:13px;font-weight:600;color:var(--text);text-decoration:none">${u(c.phone||"—")}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Sınav Grubu</div>
          <div style="font-size:13px;font-weight:600">${u(c.exam_profile||"—")}</div>
        </div>
        ${c.style?`<div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Koçluk Tercihi</div>
          <div style="font-size:12px;color:var(--text-mid)">${u(c.style)}</div>
        </div>`:""}
      </div>
      ${c.status==="pending"?`
      <div style="display:flex;gap:8px">
        <button onclick="updateApplication('${c.id}','accepted')" style="flex:1;padding:9px;background:rgba(62,207,142,.12);color:#3ecf8e;border:1px solid rgba(62,207,142,.25);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✓ Kabul Et</button>
        <button onclick="updateApplication('${c.id}','rejected')" style="flex:1;padding:9px;background:rgba(255,92,122,.08);color:#ff5c7a;border:1px solid rgba(255,92,122,.2);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✗ Reddet</button>
      </div>`:""}
    </div>`).join("");const s=t.filter(c=>c.status==="pending").length,d=document.getElementById("sbi_coach-applications");if(d){const c=d.querySelector(".sb-badge");if(c&&c.remove(),s>0){const l=document.createElement("span");l.className="sb-badge",l.textContent=s,d.appendChild(l)}}}async function ps(e,t){const{error:n}=await b.from("match_requests").update({status:t}).eq("id",e);if(n)return k("Hata: "+n.message);k(t==="accepted"?"✓ Başvuru kabul edildi":"Başvuru reddedildi"),Zt()}let Ee=null;async function ea(){var a;const e=document.getElementById("view-coach-notes");if(!e)return;e.innerHTML=`<div style="padding:24px;max-width:860px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Notlarım</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">Kişisel notlar — sadece sen görürsün</div>
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <button onclick="openNoteEditor(null)" style="padding:8px 18px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">+ Yeni Not</button>
    </div>
    <div id="coachNotesList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;const t=`coach_notes_${h.coachId}`,{data:n}=await b.from("platform_settings").select("value").eq("key",t).maybeSingle();Ee=((a=n==null?void 0:n.value)==null?void 0:a.notes)||[],Jt()}function Jt(){const e=document.getElementById("coachNotesList");if(!e)return;const t=Ee;if(!t.length){e.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-dim)">
      <div style="font-size:36px;margin-bottom:12px">📝</div>
      <div style="font-size:14px;font-weight:600">Henüz not yok</div>
      <div style="font-size:12px;margin-top:4px">+ Yeni Not ile başla</div>
    </div>`;return}const n=["#f0a50018","#3ecf8e18","#4da6ff18","#c084fc18","#ff5c7a18"];e.innerHTML=t.map((a,i)=>`
    <div style="background:${n[i%n.length]};border:1px solid var(--border);border-radius:14px;padding:16px;cursor:pointer;position:relative;transition:border-color .15s"
      onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'"
      onclick="openNoteEditor(${i})">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${u(a.title||"Başlıksız")}</div>
        <button onclick="event.stopPropagation();deleteCoachNote(${i})" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;padding:0;line-height:1;flex-shrink:0">✕</button>
      </div>
      <div style="font-size:12px;color:var(--text-mid);white-space:pre-wrap;line-height:1.5;max-height:100px;overflow:hidden">${u(a.body||"")}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:10px">${a.updated?new Date(a.updated).toLocaleDateString("tr-TR",{day:"numeric",month:"short",year:"numeric"}):""}</div>
    </div>`).join("")}function ms(e){const t=e!==null?Ee[e]||{}:{};let n=document.getElementById("coachNoteModal");n||(n=document.createElement("div"),n.id="coachNoteModal",n.className="modal-bg",document.body.appendChild(n)),n.innerHTML=`<div class="modal" style="max-width:520px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:16px;font-weight:800">${e===null?"Yeni Not":"Notu Düzenle"}</div>
      <button onclick="document.getElementById('coachNoteModal').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--text-dim)">✕</button>
    </div>
    <input id="noteEditorTitle" value="${u(t.title||"")}" placeholder="Başlık..." style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-weight:600;box-sizing:border-box;margin-bottom:10px">
    <textarea id="noteEditorBody" rows="8" placeholder="Not içeriği..." style="width:100%;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;line-height:1.6;resize:vertical;box-sizing:border-box;font-family:inherit">${u(t.body||"")}</textarea>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button onclick="saveCoachNote(${e})" style="flex:1;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">Kaydet</button>
      <button onclick="document.getElementById('coachNoteModal').style.display='none'" style="padding:10px 16px;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;cursor:pointer">İptal</button>
    </div>
  </div>`,n.style.display="flex"}async function us(e){const t=document.getElementById("noteEditorTitle").value.trim(),n=document.getElementById("noteEditorBody").value.trim();if(!t&&!n)return k("Not boş olamaz");const a={title:t||"Başlıksız",body:n,updated:new Date().toISOString()};e===null?Ee.unshift(a):Ee[e]=a,await ta(),document.getElementById("coachNoteModal").style.display="none",Jt(),k("Not kaydedildi ✓")}async function gs(e){await X("Bu notu silmek istiyor musun?")&&(Ee.splice(e,1),await ta(),Jt(),k("Not silindi"))}async function ta(){const e=`coach_notes_${h.coachId}`;await b.from("platform_settings").upsert({key:e,value:{notes:Ee}},{onConflict:"key"})}window.toggleSidebar=ka;window.setupShell=$a;window.switchTab=ne;window.renderHome=pn;window.renderCoachApplications=Zt;window.updateApplication=ps;window.renderCoachNotes=ea;window.openNoteEditor=ms;window.toggleNewResourceMode=Ua;window.addManualTest=Ga;window.removeManualTest=Wa;window.saveCoachNote=us;window.deleteCoachNote=gs;window.renderStudentsSearch=We;window.filterStudentSearch=Ta;window.openStudentDetail=mn;window.openKonuHaritasi=Ia;window.openStudentProgram=Dt;window.openStudentExams=_a;window.openStudentAppointments=za;window.renderProfile=vn;window.saveProfile=Ca;window.renderSettings=yn;window.saveGeminiKey=ja;window.renderProgram=G;window.selectStu=Pa;window.chWeek=Ha;window.goToday=Ra;window.openClearWeekModal=Na;window.toggleDaySel=Ya;window.toggleAllDays=Ka;window.confirmClearDays=Oa;window.openTaskModal=Va;window.loadResources=bn;window.updateSubjectList=Ct;window.updateBookList=Za;window.renderBookList=lt;window.filterBooks=Ja;window.selectBook=Xa;window.renderTestList=jt;window.selectAllTests=Qa;window.clearAllTests=ei;window.updateTestSummary=He;window.selectModalSpeed=ti;window.applyDuration=ni;window.loadStudentSpeeds=hn;window.saveStudentSpeed=kn;window.saveTask=ai;window.toggleTask=ii;window.closeTaskMenu=Pt;window.showTaskMenu=oi;window.copyTask=si;window.deleteTask=ri;window.renderTodoList=Tn;window.renderStudents=En;window.goProgram=xi;window.openStudentModal=bi;window.saveStudent=hi;window.showInviteInfo=Sn;window.copyInvite=ki;window.deleteStu=wi;window.renderAppointments=Ve;window.renderCalDays=ct;window.selCalDay=$i;window.chCalMonth=Ti;window.renderApptList=Ht;window.openApptModal=Ei;window.saveAppt=Si;window.deleteAppt=Ii;window.renderExams=Re;window.openCommentModal=Mi;window.saveComment=Ai;window.deleteExam=Di;window.renderMessages=An;window.selectThread=Li;window.renderThreadHTML=xe;window.sendMsg=Ci;window.scrollMsgs=be;window.renderPortal=pt;window.stuToggleTask=ji;window.renderSPortal=_e;window.stuToggleTask2=Pi;window.chWeekS=Hi;window.openTaskDetail=Rt;window.toggleTaskDetail=Ri;window.toggleDetailItem=Ni;window.selectVideoSpeed=Yi;window.saveTaskDetail=Ki;window.renderSExams=Nt;window.openStudentExamModal=Dn;window.openExamModal=Oi;window.renderNetInputs=Yt;window.saveExam=Ui;window.renderSMessages=Et;window.initRealtime=Kt;window.destroyRealtime=Ot;window.renderDevDashboard=Cn;window.renderDevUsers=mt;window.openDevUserModal=Gi;window.devDeleteUser=Wi;window.renderDevResources=Ze;window.openPlaylistModal=Vi;window.fetchYouTubePlaylist=Zi;window.savePlaylist=Ji;window.openResourceModal=Xi;window.saveResource=Qi;window.devDeleteResource=eo;window.renderDevFinance=ut;window.openPaymentModal=to;window.savePayment=no;window.openSubModal=ao;window.saveSub=io;window.renderDevAnnounce=Je;window.openAnnounceModal=oo;window.saveAnnounce=so;window.toggleAnnounce=ro;window.devDeleteAnnounce=lo;window.renderDevTickets=Ne;window.updateTicketStatus=go;window.devDeleteTicket=vo;window.selectDevTicket=co;window.sendDevReply=uo;window.openSupportTicket=yo;window.openSupportChat=gt;window.closeSupportChat=jn;window.startAISupportChat=fo;window.startEminSupportChat=xo;window.submitEminInitialMessage=bo;window.sendSupportMessage=ho;window.openSupportChatDirect=gt;window.checkCoachSubscription=Mt;window.showTrialExpiredScreen=At;window.loadAnnouncements=Pn;window.saveStudentDev=Wo;window.showOnboarding=ko;window.renderOnboardingStep=Ft;window.advanceOnboarding=wo;window.renderSProfil=Hn;window.saveStudentProfile=$o;window.changePassword=To;window.renderCoachProfile=Rn;window.updateProfilePreview=qt;window.switchPreviewTab=Eo;window.nl2br=Nn;window.saveCoachProfile=So;window.renderDevMatches=Ut;window.updateMatchRequestStatus=Io;window.openSpeedModal=_o;window.saveAllSpeeds=zo;window.openStudentNotes=Bo;window.saveStudentNote=Mo;window.openReportModal=Ao;window.getReportDates=Yn;window.buildReportHTML=Gt;window.previewReport=Do;window.generatePDF=Lo;window.openWeeklyPDFModal=jo;window.generateWeeklyPDF=Po;window.printWeeklyProgramWithNote=Kn;window.generateMeetLink=Ho;window.generateZoomLink=Ro;window.copyToClipboard=No;window.loadTheme=Fn;window.applyAccent=qn;window.setTheme=Yo;window.openThemePanel=Ko;window.initAIChatForRole=Un;window.toggleAIChat=Oo;window.aiQuickSend=Fo;window.buildAIContext=It;window.addAIMessage=ke;window.sendAIMessage=Gn;window.autoDetectModel=Wn;window.callGeminiFallback=Pe;window.generateAICopilotDraft=qo;window.checkCopilotDraftEdited=Uo;window.sendCopilotDraft=Go;window.renderParentHome=Vn;window.renderParentProgress=Zn;window.renderParentAI=Jn;window.applyResFilter=Vt;window.updateCRFilter=Vo;window.buildCRContent=yt;window.renderCoachResources=Xe;window.switchCRTab=Zo;window.compileResourceStats=Xn;window.openResourceModalCoach=Jo;window.fetchYtPlaylistCoach=Xo;window.saveResourceCoach=Qo;window.deleteResourceCoach=es;window.importResourcesFromExcel=ts;window.importStudentsFromExcel=ns;window.getTestStatus=Qn;window.openCoachTaskEdit=as;window.saveWeekAsTemplate=is;window.applyTemplateToWeek=os;window.confirmApplyTemplate=ss;window.copyTaskToClipboard=rs;window.pasteTaskFromClipboard=ds;window.copyTaskToWholeWeek=ls;window.pasteTaskToWholeWeek=cs;window.sendWhatsAppReport=Co;window.toggleUserMenu=wa;window.closeUserMenu=cn;window.renderAgenda=ge;window.openAgendaApptModal=yi;window.deleteAgendaAppt=fi;window.agendaPrev=li;window.agendaNext=ci;window.agendaToday=pi;window.agendaSetFilter=mi;window.exportAgendaICS=ui;window.openApptPopup=gi;window.handleApptDrop=vi;window.openStudentKaynaklar=Ba;window.addStudentBook=Ma;window.editStudentBook=Aa;window.sbUpdatePct=gn;window.saveStudentBook=Da;window.deleteStudentBook=La;window.loadTheme&&window.loadTheme();window.renderNetInputs&&window.renderNetInputs();window.checkOAuthSession&&window.checkOAuthSession();const vs=new URLSearchParams(window.location.search);if(vs.get("sandbox")==="true")window.simOAuthLogin&&setTimeout(()=>{console.log("Sandbox auto-login triggered for demokoc..."),window.simOAuthLogin("demokoc")},300);else if(window.location.search.includes("sandbox")||window.location.hash==="#sandbox"){const e=document.getElementById("demoQuickWrap");e&&(e.style.display="flex"),window.showGoogleSimulator&&setTimeout(()=>window.showGoogleSimulator(),300)}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("Service Worker başarıyla kaydedildi ✓",e.scope)}).catch(e=>{console.warn("Service Worker kaydı başarısız oldu:",e)})});window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==window.currentTab){if(!e){e={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[window.session.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&window.switchTab(e,!1)}});console.log("Rostrum Akademi App initialized successfully ✓");
