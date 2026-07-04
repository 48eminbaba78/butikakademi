(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const d={students:[],tasks:{},appointments:[],exams:[],messages:{},coachTodos:{},weekOffset:0,calMonth:new Date().getMonth(),calYear:new Date().getFullYear(),calSelDay:null,activeStuId:null,msgThread:null,workspace:null,studentSpeeds:[],konuHaftaSoru:[]},y={role:null,studentId:null,dbUser:null,coachId:null,childName:null};window.S=d;window.session=y;window._loginMode="email";window.STU_DEFAULT_PASS="Rostrum"+Math.floor(1e3+Math.random()*9e3);window.DAYS_TR=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];window.MONTHS_TR=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];window.EXAM_DEFS={TYT:["Türkçe","Matematik","Fen","Sosyal"],"AYT-SAY":["Matematik","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Edebiyat","Tarih","Coğrafya"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.EXAM_SORU={TYT:{Türkçe:40,Matematik:40,Fen:20,Sosyal:20},"AYT-SAY":{Matematik:40,Fizik:14,Kimya:13,Biyoloji:13},"AYT-EA":{Matematik:40,Edebiyat:24,Tarih:10,Coğrafya:6},"AYT-SOZ":{Edebiyat:24,Tarih1:10,Tarih2:11,Coğrafya1:6,Coğrafya2:11,Felsefe:12,Din:6}};window.EXAM_KONU_MAP={TYT_Türkçe:["Dil Bilgisi"],TYT_Matematik:["TYT Matematik","Geometri"],TYT_Fen:["TYT Fizik","TYT Kimya","TYT Biyoloji"],TYT_Sosyal:[],"AYT-SAY_Matematik":["AYT Matematik","Geometri"],"AYT-SAY_Fizik":["AYT Fizik"],"AYT-SAY_Kimya":["AYT Kimya"],"AYT-SAY_Biyoloji":["AYT Biyoloji"],"AYT-EA_Matematik":["AYT Matematik","Geometri"],"AYT-EA_Edebiyat":["Dil Bilgisi"]};window.SUBJECT_MAP={TYT:["Türkçe","Matematik","Geometri","Fizik","Kimya","Biyoloji","Tarih","Coğrafya","Felsefe","Din"],"AYT-SAY":["Matematik","Geometri","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Geometri","Edebiyat","Tarih","Coğrafya","Felsefe"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.currentTab="";window._clipboardTask=null;window._editingTaskId=null;window._regRole=null;window._onbRole=null;window._oauthUser=null;const Jn="https://imyhenrwmsmyikpollur.supabase.co",Xn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34",g=supabase.createClient(Jn,Xn);window.db=g;function le(){var e;try{localStorage.setItem("ba_ui_"+(((e=y.dbUser)==null?void 0:e.id)||"x"),JSON.stringify({weekOffset:d.weekOffset,activeStuId:d.activeStuId,calMonth:d.calMonth,calYear:d.calYear}))}catch{}}function Ye(){le()}function M(e){let t=document.getElementById("loadingOverlay");if(e&&!t){if(t=document.createElement("div"),t.id="loadingOverlay",t.style.cssText="position:fixed;inset:0;background:rgba(15,14,12,.8);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)",t.innerHTML='<div style="width:36px;height:36px;border:3px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div><div style="font-size:13px;color:var(--text-mid)">Yükleniyor...</div>',!document.getElementById("spinStyle")){const n=document.createElement("style");n.id="spinStyle",n.textContent="@keyframes spin{to{transform:rotate(360deg)}}",document.head.appendChild(n)}document.body.appendChild(t)}else!e&&t&&t.remove()}function u(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function H(e){return e instanceof Date?e.toISOString().split("T")[0]:e}function q(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}function $e(){return H(new Date)}function $t(e){return e>=20?"good":e>=12?"mid":"low"}function Ke(e){return{deneme:"📊 Deneme",soru:"📚 Soru",konu:"🎯 Konu",diger:"⭐ Diğer"}[e]||e}function Y(e){document.getElementById(e).classList.add("open")}function K(e){document.getElementById(e).classList.remove("open")}function x(e){const t=document.getElementById("toast");t.textContent=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),2300)}document.addEventListener("click",e=>{e.target.classList.contains("modal-bg")&&e.target.classList.remove("open")});document.addEventListener("keydown",e=>{e.key==="Escape"&&document.querySelectorAll(".modal-bg.open").forEach(t=>t.classList.remove("open"))});function W(e,t=0){const n=new Date,a=n.getDay(),o=(a===0?6:a-1)-t,s=new Date(n);return s.setDate(n.getDate()-(o+7)%7+e*7),s.setHours(0,0,0,0),s}function Qn(){const e=d.students.find(t=>t.id===d.activeStuId);return(e==null?void 0:e.weekStart)??0}async function Te(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return[...new Uint8Array(t)].map(n=>n.toString(16).padStart(2,"0")).join("")}function he(e){return e?e.trim().toLowerCase().replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u").replace(/i̇/g,"i").replace(/ı/g,"i").replace(/i/g,"i").replace(/\s+/g,"").replace(/\u0307/g,""):""}function ea(){if(!("Notification"in window)){console.log("Bu tarayıcı anlık bildirimleri desteklemiyor.");return}Notification.permission!=="granted"&&Notification.permission!=="denied"?Notification.requestPermission().then(e=>{e==="granted"&&x("Bildirim izinleri onaylandı ✓")}):Notification.permission==="granted"?x("Bildirim izinleri zaten açık ✓"):x("Bildirim izinleri tarayıcı ayarlarından engellenmiş.")}window.saveUI=le;window.saveS=Ye;window.showLoading=M;window.esc=u;window.fmtDate=H;window.addDays=q;window.todayStr=$e;window.netColor=$t;window.typeLabel=Ke;window.om=Y;window.cm=K;window.showToast=x;window.getWeekStart=W;window.getStudentWeekStart=Qn;window.sha256=Te;window.normalizeUsername=he;window.requestNotificationPermission=ea;async function ta(e,t={}){let n=g.from(e).select("*");Object.entries(t).forEach(([o,s])=>{n=n.eq(o,s)});const{data:a,error:i}=await n;return i&&console.error(e,i),a||[]}const na=4*60*1e3;function Tt(){return"ra_d_"+(y.coachId||y.studentId||"x")}function Vt(){try{localStorage.removeItem(Tt())}catch{}}function Gt(){try{localStorage.setItem(Tt(),JSON.stringify({ts:Date.now(),students:d.students,tasks:d.tasks,appointments:d.appointments,exams:d.exams,messages:d.messages,coachTodos:d.coachTodos,studentSpeeds:d.studentSpeeds,workspace:d.workspace,konuHaftaSoru:d.konuHaftaSoru}))}catch{}}function aa(){try{const e=localStorage.getItem(Tt());if(!e)return!1;const t=JSON.parse(e);return!t.ts||Date.now()-t.ts>na?!1:(t.students&&(d.students=t.students),t.tasks&&(d.tasks=t.tasks),t.appointments&&(d.appointments=t.appointments),t.exams&&(d.exams=t.exams),t.messages&&(d.messages=t.messages),t.coachTodos&&(d.coachTodos=t.coachTodos),t.studentSpeeds&&(d.studentSpeeds=t.studentSpeeds),t.workspace&&(d.workspace=t.workspace),t.konuHaftaSoru&&(d.konuHaftaSoru=t.konuHaftaSoru),!0)}catch{return!1}}async function Wt(){var T;const e=y.coachId,t=y.role,n=t==="coach"||t==="developer"?g.from("workspaces").select("*").eq("coach_id",e).single():Promise.resolve({data:null});let a=g.from("users").select("*").eq("role","student");t==="student"?a=a.eq("id",y.studentId):(t==="coach"||t==="developer")&&(a=a.eq("coach_id",e));const i=a,o=new Date;o.setDate(o.getDate()-60);const s=o.toISOString().split("T")[0],r=new Date;r.setDate(r.getDate()-30);const l=r.toISOString().split("T")[0],c=t==="student"?g.from("tasks").select("*").eq("student_id",y.studentId).gte("date",s):t==="coach"||t==="developer"?g.from("tasks").select("*").eq("coach_id",e).gte("date",s):g.from("tasks").select("*").gte("date",s),p=t==="student"?g.from("appointments").select("*").eq("student_id",y.studentId).gte("date",l):t==="coach"||t==="developer"?g.from("appointments").select("*").eq("coach_id",e).gte("date",l):g.from("appointments").select("*").gte("date",l),m=t==="student"?g.from("exams").select("*").eq("student_id",y.studentId):t==="coach"||t==="developer"?g.from("exams").select("*").eq("coach_id",e):g.from("exams").select("*"),v=t==="student"?g.from("messages").select("*").eq("student_id",y.studentId).order("created_at",{ascending:!1}).limit(200):t==="coach"||t==="developer"?g.from("messages").select("*").eq("coach_id",e).order("created_at",{ascending:!1}).limit(200):g.from("messages").select("*").order("created_at",{ascending:!1}).limit(200),w=t==="coach"||t==="developer"?g.from("coach_todos").select("*").eq("coach_id",e):Promise.resolve({data:[]}),E=t==="student"?g.from("student_speeds").select("*").eq("student_id",y.studentId):t==="coach"||t==="developer"?g.from("student_speeds").select("*").eq("coach_id",e):g.from("student_speeds").select("*"),_=t==="coach"||t==="developer"?g.from("konu_hafta_soru").select("*").eq("coach_id",e):t==="student"?g.from("konu_hafta_soru").select("*").eq("student_id",y.studentId):Promise.resolve({data:[]}),[b,h,$,S,z,D,k,B,I]=await Promise.all([n,i,c,p,m,v,w,E,_]);(t==="coach"||t==="developer")&&(d.workspace=b.data||null),d.students=(h.data||[]).map(f=>({id:f.id,name:f.full_name||f.username||"Öğrenci",target:f.target||"",color:f.color||"#4da6ff",progress:f.progress||0,weekStart:f.week_start||0,username:f.username,coachId:f.coach_id})),d.tasks={},($.data||[]).forEach(f=>{const L=`${f.student_id}_${f.date}`;d.tasks[L]||(d.tasks[L]=[]),d.tasks[L].push({_id:f.id,type:f.type,exam:f.exam_type,subject:f.subject,duration:f.duration,note:f.note,done:f.done,student_note:f.student_note||"",student_result:f.student_result||null,task_items:f.task_items})}),d.appointments=(S.data||[]).map(f=>({id:f.id,studentId:f.student_id,date:f.date,time:f.time,duration:f.duration,type:f.type,note:f.note,meetLink:f.meet_link})),d.exams=(z.data||[]).map(f=>({id:f.id,studentId:f.student_id,name:f.name,date:f.date,type:f.exam_type,nets:f.nets||{},examDetails:f.exam_details||{},note:f.student_note,coachComment:f.coach_comment})),d.messages={},(D.data||[]).forEach(f=>{d.messages[f.student_id]||(d.messages[f.student_id]=[]),d.messages[f.student_id].push({_id:f.id,from:f.from_role,text:f.text,read:f.read,time:new Date(f.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})})}),Object.keys(d.messages).forEach(f=>d.messages[f].sort((L,j)=>L._id>j._id?1:-1)),d.coachTodos={},(k.data||[]).forEach(f=>{d.coachTodos[f.date]||(d.coachTodos[f.date]=[]),d.coachTodos[f.date].push({_id:f.id,task:f.task,note:f.note,done:f.done})}),d.studentSpeeds=B.data||[],d.konuHaftaSoru=I.data||[];try{const f=JSON.parse(localStorage.getItem("ba_ui_"+((T=y.dbUser)==null?void 0:T.id))||"{}");f.weekOffset!==void 0&&(d.weekOffset=f.weekOffset),f.activeStuId&&(d.activeStuId=f.activeStuId),f.calMonth!==void 0&&(d.calMonth=f.calMonth,d.calYear=f.calYear)}catch{}}async function Zt(){if(aa()){Wt().then(()=>{if(Gt(),window.currentTab)try{window.switchTab(window.currentTab)}catch{}}).catch(t=>console.error("Arka plan yenileme hatası:",t));return}M(!0);try{await Wt(),Gt()}catch(t){console.error("loadAllData error",t)}M(!1)}window.dbQ=ta;window.loadAllData=Zt;window.invalidateCache=Vt;let ut=!1;function se(e){const t=document.getElementById("loginErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function Le(e){const t=document.getElementById("regErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function Jt(e){document.getElementById("loginPanel").style.display=e==="login"?"block":"none",document.getElementById("registerPanel").style.display=e==="register"?"block":"none",document.getElementById("lmtLogin").classList.toggle("active",e==="login"),document.getElementById("lmtRegister").classList.toggle("active",e==="register")}function ia(e){window._loginMode=e,document.querySelectorAll("#loginTabs .login-tab").forEach((t,n)=>t.classList.toggle("active",n===(e==="email"?0:1))),document.getElementById("loginEmailField").style.display=e==="email"?"block":"none",document.getElementById("loginUserField").style.display=e==="username"?"block":"none"}function oa(e){window._regRole=e,document.getElementById("rrbCoach").classList.toggle("sel",e==="coach"),document.getElementById("rrbStudent").classList.toggle("sel",e==="student")}function sa(e){window._onbRole=e,document.getElementById("onbRoleCoach").classList.toggle("sel",e==="coach"),document.getElementById("onbRoleStudent").classList.toggle("sel",e==="student")}async function ra(){if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.protocol==="file:"){Qt();return}await Xt()}async function Xt(){Et(),M(!0);try{const{error:e}=await g.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/app.html",queryParams:{access_type:"offline",prompt:"select_account"}}});e&&(M(!0),console.warn("Google Auth failed:",e),se("Google Girişi Başlatılamadı: "+e.message))}catch(e){M(!1),se("Google Girişi Başlatılamadı: "+e.message)}}function Qt(){document.getElementById("googleSimulatorModal").style.display="flex"}function Et(){document.getElementById("googleSimulatorModal").style.display="none"}async function da(e){if(Et(),M(!0),e==="demokoc"){const{data:t,error:n}=await g.from("users").select("*").eq("username","demokoc").maybeSingle();if(n||!t){M(!1),se("Demo koç profili bulunamadı!");return}await ke(t)}else if(e==="demoogrenci"){const{data:t,error:n}=await g.from("users").select("*").eq("username","demoogrenci").maybeSingle();if(n||!t){M(!1),se("Demo öğrenci profili bulunamadı!");return}await ke(t)}else if(e==="new"){M(!1),document.getElementById("newUserOnboarding").style.display="flex";const t=Math.floor(1e3+Math.random()*9e3),n=`yeni.kullanici${t}@gmail.com`;document.getElementById("onbEmail").textContent=n,document.getElementById("onbName").value=`Yeni Kullanıcı ${t}`,window._oauthUser={id:`mock-google-id-${t}`,email:n,user_metadata:{full_name:`Yeni Kullanıcı ${t}`}}}}async function en(){var e,t;if(!ut)try{const{data:{session:n}}=await g.auth.getSession();if(!(n!=null&&n.user)||(e=document.getElementById("appShell"))!=null&&e.classList.contains("visible")||ut)return;ut=!0,M(!0);const{data:a}=await g.from("users").select("*").eq("id",n.user.id).maybeSingle();let i=!1;if(a){if(a.role==="coach"){const{data:o}=await g.from("workspaces").select("*").eq("coach_id",a.id).maybeSingle();(!o||!o.onboarding_done)&&(i=!0)}}else i=!0;a&&!i?await ke(a):(M(!1),document.getElementById("newUserOnboarding").style.display="flex",document.getElementById("onbEmail").textContent=n.user.email,document.getElementById("onbName").value=((t=n.user.user_metadata)==null?void 0:t.full_name)||"",window._oauthUser=n.user)}catch(n){M(!1),console.warn("[checkOAuthSession]",n)}}async function la(){const e=document.getElementById("onbName").value.trim();if(!e){document.getElementById("onbErr").textContent="Ad soyad zorunlu",document.getElementById("onbErr").style.display="block";return}if(!window._onbRole){document.getElementById("onbErr").textContent="Hesap türü seçin",document.getElementById("onbErr").style.display="block";return}document.getElementById("onbErr").style.display="none",M(!0);const t=window._oauthUser,n=e.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""),a={id:t.id,full_name:e,email:t.email,role:window._onbRole,username:n+"_"+Math.random().toString(36).slice(2,6),password_hash:"supabase_managed",color:window._onbRole==="coach"?"#f0a500":"#4da6ff",week_start:0,progress:0,target:""},{data:i,error:o}=await g.from("users").upsert(a).select().single();if(o){M(!1),document.getElementById("onbErr").textContent="Hata: "+o.message,document.getElementById("onbErr").style.display="block";return}document.getElementById("newUserOnboarding").style.display="none",await ke(i)}async function ca(){const e=document.getElementById("regName").value.trim(),t=document.getElementById("regEmail").value.trim().toLowerCase(),n=document.getElementById("regPass").value;if(!e||!t||!n)return Le("Tüm alanlar zorunlu");if(n.length<8)return Le("Şifre en az 8 karakter olmalıdır");if(!window._regRole)return Le("Hesap türü seçin");M(!0);try{const{data:a,error:i}=await g.auth.signUp({email:t,password:n,options:{data:{full_name:e,role:window._regRole}}});if(i)throw i;if(a!=null&&a.user){M(!1),document.getElementById("regName").value="",document.getElementById("regEmail").value="",document.getElementById("regPass").value="";const o=document.getElementById("regSuccess");o.textContent="Kayıt başarılı! E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğrulama yaptıktan sonra giriş yapın.",o.style.display="block",setTimeout(()=>o.style.display="none",1e4),Jt("login")}}catch(a){M(!1),Le("Kayıt Hatası: "+a.message)}}async function pa(){const e=(document.getElementById("loginEmail").value||document.getElementById("loginUser").value||"").trim(),t=document.getElementById("loginPass").value;if(!e||!t)return se("Kullanıcı adı ve şifre zorunlu");M(!0);try{let n=e;n.includes("@")?n=n.toLowerCase():n=he(e)+"@rostrumakademi.com";const{data:a,error:i}=await g.auth.signInWithPassword({email:n,password:t});if(!i&&(a!=null&&a.user)){const{data:o,error:s}=await g.from("users").select("*").eq("id",a.user.id).maybeSingle();if(s&&console.error("Profile fetch error:",s),o){await ke(o);return}return M(!1),se("Hesabınız veritabanında aktif değil.")}try{const o=he(e.includes("@")?e.split("@")[0]:e),s=await Te(t),{data:r}=await g.rpc("get_user_by_credentials",{p_username:o,p_password_hash:s}),l=Array.isArray(r)?r[0]:r;if(l){await ke(l);return}}catch(o){console.warn("Fallback RPC error:",o)}return M(!1),se(i?"Giriş başarısız: "+i.message:"Kullanıcı adı veya şifre hatalı.")}catch(n){return M(!1),console.error("[doLogin]",n),se("Giriş hatası: "+n.message)}}async function ke(e){M(!1);const t=e.role==="coach"||e.role==="developer"?e.id:e.role==="student"||e.role==="parent"?e.coach_id:null;y.role=e.role,y.studentId=e.role==="student"?e.id:null,y.dbUser=e,y.coachId=t,document.getElementById("loginScreen").style.display="none",document.getElementById("appShell").classList.add("visible");try{if(await Zt(),y.role==="student"&&(d.activeStuId=e.id,y.studentId=e.id,d.students.find(o=>o.id===e.id)||d.students.push({id:e.id,name:e.full_name||e.username||"Öğrenci",target:e.target||"",color:e.color||"#4da6ff",progress:e.progress||0,weekStart:e.week_start||0,username:e.username,coachId:e.coach_id})),y.role==="parent"){const{data:o}=await g.from("users").select("*").eq("parent_id",e.id).single();o&&(d.activeStuId=o.id,y.studentId=o.id,y.childName=o.full_name||o.username)}if(window.setupShell(),document.getElementById("aiChatBubble").style.display="flex",(y.role==="coach"||y.role==="developer")&&(!d.workspace||!d.workspace.onboarding_done)){window.switchTab("home"),window.showOnboarding();return}const n=window.location.hash.substring(1),a={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[y.role]||"portal",i=n&&document.getElementById("view-"+n)?n:a;setTimeout(()=>window.switchTab(i),50)}catch(n){M(!1),console.error("[doLogin] HATA:",n),se("Hata: "+n.message),document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible")}}function ma(){window.destroyRealtime&&window.destroyRealtime(),g.auth.signOut().catch(()=>{}),Vt(),y.role=null,y.studentId=null,y.dbUser=null,y.coachId=null,y.childName=null,d.workspace=null,document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible"),document.getElementById("aiChatBubble").style.display="none",document.getElementById("aiChatPanel").classList.remove("open"),document.getElementById("loginEmail")&&(document.getElementById("loginEmail").value=""),document.getElementById("loginUser")&&(document.getElementById("loginUser").value=""),document.getElementById("loginPass").value="",window.location.hash=""}function ua(){window.om("forgotPassModal")}async function va(){const e=document.getElementById("forgotEmail").value.trim();if(!e)return;const t=document.getElementById("forgotMsg");try{const{error:n}=await g.auth.resetPasswordForEmail(e,{redirectTo:window.location.origin+"/app.html"});if(n)throw n;t.style.display="block",t.style.background="var(--green-dim)",t.style.color="var(--green)",t.textContent="Sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin."}catch(n){t.style.display="block",t.style.background="var(--red-dim)",t.style.color="var(--red)",t.textContent="Hata: "+(n.message||"Bir sorun oluştu.")}}window.loginErr=se;window.regErr=Le;window.setAuthMode=Jt;window.setLoginMode=ia;window.setRegRole=oa;window.setOnbRole=sa;window.loginWithGoogle=ra;window.triggerRealGoogleLogin=Xt;window.showGoogleSimulator=Qt;window.closeGoogleSimulator=Et;window.simOAuthLogin=da;window.checkOAuthSession=en;window.completeOnboarding=la;window.doRegister=ca;window.doLogin=pa;window.finishLogin=ke;window.doLogout=ma;window.showForgotPassword=ua;window.sendResetEmail=va;g.auth.onAuthStateChange(async(e,t)=>{var n;if(e==="SIGNED_IN"&&(t!=null&&t.user)){if((n=document.getElementById("appShell"))!=null&&n.classList.contains("visible"))return;await en()}});function Re(e){if(!e||e<=0)return"0 sa";const t=Math.floor(e/60),n=e%60;return t>0&&n>0?`${t} sa ${n} dk`:t>0?`${t} sa`:`${n} dk`}window.formatMinToHours=Re;function Z(e){return new Promise(t=>{let n=document.getElementById("customConfirmModal");n||(n=document.createElement("div"),n.id="customConfirmModal",n.className="modal-bg",n.style.zIndex="999999",n.innerHTML=`
        <div class="modal" style="max-width:360px;text-align:center;padding:24px 20px;border-radius:16px;background:var(--surface);border:1px solid var(--border)">
          <div style="font-size:32px;margin-bottom:12px">⚠️</div>
          <div id="confirmMessage" style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:20px;line-height:1.5"></div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost" id="confirmCancelBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px">İptal</button>
            <button class="btn btn-accent" id="confirmOkBtn" style="flex:1;justify-content:center;padding:10px;border-radius:10px;background:#ef4444;border-color:#ef4444;color:#fff">Tamam</button>
          </div>
        </div>
      `,document.body.appendChild(n),n.addEventListener("click",r=>{r.target===n&&(n.classList.remove("open"),t(!1))})),n.querySelector("#confirmMessage").textContent=e;const a=n.querySelector("#confirmOkBtn"),i=n.querySelector("#confirmCancelBtn"),o=a.cloneNode(!0),s=i.cloneNode(!0);a.parentNode.replaceChild(o,a),i.parentNode.replaceChild(s,i),n.classList.add("open"),o.focus(),o.onclick=()=>{n.classList.remove("open"),t(!0)},s.onclick=()=>{n.classList.remove("open"),t(!1)}})}window.customConfirm=Z;function It(){const e=y.dbUser;if(!e||y.role!=="coach"&&y.role!=="developer"||e.email==="ceylanemin1928@gmail.com"||e.email==="simkoc1@rostrumakademi.com"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.__testMode)return;if((e.plan||"trial")==="trial"){const n=e.trial_ends_at?new Date(e.trial_ends_at):new Date(new Date(e.created_at).getTime()+12096e5);new Date>n&&St()}}function St(){let e=document.getElementById("trialExpiredModal");e?e.classList.add("open"):(e=document.createElement("div"),e.id="trialExpiredModal",e.className="modal-bg open",e.style.zIndex="9999999",e.innerHTML=`
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
    `,document.body.appendChild(e))}window.openSupportChatDirect=lt;window.checkCoachSubscription=It;window.showTrialExpiredScreen=St;const bt=[{id:"home",lbl:"🏠",name:"Ana Sayfa"},{id:"students",lbl:"👤",name:"Öğrencilerim"},{id:"todolist",lbl:"📅",name:"Ajanda"},{id:"coach-resources",lbl:"📚",name:"Kaynaklarım"},{id:"coach-applications",lbl:"📩",name:"Başvurular"}],tn=[{id:"portal",lbl:"🏠",name:"Ana Sayfa"},{id:"sportal",lbl:"📋",name:"Programım"},{id:"sexams",lbl:"📊",name:"Denemeler"},{id:"smessages",lbl:"💬",name:"Koçuma Yaz"},{id:"sprofil",lbl:"👤",name:"Profilim"}],nn=[{id:"dev-tickets",lbl:"🎫",name:"Destek"}],an=[{id:"parent-home",lbl:"🏠",name:"Ana Sayfa"},{id:"parent-progress",lbl:"📊",name:"İlerleme"},{id:"parent-messages",lbl:"💬",name:"Koça Yaz"},{id:"parent-ai",lbl:"🤖",name:"AI Asistan"}];function ga(){var e;(e=document.getElementById("mainSidebar"))==null||e.classList.toggle("open")}function ya(){var e;(e=document.getElementById("tnUserMenu"))==null||e.classList.toggle("open")}function on(){var e;(e=document.getElementById("tnUserMenu"))==null||e.classList.remove("open")}document.addEventListener("click",e=>{const t=document.getElementById("tnUserWrap");t&&!t.contains(e.target)&&on()});function fa(){var c;It();const e=y.role==="coach"?bt:y.role==="developer"?[...bt,...nn]:y.role==="parent"?an:tn;document.getElementById("sidebarNav").innerHTML=e.map(p=>`
    <div class="tn-nav-item" id="sbi_${p.id}" onclick="switchTab('${p.id}')">
      <span>${p.lbl}</span>
      <span>${p.name}</span>
    </div>`).join(""),document.getElementById("mobileNav").innerHTML=e.slice(0,5).map(p=>`
    <button class="mnav-btn" id="mntab_${p.id}" onclick="switchTab('${p.id}')">${p.lbl}<span style="font-size:9px;display:block">${p.name}</span></button>`).join(""),document.getElementById("mainContent").innerHTML=[...e,{id:"student-detail"},{id:"profile"},{id:"settings"},{id:"coach-resources"},{id:"coach-applications"},{id:"coach-notes"},{id:"coach-profile"},{id:"messages"},{id:"todolist"},{id:"program"},{id:"appointments"},{id:"exams"}].map(p=>`<div class="view" id="view-${p.id}"></div>`).join("");const t=y.dbUser,n=y.role==="student"?d.students.find(p=>p.id===y.studentId):null,a=(t==null?void 0:t.full_name)||(n==null?void 0:n.name)||"",i=a.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),o={coach:"#f0a500",student:(n==null?void 0:n.color)||"#4da6ff",developer:"#c084fc",parent:"#3ecf8e"},s={coach:"KOÇ",student:"ÖĞRENCİ",developer:"DEV",parent:"VELİ"};if(document.getElementById("sbAv").textContent=i,document.getElementById("sbAv").style.background=o[y.role]||"#888",document.getElementById("sbName").textContent=a,document.getElementById("sbRole").textContent=s[y.role]||y.role,(y.role==="coach"||y.role==="developer")&&((c=d.workspace)!=null&&c.brand_name)){const p=document.querySelector(".sb-logo-text");p&&(p.textContent=d.workspace.brand_name);const m=document.querySelector(".tn-logo .sb-logo-icon");m&&(m.textContent=d.workspace.brand_name.slice(0,1).toUpperCase())}const r=document.getElementById("sb-site-admin");r&&(r.style.display=y.role==="developer"?"flex":"none");const l=document.getElementById("tnCoachProfileItem");l&&(l.style.display=y.role==="coach"||y.role==="developer"?"flex":"none"),Nn(),setTimeout(Mn,600),(y.role==="coach"||y.role==="developer")&&g.from("match_requests").select("id",{count:"exact",head:!0}).eq("matched_coach_id",y.coachId).eq("status","pending").then(({count:p})=>{if(p>0){const m=document.getElementById("sbi_coach-applications");if(m&&!m.querySelector(".sb-badge")){const v=document.createElement("span");v.className="sb-badge",v.textContent=p,m.appendChild(v)}}})}function X(e,t=!0){var c,p;if(!e)return;currentTab=e,t&&(window.location.hash=e),document.querySelectorAll(".tn-nav-item").forEach(m=>m.classList.remove("active"));const n=document.getElementById("sbi_"+e)||document.getElementById("sb-"+e);n&&n.classList.add("active"),document.querySelectorAll(".view").forEach(m=>m.classList.remove("active"));const a=document.getElementById("view-"+e);a&&a.classList.add("active");const o=[...bt,...tn,...nn,...an,{id:"profile",name:"Profil"},{id:"settings",name:"Ayarlar"},{id:"student-detail",name:((c=d.students.find(m=>m.id===d.activeStuId))==null?void 0:c.name)||"Öğrenci"},{id:"program",name:"Program"},{id:"appointments",name:"Randevular"},{id:"exams",name:"Denemeler"}].find(m=>m.id===e),s=document.getElementById("tbarTitle");s&&(s.textContent=(o==null?void 0:o.name)||e);const r={home:sn,students:Oe,messages:In,"coach-applications":qt,"coach-notes":Wn,todolist:xn,portal:st,sportal:Ee,sexams:Lt,smessages:ht,sprofil:An,profile:ln,settings:cn,"student-detail":()=>{d.activeStuId?rn(d.activeStuId):X("students")},program:()=>{d.activeStuId?_t(d.activeStuId):X("students")},exams:()=>{d.activeStuId?De():X("students")},appointments:()=>{d.activeStuId?Fe():X("students")},"dev-dashboard":zn,"dev-users":rt,"dev-resources":qe,"dev-finance":dt,"dev-announce":Ue,"dev-tickets":Ce,"parent-home":On,"parent-progress":Fn,"parent-messages":ht,"parent-ai":qn,"coach-profile":Dn,"dev-matches":Yt,"coach-resources":Ge};try{(p=r[e])==null||p.call(r)}catch(m){console.error("[switchTab] Render error for tab:",e,m),a&&(a.innerHTML=`<div style="padding:24px;color:var(--text)"><b>Hata Oluştu ⚠️</b><p style="color:var(--text-mid);margin-top:6px">${u(m.message)}</p><pre style="font-size:10px;color:var(--text-dim);white-space:pre-wrap;margin-top:8px">${u((m.stack||"").slice(0,400))}</pre></div>`)}e==="messages"||e==="smessages"?Pt():Rt();const l=document.getElementById("aiChatBubble");l&&(e==="dev-tickets"||e.startsWith("dev-")?l.style.display="none":(y.role==="student"||y.role==="coach"||y.role==="parent")&&(l.style.display="flex"))}function sn(){var t,n;const e=document.getElementById("view-home");if(e)try{const a=new Date,i=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],o=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],s=H(a);let r=0;Object.values(d.messages).forEach(k=>{r+=k.filter(B=>B.from==="student"&&!B.read).length});const l=d.appointments.filter(k=>k.date===s).sort((k,B)=>k.time.localeCompare(B.time)),c=[],p=W(0,0);(d.students||[]).forEach(k=>{let B=0,I=0;for(let A=0;A<7;A++){const C=H(q(p,A)),P=d.tasks[`${k.id}_${C}`]||[];B+=P.length,I+=P.filter(R=>R.done).length}const T=B>0?Math.round(I/B*100):0;B>0&&T<30&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"tasks",icon:"📋",title:"Düşük Görev",desc:`Bu haftaki görev tamamlama oranı <b>%${T}</b>'de kaldı (${I}/${B} görev tamamlandı).`});const f=(d.exams||[]).filter(A=>A.studentId===k.id).sort((A,C)=>new Date(C.date).getTime()-new Date(A.date).getTime()),L={};if(f.forEach(A=>{L[A.type]||(L[A.type]=[]),L[A.type].push(A)}),Object.entries(L).forEach(([A,C])=>{if(C.length>=2){const P=C[0],R=C[1],F=Object.values(P.nets||{}).reduce((ae,ee)=>ae+Number(ee||0),0),N=Object.values(R.nets||{}).reduce((ae,ee)=>ae+Number(ee||0),0),G=F-N;G<-5&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"exams",icon:"📉",title:`Net Düşüşü (${A})`,desc:`Son denemede <b>${F} net</b> yaptı. Önceki denemesine (${N} net) göre <b>${Math.abs(G).toFixed(1)} net düşüş</b>.`})}}),B===0&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"noplan",icon:"📭",title:"Program Yok",desc:"Bu hafta için henüz hiç görev eklenmemiş."}),B>0&&I===0){let A=!1;for(let C=0;C<3;C++){const P=H(q(a,-C));if((d.tasks[`${k.id}_${P}`]||[]).length>0){A=!0;break}}A&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"inactive",icon:"💤",title:"3 Gündür Pasif",desc:"Son 3 gündür hiçbir görev tamamlanmadı. İletişime geç!"})}B>0&&I===B&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"perfect",icon:"🏆",title:"Harika Hafta!",desc:`Bu haftaki tüm ${B} görevi tamamladı! Tebrik et.`}),(d.studentSpeeds||[]).filter(A=>A.student_id===k.id).forEach(A=>{let C=120;A.exam_type==="TYT"?["Türkçe","Sosyal"].includes(A.subject)?C=100:["Matematik","Fen"].includes(A.subject)&&(C=130):A.exam_type&&A.exam_type.startsWith("AYT")&&(C=180),A.secs_per_question>C&&c.push({studentId:k.id,studentName:k.name,color:k.color,type:"speed",icon:"⚡",title:`Hız Aşımı (${A.exam_type} - ${A.subject})`,desc:`Soru çözüm hızı <b>${A.secs_per_question} sn/soru</b> (Limit: ${C} sn).`})})});let m="";if(c.length===0)m=`
      <div style="text-align:center;padding:16px;color:var(--text-dim);font-size:13px">
        ✅ Harika! Şu an için kritik bir performans düşüşü veya uyarı bulunmuyor.
      </div>`;else{const k={perfect:{badge:"#3ecf8e",badgeBg:"rgba(62,207,142,.12)",border:"rgba(62,207,142,.25)"},noplan:{badge:"#f0a500",badgeBg:"rgba(240,165,0,.1)",border:"rgba(240,165,0,.2)"},inactive:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},tasks:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},exams:{badge:"#ff5c7a",badgeBg:"rgba(255,92,122,.08)",border:"rgba(255,92,122,.2)"},speed:{badge:"#f0a500",badgeBg:"rgba(240,165,0,.1)",border:"rgba(240,165,0,.2)"}};m=c.map(B=>{const I=k[B.type]||k.tasks;return`<div style="cursor:pointer;padding:10px 12px;margin-bottom:8px;border-radius:8px;background:${I.badgeBg};border:1px solid ${I.border};display:flex;align-items:center;gap:10px;transition:opacity .15s" onclick="openStudentDetail('${B.studentId}')" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
        <div style="font-size:18px;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0">${B.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px">
            <span style="font-size:13px;font-weight:700">${u(B.studentName)}</span>
            <span style="font-size:10px;font-weight:700;color:${I.badge};white-space:nowrap">${B.title}</span>
          </div>
          <div style="font-size:11px;color:var(--text-mid);line-height:1.4">${B.desc}</div>
        </div>
      </div>`}).join("")}const v=a.getHours(),w=v<6?"İyi geceler":v<12?"Günaydın":v<18?"İyi günler":"İyi akşamlar",E=`${String(v).padStart(2,"0")}:${String(a.getMinutes()).padStart(2,"0")}`,_=l.find(k=>k.time>=E),b=new Date(2026,5,14),h=Math.max(0,Math.ceil((b-a)/(1e3*60*60*24))),$=W(0,0);let S=0,z=0;d.students.forEach(k=>{for(let B=0;B<7;B++){const I=d.tasks[`${k.id}_${H(q($,B))}`]||[];S+=I.length,z+=I.filter(T=>T.done).length}});const D=S>0?Math.round(z/S*100):0;e.innerHTML=`
    <!-- HERO -->
    <div class="home-hero">
      <div class="home-hero-left">
        <div class="home-hero-greeting">${w},</div>
        <div class="home-hero-name">${u(((n=(t=y.dbUser)==null?void 0:t.full_name)==null?void 0:n.split(" ")[0])||"Koç")} 👋</div>
        <div class="home-hero-date">${i[a.getDay()]}, ${a.getDate()} ${o[a.getMonth()]} ${a.getFullYear()}</div>
      </div>
      <div class="home-hero-right">
        <div class="home-yks-badge">
          <div class="home-yks-num">${h}</div>
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
        <div class="hsv2-val">${d.students.length}</div>
        <div class="hsv2-lbl">Aktif Öğrenci</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('students')" title="Öğrencilere git — randevu sekmesi">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap hsv2-blue">📅</span>
          <span class="hsv2-trend" style="color:var(--blue)">${_?_.time:"—"}</span>
        </div>
        <div class="hsv2-val" style="color:var(--blue)">${l.length}</div>
        <div class="hsv2-lbl">Bugün Randevu</div>
        <div class="hsv2-sub">${_?`Sıradaki: ${_.time}`:"Randevu tamamlandı"}</div>
      </div>
      <div class="hsv2-card" onclick="switchTab('messages')" title="Mesajlara git">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${r>0?"hsv2-red":"hsv2-green"}">💬</span>
          ${r>0?`<span class="hsv2-badge-red">${r} yeni</span>`:'<span class="hsv2-badge-green">Temiz</span>'}
        </div>
        <div class="hsv2-val" style="color:${r>0?"var(--red)":"var(--green)"}">${r}</div>
        <div class="hsv2-lbl">Okunmamış Mesaj</div>
        <div class="hsv2-sub">${r>0?"Yanıt bekliyor":"Tüm mesajlar okundu"}</div>
      </div>
      <div class="hsv2-card" title="Haftalık görev durumu">
        <div class="hsv2-top">
          <span class="hsv2-icon-wrap ${D>=70?"hsv2-green":D>=40?"hsv2-amber":"hsv2-red"}">📋</span>
          <span class="hsv2-trend" style="color:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}">%${D}</span>
        </div>
        <div class="hsv2-val" style="color:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}">${z}<span style="font-size:18px;font-weight:500;color:var(--text-dim)">/${S}</span></div>
        <div class="hsv2-lbl">Haftalık Görev</div>
        <div class="hsv2-progress"><div class="hsv2-bar" style="width:${D}%;background:${D>=70?"var(--green)":D>=40?"var(--accent)":"var(--red)"}"></div></div>
      </div>
    </div>

    <!-- ALT GRID: Uyarılar + Randevular -->
    <div class="home-bottom-grid">
      <div class="home-section-card ${c.length>0?"hsc-has-alerts":""}">
        <div class="hsc-head">
          <span class="hsc-head-icon">${c.length>0?"⚠️":"✅"}</span>
          <span class="hsc-head-title">Erken Uyarılar</span>
          <span class="hsc-pill ${c.length>0?"hsc-pill-red":"hsc-pill-green"}">${c.length>0?c.length+" uyarı":"Temiz"}</span>
        </div>
        <div class="hsc-body">${m}</div>
      </div>
      <div class="home-section-card">
        <div class="hsc-head">
          <span class="hsc-head-icon">📅</span>
          <span class="hsc-head-title">Bugünün Randevuları</span>
          <span class="hsc-pill">${l.length} randevu</span>
        </div>
        <div class="hsc-body">
          ${l.length===0?'<div class="hsc-empty">Bugün randevu yok</div>':""}
          ${l.map(k=>{const B=d.students.find(T=>T.id===k.studentId),I=k.time<E;return`<div class="hsc-appt-row ${I?"hsc-appt-past":""}">
              <div class="hsc-appt-time">${k.time}</div>
              <div class="hsc-appt-bar" style="background:${(B==null?void 0:B.color)||"var(--accent)"}"></div>
              <div style="flex:1;min-width:0">
                <div class="hsc-appt-name">${u((B==null?void 0:B.name)||"?")}</div>
                <div class="hsc-appt-meta">${u(k.type)} · ${k.duration} dk${k.meet_link?` · <a href="${u(k.meet_link)}" target="_blank" style="color:var(--blue);text-decoration:none">${k.meet_link.includes("zoom")?"Zoom":"Meet"} →</a>`:""}</div>
              </div>
              ${I?'<span class="hsc-appt-done">✓</span>':""}
            </div>`}).join("")}
        </div>
      </div>
    </div>

    <!-- HIZLI ERİŞİM -->
    <div style="display:flex;gap:8px;max-width:900px;margin:0 auto 4px;justify-content:center">
      ${[{tab:"messages",icon:"💬",label:"Mesajlar",sub:r>0?r+" okunmamış":"Temiz"},{tab:"coach-notes",icon:"📝",label:"Notlarım",sub:"Kişisel notlar"},{tab:"todolist",icon:"📅",label:"Ajanda",sub:"Tüm randevular"},{tab:"coach-applications",icon:"📩",label:"Başvurular",sub:"Eşleşme talepleri"}].map(({tab:k,icon:B,label:I,sub:T})=>`
        <div onclick="switchTab('${k}')" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:9px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:border-color .15s;flex:1;justify-content:center" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <span style="font-size:16px">${B}</span>
          <div><div style="font-size:12px;font-weight:700">${I}</div><div style="font-size:10px;color:var(--text-dim)">${T}</div></div>
        </div>`).join("")}
    </div>`}catch(a){console.error("[renderHome] HATA:",a),e.innerHTML=`<div style='padding:24px;color:var(--text)'><b>İyi günler 👋</b><p style='color:var(--text-mid);margin-top:6px'>Hata: ${u(a.message)}</p></div>`}}function Oe(){const e=document.getElementById("view-students"),t=W(0,0),n={};d.students.forEach(s=>{let r=0,l=0,c=0,p=0;for(let m=0;m<7;m++)(d.tasks[`${s.id}_${H(q(t,m))}`]||[]).forEach(w=>{r++,c+=Number(w.duration||0),w.done&&(l++,p+=Number(w.duration||0))});n[s.id]={total:r,done:l,totalMin:c,doneMin:p}});const a=d.students.length,i=d.students.filter(s=>{const r=n[s.id];return r&&r.total>0}).length,o=d.students.filter(s=>{const r=n[s.id];return r&&r.total>0&&r.done===r.total}).length;e.innerHTML=`<div style="max-width:640px;margin:0 auto">
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
      ${d.students.length===0?`
        <div style="text-align:center;padding:64px 20px;color:var(--text-dim)">
          <div style="width:56px;height:56px;border-radius:16px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 16px">👤</div>
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">Henüz öğrenciniz yok</div>
          <div style="font-size:12px">Yeni öğrenci eklemek için sağ üstteki butonu kullanın.</div>
        </div>
      `:d.students.map(s=>{const r=n[s.id]||{total:0,done:0},l=r.total>0?Math.round(r.done/r.total*100):0,c=l>=80?"var(--green)":l>=40?"var(--accent)":"var(--red)",p=r.total>0&&r.done===r.total,m=d.exams.filter(w=>w.studentId===s.id).sort((w,E)=>E.date.localeCompare(w.date))[0],v=m?Object.values(m.nets||{}).reduce((w,E)=>w+E,0).toFixed(1):null;return`<div class="stu-row" id="sturow_${s.id}" onclick="openStudentDetail('${s.id}')" style="padding:12px 16px;align-items:center;gap:12px;border-radius:10px">
          <div style="width:38px;height:38px;border-radius:10px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0">${s.name[0]}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--text)">${u(s.name)}</div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:1px">${u(s.target||"Hedef belirtilmemiş")}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;font-size:11px;color:var(--text-mid)">
            <span style="font-weight:700;color:${c}">%${l}</span>
            <span style="color:var(--border2)">·</span>
            <span>${r.done}/${r.total} görev</span>
            ${v?`<span style="color:var(--border2)">·</span><span><b style="color:var(--text)">${v}</b> net</span>`:""}
            ${p?'<span style="color:var(--border2)">·</span><span style="color:var(--green);font-weight:600">✓ Tamam</span>':""}
          </div>
          <svg style="width:13px;height:13px;color:var(--border2);flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        </div>`}).join("")}
    </div>
    <div id="stuSearchNoResults" style="display:none;text-align:center;padding:48px 20px;color:var(--text-dim)">
      <div style="font-size:13px">Aramanızla eşleşen öğrenci bulunamadı.</div>
    </div>
  </div>`}function xa(){const e=document.getElementById("stuSearchInput").value.trim().toLowerCase(),t=document.getElementById("stuSearchNoResults");let n=0;d.students.forEach(a=>{const i=document.getElementById("sturow_"+a.id);if(i){const o=a.name.toLowerCase().includes(e);i.style.display=o?"flex":"none",o&&n++}}),t&&(t.style.display=e&&n===0?"block":"none")}function rn(e){if(!d.students.find(p=>p.id===e))return;d.activeStuId=e;const t=d.students.find(p=>p.id===d.activeStuId),n=W(0,t.weekStart||0);let a=0,i=0,o=0;for(let p=0;p<7;p++){const m=d.tasks[`${t.id}_${H(q(n,p))}`]||[];a+=m.length,i+=m.filter(v=>v.done).length,o+=m.reduce((v,w)=>v+Number(w.duration||0),0)}const s=a>0?Math.round(i/a*100):0,r=s>=80?"var(--green)":s>=50?"var(--accent)":"var(--red)",l=document.getElementById("view-student-detail");l.innerHTML=`
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
          <div><div style="font-size:22px;font-weight:800;color:${r};line-height:1;letter-spacing:-.5px">%${s}</div><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-weight:600">Oran</div></div>
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
        <div style="font-size:28px;font-weight:800;color:${r};letter-spacing:-.5px">%${s}</div>
      </div>
      <div style="height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${s}%;background:${r};border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)"></div>
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
    </div>`,currentTab!=="student-detail"&&X("student-detail");const c=document.getElementById("tbarTitle");c&&(c.textContent=t.name)}async function ba(e){const t=d.students.find(b=>b.id===e);if(!t)return;const n=40,o=Math.min(n,Math.max(1,Math.ceil(((new Date-new Date("2025-09-01T00:00:00"))/864e5+1)/7))),s=document.getElementById("view-student-detail");s.innerHTML=`<button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button><div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`;const{data:r}=await g.from("konu_hafta_soru").select("*").eq("student_id",e),l={};(r||[]).forEach(b=>{l[b.subject]||(l[b.subject]={}),l[b.subject][b.konu]||(l[b.subject][b.konu]={}),l[b.subject][b.konu][b.hafta]=b.sayi});const c=y.role==="coach"||y.role==="developer",p=Object.keys(He);let m=p[0];window._khPending={};async function v(){const b=document.getElementById("khSaveBtn");b&&(b.disabled=!0,b.textContent="Kaydediliyor…");const h=Object.entries(window._khPending);if(!h.length){x("Değişiklik yok"),b&&(b.disabled=!1,b.textContent="Kaydet");return}const $=h.map(([S,z])=>{const[D,k,B]=S.split("|");l[D]||(l[D]={}),l[D][k]||(l[D][k]={}),l[D][k][parseInt(B)]=z;const I=`kh-top-${(D+"_"+k).replace(/[^a-zA-Z0-9]/g,"_")}`,T=document.getElementById(I);if(T){const f=Object.values(l[D][k]).reduce((L,j)=>L+j,0);T.textContent=f||0,T.style.color=f>0?"var(--accent)":"var(--text-dim)"}return{student_id:e,coach_id:y.coachId,subject:D,konu:k,hafta:parseInt(B),sayi:z,updated_at:new Date().toISOString()}});await g.from("konu_hafta_soru").upsert($,{onConflict:"student_id,subject,konu,hafta"}),window._khPending={},x(`${$.length} hücre kaydedildi ✓`),b&&(b.disabled=!1,b.textContent="Kaydet")}window._khFlush=v;function w(b,h,$){return"kh_"+btoa(encodeURIComponent(b+"|"+h+"|"+$)).replace(/[^a-zA-Z0-9]/g,"")}function E(b){const h=He[b]||[],$=Array.from({length:n},(k,B)=>B+1),S=l[b]||{},z=`<tr>
      <th style="padding:8px 14px;text-align:left;font-size:11px;font-weight:800;color:var(--text);background:var(--surface2);border-right:1px solid var(--border);position:sticky;left:0;z-index:2;white-space:nowrap;min-width:180px">${b}</th>
      ${$.map(k=>`<th style="padding:5px 2px;text-align:center;font-size:9px;font-weight:700;color:${k===o?"var(--accent)":"var(--text-dim)"};background:${k===o?"var(--accent-dim)":"var(--surface2)"};border-right:1px solid var(--border);min-width:30px">${k}<br><span style="font-weight:400;font-size:8px">Hft</span></th>`).join("")}
      <th style="padding:5px 8px;text-align:center;font-size:9px;font-weight:800;color:var(--text);background:var(--surface3);border-left:2px solid var(--border);position:sticky;right:0;z-index:2;min-width:52px">TOP</th>
    </tr>`,D=h.map((k,B)=>{const I=S[k]||{},T=Object.values(I).reduce((C,P)=>C+P,0),f=Math.max(...Object.values(I),1),L=B%2===0?"var(--surface)":"var(--surface2)",j=`kh-top-${(b+"_"+k).replace(/[^a-zA-Z0-9]/g,"_")}`,A=$.map(C=>{const P=I[C]||0;let F=C===o?"rgba(232,97,58,.05)":L,N="var(--text-dim)";P>0&&(F=`rgba(59,130,246,${.08+Math.min(P/f,1)*.45})`,N=P>=100?"var(--blue)":"var(--text)");const G=w(b,k,C);return c?`<td style="padding:0;background:${F};border-right:1px solid var(--border)">
            <input id="${G}" class="kh-input" type="number" min="0" max="999" value="${P||""}" placeholder=""
              style="width:30px;height:30px;border:none;background:transparent;text-align:center;font-size:13px;font-weight:700;color:${P?N:"var(--text-mid)"};font-family:inherit;outline:none;cursor:pointer;display:block"
              onfocus="this.select();this.style.background='var(--accent-dim)';this.style.outline='2px solid var(--accent)';this.style.borderRadius='4px';this.style.color='var(--text)'"
              onblur="this.style.background='transparent';this.style.outline='none';const v=parseInt(this.value)||0;if(v===0){this.value='';this.style.color='var(--text-mid)'}else{this.style.color='var(--text)'};window._khPending['${b.replace(/'/g,"\\'")}|${k.replace(/'/g,"\\'")}|${C}']=v"
              onkeydown="if(event.key==='Enter')this.blur();if(event.key==='Escape'){this.value='${P||""}';this.blur()}"
            >
          </td>`:`<td style="text-align:center;font-size:10px;font-weight:${P?"700":"400"};color:${N};background:${F};border-right:1px solid var(--border);padding:5px 2px">${P||""}</td>`}).join("");return`<tr>
        <td style="padding:6px 14px;font-size:11px;font-weight:600;color:var(--text);background:${L};border-right:1px solid var(--border);position:sticky;left:0;z-index:1;white-space:nowrap">${u(k)}</td>
        ${A}
        <td id="${j}" style="text-align:center;font-size:11px;font-weight:800;color:${T>0?"var(--accent)":"var(--text-dim)"};background:var(--surface3);border-left:2px solid var(--border);position:sticky;right:0;z-index:1">${T||0}</td>
      </tr>`}).join("");return`<table style="border-collapse:collapse;width:max-content;min-width:100%"><thead>${z}</thead><tbody>${D}</tbody></table>`}window._khBuild=E;const _=p.map(b=>`<button class="kh-tab" onclick="window._khActiveSub='${b}';document.getElementById('khTable').innerHTML=window._khBuild('${b}');document.querySelectorAll('.kh-tab').forEach(b=>{b.style.color='var(--text-mid)';b.style.borderBottom='2px solid transparent';b.style.fontWeight='600'});this.style.color='var(--accent)';this.style.borderBottom='2px solid var(--accent)';this.style.fontWeight='700'"
      style="padding:10px 16px;border:none;border-bottom:2px solid ${b===m?"var(--accent)":"transparent"};background:none;font-size:12px;font-weight:${b===m?"700":"600"};color:${b===m?"var(--accent)":"var(--text-mid)"};cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s">${b}</button>`).join("");s.innerHTML=`
    <button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:18px;font-weight:800;letter-spacing:-.2px">${u(t.name)} — Konu Haritası</div>
      ${c?'<button id="khSaveBtn" class="btn btn-accent btn-sm" onclick="window._khFlush()">Kaydet</button>':""}
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--shadow)">
      <div style="display:flex;border-bottom:1px solid var(--border);overflow-x:auto;padding:0 4px">${_}</div>
      <div id="khTable" style="overflow-x:auto;max-height:calc(100vh - 280px);overflow-y:auto">${E(m)}</div>
    </div>`}function _t(e){var i,o;d.activeStuId=e;const t=document.getElementById("view-program"),n=((i=d.students.find(s=>s.id===d.activeStuId))==null?void 0:i.name)||"";t.innerHTML=`<button class="back-link" onclick="switchTab('student-detail')">← ${n}</button>`,t.innerHTML+=document.createElement("div").innerHTML,currentTab!=="program"&&X("program");const a=document.getElementById("tbarTitle");a&&(a.textContent=(((o=d.students.find(s=>s.id===d.activeStuId))==null?void 0:o.name)||"")+" · Program"),U()}function ha(e){var n;d.activeStuId=e,currentTab!=="exams"&&X("exams");const t=document.getElementById("tbarTitle");t&&(t.textContent=(((n=d.students.find(a=>a.id===d.activeStuId))==null?void 0:n.name)||"")+" · Denemeler"),De()}function ka(e){var n;d.activeStuId=e,currentTab!=="appointments"&&X("appointments");const t=document.getElementById("tbarTitle");t&&(t.textContent=(((n=d.students.find(a=>a.id===d.activeStuId))==null?void 0:n.name)||"")+" · Randevular"),Fe()}let re={};async function wa(e){const t=d.students.find(a=>a.id===e);if(!t)return;d.activeStuId=e,currentTab!=="student-detail"&&X("student-detail");const n=document.getElementById("view-student-detail");if(n.innerHTML=`<button class="back-link" onclick="openStudentDetail('${e}')">← ${u(t.name)}</button>
    <div style="padding:20px;color:var(--text-dim);font-size:13px">Yükleniyor…</div>`,!re[e]){const{data:a}=await g.from("student_books").select("*").eq("student_id",e).order("created_at",{ascending:!0});re[e]=a||[]}zt(e)}function zt(e){const t=d.students.find(p=>p.id===e),n=re[e]||[],a=document.getElementById("view-student-detail"),i=y.role==="coach"||y.role==="developer",o=n.reduce((p,m)=>p+m.total_tests,0),s=n.reduce((p,m)=>p+m.completed_tests,0),r=o>0?Math.round(s/o*100):0,l=r>=75?"var(--green)":r>=40?"var(--accent)":"var(--red)",c=n.length?n.map(p=>{const m=p.total_tests>0?Math.min(100,Math.round(p.completed_tests/p.total_tests*100)):0,v=m>=75?"var(--green)":m>=40?"var(--accent)":"var(--red)";return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;margin-bottom:7px">${u(p.name)}</div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;height:7px;background:var(--surface3);border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${m}%;background:${v};border-radius:99px;transition:width .4s"></div>
            </div>
            <span style="font-size:12px;font-weight:800;color:${v};white-space:nowrap;min-width:36px;text-align:right">%${m}</span>
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
            <div style="height:100%;width:${r}%;background:${l};border-radius:99px;transition:width .4s"></div>
          </div>
          <span style="font-size:14px;font-weight:800;color:${l};white-space:nowrap">%${r}</span>
        </div>
      </div>
    </div>`:""}
    ${c}`}function $a(e){document.getElementById("sbModalTitle").textContent="Kaynak Ekle",document.getElementById("sbId").value="",document.getElementById("sbStuId").value=e,document.getElementById("sbName").value="",document.getElementById("sbTotal").value="0",document.getElementById("sbCompleted").value="0",document.getElementById("sbPctPreview").innerHTML="",Y("sbModal")}function Ta(e,t){const n=(re[e]||[]).find(a=>a.id===t);n&&(document.getElementById("sbModalTitle").textContent="Kaynağı Düzenle",document.getElementById("sbId").value=t,document.getElementById("sbStuId").value=e,document.getElementById("sbName").value=n.name,document.getElementById("sbTotal").value=n.total_tests,document.getElementById("sbCompleted").value=n.completed_tests,dn(),Y("sbModal"))}function dn(){var o,s;const e=parseInt((o=document.getElementById("sbTotal"))==null?void 0:o.value)||0,t=parseInt((s=document.getElementById("sbCompleted"))==null?void 0:s.value)||0,n=document.getElementById("sbPctPreview");if(!n||!e){n&&(n.innerHTML="");return}const a=Math.min(100,Math.round(t/e*100)),i=a>=75?"var(--green)":a>=40?"var(--accent)":"var(--red)";n.innerHTML=`<div style="display:flex;align-items:center;gap:10px">
    <div style="flex:1;height:8px;background:var(--surface3);border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${a}%;background:${i};border-radius:99px;transition:width .3s"></div>
    </div>
    <span style="font-size:13px;font-weight:800;color:${i}">%${a}</span>
  </div>`}async function Ea(){const e=document.getElementById("sbName").value.trim();if(!e)return x("Kaynak adı girin!");const t=Math.max(0,parseInt(document.getElementById("sbTotal").value)||0),n=Math.min(t,Math.max(0,parseInt(document.getElementById("sbCompleted").value)||0)),a=document.getElementById("sbStuId").value,i=document.getElementById("sbId").value,o={name:e,total_tests:t,completed_tests:n};if(i){const{error:s}=await g.from("student_books").update(o).eq("id",i);if(s)return x("Hata: "+s.message);const r=(re[a]||[]).find(l=>l.id===i);r&&Object.assign(r,o),x("Güncellendi ✓")}else{const{data:s,error:r}=await g.from("student_books").insert({...o,student_id:a,coach_id:y.coachId}).select().single();if(r)return x("Hata: "+r.message);re[a]||(re[a]=[]),re[a].push(s),x("Kaynak eklendi ✓")}K("sbModal"),zt(a)}async function Ia(e,t){if(!await Z("Bu kaynağı silmek istiyor musunuz?"))return;const{error:n}=await g.from("student_books").delete().eq("id",t);if(n)return x("Hata: "+n.message);re[e]=(re[e]||[]).filter(a=>a.id!==t),zt(e),x("Silindi ✓")}function ln(){var i,o;const e=document.getElementById("view-profile"),t=y.dbUser,n=((t==null?void 0:t.full_name)||"?").split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase(),a=y.role==="coach"?"Koç":y.role==="developer"?"Developer":"Öğrenci";e.innerHTML=`
    <div style="max-width:480px;margin:0 auto">
      <!-- Mini user card -->
      <div style="display:flex;align-items:center;gap:14px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:20px;box-shadow:var(--shadow)">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0">${n}</div>
        <div>
          <div style="font-size:16px;font-weight:800;letter-spacing:-.2px">${u((t==null?void 0:t.full_name)||"")}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px">${a} · ${u(((i=d.workspace)==null?void 0:i.brand_name)||"Rostrum Akademi")}</div>
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
        ${y.role==="coach"||y.role==="developer"?`<div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Akademi Adı</label>
          <input id="pf_brand" value="${u(((o=d.workspace)==null?void 0:o.brand_name)||"")}" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`:""}
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Yeni Şifre <span style="font-weight:400;text-transform:none">(boş bırakılırsa değişmez)</span></label>
          <input type="password" id="pf_pass" placeholder="••••••••" style="width:100%;padding:9px 12px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--text);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <button class="btn btn-accent" onclick="saveProfile()" style="align-self:flex-start;padding:9px 20px">Kaydet</button>
      </div>
    </div>`}async function Sa(){var i,o;const e=document.getElementById("pf_name").value.trim(),t=document.getElementById("pf_pass").value,n=(o=(i=document.getElementById("pf_brand"))==null?void 0:i.value)==null?void 0:o.trim();if(!e)return x("Ad boş olamaz!");const a={full_name:e};t&&(a.password_hash=await Te(t)),await g.from("users").update(a).eq("id",y.dbUser.id),n&&(y.role==="coach"||y.role==="developer")&&(await g.from("workspaces").update({brand_name:n}).eq("coach_id",y.coachId),d.workspace={...d.workspace||{},brand_name:n},document.querySelector(".sb-logo-text").textContent=n),y.dbUser={...y.dbUser,full_name:e},document.getElementById("sbName").textContent=e,x("Profil kaydedildi ✓")}function cn(){var n;const e=document.getElementById("view-settings"),t=document.documentElement.getAttribute("data-theme")==="dark";e.innerHTML=`
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
            ${Pn.map(a=>`<div class="ac-dot" onclick="applyAccent('${a.val}','${a.dim}')" style="background:${a.val}" title="${a.name}"></div>`).join("")}
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
          <div><div class="setting-item-lbl">Kullanıcı Adı</div><div class="setting-item-sub">${u(((n=y.dbUser)==null?void 0:n.username)||"")}</div></div>
          <button class="btn btn-ghost btn-sm" onclick="switchTab('profile')">Düzenle</button>
        </div>
        <div class="setting-item">
          <div><div class="setting-item-lbl">Oturumu Kapat</div></div>
          <button class="btn btn-danger btn-sm" onclick="doLogout()">Çıkış</button>
        </div>
      </div>
    </div>`}function _a(){const e=document.getElementById("geminiApiKeyInput").value.trim();e?(localStorage.setItem("gemini_api_key",e),x("API Anahtarı kaydedildi ✓")):(localStorage.removeItem("gemini_api_key"),x("API Anahtarı kaldırıldı."))}let xe="";function U(){const e=document.getElementById("view-program"),t=d.students.find(r=>r.id===d.activeStuId),n=(t==null?void 0:t.weekStart)??0,a=W(d.weekOffset,n),i=q(a,6),o=$e();d.students.map(r=>`<option value="${r.id}" ${r.id===d.activeStuId?"selected":""}>${u(r.name)}</option>`).join("");let s="";for(let r=0;r<7;r++){const l=q(a,r),c=H(l),p=c===o,m=`${d.activeStuId}_${c}`,v=d.tasks[m]||[],w=v.reduce(($,S)=>$+Number(S.duration),0),E=v.reduce(($,S)=>$+(S.done?Number(S.duration):0),0),_=DAYS_TR[(n+r)%7],b=v.map(($,S)=>`
      <div class="task-card task-${$.type} ${$.done?"done":""}" onclick="openTaskDetail('${c}',${S},'coach')" style="cursor:pointer">
        <div class="tc-check ${$.done?"on":""}" onclick="event.stopPropagation();toggleTask('${c}',${S})"></div>
        <div class="tc-body">
          <div class="tc-type">${Ke($.type)}${$.exam?" · "+$.exam:""}</div>
          <div class="tc-subject">${u($.subject)}</div>
          <div class="tc-meta">${$.duration} dk</div>
        </div>
        <button class="tc-menu-btn" onclick="event.stopPropagation();showTaskMenu('${c}',${S},this)">⋯</button>
      </div>`).join(""),h=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(n+r)%7];s+=`<div class="day-col ${p?"today":""}">
      <div class="day-hd">
        <div>
          <div class="day-name-lbl">${h}</div>
          <div class="day-num">${l.getDate()}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="day-badge" style="font-size:8.5px">${Re(E)} / ${Re(w)}</span>
          ${_clipboardTask?`<button class="btn btn-ghost btn-xs" onclick="pasteTaskFromClipboard('${c}')" style="font-size:9px;color:var(--accent);border-color:rgba(240,165,0,.3);background:var(--accent-dim);padding:2px 6px">Yapıştır</button>`:""}
        </div>
      </div>
      <div class="day-tasks-list">${b||""}</div>
      <button class="add-day-btn" onclick="openTaskModal('${c}','${_}')" ${d.activeStuId?"":"disabled"}>+ Görev Ekle</button>
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
    <div class="week-grid">${s}</div>`}function za(e){d.activeStuId=e||null,Ye(),U()}function Ba(e){d.weekOffset+=e,Ye(),U()}function Ma(){d.weekOffset=0,Ye(),U()}let Q=[];function Aa(){if(!d.activeStuId)return x("Önce öğrenci seçin");const e=d.students.find(i=>i.id===d.activeStuId),t=(e==null?void 0:e.weekStart)??0,n=W(d.weekOffset,t);Q=[];let a="";for(let i=0;i<7;i++){const o=q(n,i),s=H(o);DAYS_TR[(t+i)%7];const r=(d.tasks[`${d.activeStuId}_${s}`]||[]).length>0,l=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(t+i)%7];a+=`<button class="day-sel-btn" id="dsbtn_${i}" data-ds="${s}" onclick="toggleDaySel(${i},'${s}')">
      <div>${l}</div>
      <div style="font-size:14px;font-weight:800">${o.getDate()}</div>
      ${r?'<div style="font-size:9px;color:var(--accent);margin-top:2px">●</div>':'<div style="font-size:9px;opacity:0">·</div>'}
    </button>`}document.getElementById("daySelectorGrid").innerHTML=a,Y("clearWeekModal")}function Da(e,t){const n=document.getElementById("dsbtn_"+e),a=Q.indexOf(t);a===-1?(Q.push(t),n.classList.add("sel")):(Q.splice(a,1),n.classList.remove("sel"))}function Ca(){const e=document.querySelectorAll(".day-sel-btn");Q.length===7?(Q=[],e.forEach(t=>t.classList.remove("sel"))):(Q=[],e.forEach((t,n)=>{Q.push(t.dataset.ds),t.classList.add("sel")}))}async function La(){if(!Q.length)return x("Önce gün seçin");if(await Z(`${Q.length} günün görevleri silinsin mi?`)){for(const e of Q)await g.from("tasks").delete().eq("student_id",d.activeStuId).eq("date",e),delete d.tasks[`${d.activeStuId}_${e}`];le(),K("clearWeekModal"),U(),x(`${Q.length} gün temizlendi`)}}const He={"Dil Bilgisi":["Sözcükte Anlam","Cümlede Anlam","Ses Bilgisi","Yazım Kuralları","Noktalama İşaretleri","Sözcükte Yapı","İsim","Sıfat","Zamir","Zarf","İsim-Sıfat Tamlamaları","Edat-Bağlaç-Ünlem","Fiiller – Fiil Çekimleri – Fiillerde Zaman Kayması","Ek Fiil – Ek Eylem","Fiilde Çatı","Fiilimsiler","Cümlenin Öğeleri","Cümle Türleri","Anlatım Bozuklukları"],"TYT Matematik":["Sayılar ve Basamak","Bölünebilme","EBOB-EKOK","Kesirler ve Ondalıklı Sayılar","Mutlak Değer","Üslü Sayılar","Köklü Sayılar","Oran-Orantı","Problemler – Yaş-İşçi-Havuz","Problemler – Kar-Zarar-Yüzde","Problemler – Hareket","Problemler – Karışım","Birinci Dereceden Denklemler","Kümeler","Mantık","Fonksiyonlar","Polinomlar","İkinci Dereceden Denklemler","Permütasyon-Kombinasyon","Olasılık","İstatistik ve Veri"],"AYT Matematik":["Polinomlar","Karmaşık Sayılar","Logaritma","Trigonometri","Diziler","Limit ve Süreklilik","Türev","İntegral","Matrisler ve Determinant"],Geometri:["Doğruda Açı","Üçgende Açı ve Kenar","Üçgende Alan","Üçgende Benzerlik","Özel Üçgenler (Pisagor)","Dörtgenler","Dörtgende Alan","Çember ve Daire","Çemberde Açı","Analitik Geometri – Nokta ve Doğru","Analitik Geometri – Çember","Katı Cisimler","Uzay Geometrisi"],"TYT Fizik":["Fizik Bilimine Giriş","Madde ve Özellikleri","Basınç","Kaldırma Kuvveti","Isı Sıcaklık Genleşme","Hareket","Newton Hareket Yasaları","İş Güç Enerji","Elektrik","Manyetizma","Optik","Dalgalar"],"AYT Fizik":["Vektörler","Bağıl ve Bileşik Hareket","Newton'ın Hareket Yasaları","Sabit İvmeli Hareket","Tek Boyutta Atışlar","İki Boyutta Atışlar","Enerji","İtme ve Momentum","Tork ve Denge","Kütle ve Ağırlık Merkezi","Basit Makineler","Elektriksel Kuvvet ve Elektrik Alan","Elektriksel Potansiyel Enerji","Düzgün Elektrik Alan ve Sığa","Manyetik Alan","Manyetik Kuvvet","Manyetik İndüksiyon","Alternatif Akım ve Transformatörler","Düzgün Çembersel Hareket","Eylemsizlik Momenti ve Açısal Momentum","Genel Çekim Yasası ve Kepler","Basit Harmonik Hareket","Dalga Mekaniği","Elektromanyetik Dalgalar","Atom Modelleri ve Atomun Yapısı","Büyük Patlama ve Atom Altı Parçacıklar","Radyoaktivite","Özel Görelilik Teorisi","Modern Fizik"],"TYT Kimya":["Kimyanın Sembolik Dili","Atom Modelleri","Periyodik Cetvel","Etkileşimler","Maddenin Halleri","Kimyanın Temel Kanunları","Mol Kavramı","Kimyasal Hesaplamalar","Kimyasal Tepkime Türleri","Karışımlar","Asitler ve Bazlar","Tuzlar","Doğa ve Kimya","Kimya Her Yerde"],"AYT Kimya":["Modern Atom","Gazlar","Sıvı Çözeltiler ve Çözünürlük","Tepkimelerde Hız","Tepkimelerde Denge","Sulu Çözelti Dengeleri","Kimya ve Elektrik","Karbon Kimyası","Organik Bileşikler","Enerji Kaynakları"],"TYT Biyoloji":["Canlıların Temel Bileşenleri","İnorganik Bileşikler","Karbohidratlar","Lipitler (Yağlar)","Proteinler","Hormonlar","Vitaminler","Enzimler","Nükleik Asitler","DNA-RNA","ATP Metabolizma","Hücre Organelleri","Hücre Zarı Madde Geçişleri","Ekoloji","Güncel Çevre Sorunları","Canlıların Sınıflandırılması","Hücre Bölünmeleri","Mitoz","Mayoz","Kalıtım"],"AYT Biyoloji":["Sinir Sistemi","Endokrin Sistemi","Duyu Organları","Destek Hareket Sistemi","Dolaşım Sistemi","Bağışıklık Sistemi","Solunum Sistemi","Üriner Sistemi","Üreme Sistemi","Komünite Ekolojisi","Popülasyon Ekolojisi","Genden Proteine","Enerji Dönüşümleri","Bitki Biyolojisi","Canlı ve Çevre"]};function ja(e,t){const n=`${e||""} ${t||""}`.trim();return He[n]||He[t||""]||null}let be=[];function Pa(e,t){const n=be.indexOf(t);n===-1?(be.push(t),e.style.borderColor="var(--red)",e.style.background="rgba(255,92,122,.12)",e.style.color="var(--red)"):(be.splice(n,1),e.style.borderColor="var(--border)",e.style.background="var(--surface)",e.style.color="var(--text-mid)")}window.toggleKonuChip=Pa;let oe=[];function Ra(){const e=document.getElementById("tmNewResourceToggle").checked;pn(e)}function pn(e){document.getElementById("tmSearchSection").style.display=e?"none":"",document.getElementById("tmManualSection").style.display=e?"":"none",document.getElementById("tmTestWrap").style.display="none";const t=document.getElementById("tmToggleSlider");t&&(t.style.background=e?"var(--accent)":"var(--border)",t.style.setProperty("--tw-after-x",e?"16px":"0px"))}function Ha(){const e=document.getElementById("tmManualTestInput"),t=e.value.trim();t&&(oe.push(t),e.value="",mn())}function Na(e){oe.splice(e,1),mn()}function mn(){const e=document.getElementById("tmManualTestChips");e&&(e.innerHTML=oe.map((t,n)=>`
    <span style="display:inline-flex;align-items:center;gap:5px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.3);color:var(--accent);padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600">
      ${u(t)}
      <button onclick="removeManualTest(${n})" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:14px;padding:0;line-height:1">×</button>
    </span>`).join(""))}function Ya(e,t){if(!d.activeStuId)return x("Önce öğrenci seçin");xe=e,_editingTaskId=null,O=null,document.querySelector("#taskModal h2").innerHTML=`Görev Ekle — <span id="tmDay">${t}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Programa Ekle",document.getElementById("tmSubjectFree").value="",document.getElementById("tmDuration").value="60",document.getElementById("tmNote").value="",document.getElementById("tmExam").value="",document.getElementById("tmType").value="deneme",document.getElementById("tmSubjectSel").style.display="none",document.getElementById("tmSubjectFree").style.display="",document.getElementById("soruBankasiWrap").style.display="none",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookVal").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const n=document.getElementById("tmTestSummary");n&&(n.style.display="none");const a=document.getElementById("tmNewResourceToggle");a&&(a.checked=!1,pn(!1)),document.getElementById("tmManualKaynak").value="",document.getElementById("tmManualTestInput").value="",document.getElementById("tmManualTestChips").innerHTML="",oe=[],vn(),Y("taskModal")}let J={},Be=!1;async function un(){if(Be)return;const{data:e}=await g.from("resources").select("*").eq("active",!0).order("name");e&&(e.forEach(t=>{let n=[t.subject];t.subject==="Tarih"?n.push("Tarih1","Tarih2"):t.subject==="Coğrafya"?n.push("Coğrafya1","Coğrafya2"):(t.subject==="Din Kültürü"||t.subject==="Din")&&(n=["Din","Din Kültürü"]),n.forEach(a=>{const i=`${t.exam_type}_${a}`;J[i]||(J[i]=[]),J[i].push({name:t.name,yil:t.year,testler:Array.isArray(t.tests)?t.tests:[],publisher:t.publisher})})}),Be=!0)}let je=[],O=null;function Bt(){const e=document.getElementById("tmExam").value,t=document.getElementById("tmType").value,n=document.getElementById("tmSubjectSel"),a=document.getElementById("tmSubjectFree");O=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").innerHTML="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const i=document.getElementById("tmTestSummary");i&&(i.style.display="none"),e&&SUBJECT_MAP[e]?(n.innerHTML=SUBJECT_MAP[e].map(r=>`<option value="${r}">${r}</option>`).join(""),n.style.display="",a.style.display="none"):(n.style.display="none",a.style.display="");const o=(t==="soru"||t==="konu")&&e;document.getElementById("soruBankasiWrap").style.display=o?"":"none";const s=document.getElementById("tmBookSearch");s&&(s.placeholder=t==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara..."),Be=!1,J={},o&&it("")}function Ka(){O=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const e=document.getElementById("tmType").value,t=document.getElementById("tmExam").value;Be=!1,J={},(e==="soru"||e==="konu")&&t&&it("")}document.getElementById("tmType").addEventListener("change",Bt);async function it(e){const t=document.getElementById("tmExam").value,n=document.getElementById("tmSubjectSel").value||"",a=document.getElementById("tmType").value,i=document.getElementById("tmBookList"),o=a==="konu"?"playlist":"book";if(!Be){i.style.display="block",i.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">⏳ Yükleniyor...</div>';const{data:c}=await g.from("resources").select("*").eq("active",!0).eq("resource_type",o).order("name");J={},c&&c.forEach(p=>{let m=[p.subject];p.subject==="Tarih"?m.push("Tarih1","Tarih2"):p.subject==="Coğrafya"?m.push("Coğrafya1","Coğrafya2"):(p.subject==="Din Kültürü"||p.subject==="Din")&&(m=["Din","Din Kültürü"]),m.forEach(v=>{const w=`${p.exam_type}_${v}`;J[w]||(J[w]=[]),J[w].push({name:p.name,yil:p.year,testler:Array.isArray(p.tests)?p.tests:[],publisher:p.publisher,resource_type:p.resource_type||"book"})})}),Be=!0}const s=`${t}_${n}`,r=J[s]||[],l=e.toLowerCase();if(je=r.filter(c=>{var p;return!l||c.name.toLowerCase().includes(l)||((p=c.publisher)==null?void 0:p.toLowerCase().includes(l))}),!e&&!je.length){i.style.display="none";return}if(!je.length){i.style.display="block",i.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">Kaynak bulunamadı</div>';return}i.style.display="block",i.innerHTML=je.map((c,p)=>`
    <div onclick="selectBook(${p})" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;transition:background .15s"
      onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:13px;font-weight:700">${u(c.name)}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px">${u(c.publisher||"")} · ${c.testler.length} test</div>
      </div>
      <span style="font-size:10px;font-weight:700;background:var(--green-dim);color:var(--green);padding:2px 7px;border-radius:99px;margin-left:8px;flex-shrink:0">${c.yil}</span>
    </div>`).join("")}function Oa(){const e=document.getElementById("tmBookSearch").value;if(e.length===0){document.getElementById("tmBookList").style.display="none";return}it(e)}function Fa(e){O=je[e],document.getElementById("tmBookVal").value=O.name,document.getElementById("tmBookSearch").value=O.name,document.getElementById("tmBookList").style.display="none",Mt(),document.getElementById("tmTestWrap").style.display=""}function Mt(){if(!O)return;const e=document.getElementById("tmTestList"),t=O.resource_type==="playlist",n=O.name||"";e.innerHTML=O.testler.map((a,i)=>{const o=a.label||a,s=o.trim()===""||o.trim()===n.trim()?`Ders ${i+1}`:o,r=a.soru||0,l=a.url||"";a.topic;const c=Gn(o),p=c==="done"?"ti-status-done":c==="pending"?"ti-status-pending":"",m=c==="done"?'<span class="ti-badge ti-badge-done">✓ Tamamlandı</span>':c==="pending"?'<span class="ti-badge ti-badge-pending">⏳ Atandı</span>':"";return t?`<label class="${p}" style="display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--border)"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="width:22px;height:22px;border-radius:6px;background:var(--surface3);color:var(--text-mid);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(s)}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
            <span style="font-size:10px;color:var(--text-dim)">${r>0?`⏱ ${r} dk`:"⏱ ?"}</span>
            ${m}
          </div>
        </div>
        ${l?`<a href="${u(l)}" target="_blank" onclick="event.stopPropagation()"
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
        ${r>0?`<span style="font-size:10px;color:var(--text-dim);background:var(--surface3);padding:2px 7px;border-radius:99px;flex-shrink:0">${r} soru</span>`:""}
      </label>`}).join(""),Ae()}function qa(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!0),Ae()}function Ua(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!1),Ae()}function Ae(){if(!O)return;const e=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")],t=document.getElementById("tmTestSummary"),n=document.getElementById("tmTestSummaryText"),a=document.getElementById("tmSuggestedDuration"),i=document.getElementById("tmSpeedRow"),o=O.resource_type==="playlist";if(e.length===0){t.style.display="none";return}let s=0,r=0;e.forEach(m=>{const v=parseInt(m.value),w=O.testler[v];o?r+=(w==null?void 0:w.soru)||0:s+=(w==null?void 0:w.soru)||0});const l=document.querySelector("[data-mspeed].speed-active"),c=l?parseFloat(l.dataset.mspeed):1;let p=0;if(o)p=r>0?Math.ceil(r/c):0,n.textContent=`${e.length} video · ${r} dk`,i&&(i.style.display="");else{const m=document.getElementById("tmExam").value,v=document.getElementById("tmSubjectSel").value||"",w=`${d.activeStuId}_${m}_${v}`,E=Qe[w]||180;p=s>0?Math.ceil(s*E/60):0,n.textContent=`${e.length} test · ${s} soru${p>0?" · Önerilen: "+p+" dk":""}`,i&&(i.style.display="none")}a.style.display=p>0?"":"none",We=p,a.setAttribute("data-dur",p),t.style.display="",p>0&&(document.getElementById("tmDuration").value=p)}function Ga(e){document.querySelectorAll("[data-mspeed]").forEach(t=>{const n=t.dataset.mspeed===e;t.classList.toggle("speed-active",n),t.style.borderColor=n?"var(--accent)":"var(--border)",t.style.background=n?"var(--accent-dim)":"var(--surface2)",t.style.color=n?"var(--accent)":"var(--text-mid)"}),Ae()}let We=0;function Wa(){We>0&&(document.getElementById("tmDuration").value=We,x("Süre uygulandı: "+We+" dk"))}let Qe={};async function vn(){if(!d.activeStuId)return;const{data:e}=await g.from("student_speeds").select("*").eq("student_id",d.activeStuId);Qe={},(e||[]).forEach(t=>{const n=`${t.student_id}_${t.exam_type}_${t.subject}`;Qe[n]=t.secs_per_question})}async function gn(e,t,n,a){const{data:i}=await g.from("student_speeds").select("id").eq("student_id",e).eq("exam_type",t).eq("subject",n).single();i?await g.from("student_speeds").update({secs_per_question:a,updated_at:new Date().toISOString()}).eq("id",i.id):await g.from("student_speeds").insert({student_id:e,coach_id:y.coachId,exam_type:t,subject:n,secs_per_question:a}),Qe[`${e}_${t}_${n}`]=a,x("Hız kaydedildi ✓")}document.getElementById("tmType").addEventListener("change",Bt);let vt=!1;async function Va(){var n;if(vt)return;vt=!0;const e=document.querySelector('#taskModal button[onclick*="saveTask"]'),t=e?e.textContent:"Programa Ekle";e&&(e.disabled=!0,e.textContent="Kaydediliyor...");try{const a=document.getElementById("tmType").value,i=document.getElementById("tmSubjectSel"),o=document.getElementById("tmSubjectFree"),s=document.getElementById("tmExam").value,r=parseInt(document.getElementById("tmDuration").value)||60,l=document.getElementById("tmNote").value.trim();if((n=document.getElementById("tmNewResourceToggle"))==null?void 0:n.checked){const h=document.getElementById("tmManualKaynak").value.trim();if(!h)return x("Kaynak adı girin!");const $=i.style.display!=="none"?i.value:o.value.trim(),S=$?`${$} - ${h}`:h,z=oe.map(T=>({label:T,url:"",soru:0}));let D=l;oe.length>0&&(D=`${oe.length} test: ${oe.slice(0,3).join(", ")}${oe.length>3?` +${oe.length-3} daha`:""}`);const k={student_id:d.activeStuId,coach_id:y.coachId,date:xe,type:a,exam_type:s,subject:S,duration:r,note:D,done:!1,task_items:z.length>0?z:null};M(!0);const{error:B}=await g.from("tasks").insert(k);if(M(!1),B)return x("Hata: "+B.message);const I=`${d.activeStuId}_${xe}`;d.tasks[I]||(d.tasks[I]=[]),d.tasks[I].push({type:a,exam:s,subject:S,duration:r,note:D,done:!1,task_items:k.task_items}),K("taskModal"),U(),x("Görev eklendi ✓");return}const p=document.getElementById("tmBookVal").value,m=(O==null?void 0:O.resource_type)==="playlist";let v="";if((a==="soru"||a==="konu")&&p){const h=i.style.display!=="none"?i.value:"";v=h?`${h} - ${p}`:`${p}`}else v=(i.style.display!=="none"?i.value:o.value).trim();if(!v)return x("Ders adı girin!");const w=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")];let E=l,_=[];if(w.length>0&&O){const h=w.map($=>{const S=O.testler[parseInt($.value)];return(S==null?void 0:S.label)||S||""});if(_=w.map($=>{const S=O.testler[parseInt($.value)];return{label:(S==null?void 0:S.label)||S||"",url:(S==null?void 0:S.url)||"",soru:(S==null?void 0:S.soru)||0}}),m){const $=S=>S.length>14?S.slice(0,13)+"…":S;E=`${h.length} video: ${h.slice(0,5).map($).join(", ")}${h.length>5?` +${h.length-5}`:""}`}else{const $=S=>S.length>14?S.slice(0,13)+"…":S;E=`${h.length} test: ${h.slice(0,5).map($).join(", ")}${h.length>5?` +${h.length-5}`:""}`}}const b={student_id:d.activeStuId,coach_id:y.coachId,date:xe,type:a,exam_type:s,subject:v,duration:r,note:E,done:!1,task_items:_.length>0?_:null};if(_editingTaskId){M(!0);const{error:h}=await g.from("tasks").update({type:b.type,exam_type:b.exam_type,subject:b.subject,duration:b.duration,note:b.note,task_items:b.task_items}).eq("id",_editingTaskId);if(M(!1),h)return x("Hata: "+h.message);const $=`${d.activeStuId}_${xe}`;if(d.tasks[$]){const S=d.tasks[$].findIndex(z=>z._id===_editingTaskId);S!==-1&&(d.tasks[$][S]={_id:_editingTaskId,type:b.type,exam:b.exam_type,subject:b.subject,duration:b.duration,note:b.note,done:d.tasks[$][S].done,student_note:d.tasks[$][S].student_note||"",task_items:b.task_items})}K("taskModal"),U(),x("Görev güncellendi ✓"),_editingTaskId=null}else{const{data:h,error:$}=await g.from("tasks").insert(b).select().single();if($)return x("Hata: "+$.message);const S=`${d.activeStuId}_${xe}`;d.tasks[S]||(d.tasks[S]=[]),d.tasks[S].push({_id:h.id,type:h.type,exam:h.exam_type,subject:h.subject,duration:h.duration,note:h.note,done:!1,student_note:"",task_items:h.task_items||null}),K("taskModal"),U(),x("Görev eklendi ✓")}}finally{vt=!1,e&&(e.disabled=!1,e.textContent=t)}}async function Za(e,t){var o;const n=`${d.activeStuId}_${e}`,a=(o=d.tasks[n])==null?void 0:o[t];if(!a)return;const i=!a.done;await g.from("tasks").update({done:i}).eq("id",a._id),a.done=i,U()}let Ve=null;function At(){Ve&&(Ve.remove(),Ve=null)}document.addEventListener("click",At);function Ja(e,t,n){At();const a=n.getBoundingClientRect(),i=document.createElement("div");i.className="tc-dropdown",i.innerHTML=`
    <button onclick="closeTaskMenu();openCoachTaskEdit('${e}',${t})">✏️ Düzenle</button>
    <button onclick="closeTaskMenu();copyTaskToClipboard('${e}',${t})">📋 Kopyala</button>
    <button onclick="closeTaskMenu();copyTaskToWholeWeek('${e}',${t})">📅 Tüm Haftaya Kopyala</button>
    <button class="danger" onclick="closeTaskMenu();deleteTask('${e}',${t})">🗑 Kaldır</button>`;const o=a.bottom+4,s=Math.min(a.left,window.innerWidth-155);i.style.cssText=`top:${o}px;left:${s}px;`,document.body.appendChild(i),Ve=i,setTimeout(()=>i.addEventListener("click",r=>r.stopPropagation()),0)}async function Xa(e,t){var s;const n=`${d.activeStuId}_${e}`,a=(s=d.tasks[n])==null?void 0:s[t];if(!a)return;const{data:i,error:o}=await g.from("tasks").insert({student_id:d.activeStuId,coach_id:y.coachId,date:e,type:a.type,exam_type:a.exam||null,subject:a.subject,duration:a.duration,note:a.note||null,done:!1,task_items:a.task_items||null}).select().single();if(o)return x("Kopyalama başarısız");d.tasks[n]||(d.tasks[n]=[]),d.tasks[n].push({_id:i.id,type:i.type,exam:i.exam_type,subject:i.subject,duration:i.duration,note:i.note,done:!1,student_note:"",task_items:i.task_items||null}),U(),x("Görev kopyalandı")}async function Qa(e,t){var i;const n=`${d.activeStuId}_${e}`,a=(i=d.tasks[n])==null?void 0:i[t];a&&(await g.from("tasks").delete().eq("id",a._id),d.tasks[n].splice(t,1),U(),x("Görev silindi"))}let _e=0,te={studentId:"",type:""};window._draggingApptId=null;const yn={"Haftalık Değerlendirme":"#E8613A","TYT Koçluğu":"#3B82F6","AYT Koçluğu":"#8B5CF6",Mentörlük:"#10B981","Deneme Analizi":"#F59E0B",Motivasyon:"#EC4899","Genel Görüşme":"#64748B"},Se=0,fn=24,ie=60;function Ze(e){return yn[e]||"#64748B"}function ei(e){const t=d.students.find(o=>o.id===e.studentId),n=new Date(e.date+"T"+(e.time||"09:00")),a=new Date(n.getTime()+(e.duration||45)*6e4),i=o=>o.getFullYear()+String(o.getMonth()+1).padStart(2,"0")+String(o.getDate()).padStart(2,"0")+"T"+String(o.getHours()).padStart(2,"0")+String(o.getMinutes()).padStart(2,"0")+"00";return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(((t==null?void 0:t.name)||"Öğrenci")+" – Koçluk")}&dates=${i(n)}/${i(a)}&details=${encodeURIComponent(e.type||"")}`}function ti(){_e--,ce()}function ni(){_e++,ce()}function ai(){_e=0,ce()}function ii(e,t){te[e]=t,ce()}function oi(){let e=d.appointments;te.studentId&&(e=e.filter(o=>o.studentId===te.studentId)),te.type&&(e=e.filter(o=>o.type===te.type));const t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Rostrum Akademi//TR","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Rostrum Ajanda"];e.forEach(o=>{const s=d.students.find(p=>p.id===o.studentId),r=new Date(o.date+"T"+(o.time||"09:00")),l=new Date(r.getTime()+(o.duration||45)*6e4),c=p=>p.getFullYear()+String(p.getMonth()+1).padStart(2,"0")+String(p.getDate()).padStart(2,"0")+"T"+String(p.getHours()).padStart(2,"0")+String(p.getMinutes()).padStart(2,"0")+"00";t.push("BEGIN:VEVENT",`DTSTART:${c(r)}`,`DTEND:${c(l)}`,`SUMMARY:${(s==null?void 0:s.name)||"Öğrenci"} – ${o.type||"Koçluk"}`),o.note&&t.push(`DESCRIPTION:${o.note.replace(/\n/g,"\\n")}`),(o.meetLink||o.meet_link)&&t.push(`URL:${o.meetLink||o.meet_link}`),t.push(`UID:rostrum-${o.id}@rostrumakademi.com`,"END:VEVENT")}),t.push("END:VCALENDAR");const n=new Blob([t.join(`\r
`)],{type:"text/calendar;charset=utf-8"}),a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download="rostrum-ajanda.ics",i.click(),URL.revokeObjectURL(a),x("Ajanda indirildi ✓")}function si(e,t){t.stopPropagation();const n=document.getElementById("apptDetailPopup");if(n){const w=n.dataset.id;if(n.remove(),w===e)return}const a=d.appointments.find(w=>w.id===e);if(!a)return;const i=d.students.find(w=>w.id===a.studentId),o=Ze(a.type),s=document.createElement("div");s.id="apptDetailPopup",s.dataset.id=e;const r=window.innerWidth,l=window.innerHeight,c=264;let p=Math.min(t.clientX+12,r-c-12),m=Math.min(t.clientY+12,l-220);s.style.cssText=`position:fixed;left:${p}px;top:${m}px;z-index:600;width:${c}px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.18);animation:viewIn .15s ease`;const v=a.meetLink||a.meet_link;s.innerHTML=`
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
      ${v?`<a href="${u(v)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--blue);background:var(--blue-dim);padding:4px 10px;border-radius:99px;text-decoration:none">🎥 ${v.includes("zoom")?"Zoom":"Meet"}</a>`:""}
      <a href="${ei(a)}" target="_blank" style="font-size:11px;font-weight:700;color:var(--green);background:var(--green-dim);padding:4px 10px;border-radius:99px;text-decoration:none">📅 GCal</a>
      <button onclick="document.getElementById('apptDetailPopup')?.remove();openAgendaApptModal('${a.id}')" style="font-size:11px;font-weight:700;color:var(--text);background:var(--surface2);padding:4px 10px;border-radius:99px;border:1px solid var(--border);cursor:pointer;font-family:inherit">✏️ Düzenle</button>
      <button onclick="deleteAgendaAppt('${a.id}')" style="font-size:11px;font-weight:700;color:var(--red,#ef4444);background:#ef444410;padding:4px 10px;border-radius:99px;border:none;cursor:pointer;font-family:inherit">🗑</button>
    </div>`,document.body.appendChild(s),setTimeout(()=>{document.addEventListener("click",function w(E){s.contains(E.target)||(s.remove(),document.removeEventListener("click",w))})},50)}async function ri(e,t){e.preventDefault();const n=window._draggingApptId;if(!n)return;window._draggingApptId=null;const a=e.currentTarget,i=a.getBoundingClientRect(),o=a.closest("[data-tl-scroll]"),s=o?o.scrollTop:0,l=(e.clientY-i.top+s)/ie*60+Se*60,c=Math.max(Se,Math.min(fn-1,Math.floor(l/60))),p=Math.round(l%60/15)*15,m=p>=60?0:p,v=`${String(c).padStart(2,"0")}:${String(m).padStart(2,"0")}`,{error:w}=await g.from("appointments").update({date:t,time:v}).eq("id",n);if(w){x("Hata: "+w.message);return}const E=d.appointments.find(_=>_.id===n);E&&(E.date=t,E.time=v),ce(),x("Randevu taşındı ✓")}function xn(){ce()}function ce(){const e=document.getElementById("view-todolist");if(!e)return;const t=new Date,n=t.getDay()===0?6:t.getDay()-1,a=new Date(t);a.setDate(t.getDate()-n+_e*7),a.setHours(0,0,0,0);const i=Array.from({length:7},(T,f)=>{const L=new Date(a);return L.setDate(a.getDate()+f),L}),o=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],s=H(t),r=`${i[0].getDate()} ${MONTHS_TR[i[0].getMonth()]} – ${i[6].getDate()} ${MONTHS_TR[i[6].getMonth()]} ${i[6].getFullYear()}`,l=window.innerWidth<700;let c=d.appointments;te.studentId&&(c=c.filter(T=>T.studentId===te.studentId)),te.type&&(c=c.filter(T=>T.type===te.type));const p="width:28px;height:28px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;font-family:inherit",m="font-size:11px;padding:4px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;font-family:inherit",v='<option value="">Tüm Öğrenciler</option>'+d.students.map(T=>`<option value="${T.id}"${te.studentId===T.id?" selected":""}>${u(T.name)}</option>`).join(""),w='<option value="">Tüm Tipler</option>'+Object.keys(yn).map(T=>`<option value="${T}"${te.type===T?" selected":""}>${T}</option>`).join(""),E=`
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex-shrink:0">
      <button onclick="agendaPrev()" style="${p}">‹</button>
      <span style="font-size:13px;font-weight:800;min-width:200px;text-align:center">${r}</span>
      <button onclick="agendaNext()" style="${p}">›</button>
      ${_e!==0?'<button onclick="agendaToday()" style="font-size:11px;padding:3px 10px;border-radius:99px;border:1px solid var(--accent);color:var(--accent);background:var(--accent-dim);cursor:pointer;font-family:inherit">Bugüne Dön</button>':""}
      <div style="flex:1"></div>
      <select style="${m}" onchange="agendaSetFilter('studentId',this.value)">${v}</select>
      <select style="${m}" onchange="agendaSetFilter('type',this.value)">${w}</select>
      <button onclick="exportAgendaICS()" style="font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;font-family:inherit;color:var(--text)">📥 ICS</button>
      <button class="btn btn-accent btn-sm" onclick="openAgendaApptModal(null)">+ Randevu</button>
    </div>`;if(l){const T=i.map(f=>{const L=H(f),j=c.filter(C=>C.date===L).sort((C,P)=>(C.time||"").localeCompare(P.time||""));return`<div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;color:${L===s?"var(--accent)":"var(--text-dim)"};margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">${f.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
        ${j.length?j.map(C=>{const P=d.students.find(F=>F.id===C.studentId),R=Ze(C.type);return`<div onclick="openApptPopup('${C.id}',event)" style="display:flex;gap:12px;padding:12px;border-radius:12px;background:var(--surface);border:1px solid var(--border);border-left:4px solid ${R};margin-bottom:6px;cursor:pointer">
            <div style="font-size:12px;font-weight:800;color:${R};min-width:38px">${C.time||""}</div>
            <div><div style="font-size:13px;font-weight:700">${u((P==null?void 0:P.name)||"?")}</div><div style="font-size:11px;color:var(--text-dim)">${u(C.type||"")} · ${C.duration}dk</div></div>
          </div>`}).join(""):'<div style="font-size:12px;color:var(--text-dim);padding:8px 0">—</div>'}
        <button onclick="openAgendaApptModal(null,'${L}')" style="width:100%;border:1.5px dashed var(--border);border-radius:8px;background:none;cursor:pointer;color:var(--text-dim);font-size:11px;padding:6px;font-family:inherit">+ Randevu Ekle</button>
      </div>`}).join("");e.innerHTML=`<div style="display:flex;flex-direction:column;gap:10px;height:calc(100vh - 104px);overflow:hidden">${E}<div style="overflow-y:auto;flex:1">${T}</div></div>`;return}const _=Array.from({length:fn-Se},(T,f)=>Se+f),b=_.length*ie,h=i.map((T,f)=>{const j=H(T)===s;return`<div style="flex:1;min-width:0;text-align:center;padding:6px 4px;border-left:1px solid var(--border)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:${j?"var(--accent)":"var(--text-dim)"}">${o[f]}</div>
      <div style="font-size:18px;font-weight:800;line-height:1.3;${j?"width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;margin:2px auto":"color:var(--text)"}">${T.getDate()}</div>
    </div>`}).join(""),$=i.map(T=>{const f=H(T),L=f===s,j=c.filter(R=>R.date===f),A=_.map((R,F)=>`<div style="position:absolute;top:${F*ie}px;left:0;right:0;height:1px;background:var(--border);pointer-events:none"></div>`).join(""),C=_.map((R,F)=>`<div style="position:absolute;top:${F*ie+ie/2}px;left:0;right:0;height:1px;background:var(--border);opacity:.4;pointer-events:none"></div>`).join(""),P=j.map(R=>{const[F,N]=(R.time||"09:00").split(":").map(Number),G=Math.max(0,(F-Se)*ie+N/60*ie),ae=Math.max((R.duration||45)*ie/60,24),ee=Ze(R.type),mt=d.students.find(Zn=>Zn.id===R.studentId);return`<div
        draggable="true"
        ondragstart="event.stopPropagation();window._draggingApptId='${R.id}';event.dataTransfer.effectAllowed='move'"
        onclick="openApptPopup('${R.id}',event)"
        style="position:absolute;top:${G}px;left:3px;right:3px;height:${ae}px;background:${ee}20;border-left:3px solid ${ee};border-radius:6px;padding:3px 6px;cursor:pointer;overflow:hidden;box-sizing:border-box;transition:transform .1s,box-shadow .1s;z-index:2"
        onmouseover="this.style.transform='scaleX(1.02)';this.style.boxShadow='0 2px 10px ${ee}44'"
        onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="font-size:10px;font-weight:800;color:${ee};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${u((mt==null?void 0:mt.name)||"?")}</div>
        ${ae>34?`<div style="font-size:9px;color:${ee}bb">${R.time}${ae>48?" · "+R.duration+"dk":""}</div>`:""}
      </div>`}).join("");return`<div style="flex:1;min-width:0;position:relative;height:${b}px;${L?"background:var(--accent-dim)":""};border-left:1px solid var(--border)"
      ondragover="event.preventDefault()"
      ondrop="handleApptDrop(event,'${f}')"
      onclick="if(event.target===this)openAgendaApptModal(null,'${f}')">
      ${A}${C}${P}
    </div>`}).join(""),S=_.map((T,f)=>`<div style="position:absolute;top:${f*ie}px;right:6px;transform:translateY(-50%);font-size:9px;font-weight:700;color:var(--text-dim);white-space:nowrap;background:var(--surface);padding:0 2px">${String(T).padStart(2,"0")}:00</div>`).join(""),z=d.appointments.filter(T=>T.date>s||T.date===s&&(T.time||"")>=H(t).slice(0,5)).sort((T,f)=>(T.date||"").localeCompare(f.date||"")||(T.time||"").localeCompare(f.time||"")).slice(0,10),D=z.filter(T=>T.date===s),k=z.filter(T=>T.date>s);function B(T,f){const L=d.students.find(A=>A.id===T.studentId),j=Ze(T.type);return`<div onclick="openApptPopup('${T.id}',event)" style="padding:8px 10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;border-left:3px solid ${j};box-shadow:var(--shadow);transition:transform .1s" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
      ${f?`<div style="font-size:9px;font-weight:700;color:var(--text-dim);margin-bottom:2px;text-transform:uppercase;letter-spacing:.4px">${f}</div>`:""}
      <div style="font-size:11px;font-weight:800;color:${j}">${T.time||"—"}</div>
      <div style="font-size:12px;font-weight:700;color:var(--text)">${u((L==null?void 0:L.name)||"?")}</div>
      <div style="font-size:10px;color:var(--text-dim)">${u(T.type||"")} · ${T.duration}dk</div>
    </div>`}e.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:8px;height:calc(100vh - 104px);overflow:hidden">
      ${E}
      <div style="display:flex;gap:12px;flex:1;overflow:hidden">

        <!-- Timeline -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">
          <!-- Day header row -->
          <div style="display:flex;flex-shrink:0;border-bottom:2px solid var(--border)">
            <div style="width:44px;flex-shrink:0"></div>
            ${h}
          </div>
          <!-- Scrollable body -->
          <div data-tl-scroll style="overflow-y:auto;flex:1;position:relative">
            <div style="display:flex;min-height:${b}px">
              <!-- Hour gutter -->
              <div style="width:44px;flex-shrink:0;position:relative;border-right:1px solid var(--border)">${S}</div>
              <!-- Day columns -->
              <div style="display:flex;flex:1">${$}</div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div style="width:200px;flex-shrink:0;display:flex;flex-direction:column;gap:6px;overflow-y:auto">
          ${D.length?`<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--accent);padding:2px 0">Bugün</div>${D.map(T=>B(T,"")).join("")}`:""}
          ${k.length?`<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);padding:${D.length?"8px":"2px"} 0 2px">Yaklaşan</div>${k.map(T=>{const f=new Date(T.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short",weekday:"short"});return B(T,f)}).join("")}`:""}
          ${z.length?"":'<div style="font-size:12px;color:var(--text-dim);padding:8px 0">Yaklaşan randevu yok</div>'}
        </div>
      </div>
    </div>`;const I=e.querySelector("[data-tl-scroll]");if(I&&_e===0){const T=t.getHours(),f=Math.max(0,(T-Se-1)*ie);setTimeout(()=>{I.scrollTop=f},50)}}function di(e,t){const n=e?d.appointments.find(a=>a.id===e):null;document.getElementById("amTitle").textContent=n?"Randevuyu Düzenle":"Yeni Randevu",document.getElementById("amId").value=e||"",document.getElementById("amStudent").innerHTML=d.students.map(a=>`<option value="${a.id}" ${(n==null?void 0:n.studentId)===a.id?"selected":""}>${u(a.name)}</option>`).join(""),document.getElementById("amDate").value=n?n.date:t||H(new Date),document.getElementById("amTime").value=n?n.time:"14:00",document.getElementById("amDuration").value=n?n.duration:"45",document.getElementById("amType").value=n?n.type:"Haftalık Değerlendirme",document.getElementById("amNote").value=n&&n.note||"",document.getElementById("amMeetLink").value=n&&(n.meetLink||n.meet_link)||"",Y("apptModal")}async function li(e){await Z("Randevu silinsin mi?")&&(await g.from("appointments").delete().eq("id",e),d.appointments=d.appointments.filter(t=>t.id!==e),ce(),x("Randevu silindi"))}function bn(){Oe()}function ci(e){d.activeStuId=e,d.weekOffset=0,le(),_t(e)}function pi(e){const t=e?d.students.find(a=>a.id===e):null;document.getElementById("smTitle").textContent=t?"Öğrenciyi Düzenle":"Yeni Öğrenci",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.pass)||STU_DEFAULT_PASS,document.getElementById("smWeekStart").value=(t==null?void 0:t.weekStart)??0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(a=>a.classList.toggle("sel",a.dataset.c===((t==null?void 0:t.color)||"#f0a500")));const n=document.getElementById("smRoleField");n&&(n.style.display="none"),document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudent()"),Y("studentModal")}document.getElementById("smProg").addEventListener("input",function(){document.getElementById("smProgVal").textContent=this.value+"%"});document.getElementById("smColorPick").addEventListener("click",function(e){const t=e.target.closest(".color-opt");t&&(document.querySelectorAll(".color-opt").forEach(n=>n.classList.remove("sel")),t.classList.add("sel"))});async function mi(){var r;const e=document.getElementById("smName").value.trim();if(!e)return x("İsim girin!");const t=((r=document.querySelector(".color-opt.sel"))==null?void 0:r.dataset.c)||"#f0a500",n=document.getElementById("smId").value,a=he(document.getElementById("smUsername").value.trim())||he(e.split(" ")[0])+Math.floor(Math.random()*100),i=document.getElementById("smPass").value||STU_DEFAULT_PASS,o=await Te(i),s={full_name:e,target:document.getElementById("smTarget").value.trim()||"Hedef belirtilmemiş",color:t,progress:Number(document.getElementById("smProg").value),password_hash:o,week_start:Number(document.getElementById("smWeekStart").value),coach_id:y.coachId};if(n){const{error:l}=await g.rpc("update_student_profile",{p_student_id:n,p_full_name:e,p_target:s.target,p_color:t,p_progress:s.progress,p_week_start:s.week_start,p_username:a,p_plain_password:i,p_password_hash:o});if(l)return x("Hata: "+l.message);const c=d.students.find(p=>p.id===n);c&&Object.assign(c,{name:s.full_name,target:s.target,color:t,progress:s.progress,pass:s.password_hash,weekStart:s.week_start,username:a}),x("Güncellendi ✓"),le(),K("studentModal"),Oe()}else{const l=a+"@rostrumakademi.com",{data:{session:c}}=await g.auth.getSession(),p=await fetch("/api/create-student",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${(c==null?void 0:c.access_token)||""}`},body:JSON.stringify({email:l,password:i,full_name:s.full_name,username:a,color:s.color,target:s.target,progress:s.progress,week_start:s.week_start,coach_id:s.coach_id,exam_profile:"YKS"})}),m=await p.json();if(!p.ok)return x("Hata: "+m.error);const v=m.userId;d.students.push({id:v,name:s.full_name,target:s.target,color:s.color,progress:s.progress||0,pass:o,weekStart:s.week_start||0,username:a}),d.activeStuId||(d.activeStuId=v),le(),K("studentModal"),hn(s.full_name,a,i)}}function hn(e,t,n){let a=document.getElementById("inviteModal");a||(a=document.createElement("div"),a.id="inviteModal",a.className="modal-bg",document.body.appendChild(a),a.addEventListener("click",r=>{r.target===a&&a.classList.remove("open")}));const o=`${window.location.origin+window.location.pathname.replace("app.html","")}app.html`,s=encodeURIComponent(`Merhaba ${e}! 🎓

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
  </div>`,Y("inviteModal")}function ui(e,t,n){const a=`Giriş adresi: ${n}
Kullanıcı adı: ${e}
Şifre: ${t}`;navigator.clipboard.writeText(a).then(()=>x("Kopyalandı ✓")).catch(()=>{const i=document.createElement("textarea");i.value=a,document.body.appendChild(i),i.select(),document.execCommand("copy"),i.remove(),x("Kopyalandı ✓")})}async function vi(e){var n;if(!await Z("Bu öğrenciyi silmek istediğinizden emin misiniz?"))return;const{error:t}=await g.from("users").delete().eq("id",e);if(t)return x("Hata: "+t.message);d.students=d.students.filter(a=>a.id!==e),d.activeStuId===e&&(d.activeStuId=((n=d.students[0])==null?void 0:n.id)||null),le(),bn(),x("Silindi")}function Fe(){var t;const e=document.getElementById("view-appointments");e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${((t=d.students.find(n=>n.id===d.activeStuId))==null?void 0:t.name)||"Öğrenci"}</button>
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
    </div>`,ot(),Dt()}function ot(){const e=d.calYear,t=d.calMonth;document.getElementById("calMonthLbl").textContent=`${MONTHS_TR[t]} ${e}`;const n=new Date(e,t,1).getDay(),a=new Date(e,t+1,0).getDate(),i=$e(),o=new Set(d.appointments.filter(l=>{const c=new Date(l.date);return c.getFullYear()===e&&c.getMonth()===t}).map(l=>new Date(l.date).getDate())),s=n===0?6:n-1;let r="";for(let l=0;l<s;l++)r+='<div class="cal-day empty"></div>';for(let l=1;l<=a;l++){const c=`${e}-${String(t+1).padStart(2,"0")}-${String(l).padStart(2,"0")}`;r+=`<div class="cal-day ${c===i?"today":""} ${c===d.calSelDay&&c!==i?"selected":""} ${o.has(l)?"has-appt":""}" onclick="selCalDay('${c}')">${l}</div>`}document.getElementById("calDaysGrid").innerHTML=r}function gi(e){d.calSelDay=d.calSelDay===e?null:e,ot(),Dt()}function yi(e){d.calMonth+=e,d.calMonth>11&&(d.calMonth=0,d.calYear++),d.calMonth<0&&(d.calMonth=11,d.calYear--),Ye(),ot()}function Dt(){const e=$e();let t=d.appointments,n="Yaklaşan Görüşmeler";if(d.calSelDay?(t=t.filter(a=>a.date===d.calSelDay),n=new Date(d.calSelDay+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long"})):t=t.filter(a=>a.date>=e).sort((a,i)=>a.date.localeCompare(i.date)).slice(0,10),document.getElementById("apptListTitle").textContent=n,!t.length){document.getElementById("apptList").innerHTML='<div class="empty"><p>Randevu yok</p></div>';return}document.getElementById("apptList").innerHTML=t.map(a=>{const i=d.students.find(r=>r.id===a.studentId),s=a.date===e?"BUGÜN":new Date(a.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"});return`<div class="appt-item" style="border-left-color:${(i==null?void 0:i.color)||"#555"}">
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
    </div>`}).join("")}function fi(e){const t=e?d.appointments.find(n=>n.id===e):null;document.getElementById("amTitle").textContent=t?"Randevuyu Düzenle":"Yeni Randevu",document.getElementById("amId").value=e||"",document.getElementById("amStudent").innerHTML=d.students.map(n=>`<option value="${n.id}" ${(t==null?void 0:t.studentId)===n.id?"selected":""}>${u(n.name)}</option>`).join(""),document.getElementById("amDate").value=t?t.date:H(new Date),document.getElementById("amTime").value=t?t.time:"14:00",document.getElementById("amDuration").value=t?t.duration:"45",document.getElementById("amType").value=t?t.type:"Haftalık Değerlendirme",document.getElementById("amNote").value=(t==null?void 0:t.note)||"",document.getElementById("amMeetLink").value=(t==null?void 0:t.meet_link)||"",Y("apptModal")}async function xi(){var o;const e=document.getElementById("amStudent").value,t=document.getElementById("amDate").value,n=document.getElementById("amTime").value;if(!e||!t||!n)return x("Tüm alanları doldurun!");const a=document.getElementById("amId").value,i={student_id:e,coach_id:y.coachId,date:t,time:n,duration:parseInt(document.getElementById("amDuration").value),type:document.getElementById("amType").value,note:document.getElementById("amNote").value.trim(),meet_link:document.getElementById("amMeetLink").value.trim()};if(a){await g.from("appointments").update(i).eq("id",a);const s=d.appointments.find(r=>r.id===a);s&&Object.assign(s,{studentId:e,date:t,time:n,duration:i.duration,type:i.type,note:i.note}),x("Güncellendi ✓")}else{const{data:s,error:r}=await g.from("appointments").insert(i).select().single();if(r)return x("Hata: "+r.message);d.appointments.push({id:s.id,studentId:s.student_id,date:s.date,time:s.time,duration:s.duration,type:s.type,note:s.note}),x("Randevu eklendi ✓")}K("apptModal"),currentTab==="todolist"?ce():(o=document.getElementById("view-appointments"))!=null&&o.classList.contains("active")&&Fe()}async function bi(e){await Z("Bu randevuyu silmek istediğinizden emin misiniz?")&&(await g.from("appointments").delete().eq("id",e),d.appointments=d.appointments.filter(t=>t.id!==e),Fe(),x("Silindi"))}function et(e){return 100+(Number(e.Türkçe||0)+Number(e.Matematik||0)+Number(e.Fen||0)+Number(e.Sosyal||0))*(400/120)}function kn(e,t){const n=a=>Number(t[a]||0);return e==="AYT-SAY"?100+(n("Matematik")+n("Fizik")+n("Kimya")+n("Biyoloji"))*5:e==="AYT-EA"?100+(n("Matematik")+n("Edebiyat")+n("Tarih")+n("Coğrafya"))*5:e==="AYT-SOZ"?100+(n("Edebiyat")+n("Tarih1")+n("Tarih2")+n("Coğrafya1")+n("Coğrafya2")+n("Felsefe")+n("Din"))*5:null}const wn={"AYT-SAY":"SAY","AYT-EA":"EA","AYT-SOZ":"SÖZ"},tt={TYT:"#3B82F6",SAY:"#8B5CF6",EA:"#10B981",SÖZ:"#F59E0B"};function $n(e,t){const{type:n,nets:a}=e;if(n==="TYT"){const l=et(a),c=tt.TYT;return`<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <span style="background:${c}18;border:1px solid ${c}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase">TYT Puan</span>
        <span style="font-size:18px;font-weight:900;color:${c}">${l.toFixed(2)}</span>
      </span>
    </div>`}const i=wn[n];if(!i)return"";const o=tt[i]||"#64748B",s=kn(n,a),r=t.filter(l=>l.type==="TYT"&&l.date<=e.date).sort((l,c)=>c.date.localeCompare(l.date))[0];if(r){const l=et(r.nets),c=l*.4+s*.6;return`<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="background:${o}18;border:1px solid ${o}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
        <span style="font-size:10px;font-weight:700;color:${o};text-transform:uppercase">${i} Puan</span>
        <span style="font-size:18px;font-weight:900;color:${o}">${c.toFixed(2)}</span>
      </span>
      <span style="font-size:11px;color:var(--text-dim)">TYT×0.4 <b>${(l*.4).toFixed(1)}</b> · AYT×0.6 <b>${(s*.6).toFixed(1)}</b></span>
    </div>`}return`<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span style="background:${o}18;border:1px solid ${o}40;border-radius:8px;padding:5px 12px;display:inline-flex;gap:7px;align-items:baseline">
      <span style="font-size:10px;font-weight:700;color:${o};text-transform:uppercase">AYT ${i} Ham</span>
      <span style="font-size:18px;font-weight:900;color:${o}">${s.toFixed(2)}</span>
    </span>
    <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT etkisi dahil değil</span>
  </div>`}function hi(){var l,c;const e=document.getElementById("emPuanDisplay");if(!e)return;const t=(l=document.getElementById("emExamType"))==null?void 0:l.value;if(!t)return;const n={};if((EXAM_DEFS[t]||[]).forEach(p=>{const m=V[p]||{};n[p]=Math.max(0,(m.dogru||0)-(m.yanlis||0)/4)}),t==="TYT"){const p=et(n),m=tt.TYT;e.innerHTML=`<div style="background:${m}12;border:1px solid ${m}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px">
      <span style="font-size:11px;font-weight:700;color:${m};text-transform:uppercase;letter-spacing:.4px">🎯 TYT Puan</span>
      <span style="font-size:24px;font-weight:900;color:${m};letter-spacing:-.5px">${p.toFixed(2)}</span>
    </div>`;return}const a=wn[t],i=tt[a]||"#64748B",o=kn(t,n);if(o===null){e.innerHTML="";return}const s=(c=document.getElementById("emStudent"))==null?void 0:c.value,r=s?[...d.exams].filter(p=>p.studentId===s&&p.type==="TYT").sort((p,m)=>m.date.localeCompare(p.date))[0]:null;if(r){const p=et(r.nets),m=p*.4+o*.6;e.innerHTML=`<div style="background:${i}12;border:1px solid ${i}35;border-radius:10px;padding:10px 14px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:11px;font-weight:700;color:${i};text-transform:uppercase;letter-spacing:.4px">🎯 ${a} Puan</span>
        <span style="font-size:24px;font-weight:900;color:${i};letter-spacing:-.5px">${m.toFixed(2)}</span>
        <span style="font-size:11px;color:var(--text-dim)">TYT×0.4=${(p*.4).toFixed(1)} · AYT×0.6=${(o*.6).toFixed(1)}</span>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px">TYT: ${r.date} tarihli deneme baz alındı</div>
    </div>`}else e.innerHTML=`<div style="background:${i}12;border:1px solid ${i}35;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="font-size:11px;font-weight:700;color:${i};text-transform:uppercase;letter-spacing:.4px">🎯 AYT ${a} Ham</span>
      <span style="font-size:24px;font-weight:900;color:${i};letter-spacing:-.5px">${o.toFixed(2)}</span>
      <span style="font-size:10px;color:var(--text-dim);font-style:italic">TYT puanı bulunamadı</span>
    </div>`}function De(){const e=document.getElementById("view-exams"),t=d.students.find(o=>o.id===d.activeStuId),n=[...d.exams].filter(o=>o.studentId===d.activeStuId).sort((o,s)=>s.date.localeCompare(o.date));let a="";if(n.length>1){const o=[...n].sort((r,l)=>r.date.localeCompare(l.date)).slice(-8),s=Math.max(...o.map(r=>(EXAM_DEFS[r.type]||[]).reduce((c,p)=>{var m;return c+Number(((m=r.nets)==null?void 0:m[p])||0)},0)),1);a=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text-mid)">📈 Net Gelişim · Son ${o.length} deneme</div>
      <div class="bar-chart">
        ${o.map(r=>{const c=(EXAM_DEFS[r.type]||[]).reduce((m,v)=>{var w;return m+Number(((w=r.nets)==null?void 0:w[v])||0)},0),p=Math.max(Math.round(c/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${c.toFixed(0)}</div>
            <div class="bar" style="height:${p}%;background:${(t==null?void 0:t.color)||"var(--accent)"}"></div>
            <div class="bar-label" title="${u(r.name)}">${u(r.name.replace(/Deneme /,"#").replace(/TYT |AYT /,""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const i=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],r=s.reduce((l,c)=>{var p;return l+Number(((p=o.nets)==null?void 0:p[c])||0)},0).toFixed(1);return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:14px;font-weight:700">${u(o.name)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-dim)">Toplam Net</div>
            <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;line-height:1">${r}</div>
          </div>
          <button class="btn btn-ghost btn-xs" onclick="openCommentModal('${o.id}')">💬 Yorumla</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${s.map(l=>{var m;const c=Number(((m=o.nets)==null?void 0:m[l])||0),p=c>=20?"var(--green)":c>=12?"var(--accent)":"var(--red)";return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:8px 12px;min-width:70px;text-align:center">
            <div style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px">${l}</div>
            <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:${p}">${c}</div>
          </div>`}).join("")}
      </div>
      ${$n(o,n)}
      ${o.note?`<div style="margin-top:10px;font-size:12px;color:var(--text-mid);font-style:italic">"${u(o.note)}"</div>`:""}
      ${(()=>{if(!o.examDetails||!Object.keys(o.examDetails).length)return"";const l=s.map(c=>{const p=o.examDetails[c];if(!p)return"";const m=Math.max(0,(p.dogru||0)-(p.yanlis||0)/4).toFixed(2),v=p.yanlis_konular||[];return`<div style="padding:6px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${v.length?"5px":"0"}">
              <span style="font-size:11px;font-weight:700;color:var(--text-mid)">${u(c)}</span>
              <span style="font-size:11px;color:var(--text-dim)">D:<b style="color:var(--green)">${p.dogru||0}</b> Y:<b style="color:var(--red)">${p.yanlis||0}</b> B:<b>${p.bos||0}</b> · Net <b style="color:var(--accent)">${m}</b></span>
            </div>
            ${v.length?`<div style="display:flex;flex-wrap:wrap;gap:3px">${v.map(w=>`<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(255,92,122,.1);color:var(--red);border:1px solid rgba(255,92,122,.2)">${u(w)}</span>`).join("")}</div>`:""}
          </div>`}).filter(Boolean).join("");return l?`<div style="margin-top:10px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px 14px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📋 Ders Detayları</div>
          ${l}
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
        <button class="btn btn-ghost btn-sm" onclick="openKonuRaporu('${d.activeStuId}')">📊 Konu Raporu</button>
      </div>
    </div>
    ${a}
    ${i}`}let Tn=null,ye="TYT";const ki=["TYT","AYT-SAY","AYT-EA","AYT-SOZ"];function En(){const t=d.exams.filter(s=>s.studentId===Tn).filter(s=>s.type===ye&&s.examDetails&&Object.keys(s.examDetails).length),n={};t.forEach(s=>{Object.entries(s.examDetails).forEach(([r,l])=>{(l.yanlis_konular||[]).forEach(c=>{const p=r+"§"+c;n[p]=(n[p]||0)+1})})});const a=Object.entries(n).sort((s,r)=>r[1]-s[1]).map(([s,r])=>{const[l,c]=s.split("§"),p=Math.round(r/Math.max(t.length,1)*100),m=r>=3?"var(--red)":r===2?"var(--accent)":"var(--text-mid)";return`<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px;font-size:12px;color:var(--text-dim);white-space:nowrap">${u(l)}</td>
        <td style="padding:8px 10px;font-size:13px;font-weight:600">${u(c)}</td>
        <td style="padding:8px 10px;text-align:center">
          <span style="font-size:14px;font-weight:800;color:${m}">${r}</span>
          <span style="font-size:10px;color:var(--text-dim)">/${t.length}</span>
        </td>
        <td style="padding:8px 10px;min-width:90px">
          <div style="height:6px;border-radius:3px;background:var(--surface2);overflow:hidden">
            <div style="height:100%;width:${p}%;background:${m};border-radius:3px;transition:width .3s"></div>
          </div>
        </td>
      </tr>`}),i=ki.map(s=>`<button onclick="window._krType='${s}';_krRenderBody()" style="padding:6px 14px;border-radius:20px;border:1px solid ${s===ye?"var(--accent)":"var(--border)"};background:${s===ye?"var(--accent-dim)":"transparent"};color:${s===ye?"var(--accent)":"var(--text-dim)"};font-size:12px;cursor:pointer;font-weight:${s===ye?700:400}">${s}</button>`).join(""),o=a.length?`<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px">${t.length} denemeden derlendi · <b>${a.length}</b> farklı yanlış konu · 🔴 ≥3 tekrar kritik</div>
       <div style="overflow-x:auto">
       <table style="width:100%;border-collapse:collapse">
         <thead><tr style="border-bottom:2px solid var(--border)">
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Ders</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Konu</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:center;text-transform:uppercase;letter-spacing:.5px">Tekrar</th>
           <th style="padding:6px 10px;font-size:10px;color:var(--text-dim);text-align:left;text-transform:uppercase;letter-spacing:.5px">Sıklık</th>
         </tr></thead>
         <tbody>${a.join("")}</tbody>
       </table></div>`:`<div style="text-align:center;padding:40px;color:var(--text-dim);font-size:13px">${t.length?"Bu denemeler için henüz konu işaretlenmemiş.":ye+" tipi deneme kaydı yok."}</div>`;document.getElementById("konuRaporuBody").innerHTML=`
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${i}</div>
    ${o}`}window._krRenderBody=En;function wi(e){Tn=e;const t=d.exams.find(n=>n.studentId===e&&n.examDetails&&Object.keys(n.examDetails).length);ye=(t==null?void 0:t.type)||"TYT",En(),Y("konuRaporuModal")}window.openKonuRaporu=wi;function $i(e){const t=d.exams.find(n=>n.id===e);document.getElementById("cmExamId").value=e,document.getElementById("cmText").value=(t==null?void 0:t.coachComment)||"",Y("commentModal")}async function Ti(){const e=document.getElementById("cmExamId").value,t=document.getElementById("cmText").value.trim();await g.from("exams").update({coach_comment:t}).eq("id",e);const n=d.exams.find(a=>a.id===e);n&&(n.coachComment=t),K("commentModal"),De(),x("Yorum kaydedildi ✓")}async function Ei(e){await Z("Bu denemeyi silmek istediğinizden emin misiniz?")&&(await g.from("exams").delete().eq("id",e),d.exams=d.exams.filter(t=>t.id!==e),De(),x("Silindi"))}function In(){const e=document.getElementById("view-messages");e.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>Mesajlar</h2></div>
    <div class="msg-layout">
      <div class="msg-sidebar">
        <div class="msg-sidebar-hd">Öğrenciler</div>
        ${d.students.map(t=>{const n=d.messages[t.id]||[],a=n[n.length-1],i=n.filter(o=>o.from==="student"&&!o.read).length;return`<div class="msg-contact ${d.msgThread===t.id?"active":""}" onclick="selectThread('${t.id}')">
            <div class="msg-contact-avatar" style="background:${t.color}">${t.name[0]}</div>
            <div style="flex:1;min-width:0">
              <div class="msg-contact-name">${u(t.name.split(" ")[0])}</div>
              <div class="msg-contact-last">${a?u(a.text.slice(0,35)):"Mesaj yok"}</div>
            </div>
            ${i?`<span class="msg-unread">${i}</span>`:""}
          </div>`}).join("")}
      </div>
      <div class="msg-main" id="msgMain">
        ${d.msgThread?ve(d.msgThread,"coach"):'<div class="no-chat-sel">Öğrenci seçin</div>'}
      </div>
    </div>`,d.msgThread&&ge()}async function Ii(e){d.msgThread=e;const t=(d.messages[e]||[]).filter(n=>n.from==="student"&&!n.read&&n._id).map(n=>n._id);t.length&&await g.from("messages").update({read:!0}).in("id",t),(d.messages[e]||[]).forEach(n=>{n.from==="student"&&(n.read=!0)}),document.getElementById("msgMain").innerHTML=ve(e,"coach"),document.querySelectorAll(".msg-contact").forEach(n=>n.classList.remove("active")),d.students.forEach((n,a)=>{var i;n.id===e&&((i=document.querySelectorAll(".msg-contact")[a])==null||i.classList.add("active"))}),ge(),Pt()}function ve(e,t){const n=d.students.find(o=>o.id===e),i=(d.messages[e]||[]).map(o=>`<div class="msg-bubble ${t==="coach"&&o.from==="coach"||t==="student"&&o.from==="student"?"out":"in"}">${u(o.text)}<div class="msg-bubble-time">${o.time}</div></div>`).join("");return`<div class="msg-main-hd">
    <div style="width:30px;height:30px;border-radius:8px;background:${(n==null?void 0:n.color)||"#555"};color:#0f0e0c;font-family:'Inter',sans-serif;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">${(n==null?void 0:n.name[0])||"?"}</div>
    <div class="msg-main-hd-name">${u((n==null?void 0:n.name)||"")}</div>
  </div>
  <div class="msg-body" id="msgBody">${i||'<div class="empty"><p>Henüz mesaj yok</p></div>'}</div>
  <div class="msg-input-area">
    <textarea class="msg-input" id="msgInput" placeholder="Mesaj yaz..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg('${e}','${t}');}"></textarea>
    <button class="btn btn-accent" onclick="sendMsg('${e}','${t}')">Gönder</button>
  </div>`}async function Si(e,t){var r,l;const n=document.getElementById("msgInput"),a=n.value.trim();if(!a)return;const i=y.coachId||((r=d.students.find(c=>c.id===e))==null?void 0:r.coachId)||((l=d.students.find(c=>c.id===y.studentId))==null?void 0:l.coachId),{data:o,error:s}=await g.from("messages").insert({student_id:e,coach_id:i,from_role:t,text:a,read:!1}).select().single();if(s){console.error("sendMsg error:",s),x("Hata: "+s.message);return}d.messages[e]||(d.messages[e]=[]),d.messages[e].push({_id:o.id,from:t,text:a,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),n.value="",currentTab==="messages"&&(document.getElementById("msgMain").innerHTML=ve(e,"coach"),ge()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=ve(e,"student"),ge())}function ge(){setTimeout(()=>{const e=document.getElementById("msgBody");e&&(e.scrollTop=e.scrollHeight)},60)}function st(){const e=document.getElementById("view-portal");if(!e)return;let t=d.students.find(l=>l.id===y.studentId);if(!t&&d.students.length>0&&(t=d.students[0]),!t){e.innerHTML=`<div style="text-align:center;padding:60px 20px;color:var(--text-mid)">
      <div style="font-size:36px;margin-bottom:12px">⏳</div>
      <p style="font-size:14px">Profil yükleniyor...</p>
    </div>`,setTimeout(()=>{d.students.length&&st()},800);return}y.studentId||(y.studentId=t.id),d.activeStuId=t.id;const n=$e(),a=`${t.id}_${n}`,i=d.tasks[a]||[],o=i.filter(l=>l.done).length,s=d.appointments.filter(l=>l.studentId===t.id&&l.date>=n).sort((l,c)=>l.date.localeCompare(c.date))[0],r=(d.messages[t.id]||[]).filter(l=>l.from==="coach"&&!l.read).length;e.innerHTML=`
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
          ${i.map((l,c)=>`
            <div class="task-card task-${l.type} ${l.done?"done":""}" style="margin-bottom:6px">
              <div class="tc-check ${l.done?"on":""}" onclick="stuToggleTask('${n}',${c})"></div>
              <div class="tc-body">
                <div class="tc-type">${Ke(l.type)}${l.exam?" · "+l.exam:""}</div>
                <div class="tc-subject">${u(l.subject)}</div>
                <div class="tc-meta">${l.duration} dk${l.note?" · "+u(l.note):""}</div>
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
        ${r>0?`<div class="card cp" style="border-color:var(--accent);cursor:pointer" onclick="switchTab('smessages')">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div><div style="font-weight:700">${r} yeni mesaj</div><div style="font-size:12px;color:var(--text-mid)">Koçundan</div></div>
          </div>
        </div>`:""}
      </div>
    </div>`}async function _i(e,t){var s;const n=d.students.find(r=>r.id===y.studentId);if(!n)return;const a=`${n.id}_${e}`,i=(s=d.tasks[a])==null?void 0:s[t];if(!i)return;const o=!i.done;await g.from("tasks").update({done:o}).eq("id",i._id),i.done=o,st()}function Ee(){const e=d.students.find(r=>r.id===y.studentId);if(!e)return;const t=document.getElementById("view-sportal"),n=e.weekStart??0,a=W(d.weekOffset,n),i=q(a,6),o=$e();let s="";for(let r=0;r<7;r++){const l=q(a,r),c=H(l),p=c===o,m=`${e.id}_${c}`,v=d.tasks[m]||[],w=v.reduce((h,$)=>h+Number($.duration),0),E=v.reduce((h,$)=>h+($.done?Number($.duration):0),0);DAYS_TR[(n+r)%7];const _=v.map((h,$)=>`
      <div class="task-card task-${h.type} ${h.done?"done":""}" onclick="openTaskDetail('${c}',${$},'student')" style="cursor:pointer">
        <div class="tc-check ${h.done?"on":""}" onclick="event.stopPropagation();stuToggleTask2('${c}',${$})"></div>
        <div class="tc-body">
          <div class="tc-type">${Ke(h.type)}${h.exam?" · "+h.exam:""}</div>
          <div class="tc-subject">${u(h.subject)}</div>
          <div class="tc-meta">${h.duration} dk</div>
        </div>
      </div>`).join(""),b=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][(n+r)%7];s+=`<div class="day-col ${p?"today":""}">
      <div class="day-hd">
        <div><div class="day-name-lbl">${b}</div><div class="day-num">${l.getDate()}</div></div>
        <span class="day-badge" style="font-size:8.5px">${Re(E)} / ${Re(w)}</span>
      </div>
      <div class="day-tasks-list">${_||'<div class="empty" style="padding:8px 0"><p style="font-size:11px">Görev yok</p></div>'}</div>
    </div>`}t.innerHTML=`
    <div class="week-nav" style="margin-bottom:14px">
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(-1)">← Önceki</button>
      <span class="week-lbl">${a.getDate()} ${MONTHS_TR[a.getMonth()]} — ${i.getDate()} ${MONTHS_TR[i.getMonth()]} ${i.getFullYear()}</span>
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(1)">Sonraki →</button>
      <button class="btn btn-ghost btn-sm" onclick="S.weekOffset=0;saveUI();renderSPortal()">Bugün</button>
    </div>
    <div class="week-grid">${s}</div>`}async function zi(e,t){var s;const n=d.students.find(r=>r.id===y.studentId);if(!n)return;const a=`${n.id}_${e}`,i=(s=d.tasks[a])==null?void 0:s[t];if(!i)return;const o=!i.done;await g.from("tasks").update({done:o}).eq("id",i._id),i.done=o,Ee()}function Bi(e){d.weekOffset+=e,le(),Ee()}function Ct(e,t,n){var w,E,_,b;const i=`${y.role==="student"?y.studentId:d.activeStuId}_${e}`,o=(w=d.tasks[i])==null?void 0:w[t];if(!o)return;let s=document.getElementById("taskDetailModal");s||(s=document.createElement("div"),s.id="taskDetailModal",s.className="modal-bg",document.body.appendChild(s),s.addEventListener("click",h=>{h.target===s&&s.classList.remove("open")}));const r={soru:"var(--blue)",konu:"#c084fc",deneme:"var(--accent)",diger:"var(--text-mid)"},l={soru:"Soru Bankası",konu:"Konu Anlatımı",deneme:"Deneme",diger:"Diğer"},c=r[o.type]||"var(--accent)",p=o.type==="konu",m=o.task_items||[];let v="";m.length>0?v=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${p?"Videolar":"Testler"} (${m.length})</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:200px;overflow-y:auto">
        ${m.map((h,$)=>`
          <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);${$===m.length-1?"border-bottom:none":""};cursor:pointer;transition:background .1s"
            onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
            <input type="checkbox" ${h.done?"checked":""} onchange="toggleDetailItem('${e}',${t},${$},'${n}')"
              style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;">
            <div style="width:20px;height:20px;border-radius:6px;background:${c}22;color:${c};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:4px">${$+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;line-height:1.4;${h.done?"text-decoration:line-through;color:var(--text-dim);":""}">${u(h.label||`Ders ${$+1}`)}</div>
              <div style="font-size:11px;color:var(--text-mid);margin-top:2px">⏱ ${h.soru>0?p?h.soru+" dk":h.soru+" soru":"?"}</div>
            </div>
            ${h.url?`<a href="${u(h.url)}" target="_blank" onclick="event.stopPropagation()"
              style="display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:6px 12px;border-radius:8px;text-decoration:none;flex-shrink:0;white-space:nowrap">▶ İzle</a>`:""}
          </label>`).join("")}
      </div>
    </div>`:o.note&&(o.note.includes("test:")||o.note.includes("video:"))&&(v=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${p?"Videolar":"Testler"}</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--text-mid)">${u(o.note)}</div>
    </div>`),s.innerHTML=`<div class="modal">
    <button class="modal-close" onclick="cm('taskDetailModal')">×</button>

    <!-- Görev başlık -->
    <div style="border-left:3px solid ${c};padding-left:12px;margin-bottom:20px">
      <div style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${l[o.type]||o.type}${o.exam?" · "+o.exam:""}</div>
      <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;line-height:1.2">${u(o.subject)}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px">${new Date(e+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
    </div>

    <!-- Tamamlandı toggle -->
    <div id="tdDoneBox" style="background:var(--surface2);border:1.5px solid ${o.done?"var(--green)":"var(--border)"};border-radius:11px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;cursor:pointer;transition:all .2s" onclick="toggleTaskDetail('${e}',${t},'${n}')">
      <div style="font-size:13px;font-weight:700;color:${o.done?"var(--green)":"var(--text)"}">${o.done?"✓ Tamamlandı":"Tamamlandı mı?"}</div>
      <div style="width:22px;height:22px;border-radius:6px;border:2px solid ${o.done?"var(--green)":"var(--border)"};background:${o.done?"var(--green)":"transparent"};display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .2s">${o.done?"✓":""}</div>
    </div>

    <!-- Test/Video listesi -->
    ${v}

    <!-- Sonuç Gir (soru/deneme türleri için) -->
    ${o.type==="soru"||o.type==="deneme"?`
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📊 Sonucu Gir</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:4px">✓ Doğru</div>
          <input type="number" id="tdDogru" min="0" value="${((E=o.student_result)==null?void 0:E.dogru)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);margin-bottom:4px">✗ Yanlış</div>
          <input type="number" id="tdYanlis" min="0" value="${((_=o.student_result)==null?void 0:_.yanlis)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);margin-bottom:4px">— Boş</div>
          <input type="number" id="tdBos" min="0" value="${((b=o.student_result)==null?void 0:b.bos)??""}" placeholder="0"
            style="width:100%;padding:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;text-align:center;box-sizing:border-box">
        </div>
      </div>
      ${o.student_result?`<div style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:right">Son güncelleme: ${new Date(o.student_result.ts||Date.now()).toLocaleDateString("tr-TR")}</div>`:""}
    </div>
    ${(()=>{var $;const h=ja(o.exam,o.subject);return h?(be=[...(($=o.student_result)==null?void 0:$.yanlis_konular)||[]],`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">📌 Yanlış Konular</div>
        <div style="display:flex;flex-wrap:wrap;gap:0">${h.map(S=>{const z=be.includes(S);return`<span onclick="toggleKonuChip(this,'${S.replace(/'/g,"\\'")}')"
            style="display:inline-block;padding:5px 11px;margin:3px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;user-select:none;border:1px solid ${z?"var(--red)":"var(--border)"};background:${z?"rgba(255,92,122,.12)":"var(--surface)"};color:${z?"var(--red)":"var(--text-mid)"}">
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
  </div>`,Y("taskDetailModal")}async function Mi(e,t,n){var s;const i=`${y.role==="student"?y.studentId:d.activeStuId}_${e}`,o=(s=d.tasks[i])==null?void 0:s[t];o&&(o.done=!o.done,o.task_items&&Array.isArray(o.task_items)&&o.task_items.forEach(r=>{r.done=o.done}),await g.from("tasks").update({done:o.done,task_items:o.task_items||null}).eq("id",o._id),Ct(e,t,n),n==="student"?Ee():U())}async function Ai(e,t,n,a){var l;const o=`${y.role==="student"?y.studentId:d.activeStuId}_${e}`,s=(l=d.tasks[o])==null?void 0:l[t];if(!s||!s.task_items)return;s.task_items[n].done=!s.task_items[n].done;const r=s.task_items.every(c=>c.done);s.done=r,M(!0),await g.from("tasks").update({task_items:s.task_items,done:s.done}).eq("id",s._id),M(!1),Ct(e,t,a),a==="student"?Ee():U(),x("İlerleme kaydedildi ✓")}function Di(e,t){var i,o,s;e.closest("div").querySelectorAll("button[data-speed]").forEach(r=>{const l=r.dataset.speed===t;r.style.borderColor=l?"var(--accent)":"var(--border)",r.style.background=l?"var(--accent-dim)":"var(--surface2)",r.style.color=l?"var(--accent)":"var(--text-mid)"}),document.getElementById("tdSpeed").value=t;const n=parseFloat(t),a=document.getElementById("speedCalc");if(a){const r=parseInt(((s=(o=(i=a.closest("[id=speedInfo]"))==null?void 0:i.textContent)==null?void 0:o.match(/Toplam (\d+) dk/))==null?void 0:s[1])||0);a.textContent=Math.ceil(r/n)+" dk",document.getElementById("tdDuration").value=Math.ceil(r/n)}}async function Ci(e,t,n){var m,v;const i=`${y.role==="student"?y.studentId:d.activeStuId}_${e}`,o=(m=d.tasks[i])==null?void 0:m[t];if(!o)return;const s=((v=document.getElementById("tdNote"))==null?void 0:v.value.trim())||"",r={student_note:s},l=document.getElementById("tdDogru"),c=document.getElementById("tdYanlis"),p=document.getElementById("tdBos");if(l!==null){const w=parseInt(l.value)||0,E=parseInt(c.value)||0,_=parseInt(p.value)||0;(w>0||E>0||_>0||be.length>0)&&(r.student_result={dogru:w,yanlis:E,bos:_,yanlis_konular:[...be],ts:new Date().toISOString()},o.student_result=r.student_result)}await g.from("tasks").update(r).eq("id",o._id),o.student_note=s,K("taskDetailModal"),x("Kaydedildi ✓"),n==="student"?Ee():U()}function Lt(){const e=d.students.find(o=>o.id===y.studentId);if(!e)return;const t=document.getElementById("view-sexams"),n=[...d.exams].filter(o=>o.studentId===e.id).sort((o,s)=>s.date.localeCompare(o.date));let a="";if(n.length>1){const o=[...n].sort((r,l)=>r.date.localeCompare(l.date)).slice(-8),s=Math.max(...o.map(r=>(EXAM_DEFS[r.type]||[]).reduce((c,p)=>{var m;return c+Number(((m=r.nets)==null?void 0:m[p])||0)},0)),1);a=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px">📈 Net Gelişimim</div>
      <div class="bar-chart">
        ${o.map(r=>{const c=(EXAM_DEFS[r.type]||[]).reduce((m,v)=>{var w;return m+Number(((w=r.nets)==null?void 0:w[v])||0)},0),p=Math.max(Math.round(c/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${c.toFixed(0)}</div>
            <div class="bar" style="height:${p}%;background:${e.color}"></div>
            <div class="bar-label">${u(r.name.replace("Deneme ","#").replace("TYT ","").replace("AYT ",""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const i=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],r=s.reduce((c,p)=>{var m;return c+Number(((m=o.nets)==null?void 0:m[p])||0)},0).toFixed(1),l=s.map(c=>{var m;const p=Number(((m=o.nets)==null?void 0:m[c])||0);return`<div class="net-box"><div class="net-label">${c}</div><div class="net-val ${$t(p)}">${p}</div></div>`}).join("");return`<div class="exam-item">
      <div class="exam-header">
        <div><div class="exam-name">${u(o.name)}</div><div class="exam-date">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
        <button class="btn btn-ghost btn-xs" onclick="openStudentExamModal('${o.id}')">✏️ Düzenle</button>
      </div>
      ${o.note?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:8px;font-style:italic">"${u(o.note)}"</div>`:""}
      <div class="nets-grid">${l}</div>
      <div style="margin-top:8px"><div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800">Toplam: ${r}</div></div>
      ${$n(o,n)}
      ${o.coachComment?`<div class="coach-comment-box"><strong>Koç Yorumu</strong>${u(o.coachComment)}</div>`:""}
    </div>`}).join(""):'<div class="empty"><p>Henüz deneme sonucu eklemediniz.<br>İlk sonucunuzu girin!</p></div>';t.innerHTML=`
    <div class="sh"><h2>Denemelerim</h2><button class="btn btn-accent" onclick="openStudentExamModal()">+ Sonuç Gir</button></div>
    ${a}${i}`}function Sn(e){var n;const t=e?d.exams.find(a=>a.id===e):null;document.getElementById("emTitle").textContent=t?"Sonucu Düzenle":"Deneme Sonucu Gir",document.getElementById("emId").value=e||"",document.getElementById("emName").value=(t==null?void 0:t.name)||"",document.getElementById("emDate").value=(t==null?void 0:t.date)||H(new Date),document.getElementById("emStudentWrap").style.display="none",document.getElementById("emStudent").innerHTML=`<option value="${y.studentId}">${u(((n=d.students.find(a=>a.id===y.studentId))==null?void 0:n.name)||"")}</option>`,document.getElementById("emExamType").value=(t==null?void 0:t.type)||"TYT",document.getElementById("emNote").value=(t==null?void 0:t.note)||"",jt(),t!=null&&t.examDetails&&Object.entries(t.examDetails).forEach(([a,i])=>{const o=document.getElementById(`ed_${a}_d`),s=document.getElementById(`ed_${a}_y`),r=document.getElementById(`ed_${a}_b`);o&&(o.value=i.dogru||0,s.value=i.yanlis||0,r.value=i.bos||0),V[a]={...i},_n(a),(i.yanlis_konular||[]).forEach(l=>{document.querySelectorAll(`#konu_acc_${a.replace(/\s/g,"_")} span`).forEach(p=>{p.textContent.trim()===l&&(p.style.borderColor="var(--red)",p.style.background="rgba(255,92,122,.12)",p.style.color="var(--red)")})})}),Y("examModal")}function Li(e){document.getElementById("emStudentWrap").style.display="",document.getElementById("emStudent").innerHTML=d.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Sn(e),document.getElementById("emStudentWrap").style.display=""}let V={};function ji(e,t,n){V[t]||(V[t]={dogru:0,yanlis:0,bos:0,yanlis_konular:[]});const a=V[t].yanlis_konular,i=a.indexOf(n);i===-1?(a.push(n),e.style.borderColor="var(--red)",e.style.background="rgba(255,92,122,.12)",e.style.color="var(--red)"):(a.splice(i,1),e.style.borderColor="var(--border)",e.style.background="var(--surface)",e.style.color="var(--text-mid)")}window.toggleExamKonuChip=ji;function _n(e){var c,p,m,v;const t=parseInt((c=document.getElementById(`ed_${e}_d`))==null?void 0:c.value)||0,n=parseInt((p=document.getElementById(`ed_${e}_y`))==null?void 0:p.value)||0,a=parseInt((m=document.getElementById(`ed_${e}_b`))==null?void 0:m.value)||0;V[e]||(V[e]={yanlis_konular:[]}),V[e].dogru=t,V[e].yanlis=n,V[e].bos=a;const i=document.getElementById("emExamType").value,o=((v=EXAM_SORU[i])==null?void 0:v[e])||40,s=t+n+a,r=document.getElementById(`ed_${e}_net`),l=document.getElementById(`ed_${e}_warn`);r&&(r.textContent=Math.max(0,t-n/4).toFixed(2)),l&&(l.style.display=s>o?"":"none"),hi()}window.updateExamNet=_n;function Pi(e){const t=document.getElementById(`konu_acc_${e.replace(/\s/g,"_")}`);t&&(t.style.display=t.style.display==="none"?"":"none")}window.toggleKonuAccordion=Pi;function jt(){const e=document.getElementById("emExamType").value,t=EXAM_DEFS[e]||[];V={};const n=document.getElementById("emPuanDisplay");n&&(n.innerHTML=""),document.getElementById("netInputsWrap").innerHTML=t.map(a=>{var l;const i=((l=EXAM_SORU[e])==null?void 0:l[a])||40,s=(EXAM_KONU_MAP[`${e}_${a}`]||[]).flatMap(c=>He[c]||[]),r=s.length?`
      <div style="margin-top:8px">
        <button type="button" onclick="toggleKonuAccordion('${a}')"
          style="font-size:11px;font-weight:700;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px">
          📌 Yanlış Konular <span style="font-size:10px">▾</span>
        </button>
        <div id="konu_acc_${a.replace(/\s/g,"_")}" style="display:none;margin-top:6px;display:flex;flex-wrap:wrap;gap:0">
          ${s.map(c=>`<span onclick="toggleExamKonuChip(this,'${a}','${c.replace(/'/g,"\\'")}')"
            style="display:inline-block;padding:4px 10px;margin:2px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;user-select:none;border:1px solid var(--border);background:var(--surface);color:var(--text-mid)">${u(c)}</span>`).join("")}
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
      ${r}
    </div>`}).join("")}async function Ri(){var r;const e=document.getElementById("emName").value.trim();if(!e)return x("Sınav adı girin!");const t=document.getElementById("emExamType").value,n={};(EXAM_DEFS[t]||[]).forEach(l=>{const c=V[l]||{};n[l]=Math.max(0,(c.dogru||0)-(c.yanlis||0)/4)});const a=document.getElementById("emId").value,i=document.getElementById("emStudent").value,o={name:e,date:document.getElementById("emDate").value,student_id:i,coach_id:y.coachId||((r=d.students.find(l=>l.id===i))==null?void 0:r.coachId),exam_type:t,nets:n,exam_details:V,student_note:document.getElementById("emNote").value.trim()};async function s(l,c,p){var m,v,w;if(c){const{error:E}=await g.from("exams").update(l).eq("id",p);if((m=E==null?void 0:E.message)!=null&&m.includes("exam_details")){const{exam_details:_,...b}=l;return g.from("exams").update(b).eq("id",p)}return{error:E}}else{const E=await g.from("exams").insert(l).select().single();if((w=(v=E.error)==null?void 0:v.message)!=null&&w.includes("exam_details")){const{exam_details:_,...b}=l;return g.from("exams").insert(b).select().single()}return E}}if(a){const{error:l}=await s(o,!0,a);if(l)return x("Hata: "+l.message);const c=d.exams.find(p=>p.id===a);c&&Object.assign(c,{name:o.name,date:o.date,studentId:i,type:t,nets:n,examDetails:V,note:o.student_note}),x("Güncellendi ✓")}else{const{data:l,error:c}=await s(o,!1,null);if(c)return x("Hata: "+c.message);d.exams.push({id:l.id,studentId:l.student_id,name:l.name,date:l.date,type:l.exam_type,nets:l.nets||{},examDetails:l.exam_details||{},note:l.student_note,coachComment:""}),x("Deneme eklendi ✓")}K("examModal"),y.role==="student"?Lt():De()}async function ht(){const e=d.students.find(a=>a.id===y.studentId);if(!e)return;const t=(d.messages[e.id]||[]).filter(a=>a.from==="coach"&&!a.read&&a._id).map(a=>a._id);t.length&&await g.from("messages").update({read:!0}).in("id",t),(d.messages[e.id]||[]).forEach(a=>{a.from==="coach"&&(a.read=!0)});const n=document.getElementById("view-smessages");n.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>💬 Koçuma Yaz</h2></div>
    <div class="card" style="max-width:700px;overflow:hidden">
      <div class="msg-main" id="msgMain" style="display:flex;flex-direction:column;min-height:420px">
        ${ve(e.id,"student")}
      </div>
    </div>`,ge()}let Je=null;function Pt(){Rt();const e=y.role==="coach"||y.role==="developer"?d.msgThread:y.studentId;e&&(Je=g.channel("messages_"+e).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`student_id=eq.${e}`},t=>{const n=t.new;d.messages[e]||(d.messages[e]=[]),!d.messages[e].find(a=>a._id===n.id)&&(d.messages[e].push({_id:n.id,from:n.from_role,text:n.text,read:n.read,time:new Date(n.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}),currentTab==="messages"&&d.msgThread===e&&(document.getElementById("msgMain").innerHTML=ve(e,"coach"),ge()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=ve(e,"student"),ge()))}).subscribe())}function Rt(){Je&&(g.removeChannel(Je),Je=null)}async function zn(){const e=document.getElementById("view-dev-dashboard");e.innerHTML='<div class="sh"><h2>🖥️ Sistem Dashboard</h2></div><div class="empty"><p>Yükleniyor...</p></div>';const[t,n,a,i,o,s]=await Promise.all([g.from("users").select("id,role,created_at"),g.from("tasks").select("id,done,created_at"),g.from("exams").select("id,created_at"),g.from("messages").select("id,created_at"),g.from("tickets").select("id,status,created_at"),g.from("payments").select("id,amount,status,payment_date")]),r=t.data||[],l=n.data||[],c=a.data||[],p=i.data||[],m=o.data||[],v=s.data||[],w=r.filter(z=>z.role==="coach").length,E=r.filter(z=>z.role==="student").length,_=v.filter(z=>z.status==="completed").reduce((z,D)=>z+Number(D.amount),0),b=m.filter(z=>z.status==="open").length,h=Array.from({length:7},(z,D)=>{const k=new Date;return k.setDate(k.getDate()-6+D),H(k)}),$=h.map(z=>l.filter(D=>{var k;return(k=D.created_at)==null?void 0:k.startsWith(z)}).length),S=Math.max(...$,1);e.innerHTML=`
    <div class="sh"><h2>🖥️ Sistem Dashboard</h2><span style="font-size:12px;color:var(--text-dim)">${new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>

    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Öğrenci</div><div class="stat-val" style="color:var(--blue)">${E}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Koç</div><div class="stat-val" style="color:var(--accent)">${w}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Görev</div><div class="stat-val">${l.length}</div><div style="font-size:11px;color:var(--green);margin-top:3px">✓ ${l.filter(z=>z.done).length} tamamlandı</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Deneme</div><div class="stat-val">${c.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Mesaj</div><div class="stat-val">${p.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Gelir</div><div class="stat-val" style="color:var(--green)">${_.toLocaleString("tr-TR")} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Açık Ticket</div><div class="stat-val" style="color:${b>0?"var(--red)":"var(--green)"}">${b}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">📅 Son 7 Gün Görev Aktivitesi</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:80px">
          ${h.map((z,D)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="font-size:10px;color:var(--text-mid);font-weight:600">${$[D]}</div>
            <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${Math.max(Math.round($[D]/S*100),4)}%;min-height:3px;opacity:.8"></div>
            <div style="font-size:9px;color:var(--text-dim)">${new Date(z+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card cp">
        <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">🎫 Son Ticket'lar</div>
        ${m.slice(-5).reverse().map(z=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span style="color:var(--text-mid)">#${z.id.slice(0,6)}</span>
            <span class="role-badge" style="background:${z.status==="open"?"var(--red-dim)":z.status==="resolved"?"var(--green-dim)":"var(--accent-dim)"};color:${z.status==="open"?"var(--red)":z.status==="resolved"?"var(--green)":"var(--accent)"}">${z.status}</span>
          </div>`).join("")||'<div style="font-size:12px;color:var(--text-dim)">Ticket yok</div>'}
      </div>
    </div>`}async function rt(){const e=document.getElementById("view-dev-users"),{data:t}=await g.from("users").select("*").order("created_at");e.innerHTML=`
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
    </div>`}async function Hi(e){const t=e?(await g.from("users").select("*").eq("id",e).single()).data:null;document.getElementById("smTitle").textContent=t?"Kullanıcıyı Düzenle":"Yeni Kullanıcı",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.full_name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.password_hash)||"",document.getElementById("smWeekStart").value=(t==null?void 0:t.week_start)||0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(a=>a.classList.toggle("sel",a.dataset.c===((t==null?void 0:t.color)||"#f0a500")));let n=document.getElementById("smRoleField");n||(n=document.createElement("div"),n.id="smRoleField",n.className="field",n.innerHTML='<label>Rol</label><select id="smRole" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none"><option value="student">Öğrenci</option><option value="coach">Koç</option><option value="developer">Developer</option></select>',document.getElementById("smName").closest(".modal").insertBefore(n,document.getElementById("smName").parentElement)),document.getElementById("smRole").value=(t==null?void 0:t.role)||"student",document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudentDev()"),Y("studentModal")}async function Ni(e){await Z("Bu kullanıcıyı silmek istediğinizden emin misiniz?")&&(await g.from("users").delete().eq("id",e),x("Kullanıcı silindi"),rt())}let Pe=[];async function qe(){const e=document.getElementById("view-dev-resources"),{data:t}=await g.from("resources").select("*").order("resource_type,exam_type,subject,name");Pe=t||[];const n=Pe.filter(i=>i.resource_type!=="playlist"),a=Pe.filter(i=>i.resource_type==="playlist");e.innerHTML=`
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
      <div class="stat-card"><div class="stat-label">Toplam Kaynak</div><div class="stat-val">${Pe.length}</div></div>
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
    </div>`}function Yi(){let e=document.getElementById("playlistModal");e||(e=document.createElement("div"),e.id="playlistModal",e.className="modal-bg",document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),e.innerHTML=`<div class="modal modal-lg">
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
  </div>`,Y("playlistModal")}async function Ki(){const e=document.getElementById("ytPlaylistUrl").value.trim(),t=document.getElementById("ytStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL giriniz</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ Geçersiz URL — "list=..." parametresi bulunamadı</span>';const a=n[1];t.innerHTML="⏳ Yükleniyor...";try{let i=[],o="";do{let s=`/api/youtube?playlistId=${a}`;o&&(s+=`&pageToken=${o}`);const r=await fetch(s);if(!r.ok){const c=await r.json();throw new Error(c.error||"Oynatma listesi yüklenemedi.")}const l=await r.json();l.items&&(i=i.concat(l.items)),o=l.nextPageToken||""}while(o&&i.length<200);document.getElementById("plVideos").value=i.map(s=>`${s.title} | ${s.url} | ${s.duration}`).join(`
`),t.innerHTML=`<span style="color:var(--green)">✓ ${i.length} video yüklendi!</span>`}catch(i){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${i.message}</span>`}}async function Oi(){const e=document.getElementById("plName").value.trim(),t=document.getElementById("plSubject").value.trim(),n=document.getElementById("plPublisher").value.trim();if(!e||!t||!n)return x("Tüm alanları doldurun!");const a=document.getElementById("plVideos").value.split(`
`).map(r=>r.trim()).filter(Boolean);if(!a.length)return x("En az 1 video girin!");const i=a.map(r=>{const l=r.split("|").map(c=>c.trim());return{label:l[0]||"",url:l[1]||"",topic:"",soru:parseInt(l[2])||0}}).filter(r=>r.label),o={exam_type:document.getElementById("plExam").value,subject:t,publisher:n,name:e,year:new Date().getFullYear(),tests:i,active:!0,resource_type:"playlist"},{error:s}=await g.from("resources").insert(o);if(s)return x("Hata: "+s.message);x(`✓ "${e}" eklendi — ${i.length} video`),K("playlistModal"),qe()}function Fi(e,t="book"){const n=e?Pe.find(s=>s.id===e):null;let a=document.getElementById("resourceModal");a||(a=document.createElement("div"),a.id="resourceModal",a.className="modal-bg",document.body.appendChild(a),a.addEventListener("click",s=>{s.target===a&&a.classList.remove("open")}));const i=((n==null?void 0:n.resource_type)||t)==="playlist";a.innerHTML=`<div class="modal modal-lg">
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
`),Y("resourceModal")}async function qi(){const e=document.getElementById("rmName").value.trim(),t=document.getElementById("rmSubject").value.trim();if(!e||!t)return x("Ad ve ders zorunlu!");const n=document.getElementById("rmId").value,a=document.getElementById("rmType").value==="playlist",i=document.getElementById("rmTests").value.split(`
`).map(r=>r.trim()).filter(Boolean);let o=[];a?o=i.map(r=>{const l=r.split("|").map(c=>c.trim());return{label:l[0]||"",url:l[1]||"",topic:"",soru:parseInt(l[2])||0}}):o=i.map(r=>{const l=r.split("|").map(c=>c.trim());return{label:l[0]||"",soru:parseInt(l[1])||0}});const s={exam_type:document.getElementById("rmExam").value,subject:t,publisher:document.getElementById("rmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:o,active:document.getElementById("rmActive").value==="true",resource_type:a?"playlist":"book"};n?(await g.from("resources").update(s).eq("id",n),x("Güncellendi ✓")):(await g.from("resources").insert(s),x("Kaynak eklendi ✓")),K("resourceModal"),qe()}async function Ui(e){await Z("Bu kaynağı silmek istediğinizden emin misiniz?")&&(await g.from("resources").delete().eq("id",e),x("Silindi"),qe())}async function dt(){const e=document.getElementById("view-dev-finance"),[{data:t},{data:n}]=await Promise.all([g.from("subscriptions").select("*,users(full_name,color)").order("created_at",{ascending:!1}),g.from("payments").select("*,users(full_name)").order("payment_date",{ascending:!1}).limit(20)]),a=(n||[]).filter(o=>o.status==="completed").reduce((o,s)=>o+Number(s.amount),0),i=(t||[]).filter(o=>o.status==="active").length;e.innerHTML=`
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
    </div>`}function Gi(){let e=document.getElementById("paymentModal");e||(e=document.createElement("div"),e.id="paymentModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('paymentModal')">×</button>
      <h2>Ödeme Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="pmStudent">${d.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join("")}</select></div>
      <div class="field-row">
        <div class="field"><label>Tutar (₺)</label><input type="number" id="pmAmount" placeholder="1500"></div>
        <div class="field"><label>Yöntem</label><select id="pmMethod"><option>nakit</option><option>havale</option><option>kart</option><option>iyzico</option></select></div>
      </div>
      <div class="field"><label>Tarih</label><input type="date" id="pmDate" value="${H(new Date)}"></div>
      <div class="field"><label>Açıklama</label><input id="pmDesc" placeholder="Mayıs ayı ücreti"></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePayment()">Kaydet</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pmStudent").innerHTML=d.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Y("paymentModal")}async function Wi(){const e=parseFloat(document.getElementById("pmAmount").value);if(!e)return x("Tutar girin!");await g.from("payments").insert({student_id:document.getElementById("pmStudent").value,amount:e,method:document.getElementById("pmMethod").value,payment_date:document.getElementById("pmDate").value,description:document.getElementById("pmDesc").value,status:"completed"}),x("Ödeme kaydedildi ✓"),K("paymentModal"),dt()}function Vi(){let e=document.getElementById("subModal");e||(e=document.createElement("div"),e.id="subModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('subModal')">×</button>
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
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("sbStudent").innerHTML=d.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),Y("subModal")}async function Zi(){const e=parseFloat(document.getElementById("sbAmount").value);if(!e)return x("Tutar girin!");await g.from("subscriptions").insert({student_id:document.getElementById("sbStudent").value,plan:document.getElementById("sbPlan").value,amount:e,start_date:document.getElementById("sbStart").value,end_date:document.getElementById("sbEnd").value||null,status:document.getElementById("sbStatus").value,notes:document.getElementById("sbNotes").value}),x("Abonelik eklendi ✓"),K("subModal"),dt()}async function Ue(){const e=document.getElementById("view-dev-announce"),{data:t}=await g.from("announcements").select("*").order("created_at",{ascending:!1}),n={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"};e.innerHTML=`
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
      </div>`).join("")}`}function Ji(){let e=document.getElementById("announceModal");e||(e=document.createElement("div"),e.id="announceModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('announceModal')">×</button>
      <h2>Yeni Duyuru</h2>
      <div class="field"><label>Başlık</label><input id="anTitle" placeholder="Önemli Güncelleme"></div>
      <div class="field"><label>İçerik</label><textarea id="anBody" placeholder="Duyuru metni..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Tür</label><select id="anType"><option value="info">Bilgi</option><option value="warning">Uyarı</option><option value="success">Başarı</option><option value="urgent">Acil</option></select></div>
        <div class="field"><label>Hedef</label><select id="anTarget"><option value="all">Herkes</option><option value="students">Öğrenciler</option><option value="coaches">Koçlar</option></select></div>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveAnnounce()">Yayınla</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),Y("announceModal")}async function Xi(){const e=document.getElementById("anTitle").value.trim(),t=document.getElementById("anBody").value.trim();if(!e||!t)return x("Başlık ve içerik zorunlu!");await g.from("announcements").insert({title:e,body:t,type:document.getElementById("anType").value,target:document.getElementById("anTarget").value,active:!0}),x("Duyuru yayınlandı ✓"),K("announceModal"),Ue()}async function Qi(e,t){await g.from("announcements").update({active:t}).eq("id",e),Ue()}async function eo(e){await Z("Bu duyuruyu silmek istediğinizden emin misiniz?")&&(await g.from("announcements").delete().eq("id",e),x("Silindi"),Ue())}let ze=null,nt=null,ne=null,gt=null,Ie=[],pe=[],me="welcome";async function Ce(){const e=document.getElementById("view-dev-tickets");if(!e)return;const{data:t,error:n}=await g.from("tickets").select("*,users!tickets_user_id_fkey(full_name,role)").order("updated_at",{ascending:!1});Ie=t||[],!ne&&Ie.length>0&&(ne=Ie[0].id),e.innerHTML=`
    <div class="sh" style="margin-bottom:12px">
      <h2>🎫 Destek & Geri Bildirim Masası</h2>
    </div>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 16px; height: 600px; max-height: calc(100vh - 180px); margin-top: 10px">
      <!-- Left Pane: Chats List -->
      <div style="overflow-y: auto; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 8px; padding: 12px">
        <div style="font-size: 11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px">Konuşmalar</div>
        ${Ie.length===0?`
          <div style="text-align:center; padding:40px 10px; color:var(--text-dim); font-size:12px">Kayıtlı destek talebi yok.</div>
        `:Ie.map(a=>{var w,E,_;const i=a.id===ne,o=((w=a.users)==null?void 0:w.full_name)||"Kullanıcı",s=((E=a.users)==null?void 0:E.role)==="coach"?"KOÇ":((_=a.users)==null?void 0:_.role)==="parent"?"VELİ":"ÖĞRENCİ";let r="Mesaj yok";try{const b=JSON.parse(a.body);Array.isArray(b)&&b.length>0?r=b[b.length-1].text:r=a.body}catch{r=a.body}const l=r.length>28?r.slice(0,26)+"...":r,c=a.status==="open"?'<span style="font-size:9px; background:#ef444422; color:#ef4444; padding:2px 6px; border-radius:99px; font-weight:700">Yeni</span>':a.status==="resolved"?'<span style="font-size:9px; background:#10b98122; color:#10b981; padding:2px 6px; border-radius:99px; font-weight:700">Cevaplandı</span>':'<span style="font-size:9px; background:var(--border2); color:var(--text-dim); padding:2px 6px; border-radius:99px; font-weight:700">Kapatıldı</span>',p=i?"var(--accent-dim)":"var(--surface)",m=i?"1.5px solid var(--accent)":"1px solid var(--border)",v=i?"10px 11px":"10px 12px";return`
            <div onclick="selectDevTicket('${a.id}')" style="background:${p}; border:${m}; border-radius:10px; padding:${v}; cursor:pointer; display:flex; flex-direction:column; gap:4px; transition:all .15s">
              <div style="display:flex; justify-content:space-between; align-items:center">
                <span style="font-weight:700; font-size:12px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px">${u(o)}</span>
                <span style="font-size:9px; font-weight:800; color:var(--text-dim)">${s}</span>
              </div>
              <div style="font-size:11px; color:var(--text-mid); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${u(l)}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px">
                <span style="font-size:9px; color:var(--text-dim)">${new Date(a.updated_at).toLocaleDateString("tr-TR")}</span>
                ${c}
              </div>
            </div>
          `}).join("")}
      </div>

      <!-- Right Pane: Active Chat Area -->
      <div id="devChatArea" style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden">
        <!-- Rendered dynamically by loadDevChatArea() -->
      </div>
    </div>
  `,ao(),gt&&clearInterval(gt),gt=setInterval(no,4e3)}function to(e){ne=e,Ce()}async function no(){if(!ne||!document.getElementById("devChatArea"))return;const{data:t,error:n}=await g.from("tickets").select("*,users!tickets_user_id_fkey(full_name,role)").eq("id",ne).single();if(n||!t)return;let a=[];try{a=JSON.parse(t.body),Array.isArray(a)||(a=[{sender:"user",text:t.body,time:t.created_at}])}catch{a=[{sender:"user",text:t.body,time:t.created_at}]}const i=document.getElementById("devChatMessages");if(i){const o=i.scrollTop,s=i.scrollHeight-i.clientHeight-o<40;i.innerHTML=a.map(r=>{const l=r.sender==="emin",c=l?"Kurucu / Destek":r.sender==="ai"?"Yapay Zeka":r.name||"Kullanıcı",p=l?"var(--blue)":r.sender==="ai"?"var(--surface2)":"var(--accent)",m=l?"#fff":r.sender==="ai"?"var(--text)":"var(--on-accent)",v=l?"flex-end":"flex-start",w=l?"14px 14px 4px 14px":"14px 14px 14px 4px",E=new Date(r.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
        <div style="align-self:${v}; max-width:80%; display:flex; flex-direction:column; align-items:${l?"flex-end":"flex-start"}">
          <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${c}</div>
          <div style="padding:10px 14px; border-radius:${w}; background:${p}; color:${m}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${u(r.text)}</div>
          <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${E}</div>
        </div>
      `}).join(""),s&&(i.scrollTop=i.scrollHeight)}}function ao(){var s,r,l;const e=document.getElementById("devChatArea");if(!e)return;const t=Ie.find(c=>c.id===ne);if(!t){e.innerHTML=`
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text-dim); padding:20px; text-align:center">
        <div style="font-size:48px; margin-bottom:12px">🎫</div>
        <div style="font-weight:700">Aktif Sohbet Seçilmedi</div>
        <div style="font-size:12px; margin-top:4px">Soldaki listeden bir destek sohbeti seçerek yanıtlayabilirsiniz.</div>
      </div>
    `;return}const n=((s=t.users)==null?void 0:s.full_name)||"Kullanıcı",a=((r=t.users)==null?void 0:r.role)==="coach"?"KOÇ":((l=t.users)==null?void 0:l.role)==="parent"?"VELİ":"ÖĞRENCİ";let i=[];try{i=JSON.parse(t.body),Array.isArray(i)||(i=[{sender:"user",text:t.body,time:t.created_at}])}catch{i=[{sender:"user",text:t.body,time:t.created_at}]}e.innerHTML=`
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
      ${i.map(c=>{const p=c.sender==="emin",m=p?"Kurucu / Destek":c.sender==="ai"?"Yapay Zeka":c.name||"Kullanıcı",v=p?"var(--blue)":c.sender==="ai"?"var(--surface2)":"var(--accent)",w=p?"#fff":c.sender==="ai"?"var(--text)":"var(--on-accent)",E=p?"flex-end":"flex-start",_=p?"14px 14px 4px 14px":"14px 14px 14px 4px",b=new Date(c.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
          <div style="align-self:${E}; max-width:80%; display:flex; flex-direction:column; align-items:${p?"flex-end":"flex-start"}">
            <div style="font-size:10px; color:var(--text-dim); margin-bottom:3px; font-weight:600">${m}</div>
            <div style="padding:10px 14px; border-radius:${_}; background:${v}; color:${w}; font-size:13px; line-height:1.5; word-wrap:break-word; white-space:pre-wrap">${u(c.text)}</div>
            <div style="font-size:9px; color:var(--text-dim); margin-top:4px">${b}</div>
          </div>
        `}).join("")}
    </div>

    <!-- Footer Reply Input -->
    <div style="padding:12px 16px; border-top:1px solid var(--border); display:flex; gap:8px; background:var(--surface2); align-items:flex-end">
      <textarea id="devReplyInput" placeholder="Sohbete yanıt yazın..." rows="1" style="flex:1; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:10px 14px; font-size:13px; font-family:inherit; color:var(--text); resize:none; max-height:80px; outline:none" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendDevReply()}"></textarea>
      <button class="btn btn-accent" onclick="sendDevReply()" style="padding:8px 16px; font-size:13px; border-radius:10px; align-self:stretch; justify-content:center">Gönder</button>
    </div>
  `;const o=document.getElementById("devChatMessages");o&&(o.scrollTop=o.scrollHeight)}async function io(){const e=document.getElementById("devReplyInput"),t=e.value.trim();if(!t||!ne)return;e.value="",M(!0);const{data:n}=await g.from("tickets").select("body").eq("id",ne).single();let a=[];if(n&&n.body)try{a=JSON.parse(n.body)}catch{a=[{sender:"user",text:n.body,time:new Date().toISOString()}]}const i={sender:"emin",text:t,time:new Date().toISOString(),name:"Kurucu / Destek"};a.push(i);const{error:o}=await g.from("tickets").update({body:JSON.stringify(a),reply:t,status:"resolved",updated_at:new Date().toISOString()}).eq("id",ne);if(M(!1),o){x("Hata: "+o.message);return}x("Yanıt gönderildi ✓"),Ce()}async function oo(e,t){await g.from("tickets").update({status:t,updated_at:new Date().toISOString()}).eq("id",e),x("Durum güncellendi ✓"),Ce()}async function so(e){await Z("Bu talebi silmek istediğinizden emin misiniz?")&&(await g.from("tickets").delete().eq("id",e),x("Silindi"),ne=null,Ce())}function ro(){lt()}async function lt(){let e=document.getElementById("supportChatModal");e||(e=document.createElement("div"),e.id="supportChatModal",e.className="modal-bg",e.style.zIndex="99999999",e.innerHTML=`
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
    `,document.body.appendChild(e),e.addEventListener("click",t=>{var a;const n=(a=document.getElementById("trialExpiredModal"))==null?void 0:a.classList.contains("open");t.target===e&&!n&&Bn()})),Y("supportChatModal"),await at(),ze&&clearInterval(ze),ze=setInterval(at,4e3)}function Bn(){K("supportChatModal"),ze&&(clearInterval(ze),ze=null)}async function at(){var o,s;const e=(o=y.dbUser)==null?void 0:o.id;if(!e)return;const t=document.getElementById("supportMessages");if(!t)return;const{data:n,error:a}=await g.from("tickets").select("*").eq("user_id",e).eq("status","open").order("created_at",{ascending:!1}).limit(1);if(a){console.error("Error fetching ticket:",a);return}const i=n&&n[0];if(i){nt=i.id,me="emin";const r=document.getElementById("supportStatusLabel");r&&(r.textContent="● Kurucu / Destek Ekibi");let l=[];try{l=JSON.parse(i.body),Array.isArray(l)||(l=[{sender:"user",text:i.body,time:i.created_at}])}catch{l=[{sender:"user",text:i.body,time:i.created_at}]}i.reply&&((s=l[l.length-1])==null?void 0:s.text)!==i.reply&&l.push({sender:"emin",text:i.reply,time:i.updated_at}),Ne(l)}else if(me==="welcome"){const r=document.getElementById("supportStatusLabel");r&&(r.textContent="● Çevrimiçi Asistan"),t.innerHTML=`
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
      `}else if(me==="ai"){const r=document.getElementById("supportStatusLabel");r&&(r.textContent="● Yapay Zeka"),Ne(pe)}}function Ne(e){const t=document.getElementById("supportMessages");if(!t)return;const n=t.scrollTop,a=t.scrollHeight-t.clientHeight-n<40;t.innerHTML=e.map(i=>{const o=i.sender==="user",s=o?"Siz":i.sender==="ai"?"Yapay Zeka Asistanı":"Kurucu / Destek Ekibi",r=o?"var(--accent)":"var(--surface2)",l=o?"none":"1px solid var(--border)",c=o?"var(--on-accent)":"var(--text)",p=o?"flex-end":"flex-start",m=o?"14px 14px 4px 14px":"14px 14px 14px 4px",v=new Date(i.time).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});return`
      <div style="align-self:${p};max-width:80%;display:flex;flex-direction:column;align-items:${o?"flex-end":"flex-start"}">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:3px;font-weight:600">${s}</div>
        <div style="padding:10px 14px;border-radius:${m};background:${r};border:${l};color:${c};font-size:13px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap">${u(i.text)}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:4px">${v}</div>
      </div>
    `}).join(""),a&&(t.scrollTop=t.scrollHeight)}function lo(){me="ai",pe=[{sender:"ai",text:"Merhaba! Ben Rostrum Akademi Yapay Zeka Asistanıyım. 🤖 Size nasıl yardımcı olabilirim?",time:new Date().toISOString()}],Ne(pe)}function co(){me="emin_start";const e=document.getElementById("supportMessages");e&&(e.innerHTML=`
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
    `)}async function po(){var c,p;const e=document.getElementById("eminSubject"),t=document.getElementById("eminInitialMessage"),n=e?e.value.trim():"Müşteri Destek Sohbeti",a=t?t.value.trim():"";if(!a)return x("Mesaj boş olamaz!");const i=(c=y.dbUser)==null?void 0:c.id,o=((p=y.dbUser)==null?void 0:p.full_name)||"Kullanıcı",s={sender:"user",text:a,time:new Date().toISOString(),name:o};M(!0);const{data:r,error:l}=await g.from("tickets").insert({user_id:i,subject:n,body:JSON.stringify([s]),category:"emin",status:"open"}).select().single();if(M(!1),l){x("Hata: "+l.message);return}nt=r.id,me="emin",x("Talebiniz destek ekibine iletildi ✓"),await at()}async function mo(){var n;const e=document.getElementById("supportInput"),t=e.value.trim();if(t){if(e.value="",me==="ai"){const a={sender:"user",text:t,time:new Date().toISOString()};pe.push(a),Ne(pe);const i=document.getElementById("supportTyping");i&&(i.style.display="flex");try{const o=await Me(t,{},y.role||"coach");pe.push({sender:"ai",text:o,time:new Date().toISOString()})}catch{pe.push({sender:"ai",text:"Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra deneyin.",time:new Date().toISOString()})}finally{i&&(i.style.display="none"),Ne(pe)}}else if(me==="emin"){const a=((n=y.dbUser)==null?void 0:n.full_name)||"Kullanıcı",i={sender:"user",text:t,time:new Date().toISOString(),name:a};M(!0);const{data:o}=await g.from("tickets").select("body").eq("id",nt).single();let s=[];if(o&&o.body)try{s=JSON.parse(o.body)}catch{s=[{sender:"user",text:o.body,time:new Date().toISOString(),name:a}]}s.push(i);const{error:r}=await g.from("tickets").update({body:JSON.stringify(s),status:"open",updated_at:new Date().toISOString()}).eq("id",nt);if(M(!1),r){x("Gönderim hatası: "+r.message);return}await at()}}}async function Mn(){const{data:e}=await g.from("announcements").select("*").eq("active",!0),t=y.role,n=(e||[]).filter(o=>o.target==="all"||o.target==="students"&&t==="student"||o.target==="coaches"&&t==="coach");if(!n.length)return;const a={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"},i=document.createElement("div");i.style.cssText="position:fixed;top:64px;right:16px;z-index:400;display:flex;flex-direction:column;gap:8px;max-width:340px",i.id="announceBanner",n.slice(0,3).forEach(o=>{const s=document.createElement("div");s.style.cssText=`background:var(--surface);border:1px solid var(--border);border-left:3px solid ${a[o.type]||"var(--accent)"};border-radius:10px;padding:12px 14px;box-shadow:var(--shadow);animation:fadeUp .3s ease`,s.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div><div style="font-size:13px;font-weight:700;margin-bottom:3px">${u(o.title)}</div><div style="font-size:12px;color:var(--text-mid)">${u(o.body)}</div></div>
      <button onclick="this.closest('div[style]').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;flex-shrink:0">×</button>
    </div>`,i.appendChild(s)}),document.body.appendChild(i),setTimeout(()=>i.remove(),8e3)}(()=>{const e=document.createElement("style");e.textContent=".role-dev{background:rgba(192,132,252,.15);color:#c084fc;}",document.head.appendChild(e)})();function uo(){let e=document.getElementById("onboardingModal");e||(e=document.createElement("div"),e.id="onboardingModal",e.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)",document.body.appendChild(e)),Ht(0,e)}const kt=[{icon:"🎉",title:"Rostrum Akademi'ye Hoş Geldiniz!",body:"Koçluk platformunuzu birkaç adımda kuruyoruz. Sadece 2 dakika.",fields:[],nextLabel:"Başlayalım →"},{icon:"🏷️",title:"Markanızı Tanıyalım",body:"Öğrencileriniz uygulamaya girdiğinde ne görsün?",fields:[{id:"ob_brand",label:"Akademi / Koçluk Adı",placeholder:"Örn: Ayşe Koçluk, EminHoca Akademi",type:"text"},{id:"ob_color",label:"Marka Rengi",type:"color",value:"#f0a500"}],nextLabel:"Devam →"},{icon:"🔐",title:"Şifrenizi Güncelleyin",body:"Güvenli bir şifre belirleyin.",fields:[{id:"ob_pass1",label:"Yeni Şifre",placeholder:"En az 6 karakter",type:"password"},{id:"ob_pass2",label:"Şifre Tekrar",placeholder:"Aynı şifreyi girin",type:"password"}],nextLabel:"Devam →"},{icon:"👨‍🎓",title:"İlk Öğrencinizi Ekleyin",body:"Şimdi ya da sonra ekleyebilirsiniz.",fields:[{id:"ob_stuname",label:"Öğrenci Adı Soyadı",placeholder:"Muzaffer Sabri Koçar",type:"text"},{id:"ob_stuuser",label:"Kullanıcı Adı",placeholder:"muzaffer",type:"text"},{id:"ob_stupass",label:"Öğrenci Şifresi",placeholder:"ogrenci123",type:"text"}],nextLabel:"Devam →",skipLabel:"Şimdilik Geç"},{icon:"✅",title:"Hazırsınız!",body:"Platformunuz kuruldu. Hemen kullanmaya başlayabilirsiniz.",fields:[],nextLabel:"Panele Git →"}];function Ht(e,t){const n=kt[e],a=kt.length,i=Array.from({length:a},(o,s)=>`<div style="width:${s===e?24:8}px;height:8px;border-radius:99px;background:${s===e?"var(--accent)":"var(--border2)"};transition:width .3s"></div>`).join("");t.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border2);border-radius:24px;width:100%;max-width:480px;padding:40px;animation:fadeUp .3s ease">
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
  </div>`}async function vo(e,t){var i,o,s,r,l,c,p,m,v,w,E,_,b;const n=document.getElementById("onboardingModal");if(!t){if(e===1){const h=(o=(i=document.getElementById("ob_brand"))==null?void 0:i.value)==null?void 0:o.trim(),$=((s=document.getElementById("ob_color"))==null?void 0:s.value)||"#f0a500";if(h){await g.from("workspaces").upsert({coach_id:y.coachId,brand_name:h,brand_color:$},{onConflict:"coach_id"}),d.workspace={...d.workspace||{},coach_id:y.coachId,brand_name:h,brand_color:$};const S=document.querySelector(".sb-logo-text");S&&(S.textContent=h)}}if(e===2){const h=(r=document.getElementById("ob_pass1"))==null?void 0:r.value,$=(l=document.getElementById("ob_pass2"))==null?void 0:l.value;if(h&&h.length<6){x("En az 6 karakter!");return}if(h&&h!==$){x("Şifreler uyuşmuyor!");return}h&&await g.from("users").update({password_hash:h}).eq("id",y.coachId)}if(e===3){const h=(p=(c=document.getElementById("ob_stuname"))==null?void 0:c.value)==null?void 0:p.trim(),$=((v=(m=document.getElementById("ob_stuuser"))==null?void 0:m.value)==null?void 0:v.trim())||((w=h==null?void 0:h.split(" ")[0])==null?void 0:w.toLowerCase()),S=((E=document.getElementById("ob_stupass"))==null?void 0:E.value)||"ogrenci123",z=await Te(S);if(h){const D=$+"@rostrumakademi.com",{data:{session:k}}=await g.auth.getSession(),B=await fetch("/api/create-student",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${(k==null?void 0:k.access_token)||""}`},body:JSON.stringify({email:D,password:S,full_name:h,username:$,color:"#4da6ff",target:"",progress:0,week_start:0,coach_id:y.coachId,exam_profile:"YKS"})}),I=await B.json();B.ok&&I.userId?d.students.push({id:I.userId,name:h,target:"",color:"#4da6ff",progress:0,pass:z,weekStart:0,username:$,coachId:y.coachId}):x("Öğrenci eklenemedi: "+(I.error||"Bilinmeyen hata"))}}}const a=e+1;if(a>=kt.length){await g.from("workspaces").upsert({coach_id:y.coachId,brand_name:((_=d.workspace)==null?void 0:_.brand_name)||"Akademi",brand_color:((b=d.workspace)==null?void 0:b.brand_color)||"#f0a500",onboarding_done:!0},{onConflict:"coach_id"}),d.workspace&&(d.workspace.onboarding_done=!0),n.remove(),X("home"),x("🎉 Hoş geldiniz! Platformunuz hazır.");return}Ht(a,n)}let yt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),yt=e;const t=document.createElement("button");t.id="pwaInstallBtn",t.className="btn btn-ghost btn-sm",t.innerHTML="📲 Yükle",t.style.cssText="font-size:11px;padding:5px 10px",t.onclick=async()=>{yt.prompt();const{outcome:n}=await yt.userChoice;n==="accepted"&&(t.remove(),x("Uygulama yüklendi ✓"))},document.querySelector(".tbar-right").insertBefore(t,document.querySelector(".user-pill"))});async function An(){const e=d.students.find(k=>k.id===y.studentId);if(!e)return;const t=document.getElementById("view-sprofil");if(!t)return;const{data:n,error:a}=await g.from("student_profiles").select("*").eq("id",y.studentId).maybeSingle();a&&console.error("Öğrenci profili yüklenirken hata:",a);const i=(n==null?void 0:n.bio)||"",o=(n==null?void 0:n.school)||"",s=(n==null?void 0:n.grade)||"",r=(n==null?void 0:n.target_university)||"",l=(n==null?void 0:n.target_department)||"",c=(n==null?void 0:n.struggling_subjects)||"",p=(n==null?void 0:n.daily_capacity)||"",m=d.exams.filter(k=>k.studentId===e.id).sort((k,B)=>k.date.localeCompare(B.date)),v=m[m.length-1],w=v?(EXAM_DEFS[v.type]||[]).reduce((B,I)=>{var T;return B+Number(((T=v.nets)==null?void 0:T[I])||0)},0).toFixed(1):"—",E=W(0,e.weekStart??0);let _=0,b=0;for(let k=0;k<7;k++){const B=d.tasks[`${e.id}_${H(q(E,k))}`]||[];_+=B.length,b+=B.filter(I=>I.done).length}const h=_>0?Math.round(b/_*100):0;let $=0;Object.keys(d.tasks).filter(k=>k.startsWith(e.id+"_")).forEach(k=>{$+=d.tasks[k].filter(B=>B.done).length});let S="";if(m.length>0){const k=m.slice(-6),B=Math.max(...k.map(I=>(EXAM_DEFS[I.type]||[]).reduce((f,L)=>{var j;return f+Number(((j=I.nets)==null?void 0:j[L])||0)},0)),1);S=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📈 Net Gelişim Grafiği</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:12px">
          ${k.map(I=>{const f=(EXAM_DEFS[I.type]||[]).reduce((R,F)=>{var N;return R+Number(((N=I.nets)==null?void 0:N[F])||0)},0),L=Math.max(Math.round(f/B*100),4),j=k[k.indexOf(I)-1],A=j?(EXAM_DEFS[j.type]||[]).reduce((R,F)=>{var N;return R+Number(((N=j.nets)==null?void 0:N[F])||0)},0):f,C=f>A?"↑":f<A?"↓":"",P=f>A?"var(--green)":f<A?"var(--red)":"var(--text-dim)";return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
              <div style="font-size:10px;font-weight:700;color:var(--text-mid)">${f.toFixed(0)}</div>
              <div style="font-size:9px;color:${P};font-weight:800">${C}</div>
              <div style="width:100%;background:${e.color};border-radius:4px 4px 0 0;height:${L}%;min-height:4px"></div>
              <div style="font-size:9px;color:var(--text-dim);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%">${u(I.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim())}</div>
            </div>`}).join("")}
        </div>
      </div>`}let z="";if(m.length>0){const k=v.type,I=(EXAM_DEFS[k]||[]).map(T=>{var A;const f=m.filter(C=>C.type===k).map(C=>{var P;return Number(((P=C.nets)==null?void 0:P[T])||0)}),L=f.length?f.reduce((C,P)=>C+P,0)/f.length:0,j=Number(((A=v.nets)==null?void 0:A[T])||0);return{f:T,avg:L.toFixed(1),last:j,color:$t(j)}});z=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📊 Ders Bazında Performans (${k})</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px">
          ${I.map(T=>`
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text-dim);font-weight:700;margin-bottom:4px;text-transform:uppercase">${T.f}</div>
              <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:var(--${T.color==="good"?"green":T.color==="mid"?"accent":"red"})">${T.last}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-top:2px">ort: ${T.avg}</div>
            </div>`).join("")}
        </div>
      </div>`}const D=d.appointments.filter(k=>k.studentId===e.id&&k.date>=$e()).sort((k,B)=>k.date.localeCompare(B.date)).slice(0,3);t.innerHTML=`
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
        <div class="stat-val">${b}<span style="font-size:14px;color:var(--text-dim)">/${_}</span></div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">%${h} tamamlandı</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Son Deneme Neti</div>
        <div class="stat-val" style="color:var(--accent)">${w}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">${v?u(v.name):"Deneme yok"}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Tamamlanan</div>
        <div class="stat-val">${$}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">görev</div>
      </div>
    </div>

    ${S}
    ${z}

    <!-- YAKLAŞAN RANDEVULAR -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📅 Yaklaşan Randevularım</div>
      ${D.length?D.map(k=>`
        <div style="background:var(--surface2);border:1px solid var(--border);border-left:3px solid ${e.color};border-radius:9px;padding:12px;margin-top:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px">${new Date(k.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          <div style="font-family:'Inter',sans-serif;font-size:17px;font-weight:700">${k.time} <span style="font-size:13px;color:var(--text-mid)">· ${k.duration} dk</span></div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${u(k.type)}</div>
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
          <input type="text" id="spTargetUni" value="${u(r)}" placeholder="Örn: Boğaziçi Üniversitesi" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hedef Bölüm</label>
          <input type="text" id="spTargetDept" value="${u(l)}" placeholder="Örn: Bilgisayar Mühendisliği" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Zorlandığım Dersler</label>
          <input type="text" id="spStruggling" value="${u(c)}" placeholder="Örn: Fizik, Geometri" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
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
    </div>`}async function go(){const e=y.dbUser.id,t=document.getElementById("spBio").value.trim(),n=document.getElementById("spSchool").value.trim(),a=document.getElementById("spGrade").value.trim(),i=document.getElementById("spTargetUni").value.trim(),o=document.getElementById("spTargetDept").value.trim(),s=document.getElementById("spStruggling").value.trim(),r=parseInt(document.getElementById("spCapacity").value)||null,l={id:e,bio:t,school:n,grade:a,target_university:i,target_department:o,struggling_subjects:s,daily_capacity:r,updated_at:new Date().toISOString()},{error:c}=await g.from("student_profiles").upsert(l);x(c?"Profil kaydedilemedi: "+c.message:"Profil başarıyla güncellendi ✓")}async function yo(){const e=document.getElementById("newPass1").value,t=document.getElementById("newPass2").value;if(!e)return x("Şifre girin!");if(e!==t)return x("Şifreler uyuşmuyor!");if(e.length<4)return x("En az 4 karakter olmalı");const{error:n}=await g.from("users").update({password_hash:e}).eq("id",y.studentId);if(n)return x("Hata: "+n.message);x("Şifre güncellendi ✓"),document.getElementById("newPass1").value="",document.getElementById("newPass2").value=""}async function Dn(){var w;const e=document.getElementById("view-coach-profile");if(!e)return;e.innerHTML='<div class="loading">Profil bilgileri yükleniyor...</div>';const t=y.dbUser.id;let n=null,a=null;const i=await g.from("coach_profiles").select("*").eq("id",t).maybeSingle();if(n=i.data,a=i.error,a){const E=localStorage.getItem(`coach_profile_${t}`);if(E)try{n=JSON.parse(E),a=null}catch{}if(a){e.innerHTML=`<div style="padding:20px;color:var(--red)">Profil yüklenirken hata oluştu: ${u(a.message)}</div>`;return}}else if(!n){const E=localStorage.getItem(`coach_profile_${t}`);if(E)try{n=JSON.parse(E)}catch{}}const o=(n==null?void 0:n.bio)||"",s=(n==null?void 0:n.subjects)||"",r=(n==null?void 0:n.education)||"",l=(n==null?void 0:n.experience)||"",c=(n==null?void 0:n.photo_url)||"",p=(n==null?void 0:n.instagram)||"",m=(n==null?void 0:n.linkedin)||"",v=window.location.origin+window.location.pathname.replace("app.html","koc_bul.html")+`?coach=${t}`;e.innerHTML=`
    <div style="max-width:900px;margin:0 auto">
    <div style="margin-bottom: 20px;">
      <h2 style="font-family:'Inter',sans-serif; margin-bottom: 6px;">👤 Koç Profilim</h2>
      <p style="font-size: 13px; color: var(--text-mid); margin-bottom: 15px;">
        "Koç Bul" sayfasında görünecek bilgilerinizi buradan düzenleyebilirsiniz.
      </p>
      
      <div style="margin-bottom: 16px; background: var(--surface2); border: 1px dashed var(--border); padding: 12px; border-radius: 9px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Kamuya Açık Profil Linkiniz</label>
        <div style="display:flex; gap:8px;">
          <input type="text" readonly value="${v}" id="coachBulLink" style="flex:1; background:var(--surface3); border:1px solid var(--border); border-radius:9px; padding:10px 13px; font-size:13px; color:var(--text-mid); outline:none;">
          <button class="btn btn-ghost" onclick="navigator.clipboard.writeText(document.getElementById('coachBulLink').value); showToast('Link kopyalandı ✓')">🔗 Kopyala</button>
          <a href="${v}" target="_blank" class="btn btn-accent" style="text-decoration:none; display:inline-flex; align-items:center;">👁 Göster</a>
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
              <input type="text" id="cpPhotoUrl" value="${u(c)}" placeholder="https://..." oninput="updateProfilePreview()" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Hakkımda / Biyografi</label>
            <textarea id="cpBio" oninput="updateProfilePreview()" style="width:100%; min-height:100px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(o)}</textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Eğitim Bilgisi</label>
              <textarea id="cpEducation" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(r)}</textarea>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Deneyim / Başarılar</label>
              <textarea id="cpExperience" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(l)}</textarea>
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
                  <div class="preview-name" id="prevName">${u(((w=y.dbUser)==null?void 0:w.full_name)||"Koç")}</div>
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
  `,Nt()}let Xe="bio";function Nt(){var v,w,E,_,b,h,$,S;const e=((v=document.getElementById("cpPhotoUrl"))==null?void 0:v.value.trim())||"",t=((w=document.getElementById("cpSubjects"))==null?void 0:w.value.trim())||"",n=((E=document.getElementById("cpBio"))==null?void 0:E.value.trim())||"",a=((_=document.getElementById("cpEducation"))==null?void 0:_.value.trim())||"",i=((b=document.getElementById("cpExperience"))==null?void 0:b.value.trim())||"",o=((h=document.getElementById("cpInstagram"))==null?void 0:h.value.trim())||"",s=(($=document.getElementById("cpLinkedin"))==null?void 0:$.value.trim())||"",r=((S=y.dbUser)==null?void 0:S.full_name)||"Koç",l=document.getElementById("prevAvatar");if(l)if(e)l.style.backgroundImage=`url('${e}')`,l.style.backgroundColor="transparent",l.innerHTML="";else{l.style.backgroundImage="",l.style.backgroundColor="var(--accent-dim)";const z=r.split(" ").map(D=>D[0]).join("").slice(0,2).toUpperCase();l.innerHTML=z||"?"}const c=document.getElementById("prevSocials");if(c){let z="";if(o&&(z+=`<a href="https://instagram.com/${o}" target="_blank" class="preview-social-link" title="Instagram">📸 @${o}</a>`),s){let D="LinkedIn";s.includes("/in/")&&(D="in/"+s.split("/in/")[1].split("/")[0]),z+=`<a href="${s}" target="_blank" class="preview-social-link" title="LinkedIn">💼 ${D}</a>`}c.innerHTML=z}const p=document.getElementById("prevSubjects");if(p)if(t){const z=t.split(",").map(D=>D.trim()).filter(Boolean);p.innerHTML=z.map(D=>`<span class="preview-tag">${u(D)}</span>`).join("")}else p.innerHTML='<span class="preview-tag" style="background:none; border:1px dashed var(--border); color:var(--text-dim)">Ders / Uzmanlık Belirtilmedi</span>';const m=document.getElementById("prevTabContent");if(m){let z="";Xe==="bio"?z=n||"Biyografi bilgisi henüz girilmedi.":Xe==="edu"?z=a||"Eğitim bilgisi henüz girilmedi.":Xe==="exp"&&(z=i||"Deneyim/başarılar henüz girilmedi."),m.innerHTML=Cn(u(z))}}function fo(e){Xe=e;const t=document.getElementById("btn-prev-bio"),n=document.getElementById("btn-prev-edu"),a=document.getElementById("btn-prev-exp");t&&t.classList.toggle("active",e==="bio"),n&&n.classList.toggle("active",e==="edu"),a&&a.classList.toggle("active",e==="exp"),Nt()}function Cn(e){return e.replace(/\n/g,"<br>")}async function xo(){const e=y.dbUser.id,t=document.getElementById("cpBio").value.trim(),n=document.getElementById("cpSubjects").value.trim(),a=document.getElementById("cpEducation").value.trim(),i=document.getElementById("cpExperience").value.trim(),o=document.getElementById("cpPhotoUrl").value.trim(),s=document.getElementById("cpInstagram").value.trim(),r=document.getElementById("cpLinkedin").value.trim(),l={id:e,bio:t,subjects:n,education:a,experience:i,photo_url:o,instagram:s,linkedin:r,updated_at:new Date().toISOString()};localStorage.setItem(`coach_profile_${e}`,JSON.stringify(l));const{error:c}=await g.from("coach_profiles").upsert(l);c?(console.warn("Database save failed, profile saved locally in localStorage:",c),x("Profil yerel tarayıcıya kaydedildi (Veritabanı RLS hatası: "+c.message+")")):x("Profil başarıyla güncellendi ✓")}async function Yt(){const e=document.getElementById("view-dev-matches");if(!e)return;e.innerHTML='<div class="loading">Eşleşmeler yükleniyor...</div>';const{data:t,error:n}=await g.from("match_requests").select("*, matched_coach:matched_coach_id(full_name, username)").order("created_at",{ascending:!1});if(n){e.innerHTML=`<div style="padding:20px;color:var(--red)">Eşleşme başvuruları yüklenirken hata oluştu: ${u(n.message)}</div>`;return}const a={pending:"⏳ Bekliyor",matched:"🤝 Eşleştirildi",completed:"✅ Tamamlandı"},i={pending:"rgba(240, 165, 0, 0.15)",matched:"rgba(96, 180, 255, 0.15)",completed:"rgba(62, 207, 142, 0.15)"},o={pending:"var(--accent)",matched:"var(--accent4)",completed:"var(--green)"};e.innerHTML=`
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
  `}async function bo(e,t){const{error:n}=await g.from("match_requests").update({status:t}).eq("id",e);n?x("Durum güncellenirken hata: "+n.message):(x("Durum güncellendi ✓"),Yt())}async function ho(e){const t=d.students.find(s=>s.id===e);if(!t)return;const{data:n}=await g.from("student_speeds").select("*").eq("student_id",e),a={};(n||[]).forEach(s=>{a[`${s.exam_type}_${s.subject}`]=s.secs_per_question});const i=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];let o=document.getElementById("speedModal");o||(o=document.createElement("div"),o.id="speedModal",o.className="modal-bg",document.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&o.classList.remove("open")})),o.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('speedModal')">×</button>
    <h2>⚡ ${u(t.name)} — Soru Çözme Hızı</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Her ders için öğrencinin soru başına harcadığı saniyeyi girin. Görev eklerken süre otomatik hesaplanır.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
      ${i.map(({exam:s,sub:r})=>{const l=`${s}_${r}`,c=a[l]||180,p=Math.floor(c/60);return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">
          <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${s}</div>
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">${r}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" id="spd_${l}" value="${c}" min="10" max="600" step="5"
              style="width:70px;background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:13px;font-weight:700;color:var(--text);text-align:center">
            <span style="font-size:11px;color:var(--text-dim)">sn/soru</span>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${p>0?p+"dk ":""}</div>
        </div>`}).join("")}
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:16px" onclick="saveAllSpeeds('${e}')">Tümünü Kaydet</button>
  </div>`,Y("speedModal")}async function ko(e){const t=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];for(const{exam:n,sub:a}of t){const i=`${n}_${a}`,o=document.getElementById("spd_"+i);if(!o)continue;const s=parseInt(o.value)||180;await gn(e,n,a,s)}K("speedModal"),x("Hız ayarları kaydedildi ✓")}async function wo(e){var s;const t=d.students.find(r=>r.id===e);if(!t)return;const n=`student_notes_${e}`,{data:a}=await g.from("platform_settings").select("value").eq("key",n).maybeSingle(),i=((s=a==null?void 0:a.value)==null?void 0:s.notes)||"";let o=document.getElementById("studentNotesModal");o||(o=document.createElement("div"),o.id="studentNotesModal",o.className="modal-bg",document.body.appendChild(o),o.addEventListener("click",r=>{r.target===o&&o.classList.remove("open")})),o.innerHTML=`<div class="modal">
    <button class="modal-close" onclick="cm('studentNotesModal')">×</button>
    <h2>📝 ${u(t.name)} — Notlar</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Öğrenciyle ilgili gözlemler, önemli bilgiler, hatırlatmalar…</p>
    <div class="field">
      <textarea id="studentNoteText" style="min-height:260px;font-size:13px;line-height:1.7;resize:vertical" placeholder="Örnek: Türkçe paragrafta hız sorunu var. Veli baskılı, motivasyon takip edilmeli. Son denemede geometri 4 yanlış...">${u(i)}</textarea>
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveStudentNote('${e}')">Kaydet</button>
  </div>`,Y("studentNotesModal")}async function $o(e){const t=document.getElementById("studentNoteText").value,n=`student_notes_${e}`;await g.from("platform_settings").upsert({key:n,value:{notes:t}},{onConflict:"key"}),x("Not kaydedildi ✓"),K("studentNotesModal")}function To(e){let t=document.getElementById("reportModal");t||(t=document.createElement("div"),t.id="reportModal",t.className="modal-bg",t.innerHTML=`<div class="modal">
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
    </div>`,document.body.appendChild(t),t.addEventListener("click",i=>{i.target===t&&t.classList.remove("open")}),document.getElementById("rpPeriod").addEventListener("change",function(){document.getElementById("rpCustomDates").style.display=this.value==="custom"?"":"none"})),document.getElementById("rpStuId").value=e;const n=new Date,a=new Date(n.getFullYear(),n.getMonth(),1);document.getElementById("rpStart").value=H(a),document.getElementById("rpEnd").value=H(n),document.getElementById("rpNote").value="",Y("reportModal")}function Ln(){const e=document.getElementById("rpPeriod").value,t=new Date;if(e==="weekly"){const n=W(0,0);return{start:H(n),end:H(q(n,6))}}else return e==="monthly"?{start:H(new Date(t.getFullYear(),t.getMonth(),1)),end:H(t)}:{start:document.getElementById("rpStart").value,end:document.getElementById("rpEnd").value}}function Kt(e,t=!1){var z,D,k,B;const n=d.students.find(I=>I.id===e);if(!n)return"";const{start:a,end:i}=Ln(),o=document.getElementById("rpNote").value.trim(),s=((z=d.workspace)==null?void 0:z.brand_name)||"Rostrum Akademi",r=((D=d.workspace)==null?void 0:D.brand_color)||"#f0a500",l=((k=y.dbUser)==null?void 0:k.full_name)||"Koç",c=[],p=new Date(a);for(;H(p)<=i;){const I=`${e}_${H(p)}`;(d.tasks[I]||[]).forEach(T=>c.push({...T,date:H(p)})),p.setDate(p.getDate()+1)}const m=c.length,v=c.filter(I=>I.done).length,w=m>0?Math.round(v/m*100):0,E=c.filter(I=>I.done).reduce((I,T)=>I+Number(T.duration||0),0),_={};c.forEach(I=>{const T=I.subject||"Diğer";_[T]||(_[T]={total:0,done:0}),_[T].total++,I.done&&_[T].done++});const b=d.exams.filter(I=>I.studentId===e&&I.date>=a&&I.date<=i).sort((I,T)=>I.date.localeCompare(T.date)),h=d.appointments.filter(I=>I.studentId===e&&I.date>=a&&I.date<=i).sort((I,T)=>I.date.localeCompare(T.date)),$=`${new Date(a+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})} – ${new Date(i+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}`;let S="";if(b.length>1){const I=Math.max(...b.map(j=>(EXAM_DEFS[j.type]||[]).reduce((A,C)=>{var P;return A+Number(((P=j.nets)==null?void 0:P[C])||0)},0)),1),T=400,f=80,L=Math.min(40,(T-20)/b.length-4);S=`<svg width="${T}" height="${f+30}" style="overflow:visible">
      ${b.map((j,A)=>{const C=(EXAM_DEFS[j.type]||[]).reduce((F,N)=>{var G;return F+Number(((G=j.nets)==null?void 0:G[N])||0)},0),P=Math.max(Math.round(C/I*(f-10)),4),R=10+A*((T-20)/b.length);return`<rect x="${R}" y="${f-P}" width="${L}" height="${P}" rx="3" fill="${r}" opacity="0.85"/>
          <text x="${R+L/2}" y="${f-P-4}" text-anchor="middle" font-size="10" fill="#333">${C.toFixed(0)}</text>
          <text x="${R+L/2}" y="${f+14}" text-anchor="middle" font-size="9" fill="#666">${u(j.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim()||String(A+1))}</text>`}).join("")}
    </svg>`}return`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;font-size:13px;line-height:1.5;}
  .page{max-width:800px;margin:0 auto;padding:${t?"30px":"20px 30px"};}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:18px;border-bottom:3px solid ${r};margin-bottom:24px;}
  .brand{font-size:22px;font-weight:800;color:${r};letter-spacing:-0.5px;}
  .brand-sub{font-size:11px;color:#888;margin-top:3px;}
  .report-title{text-align:right;}
  .report-title h1{font-size:18px;font-weight:700;color:#1a1a1a;}
  .report-title p{font-size:11px;color:#888;margin-top:3px;}
  .student-hero{background:linear-gradient(135deg,${r}15,${r}05);border:1.5px solid ${r}30;border-radius:12px;padding:18px 22px;margin-bottom:20px;display:flex;align-items:center;gap:16px;}
  .stu-avatar{width:52px;height:52px;border-radius:12px;background:${r};color:#fff;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .stu-name{font-size:20px;font-weight:800;}
  .stu-target{font-size:12px;color:#666;margin-top:3px;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
  .stat-box{background:#f8f8f8;border:1px solid #e8e8e8;border-radius:10px;padding:12px 14px;text-align:center;}
  .stat-box .val{font-size:26px;font-weight:800;color:${r};}
  .stat-box .lbl{font-size:10px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:.5px;}
  .section{margin-bottom:20px;}
  .section-title{font-size:14px;font-weight:700;color:${r};margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid ${r}20;display:flex;align-items:center;gap:6px;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th{background:${r}15;color:#333;font-weight:700;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.4px;}
  td{padding:7px 10px;border-bottom:1px solid #f0f0f0;}
  tr:last-child td{border-bottom:none;}
  .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;}
  .badge-green{background:#e8faf3;color:#16a34a;}
  .badge-yellow{background:#fef9ec;color:#ca8a04;}
  .badge-red{background:#fef2f2;color:#dc2626;}
  .prog-bar{height:8px;background:#eee;border-radius:99px;overflow:hidden;margin-top:4px;}
  .prog-fill{height:100%;border-radius:99px;background:${r};}
  .note-box{background:#fffbeb;border:1.5px solid ${r}40;border-radius:10px;padding:14px 16px;}
  .note-box .note-header{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:${r};margin-bottom:6px;}
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
      <div class="brand-sub">Koç: ${u(l)}</div>
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
    <div class="stat-box"><div class="val" style="color:#16a34a">${v}</div><div class="lbl">Tamamlanan</div></div>
    <div class="stat-box"><div class="val">%${w}</div><div class="lbl">Tamamlanma</div></div>
    <div class="stat-box"><div class="val">${Math.round(E/60)}</div><div class="lbl">Çalışma (saat)</div></div>
  </div>

  <!-- DERS BAZINDA ÇALIŞMA -->
  ${Object.keys(_).length>0?`
  <div class="section">
    <div class="section-title">📚 Ders Bazında Çalışma</div>
    <table>
      <thead><tr><th>Ders</th><th>Toplam</th><th>Tamamlanan</th><th>Oran</th><th></th></tr></thead>
      <tbody>
        ${Object.entries(_).sort((I,T)=>T[1].total-I[1].total).map(([I,T])=>{const f=Math.round(T.done/T.total*100),L=f>=80?"badge-green":f>=50?"badge-yellow":"badge-red";return`<tr>
            <td><strong>${u(I)}</strong></td>
            <td>${T.total}</td>
            <td>${T.done}</td>
            <td><span class="badge ${L}">%${f}</span></td>
            <td style="width:120px"><div class="prog-bar"><div class="prog-fill" style="width:${f}%"></div></div></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- DENEMELER -->
  ${b.length>0?`
  <div class="section">
    <div class="section-title">📊 Deneme Sonuçları</div>
    ${S?`<div style="margin-bottom:16px;padding:12px;background:#f8f8f8;border-radius:8px">${S}</div>`:""}
    <table>
      <thead><tr><th>Sınav</th><th>Tarih</th><th>Tür</th>${(EXAM_DEFS[(B=b[0])==null?void 0:B.type]||[]).map(I=>`<th>${I}</th>`).join("")}<th>Toplam</th></tr></thead>
      <tbody>
        ${b.map(I=>{const T=EXAM_DEFS[I.type]||[],f=T.reduce((L,j)=>{var A;return L+Number(((A=I.nets)==null?void 0:A[j])||0)},0).toFixed(1);return`<tr>
            <td><strong>${u(I.name)}</strong></td>
            <td>${new Date(I.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</td>
            <td>${u(I.type)}</td>
            ${T.map(L=>{var A;const j=Number(((A=I.nets)==null?void 0:A[L])||0);return`<td><span class="badge ${j>=20?"badge-green":j>=12?"badge-yellow":"badge-red"}">${j}</span></td>`}).join("")}
            <td><strong>${f}</strong></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- RANDEVULAR -->
  ${h.length>0?`
  <div class="section">
    <div class="section-title">📅 Görüşmeler</div>
    <table>
      <thead><tr><th>Tarih</th><th>Saat</th><th>Tür</th><th>Süre</th></tr></thead>
      <tbody>
        ${h.map(I=>`<tr>
          <td>${new Date(I.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"short",day:"numeric",month:"short"})}</td>
          <td>${I.time}</td>
          <td>${u(I.type)}</td>
          <td>${I.duration} dk</td>
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
      <div style="margin-top:10px;font-size:11px;color:#888">— ${u(l)}</div>
    </div>
  </div>`:""}

  <!-- FOOTER -->
  <div class="footer">
    <span>${u(s)} · ${u(l)}</span>
    <span>${u(n.name)} · ${$}</span>
    <span>Rostrum Akademi Platformu</span>
  </div>
</div>
</body>
</html>`}function Eo(){const e=document.getElementById("rpStuId").value,t=Kt(e,!0),n=window.open("","_blank","width=900,height=700");n.document.write(t),n.document.close()}function Io(){const e=document.getElementById("rpStuId").value;d.students.find(a=>a.id===e);const t=Kt(e,!1),n=window.open("","_blank");n.document.write(t),n.document.close(),setTimeout(()=>{n.focus(),n.print()},500),K("reportModal"),x('PDF oluşturuluyor — "PDF olarak kaydet" seçin')}async function So(){const e=document.getElementById("rpStuId").value,t=d.students.find(s=>s.id===e);if(!t)return;const n=`${window.location.origin}/api/generate-pdf-report?studentId=${e}`,a=`Merhaba, ${t.name} isimli öğrencimizin bu dönemki performans ve gelişim raporu hazırlandı. Aşağıdaki bağlantıdan raporu detaylıca görüntüleyebilirsiniz:

🔗 ${n}`,o=`https://api.whatsapp.com/send?text=${encodeURIComponent(a)}`;window.open(o,"_blank"),K("reportModal"),x("WhatsApp yönlendirmesi açıldı ✓")}function _o(){let e=document.getElementById("weeklyPDFModal");e||(e=document.createElement("div"),e.id="weeklyPDFModal",e.className="modal-bg",e.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('weeklyPDFModal')">×</button>
      <h2>🖨️ Haftalık Program PDF</h2>
      <div class="field">
        <label>Koç Notu (isteğe bağlı)</label>
        <textarea id="pdfNote" placeholder="Bu haftaki programla ilgili notunuzu ekleyin..." style="min-height:90px"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px" onclick="generateWeeklyPDF()">PDF Oluştur →</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pdfNote").value="",Y("weeklyPDFModal")}function zo(){const e=document.getElementById("pdfNote").value.trim();K("weeklyPDFModal"),jn(d.activeStuId,e)}function jn(e,t){var I,T;const n=d.students.find(f=>f.id===e);if(!n)return;const a=(n==null?void 0:n.weekStart)??0,i=W(d.weekOffset,a),o=q(i,6),s=((I=d.workspace)==null?void 0:I.brand_name)||"Rostrum Akademi",r=((T=d.workspace)==null?void 0:T.brand_color)||"#f0a500",l=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],c=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],p={deneme:"#f59e0b",soru:"#3b82f6",konu:"#10b981",diger:"#8b5cf6"},m={deneme:"#fffbeb",soru:"#eff6ff",konu:"#f0fdf4",diger:"#faf5ff"},v={deneme:"Deneme",soru:"Soru Bankası",konu:"Konu Anlatımı",diger:"Diğer"},w=H(new Date);let E=0,_=0,b=0,h="";for(let f=0;f<7;f++){const L=q(i,f),j=H(L),A=d.tasks[`${e}_${j}`]||[];E+=A.length,_+=A.filter(N=>N.done).length,b+=A.reduce((N,G)=>N+Number(G.duration||0),0);const C=j===w,P=l[(a+f)%7].slice(0,3).toUpperCase(),R=A.reduce((N,G)=>N+Number(G.duration||0),0),F=A.map(N=>{const G=p[N.type]||"#94a3b8",ae=m[N.type]||"#f8fafc",ee=v[N.type]||"Diğer";return`<div style="margin-bottom:5px;border-radius:7px;background:${ae};border:1px solid ${G}28;border-left:3px solid ${G}">
        <div style="padding:6px 8px">
          <div style="font-size:7.5px;font-weight:800;color:${G};text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${ee}${N.exam?` · ${N.exam}`:""}</div>
          <div style="font-size:10px;font-weight:700;color:#111;line-height:1.3">${u(N.subject)}</div>
          ${N.note?`<div style="font-size:7.5px;color:#999;margin-top:2px;line-height:1.4;word-break:break-word">${u(N.note)}</div>`:""}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
            <span style="display:inline-flex;align-items:center;gap:4px;font-size:8px;color:#bbb">
              <span style="display:inline-block;width:11px;height:11px;border:1.5px solid #d0cec9;border-radius:3px;flex-shrink:0"></span>
              ${N.duration} dk
            </span>
            ${N.done?'<span style="font-size:8px;font-weight:700;color:#22c55e">✓ Tamam</span>':""}
          </div>
        </div>
      </div>`}).join("");h+=`<div style="padding:0 5px;border-right:${f<6?"1px solid #ede9e3":"none"}">
      <div style="padding-bottom:7px;margin-bottom:7px;border-bottom:2px solid ${C?r:"#ede9e3"}">
        <div style="font-size:8px;font-weight:800;color:${C?r:"#bbb"};text-transform:uppercase;letter-spacing:.8px">${P}</div>
        <div style="font-size:22px;font-weight:900;color:${C?r:"#111"};line-height:1;margin-top:1px">${L.getDate()}</div>
        ${R>0?`<div style="font-size:7px;color:#ccc;margin-top:2px">${R}dk · ${A.length}g</div>`:""}
      </div>
      ${A.length===0?'<div style="font-size:13px;color:#e8e4dc;text-align:center;padding:14px 0">—</div>':F}
    </div>`}const $=E>0?Math.round(_/E*100):0,S=$>=80?"#22c55e":$>=50?r:"#f59e0b",z=n.name.split(" ").map(f=>f[0]).join("").slice(0,2).toUpperCase();let D="";for(let f=0;f<7;f++){const L=q(i,f),j=H(L),A=d.tasks[`${e}_${j}`]||[];if(A.length===0)continue;const C=l[(a+f)%7],P=A.map((R,F)=>{const N=p[R.type]||"#94a3b8",G=v[R.type]||"Diğer";return`<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #eee">
        <div style="display:flex;align-items:baseline;gap:8px">
          <span style="font-size:12px;font-weight:800;color:${N}">${F+1}. ${G}${R.exam?` (${R.exam})`:""}</span>
          <span style="font-size:12px;font-weight:700;color:#111">${u(R.subject)}</span>
          <span style="font-size:11px;color:#666;margin-left:auto">${R.duration} dk</span>
        </div>
        ${R.note?`<div style="font-size:10px;color:#555;margin-top:4px;padding-left:14px;border-left:2px solid ${N}40;line-height:1.5">${u(R.note).replace(/\n/g,"<br>")}</div>`:""}
      </div>`}).join("");D+=`<div style="margin-bottom:24px">
      <h3 style="font-size:14px;font-weight:800;color:${r};border-bottom:2px solid ${r}40;padding-bottom:4px;margin-bottom:10px">${L.getDate()} ${c[L.getMonth()]} - ${C}</h3>
      <div>${P}</div>
    </div>`}const k=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
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
  <div style="height:5px;background:${r}"></div>

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px 11px;border-bottom:1px solid #ede9e3">
    <div>
      <div style="font-size:18px;font-weight:900;color:${r};letter-spacing:-.3px">${u(s)}</div>
      <div style="font-size:9.5px;color:#bbb;margin-top:2px;letter-spacing:.2px">Haftalık Çalışma Programı</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:800;color:#111">${u(n.name)}</div>
        ${n.target?`<div style="font-size:8.5px;color:#aaa;margin-top:1px">🎯 ${u(n.target)}</div>`:""}
        <div style="font-size:8.5px;color:#bbb;margin-top:1px">${i.getDate()} ${c[i.getMonth()]} – ${o.getDate()} ${c[o.getMonth()]} ${o.getFullYear()}</div>
      </div>
      <div style="width:40px;height:40px;border-radius:10px;background:${r};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;letter-spacing:-.5px;flex-shrink:0">${z}</div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div style="display:flex;align-items:center;gap:0;padding:7px 18px;background:#faf9f8;border-bottom:1px solid #ede9e3">
    <div style="display:flex;align-items:center;gap:18px">
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:${r};letter-spacing:-.5px">${E}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Görev</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#22c55e;letter-spacing:-.5px">${_}</div>
        <div style="font-size:7.5px;color:#bbb;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Tamamlanan</div>
      </div>
      <div style="width:1px;height:26px;background:#ede9e3"></div>
      <div style="text-align:center">
        <div style="font-size:17px;font-weight:900;color:#3b82f6;letter-spacing:-.5px">${Math.round(b/60)}<span style="font-size:10px">sa</span></div>
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
  <div style="display:grid;grid-template-columns:repeat(7,1fr);padding:10px 8px 6px">${h}</div>

  <!-- COACH NOTE -->
  ${t?`<div style="margin:2px 14px 10px;padding:10px 14px;background:${r}0d;border-left:3px solid ${r};border-radius:0 8px 8px 0">
    <div style="font-size:8px;font-weight:800;color:${r};text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">Koç Notu</div>
    <div style="font-size:10px;color:#444;line-height:1.6">${u(t)}</div>
  </div>`:""}

  <!-- FOOTER -->
  <div style="display:flex;align-items:center;gap:14px;padding:7px 16px;border-top:1px solid #ede9e3;background:#faf9f8">
    <span style="font-size:8px;color:#ccc;margin-right:4px;font-weight:600">TÜRLER:</span>
    ${Object.entries(v).map(([f,L])=>`<div style="display:flex;align-items:center;gap:4px;font-size:8.5px;color:#888"><div style="width:8px;height:8px;border-radius:2px;background:${p[f]}"></div>${L}</div>`).join("")}
    <div style="margin-left:auto;font-size:8px;color:#ccc">${u(s)} · ${new Date().toLocaleDateString("tr-TR")}</div>
  </div>

  <!-- PRINT BUTTON -->
  <div class="no-print" style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-top:1px solid #ede9e3">
    <button onclick="window.print()" style="background:${r};color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.2px">🖨️ PDF İndir / Yazdır</button>
    <span style="font-size:11px;color:#bbb">Tarayıcı ayarlarından "Arka plan grafikleri"ni aktif edin</span>
  </div>

  <!-- PAGE 2: DETAILED LIST VIEW -->
  ${D?`
  <div class="page-break" style="padding:40px 30px;max-width:1000px;margin:0 auto">
    <div style="font-size:18px;font-weight:900;color:${r};margin-bottom:20px;border-bottom:2px solid ${r};padding-bottom:10px">📋 Günlük Detaylı Görev Açıklamaları</div>
    ${D}
  </div>`:""}

  </body></html>`,B=window.open("","_blank","width=1200,height=850");B.document.write(k),B.document.close(),setTimeout(()=>B.focus(),300)}function Bo(){const e="abcdefghijklmnopqrstuvwxyz",t=()=>Array.from({length:3},()=>e[Math.floor(Math.random()*e.length)]).join("");return`https://meet.google.com/${t()}-${t()}-${t()}`}function Mo(){return`https://zoom.us/j/${Math.floor(Math.random()*9e9)+1e9}`}function Ao(e){navigator.clipboard.writeText(e).then(()=>x("Link kopyalandı ✓")).catch(()=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),x("Link kopyalandı ✓")})}const Pn=[{name:"Altın",val:"#f0a500",dim:"rgba(240,165,0,.12)"},{name:"Turuncu",val:"#e8622a",dim:"rgba(232,98,42,.12)"},{name:"Mavi",val:"#4da6ff",dim:"rgba(77,166,255,.12)"},{name:"Yeşil",val:"#3ecf8e",dim:"rgba(62,207,142,.12)"},{name:"Mor",val:"#c084fc",dim:"rgba(192,132,252,.12)"},{name:"Pembe",val:"#f472b6",dim:"rgba(244,114,182,.12)"},{name:"Kırmızı",val:"#ff5c5c",dim:"rgba(255,92,92,.12)"},{name:"Turkuaz",val:"#06b6d4",dim:"rgba(6,182,212,.12)"}];function Rn(){try{const e=JSON.parse(localStorage.getItem("ba_theme")||"{}");e.theme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme"),e.accent&&Hn(e.accent,e.accentDim,!1)}catch{}}function Hn(e,t,n=!0){if(document.documentElement.style.setProperty("--accent",e),document.documentElement.style.setProperty("--accent-dim",t||"rgba(240,165,0,.12)"),n)try{const a=JSON.parse(localStorage.getItem("ba_theme")||"{}");a.accent=e,a.accentDim=t,localStorage.setItem("ba_theme",JSON.stringify(a))}catch{}}function Do(e){e==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme");try{const t=JSON.parse(localStorage.getItem("ba_theme")||"{}");t.theme=e,localStorage.setItem("ba_theme",JSON.stringify(t))}catch{}document.querySelectorAll(".theme-btn").forEach(t=>{const n=t.dataset.theme===e;t.style.background=n?"var(--accent-dim)":"",t.style.borderColor=n?"var(--accent)":"",t.style.color=n?"var(--accent)":""})}function Co(){let e=document.getElementById("themePanel");if(e){e.remove();return}e=document.createElement("div"),e.id="themePanel";const t=document.documentElement.getAttribute("data-theme")!=="light";e.style.cssText="position:fixed;top:60px;right:12px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:18px;z-index:300;box-shadow:var(--shadow-lg);min-width:230px;animation:fadeUp .2s ease",e.innerHTML=`
    <div style="font-family:'Inter',sans-serif;font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text)">🎨 Tema Ayarları</div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Mod</div>
    <div style="display:flex;gap:6px;margin-bottom:16px">
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="dark" onclick="setTheme('dark')" style="${t?"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)":""}">🌙 Karanlık</button>
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="light" onclick="setTheme('light')" style="${t?"":"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)"}">☀️ Aydınlık</button>
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Accent Rengi</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px">
      ${Pn.map(n=>`<div onclick="applyAccent('${n.val}','${n.dim}');document.getElementById('themePanel').remove()" title="${n.name}"
        style="width:28px;height:28px;border-radius:8px;background:${n.val};cursor:pointer;transition:transform .1s"
        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''"></div>`).join("")}
    </div>
    <button onclick="document.getElementById('themePanel').remove()" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text-mid);border-radius:8px;padding:7px;font-family:inherit;font-size:12px;cursor:pointer">Kapat</button>`,document.body.appendChild(e),setTimeout(()=>document.addEventListener("click",function n(a){!e.contains(a.target)&&!a.target.closest("[onclick*=openThemePanel]")&&(e.remove(),document.removeEventListener("click",n))},!0),150)}let ct=[],ft=!1;function Nn(){const e=document.getElementById("aiChatBubble"),t=document.querySelector(".ai-header-name"),n=document.getElementById("aiMessages");if(!e||!t||!n)return;ct=[],n.innerHTML=`
    <div class="ai-welcome">
      <div class="ai-welcome-emoji">🎓</div>
      <div class="ai-welcome-title"></div>
      <div class="ai-welcome-sub"></div>
      <div class="ai-quick-btns"></div>
    </div>`;const a=n.querySelector(".ai-welcome"),i=a.querySelector(".ai-welcome-title"),o=a.querySelector(".ai-welcome-sub"),s=a.querySelector(".ai-quick-btns");y.role==="coach"||y.role==="developer"?(e.title="Yapay Zeka Koç Asistanı",t.textContent="Yapay Zeka Koç Asistanı",i.textContent="Merhaba Hocam! Ben Koç Asistanınız",o.textContent="Öğrenci analizleri, veri okuma, ders çalışma programı taslakları hazırlama ve pedagojik konularda size yardımcı olabilirim.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Seçili öğrencinin genel durum analizini yap')">📊 Öğrenci Analizi</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Pedagojik motivasyon teknikleri öner')">💡 Pedagojik Öneri</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zorlanan bir öğrenci için haftalık program şablonu oluştur')">📋 Program Şablonu</button>
    `):y.role==="parent"?(e.title="Yapay Zeka Veli Bilgilendirme Asistanı",t.textContent="Yapay Zeka Veli Asistanı",i.textContent="Merhaba! Ben Veli Asistanıyım",o.textContent="Çocuğunuzun ders çalışma durumu, deneme netleri ve evde ona nasıl destek olabileceğiniz konularında bilgi alabilirsiniz.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çocuğumun bu haftaki gelişimini özetle')">📊 Gelişim Özeti</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Evde verimli ders çalışma ortamı nasıl sağlanır?')">🏠 Ev Ortamı</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Sınav stresiyle başa çıkmak için veli olarak ne yapmalıyım?')">🧘 Stres Yönetimi</button>
    `):(e.title="Yapay Zeka Ders Asistanı",t.textContent="Yapay Zeka Ders Asistanı",i.textContent="Merhaba! Ben Ders Asistanın (Yapay Zeka)",o.textContent="7/24 anlık soru çözümü, konu anlatımı, özet çıkarma ve mini pratik sınav konularında sana yardımcı olan mekanik bir asistanım. Ben bir yapay zekayım ve koçunun yerini alamam; duygusal veya motivasyonel konularda koçuna danışmalısın.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çözemediğim bir Matematik/Fen sorusu var. Sokratik tarzda, adım adım ipuçları vererek çözmeme yardım eder misin?')">📝 Çözemediğim Soru Var</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bir konunun özetini çıkarmak istiyorum. Hangi ders ve konudan özet çıkarmak istediğimi sorup yardımcı olur musun?')">📖 Konu Özeti Çıkar</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zayıf olduğum konular üzerinde çalışıp pratik yapmak istiyorum. Hangi derslerden yardıma ihtiyacım olduğunu sorup pratik yapalım.')">🎯 Zayıf Konuları Çalış</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bana seçtiğim bir konudan 3 soruluk hızlı bir mini quiz yapar mısın? Soruları tek tek sor.')">⚡ Hızlı Sınav Yap</button>
    `)}function Lo(){const e=document.getElementById("aiChatPanel"),t=document.getElementById("aiChatBubble");if(e.classList.contains("open"))e.classList.remove("open"),t.style.display="flex";else{e.classList.add("open"),t.style.display="none";const n=document.getElementById("aiMessages");n.scrollTop=n.scrollHeight,document.getElementById("aiInput").focus()}}function jo(e){document.getElementById("aiInput").value=e,Yn()}function wt(){var t;const e={};try{const n=d.students.find(s=>s.id===d.activeStuId);n&&(e.studentName=n.name,e.target=n.target||""),y.role==="parent"&&y.childName&&(e.studentName=y.childName);const a=(d.exams||[]).filter(s=>s.studentId===d.activeStuId).slice(-5);a.length&&(e.recentExams=a.map(s=>({name:s.type+" "+(s.name||""),date:s.date||"",nets:s.nets||{}})));let i=[];if(Object.entries(d.tasks||{}).forEach(([s,r])=>{s.startsWith(d.activeStuId+"_")&&(i=i.concat(r))}),i.length){const s=i.filter(r=>r.done).length;e.taskCompletionRate=Math.round(s/i.length*100),e.weeklyTaskCount=i.length}const o=Object.keys(EXAM_DEFS);a.length&&(e.examProfile=((t=a[0])==null?void 0:t.type)||o[0])}catch(n){console.warn("AI context error:",n)}return e}function fe(e,t){ct.push({role:e,content:t});const n=document.getElementById("aiMessages"),a=n.querySelector(".ai-welcome");a&&a.remove();const i=new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),o=document.createElement("div");o.className=`ai-msg ${e}`,o.innerHTML=`${u(t).replace(/\n/g,"<br>")}<div class="ai-msg-time">${i}</div>`,n.appendChild(o),n.scrollTop=n.scrollHeight}async function Yn(){if(ft)return;const e=document.getElementById("aiInput"),t=e.value.trim();if(t){e.value="",fe("user",t),ft=!0,document.getElementById("aiTyping").classList.add("show"),document.getElementById("aiSendBtn").disabled=!0;try{const n=wt(),a=y.role||"student",i=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1","/api/ai-chat"),o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:ct.slice(-10),context:n,userRole:a})});if(o.ok){const s=await o.json();fe("assistant",s.reply||"Yanıt alınamadı.")}else{const s=await Me(t,n,a);fe("assistant",s)}}catch(n){console.error("AI error:",n);try{const a=wt(),i=await Me(t,a,y.role||"student");fe("assistant",i)}catch{const i=localStorage.getItem("gemini_api_key");fe("assistant","🔒 Bu özellik ileride aktif olacaktır. Yakında kullanıma açılacak.")}}finally{ft=!1,document.getElementById("aiTyping").classList.remove("show"),document.getElementById("aiSendBtn").disabled=!1}}}let xt=null;async function Kn(e){try{const t=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${e}`);if(!t.ok)return null;const a=(await t.json()).models||[];let i=a.find(o=>o.name.toLowerCase().includes("flash")&&o.supportedGenerationMethods.includes("generateContent"));if(i||(i=a.find(o=>o.supportedGenerationMethods.includes("generateContent"))),i)return i.name.replace("models/","")}catch(t){console.warn("Auto-detect model failed:",t)}return null}async function Me(e,t,n){var p,m,v,w,E,_;let a=localStorage.getItem("gemini_api_key");if(!a)try{const{data:b}=await g.from("platform_settings").select("value").eq("key","ai_settings").maybeSingle();b&&b.value&&b.value.gemini_api_key&&(a=b.value.gemini_api_key)}catch(b){console.warn("DB Gemini API key load error:",b)}const i=a;if(!i)throw new Error("API anahtarı eksik.");let o="gemini-1.5-flash";if(i)if(xt)o=xt;else{const b=await Kn(i);b&&(xt=b,o=b,console.log("[Gemini API] Otomatik model tespiti başarılı:",o))}let s=`Sen "Rostrum Akademi Yapay Zeka Asistanı"sın. Türkiye eğitim sistemine (YKS, LGS) hakim, rolüne göre öğrencilere, velilere veya koçlara destek veren bir yapay zekasın.

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
Hedef: ${t.target}`);const r=[{role:"user",parts:[{text:s}]},{role:"model",parts:[{text:"Anladım! Rostrum Akademi Yapay Zeka Asistanı olarak hazırım."}]},...ct.slice(-8).map(b=>({role:b.role==="user"?"user":"model",parts:[{text:b.content}]}))],l=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${o}:generateContent?key=${i}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:r,generationConfig:{temperature:.7,maxOutputTokens:1500}})});if(!l.ok){let b=`HTTP ${l.status}`;try{const h=await l.json();(p=h==null?void 0:h.error)!=null&&p.message&&(b=h.error.message)}catch{}throw new Error(b)}const c=await l.json();return((_=(E=(w=(v=(m=c==null?void 0:c.candidates)==null?void 0:m[0])==null?void 0:v.content)==null?void 0:w.parts)==null?void 0:E[0])==null?void 0:_.text)||"Yanıt üretilemedi."}let Ot="";async function Po(e){const t=d.students.find(a=>a.id===e);if(!t)return;const n=document.getElementById("aiCopilotBtn");n.disabled=!0,n.textContent="⌛ Analiz Ediliyor ve Taslak Oluşturuluyor...";try{const a=W(0,t.weekStart||0);let i=0,o=0,s=0;for(let $=0;$<7;$++){const S=d.tasks[`${t.id}_${H(q(a,$))}`]||[];i+=S.length,o+=S.filter(z=>z.done).length,s+=S.reduce((z,D)=>z+Number(D.duration||0),0)}const r=i>0?Math.round(o/i*100):0,c=(d.exams||[]).filter($=>$.studentId===e).slice(-5).map($=>({name:$.type+" "+($.name||""),date:$.date||"",nets:$.nets||{}})),p={};(d.studentSpeeds||[]).filter($=>$.student_id===e).forEach($=>{p[`${$.exam_type}_${$.subject}`]=$.secs_per_question});const m=`Lütfen şu öğrenci için haftalık durum analizi ve öğrenciye gönderilecek haftalık değerlendirme mesajı taslağı oluştur:
Öğrenci Adı: ${t.name}
Hedef: ${t.target||"Belirtilmemiş"}
Bu haftaki görev tamamlama oranı: %${r} (${o}/${i} görev tamamlandı, toplam ${Math.round(s/60)} saat çalışıldı)
Son denemeler: ${JSON.stringify(c)}
Soru Çözüm Hızları (saniye/soru): ${JSON.stringify(p)}

ANALİZ VE TASLAK KURALLARI (TÜRKÇE YAZ):
1. Analiz kısmını koçun göreceği şekilde kısa, net ve yapıcı tut. Zayıf konuları ve sınav netlerindeki değişimleri vurgula.
2. Öğrenciye gönderilecek mesaj taslağını samimi ve destekleyici yaz, fakat koçun kendi yorumlarını ekleyebileceği şablon alanları bırak. Örneğin: "[Buraya öğrenciyle son görüşmenizden özel bir not ekleyin]" veya "[Zorlandığı konuyla ilgili kendi ek önerilerinizi girin]".
3. Mesaj taslağı tamamen Türkçe, samimi ve yapıcı olmalıdır. Asla yapay zeka olduğunu belli eden klişeler içermesin.
4. Çıktıyı tam olarak şu iki etiket arasında yapılandır:
[ANALİZ]
(Koç için durum analizi ve anomali tespiti)
[TASLAK]
(Öğrenciye gönderilecek haftalık değerlendirme taslağı)`;let v="";const w={studentName:t.name,target:t.target,recentExams:c,taskCompletionRate:r,weeklyTaskCount:i};try{const $=await fetch("/api/ai-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:m}],context:w,userRole:"coach"})});$.ok?v=(await $.json()).reply:v=await Me(m,w,"coach")}catch{v=await Me(m,w,"coach")}let E="Analiz üretilemedi.",_="Taslak üretilemedi.";const b=v.indexOf("[ANALİZ]"),h=v.indexOf("[TASLAK]");b!==-1&&h!==-1?b<h?(E=v.substring(b+8,h).trim(),_=v.substring(h+8).trim()):(_=v.substring(h+8,b).trim(),E=v.substring(b+8).trim()):_=v,document.getElementById("aiCopilotAnalysisBox").innerHTML=`<b>📊 Yapay Zeka Durum Analizi:</b><br>${E.replace(/\n/g,"<br>")}`,document.getElementById("aiCopilotTextarea").value=_,Ot=_,document.getElementById("aiCopilotResultArea").style.display="block",document.getElementById("aiCopilotSendBtn").disabled=!0,document.getElementById("aiCopilotEditWarning").style.display="inline"}catch(a){console.error("generateAICopilotDraft error:",a),x("Taslak oluşturulurken hata: "+a.message)}finally{n.disabled=!1,n.textContent="🤖 Durum Analizi Yap ve Taslak Oluştur"}}function Ro(){const e=document.getElementById("aiCopilotTextarea").value.trim(),t=document.getElementById("aiCopilotSendBtn"),n=document.getElementById("aiCopilotEditWarning");e&&e!==Ot?(t.disabled=!1,n.style.display="none"):(t.disabled=!0,n.style.display="inline")}async function Ho(e){var a;const t=document.getElementById("aiCopilotTextarea").value.trim();if(!t)return;const n=document.getElementById("aiCopilotSendBtn");n.disabled=!0,n.textContent="Gönderiliyor...";try{const i=y.coachId||((a=d.students.find(r=>r.id===e))==null?void 0:a.coachId),{data:o,error:s}=await g.from("messages").insert({student_id:e,coach_id:i,from_role:"coach",text:t,read:!1}).select().single();if(s)throw s;d.messages[e]||(d.messages[e]=[]),d.messages[e].push({_id:o.id,from:"coach",text:t,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),x("Taslak mesaj başarıyla düzenlendi ve öğrenciye gönderildi!"),document.getElementById("aiCopilotResultArea").style.display="none",document.getElementById("aiCopilotTextarea").value="",Ot=""}catch(i){console.error("sendCopilotDraft error:",i),x("Gönderim hatası: "+i.message),n.disabled=!1}finally{n.textContent="✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder"}}function On(){const e=d.students.find(r=>r.id===d.activeStuId),t=y.childName||(e==null?void 0:e.name)||"Öğrenci",n=document.getElementById("view-parent-home");if(!n)return;let a=[];Object.entries(d.tasks||{}).forEach(([r,l])=>{r.startsWith(d.activeStuId+"_")&&(a=a.concat(l))});const i=a.filter(r=>r.done).length,o=a.length?Math.round(i/a.length*100):0,s=(d.exams||[]).filter(r=>r.studentId===d.activeStuId).slice(-3);n.innerHTML=`
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
        ${s.map(r=>{const l=Object.values(r.nets||{}).reduce((c,p)=>c+(parseFloat(p)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(r.name||r.type)}</div><div style="font-size:11px;color:var(--text-mid)">${r.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${l.toFixed(1)} net</div>
          </div>`}).join("")}
      </div>`:""}
      
      <div class="card" style="padding:20px;background:linear-gradient(135deg,rgba(240,165,0,.05),rgba(62,207,142,.05))">
        <div style="font-size:15px;font-weight:700;margin-bottom:8px">🤖 AI Asistandan Yardım Alın</div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:12px">Çocuğunuzun ilerlemesi hakkında anında rapor alabilirsiniz.</div>
        <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;width:100%;padding:12px">🤖 AI Asistan ile Konuş</button>
      </div>
    </div>`}function Fn(){const e=document.getElementById("view-parent-progress");if(!e)return;const t=d.students.find(o=>o.id===d.activeStuId),n=y.childName||(t==null?void 0:t.name)||"Öğrenci",a=(d.exams||[]).filter(o=>o.studentId===d.activeStuId);let i=[];Object.entries(d.tasks||{}).forEach(([o,s])=>{o.startsWith(d.activeStuId+"_")&&(i=i.concat(s))}),e.innerHTML=`
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="font-size:20px;font-weight:800;margin-bottom:20px">📊 ${u(n)} - İlerleme Raporu</div>
      
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📋 Haftalık Görevler</div>
        ${i.length?i.slice(-10).map(o=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:20px;height:20px;border-radius:50%;background:${o.done?"var(--green)":"var(--surface2)"};border:2px solid ${o.done?"var(--green)":"var(--border)"};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">${o.done?"✓":""}</div>
            <div style="flex:1;font-size:13px">${u(o.subject)} <span style="font-size:11px;color:var(--text-dim)">(${Ke(o.type)})</span></div>
            <div style="font-size:11px;color:var(--text-mid)">${o.done?"Tamamlandı":"Bekliyor"}</div>
          </div>`).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz görev bulunmuyor.</div>'}
      </div>
      
      <div class="card" style="padding:20px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📊 Deneme Geçmişi</div>
        ${a.length?a.slice(-10).map(o=>{const s=Object.values(o.nets||{}).reduce((r,l)=>r+(parseFloat(l)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(o.name||o.type)}</div><div style="font-size:11px;color:var(--text-mid)">${o.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${s.toFixed(1)} net</div>
          </div>`}).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz deneme sonucu yok.</div>'}
      </div>
    </div>`}function qn(){const e=document.getElementById("view-parent-ai");e&&(e.innerHTML=`
    <div style="padding:24px;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🤖</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">AI Koç Asistanı</div>
      <div style="font-size:13px;color:var(--text-mid);margin-bottom:24px;line-height:1.7">Çocuğunuzun eğitim süreci hakkında sorular sorun, deneme analizleri isteyin veya öneriler alın.</div>
      <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;padding:14px 32px;font-size:15px">💬 AI Asistan ile Konuşmaya Başla</button>
    </div>`)}async function No(){var v;const e=document.getElementById("smId").value,t=document.getElementById("smName").value.trim(),n=he(document.getElementById("smUsername").value.trim()),a=document.getElementById("smPass").value,i=document.getElementById("smRole").value,o=document.getElementById("smTarget").value.trim(),s=((v=document.querySelector(".color-opt.sel"))==null?void 0:v.dataset.c)||"#f0a500",r=Number(document.getElementById("smWeekStart").value),l=Number(document.getElementById("smProg").value);if(!t||!n||!a)return x("Ad, kullanıcı adı ve şifre zorunlu!");const c=a.length===64?a:await Te(a),p=n+"@rostrumakademi.com",m={full_name:t,username:n,password_hash:c,role:i,target:o,color:s,week_start:r,progress:l};if(M(!0),e){const{error:w}=await g.from("users").update(m).eq("id",e);if(M(!1),w)return x("Hata: "+w.message);x("Kullanıcı güncellendi ✓")}else{const{data:w,error:E}=await g.rpc("create_new_user",{p_email:p,p_password:a,p_full_name:t,p_username:n,p_role:i,p_target:o,p_color:s,p_progress:l,p_week_start:r,p_coach_id:null,p_institution_id:null,p_exam_profile:"YKS"});if(M(!1),E)return x("Hata: "+E.message);x("Kullanıcı başarıyla oluşturuldu ✓")}K("studentModal"),rt()}let ue=[],de={search:"",exam:"",subject:""};function Ft(e){const t=de.search;return e.filter(n=>!(t&&!n.name.toLowerCase().includes(t)&&!(n.publisher||"").toLowerCase().includes(t)||de.exam&&n.exam_type!==de.exam||de.subject&&n.subject!==de.subject))}function Yo(){var i,o,s;de.search=(((i=document.getElementById("crSearch"))==null?void 0:i.value)||"").toLowerCase().trim(),de.exam=((o=document.getElementById("crExam"))==null?void 0:o.value)||"",de.subject=((s=document.getElementById("crSubject"))==null?void 0:s.value)||"";const e=document.getElementById("cr-tab-content");if(!e)return;const t=document.querySelector(".cr-tab.active"),n=(t==null?void 0:t.id)==="crt-playlists"?"playlists":(t==null?void 0:t.id)==="crt-analytics"?"analytics":"books",a=Ft(ue);e.innerHTML=pt(n,a)}function pt(e,t){const n=t.filter(r=>r.resource_type==="book"),a=t.filter(r=>r.resource_type==="playlist"),i={Matematik:"#3B82F6",Fizik:"#8B5CF6",Kimya:"#06B6D4",Biyoloji:"#10B981",Geometri:"#6366F1",Türkçe:"#F59E0B",Edebiyat:"#EC4899",Tarih:"#EF4444",Coğrafya:"#84CC16",Felsefe:"#14B8A6","Din Kültürü":"#F97316",Din:"#F97316",Genel:"#6B7280"},o={Matematik:"∑",Fizik:"⚛",Kimya:"🧪",Biyoloji:"🌿",Geometri:"△",Türkçe:"T",Edebiyat:"✒",Tarih:"🏛",Coğrafya:"🌍",Felsefe:"💭","Din Kültürü":"☪",Din:"☪",Genel:"📌"};function s(r,l){if(!r.length)return'<div style="text-align:center;padding:48px;color:var(--text-dim);font-size:13px">Kaynak bulunamadı.</div>';const c={};return r.forEach(p=>{const m=p.exam_type||"Diğer";c[m]||(c[m]={});const v=p.subject||"Genel";c[m][v]||(c[m][v]=[]),c[m][v].push(p)}),Object.entries(c).map(([p,m])=>`
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#fff;background:var(--accent);padding:3px 10px;border-radius:99px">${p}</span>
          <div style="flex:1;height:1px;background:var(--border)"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
        ${Object.entries(m).map(([v,w])=>{const E=i[v]||"#6B7280",_=o[v]||"📌";return`<div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">
              <div style="width:22px;height:22px;border-radius:6px;background:${E}20;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${E};flex-shrink:0">${_}</div>
              <span style="font-size:12px;font-weight:700;color:${E}">${v}</span>
              <span style="font-size:10px;color:var(--text-dim)">${w.length} kaynak</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;padding-left:28px">
              ${w.map(b=>`
                <div style="display:flex;align-items:center;padding:10px 14px;border-radius:10px;background:var(--surface);border:1.5px solid var(--border);gap:12px;cursor:default;transition:all .15s;box-shadow:var(--shadow)" onmouseover="this.style.borderColor='${E}';this.style.boxShadow='0 2px 12px ${E}22'" onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='var(--shadow)'">
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${u(b.name)}${b.coach_id?' <span style="font-size:10px;font-weight:700;color:var(--accent);background:var(--accent-dim);padding:1px 6px;border-radius:99px;margin-left:4px">Özel</span>':""}</div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                      <span style="font-size:11px;font-weight:600;color:var(--text-dim);background:var(--surface2);padding:1px 8px;border-radius:99px;border:1px solid var(--border)">${u(b.publisher||"—")}</span>
                      <span style="font-size:11px;color:var(--text-dim)">${(b.tests||[]).length} ${l==="book"?"test":"video"}</span>
                    </div>
                  </div>
                  ${b.coach_id?`<div style="display:flex;gap:4px;flex-shrink:0">
                    <button class="btn btn-ghost btn-xs" onclick="openResourceModalCoach('${b.id}','${l}')">✏️</button>
                    <button class="btn btn-danger btn-xs" onclick="deleteResourceCoach('${b.id}')">🗑</button>
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
        ${Un(t).map(l=>{const c=l.totalCount>0?Math.round(l.doneCount/l.totalCount*100):0,p=c>=80?"var(--green)":c>=50?"var(--accent)":"var(--text-dim)";return`<div class="analytics-card">
            <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">${l.exam_type} · ${l.subject}</div>
            <div style="font-size:14px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:8px">${u(l.name)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-mid);margin-bottom:6px"><span>Tamamlama</span><span style="font-weight:700;color:${p}">%${c}</span></div>
            <div style="height:5px;background:var(--surface3);border-radius:99px;overflow:hidden;margin-bottom:10px"><div style="height:100%;width:${c}%;background:${p};border-radius:99px"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim)"><span>Atanma: <b>${l.assignedCount}</b></span><span>Öğrenci: <b>${l.studentsCount}</b></span></div>
          </div>`}).join("")||'<div style="grid-column:span 3;text-align:center;padding:40px;color:var(--text-dim)">Kayıtlı performans verisi bulunamadı.</div>'}
      </div>`}async function Ge(){const e=document.getElementById("view-coach-resources");if(!e)return;if(!ue.length){e.innerHTML='<div style="max-width:720px;margin:0 auto;padding:40px;text-align:center;color:var(--text-dim);font-size:13px">Kaynaklar yükleniyor…</div>';const{data:a,error:i}=await g.from("resources").select("*").or(`coach_id.eq.${y.coachId},coach_id.is.null`).order("resource_type,exam_type,subject,name");i&&console.error(i),ue=a||[]}de={search:"",exam:"",subject:""};let t="books";const n=document.querySelector(".cr-tab.active");n&&(n.id==="crt-playlists"?t="playlists":n.id==="crt-analytics"&&(t="analytics")),e.innerHTML=`<div style="max-width:720px;margin:0 auto">
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
      ${pt(t,ue)}
    </div>
  </div>`}function Ko(e){var n;document.querySelectorAll(".cr-tab").forEach(a=>a.classList.remove("active")),(n=document.getElementById("crt-"+e))==null||n.classList.add("active");const t=Ft(ue);document.getElementById("cr-tab-content").innerHTML=pt(e,t)}function Un(e){const t={};return e.forEach(n=>{t[n.name]={name:n.name,exam_type:n.exam_type,subject:n.subject,assignedCount:0,totalCount:0,doneCount:0,students:new Set}}),Object.entries(d.tasks).forEach(([n,a])=>{const i=n.split("_")[0];a.forEach(o=>{e.forEach(s=>{if(o.subject&&o.subject.includes(s.name)){const r=t[s.name];r&&(r.assignedCount++,r.students.add(i),o.task_items&&Array.isArray(o.task_items)?o.task_items.forEach(l=>{r.totalCount++,(l.done||o.done)&&r.doneCount++}):(r.totalCount++,o.done&&r.doneCount++))}})})}),Object.values(t).map(n=>({...n,studentsCount:n.students.size})).filter(n=>n.assignedCount>0).sort((n,a)=>a.assignedCount-n.assignedCount)}function Oo(e,t="book"){const n=t==="playlist";let a=document.getElementById("coachResourceModal");a||(a=document.createElement("div"),a.id="coachResourceModal",a.className="modal-bg",a.innerHTML=`<div class="modal modal-lg">
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
Sayılar - Test 2 | 14`,document.getElementById("crmYtImportBox").style.display=n&&!e?"":"none",document.getElementById("crmTestsField").style.display=n?"none":"",document.getElementById("crmYtUrl").value="",document.getElementById("crmYtStatus").textContent="",document.getElementById("crmVideoPreview").style.display="none",document.getElementById("crmVideoPreview").innerHTML="",window._crmFetchedVideos=[],e?g.from("resources").select("*").eq("id",e).single().then(({data:i})=>{if(i){document.getElementById("crmExam").value=i.exam_type,document.getElementById("crmSubject").value=i.subject,document.getElementById("crmPublisher").value=i.publisher||"",document.getElementById("crmName").value=i.name||"";const o=i.tests||[];n?(document.getElementById("crmTestsField").style.display="",document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.url||""} | ${s.soru||0}`).join(`
`)):document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.soru||0}`).join(`
`)}}):(document.getElementById("crmExam").value="TYT",document.getElementById("crmSubject").value="Matematik",document.getElementById("crmPublisher").value="",document.getElementById("crmName").value="",document.getElementById("crmTests").value=""),Y("coachResourceModal")}async function Fo(){const e=document.getElementById("crmYtUrl").value.trim(),t=document.getElementById("crmYtStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL girin</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ list= parametresi bulunamadı</span>';const a=n[1];t.innerHTML="⏳ Çekiliyor...";try{let i=[],o="";do{let r=`/api/youtube?playlistId=${a}`;o&&(r+=`&pageToken=${o}`);const l=await fetch(r);if(!l.ok)throw new Error("Playlist çekilemedi.");const c=await l.json();c.items&&(i=i.concat(c.items)),o=c.nextPageToken||"",t.innerHTML=`⏳ ${i.length} video yükleniyor...`}while(o&&i.length<200);window._crmFetchedVideos=i;const s=document.getElementById("crmVideoPreview");if(s.style.display="",s.innerHTML=i.map((r,l)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--border)">
        <div style="width:20px;height:20px;border-radius:5px;background:var(--surface3);color:var(--text-mid);font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${l+1}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(r.title)}</div>
          <div style="font-size:10px;color:var(--text-dim)">⏱ ${r.duration||"?"} dk</div>
        </div>
        <a href="${u(r.url)}" target="_blank" style="font-size:10px;font-weight:700;background:#cc000022;color:#ff5555;border:1px solid #aa222233;padding:3px 8px;border-radius:6px;text-decoration:none;flex-shrink:0">▶</a>
      </div>`).join(""),i.length>0&&!document.getElementById("crmName").value){const r=i[0].title;document.getElementById("crmName").value=r.split(" | ")[0].split(" - ")[0].trim().slice(0,50)}t.innerHTML=`<span style="color:var(--green)">✓ ${i.length} video çekildi!</span>`}catch(i){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${i.message}</span>`}}async function qo(){const e=document.getElementById("crmName").value.trim(),t=document.getElementById("crmSubject").value;if(!e||!t)return x("Ad ve ders zorunlu!");const n=document.getElementById("crmId").value,a=document.getElementById("crmType").value==="playlist",i=document.getElementById("crmTests").value.split(`
`).map(l=>l.trim()).filter(Boolean),o=window._crmFetchedVideos||[];let s=[];if(a){if(o.length>0?s=o.map(l=>({label:l.title||"",url:l.url||"",topic:"",soru:parseInt(l.duration)||0})):s=i.map(l=>{const c=l.split("|").map(p=>p.trim());return{label:c[0]||"",url:c[1]||"",topic:"",soru:parseInt(c[2])||0}}),!s.length)return x("Video listesi boş! Önce playlist çekin.")}else s=i.map(l=>{const c=l.split("|").map(p=>p.trim());return{label:c[0]||"",soru:parseInt(c[1])||0}});const r={exam_type:document.getElementById("crmExam").value,subject:t,publisher:document.getElementById("crmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:s,active:!0,resource_type:a?"playlist":"book",coach_id:y.coachId};M(!0),n?(await g.from("resources").update(r).eq("id",n),x("Güncellendi ✓")):(await g.from("resources").insert(r),x("Kaynak eklendi ✓")),M(!1),K("coachResourceModal"),ue=[],Ge()}async function Uo(e){await Z("Bu kaynağı silmek istediğinizden emin misiniz?")&&(M(!0),await g.from("resources").delete().eq("id",e),M(!1),x("Silindi"),ue=[],Ge())}function Go(e){const t=e.target.files[0];if(!t)return;M(!0);const n=new FileReader;n.onload=async a=>{try{const i=new Uint8Array(a.target.result),o=XLSX.read(i,{type:"array"}),s=o.SheetNames[0],r=o.Sheets[s],l=XLSX.utils.sheet_to_json(r);if(l.length===0)return M(!1),x("Excel dosyası boş!");const c={};l.forEach(v=>{const w=v["Kaynak Adı"]||v.Name||v["Kitap Adı"]||v["Playlist Adı"]||"",_=(v["Kaynak Türü"]||v.Type||v.Tür||"book").toLowerCase().includes("playlist")?"playlist":"book",b=v.Yayınevi||v.Publisher||v.Hoca||"",h=v.Sınav||v.Exam||"TYT",$=v.Ders||v.Subject||"",S=v["Öğe Adı"]||v.Test||v.Video||v["Test Adı"]||v["Video Adı"]||"",z=parseInt(v["Soru Sayısı"]||v.Soru||v.Süre||v["Süre (dk)"]||0),D=v.URL||v.Link||"";if(!w||!$||!S)return;const k=`${w}_${h}_${$}_${_}`;c[k]||(c[k]={exam_type:h,subject:$,publisher:b,name:w,resource_type:_,tests:[]}),c[k].tests.push({label:S,soru:z,url:D,topic:""})});const p=Object.values(c);if(p.length===0)return M(!1),x("Uyumlu veri bulunamadı! Sütun başlıklarını kontrol edin.");let m=0;for(const v of p){const{error:w}=await g.from("resources").insert({...v,year:new Date().getFullYear(),active:!0,coach_id:y.coachId});w||m++}M(!1),x(`✓ Excel'den ${m} kaynak başarıyla aktarıldı!`),ue=[],Ge()}catch(i){M(!1),console.error(i),x("Excel okuma hatası: "+i.message)}},n.readAsArrayBuffer(t)}function Wo(e){const t=e.target.files[0];if(!t)return;M(!0);const n=new FileReader;n.onload=async a=>{try{const i=new Uint8Array(a.target.result),o=XLSX.read(i,{type:"array"}),s=o.Sheets[o.SheetNames[0]],r=XLSX.utils.sheet_to_json(s);if(r.length===0)return M(!1),x("Excel dosyası boş!");let l=0;for(const c of r){const p=c["Ad Soyad"]||c.Ad||c.Name||"",m=c.Hedef||c.Target||"Hedef belirtilmemiş";let v=c["Kullanıcı Adı"]||c.Username||"",w=c.Şifre||c.Password||STU_DEFAULT_PASS;if(!p)continue;v||(v=p.toLowerCase().replace(/\s+/g,"")+Math.floor(Math.random()*100),v=he(v));const E=await Te(w),_=v+"@rostrumakademi.com",{data:b,error:h}=await g.rpc("create_new_user",{p_email:_,p_password:w,p_full_name:p,p_username:v,p_role:"student",p_target:m,p_color:"#4da6ff",p_progress:0,p_week_start:0,p_coach_id:y.coachId,p_institution_id:null,p_exam_profile:"YKS"});!h&&b&&(d.students.push({id:b,name:p,target:m,color:"#4da6ff",progress:0,pass:E,weekStart:0,username:v}),l++)}M(!1),x(`✓ Excel'den ${l} öğrenci başarıyla eklendi!`),le(),Oe()}catch(i){M(!1),console.error(i),x("Excel okuma hatası: "+i.message)}},n.readAsArrayBuffer(t)}function Gn(e){if(!d.activeStuId||!O)return null;let t=null;return Object.entries(d.tasks).forEach(([n,a])=>{n.startsWith(d.activeStuId+"_")&&a.forEach(i=>{i.subject&&i.subject.includes(O.name)&&(i.task_items&&Array.isArray(i.task_items)?i.task_items.forEach(o=>{(o.label||o)===e&&(o.done||i.done?t="done":t!=="done"&&(t="pending"))}):i.note&&i.note.includes(e)&&(i.done?t="done":t!=="done"&&(t="pending")))})}),t}async function Vo(e,t){var l;const a=`${d.activeStuId}_${e}`,i=(l=d.tasks[a])==null?void 0:l[t];if(!i)return;xe=e,_editingTaskId=i._id,O=null,document.querySelector("#taskModal h2").innerHTML=`Görev Düzenle — <span id="tmDay">${e}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Güncelle",document.getElementById("tmType").value=i.type,document.getElementById("tmExam").value=i.exam||"",document.getElementById("tmDuration").value=i.duration||60,document.getElementById("tmNote").value=i.note||"";const o=i.exam||"",s=i.type;{const c=document.getElementById("tmSubjectSel"),p=document.getElementById("tmSubjectFree");document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const m=document.getElementById("tmTestSummary");m&&(m.style.display="none"),o&&typeof SUBJECT_MAP<"u"&&SUBJECT_MAP[o]?(c.innerHTML=SUBJECT_MAP[o].map(E=>`<option value="${E}">${E}</option>`).join(""),c.style.display="",p.style.display="none"):(c.style.display="none",p.style.display="");const v=(s==="soru"||s==="konu")&&o;document.getElementById("soruBankasiWrap").style.display=v?"":"none";const w=document.getElementById("tmBookSearch");w&&(w.placeholder=s==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara...")}if((s==="soru"||s==="konu")&&o){const c=document.getElementById("tmSubjectSel");let p="",m=i.subject;if(i.subject.includes(" - ")){const _=i.subject.split(" - ");p=_[0].trim(),m=_.slice(1).join(" - ").trim()}p&&SUBJECT_MAP[o]&&SUBJECT_MAP[o].includes(p)&&(c.value=p),document.getElementById("tmBookVal").value=m,document.getElementById("tmBookSearch").value=m,M(!0),await un(),M(!1);const v=`${o}_${p}`;let E=(J[v]||[]).find(_=>_.name===m);if(E||Object.values(J).forEach(_=>{const b=_.find(h=>h.name===m);b&&(E=b)}),E){O=E,document.getElementById("tmTestWrap").style.display="",Mt();const _=(i.task_items||[]).map(h=>h.label||h);document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(h=>{var z;const $=parseInt(h.value),S=((z=O.testler[$])==null?void 0:z.label)||O.testler[$];_.includes(S)?h.checked=!0:h.checked=!1}),Ae()}}else{const c=document.getElementById("tmSubjectSel"),p=document.getElementById("tmSubjectFree");c.style.display!=="none"?c.value=i.subject:p.value=i.subject,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none"}Y("taskModal")}async function Zo(){const e=prompt("Şablon adı giriniz:");if(!e)return;const t=d.students.find(s=>s.id===d.activeStuId),n=(t==null?void 0:t.weekStart)??0,a=W(d.weekOffset,n),i=[];for(let s=0;s<7;s++){const r=q(a,s),l=H(r),c=`${d.activeStuId}_${l}`;(d.tasks[c]||[]).forEach(m=>{i.push({day_index:s,type:m.type,exam_type:m.exam||null,subject:m.subject,duration:m.duration,note:m.note||"",task_items:m.task_items||null})})}if(i.length===0)return x("Bu haftada kaydedilecek görev bulunmuyor!");M(!0);const{error:o}=await g.from("program_templates").insert({coach_id:y.coachId,name:e,description:`${i.length} görev içeriyor.`,tasks:i});if(M(!1),o)return x("Şablon kaydedilemedi: "+o.message);x("Hafta şablon olarak kaydedildi ✓")}async function Jo(){M(!0);const{data:e,error:t}=await g.from("program_templates").select("*").eq("coach_id",y.coachId);if(M(!1),t)return x("Şablonlar yüklenemedi.");if(!e||e.length===0)return x("Kayıtlı şablonunuz bulunmuyor. Önce haftayı şablon olarak kaydedin.");let n=document.getElementById("applyTemplateModal");n||(n=document.createElement("div"),n.id="applyTemplateModal",n.className="modal-bg",n.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('applyTemplateModal')">×</button>
      <h2>Şablon Uygula</h2>
      <div class="field"><label>Şablon Seçin</label>
        <select id="atmSelect"></select>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:12px" onclick="confirmApplyTemplate()">Uygula</button>
    </div>`,document.body.appendChild(n),n.addEventListener("click",a=>{a.target===n&&n.classList.remove("open")})),document.getElementById("atmSelect").innerHTML=e.map(a=>`<option value="${a.id}">${u(a.name)} (${a.tasks.length} Görev)</option>`).join(""),Y("applyTemplateModal")}async function Xo(){const e=document.getElementById("atmSelect").value;if(!e)return;M(!0);const{data:t,error:n}=await g.from("program_templates").select("*").eq("id",e).single();if(n||!t)return M(!1),x("Şablon yüklenemedi.");const a=d.students.find(s=>s.id===d.activeStuId),i=(a==null?void 0:a.weekStart)??0,o=W(d.weekOffset,i);for(const s of t.tasks){const r=H(q(o,s.day_index)),l={student_id:d.activeStuId,coach_id:y.coachId,date:r,type:s.type,exam_type:s.exam_type,subject:s.subject,duration:s.duration,note:s.note,done:!1,task_items:s.task_items},{data:c,error:p}=await g.from("tasks").insert(l).select().single();if(!p&&c){const m=`${d.activeStuId}_${r}`;d.tasks[m]||(d.tasks[m]=[]),d.tasks[m].push({_id:c.id,type:c.type,exam:c.exam_type,subject:c.subject,duration:c.duration,note:c.note,done:!1,student_note:"",task_items:c.task_items})}}M(!1),K("applyTemplateModal"),U(),x("Şablon başarıyla uygulandı ✓")}function Qo(e,t){var o;const a=`${d.activeStuId}_${e}`,i=(o=d.tasks[a])==null?void 0:o[t];i&&(_clipboardTask={type:i.type,exam:i.exam,subject:i.subject,duration:i.duration,note:i.note,task_items:i.task_items},x("Görev panoya kopyalandı ✓"),U())}async function es(e){if(!_clipboardTask)return;const t={student_id:d.activeStuId,coach_id:y.coachId,date:e,type:_clipboardTask.type,exam_type:_clipboardTask.exam||null,subject:_clipboardTask.subject,duration:_clipboardTask.duration,note:_clipboardTask.note,done:!1,task_items:_clipboardTask.task_items};M(!0);const{data:n,error:a}=await g.from("tasks").insert(t).select().single();if(M(!1),a)return x("Hata: "+a.message);const i=`${d.activeStuId}_${e}`;d.tasks[i]||(d.tasks[i]=[]),d.tasks[i].push({_id:n.id,type:n.type,exam:n.exam_type,subject:n.subject,duration:n.duration,note:n.note,done:!1,student_note:"",task_items:n.task_items}),U(),x("Görev yapıştırıldı ✓")}async function ts(e,t){var p;const n=`${d.activeStuId}_${e}`,a=(p=d.tasks[n])==null?void 0:p[t];if(!a)return;const i=d.students.find(m=>m.id===d.activeStuId),o=(i==null?void 0:i.weekStart)??0,s=W(d.weekOffset,o),r=[];for(let m=0;m<7;m++){const v=q(s,m),w=H(v);w!==e&&r.push({student_id:d.activeStuId,coach_id:y.coachId,date:w,type:a.type,exam_type:a.exam||null,subject:a.subject,duration:a.duration,note:a.note,done:!1,task_items:a.task_items})}if(r.length===0)return;M(!0);const{data:l,error:c}=await g.from("tasks").insert(r).select();if(M(!1),c)return x("Hata: "+c.message);(l||[]).forEach(m=>{const v=`${d.activeStuId}_${m.date}`;d.tasks[v]||(d.tasks[v]=[]),d.tasks[v].push({_id:m.id,type:m.type,exam:m.exam_type,subject:m.subject,duration:m.duration,note:m.note,done:!1,student_note:"",task_items:m.task_items})}),U(),x("Görev tüm haftaya kopyalandı ✓")}async function ns(){if(!_clipboardTask)return;const e=d.students.find(s=>s.id===d.activeStuId),t=(e==null?void 0:e.weekStart)??0,n=W(d.weekOffset,t),a=[];for(let s=0;s<7;s++){const r=q(n,s),l=H(r);a.push({student_id:d.activeStuId,coach_id:y.coachId,date:l,type:_clipboardTask.type,exam_type:_clipboardTask.exam||null,subject:_clipboardTask.subject,duration:_clipboardTask.duration,note:_clipboardTask.note,done:!1,task_items:_clipboardTask.task_items})}M(!0);const{data:i,error:o}=await g.from("tasks").insert(a).select();if(M(!1),o)return x("Hata: "+o.message);(i||[]).forEach(s=>{const r=`${d.activeStuId}_${s.date}`;d.tasks[r]||(d.tasks[r]=[]),d.tasks[r].push({_id:s.id,type:s.type,exam:s.exam_type,subject:s.subject,duration:s.duration,note:s.note,done:!1,student_note:"",task_items:s.task_items})}),_clipboardTask=null,U(),x("Görev tüm haftaya yapıştırıldı ✓")}Rn();jt();window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==currentTab){if(!e){e={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[y.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&X(e,!1)}});async function qt(){const e=document.getElementById("view-coach-applications");if(!e)return;e.innerHTML=`<div style="padding:24px;max-width:800px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Eşleşme Başvuruları</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">koc-bul sayfasından gelen öğrenci başvuruları</div>
    <div id="appsList" style="display:flex;flex-direction:column;gap:10px">
      <div style="text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;const{data:t,error:n}=await g.from("match_requests").select("*").eq("matched_coach_id",y.coachId).order("created_at",{ascending:!1}),a=document.getElementById("appsList");if(n||!t){a.innerHTML=`<div style="padding:20px;color:var(--red);background:var(--red-dim);border-radius:10px">Başvurular yüklenemedi: ${(n==null?void 0:n.message)||"Bilinmeyen hata"}</div>`;return}if(t.length===0){a.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-dim)">
      <div style="font-size:32px;margin-bottom:12px">📭</div>
      <div style="font-size:14px;font-weight:600">Henüz başvuru yok</div>
      <div style="font-size:12px;margin-top:4px">Koc-bul sayfasındaki profilinize öğrenci başvurduğunda burada görünecek.</div>
    </div>`;const l=document.querySelector("#sbi_coach-applications .sb-badge");l&&l.remove();return}const i={pending:"#f0a500",accepted:"#3ecf8e",rejected:"#ff5c7a"},o={pending:"Beklemede",accepted:"Kabul Edildi",rejected:"Reddedildi"};a.innerHTML=t.map(l=>`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px">
        <div>
          <div style="font-size:15px;font-weight:700">${u(l.student_name||"İsimsiz")}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(l.created_at).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
        </div>
        <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;background:${i[l.status]||"#888"}22;color:${i[l.status]||"#888"};white-space:nowrap">
          ${o[l.status]||l.status}
        </span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">E-posta</div>
          <a href="mailto:${u(l.email||"")}" style="font-size:13px;font-weight:600;color:var(--accent);text-decoration:none">${u(l.email||"—")}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Telefon</div>
          <a href="tel:${u(l.phone||"")}" style="font-size:13px;font-weight:600;color:var(--text);text-decoration:none">${u(l.phone||"—")}</a>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Sınav Grubu</div>
          <div style="font-size:13px;font-weight:600">${u(l.exam_profile||"—")}</div>
        </div>
        ${l.style?`<div style="background:var(--surface2);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Koçluk Tercihi</div>
          <div style="font-size:12px;color:var(--text-mid)">${u(l.style)}</div>
        </div>`:""}
      </div>
      ${l.status==="pending"?`
      <div style="display:flex;gap:8px">
        <button onclick="updateApplication('${l.id}','accepted')" style="flex:1;padding:9px;background:rgba(62,207,142,.12);color:#3ecf8e;border:1px solid rgba(62,207,142,.25);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✓ Kabul Et</button>
        <button onclick="updateApplication('${l.id}','rejected')" style="flex:1;padding:9px;background:rgba(255,92,122,.08);color:#ff5c7a;border:1px solid rgba(255,92,122,.2);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✗ Reddet</button>
      </div>`:""}
    </div>`).join("");const s=t.filter(l=>l.status==="pending").length,r=document.getElementById("sbi_coach-applications");if(r){const l=r.querySelector(".sb-badge");if(l&&l.remove(),s>0){const c=document.createElement("span");c.className="sb-badge",c.textContent=s,r.appendChild(c)}}}async function as(e,t){const{error:n}=await g.from("match_requests").update({status:t}).eq("id",e);if(n)return x("Hata: "+n.message);x(t==="accepted"?"✓ Başvuru kabul edildi":"Başvuru reddedildi"),qt()}let we=null;async function Wn(){var a;const e=document.getElementById("view-coach-notes");if(!e)return;e.innerHTML=`<div style="padding:24px;max-width:860px;margin:0 auto">
    <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">Notlarım</div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">Kişisel notlar — sadece sen görürsün</div>
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <button onclick="openNoteEditor(null)" style="padding:8px 18px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">+ Yeni Not</button>
    </div>
    <div id="coachNotesList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-dim)">Yükleniyor...</div>
    </div>
  </div>`;const t=`coach_notes_${y.coachId}`,{data:n}=await g.from("platform_settings").select("value").eq("key",t).maybeSingle();we=((a=n==null?void 0:n.value)==null?void 0:a.notes)||[],Ut()}function Ut(){const e=document.getElementById("coachNotesList");if(!e)return;const t=we;if(!t.length){e.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-dim)">
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
    </div>`).join("")}function is(e){const t=e!==null?we[e]||{}:{};let n=document.getElementById("coachNoteModal");n||(n=document.createElement("div"),n.id="coachNoteModal",n.className="modal-bg",document.body.appendChild(n)),n.innerHTML=`<div class="modal" style="max-width:520px">
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
  </div>`,n.style.display="flex"}async function os(e){const t=document.getElementById("noteEditorTitle").value.trim(),n=document.getElementById("noteEditorBody").value.trim();if(!t&&!n)return x("Not boş olamaz");const a={title:t||"Başlıksız",body:n,updated:new Date().toISOString()};e===null?we.unshift(a):we[e]=a,await Vn(),document.getElementById("coachNoteModal").style.display="none",Ut(),x("Not kaydedildi ✓")}async function ss(e){await Z("Bu notu silmek istiyor musun?")&&(we.splice(e,1),await Vn(),Ut(),x("Not silindi"))}async function Vn(){const e=`coach_notes_${y.coachId}`;await g.from("platform_settings").upsert({key:e,value:{notes:we}},{onConflict:"key"})}window.toggleSidebar=ga;window.setupShell=fa;window.switchTab=X;window.renderHome=sn;window.renderCoachApplications=qt;window.updateApplication=as;window.renderCoachNotes=Wn;window.openNoteEditor=is;window.toggleNewResourceMode=Ra;window.addManualTest=Ha;window.removeManualTest=Na;window.saveCoachNote=os;window.deleteCoachNote=ss;window.renderStudentsSearch=Oe;window.filterStudentSearch=xa;window.openStudentDetail=rn;window.openKonuHaritasi=ba;window.openStudentProgram=_t;window.openStudentExams=ha;window.openStudentAppointments=ka;window.renderProfile=ln;window.saveProfile=Sa;window.renderSettings=cn;window.saveGeminiKey=_a;window.renderProgram=U;window.selectStu=za;window.chWeek=Ba;window.goToday=Ma;window.openClearWeekModal=Aa;window.toggleDaySel=Da;window.toggleAllDays=Ca;window.confirmClearDays=La;window.openTaskModal=Ya;window.loadResources=un;window.updateSubjectList=Bt;window.updateBookList=Ka;window.renderBookList=it;window.filterBooks=Oa;window.selectBook=Fa;window.renderTestList=Mt;window.selectAllTests=qa;window.clearAllTests=Ua;window.updateTestSummary=Ae;window.selectModalSpeed=Ga;window.applyDuration=Wa;window.loadStudentSpeeds=vn;window.saveStudentSpeed=gn;window.saveTask=Va;window.toggleTask=Za;window.closeTaskMenu=At;window.showTaskMenu=Ja;window.copyTask=Xa;window.deleteTask=Qa;window.renderTodoList=xn;window.renderStudents=bn;window.goProgram=ci;window.openStudentModal=pi;window.saveStudent=mi;window.showInviteInfo=hn;window.copyInvite=ui;window.deleteStu=vi;window.renderAppointments=Fe;window.renderCalDays=ot;window.selCalDay=gi;window.chCalMonth=yi;window.renderApptList=Dt;window.openApptModal=fi;window.saveAppt=xi;window.deleteAppt=bi;window.renderExams=De;window.openCommentModal=$i;window.saveComment=Ti;window.deleteExam=Ei;window.renderMessages=In;window.selectThread=Ii;window.renderThreadHTML=ve;window.sendMsg=Si;window.scrollMsgs=ge;window.renderPortal=st;window.stuToggleTask=_i;window.renderSPortal=Ee;window.stuToggleTask2=zi;window.chWeekS=Bi;window.openTaskDetail=Ct;window.toggleTaskDetail=Mi;window.toggleDetailItem=Ai;window.selectVideoSpeed=Di;window.saveTaskDetail=Ci;window.renderSExams=Lt;window.openStudentExamModal=Sn;window.openExamModal=Li;window.renderNetInputs=jt;window.saveExam=Ri;window.renderSMessages=ht;window.initRealtime=Pt;window.destroyRealtime=Rt;window.renderDevDashboard=zn;window.renderDevUsers=rt;window.openDevUserModal=Hi;window.devDeleteUser=Ni;window.renderDevResources=qe;window.openPlaylistModal=Yi;window.fetchYouTubePlaylist=Ki;window.savePlaylist=Oi;window.openResourceModal=Fi;window.saveResource=qi;window.devDeleteResource=Ui;window.renderDevFinance=dt;window.openPaymentModal=Gi;window.savePayment=Wi;window.openSubModal=Vi;window.saveSub=Zi;window.renderDevAnnounce=Ue;window.openAnnounceModal=Ji;window.saveAnnounce=Xi;window.toggleAnnounce=Qi;window.devDeleteAnnounce=eo;window.renderDevTickets=Ce;window.updateTicketStatus=oo;window.devDeleteTicket=so;window.selectDevTicket=to;window.sendDevReply=io;window.openSupportTicket=ro;window.openSupportChat=lt;window.closeSupportChat=Bn;window.startAISupportChat=lo;window.startEminSupportChat=co;window.submitEminInitialMessage=po;window.sendSupportMessage=mo;window.openSupportChatDirect=lt;window.checkCoachSubscription=It;window.showTrialExpiredScreen=St;window.loadAnnouncements=Mn;window.saveStudentDev=No;window.showOnboarding=uo;window.renderOnboardingStep=Ht;window.advanceOnboarding=vo;window.renderSProfil=An;window.saveStudentProfile=go;window.changePassword=yo;window.renderCoachProfile=Dn;window.updateProfilePreview=Nt;window.switchPreviewTab=fo;window.nl2br=Cn;window.saveCoachProfile=xo;window.renderDevMatches=Yt;window.updateMatchRequestStatus=bo;window.openSpeedModal=ho;window.saveAllSpeeds=ko;window.openStudentNotes=wo;window.saveStudentNote=$o;window.openReportModal=To;window.getReportDates=Ln;window.buildReportHTML=Kt;window.previewReport=Eo;window.generatePDF=Io;window.openWeeklyPDFModal=_o;window.generateWeeklyPDF=zo;window.printWeeklyProgramWithNote=jn;window.generateMeetLink=Bo;window.generateZoomLink=Mo;window.copyToClipboard=Ao;window.loadTheme=Rn;window.applyAccent=Hn;window.setTheme=Do;window.openThemePanel=Co;window.initAIChatForRole=Nn;window.toggleAIChat=Lo;window.aiQuickSend=jo;window.buildAIContext=wt;window.addAIMessage=fe;window.sendAIMessage=Yn;window.autoDetectModel=Kn;window.callGeminiFallback=Me;window.generateAICopilotDraft=Po;window.checkCopilotDraftEdited=Ro;window.sendCopilotDraft=Ho;window.renderParentHome=On;window.renderParentProgress=Fn;window.renderParentAI=qn;window.applyResFilter=Ft;window.updateCRFilter=Yo;window.buildCRContent=pt;window.renderCoachResources=Ge;window.switchCRTab=Ko;window.compileResourceStats=Un;window.openResourceModalCoach=Oo;window.fetchYtPlaylistCoach=Fo;window.saveResourceCoach=qo;window.deleteResourceCoach=Uo;window.importResourcesFromExcel=Go;window.importStudentsFromExcel=Wo;window.getTestStatus=Gn;window.openCoachTaskEdit=Vo;window.saveWeekAsTemplate=Zo;window.applyTemplateToWeek=Jo;window.confirmApplyTemplate=Xo;window.copyTaskToClipboard=Qo;window.pasteTaskFromClipboard=es;window.copyTaskToWholeWeek=ts;window.pasteTaskToWholeWeek=ns;window.sendWhatsAppReport=So;window.toggleUserMenu=ya;window.closeUserMenu=on;window.renderAgenda=ce;window.openAgendaApptModal=di;window.deleteAgendaAppt=li;window.agendaPrev=ti;window.agendaNext=ni;window.agendaToday=ai;window.agendaSetFilter=ii;window.exportAgendaICS=oi;window.openApptPopup=si;window.handleApptDrop=ri;window.openStudentKaynaklar=wa;window.addStudentBook=$a;window.editStudentBook=Ta;window.sbUpdatePct=dn;window.saveStudentBook=Ea;window.deleteStudentBook=Ia;window.loadTheme&&window.loadTheme();window.renderNetInputs&&window.renderNetInputs();window.checkOAuthSession&&window.checkOAuthSession();const rs=new URLSearchParams(window.location.search);if(rs.get("sandbox")==="true")window.simOAuthLogin&&setTimeout(()=>{console.log("Sandbox auto-login triggered for demokoc..."),window.simOAuthLogin("demokoc")},300);else if(window.location.search.includes("sandbox")||window.location.hash==="#sandbox"){const e=document.getElementById("demoQuickWrap");e&&(e.style.display="flex"),window.showGoogleSimulator&&setTimeout(()=>window.showGoogleSimulator(),300)}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("Service Worker başarıyla kaydedildi ✓",e.scope)}).catch(e=>{console.warn("Service Worker kaydı başarısız oldu:",e)})});window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==window.currentTab){if(!e){e={coach:"home",student:"portal",developer:"home",parent:"parent-home"}[window.session.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&window.switchTab(e,!1)}});console.log("Rostrum Akademi App initialized successfully ✓");
