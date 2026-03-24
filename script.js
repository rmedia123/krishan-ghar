/* ============================================
   KRISHAN GHAR — Interactive Features
   ============================================ */

(function () {
  'use strict';

  /* ── Dark Mode Toggle ── */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.innerHTML = currentTheme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  /* ── Sticky Header: Hide on scroll down, show on scroll up ── */
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;

    if (scrollY > headerHeight) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ── Mobile Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  let overlay = null;

  function createOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', closeMenu);
    }
  }

  function openMenu() {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('is-open');
    createOverlay();
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('is-active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close mobile nav when clicking nav links
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active Nav Link Highlighting ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  /* ── Scroll Reveal Animations ── */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.about__content, .about__visual, .product-card, .contact__info, .contact__form-wrapper, .section-label, .section-title, .section-desc, .products__cta'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // Stagger product cards
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

  initScrollReveal();

  /* ── Contact Form with Validation ── */
  const SUPABASE_URL = 'SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY';
  const NOTIFICATION_EMAIL = 'info@krishanghar.com';

  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form__success');
  const formErrorMsg = document.querySelector('.form__error');

  function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    const errorEl = input.nextElementSibling;

    let isValid = true;
    let message = '';

    if (input.required && !value) {
      isValid = false;
      message = 'This field is required.';
    } else if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (name === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid phone number.';
      }
    }

    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    } else {
      input.classList.remove('is-invalid');
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    return isValid;
  }

  // Real-time validation on blur
  if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all required fields
      const requiredFields = contactForm.querySelectorAll('[required]');
      let allValid = true;
      requiredFields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const checkedCategories = [];
      contactForm.querySelectorAll('input[name="categories"]:checked').forEach(cb => {
        checkedCategories.push(cb.value);
      });

      const data = {
        name: formData.get('name'),
        business: formData.get('business'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        categories: checkedCategories.join(', ') || null,
        message: formData.get('message') || null
      };

      try {
        // 1. Save to Supabase
        const res = await fetch(SUPABASE_URL + '/rest/v1/contact_submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(data)
        });

        if (res.ok || res.status === 201) {
          // 2. Send email notification (non-blocking)
          const emailBody = new FormData();
          emailBody.append('name', data.name);
          emailBody.append('email', data.email);
          emailBody.append('business', data.business);
          emailBody.append('phone', data.phone || 'Not provided');
          emailBody.append('categories', data.categories || 'Not specified');
          emailBody.append('message', data.message || 'No message');
          emailBody.append('_subject', 'New Wholesale Inquiry — Krishan Ghar');
          emailBody.append('_template', 'table');
          fetch('https://formsubmit.co/ajax/' + NOTIFICATION_EMAIL, {
            method: 'POST',
            body: emailBody
          }).catch(() => {});

          showFormSuccess();
          contactForm.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        // If Supabase fails (placeholder URL), still try email
        try {
          const emailBody = new FormData();
          emailBody.append('name', data.name);
          emailBody.append('email', data.email);
          emailBody.append('business', data.business);
          emailBody.append('phone', data.phone || 'Not provided');
          emailBody.append('categories', data.categories || 'Not specified');
          emailBody.append('message', data.message || 'No message');
          emailBody.append('_subject', 'New Wholesale Inquiry — Krishan Ghar');
          emailBody.append('_template', 'table');
          await fetch('https://formsubmit.co/ajax/' + NOTIFICATION_EMAIL, {
            method: 'POST',
            body: emailBody
          });
          showFormSuccess();
          contactForm.reset();
        } catch (emailErr) {
          showFormError();
        }
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }

  function showFormSuccess() {
    if (formSuccess) {
      formSuccess.classList.add('form__success--visible');
      formSuccess.textContent = "Thank you for your inquiry. We'll get back to you within 1 business day.";
    }
    if (formErrorMsg) formErrorMsg.classList.remove('form__error-msg--visible');
    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (formSuccess) formSuccess.classList.remove('form__success--visible');
    }, 8000);
  }

  function showFormError() {
    if (formErrorMsg) {
      formErrorMsg.classList.add('form__error-msg--visible');
      formErrorMsg.textContent = 'Something went wrong. Please try again or email us directly at info@krishanghar.com';
    }
    if (formSuccess) formSuccess.classList.remove('form__success--visible');
  }

  /* ── Keyboard support: close menu with Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

})();
