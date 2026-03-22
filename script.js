/* ============================================================
   script.js – Portfolio interactivity
   ============================================================ */

(function () {
  'use strict';

  /* ---- Cached elements ---- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  const revealTargets = document.querySelectorAll(
    '.skill-card, .project-card, .timeline-item, .about-grid, .contact-container'
  );

  const projectCards = document.querySelectorAll('.project-card[data-project]');
  const projectModal = document.getElementById('projectModal');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalContent = document.getElementById('projectModalContent');
  const projectModalClose = document.getElementById('projectModalClose');

  /* ---- Active nav link on scroll ---- */
  function highlightNavLink() {
    let current = '';

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  /* ---- Navbar scroll effect ---- */
  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    highlightNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Mobile nav toggle ---- */
  function closeMobileMenu() {
    if (!navLinksEl || !navToggle) return;

    navLinksEl.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');

    if (!projectModal || !projectModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---- Scroll reveal ---- */
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  /* ---- Project modal / sub-page ---- */
  function openProjectModal(projectKey) {
    if (!projectModal || !projectModalContent) return;

    const template = document.getElementById(`project-template-${projectKey}`);
    if (!template) {
      console.warn(`No template found for project: ${projectKey}`);
      return;
    }

    projectModalContent.innerHTML = '';
    projectModalContent.appendChild(template.content.cloneNode(true));

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal || !projectModalContent) return;

    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    projectModalContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      openProjectModal(card.dataset.project);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.dataset.project);
      }
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', closeProjectModal);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMobileMenu();

      if (projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
    }
  });
})();