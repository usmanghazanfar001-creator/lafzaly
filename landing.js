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
function typewriterLoop(){
  const el = document.getElementById('heroTypewriter');
  const tagsEl = document.getElementById('heroTags');
  if(!el) return;
  const demo = HERO_DEMOS[heroIdx % HERO_DEMOS.length];
  let i = 0;
  tagsEl.innerHTML = '';
  el.innerHTML = '<span class="cursor"></span>';
  const typeIv = setInterval(()=>{
    i++;
    el.innerHTML = demo.text.slice(0,i) + '<span class="cursor"></span>';
    if(i >= demo.text.length){
      clearInterval(typeIv);
      tagsEl.innerHTML = demo.tags.map(t=>`<span class="demo-tag">${t}</span>`).join('');
      setTimeout(()=>{ heroIdx++; typewriterLoop(); }, 2600);
    }
  }, 28);
}


document.addEventListener('DOMContentLoaded', () => {
  typewriterLoop();
  fetch('/api/auth-me').then(r=>r.json()).then(d=>{
    if(d && d.user){
      const l=document.getElementById('navLogin'), s=document.getElementById('navSignup');
      if(l){ l.textContent='Dashboard'; l.href='/app'; }
      if(s){ s.textContent='Generate captions'; s.href='/app'; }
    }
  }).catch(()=>{});
});
