/* ===================== ICONS (inline line icons, inherit currentColor) ===================== */
const ICONS = {"pen": "<path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z\"/>", "clapper": "<path d=\"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z\"/><path d=\"m6.2 5.3 3.1 3.9\"/><path d=\"m12.4 3.4 3.1 4\"/><path d=\"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>", "star": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/>", "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1\"/>", "shield": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/>", "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>", "back": "<path d=\"M19 12H5\"/><path d=\"m12 19-7-7 7-7\"/>", "login": "<path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\"/><path d=\"m10 17 5-5-5-5\"/><path d=\"M15 12H3\"/>", "userplus": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M19 8v6\"/><path d=\"M22 11h-6\"/>", "logout": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><path d=\"m16 17 5-5-5-5\"/><path d=\"M21 12H9\"/>", "x": "<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>", "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m17 8-5-5-5 5\"/><path d=\"M12 3v12\"/>", "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/><path d=\"M12 15V3\"/>", "check": "<path d=\"M20 6 9 17l-5-5\"/>", "trash": "<path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>", "refresh": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M8 16H3v5\"/>", "copy": "<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/>", "audio": "<path d=\"M2 10v3\"/><path d=\"M6 6v11\"/><path d=\"M10 3v18\"/><path d=\"M14 8v7\"/><path d=\"M18 5v13\"/><path d=\"M22 10v3\"/>", "mic": "<rect x=\"9\" y=\"2\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M19 10v1a7 7 0 0 1-14 0v-1\"/><path d=\"M12 18v4\"/>", "text": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><path d=\"M14 2v6h6\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/><path d=\"M10 9H8\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/>", "lang": "<path d=\"m5 8 6 6\"/><path d=\"m4 14 6-6 2-3\"/><path d=\"M2 5h12\"/><path d=\"M7 2h1\"/><path d=\"m22 22-5-10-5 10\"/><path d=\"M14 18h6\"/>", "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\"/><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\"/><circle cx=\"12\" cy=\"14\" r=\"8\"/>", "play": "<polygon points=\"6 3 20 12 6 21 6 3\"/>", "pause": "<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/>", "alert": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 8v4\"/><path d=\"M12 16h.01\"/>", "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>"};
function ic(n, cls){ return `<svg class="${cls||'i'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`; }

/* ===================== STATE ===================== */
const state = {
  usage: { textUsed: 0, textMax: 10, videoUsed: 0, videoMax: 3 },
  history: [],
  saved: [],
  authed: false,
  userLabel: 'G',
  currentUser: null,
  theme: 'dark',
  video: {
    file: null, url: null, duration: 0, segments: [], style: {},
    playing: false
  },
  resultCounter: 0
};

const CHIP_GROUPS = {
  platform: ['Instagram','TikTok','YouTube Shorts','Facebook','LinkedIn','X'],
  type: ['Funny','Educational','Business','Real Estate','Product','Motivation','Personal','Story','Promotional','Other'],
  tone: ['Casual','Professional','Funny','Emotional','Viral','Friendly','Powerful'],
  length: ['Short','Medium','Long'],
  count: ['1','3','5','10']
};
const CHIP_DEFAULTS = { platform:'Instagram', type:'Business', tone:'Casual', length:'Medium', count:'3' };
const selection = { ...CHIP_DEFAULTS };

function buildChipGroup(containerId, groupKey){
  const el = document.getElementById(containerId);
  el.innerHTML = CHIP_GROUPS[groupKey].map(opt => {
    const isSel = opt === CHIP_DEFAULTS[groupKey];
    return `<div class="chip-opt${isSel?' selected':''}" role="radio" aria-checked="${isSel}" tabindex="0" data-group="${groupKey}" data-val="${opt}" onclick="selectChip('${groupKey}','${opt}',this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">${opt}</div>`;
  }).join('');
}
function selectChip(group, val, node){
  selection[group] = val;
  node.parentElement.querySelectorAll('.chip-opt').forEach(c=>{ c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
  node.classList.add('selected'); node.setAttribute('aria-checked','true');
}

/* ===================== TOASTS ===================== */
function showToast(msg, type){
  const stack = document.getElementById('toastStack');
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' '+type : '');
  t.innerHTML = `<span class="t-ic">${ic(type==='error'?'alert':(type==='success'?'check':'info'))}</span><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s ease'; setTimeout(()=>t.remove(),300); }, 4200);
}

/* ===================== VIEW ROUTING (real URLs: /app, /app/video, /app/history, /app/saved, /app/account, /app/admin) ===================== */
const VIEW_PATHS = { generate:'/app', video:'/app/video', history:'/app/history', saved:'/app/saved', settings:'/app/account', admin:'/app/admin' };
const PATH_VIEWS = { '':'generate', 'generate':'generate', 'video':'video', 'history':'history', 'saved':'saved', 'account':'settings', 'settings':'settings', 'admin':'admin' };
const NEEDS_LOGIN = ['video','history','saved','settings','admin'];
const VIEW_TITLES = {generate:'Generate captions', video:'Video captions', history:'Caption history', saved:'Saved captions', settings:'Account', admin:'Admin'};
function viewFromPath(){
  const seg = location.pathname.replace(/^\/app\/?/, '').replace(/\/+$/, '').toLowerCase();
  return PATH_VIEWS[seg] || 'generate';
}
function goLogin(view){
  location.href = '/login?next=' + encodeURIComponent(VIEW_PATHS[view] || '/app');
}
function enterApp(view){ showSubview(view || 'generate'); }
function backToSite(){ location.href = '/'; }
function showSubview(name, opts){
  opts = opts || {};
  if(!VIEW_PATHS[name]) name = 'generate';
  if(NEEDS_LOGIN.includes(name) && !state.currentUser){
    if(opts.noRedirect){ name = 'generate'; } else { goLogin(name); return; }
  }
  if(name==='admin' && !(state.currentUser && state.currentUser.role==='admin')){ showToast('Admin access required.', 'error'); name = 'generate'; }
  document.querySelectorAll('.app-subview').forEach(s=>s.classList.remove('active'));
  document.getElementById('subview-'+name).classList.add('active');
  document.querySelectorAll('.side-link').forEach(l=>l.classList.remove('active'));
  const link = document.querySelector('.side-link[data-nav="'+name+'"]');
  if(link) link.classList.add('active');
  document.getElementById('topbarTitle').textContent = VIEW_TITLES[name] || 'Lafzaly';
  document.title = (VIEW_TITLES[name] || 'Lafzaly') + ' — Lafzaly';
  const sb = document.getElementById('sidebar'); if(sb) sb.classList.remove('open');
  if(!opts.fromPop && location.pathname !== VIEW_PATHS[name]){ history.pushState({view:name}, '', VIEW_PATHS[name] + location.search); }
  window.scrollTo(0,0);
  if(name==='history') syncHistoryFromServer();
  if(name==='saved') syncSavedFromServer();
  if(name==='settings') { updateUsageDisplays(); updatePlanBadges(); }
  if(name==='admin') loadAdminData();
}
window.addEventListener('popstate', () => showSubview(viewFromPath(), { fromPop:true }));
function goToVideoSubview(){ showSubview('video'); }
function goToAdminSubview(){ showSubview('admin'); }
async function loadAdminData(){
  const usersBody = document.getElementById('adminUsersBody');
  const jobsBody = document.getElementById('adminJobsBody');
  usersBody.innerHTML = `<tr><td colspan="6">Loading…</td></tr>`;
  jobsBody.innerHTML = `<tr><td colspan="6">Loading…</td></tr>`;
  try{
    const res = await fetch('/api/admin-stats');
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Could not load admin data.');
    document.getElementById('adminFailedPill').textContent = `${data.failedToday} failed today`;
    usersBody.innerHTML = data.users.map(u => `
      <tr><td>${u.email}</td><td><span class="pill-sm">${u.role}</span></td>
        <td><span class="pill-sm">${u.subscription_status==='active' ? (u.subscription_plan||'pro') : 'free'}</span></td>
        <td>${u.videos_today}</td><td>${Number(u.minutes_today||0).toFixed(1)}</td>
        <td>${new Date(u.created_at.replace(' ','T')+'Z').toLocaleDateString()}</td></tr>`).join('') || `<tr><td colspan="6">No users yet.</td></tr>`;
    jobsBody.innerHTML = data.jobs.map(j => `
      <tr><td>${j.email||j.user_id}</td><td>${j.original_filename||'—'}</td>
        <td>${j.duration_seconds ? Number(j.duration_seconds).toFixed(0)+'s' : '—'}</td>
        <td><span class="pill-sm">${j.status}</span></td><td>${j.error||'—'}</td>
        <td>${new Date(j.created_at.replace(' ','T')+'Z').toLocaleString()}</td></tr>`).join('') || `<tr><td colspan="6">No jobs yet.</td></tr>`;
  } catch(err){
    usersBody.innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
    jobsBody.innerHTML = '';
  }
}
function updatePlanBadges(){
  const u = state.currentUser;
  const videoLabel = document.getElementById('miniVideoLabel');
  const settingsLabel = document.getElementById('settingsVideoLabel');
  const proBtn = document.getElementById('proUpgradeBtn');
  const proHint = document.getElementById('proStatusHint');
  const proCard = document.getElementById('proUpgradeCard');
  const setBars = (pct) => {
    document.getElementById('miniVideoBar').style.width = pct+'%';
    const sb = document.getElementById('settingsVideoBar'); if(sb) sb.style.width = pct+'%';
  };
  if(!u){
    if(videoLabel) videoLabel.textContent = 'Video captions';
    document.getElementById('miniVideoUse').textContent = 'Log in';
    if(settingsLabel) settingsLabel.textContent = 'Video captions';
    document.getElementById('settingsVideoUse').textContent = 'Log in required';
    setBars(0);
    return;
  }
  if(u.role === 'admin'){
    if(videoLabel) videoLabel.textContent = 'Videos today';
    document.getElementById('miniVideoUse').textContent = `${u.videosToday ?? 0} (unlimited)`;
    if(settingsLabel) settingsLabel.textContent = 'Videos today';
    document.getElementById('settingsVideoUse').textContent = `${u.videosToday ?? 0} (unlimited — admin)`;
    if(proCard) proCard.classList.add('hidden');
    setBars(0);
  } else if(u.isPro){
    if(videoLabel) videoLabel.textContent = 'Videos today';
    document.getElementById('miniVideoUse').textContent = `${u.videosToday}/${u.videoDailyLimit}`;
    if(settingsLabel) settingsLabel.textContent = 'Videos today';
    document.getElementById('settingsVideoUse').textContent = `${u.videosToday} / ${u.videoDailyLimit}`;
    if(proBtn){ proBtn.textContent = 'You are on Pro'; proBtn.disabled = true; }
    if(proHint) proHint.textContent = 'Your Pro subscription is active.';
    setBars(Math.min(100, (u.videosToday/u.videoDailyLimit)*100));
  } else {
    if(videoLabel) videoLabel.textContent = 'Video mins today';
    document.getElementById('miniVideoUse').textContent = `${(u.minutesToday||0).toFixed(1)}/3`;
    if(settingsLabel) settingsLabel.textContent = 'Video minutes today';
    document.getElementById('settingsVideoUse').textContent = `${(u.minutesToday||0).toFixed(1)} / 3`;
    if(proCard) proCard.classList.remove('hidden');
    if(proBtn){ proBtn.textContent = 'Get Pro — $1/month'; proBtn.disabled = false; }
    if(proHint) proHint.textContent = '';
    setBars(Math.min(100, ((u.minutesToday||0)/3)*100));
  }
}
async function startProCheckout(){
  if(!requireLogin('settings')) return;
  const btn = document.getElementById('proUpgradeBtn');
  btn.disabled = true; btn.textContent = 'Starting checkout…';
  try{
    const res = await fetch('/api/billing-checkout', { method:'POST' });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Could not start checkout.');
    window.location.href = data.url;
  } catch(err){
    showToast(err.message, 'error');
    btn.disabled = false; btn.textContent = 'Get Pro — $1/month';
  }
}
function toggleProfileMenu(){ document.getElementById('profileMenu').classList.toggle('open'); }
document.addEventListener('click', e=>{
  const menu = document.getElementById('profileMenu');
  if(menu && menu.classList.contains('open') && !menu.contains(e.target) && e.target.id!=='profileBtn'){
    menu.classList.remove('open');
  }
});

/* ===================== USAGE ===================== */
function updateUsageDisplays(){
  // Text-caption usage only — video usage is now server-authoritative and
  // handled entirely by updatePlanBadges() (see AUTH section), since it
  // depends on the logged-in user's real plan, not a local counter.
  const u = state.usage;
  const textPct = Math.min(100, (u.textUsed/u.textMax)*100);
  document.getElementById('miniTextUse').textContent = `${u.textUsed}/${u.textMax}`;
  document.getElementById('miniTextBar').style.width = textPct+'%';
  document.getElementById('miniTextBar').parentElement.classList.toggle('warn', textPct>70);
  document.getElementById('usagePillText').textContent = Math.max(0, u.textMax-u.textUsed);
  const st = document.getElementById('settingsTextUse'); if(st) st.textContent = `${u.textUsed} / ${u.textMax}`;
  const sb = document.getElementById('settingsTextBar'); if(sb) sb.style.width = textPct+'%';
}

/* ===================== CAPTION GENERATION ENGINE ===================== */
const HOOKS = {
  Casual: ["Yaar suno, {t} ke baare mein ek zaroori baat batani hai.","Chalo aaj thori der {t} pe baat karte hain.","Ek minute ruko, {t} wali baat sun kar jaana."],
  Professional: ["{T} — ek important update jo aap miss nahi karna chahenge.","Aaj hum {t} ke baare mein aap ko batana chahte hain.","{T} se juri ek zaroori maloomat aap tak pohanchani hai."],
  Funny: ["Ruko zara! {t} wali baat sun kar hansi nahi rukegi.","Bhai {t}? Ye sun kar seedha comment section mein aana.","Itna mazedar {t} pehle kabhi nahi dekha hoga aapne."],
  Emotional: ["Dil se keh rahe hain — {t} sach mein khaas hai.","Kabhi kabhi {t} jaisi baatein dil ko chhu jati hain.","Ye {t} wala safar aasan nahi tha, par arzoo poori hui."],
  Viral: ["{T} — ye abhi trend kar raha hai, dekh lo!","Sab log {t} ke baare mein baat kar rahe hain, aap kahan hain?","Ye {t} wala video ruk kar dekhna, warna pachtaoge."],
  Friendly: ["Chalo aaj baat karte hain {t} ke baare mein.","Aap sab ke liye ek achi khabar — {t}.","Umeed hai aap sab theek hain, aaj baat {t} ki hogi."],
  Powerful: ["{T} — waqt hai action lene ka.","Ab bas sochna nahi, {t} par kaam shuru karne ka waqt hai.","{T} wo mauka hai jo dobara nahi milta."]
};
const BODY = {
  Funny: ["{T}? Bhai ye sun kar hansi nahi rukti. Chalo dekhte hain asal mein maamla kya hai.","Log kehte hain {t} mushkil hai, lekin hum ne isay bana diya bilkul asaan aur mazedar."],
  Educational: ["{T} samajhna itna mushkil nahi jitna lagta hai. Chaliye step by step isay simple tareeke se samajhte hain.","Aaj hum {t} ke bare mein wo baatein share karenge jo aksar log nahi jaante."],
  Business: ["{T} ab aur bhi asaan ho gaya hai. Hum aapko best quality aur service dene ka wada karte hain, wo bhi affordable rate mein.","Hamari team {t} ko lekar poori mehnat se kaam kar rahi hai taake aapko behtareen result mil sake."],
  "Real Estate": ["Agar aap {t} mein interested hain to ye perfect waqt hai apna investment plan banane ka. Location, price aur payment plan sab kuch aapke budget ke mutabiq mil sakta hai.","{T} ek aisi opportunity hai jo Faisalabad jaisay tezi se barhtay shehar mein kam hi milti hai. Details lene mein deir na karein."],
  Product: ["{T} ab market mein available hai! Quality aur price dono mein best deal aapke liye laaye hain.","Hum ne {t} khaas is liye banaya hai taake aapki rozana ki zaroorat asaani se poori ho sake."],
  Motivation: ["{T} ke safar mein mushkilein aayengi, lekin himmat mat harna. Har din ek naya mauka hai khud ko behtar banane ka.","Jab bhi {t} mushkil lage, yaad rakhna — mehnat kabhi zaya nahi jaati."],
  Personal: ["{T} ke baare mein aaj apna dil ki baat share kar rahi hoon. Umeed hai aap is se relate kar payenge.","Kuch baatein share karna zaroori hoti hain, aur {t} unmein se ek hai."],
  Story: ["Ye kahani hai {t} ki — shuru se lekar ab tak ka safar jo shayad aap ko bhi pasand aaye.","Sab kuch itna asaan nahi tha jitna ab lag raha hai, {t} ka safar kai mod se guzra hai."],
  Promotional: ["{T} par exclusive offer chal raha hai, limited time ke liye. Miss mat kariye ye mauka.","Sirf kuch dinon ke liye {t} par special discount diya ja raha hai."],
  Other: ["{T} ke baare mein aaj baat karte hain, kuch aisa jo shayad aap nahi jaante honge.","Chaliye {t} ko thora tafseel se dekhte hain."]
};
const CLOSERS = {
  Emotional: "Aap sab ka support hi hamari sabse bari taqat hai.",
  Powerful: "Ab rukna nahi, sirf aagay barhna hai.",
  Viral: "Is trend ka hissa banna mat bhoolna.",
  Motivation: "Chota qadam bhi aakhir manzil tak le jata hai."
};
const CTA_BANK = {
  contact: ["Zyada details ke liye abhi message karein.","Call ya WhatsApp par rabta karein, hum madad ke liye maujood hain."],
  engage: ["Comment mein bata dein aap ka kya khayal hai.","Apni raye zaroor share karein comments mein."],
  share: ["Is post ko share zaroor karein apne dost ke sath.","Kisi aisay dost ko tag karein jisay ye kaam aa sakta hai."],
  follow: ["Follow karein taake koi update miss na ho.","Aage aisi updates ke liye page ko follow rakhein."],
  link: ["Link bio mein hai, abhi check karein.","Poori detail ke liye bio mein diya gaya link visit karein."]
};
const CTA_MAP = {Business:'contact','Real Estate':'contact',Product:'link',Promotional:'link',Educational:'engage',Story:'engage',Personal:'engage',Motivation:'follow',Funny:'share',Other:'share'};
const HASHTAG_BANK = {
  Funny:['#Comedy','#FunnyReels','#Hasi','#PakistaniMemes','#ViralVideo','#Entertainment'],
  Educational:['#Learning','#Knowledge','#SeekhoRoz','#Tips','#Education','#FactsPage'],
  Business:['#SmallBusiness','#Entrepreneur','#PakistanBusiness','#Growth','#Startup','#BusinessTips'],
  "Real Estate":['#RealEstate','#PropertyPakistan','#Investment','#FaisalabadProperty','#HomeSweetHome','#PlotForSale'],
  Product:['#NewLaunch','#ShopNow','#MadeInPakistan','#QualityProduct','#OnlineShopping','#BestDeal'],
  Motivation:['#Motivation','#HimmatSeAagay','#SelfGrowth','#MindsetMatters','#NeverGiveUp','#Inspiration'],
  Personal:['#RealTalk','#MyStory','#PersonalVlog','#Zindagi','#Thoughts','#DailyLife'],
  Story:['#Kahani','#StoryTime','#PakistaniStories','#RealStory','#LifeLessons','#Emotional'],
  Promotional:['#SaleAlert','#LimitedOffer','#DiscountAlert','#ShopPakistan','#DealOfTheDay','#OfferEndsSoon'],
  Other:['#Trending','#PakistaniContent','#ForYou','#Explore','#ContentCreator','#Viral']
};
const PLATFORM_TAG = {Instagram:'#InstaReels',TikTok:'#TikTokPakistan',"YouTube Shorts":'#Shorts',Facebook:'#FacebookReels',LinkedIn:'#LinkedInPakistan',X:'#XPost'};

function cap(str){ return str.charAt(0).toUpperCase()+str.slice(1); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function fillTemplate(tpl, topic){
  const short = topic.length>60 ? topic.slice(0,60).trim()+'…' : topic;
  return tpl.replaceAll('{t}', short).replaceAll('{T}', cap(short));
}

function generateSingleCaption(topic, platform, type, tone, length){
  const hook = fillTemplate(pick(HOOKS[tone] || HOOKS.Casual), topic);
  let body = fillTemplate(pick(BODY[type] || BODY.Other), topic);
  if(length==='Long'){
    const second = fillTemplate(pick(BODY[type] || BODY.Other), topic);
    body = body + ' ' + (second !== body ? second : '') ;
    if(CLOSERS[tone]) body += ' ' + CLOSERS[tone];
  } else if(length==='Short'){
    body = body.split('.')[0] + '.';
  } else if(CLOSERS[tone] && Math.random()>0.5){
    body += ' ' + CLOSERS[tone];
  }
  const ctaGroup = CTA_MAP[type] || 'engage';
  const cta = pick(CTA_BANK[ctaGroup]);
  const bank = HASHTAG_BANK[type] || HASHTAG_BANK.Other;
  const tags = [...bank].sort(()=>Math.random()-0.5).slice(0,4);
  tags.push(PLATFORM_TAG[platform] || '#Pakistan');
  tags.push('#RomanUrdu');
  return { hook, body, cta, hashtags: tags };
}

const PLATFORM_LIMITS = { Instagram:2200, X:280, LinkedIn:3000 };   // well-known caption limits; others show a plain count
const EXAMPLES = [
  { label:'Property launch', topic:'New housing scheme on Canal Road Faisalabad, easy installments, plots available', platform:'Instagram', type:'Real Estate', tone:'Professional' },
  { label:'Restaurant opening', topic:'Grand opening of our new desi cafe in Lahore this Friday, free chai for first 50 guests', platform:'Instagram', type:'Promotional', tone:'Friendly' },
  { label:'Gym motivation', topic:'30 din ka fitness challenge, daily workouts and diet plan for beginners', platform:'TikTok', type:'Motivation', tone:'Powerful' },
  { label:'Online store sale', topic:'Eid collection sale on our online clothing store, 30 percent off, free delivery across Pakistan', platform:'Facebook', type:'Product', tone:'Viral' }
];
function setChip(group, val){
  const node = document.querySelector(`.chip-opt[data-group="${group}"][data-val="${val}"]`);
  if(node) selectChip(group, val, node);
}
function renderExamples(){
  const row = document.getElementById('exampleRow'); if(!row) return;
  row.innerHTML = EXAMPLES.map((e,i)=>`<button type="button" class="example-chip" onclick="useExample(${i})">${esc(e.label)}</button>`).join('');
}
function useExample(i){
  const e = EXAMPLES[i]; if(!e) return;
  const t = document.getElementById('topicInput'); t.value = e.topic; updateTopicCount(); t.focus();
  setChip('platform', e.platform); setChip('type', e.type); setChip('tone', e.tone);
}
function updateTopicCount(){
  const t = document.getElementById('topicInput'), c = document.getElementById('topicCount'); if(!t||!c) return;
  c.textContent = t.value.length + '/' + t.maxLength;
  c.classList.toggle('near', t.value.length > t.maxLength*0.9);
}
function topicKey(e){ if((e.ctrlKey||e.metaKey) && e.key==='Enter'){ e.preventDefault(); generateCaptions(); } }
function updateGenNote(){
  const n = document.getElementById('genUsageNote'); if(!n) return;
  const left = Math.max(0, state.usage.textMax - state.usage.textUsed);
  n.textContent = left + ' of ' + state.usage.textMax + ' free captions left today';
}
function emptyBoardHTML(){
  return `<div class="empty-board"><div class="ghost" aria-hidden="true"><i class="h"></i><i class="m"></i><i class="m"></i><i class="s"></i></div>
    <h4>Your captions will show up here</h4>
    <p>Write what your post is about, pick a platform and tone, then generate. Not sure where to start? Try one of the examples under the text box.</p></div>`;
}
function showEmptyBoard(){
  document.getElementById('resultsWrap').innerHTML = emptyBoardHTML();
  document.getElementById('resultsSub').textContent = 'Nothing yet. Fill in the post details and generate.';
  document.getElementById('resultsActions').classList.add('hidden');
}
function clearResults(){ showEmptyBoard(); }
function copyAllCards(){
  const ids = Array.from(document.querySelectorAll('#resultsWrap .result-card')).map(c=>c.id);
  if(!ids.length) return;
  navigator.clipboard.writeText(ids.map(cardText).join('\n\n— — —\n\n')).then(()=>showToast(ids.length + ' captions copied.','success')).catch(()=>showToast('Could not copy. Select the text and copy it manually.','error'));
}
function updateCardCount(id){
  const el = document.getElementById(id+'-meter'), card = document.getElementById(id); if(!el||!card) return;
  const n = cardText(id).length, limit = PLATFORM_LIMITS[card.dataset.platform];
  el.textContent = limit ? n.toLocaleString() + ' / ' + limit.toLocaleString() : n.toLocaleString() + ' characters';
  el.classList.toggle('over', !!limit && n > limit);
}

function generateCaptions(){
  const topic = document.getElementById('topicInput').value.trim();
  if(!topic){ showToast('Write what your post is about first.', 'error'); document.getElementById('topicInput').focus(); return; }
  if(topic.length < 4){ showToast('Add a little more detail about your post.', 'error'); return; }
  const count = parseInt(selection.count, 10);
  if(state.usage.textUsed + count > state.usage.textMax){
    showToast(`Daily free limit reached (${state.usage.textMax}/day). Upgrade to Pro for unlimited captions.`, 'error');
    return;
  }
  const btn = document.getElementById('genBtn'), wrap = document.getElementById('resultsWrap');
  btn.disabled = true; btn.textContent = 'Generating…';
  document.getElementById('resultsSub').textContent = 'Writing ' + count + ' caption' + (count>1?'s':'') + '…';
  document.getElementById('resultsActions').classList.add('hidden');
  wrap.innerHTML = Array.from({length:Math.min(count,3)}, () => '<div class="skel-card" aria-hidden="true"><i></i><i></i><i></i><i></i></div>').join('');
  // bring the results into view straight away on small screens (they stack under the form)
  if(window.matchMedia('(max-width:1023px)').matches){
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    document.getElementById('resultsPanel').scrollIntoView({behavior: reduce?'auto':'smooth', block:'start'});
  }
  const snap = { platform:selection.platform, tone:selection.tone, type:selection.type, length:selection.length };
  aiCaptions(topic, snap, count).then(ai => {
    wrap.innerHTML = '';
    for(let i=0;i<count;i++){
      const c = (ai && ai[i]) ? ai[i] : generateSingleCaption(topic, snap.platform, snap.type, snap.tone, snap.length);
      state.usage.textUsed++;
      const id = 'r'+(state.resultCounter++);
      addToHistory(topic, snap.platform, snap.tone, c);
      wrap.appendChild(renderResultCard(id, c, topic, snap));
      updateCardCount(id);
    }
    wrap.scrollTop = 0;
    btn.disabled = false; btn.textContent = 'Generate captions';
    document.getElementById('resultsSub').textContent = count + ' caption' + (count>1?'s':'') + ' for ' + snap.platform + ', ' + snap.tone.toLowerCase() + ' tone';
    document.getElementById('resultsActions').classList.remove('hidden');
    updateUsageDisplays(); updateGenNote();
    showToast(ai ? `${count} Roman Urdu caption${count>1?'s':''} ready.` : 'AI is unavailable right now — used built-in templates instead.', ai ? 'success' : 'error');
  });
}

function renderResultCard(id, c, topic, snap){
  snap = snap || { platform:selection.platform, tone:selection.tone };
  const div = document.createElement('div');
  div.className = 'result-card';
  div.id = id;
  div.dataset.topic = topic; div.dataset.platform = snap.platform; div.dataset.tone = snap.tone;
  div.dataset.type = snap.type || selection.type; div.dataset.length = snap.length || selection.length;
  div.innerHTML = `
    <div class="rc-top">
      <div class="rc-lead"><span class="rc-tag">${esc(snap.platform)} · ${esc(snap.tone)}</span><span class="rc-meter" id="${id}-meter"></span></div>
    </div>
    <div class="rc-hook">${esc(c.hook)}</div>
    <div class="rc-body" contenteditable="false" id="${id}-body" oninput="updateCardCount('${id}')">${esc(c.body)}</div>
    <div class="rc-cta" id="${id}-cta">${esc(c.cta)}</div>
    <div class="rc-tags">${c.hashtags.map(h=>`<span>${esc(h)}</span>`).join('')}</div>
    <div class="rc-actions">
      <button class="icon-btn primary" onclick="copyCard('${id}')">${ic('copy')} Copy</button>
      <button class="icon-btn" onclick="editCard('${id}')" id="${id}-editbtn">${ic('pen')} Edit</button>
      <button class="icon-btn" onclick="saveCard('${id}')" id="${id}-savebtn">${ic('star')} Save</button>
      <button class="icon-btn" onclick="regenerateCard('${id}')">${ic('refresh')} Regenerate</button>
    </div>`;
  return div;
}
function cardText(id){
  const card = document.getElementById(id);
  const hook = card.querySelector('.rc-hook').textContent;
  const body = document.getElementById(id+'-body').textContent;
  const cta = document.getElementById(id+'-cta').textContent;
  const tags = Array.from(card.querySelectorAll('.rc-tags span')).map(s=>s.textContent).join(' ');
  return `${hook}\n\n${body}\n\n${cta}\n\n${tags}`;
}
function copyCard(id){
  navigator.clipboard.writeText(cardText(id)).then(()=>showToast('Caption copied to clipboard.','success')).catch(()=>showToast('Could not copy — select and copy manually.','error'));
}
function editCard(id){
  const body = document.getElementById(id+'-body');
  const editing = body.getAttribute('contenteditable') === 'true';
  body.setAttribute('contenteditable', editing ? 'false' : 'true');
  document.getElementById(id+'-editbtn').innerHTML = editing ? ic('pen')+' Edit' : ic('check')+' Done';
  if(!editing) body.focus();
}
function saveCard(id){
  const btn = document.getElementById(id+'-savebtn');
  const already = btn.classList.contains('saved');
  btn.classList.toggle('saved');
  btn.innerHTML = already ? ic('star')+' Save' : ic('star','i fill')+' Saved';
  if(!already){
    const card = document.getElementById(id);
    const entry = { id: 'sv'+id, topic: card.dataset.topic, platform: card.dataset.platform, tone: card.dataset.tone, text: cardText(id) };
    state.saved.push(entry);
    showToast('Caption saved.', 'success');
    apiPost('/api/saved', { text: entry.text, platform: entry.platform, tone: entry.tone })
      .then(r => { entry.serverId = r.id; })
      .catch(() => noteBackendUnavailable());
  } else {
    const entry = state.saved.find(s=>s.id==='sv'+id);
    state.saved = state.saved.filter(s=>s.id!=='sv'+id);
    if(entry && entry.serverId){ apiDelete('/api/saved', entry.serverId).catch(()=>{}); }
  }
}
async function regenerateCard(id){
  const card = document.getElementById(id);
  const topic = card.dataset.topic;
  if(state.usage.textUsed + 1 > state.usage.textMax){ showToast('Daily free limit reached. Upgrade to Pro for unlimited captions.', 'error'); return; }
  const snap = { platform:card.dataset.platform, type:card.dataset.type, tone:card.dataset.tone, length:card.dataset.length };
  showToast('Rewriting…', 'success');
  const ai = await aiCaptions(topic, snap, 1);
  const c = ai ? ai[0] : generateSingleCaption(topic, snap.platform, snap.type, snap.tone, snap.length);
  state.usage.textUsed++;
  card.querySelector('.rc-hook').textContent = c.hook;
  document.getElementById(id+'-body').textContent = c.body;
  document.getElementById(id+'-cta').textContent = c.cta;
  card.querySelector('.rc-tags').innerHTML = c.hashtags.map(h=>`<span>${esc(h)}</span>`).join('');
  addToHistory(topic, card.dataset.platform, card.dataset.tone, c);
  updateCardCount(id); updateGenNote();
  updateUsageDisplays();
  showToast('Caption regenerated.', 'success');
}

/* ===================== BACKEND (Turso via /api/*) ===================== */
// backendAvailable stays null (unknown) until the first real call succeeds
// or fails, so we only try once per session and never spam retries.
let backendAvailable = null;
let backendNoticeShown = false;
function noteBackendUnavailable(){
  backendAvailable = false;
  if(!backendNoticeShown){
    backendNoticeShown = true;
    showToast('Running in local-only mode — set up Turso (see README) to save history across devices and refreshes.', 'success');
  }
}
async function apiGet(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('request failed');
  backendAvailable = true;
  return res.json();
}
// Real Roman Urdu from the AI endpoint; returns null on any failure so callers can fall back to templates.
async function aiCaptions(topic, snap, count){
  try{
    const res = await fetch('/api/captions', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action:'generate', topic, platform:snap.platform, type:snap.type, tone:snap.tone, length:snap.length, count }) });
    if(!res.ok) return null;
    const d = await res.json();
    return (d.captions && d.captions.length) ? d.captions : null;
  }catch(e){ return null; }
}
async function apiPost(path, body){
  const res = await fetch(path, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if(!res.ok) throw new Error('request failed');
  backendAvailable = true;
  return res.json();
}
async function apiDelete(path, id){
  const res = await fetch(`${path}?id=${encodeURIComponent(id)}`, { method:'DELETE' });
  if(!res.ok) throw new Error('request failed');
  backendAvailable = true;
  return res.json();
}

/* ===================== HISTORY / SAVED ===================== */
function addToHistory(topic, platform, tone, c){
  const entry = {
    id: 'h'+Date.now()+Math.random().toString(16).slice(2),
    date: new Date(),
    topic, platform, tone,
    caption: `${c.hook} ${c.body}`,
    full: `${c.hook}\n\n${c.body}\n\n${c.cta}\n\n${c.hashtags.join(' ')}`,
    saved: false
  };
  state.history.unshift(entry);
  if(backendAvailable !== false){
    apiPost('/api/captions', {
      topic, platform, contentType: selection.type, tone, length: selection.length,
      hook: c.hook, body: c.body, cta: c.cta, hashtags: c.hashtags
    }).then(r => { entry.serverId = r.id; }).catch(() => noteBackendUnavailable());
  }
}
async function syncHistoryFromServer(){
  if(backendAvailable !== false){
    try{
      const data = await apiGet('/api/captions');
      state.history = data.captions.map(r => ({
        id: r.id, serverId: r.id, date: new Date(r.created_at.replace(' ','T')+'Z'),
        topic: r.topic, platform: r.platform, tone: r.tone,
        caption: `${r.hook} ${r.body}`,
        full: `${r.hook}\n\n${r.body}\n\n${r.cta || ''}\n\n${(r.hashtags||[]).join(' ')}`,
        saved: !!r.saved
      }));
    } catch(e){ noteBackendUnavailable(); }
  }
  renderHistory();
}
async function syncSavedFromServer(){
  if(backendAvailable !== false){
    try{
      const data = await apiGet('/api/saved');
      state.saved = data.saved.map(r => ({ id: r.id, serverId: r.id, topic:'', platform: r.platform, tone: r.tone, text: r.text }));
    } catch(e){ noteBackendUnavailable(); }
  }
  renderSaved();
}
function fmtDate(d){
  return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) + ' · ' + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
}
function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function renderHistory(){
  const q = (document.getElementById('historySearch').value || '').toLowerCase();
  const body = document.getElementById('historyTableBody');
  const rows = state.history.filter(h => !q || h.topic.toLowerCase().includes(q) || h.platform.toLowerCase().includes(q) || h.caption.toLowerCase().includes(q));
  document.getElementById('historyEmpty').classList.toggle('hidden', state.history.length>0);
  body.innerHTML = rows.map(h => `
    <tr>
      <td>${fmtDate(h.date)}</td>
      <td>${esc(h.topic.length>28 ? h.topic.slice(0,28)+'…' : h.topic)}</td>
      <td><span class="pill-sm">${esc(h.platform)}</span></td>
      <td><span class="pill-sm">${esc(h.tone)}</span></td>
      <td><span class="table-cap-text">${esc(h.caption)}</span></td>
      <td>${h.saved ? ic('star','i fill gold') : '—'}</td>
      <td class="row-actions">
        <button title="Copy" aria-label="Copy" onclick="historyCopy('${h.id}')">${ic('copy')}</button>
        <button title="Delete" aria-label="Delete" onclick="historyDelete('${h.id}')">${ic('trash')}</button>
      </td>
    </tr>`).join('');
}
function historyCopy(id){
  const h = state.history.find(x=>x.id===id);
  if(!h) return;
  navigator.clipboard.writeText(h.full).then(()=>showToast('Caption copied.','success'));
}
function historyDelete(id){
  const entry = state.history.find(x=>x.id===id);
  state.history = state.history.filter(x=>x.id!==id);
  renderHistory();
  showToast('Removed from history.', 'success');
  if(entry && entry.serverId){ apiDelete('/api/captions', entry.serverId).catch(()=>{}); }
}
function renderSaved(){
  const grid = document.getElementById('savedGrid');
  document.getElementById('savedEmpty').classList.toggle('hidden', state.saved.length>0);
  grid.innerHTML = state.saved.map(s => `
    <div class="result-card">
      <div class="rc-top"><span class="rc-tag">${esc(s.platform)} · ${esc(s.tone)}</span></div>
      <div class="rc-body" style="white-space:pre-wrap;">${esc(s.text)}</div>
      <div class="rc-actions">
        <button class="icon-btn" onclick="savedCopy('${s.id}')">${ic('copy')} Copy</button>
        <button class="icon-btn" onclick="unsaveCaption('${s.id}')">${ic('x')} Remove</button>
      </div>
    </div>`).join('');
}
function savedCopy(id){
  const s = state.saved.find(x=>x.id===id);
  if(s) navigator.clipboard.writeText(s.text).then(()=>showToast('Copied.','success'));
}
function unsaveCaption(id){
  const entry = state.saved.find(s=>s.id===id);
  state.saved = state.saved.filter(s=>s.id!==id);
  renderSaved();
  showToast('Removed from saved.', 'success');
  if(entry && entry.serverId){ apiDelete('/api/saved', entry.serverId).catch(()=>{}); }
}

/* ===================== AUTH (login / signup live on /login and /signup) ===================== */
async function logoutUser(){
  try{ await fetch('/api/auth-logout', { method:'POST' }); } catch{}
  state.currentUser = null;
  applyUserToUI();
  location.href = '/';
}
// Fetches the real session from the server and updates all UI that depends
// on it (profile badge, usage pill, admin nav link, settings fields).
async function refreshSession(){
  try{
    const res = await fetch('/api/auth-me');
    const data = await res.json();
    state.currentUser = data.user || null;
  } catch{
    state.currentUser = null;
  }
  applyUserToUI();
}
function applyUserToUI(){
  const u = state.currentUser;
  document.getElementById('profileBtn').textContent = u ? u.email.charAt(0).toUpperCase() : 'G';
  document.getElementById('menuLoginItem').classList.toggle('hidden', !!u);
  document.getElementById('menuSignupItem').classList.toggle('hidden', !!u);
  document.getElementById('menuAccountItem').classList.toggle('hidden', !u);
  const nm = document.getElementById('profileName'); if(nm) nm.textContent = u ? u.email : 'Guest';
  document.getElementById('menuLogoutItem').classList.toggle('hidden', !u);
  document.getElementById('settingsEmail').value = u ? u.email : '';
  { const n = document.getElementById('settingsName'); if(n && !n.value) n.value = u ? u.email.split('@')[0] : ''; }
  document.getElementById('adminSideLink').classList.toggle('hidden', !(u && u.role === 'admin'));
  updatePlanBadges();
}
function requireLogin(thenView){
  if(state.currentUser){ return true; }
  goLogin(thenView || 'generate');
  return false;
}
function setTheme(mode){
  state.theme = mode;
  document.getElementById('themeDarkChip').classList.toggle('selected', mode==='dark');
  document.getElementById('themeLightChip').classList.toggle('selected', mode==='light');
  if(mode==='light') showToast('Light mode is on the roadmap — staying in dark mode for now.', 'success');
}

/* ===================== VIDEO CAPTION PIPELINE ===================== */
const ALLOWED_EXT = ['mp4','mov','webm','mp3','wav'];
const MAX_FILE_MB = 300;
const PIPELINE_STAGES = [
  { key:'extract', icon:'audio', title:'Extracting audio', sub:'Pulling the voice track from your file' },
  { key:'detect', icon:'mic', title:'Detecting voice', sub:'Checking for spoken audio' },
  { key:'transcribe', icon:'text', title:'Transcribing speech', sub:'Converting speech to text' },
  { key:'lang', icon:'globe', title:'Detecting language', sub:'Urdu, Roman Urdu, English or mixed' },
  { key:'roman', icon:'lang', title:'Converting to Roman Urdu', sub:'Rewriting Urdu speech into natural Roman Urdu' },
  { key:'align', icon:'timer', title:'Aligning timestamps', sub:'Syncing each line to your voiceover' }
];
const DEMO_LINES = [
  { text:"Assalam o Alaikum! Umeed hai aap sab bilkul theek hongay.", lang:'Mixed' },
  { text:"Aaj hum baat karne wale hain ek zaroori topic ke baare mein.", lang:'Roman Urdu' },
  { text:"Agar aap Faisalabad mein rehte hain to ye information aap ke kaam aayegi.", lang:'Roman Urdu' },
  { text:"Bohat se log ye sawal poochte hain ke shuruwaat kahan se karein.", lang:'Roman Urdu' },
  { text:"To chaliye ise step by step, bilkul simple tareeke se samajhte hain.", lang:'Mixed' },
  { text:"Sabse pehli baat, hamesha apni research khud karein.", lang:'Roman Urdu' },
  { text:"Uske baad hi koi bhi decision lena best rehta hai.", lang:'Mixed' },
  { text:"Agar aap ko ye video pasand aaya to like aur share zaroor karein.", lang:'Roman Urdu' },
  { text:"Comments mein bata dein aap ka is bare mein kya khayal hai.", lang:'Roman Urdu' },
  { text:"Milte hain agli video mein, Allah Hafiz!", lang:'Roman Urdu' }
];
const STYLE_PRESETS = {
  'TikTok Style': { font:"'Sora',sans-serif", size:30, pos:'8%', align:'center', color:'#ffffff', bg:'box', outline:'shadow', anim:'pop', hl:true },
  'Reels Style': { font:"'Inter',sans-serif", size:26, pos:'8%', align:'center', color:'#ffffff', bg:'gradient', outline:'shadow', anim:'fade', hl:false },
  'YouTube Shorts': { font:"'Inter',sans-serif", size:27, pos:'45%', align:'center', color:'#ffffff', bg:'box', outline:'none', anim:'fade', hl:false },
  'Clean': { font:"'Inter',sans-serif", size:24, pos:'8%', align:'center', color:'#ffffff', bg:'none', outline:'shadow', anim:'none', hl:false },
  'Bold': { font:'Impact,sans-serif', size:36, pos:'45%', align:'center', color:'#F2A93B', bg:'none', outline:'outline', anim:'pop', hl:true },
  'Viral': { font:"'Sora',sans-serif", size:32, pos:'8%', align:'center', color:'#31D6A1', bg:'box', outline:'shadow', anim:'pop', hl:true },
  'Minimal': { font:"'Inter',sans-serif", size:20, pos:'8%', align:'left', color:'#ffffff', bg:'none', outline:'none', anim:'none', hl:false },
  /* ---- Elegant set ---- */
  'Editorial': { font:"'Playfair Display',serif", size:26, pos:'20%', align:'center', color:'#ffffff', accent:'#F3D98B', bg:'none', outline:'soft', anim:'fade', hl:false, weight:600, case:'italic' },
  'Luxe Gold': { font:"'Cormorant Garamond',serif", size:30, pos:'20%', align:'center', color:'#F3D98B', accent:'#F3D98B', bg:'none', outline:'soft', anim:'fade', hl:false, weight:700, case:'upper-wide' },
  'Frosted Glass': { font:"'Poppins',sans-serif", size:23, pos:'20%', align:'center', color:'#ffffff', accent:'#ffffff', bg:'glass', outline:'none', anim:'slide', hl:false, weight:600, case:'normal' },
  'Neon Glow': { font:"'Montserrat',sans-serif", size:27, pos:'45%', align:'center', color:'#ffffff', accent:'#31D6A1', bg:'none', outline:'glow', anim:'pop', hl:true, weight:800, case:'normal' },
  'Highlighter': { font:"'Poppins',sans-serif", size:25, pos:'20%', align:'center', color:'#14110E', accent:'#FFD84D', bg:'marker', outline:'none', anim:'pop', hl:false, weight:700, case:'normal' },
  'Karaoke': { font:"'Montserrat',sans-serif", size:29, pos:'20%', align:'center', color:'#ffffff', accent:'#F2A93B', bg:'none', outline:'outline', anim:'pop', hl:true, weight:800, case:'normal' },
  'Cinema': { font:"'Inter',sans-serif", size:21, pos:'8%', align:'center', color:'#F3F1E6', accent:'#F3F1E6', bg:'none', outline:'soft', anim:'fade', hl:false, weight:500, case:'wide' },
  'Pastel Pill': { font:"'Poppins',sans-serif", size:23, pos:'20%', align:'center', color:'#14110E', accent:'#F6E7C8', bg:'pill', outline:'none', anim:'slide', hl:false, weight:600, case:'normal' },
  'Handwritten': { font:"'Caveat',cursive", size:36, pos:'20%', align:'center', color:'#ffffff', accent:'#F2A93B', bg:'none', outline:'shadow', anim:'pop', hl:true, weight:700, case:'normal' },
  /* ---- Animated set ---- */
  'Pop Words': { font:"'Montserrat',sans-serif", size:34, pos:'20%', align:'center', color:'#ffffff', accent:'#FFD84D', bg:'none', outline:'outline', anim:'word-pop', hl:true, weight:800, case:'upper', chunk:3 },
  'One-Word Punch': { font:"'Bebas Neue',sans-serif", size:46, pos:'45%', align:'center', color:'#ffffff', accent:'#31D6A1', bg:'none', outline:'outline', anim:'word-pop', hl:true, weight:400, case:'upper-wide', chunk:1 },
  'Slide Stack': { font:"'Poppins',sans-serif", size:30, pos:'20%', align:'center', color:'#ffffff', accent:'#F2A93B', bg:'none', outline:'shadow', anim:'word-slide', hl:true, weight:700, case:'normal', chunk:2 },
  'Bounce Beat': { font:"'Poppins',sans-serif", size:32, pos:'20%', align:'center', color:'#ffffff', accent:'#31D6A1', bg:'none', outline:'outline', anim:'bounce', hl:true, weight:800, case:'upper', chunk:3 },
  'Typewriter': { font:"'Inter',sans-serif", size:24, pos:'20%', align:'center', color:'#ffffff', accent:'#F2A93B', bg:'box', outline:'none', anim:'typewriter', hl:false, weight:600, case:'normal', chunk:0 },
  'Pill Pop': { font:"'Poppins',sans-serif", size:27, pos:'20%', align:'center', color:'#14110E', accent:'#FFD84D', bg:'pill', outline:'none', anim:'word-pop', hl:false, weight:700, case:'normal', chunk:2 },
  'Tall Caps': { font:"'Bebas Neue',sans-serif", size:40, pos:'45%', align:'center', color:'#ffffff', accent:'#31D6A1', bg:'none', outline:'outline', anim:'pop', hl:true, weight:400, case:'upper-wide' }
};

function initDropzone(){
  const dz = document.getElementById('dropzone');
  const input = document.getElementById('fileInput');
  input.addEventListener('change', ()=>{ if(input.files[0]) handleFile(input.files[0]); });
  ['dragenter','dragover'].forEach(evt => dz.addEventListener(evt, e=>{ e.preventDefault(); dz.classList.add('drag'); }));
  ['dragleave','drop'].forEach(evt => dz.addEventListener(evt, e=>{ e.preventDefault(); dz.classList.remove('drag'); }));
  dz.addEventListener('drop', e=>{ const f = e.dataTransfer.files[0]; if(f) handleFile(f); });
}

const MAX_VIDEO_SECONDS = 4 * 60;

function handleFile(file){
  if(!requireLogin('video')) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if(!ALLOWED_EXT.includes(ext)){
    showToast(`Unsupported file type ".${ext}". Please upload MP4, MOV, WebM, MP3 or WAV.`, 'error');
    return;
  }
  if(file.size > MAX_FILE_MB * 1024 * 1024){
    showToast(`File is too large. Maximum size is ${MAX_FILE_MB}MB.`, 'error');
    return;
  }
  state.video.file = file;
  state.video.url = URL.createObjectURL(file);
  getMediaDuration(state.video.url).then(duration => {
    state.video.duration = duration;

    if(duration > MAX_VIDEO_SECONDS){
      showToast(`Video too long. Please upload a video up to ${MAX_VIDEO_SECONDS/60} minutes long.`, 'error');
      return;
    }

    const u = state.currentUser;
    if(u && u.role !== 'admin'){
      if(u.isPro && u.videosToday >= u.videoDailyLimit){
        showToast(`Daily limit reached. You've used all ${u.videoDailyLimit} video generations for today. Please come back tomorrow.`, 'error');
        return;
      }
      if(!u.isPro && ((u.minutesToday||0) + duration/60 > 3)){
        showToast('This would use more than your 3 free video minutes for today. Upgrade to Lafzaly Pro for full videos every day.', 'error');
        return;
      }
    }

    realUpload(file);
  });
}
function getMediaDuration(url){
  return new Promise(resolve => {
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.src = url;
    probe.onloadedmetadata = () => resolve(probe.duration || 12);
    probe.onerror = () => resolve(12);
  });
}

/* ---- REAL pipeline: chunked upload through our own server -> /api/transcribe ----
   (Not using Vercel Blob's official browser-direct "client upload" feature —
   that hit an unresolved platform CORS bug on this account's store type.
   Instead: slice the file into small pieces, POST each straight to our own
   serverless function (well under its 4.5MB body limit), which stores it
   server-side via Blob's plain put(). A finalize call then stitches the
   pieces back together into the real file. Slower than a single direct
   upload for large files, but works reliably regardless of that bug. */
const UPLOAD_CHUNK_SIZE = 4 * 1024 * 1024; // 4MB — safely under the 4.5MB serverless body limit

async function realUpload(file){
  document.getElementById('uploadProgressWrap').classList.remove('hidden');
  const bar = document.getElementById('uploadProgressBar');
  const label = document.getElementById('uploadProgressLabel');
  bar.style.width = '0%';
  label.textContent = `Uploading "${file.name}"…`;
  try{
    const uploadId = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random().toString(16).slice(2);
    const totalChunks = Math.max(1, Math.ceil(file.size / UPLOAD_CHUNK_SIZE));
    const chunkUrls = [];

    for(let i=0; i<totalChunks; i++){
      const start = i * UPLOAD_CHUNK_SIZE;
      const chunk = file.slice(start, start + UPLOAD_CHUNK_SIZE);
      const res = await fetch(`/api/upload-chunk?uploadId=${encodeURIComponent(uploadId)}&chunkIndex=${i}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: chunk
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data.error || `Chunk ${i+1} of ${totalChunks} failed to upload.`);
      chunkUrls.push(data.url);
      const pct = Math.round(((i+1)/totalChunks) * 100);
      bar.style.width = pct + '%';
      label.textContent = `Uploading "${file.name}" — ${pct}%`;
    }

    label.textContent = 'Finalizing upload…';
    const finalizeRes = await fetch('/api/upload-finalize', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chunkUrls, filename: file.name })
    });
    const finalizeData = await finalizeRes.json().catch(()=>({}));
    if(!finalizeRes.ok) throw new Error(finalizeData.error || 'Could not finalize upload.');

    label.textContent = 'Upload complete';
    startRealPipeline(finalizeData.url, file.name);
  } catch(err){
    console.error('Chunked upload failed:', err);
    if(String(err.message||'').toLowerCase().includes('log in')){
      showToast('Please log in to upload a video.', 'error');
      goLogin('video');
      return;
    }
    document.getElementById('uploadProgressWrap').classList.add('hidden');
    showToast('Upload failed: ' + (err.message || 'unknown error'), 'error');
  }
}

async function startRealPipeline(blobUrl, originalFilename){
  document.getElementById('uploadPanel').classList.add('hidden');
  document.getElementById('pipelinePanel').classList.remove('hidden');
  document.getElementById('pipelineSteps').innerHTML = PIPELINE_STAGES.map(s => `
    <div class="pipe-step" id="stage-${s.key}">
      <div class="pipe-icon" data-icon="${s.icon}">${ic(s.icon)}</div>
      <div class="pipe-text"><b>${s.title}</b><span>${s.sub}</span></div>
    </div>`).join('');

  let request = fetch('/api/transcribe', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ blobUrl, durationSeconds: state.video.duration, originalFilename })
  }).then(async r => {
    const data = await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error || 'Transcription failed.');
    return data;
  });
  const settle = request.then(() => {}, () => {});
  request.settled = false; settle.then(() => { request.settled = true; });
  const gate = Object.assign(settle, { get settled(){ return request.settled; } });
  const animation = animatePipelineStages(gate);

  try{
    const [, data] = await Promise.all([animation, request]);
    finishPipelineReal(data);
    refreshSession(); // pick up the newly-updated usage count
  } catch(err){
    document.getElementById('pipelinePanel').classList.add('hidden');
    document.getElementById('uploadPanel').classList.remove('hidden');
    document.getElementById('uploadProgressWrap').classList.add('hidden');
    showToast(err.message || 'Transcription failed. Please try again.', 'error');
  }
}

// Advances through the stages while the server works, but parks on the last one until
// `holdUntil` (the real request) settles, so the UI never claims "done" while still waiting.
function animatePipelineStages(holdUntil){
  return new Promise(resolve => {
    let i = 0;
    function runStage(){
      if(i>0){
        const prev = document.getElementById('stage-'+PIPELINE_STAGES[i-1].key);
        prev.classList.replace('active','done');
        prev.querySelector('.pipe-icon').innerHTML = ic('check');
      }
      if(holdUntil && i === PIPELINE_STAGES.length - 1 && !holdUntil.settled){
        const el = document.getElementById('stage-'+PIPELINE_STAGES[i].key);
        el.classList.add('active'); el.querySelector('.pipe-icon').innerHTML = '<div class="spinner"></div>';
        holdUntil.then(() => { i++; runStage(); });
        return;
      }
      if(i >= PIPELINE_STAGES.length){ resolve(); return; }
      const el = document.getElementById('stage-'+PIPELINE_STAGES[i].key);
      el.classList.add('active');
      el.querySelector('.pipe-icon').innerHTML = '<div class="spinner"></div>';
      i++;
      setTimeout(runStage, 500 + Math.random()*350);
    }
    runStage();
  });
}

function finishPipelineReal(data){
  try{
    const rawSegments = data.segments || [];
    if(!rawSegments.length){
      document.getElementById('pipelinePanel').classList.add('hidden');
      document.getElementById('uploadPanel').classList.remove('hidden');
      showToast('No voice was detected in this file. Please upload a video or audio file containing spoken audio.', 'error');
      return;
    }
    const minutesNeeded = (state.video.duration || 0) / 60;
    state.usage.videoUsed = Math.min(state.usage.videoMax, state.usage.videoUsed + minutesNeeded);
    updateUsageDisplays();

    state.video.segments = rawSegments.map((s,i) => ({ id:'seg'+i, start:s.start, end:s.end, text:s.text, lang:s.lang, words:s.words || null }));

    document.getElementById('pipelinePanel').classList.add('hidden');
    document.getElementById('videoWorkspace').classList.remove('hidden');

    const vid = document.getElementById('previewVideo');
    vid.src = state.video.url;
    vid.controls = false;
    vid.onloadedmetadata = () => { updateTimeLabel(); };
    vid.ontimeupdate = onVideoTimeUpdate;
    vid.onended = () => { document.getElementById('playBtn').innerHTML = ic('play','i fill'); };

    document.getElementById('detectedLangTag').textContent = mostCommonLang(state.video.segments);
    renderTranscript();
    buildPresetRow();
    applyStyle();
    showToast('Transcription complete — Roman Urdu captions are ready to preview.', 'success');
  } catch(err){
    console.error('finishPipelineReal failed:', err);
    document.getElementById('pipelinePanel').classList.add('hidden');
    document.getElementById('uploadPanel').classList.remove('hidden');
    showToast('Something went wrong displaying the transcript: ' + err.message, 'error');
  }
}

/* ---- DEMO fallback pipeline: used only if Blob/Groq aren't configured yet ---- */
function simulateUploadDemo(file){
  document.getElementById('uploadProgressWrap').classList.remove('hidden');
  const bar = document.getElementById('uploadProgressBar');
  const label = document.getElementById('uploadProgressLabel');
  let pct = 0;
  const iv = setInterval(()=>{
    pct += Math.random()*22 + 8;
    if(pct >= 100){
      pct = 100; clearInterval(iv);
      bar.style.width = '100%';
      label.textContent = 'Upload complete';
      setTimeout(()=> startPipelineDemo(file), 350);
    } else {
      bar.style.width = pct+'%';
      label.textContent = `Uploading "${file.name}" — ${Math.round(pct)}%`;
    }
  }, 220);
}

function startPipelineDemo(file){
  document.getElementById('uploadPanel').classList.add('hidden');
  document.getElementById('pipelinePanel').classList.remove('hidden');
  document.getElementById('pipelineSteps').innerHTML = PIPELINE_STAGES.map(s => `
    <div class="pipe-step" id="stage-${s.key}">
      <div class="pipe-icon" data-icon="${s.icon}">${ic(s.icon)}</div>
      <div class="pipe-text"><b>${s.title}</b><span>${s.sub}</span></div>
    </div>`).join('');
  animatePipelineStages().then(() => setTimeout(()=>finishPipelineDemo(file), 200));
}

function finishPipelineDemo(file){
  try{
    const durationSec = state.video.duration || 12;
    const nameHint = (file.name || '').toLowerCase();
    const noVoice = nameHint.includes('silent') || nameHint.includes('novoice') || durationSec < 1.2;

    if(noVoice){
      document.getElementById('pipelinePanel').classList.add('hidden');
      document.getElementById('uploadPanel').classList.remove('hidden');
      document.getElementById('uploadProgressWrap').classList.add('hidden');
      showToast('No voice was detected in this file. Please upload a video or audio file containing spoken audio.', 'error');
      return;
    }

    const usableSeconds = Math.min(durationSec, 45);
    const minutesNeeded = durationSec / 60;
    state.usage.videoUsed = Math.min(state.usage.videoMax, state.usage.videoUsed + minutesNeeded);
    updateUsageDisplays();

    const lineCount = Math.max(3, Math.min(DEMO_LINES.length, Math.round(usableSeconds / 3.2)));
    const seg = usableSeconds / lineCount;
    const segments = [];
    for(let k=0;k<lineCount;k++){
      const d = DEMO_LINES[k % DEMO_LINES.length];
      segments.push({ id:'seg'+k, start:+(k*seg).toFixed(1), end:+Math.min(durationSec,(k+1)*seg).toFixed(1), text:d.text, lang:d.lang });
    }
    state.video.segments = segments;

    document.getElementById('pipelinePanel').classList.add('hidden');
    document.getElementById('videoWorkspace').classList.remove('hidden');

    const vid = document.getElementById('previewVideo');
    vid.src = state.video.url;
    vid.controls = false;
    vid.onloadedmetadata = () => { updateTimeLabel(); };
    vid.ontimeupdate = onVideoTimeUpdate;
    vid.onended = () => { document.getElementById('playBtn').innerHTML = ic('play','i fill'); };

    document.getElementById('detectedLangTag').textContent = mostCommonLang(segments) + ' (demo transcript)';
    renderTranscript();
    buildPresetRow();
    applyStyle();
    showToast('Demo transcript ready — connect Groq + Vercel Blob for real transcription (see README).', 'success');
  } catch(err){
    console.error('finishPipelineDemo failed:', err);
    document.getElementById('pipelinePanel').classList.add('hidden');
    document.getElementById('uploadPanel').classList.remove('hidden');
    showToast('Something went wrong building the demo transcript: ' + err.message, 'error');
  }
}

function mostCommonLang(segments){
  if(!segments || !segments.length) return 'Unknown';
  const counts = {};
  segments.forEach(s=> counts[s.lang] = (counts[s.lang]||0)+1);
  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0] + (Object.keys(counts).length>1 ? ' (mixed detected)' : '');
}

function renderTranscript(){
  const list = document.getElementById('transcriptList');
  if(!state.video.segments || !state.video.segments.length){
    list.innerHTML = `<div class="empty-state"><div class="ic">${ic('text','i lg')}</div><h4>No caption lines yet</h4><p>Something prevented captions from generating for this clip. Try re-uploading, or a different file.</p></div>`;
    return;
  }
  list.innerHTML = state.video.segments.map(s => `
    <div class="seg-row" id="row-${s.id}" onclick="jumpToSegment('${s.id}', event)">
      <div class="seg-time">
        <input type="number" step="0.1" value="${s.start}" onclick="event.stopPropagation()" onchange="updateSegTime('${s.id}','start',this.value)"> –
        <input type="number" step="0.1" value="${s.end}" onclick="event.stopPropagation()" onchange="updateSegTime('${s.id}','end',this.value)"><br>seconds
      </div>
      <textarea class="seg-text" rows="2" onclick="event.stopPropagation()" oninput="updateSegText('${s.id}',this.value)">${esc(s.text)}</textarea>
      <span class="seg-lang">${esc(s.lang)}</span>
      <button class="seg-del" onclick="event.stopPropagation();deleteSegment('${s.id}')" aria-label="Delete line">${ic('x')}</button>
    </div>`).join('');
}
function updateSegTime(id, field, val){
  const s = state.video.segments.find(x=>x.id===id);
  if(s){ s[field] = parseFloat(val) || 0; s.words = null; }   // manual timing edit: drop Whisper word times
  invalidateCues();
}
function updateSegText(id, val){
  const s = state.video.segments.find(x=>x.id===id);
  if(s) s.text = val;
  invalidateCues();
}
function deleteSegment(id){
  state.video.segments = state.video.segments.filter(s=>s.id!==id);
  renderTranscript();
  invalidateCues();
}
function jumpToSegment(id){
  const s = state.video.segments.find(x=>x.id===id);
  const vid = document.getElementById('previewVideo');
  if(s){ vid.currentTime = s.start; vid.play(); document.getElementById('playBtn').innerHTML = ic('pause','i fill'); }
}

/* preview playback + caption sync */
function togglePlay(){
  const vid = document.getElementById('previewVideo');
  if(vid.paused){ vid.play(); document.getElementById('playBtn').innerHTML = ic('pause','i fill'); }
  else { vid.pause(); document.getElementById('playBtn').innerHTML = ic('play','i fill'); }
}
function onVideoTimeUpdate(){
  const vid = document.getElementById('previewVideo');
  updateTimeLabel();
  document.getElementById('scrubFill').style.width = (vid.duration ? (vid.currentTime/vid.duration*100) : 0) + '%';
  const current = state.video.segments.find(s => vid.currentTime >= s.start && vid.currentTime < s.end);
  document.querySelectorAll('.seg-row').forEach(r=>r.classList.remove('playing'));
  if(current){ const row = document.getElementById('row-'+current.id); if(row) row.classList.add('playing'); }
  requestPaint();
}
function updateTimeLabel(){
  const vid = document.getElementById('previewVideo');
  const fmt = t => { t = t||0; const m = Math.floor(t/60), s = Math.floor(t%60); return m+':'+String(s).padStart(2,'0'); };
  document.getElementById('timeLabel').textContent = `${fmt(vid.currentTime)} / ${fmt(vid.duration)}`;
}
function scrubSeek(e){
  const vid = document.getElementById('previewVideo');
  const rect = document.getElementById('scrub').getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  vid.currentTime = pct * (vid.duration || 0);
}

/* tabs */
function switchTab(name){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active', p.id==='tab-'+name));
}

/* styling */
function presetSwatch(p){
  const cs = p.case || 'normal';
  const track = cs.includes('wide') ? (cs.startsWith('upper') ? '.12em' : '.05em') : '0';
  let st = `font-family:${p.font};font-weight:${p.weight||800};color:${p.color};letter-spacing:${track};`;
  if(cs.startsWith('upper')) st += 'text-transform:uppercase;';
  if(cs==='italic') st += 'font-style:italic;';
  const acc = p.accent || '#F2A93B';
  if(p.bg==='box') st += 'background:rgba(0,0,0,.6);padding:3px 9px;border-radius:6px;';
  else if(p.bg==='pill') st += `background:${acc};padding:3px 12px;border-radius:99px;`;
  else if(p.bg==='glass') st += 'background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);padding:3px 11px;border-radius:10px;';
  else if(p.bg==='marker') st += `background:${acc};padding:1px 8px;border-radius:3px;`;
  else if(p.bg==='gradient') st += 'background:linear-gradient(transparent,rgba(0,0,0,.7));padding:3px 9px;';
  if(p.outline==='glow') st += `text-shadow:0 0 6px ${acc},0 0 14px ${acc};`;
  else if(p.outline==='shadow') st += 'text-shadow:0 2px 5px rgba(0,0,0,.9);';
  else if(p.outline==='soft') st += 'text-shadow:0 1px 3px rgba(0,0,0,.7);';
  else if(p.outline==='outline') st += '-webkit-text-stroke:1px #000;';
  return `<div class="swatch sw-sample"><span style="${st}">Lafzaly</span></div>`;
}
function buildPresetRow(){
  const row = document.getElementById('presetRow');
  row.innerHTML = Object.entries(STYLE_PRESETS).map(([name,p],idx) => `
    <div class="preset-card${idx===0?' selected':''}" data-preset="${name}" onclick="applyPreset('${name}', this)">
      ${presetSwatch(p)}
      <b>${name}</b>
    </div>`).join('');
  applyPreset('TikTok Style', row.querySelector('.preset-card'));
}
function applyPreset(name, node){
  document.querySelectorAll('.preset-card').forEach(c=>c.classList.remove('selected'));
  if(node) node.classList.add('selected');
  const p = STYLE_PRESETS[name];
  document.getElementById('styleFont').value = p.font;
  document.getElementById('styleFontSize').value = p.size;
  document.getElementById('fontSizeVal').textContent = p.size;
  document.getElementById('stylePosition').value = p.pos;
  document.getElementById('styleAlign').value = p.align;
  syncPosGrid();
  document.getElementById('styleColor').value = p.color;
  document.getElementById('styleAccent').value = p.accent || '#F2A93B';
  document.getElementById('styleWeight').value = String(p.weight || 800);
  document.getElementById('styleCase').value = p.case || 'normal';
  document.getElementById('styleBg').value = p.bg;
  document.getElementById('styleOutline').value = p.outline;
  document.getElementById('styleAnim').value = p.anim;
  document.getElementById('styleChunk').value = String(p.chunk || 0);
  document.getElementById('styleHighlight').checked = p.hl;
  applyStyle();
}
function readStyle(){
  const v = id => document.getElementById(id).value;
  return {
    font:v('styleFont'), size:+v('styleFontSize'), pos:v('stylePosition'), align:v('styleAlign'),
    color:v('styleColor'), accent:v('styleAccent'), weight:v('styleWeight'), caseMode:v('styleCase'),
    bg:v('styleBg'), outline:v('styleOutline'), anim:v('styleAnim'),
    hl:document.getElementById('styleHighlight').checked, chunk:+v('styleChunk')
  };
}
function setCapPos(v, h){
  document.getElementById('stylePosition').value = v;
  document.getElementById('styleAlign').value = h;
  syncPosGrid(); applyStyle();
}
function syncPosGrid(){
  const pv = parseFloat(document.getElementById('stylePosition').value) || 8;
  const v = pv >= 70 ? '80%' : (pv >= 35 ? '45%' : '8%');   // lower-third presets (20%) sit in the bottom row
  const h = document.getElementById('styleAlign').value || 'center';
  let label = '';
  document.querySelectorAll('#posGrid button').forEach(b => {
    const on = b.dataset.v === v && b.dataset.h === h;
    b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
    if(on) label = b.getAttribute('aria-label');
  });
  const hint = document.getElementById('posHint'); if(hint) hint.textContent = label;
}
function applyStyle(){
  document.getElementById('fontSizeVal').textContent = document.getElementById('styleFontSize').value;
  CaptionEngine.fontReady(readStyle()).then(requestPaint);
  requestPaint();
}

/* ---- live preview: canvas draws the video frame + animated captions (same engine as export) ---- */
let _cues = null, _cuesSegs = null, _cuesChunk = -1, _cuesRev = 0, _paintQueued = false, _loopOn = false;
function invalidateCues(){ _cuesRev++; requestPaint(); }
function getCues(chunk){
  const segs = state.video.segments || [];
  if(!_cues || _cuesSegs !== segs || _cuesChunk !== chunk || _cues._rev !== _cuesRev){
    _cues = CaptionEngine.buildCues(segs, chunk); _cues._rev = _cuesRev; _cuesSegs = segs; _cuesChunk = chunk;
  }
  return _cues;
}
function sizePreviewCanvas(){
  const c = document.getElementById('previewCanvas'); if(!c) return false;
  const r = c.getBoundingClientRect(); if(!r.width) return false;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.round(r.width*dpr), h = Math.round(r.height*dpr);
  if(c.width !== w || c.height !== h){ c.width = w; c.height = h; }
  return true;
}
function paintPreview(){
  const c = document.getElementById('previewCanvas'), vid = document.getElementById('previewVideo');
  if(!c || !vid || !sizePreviewCanvas()) return;
  const ctx = c.getContext('2d'), W = c.width, H = c.height;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
  let dx = 0, dy = 0, dw = W, dh = H;
  const hasVideo = vid.videoWidth > 0 && vid.readyState >= 2;
  if(hasVideo){
    const sc = Math.min(W/vid.videoWidth, H/vid.videoHeight);
    dw = vid.videoWidth*sc; dh = vid.videoHeight*sc; dx = (W-dw)/2; dy = (H-dh)/2;
    ctx.drawImage(vid, dx, dy, dw, dh);
  } else {
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#16301f'); g.addColorStop(1,'#07100a');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }
  const st = readStyle();
  ctx.save(); ctx.beginPath(); ctx.rect(dx,dy,dw,dh); ctx.clip(); ctx.translate(dx,dy);
  CaptionEngine.draw(ctx, dw, dh, vid.currentTime || 0, getCues(st.chunk), st, {
    drawBackdrop: () => { if(hasVideo) ctx.drawImage(vid, 0, 0, dw, dh); }
  });
  ctx.restore();
}
function requestPaint(){
  if(_paintQueued) return;
  _paintQueued = true;
  requestAnimationFrame(() => { _paintQueued = false; try{ paintPreview(); }catch(e){ console.error('preview paint failed', e); } });
}
function previewLoop(){
  const vid = document.getElementById('previewVideo');
  if(!vid || vid.paused || vid.ended){ _loopOn = false; requestPaint(); return; }
  paintPreview();
  requestAnimationFrame(previewLoop);
}
function initPreviewCanvas(){
  const vid = document.getElementById('previewVideo'), c = document.getElementById('previewCanvas');
  if(!vid || !c || vid._wired) return;
  vid._wired = true;
  vid.addEventListener('play', () => { if(!_loopOn){ _loopOn = true; requestAnimationFrame(previewLoop); } });
  ['pause','seeked','loadeddata','loadedmetadata','ended'].forEach(ev => vid.addEventListener(ev, requestPaint));
  if(window.ResizeObserver) new ResizeObserver(requestPaint).observe(c);
  window.addEventListener('resize', requestPaint);
}

/* export */
function fmtSRTTime(t){
  const h = Math.floor(t/3600), m = Math.floor((t%3600)/60), s = Math.floor(t%60), ms = Math.round((t-Math.floor(t))*1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
}
function fmtVTTTime(t){ return fmtSRTTime(t).replace(',', '.'); }
function buildSubtitleFile(format){
  const segs = state.video.segments;
  if(format==='srt'){
    return segs.map((s,i)=> `${i+1}\n${fmtSRTTime(s.start)} --> ${fmtSRTTime(s.end)}\n${s.text}\n`).join('\n');
  }
  return 'WEBVTT\n\n' + segs.map(s=> `${fmtVTTTime(s.start)} --> ${fmtVTTTime(s.end)}\n${s.text}\n`).join('\n');
}
function downloadBlob(content, filename, type){
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}
function downloadSubs(format){
  if(!state.video.segments.length){ showToast('No transcript to export yet.', 'error'); return; }
  const content = buildSubtitleFile(format);
  downloadBlob(content, `lafzaly-captions.${format}`, format==='srt' ? 'application/x-subrip' : 'text/vtt');
  showToast(`${format.toUpperCase()} file downloaded.`, 'success');
}
function copyTranscript(){
  if(!state.video.segments.length){ showToast('No transcript to copy yet.', 'error'); return; }
  const text = state.video.segments.map(s=>s.text).join('\n');
  navigator.clipboard.writeText(text).then(()=>showToast('Transcript copied.', 'success'));
}
/* ---- Captioned video export: canvas + MediaRecorder, entirely in the browser ----
   Plays the video once in a hidden element, draws every frame plus the animated captions onto a canvas
   (same engine as the preview), and records the canvas together with the audio track. */
let exportJob = null;
function pickExportMime(){
  const cands = [
    // H.264 + AAC MP4 first (what Instagram / TikTok / phones expect); WebM only if the browser has no H.264 recorder
    ['video/mp4;codecs=avc1.640028,mp4a.40.2','mp4'], ['video/mp4;codecs=avc1.4D401F,mp4a.40.2','mp4'],
    ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'], ['video/mp4;codecs=avc1,mp4a.40.2','mp4'],
    ['video/webm;codecs=vp9,opus','webm'], ['video/webm;codecs=vp8,opus','webm'], ['video/webm','webm']
  ];
  for(const [m,ext] of cands){ try{ if(MediaRecorder.isTypeSupported(m)) return {mime:m, ext}; }catch(e){} }
  return null;
}
function setExportUI(running, pct, label){
  const btn = document.getElementById('exportBtn'), wrap = document.getElementById('exportProgress');
  if(!btn || !wrap) return;
  btn.innerHTML = running ? ic('x')+' Cancel export' : ic('download')+' Export captioned video';
  wrap.classList.toggle('hidden', !running && !label);
  if(pct != null) document.getElementById('exportBar').style.width = pct + '%';
  document.getElementById('exportLabel').textContent = label || '';
}
function cancelExport(){ if(exportJob){ exportJob.cancelled = true; exportJob.finish(); } }
async function exportVideo(){
  if(exportJob){ cancelExport(); return; }
  if(!state.video.segments || !state.video.segments.length){ showToast('No captions to export yet.', 'error'); return; }
  if(!state.video.url){ showToast('Video file is not available. Please upload it again.', 'error'); return; }
  if(!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream){
    showToast('Your browser cannot record video. Please use a recent Chrome, Edge or Firefox on a computer or Android phone. You can still download the SRT/VTT.', 'error'); return;
  }
  const fmt = pickExportMime();
  if(!fmt){ showToast('This browser has no supported video recorder. Try Chrome or Edge.', 'error'); return; }

  const preview = document.getElementById('previewVideo'); try{ preview.pause(); }catch(e){}
  const job = exportJob = { cancelled:false, finish(){} };
  setExportUI(true, 0, 'Preparing…');

  const v = document.createElement('video');
  v.playsInline = true; v.preload = 'auto'; v.src = state.video.url;
  let ac = null, recorder = null, raf = 0, stallTimer = 0;
  const cleanup = () => {
    cancelAnimationFrame(raf); clearInterval(stallTimer);
    try{ if(recorder && recorder.state !== 'inactive') recorder.stop(); }catch(e){}
    try{ v.pause(); }catch(e){} try{ v.removeAttribute('src'); v.load(); }catch(e){}
    try{ if(ac) ac.close(); }catch(e){}
    exportJob = null;
  };
  try{
    await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('Could not read the video file.')); });
    const st = readStyle();
    await CaptionEngine.fontReady(st);
    const cues = CaptionEngine.buildCues(state.video.segments, st.chunk);

    // output size: native size, capped at 1080x1920 (or 1920x1080), always even numbers
    let vw = v.videoWidth, vh = v.videoHeight;
    const audioOnly = !vw || !vh;
    if(audioOnly){ vw = 1080; vh = 1920; }
    const portrait = vh >= vw, maxW = portrait ? 1080 : 1920, maxH = portrait ? 1920 : 1080;
    const sc = Math.min(1, maxW/vw, maxH/vh);
    const W = Math.max(2, Math.round(vw*sc/2)*2), H = Math.max(2, Math.round(vh*sc/2)*2);
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    ac = new (window.AudioContext || window.webkitAudioContext)();
    if(ac.state === 'suspended') await ac.resume();
    const dest = ac.createMediaStreamDestination();
    ac.createMediaElementSource(v).connect(dest);   // routed to the recorder only, so nothing plays out loud
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));

    const chunks = [];
    recorder = new MediaRecorder(stream, { mimeType: fmt.mime, videoBitsPerSecond: 8e6, audioBitsPerSecond: 128e3 });
    recorder.ondataavailable = e => { if(e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise(res => { recorder.onstop = res; });

    const duration = (isFinite(v.duration) && v.duration > 0) ? v.duration : Math.max(...state.video.segments.map(x => x.end));
    const drawFrame = () => {
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
      if(!audioOnly && v.readyState >= 2) ctx.drawImage(v, 0, 0, W, H);
      else if(audioOnly){ const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#16301f'); g.addColorStop(1,'#07100a'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H); }
      CaptionEngine.draw(ctx, W, H, v.currentTime, cues, st, { drawBackdrop: () => { if(!audioOnly) ctx.drawImage(v, 0, 0, W, H); } });
    };
    let done = false;
    job.finish = () => { if(done) return; done = true; try{ if(recorder.state !== 'inactive') recorder.stop(); }catch(e){} };
    v.onended = () => setTimeout(job.finish, 250);

    drawFrame();
    recorder.start(500);
    let lastT = -1, lastMove = performance.now();
    const loop = () => {
      if(done) return;
      drawFrame();
      const t = v.currentTime, pct = Math.min(99, Math.round(t/duration*100));
      setExportUI(true, pct, `Rendering captions into your video… ${pct}%` + (document.hidden ? ' (tab in background — switch back to this tab)' : ''));
      if(t !== lastT){ lastT = t; lastMove = performance.now(); }
      raf = requestAnimationFrame(loop);
    };
    stallTimer = setInterval(() => { if(!done && performance.now() - lastMove > 8000){ job.stalled = true; job.finish(); } }, 1000);
    await v.play();
    raf = requestAnimationFrame(loop);
    await stopped;

    if(job.cancelled){ setExportUI(false, 0, ''); showToast('Export cancelled.', 'success'); return; }
    if(job.stalled && lastT < duration - 1){ throw new Error('Rendering stalled. Keep this tab in the foreground while exporting and try again.'); }
    const blob = new Blob(chunks, { type: fmt.mime.split(';')[0] });
    if(!blob.size) throw new Error('The recording came out empty.');
    downloadBlob(blob, 'lafzaly-captioned.' + fmt.ext, blob.type);
    setExportUI(false, 100, 'Done — your captioned video was downloaded.');
    showToast(fmt.ext === 'mp4' ? 'Captioned video downloaded (MP4).' : 'Captioned video downloaded (WebM). Convert to MP4 if the app you post to requires it.', 'success');
  } catch(err){
    console.error('export failed:', err);
    setExportUI(false, 0, '');
    showToast('Export failed: ' + (err.message || 'unknown error'), 'error');
  } finally {
    cleanup();
    requestPaint();
  }
}

/* ===================== INIT ===================== */
function init(){
  initPreviewCanvas();
  renderExamples(); showEmptyBoard(); updateTopicCount(); updateGenNote();
  buildChipGroup('platformChips','platform');
  buildChipGroup('typeChips','type');
  buildChipGroup('toneChips','tone');
  buildChipGroup('lengthChips','length');
  buildChipGroup('countChips','count');
  initDropzone(); syncPosGrid();
  updateUsageDisplays();

  refreshSession().then(() => {
    const params = new URLSearchParams(window.location.search);
    const clean = () => window.history.replaceState({}, '', window.location.pathname);
    if(params.get('upgraded') === '1'){
      showToast('You are now on Lafzaly Pro!', 'success');
      clean();
    } else if(params.get('upgrade_cancelled') === '1'){
      showToast('Checkout was cancelled — no charge was made.', 'success');
      clean();
    }
    showSubview(viewFromPath());
    document.getElementById('view-app').classList.add('ready');
  });
}
document.addEventListener('DOMContentLoaded', init);