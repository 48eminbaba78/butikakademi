(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const l={students:[],tasks:{},appointments:[],exams:[],messages:{},coachTodos:{},weekOffset:0,calMonth:new Date().getMonth(),calYear:new Date().getFullYear(),calSelDay:null,activeStuId:null,msgThread:null,workspace:null,studentSpeeds:[]},y={role:null,studentId:null,dbUser:null,coachId:null,childName:null};window.S=l;window.session=y;window._loginMode="email";window.COACH_PASS="koc123";window.STU_DEFAULT_PASS="ogrenci123";window.DAYS_TR=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];window.MONTHS_TR=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];window.EXAM_DEFS={TYT:["Türkçe","Matematik","Fen","Sosyal"],"AYT-SAY":["Matematik","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Edebiyat","Tarih","Coğrafya"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.SUBJECT_MAP={TYT:["Türkçe","Matematik","Fizik","Kimya","Biyoloji","Tarih","Coğrafya","Felsefe","Din"],"AYT-SAY":["Matematik","Fizik","Kimya","Biyoloji"],"AYT-EA":["Matematik","Edebiyat","Tarih","Coğrafya","Felsefe"],"AYT-SOZ":["Edebiyat","Tarih1","Tarih2","Coğrafya1","Coğrafya2","Felsefe","Din"]};window.currentTab="";window._clipboardTask=null;window._editingTaskId=null;window._regRole=null;window._onbRole=null;window._oauthUser=null;const Gt="https://imyhenrwmsmyikpollur.supabase.co",Wt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteWhlbnJ3bXNteWlrcG9sbHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDE3ODYsImV4cCI6MjA5NTcxNzc4Nn0._ySJ5ArD1GYthyitHjdyEjLaUhextIwEqpRoF5ScI34",g=supabase.createClient(Gt,Wt);window.db=g;function Z(){var e;try{localStorage.setItem("ba_ui_"+(((e=y.dbUser)==null?void 0:e.id)||"x"),JSON.stringify({weekOffset:l.weekOffset,activeStuId:l.activeStuId,calMonth:l.calMonth,calYear:l.calYear}))}catch{}}function fe(){Z()}function S(e){let t=document.getElementById("loadingOverlay");if(e&&!t){if(t=document.createElement("div"),t.id="loadingOverlay",t.style.cssText="position:fixed;inset:0;background:rgba(15,14,12,.8);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)",t.innerHTML='<div style="width:36px;height:36px;border:3px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div><div style="font-size:13px;color:var(--text-mid)">Yükleniyor...</div>',!document.getElementById("spinStyle")){const n=document.createElement("style");n.id="spinStyle",n.textContent="@keyframes spin{to{transform:rotate(360deg)}}",document.head.appendChild(n)}document.body.appendChild(t)}else!e&&t&&t.remove()}function u(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function A(e){return e instanceof Date?e.toISOString().split("T")[0]:e}function N(e,t){const n=new Date(e);return n.setDate(n.getDate()+t),n}function ie(){return A(new Date)}function qe(e){return e>=20?"good":e>=12?"mid":"low"}function be(e){return{deneme:"📊 Deneme",soru:"📚 Soru",konu:"🎯 Konu",diger:"⭐ Diğer"}[e]||e}function C(e){document.getElementById(e).classList.add("open")}function L(e){document.getElementById(e).classList.remove("open")}function f(e){const t=document.getElementById("toast");t.textContent=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),2300)}document.addEventListener("click",e=>{e.target.classList.contains("modal-bg")&&e.target.classList.remove("open")});document.addEventListener("keydown",e=>{e.key==="Escape"&&document.querySelectorAll(".modal-bg.open").forEach(t=>t.classList.remove("open"))});function O(e,t=0){const n=new Date,i=n.getDay(),o=(i===0?6:i-1)-t,s=new Date(n);return s.setDate(n.getDate()-(o+7)%7+e*7),s.setHours(0,0,0,0),s}function Vt(){const e=l.students.find(t=>t.id===l.activeStuId);return(e==null?void 0:e.weekStart)??0}async function oe(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return[...new Uint8Array(t)].map(n=>n.toString(16).padStart(2,"0")).join("")}function ve(e){return e?e.trim().toLowerCase().replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u").replace(/i̇/g,"i").replace(/ı/g,"i").replace(/i/g,"i").replace(/\s+/g,"").replace(/\u0307/g,""):""}function Zt(){if(!("Notification"in window)){console.log("Bu tarayıcı anlık bildirimleri desteklemiyor.");return}Notification.permission!=="granted"&&Notification.permission!=="denied"?Notification.requestPermission().then(e=>{e==="granted"&&f("Bildirim izinleri onaylandı ✓")}):Notification.permission==="granted"?f("Bildirim izinleri zaten açık ✓"):f("Bildirim izinleri tarayıcı ayarlarından engellenmiş.")}window.saveUI=Z;window.saveS=fe;window.showLoading=S;window.esc=u;window.fmtDate=A;window.addDays=N;window.todayStr=ie;window.netColor=qe;window.typeLabel=be;window.om=C;window.cm=L;window.showToast=f;window.getWeekStart=O;window.getStudentWeekStart=Vt;window.sha256=oe;window.normalizeUsername=ve;window.requestNotificationPermission=Zt;async function Jt(e,t={}){let n=g.from(e).select("*");Object.entries(t).forEach(([o,s])=>{n=n.eq(o,s)});const{data:i,error:a}=await n;return a&&console.error(e,a),i||[]}async function ct(){var e;S(!0);try{const t=y.coachId;if(y.role==="coach"){const{data:m,error:p}=await g.from("workspaces").select("*").eq("coach_id",t).single();l.workspace=m||null,p&&p.code!=="PGRST116"&&console.warn("workspaces:",p.message)}let n=g.from("users").select("*").eq("role","student");y.role==="student"?n=n.eq("id",y.studentId):y.role==="coach"&&(n=n.eq("coach_id",t));const{data:i,error:a}=await n;a&&console.error("Students fetch error:",a),l.students=(i||[]).map(m=>({id:m.id,name:m.full_name||m.username||"Öğrenci",target:m.target||"",color:m.color||"#4da6ff",progress:m.progress||0,weekStart:m.week_start||0,username:m.username,coachId:m.coach_id}));let o=[];y.role==="student"?o=(await g.from("tasks").select("*").eq("student_id",y.studentId)).data||[]:y.role==="coach"?o=(await g.from("tasks").select("*").eq("coach_id",t)).data||[]:o=(await g.from("tasks").select("*")).data||[],l.tasks={},o.forEach(m=>{const p=`${m.student_id}_${m.date}`;l.tasks[p]||(l.tasks[p]=[]),l.tasks[p].push({_id:m.id,type:m.type,exam:m.exam_type,subject:m.subject,duration:m.duration,note:m.note,done:m.done,student_note:m.student_note||"",task_items:m.task_items})});let s=[];y.role==="student"?s=(await g.from("appointments").select("*").eq("student_id",y.studentId)).data||[]:y.role==="coach"?s=(await g.from("appointments").select("*").eq("coach_id",t)).data||[]:s=(await g.from("appointments").select("*")).data||[],l.appointments=s.map(m=>({id:m.id,studentId:m.student_id,date:m.date,time:m.time,duration:m.duration,type:m.type,note:m.note,meetLink:m.meet_link}));let d=[];y.role==="student"?d=(await g.from("exams").select("*").eq("student_id",y.studentId)).data||[]:y.role==="coach"?d=(await g.from("exams").select("*").eq("coach_id",t)).data||[]:d=(await g.from("exams").select("*")).data||[],l.exams=d.map(m=>({id:m.id,studentId:m.student_id,name:m.name,date:m.date,type:m.exam_type,nets:m.nets||{},note:m.student_note,coachComment:m.coach_comment}));let r=[];y.role==="student"?r=(await g.from("messages").select("*").eq("student_id",y.studentId)).data||[]:y.role==="coach"?r=(await g.from("messages").select("*").eq("coach_id",t)).data||[]:r=(await g.from("messages").select("*")).data||[],l.messages={},r.forEach(m=>{l.messages[m.student_id]||(l.messages[m.student_id]=[]),l.messages[m.student_id].push({_id:m.id,from:m.from_role,text:m.text,read:m.read,time:new Date(m.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})})}),Object.keys(l.messages).forEach(m=>l.messages[m].sort((p,b)=>p._id>b._id?1:-1));let c=y.role==="coach"?(await g.from("coach_todos").select("*").eq("coach_id",t)).data||[]:y.role==="developer"?(await g.from("coach_todos").select("*")).data||[]:[];l.coachTodos={},c.forEach(m=>{l.coachTodos[m.date]||(l.coachTodos[m.date]=[]),l.coachTodos[m.date].push({_id:m.id,task:m.task,note:m.note,done:m.done})});let v=[];y.role==="student"?v=(await g.from("student_speeds").select("*").eq("student_id",y.studentId)).data||[]:y.role==="coach"?v=(await g.from("student_speeds").select("*").eq("coach_id",t)).data||[]:v=(await g.from("student_speeds").select("*")).data||[],l.studentSpeeds=v;try{const m=JSON.parse(localStorage.getItem("ba_ui_"+((e=y.dbUser)==null?void 0:e.id))||"{}");m.weekOffset!==void 0&&(l.weekOffset=m.weekOffset),m.activeStuId&&(l.activeStuId=m.activeStuId),m.calMonth!==void 0&&(l.calMonth=m.calMonth,l.calYear=m.calYear)}catch{}}catch(t){console.error("loadAllData error",t)}S(!1)}window.dbQ=Jt;window.loadAllData=ct;function W(e){const t=document.getElementById("loginErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function ce(e){const t=document.getElementById("regErr");t.textContent=e,t.style.display="block",setTimeout(()=>t.style.display="none",5e3)}function mt(e){document.getElementById("loginPanel").style.display=e==="login"?"block":"none",document.getElementById("registerPanel").style.display=e==="register"?"block":"none",document.getElementById("lmtLogin").classList.toggle("active",e==="login"),document.getElementById("lmtRegister").classList.toggle("active",e==="register")}function Xt(e){window._loginMode=e,document.querySelectorAll("#loginTabs .login-tab").forEach((t,n)=>t.classList.toggle("active",n===(e==="email"?0:1))),document.getElementById("loginEmailField").style.display=e==="email"?"block":"none",document.getElementById("loginUserField").style.display=e==="username"?"block":"none"}function Qt(e){window._regRole=e,document.getElementById("rrbCoach").classList.toggle("sel",e==="coach"),document.getElementById("rrbStudent").classList.toggle("sel",e==="student")}function en(e){window._onbRole=e,document.getElementById("onbRoleCoach").classList.toggle("sel",e==="coach"),document.getElementById("onbRoleStudent").classList.toggle("sel",e==="student")}async function tn(){if(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.protocol==="file:"){ut();return}await pt()}async function pt(){Ue(),S(!0);try{const{error:e}=await g.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+"/app.html",queryParams:{access_type:"offline",prompt:"select_account"}}});e&&(S(!0),console.warn("Google Auth failed:",e),W("Google Girişi Başlatılamadı: "+e.message))}catch(e){S(!1),W("Google Girişi Başlatılamadı: "+e.message)}}function ut(){document.getElementById("googleSimulatorModal").style.display="flex"}function Ue(){document.getElementById("googleSimulatorModal").style.display="none"}async function nn(e){if(Ue(),S(!0),e==="demokoc"){const{data:t,error:n}=await g.from("users").select("*").eq("username","demokoc").maybeSingle();if(n||!t){S(!1),W("Demo koç profili bulunamadı!");return}await ae(t)}else if(e==="demoogrenci"){const{data:t,error:n}=await g.from("users").select("*").eq("username","demoogrenci").maybeSingle();if(n||!t){S(!1),W("Demo öğrenci profili bulunamadı!");return}await ae(t)}else if(e==="new"){S(!1),document.getElementById("newUserOnboarding").style.display="flex";const t=Math.floor(1e3+Math.random()*9e3),n=`yeni.kullanici${t}@gmail.com`;document.getElementById("onbEmail").textContent=n,document.getElementById("onbName").value=`Yeni Kullanıcı ${t}`,window._oauthUser={id:`mock-google-id-${t}`,email:n,user_metadata:{full_name:`Yeni Kullanıcı ${t}`}}}}async function an(){var e;try{const{data:{session:t}}=await g.auth.getSession();if(!(t!=null&&t.user))return;S(!0);const{data:n}=await g.from("users").select("*").eq("id",t.user.id).maybeSingle();n?await ae(n):(S(!1),document.getElementById("newUserOnboarding").style.display="flex",document.getElementById("onbEmail").textContent=t.user.email,document.getElementById("onbName").value=((e=t.user.user_metadata)==null?void 0:e.full_name)||"",window._oauthUser=t.user)}catch(t){S(!1),console.warn("[checkOAuthSession]",t)}}async function on(){const e=document.getElementById("onbName").value.trim();if(!e){document.getElementById("onbErr").textContent="Ad soyad zorunlu",document.getElementById("onbErr").style.display="block";return}if(!window._onbRole){document.getElementById("onbErr").textContent="Hesap türü seçin",document.getElementById("onbErr").style.display="block";return}document.getElementById("onbErr").style.display="none",S(!0);const t=window._oauthUser,n=e.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""),i={id:t.id,full_name:e,email:t.email,role:window._onbRole,username:n+"_"+Math.random().toString(36).slice(2,6),password_hash:"supabase_managed",color:window._onbRole==="coach"?"#f0a500":"#4da6ff",week_start:0,progress:0,target:""},{data:a,error:o}=await g.from("users").upsert(i).select().single();if(o){S(!1),document.getElementById("onbErr").textContent="Hata: "+o.message,document.getElementById("onbErr").style.display="block";return}document.getElementById("newUserOnboarding").style.display="none",await ae(a)}async function sn(){const e=document.getElementById("regName").value.trim(),t=document.getElementById("regEmail").value.trim().toLowerCase(),n=document.getElementById("regPass").value;if(!e||!t||!n)return ce("Tüm alanlar zorunlu");if(n.length<8)return ce("Şifre en az 8 karakter olmalıdır");if(!window._regRole)return ce("Hesap türü seçin");S(!0);try{const{data:i,error:a}=await g.auth.signUp({email:t,password:n,options:{data:{full_name:e,role:window._regRole}}});if(a)throw a;if(i!=null&&i.user){S(!1),document.getElementById("regName").value="",document.getElementById("regEmail").value="",document.getElementById("regPass").value="";const o=document.getElementById("regSuccess");o.textContent="Kayıt başarılı! E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğrulama yaptıktan sonra giriş yapın.",o.style.display="block",setTimeout(()=>o.style.display="none",1e4),mt("login")}}catch(i){S(!1),ce("Kayıt Hatası: "+i.message)}}async function ln(){const e=(document.getElementById("loginEmail").value||document.getElementById("loginUser").value||"").trim(),t=document.getElementById("loginPass").value;if(!e||!t)return W("Kullanıcı adı ve şifre zorunlu");S(!0);try{let n=e;n.includes("@")?n=n.toLowerCase():n=ve(e)+"@rostrumakademi.com";const{data:i,error:a}=await g.auth.signInWithPassword({email:n,password:t});if(!a&&(i!=null&&i.user)){const{data:r,error:c}=await g.from("users").select("*").eq("id",i.user.id).maybeSingle();if(c&&console.error("Profile fetch error:",c),r){await ae(r);return}return S(!1),W("Hesabınız veritabanında aktif değil.")}let o=null;const s=e.includes("@")?"email":"username",d=e.includes("@")?e.toLowerCase():ve(e);try{o=(await g.from("users").select("*").eq(s,d).maybeSingle()).data}catch(r){console.warn("Fallback DB lookup error:",r)}if(!o&&s==="email")try{const r=ve(e.split("@")[0]);o=(await g.from("users").select("*").eq("username",r).maybeSingle()).data}catch(r){console.warn("Fallback username lookup error:",r)}if(o){const r=await oe(t),c=o.password_hash===r,v=o.password_hash===t;if(c||v){if(v&&!c)try{await g.from("users").update({password_hash:r}).eq("id",o.id)}catch{}await ae(o);return}}return S(!1),W(a?"Giriş başarısız: "+a.message:"Kullanıcı adı veya şifre hatalı.")}catch(n){return S(!1),console.error("[doLogin]",n),W("Giriş hatası: "+n.message)}}async function ae(e){S(!1);const t=e.role==="coach"?e.id:e.role==="student"||e.role==="parent"?e.coach_id:null;y.role=e.role,y.studentId=e.role==="student"?e.id:null,y.dbUser=e,y.coachId=t,document.getElementById("loginScreen").style.display="none",document.getElementById("appShell").classList.add("visible");try{if(await ct(),y.role==="student"&&(l.activeStuId=e.id,y.studentId=e.id,l.students.find(o=>o.id===e.id)||l.students.push({id:e.id,name:e.full_name||e.username||"Öğrenci",target:e.target||"",color:e.color||"#4da6ff",progress:e.progress||0,weekStart:e.week_start||0,username:e.username,coachId:e.coach_id})),y.role==="parent"){const{data:o}=await g.from("users").select("*").eq("parent_id",e.id).single();o&&(l.activeStuId=o.id,y.studentId=o.id,y.childName=o.full_name||o.username)}if(window.setupShell(),document.getElementById("aiChatBubble").style.display="flex",y.role==="coach"&&l.workspace&&!l.workspace.onboarding_done){window.switchTab("home"),window.showOnboarding();return}const n=window.location.hash.substring(1),i={coach:"home",student:"portal",developer:"dev-dashboard",parent:"parent-home"}[y.role]||"portal",a=n&&document.getElementById("view-"+n)?n:i;setTimeout(()=>window.switchTab(a),50)}catch(n){console.error("[doLogin] HATA:",n),W("Hata: "+n.message),document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible")}}function dn(){window.destroyRealtime&&window.destroyRealtime(),g.auth.signOut().catch(()=>{}),y.role=null,y.studentId=null,y.dbUser=null,y.coachId=null,y.childName=null,l.workspace=null,document.getElementById("loginScreen").style.display="flex",document.getElementById("appShell").classList.remove("visible"),document.getElementById("aiChatBubble").style.display="none",document.getElementById("aiChatPanel").classList.remove("open"),document.getElementById("loginEmail")&&(document.getElementById("loginEmail").value=""),document.getElementById("loginUser")&&(document.getElementById("loginUser").value=""),document.getElementById("loginPass").value="",window.location.hash=""}function rn(){window.om("forgotPassModal")}async function cn(){const e=document.getElementById("forgotEmail").value.trim();if(!e)return;const t=document.getElementById("forgotMsg");try{const{error:n}=await g.auth.resetPasswordForEmail(e,{redirectTo:window.location.origin+"/app.html"});if(n)throw n;t.style.display="block",t.style.background="var(--green-dim)",t.style.color="var(--green)",t.textContent="Sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin."}catch(n){t.style.display="block",t.style.background="var(--red-dim)",t.style.color="var(--red)",t.textContent="Hata: "+(n.message||"Bir sorun oluştu.")}}window.loginErr=W;window.regErr=ce;window.setAuthMode=mt;window.setLoginMode=Xt;window.setRegRole=Qt;window.setOnbRole=en;window.loginWithGoogle=tn;window.triggerRealGoogleLogin=pt;window.showGoogleSimulator=ut;window.closeGoogleSimulator=Ue;window.simOAuthLogin=nn;window.checkOAuthSession=an;window.completeOnboarding=on;window.doRegister=sn;window.doLogin=ln;window.finishLogin=ae;window.doLogout=dn;window.showForgotPassword=rn;window.sendResetEmail=cn;const vt=[{id:"home",lbl:"🏠",name:"Ana Sayfa"},{id:"students",lbl:"👤",name:"Öğrencilerim"},{id:"coach-resources",lbl:"📚",name:"Kaynaklarım"},{id:"messages",lbl:"💬",name:"Mesajlar"},{id:"todolist",lbl:"✅",name:"To-Do"},{id:"coach-profile",lbl:"👤",name:"Profilim"}],yt=[{id:"portal",lbl:"🏠",name:"Ana Sayfa"},{id:"sportal",lbl:"📋",name:"Programım"},{id:"sexams",lbl:"📊",name:"Denemeler"},{id:"smessages",lbl:"💬",name:"Koçuma Yaz"},{id:"sprofil",lbl:"👤",name:"Profilim"}],gt=[{id:"dev-dashboard",lbl:"📊",name:"Dashboard"},{id:"dev-users",lbl:"👥",name:"Kullanıcılar"},{id:"dev-matches",lbl:"🤝",name:"Eşleşmeler"},{id:"dev-resources",lbl:"📚",name:"Kaynaklar"},{id:"dev-finance",lbl:"💰",name:"Finans"},{id:"dev-announce",lbl:"📣",name:"Duyurular"},{id:"dev-tickets",lbl:"🎫",name:"Destek"}],ft=[{id:"parent-home",lbl:"🏠",name:"Ana Sayfa"},{id:"parent-progress",lbl:"📊",name:"İlerleme"},{id:"parent-messages",lbl:"💬",name:"Koça Yaz"},{id:"parent-ai",lbl:"🤖",name:"AI Asistan"}];function mn(){document.getElementById("mainSidebar").classList.toggle("open")}function pn(){var r;const e=y.role==="coach"?vt:y.role==="developer"?gt:y.role==="parent"?ft:yt;document.getElementById("sidebarNav").innerHTML=e.map(c=>`
    <div class="sb-item" id="sbi_${c.id}" onclick="switchTab('${c.id}')">
      <span class="sb-icon">${c.lbl}</span>
      <span class="sb-label">${c.name}</span>
    </div>`).join(""),document.getElementById("mobileNav").innerHTML=e.slice(0,5).map(c=>`
    <button class="mnav-btn" id="mntab_${c.id}" onclick="switchTab('${c.id}')">${c.lbl}<span style="font-size:9px;display:block">${c.name}</span></button>`).join(""),document.getElementById("mainContent").innerHTML=[...e,{id:"student-detail"},{id:"profile"},{id:"settings"},{id:"coach-resources"},{id:"program"},{id:"appointments"},{id:"exams"}].map(c=>`<div class="view" id="view-${c.id}"></div>`).join("");const t=y.dbUser,n=y.role==="student"?l.students.find(c=>c.id===y.studentId):null,i=(t==null?void 0:t.full_name)||(n==null?void 0:n.name)||"",a=i.split(" ").map(c=>c[0]).join("").slice(0,2).toUpperCase(),o={coach:"#f0a500",student:(n==null?void 0:n.color)||"#4da6ff",developer:"#c084fc",parent:"#3ecf8e"},s={coach:"KOÇ",student:"ÖĞRENCİ",developer:"DEV",parent:"VELİ"};if(document.getElementById("sbAv").textContent=a,document.getElementById("sbAv").style.background=o[y.role]||"#888",document.getElementById("sbName").textContent=i,document.getElementById("sbRole").textContent=s[y.role]||y.role,y.role==="coach"&&((r=l.workspace)!=null&&r.brand_name)){const c=document.querySelector(".sb-logo-text");c&&(c.textContent=l.workspace.brand_name)}const d=document.getElementById("sb-site-admin");d&&(d.style.display=y.role==="developer"?"flex":"none"),Ht(),setTimeout(zt,600)}function G(e,t=!0){var d,r;if(!e)return;currentTab=e,t&&(window.location.hash=e),document.querySelectorAll(".sb-item").forEach(c=>c.classList.remove("active"));const n=document.getElementById("sbi_"+e)||document.getElementById("sb-"+e);n&&n.classList.add("active"),document.querySelectorAll(".view").forEach(c=>c.classList.remove("active"));const i=document.getElementById("view-"+e);i&&i.classList.add("active");const o=[...vt,...yt,...gt,...ft,{id:"profile",name:"Profil"},{id:"settings",name:"Ayarlar"},{id:"student-detail",name:((d=l.students.find(c=>c.id===l.activeStuId))==null?void 0:d.name)||"Öğrenci"},{id:"program",name:"Program"},{id:"appointments",name:"Randevular"},{id:"exams",name:"Denemeler"}].find(c=>c.id===e);document.getElementById("tbarTitle").textContent=(o==null?void 0:o.name)||e;const s={home:bt,students:xe,messages:St,todolist:he,portal:De,sportal:se,sexams:Qe,smessages:Ke,sprofil:Mt,profile:ht,settings:kt,"student-detail":()=>{l.activeStuId?xt(l.activeStuId):G("students")},program:()=>{l.activeStuId?Ge(l.activeStuId):G("students")},exams:()=>{l.activeStuId?de():G("students")},appointments:()=>{l.activeStuId?ke():G("students")},"dev-dashboard":Bt,"dev-users":Le,"dev-resources":we,"dev-finance":Ce,"dev-announce":$e,"dev-tickets":je,"parent-home":Kt,"parent-progress":Ot,"parent-messages":Ke,"parent-ai":Ft,"coach-profile":At,"dev-matches":ot,"coach-resources":Ee};try{(r=s[e])==null||r.call(s)}catch(c){console.error("[switchTab] Render error for tab:",e,c),i&&(i.innerHTML=`<div style="padding:24px;color:var(--text)"><b>Hata Oluştu ⚠️</b><p style="color:var(--text-mid);margin-top:6px">${c.message}</p></div>`)}e==="messages"||e==="smessages"?tt():nt()}function bt(){var t,n;const e=document.getElementById("view-home");if(!e){console.error("[renderHome] view-home yok");return}console.log("[renderHome] çağrıldı, students:",l.students.length);try{const i=new Date,a=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],o=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],s=A(i);let d=0;Object.values(l.messages).forEach(p=>{d+=p.filter(b=>b.from==="student"&&!b.read).length});const r=l.appointments.filter(p=>p.date===s).sort((p,b)=>p.time.localeCompare(b.time)),c=[],v=O(0,0);(l.students||[]).forEach(p=>{let b=0,h=0;for(let I=0;I<7;I++){const k=A(N(v,I)),M=l.tasks[`${p.id}_${k}`]||[];b+=M.length,h+=M.filter(_=>_.done).length}const x=b>0?Math.round(h/b*100):0;b>0&&x<30&&c.push({studentId:p.id,studentName:p.name,color:p.color,type:"tasks",icon:"📋",title:"Düşük Görev",desc:`Bu haftaki görev tamamlama oranı <b>%${x}</b>'de kaldı (${h}/${b} görev tamamlandı).`});const T=(l.exams||[]).filter(I=>I.studentId===p.id).sort((I,k)=>new Date(k.date).getTime()-new Date(I.date).getTime()),E={};T.forEach(I=>{E[I.type]||(E[I.type]=[]),E[I.type].push(I)}),Object.entries(E).forEach(([I,k])=>{if(k.length>=2){const M=k[0],_=k[1],P=Object.values(M.nets||{}).reduce((z,R)=>z+Number(R||0),0),$=Object.values(_.nets||{}).reduce((z,R)=>z+Number(R||0),0),B=P-$;B<-5&&c.push({studentId:p.id,studentName:p.name,color:p.color,type:"exams",icon:"📉",title:`Net Düşüşü (${I})`,desc:`Son denemede <b>${P} net</b> yaptı. Önceki denemesine (${$} net) göre <b>${Math.abs(B).toFixed(1)} net düşüş</b>.`})}}),(l.studentSpeeds||[]).filter(I=>I.student_id===p.id).forEach(I=>{let k=120;I.exam_type==="TYT"?["Türkçe","Sosyal"].includes(I.subject)?k=100:["Matematik","Fen"].includes(I.subject)&&(k=130):I.exam_type&&I.exam_type.startsWith("AYT")&&(k=180),I.secs_per_question>k&&c.push({studentId:p.id,studentName:p.name,color:p.color,type:"speed",icon:"⚡",title:`Hız Aşımı (${I.exam_type} - ${I.subject})`,desc:`Soru çözüm hızı <b>${I.secs_per_question} sn/soru</b> (Limit: ${k} sn).`})})});let m="";c.length===0?m=`
      <div style="text-align:center;padding:16px;color:var(--text-dim);font-size:13px">
        ✅ Harika! Şu an için kritik bir performans düşüşü veya uyarı bulunmuyor.
      </div>`:m=c.map(p=>`
      <div class="appt-row" style="cursor:pointer; padding: 10px 12px; margin-bottom: 8px; border-radius: 8px; background: var(--surface2); border: 1px solid var(--border); transition: all 0.15s" onclick="openStudentDetail('${p.studentId}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="font-size:20px; margin-right:12px; display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; background:var(--surface3)">${p.icon}</div>
        <div style="flex:1">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px">
            <span class="appt-nm" style="font-size:13px; font-weight:700">${u(p.studentName)}</span>
            <span style="font-size:10px; font-weight:bold; color:var(--red); background:var(--red-dim); padding:2px 6px; border-radius:4px">${p.title}</span>
          </div>
          <div style="font-size:12px; color:var(--text-mid); line-height:1.4">${p.desc}</div>
        </div>
      </div>
    `).join(""),e.innerHTML=`
    <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px">
      ${i.getHours()<12?"Günaydın":"İyi günler"}, ${((n=(t=y.dbUser)==null?void 0:t.full_name)==null?void 0:n.split(" ")[0])||"Koç"} 👋
    </div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:20px">${a[i.getDay()]}, ${i.getDate()} ${o[i.getMonth()]} ${i.getFullYear()}</div>

    <div class="home-stats">
      <div class="home-stat">
        <div class="home-stat-val">${l.students.length}</div>
        <div class="home-stat-lbl">Aktif Öğrenci</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-val" style="color:var(--blue)">${r.length}</div>
        <div class="home-stat-lbl">Bugün Randevu</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-val" style="color:${d>0?"var(--red)":"var(--green)"}">${d}</div>
        <div class="home-stat-lbl">Okunmamış Mesaj</div>
      </div>
    </div>

    <div class="appt-card" style="margin-bottom:16px; border-left: 4px solid var(--accent)">
      <div style="font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;display:flex;align-items:center;gap:6px">
        <span>⚠️</span> Erken Uyarılar (AI Analizi)
      </div>
      ${m}
    </div>

    <div class="appt-card">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Bugünün Randevuları</div>
      ${r.length===0?'<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px">Bugün randevu yok</div>':""}
      ${r.map(p=>{const b=l.students.find(h=>h.id===p.studentId);return`<div class="appt-row">
          <div class="appt-time-big">${p.time}</div>
          <div class="appt-vbar" style="background:${(b==null?void 0:b.color)||"var(--accent)"}"></div>
          <div style="flex:1">
            <div class="appt-nm">${u((b==null?void 0:b.name)||"?")} · ${u(p.type)}</div>
            <div class="appt-mt">${p.duration} dk${p.meet_link?` · <a href="${u(p.meet_link)}" target="_blank" style="color:var(--blue);text-decoration:none">${p.meet_link.includes("zoom")?"Zoom":"Meet"} linki →</a>`:""}</div>
          </div>
        </div>`}).join("")}
    </div>`}catch(i){console.error("[renderHome] HATA:",i),e.innerHTML=`<div style='padding:24px;color:var(--text)'><b>İyi günler 👋</b><p style='color:var(--text-mid);margin-top:6px'>Hata: ${i.message}</p></div>`}}function xe(){const e=document.getElementById("view-students"),t=O(0,0),n={};l.students.forEach(i=>{let a=0,o=0,s=0,d=0;for(let r=0;r<7;r++)(l.tasks[`${i.id}_${A(N(t,r))}`]||[]).forEach(v=>{a++,s+=Number(v.duration||0),v.done&&(o++,d+=Number(v.duration||0))});n[i.id]={total:a,done:o,totalMin:s,doneMin:d}}),e.innerHTML=`
    <div class="stu-search-wrap">
      <span style="font-size:15px;color:var(--text-dim)">🔍</span>
      <input type="text" placeholder="Öğrenci adını yazın..." id="stuSearchInput" oninput="filterStudentSearch()" autocomplete="off">
    </div>
    <div id="stuSearchResults">
      ${l.students.length===0?`
        <div class="stu-empty">
          <div style="font-size:36px;margin-bottom:10px">👤</div>
          <div style="font-size:13px">Henüz hiç öğrenciniz yok.</div>
        </div>
      `:l.students.map(i=>{const a=n[i.id]||{total:0,done:0,totalMin:0,doneMin:0},o=a.total===0?"var(--text-dim)":a.done===a.total?"var(--green)":a.done>0?"var(--accent)":"var(--text-mid)";return`<div class="stu-row" id="sturow_${i.id}" onclick="openStudentDetail('${i.id}')">
          <div class="stu-av" style="background:${i.color}">${i.name[0]}</div>
          <div class="stu-row-info">
            <div class="stu-row-name">${u(i.name)}</div>
            <div class="stu-row-meta">${u(i.target||"")}</div>
            <div class="stu-week-stats">
              <span class="stu-stat-pill" style="color:${o};border-color:${o}22">${a.done}/${a.total} görev</span>
              <span class="stu-stat-pill">${a.doneMin}/${a.totalMin} dk</span>
              ${a.total>0&&a.done===a.total?'<span class="stu-stat-pill" style="color:var(--green);border-color:var(--green-dim);background:var(--green-dim)">✓ Hafta tamam</span>':""}
            </div>
          </div>
          <span style="font-size:16px;color:var(--text-dim)">›</span>
        </div>`}).join("")}
    </div>
    <div id="stuSearchNoResults" class="stu-empty" style="display:none">
      <div style="font-size:36px;margin-bottom:10px">🔍</div>
      <div style="font-size:13px">Aradığınız kriterlere uygun öğrenci bulunamadı.</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px">
      <div style="display:flex; gap:8px">
        <button class="btn btn-accent" onclick="openStudentModal()">+ Yeni Öğrenci</button>
        <label class="btn btn-ghost" style="position:relative; cursor:pointer">
          📥 Excel'den Öğrenci Yükle
          <input type="file" accept=".xlsx,.xls,.csv" onchange="importStudentsFromExcel(event)" style="position:absolute; inset:0; opacity:0; cursor:pointer">
        </label>
      </div>
      <div style="font-size:11px; color:var(--text-mid); line-height:1.5; padding:8px 12px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; margin-top:4px">
        💡 <b>Excel Formatı:</b> Sütun başlıkları <b>Ad Soyad</b> (Zorunlu), <b>Hedef</b>, <b>Kullanıcı Adı</b> ve <b>Şifre</b> olmalıdır. Kullanıcı adı girilmezse otomatik üretilir, şifre girilmezse varsayılan olarak <code>ogrenci123</code> atanır.
      </div>
    </div>`}function un(){const e=document.getElementById("stuSearchInput").value.trim().toLowerCase(),t=document.getElementById("stuSearchNoResults");let n=0;l.students.forEach(i=>{const a=document.getElementById("sturow_"+i.id);if(a){const o=i.name.toLowerCase().includes(e);a.style.display=o?"flex":"none",o&&n++}}),t&&(t.style.display=e&&n===0?"block":"none")}function xt(e){if(!l.students.find(c=>c.id===e))return;l.activeStuId=e;const t=l.students.find(c=>c.id===l.activeStuId),n=O(0,t.weekStart||0);let i=0,a=0,o=0;for(let c=0;c<7;c++){const v=l.tasks[`${t.id}_${A(N(n,c))}`]||[];i+=v.length,a+=v.filter(m=>m.done).length,o+=v.reduce((m,p)=>m+Number(p.duration||0),0)}const s=i>0?Math.round(a/i*100):0,d=s>=80?"var(--green)":s>=50?"var(--accent)":"var(--red)",r=document.getElementById("view-student-detail");r.innerHTML=`
    <button class="back-link" onclick="switchTab('students')">← Öğrencilerim</button>

    <!-- Öğrenci başlık kartı -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:16px;display:flex;align-items:center;gap:14px;">
      <div style="width:48px;height:48px;border-radius:12px;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#0f0e0c;flex-shrink:0">${t.name[0]}</div>
      <div style="flex:1">
        <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;letter-spacing:-.3px">${u(t.name)}</div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${u(t.target||"")}</div>
        <div style="display:flex;gap:20px;margin-top:10px">
          <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--accent);line-height:1">${i}</div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.4px;margin-top:2px">Bu Hafta</div></div>
          <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--green);line-height:1">${a}</div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.4px;margin-top:2px">Tamamlanan</div></div>
          <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:${d};line-height:1">%${s}</div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.4px;margin-top:2px">Oran</div></div>
          <div><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--blue);line-height:1">${Math.round(o/60)}s</div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.4px;margin-top:2px">Çalışma</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm" onclick="switchTab('messages');setTimeout(()=>selectThread('${t.id}'),100)">💬 Mesaj</button>
        <button class="btn btn-ghost btn-sm" onclick="openStudentModal('${t.id}')">✏️ Düzenle</button>
      </div>
    </div>

    <!-- 2 kolon layout -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">

      <!-- Aksiyon kartları — sol -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="openStudentProgram('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">📋</div>
          <div style="font-size:12px;font-weight:700">Program</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">Görev ekle</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="openSpeedModal('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">⚡</div>
          <div style="font-size:12px;font-weight:700">Hız</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">sn/soru</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="openStudentExams('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">📊</div>
          <div style="font-size:12px;font-weight:700">Denemeler</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">Net takibi</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="openStudentAppointments('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">📅</div>
          <div style="font-size:12px;font-weight:700">Randevular</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">Meet/Zoom</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="openReportModal('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">📄</div>
          <div style="font-size:12px;font-weight:700">Rapor</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">PDF indir</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px;cursor:pointer;transition:all .15s;text-align:center" onclick="printWeeklyProgram('${t.id}')" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:20px;margin-bottom:6px">🖨️</div>
          <div style="font-size:12px;font-weight:700">Haftalık PDF</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">A4 yazdır</div>
        </div>
      </div>

      <!-- Haftalık özet — sağ -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Bu Haftanın Programı</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">
          ${Array.from({length:7},(c,v)=>{const m=N(n,v),p=A(m),b=l.tasks[`${t.id}_${p}`]||[],h=p===A(new Date),x=["PAZ","SAL","ÇAR","PER","CUM","CMT","PAZ"],T=b.filter(w=>w.done).length,E=b.length;return`<div style="background:var(--surface2);border-radius:8px;padding:8px 4px;text-align:center;border:1px solid ${h?"var(--accent)":"transparent"}">
              <div style="font-size:8px;color:var(--text-dim);text-transform:uppercase;font-weight:700;letter-spacing:.3px">${x[v]}</div>
              <div style="font-size:18px;font-weight:900;line-height:1.2;letter-spacing:-1px;color:${h?"var(--accent)":"var(--text)"}">${m.getDate()}</div>
              ${E>0?`<div style="font-size:9px;color:var(--text-dim);margin-top:2px">${T}/${E}</div>`:'<div style="width:5px;height:5px;border-radius:50%;background:var(--border2);margin:4px auto 0"></div>'}
            </div>`}).join("")}
        </div>

        <!-- İlerleme bar -->
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-mid);margin-bottom:6px">
            <span>Haftalık İlerleme</span>
            <span style="font-weight:700;color:${d}">%${s}</span>
          </div>
          <div style="height:6px;background:var(--surface3);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${s}%;background:${d};border-radius:99px;transition:width .5s ease"></div>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${a} / ${i} görev tamamlandı · ${Math.round(o/60)} saat</div>
        </div>
      </div>
    </div>
    
    <!-- AI COPILOT SECTION -->
    <div class="card" style="margin-top:16px; border: 1px dashed var(--accent); padding: 18px; border-radius: 14px; background: var(--surface)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px">
        <span style="font-size:24px">🤖</span>
        <div>
          <h3 style="margin:0; font-family:'Syne',sans-serif; font-size:16px; font-weight:800">Yapay Zeka Copilot</h3>
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
    </div>`,currentTab!=="student-detail"&&G("student-detail"),document.getElementById("tbarTitle").textContent=t.name}function Ge(e){var i,a;l.activeStuId=e;const t=document.getElementById("view-program"),n=((i=l.students.find(o=>o.id===l.activeStuId))==null?void 0:i.name)||"";t.innerHTML=`<button class="back-link" onclick="switchTab('student-detail')">← ${n}</button>`,t.innerHTML+=document.createElement("div").innerHTML,currentTab!=="program"&&G("program"),document.getElementById("tbarTitle").textContent=(((a=l.students.find(o=>o.id===l.activeStuId))==null?void 0:a.name)||"")+" · Program",Y()}function vn(e){var t;l.activeStuId=e,currentTab!=="exams"&&G("exams"),document.getElementById("tbarTitle").textContent=(((t=l.students.find(n=>n.id===l.activeStuId))==null?void 0:t.name)||"")+" · Denemeler",de()}function yn(e){var t;l.activeStuId=e,currentTab!=="appointments"&&G("appointments"),document.getElementById("tbarTitle").textContent=(((t=l.students.find(n=>n.id===l.activeStuId))==null?void 0:t.name)||"")+" · Randevular",ke()}function ht(){var n,i;const e=document.getElementById("view-profile"),t=y.dbUser;e.innerHTML=`
    <div class="profile-wrap">
      <div class="profile-header-card">
        <div class="profile-av-big">${((t==null?void 0:t.full_name)||"?").split(" ").map(a=>a[0]).join("").slice(0,2).toUpperCase()}</div>
        <div class="profile-big-name">${u((t==null?void 0:t.full_name)||"")}</div>
        <div class="profile-big-role">${y.role==="coach"?"KOÇ":y.role==="developer"?"DEVELOPER":"ÖĞRENCİ"} · ${u(((n=l.workspace)==null?void 0:n.brand_name)||"Rostrum Akademi")}</div>
      </div>
      <div class="profile-fields-card">
        <div class="field"><label>Ad Soyad</label><input id="pf_name" value="${u((t==null?void 0:t.full_name)||"")}"></div>
        <div class="field"><label>Kullanıcı Adı</label><input id="pf_user" value="${u((t==null?void 0:t.username)||"")}"></div>
        ${y.role==="coach"?`<div class="field"><label>Akademi Adı</label><input id="pf_brand" value="${u(((i=l.workspace)==null?void 0:i.brand_name)||"")}"></div>`:""}
        <div class="field"><label>Yeni Şifre (boş bırakılırsa değişmez)</label><input type="password" id="pf_pass" placeholder="Yeni şifre..."></div>
        <button class="p-save-btn" onclick="saveProfile()">Kaydet</button>
      </div>
    </div>`}async function gn(){var a,o;const e=document.getElementById("pf_name").value.trim(),t=document.getElementById("pf_pass").value,n=(o=(a=document.getElementById("pf_brand"))==null?void 0:a.value)==null?void 0:o.trim();if(!e)return f("Ad boş olamaz!");const i={full_name:e};t&&(i.password_hash=await oe(t)),await g.from("users").update(i).eq("id",y.dbUser.id),n&&y.role==="coach"&&(await g.from("workspaces").update({brand_name:n}).eq("coach_id",y.coachId),l.workspace={...l.workspace||{},brand_name:n},document.querySelector(".sb-logo-text").textContent=n),y.dbUser={...y.dbUser,full_name:e},document.getElementById("sbName").textContent=e,f("Profil kaydedildi ✓")}function kt(){var n;const e=document.getElementById("view-settings"),t=document.documentElement.getAttribute("data-theme")!=="light";e.innerHTML=`
    <div style="max-width:500px">
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
            ${jt.map(i=>`<div class="ac-dot" onclick="applyAccent('${i.val}','${i.dim}')" style="background:${i.val}" title="${i.name}"></div>`).join("")}
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
    </div>`}function fn(){const e=document.getElementById("geminiApiKeyInput").value.trim();e?(localStorage.setItem("gemini_api_key",e),f("API Anahtarı kaydedildi ✓")):(localStorage.removeItem("gemini_api_key"),f("API Anahtarı kaldırıldı."))}let ye="";function Y(){const e=document.getElementById("view-program"),t=l.students.find(d=>d.id===l.activeStuId),n=(t==null?void 0:t.weekStart)??0,i=O(l.weekOffset,n),a=N(i,6),o=ie();l.students.map(d=>`<option value="${d.id}" ${d.id===l.activeStuId?"selected":""}>${u(d.name)}</option>`).join("");let s="";for(let d=0;d<7;d++){const r=N(i,d),c=A(r),v=c===o,m=`${l.activeStuId}_${c}`,p=l.tasks[m]||[],b=p.reduce((w,I)=>w+Number(I.duration),0),h=p.reduce((w,I)=>w+(I.done?Number(I.duration):0),0),x=DAYS_TR[(n+d)%7],T=p.map((w,I)=>`
      <div class="task-card task-${w.type} ${w.done?"done":""}" onclick="openTaskDetail('${c}',${I},'coach')" style="cursor:pointer">
        <div class="tc-check ${w.done?"on":""}" onclick="event.stopPropagation();toggleTask('${c}',${I})"></div>
        <div class="tc-body">
          <div class="tc-type">${be(w.type)}${w.exam?" · "+w.exam:""}</div>
          <div class="tc-subject">${u(w.subject)}</div>
          <div class="tc-meta">${w.duration} dk</div>
        </div>
        <button class="tc-menu-btn" onclick="event.stopPropagation();showTaskMenu('${c}',${I},this)">⋯</button>
      </div>`).join(""),E=["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"][(n+d)%7];s+=`<div class="day-col ${v?"today":""}">
      <div class="day-hd">
        <div>
          <div class="day-name-lbl">${E}</div>
          <div class="day-num">${r.getDate()}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="day-badge">${h}/${b} dk</span>
          ${_clipboardTask?`<button class="btn btn-ghost btn-xs" onclick="pasteTaskFromClipboard('${c}')" style="font-size:9px;color:var(--accent);border-color:rgba(240,165,0,.3);background:var(--accent-dim);padding:2px 6px">Yapıştır</button>`:""}
        </div>
      </div>
      <div class="day-tasks-list">${T||""}</div>
      <button class="add-day-btn" onclick="openTaskModal('${c}','${x}')" ${l.activeStuId?"":"disabled"}>+ Görev Ekle</button>
    </div>`}e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${t?u(t.name):"Öğrenci"}</button>
    <div class="card prog-banner">
      <div class="prog-avatar" style="background:${(t==null?void 0:t.color)||"#555"};color:#0f0e0c">${t?t.name[0]:"?"}</div>
      <div class="prog-meta">
        <h2>${t?u(t.name):"Öğrenci Seçin"}</h2>
        <p>${t?u(t.target):"Program görüntülemek için öğrenci seçin"}</p>
      </div>
      <div class="prog-actions">
        <button class="btn btn-ghost btn-sm" onclick="saveWeekAsTemplate()">Şablon Kaydet</button>
        <button class="btn btn-ghost btn-sm" onclick="applyTemplateToWeek()">Şablon Uygula</button>
        <button class="btn btn-ghost btn-sm" onclick="openWeeklyPDFModal()">PDF</button>
        <button class="btn btn-danger btn-sm" onclick="openClearWeekModal()">Temizle</button>
      </div>
    </div>
    <div class="week-nav">
      <button class="btn btn-ghost btn-sm" onclick="chWeek(-1)">←</button>
      <span class="week-lbl">${i.getDate()} ${MONTHS_TR[i.getMonth()]} — ${a.getDate()} ${MONTHS_TR[a.getMonth()]} ${a.getFullYear()}</span>
      <button class="btn btn-ghost btn-sm" onclick="chWeek(1)">→</button>
      <button class="btn btn-ghost btn-sm" onclick="goToday()">Bugün</button>
    </div>
    <div class="week-grid">${s}</div>`}function bn(e){l.activeStuId=e||null,fe(),Y()}function xn(e){l.weekOffset+=e,fe(),Y()}function hn(){l.weekOffset=0,fe(),Y()}let U=[];function kn(){if(!l.activeStuId)return f("Önce öğrenci seçin");const e=l.students.find(a=>a.id===l.activeStuId),t=(e==null?void 0:e.weekStart)??0,n=O(l.weekOffset,t);U=[];let i="";for(let a=0;a<7;a++){const o=N(n,a),s=A(o),d=DAYS_TR[(t+a)%7],r=(l.tasks[`${l.activeStuId}_${s}`]||[]).length>0;i+=`<button class="day-sel-btn" id="dsbtn_${a}" data-ds="${s}" onclick="toggleDaySel(${a},'${s}')">
      <div>${d.slice(0,3)}</div>
      <div style="font-size:14px;font-weight:800">${o.getDate()}</div>
      ${r?'<div style="font-size:9px;color:var(--accent);margin-top:2px">●</div>':'<div style="font-size:9px;opacity:0">·</div>'}
    </button>`}document.getElementById("daySelectorGrid").innerHTML=i,C("clearWeekModal")}function wn(e,t){const n=document.getElementById("dsbtn_"+e),i=U.indexOf(t);i===-1?(U.push(t),n.classList.add("sel")):(U.splice(i,1),n.classList.remove("sel"))}function $n(){const e=document.querySelectorAll(".day-sel-btn");U.length===7?(U=[],e.forEach(t=>t.classList.remove("sel"))):(U=[],e.forEach((t,n)=>{U.push(t.dataset.ds),t.classList.add("sel")}))}async function En(){if(!U.length)return f("Önce gün seçin");if(confirm(`${U.length} günün görevleri silinsin mi?`)){for(const e of U)await g.from("tasks").delete().eq("student_id",l.activeStuId).eq("date",e),delete l.tasks[`${l.activeStuId}_${e}`];Z(),L("clearWeekModal"),Y(),f(`${U.length} gün temizlendi`)}}function Tn(e,t){if(!l.activeStuId)return f("Önce öğrenci seçin");ye=e,_editingTaskId=null,D=null,document.querySelector("#taskModal h2").innerHTML=`Görev Ekle — <span id="tmDay">${t}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Programa Ekle",document.getElementById("tmSubjectFree").value="",document.getElementById("tmDuration").value="60",document.getElementById("tmNote").value="",document.getElementById("tmExam").value="",document.getElementById("tmType").value="deneme",document.getElementById("tmSubjectSel").style.display="none",document.getElementById("tmSubjectFree").style.display="",document.getElementById("soruBankasiWrap").style.display="none",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookVal").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const n=document.getElementById("tmTestSummary");n&&(n.style.display="none"),$t(),C("taskModal")}let q={},J=!1;async function wt(){if(J)return;const{data:e}=await g.from("resources").select("*").eq("active",!0).order("name");e&&(e.forEach(t=>{const n=`${t.exam_type}_${t.subject}`;q[n]||(q[n]=[]),q[n].push({name:t.name,yil:t.year,testler:Array.isArray(t.tests)?t.tests:[],publisher:t.publisher})}),J=!0)}let me=[],D=null;function We(){const e=document.getElementById("tmExam").value,t=document.getElementById("tmType").value,n=document.getElementById("tmSubjectSel"),i=document.getElementById("tmSubjectFree");D=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").innerHTML="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const a=document.getElementById("tmTestSummary");a&&(a.style.display="none"),e&&SUBJECT_MAP[e]?(n.innerHTML=SUBJECT_MAP[e].map(d=>`<option value="${d}">${d}</option>`).join(""),n.style.display="",i.style.display="none"):(n.style.display="none",i.style.display="");const o=(t==="soru"||t==="konu")&&e;document.getElementById("soruBankasiWrap").style.display=o?"":"none";const s=document.getElementById("tmBookSearch");s&&(s.placeholder=t==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara..."),J=!1,q={},o&&Me("")}function In(){D=null,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const e=document.getElementById("tmType").value,t=document.getElementById("tmExam").value;J=!1,q={},(e==="soru"||e==="konu")&&t&&Me("")}document.getElementById("tmType").addEventListener("change",We);async function Me(e){const t=document.getElementById("tmExam").value,n=document.getElementById("tmSubjectSel").value||"",i=document.getElementById("tmType").value,a=document.getElementById("tmBookList"),o=i==="konu"?"playlist":"book";if(!J){a.style.display="block",a.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">⏳ Yükleniyor...</div>';const{data:c}=await g.from("resources").select("*").eq("active",!0).eq("resource_type",o).order("name");q={},c&&c.forEach(v=>{const m=`${v.exam_type}_${v.subject}`;q[m]||(q[m]=[]),q[m].push({name:v.name,yil:v.year,testler:Array.isArray(v.tests)?v.tests:[],publisher:v.publisher,resource_type:v.resource_type||"book"})}),J=!0}const s=`${t}_${n}`,d=q[s]||[],r=e.toLowerCase();if(me=d.filter(c=>{var v;return!r||c.name.toLowerCase().includes(r)||((v=c.publisher)==null?void 0:v.toLowerCase().includes(r))}),!e&&!me.length){a.style.display="none";return}if(!me.length){a.style.display="block",a.innerHTML='<div style="padding:12px;font-size:12px;color:var(--text-dim);text-align:center">Kaynak bulunamadı</div>';return}a.style.display="block",a.innerHTML=me.map((c,v)=>`
    <div onclick="selectBook(${v})" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;transition:background .15s"
      onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
      <div>
        <div style="font-size:13px;font-weight:700">${u(c.name)}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px">${u(c.publisher||"")} · ${c.testler.length} test</div>
      </div>
      <span style="font-size:10px;font-weight:700;background:var(--green-dim);color:var(--green);padding:2px 7px;border-radius:99px;margin-left:8px;flex-shrink:0">${c.yil}</span>
    </div>`).join("")}function Sn(){const e=document.getElementById("tmBookSearch").value;if(e.length===0){document.getElementById("tmBookList").style.display="none";return}Me(e)}function _n(e){D=me[e],document.getElementById("tmBookVal").value=D.name,document.getElementById("tmBookSearch").value=D.name,document.getElementById("tmBookList").style.display="none",Ve(),document.getElementById("tmTestWrap").style.display=""}function Ve(){if(!D)return;const e=document.getElementById("tmTestList"),t=D.resource_type==="playlist";e.innerHTML=D.testler.map((n,i)=>{const a=n.label||n,o=n.soru||0,s=n.url||"",d=n.topic||"",r=Ut(a),c=r==="done"?"ti-status-done":r==="pending"?"ti-status-pending":"",v=r==="done"?'<span class="ti-badge ti-badge-done">✓ Tamamlandı</span>':r==="pending"?'<span class="ti-badge ti-badge-pending">⏳ Atandı</span>':"";return t?`<label class="${c}" style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:background .1s"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;margin-top:3px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:12px;font-weight:600;line-height:1.4">${u(a)}</span>
            ${v}
          </div>
          ${d&&d!="nan"?`<div style="font-size:10px;color:var(--text-dim);margin-top:1px">${u(d)}</div>`:""}
        </div>
        ${s?`<a href="${u(s)}" target="_blank" onclick="event.stopPropagation()"
          style="font-size:10px;background:var(--red-dim);color:#ff6b6b;padding:2px 7px;border-radius:99px;text-decoration:none;flex-shrink:0;white-space:nowrap">▶ YT</a>`:""}
        ${o>0?`<span style="font-size:10px;color:var(--text-dim);background:var(--surface3);padding:2px 7px;border-radius:99px;flex-shrink:0">${o}dk</span>`:""}
      </label>`:`<label class="${c}" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;cursor:pointer;transition:background .1s"
        onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
        <input type="checkbox" id="test_${i}" value="${i}" onchange="updateTestSummary()"
          style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600">${u(a)}</span>
          ${v}
        </div>
        ${o>0?`<span style="font-size:10px;color:var(--text-dim);background:var(--surface3);padding:2px 7px;border-radius:99px;flex-shrink:0">${o} soru</span>`:""}
      </label>`}).join(""),le()}function Bn(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!0),le()}function zn(){document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(e=>e.checked=!1),le()}function le(){if(!D)return;const e=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")],t=document.getElementById("tmTestSummary"),n=document.getElementById("tmTestSummaryText"),i=document.getElementById("tmSuggestedDuration"),a=document.getElementById("tmSpeedRow"),o=D.resource_type==="playlist";if(e.length===0){t.style.display="none";return}let s=0,d=0;e.forEach(m=>{const p=parseInt(m.value),b=D.testler[p];o?d+=(b==null?void 0:b.soru)||0:s+=(b==null?void 0:b.soru)||0});const r=document.querySelector("[data-mspeed].speed-active"),c=r?parseFloat(r.dataset.mspeed):1;let v=0;if(o)v=d>0?Math.ceil(d/c):0,n.textContent=`${e.length} video · ${d} dk`,a&&(a.style.display="");else{const m=document.getElementById("tmExam").value,p=document.getElementById("tmSubjectSel").value||"",b=`${l.activeStuId}_${m}_${p}`,h=Be[b]||180;v=s>0?Math.ceil(s*h/60):0,n.textContent=`${e.length} test · ${s} soru${v>0?" · Önerilen: "+v+" dk":""}`,a&&(a.style.display="none")}i.style.display=v>0?"":"none",Te=v,i.setAttribute("data-dur",v),t.style.display="",v>0&&(document.getElementById("tmDuration").value=v)}function Mn(e){document.querySelectorAll("[data-mspeed]").forEach(t=>{const n=t.dataset.mspeed===e;t.classList.toggle("speed-active",n),t.style.borderColor=n?"var(--accent)":"var(--border)",t.style.background=n?"var(--accent-dim)":"var(--surface2)",t.style.color=n?"var(--accent)":"var(--text-mid)"}),le()}let Te=0;function An(){Te>0&&(document.getElementById("tmDuration").value=Te,f("Süre uygulandı: "+Te+" dk"))}let Be={};async function $t(){if(!l.activeStuId)return;const{data:e}=await g.from("student_speeds").select("*").eq("student_id",l.activeStuId);Be={},(e||[]).forEach(t=>{const n=`${t.student_id}_${t.exam_type}_${t.subject}`;Be[n]=t.secs_per_question})}async function Et(e,t,n,i){const{data:a}=await g.from("student_speeds").select("id").eq("student_id",e).eq("exam_type",t).eq("subject",n).single();a?await g.from("student_speeds").update({secs_per_question:i,updated_at:new Date().toISOString()}).eq("id",a.id):await g.from("student_speeds").insert({student_id:e,coach_id:y.coachId,exam_type:t,subject:n,secs_per_question:i}),Be[`${e}_${t}_${n}`]=i,f("Hız kaydedildi ✓")}document.getElementById("tmType").addEventListener("change",We);async function Dn(){const e=document.getElementById("tmType").value,t=document.getElementById("tmSubjectSel"),n=document.getElementById("tmSubjectFree"),i=document.getElementById("tmBookVal").value,a=document.getElementById("tmExam").value,o=parseInt(document.getElementById("tmDuration").value)||60,s=(D==null?void 0:D.resource_type)==="playlist";let d="";if((e==="soru"||e==="konu")&&i){const b=t.style.display!=="none"?t.value:"";d=b?`${b} - ${i}`:`${i}`}else d=(t.style.display!=="none"?t.value:n.value).trim();if(!d)return f("Ders adı girin!");const r=[...document.querySelectorAll("#tmTestList input[type=checkbox]:checked")];let v=document.getElementById("tmNote").value.trim(),m=[];if(r.length>0&&D){const b=r.map(h=>{const x=D.testler[parseInt(h.value)];return(x==null?void 0:x.label)||x||""});m=r.map(h=>{const x=D.testler[parseInt(h.value)];return{label:(x==null?void 0:x.label)||x||"",url:(x==null?void 0:x.url)||"",soru:(x==null?void 0:x.soru)||0}}),s?v=`${b.length} video: ${b.slice(0,3).join(", ")}${b.length>3?` +${b.length-3} daha`:""}`:v=`${b.length} test: ${b.slice(0,3).join(", ")}${b.length>3?` +${b.length-3} daha`:""}`}const p={student_id:l.activeStuId,coach_id:y.coachId,date:ye,type:e,exam_type:a,subject:d,duration:o,note:v,done:!1,task_items:m.length>0?m:null};if(_editingTaskId){S(!0);const{error:b}=await g.from("tasks").update({type:p.type,exam_type:p.exam_type,subject:p.subject,duration:p.duration,note:p.note,task_items:p.task_items}).eq("id",_editingTaskId);if(S(!1),b)return f("Hata: "+b.message);const h=`${l.activeStuId}_${ye}`;if(l.tasks[h]){const x=l.tasks[h].findIndex(T=>T._id===_editingTaskId);x!==-1&&(l.tasks[h][x]={_id:_editingTaskId,type:p.type,exam:p.exam_type,subject:p.subject,duration:p.duration,note:p.note,done:l.tasks[h][x].done,student_note:l.tasks[h][x].student_note||"",task_items:p.task_items})}L("taskModal"),Y(),f("Görev güncellendi ✓"),_editingTaskId=null}else{const{data:b,error:h}=await g.from("tasks").insert(p).select().single();if(h)return f("Hata: "+h.message);const x=`${l.activeStuId}_${ye}`;l.tasks[x]||(l.tasks[x]=[]),l.tasks[x].push({_id:b.id,type:b.type,exam:b.exam_type,subject:b.subject,duration:b.duration,note:b.note,done:!1,student_note:"",task_items:b.task_items||null}),L("taskModal"),Y(),f("Görev eklendi ✓")}}async function Ln(e,t){var o;const n=`${l.activeStuId}_${e}`,i=(o=l.tasks[n])==null?void 0:o[t];if(!i)return;const a=!i.done;await g.from("tasks").update({done:a}).eq("id",i._id),i.done=a,Y()}let Ie=null;function Ze(){Ie&&(Ie.remove(),Ie=null)}document.addEventListener("click",Ze);function Cn(e,t,n){Ze();const i=n.getBoundingClientRect(),a=document.createElement("div");a.className="tc-dropdown",a.innerHTML=`
    <button onclick="closeTaskMenu();openCoachTaskEdit('${e}',${t})">✏️ Düzenle</button>
    <button onclick="closeTaskMenu();copyTaskToClipboard('${e}',${t})">📋 Kopyala</button>
    <button class="danger" onclick="closeTaskMenu();deleteTask('${e}',${t})">🗑 Kaldır</button>`;const o=i.bottom+4,s=Math.min(i.left,window.innerWidth-155);a.style.cssText=`top:${o}px;left:${s}px;`,document.body.appendChild(a),Ie=a,setTimeout(()=>a.addEventListener("click",d=>d.stopPropagation()),0)}async function jn(e,t){var s;const n=`${l.activeStuId}_${e}`,i=(s=l.tasks[n])==null?void 0:s[t];if(!i)return;const{data:a,error:o}=await g.from("tasks").insert({student_id:l.activeStuId,coach_id:y.coachId,date:e,type:i.type,exam_type:i.exam||null,subject:i.subject,duration:i.duration,note:i.note||null,done:!1,task_items:i.task_items||null}).select().single();if(o)return f("Kopyalama başarısız");l.tasks[n]||(l.tasks[n]=[]),l.tasks[n].push({_id:a.id,type:a.type,exam:a.exam_type,subject:a.subject,duration:a.duration,note:a.note,done:!1,student_note:"",task_items:a.task_items||null}),Y(),f("Görev kopyalandı")}async function Pn(e,t){var a;const n=`${l.activeStuId}_${e}`,i=(a=l.tasks[n])==null?void 0:a[t];i&&(await g.from("tasks").delete().eq("id",i._id),l.tasks[n].splice(t,1),Y(),f("Görev silindi"))}let pe="";function he(){const e=document.getElementById("view-todolist"),t=new Date;t.setHours(0,0,0,0);const n=[{label:"Dün",offset:-1},{label:"Bugün",offset:0},{label:"Yarın",offset:1}];let i='<div class="sh"><h2>Koç To-Do Listesi</h2></div><div class="coach-todo-strip">';n.forEach(({label:s,offset:d})=>{const r=new Date(t);r.setDate(t.getDate()+d);const c=A(r),v=d===0,p=(l.coachTodos[c]||[]).map((b,h)=>`
      <div class="ctd-task-item ${b.done?"done":""}">
        <div class="ctd-check ${b.done?"on":""}" onclick="toggleCtd('${c}',${h})"></div>
        <div style="flex:1">
          <div class="ctd-subj">${u(b.task)}</div>
          ${b.note?`<div class="ctd-meta">${u(b.note)}</div>`:""}
        </div>
        <button class="ctd-del" onclick="deleteCtd('${c}',${h})">✕</button>
      </div>`).join("");r.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"}),i+=`<div class="ctd-col ${v?"today-col":""}">
      <div class="ctd-day-label">${s}</div>
      <div class="ctd-date" style="font-size:${v?28:20}px">${r.getDate()} ${MONTHS_TR[r.getMonth()]}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px">${r.toLocaleDateString("tr-TR",{weekday:"long"})}</div>
      ${p||`<div class="ctd-empty">${d===-1?"Dün tamamlandı 🎉":"Henüz görev yok"}</div>`}
      ${d>=0?`<button class="ctd-add" onclick="openCoachTodoModal('${c}','${s}')">+ Görev Ekle</button>`:""}
    </div>`}),i+="</div>";const a=l.coachTodos[A(t)]||[],o=a.filter(s=>s.done).length;i+=`<div class="stats-row" style="margin-top:20px">
    <div class="stat-card"><div class="stat-label">Bugün Toplam</div><div class="stat-val">${a.length}</div></div>
    <div class="stat-card"><div class="stat-label">Tamamlanan</div><div class="stat-val" style="color:var(--green)">${o}</div></div>
    <div class="stat-card"><div class="stat-label">Kalan</div><div class="stat-val" style="color:var(--accent)">${a.length-o}</div></div>
  </div>`,e.innerHTML=i}function Rn(e,t){pe=e,document.getElementById("ctdDay").textContent=t,document.getElementById("ctdTask").value="",document.getElementById("ctdNote").value="",C("coachTodoModal")}async function Hn(){const e=document.getElementById("ctdTask").value.trim();if(!e)return f("Görev adı girin!");const t={date:pe,coach_id:y.coachId,task:e,note:document.getElementById("ctdNote").value.trim(),done:!1},{data:n,error:i}=await g.from("coach_todos").insert(t).select().single();if(i)return f("Hata: "+i.message);l.coachTodos[pe]||(l.coachTodos[pe]=[]),l.coachTodos[pe].push({_id:n.id,task:n.task,note:n.note,done:!1}),L("coachTodoModal"),he(),f("Görev eklendi ✓")}async function Nn(e,t){var a;const n=(a=l.coachTodos[e])==null?void 0:a[t];if(!n)return;const i=!n.done;await g.from("coach_todos").update({done:i}).eq("id",n._id),n.done=i,he()}async function Yn(e,t){var i;const n=(i=l.coachTodos[e])==null?void 0:i[t];n&&(await g.from("coach_todos").delete().eq("id",n._id),l.coachTodos[e].splice(t,1),he(),f("Silindi"))}function Tt(){xe()}function Kn(e){l.activeStuId=e,l.weekOffset=0,Z(),Ge(e)}function On(e){const t=e?l.students.find(i=>i.id===e):null;document.getElementById("smTitle").textContent=t?"Öğrenciyi Düzenle":"Yeni Öğrenci",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.pass)||STU_DEFAULT_PASS,document.getElementById("smWeekStart").value=(t==null?void 0:t.weekStart)??0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(i=>i.classList.toggle("sel",i.dataset.c===((t==null?void 0:t.color)||"#f0a500")));const n=document.getElementById("smRoleField");n&&(n.style.display="none"),document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudent()"),C("studentModal")}document.getElementById("smProg").addEventListener("input",function(){document.getElementById("smProgVal").textContent=this.value+"%"});document.getElementById("smColorPick").addEventListener("click",function(e){const t=e.target.closest(".color-opt");t&&(document.querySelectorAll(".color-opt").forEach(n=>n.classList.remove("sel")),t.classList.add("sel"))});async function Fn(){var d;const e=document.getElementById("smName").value.trim();if(!e)return f("İsim girin!");const t=((d=document.querySelector(".color-opt.sel"))==null?void 0:d.dataset.c)||"#f0a500",n=document.getElementById("smId").value,i=document.getElementById("smUsername").value.trim().toLowerCase()||e.split(" ")[0].toLowerCase()+Math.floor(Math.random()*100),a=document.getElementById("smPass").value||STU_DEFAULT_PASS,o=await oe(a),s={full_name:e,target:document.getElementById("smTarget").value.trim()||"Hedef belirtilmemiş",color:t,progress:Number(document.getElementById("smProg").value),password_hash:o,week_start:Number(document.getElementById("smWeekStart").value),username:i,role:"student",coach_id:y.coachId};if(n){const{error:r}=await g.from("users").update(s).eq("id",n);if(r)return f("Hata: "+r.message);const c=l.students.find(v=>v.id===n);c&&Object.assign(c,{name:s.full_name,target:s.target,color:t,progress:s.progress,pass:s.password_hash,weekStart:s.week_start,username:i}),f("Güncellendi ✓"),Z(),L("studentModal"),xe()}else{const r=i+"@rostrumakademi.com",{data:c,error:v}=await g.rpc("create_new_user",{p_email:r,p_password:a,p_full_name:s.full_name,p_username:i,p_role:"student",p_target:s.target,p_color:s.color,p_progress:s.progress,p_week_start:s.week_start,p_coach_id:s.coach_id,p_institution_id:null,p_exam_profile:"YKS"});if(v)return f("Hata: "+v.message);l.students.push({id:c,name:s.full_name,target:s.target,color:s.color,progress:s.progress||0,pass:s.password_hash,weekStart:s.week_start||0,username:i}),l.activeStuId||(l.activeStuId=c),Z(),L("studentModal"),It(s.full_name,i,a)}}function It(e,t,n){let i=document.getElementById("inviteModal");i||(i=document.createElement("div"),i.id="inviteModal",i.className="modal-bg",document.body.appendChild(i),i.addEventListener("click",d=>{d.target===i&&i.classList.remove("open")}));const o=`${window.location.origin+window.location.pathname.replace("app.html","")}app.html`,s=encodeURIComponent(`Merhaba ${e}! 🎓

Seni Rostrum Akademi platformuna ekledim.

📱 Giriş adresi: ${o}
👤 Kullanıcı adı: ${t}
🔑 Şifre: ${n}

Giriş yaptıktan sonra programını görebileceksin!`);i.innerHTML=`<div class="modal" style="max-width:480px">
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
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${u(t)}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Şifre</div>
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:var(--accent)">${u(n)}</div>
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
  </div>`,C("inviteModal")}function qn(e,t,n){const i=`Giriş adresi: ${n}
Kullanıcı adı: ${e}
Şifre: ${t}`;navigator.clipboard.writeText(i).then(()=>f("Kopyalandı ✓")).catch(()=>{const a=document.createElement("textarea");a.value=i,document.body.appendChild(a),a.select(),document.execCommand("copy"),a.remove(),f("Kopyalandı ✓")})}async function Un(e){var n;if(!confirm("Bu öğrenciyi silmek istediğinizden emin misiniz?"))return;const{error:t}=await g.from("users").delete().eq("id",e);if(t)return f("Hata: "+t.message);l.students=l.students.filter(i=>i.id!==e),l.activeStuId===e&&(l.activeStuId=((n=l.students[0])==null?void 0:n.id)||null),Z(),Tt(),f("Silindi")}function ke(){var t;const e=document.getElementById("view-appointments");e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${((t=l.students.find(n=>n.id===l.activeStuId))==null?void 0:t.name)||"Öğrenci"}</button>
    <div class="sh"><h2>Randevular</h2><button class="btn btn-accent" onclick="openApptModal()">+ Yeni Randevu</button></div>
    <div class="appts-layout">
      <div class="card cp">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <span style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700" id="calMonthLbl"></span>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(-1)">‹</button>
            <button class="btn btn-ghost btn-sm" onclick="chCalMonth(1)">›</button>
          </div>
        </div>
        <div class="cal-dow-row">${DAYS_TR.map(n=>`<div class="cal-dow">${n.slice(0,3)}</div>`).join("")}</div>
        <div class="cal-days-grid" id="calDaysGrid"></div>
      </div>
      <div>
        <div class="card cp">
          <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)" id="apptListTitle">Yaklaşan Görüşmeler</div>
          <div id="apptList"></div>
          <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="S.calSelDay=null;renderCalDays();renderApptList()">Tümünü Göster</button>
        </div>
      </div>
    </div>`,Ae(),Je()}function Ae(){const e=l.calYear,t=l.calMonth;document.getElementById("calMonthLbl").textContent=`${MONTHS_TR[t]} ${e}`;const n=new Date(e,t,1).getDay(),i=new Date(e,t+1,0).getDate(),a=ie(),o=new Set(l.appointments.filter(r=>{const c=new Date(r.date);return c.getFullYear()===e&&c.getMonth()===t}).map(r=>new Date(r.date).getDate())),s=n===0?6:n-1;let d="";for(let r=0;r<s;r++)d+='<div class="cal-day empty"></div>';for(let r=1;r<=i;r++){const c=`${e}-${String(t+1).padStart(2,"0")}-${String(r).padStart(2,"0")}`;d+=`<div class="cal-day ${c===a?"today":""} ${c===l.calSelDay&&c!==a?"selected":""} ${o.has(r)?"has-appt":""}" onclick="selCalDay('${c}')">${r}</div>`}document.getElementById("calDaysGrid").innerHTML=d}function Gn(e){l.calSelDay=l.calSelDay===e?null:e,Ae(),Je()}function Wn(e){l.calMonth+=e,l.calMonth>11&&(l.calMonth=0,l.calYear++),l.calMonth<0&&(l.calMonth=11,l.calYear--),fe(),Ae()}function Je(){const e=ie();let t=l.appointments,n="Yaklaşan Görüşmeler";if(l.calSelDay?(t=t.filter(i=>i.date===l.calSelDay),n=new Date(l.calSelDay+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long"})):t=t.filter(i=>i.date>=e).sort((i,a)=>i.date.localeCompare(a.date)).slice(0,10),document.getElementById("apptListTitle").textContent=n,!t.length){document.getElementById("apptList").innerHTML='<div class="empty"><p>Randevu yok</p></div>';return}document.getElementById("apptList").innerHTML=t.map(i=>{const a=l.students.find(d=>d.id===i.studentId),s=i.date===e?"BUGÜN":new Date(i.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"});return`<div class="appt-item" style="border-left-color:${(a==null?void 0:a.color)||"#555"}">
      <div class="appt-when">${s} • ${i.time} (${i.duration} dk)</div>
      <div class="appt-name">${u((a==null?void 0:a.name)||"?")}</div>
      <div class="appt-type">${u(i.type)}</div>
      ${i.note?`<div class="appt-note">${u(i.note)}</div>`:""}
      ${i.meet_link?`<div style="margin-top:6px;display:flex;gap:6px;align-items:center">
        <a href="${u(i.meet_link)}" target="_blank" style="font-size:11px;background:var(--blue-dim);color:var(--blue);padding:3px 10px;border-radius:99px;text-decoration:none;font-weight:700">${i.meet_link.includes("zoom")?"🎥 Zoom":"📹 Meet"}</a>
        <button class="btn btn-ghost btn-xs" onclick="copyToClipboard('${u(i.meet_link)}')">Kopyala</button>
      </div>`:""}
      <div class="appt-actions">
        <button class="btn btn-ghost btn-xs" onclick="openApptModal('${i.id}')">✏️</button>
        <button class="btn btn-danger btn-xs" onclick="deleteAppt('${i.id}')">🗑</button>
      </div>
    </div>`}).join("")}function Vn(e){const t=e?l.appointments.find(n=>n.id===e):null;document.getElementById("amTitle").textContent=t?"Randevuyu Düzenle":"Yeni Randevu",document.getElementById("amId").value=e||"",document.getElementById("amStudent").innerHTML=l.students.map(n=>`<option value="${n.id}" ${(t==null?void 0:t.studentId)===n.id?"selected":""}>${u(n.name)}</option>`).join(""),document.getElementById("amDate").value=t?t.date:A(new Date),document.getElementById("amTime").value=t?t.time:"14:00",document.getElementById("amDuration").value=t?t.duration:"45",document.getElementById("amType").value=t?t.type:"Haftalık Değerlendirme",document.getElementById("amNote").value=(t==null?void 0:t.note)||"",document.getElementById("amMeetLink").value=(t==null?void 0:t.meet_link)||"",C("apptModal")}async function Zn(){const e=document.getElementById("amStudent").value,t=document.getElementById("amDate").value,n=document.getElementById("amTime").value;if(!e||!t||!n)return f("Tüm alanları doldurun!");const i=document.getElementById("amId").value,a={student_id:e,coach_id:y.coachId,date:t,time:n,duration:parseInt(document.getElementById("amDuration").value),type:document.getElementById("amType").value,note:document.getElementById("amNote").value.trim(),meet_link:document.getElementById("amMeetLink").value.trim()};if(i){await g.from("appointments").update(a).eq("id",i);const o=l.appointments.find(s=>s.id===i);o&&Object.assign(o,{studentId:e,date:t,time:n,duration:a.duration,type:a.type,note:a.note}),f("Güncellendi ✓")}else{const{data:o,error:s}=await g.from("appointments").insert(a).select().single();if(s)return f("Hata: "+s.message);l.appointments.push({id:o.id,studentId:o.student_id,date:o.date,time:o.time,duration:o.duration,type:o.type,note:o.note}),f("Randevu eklendi ✓")}L("apptModal"),ke()}async function Jn(e){confirm("Sil?")&&(await g.from("appointments").delete().eq("id",e),l.appointments=l.appointments.filter(t=>t.id!==e),ke(),f("Silindi"))}function de(){const e=document.getElementById("view-exams"),t=l.students.find(o=>o.id===l.activeStuId),n=[...l.exams].filter(o=>o.studentId===l.activeStuId).sort((o,s)=>s.date.localeCompare(o.date));let i="";if(n.length>1){const o=[...n].sort((d,r)=>d.date.localeCompare(r.date)).slice(-8),s=Math.max(...o.map(d=>(EXAM_DEFS[d.type]||[]).reduce((c,v)=>{var m;return c+Number(((m=d.nets)==null?void 0:m[v])||0)},0)),1);i=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text-mid)">📈 Net Gelişim · Son ${o.length} deneme</div>
      <div class="bar-chart">
        ${o.map(d=>{const c=(EXAM_DEFS[d.type]||[]).reduce((m,p)=>{var b;return m+Number(((b=d.nets)==null?void 0:b[p])||0)},0),v=Math.max(Math.round(c/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${c.toFixed(0)}</div>
            <div class="bar" style="height:${v}%;background:${(t==null?void 0:t.color)||"var(--accent)"}"></div>
            <div class="bar-label" title="${u(d.name)}">${u(d.name.replace(/Deneme /,"#").replace(/TYT |AYT /,""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const a=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],d=s.reduce((r,c)=>{var v;return r+Number(((v=o.nets)==null?void 0:v[c])||0)},0).toFixed(1);return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:14px;font-weight:700">${u(o.name)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-dim)">Toplam Net</div>
            <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:900;line-height:1">${d}</div>
          </div>
          <button class="btn btn-ghost btn-xs" onclick="openCommentModal('${o.id}')">💬</button>
          <button class="btn btn-danger btn-xs" onclick="deleteExam('${o.id}')" style="opacity:.4" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.4">🗑</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${s.map(r=>{var m;const c=Number(((m=o.nets)==null?void 0:m[r])||0),v=c>=20?"var(--green)":c>=12?"var(--accent)":"var(--red)";return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:8px 12px;min-width:70px;text-align:center">
            <div style="font-size:10px;color:var(--text-dim);font-weight:600;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px">${r}</div>
            <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:${v}">${c}</div>
          </div>`}).join("")}
      </div>
      ${o.note?`<div style="margin-top:10px;font-size:12px;color:var(--text-mid);font-style:italic">"${u(o.note)}"</div>`:""}
      ${o.coachComment?`<div style="margin-top:8px;background:var(--accent-dim);border:1px solid rgba(240,165,0,.2);border-radius:8px;padding:9px 12px;font-size:12px"><span style="font-weight:700;color:var(--accent)">Koç: </span>${u(o.coachComment)}</div>`:""}
    </div>`}).join(""):'<div class="empty"><p>Henüz deneme sonucu yok</p></div>';e.innerHTML=`
    <button class="back-link" onclick="switchTab('student-detail')">← ${t?u(t.name):"Öğrenci"}</button>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800">${t?u(t.name)+"  — ":""} Denemeler</div>
        <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${n.length} deneme kaydı</div>
      </div>
      <button class="btn btn-accent btn-sm" onclick="openExamModal()">+ Deneme Ekle</button>
    </div>
    ${i}
    ${a}`}function Xn(e){const t=l.exams.find(n=>n.id===e);document.getElementById("cmExamId").value=e,document.getElementById("cmText").value=(t==null?void 0:t.coachComment)||"",C("commentModal")}async function Qn(){const e=document.getElementById("cmExamId").value,t=document.getElementById("cmText").value.trim();await g.from("exams").update({coach_comment:t}).eq("id",e);const n=l.exams.find(i=>i.id===e);n&&(n.coachComment=t),L("commentModal"),de(),f("Yorum kaydedildi ✓")}async function ea(e){confirm("Sil?")&&(await g.from("exams").delete().eq("id",e),l.exams=l.exams.filter(t=>t.id!==e),de(),f("Silindi"))}function St(){const e=document.getElementById("view-messages");e.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>Mesajlar</h2></div>
    <div class="msg-layout">
      <div class="msg-sidebar">
        <div class="msg-sidebar-hd">Öğrenciler</div>
        ${l.students.map(t=>{const n=l.messages[t.id]||[],i=n[n.length-1],a=n.filter(o=>o.from==="student"&&!o.read).length;return`<div class="msg-contact ${l.msgThread===t.id?"active":""}" onclick="selectThread('${t.id}')">
            <div class="msg-contact-avatar" style="background:${t.color}">${t.name[0]}</div>
            <div style="flex:1;min-width:0">
              <div class="msg-contact-name">${u(t.name.split(" ")[0])}</div>
              <div class="msg-contact-last">${i?u(i.text.slice(0,35)):"Mesaj yok"}</div>
            </div>
            ${a?`<span class="msg-unread">${a}</span>`:""}
          </div>`}).join("")}
      </div>
      <div class="msg-main" id="msgMain">
        ${l.msgThread?X(l.msgThread,"coach"):'<div class="no-chat-sel">Öğrenci seçin</div>'}
      </div>
    </div>`,l.msgThread&&Q()}async function ta(e){l.msgThread=e;const t=(l.messages[e]||[]).filter(n=>n.from==="student"&&!n.read&&n._id).map(n=>n._id);t.length&&await g.from("messages").update({read:!0}).in("id",t),(l.messages[e]||[]).forEach(n=>{n.from==="student"&&(n.read=!0)}),document.getElementById("msgMain").innerHTML=X(e,"coach"),document.querySelectorAll(".msg-contact").forEach(n=>n.classList.remove("active")),l.students.forEach((n,i)=>{var a;n.id===e&&((a=document.querySelectorAll(".msg-contact")[i])==null||a.classList.add("active"))}),Q(),tt()}function X(e,t){const n=l.students.find(o=>o.id===e),a=(l.messages[e]||[]).map(o=>`<div class="msg-bubble ${t==="coach"&&o.from==="coach"||t==="student"&&o.from==="student"?"out":"in"}">${u(o.text)}<div class="msg-bubble-time">${o.time}</div></div>`).join("");return`<div class="msg-main-hd">
    <div style="width:30px;height:30px;border-radius:8px;background:${(n==null?void 0:n.color)||"#555"};color:#0f0e0c;font-family:'Syne',sans-serif;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">${(n==null?void 0:n.name[0])||"?"}</div>
    <div class="msg-main-hd-name">${u((n==null?void 0:n.name)||"")}</div>
  </div>
  <div class="msg-body" id="msgBody">${a||'<div class="empty"><p>Henüz mesaj yok</p></div>'}</div>
  <div class="msg-input-area">
    <textarea class="msg-input" id="msgInput" placeholder="Mesaj yaz..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg('${e}','${t}');}"></textarea>
    <button class="btn btn-accent" onclick="sendMsg('${e}','${t}')">Gönder</button>
  </div>`}async function na(e,t){var d,r;const n=document.getElementById("msgInput"),i=n.value.trim();if(!i)return;const a=y.coachId||((d=l.students.find(c=>c.id===e))==null?void 0:d.coachId)||((r=l.students.find(c=>c.id===y.studentId))==null?void 0:r.coachId),{data:o,error:s}=await g.from("messages").insert({student_id:e,coach_id:a,from_role:t,text:i,read:!1}).select().single();if(s){console.error("sendMsg error:",s),f("Hata: "+s.message);return}l.messages[e]||(l.messages[e]=[]),l.messages[e].push({_id:o.id,from:t,text:i,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),n.value="",currentTab==="messages"&&(document.getElementById("msgMain").innerHTML=X(e,"coach"),Q()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=X(e,"student"),Q())}function Q(){setTimeout(()=>{const e=document.getElementById("msgBody");e&&(e.scrollTop=e.scrollHeight)},60)}function De(){const e=document.getElementById("view-portal");if(!e)return;let t=l.students.find(r=>r.id===y.studentId);if(!t&&l.students.length>0&&(t=l.students[0]),!t){e.innerHTML=`<div style="text-align:center;padding:60px 20px;color:var(--text-mid)">
      <div style="font-size:36px;margin-bottom:12px">⏳</div>
      <p style="font-size:14px">Profil yükleniyor...</p>
    </div>`,setTimeout(()=>{l.students.length&&De()},800);return}y.studentId||(y.studentId=t.id),l.activeStuId=t.id;const n=ie(),i=`${t.id}_${n}`,a=l.tasks[i]||[],o=a.filter(r=>r.done).length,s=l.appointments.filter(r=>r.studentId===t.id&&r.date>=n).sort((r,c)=>r.date.localeCompare(c.date))[0],d=(l.messages[t.id]||[]).filter(r=>r.from==="coach"&&!r.read).length;e.innerHTML=`
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
        ${a.length?`
          ${a.map((r,c)=>`
            <div class="task-card task-${r.type} ${r.done?"done":""}" style="margin-bottom:6px">
              <div class="tc-check ${r.done?"on":""}" onclick="stuToggleTask('${n}',${c})"></div>
              <div class="tc-body">
                <div class="tc-type">${be(r.type)}${r.exam?" · "+r.exam:""}</div>
                <div class="tc-subject">${u(r.subject)}</div>
                <div class="tc-meta">${r.duration} dk${r.note?" · "+u(r.note):""}</div>
              </div>
            </div>`).join("")}
          <div style="margin-top:8px;font-size:12px;color:var(--text-mid)">${o}/${a.length} tamamlandı</div>
        `:'<div class="empty"><p>Bugün için görev atanmamış</p></div>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card cp">
          <div class="portal-sec-title">📈 İlerleme</div>
          <div style="font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:${t.color};margin-bottom:6px">%${t.progress}</div>
          <div class="prog-bar-wrap"><div class="prog-bar" style="width:${t.progress}%;background:${t.color}"></div></div>
        </div>
        <div class="card cp">
          <div class="portal-sec-title">📅 Sonraki Randevu</div>
          ${s?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:3px">${new Date(s.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700">${s.time}</div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:3px">${u(s.type)} · ${s.duration} dk</div>`:'<div style="font-size:13px;color:var(--text-dim)">Yaklaşan randevu yok</div>'}
        </div>
        ${d>0?`<div class="card cp" style="border-color:var(--accent);cursor:pointer" onclick="switchTab('smessages')">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">💬</span>
            <div><div style="font-weight:700">${d} yeni mesaj</div><div style="font-size:12px;color:var(--text-mid)">Koçundan</div></div>
          </div>
        </div>`:""}
      </div>
    </div>`}async function aa(e,t){var s;const n=l.students.find(d=>d.id===y.studentId);if(!n)return;const i=`${n.id}_${e}`,a=(s=l.tasks[i])==null?void 0:s[t];if(!a)return;const o=!a.done;await g.from("tasks").update({done:o}).eq("id",a._id),a.done=o,De()}function se(){const e=l.students.find(d=>d.id===y.studentId);if(!e)return;const t=document.getElementById("view-sportal"),n=e.weekStart??0,i=O(l.weekOffset,n),a=N(i,6),o=ie();let s="";for(let d=0;d<7;d++){const r=N(i,d),c=A(r),v=c===o,m=`${e.id}_${c}`,p=l.tasks[m]||[],b=p.reduce((E,w)=>E+Number(w.duration),0),h=p.reduce((E,w)=>E+(w.done?Number(w.duration):0),0),x=DAYS_TR[(n+d)%7],T=p.map((E,w)=>`
      <div class="task-card task-${E.type} ${E.done?"done":""}" onclick="openTaskDetail('${c}',${w},'student')" style="cursor:pointer">
        <div class="tc-check ${E.done?"on":""}" onclick="event.stopPropagation();stuToggleTask2('${c}',${w})"></div>
        <div class="tc-body">
          <div class="tc-type">${be(E.type)}${E.exam?" · "+E.exam:""}</div>
          <div class="tc-subject">${u(E.subject)}</div>
          <div class="tc-meta">${E.duration} dk</div>
        </div>
      </div>`).join("");s+=`<div class="day-col ${v?"today":""}">
      <div class="day-hd">
        <div><div class="day-name-lbl">${x.slice(0,3)}</div><div class="day-num">${r.getDate()}</div></div>
        <span class="day-badge">${h}/${b}dk</span>
      </div>
      <div class="day-tasks-list">${T||'<div class="empty" style="padding:8px 0"><p style="font-size:11px">Görev yok</p></div>'}</div>
    </div>`}t.innerHTML=`
    <div class="week-nav" style="margin-bottom:14px">
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(-1)">← Önceki</button>
      <span class="week-lbl">${i.getDate()} ${MONTHS_TR[i.getMonth()]} — ${a.getDate()} ${MONTHS_TR[a.getMonth()]} ${a.getFullYear()}</span>
      <button class="btn btn-ghost btn-sm" onclick="chWeekS(1)">Sonraki →</button>
      <button class="btn btn-ghost btn-sm" onclick="S.weekOffset=0;saveUI();renderSPortal()">Bugün</button>
    </div>
    <div class="week-grid">${s}</div>`}async function ia(e,t){var s;const n=l.students.find(d=>d.id===y.studentId);if(!n)return;const i=`${n.id}_${e}`,a=(s=l.tasks[i])==null?void 0:s[t];if(!a)return;const o=!a.done;await g.from("tasks").update({done:o}).eq("id",a._id),a.done=o,se()}function oa(e){l.weekOffset+=e,Z(),se()}function Xe(e,t,n){var b;const a=`${y.role==="student"?y.studentId:l.activeStuId}_${e}`,o=(b=l.tasks[a])==null?void 0:b[t];if(!o)return;let s=document.getElementById("taskDetailModal");s||(s=document.createElement("div"),s.id="taskDetailModal",s.className="modal-bg",document.body.appendChild(s),s.addEventListener("click",h=>{h.target===s&&s.classList.remove("open")}));const d={soru:"var(--blue)",konu:"#c084fc",deneme:"var(--accent)",diger:"var(--text-mid)"},r={soru:"Soru Bankası",konu:"Konu Anlatımı",deneme:"Deneme",diger:"Diğer"},c=d[o.type]||"var(--accent)",v=o.type==="konu",m=o.task_items||[];let p="";m.length>0?p=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${v?"Videolar":"Testler"} (${m.length})</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:200px;overflow-y:auto">
        ${m.map((h,x)=>`
          <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);${x===m.length-1?"border-bottom:none":""};cursor:pointer;transition:background .1s"
            onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background=''">
            <input type="checkbox" ${h.done?"checked":""} onchange="toggleDetailItem('${e}',${t},${x},'${n}')"
              style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;">
            <div style="width:20px;height:20px;border-radius:6px;background:${c}22;color:${c};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:4px">${x+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${h.done?"text-decoration:line-through;color:var(--text-dim);":""}">${u(h.label||"")}</div>
              ${h.soru>0?`<div style="font-size:10px;color:var(--text-dim);margin-top:1px">${v?h.soru+" dk":h.soru+" soru"}</div>`:""}
            </div>
            ${h.url?`<a href="${u(h.url)}" target="_blank" onclick="event.stopPropagation()"
              style="font-size:10px;background:var(--red-dim);color:var(--red);padding:2px 8px;border-radius:99px;text-decoration:none;flex-shrink:0;white-space:nowrap">▶ YT</a>`:""}
          </label>`).join("")}
      </div>
    </div>`:o.note&&(o.note.includes("test:")||o.note.includes("video:"))&&(p=`<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${v?"Videolar":"Testler"}</div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--text-mid)">${u(o.note)}</div>
    </div>`),s.innerHTML=`<div class="modal">
    <button class="modal-close" onclick="cm('taskDetailModal')">×</button>

    <!-- Görev başlık -->
    <div style="border-left:3px solid ${c};padding-left:12px;margin-bottom:20px">
      <div style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${r[o.type]||o.type}${o.exam?" · "+o.exam:""}</div>
      <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;line-height:1.2">${u(o.subject)}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px">${new Date(e+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
    </div>

    <!-- Tamamlandı toggle -->
    <div id="tdDoneBox" style="background:var(--surface2);border:1.5px solid ${o.done?"var(--green)":"var(--border)"};border-radius:11px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;cursor:pointer;transition:all .2s" onclick="toggleTaskDetail('${e}',${t},'${n}')">
      <div style="font-size:13px;font-weight:700;color:${o.done?"var(--green)":"var(--text)"}">${o.done?"✓ Tamamlandı":"Tamamlandı mı?"}</div>
      <div style="width:22px;height:22px;border-radius:6px;border:2px solid ${o.done?"var(--green)":"var(--border)"};background:${o.done?"var(--green)":"transparent"};display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .2s">${o.done?"✓":""}</div>
    </div>

    <!-- Test/Video listesi -->
    ${p}

    <!-- Not -->
    <div class="field">
      <label>Notum</label>
      <textarea id="tdNote" placeholder="Zorlandığım konular, dikkatimi çeken şeyler..." style="min-height:90px">${o.student_note||""}</textarea>
    </div>

    <div style="display:flex; gap:10px; margin-top:12px">
      ${n==="coach"?`<button class="btn btn-ghost" style="flex:1; justify-content:center; padding:12px; font-weight:700;" onclick="cm('taskDetailModal'); openCoachTaskEdit('${e}',${t})">⚙ Düzenle</button>`:""}
      <button class="btn btn-accent" style="flex:2; justify-content:center; padding:12px; font-weight:700;" onclick="saveTaskDetail('${e}',${t},'${n}')">Kaydet</button>
    </div>
  </div>`,C("taskDetailModal")}async function sa(e,t,n){var s;const a=`${y.role==="student"?y.studentId:l.activeStuId}_${e}`,o=(s=l.tasks[a])==null?void 0:s[t];o&&(o.done=!o.done,o.task_items&&Array.isArray(o.task_items)&&o.task_items.forEach(d=>{d.done=o.done}),await g.from("tasks").update({done:o.done,task_items:o.task_items||null}).eq("id",o._id),Xe(e,t,n),n==="student"?se():Y())}async function la(e,t,n,i){var r;const o=`${y.role==="student"?y.studentId:l.activeStuId}_${e}`,s=(r=l.tasks[o])==null?void 0:r[t];if(!s||!s.task_items)return;s.task_items[n].done=!s.task_items[n].done;const d=s.task_items.every(c=>c.done);s.done=d,S(!0),await g.from("tasks").update({task_items:s.task_items,done:s.done}).eq("id",s._id),S(!1),Xe(e,t,i),i==="student"?se():Y(),f("İlerleme kaydedildi ✓")}function da(e,t){var a,o,s;e.closest("div").querySelectorAll("button[data-speed]").forEach(d=>{const r=d.dataset.speed===t;d.style.borderColor=r?"var(--accent)":"var(--border)",d.style.background=r?"var(--accent-dim)":"var(--surface2)",d.style.color=r?"var(--accent)":"var(--text-mid)"}),document.getElementById("tdSpeed").value=t;const n=parseFloat(t),i=document.getElementById("speedCalc");if(i){const d=parseInt(((s=(o=(a=i.closest("[id=speedInfo]"))==null?void 0:a.textContent)==null?void 0:o.match(/Toplam (\d+) dk/))==null?void 0:s[1])||0);i.textContent=Math.ceil(d/n)+" dk",document.getElementById("tdDuration").value=Math.ceil(d/n)}}async function ra(e,t,n){var d;const a=`${y.role==="student"?y.studentId:l.activeStuId}_${e}`,o=(d=l.tasks[a])==null?void 0:d[t];if(!o)return;const s=document.getElementById("tdNote").value.trim();await g.from("tasks").update({student_note:s}).eq("id",o._id),o.student_note=s,L("taskDetailModal"),f("Not kaydedildi ✓"),n==="student"?se():Y()}function Qe(){const e=l.students.find(o=>o.id===y.studentId);if(!e)return;const t=document.getElementById("view-sexams"),n=[...l.exams].filter(o=>o.studentId===e.id).sort((o,s)=>s.date.localeCompare(o.date));let i="";if(n.length>1){const o=[...n].sort((d,r)=>d.date.localeCompare(r.date)).slice(-8),s=Math.max(...o.map(d=>(EXAM_DEFS[d.type]||[]).reduce((c,v)=>{var m;return c+Number(((m=d.nets)==null?void 0:m[v])||0)},0)),1);i=`<div class="card cp" style="margin-bottom:16px">
      <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px">📈 Net Gelişimim</div>
      <div class="bar-chart">
        ${o.map(d=>{const c=(EXAM_DEFS[d.type]||[]).reduce((m,p)=>{var b;return m+Number(((b=d.nets)==null?void 0:b[p])||0)},0),v=Math.max(Math.round(c/s*100),4);return`<div class="bar-wrap">
            <div class="bar-val">${c.toFixed(0)}</div>
            <div class="bar" style="height:${v}%;background:${e.color}"></div>
            <div class="bar-label">${u(d.name.replace("Deneme ","#").replace("TYT ","").replace("AYT ",""))}</div>
          </div>`}).join("")}
      </div>
    </div>`}const a=n.length?n.map(o=>{const s=EXAM_DEFS[o.type]||[],d=s.reduce((c,v)=>{var m;return c+Number(((m=o.nets)==null?void 0:m[v])||0)},0).toFixed(1),r=s.map(c=>{var m;const v=Number(((m=o.nets)==null?void 0:m[c])||0);return`<div class="net-box"><div class="net-label">${c}</div><div class="net-val ${qe(v)}">${v}</div></div>`}).join("");return`<div class="exam-item">
      <div class="exam-header">
        <div><div class="exam-name">${u(o.name)}</div><div class="exam-date">${new Date(o.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
        <button class="btn btn-ghost btn-xs" onclick="openStudentExamModal('${o.id}')">✏️ Düzenle</button>
      </div>
      ${o.note?`<div style="font-size:12px;color:var(--text-mid);margin-bottom:8px;font-style:italic">"${u(o.note)}"</div>`:""}
      <div class="nets-grid">${r}</div>
      <div style="margin-top:8px"><div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800">Toplam: ${d}</div></div>
      ${o.coachComment?`<div class="coach-comment-box"><strong>Koç Yorumu</strong>${u(o.coachComment)}</div>`:""}
    </div>`}).join(""):'<div class="empty"><p>Henüz deneme sonucu eklemediniz.<br>İlk sonucunuzu girin!</p></div>';t.innerHTML=`
    <div class="sh"><h2>Denemelerim</h2><button class="btn btn-accent" onclick="openStudentExamModal()">+ Sonuç Gir</button></div>
    ${i}${a}`}function _t(e){var n;const t=e?l.exams.find(i=>i.id===e):null;document.getElementById("emTitle").textContent=t?"Sonucu Düzenle":"Deneme Sonucu Gir",document.getElementById("emId").value=e||"",document.getElementById("emName").value=(t==null?void 0:t.name)||"",document.getElementById("emDate").value=(t==null?void 0:t.date)||A(new Date),document.getElementById("emStudentWrap").style.display="none",document.getElementById("emStudent").innerHTML=`<option value="${y.studentId}">${u(((n=l.students.find(i=>i.id===y.studentId))==null?void 0:n.name)||"")}</option>`,document.getElementById("emExamType").value=(t==null?void 0:t.type)||"TYT",document.getElementById("emNote").value=(t==null?void 0:t.note)||"",et(),t!=null&&t.nets&&Object.entries(t.nets).forEach(([i,a])=>{const o=document.getElementById("net_"+i);o&&(o.value=a)}),C("examModal")}function ca(e){document.getElementById("emStudentWrap").style.display="",document.getElementById("emStudent").innerHTML=l.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),_t(e),document.getElementById("emStudentWrap").style.display=""}function et(){const e=document.getElementById("emExamType").value;document.getElementById("netInputsWrap").innerHTML=(EXAM_DEFS[e]||[]).map(t=>`
    <div class="net-input-box"><label>${t}</label><input type="number" id="net_${t}" value="0" min="0" max="40" step="0.5"></div>`).join("")}async function ma(){var s;const e=document.getElementById("emName").value.trim();if(!e)return f("Sınav adı girin!");const t=document.getElementById("emExamType").value,n={};(EXAM_DEFS[t]||[]).forEach(d=>{var r;n[d]=Number(((r=document.getElementById("net_"+d))==null?void 0:r.value)||0)});const i=document.getElementById("emId").value,a=document.getElementById("emStudent").value,o={name:e,date:document.getElementById("emDate").value,student_id:a,coach_id:y.coachId||((s=l.students.find(d=>d.id===a))==null?void 0:s.coachId),exam_type:t,nets:n,student_note:document.getElementById("emNote").value.trim()};if(i){await g.from("exams").update(o).eq("id",i);const d=l.exams.find(r=>r.id===i);d&&Object.assign(d,{name:o.name,date:o.date,studentId:a,type:t,nets:n,note:o.student_note}),f("Güncellendi ✓")}else{const{data:d,error:r}=await g.from("exams").insert(o).select().single();if(r)return f("Hata: "+r.message);l.exams.push({id:d.id,studentId:d.student_id,name:d.name,date:d.date,type:d.exam_type,nets:d.nets||{},note:d.student_note,coachComment:""}),f("Deneme eklendi ✓")}L("examModal"),y.role==="student"?Qe():de()}async function Ke(){const e=l.students.find(i=>i.id===y.studentId);if(!e)return;const t=(l.messages[e.id]||[]).filter(i=>i.from==="coach"&&!i.read&&i._id).map(i=>i._id);t.length&&await g.from("messages").update({read:!0}).in("id",t),(l.messages[e.id]||[]).forEach(i=>{i.from==="coach"&&(i.read=!0)});const n=document.getElementById("view-smessages");n.innerHTML=`<div class="sh" style="margin-bottom:14px"><h2>💬 Koçuma Yaz</h2></div>
    <div class="card" style="max-width:700px;overflow:hidden">
      <div class="msg-main" id="msgMain" style="display:flex;flex-direction:column;min-height:420px">
        ${X(e.id,"student")}
      </div>
    </div>`,Q()}let Se=null;function tt(){nt();const e=y.role==="coach"?l.msgThread:y.studentId;e&&(Se=g.channel("messages_"+e).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`student_id=eq.${e}`},t=>{const n=t.new;l.messages[e]||(l.messages[e]=[]),!l.messages[e].find(i=>i._id===n.id)&&(l.messages[e].push({_id:n.id,from:n.from_role,text:n.text,read:n.read,time:new Date(n.created_at).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}),currentTab==="messages"&&l.msgThread===e&&(document.getElementById("msgMain").innerHTML=X(e,"coach"),Q()),currentTab==="smessages"&&(document.getElementById("msgMain").innerHTML=X(e,"student"),Q()))}).subscribe())}function nt(){Se&&(g.removeChannel(Se),Se=null)}function pa(){}function ua(){}async function Bt(){const e=document.getElementById("view-dev-dashboard");e.innerHTML='<div class="sh"><h2>🖥️ Sistem Dashboard</h2></div><div class="empty"><p>Yükleniyor...</p></div>';const[t,n,i,a,o,s]=await Promise.all([g.from("users").select("id,role,created_at"),g.from("tasks").select("id,done,created_at"),g.from("exams").select("id,created_at"),g.from("messages").select("id,created_at"),g.from("tickets").select("id,status,created_at"),g.from("payments").select("id,amount,status,payment_date")]),d=t.data||[],r=n.data||[],c=i.data||[],v=a.data||[],m=o.data||[],p=s.data||[],b=d.filter(k=>k.role==="coach").length,h=d.filter(k=>k.role==="student").length,x=p.filter(k=>k.status==="completed").reduce((k,M)=>k+Number(M.amount),0),T=m.filter(k=>k.status==="open").length,E=Array.from({length:7},(k,M)=>{const _=new Date;return _.setDate(_.getDate()-6+M),A(_)}),w=E.map(k=>r.filter(M=>{var _;return(_=M.created_at)==null?void 0:_.startsWith(k)}).length),I=Math.max(...w,1);e.innerHTML=`
    <div class="sh"><h2>🖥️ Sistem Dashboard</h2><span style="font-size:12px;color:var(--text-dim)">${new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>

    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Öğrenci</div><div class="stat-val" style="color:var(--blue)">${h}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Koç</div><div class="stat-val" style="color:var(--accent)">${b}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Görev</div><div class="stat-val">${r.length}</div><div style="font-size:11px;color:var(--green);margin-top:3px">✓ ${r.filter(k=>k.done).length} tamamlandı</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Deneme</div><div class="stat-val">${c.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Mesaj</div><div class="stat-val">${v.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Gelir</div><div class="stat-val" style="color:var(--green)">${x.toLocaleString("tr-TR")} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Açık Ticket</div><div class="stat-val" style="color:${T>0?"var(--red)":"var(--green)"}">${T}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">📅 Son 7 Gün Görev Aktivitesi</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:80px">
          ${E.map((k,M)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="font-size:10px;color:var(--text-mid);font-weight:600">${w[M]}</div>
            <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${Math.max(Math.round(w[M]/I*100),4)}%;min-height:3px;opacity:.8"></div>
            <div style="font-size:9px;color:var(--text-dim)">${new Date(k+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card cp">
        <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:14px">🎫 Son Ticket'lar</div>
        ${m.slice(-5).reverse().map(k=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span style="color:var(--text-mid)">#${k.id.slice(0,6)}</span>
            <span class="role-badge" style="background:${k.status==="open"?"var(--red-dim)":k.status==="resolved"?"var(--green-dim)":"var(--accent-dim)"};color:${k.status==="open"?"var(--red)":k.status==="resolved"?"var(--green)":"var(--accent)"}">${k.status}</span>
          </div>`).join("")||'<div style="font-size:12px;color:var(--text-dim)">Ticket yok</div>'}
      </div>
    </div>`}async function Le(){const e=document.getElementById("view-dev-users"),{data:t}=await g.from("users").select("*").order("created_at");e.innerHTML=`
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
    </div>`}async function va(e){const t=e?(await g.from("users").select("*").eq("id",e).single()).data:null;document.getElementById("smTitle").textContent=t?"Kullanıcıyı Düzenle":"Yeni Kullanıcı",document.getElementById("smId").value=e||"",document.getElementById("smName").value=(t==null?void 0:t.full_name)||"",document.getElementById("smTarget").value=(t==null?void 0:t.target)||"",document.getElementById("smUsername").value=(t==null?void 0:t.username)||"",document.getElementById("smPass").value=(t==null?void 0:t.password_hash)||"",document.getElementById("smWeekStart").value=(t==null?void 0:t.week_start)||0,document.getElementById("smProg").value=(t==null?void 0:t.progress)||0,document.getElementById("smProgVal").textContent=((t==null?void 0:t.progress)||0)+"%",document.querySelectorAll(".color-opt").forEach(i=>i.classList.toggle("sel",i.dataset.c===((t==null?void 0:t.color)||"#f0a500")));let n=document.getElementById("smRoleField");n||(n=document.createElement("div"),n.id="smRoleField",n.className="field",n.innerHTML='<label>Rol</label><select id="smRole" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);outline:none"><option value="student">Öğrenci</option><option value="coach">Koç</option><option value="developer">Developer</option></select>',document.getElementById("smName").closest(".modal").insertBefore(n,document.getElementById("smName").parentElement)),document.getElementById("smRole").value=(t==null?void 0:t.role)||"student",document.querySelector("#studentModal .btn-accent").setAttribute("onclick","saveStudentDev()"),C("studentModal")}async function ya(e){confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")&&(await g.from("users").delete().eq("id",e),f("Kullanıcı silindi"),Le())}let ue=[];async function we(){const e=document.getElementById("view-dev-resources"),{data:t}=await g.from("resources").select("*").order("resource_type,exam_type,subject,name");ue=t||[];const n=ue.filter(a=>a.resource_type!=="playlist"),i=ue.filter(a=>a.resource_type==="playlist");e.innerHTML=`
    <div class="sh"><h2>📚 Kaynak & Müfredat Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openResourceModal(null,'book')">+ Soru Bankası</button>
        <button class="btn btn-accent btn-sm" onclick="openPlaylistModal()">▶ Playlist / Video Ekle</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Soru Bankası</div><div class="stat-val">${n.length}</div></div>
      <div class="stat-card"><div class="stat-label">Playlist</div><div class="stat-val">${i.length}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam Kaynak</div><div class="stat-val">${ue.length}</div></div>
    </div>

    <!-- PLAYLİSTLER -->
    <div style="margin-bottom:24px">
      <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        ▶ Konu Anlatımı Playlistleri <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${i.length} playlist</span>
      </div>
      ${i.length===0?'<div class="empty"><p>Henüz playlist eklenmemiş</p></div>':""}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${i.map(a=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:700;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(a.name)}</div>
                <div style="font-size:11px;color:var(--text-dim)">${u(a.publisher)} · ${a.exam_type} ${a.subject} · ${(a.tests||[]).length} video</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${a.id}','playlist')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${a.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </div>

    <!-- SORU BANKALARI -->
    <div>
      <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        📚 Soru Bankaları <span style="font-size:12px;font-weight:400;color:var(--text-dim)">${n.length} kitap</span>
      </div>
      ${n.length===0?'<div class="empty"><p>Henüz kitap eklenmemiş</p></div>':""}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
        ${n.map(a=>`
          <div class="card" style="padding:14px 16px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:2px">${a.exam_type} · ${a.subject}</div>
                <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(a.name)}</div>
                <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${u(a.publisher)} · ${(a.tests||[]).length} test</div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <span style="font-size:10px;padding:2px 7px;border-radius:99px;background:${a.active?"var(--green-dim)":"var(--red-dim)"};color:${a.active?"var(--green)":"var(--red)"}">${a.active?"Aktif":"Pasif"}</span>
                <button class="btn btn-ghost btn-xs" onclick="openResourceModal('${a.id}','book')">✏️</button>
                <button class="btn btn-danger btn-xs" onclick="devDeleteResource('${a.id}')" style="opacity:.5" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">🗑</button>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </div>`}function ga(){let e=document.getElementById("playlistModal");e||(e=document.createElement("div"),e.id="playlistModal",e.className="modal-bg",document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),e.innerHTML=`<div class="modal modal-lg">
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
  </div>`,C("playlistModal")}async function fa(){const e=document.getElementById("ytPlaylistUrl").value.trim(),t=document.getElementById("ytStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL giriniz</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ Geçersiz URL — "list=..." parametresi bulunamadı</span>';const i=n[1];t.innerHTML="⏳ Yükleniyor...";try{let a=[],o="";do{let s=`/api/youtube?playlistId=${i}`;o&&(s+=`&pageToken=${o}`);const d=await fetch(s);if(!d.ok){const c=await d.json();throw new Error(c.error||"Oynatma listesi yüklenemedi.")}const r=await d.json();r.items&&(a=a.concat(r.items)),o=r.nextPageToken||""}while(o&&a.length<200);document.getElementById("plVideos").value=a.map(s=>`${s.title} | ${s.url} | ${s.duration}`).join(`
`),t.innerHTML=`<span style="color:var(--green)">✓ ${a.length} video yüklendi!</span>`}catch(a){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${a.message}</span>`}}async function ba(){const e=document.getElementById("plName").value.trim(),t=document.getElementById("plSubject").value.trim(),n=document.getElementById("plPublisher").value.trim();if(!e||!t||!n)return f("Tüm alanları doldurun!");const i=document.getElementById("plVideos").value.split(`
`).map(d=>d.trim()).filter(Boolean);if(!i.length)return f("En az 1 video girin!");const a=i.map(d=>{const r=d.split("|").map(c=>c.trim());return{label:r[0]||"",url:r[1]||"",topic:"",soru:parseInt(r[2])||0}}).filter(d=>d.label),o={exam_type:document.getElementById("plExam").value,subject:t,publisher:n,name:e,year:new Date().getFullYear(),tests:a,active:!0,resource_type:"playlist"},{error:s}=await g.from("resources").insert(o);if(s)return f("Hata: "+s.message);f(`✓ "${e}" eklendi — ${a.length} video`),L("playlistModal"),we()}function xa(e,t="book"){const n=e?ue.find(s=>s.id===e):null;let i=document.getElementById("resourceModal");i||(i=document.createElement("div"),i.id="resourceModal",i.className="modal-bg",document.body.appendChild(i),i.addEventListener("click",s=>{s.target===i&&i.classList.remove("open")}));const a=((n==null?void 0:n.resource_type)||t)==="playlist";i.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('resourceModal')">×</button>
    <h2 id="rmTitle">${n?"Düzenle":"Ekle"} — ${a?"Playlist":"Soru Bankası"}</h2>
    <input type="hidden" id="rmId" value="${e||""}">
    <input type="hidden" id="rmType" value="${a?"playlist":"book"}">
    <div class="field-row">
      <div class="field"><label>Sınav</label>
        <select id="rmExam"><option value="TYT">TYT</option><option value="AYT-SAY">AYT Sayısal</option><option value="AYT-EA">AYT EA</option><option value="AYT-SOZ">AYT Sözel</option></select>
      </div>
      <div class="field"><label>Ders</label><input id="rmSubject" placeholder="Matematik, Fizik..."></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${a?"Hoca / Kanal":"Yayınevi"}</label><input id="rmPublisher"></div>
      <div class="field"><label>Ad</label><input id="rmName"></div>
    </div>
    ${a?`
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
  </div>`,document.getElementById("rmExam").value=(n==null?void 0:n.exam_type)||"TYT",document.getElementById("rmSubject").value=(n==null?void 0:n.subject)||"",document.getElementById("rmPublisher").value=(n==null?void 0:n.publisher)||"",document.getElementById("rmName").value=(n==null?void 0:n.name)||"",document.getElementById("rmActive").value=String((n==null?void 0:n.active)!==!1);const o=(n==null?void 0:n.tests)||[];a?document.getElementById("rmTests").value=o.map(s=>`${s.label||s} | ${s.url||""} | ${s.soru||0}`).join(`
`):document.getElementById("rmTests").value=o.map(s=>`${s.label||s} | ${s.soru||0}`).join(`
`),C("resourceModal")}async function ha(){const e=document.getElementById("rmName").value.trim(),t=document.getElementById("rmSubject").value.trim();if(!e||!t)return f("Ad ve ders zorunlu!");const n=document.getElementById("rmId").value,i=document.getElementById("rmType").value==="playlist",a=document.getElementById("rmTests").value.split(`
`).map(d=>d.trim()).filter(Boolean);let o=[];i?o=a.map(d=>{const r=d.split("|").map(c=>c.trim());return{label:r[0]||"",url:r[1]||"",topic:"",soru:parseInt(r[2])||0}}):o=a.map(d=>{const r=d.split("|").map(c=>c.trim());return{label:r[0]||"",soru:parseInt(r[1])||0}});const s={exam_type:document.getElementById("rmExam").value,subject:t,publisher:document.getElementById("rmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:o,active:document.getElementById("rmActive").value==="true",resource_type:i?"playlist":"book"};n?(await g.from("resources").update(s).eq("id",n),f("Güncellendi ✓")):(await g.from("resources").insert(s),f("Kaynak eklendi ✓")),L("resourceModal"),we()}async function ka(e){confirm("Sil?")&&(await g.from("resources").delete().eq("id",e),f("Silindi"),we())}async function Ce(){const e=document.getElementById("view-dev-finance"),[{data:t},{data:n}]=await Promise.all([g.from("subscriptions").select("*,users(full_name,color)").order("created_at",{ascending:!1}),g.from("payments").select("*,users(full_name)").order("payment_date",{ascending:!1}).limit(20)]),i=(n||[]).filter(o=>o.status==="completed").reduce((o,s)=>o+Number(s.amount),0),a=(t||[]).filter(o=>o.status==="active").length;e.innerHTML=`
    <div class="sh"><h2>💰 Finans Yönetimi</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openPaymentModal()">+ Ödeme Ekle</button>
        <button class="btn btn-accent btn-sm" onclick="openSubModal()">+ Abonelik</button>
      </div>
    </div>
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-label">Toplam Tahsilat</div><div class="stat-val" style="color:var(--green)">${i.toLocaleString("tr-TR")} ₺</div></div>
      <div class="stat-card"><div class="stat-label">Aktif Abonelik</div><div class="stat-val">${a}</div></div>
      <div class="stat-card"><div class="stat-label">Toplam İşlem</div><div class="stat-val">${(n||[]).length}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card cp">
        <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">📋 Abonelikler</div>
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
        <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:12px">💳 Son Ödemeler</div>
        ${(n||[]).slice(0,10).map(o=>{var s;return`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:12px;font-weight:700">${u(((s=o.users)==null?void 0:s.full_name)||"?")}</div>
              <div style="font-size:11px;color:var(--text-dim)">${o.payment_date} · ${o.method}</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--green)">${Number(o.amount).toLocaleString("tr-TR")} ₺</div>
          </div>`}).join("")||'<div class="empty"><p>Ödeme yok</p></div>'}
      </div>
    </div>`}function wa(){let e=document.getElementById("paymentModal");e||(e=document.createElement("div"),e.id="paymentModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('paymentModal')">×</button>
      <h2>Ödeme Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="pmStudent">${l.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join("")}</select></div>
      <div class="field-row">
        <div class="field"><label>Tutar (₺)</label><input type="number" id="pmAmount" placeholder="1500"></div>
        <div class="field"><label>Yöntem</label><select id="pmMethod"><option>nakit</option><option>havale</option><option>kart</option><option>iyzico</option></select></div>
      </div>
      <div class="field"><label>Tarih</label><input type="date" id="pmDate" value="${A(new Date)}"></div>
      <div class="field"><label>Açıklama</label><input id="pmDesc" placeholder="Mayıs ayı ücreti"></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="savePayment()">Kaydet</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pmStudent").innerHTML=l.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),C("paymentModal")}async function $a(){const e=parseFloat(document.getElementById("pmAmount").value);if(!e)return f("Tutar girin!");await g.from("payments").insert({student_id:document.getElementById("pmStudent").value,amount:e,method:document.getElementById("pmMethod").value,payment_date:document.getElementById("pmDate").value,description:document.getElementById("pmDesc").value,status:"completed"}),f("Ödeme kaydedildi ✓"),L("paymentModal"),Ce()}function Ea(){let e=document.getElementById("subModal");e||(e=document.createElement("div"),e.id="subModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('subModal')">×</button>
      <h2>Abonelik Ekle</h2>
      <div class="field"><label>Öğrenci</label><select id="sbStudent"></select></div>
      <div class="field-row">
        <div class="field"><label>Plan</label><select id="sbPlan"><option value="monthly">Aylık</option><option value="quarterly">3 Aylık</option><option value="yearly">Yıllık</option></select></div>
        <div class="field"><label>Aylık Tutar (₺)</label><input type="number" id="sbAmount" placeholder="1500"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Başlangıç</label><input type="date" id="sbStart" value="${A(new Date)}"></div>
        <div class="field"><label>Bitiş (isteğe bağlı)</label><input type="date" id="sbEnd"></div>
      </div>
      <div class="field"><label>Durum</label><select id="sbStatus"><option value="active">Aktif</option><option value="trial">Deneme</option><option value="paused">Durduruldu</option><option value="cancelled">İptal</option></select></div>
      <div class="field"><label>Not</label><input id="sbNotes" placeholder="..."></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveSub()">Kaydet</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("sbStudent").innerHTML=l.students.map(t=>`<option value="${t.id}">${u(t.name)}</option>`).join(""),C("subModal")}async function Ta(){const e=parseFloat(document.getElementById("sbAmount").value);if(!e)return f("Tutar girin!");await g.from("subscriptions").insert({student_id:document.getElementById("sbStudent").value,plan:document.getElementById("sbPlan").value,amount:e,start_date:document.getElementById("sbStart").value,end_date:document.getElementById("sbEnd").value||null,status:document.getElementById("sbStatus").value,notes:document.getElementById("sbNotes").value}),f("Abonelik eklendi ✓"),L("subModal"),Ce()}async function $e(){const e=document.getElementById("view-dev-announce"),{data:t}=await g.from("announcements").select("*").order("created_at",{ascending:!1}),n={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"};e.innerHTML=`
    <div class="sh"><h2>📣 Duyuru Yönetimi</h2>
      <button class="btn btn-accent" onclick="openAnnounceModal()">+ Duyuru Ekle</button>
    </div>
    <div style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Aktif duyurular tüm kullanıcıların ana ekranında gösterilir.</div>
    ${(t||[]).length===0?'<div class="empty"><p>Henüz duyuru yok</p></div>':""}
    ${(t||[]).map(i=>`
      <div class="card" style="padding:16px 20px;margin-bottom:10px;border-left:3px solid ${n[i.type]||"var(--accent)"}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px">${u(i.title)}</div>
            <div style="font-size:13px;color:var(--text-mid);margin-bottom:8px">${u(i.body)}</div>
            <div style="display:flex;gap:8px">
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${n[i.type]+"22"};color:${n[i.type]}">${i.type}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:var(--surface2);color:var(--text-dim)">${i.target}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${i.active?"var(--green-dim)":"var(--red-dim)"};color:${i.active?"var(--green)":"var(--red)"}">${i.active?"Aktif":"Pasif"}</span>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-xs" onclick="toggleAnnounce('${i.id}',${!i.active})">${i.active?"Pasife Al":"Aktifleştir"}</button>
            <button class="btn btn-danger btn-xs" onclick="devDeleteAnnounce('${i.id}')">🗑</button>
          </div>
        </div>
      </div>`).join("")}`}function Ia(){let e=document.getElementById("announceModal");e||(e=document.createElement("div"),e.id="announceModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('announceModal')">×</button>
      <h2>Yeni Duyuru</h2>
      <div class="field"><label>Başlık</label><input id="anTitle" placeholder="Önemli Güncelleme"></div>
      <div class="field"><label>İçerik</label><textarea id="anBody" placeholder="Duyuru metni..."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Tür</label><select id="anType"><option value="info">Bilgi</option><option value="warning">Uyarı</option><option value="success">Başarı</option><option value="urgent">Acil</option></select></div>
        <div class="field"><label>Hedef</label><select id="anTarget"><option value="all">Herkes</option><option value="students">Öğrenciler</option><option value="coaches">Koçlar</option></select></div>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="saveAnnounce()">Yayınla</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),C("announceModal")}async function Sa(){const e=document.getElementById("anTitle").value.trim(),t=document.getElementById("anBody").value.trim();if(!e||!t)return f("Başlık ve içerik zorunlu!");await g.from("announcements").insert({title:e,body:t,type:document.getElementById("anType").value,target:document.getElementById("anTarget").value,active:!0}),f("Duyuru yayınlandı ✓"),L("announceModal"),$e()}async function _a(e,t){await g.from("announcements").update({active:t}).eq("id",e),$e()}async function Ba(e){confirm("Sil?")&&(await g.from("announcements").delete().eq("id",e),f("Silindi"),$e())}async function je(){const e=document.getElementById("view-dev-tickets"),{data:t}=await g.from("tickets").select("*,users(full_name,role)").order("created_at",{ascending:!1}),n={open:"var(--red)",in_progress:"var(--accent)",resolved:"var(--green)",closed:"var(--text-dim)"},i={urgent:"var(--red)",high:"var(--accent)",normal:"var(--blue)",low:"var(--text-dim)"};e.innerHTML=`
    <div class="sh"><h2>🎫 Destek & Geri Bildirim</h2></div>
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      ${["open","in_progress","resolved","closed"].map(a=>{const o=(t||[]).filter(s=>s.status===a).length;return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 16px;font-size:12px;font-weight:700;color:${n[a]}">${a.replace("_"," ")} <span style="font-size:18px;font-family:'Syne',sans-serif;display:block">${o}</span></div>`}).join("")}
    </div>
    ${(t||[]).length===0?'<div class="empty"><p>Henüz ticket yok</p></div>':""}
    ${(t||[]).map(a=>{var o,s;return`
      <div class="card" style="padding:16px 20px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px">
          <div>
            <div style="font-weight:700;margin-bottom:2px">${u(a.subject)}</div>
            <div style="font-size:12px;color:var(--text-mid)">${u(((o=a.users)==null?void 0:o.full_name)||"?")} · ${(s=a.users)==null?void 0:s.role} · ${new Date(a.created_at).toLocaleDateString("tr-TR")}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${n[a.status]+"22"};color:${n[a.status]}">${a.status}</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${i[a.priority]+"22"};color:${i[a.priority]}">${a.priority}</span>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-mid);margin-bottom:10px;padding:10px;background:var(--surface2);border-radius:8px">${u(a.body)}</div>
        ${a.reply?`<div style="font-size:13px;color:var(--green);padding:10px;background:var(--green-dim);border-radius:8px;margin-bottom:10px"><strong>Yanıt:</strong> ${u(a.reply)}</div>`:""}
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select onchange="updateTicketStatus('${a.id}',this.value)" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:5px 10px;font-family:inherit;font-size:12px;color:var(--text);cursor:pointer">
            ${["open","in_progress","resolved","closed"].map(d=>`<option value="${d}" ${a.status===d?"selected":""}>${d.replace("_"," ")}</option>`).join("")}
          </select>
          <button class="btn btn-ghost btn-sm" onclick="openTicketReply('${a.id}')">💬 Yanıtla</button>
          <button class="btn btn-danger btn-xs" onclick="devDeleteTicket('${a.id}')">🗑</button>
        </div>
      </div>`}).join("")}`}async function za(e,t){await g.from("tickets").update({status:t,updated_at:new Date().toISOString()}).eq("id",e),f("Durum güncellendi ✓")}function Ma(e){const t=prompt("Yanıtınızı girin:");t&&g.from("tickets").update({reply:t,status:"resolved",updated_at:new Date().toISOString()}).eq("id",e).then(()=>{f("Yanıt gönderildi ✓"),je()})}async function Aa(e){confirm("Sil?")&&(await g.from("tickets").delete().eq("id",e),f("Silindi"),je())}function Da(){let e=document.getElementById("ticketSendModal");e||(e=document.createElement("div"),e.id="ticketSendModal",e.className="modal-bg",e.innerHTML=`<div class="modal"><button class="modal-close" onclick="cm('ticketSendModal')">×</button>
      <h2>🎫 Destek Talebi Gönder</h2>
      <div class="field"><label>Konu</label><input id="tkSubject" placeholder="Konu başlığı..."></div>
      <div class="field"><label>Kategori</label><select id="tkCat"><option value="general">Genel</option><option value="bug">Hata Bildirimi</option><option value="feature">Özellik İsteği</option><option value="billing">Ödeme</option></select></div>
      <div class="field"><label>Öncelik</label><select id="tkPrio"><option value="normal">Normal</option><option value="low">Düşük</option><option value="high">Yüksek</option><option value="urgent">Acil</option></select></div>
      <div class="field"><label>Açıklama</label><textarea id="tkBody" placeholder="Sorununuzu detaylıca açıklayın..." style="min-height:100px"></textarea></div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:4px" onclick="submitTicket()">Gönder</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),C("ticketSendModal")}async function La(){var i;const e=document.getElementById("tkSubject").value.trim(),t=document.getElementById("tkBody").value.trim();if(!e||!t)return f("Konu ve açıklama zorunlu!");const n=y.studentId||((i=y.dbUser)==null?void 0:i.id);await g.from("tickets").insert({user_id:n,subject:e,body:t,category:document.getElementById("tkCat").value,priority:document.getElementById("tkPrio").value,status:"open"}),f("Ticket gönderildi ✓"),L("ticketSendModal")}async function zt(){const{data:e}=await g.from("announcements").select("*").eq("active",!0),t=y.role,n=(e||[]).filter(o=>o.target==="all"||o.target==="students"&&t==="student"||o.target==="coaches"&&t==="coach");if(!n.length)return;const i={info:"var(--blue)",warning:"var(--accent)",success:"var(--green)",urgent:"var(--red)"},a=document.createElement("div");a.style.cssText="position:fixed;top:64px;right:16px;z-index:400;display:flex;flex-direction:column;gap:8px;max-width:340px",a.id="announceBanner",n.slice(0,3).forEach(o=>{const s=document.createElement("div");s.style.cssText=`background:var(--surface);border:1px solid var(--border);border-left:3px solid ${i[o.type]||"var(--accent)"};border-radius:10px;padding:12px 14px;box-shadow:var(--shadow);animation:fadeUp .3s ease`,s.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div><div style="font-size:13px;font-weight:700;margin-bottom:3px">${u(o.title)}</div><div style="font-size:12px;color:var(--text-mid)">${u(o.body)}</div></div>
      <button onclick="this.closest('div[style]').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-dim);font-size:16px;flex-shrink:0">×</button>
    </div>`,a.appendChild(s)}),document.body.appendChild(a),setTimeout(()=>a.remove(),8e3)}(()=>{const e=document.createElement("style");e.textContent=".role-dev{background:rgba(192,132,252,.15);color:#c084fc;}",document.head.appendChild(e)})();function Ca(){let e=document.getElementById("onboardingModal");e||(e=document.createElement("div"),e.id="onboardingModal",e.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)",document.body.appendChild(e)),at(0,e)}const Oe=[{icon:"🎉",title:"Rostrum Akademi'ye Hoş Geldiniz!",body:"Koçluk platformunuzu birkaç adımda kuruyoruz. Sadece 2 dakika.",fields:[],nextLabel:"Başlayalım →"},{icon:"🏷️",title:"Markanızı Tanıyalım",body:"Öğrencileriniz uygulamaya girdiğinde ne görsün?",fields:[{id:"ob_brand",label:"Akademi / Koçluk Adı",placeholder:"Örn: Ayşe Koçluk, EminHoca Akademi",type:"text"},{id:"ob_color",label:"Marka Rengi",type:"color",value:"#f0a500"}],nextLabel:"Devam →"},{icon:"🔐",title:"Şifrenizi Güncelleyin",body:"Güvenli bir şifre belirleyin.",fields:[{id:"ob_pass1",label:"Yeni Şifre",placeholder:"En az 6 karakter",type:"password"},{id:"ob_pass2",label:"Şifre Tekrar",placeholder:"Aynı şifreyi girin",type:"password"}],nextLabel:"Devam →"},{icon:"👨‍🎓",title:"İlk Öğrencinizi Ekleyin",body:"Şimdi ya da sonra ekleyebilirsiniz.",fields:[{id:"ob_stuname",label:"Öğrenci Adı Soyadı",placeholder:"Muzaffer Sabri Koçar",type:"text"},{id:"ob_stuuser",label:"Kullanıcı Adı",placeholder:"muzaffer",type:"text"},{id:"ob_stupass",label:"Öğrenci Şifresi",placeholder:"ogrenci123",type:"text"}],nextLabel:"Devam →",skipLabel:"Şimdilik Geç"},{icon:"✅",title:"Hazırsınız!",body:"Platformunuz kuruldu. Hemen kullanmaya başlayabilirsiniz.",fields:[],nextLabel:"Panele Git →"}];function at(e,t){const n=Oe[e],i=Oe.length,a=Array.from({length:i},(o,s)=>`<div style="width:${s===e?24:8}px;height:8px;border-radius:99px;background:${s===e?"var(--accent)":"var(--border2)"};transition:width .3s"></div>`).join("");t.innerHTML=`<div style="background:var(--surface);border:1px solid var(--border2);border-radius:24px;width:100%;max-width:480px;padding:40px;animation:fadeUp .3s ease">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-size:52px;margin-bottom:12px">${n.icon}</div>
      <h2 style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px">${n.title}</h2>
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
    <div style="display:flex;gap:6px;justify-content:center;margin-top:20px">${a}</div>
  </div>`}async function ja(e,t){var a,o,s,d,r,c,v,m,p,b,h;const n=document.getElementById("onboardingModal");if(!t){if(e===1){const x=(o=(a=document.getElementById("ob_brand"))==null?void 0:a.value)==null?void 0:o.trim(),T=((s=document.getElementById("ob_color"))==null?void 0:s.value)||"#f0a500";x&&(await g.from("workspaces").update({brand_name:x,brand_color:T}).eq("coach_id",y.coachId),l.workspace={...l.workspace||{},brand_name:x,brand_color:T},document.querySelector(".tbar-logo").innerHTML=`${u(x)}`)}if(e===2){const x=(d=document.getElementById("ob_pass1"))==null?void 0:d.value,T=(r=document.getElementById("ob_pass2"))==null?void 0:r.value;if(x&&x.length<6){f("En az 6 karakter!");return}if(x&&x!==T){f("Şifreler uyuşmuyor!");return}x&&await g.from("users").update({password_hash:x}).eq("id",y.coachId)}if(e===3){const x=(v=(c=document.getElementById("ob_stuname"))==null?void 0:c.value)==null?void 0:v.trim(),T=((p=(m=document.getElementById("ob_stuuser"))==null?void 0:m.value)==null?void 0:p.trim())||((b=x==null?void 0:x.split(" ")[0])==null?void 0:b.toLowerCase()),E=((h=document.getElementById("ob_stupass"))==null?void 0:h.value)||"ogrenci123",w=await oe(E);if(x){const I=T+"@rostrumakademi.com",{data:k,error:M}=await g.rpc("create_new_user",{p_email:I,p_password:E,p_full_name:x,p_username:T,p_role:"student",p_target:"",p_color:"#4da6ff",p_progress:0,p_week_start:0,p_coach_id:y.coachId,p_institution_id:null,p_exam_profile:"YKS"});!M&&k?l.students.push({id:k,name:x,target:"",color:"#4da6ff",progress:0,pass:w,weekStart:0,username:T,coachId:y.coachId}):M&&f("Hata: "+M.message)}}}const i=e+1;if(i>=Oe.length){await g.from("workspaces").update({onboarding_done:!0}).eq("coach_id",y.coachId),l.workspace&&(l.workspace.onboarding_done=!0),n.remove(),G("home"),f("🎉 Hoş geldiniz! Platformunuz hazır.");return}at(i,n)}let He=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),He=e;const t=document.createElement("button");t.id="pwaInstallBtn",t.className="btn btn-ghost btn-sm",t.innerHTML="📲 Yükle",t.style.cssText="font-size:11px;padding:5px 10px",t.onclick=async()=>{He.prompt();const{outcome:n}=await He.userChoice;n==="accepted"&&(t.remove(),f("Uygulama yüklendi ✓"))},document.querySelector(".tbar-right").insertBefore(t,document.querySelector(".user-pill"))});async function Mt(){const e=l.students.find(_=>_.id===y.studentId);if(!e)return;const t=document.getElementById("view-sprofil");if(!t)return;const{data:n,error:i}=await g.from("student_profiles").select("*").eq("id",y.studentId).maybeSingle();i&&console.error("Öğrenci profili yüklenirken hata:",i);const a=(n==null?void 0:n.bio)||"",o=(n==null?void 0:n.school)||"",s=(n==null?void 0:n.grade)||"",d=(n==null?void 0:n.target_university)||"",r=(n==null?void 0:n.target_department)||"",c=(n==null?void 0:n.struggling_subjects)||"",v=(n==null?void 0:n.daily_capacity)||"",m=l.exams.filter(_=>_.studentId===e.id).sort((_,P)=>_.date.localeCompare(P.date)),p=m[m.length-1],b=p?(EXAM_DEFS[p.type]||[]).reduce((P,$)=>{var B;return P+Number(((B=p.nets)==null?void 0:B[$])||0)},0).toFixed(1):"—",h=O(0,e.weekStart??0);let x=0,T=0;for(let _=0;_<7;_++){const P=l.tasks[`${e.id}_${A(N(h,_))}`]||[];x+=P.length,T+=P.filter($=>$.done).length}const E=x>0?Math.round(T/x*100):0;let w=0;Object.keys(l.tasks).filter(_=>_.startsWith(e.id+"_")).forEach(_=>{w+=l.tasks[_].filter(P=>P.done).length});let I="";if(m.length>0){const _=m.slice(-6),P=Math.max(..._.map($=>(EXAM_DEFS[$.type]||[]).reduce((z,R)=>{var j;return z+Number(((j=$.nets)==null?void 0:j[R])||0)},0)),1);I=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📈 Net Gelişim Grafiği</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:12px">
          ${_.map($=>{const z=(EXAM_DEFS[$.type]||[]).reduce((ee,re)=>{var te;return ee+Number(((te=$.nets)==null?void 0:te[re])||0)},0),R=Math.max(Math.round(z/P*100),4),j=_[_.indexOf($)-1],H=j?(EXAM_DEFS[j.type]||[]).reduce((ee,re)=>{var te;return ee+Number(((te=j.nets)==null?void 0:te[re])||0)},0):z,F=z>H?"↑":z<H?"↓":"",K=z>H?"var(--green)":z<H?"var(--red)":"var(--text-dim)";return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
              <div style="font-size:10px;font-weight:700;color:var(--text-mid)">${z.toFixed(0)}</div>
              <div style="font-size:9px;color:${K};font-weight:800">${F}</div>
              <div style="width:100%;background:${e.color};border-radius:4px 4px 0 0;height:${R}%;min-height:4px"></div>
              <div style="font-size:9px;color:var(--text-dim);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%">${u($.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim())}</div>
            </div>`}).join("")}
        </div>
      </div>`}let k="";if(m.length>0){const _=p.type,$=(EXAM_DEFS[_]||[]).map(B=>{var H;const z=m.filter(F=>F.type===_).map(F=>{var K;return Number(((K=F.nets)==null?void 0:K[B])||0)}),R=z.length?z.reduce((F,K)=>F+K,0)/z.length:0,j=Number(((H=p.nets)==null?void 0:H[B])||0);return{f:B,avg:R.toFixed(1),last:j,color:qe(j)}});k=`
      <div class="card cp" style="margin-bottom:16px">
        <div class="portal-sec-title">📊 Ders Bazında Performans (${_})</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:10px">
          ${$.map(B=>`
            <div style="background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text-dim);font-weight:700;margin-bottom:4px;text-transform:uppercase">${B.f}</div>
              <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--${B.color==="good"?"green":B.color==="mid"?"accent":"red"})">${B.last}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-top:2px">ort: ${B.avg}</div>
            </div>`).join("")}
        </div>
      </div>`}const M=l.appointments.filter(_=>_.studentId===e.id&&_.date>=ie()).sort((_,P)=>_.date.localeCompare(P.date)).slice(0,3);t.innerHTML=`
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
        <div class="stat-val">${T}<span style="font-size:14px;color:var(--text-dim)">/${x}</span></div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">%${E} tamamlandı</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Son Deneme Neti</div>
        <div class="stat-val" style="color:var(--accent)">${b}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">${p?u(p.name):"Deneme yok"}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Tamamlanan</div>
        <div class="stat-val">${w}</div>
        <div style="font-size:11px;color:var(--text-mid);margin-top:4px">görev</div>
      </div>
    </div>

    ${I}
    ${k}

    <!-- YAKLAŞAN RANDEVULAR -->
    <div class="card cp" style="margin-bottom:16px">
      <div class="portal-sec-title">📅 Yaklaşan Randevularım</div>
      ${M.length?M.map(_=>`
        <div style="background:var(--surface2);border:1px solid var(--border);border-left:3px solid ${e.color};border-radius:9px;padding:12px;margin-top:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px">${new Date(_.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700">${_.time} <span style="font-size:13px;color:var(--text-mid)">· ${_.duration} dk</span></div>
          <div style="font-size:12px;color:var(--text-mid);margin-top:2px">${u(_.type)}</div>
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
          <input type="text" id="spTargetDept" value="${u(r)}" placeholder="Örn: Bilgisayar Mühendisliği" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Zorlandığım Dersler</label>
          <input type="text" id="spStruggling" value="${u(c)}" placeholder="Örn: Fizik, Geometri" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Günlük Çalışma Kapasitesi (Saat)</label>
          <input type="number" id="spCapacity" value="${u(v)}" placeholder="Örn: 6" style="width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none;">
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Biyografi / Kendinden Bahset</label>
        <textarea id="spBio" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(a)}</textarea>
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
    </div>`}async function Pa(){const e=y.dbUser.id,t=document.getElementById("spBio").value.trim(),n=document.getElementById("spSchool").value.trim(),i=document.getElementById("spGrade").value.trim(),a=document.getElementById("spTargetUni").value.trim(),o=document.getElementById("spTargetDept").value.trim(),s=document.getElementById("spStruggling").value.trim(),d=parseInt(document.getElementById("spCapacity").value)||null,r={id:e,bio:t,school:n,grade:i,target_university:a,target_department:o,struggling_subjects:s,daily_capacity:d,updated_at:new Date().toISOString()},{error:c}=await g.from("student_profiles").upsert(r);f(c?"Profil kaydedilemedi: "+c.message:"Profil başarıyla güncellendi ✓")}async function Ra(){const e=document.getElementById("newPass1").value,t=document.getElementById("newPass2").value;if(!e)return f("Şifre girin!");if(e!==t)return f("Şifreler uyuşmuyor!");if(e.length<4)return f("En az 4 karakter olmalı");const{error:n}=await g.from("users").update({password_hash:e}).eq("id",y.studentId);if(n)return f("Hata: "+n.message);f("Şifre güncellendi ✓"),document.getElementById("newPass1").value="",document.getElementById("newPass2").value=""}async function At(){var b;const e=document.getElementById("view-coach-profile");if(!e)return;e.innerHTML='<div class="loading">Profil bilgileri yükleniyor...</div>';const t=y.dbUser.id;let n=null,i=null;const a=await g.from("coach_profiles").select("*").eq("id",t).maybeSingle();if(n=a.data,i=a.error,i){const h=localStorage.getItem(`coach_profile_${t}`);if(h)try{n=JSON.parse(h),i=null}catch{}if(i){e.innerHTML=`<div style="padding:20px;color:var(--red)">Profil yüklenirken hata oluştu: ${i.message}</div>`;return}}else if(!n){const h=localStorage.getItem(`coach_profile_${t}`);if(h)try{n=JSON.parse(h)}catch{}}const o=(n==null?void 0:n.bio)||"",s=(n==null?void 0:n.subjects)||"",d=(n==null?void 0:n.education)||"",r=(n==null?void 0:n.experience)||"",c=(n==null?void 0:n.photo_url)||"",v=(n==null?void 0:n.instagram)||"",m=(n==null?void 0:n.linkedin)||"",p=window.location.origin+window.location.pathname.replace("app.html","koc_bul.html")+`?coach=${t}`;e.innerHTML=`
    <div style="margin-bottom: 20px;">
      <h2 style="font-family:'Syne',sans-serif; margin-bottom: 6px;">👤 Koç Profilim</h2>
      <p style="font-size: 13px; color: var(--text-mid); margin-bottom: 15px;">
        "Koç Bul" sayfasında görünecek bilgilerinizi buradan düzenleyebilirsiniz.
      </p>
      
      <div style="margin-bottom: 16px; background: var(--surface2); border: 1px dashed var(--border); padding: 12px; border-radius: 9px;">
        <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Kamuya Açık Profil Linkiniz</label>
        <div style="display:flex; gap:8px;">
          <input type="text" readonly value="${p}" id="coachBulLink" style="flex:1; background:var(--surface3); border:1px solid var(--border); border-radius:9px; padding:10px 13px; font-size:13px; color:var(--text-mid); outline:none;">
          <button class="btn btn-ghost" onclick="navigator.clipboard.writeText(document.getElementById('coachBulLink').value); showToast('Link kopyalandı ✓')">🔗 Kopyala</button>
          <a href="${p}" target="_blank" class="btn btn-accent" style="text-decoration:none; display:inline-flex; align-items:center;">👁 Göster</a>
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
              <textarea id="cpEducation" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(d)}</textarea>
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Deneyim / Başarılar</label>
              <textarea id="cpExperience" oninput="updateProfilePreview()" style="width:100%; min-height:80px; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:10px 13px; font-size:14px; color:var(--text); outline:none; resize:vertical;">${u(r)}</textarea>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:var(--text-mid); margin-bottom:4px;">Instagram Kullanıcı Adı (İsteğe bağlı)</label>
              <div style="display:flex; align-items:center; background:var(--surface2); border:1.5px solid var(--border); border-radius:9px; padding:0 13px;">
                <span style="color:var(--text-dim); margin-right:4px;">@</span>
                <input type="text" id="cpInstagram" value="${u(v)}" placeholder="kullaniciadi" oninput="updateProfilePreview()" style="flex:1; background:none; border:none; padding:10px 0; font-size:14px; color:var(--text); outline:none;">
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
                  <div class="preview-name" id="prevName">${u(((b=y.dbUser)==null?void 0:b.full_name)||"Koç")}</div>
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
  `,it()}let _e="bio";function it(){var p,b,h,x,T,E,w,I;const e=((p=document.getElementById("cpPhotoUrl"))==null?void 0:p.value.trim())||"",t=((b=document.getElementById("cpSubjects"))==null?void 0:b.value.trim())||"",n=((h=document.getElementById("cpBio"))==null?void 0:h.value.trim())||"",i=((x=document.getElementById("cpEducation"))==null?void 0:x.value.trim())||"",a=((T=document.getElementById("cpExperience"))==null?void 0:T.value.trim())||"",o=((E=document.getElementById("cpInstagram"))==null?void 0:E.value.trim())||"",s=((w=document.getElementById("cpLinkedin"))==null?void 0:w.value.trim())||"",d=((I=y.dbUser)==null?void 0:I.full_name)||"Koç",r=document.getElementById("prevAvatar");if(r)if(e)r.style.backgroundImage=`url('${e}')`,r.style.backgroundColor="transparent",r.innerHTML="";else{r.style.backgroundImage="",r.style.backgroundColor="var(--accent-dim)";const k=d.split(" ").map(M=>M[0]).join("").slice(0,2).toUpperCase();r.innerHTML=k||"?"}const c=document.getElementById("prevSocials");if(c){let k="";if(o&&(k+=`<a href="https://instagram.com/${o}" target="_blank" class="preview-social-link" title="Instagram">📸 @${o}</a>`),s){let M="LinkedIn";s.includes("/in/")&&(M="in/"+s.split("/in/")[1].split("/")[0]),k+=`<a href="${s}" target="_blank" class="preview-social-link" title="LinkedIn">💼 ${M}</a>`}c.innerHTML=k}const v=document.getElementById("prevSubjects");if(v)if(t){const k=t.split(",").map(M=>M.trim()).filter(Boolean);v.innerHTML=k.map(M=>`<span class="preview-tag">${u(M)}</span>`).join("")}else v.innerHTML='<span class="preview-tag" style="background:none; border:1px dashed var(--border); color:var(--text-dim)">Ders / Uzmanlık Belirtilmedi</span>';const m=document.getElementById("prevTabContent");if(m){let k="";_e==="bio"?k=n||"Biyografi bilgisi henüz girilmedi.":_e==="edu"?k=i||"Eğitim bilgisi henüz girilmedi.":_e==="exp"&&(k=a||"Deneyim/başarılar henüz girilmedi."),m.innerHTML=Dt(u(k))}}function Ha(e){_e=e;const t=document.getElementById("btn-prev-bio"),n=document.getElementById("btn-prev-edu"),i=document.getElementById("btn-prev-exp");t&&t.classList.toggle("active",e==="bio"),n&&n.classList.toggle("active",e==="edu"),i&&i.classList.toggle("active",e==="exp"),it()}function Dt(e){return e.replace(/\n/g,"<br>")}async function Na(){const e=y.dbUser.id,t=document.getElementById("cpBio").value.trim(),n=document.getElementById("cpSubjects").value.trim(),i=document.getElementById("cpEducation").value.trim(),a=document.getElementById("cpExperience").value.trim(),o=document.getElementById("cpPhotoUrl").value.trim(),s=document.getElementById("cpInstagram").value.trim(),d=document.getElementById("cpLinkedin").value.trim(),r={id:e,bio:t,subjects:n,education:i,experience:a,photo_url:o,instagram:s,linkedin:d,updated_at:new Date().toISOString()};localStorage.setItem(`coach_profile_${e}`,JSON.stringify(r));const{error:c}=await g.from("coach_profiles").upsert(r);c?(console.warn("Database save failed, profile saved locally in localStorage:",c),f("Profil yerel tarayıcıya kaydedildi (Veritabanı RLS hatası: "+c.message+")")):f("Profil başarıyla güncellendi ✓")}async function ot(){const e=document.getElementById("view-dev-matches");if(!e)return;e.innerHTML='<div class="loading">Eşleşmeler yükleniyor...</div>';const{data:t,error:n}=await g.from("match_requests").select("*, matched_coach:matched_coach_id(full_name, username)").order("created_at",{ascending:!1});if(n){e.innerHTML=`<div style="padding:20px;color:var(--red)">Eşleşme başvuruları yüklenirken hata oluştu: ${n.message}</div>`;return}const i={pending:"⏳ Bekliyor",matched:"🤝 Eşleştirildi",completed:"✅ Tamamlandı"},a={pending:"rgba(240, 165, 0, 0.15)",matched:"rgba(96, 180, 255, 0.15)",completed:"rgba(62, 207, 142, 0.15)"},o={pending:"var(--accent)",matched:"var(--accent4)",completed:"var(--green)"};e.innerHTML=`
    <div class="card" style="margin-bottom:20px;">
      <h2 style="font-family:'Syne',sans-serif; margin-bottom: 6px;">🤝 Danışan Eşleşme Başvuruları</h2>
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
                  <span style="background:${a[s.status]}; color:${o[s.status]}; font-size:11px; font-weight:700; padding:4px 10px; border-radius:99px; display:inline-block;">
                    ${i[s.status]||s.status}
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
  `}async function Ya(e,t){const{error:n}=await g.from("match_requests").update({status:t}).eq("id",e);n?f("Durum güncellenirken hata: "+n.message):(f("Durum güncellendi ✓"),ot())}async function Ka(e){const t=l.students.find(s=>s.id===e);if(!t)return;const{data:n}=await g.from("student_speeds").select("*").eq("student_id",e),i={};(n||[]).forEach(s=>{i[`${s.exam_type}_${s.subject}`]=s.secs_per_question});const a=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];let o=document.getElementById("speedModal");o||(o=document.createElement("div"),o.id="speedModal",o.className="modal-bg",document.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&o.classList.remove("open")})),o.innerHTML=`<div class="modal modal-lg">
    <button class="modal-close" onclick="cm('speedModal')">×</button>
    <h2>⚡ ${u(t.name)} — Soru Çözme Hızı</h2>
    <p style="font-size:13px;color:var(--text-mid);margin-bottom:16px">Her ders için öğrencinin soru başına harcadığı saniyeyi girin. Görev eklerken süre otomatik hesaplanır.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
      ${a.map(({exam:s,sub:d})=>{const r=`${s}_${d}`,c=i[r]||180,v=Math.floor(c/60);return`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px">
          <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${s}</div>
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">${d}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" id="spd_${r}" value="${c}" min="10" max="600" step="5"
              style="width:70px;background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:13px;font-weight:700;color:var(--text);text-align:center">
            <span style="font-size:11px;color:var(--text-dim)">sn/soru</span>
          </div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${v>0?v+"dk ":""}</div>
        </div>`}).join("")}
    </div>
    <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:16px" onclick="saveAllSpeeds('${e}')">Tümünü Kaydet</button>
  </div>`,C("speedModal")}async function Oa(e){const t=[{exam:"TYT",sub:"Matematik"},{exam:"TYT",sub:"Türkçe"},{exam:"TYT",sub:"Fizik"},{exam:"TYT",sub:"Kimya"},{exam:"TYT",sub:"Biyoloji"},{exam:"TYT",sub:"Geometri"},{exam:"AYT-SAY",sub:"Matematik"},{exam:"AYT-SAY",sub:"Fizik"},{exam:"AYT-SAY",sub:"Kimya"},{exam:"AYT-SAY",sub:"Biyoloji"}];for(const{exam:n,sub:i}of t){const a=`${n}_${i}`,o=document.getElementById("spd_"+a);if(!o)continue;const s=parseInt(o.value)||180;await Et(e,n,i,s)}L("speedModal"),f("Hız ayarları kaydedildi ✓")}function Fa(e){let t=document.getElementById("reportModal");t||(t=document.createElement("div"),t.id="reportModal",t.className="modal-bg",t.innerHTML=`<div class="modal">
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
    </div>`,document.body.appendChild(t),t.addEventListener("click",a=>{a.target===t&&t.classList.remove("open")}),document.getElementById("rpPeriod").addEventListener("change",function(){document.getElementById("rpCustomDates").style.display=this.value==="custom"?"":"none"})),document.getElementById("rpStuId").value=e;const n=new Date,i=new Date(n.getFullYear(),n.getMonth(),1);document.getElementById("rpStart").value=A(i),document.getElementById("rpEnd").value=A(n),document.getElementById("rpNote").value="",C("reportModal")}function Lt(){const e=document.getElementById("rpPeriod").value,t=new Date;if(e==="weekly"){const n=O(0,0);return{start:A(n),end:A(N(n,6))}}else return e==="monthly"?{start:A(new Date(t.getFullYear(),t.getMonth(),1)),end:A(t)}:{start:document.getElementById("rpStart").value,end:document.getElementById("rpEnd").value}}function st(e,t=!1){var k,M,_,P;const n=l.students.find($=>$.id===e);if(!n)return"";const{start:i,end:a}=Lt(),o=document.getElementById("rpNote").value.trim(),s=((k=l.workspace)==null?void 0:k.brand_name)||"Rostrum Akademi",d=((M=l.workspace)==null?void 0:M.brand_color)||"#f0a500",r=((_=y.dbUser)==null?void 0:_.full_name)||"Koç",c=[],v=new Date(i);for(;A(v)<=a;){const $=`${e}_${A(v)}`;(l.tasks[$]||[]).forEach(B=>c.push({...B,date:A(v)})),v.setDate(v.getDate()+1)}const m=c.length,p=c.filter($=>$.done).length,b=m>0?Math.round(p/m*100):0,h=c.filter($=>$.done).reduce(($,B)=>$+Number(B.duration||0),0),x={};c.forEach($=>{const B=$.subject||"Diğer";x[B]||(x[B]={total:0,done:0}),x[B].total++,$.done&&x[B].done++});const T=l.exams.filter($=>$.studentId===e&&$.date>=i&&$.date<=a).sort(($,B)=>$.date.localeCompare(B.date)),E=l.appointments.filter($=>$.studentId===e&&$.date>=i&&$.date<=a).sort(($,B)=>$.date.localeCompare(B.date)),w=`${new Date(i+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})} – ${new Date(a+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}`;let I="";if(T.length>1){const $=Math.max(...T.map(j=>(EXAM_DEFS[j.type]||[]).reduce((H,F)=>{var K;return H+Number(((K=j.nets)==null?void 0:K[F])||0)},0)),1),B=400,z=80,R=Math.min(40,(B-20)/T.length-4);I=`<svg width="${B}" height="${z+30}" style="overflow:visible">
      ${T.map((j,H)=>{const F=(EXAM_DEFS[j.type]||[]).reduce((re,te)=>{var rt;return re+Number(((rt=j.nets)==null?void 0:rt[te])||0)},0),K=Math.max(Math.round(F/$*(z-10)),4),ee=10+H*((B-20)/T.length);return`<rect x="${ee}" y="${z-K}" width="${R}" height="${K}" rx="3" fill="${d}" opacity="0.85"/>
          <text x="${ee+R/2}" y="${z-K-4}" text-anchor="middle" font-size="10" fill="#333">${F.toFixed(0)}</text>
          <text x="${ee+R/2}" y="${z+14}" text-anchor="middle" font-size="9" fill="#666">${u(j.name.replace("Deneme","").replace("TYT","").replace("AYT","").trim()||String(H+1))}</text>`}).join("")}
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
      <div class="brand-sub">Koç: ${u(r)}</div>
    </div>
    <div class="report-title">
      <h1>Performans Raporu</h1>
      <p>${w}</p>
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
    <div class="stat-box"><div class="val" style="color:#16a34a">${p}</div><div class="lbl">Tamamlanan</div></div>
    <div class="stat-box"><div class="val">%${b}</div><div class="lbl">Tamamlanma</div></div>
    <div class="stat-box"><div class="val">${Math.round(h/60)}</div><div class="lbl">Çalışma (saat)</div></div>
  </div>

  <!-- DERS BAZINDA ÇALIŞMA -->
  ${Object.keys(x).length>0?`
  <div class="section">
    <div class="section-title">📚 Ders Bazında Çalışma</div>
    <table>
      <thead><tr><th>Ders</th><th>Toplam</th><th>Tamamlanan</th><th>Oran</th><th></th></tr></thead>
      <tbody>
        ${Object.entries(x).sort(($,B)=>B[1].total-$[1].total).map(([$,B])=>{const z=Math.round(B.done/B.total*100),R=z>=80?"badge-green":z>=50?"badge-yellow":"badge-red";return`<tr>
            <td><strong>${u($)}</strong></td>
            <td>${B.total}</td>
            <td>${B.done}</td>
            <td><span class="badge ${R}">%${z}</span></td>
            <td style="width:120px"><div class="prog-bar"><div class="prog-fill" style="width:${z}%"></div></div></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- DENEMELER -->
  ${T.length>0?`
  <div class="section">
    <div class="section-title">📊 Deneme Sonuçları</div>
    ${I?`<div style="margin-bottom:16px;padding:12px;background:#f8f8f8;border-radius:8px">${I}</div>`:""}
    <table>
      <thead><tr><th>Sınav</th><th>Tarih</th><th>Tür</th>${(EXAM_DEFS[(P=T[0])==null?void 0:P.type]||[]).map($=>`<th>${$}</th>`).join("")}<th>Toplam</th></tr></thead>
      <tbody>
        ${T.map($=>{const B=EXAM_DEFS[$.type]||[],z=B.reduce((R,j)=>{var H;return R+Number(((H=$.nets)==null?void 0:H[j])||0)},0).toFixed(1);return`<tr>
            <td><strong>${u($.name)}</strong></td>
            <td>${new Date($.date+"T12:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</td>
            <td>${u($.type)}</td>
            ${B.map(R=>{var H;const j=Number(((H=$.nets)==null?void 0:H[R])||0);return`<td><span class="badge ${j>=20?"badge-green":j>=12?"badge-yellow":"badge-red"}">${j}</span></td>`}).join("")}
            <td><strong>${z}</strong></td>
          </tr>`}).join("")}
      </tbody>
    </table>
  </div>`:""}

  <!-- RANDEVULAR -->
  ${E.length>0?`
  <div class="section">
    <div class="section-title">📅 Görüşmeler</div>
    <table>
      <thead><tr><th>Tarih</th><th>Saat</th><th>Tür</th><th>Süre</th></tr></thead>
      <tbody>
        ${E.map($=>`<tr>
          <td>${new Date($.date+"T12:00").toLocaleDateString("tr-TR",{weekday:"short",day:"numeric",month:"short"})}</td>
          <td>${$.time}</td>
          <td>${u($.type)}</td>
          <td>${$.duration} dk</td>
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
      <div style="margin-top:10px;font-size:11px;color:#888">— ${u(r)}</div>
    </div>
  </div>`:""}

  <!-- FOOTER -->
  <div class="footer">
    <span>${u(s)} · ${u(r)}</span>
    <span>${u(n.name)} · ${w}</span>
    <span>Rostrum Akademi Platformu</span>
  </div>
</div>
</body>
</html>`}function qa(){const e=document.getElementById("rpStuId").value,t=st(e,!0),n=window.open("","_blank","width=900,height=700");n.document.write(t),n.document.close()}function Ua(){const e=document.getElementById("rpStuId").value;l.students.find(i=>i.id===e);const t=st(e,!1),n=window.open("","_blank");n.document.write(t),n.document.close(),setTimeout(()=>{n.focus(),n.print()},500),L("reportModal"),f('PDF oluşturuluyor — "PDF olarak kaydet" seçin')}async function Ga(){const e=document.getElementById("rpStuId").value,t=l.students.find(s=>s.id===e);if(!t)return;const n=`${window.location.origin}/api/generate-pdf-report?studentId=${e}`,i=`Merhaba, ${t.name} isimli öğrencimizin bu dönemki performans ve gelişim raporu hazırlandı. Aşağıdaki bağlantıdan raporu detaylıca görüntüleyebilirsiniz:

🔗 ${n}`,o=`https://api.whatsapp.com/send?text=${encodeURIComponent(i)}`;window.open(o,"_blank"),L("reportModal"),f("WhatsApp yönlendirmesi açıldı ✓")}function Wa(){let e=document.getElementById("weeklyPDFModal");e||(e=document.createElement("div"),e.id="weeklyPDFModal",e.className="modal-bg",e.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('weeklyPDFModal')">×</button>
      <h2>🖨️ Haftalık Program PDF</h2>
      <div class="field">
        <label>Koç Notu (isteğe bağlı)</label>
        <textarea id="pdfNote" placeholder="Bu haftaki programla ilgili notunuzu ekleyin..." style="min-height:90px"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px" onclick="generateWeeklyPDF()">PDF Oluştur →</button>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})),document.getElementById("pdfNote").value="",C("weeklyPDFModal")}function Va(){document.getElementById("pdfNote").value.trim(),L("weeklyPDFModal"),Ct(l.activeStuId)}function Ct(e,t){var w,I;const n=l.students.find(k=>k.id===e);if(!n)return;const i=(n==null?void 0:n.weekStart)??0,a=O(l.weekOffset,i),o=N(a,6),s=((w=l.workspace)==null?void 0:w.brand_name)||"Rostrum Akademi",d=((I=l.workspace)==null?void 0:I.brand_color)||"#f0a500",r=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],c=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],v={deneme:"#f59e0b",soru:"#60a5fa",konu:"#34d399",diger:"#c084fc"},m={deneme:"Deneme",soru:"Soru Bankası",konu:"Konu Anlatımı",diger:"Diğer"};let p=0,b=0,h=0,x="";for(let k=0;k<7;k++){const M=N(a,k),_=A(M),P=r[(i+k)%7],$=l.tasks[`${e}_${_}`]||[];p+=$.length,b+=$.filter(z=>z.done).length,h+=$.reduce((z,R)=>z+Number(R.duration||0),0);const B=_===A(new Date);x+=`<div style="min-width:0;border-right:1px solid #f0ede8;padding:0 8px">
      <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">${P}</div>
      <div style="font-size:20px;font-weight:900;color:${B?d:"#1a1a1a"};margin-bottom:8px;line-height:1">${M.getDate()}</div>
      ${$.length===0?'<div style="font-size:11px;color:#ddd;padding:8px 0">—</div>':""}
      ${$.map(z=>`<div style="margin-bottom:5px;padding:7px 9px;border-radius:7px;background:${v[z.type]||"#888"}18;border-left:3px solid ${v[z.type]||"#888"}">
        <div style="font-size:9px;font-weight:700;color:${v[z.type]||"#888"};text-transform:uppercase">${m[z.type]||""}${z.exam?" · "+z.exam:""}</div>
        <div style="font-size:11px;font-weight:700;color:#1a1a1a;margin-top:1px;line-height:1.3">${u(z.subject)}</div>
        ${z.note?`<div style="font-size:9px;color:#888;margin-top:1px">${u(z.note.slice(0,40))}</div>`:""}
        <div style="font-size:9px;color:#aaa;margin-top:2px">${z.duration}dk ${z.done?"✓":""}</div>
      </div>`).join("")}
    </div>`}const T=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a1a;padding:20px;}
    @media print{.no-print{display:none!important;}@page{size:A4 landscape;margin:8mm;}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ${d};padding-bottom:12px;margin-bottom:16px">
    <div><div style="font-size:20px;font-weight:800;color:${d}">${u(s)}</div>
    <div style="font-size:13px;font-weight:700;margin-top:2px">Haftalık Çalışma Programı</div></div>
    <div style="text-align:right">
      <div style="font-size:14px;font-weight:800">${u(n.name)}</div>
      <div style="font-size:11px;color:#888;margin-top:2px">${a.getDate()} ${c[a.getMonth()]} – ${o.getDate()} ${c[o.getMonth()]} ${o.getFullYear()}</div>
      <div style="font-size:11px;color:#888">${b}/${p} görev · ${Math.round(h/60)} saat</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0;margin-bottom:16px">${x}</div>
  <div style="display:flex;gap:14px;font-size:10px;color:#888">
    ${Object.entries(m).map(([k,M])=>`<span><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${v[k]};margin-right:4px"></span>${M}</span>`).join("")}
  </div>
  <div class="no-print" style="margin-top:16px">
    <button onclick="window.print()" style="background:${d};color:#0f0e0c;border:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">🖨️ PDF İndir / Yazdır</button>
  </div>
  </body></html>`,E=window.open("","_blank","width=1200,height=850");E.document.write(T),E.document.close(),setTimeout(()=>E.focus(),300)}function Za(){const e="abcdefghijklmnopqrstuvwxyz",t=()=>Array.from({length:3},()=>e[Math.floor(Math.random()*e.length)]).join("");return`https://meet.google.com/${t()}-${t()}-${t()}`}function Ja(){return`https://zoom.us/j/${Math.floor(Math.random()*9e9)+1e9}`}function Xa(e){navigator.clipboard.writeText(e).then(()=>f("Link kopyalandı ✓")).catch(()=>{const t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),f("Link kopyalandı ✓")})}const jt=[{name:"Altın",val:"#f0a500",dim:"rgba(240,165,0,.12)"},{name:"Turuncu",val:"#e8622a",dim:"rgba(232,98,42,.12)"},{name:"Mavi",val:"#4da6ff",dim:"rgba(77,166,255,.12)"},{name:"Yeşil",val:"#3ecf8e",dim:"rgba(62,207,142,.12)"},{name:"Mor",val:"#c084fc",dim:"rgba(192,132,252,.12)"},{name:"Pembe",val:"#f472b6",dim:"rgba(244,114,182,.12)"},{name:"Kırmızı",val:"#ff5c5c",dim:"rgba(255,92,92,.12)"},{name:"Turkuaz",val:"#06b6d4",dim:"rgba(6,182,212,.12)"}];function Pt(){try{const e=JSON.parse(localStorage.getItem("ba_theme")||"{}");e.theme&&document.documentElement.setAttribute("data-theme",e.theme),e.accent&&Rt(e.accent,e.accentDim,!1)}catch{}}function Rt(e,t,n=!0){if(document.documentElement.style.setProperty("--accent",e),document.documentElement.style.setProperty("--accent-dim",t||"rgba(240,165,0,.12)"),n)try{const i=JSON.parse(localStorage.getItem("ba_theme")||"{}");i.accent=e,i.accentDim=t,localStorage.setItem("ba_theme",JSON.stringify(i))}catch{}}function Qa(e){document.documentElement.setAttribute("data-theme",e);try{const t=JSON.parse(localStorage.getItem("ba_theme")||"{}");t.theme=e,localStorage.setItem("ba_theme",JSON.stringify(t))}catch{}document.querySelectorAll(".theme-btn").forEach(t=>{const n=t.dataset.theme===e;t.style.background=n?"var(--accent-dim)":"",t.style.borderColor=n?"var(--accent)":"",t.style.color=n?"var(--accent)":""})}function ei(){let e=document.getElementById("themePanel");if(e){e.remove();return}e=document.createElement("div"),e.id="themePanel";const t=document.documentElement.getAttribute("data-theme")!=="light";e.style.cssText="position:fixed;top:60px;right:12px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:18px;z-index:300;box-shadow:var(--shadow-lg);min-width:230px;animation:fadeUp .2s ease",e.innerHTML=`
    <div style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700;margin-bottom:12px;color:var(--text)">🎨 Tema Ayarları</div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Mod</div>
    <div style="display:flex;gap:6px;margin-bottom:16px">
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="dark" onclick="setTheme('dark')" style="${t?"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)":""}">🌙 Karanlık</button>
      <button class="theme-btn btn btn-ghost btn-sm" data-theme="light" onclick="setTheme('light')" style="${t?"":"background:var(--accent-dim);border-color:var(--accent);color:var(--accent)"}">☀️ Aydınlık</button>
    </div>
    <div style="font-size:11px;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Accent Rengi</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px">
      ${jt.map(n=>`<div onclick="applyAccent('${n.val}','${n.dim}');document.getElementById('themePanel').remove()" title="${n.name}"
        style="width:28px;height:28px;border-radius:8px;background:${n.val};cursor:pointer;transition:transform .1s"
        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''"></div>`).join("")}
    </div>
    <button onclick="document.getElementById('themePanel').remove()" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text-mid);border-radius:8px;padding:7px;font-family:inherit;font-size:12px;cursor:pointer">Kapat</button>`,document.body.appendChild(e),setTimeout(()=>document.addEventListener("click",function n(i){!e.contains(i.target)&&!i.target.closest("[onclick*=openThemePanel]")&&(e.remove(),document.removeEventListener("click",n))},!0),150)}let Pe=[],Ne=!1;function Ht(){const e=document.getElementById("aiChatBubble"),t=document.querySelector(".ai-header-name"),n=document.getElementById("aiMessages");if(!e||!t||!n)return;Pe=[],n.innerHTML=`
    <div class="ai-welcome">
      <div class="ai-welcome-emoji">🎓</div>
      <div class="ai-welcome-title"></div>
      <div class="ai-welcome-sub"></div>
      <div class="ai-quick-btns"></div>
    </div>`;const i=n.querySelector(".ai-welcome"),a=i.querySelector(".ai-welcome-title"),o=i.querySelector(".ai-welcome-sub"),s=i.querySelector(".ai-quick-btns");y.role==="coach"?(e.title="Yapay Zeka Koç Asistanı",t.textContent="Yapay Zeka Koç Asistanı",a.textContent="Merhaba Hocam! Ben Koç Asistanınız",o.textContent="Öğrenci analizleri, veri okuma, ders çalışma programı taslakları hazırlama ve pedagojik konularda size yardımcı olabilirim.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Seçili öğrencinin genel durum analizini yap')">📊 Öğrenci Analizi</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Pedagojik motivasyon teknikleri öner')">💡 Pedagojik Öneri</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zorlanan bir öğrenci için haftalık program şablonu oluştur')">📋 Program Şablonu</button>
    `):y.role==="parent"?(e.title="Yapay Zeka Veli Bilgilendirme Asistanı",t.textContent="Yapay Zeka Veli Asistanı",a.textContent="Merhaba! Ben Veli Asistanıyım",o.textContent="Çocuğunuzun ders çalışma durumu, deneme netleri ve evde ona nasıl destek olabileceğiniz konularında bilgi alabilirsiniz.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çocuğumun bu haftaki gelişimini özetle')">📊 Gelişim Özeti</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Evde verimli ders çalışma ortamı nasıl sağlanır?')">🏠 Ev Ortamı</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Sınav stresiyle başa çıkmak için veli olarak ne yapmalıyım?')">🧘 Stres Yönetimi</button>
    `):(e.title="Yapay Zeka Ders Asistanı",t.textContent="Yapay Zeka Ders Asistanı",a.textContent="Merhaba! Ben Ders Asistanın (Yapay Zeka)",o.textContent="7/24 anlık soru çözümü, konu anlatımı, özet çıkarma ve mini pratik sınav konularında sana yardımcı olan mekanik bir asistanım. Ben bir yapay zekayım ve koçunun yerini alamam; duygusal veya motivasyonel konularda koçuna danışmalısın.",s.innerHTML=`
      <button class="ai-quick-btn" onclick="aiQuickSend('Çözemediğim bir Matematik/Fen sorusu var. Sokratik tarzda, adım adım ipuçları vererek çözmeme yardım eder misin?')">📝 Çözemediğim Soru Var</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bir konunun özetini çıkarmak istiyorum. Hangi ders ve konudan özet çıkarmak istediğimi sorup yardımcı olur musun?')">📖 Konu Özeti Çıkar</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Zayıf olduğum konular üzerinde çalışıp pratik yapmak istiyorum. Hangi derslerden yardıma ihtiyacım olduğunu sorup pratik yapalım.')">🎯 Zayıf Konuları Çalış</button>
      <button class="ai-quick-btn" onclick="aiQuickSend('Bana seçtiğim bir konudan 3 soruluk hızlı bir mini quiz yapar mısın? Soruları tek tek sor.')">⚡ Hızlı Sınav Yap</button>
    `)}function ti(){const e=document.getElementById("aiChatPanel"),t=document.getElementById("aiChatBubble");if(e.classList.contains("open"))e.classList.remove("open"),t.style.display="flex";else{e.classList.add("open"),t.style.display="none";const n=document.getElementById("aiMessages");n.scrollTop=n.scrollHeight,document.getElementById("aiInput").focus()}}function ni(e){document.getElementById("aiInput").value=e,Nt()}function Fe(){var t;const e={};try{const n=l.students.find(s=>s.id===l.activeStuId);n&&(e.studentName=n.name,e.target=n.target||""),y.role==="parent"&&y.childName&&(e.studentName=y.childName);const i=(l.exams||[]).filter(s=>s.studentId===l.activeStuId).slice(-5);i.length&&(e.recentExams=i.map(s=>({name:s.type+" "+(s.name||""),date:s.date||"",nets:s.nets||{}})));let a=[];if(Object.entries(l.tasks||{}).forEach(([s,d])=>{s.startsWith(l.activeStuId+"_")&&(a=a.concat(d))}),a.length){const s=a.filter(d=>d.done).length;e.taskCompletionRate=Math.round(s/a.length*100),e.weeklyTaskCount=a.length}const o=Object.keys(EXAM_DEFS);i.length&&(e.examProfile=((t=i[0])==null?void 0:t.type)||o[0])}catch(n){console.warn("AI context error:",n)}return e}function ne(e,t){Pe.push({role:e,content:t});const n=document.getElementById("aiMessages"),i=n.querySelector(".ai-welcome");i&&i.remove();const a=new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),o=document.createElement("div");o.className=`ai-msg ${e}`,o.innerHTML=`${u(t).replace(/\n/g,"<br>")}<div class="ai-msg-time">${a}</div>`,n.appendChild(o),n.scrollTop=n.scrollHeight}async function Nt(){if(Ne)return;const e=document.getElementById("aiInput"),t=e.value.trim();if(t){e.value="",ne("user",t),Ne=!0,document.getElementById("aiTyping").classList.add("show"),document.getElementById("aiSendBtn").disabled=!0;try{const n=Fe(),i=y.role||"student",a=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1","/api/ai-chat"),o=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:Pe.slice(-10),context:n,userRole:i})});if(o.ok){const s=await o.json();ne("assistant",s.reply||"Yanıt alınamadı.")}else{const s=await ge(t,n,i);ne("assistant",s)}}catch(n){console.error("AI error:",n);try{const i=Fe(),a=await ge(t,i,y.role||"student");ne("assistant",a)}catch(i){localStorage.getItem("gemini_api_key")?ne("assistant",`⚠️ <b>AI Bağlantı Hatası!</b><br>Gemini API hata döndürdü: <b>${u(i.message)}</b><br><br>Lütfen Ayarlar sekmesindeki API anahtarınızın geçerli olduğunu kontrol edin veya tekrar deneyin.`):ne("assistant","⚠️ <b>Yapay Zeka API Anahtarı eksik veya geçersiz!</b><br>Yerel sunucuda çalıştığınız için kendi Gemini API anahtarınızı tanımlamalısınız.<br><br>👉 <b>Ayarlar</b> sekmesine giderek kendi <b>Gemini API Anahtarınızı</b> girin (Google AI Studio'dan tamamen ücretsiz alabilirsiniz).")}}finally{Ne=!1,document.getElementById("aiTyping").classList.remove("show"),document.getElementById("aiSendBtn").disabled=!1}}}let Ye=null;async function Yt(e){try{const t=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${e}`);if(!t.ok)return null;const i=(await t.json()).models||[];let a=i.find(o=>o.name.toLowerCase().includes("flash")&&o.supportedGenerationMethods.includes("generateContent"));if(a||(a=i.find(o=>o.supportedGenerationMethods.includes("generateContent"))),a)return a.name.replace("models/","")}catch(t){console.warn("Auto-detect model failed:",t)}return null}async function ge(e,t,n){var v,m,p,b,h,x;const i=localStorage.getItem("gemini_api_key"),a=i||"AIzaSyB8RN6KO0uCahC_dljPUSBSUa_y9PV6kMDQvCn2JyxKKQaBANw";let o="gemini-1.5-flash";if(i)if(Ye)o=Ye;else{const T=await Yt(i);T&&(Ye=T,o=T,console.log("[Gemini API] Otomatik model tespiti başarılı:",o))}let s='Sen "Rostrum Akademi Yapay Zeka Asistanı"sın. Türkiye eğitim sistemine (YKS, LGS) hakim, rolüne göre öğrencilere, velilere veya koçlara destek veren bir yapay zekasın.';n==="parent"?s+=`
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
Hedef: ${t.target}`);const d=[{role:"user",parts:[{text:s}]},{role:"model",parts:[{text:"Anladım! Rostrum Akademi Yapay Zeka Asistanı olarak hazırım."}]},...Pe.slice(-8).map(T=>({role:T.role==="user"?"user":"model",parts:[{text:T.content}]}))],r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${o}:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:d,generationConfig:{temperature:.7,maxOutputTokens:1500}})});if(!r.ok){let T=`HTTP ${r.status}`;try{const E=await r.json();(v=E==null?void 0:E.error)!=null&&v.message&&(T=E.error.message)}catch{}throw new Error(T)}const c=await r.json();return((x=(h=(b=(p=(m=c==null?void 0:c.candidates)==null?void 0:m[0])==null?void 0:p.content)==null?void 0:b.parts)==null?void 0:h[0])==null?void 0:x.text)||"Yanıt üretilemedi."}let lt="";async function ai(e){const t=l.students.find(i=>i.id===e);if(!t)return;const n=document.getElementById("aiCopilotBtn");n.disabled=!0,n.textContent="⌛ Analiz Ediliyor ve Taslak Oluşturuluyor...";try{const i=O(0,t.weekStart||0);let a=0,o=0,s=0;for(let w=0;w<7;w++){const I=l.tasks[`${t.id}_${A(N(i,w))}`]||[];a+=I.length,o+=I.filter(k=>k.done).length,s+=I.reduce((k,M)=>k+Number(M.duration||0),0)}const d=a>0?Math.round(o/a*100):0,c=(l.exams||[]).filter(w=>w.studentId===e).slice(-5).map(w=>({name:w.type+" "+(w.name||""),date:w.date||"",nets:w.nets||{}})),v={};(l.studentSpeeds||[]).filter(w=>w.student_id===e).forEach(w=>{v[`${w.exam_type}_${w.subject}`]=w.secs_per_question});const m=`Lütfen şu öğrenci için haftalık durum analizi ve öğrenciye gönderilecek haftalık değerlendirme mesajı taslağı oluştur:
Öğrenci Adı: ${t.name}
Hedef: ${t.target||"Belirtilmemiş"}
Bu haftaki görev tamamlama oranı: %${d} (${o}/${a} görev tamamlandı, toplam ${Math.round(s/60)} saat çalışıldı)
Son denemeler: ${JSON.stringify(c)}
Soru Çözüm Hızları (saniye/soru): ${JSON.stringify(v)}

ANALİZ VE TASLAK KURALLARI (TÜRKÇE YAZ):
1. Analiz kısmını koçun göreceği şekilde kısa, net ve yapıcı tut. Zayıf konuları ve sınav netlerindeki değişimleri vurgula.
2. Öğrenciye gönderilecek mesaj taslağını samimi ve destekleyici yaz, fakat koçun kendi yorumlarını ekleyebileceği şablon alanları bırak. Örneğin: "[Buraya öğrenciyle son görüşmenizden özel bir not ekleyin]" veya "[Zorlandığı konuyla ilgili kendi ek önerilerinizi girin]".
3. Mesaj taslağı tamamen Türkçe, samimi ve yapıcı olmalıdır. Asla yapay zeka olduğunu belli eden klişeler içermesin.
4. Çıktıyı tam olarak şu iki etiket arasında yapılandır:
[ANALİZ]
(Koç için durum analizi ve anomali tespiti)
[TASLAK]
(Öğrenciye gönderilecek haftalık değerlendirme taslağı)`;let p="";const b={studentName:t.name,target:t.target,recentExams:c,taskCompletionRate:d,weeklyTaskCount:a};try{const w=await fetch("/api/ai-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:m}],context:b,userRole:"coach"})});w.ok?p=(await w.json()).reply:p=await ge(m,b,"coach")}catch{p=await ge(m,b,"coach")}let h="Analiz üretilemedi.",x="Taslak üretilemedi.";const T=p.indexOf("[ANALİZ]"),E=p.indexOf("[TASLAK]");T!==-1&&E!==-1?T<E?(h=p.substring(T+8,E).trim(),x=p.substring(E+8).trim()):(x=p.substring(E+8,T).trim(),h=p.substring(T+8).trim()):x=p,document.getElementById("aiCopilotAnalysisBox").innerHTML=`<b>📊 Yapay Zeka Durum Analizi:</b><br>${h.replace(/\n/g,"<br>")}`,document.getElementById("aiCopilotTextarea").value=x,lt=x,document.getElementById("aiCopilotResultArea").style.display="block",document.getElementById("aiCopilotSendBtn").disabled=!0,document.getElementById("aiCopilotEditWarning").style.display="inline"}catch(i){console.error("generateAICopilotDraft error:",i),f("Taslak oluşturulurken hata: "+i.message)}finally{n.disabled=!1,n.textContent="🤖 Durum Analizi Yap ve Taslak Oluştur"}}function ii(){const e=document.getElementById("aiCopilotTextarea").value.trim(),t=document.getElementById("aiCopilotSendBtn"),n=document.getElementById("aiCopilotEditWarning");e&&e!==lt?(t.disabled=!1,n.style.display="none"):(t.disabled=!0,n.style.display="inline")}async function oi(e){var i;const t=document.getElementById("aiCopilotTextarea").value.trim();if(!t)return;const n=document.getElementById("aiCopilotSendBtn");n.disabled=!0,n.textContent="Gönderiliyor...";try{const a=y.coachId||((i=l.students.find(d=>d.id===e))==null?void 0:i.coachId),{data:o,error:s}=await g.from("messages").insert({student_id:e,coach_id:a,from_role:"coach",text:t,read:!1}).select().single();if(s)throw s;l.messages[e]||(l.messages[e]=[]),l.messages[e].push({_id:o.id,from:"coach",text:t,time:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}),read:!1}),f("Taslak mesaj başarıyla düzenlendi ve öğrenciye gönderildi!"),document.getElementById("aiCopilotResultArea").style.display="none",document.getElementById("aiCopilotTextarea").value="",lt=""}catch(a){console.error("sendCopilotDraft error:",a),f("Gönderim hatası: "+a.message),n.disabled=!1}finally{n.textContent="✍️ Düzenlemeyi Kaydet ve Öğrenciye Gönder"}}function Kt(){const e=l.students.find(d=>d.id===l.activeStuId),t=y.childName||(e==null?void 0:e.name)||"Öğrenci",n=document.getElementById("view-parent-home");if(!n)return;let i=[];Object.entries(l.tasks||{}).forEach(([d,r])=>{d.startsWith(l.activeStuId+"_")&&(i=i.concat(r))});const a=i.filter(d=>d.done).length,o=i.length?Math.round(a/i.length*100):0,s=(l.exams||[]).filter(d=>d.studentId===l.activeStuId).slice(-3);n.innerHTML=`
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
          <div style="font-size:32px;font-weight:800;color:var(--blue)">${a}/${i.length}</div>
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
        ${s.map(d=>{const r=Object.values(d.nets||{}).reduce((c,v)=>c+(parseFloat(v)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(d.name||d.type)}</div><div style="font-size:11px;color:var(--text-mid)">${d.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${r.toFixed(1)} net</div>
          </div>`}).join("")}
      </div>`:""}
      
      <div class="card" style="padding:20px;background:linear-gradient(135deg,rgba(240,165,0,.05),rgba(62,207,142,.05))">
        <div style="font-size:15px;font-weight:700;margin-bottom:8px">🤖 AI Asistandan Yardım Alın</div>
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:12px">Çocuğunuzun ilerlemesi hakkında anında rapor alabilirsiniz.</div>
        <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;width:100%;padding:12px">🤖 AI Asistan ile Konuş</button>
      </div>
    </div>`}function Ot(){const e=document.getElementById("view-parent-progress");if(!e)return;const t=l.students.find(o=>o.id===l.activeStuId),n=y.childName||(t==null?void 0:t.name)||"Öğrenci",i=(l.exams||[]).filter(o=>o.studentId===l.activeStuId);let a=[];Object.entries(l.tasks||{}).forEach(([o,s])=>{o.startsWith(l.activeStuId+"_")&&(a=a.concat(s))}),e.innerHTML=`
    <div style="padding:24px;max-width:800px;margin:0 auto">
      <div style="font-size:20px;font-weight:800;margin-bottom:20px">📊 ${u(n)} - İlerleme Raporu</div>
      
      <div class="card" style="padding:20px;margin-bottom:16px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📋 Haftalık Görevler</div>
        ${a.length?a.slice(-10).map(o=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:20px;height:20px;border-radius:50%;background:${o.done?"var(--green)":"var(--surface2)"};border:2px solid ${o.done?"var(--green)":"var(--border)"};display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">${o.done?"✓":""}</div>
            <div style="flex:1;font-size:13px">${u(o.subject)} <span style="font-size:11px;color:var(--text-dim)">(${be(o.type)})</span></div>
            <div style="font-size:11px;color:var(--text-mid)">${o.done?"Tamamlandı":"Bekliyor"}</div>
          </div>`).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz görev bulunmuyor.</div>'}
      </div>
      
      <div class="card" style="padding:20px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">📊 Deneme Geçmişi</div>
        ${i.length?i.slice(-10).map(o=>{const s=Object.values(o.nets||{}).reduce((d,r)=>d+(parseFloat(r)||0),0);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
            <div><div style="font-weight:600;font-size:13px">${u(o.name||o.type)}</div><div style="font-size:11px;color:var(--text-mid)">${o.date||""}</div></div>
            <div style="font-weight:800;color:var(--accent)">${s.toFixed(1)} net</div>
          </div>`}).join(""):'<div style="text-align:center;color:var(--text-mid);padding:20px">Henüz deneme sonucu yok.</div>'}
      </div>
    </div>`}function Ft(){const e=document.getElementById("view-parent-ai");e&&(e.innerHTML=`
    <div style="padding:24px;max-width:600px;margin:0 auto;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🤖</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px">AI Koç Asistanı</div>
      <div style="font-size:13px;color:var(--text-mid);margin-bottom:24px;line-height:1.7">Çocuğunuzun eğitim süreci hakkında sorular sorun, deneme analizleri isteyin veya öneriler alın.</div>
      <button class="btn btn-accent" onclick="toggleAIChat()" style="justify-content:center;padding:14px 32px;font-size:15px">💬 AI Asistan ile Konuşmaya Başla</button>
    </div>`)}async function si(){var p;const e=document.getElementById("smId").value,t=document.getElementById("smName").value.trim(),n=document.getElementById("smUsername").value.trim().toLowerCase(),i=document.getElementById("smPass").value,a=document.getElementById("smRole").value,o=document.getElementById("smTarget").value.trim(),s=((p=document.querySelector(".color-opt.sel"))==null?void 0:p.dataset.c)||"#f0a500",d=Number(document.getElementById("smWeekStart").value),r=Number(document.getElementById("smProg").value);if(!t||!n||!i)return f("Ad, kullanıcı adı ve şifre zorunlu!");const c=i.length===64?i:await oe(i),v=n+"@rostrumakademi.com",m={full_name:t,username:n,password_hash:c,role:a,target:o,color:s,week_start:d,progress:r};if(S(!0),e){const{error:b}=await g.from("users").update(m).eq("id",e);if(S(!1),b)return f("Hata: "+b.message);f("Kullanıcı güncellendi ✓")}else{const{data:b,error:h}=await g.rpc("create_new_user",{p_email:v,p_password:i,p_full_name:t,p_username:n,p_role:a,p_target:o,p_color:s,p_progress:r,p_week_start:d,p_coach_id:null,p_institution_id:null,p_exam_profile:"YKS"});if(S(!1),h)return f("Hata: "+h.message);f("Kullanıcı başarıyla oluşturuldu ✓")}L("studentModal"),Le()}let ze=[],V={search:"",exam:"",subject:""};function dt(e){const t=V.search;return e.filter(n=>!(t&&!n.name.toLowerCase().includes(t)&&!(n.publisher||"").toLowerCase().includes(t)||V.exam&&n.exam_type!==V.exam||V.subject&&n.subject!==V.subject))}function li(){var a,o,s;V.search=(((a=document.getElementById("crSearch"))==null?void 0:a.value)||"").toLowerCase().trim(),V.exam=((o=document.getElementById("crExam"))==null?void 0:o.value)||"",V.subject=((s=document.getElementById("crSubject"))==null?void 0:s.value)||"";const e=document.getElementById("cr-tab-content");if(!e)return;const t=document.querySelector(".cr-tab.active"),n=(t==null?void 0:t.id)==="crt-playlists"?"playlists":(t==null?void 0:t.id)==="crt-analytics"?"analytics":"books",i=dt(ze);e.innerHTML=Re(n,i)}function Re(e,t){const n=t.filter(a=>a.resource_type==="book"),i=t.filter(a=>a.resource_type==="playlist");return e==="books"?`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800">Soru Bankaları <span style="font-size:12px;font-weight:500;color:var(--text-dim)">${n.length} kaynak</span></h3>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'book')">+ Soru Bankası</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${n.length?n.map(a=>`
          <div class="card" style="padding:14px 16px;border:1px solid ${a.coach_id?"var(--accent)":"var(--border)"}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;color:${a.coach_id?"var(--accent)":"var(--blue)"};font-weight:700;margin-bottom:2px;letter-spacing:.4px;text-transform:uppercase">${a.exam_type} · ${a.subject}</div>
                <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(a.name)}</div>
                <div style="font-size:11px;color:var(--text-dim);margin-top:3px">${u(a.publisher)} · ${(a.tests||[]).length} test · <span style="color:${a.coach_id?"var(--accent)":"var(--text-dim)"}">${a.coach_id?"Özel":"Global"}</span></div>
              </div>
              ${a.coach_id?`<div style="display:flex;gap:4px;flex-shrink:0"><button class="btn btn-ghost btn-xs" onclick="openResourceModalCoach('${a.id}','book')">✏️</button><button class="btn btn-danger btn-xs" onclick="deleteResourceCoach('${a.id}')">🗑</button></div>`:""}
            </div>
          </div>`).join(""):'<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">Kaynak bulunamadı.</div>'}
      </div>`:e==="playlists"?`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800">Oynatma Listeleri <span style="font-size:12px;font-weight:500;color:var(--text-dim)">${i.length} kaynak</span></h3>
        <div style="display:flex;gap:8px">
          <label class="btn btn-ghost btn-sm" style="position:relative;cursor:pointer">📥 Excel'den Yükle<input type="file" accept=".xlsx,.xls,.csv" onchange="importResourcesFromExcel(event)" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label>
          <button class="btn btn-accent btn-sm" onclick="openResourceModalCoach(null,'playlist')">+ Playlist Ekle</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
        ${i.length?i.map(a=>`
          <div class="card" style="padding:14px 16px;border:1px solid ${a.coach_id?"var(--accent)":"var(--border)"}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;color:${a.coach_id?"var(--accent)":"var(--blue)"};font-weight:700;margin-bottom:2px;letter-spacing:.4px;text-transform:uppercase">${a.exam_type} · ${a.subject}</div>
                <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u(a.name)}</div>
                <div style="font-size:11px;color:var(--text-dim);margin-top:3px">${u(a.publisher)} · ${(a.tests||[]).length} video · <span style="color:${a.coach_id?"var(--accent)":"var(--text-dim)"}">${a.coach_id?"Özel":"Global"}</span></div>
              </div>
              ${a.coach_id?`<div style="display:flex;gap:4px;flex-shrink:0"><button class="btn btn-ghost btn-xs" onclick="openResourceModalCoach('${a.id}','playlist')">✏️</button><button class="btn btn-danger btn-xs" onclick="deleteResourceCoach('${a.id}')">🗑</button></div>`:""}
            </div>
          </div>`).join(""):'<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">Kaynak bulunamadı.</div>'}
      </div>`:`
      <div style="margin-bottom:16px">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:4px">Kaynak Analitiği Raporu</h3>
        <p style="font-size:11px;color:var(--text-dim)">Öğrencilerinizin en sık kullandığı ve en yüksek tamamlama oranına sahip kaynakları inceleyin.</p>
      </div>
      <div class="analytics-grid">
        ${qt(t).map(o=>{const s=o.totalCount>0?Math.round(o.doneCount/o.totalCount*100):0,d=s>=80?"var(--green)":s>=50?"var(--accent)":"var(--text-dim)";return`<div class="analytics-card">
            <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">${o.exam_type} · ${o.subject}</div>
            <div style="font-size:14px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:8px">${u(o.name)}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-mid);margin-bottom:6px"><span>Tamamlama</span><span style="font-weight:700;color:${d}">%${s}</span></div>
            <div style="height:5px;background:var(--surface3);border-radius:99px;overflow:hidden;margin-bottom:10px"><div style="height:100%;width:${s}%;background:${d};border-radius:99px"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim)"><span>Atanma: <b>${o.assignedCount}</b></span><span>Öğrenci: <b>${o.studentsCount}</b></span></div>
          </div>`}).join("")||'<div style="grid-column:span 3;text-align:center;padding:40px;color:var(--text-dim)">Kayıtlı performans verisi bulunamadı.</div>'}
      </div>`}async function Ee(){const e=document.getElementById("view-coach-resources");if(!e)return;S(!0);const{data:t,error:n}=await g.from("resources").select("*").or(`coach_id.eq.${y.coachId},coach_id.is.null`).order("resource_type,exam_type,subject,name");S(!1),n&&console.error(n),ze=t||[],V={search:"",exam:"",subject:""};let i="books";const a=document.querySelector(".cr-tab.active");a&&(a.id==="crt-playlists"?i="playlists":a.id==="crt-analytics"&&(i="analytics")),e.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <h2 style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800">Kaynaklarım</h2>
        <p style="font-size:12px;color:var(--text-mid);margin-top:2px">Soru bankaları, video listeleri ve kaynak analitiği.</p>
      </div>
    </div>

    <div class="cr-tabs">
      <button class="cr-tab ${i==="books"?"active":""}" id="crt-books" onclick="switchCRTab('books')">Soru Bankaları</button>
      <button class="cr-tab ${i==="playlists"?"active":""}" id="crt-playlists" onclick="switchCRTab('playlists')">Oynatma Listeleri</button>
      <button class="cr-tab ${i==="analytics"?"active":""}" id="crt-analytics" onclick="switchCRTab('analytics')">Kaynak Analizi</button>
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
        <option>Coğrafya</option><option>Felsefe</option><option>Din Kültürü</option>
      </select>
    </div>

    <div id="cr-tab-content">
      ${Re(i,ze)}
    </div>`}function di(e){var n;document.querySelectorAll(".cr-tab").forEach(i=>i.classList.remove("active")),(n=document.getElementById("crt-"+e))==null||n.classList.add("active");const t=dt(ze);document.getElementById("cr-tab-content").innerHTML=Re(e,t)}function qt(e){const t={};return e.forEach(n=>{t[n.name]={name:n.name,exam_type:n.exam_type,subject:n.subject,assignedCount:0,totalCount:0,doneCount:0,students:new Set}}),Object.entries(l.tasks).forEach(([n,i])=>{const a=n.split("_")[0];i.forEach(o=>{e.forEach(s=>{if(o.subject&&o.subject.includes(s.name)){const d=t[s.name];d&&(d.assignedCount++,d.students.add(a),o.task_items&&Array.isArray(o.task_items)?o.task_items.forEach(r=>{d.totalCount++,(r.done||o.done)&&d.doneCount++}):(d.totalCount++,o.done&&d.doneCount++))}})})}),Object.values(t).map(n=>({...n,studentsCount:n.students.size})).filter(n=>n.assignedCount>0).sort((n,i)=>i.assignedCount-n.assignedCount)}function ri(e,t="book"){const n=t==="playlist";let i=document.getElementById("coachResourceModal");i||(i=document.createElement("div"),i.id="coachResourceModal",i.className="modal-bg",i.innerHTML=`<div class="modal modal-lg">
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
            <option>Coğrafya</option><option>Felsefe</option><option>Din Kültürü</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Yayınevi / Hoca</label><input id="crmPublisher" placeholder="Karakök, Eyüp B..."></div>
        <div class="field"><label>Kaynak Adı</label><input id="crmName" placeholder="Soru Bankası / Kamp Adı"></div>
      </div>
      
      <div id="crmYtImportBox" style="background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px; margin-bottom:12px; display:none">
        <div style="font-size:12px; font-weight:700; margin-bottom:6px">YouTube'dan Otomatik Çek</div>
        <div style="display:flex; gap:6px">
          <input id="crmYtUrl" placeholder="Playlist URL..." style="flex:1; font-size:11px">
          <button type="button" class="btn btn-accent btn-xs" onclick="fetchYtPlaylistCoach()">Çek</button>
        </div>
        <div id="crmYtStatus" style="font-size:11px; color:var(--text-mid); margin-top:4px"></div>
      </div>

      <div class="field">
        <label id="crmTestsLabel">Testler</label>
        <textarea id="crmTests" style="min-height:180px; font-size:12px; font-family:monospace" placeholder="Format:
Sayılar - Test 1 | 12
Sayılar - Test 2 | 14"></textarea>
      </div>
      <button class="btn btn-accent" style="width:100%; justify-content:center; padding:12px; margin-top:4px" onclick="saveResourceCoach()">Kaydet</button>
    </div>`,document.body.appendChild(i),i.addEventListener("click",a=>{a.target===i&&i.classList.remove("open")})),document.getElementById("crmId").value=e||"",document.getElementById("crmType").value=t,document.getElementById("crmTitle").textContent=(e?"Kaynağı Düzenle":"Kaynak Ekle")+(n?" — Playlist":" — Soru Bankası"),document.getElementById("crmTestsLabel").innerHTML=n?'Videolar <span style="color:var(--text-dim);font-weight:400">(Format: Video Adı | Link | Süre(dk))</span>':'Testler <span style="color:var(--text-dim);font-weight:400">(Format: Test Adı | Soru Sayısı)</span>',document.getElementById("crmTests").placeholder=n?`Ders 1 | https://youtube.com/watch?v=xxx | 45
Ders 2 | https://youtube.com/watch?v=yyy | 38`:`Sayılar - Test 1 | 12
Sayılar - Test 2 | 14`,document.getElementById("crmYtImportBox").style.display=n&&!e?"":"none",document.getElementById("crmYtUrl").value="",document.getElementById("crmYtStatus").textContent="",e?g.from("resources").select("*").eq("id",e).single().then(({data:a})=>{if(a){document.getElementById("crmExam").value=a.exam_type,document.getElementById("crmSubject").value=a.subject,document.getElementById("crmPublisher").value=a.publisher||"",document.getElementById("crmName").value=a.name||"";const o=a.tests||[];n?document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.url||""} | ${s.soru||0}`).join(`
`):document.getElementById("crmTests").value=o.map(s=>`${s.label||s} | ${s.soru||0}`).join(`
`)}}):(document.getElementById("crmExam").value="TYT",document.getElementById("crmSubject").value="Matematik",document.getElementById("crmPublisher").value="",document.getElementById("crmName").value="",document.getElementById("crmTests").value=""),C("coachResourceModal")}async function ci(){const e=document.getElementById("crmYtUrl").value.trim(),t=document.getElementById("crmYtStatus");if(!e)return t.innerHTML='<span style="color:var(--red)">⚠️ Playlist URL girin</span>';const n=e.match(/[?&]list=([^&]+)/);if(!n)return t.innerHTML='<span style="color:var(--red)">⚠️ list= parametresi bulunamadı</span>';const i=n[1];t.innerHTML="⏳ Çekiliyor...";try{let a=[],o="";do{let s=`/api/youtube?playlistId=${i}`;o&&(s+=`&pageToken=${o}`);const d=await fetch(s);if(!d.ok)throw new Error("Playlist çekilemedi.");const r=await d.json();r.items&&(a=a.concat(r.items)),o=r.nextPageToken||""}while(o&&a.length<200);document.getElementById("crmTests").value=a.map(s=>`${s.title} | ${s.url} | ${s.duration}`).join(`
`),t.innerHTML=`<span style="color:var(--green)">✓ ${a.length} video çekildi!</span>`}catch(a){t.innerHTML=`<span style="color:var(--red)">⚠️ Hata: ${a.message}</span>`}}async function mi(){const e=document.getElementById("crmName").value.trim(),t=document.getElementById("crmSubject").value;if(!e||!t)return f("Ad ve ders zorunlu!");const n=document.getElementById("crmId").value,i=document.getElementById("crmType").value==="playlist",a=document.getElementById("crmTests").value.split(`
`).map(d=>d.trim()).filter(Boolean);let o=[];i?o=a.map(d=>{const r=d.split("|").map(c=>c.trim());return{label:r[0]||"",url:r[1]||"",topic:"",soru:parseInt(r[2])||0}}):o=a.map(d=>{const r=d.split("|").map(c=>c.trim());return{label:r[0]||"",soru:parseInt(r[1])||0}});const s={exam_type:document.getElementById("crmExam").value,subject:t,publisher:document.getElementById("crmPublisher").value.trim(),year:new Date().getFullYear(),name:e,tests:o,active:!0,resource_type:i?"playlist":"book",coach_id:y.coachId};S(!0),n?(await g.from("resources").update(s).eq("id",n),f("Güncellendi ✓")):(await g.from("resources").insert(s),f("Kaynak eklendi ✓")),S(!1),L("coachResourceModal"),J=!1,Ee()}async function pi(e){confirm("Bu kaynağı silmek istediğinizden emin misiniz?")&&(S(!0),await g.from("resources").delete().eq("id",e),S(!1),f("Silindi"),J=!1,Ee())}function ui(e){const t=e.target.files[0];if(!t)return;S(!0);const n=new FileReader;n.onload=async i=>{try{const a=new Uint8Array(i.target.result),o=XLSX.read(a,{type:"array"}),s=o.SheetNames[0],d=o.Sheets[s],r=XLSX.utils.sheet_to_json(d);if(r.length===0)return S(!1),f("Excel dosyası boş!");const c={};r.forEach(p=>{const b=p["Kaynak Adı"]||p.Name||p["Kitap Adı"]||p["Playlist Adı"]||"",x=(p["Kaynak Türü"]||p.Type||p.Tür||"book").toLowerCase().includes("playlist")?"playlist":"book",T=p.Yayınevi||p.Publisher||p.Hoca||"",E=p.Sınav||p.Exam||"TYT",w=p.Ders||p.Subject||"",I=p["Öğe Adı"]||p.Test||p.Video||p["Test Adı"]||p["Video Adı"]||"",k=parseInt(p["Soru Sayısı"]||p.Soru||p.Süre||p["Süre (dk)"]||0),M=p.URL||p.Link||"";if(!b||!w||!I)return;const _=`${b}_${E}_${w}_${x}`;c[_]||(c[_]={exam_type:E,subject:w,publisher:T,name:b,resource_type:x,tests:[]}),c[_].tests.push({label:I,soru:k,url:M,topic:""})});const v=Object.values(c);if(v.length===0)return S(!1),f("Uyumlu veri bulunamadı! Sütun başlıklarını kontrol edin.");let m=0;for(const p of v){const{error:b}=await g.from("resources").insert({...p,year:new Date().getFullYear(),active:!0,coach_id:y.coachId});b||m++}S(!1),f(`✓ Excel'den ${m} kaynak başarıyla aktarıldı!`),J=!1,Ee()}catch(a){S(!1),console.error(a),f("Excel okuma hatası: "+a.message)}},n.readAsArrayBuffer(t)}function vi(e){const t=e.target.files[0];if(!t)return;S(!0);const n=new FileReader;n.onload=async i=>{try{const a=new Uint8Array(i.target.result),o=XLSX.read(a,{type:"array"}),s=o.Sheets[o.SheetNames[0]],d=XLSX.utils.sheet_to_json(s);if(d.length===0)return S(!1),f("Excel dosyası boş!");let r=0;for(const c of d){const v=c["Ad Soyad"]||c.Ad||c.Name||"",m=c.Hedef||c.Target||"Hedef belirtilmemiş";let p=c["Kullanıcı Adı"]||c.Username||"",b=c.Şifre||c.Password||STU_DEFAULT_PASS;if(!v)continue;p||(p=v.toLowerCase().replace(/\s+/g,"")+Math.floor(Math.random()*100),p=ve(p));const h=await oe(b),x=p+"@rostrumakademi.com",{data:T,error:E}=await g.rpc("create_new_user",{p_email:x,p_password:b,p_full_name:v,p_username:p,p_role:"student",p_target:m,p_color:"#4da6ff",p_progress:0,p_week_start:0,p_coach_id:y.coachId,p_institution_id:null,p_exam_profile:"YKS"});!E&&T&&(l.students.push({id:T,name:v,target:m,color:"#4da6ff",progress:0,pass:h,weekStart:0,username:p}),r++)}S(!1),f(`✓ Excel'den ${r} öğrenci başarıyla eklendi!`),Z(),xe()}catch(a){S(!1),console.error(a),f("Excel okuma hatası: "+a.message)}},n.readAsArrayBuffer(t)}function Ut(e){if(!l.activeStuId||!D)return null;let t=null;return Object.entries(l.tasks).forEach(([n,i])=>{n.startsWith(l.activeStuId+"_")&&i.forEach(a=>{a.subject&&a.subject.includes(D.name)&&(a.task_items&&Array.isArray(a.task_items)?a.task_items.forEach(o=>{(o.label||o)===e&&(o.done||a.done?t="done":t!=="done"&&(t="pending"))}):a.note&&a.note.includes(e)&&(a.done?t="done":t!=="done"&&(t="pending")))})}),t}async function yi(e,t){var r;const i=`${l.activeStuId}_${e}`,a=(r=l.tasks[i])==null?void 0:r[t];if(!a)return;ye=e,_editingTaskId=a._id,D=null,document.querySelector("#taskModal h2").innerHTML=`Görev Düzenle — <span id="tmDay">${e}</span>`,document.querySelector("#taskModal .btn-accent").textContent="Güncelle",document.getElementById("tmType").value=a.type,document.getElementById("tmExam").value=a.exam||"",document.getElementById("tmDuration").value=a.duration||60,document.getElementById("tmNote").value=a.note||"";const o=a.exam||"",s=a.type;{const c=document.getElementById("tmSubjectSel"),v=document.getElementById("tmSubjectFree");document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none";const m=document.getElementById("tmTestSummary");m&&(m.style.display="none"),o&&typeof SUBJECT_MAP<"u"&&SUBJECT_MAP[o]?(c.innerHTML=SUBJECT_MAP[o].map(h=>`<option value="${h}">${h}</option>`).join(""),c.style.display="",v.style.display="none"):(c.style.display="none",v.style.display="");const p=(s==="soru"||s==="konu")&&o;document.getElementById("soruBankasiWrap").style.display=p?"":"none";const b=document.getElementById("tmBookSearch");b&&(b.placeholder=s==="konu"?"Hoca veya playlist ara...":"Kitap veya yayınevi ara...")}if((s==="soru"||s==="konu")&&o){const c=document.getElementById("tmSubjectSel");let v="",m=a.subject;if(a.subject.includes(" - ")){const x=a.subject.split(" - ");v=x[0].trim(),m=x.slice(1).join(" - ").trim()}v&&SUBJECT_MAP[o]&&SUBJECT_MAP[o].includes(v)&&(c.value=v),document.getElementById("tmBookVal").value=m,document.getElementById("tmBookSearch").value=m,S(!0),await wt(),S(!1);const p=`${o}_${v}`;let h=(q[p]||[]).find(x=>x.name===m);if(h||Object.values(q).forEach(x=>{const T=x.find(E=>E.name===m);T&&(h=T)}),h){D=h,document.getElementById("tmTestWrap").style.display="",Ve();const x=(a.task_items||[]).map(E=>E.label||E);document.querySelectorAll("#tmTestList input[type=checkbox]").forEach(E=>{var k;const w=parseInt(E.value),I=((k=D.testler[w])==null?void 0:k.label)||D.testler[w];x.includes(I)?E.checked=!0:E.checked=!1}),le()}}else{const c=document.getElementById("tmSubjectSel"),v=document.getElementById("tmSubjectFree");c.style.display!=="none"?c.value=a.subject:v.value=a.subject,document.getElementById("tmBookVal").value="",document.getElementById("tmBookSearch").value="",document.getElementById("tmBookList").style.display="none",document.getElementById("tmTestWrap").style.display="none"}C("taskModal")}async function gi(){const e=prompt("Şablon adı giriniz:");if(!e)return;const t=l.students.find(s=>s.id===l.activeStuId),n=(t==null?void 0:t.weekStart)??0,i=O(l.weekOffset,n),a=[];for(let s=0;s<7;s++){const d=N(i,s),r=A(d),c=`${l.activeStuId}_${r}`;(l.tasks[c]||[]).forEach(m=>{a.push({day_index:s,type:m.type,exam_type:m.exam||null,subject:m.subject,duration:m.duration,note:m.note||"",task_items:m.task_items||null})})}if(a.length===0)return f("Bu haftada kaydedilecek görev bulunmuyor!");S(!0);const{error:o}=await g.from("program_templates").insert({coach_id:y.coachId,name:e,description:`${a.length} görev içeriyor.`,tasks:a});if(S(!1),o)return f("Şablon kaydedilemedi: "+o.message);f("Hafta şablon olarak kaydedildi ✓")}async function fi(){S(!0);const{data:e,error:t}=await g.from("program_templates").select("*").eq("coach_id",y.coachId);if(S(!1),t)return f("Şablonlar yüklenemedi.");if(!e||e.length===0)return f("Kayıtlı şablonunuz bulunmuyor. Önce haftayı şablon olarak kaydedin.");let n=document.getElementById("applyTemplateModal");n||(n=document.createElement("div"),n.id="applyTemplateModal",n.className="modal-bg",n.innerHTML=`<div class="modal">
      <button class="modal-close" onclick="cm('applyTemplateModal')">×</button>
      <h2>Şablon Uygula</h2>
      <div class="field"><label>Şablon Seçin</label>
        <select id="atmSelect"></select>
      </div>
      <button class="btn btn-accent" style="width:100%;justify-content:center;padding:12px;margin-top:12px" onclick="confirmApplyTemplate()">Uygula</button>
    </div>`,document.body.appendChild(n),n.addEventListener("click",i=>{i.target===n&&n.classList.remove("open")})),document.getElementById("atmSelect").innerHTML=e.map(i=>`<option value="${i.id}">${u(i.name)} (${i.tasks.length} Görev)</option>`).join(""),C("applyTemplateModal")}async function bi(){const e=document.getElementById("atmSelect").value;if(!e)return;S(!0);const{data:t,error:n}=await g.from("program_templates").select("*").eq("id",e).single();if(n||!t)return S(!1),f("Şablon yüklenemedi.");const i=l.students.find(s=>s.id===l.activeStuId),a=(i==null?void 0:i.weekStart)??0,o=O(l.weekOffset,a);for(const s of t.tasks){const d=A(N(o,s.day_index)),r={student_id:l.activeStuId,coach_id:y.coachId,date:d,type:s.type,exam_type:s.exam_type,subject:s.subject,duration:s.duration,note:s.note,done:!1,task_items:s.task_items},{data:c,error:v}=await g.from("tasks").insert(r).select().single();if(!v&&c){const m=`${l.activeStuId}_${d}`;l.tasks[m]||(l.tasks[m]=[]),l.tasks[m].push({_id:c.id,type:c.type,exam:c.exam_type,subject:c.subject,duration:c.duration,note:c.note,done:!1,student_note:"",task_items:c.task_items})}}S(!1),L("applyTemplateModal"),Y(),f("Şablon başarıyla uygulandı ✓")}function xi(e,t){var o;const i=`${l.activeStuId}_${e}`,a=(o=l.tasks[i])==null?void 0:o[t];a&&(_clipboardTask={type:a.type,exam:a.exam,subject:a.subject,duration:a.duration,note:a.note,task_items:a.task_items},f("Görev panoya kopyalandı ✓"),Y())}async function hi(e){if(!_clipboardTask)return;const t={student_id:l.activeStuId,coach_id:y.coachId,date:e,type:_clipboardTask.type,exam_type:_clipboardTask.exam||null,subject:_clipboardTask.subject,duration:_clipboardTask.duration,note:_clipboardTask.note,done:!1,task_items:_clipboardTask.task_items};S(!0);const{data:n,error:i}=await g.from("tasks").insert(t).select().single();if(S(!1),i)return f("Hata: "+i.message);const a=`${l.activeStuId}_${e}`;l.tasks[a]||(l.tasks[a]=[]),l.tasks[a].push({_id:n.id,type:n.type,exam:n.exam_type,subject:n.subject,duration:n.duration,note:n.note,done:!1,student_note:"",task_items:n.task_items}),_clipboardTask=null,Y(),f("Görev yapıştırıldı ✓")}Pt();et();checkOAuthSession();window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==currentTab){if(!e){e={coach:"home",student:"portal",developer:"dev-dashboard",parent:"parent-home"}[y.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&G(e,!1)}});window.toggleSidebar=mn;window.setupShell=pn;window.switchTab=G;window.renderHome=bt;window.renderStudentsSearch=xe;window.filterStudentSearch=un;window.openStudentDetail=xt;window.openStudentProgram=Ge;window.openStudentExams=vn;window.openStudentAppointments=yn;window.renderProfile=ht;window.saveProfile=gn;window.renderSettings=kt;window.saveGeminiKey=fn;window.renderProgram=Y;window.selectStu=bn;window.chWeek=xn;window.goToday=hn;window.openClearWeekModal=kn;window.toggleDaySel=wn;window.toggleAllDays=$n;window.confirmClearDays=En;window.openTaskModal=Tn;window.loadResources=wt;window.updateSubjectList=We;window.updateBookList=In;window.renderBookList=Me;window.filterBooks=Sn;window.selectBook=_n;window.renderTestList=Ve;window.selectAllTests=Bn;window.clearAllTests=zn;window.updateTestSummary=le;window.selectModalSpeed=Mn;window.applyDuration=An;window.loadStudentSpeeds=$t;window.saveStudentSpeed=Et;window.saveTask=Dn;window.toggleTask=Ln;window.closeTaskMenu=Ze;window.showTaskMenu=Cn;window.copyTask=jn;window.deleteTask=Pn;window.renderTodoList=he;window.openCoachTodoModal=Rn;window.saveCoachTodo=Hn;window.toggleCtd=Nn;window.deleteCtd=Yn;window.renderStudents=Tt;window.goProgram=Kn;window.openStudentModal=On;window.saveStudent=Fn;window.showInviteInfo=It;window.copyInvite=qn;window.deleteStu=Un;window.renderAppointments=ke;window.renderCalDays=Ae;window.selCalDay=Gn;window.chCalMonth=Wn;window.renderApptList=Je;window.openApptModal=Vn;window.saveAppt=Zn;window.deleteAppt=Jn;window.renderExams=de;window.openCommentModal=Xn;window.saveComment=Qn;window.deleteExam=ea;window.renderMessages=St;window.selectThread=ta;window.renderThreadHTML=X;window.sendMsg=na;window.scrollMsgs=Q;window.renderPortal=De;window.stuToggleTask=aa;window.renderSPortal=se;window.stuToggleTask2=ia;window.chWeekS=oa;window.openTaskDetail=Xe;window.toggleTaskDetail=sa;window.toggleDetailItem=la;window.selectVideoSpeed=da;window.saveTaskDetail=ra;window.renderSExams=Qe;window.openStudentExamModal=_t;window.openExamModal=ca;window.renderNetInputs=et;window.saveExam=ma;window.renderSMessages=Ke;window.initRealtime=tt;window.destroyRealtime=nt;window.startChatPoll=pa;window.stopChatPoll=ua;window.renderDevDashboard=Bt;window.renderDevUsers=Le;window.openDevUserModal=va;window.devDeleteUser=ya;window.renderDevResources=we;window.openPlaylistModal=ga;window.fetchYouTubePlaylist=fa;window.savePlaylist=ba;window.openResourceModal=xa;window.saveResource=ha;window.devDeleteResource=ka;window.renderDevFinance=Ce;window.openPaymentModal=wa;window.savePayment=$a;window.openSubModal=Ea;window.saveSub=Ta;window.renderDevAnnounce=$e;window.openAnnounceModal=Ia;window.saveAnnounce=Sa;window.toggleAnnounce=_a;window.devDeleteAnnounce=Ba;window.renderDevTickets=je;window.updateTicketStatus=za;window.openTicketReply=Ma;window.devDeleteTicket=Aa;window.openSupportTicket=Da;window.submitTicket=La;window.loadAnnouncements=zt;window.saveStudentDev=si;window.showOnboarding=Ca;window.renderOnboardingStep=at;window.advanceOnboarding=ja;window.renderSProfil=Mt;window.saveStudentProfile=Pa;window.changePassword=Ra;window.renderCoachProfile=At;window.updateProfilePreview=it;window.switchPreviewTab=Ha;window.nl2br=Dt;window.saveCoachProfile=Na;window.renderDevMatches=ot;window.updateMatchRequestStatus=Ya;window.openSpeedModal=Ka;window.saveAllSpeeds=Oa;window.openReportModal=Fa;window.getReportDates=Lt;window.buildReportHTML=st;window.previewReport=qa;window.generatePDF=Ua;window.openWeeklyPDFModal=Wa;window.generateWeeklyPDF=Va;window.printWeeklyProgramWithNote=Ct;window.generateMeetLink=Za;window.generateZoomLink=Ja;window.copyToClipboard=Xa;window.loadTheme=Pt;window.applyAccent=Rt;window.setTheme=Qa;window.openThemePanel=ei;window.initAIChatForRole=Ht;window.toggleAIChat=ti;window.aiQuickSend=ni;window.buildAIContext=Fe;window.addAIMessage=ne;window.sendAIMessage=Nt;window.autoDetectModel=Yt;window.callGeminiFallback=ge;window.generateAICopilotDraft=ai;window.checkCopilotDraftEdited=ii;window.sendCopilotDraft=oi;window.renderParentHome=Kt;window.renderParentProgress=Ot;window.renderParentAI=Ft;window.applyResFilter=dt;window.updateCRFilter=li;window.buildCRContent=Re;window.renderCoachResources=Ee;window.switchCRTab=di;window.compileResourceStats=qt;window.openResourceModalCoach=ri;window.fetchYtPlaylistCoach=ci;window.saveResourceCoach=mi;window.deleteResourceCoach=pi;window.importResourcesFromExcel=ui;window.importStudentsFromExcel=vi;window.getTestStatus=Ut;window.openCoachTaskEdit=yi;window.saveWeekAsTemplate=gi;window.applyTemplateToWeek=fi;window.confirmApplyTemplate=bi;window.copyTaskToClipboard=xi;window.pasteTaskFromClipboard=hi;window.sendWhatsAppReport=Ga;window.loadTheme&&window.loadTheme();window.renderNetInputs&&window.renderNetInputs();window.checkOAuthSession&&window.checkOAuthSession();if(window.location.search.includes("sandbox")||window.location.hash==="#sandbox"){const e=document.getElementById("demoQuickWrap");e&&(e.style.display="flex"),window.showGoogleSimulator&&setTimeout(()=>window.showGoogleSimulator(),300)}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("Service Worker başarıyla kaydedildi ✓",e.scope)}).catch(e=>{console.warn("Service Worker kaydı başarısız oldu:",e)})});window.addEventListener("hashchange",()=>{let e=window.location.hash.substring(1);if(document.getElementById("appShell").classList.contains("visible")&&e!==window.currentTab){if(!e){e={coach:"home",student:"portal",developer:"dev-dashboard",parent:"parent-home"}[window.session.role]||"portal",window.location.hash=e;return}document.getElementById("view-"+e)&&window.switchTab(e,!1)}});console.log("Rostrum Akademi App initialized successfully ✓");
