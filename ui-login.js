// ui-login.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Utilidades de viewport =====
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const mqMobile = window.matchMedia('(max-width: 980px)');

  // ===== Chispitas =====
  let sparksRoot = document.getElementById('sparks');
  if (!sparksRoot) {
    // Si no existe el contenedor, lo creamos al vuelo
    sparksRoot = document.createElement('div');
    sparksRoot.id = 'sparks';
    document.body.appendChild(sparksRoot);
  }

  function spawnSpark(x, y) {
    const s = document.createElement('span');
    s.className = 'spark';
    const size = 6 + Math.random() * 8;
    const hue  = Math.floor(Math.random() * 360);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = x + 'px';
    s.style.top  = y + 'px';
    s.style.setProperty('--tx', (Math.random() * 140 - 70) + 'px');
    s.style.setProperty('--ty', (Math.random() * -120 - 40) + 'px');
    s.style.setProperty('--life', (600 + Math.random() * 400) + 'ms');
    s.style.setProperty('--c', `hsl(${hue} 90% 65%)`);
    sparksRoot.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
  function burst({x, y, count = 18}) { for (let i = 0; i < count; i++) spawnSpark(x, y); }

  if (!isTouch) {
    document.addEventListener('click', e => {
      // efecto solo si haces click en el fondo, no sobre inputs/links
      if (!e.target.closest('input,button,a,label')) {
        burst({ x: e.clientX, y: e.clientY, count: 16 });
      }
    }, { passive: true });
  }

  // Botón del formulario (si existe)
  const form = document.getElementById('loginForm');
  const signInBtn = form?.querySelector('button[type="submit"]');
  if (signInBtn) {
    signInBtn.addEventListener('click', e => {
      if (isTouch) {
        const r = signInBtn.getBoundingClientRect();
        burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 14 });
      }
      // La lógica real de login la maneja auth.js (Firebase)
    }, { passive: true });
  }

  const forgot = document.getElementById('forgot');
  if (forgot) {
    forgot.addEventListener('click', e => {
      e.preventDefault();
      alert('Recovery flow coming soon ✨');
    });
  }

  // ===== Animación móvil: Welcome (5s) ↔ Logo (15s) =====
  const hero       = document.querySelector('.hero');
  const welcomeImg = document.getElementById('welcomeMobileImg');
  const brandBlock = document.getElementById('brandBlock');

  let effectToggle = 0; // alterna pincelado / fade

  function transition(toLogo){
    if (!hero || !welcomeImg || !brandBlock) return;
    const effect = (effectToggle++ % 2 === 0) ? 'brush' : 'fade';

    if (effect === 'brush') {
      const layer = document.createElement('div');
      layer.className = 'wipe-layer run';
      hero.appendChild(layer);

      if (toLogo) {
        brandBlock.classList.remove('hide');
        brandBlock.classList.add('fade-in-delayed');
        welcomeImg.classList.add('fade-out-slight');
        setTimeout(() => {
          welcomeImg.classList.add('hide');
          welcomeImg.classList.remove('fade-out-slight');
          brandBlock.classList.remove('fade-in-delayed');
          layer.remove();
        }, 740);
      } else {
        welcomeImg.classList.remove('hide');
        welcomeImg.classList.add('fade-in-delayed');
        brandBlock.classList.add('fade-out-slight');
        setTimeout(() => {
          brandBlock.classList.add('hide');
          brandBlock.classList.remove('fade-out-slight');
          welcomeImg.classList.remove('fade-in-delayed');
          layer.remove();
        }, 740);
      }
    } else {
      if (toLogo) {
        welcomeImg.classList.add('fade-out');
        brandBlock.classList.remove('hide');
        brandBlock.classList.add('fade-in');
        setTimeout(() => {
          welcomeImg.classList.add('hide');
          welcomeImg.classList.remove('fade-out');
          brandBlock.classList.remove('fade-in');
        }, 560);
      } else {
        brandBlock.classList.add('fade-out');
        welcomeImg.classList.remove('hide');
        welcomeImg.classList.add('fade-in');
        setTimeout(() => {
          brandBlock.classList.add('hide');
          brandBlock.classList.remove('fade-out');
          welcomeImg.classList.remove('fade-in');
        }, 560);
      }
    }
  }

  function startMobileLoop(){
    if (!welcomeImg || !brandBlock) return;
    function cycle(){
      // Welcome 5s
      brandBlock.classList.add('hide');
      welcomeImg.classList.remove('hide');

      setTimeout(() => {
        // A logo
        transition(true);

        // Logo 15s
        setTimeout(() => {
          // Volver a Welcome
          transition(false);

          // Repetir tras 5s
          setTimeout(cycle, 5000);
        }, 15000);
      }, 5000);
    }
    cycle();
  }

  function setupByViewport(){
    if (!welcomeImg || !brandBlock) return;
    if (mqMobile.matches || isTouch) {
      startMobileLoop();
    } else {
      // PC: logo estático, Welcome fijo a la izquierda
      welcomeImg.classList.add('hide');
      brandBlock.classList.remove('hide');
    }
  }
  setupByViewport();
  mqMobile.addEventListener?.('change', setupByViewport);
});
