/* Модалка проекта: открывается по клику на карточку в «Проектах».
   Контент — шаблон: центрированный заголовок, текст задачи, затем блоки
   «серый прямоугольник (позже скриншот) + описание». Модалки отличаются
   только содержимым и количеством прямоугольников (blocks). */
(function () {
  'use strict';

  var TASK = 'Задача: сделать проект';
  var CAPTION = 'Описание к скриншоту';
  function shots(n) { var a = []; for (var i = 0; i < n; i++) a.push(CAPTION); return a; }

  var PROJECTS = {
    'smart-pickup': { title: 'Умная выдача заказов Дринкит', task: TASK, blocks: shots(2) },
    'getplace': { title: 'Аналитика города Гетплейса', task: TASK, blocks: shots(2) },
    'delivery-terminal': { title: 'Терминал доставки Додо Пиццы', task: TASK, blocks: shots(2) },
    'courier': { title: 'Приложение для курьеров Додо Пиццы', task: TASK, blocks: shots(2) },
    'tooba': { title: 'Панель администратора Тубы', task: TASK, blocks: shots(2) },
    'revision': { title: 'Ревизия остатков Додо Пиццы и Дринкит', task: TASK, blocks: shots(2) },
    'ted-trans': { title: 'Личный кабинет клиента ТЭД Транс', task: TASK, blocks: shots(2) },
    'itle': { title: 'Приложение для цеха ИТЛЕ Китчен', task: TASK, blocks: shots(2) }
  };

  var modal = document.getElementById('project-modal');
  if (!modal) return;
  var titleEl = modal.querySelector('.project-modal__title');
  var logoEl = modal.querySelector('.project-modal__logo');
  var taskEl = modal.querySelector('.project-modal__task');
  var bodyEl = modal.querySelector('.project-modal__body');
  var closeBtn = modal.querySelector('.project-modal__close');
  var lastFocused = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function blockHTML(block) {
    var img = block && block.img ? block.img : '';
    var caption = block && block.caption != null ? block.caption
      : (typeof block === 'string' ? block : '');
    var shot = img
      ? '<img class="project-modal__shot" src="' + esc(img) + '" alt="" loading="lazy">'
      : '<div class="project-modal__shot"></div>';
    return '<div class="project-modal__block">' +
      '<div class="pm-laptop">' +
        '<div class="pm-laptop__screen"><span class="pm-laptop__cam"></span>' + shot + '</div>' +
        '<div class="pm-laptop__base"><span class="pm-laptop__notch"></span></div>' +
      '</div>' +
      (caption ? '<p class="project-modal__caption">' + esc(caption) + '</p>' : '') +
      '</div>';
  }

  function open(key, opener) {
    var data = PROJECTS[key];
    if (!data) return;
    lastFocused = opener || document.activeElement;
    if (logoEl) {
      logoEl.innerHTML = data.logo
        ? '<img src="' + esc(data.logo) + '" alt="">'
        : '<span class="project-modal__logo-ph"></span>';
    }
    titleEl.textContent = data.title;
    if (taskEl) taskEl.textContent = data.task || '';
    bodyEl.innerHTML = (data.blocks || []).map(blockHTML).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.scrollTop = 0;
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setTimeout(function () { if (!modal.classList.contains('is-open')) bodyEl.innerHTML = ''; }, 400);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.project-modal__close')) { close(); return; }
    var card = e.target.closest('.work-card[data-project]');
    if (card) { open(card.getAttribute('data-project'), card); return; }
    // клик по фону модалки — не по панели и не по крестику
    if (e.target.closest('#project-modal') && !e.target.closest('.project-modal__page') && !e.target.closest('.project-modal__close')) {
      close();
    }
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
