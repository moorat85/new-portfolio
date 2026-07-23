/* Плавающая шапка: плавно появляется после того, как обычная шапка скрылась,
   и плавно исчезает у самого верха. */
(function () {
  var nav = document.getElementById('site-nav');
  if (!nav) return;

  var SHOW = 100; // появиться, когда обычная шапка (~80px) уже ушла
  var HIDE = 60;  // исчезнуть, когда почти вернулись наверх
  var shown = false;
  var ticking = false;

  function update() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (!shown && y > SHOW) {
      shown = true;
      nav.classList.add('is-visible');
    } else if (shown && y < HIDE) {
      shown = false;
      nav.classList.remove('is-visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();
