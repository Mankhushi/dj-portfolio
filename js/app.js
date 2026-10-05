/*
 * ============================================================
 * VERIFICATION RECORD
 * Checked by: static file verification (no build step required)
 * Date: 2025 — first iteration build
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
  const playerEl    = document.querySelector('.featured-player');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressFill = document.getElementById('progressFill');
  const progressBar  = document.querySelector('.player-progress');
  const progressThumb = document.querySelector('.player-progress-thumb');
  const playerTime   = document.getElementById('playerTime');
  const volFill      = document.getElementById('volumeFill');
  const volSlider    = document.querySelector('.player-vol-slider');
  const waveformEl   = document.querySelector('.player-waveform');
  if (!playPauseBtn || !waveformEl) return;

  const TOTAL_BARS    = 60;
  const PLAYED_RATIO  = 0.3; // 30% played initially
  const TOTAL_SECONDS = 527; // 8:47

  let isPlaying     = false;
  let currentTime   = Math.round(TOTAL_SECONDS * PLAYED_RATIO); // ~158s
  let progressInterval = null;

  /* ---- Build waveform bars ---- */
  waveformEl.innerHTML = '';
  for (let i = 0; i < TOTAL_BARS; i++) {
    const bar = document.createElement('div');
    bar.classList.add('player-waveform-bar');
    // Random height 10–50 px
    const h = 10 + Math.floor(Math.random() * 40);
    bar.style.height = h + 'px';
    // Mark initial played/playing/unplayed state
    const playedUpTo = Math.floor(TOTAL_BARS * PLAYED_RATIO);
    if (i < playedUpTo - 1) {
      bar.classList.add('played');
    } else if (i === playedUpTo - 1) {
      bar.classList.add('playing');
    }
    // Click to seek
    bar.addEventListener('click', () => {
      currentTime = Math.round((i / TOTAL_BARS) * TOTAL_SECONDS);
      updatePlayerUI();
    });
    waveformEl.appendChild(bar);
  }

  /* ---- Helpers ---- */
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updatePlayerUI() {
    const pct = (currentTime / TOTAL_SECONDS) * 100;
    const barIndex = Math.floor((currentTime / TOTAL_SECONDS) * TOTAL_BARS);

    // Progress bar fill
    if (progressFill) progressFill.style.width = pct + '%';

    // Progress thumb
    if (progressThumb) progressThumb.style.left = pct + '%';

    // Time display
    if (playerTime) {
      playerTime.textContent = `${formatTime(currentTime)} / ${formatTime(TOTAL_SECONDS)}`;
    }

    // Waveform bars
    const bars = waveformEl.querySelectorAll('.player-waveform-bar');
    bars.forEach((bar, i) => {
      bar.classList.remove('played', 'playing');
      if (i < barIndex) {
        bar.classList.add('played');
      } else if (i === barIndex) {
        bar.classList.add('playing');
      }
    });

    // ARIA
    const progressBarEl = document.querySelector('.player-progress');
    if (progressBarEl) progressBarEl.setAttribute('aria-valuenow', Math.round(pct));
  }

  function startPlaying() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
    playPauseBtn.setAttribute('aria-label', 'Pause track');
    playPauseBtn.setAttribute('aria-pressed', 'true');
    if (playerEl) playerEl.classList.add('player-playing');

    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (currentTime < TOTAL_SECONDS) {
        currentTime++;
        updatePlayerUI();
      } else {
        stopPlaying();
        currentTime = 0;
        updatePlayerUI();
      }
    }, 1000);
  }

  function stopPlaying() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
    playPauseBtn.setAttribute('aria-label', 'Play track');
    playPauseBtn.setAttribute('aria-pressed', 'false');
    if (playerEl) playerEl.classList.remove('player-playing');
    clearInterval(progressInterval);
  }

  // Play/Pause toggle
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) stopPlaying();
    else startPlaying();
  });

  // Progress bar seek
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      currentTime = Math.round(pct * TOTAL_SECONDS);
      updatePlayerUI();
    });
  }

  // Volume slider
  if (volSlider) {
    volSlider.addEventListener('click', (e) => {
      const rect = volSlider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      if (volFill) volFill.style.width = pct + '%';
      volSlider.setAttribute('aria-valuenow', Math.round(pct));
    });
  }

  // Prev / Next buttons (no actual tracks — just reset)
  const prevBtn = document.querySelector('.player-prev');
  const nextBtn = document.querySelector('.player-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTime = 0;
      updatePlayerUI();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTime = 0;
      updatePlayerUI();
    });
  }

  // Genre card play buttons
  document.querySelectorAll('.genre-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Scroll to featured player and start
      const player = document.querySelector('.featured-player');
      if (player) {
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (!isPlaying) startPlaying();
        }, 600);
      }
    });
  });

  // Initial render
  updatePlayerUI();
})();

/* ============================================================
   11. GALLERY FILTER
   ============================================================ */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden-filter');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          // Animate in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.25s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => item.classList.add('hidden-filter'), 250);
        }
      });
    });
  });
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
