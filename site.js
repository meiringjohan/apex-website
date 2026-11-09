(function () {
  const btn = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  if (btn && panel) {
    const nav = btn.closest('.nav');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (nav) nav.classList.toggle('is-menu-open', open);
    });
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      panel.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (nav) nav.classList.remove('is-menu-open');
    });
  }
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dd').forEach(dd => {
      if (!dd.contains(e.target)) dd.removeAttribute('open');
    });
  });

  // Lightbox
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<div class="lb-inner"><button type="button" class="lb-close" aria-label="Close">×</button><img alt=""><div class="lb-cap"></div></div>';
    document.body.appendChild(lb);
  }
  const img = lb.querySelector('img');
  const cap = lb.querySelector('.lb-cap');
  const closeBtn = lb.querySelector('.lb-close');
  function openLb(src, caption) {
    img.src = src;
    img.alt = caption || '';
    cap.textContent = caption || '';
    lb.classList.add('is-open');
  }
  function closeLb() {
    lb.classList.remove('is-open');
    img.removeAttribute('src');
  }
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-lightbox]');
    if (el) {
      e.preventDefault();
      openLb(el.getAttribute('data-lightbox'), el.getAttribute('data-caption') || '');
    }
  });
  closeBtn.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
})();
