(() => {
  const initMobileMenu = () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileBtn || !mobileMenu || mobileBtn.dataset.bound === 'true') return;

    mobileBtn.dataset.bound = 'true';
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  };

  const initAccordions = () => {
    document.querySelectorAll('[data-accordion]').forEach((card) => {
      if (card.dataset.bound === 'true') return;

      const trigger = card.querySelector('.feature-trigger');
      const panel = card.querySelector('.feature-panel');
      const caret = card.querySelector('.feature-caret');

      if (!trigger || !panel) return;

      card.dataset.bound = 'true';
      trigger.addEventListener('click', () => {
        const isOpen = panel.classList.contains('open');
        document.querySelectorAll('.feature-panel.open').forEach((openPanel) => {
          openPanel.classList.remove('open');
          const openCaret = openPanel.closest('[data-accordion]')?.querySelector('.feature-caret');
          if (openCaret) openCaret.style.transform = 'rotate(45deg)';
        });

        if (!isOpen) {
          panel.classList.add('open');
          if (caret) caret.style.transform = 'rotate(225deg)';
        } else if (caret) {
          caret.style.transform = 'rotate(45deg)';
        }
      });
    });
  };

  const initProgramModal = () => {
    const programModal = document.getElementById('program-modal');
    const programCards = document.querySelectorAll('.program-card[data-program]');

    if (!programModal || !programCards.length || programModal.dataset.bound === 'true') return;

    const titleEl = programModal.querySelector('[data-program-title]');
    const detailBlocks = programModal.querySelectorAll('[data-program-detail]');
    const closeTargets = programModal.querySelectorAll('[data-modal-close]');

    const closeModal = () => {
      programModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };

    const openModal = (programId, titleText) => {
      detailBlocks.forEach((block) => block.classList.add('hidden'));
      const active = programModal.querySelector(`[data-program-detail="${programId}"]`);
      if (active) active.classList.remove('hidden');
      if (titleEl && titleText) titleEl.textContent = titleText;
      programModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    };

    programCards.forEach((card) => {
      const programId = card.getAttribute('data-program');
      const titleText = card.getAttribute('data-program-title');

      card.addEventListener('click', () => openModal(programId, titleText));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(programId, titleText);
        }
      });
    });

    closeTargets.forEach((btn) => btn.addEventListener('click', closeModal));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !programModal.classList.contains('hidden')) {
        closeModal();
      }
    });

    programModal.dataset.bound = 'true';
  };

  const initSiteUi = () => {
    initMobileMenu();
    initAccordions();
    initProgramModal();
  };

  initSiteUi();
  document.addEventListener('layout:loaded', initSiteUi);
})();
