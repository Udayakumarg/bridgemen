document.addEventListener('DOMContentLoaded', () => {

  /* ================= Scroll reveal ================= */
  const sr = document.querySelectorAll('.sr');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  sr.forEach(el => io.observe(el));

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

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ================= Fade-in ================= */
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  faders.forEach(el => observer.observe(el));

  /* ================= FAB ================= */
  const fab = document.getElementById('fab');

  if (fab) {
    const fabMain = fab.querySelector('.fab-main');
    const STORAGE_KEY = 'bridgemen_fab_seen';

    if (fabMain) {
      fabMain.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fab.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
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

    } else {
      console.warn('FAB main button not found');
    }
  } else {
    console.warn('FAB container not found');
  }

  /* ================= CONTACT FORM (Cloudflare Worker + Spinner + Popup + Redirect) ================= */
  document.querySelector(".contact-form").addEventListener("submit", async function(e){
    e.preventDefault();

    const overlay = document.getElementById("loading-overlay");
    const popup = document.getElementById("success-popup");

    overlay.style.display = "flex";

    const formData = new FormData(this);

    try {
      const response = await fetch("https://bridgemen-email.vijay-509.workers.dev/", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      overlay.style.display = "none";

      if (result.status === "success") {

        popup.style.display = "flex";

        setTimeout(() => {
          popup.style.display = "none";
          window.location.href = "contact.html";
        }, 3000);

      } else {
        showToast("Error: " + result.message, "error");
      }

    } catch (err) {
      overlay.style.display = "none";
      showToast("Network error. Try again.", "error");
    }
  });

  /* ================= Toast helper ================= */
  function showToast(msg, type="success") {
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML = msg;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

});
