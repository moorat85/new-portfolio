/* Механика сайта: ссылки (email/tel/telegram/YouTube), плавный скролл
   «Наверх» и кнопка контактов в мобильной шапке (300 мс, OUT_CUBIC). */
(function () {
  'use strict';

  /* ---------- ссылки ---------- */

  var LINKS = {
    'm.gammadoff@yandex.ru': 'mailto:m.gammadoff@yandex.ru',
    '+7 916 698-18-88': 'tel:+79166981888',
    'tg: @gammadoff': 'https://t.me/gammadoff',
    'Дизайн-система Dodo IS': 'https://www.youtube.com/watch?v=6-sy8YhiCKU&list=PLnQU5MnTOzyo1MY4ycHwUfNxrHEbAG9E0&index=3',
    'Оценка заказа в мобильном приложении': 'https://youtu.be/cFQyn5yQHm0?si=yUT_m2uLRqG36i_y&t=573',
    'Рассказ о себе': 'https://youtu.be/0DeOs0BjQH0?si=9v8vPZ_8ikS5K8jk'
  };
  var TELEGRAM = 'https://t.me/gammadoff';

  /* ---------- скролл: 300 мс OUT_CUBIC (cubic-bezier(0,0,0.58,1)) ---------- */

  function bezier(p1x, p1y, p2x, p2y) {
    // ускоренная аппроксимация кубической кривой Безье по x -> y
    function f(t, a, b) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t; }
    return function (x) {
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 24; i++) {
        var cx = f(t, p1x, p2x);
        if (Math.abs(cx - x) < 1e-4) break;
        if (cx < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return f(t, p1y, p2y);
    };
  }
  var OUT_CUBIC = bezier(0, 0, 0.58, 1);

  function animateScrollTo(targetY) {
    var startY = window.scrollY;
    var delta = targetY - startY;
    var t0 = performance.now();
    var DUR = 300;
    var done = false;
    function step(now) {
      if (done) return;
      var p = Math.min(1, (now - t0) / DUR);
      window.scrollTo(0, startY + delta * OUT_CUBIC(p));
      if (p < 1) requestAnimationFrame(step); else done = true;
    }
    requestAnimationFrame(step);
    // страховка: rAF может быть заморожен в фоновой вкладке
    setTimeout(function () { if (!done) { done = true; window.scrollTo(0, targetY); } }, DUR + 50);
  }

  function scrollToContacts() {
    // мобильная секция «Связаться со мной»
    var headers = document.querySelectorAll('h1');
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].textContent.trim() === 'Связаться со мной' && headers[i].offsetParent) {
        animateScrollTo(headers[i].closest('div').getBoundingClientRect().top + window.scrollY);
        return;
      }
    }
  }

  /* ---------- обработчик кликов ---------- */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, div[role="button"], div[role="link"]');
    if (!btn) return;
    var text = btn.textContent.replace(/\u00a0/g, ' ').trim();

    // мобильная кнопка контактов в шапке
    if (btn.getAttribute('aria-label') === 'Contacts') { scrollToContacts(); return; }

    // «Наверх»
    if (text === 'Наверх') { animateScrollTo(0); return; }

    // ссылки (шапка, контакты, выступления)
    if (LINKS[text]) {
      if (LINKS[text].indexOf('mailto:') === 0 || LINKS[text].indexOf('tel:') === 0) {
        window.location.href = LINKS[text];
      } else {
        window.open(LINKS[text], '_blank');
      }
      return;
    }
    // телеграм-иконка в шапке (role=link без текста, с картинкой telegram)
    if (btn.getAttribute('role') === 'link' && !text && btn.querySelector('img[alt="telegram"]')) {
      window.open(TELEGRAM, '_blank');
    }
  });
})();
