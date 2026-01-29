/**
 * Sistema EBI - Santa María la Blanca
 * Interactividad: scroll suave, revelado al scroll, etapas expandibles,
 * competencias con descripción, navegación activa, accesibilidad
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll suave al ancla ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // --- Revelado al hacer scroll (Intersection Observer) ---
  if (!prefersReducedMotion) {
    const sections = document.querySelectorAll('.section-vision, .section-criteria, .section-principles, .section-stages, .section-competences, .section-cta');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    sections.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // --- Navegación activa según scroll ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIds = ['vision-general', 'criterios', 'principios', 'etapas', 'competencias', 'objetivo'];

  function updateActiveNav() {
    var current = '';
    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = id;
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var isActive = href === '#' + current;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : null);
    });
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateActiveNav);
  });
  updateActiveNav();

  // --- Botón volver arriba: mostrar al hacer scroll + bounce al clic ---
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    function toggleBackToTop() {
      var show = (window.scrollY || document.documentElement.scrollTop) > 400;
      backToTop.classList.toggle('is-visible', show);
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(toggleBackToTop);
    });
    backToTop.addEventListener('click', function () {
      backToTop.classList.add('is-press');
      setTimeout(function () { backToTop.classList.remove('is-press'); }, 400);
    });
    toggleBackToTop();
  }

  // --- Etapas: expandir/colapsar descripción al clic ---
  document.querySelectorAll('.stage-btn').forEach(function (btn) {
    var panelId = btn.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
    });
  });

  // --- Competencias: toggle descripción al clic (hover en desktop + clic en todos) ---
  document.querySelectorAll('.card-competence').forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('click', function (e) {
      e.preventDefault();
      var wasOpen = card.classList.contains('is-open');
      document.querySelectorAll('.card-competence').forEach(function (c) {
        c.classList.remove('is-open');
        c.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
      }
    });

    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      card.click();
    });
  });

  document.documentElement.style.scrollPaddingTop = '56px';

  // --- Modo claro/oscuro (localStorage) ---
  var themeToggle = document.getElementById('theme-toggle');
  var savedTheme = localStorage.getItem('ebi-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.body.setAttribute('data-theme', savedTheme);
  }
  if (themeToggle) {
    function updateThemeLabel() {
      var isLight = document.body.getAttribute('data-theme') === 'light';
      themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
    updateThemeLabel();
    themeToggle.addEventListener('click', function () {
      var next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('ebi-theme', next);
      updateThemeLabel();
    });
  }

  // --- Micro-interacciones: bounce/ripple al clic ---
  document.querySelectorAll('.nav-link--ripple').forEach(function (link) {
    link.addEventListener('click', function () {
      link.classList.add('is-press');
      setTimeout(function () { link.classList.remove('is-press'); }, 350);
    });
  });
  // --- Barra de progreso de scroll ---
  var scrollProgress = document.querySelector('.scroll-progress');
  var scrollProgressBar = document.querySelector('.scroll-progress-bar');
  if (scrollProgress && scrollProgressBar) {
    function updateScrollProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      scrollProgressBar.style.width = pct + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(pct));
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateScrollProgress);
    });
    window.addEventListener('load', updateScrollProgress);
    updateScrollProgress();
  }

  // --- Efecto 3D tilt en cards (WOW, respeta reduced-motion) ---
  if (!prefersReducedMotion) {
    var tiltCards = document.querySelectorAll('.section-bg .card, .section-bg-alt .card');
    var tiltFactor = 8;
    tiltCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.addEventListener('mousemove', onTiltMove);
      });
      card.addEventListener('mouseleave', function () {
        card.removeEventListener('mousemove', onTiltMove);
        card.style.transform = '';
      });
      function onTiltMove(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateY = x * tiltFactor;
        var rotateX = -y * tiltFactor;
        var lift = 6;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-' + lift + 'px)';
      }
    });
  }

  // --- Contadores animados (visión general) ---
  var visionSection = document.getElementById('vision-general');
  var stats = visionSection ? visionSection.querySelectorAll('.vision-stat') : [];
  var counted = false;

  function animateCount(el, target) {
    var duration = 800;
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.round(start + (target - start) * easeOut);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  if (visionSection && stats.length && !prefersReducedMotion) {
    var obsStats = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || counted) return;
          counted = true;
          stats.forEach(function (stat) {
            var valueEl = stat.querySelector('.vision-stat-value');
            var target = parseInt(stat.getAttribute('data-count'), 10);
            if (valueEl && !isNaN(target)) animateCount(valueEl, target);
          });
        });
      },
      { threshold: 0.3 }
    );
    obsStats.observe(visionSection);
  } else if (visionSection && stats.length) {
    stats.forEach(function (stat) {
      var valueEl = stat.querySelector('.vision-stat-value');
      var target = stat.getAttribute('data-count');
      if (valueEl && target) valueEl.textContent = target;
    });
  }

  // --- Tabla visión: resaltar fila al clic ---
  var visionTable = document.querySelector('.vision-table tbody');
  if (visionTable) {
    visionTable.querySelectorAll('tr').forEach(function (row) {
      row.addEventListener('click', function () {
        visionTable.querySelectorAll('tr').forEach(function (r) { r.classList.remove('is-highlight'); });
        row.classList.add('is-highlight');
      });
    });
  }

  // --- Cursor personalizado (hero + CTA, solo desktop, sin reduced-motion) ---
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches && window.matchMedia('(min-width: 1025px)').matches) {
    var cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorDot);
    var heroEl = document.querySelector('.hero.cursor-custom');
    var ctaEl = document.querySelector('.section-cta.cursor-custom');
    document.addEventListener('mousemove', function (e) {
      var inside = (heroEl && heroEl.contains(e.target)) || (ctaEl && ctaEl.contains(e.target));
      if (inside) {
        cursorDot.classList.add('is-visible');
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
      } else {
        cursorDot.classList.remove('is-visible', 'is-hover');
      }
    });
  }

  // --- Parallax suave en hero (respetando reduced-motion) ---
  if (!prefersReducedMotion) {
    var heroInner = document.querySelector('.hero-inner');
    window.addEventListener('scroll', function () {
      requestAnimationFrame(function () {
        if (!heroInner) return;
        var y = window.scrollY || document.documentElement.scrollTop;
        var rate = Math.min(y * 0.06, 20);
        heroInner.style.transform = 'translateY(' + rate + 'px)';
      });
    });
  }

  // --- Lazy load Chart.js: cargar solo cuando Visión general entra en viewport ---
  var visionSectionForCharts = document.getElementById('vision-general');
  var chartsInitialized = false;
  var chartScriptLoading = false;

  function loadChartJs(callback) {
    if (typeof Chart !== 'undefined') {
      callback();
      return;
    }
    if (chartScriptLoading) {
      var t = setInterval(function () {
        if (typeof Chart !== 'undefined') {
          clearInterval(t);
          callback();
        }
      }, 50);
      return;
    }
    chartScriptLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = function () { callback(); };
    document.head.appendChild(s);
  }

  function initCharts() {
    if (!visionSectionForCharts || chartsInitialized) return;
    loadChartJs(function () {
      if (chartsInitialized) return;
      chartsInitialized = true;

  // --- Gráfico estructura EBI (Chart.js) ---
  var chartCanvas = document.getElementById('ebi-structure-chart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    var ctx = chartCanvas.getContext('2d');
    var chartAnimations = !prefersReducedMotion;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Criterios', 'Principios', 'Etapas', 'Competencias'],
        datasets: [{
          label: 'Elementos',
          data: [2, 4, 6, 6],
          backgroundColor: [
            'rgba(151, 0, 54, 0.9)',
            'rgba(30, 40, 56, 0.9)',
            'rgba(196, 77, 108, 0.9)',
            'rgba(30, 40, 56, 0.7)'
          ],
          borderColor: ['#970036', '#1e2838', '#c44d6c', '#1e2838'],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.4,
        animation: chartAnimations,
        transitions: { active: { animation: { duration: 0 } } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.parsed.x + ' elementos';
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 8,
            ticks: { stepSize: 2, color: '#1e2838' },
            grid: { color: 'rgba(30, 40, 56, 0.12)' },
            title: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#1e2838', font: { size: 13 } }
          }
        }
      }
    });
  }

  // --- Gráfico circular competencias (Chart.js) ---
  var competencesCanvas = document.getElementById('ebi-competences-chart');
  if (competencesCanvas && typeof Chart !== 'undefined') {
    var ctxComp = competencesCanvas.getContext('2d');
    var colorsComp = [
      'rgba(151, 0, 54, 0.9)',
      'rgba(30, 40, 56, 0.85)',
      'rgba(196, 77, 108, 0.9)',
      'rgba(151, 0, 54, 0.7)',
      'rgba(30, 40, 56, 0.7)',
      'rgba(196, 77, 108, 0.75)'
    ];
    var borderComp = ['#970036', '#1e2838', '#c44d6c', '#970036', '#1e2838', '#c44d6c'];
    new Chart(ctxComp, {
      type: 'doughnut',
      data: {
        labels: ['Personal y social', 'Iniciativa y autonomía', 'Digital', 'Comunicativa', 'Artística', 'Científica'],
        datasets: [{
          data: [1, 1, 1, 1, 1, 1],
          backgroundColor: colorsComp,
          borderColor: borderComp,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        animation: !prefersReducedMotion,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ': 1 de 6 competencias';
              }
            }
          }
        },
        cutout: '58%'
      }
    });
  }
    });
  }

  if (visionSectionForCharts) {
    var obsCharts = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            initCharts();
          }
        });
      },
      { rootMargin: '100px', threshold: 0 }
    );
    obsCharts.observe(visionSectionForCharts);
  }
})();
