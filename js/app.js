/* ============================================================
   BRAINLAB — Production JavaScript
   Author: Shiva Kumar | BrainLab
   Features: Loader, Nav, Reveal, Counters, Particles,
             Portfolio Filter, Pricing Toggle, FAQ, Form,
             Floating Buttons, Newsletter, Keyboard Nav
   ============================================================ */

'use strict';

/* ── Utility: run after DOM ready ─────────────────────────── */
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

onReady(() => {
  initLoader();
  initNav();
  initParticles();
  initScrollReveal();
  initCounters();
  initPortfolioFilter();
  initPricingToggle();
  initFAQ();
  initContactForm();
  initFloatingButtons();
  initFooterYear();
  initNewsletter();
  initHeroDeviceHover();
});

/* ═══════════════════════════════════════════════════════════
   PAGE LOADER
═══════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Prevent body scroll while loading
  document.body.style.overflow = 'hidden';

  const done = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger hero animations after load
    document.querySelectorAll('.hero-text > *').forEach((el, i) => {
      el.style.animationDelay = `${i * 120}ms`;
    });
  };

  if (document.readyState === 'complete') {
    setTimeout(done, 500);
  } else {
    window.addEventListener('load', () => setTimeout(done, 400));
    // Fallback in case load takes too long
    setTimeout(done, 3500);
  }
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
function initNav() {
  const nav       = document.getElementById('site-nav');
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobile-drawer');
  const navLinks  = document.querySelectorAll('.nav-links a');

  /* Active link tracking */
  const sections = [...document.querySelectorAll('section[id]')];

  function updateActiveLink() {
    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 70;
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= navHeight + 60) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  /* Sticky background on scroll */
  const handleScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Mobile drawer toggle */
  if (hamburger && drawer) {
    const openDrawer = () => {
      hamburger.classList.add('open');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', () => {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PARTICLES (Hero background)
═══════════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 768 ? 12 : 24;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 3 + 1;
    const xPos  = Math.random() * 100;
    const dur   = Math.random() * 20 + 15;
    const delay = Math.random() * 12;
    const opacity = Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${xPos}%;
      bottom: -10px;
      opacity:${opacity};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      background: hsl(${Math.random() > 0.5 ? 160 : 218}, 75%, 65%);
    `;
    fragment.appendChild(p);
  }
  container.appendChild(fragment);

  // Inject particle-float keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particle-float {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  if ('IntersectionObserver' in window === false) {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });

  // Add stagger delays to grid items
  const grids = ['.services-grid', '.why-features', '.process-steps', '.portfolio-grid',
    '.ind-grid', '.testi-grid', '.pricing-grid', '.tech-grid', '.faq-wrap'];

  grids.forEach(selector => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    [...grid.children].forEach((child, i) => {
      if (child.classList.contains('reveal') || child.classList.contains('reveal-scale')) {
        child.style.transitionDelay = `${i * 70}ms`;
      }
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => observer.observe(el));

  // Safety net: force-reveal elements still hidden after 1.8s (e.g., if IO isn't triggering)
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in), .reveal-left:not(.in), .reveal-right:not(.in), .reveal-scale:not(.in)')
      .forEach(el => el.classList.add('in'));
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.7 });

  counters.forEach(c => observer.observe(c));

  function runCounter(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = el.getAttribute('data-target');
      return;
    }
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO FILTER
═══════════════════════════════════════════════════════════ */
function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.pf-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button states
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      let delay = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.94) translateY(12px)';
          card.style.transition = 'none';
          // Stagger reveal
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, delay);
          delay += 60;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PRICING TOGGLE
═══════════════════════════════════════════════════════════ */
function initPricingToggle() {
  const toggleEl = document.getElementById('price-toggle');
  if (!toggleEl) return;

  const labelOne = document.getElementById('label-onetime');
  const labelMon = document.getElementById('label-monthly');

  const prices = {
    starter: { ot: '14,999', mo: '2,499', otLabel: 'one-time', moLabel: 'per month' },
    pro:     { ot: '34,999', mo: '5,999', otLabel: 'one-time', moLabel: 'per month' },
    ent:     { ot: '74,999', mo: '12,999', otLabel: 'one-time', moLabel: 'per month' },
  };

  let isMonthly = false;

  const applyToggle = () => {
    toggleEl.classList.toggle('right', isMonthly);
    toggleEl.setAttribute('aria-checked', String(isMonthly));

    labelOne.classList.toggle('on', !isMonthly);
    labelMon.classList.toggle('on',  isMonthly);

    Object.entries(prices).forEach(([key, data]) => {
      const numEl = document.getElementById(`price-${key}`);
      const perEl = document.getElementById(`period-${key}`);
      if (!numEl) return;

      // Flip animation
      numEl.style.transition = 'transform 0.18s ease, opacity 0.18s ease';
      numEl.style.transform  = 'translateY(-8px)';
      numEl.style.opacity    = '0';

      setTimeout(() => {
        numEl.textContent    = isMonthly ? data.mo  : data.ot;
        if (perEl) perEl.textContent = isMonthly ? data.moLabel : data.otLabel;
        numEl.style.transform = 'translateY(0)';
        numEl.style.opacity   = '1';
      }, 180);
    });
  };

  toggleEl.addEventListener('click', () => {
    isMonthly = !isMonthly;
    applyToggle();
  });
  // Keyboard support
  toggleEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isMonthly = !isMonthly;
      applyToggle();
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════════ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard: Enter / Space
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const toast     = document.getElementById('toast');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,15}$/;

  const validate = (field) => {
    const val = field.value.trim();
    let ok = val.length > 0;
    if (field.type === 'email') ok = ok && EMAIL_RE.test(val);
    if (field.type === 'tel')   ok = ok && PHONE_RE.test(val);
    field.style.borderColor = ok ? 'var(--teal)' : 'var(--danger)';
    field.style.boxShadow   = ok ? '0 0 0 3px rgba(14,164,122,0.1)' : '0 0 0 3px rgba(239,68,68,0.08)';
    return ok;
  };

  const clearValidation = (field) => {
    field.style.borderColor = '';
    field.style.boxShadow   = '';
  };

  // Real-time validation
  form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.style.borderColor === 'var(--danger)') validate(field);
    });
    field.addEventListener('focus', () => {
      if (!field.value.trim()) clearValidation(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = [...form.querySelectorAll('[required]')];
    const allValid = required.map(validate).every(Boolean);

    if (!allValid) {
      // Shake form
      form.animate([
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ], { duration: 400, easing: 'ease-out' });

      // Focus first error
      const firstErr = required.find(f => f.style.borderColor !== 'var(--teal)');
      if (firstErr) firstErr.focus();
      return;
    }

    // Collect form data
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('[BrainLab] Form data:', data); // Replace with real API call

    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;"></span> Sending...';
    submitBtn.style.opacity = '0.85';

    // Add spin animation
    if (!document.getElementById('spin-style')) {
      const s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(s);
    }

    // Simulate async form submission (replace with real fetch/EmailJS/FormSubmit)
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Success state
    submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message Sent! 🎉';
    submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    submitBtn.style.opacity = '1';

    // Reset fields
    form.reset();
    required.forEach(f => clearValidation(f));

    // Show toast
    showToast(toast);

    // Restore button after delay
    setTimeout(() => {
      submitBtn.innerHTML  = originalHTML;
      submitBtn.disabled   = false;
      submitBtn.style.background = '';
    }, 4000);
  });
}

function showToast(toast) {
  if (!toast) return;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 5000);
}

/* ═══════════════════════════════════════════════════════════
   FLOATING BUTTONS
═══════════════════════════════════════════════════════════ */
function initFloatingButtons() {
  const backTop = document.getElementById('back-to-top');
  if (!backTop) return;

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════════════ */
function initNewsletter() {
  const btn = document.getElementById('newsletter-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inp = btn.previousElementSibling;
    if (!inp || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
      inp.style.borderColor = 'rgba(239,68,68,0.6)';
      inp.focus();
      return;
    }
    inp.value = '';
    inp.placeholder = 'Subscribed! Thanks 🎉';
    btn.textContent = '✓ Done';
    btn.style.background = 'linear-gradient(135deg,#10B981,#059669)';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      inp.placeholder = 'Get web tips by email...';
      inp.style.borderColor = '';
    }, 4000);
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO DEVICE SCROLL EFFECT
═══════════════════════════════════════════════════════════ */
function initHeroDeviceHover() {
  const device = document.querySelector('.device-body img');
  if (!device || window.innerWidth < 900) return;

  let isScrolling = false;

  document.querySelector('.device-body')?.addEventListener('mouseenter', () => {
    if (isScrolling) return;
    isScrolling = true;
    device.style.transition = 'transform 8s ease-in-out';
    device.style.transform  = 'translateY(-35%)';
    setTimeout(() => { device.style.transform = 'translateY(0)'; isScrolling = false; }, 8500);
  });
}
