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
