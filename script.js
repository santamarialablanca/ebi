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
    const sections = document.querySelectorAll('.section-criteria, .section-principles, .section-stages, .section-competences, .section-cta, .nav-sections');
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
  const sectionIds = ['criterios', 'principios', 'etapas', 'competencias', 'objetivo'];

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

  // --- Nav sticky: añadir clase al hacer scroll (pasado el hero) ---
  var hero = document.querySelector('.hero');
  var navSections = document.querySelector('.nav-sections');
  if (hero && navSections) {
    var heroBottom = hero.offsetHeight;
    function toggleStickyNav() {
      var scrolled = window.scrollY || window.pageYOffset;
      navSections.classList.toggle('is-sticky', scrolled > heroBottom * 0.6);
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(toggleStickyNav);
    });
    toggleStickyNav();
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

  document.documentElement.style.scrollPaddingTop = '1rem';
})();
