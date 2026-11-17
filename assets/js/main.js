/* ============================================================
   龙兵阳 · 个人网站交互
   原生 JS，无依赖
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 导航滚动状态 ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progressBar');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    if (!links) return;
    links.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '打开菜单');
    }
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 滚动出现 + 数字 / 进度条 ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var bars = document.querySelectorAll('.bar-track i');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');

        el.querySelectorAll('[data-count]').forEach(function (c) {
          if (!c.dataset.done) { c.dataset.done = '1'; animateCount(c); }
        });
        el.querySelectorAll('.bar-track i').forEach(function (b) {
          if (!b.dataset.done) {
            b.dataset.done = '1';
            var w = b.getAttribute('data-w') || '0';
            if (reduceMotion) b.style.width = w + '%';
            else setTimeout(function () { b.style.width = w + '%'; }, 120);
          }
        });

        revealObs.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-reveal], .timeline li').forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal], .timeline li').forEach(function (el) {
      el.classList.add('is-in');
    });
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
    bars.forEach(function (b) { b.style.width = (b.getAttribute('data-w') || 0) + '%'; });
  }

  /* ---------- 导航高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('data-nav')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-nav') === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---------- 打字机 ---------- */
  var typer = document.getElementById('typer');
  if (typer) {
    var phrases = ['PLC 顺控编程', 'SCADA 上位机画面', '现场调试与开车', '工艺联锁与报警设计'];
    if (reduceMotion) {
      typer.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      var tick = function () {
        var word = phrases[pi];
        if (!deleting) {
          ci++;
          typer.textContent = word.slice(0, ci);
          if (ci === word.length) {
            deleting = true;
            setTimeout(tick, 1900);
            return;
          }
          setTimeout(tick, 105);
        } else {
          ci--;
          typer.textContent = word.slice(0, ci);
          if (ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            setTimeout(tick, 320);
            return;
          }
          setTimeout(tick, 55);
        }
      };
      setTimeout(tick, 700);
    }
  }

  /* ---------- 复制 ---------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); }
      catch (e) { reject(e); }
      finally { document.body.removeChild(ta); }
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () {
      var text = el.getAttribute('data-copy');
      var label = el.getAttribute('data-label') || '内容';
      copyText(text).then(function () {
        showToast(label + '已复制：' + text);
      }).catch(function () {
        showToast('复制失败，请手动记下：' + text);
      });
    });
  });

  /* ---------- 占位提示：联系方式未替换时提醒 ---------- */
  document.querySelectorAll('.contact-card[href], [data-copy]').forEach(function (el) {
    var raw = el.getAttribute('data-copy') || el.getAttribute('href') || '';
    if (raw.indexOf('example.com') > -1 || raw.indexOf('LBY_water') > -1) {
      el.addEventListener('click', function (e) {
        if (el.tagName === 'A') e.preventDefault();
      });
    }
  });
})();
