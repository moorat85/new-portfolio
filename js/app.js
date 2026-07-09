/* Механика сайта: мгновенное переключение состояний секции «Проекты»,
   ссылки и плавный скролл «Наверх» (300 мс, OUT_CUBIC — как в оригинале). */
(function () {
  'use strict';

  /* ---------- карта состояний ---------- */

  // Десктоп: пункт сайдбара -> состояние по умолчанию (первый таб)
  var PROJECT_DEFAULT = {
    'Курьерское приложение': 'dodo-courier-tab1',
    'Терминал доставки': 'dodo-terminal',
    'Трекинг приготовления': 'dodo-tracking',
    'Ревизия остатков': 'dodo-revision',
    'Панель администратора': 'tooba-admin',
    'Личный кабинет клиента': 'ted-cabinet',
    'Аналитика города (концепт)': 'getplace-analytics',
    'Приложения для цеха': 'itle-apps'
  };

  // Десктоп: (заголовок проекта в панели, название таба) -> состояние
  var TAB_STATE = {
    'Курьерское приложение': {
      'Очередь заказов': 'dodo-courier-tab1',
      'Активная доставка': 'dodo-courier-tab2'
    },
    'Терминал доставки': {
      'Заказы и курьеры': 'dodo-terminal',
      'Отправление': 'dodo-terminal-tab2'
    },
    'Трекинг приготовления': {
      'Главный экран': 'dodo-tracking'
    },
    'Ревизия остатков': {
      'Добавл. остатка': 'dodo-revision',
      'Добавл. остатка (моб.)': 'dodo-revision-tab2',
      'Список сырья': 'dodo-revision-tab3',
      'Итоги': 'dodo-revision-tab4'
    },
    'Панель администратора': {
      'Аналитика сбора': 'tooba-admin',
      'Пуш-уведомления': 'tooba-admin-tab2',
      'Заявка на награду': 'tooba-admin-tab3'
    },
    'Личный кабинет клиента': {
      'Главный экран': 'ted-cabinet',
      'Страница отправления': 'ted-cabinet-tab2'
    },
    'Аналитика города (концепт)': {
      'Обзор рынка': 'getplace-analytics',
      'Конкуренты': 'getplace-tab2',
      'Конкурент детально': 'getplace-tab3'
    },
    'Приложение для цеха': {
      'Сырье': 'itle-apps',
      'Задачи': 'itle-tab2',
      'Открытая задача': 'itle-tab3'
    }
  };

  // Мобайл: чип бренда -> состояние (проект бренда по умолчанию)
  var MOBILE_BRAND = {
    'Dodo Brands': 'base',
    'Tooba': 'tooba',
    'TED Trans': 'tedtrans',
    'GetPlace': 'getplace',
    'ITLE Kitchen': 'itlekitchen'
  };

  // Мобайл: чип проекта -> состояние
  var MOBILE_PROJECT = {
    'Курьерское приложение': 'base',
    'Терминал доставки': 'dodo-terminal',
    'Трекинг приготовления': 'dodo-tracking',
    'Ревизия остатков': 'dodo-revision',
    'Панель администратора': 'tooba',
    'Личный кабинет клиента': 'tedtrans',
    'Аналитика города (концепт)': 'getplace',
    'Приложения для цеха': 'itlekitchen'
  };

  /* ---------- ссылки ---------- */

  var LINKS = {
    'm.gammadoff@yandex.ru': 'mailto:m.gammadoff@yandex.ru',
    '+7 916 698-18-88': 'tel:+79166981888',
    'tg: @gammadoff': 'https://t.me/gammadoff',
    'Дизайн-система Dodo IS': 'https://www.youtube.com/watch?v=6-sy8YhiCKU&list=PLnQU5MnTOzyo1MY4ycHwUfNxrHEbAG9E0&index=3',
    'Оценка заказа в мобильном приложении': 'https://youtu.be/cFQyn5yQHm0?si=yUT_m2uLRqG36i_y&t=573',
    'Рассказ о себе': 'https://youtu.be/0DeOs0BjQH0?si=9v8vPZ_8ikS5K8jk'
  };
  var TELEGRAM = 'https://t.me/gammadoff';

  /* ---------- секции ---------- */

  function desktopSection() { return document.querySelector('.css-ddsjp2'); }
  function mobileSection() { return document.querySelector('.css-j26r86'); }

  // текущий проект на мобильном (базовый ключ состояния) — для нумерованных
  // переключателей галереи (1/2/3), которые не несут название проекта
  var mobileProject = 'base';

  function swapDesktop(key) {
    var s = desktopSection();
    if (s && window.DESKTOP_STATES[key]) s.outerHTML = window.DESKTOP_STATES[key];
  }
  function swapMobile(key, isProject) {
    var s = mobileSection();
    if (s && window.MOBILE_STATES[key]) {
      s.outerHTML = window.MOBILE_STATES[key];
      if (isProject) mobileProject = key;
    }
  }

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
      return;
    }

    var inDesktop = desktopSection() && desktopSection().contains(btn);
    var inMobile = mobileSection() && mobileSection().contains(btn);

    if (inDesktop) {
      // сабтаб текущего проекта?
      var title = desktopSection().querySelector('.css-at50qj');
      var project = title ? title.textContent.trim() : '';
      if (TAB_STATE[project] && TAB_STATE[project][text]) { swapDesktop(TAB_STATE[project][text]); return; }
      // пункт сайдбара?
      if (PROJECT_DEFAULT[text]) { swapDesktop(PROJECT_DEFAULT[text]); return; }
    }

    if (inMobile) {
      if (MOBILE_BRAND[text]) { swapMobile(MOBILE_BRAND[text], true); return; }
      if (MOBILE_PROJECT[text]) { swapMobile(MOBILE_PROJECT[text], true); return; }
      // нумерованный переключатель галереи (1..4)
      if (/^[1-9]$/.test(text)) {
        var n = parseInt(text, 10);
        swapMobile(n === 1 ? mobileProject : mobileProject + '-tab' + n, false);
        return;
      }
    }
  });
})();
