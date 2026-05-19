/* ============================================
   MAIN.JS — Dubai Investment Solutions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initTypewriter();
  initScrollReveal();
  initCounters();
  initCarousels();
  initModal();
  initMobileMenu();
  initSmoothScroll();
});

/* ---- NAVBAR ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ---- HERO BG LOAD ---- */
function initHero() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const img = new Image();
  img.src = heroBg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
  img.onload = () => heroBg.classList.add('loaded');
  setTimeout(() => heroBg.classList.add('loaded'), 1000);
}

/* ---- TYPEWRITER ---- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['Dubai Properties', 'Golden Visa', 'Virtual Offices', 'Labor Camps', 'Smart Investment'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx];
    if (deleting) {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, 500);
        return;
      }
    } else {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  setTimeout(tick, 800);
}

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---- COUNTERS ---- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, step);
}

/* ---- CAROUSELS (for office/labor cards) ---- */
function initCarousels() {
  document.querySelectorAll('.card-carousel').forEach(carousel => {
    const container = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    if (!container || !prevBtn || !nextBtn) return;

    const slides = container.querySelectorAll('.carousel-slide');
    let idx = 0;

    function go(n) {
      idx = ((n % slides.length) + slides.length) % slides.length;
      container.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    prevBtn.addEventListener('click', e => { e.stopPropagation(); go(idx - 1); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); go(idx + 1); });
    dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); go(i); }));
  });
}

/* ---- MODAL ---- */
function initModal() {
  const backdrop = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const form = document.getElementById('modalForm');
  const successMsg = document.getElementById('modalSuccess');

  if (!backdrop) return;

  const descriptions = {
    'Virtual Offices': 'Affordable virtual offices in prime Dubai locations. Full Ejari support, license renewal, and family sponsorship assistance.',
    'Physical Offices': 'Fully furnished offices with DEWA, Wi-Fi, meeting rooms, pantry and parking — ready to move in.',
    'Property Investment': 'Exclusive apartments, penthouses, villas and townhouses — both off-plan and ready to move. Let\'s find your perfect investment.',
    'Labor Camps': 'Staff accommodation in Al Quoz & Jebel Ali with quick Ejari and flexible terms. Luxury executive apartments also available.',
    'Data Analysis': 'Market analytics and investment data insights tailored for the UAE property market.',
    'Creative Design': 'Professional branding, logo design, and marketing materials to elevate your business presence.',
  };

  document.querySelectorAll('[data-service]').forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.carousel-prev, .carousel-next, .carousel-dot')) return;
      const service = this.dataset.service;
      modalTitle.textContent = `Inquire — ${service}`;
      modalDesc.textContent = descriptions[service] || '';
      form.reset();
      successMsg.classList.remove('show');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn && closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  form && form.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const data = new FormData(form);
    data.append('_subject', `New Inquiry: ${modalTitle.textContent}`);
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    try {
      const res = await fetch('https://formsubmit.co/jararali11@gmail.com', { method: 'POST', body: data });
      if (res.ok) {
        form.reset();
        successMsg.classList.add('show');
        setTimeout(closeModal, 3000);
      }
    } catch {
      alert('Error sending message. Please try again or contact via WhatsApp.');
    } finally {
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
    }
  });
}

/* ---- MOBILE MENU ---- */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    btn.innerHTML = isOpen ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    });
  });
}

/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---- CONTACT FORM (main page) ---- */
const mainForm = document.getElementById('mainContactForm');
if (mainForm) {
  mainForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = mainForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch('https://formsubmit.co/jararali11@gmail.com', { method: 'POST', body: new FormData(mainForm) });
      if (res.ok) {
        btn.textContent = '✓ Message Sent!';
        mainForm.reset();
        setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 4000);
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}
