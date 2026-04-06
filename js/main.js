/* ============================================
   PORTFOLIO - Muhammad Muneeb Iftikhar
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  
  // Hide preloader when page is fully loaded or after a 3s timeout (safety)
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  };

  window.addEventListener('load', hidePreloader);
  
  // Fallback for slower connections: hide preloader anyway after 3 seconds
  setTimeout(hidePreloader, 3000);

  // ---- Navbar scroll effect ----
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---- Active nav link on scroll ----
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

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

  // ---- Fade-in on scroll (Intersection Observer) ----
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ---- Back to Top ----
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Consolidated scroll listener ----
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

  // ---- Mobile nav collapse on link click ----
  const navbarCollapse = document.getElementById('navbarNav');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: true });
      }
    });
  });

  // ---- Portfolio Modal Navigation ----
  const portfolioItems = document.querySelectorAll('[data-project-index]');
  const projectModals = document.querySelectorAll('.project-modal');

  window.openProjectModal = function(index) {
    // Close any open modals first
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

  // ---- Parallax-like effect on hero orbs ----
  const orbs = document.querySelectorAll('.hero-bg .orb');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 8;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  // ---- Typed effect for hero subtitle ----
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.borderRight = '2px solid var(--primary)';

    let i = 0;
    function typeEffect() {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeEffect, 50);
      } else {
        // Remove cursor after typing
        setTimeout(() => {
          heroSubtitle.style.borderRight = 'none';
        }, 1500);
      }
    }

    // Delay start
    setTimeout(typeEffect, 1200);
  }

  // ---- Counter animation for skills ----
  const skillItems = document.querySelectorAll('.info-card ul li');
  skillItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.05}s`;
  });

  // ---- Remove skeleton loader when image is loaded ----
  const lazyImages = document.querySelectorAll('.portfolio-thumb-wrapper img');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.parentElement.classList.remove('skeleton-loader');
    } else {
      img.addEventListener('load', () => {
        img.parentElement.classList.remove('skeleton-loader');
      });
    }
  });

  // Initialize
  handleNavbarScroll();
  updateActiveNav();
});
