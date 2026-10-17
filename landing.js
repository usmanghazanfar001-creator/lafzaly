/* Landing page: hero demo, FAQ accordion, session-aware nav */
function toggleFaq(i){
  const item = document.getElementById('faq-'+i);
  const a = item.querySelector('.faq-a');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f=>{ f.classList.remove('open'); f.querySelector('.faq-a').style.maxHeight = null; });
  document.querySelectorAll('.faq-q').forEach(b=>b.setAttribute('aria-expanded','false'));
  if(!open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight+20+'px'; item.querySelector('.faq-q').setAttribute('aria-expanded','true'); }
}


const HERO_DEMOS = [
  { text:"Faisalabad mein investment ka plan bana rahe hain? Canal Road par prime location mein behtareen opportunity aapka intezar kar rahi hai.", tags:['#RealEstate','#Faisalabad','#InstaReels'] },
  { text:"Ye 3 tips follow karo aur apna reel views raat ko raat double kar do — bilkul asaan tareeke se.", tags:['#TikTokPakistan','#GrowthTips','#Viral'] },
  { text:"Naya menu launch ho gaya hai! Aaj hi visit karein aur pehla order par mufta drink paayein.", tags:['#Promotional','#ShopNow','#Karachi'] }
];
let heroIdx = 0;
// Hero phone: the demo caption plays like a real word-by-word (karaoke) subtitle.
function typewriterLoop(){
  const el = document.getElementById('heroTypewriter');
  const tagsEl = document.getElementById('heroTags');
  if(!el) return;
  const demo = HERO_DEMOS[heroIdx % HERO_DEMOS.length];
  const words = demo.text.split(' ');
  tagsEl.innerHTML = '';
  el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
  const spans = el.querySelectorAll('.w');
  if(REDUCED){
    spans.forEach(s => s.classList.add('done'));
    tagsEl.innerHTML = demo.tags.map(t=>`<span class="demo-tag">${t}</span>`).join('');
    setTimeout(()=>{ heroIdx++; typewriterLoop(); }, 4200);
    return;
  }
  let i = 0;
  const iv = setInterval(()=>{
    if(i > 0){ spans[i-1].classList.remove('act'); spans[i-1].classList.add('done'); }
    if(i >= spans.length){
      clearInterval(iv);
      tagsEl.innerHTML = demo.tags.map(t=>`<span class="demo-tag">${t}</span>`).join('');
      setTimeout(()=>{ heroIdx++; typewriterLoop(); }, 2600);
      return;
    }
    spans[i].classList.add('act');
    i++;
  }, 240);
}

// The page headings caption themselves: words light up one by one, like subtitles being spoken.
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
function wrapWords(node, out){
  Array.from(node.childNodes).forEach(n => {
    if(n.nodeType === 3){
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if(!part) return;
        if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span'); s.className = 'kw'; s.textContent = part; out.push(s); frag.appendChild(s);
      });
      n.replaceWith(frag);
    } else if(n.nodeType === 1 && n.tagName !== 'BR'){ wrapWords(n, out); }
  });
}
function playCaption(h){
  const words = h._kw; let i = 0;
  const step = () => {
    if(i > 0) words[i-1].classList.remove('pop');
    if(i >= words.length) return;
    words[i].classList.add('on', 'pop'); i++;
    setTimeout(step, Math.max(70, Math.min(150, 1100 / words.length)));
  };
  step();
}
function initCaptionHeadings(){
  const heads = Array.from(document.querySelectorAll('.hero h1, .section-head h2'));
  if(!heads.length) return;
  heads.forEach(h => { h._kw = []; wrapWords(h, h._kw); });
  if(REDUCED || !('IntersectionObserver' in window)){ return; }
  document.documentElement.classList.add('js-kw');
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if(en.isIntersecting){ io.unobserve(en.target); playCaption(en.target); }
  }), { threshold:.4 });
  heads.forEach(h => io.observe(h));
}

document.addEventListener('DOMContentLoaded', () => {
  initCaptionHeadings();
  typewriterLoop();
  fetch('/api/auth-me').then(r=>r.json()).then(d=>{
    if(d && d.user){
      const l=document.getElementById('navLogin'), s=document.getElementById('navSignup');
      if(l){ l.textContent='Dashboard'; l.href='/app'; }
      if(s){ s.textContent='Generate captions'; s.href='/app'; }
    }
  }).catch(()=>{});
});
