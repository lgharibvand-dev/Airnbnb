(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const subjectButtons = document.querySelectorAll('.tab-btn');
  const tutorCards = document.querySelectorAll('[data-subject-card]');
  const budgetRange = document.getElementById('budget');
  const budgetValue = document.getElementById('budget-value');
  const forms = document.querySelectorAll('form');
  const toastTemplate = document.getElementById('toast-template');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const toggleMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.toggleAttribute('hidden');
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', toggleMobileMenu);

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 820) {
          toggleMobileMenu();
        }
      });
    });
  }

  const showSubject = (subject) => {
    tutorCards.forEach((card) => {
      const matches = subject === card.dataset.subjectCard;
      card.toggleAttribute('hidden', !matches);
    });
  };

  if (subjectButtons.length) {
    const activeButton = Array.from(subjectButtons).find((button) => button.classList.contains('active'));
    if (activeButton) {
      showSubject(activeButton.dataset.subject);
    }

    subjectButtons.forEach((button) => {
      button.addEventListener('click', () => {
        subjectButtons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        showSubject(button.dataset.subject);
      });
    });
  }

  if (budgetRange && budgetValue) {
    const updateBudget = () => {
      budgetValue.textContent = `$${budgetRange.value}`;
    };

    budgetRange.addEventListener('input', updateBudget);
    updateBudget();
  }

  const showToast = (message) => {
    if (!toastTemplate) return;
    const toast = toastTemplate.content.firstElementChild.cloneNode(true);
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2600);
  };

  forms.forEach((form) => {
    const feedback = form.querySelector('.form-feedback');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const requiredFields = Array.from(form.querySelectorAll('[required]'));
      const hasEmptyRequired = requiredFields.some((field) => !String(formData.get(field.name)).trim());

      if (hasEmptyRequired) {
        if (feedback) {
          feedback.textContent = 'Please fill in the required fields.';
          feedback.style.color = '#ff6b6b';
        }
        showToast('Please complete the highlighted fields.');
        return;
      }

      if (feedback) {
        feedback.textContent = 'Thanks! We will be in touch soon.';
        feedback.style.color = 'var(--color-primary)';
      }
      form.reset();
      showToast('Form submitted successfully.');
    });
  });
})();
