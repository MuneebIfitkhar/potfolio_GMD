/* ============================================
   PORTFOLIO — Muhammad Muneeb Iftikhar
   Main JavaScript (VayuApps Redesign)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Preloader ───
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  };
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 3000);

  // ─── Navbar scroll effect ───
  const navbar = document.querySelector('.navbar-vayu');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ─── Active nav link on scroll ───
  function updateActiveNav() {
    const scrollPos = window.scrollY + 160;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ─── Smooth scroll for nav links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile nav if open
        closeMobileNav();
      }
    });
  });

  // ─── Mobile Nav ───
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeMobileNav() {
    if (navToggle) navToggle.classList.remove('active');
    if (navLinksContainer) navLinksContainer.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        navToggle.classList.add('active');
        navLinksContainer.classList.add('open');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealElements = document.querySelectorAll('.reveal, .stagger-children');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '50px 0px 50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation for Stats ───
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ─── Back to Top ───
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Consolidated scroll listener ───
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        updateActiveNav();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── Portfolio Modal Navigation ───
  const projectModals = document.querySelectorAll('.project-modal');

  window.openProjectModal = function(index) {
    projectModals.forEach(m => {
      const modalInstance = bootstrap.Modal.getInstance(m);
      if (modalInstance) modalInstance.hide();
    });

    const targetModal = document.getElementById(`projectModal${index}`);
    if (targetModal) {
      setTimeout(() => {
        const modal = new bootstrap.Modal(targetModal);
        modal.show();
      }, 300);
    }
  };

  // ─── Remove skeleton loader when image is loaded ───
  const lazyImages = document.querySelectorAll('.project-card-img img');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.closest('.skeleton-loader')?.classList.remove('skeleton-loader');
    } else {
      img.addEventListener('load', () => {
        img.closest('.skeleton-loader')?.classList.remove('skeleton-loader');
      });
    }
  });

  // Initialize
  handleNavbarScroll();
  updateActiveNav();
});
