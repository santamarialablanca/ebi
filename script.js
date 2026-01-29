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

  document.documentElement.style.scrollPaddingTop = '1rem';

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
})();
