/* Выступления — коверфлоу-карусель (портировано с portfolio.gammadov.ru).
   Поддерживает несколько независимых галерей .talks-gallery на странице. */
(function () {
  var galleries = document.querySelectorAll('.talks-gallery');
  Array.prototype.forEach.call(galleries, function (gallery) {
    var track = gallery.querySelector('.gallery-track');
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-item'));
    if (!track || !items.length) return;

    var N = items.length;
    var curr = 0;
    var busy = false;
    var POSITIONS = ['c', 'r1', 'r2', 'l2', 'l1'];

    function render() {
      items.forEach(function (el, i) {
        var d = ((i - curr) % N + N) % N;
        el.dataset.pos = POSITIONS[d] != null ? POSITIONS[d] : 'hidden-r';
      });
    }

    function go(dir) { // -1 = next (right → center), +1 = prev (left → center)
      if (busy) return;
      busy = true;

      var farIdx = dir === -1 ? (curr - 2 + N) % N : (curr + 2) % N;
      var targetPos = dir === -1 ? 'r2' : 'l2';
      var jumper = items[farIdx];

      jumper.style.transition = 'none';
      jumper.style.opacity = '0';
      jumper.dataset.pos = targetPos;
      void jumper.offsetWidth;

      curr = (curr - dir + N) % N;
      render();

      requestAnimationFrame(function () {
        jumper.style.transition = 'opacity .45s var(--ease)';
        jumper.style.opacity = '';
      });

      setTimeout(function () {
        jumper.style.transition = '';
        jumper.style.opacity = '';
        busy = false;
      }, 600);
    }

    render();

    /* клик: боковые крутят карусель, центр открывает YouTube */
    var dragMoved = false;
    items.forEach(function (el) {
      el.addEventListener('click', function () {
        if (dragMoved) return;
        var p = el.dataset.pos;
        if (p === 'l1' || p === 'l2') go(+1);
        if (p === 'r1' || p === 'r2') go(-1);
        if (p === 'c' && el.dataset.youtube) {
          var yt = el.dataset.youtube;
          window.open(yt.indexOf('http') === 0 ? yt : 'https://youtu.be/' + yt, '_blank');
        }
      });
    });

    /* перетаскивание мышью */
    var THRESHOLD = 60;
    var dragStartX = 0, dragging = false;

    track.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      dragStartX = e.clientX;
      dragging = true;
      dragMoved = false;
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 8) dragMoved = true;
      var damped = delta / (1 + Math.abs(delta) / 280);
      track.style.transition = 'none';
      track.style.transform = 'translateX(' + damped + 'px)';
    });

    window.addEventListener('mouseup', function (e) {
      if (!dragging) return;
      dragging = false;
      track.style.cursor = '';
      var delta = e.clientX - dragStartX;
      if (Math.abs(delta) >= THRESHOLD) {
        go(delta < 0 ? -1 : +1);
        requestAnimationFrame(function () {
          track.style.transition = 'transform .55s var(--ease)';
          track.style.transform = '';
          setTimeout(function () { track.style.transition = ''; }, 600);
        });
      } else {
        track.style.transition = 'transform .35s var(--ease)';
        track.style.transform = '';
        setTimeout(function () { track.style.transition = ''; }, 350);
      }
    });

    /* свайп на тач-устройствах */
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      dragMoved = false;
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      var delta = e.touches[0].clientX - touchStartX;
      if (Math.abs(delta) > 8) dragMoved = true;
      var damped = delta / (1 + Math.abs(delta) / 280);
      track.style.transition = 'none';
      track.style.transform = 'translateX(' + damped + 'px)';
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) >= THRESHOLD) {
        go(delta < 0 ? -1 : +1);
        requestAnimationFrame(function () {
          track.style.transition = 'transform .55s var(--ease)';
          track.style.transform = '';
          setTimeout(function () { track.style.transition = ''; }, 600);
        });
      } else {
        track.style.transition = 'transform .35s var(--ease)';
        track.style.transform = '';
        setTimeout(function () { track.style.transition = ''; }, 350);
      }
    });
  });
})();
