/**
 * mDapps Mainnet - Vanilla JavaScript Interactions
 * Pure native JS with no external frameworks or libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modalBackdrop = document.getElementById('connectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const connectButtons = document.querySelectorAll('.connectButton, .btn-card, .btn-primary, .btn-secondary');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');
  const toastContainer = document.getElementById('toastContainer');

  // Modal Tabs
  const tabButtons = document.querySelectorAll('.modal-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Coinbase Options
  const cbOptionItems = document.querySelectorAll('.cb-option-item');

  // Recovery Phrase options
  const phraseTypeBtns = document.querySelectorAll('.phrase-type-btn');
  const phraseInput = document.getElementById('recoveryPhraseInput');
  const importPhraseBtn = document.getElementById('importPhraseBtn');

  // 1. Open / Close Connect Modal
  function openModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  connectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = './Grah/index.html';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // 2. Tab Switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`tab-${targetTab}`);
      if (pane) {
        pane.classList.add('active');
      }
    });
  });

  // 3. Coinbase Option Toggle
  cbOptionItems.forEach((item) => {
    item.addEventListener('click', () => {
      cbOptionItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      const appName = item.querySelector('h4')?.textContent || 'App';
      showToast(`Selected ${appName} connection flow`, 'success');
    });
  });

  // 4. Wallet Grid Selection
  const walletCards = document.querySelectorAll('.wallet-item-card');
  walletCards.forEach((card) => {
    card.addEventListener('click', () => {
      const walletName = card.querySelector('.wallet-name')?.textContent || 'Wallet';
      showToast(`Connecting to ${walletName}... Please approve in extension.`, 'success');
    });
  });

  // 5. Recovery Phrase Type Selector
  let currentPhraseLength = 12;
  phraseTypeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      phraseTypeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPhraseLength = parseInt(btn.getAttribute('data-words') || '12', 10);
      if (phraseInput) {
        phraseInput.placeholder = `Enter your ${currentPhraseLength}-word secret phrase separated by spaces...`;
      }
    });
  });

  // 6. Import Phrase Submit
  if (importPhraseBtn && phraseInput) {
    importPhraseBtn.addEventListener('click', () => {
      const rawText = phraseInput.value.trim();
      const words = rawText.split(/\s+/).filter(Boolean);

      if (words.length === 0) {
        showToast('Please enter your recovery phrase.', 'error');
        return;
      }

      if (words.length !== currentPhraseLength) {
        showToast(`Expected ${currentPhraseLength} words, but found ${words.length} words.`, 'error');
        return;
      }

      importPhraseBtn.disabled = true;
      importPhraseBtn.textContent = 'Verifying & Synchronizing...';

      setTimeout(() => {
        importPhraseBtn.disabled = false;
        importPhraseBtn.textContent = 'Import Wallet';
        phraseInput.value = '';
        closeModal();
        showToast('Wallet successfully synchronized with Mainnet!', 'success');
      }, 1400);
    });
  }

  // 7. Mobile Drawer Navigation
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // 8. Toast Notifications (SweetAlert style)
  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconSvg =
      type === 'success'
        ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        toast.remove();
      }, 250);
    }, 4000);
  }

  // 9. Realistic ticker subtle fluctuation
  setInterval(() => {
    const priceElements = document.querySelectorAll('.ticker-item .price');
    if (priceElements.length > 0) {
      const randomIdx = Math.floor(Math.random() * priceElements.length);
      const el = priceElements[randomIdx];
      const currentVal = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(currentVal) && currentVal > 0) {
        const delta = (Math.random() - 0.48) * (currentVal * 0.002);
        const newVal = currentVal + delta;
        el.textContent = `$${newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
  }, 3500);
});
