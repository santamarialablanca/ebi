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
    const sections = document.querySelectorAll('main .section');
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
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  // --- Navegación activa según scroll ---
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  const sectionIds = ['criterios', 'principios', 'etapas', 'horizonte', 'competencias', 'objetivo'];

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

  // --- Etapas: botón "Ver detalle" expande/colapsa (accesible, sin depender de hover) ---
  document.querySelectorAll('.stage-toggle').forEach(function (btn) {
    var panelId = btn.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
      btn.textContent = expanded ? 'Ver detalle' : 'Ver menos';
    });
  });

  // --- Competencias: botón "Ver detalle" expande/colapsa definición completa (accesible) ---
  document.querySelectorAll('.competence-btn').forEach(function (btn) {
    var panelId = btn.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
      btn.textContent = expanded ? 'Ocultar detalle' : 'Ver detalle';
    });
  });

  document.documentElement.style.scrollPaddingTop = '1rem';

  // Nav: blur al hacer scroll
  var navEl = document.querySelector('.nav');
  if (navEl) {
    function toggleNavScrolled() {
      navEl.classList.toggle('nav--scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', toggleNavScrolled, { passive: true });
    toggleNavScrolled();
  }
})();
