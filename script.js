/* =============================================
   ZIREGBE OTEE — PORTFOLIO SCRIPTS
   ============================================= */

(function () {
  'use strict';

  // ===== NAVBAR =====
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', function () {
    const open = navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // ===== ACTIVE NAV LINK =====
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    let current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollMid) current = sec.id;
    });
    navLinks.forEach(function (link) {
      const matches = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', matches);
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const animatedEls = document.querySelectorAll('.animate');
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(function (el) { io.observe(el); });

  // Trigger hero elements immediately (already in view)
  document.querySelectorAll('#hero .animate').forEach(function (el) {
    el.classList.add('visible');
  });

  // ===== CANVAS PARTICLE NETWORK =====
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles, rafId;
  const PARTICLE_COUNT = 75;
  const MAX_DIST       = 130;
  const PARTICLE_COLOR = '56, 189, 248'; // rgb of --accent

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  Math.random() * 1.2 + 0.4,
      a:  Math.random() * 0.35 + 0.08,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw dots
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + PARTICLE_COLOR + ',' + p.a + ')';
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = 0.1 * (1 - dist / MAX_DIST);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + PARTICLE_COLOR + ',' + alpha + ')';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  // Pause particles when hero is scrolled out of view — saves CPU
  const heroEl = document.getElementById('hero');
  const heroIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!rafId) draw();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, { threshold: 0.01 });
  heroIO.observe(heroEl);

  window.addEventListener('resize', function () {
    resize();
    particles.forEach(function (p) {
      if (p.x > W) p.x = Math.random() * W;
      if (p.y > H) p.y = Math.random() * H;
    });
  }, { passive: true });

  init();
  draw();

  // ===== SMOOTH ANCHOR SCROLL (fallback for older browsers) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - 60;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
