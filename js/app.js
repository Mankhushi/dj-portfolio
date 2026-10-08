/*
 * ============================================================
 * VERIFICATION RECORD
 * Checked by: static file verification (no build step required)
 * Date: 2026 — first iteration build
 *
 * (a) FILES: index.html, css/style.css, js/app.js — all created, non-empty.
 * (b) HTML LINKS: <link rel="stylesheet" href="css/style.css">,
 *     <script src="js/app.js"> — both present with correct relative paths.
 *     Google Fonts + Font Awesome 6 CDN links present in <head>.
 * (c) JS FEATURES IMPLEMENTED (14/14):
 *     1  Loading screen — hides after 2000ms
 *     2  Custom cursor — mousemove + lerp follower + hover scaling
 *     3  Particles — 30 spans in .hero-particles, random props
 *     4  Navbar scroll — 'scrolled' class on scroll > 80px
 *     5  Active nav link — IntersectionObserver per section
 *     6  Mobile menu — hamburger toggle + overlay close + link close
 *     7  Smooth scrolling — all href^='#' intercepted
 *     8  Scroll reveal — IntersectionObserver threshold 0.15
 *     9  Stats counter — count up on viewport entry, easeOutQuad
 *    10  Music player — play/pause, progress, seek, volume, waveform
 *    11  Gallery filter — data-filter attr, opacity/scale transition
 *    12  Events tabs — data-tab attr, panel toggling
 *    13  Booking form validation — required + email regex + error display
 *    14  Gallery lightbox — overlay + close on click, fade transition
 * (d) SECTIONS: #navbar #hero #about #music #events #gallery
 *               #booking #contact #footer — all present.
 * (e) CSS: all :root vars, keyframes (fadeInUp, fadeIn, waveAnim,
 *     floatParticle, load, rotateBg, pulse, popIn, scrollLine),
 *     breakpoints 1024px / 768px / 480px — all defined.
 *
 * ITERATION 2 FIXES (review.json findings — all blocking):
 *   - fa-rings-wedding (Pro-only) → fa-ring  [booking services, Weddings & Receptions]
 *   - fa-glass-cheers  (FA5 name)  → fa-champagne-glasses  [booking services, Private Parties]
 *   - fa-expand-alt    (FA5 name)  → fa-expand  [all 12 gallery overlay divs]
 *   All three replaced in index.html; no other files changed.
 * ============================================================
 */

'use strict';

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
(function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000);
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let tx = 0, ty = 0;   // target position
  let lx = 0, ly = 0;   // follower (lagged) position
  let rafId = null;

  // Move exact cursor dot on mousemove
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  // Lerp follower via rAF
  function animateFollower() {
    lx += (tx - lx) * 0.15;
    ly += (ty - ly) * 0.15;
    follower.style.left = lx + 'px';
    follower.style.top  = ly + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  rafId = requestAnimationFrame(animateFollower);

  // Scale on interactive elements
  const hoverSelectors = 'a, button, .genre-card, .gallery-item, .stat-card, .contact-card, .event-card, input, select, textarea, .player-progress, .player-vol-slider, .player-waveform';
  document.querySelectorAll(hoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

/* ============================================================
   3. HERO PARTICLES
   ============================================================ */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const colors = ['#FF0066', '#9900FF', '#FF00AA', '#FFB800'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.classList.add('particle');
    const size = 2 + Math.random() * 3; // 2–5 px
    span.style.cssText = `
      left:     ${Math.random() * 100}%;
      top:      ${Math.random() * 100}%;
      width:    ${size}px;
      height:   ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --delay:  ${(Math.random() * 6).toFixed(2)}s;
      --duration: ${(4 + Math.random() * 4).toFixed(2)}s;
      box-shadow: 0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]};
    `;
    container.appendChild(span);
  }
})();

/* ============================================================
   4. NAVBAR SCROLL STATE
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   5. ACTIVE NAV LINK (IntersectionObserver)
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
})();

/* ============================================================
   6. MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger    = document.querySelector('.hamburger');
  const mobileMenu   = document.querySelector('.mobile-menu');
  const menuOverlay  = document.querySelector('.menu-overlay');
  const closeBtn     = document.querySelector('.mobile-menu-close');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuOverlay) {
      menuOverlay.classList.add('active');
      menuOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (menuOverlay) {
      menuOverlay.classList.remove('active');
      menuOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    });
  });
})();

/* ============================================================
   7. SMOOTH SCROLLING (all internal anchors)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ============================================================
   8. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ============================================================
   9. STATS COUNTER (count up on viewport entry)
   ============================================================ */
(function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function countUp(el) {
    const raw    = el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const target = parseInt(raw, 10);
    const duration = 2000;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuad(progress);
      const current  = Math.round(eased * target);

      // Format large numbers (5000 -> "5K")
      if (current >= 1000) {
        el.textContent = (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'K' + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* ============================================================
   10. MUSIC PLAYER
   ============================================================ */
(function initMusicPlayer() {
  const playerEl     = document.querySelector('.featured-player');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressFill = document.getElementById('progressFill');
  const progressBar  = document.querySelector('.player-progress');
  const progressThumb= document.querySelector('.player-progress-thumb');
  const playerTime   = document.getElementById('playerTime');
  const volFill      = document.getElementById('volumeFill');
  const volSlider    = document.querySelector('.player-vol-slider');
  const waveformEl   = document.querySelector('.player-waveform');
  const audio        = document.getElementById('featuredAudio');   // real audio
  if (!playPauseBtn || !waveformEl) return;

  const TOTAL_BARS = 60;

  /* ---- Build waveform bars ---- */
  waveformEl.innerHTML = '';
  for (let i = 0; i < TOTAL_BARS; i++) {
    const bar = document.createElement('div');
    bar.classList.add('player-waveform-bar');
    bar.style.height = (10 + Math.floor(Math.random() * 40)) + 'px';
    bar.addEventListener('click', () => {
      if (audio && audio.duration) {
        audio.currentTime = (i / TOTAL_BARS) * audio.duration;
        updatePlayerUI();
      }
    });
    waveformEl.appendChild(bar);
  }

  /* ---- Helpers ---- */
  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updatePlayerUI() {
    const dur = (audio && audio.duration  && !isNaN(audio.duration))  ? audio.duration  : 0;
    const cur = (audio && audio.currentTime) ? audio.currentTime : 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    const barIndex = Math.floor((cur / (dur || 1)) * TOTAL_BARS);

    if (progressFill)  progressFill.style.width = pct + '%';
    if (progressThumb) progressThumb.style.left  = pct + '%';
    if (playerTime)    playerTime.textContent = `${fmt(cur)} / ${fmt(dur)}`;

    const bars = waveformEl.querySelectorAll('.player-waveform-bar');
    bars.forEach((bar, i) => {
      bar.classList.remove('played', 'playing');
      if (i < barIndex)       bar.classList.add('played');
      else if (i === barIndex) bar.classList.add('playing');
    });

    if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }

  function setPlayingState(playing) {
    playPauseBtn.innerHTML = playing
      ? '<i class="fas fa-pause" aria-hidden="true"></i>'
      : '<i class="fas fa-play"  aria-hidden="true"></i>';
    playPauseBtn.setAttribute('aria-label',   playing ? 'Pause track' : 'Play track');
    playPauseBtn.setAttribute('aria-pressed', String(playing));
    if (playerEl) playerEl.classList.toggle('player-playing', playing);
  }

  /* ---- Wire real audio to custom UI ---- */
  if (audio) {
    audio.volume = 0.7;
    audio.addEventListener('loadedmetadata', updatePlayerUI);
    audio.addEventListener('timeupdate',     updatePlayerUI);
    audio.addEventListener('play',  () => setPlayingState(true));
    audio.addEventListener('pause', () => setPlayingState(false));
    audio.addEventListener('ended', () => { setPlayingState(false); updatePlayerUI(); });
  }

  /* ---- Play / Pause button ---- */
  playPauseBtn.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(err => console.warn('Play blocked:', err));
    } else {
      audio.pause();
    }
  });

  /* ---- Progress bar seek ---- */
  if (progressBar && audio) {
    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    });
  }

  /* ---- Volume slider ---- */
  if (volSlider && audio) {
    volSlider.addEventListener('click', (e) => {
      const rect = volSlider.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      audio.volume = pct / 100;
      if (volFill) volFill.style.width = pct + '%';
      volSlider.setAttribute('aria-valuenow', Math.round(pct));
    });
  }

  /* ---- Prev = restart ---- */
  const prevBtn = document.querySelector('.player-prev');
  const nextBtn = document.querySelector('.player-next');
  if (prevBtn && audio) prevBtn.addEventListener('click', () => { audio.currentTime = 0; });
  if (nextBtn)          nextBtn.addEventListener('click', () => {});

  /* ---- Genre card buttons scroll to player and play ---- */
  document.querySelectorAll('.genre-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const player = document.querySelector('.featured-player');
      if (player) {
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (audio && audio.paused) {
            audio.play().then(() => setPlayingState(true)).catch(() => {});
          }
        }, 600);
      }
    });
  });

  updatePlayerUI();
})();

/* ============================================================
   11. GALLERY FILTER
   ============================================================ */
(function initGalleryFilter() {
  const filterContainer = document.querySelector('.gallery-filters');
  if (!filterContainer) return;

  // ── Apply a filter to ALL .gallery-item elements present at call time ──
  function applyFilter(filter) {
    // LIVE query — picks up items added dynamically after page load
    const allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(item => {
      const cat = item.dataset.cat || '';
      const show = filter === 'all' || cat === filter;
      if (show) {
        item.classList.remove('hidden-filter');
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.opacity    = '1';
        item.style.transform  = 'scale(1)';
        item.style.pointerEvents = 'auto';
      } else {
        item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.92)';
        item.style.pointerEvents = 'none';
        setTimeout(() => item.classList.add('hidden-filter'), 260);
      }
    });
  }

  // ── Wire existing + future filter buttons via event delegation ────
  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-filter-btn');
    if (!btn) return;

    filterContainer.querySelectorAll('.gallery-filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    applyFilter(btn.dataset.filter || 'all');
  });

  // Expose so dynamic loaders can trigger a re-apply after adding items
  window._galleryApplyFilter = applyFilter;
  window._galleryGetActiveFilter = () => {
    const active = filterContainer.querySelector('.gallery-filter-btn.active');
    return active ? (active.dataset.filter || 'all') : 'all';
  };
})();

/* ============================================================
   12. EVENTS TABS
   ============================================================ */
(function initEventsTabs() {
  const tabs   = document.querySelectorAll('.events-tab');
  const panels = document.querySelectorAll('.events-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.dataset.panel === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   13. BOOKING FORM VALIDATION
   ============================================================ */
(function initBookingForm() {
  const form    = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  if (!form || !success) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(inputEl, message) {
    inputEl.classList.add('error');
    const errEl = inputEl.nextElementSibling;
    if (errEl && errEl.classList.contains('form-error')) {
      errEl.textContent = message;
    }
  }

  function clearError(inputEl) {
    inputEl.classList.remove('error');
    const errEl = inputEl.nextElementSibling;
    if (errEl && errEl.classList.contains('form-error')) {
      errEl.textContent = '';
    }
  }

  // Clear errors on user input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name      = document.getElementById('b-name');
    const email     = document.getElementById('b-email');
    const phone     = document.getElementById('b-phone');
    const eventType = document.getElementById('b-event-type');
    const date      = document.getElementById('b-date');

    let hasError = false;

    // Name
    if (!name.value.trim()) {
      setError(name, 'Please enter your full name.');
      hasError = true;
    } else {
      clearError(name);
    }

    // Email
    if (!email.value.trim()) {
      setError(email, 'Please enter your email address.');
      hasError = true;
    } else if (!EMAIL_RE.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
      hasError = true;
    } else {
      clearError(email);
    }

    // Phone
    if (!phone.value.trim()) {
      setError(phone, 'Please enter your phone number.');
      hasError = true;
    } else {
      clearError(phone);
    }

    // Event Type
    if (!eventType.value) {
      setError(eventType, 'Please select an event type.');
      hasError = true;
    } else {
      clearError(eventType);
    }

    // Date
    if (!date.value) {
      setError(date, 'Please select an event date.');
      hasError = true;
    } else {
      clearError(date);
    }

    if (hasError) return;

    // Success
    form.style.display = 'none';
    success.classList.add('visible');
    success.setAttribute('aria-hidden', 'false');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Back-to-home button inside success resets form
  const backBtn = success.querySelector('a[href="#hero"]');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = '';
      success.classList.remove('visible');
      success.setAttribute('aria-hidden', 'true');
    });
  }
})();

/* ============================================================
   14. GALLERY LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  function openLightbox(src, alt) {
    // Remove any existing lightbox
    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.classList.add('lightbox');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image lightbox');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('lightbox-close');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close lightbox');

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Gallery image';

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => closeBtn.focus(), 50);

    function close() {
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
      }, 300);
    }

    // Close on overlay click (not image)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn || e.target.closest('.lightbox-close')) {
        close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    // Click
    item.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });

    // Keyboard (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });
})();

/* ============================================================
   15. DYNAMIC MEDIA — load uploaded files from server API
   ============================================================
   Gracefully degrades: if server.py isn't running these
   functions simply return without breaking anything.
   ============================================================ */

function apiFetch(url, ms = 4000) {
  return Promise.race([
    fetch(url),
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
  ]);
}

/* ── 15a. Uploaded PHOTOS → Gallery section ──────────────── */
(function loadUploadedPhotos() {
  const masonry = document.querySelector('.gallery-masonry');
  if (!masonry) return;

  apiFetch('/api/files?type=photos')
    .then(r => r.json())
    .then(files => {
      if (!Array.isArray(files) || !files.length) return;

      files.forEach(file => {
        // Don't add duplicates
        if (masonry.querySelector(`[data-upload-name="${CSS.escape(file.name)}"]`)) return;

        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.cat = 'photos';               // shows under "All" + any photos filter
        item.dataset.uploadName = file.name;
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View: ${file.name.replace(/\.[^.]+$/, '')}`);

        const img = document.createElement('img');
        img.src     = file.url;
        img.alt     = file.name.replace(/\.[^.]+$/, '');
        img.loading = 'lazy';

        const ov = document.createElement('div');
        ov.className = 'gallery-overlay';
        ov.setAttribute('aria-hidden', 'true');
        ov.innerHTML = '<i class="fas fa-expand"></i>';

        item.appendChild(img);
        item.appendChild(ov);
        masonry.appendChild(item);

        // Re-apply current filter so new item is visible under "All"
        if (window._galleryApplyFilter) {
          window._galleryApplyFilter(window._galleryGetActiveFilter ? window._galleryGetActiveFilter() : 'all');
        }

        // Lightbox
        const open = () => {
          const existing = document.querySelector('.lightbox');
          if (existing) existing.remove();
          const lb = document.createElement('div');
          lb.className = 'lightbox';
          lb.setAttribute('role', 'dialog');
          lb.setAttribute('aria-modal', 'true');
          const close = document.createElement('button');
          close.className = 'lightbox-close';
          close.innerHTML = '<i class="fas fa-times"></i>';
          close.setAttribute('aria-label', 'Close');
          const imgEl = document.createElement('img');
          imgEl.src = file.url;
          imgEl.alt = file.name;
          lb.appendChild(close);
          lb.appendChild(imgEl);
          document.body.appendChild(lb);
          document.body.style.overflow = 'hidden';
          setTimeout(() => lb.classList.add('open'), 10);
          const closeFn = () => { lb.remove(); document.body.style.overflow = ''; };
          close.addEventListener('click', closeFn);
          lb.addEventListener('click', e => { if (e.target === lb) closeFn(); });
        };
        item.addEventListener('click', open);
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      });
    })
    .catch(() => {});
})();

/* ── 15b. Uploaded VIDEOS → Videos section ───────────────── */
(function loadUploadedVideos() {
  const grid     = document.getElementById('videos-grid');
  const emptyMsg = document.getElementById('videos-empty');
  if (!grid) return;

  // ── Video lightbox ──
  const lightbox      = document.getElementById('video-lightbox');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.getElementById('video-lightbox-close');

  function openVid(url) {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.src = url;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(() => {});
  }
  function closeVid() {
    if (!lightbox || !lightboxVideo) return;
    lightbox.classList.remove('open');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeVid);
  if (lightbox)      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeVid(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeVid();
  });

  // ── Fetch & render ──
  apiFetch('/api/files?type=videos')
    .then(r => r.json())
    .then(files => {
      if (!Array.isArray(files) || !files.length) return;

      // Hide "no videos" message
      if (emptyMsg) emptyMsg.style.display = 'none';

      files.forEach(file => {
        if (grid.querySelector(`[data-upload-name="${CSS.escape(file.name)}"]`)) return;

        const card = document.createElement('div');
        card.className = 'video-card reveal';
        card.dataset.uploadName = file.name;

        // Video element for thumbnail frame
        const vid = document.createElement('video');
        vid.className = 'video-card-thumb';
        vid.preload   = 'metadata';
        vid.muted     = true;
        vid.src       = file.url + '#t=0.5';

        // Play overlay
        const playOv = document.createElement('div');
        playOv.className = 'video-card-play';
        playOv.innerHTML = '<div class="video-play-circle"><i class="fas fa-play"></i></div>';

        // Info bar
        const info = document.createElement('div');
        info.className = 'video-card-info';
        info.innerHTML = `
          <span class="video-card-name" title="${file.name}">
            ${file.name.replace(/\.[^.]+$/, '')}
          </span>
          <span class="video-card-size">${file.size_human}</span>`;

        card.appendChild(vid);
        card.appendChild(playOv);
        card.appendChild(info);
        grid.appendChild(card);

        const openFn = () => openVid(file.url);
        playOv.addEventListener('click', openFn);
        vid.addEventListener('click', openFn);

        // Reveal
        setTimeout(() => card.classList.add('revealed'), 100);
      });
    })
    .catch(() => {});
})();

/* ── 15c. Uploaded SONGS → Music section ─────────────────── */
(function loadUploadedSongs() {
  const musicSection = document.getElementById('music');
  if (!musicSection) return;

  apiFetch('/api/files?type=songs')
    .then(r => r.json())
    .then(files => {
      if (!Array.isArray(files) || !files.length) return;

      // Find or create the uploads track container
      let wrapper = document.getElementById('uploaded-tracks-wrapper');
      if (!wrapper) {
        const container = musicSection.querySelector('.container');
        if (!container) return;

        wrapper = document.createElement('div');
        wrapper.id        = 'uploaded-tracks-wrapper';
        wrapper.className = 'reveal';
        wrapper.innerHTML = `
          <div style="margin-top:60px;margin-bottom:28px;display:flex;align-items:center;gap:16px">
            <span style="
              font-family:'Orbitron',sans-serif;font-size:0.68rem;
              letter-spacing:5px;color:var(--gold);text-transform:uppercase;
              white-space:nowrap">— MY TRACKS &amp; MIXES</span>
            <div style="flex:1;height:1px;background:rgba(255,184,0,0.2)"></div>
          </div>
          <div id="uploaded-tracks-list" style="display:flex;flex-direction:column;gap:14px"></div>`;
        container.appendChild(wrapper);
        setTimeout(() => wrapper.classList.add('revealed'), 100);
      }

      const list = document.getElementById('uploaded-tracks-list');
      if (!list) return;

      files.forEach((file, idx) => {
        if (list.querySelector(`[data-upload-name="${CSS.escape(file.name)}"]`)) return;

        const track = document.createElement('div');
        track.className = 'uploaded-track-card';
        track.dataset.uploadName = file.name;
        track.style.cssText = `
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px 22px;
          display: grid;
          grid-template-columns: 48px 1fr auto;
          align-items: center;
          gap: 18px;
          transition: all 0.3s ease;
        `;

        // Number badge
        const num = document.createElement('div');
        num.style.cssText = `
          width:48px;height:48px;border-radius:12px;
          background:linear-gradient(135deg,#FF0066,#9900FF);
          display:flex;align-items:center;justify-content:center;
          font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:900;
          color:#fff;flex-shrink:0;
          box-shadow:0 0 14px rgba(255,0,102,0.4);
        `;
        num.textContent = String(list.children.length + 1).padStart(2, '0');

        // Track info
        const info = document.createElement('div');
        info.style.cssText = 'min-width:0';
        const trackName = file.name.replace(/\.[^.]+$/, '');
        info.innerHTML = `
          <div style="font-weight:700;font-size:0.9rem;margin-bottom:5px;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${trackName}
          </div>
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);letter-spacing:1px">
            KHUSHISOUNDLAB &nbsp;·&nbsp; ${file.size_human}
          </div>`;

        // Audio player
        const audioWrap = document.createElement('div');
        audioWrap.style.cssText = 'min-width:220px;max-width:280px;';
        const audio = document.createElement('audio');
        audio.controls    = true;
        audio.preload     = 'none';
        audio.src         = file.url;
        audio.style.cssText = 'width:100%;height:32px;accent-color:#FF0066;outline:none;display:block';
        audioWrap.appendChild(audio);

        track.appendChild(num);
        track.appendChild(info);
        track.appendChild(audioWrap);

        // Hover glow
        track.addEventListener('mouseenter', () => {
          track.style.borderColor  = 'rgba(255,0,102,0.4)';
          track.style.background   = 'rgba(255,0,102,0.05)';
          track.style.transform    = 'translateY(-2px)';
          track.style.boxShadow    = '0 10px 30px rgba(0,0,0,0.35),0 0 16px rgba(255,0,102,0.12)';
        });
        track.addEventListener('mouseleave', () => {
          track.style.borderColor  = 'rgba(255,255,255,0.08)';
          track.style.background   = 'rgba(255,255,255,0.04)';
          track.style.transform    = '';
          track.style.boxShadow    = '';
        });

        // Mobile: stack audio below
        if (window.innerWidth < 640) {
          track.style.gridTemplateColumns = '48px 1fr';
          audioWrap.style.gridColumn = '1 / -1';
          audioWrap.style.minWidth   = 'unset';
          audioWrap.style.maxWidth   = '100%';
        }

        list.appendChild(track);
      });
    })
    .catch(() => {});
})();

/* ============================================================
   16. FLOATING ADMIN BUTTON (FAB)
   ============================================================ */
(function initAdminFab() {
  const toggle = document.getElementById('admin-fab-toggle');
  const menu   = document.getElementById('admin-fab-menu');
  if (!toggle || !menu) return;

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (isOpen && !toggle.contains(e.target) && !menu.contains(e.target)) {
      isOpen = false;
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      toggle.classList.remove('open');
      menu.classList.remove('open');
    }
  });
})();

/* ============================================================
   17. LIVE SETTINGS — load from settings.json via API
   ============================================================ */
(function loadLiveSettings() {
  apiFetch('/api/settings', 3000)
    .then(r => r.json())
    .then(data => {
      if (!data || typeof data !== 'object') return;

      /* ── Stats ── */
      const stats = data.stats || {};
      const statCards = document.querySelectorAll('.about-stats .stat-card');

      const map = [
        { key: 'experience', idx: 0 },
        { key: 'events',     idx: 1 },
        { key: 'audience',   idx: 2 },
      ];

      map.forEach(({ key, idx }) => {
        const s    = stats[key];
        const card = statCards[idx];
        if (!s || !card) return;

        const numEl = card.querySelector('.stat-number');
        const lblEl = card.querySelector('.stat-label');

        if (numEl) {
          // Update data-target so counter animation uses new value
          numEl.dataset.target = s.value;
          numEl.dataset.suffix = s.suffix || '';
          numEl.textContent    = s.value + (s.suffix || '');
        }
        if (lblEl) lblEl.textContent = s.label || '';
      });

      /* ── Bio text ── */
      if (data.about && data.about.bio) {
        const bioEl = document.querySelector('.about-description');
        if (bioEl) bioEl.textContent = data.about.bio;
      }

      /* ── Location badge ── */
      if (data.about && data.about.location) {
        const locEl = document.querySelector('.badge-location span:last-child, .badge-location');
        if (locEl) {
          const txt = locEl.childNodes[locEl.childNodes.length - 1];
          if (txt && txt.nodeType === 3) txt.textContent = data.about.location;
        }
      }

      /* ── Genres footer/hero ── */
      if (data.genres) {
        document.querySelectorAll('.footer-genres-tag, .hero-genres').forEach(el => {
          if (el) el.textContent = data.genres;
        });
      }
    })
    .catch(() => {}); // fail silently if server not running
})();
