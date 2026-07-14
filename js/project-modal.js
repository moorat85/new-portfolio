/* Модалка проекта: открывается по клику на карточку в «Проектах»,
   показывает доступные экраны проекта на отдельной белой странице. */
(function () {
  'use strict';

  var PROJECTS = {
    'smart-pickup': {
      title: 'Умная выдача заказов Дринкит',
      media: [{ type: 'img', src: 'img/smart-pickup-main.png' }]
    },
    'getplace': {
      title: 'Аналитика города Гетплейса',
      media: [{ type: 'img', src: 'img/getplace-img-main.jpg' }]
    },
    'delivery-terminal': {
      title: 'Терминал доставки Додо Пиццы',
      media: [
        { type: 'img', src: 'img/delivery-term-img-main.jpg' },
        { type: 'video', src: 'img/term-dost-1200.mp4' }
      ]
    },
    'courier': {
      title: 'Приложение для курьеров Додо Пиццы',
      media: [{ type: 'img', src: 'img/courier-app.jpg' }]
    },
    'tooba': {
      title: 'Панель администратора Тубы',
      media: [{ type: 'img', src: 'img/tooba-mimg-main.jpg' }]
    },
    'revision': {
      title: 'Ревизия остатков Додо Пиццы и Дринкит',
      media: [{ type: 'img', src: 'img/revision-img-main.jpg' }]
    },
    'ted-trans': {
      title: 'Личный кабинет клиента ТЭД Транс',
      media: [
        { type: 'img', src: 'img/ted-trans-main.jpg' },
        { type: 'video', src: 'img/ted-1200.mp4' }
      ]
    },
    'itle': {
      title: 'Приложение для цеха ИТЛЕ Китчен',
      media: [{ type: 'img', src: 'img/itle-main.jpg' }]
    }
  };

  var modal = document.getElementById('project-modal');
  if (!modal) return;
  var titleEl = modal.querySelector('.project-modal__title');
  var bodyEl = modal.querySelector('.project-modal__body');
  var pageEl = modal.querySelector('.project-modal__page');
  var lastFocused = null;

  function mediaHTML(item) {
    if (item.type === 'video') {
      return '<video src="' + item.src + '" autoplay muted loop playsinline controls></video>';
    }
    return '<img src="' + item.src + '" alt="">';
  }

  function open(key, opener) {
    var data = PROJECTS[key];
    if (!data) return;
    lastFocused = opener || document.activeElement;
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.media.map(mediaHTML).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    pageEl.scrollTop = 0;
    var closeBtn = modal.querySelector('.project-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // остановить видео и очистить контент, чтобы не играло в фоне
    bodyEl.querySelectorAll('video').forEach(function (v) { v.pause(); });
    setTimeout(function () { if (!modal.classList.contains('is-open')) bodyEl.innerHTML = ''; }, 400);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-modal-close]')) { close(); return; }
    var card = e.target.closest('.work-card[data-project]');
    if (card) { open(card.getAttribute('data-project'), card); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement &&
        document.activeElement.matches && document.activeElement.matches('.work-card[data-project]')) {
      e.preventDefault();
      open(document.activeElement.getAttribute('data-project'), document.activeElement);
    }
  });
})();
