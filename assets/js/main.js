// Loader: play the wordmark intro, then fade out once the page has
// loaded (min display 900ms so it never flashes). Skipped on repeat
// views within the same session; CSS auto-hides at 3.5s as a fallback.
(function () {
  var loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('skip')) return;

  var MIN = 900;
  var start = Date.now();

  function hide() {
    loader.classList.add('done');
    try { sessionStorage.setItem('kc-seen', '1'); } catch (e) {}
  }

  function onLoaded() {
    var wait = Math.max(0, MIN - (Date.now() - start));
    setTimeout(hide, wait);
  }

  if (document.readyState === 'complete') onLoaded();
  else window.addEventListener('load', onLoaded);

  setTimeout(hide, 4000); // hard cap
})();

// Mobile nav toggle
(function () {
  var nav = document.querySelector('nav');
  var btn = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (!nav || !btn || !links) return;

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
  });
})();

(function () {
  var rot = document.getElementById('rotator');
  if (!rot) return;

  var words = Array.prototype.slice.call(rot.querySelectorAll('.rw'));
  var dot = rot.querySelector('.dot');
  var i = 0;

  // Keep the static period right after the current word.
  function placeDot() {
    if (dot) dot.style.transform = 'translateX(' + words[i].offsetWidth + 'px)';
  }

  // Fix the container to the widest word so line breaks never shift
  // as words rotate (prevents reflow "jumping" at any screen size).
  function setW() {
    var w = 0;
    for (var k = 0; k < words.length; k++) {
      w = Math.max(w, words[k].offsetWidth);
    }
    rot.style.width = (w + (dot ? dot.offsetWidth : 0)) + 'px';
  }

  function layout() { setW(); placeDot(); }

  layout();
  window.addEventListener('load', layout);

  var rT;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(layout, 100);
  });
  window.addEventListener('orientationchange', function () {
    setTimeout(layout, 200);
  });

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(function () {
    var cur = words[i];
    i = (i + 1) % words.length;
    var nxt = words[i];

    cur.classList.remove('active');
    cur.classList.add('exit');
    nxt.classList.add('active');
    placeDot();

    setTimeout(function () {
      cur.style.transition = 'none';
      cur.classList.remove('exit');
      void cur.offsetWidth;
      cur.style.transition = '';
    }, 600);
  }, 2600);
})();

// Focus areas: on touch devices (no hover), light up rows one by one
// while the section is in view — mirrors the desktop hover invert.
(function () {
  if (!window.matchMedia) return;
  if (!window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var themes = document.querySelectorAll('.theme');
  if (!themes.length || !('IntersectionObserver' in window)) return;

  var idx = -1;
  var timer = null;

  function step() {
    if (idx >= 0) themes[idx].classList.remove('lit');
    idx = (idx + 1) % themes.length;
    themes[idx].classList.add('lit');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !timer) {
        step();
        timer = setInterval(step, 1800);
      } else if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
        if (idx >= 0) { themes[idx].classList.remove('lit'); idx = -1; }
      }
    });
  }, { threshold: 0.2 });

  io.observe(themes[0].parentElement);
})();

// Work cards: subtle 3D tilt and highlight on desktop pointer devices.
(function () {
  if (!window.matchMedia) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = document.querySelectorAll('.grid .card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    var raf = 0;

    function reset() {
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.removeProperty('--shine-x');
      card.style.removeProperty('--shine-y');
    }

    card.addEventListener('pointerenter', function () {
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointermove', function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var tiltY = (px - 0.5) * 10;
      var tiltX = (0.5 - py) * 8;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.classList.add('is-tilting');
        card.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
        card.style.setProperty('--shine-x', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--shine-y', (py * 100).toFixed(1) + '%');
      });
    });

    card.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      reset();
    });

    card.addEventListener('blur', reset, true);
  });
})();
