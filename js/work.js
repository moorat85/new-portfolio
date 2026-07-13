/* Секция «Проекты»: reveal-появление карточек при скролле (однократно).
   Параллакс убран — сетка статична, нагрузки на скролл нет. */
(function () {
  'use strict';

  function init() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
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
