(function () {
  const TILE_COLOURS = [
    '#ef476f',
    '#f77f00',
    '#06a77d',
    '#118ab2',
    '#7b2cbf',
    '#d81159'
  ];

  const MODE_META = {
    tiles: {
      title: 'Mystery Tile Reveal',
      subtitle: "Hide a picture behind colourful tiles, then click tiles one by one to guess what's hiding!",
      docTitle: 'Mystery Tile Reveal Game'
    },
    spotlight: {
      title: 'Mystery Spotlight Reveal',
      subtitle: "Hide a picture in the dark, shine your magic torch around, and guess what's hiding!",
      docTitle: 'Mystery Spotlight Reveal'
    }
  };

  const defaultMode = document.body.dataset.defaultMode === 'spotlight' ? 'spotlight' : 'tiles';

  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const logoBadge = document.getElementById('logo-badge');
  const logoTiles = document.getElementById('logo-tiles');
  const logoSpotlight = document.getElementById('logo-spotlight');
  const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));

  const setupCard = document.getElementById('setup-card');
  const gameArea = document.getElementById('game-area');
  const dropZone = document.getElementById('drop-zone');
  const chooseFileBtn = document.getElementById('choose-file-btn');
  const fileInput = document.getElementById('file-input');
  const urlForm = document.getElementById('url-form');
  const urlInput = document.getElementById('image-url');
  const errorBanner = document.getElementById('error-banner');
  const dragOverlay = document.getElementById('drag-overlay');

  // Setup mode-specific options
  const setupTileOptions = document.getElementById('setup-tile-options');
  const setupSpotlightOptions = document.getElementById('setup-spotlight-options');
  const sizeButtons = Array.from(document.querySelectorAll('.size-btn'));
  const setupSizeSlider = document.getElementById('setup-spotlight-size');
  const setupSizeValue = document.getElementById('setup-size-value');
  const torchPreviewDots = Array.from(document.querySelectorAll('.torch-preview-dot'));

  // Game toolbars
  const tilesToolbar = document.getElementById('tiles-toolbar');
  const spotlightToolbar = document.getElementById('spotlight-toolbar');
  const progressText = document.getElementById('progress-text');
  const statusBanner = document.getElementById('status-banner');
  const randomBtn = document.getElementById('random-btn');
  const revealAllBtn = document.getElementById('reveal-all-btn');
  const hideAllBtn = document.getElementById('hide-all-btn');
  const gameSizeSlider = document.getElementById('game-spotlight-size');
  const gameSizeValue = document.getElementById('game-size-value');
  const lightsBtn = document.getElementById('lights-btn');
  const fullscreenButtons = Array.from(document.querySelectorAll('.fullscreen-btn'));
  const newPicButtons = Array.from(document.querySelectorAll('.new-pic-btn'));

  // Stage & layers
  const stage = document.getElementById('stage');
  const mysteryImage = document.getElementById('mystery-image');
  const tileGrid = document.getElementById('tile-grid');
  const spotlightLayer = document.getElementById('spotlight-layer');
  const stageHint = document.getElementById('stage-hint');

  let currentMode = defaultMode;
  let gridCols = 8;
  let gridRows = 6;
  let spotlightDiameter = Number(setupSizeSlider.value) || 160;
  let lightsOn = false;
  let currentObjectUrl = null;
  let currentRemoteUrl = null;
  let sourceType = null; // 'local' | 'remote' | null
  let dragDepth = 0;

  function showError(message) {
    errorBanner.textContent = message;
    errorBanner.hidden = false;
  }

  function clearError() {
    errorBanner.textContent = '';
    errorBanner.hidden = true;
  }

  function revokeCurrentObjectUrl() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  }

  function syncUrl() {
    if (sourceType === 'remote' && currentRemoteUrl) {
      const params = new URLSearchParams();
      params.set('image', currentRemoteUrl);
      if (currentMode !== defaultMode) {
        params.set('mode', currentMode);
      }
      history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    } else if (sourceType === 'local') {
      history.replaceState(null, '', window.location.pathname);
    }
  }

  function setSpotlightSize(diameter) {
    spotlightDiameter = Number(diameter) || 160;
    const radius = Math.round(spotlightDiameter / 2);
    stage.style.setProperty('--spot-r', `${radius}px`);
    torchPreviewDots.forEach((dot) => {
      dot.style.setProperty('--preview-size', `${spotlightDiameter}px`);
    });
    setupSizeSlider.value = String(spotlightDiameter);
    gameSizeSlider.value = String(spotlightDiameter);
    setupSizeValue.textContent = `${spotlightDiameter}px`;
    gameSizeValue.textContent = `${spotlightDiameter}px`;
  }

  function setLights(on) {
    lightsOn = on;
    stage.classList.toggle('lights-on', lightsOn);
    if (lightsOn) {
      lightsBtn.textContent = '🔦 Torch Mode';
      lightsBtn.className = 'btn btn-night';
      stageHint.classList.add('hidden');
    } else {
      lightsBtn.textContent = '💡 Turn Lights On';
      lightsBtn.className = 'btn btn-sun';
    }
  }

  function moveSpotlight(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    stage.style.setProperty('--spot-x', `${x}px`);
    stage.style.setProperty('--spot-y', `${y}px`);
    stageHint.classList.add('hidden');
  }

  function centerSpotlight() {
    stage.style.setProperty('--spot-x', '50%');
    stage.style.setProperty('--spot-y', '50%');
  }

  function updateProgress() {
    const tiles = tileGrid.querySelectorAll('.tile');
    const total = tiles.length;
    const revealed = tileGrid.querySelectorAll('.tile.revealed').length;
    progressText.textContent = `${revealed} / ${total} tiles revealed`;

    const allDone = total > 0 && revealed === total;
    tileGrid.classList.toggle('all-revealed', allDone);
    statusBanner.hidden = currentMode !== 'tiles' || !allDone;
    randomBtn.disabled = allDone;
  }

  function buildTiles() {
    tileGrid.innerHTML = '';
    tileGrid.style.setProperty('--cols', gridCols);
    tileGrid.style.setProperty('--rows', gridRows);
    tileGrid.classList.remove('all-revealed');
    statusBanner.hidden = true;

    const total = gridCols * gridRows;
    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      const tileNumber = i + 1;
      const colour = TILE_COLOURS[(row + col) % TILE_COLOURS.length];

      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.style.setProperty('--tile-bg', colour);
      tile.textContent = String(tileNumber);
      tile.setAttribute('aria-label', `Reveal tile ${tileNumber}`);

      tile.addEventListener('click', () => {
        if (tile.classList.contains('revealed')) return;
        tile.classList.add('revealed');
        tile.setAttribute('aria-hidden', 'true');
        tile.tabIndex = -1;
        updateProgress();
      });

      tileGrid.appendChild(tile);
    }

    updateProgress();
  }

  function applyMode(mode) {
    currentMode = mode === 'spotlight' ? 'spotlight' : 'tiles';
    const meta = MODE_META[currentMode];

    heroTitle.textContent = meta.title;
    heroSubtitle.textContent = meta.subtitle;
    document.title = meta.docTitle;

    logoBadge.classList.toggle('spotlight-badge', currentMode === 'spotlight');
    logoTiles.hidden = currentMode !== 'tiles';
    logoSpotlight.hidden = currentMode !== 'spotlight';

    modeButtons.forEach((btn) => {
      const active = btn.dataset.mode === currentMode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Setup mode-specific controls
    setupTileOptions.hidden = currentMode !== 'tiles';
    setupSpotlightOptions.hidden = currentMode !== 'spotlight';

    // Game mode-specific controls & layers
    tilesToolbar.hidden = currentMode !== 'tiles';
    spotlightToolbar.hidden = currentMode !== 'spotlight';
    tileGrid.hidden = currentMode !== 'tiles';
    spotlightLayer.hidden = currentMode !== 'spotlight';
    stage.classList.toggle('spotlight-mode', currentMode === 'spotlight');

    if (currentMode === 'tiles') {
      if (!gameArea.hidden && tileGrid.children.length === 0) {
        buildTiles();
      } else {
        updateProgress();
      }
    } else {
      statusBanner.hidden = true;
      setSpotlightSize(spotlightDiameter);
      if (!gameArea.hidden) {
        setLights(false);
        centerSpotlight();
        stageHint.classList.remove('hidden');
      }
    }

    syncUrl();
  }

  function startGame(src, type, remoteUrl) {
    clearError();
    const loader = new Image();
    loader.referrerPolicy = 'no-referrer';

    loader.onload = () => {
      const naturalW = loader.naturalWidth || 800;
      const naturalH = loader.naturalHeight || 600;
      const ratio = Math.min(Math.max(naturalW / naturalH, 0.5), 2.4);

      stage.style.setProperty('--img-ratio', String(ratio));
      mysteryImage.src = src;

      sourceType = type;
      currentRemoteUrl = type === 'remote' ? remoteUrl : null;

      syncUrl();

      buildTiles();
      setLights(false);
      setSpotlightSize(spotlightDiameter);
      centerSpotlight();
      stageHint.classList.remove('hidden');

      setupCard.hidden = true;
      gameArea.hidden = false;
      applyMode(currentMode);
    };

    loader.onerror = () => {
      if (type === 'local') {
        revokeCurrentObjectUrl();
        showError('Oops! That file could not be opened as a picture. Please try a JPG, PNG, GIF, or WebP image.');
      } else {
        showError('Oops! That picture link could not be loaded. Check the web address, or try saving the picture and dropping it in.');
      }
      setupCard.hidden = false;
      gameArea.hidden = true;
    };

    loader.src = src;
  }

  function handleLocalFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      showError('Please choose an image file (like PNG, JPG, GIF, or WebP).');
      return;
    }
    revokeCurrentObjectUrl();
    currentObjectUrl = URL.createObjectURL(file);
    startGame(currentObjectUrl, 'local');
  }

  function handleRemoteUrl(rawValue) {
    const trimmed = (rawValue || '').trim();
    if (!trimmed) {
      showError('Please paste a picture link first, or drop a picture from your device.');
      return;
    }
    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch {
      showError('That does not look like a full web link. Make sure it starts with https:// or http://.');
      return;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      showError('Please use a web link that starts with https:// or http://.');
      return;
    }
    revokeCurrentObjectUrl();
    startGame(parsed.href, 'remote', parsed.href);
  }

  // Mode switcher clicks
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyMode(btn.dataset.mode);
    });
  });

  // Grid size selector
  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      gridCols = Number(btn.dataset.cols) || 8;
      gridRows = Number(btn.dataset.rows) || 6;
    });
  });

  // Spotlight size sliders
  setupSizeSlider.addEventListener('input', () => setSpotlightSize(setupSizeSlider.value));
  gameSizeSlider.addEventListener('input', () => setSpotlightSize(gameSizeSlider.value));

  // Pointer & touch movement for spotlight
  stage.addEventListener('pointerdown', (e) => {
    if (currentMode !== 'spotlight' || lightsOn) return;
    moveSpotlight(e.clientX, e.clientY);
  });

  stage.addEventListener('pointermove', (e) => {
    if (currentMode !== 'spotlight' || lightsOn) return;
    moveSpotlight(e.clientX, e.clientY);
  });

  // File picker
  chooseFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleLocalFile(fileInput.files[0]);
    }
    fileInput.value = '';
  });

  // Drag and drop (drop zone + whole window)
  function isFileDrag(e) {
    return e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
  }

  window.addEventListener('dragenter', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepth += 1;
    dropZone.classList.add('drag-over');
    if (!gameArea.hidden) {
      dragOverlay.classList.add('visible');
    }
  });

  window.addEventListener('dragover', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  window.addEventListener('dragleave', (e) => {
    if (!isFileDrag(e)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) {
      dropZone.classList.remove('drag-over');
      dragOverlay.classList.remove('visible');
    }
  });

  window.addEventListener('drop', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepth = 0;
    dropZone.classList.remove('drag-over');
    dragOverlay.classList.remove('visible');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      handleLocalFile(file);
    }
  });

  // URL form submit
  urlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleRemoteUrl(urlInput.value);
  });

  // Tile toolbar actions
  randomBtn.addEventListener('click', () => {
    const hiddenTiles = Array.from(tileGrid.querySelectorAll('.tile:not(.revealed)'));
    if (hiddenTiles.length === 0) return;
    const pick = hiddenTiles[Math.floor(Math.random() * hiddenTiles.length)];
    pick.click();
  });

  revealAllBtn.addEventListener('click', () => {
    const hiddenTiles = Array.from(tileGrid.querySelectorAll('.tile:not(.revealed)'));
    hiddenTiles.forEach((tile) => {
      tile.classList.add('revealed');
      tile.setAttribute('aria-hidden', 'true');
      tile.tabIndex = -1;
    });
    updateProgress();
  });

  hideAllBtn.addEventListener('click', () => {
    buildTiles();
  });

  // Spotlight toolbar actions
  lightsBtn.addEventListener('click', () => {
    setLights(!lightsOn);
  });

  // Full screen mode (native Fullscreen API with CSS full-viewport fallback)
  let fallbackFullscreen = false;

  function isFullscreenActive() {
    return document.fullscreenElement === gameArea || fallbackFullscreen;
  }

  function syncFullscreenUi() {
    const active = isFullscreenActive();
    gameArea.classList.toggle('is-fullscreen', active);
    fullscreenButtons.forEach((btn) => {
      btn.textContent = active ? '✕ Exit Full Screen' : '⛶ Full Screen';
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function enterFullscreen() {
    if (gameArea.requestFullscreen) {
      gameArea.requestFullscreen().then(() => {
        fallbackFullscreen = false;
        syncFullscreenUi();
      }).catch(() => {
        fallbackFullscreen = true;
        syncFullscreenUi();
      });
    } else {
      fallbackFullscreen = true;
      syncFullscreenUi();
    }
  }

  function exitFullscreen() {
    fallbackFullscreen = false;
    if (document.fullscreenElement === gameArea && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {}).finally(syncFullscreenUi);
    } else {
      syncFullscreenUi();
    }
  }

  fullscreenButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isFullscreenActive()) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    });
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement !== gameArea) {
      fallbackFullscreen = false;
    }
    syncFullscreenUi();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fallbackFullscreen) {
      exitFullscreen();
    }
  });

  // New picture buttons
  newPicButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isFullscreenActive()) {
        exitFullscreen();
      }
      revokeCurrentObjectUrl();
      sourceType = null;
      currentRemoteUrl = null;
      gameArea.hidden = true;
      setupCard.hidden = false;
      mysteryImage.removeAttribute('src');
      tileGrid.innerHTML = '';
      clearError();
    });
  });

  // Warn before leaving/refreshing when a local image is active
  window.addEventListener('beforeunload', (e) => {
    if (sourceType === 'local' && !gameArea.hidden) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Initialise mode & check URL parameters
  setSpotlightSize(spotlightDiameter);
  const params = new URLSearchParams(window.location.search);
  const requestedMode = params.get('mode');
  if (requestedMode === 'tiles' || requestedMode === 'spotlight') {
    currentMode = requestedMode;
  }
  applyMode(currentMode);

  const initialImage = params.get('image');
  if (initialImage) {
    urlInput.value = initialImage;
    handleRemoteUrl(initialImage);
  }
})();
