(function () {
  var rot = document.getElementById('rotator');
  if (!rot) return;

  var words = Array.prototype.slice.call(rot.querySelectorAll('.rw'));
  var i = 0;

  function setW(el) {
    rot.style.width = el.offsetWidth + 'px';
  }

  setW(words[0]);
  window.addEventListener('load', function () { setW(words[i]); });

  var rT;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () { setW(words[i]); }, 100);
  });
  window.addEventListener('orientationchange', function () {
    setTimeout(function () { setW(words[i]); }, 200);
  });

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(function () {
    var cur = words[i];
    i = (i + 1) % words.length;
    var nxt = words[i];

    cur.classList.remove('active');
    cur.classList.add('exit');
    nxt.classList.add('active');
    setW(nxt);

    setTimeout(function () {
      cur.style.transition = 'none';
      cur.classList.remove('exit');
      void cur.offsetWidth;
      cur.style.transition = '';
    }, 600);
  }, 2600);
})();
