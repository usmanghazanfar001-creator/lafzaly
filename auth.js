/* Login / signup pages */
(function(){
  const mode = document.body.dataset.mode;           // 'login' | 'signup'
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  // only same-site paths are allowed as a post-login destination
  let next = params.get('next') || '/app';
  if(!/^\/(?!\/)/.test(next)) next = '/app';
  const alt = $('altLink');
  if(alt && params.get('next')) alt.href += '?next=' + encodeURIComponent(next);

  // already signed in? go straight to the app
  fetch('/api/auth-me').then(r=>r.json()).then(d=>{ if(d && d.user) location.replace(next); }).catch(()=>{});

  const err = $('authError');
  function showErr(msg){ err.textContent = msg; err.classList.add('show'); }
  $('pwToggle').addEventListener('click', () => {
    const p = $('authPassword'), show = p.type === 'password';
    p.type = show ? 'text' : 'password';
    $('pwToggle').textContent = show ? 'Hide' : 'Show';
    $('pwToggle').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  const forgot = $('forgotBtn');
  if(forgot) forgot.addEventListener('click', () => {
    showErr('Password reset is not available yet. Contact support from the Contact page and we will help you get back in.');
  });
  $('authForm').addEventListener('submit', async e => {
    e.preventDefault();
    err.classList.remove('show');
    const email = $('authEmail').value.trim(), password = $('authPassword').value;
    if(!email.includes('@') || !email.includes('.')){ showErr('Enter a valid email address.'); $('authEmail').focus(); return; }
    if(password.length < 6){ showErr('Password must be at least 6 characters.'); $('authPassword').focus(); return; }
    const btn = $('authSubmitBtn'), label = btn.textContent;
    btn.disabled = true; btn.textContent = mode === 'signup' ? 'Creating account…' : 'Logging in…';
    try{
      const res = await fetch(mode === 'signup' ? '/api/auth-signup' : '/api/auth-login', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      location.href = next;
    }catch(ex){
      showErr(ex.message);
      btn.disabled = false; btn.textContent = label;
    }
  });
  $('authEmail').focus();
})();
