document.addEventListener('DOMContentLoaded', () => {

  /* ================= Scroll reveal ================= */
  const sr = document.querySelectorAll('.sr');
  if (sr.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    sr.forEach(el => io.observe(el));
  }

  /* ================= Parallax ================= */
  const bg = document.querySelector('.parallax .bg');
  if (bg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      bg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    });
  }

  /* ================= Hamburger ================= */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ================= Fade-in ================= */
  const faders = document.querySelectorAll('.fade-in');
  if (faders.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    });
    faders.forEach(el => observer.observe(el));
  }

  /* ================= FAB ================= */
  const fab = document.getElementById('fab');

  if (fab) {
    const fabMain = fab.querySelector('.fab-main');
    const STORAGE_KEY = 'bridgemen_fab_seen';

    fabMain?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      fab.classList.toggle('open');
    });

    document.addEventListener('click', e => {
      if (!fab.contains(e.target)) {
        fab.classList.remove('open');
      }
    });

    if (!localStorage.getItem(STORAGE_KEY)) {
      setTimeout(() => {
        fab.classList.add('open');
        localStorage.setItem(STORAGE_KEY, 'true');
      }, 1200);
    }
  }

  /* ================= CONTACT FORM ================= */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const overlay = document.getElementById('loading-overlay');
      const popup = document.getElementById('success-popup');
      const submitBtn = this.querySelector('button[type="submit"]');

      overlay && (overlay.style.display = 'flex');
      submitBtn && (submitBtn.disabled = true);

      const formData = new FormData(this);

      try {
        const response = await fetch(
          'https://bridgemen-email.vijay-509.workers.dev/',
          { method: 'POST', body: formData }
        );

        const result = await response.json();

        overlay && (overlay.style.display = 'none');
        submitBtn && (submitBtn.disabled = false);

        if (result.status === 'success') {
          popup && (popup.style.display = 'flex');

          setTimeout(() => {
            popup && (popup.style.display = 'none');
            window.location.href = 'contact.html';
          }, 3000);
        } else {
          showToast(result.message || 'Something went wrong', 'error');
        }

      } catch (err) {
        overlay && (overlay.style.display = 'none');
        submitBtn && (submitBtn.disabled = false);
        showToast('Network error. Please try again.', 'error');
      }
    });
  }

  /* ================= Toast helper ================= */
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

});
