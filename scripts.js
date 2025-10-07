(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lectureCards = document.querySelectorAll('.lecture-card');
  const modals = document.querySelectorAll('.modal');
  const toastTemplate = document.getElementById('toast-template');
  const yearEl = document.getElementById('year');
  const contactForm = document.querySelector('.contact-form');
  const newsletterForm = document.querySelector('.newsletter');

  yearEl.textContent = new Date().getFullYear();

  const toggleMobileMenu = () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.toggleAttribute('hidden');
  };

  navToggle.addEventListener('click', toggleMobileMenu);

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        toggleMobileMenu();
      }
    });
  });

  const filterLectures = (category) => {
    lectureCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      card.hidden = !matches;
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      filterLectures(btn.dataset.filter);
    });
  });

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-modal-target]');
    if (trigger) {
      openModal(trigger.dataset.modalTarget);
    }

    if (event.target.matches('[data-close]')) {
      const modal = event.target.closest('.modal');
      if (modal) closeModal(modal);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modals.forEach((modal) => {
        if (!modal.hidden) closeModal(modal);
      });
    }
  });

  const showToast = (message) => {
    const toast = toastTemplate.content.firstElementChild.cloneNode(true);
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2600);
  };

  document.querySelectorAll('[data-unlock]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.unlock;
      const downloadLink = document.querySelector(`[data-download="${key}"]`);
      if (!downloadLink) return;
      downloadLink.hidden = false;
      showToast('Download unlocked! Enjoy your lecture.');
    });
  });

  const setupForm = (form) => {
    if (!form) return;
    const feedback = form.querySelector('.form-feedback');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const hasEmptyRequired = Array.from(form.querySelectorAll('[required]')).some((field) => {
        return !String(formData.get(field.name)).trim();
      });

      if (hasEmptyRequired) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.color = '#ef4444';
        return;
      }

      feedback.textContent = 'Thanks! We will get back to you soon.';
      feedback.style.color = 'var(--color-primary)';
      form.reset();
    });
  };

  setupForm(contactForm);
  setupForm(newsletterForm);
})();
