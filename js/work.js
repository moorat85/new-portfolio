/* Секция «Проекты» — сетка work-grid из portfolio.gammadov.ru:
   параллакс миниатюр при скролле + reveal-появление карточек.
   Портировано без изменений логики; работает для обоих брейкпоинтов
   (десктопное и мобильное дерево new-portfolio). */
(function () {
  'use strict';

  function init() {
    // ─── обернуть каждую миниатюру в .work-thumb-wrap (для обрезки параллакса) ───
    document.querySelectorAll('.work-card .work-thumb').forEach(function (img) {
      if (img.parentNode && img.parentNode.classList.contains('work-thumb-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'work-thumb-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    });

    // ─── параллакс ───
    var FACTOR = 0.047;
    var LERP = 0.09;
    var imgs = Array.prototype.slice.call(
      document.querySelectorAll('.work-card:not(.no-parallax) .work-thumb')
    );
    var current = new Float32Array(imgs.length);
    var target = new Float32Array(imgs.length);

    function readTargets() {
      var vh = window.innerHeight;
      for (var i = 0; i < imgs.length; i++) {
        var rect = imgs[i].parentNode.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        target[i] = (center - vh / 2) * FACTOR;
      }
    }

    readTargets();
    for (var i = 0; i < imgs.length; i++) current[i] = target[i];

    function tick() {
      readTargets();
      for (var j = 0; j < imgs.length; j++) {
        current[j] += (target[j] - current[j]) * LERP;
        imgs[j].style.transform = 'translateY(' + current[j].toFixed(2) + 'px)';
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', readTargets, { passive: true });
    requestAnimationFrame(tick);

    // ─── reveal-появление ───
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.work-reveal').forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 0.05) + 's';
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
