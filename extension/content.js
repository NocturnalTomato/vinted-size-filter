(() => {
  const ITEM_SELECTOR = '[data-testid^="grid-item"]';
  const SUBTITLE_SUFFIX = '--description-subtitle';
  const KID_SIZES = [
    '50', '56', '62', '68', '74', '80', '86', '92', '98',
    '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164', '170', '176'
  ];

  let activeSize = '';
  const sizesSeen = new Set();
  let bar = null;
  let chipRow = null;
  let statusEl = null;
  let loadAllBtn = null;

  function findGridContainer() {
    const first = document.querySelector(ITEM_SELECTOR);
    return first ? first.parentElement : null;
  }

  function extractSize(card) {
    const subtitle = card.querySelector(`[data-testid$="${SUBTITLE_SUFFIX}"]`);
    if (!subtitle) return null;
    const parts = subtitle.textContent.split('·').map((s) => s.trim()).filter(Boolean);
    // Two parts means "{size} · {condition}". One part is condition-only (no size).
    return parts.length >= 2 ? parts[0] : null;
  }

  function sizeMatches(cardSize, target) {
    if (!target) return true;
    const t = target.trim().toLowerCase();
    const raw = cardSize.toLowerCase();
    const tokens = raw.split('/').map((s) => s.trim());
    if (tokens.includes(t)) return true;
    return raw.includes(t);
  }

  function applyFilter() {
    const cards = document.querySelectorAll(ITEM_SELECTOR);
    let shown = 0;
    cards.forEach((card) => {
      const size = extractSize(card);
      if (size) sizesSeen.add(size);
      const match = !activeSize || (size && sizeMatches(size, activeSize));
      card.style.display = match ? '' : 'none';
      if (match) shown += 1;
    });
    renderChips();
    if (statusEl) {
      statusEl.textContent = activeSize
        ? `Showing ${shown} of ${cards.length} loaded items matching "${activeSize}"`
        : `${cards.length} items loaded`;
    }
  }

  function setActiveSize(size) {
    activeSize = size;
    applyFilter();
  }

  function renderChips() {
    if (!chipRow) return;
    chipRow.innerHTML = '';
    const detected = [...sizesSeen].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const sizesToShow = detected.length ? detected : KID_SIZES;
    sizesToShow.forEach((size) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'vsf-chip';
      chip.textContent = size;
      if (size === activeSize) chip.classList.add('vsf-chip--active');
      chip.addEventListener('click', () => {
        setActiveSize(size === activeSize ? '' : size);
        if (input) input.value = activeSize;
      });
      chipRow.appendChild(chip);
    });
  }

  let input = null;

  function buildBar() {
    const container = document.createElement('div');
    container.className = 'vsf-bar';

    const row = document.createElement('div');
    row.className = 'vsf-row';

    const label = document.createElement('span');
    label.className = 'vsf-label';
    label.textContent = 'Filter by size:';

    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g. 104, XL, 36.5';
    input.className = 'vsf-input';
    input.addEventListener('input', () => setActiveSize(input.value));

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'vsf-clear';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
      input.value = '';
      setActiveSize('');
    });

    loadAllBtn = document.createElement('button');
    loadAllBtn.type = 'button';
    loadAllBtn.className = 'vsf-loadall';
    loadAllBtn.textContent = 'Load full closet';
    loadAllBtn.addEventListener('click', loadAllItems);

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(clearBtn);
    row.appendChild(loadAllBtn);

    chipRow = document.createElement('div');
    chipRow.className = 'vsf-chips';

    statusEl = document.createElement('div');
    statusEl.className = 'vsf-status';

    container.appendChild(row);
    container.appendChild(chipRow);
    container.appendChild(statusEl);
    return container;
  }

  async function loadAllItems() {
    loadAllBtn.disabled = true;
    loadAllBtn.textContent = 'Loading...';
    let lastCount = -1;
    let stableRounds = 0;
    const maxRounds = 80;
    for (let round = 0; round < maxRounds && stableRounds < 3; round += 1) {
      const cardsNow = document.querySelectorAll(ITEM_SELECTOR);
      const lastCard = cardsNow[cardsNow.length - 1];
      // scrollIntoView triggers IntersectionObserver-based lazy loaders more
      // reliably than a raw window.scrollTo jump.
      if (lastCard) lastCard.scrollIntoView({ block: 'end' });
      window.scrollTo(0, document.body.scrollHeight);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 700));
      const count = document.querySelectorAll(ITEM_SELECTOR).length;
      stableRounds = count === lastCount ? stableRounds + 1 : 0;
      lastCount = count;
      loadAllBtn.textContent = `Loading... (${count} loaded, ${sizesSeen.size} sizes)`;
      applyFilter();
    }
    loadAllBtn.disabled = false;
    loadAllBtn.textContent = 'Load full closet';
    applyFilter();
  }

  function init() {
    const gridContainer = findGridContainer();
    if (!gridContainer || bar) return;

    bar = buildBar();
    gridContainer.parentElement.insertBefore(bar, gridContainer);
    applyFilter();

    const observer = new MutationObserver(() => applyFilter());
    observer.observe(gridContainer, { childList: true });
  }

  const initObserver = new MutationObserver(() => {
    if (!bar && document.querySelector(ITEM_SELECTOR)) {
      init();
    }
  });
  initObserver.observe(document.body, { childList: true, subtree: true });

  init();
})();
