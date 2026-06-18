/* =========================================
   ESI Taiwan — site.js
   ========================================= */
(function() {
  'use strict';

  /* ── Sticky nav shadow ── */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Hamburger ── */
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  /* ── Dropdown / Mega Menu toggle ── */
  document.querySelectorAll('.main-nav > li > button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  /* ── Hero Slider ── */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slider-dot');
  if (slides.length) {
    let current = 0, timer;

    function goTo(idx) {
      slides[current].classList.remove('active');
      slides[current].classList.add('prev');
      setTimeout(() => slides[current].classList.remove('prev'), 1000);
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5500);
    }

    startTimer();
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startTimer(); }));
    document.querySelector('.slider-next')?.addEventListener('click', () => { goTo(current + 1); startTimer(); });
    document.querySelector('.slider-prev')?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  }

  /* ── Scroll Reveal ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => io.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el, target, suffix) {
    const duration = 1600, startTime = performance.now();
    function step(now) {
      const p = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, +e.target.dataset.target, e.target.dataset.suffix || '');
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

})();
