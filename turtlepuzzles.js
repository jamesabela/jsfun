/**
 * Turtle Quest - Main Game Controller & Canvas Renderer
 */
(function () {
  'use strict';

  const { WORLDS, LEVELS } = window.TurtleLevels;
  const Engine = window.TurtleEngine;

  const STORAGE_KEY = 'jsfun.turtlequest.v1';

  const ACHIEVEMENTS = [
    { id: 'first_steps', title: 'First Steps', icon: '👣', desc: 'Complete Level 1.' },
    { id: 'maze_master', title: 'Maze Master', icon: '🧭', desc: 'Complete all 8 levels in World 1.' },
    { id: 'loop_legend', title: 'Loop Legend', icon: '🔁', desc: 'Complete all 8 levels in World 2.' },
    { id: 'code_golfer', title: 'Code Golfer', icon: '⛳', desc: 'Earn 3 stars on any level from Level 9+.' },
    { id: 'debug_detective', title: 'Debugging Detective', icon: '🔍', desc: 'Fix a collision and complete the level.' },
    { id: 'turtle_artist', title: 'Turtle Artist', icon: '🎨', desc: 'Complete all 8 levels in World 3.' },
    { id: 'function_master', title: 'Function Master', icon: '🧩', desc: 'Complete a level using a custom function.' },
    { id: 'grandmaster', title: 'Turtle Grandmaster', icon: '👑', desc: 'Complete Level 40.' }
  ];

  const TURTLE_SKINS = [
    { id: 'classic', name: 'Classic Turtle', icon: '🐢', minStars: 0, body: '#22c55e', shell: '#15803d' },
    { id: 'sea', name: 'Ocean Explorer', icon: '🌊', minStars: 12, body: '#06b6d4', shell: '#0e7490' },
    { id: 'crystal', name: 'Crystal Dragon', icon: '💎', minStars: 30, body: '#a855f7', shell: '#6b21a8' },
    { id: 'cyber', name: 'Cyber Bot', icon: '🤖', minStars: 55, body: '#3b82f6', shell: '#1e3a8a' },
    { id: 'golden', name: 'Golden Knight', icon: '👑', minStars: 85, body: '#facc15', shell: '#b45309' }
  ];

  const WORLD_THEMES = {
    training: { bg: '#f0fdf4', grid: '#dcfce7', wall: '#64748b', wallEdge: '#475569' },
    forest: { bg: '#ecfdf5', grid: '#d1fae5', wall: '#166534', wallEdge: '#14532d' },
    studio: { bg: '#fdf4ff', grid: '#f5d0fe', wall: '#7e22ce', wallEdge: '#581c87' },
    caves: { bg: '#0f172a', grid: '#1e293b', wall: '#38bdf8', wallEdge: '#0284c7' },
    kingdom: { bg: '#1e1b4b', grid: '#312e81', wall: '#a855f7', wallEdge: '#7e22ce' }
  };

  // --- Persistent State ---
  let saveState = loadSaveState();
  let currentLevelIdx = Math.max(0, Math.min(LEVELS.length - 1, (saveState.currentLevel || 1) - 1));

  // --- Editor & Execution State ---
  let codeLines = ['import turtle'];
  let selectedLineIdx = -1;
  let blockStack = []; // [{ type: 'for'|'def', varName?: string, name?: string }]
  let undoStack = [];
  let redoStack = [];
  let textMode = false;
  let hintTier = 0;
  let hadCollisionThisLevel = false;

  // --- Runtime Animation State ---
  let simState = null;
  let animTimer = null;
  let isRunning = false;
  let isPaused = false;
  let stepQueue = [];
  let stepCursor = 0;
  let currentExecLine = -1;
  let errorExecLine = -1;
  let collisionPoint = null;
  let particles = [];

  // --- DOM Elements ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const els = {
    worldPill: document.getElementById('worldPill'),
    worldThumb: document.getElementById('worldThumb'),
    progressPill: document.getElementById('progressPill'),
    levelTitle: document.getElementById('levelTitle'),
    levelObjective: document.getElementById('levelObjective'),
    statLines: document.getElementById('statLines'),
    statTarget: document.getElementById('statTarget'),
    statOps: document.getElementById('statOps'),
    statGems: document.getElementById('statGems'),
    statBest: document.getElementById('statBest'),
    statStars: document.getElementById('statStars'),
    feedback: document.getElementById('feedbackBox'),
    contextBadge: document.getElementById('contextBadge'),
    paramBar: document.getElementById('paramBar'),
    paramDist: document.getElementById('paramDist'),
    paramAngle: document.getElementById('paramAngle'),
    paramRepeat: document.getElementById('paramRepeat'),
    paramColor: document.getElementById('paramColor'),
    paramFnName: document.getElementById('paramFnName'),
    codeContainer: document.getElementById('codeContainer'),
    textEditor: document.getElementById('textEditor'),
    btnTextMode: document.getElementById('btnTextMode'),
    speedRange: document.getElementById('speedRange'),
    btnRun: document.getElementById('btnRun'),
    btnStep: document.getElementById('btnStep'),
    btnPause: document.getElementById('btnPause'),
    btnStop: document.getElementById('btnStop'),
    btnResetTurtle: document.getElementById('btnResetTurtle'),
    btnUndo: document.getElementById('btnUndo'),
    btnRedo: document.getElementById('btnRedo'),
    btnClear: document.getElementById('btnClear'),
    btnCopy: document.getElementById('btnCopy'),
    btnHint: document.getElementById('btnHint'),
    btnPrevLevel: document.getElementById('btnPrevLevel'),
    btnNextLevel: document.getElementById('btnNextLevel'),
    btnTheme: document.getElementById('btnTheme'),
    btnMute: document.getElementById('btnMute'),
    btnWorldMap: document.getElementById('btnWorldMap'),
    btnHelp: document.getElementById('btnHelp'),
    btnLineUp: document.getElementById('btnLineUp'),
    btnLineDown: document.getElementById('btnLineDown'),
    btnLineEdit: document.getElementById('btnLineEdit'),
    btnLineDelete: document.getElementById('btnLineDelete'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalFooter: document.getElementById('modalFooter'),
    btnModalClose: document.getElementById('btnModalClose')
  };

  // --- Sound Effects (Web Audio API, zero external assets) ---
  let audioCtx = null;
  function playTone(freq, duration = 0.08, type = 'sine', vol = 0.08) {
    if (saveState.muted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) { /* ignore audio restrictions */ }
  }

  function playWinSound() {
    playTone(523.25, 0.1, 'triangle', 0.1);
    setTimeout(() => playTone(659.25, 0.1, 'triangle', 0.1), 90);
    setTimeout(() => playTone(783.99, 0.18, 'triangle', 0.12), 180);
  }

  // --- Save / Load ---
  function loadSaveState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          currentLevel: parsed.currentLevel || 1,
          levels: parsed.levels || {},
          achievements: parsed.achievements || [],
          skin: parsed.skin || 'classic',
          theme: parsed.theme || 'light',
          muted: Boolean(parsed.muted),
          seenIntros: parsed.seenIntros || [],
          seenHelp: Boolean(parsed.seenHelp)
        };
      }
    } catch (_) { /* ignore storage errors */ }
    return {
      currentLevel: 1,
      levels: {},
      achievements: [],
      skin: 'classic',
      theme: 'light',
      muted: false,
      seenIntros: [],
      seenHelp: false
    };
  }

  function persistSaveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (_) { /* ignore */ }
  }

  function totalStarsEarned() {
    return Object.values(saveState.levels).reduce((sum, l) => sum + (l.stars || 0), 0);
  }

  function completedCount() {
    return Object.values(saveState.levels).filter(l => (l.stars || 0) > 0).length;
  }

  function unlockAchievement(id) {
    if (!saveState.achievements.includes(id)) {
      saveState.achievements.push(id);
      persistSaveState();
    }
  }

  // --- Theme & Mute ---
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', saveState.theme);
    els.btnTheme.textContent = saveState.theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    renderCanvas();
  }

  function applyMute() {
    els.btnMute.textContent = saveState.muted ? '🔇 Muted' : '🔊 Sound';
  }

  // --- Level Loading ---
  function getLevel() {
    return LEVELS[currentLevelIdx];
  }

  function getWorld(worldId) {
    return WORLDS.find(w => w.id === worldId) || WORLDS[0];
  }

  function loadLevel(idx, showWorldIntro = true) {
    stopExecution();
    currentLevelIdx = Math.max(0, Math.min(LEVELS.length - 1, idx));
    const level = getLevel();
    const world = getWorld(level.world);
    saveState.currentLevel = level.id;
    persistSaveState();

    hintTier = 0;
    hadCollisionThisLevel = false;
    undoStack = [];
    redoStack = [];
    blockStack = [];
    selectedLineIdx = -1;

    // Restore saved code for this level if any, else starter
    const saved = saveState.levels[level.id];
    const initialCode = (saved && saved.lastCode) ? saved.lastCode : 'import turtle';
    codeLines = initialCode.split(/\r?\n/);
    if (textMode && level.id < 33) {
      textMode = false;
    }

    els.worldPill.textContent = `${world.badge} World ${world.id}: ${world.name}`;
    if (els.worldThumb && world.image) {
      els.worldThumb.src = world.image;
      els.worldThumb.alt = `${world.name} artwork`;
    }
    els.levelTitle.textContent = `Level ${level.id}: ${level.title}`;
    els.levelObjective.textContent = level.objective;
    els.btnPrevLevel.disabled = currentLevelIdx === 0;
    els.btnNextLevel.disabled = currentLevelIdx === LEVELS.length - 1;
    els.btnTextMode.style.display = level.id >= 25 ? 'inline-flex' : 'none';

    configureCommandButtons(level);
    resetSimulation();
    syncEditorUI();
    updateStatsUI();
    clearFeedback();

    if (showWorldIntro && !saveState.seenHelp) {
      saveState.seenHelp = true;
      if (!saveState.seenIntros.includes(world.id)) {
        saveState.seenIntros.push(world.id);
      }
      persistSaveState();
      showHelpModal();
    } else if (showWorldIntro && !saveState.seenIntros.includes(world.id)) {
      saveState.seenIntros.push(world.id);
      persistSaveState();
      showIntroModal(world);
    }
  }

  function configureCommandButtons(level) {
    const avail = new Set(level.availableCommands);
    document.querySelectorAll('.cmd-btn[data-cmd]').forEach(btn => {
      const cmd = btn.getAttribute('data-cmd');
      btn.classList.toggle('hidden', !avail.has(cmd));
    });

    const params = level.allowedParams || {};
    fillSelect(els.paramDist, params.distances || [40], v => `${v} px`);
    fillSelect(els.paramAngle, params.angles || [90], v => `${v}°`);
    fillSelect(els.paramRepeat, params.repeats || [2, 3, 4, 5, 6, 8], v => `${v}×`);
    fillSelect(els.paramColor, params.colors || ['blue', 'red', 'green', 'purple', 'gold', 'cyan'], v => v);

    els.paramDist.parentElement.style.display = (params.distances && params.distances.length > 1) ? 'flex' : 'none';
    els.paramAngle.parentElement.style.display = (params.angles && params.angles.length > 1) ? 'flex' : 'none';
    els.paramRepeat.parentElement.style.display = avail.has('repeat') ? 'flex' : 'none';
    els.paramColor.parentElement.style.display = avail.has('color') ? 'flex' : 'none';
    els.paramFnName.parentElement.style.display = avail.has('def_fn') ? 'flex' : 'none';

    updateCommandPreviews();
  }

  function fillSelect(selectEl, values, labelFn) {
    const prev = selectEl.value;
    selectEl.innerHTML = '';
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = labelFn(v);
      selectEl.appendChild(opt);
    });
    if (values.map(String).includes(prev)) {
      selectEl.value = prev;
    }
  }

  function updateCommandPreviews() {
    const d = els.paramDist.value || 40;
    const a = els.paramAngle.value || 90;
    const r = els.paramRepeat.value || 4;
    const c = els.paramColor.value || 'blue';
    const fn = sanitizeFnName(els.paramFnName.value || 'my_function');

    const map = {
      forward: `turtle.forward(${d})`,
      backward: `turtle.backward(${d})`,
      left: `turtle.left(${a})`,
      right: `turtle.right(${a})`,
      repeat: `for ${nextLoopVar()} in range(${r}):`,
      color: `turtle.pencolor("${c}")`,
      def_fn: `def ${fn}():`,
      call_fn: `${fn}()`
    };

    Object.entries(map).forEach(([cmd, py]) => {
      const el = document.querySelector(`.cmd-btn[data-cmd="${cmd}"] .cmd-py`);
      if (el) el.textContent = py;
    });
  }

  function sanitizeFnName(name) {
    const cleaned = String(name || 'my_function').trim().replace(/[^a-zA-Z0-9_]/g, '_');
    return /^[a-zA-Z_]/.test(cleaned) ? cleaned : 'my_function';
  }

  function nextLoopVar() {
    const used = new Set(blockStack.filter(b => b.type === 'for').map(b => b.varName));
    const candidates = ['i', 'j', 'k', 'm', 'n'];
    return candidates.find(v => !used.has(v)) || `i${used.size + 1}`;
  }

  // --- Code Editing & Button Insertion ---
  function pushUndo() {
    undoStack.push({
      lines: [...codeLines],
      stack: JSON.parse(JSON.stringify(blockStack))
    });
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
  }

  function getCurrentIndent() {
    return '    '.repeat(blockStack.length);
  }

  function insertCodeLine(lineText) {
    if (textMode) {
      els.textEditor.value += (els.textEditor.value.endsWith('\n') ? '' : '\n') + getCurrentIndent() + lineText;
      codeLines = els.textEditor.value.split(/\r?\n/);
      updateStatsUI();
      return;
    }
    pushUndo();
    const fullLine = getCurrentIndent() + lineText;
    if (selectedLineIdx >= 0 && selectedLineIdx < codeLines.length) {
      // Match indentation of selected line if inserting at a specific spot
      const m = codeLines[selectedLineIdx].match(/^(\s*)/);
      const indent = m ? m[1] : getCurrentIndent();
      codeLines.splice(selectedLineIdx + 1, 0, indent + lineText);
      selectedLineIdx++;
    } else {
      codeLines.push(fullLine);
    }
    playTone(440, 0.04, 'sine', 0.04);
    syncEditorUI();
    updateStatsUI();
    checkPatternSuggestion();
  }

  function handleCommandButton(cmd) {
    const d = els.paramDist.value || 40;
    const a = els.paramAngle.value || 90;
    const r = els.paramRepeat.value || 4;
    const c = els.paramColor.value || 'blue';
    const fn = sanitizeFnName(els.paramFnName.value || 'my_function');

    if (cmd === 'forward') insertCodeLine(`turtle.forward(${d})`);
    else if (cmd === 'backward') insertCodeLine(`turtle.backward(${d})`);
    else if (cmd === 'left') insertCodeLine(`turtle.left(${a})`);
    else if (cmd === 'right') insertCodeLine(`turtle.right(${a})`);
    else if (cmd === 'pendown') insertCodeLine('turtle.pendown()');
    else if (cmd === 'penup') insertCodeLine('turtle.penup()');
    else if (cmd === 'color') insertCodeLine(`turtle.pencolor("${c}")`);
    else if (cmd === 'call_fn') insertCodeLine(`${fn}()`);
    else if (cmd === 'repeat') {
      const v = nextLoopVar();
      insertCodeLine(`for ${v} in range(${r}):`);
      blockStack.push({ type: 'for', varName: v });
      syncEditorUI();
      updateCommandPreviews();
    } else if (cmd === 'end_repeat') {
      const idx = findLastIndex(blockStack, b => b.type === 'for');
      if (idx !== -1) {
        blockStack.splice(idx, 1);
        selectedLineIdx = -1;
        syncEditorUI();
        updateCommandPreviews();
      } else {
        showFeedback('You are not inside a Repeat loop.', 'info');
      }
    } else if (cmd === 'def_fn') {
      insertCodeLine(`def ${fn}():`);
      blockStack.push({ type: 'def', name: fn });
      syncEditorUI();
    } else if (cmd === 'end_fn') {
      const idx = findLastIndex(blockStack, b => b.type === 'def');
      if (idx !== -1) {
        blockStack.splice(idx, 1);
        selectedLineIdx = -1;
        syncEditorUI();
      } else {
        showFeedback('You are not inside a function definition.', 'info');
      }
    }
  }

  function findLastIndex(arr, pred) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (pred(arr[i])) return i;
    }
    return -1;
  }

  function checkPatternSuggestion() {
    const level = getLevel();
    if (level.id < 9) return;
    const pat = Engine.detectRepeatedSequence(getCodeString());
    if (pat) {
      showFeedback(
        `💡 Tip: You repeated ${pat.pattern.length} command(s) ${pat.repeats} times in a row. Can you replace these repeated instructions with a loop?`,
        'hint'
      );
    }
  }

  function getCodeString() {
    if (textMode) return els.textEditor.value;
    return codeLines.join('\n');
  }

  function syncEditorUI() {
    // Update context badge
    if (blockStack.length === 0) {
      els.contextBadge.textContent = '📍 Top level (no active loop or function)';
    } else {
      const desc = blockStack.map(b => b.type === 'for' ? `for ${b.varName}` : `def ${b.name}()`).join(' → ');
      els.contextBadge.textContent = `↳ Indented inside: ${desc}`;
    }

    if (textMode) {
      els.codeContainer.style.display = 'none';
      els.textEditor.style.display = 'block';
      els.textEditor.value = codeLines.join('\n');
      els.btnTextMode.textContent = '🎛️ Button Mode';
    } else {
      els.textEditor.style.display = 'none';
      els.codeContainer.style.display = 'block';
      els.btnTextMode.textContent = '⌨️ Text Mode';
      renderHighlightedLines();
    }

    const hasSel = !textMode && selectedLineIdx > 0 && selectedLineIdx < codeLines.length;
    els.btnLineUp.disabled = !hasSel || selectedLineIdx <= 1;
    els.btnLineDown.disabled = !hasSel || selectedLineIdx >= codeLines.length - 1;
    els.btnLineEdit.disabled = !hasSel;
    els.btnLineDelete.disabled = !hasSel;
  }

  function renderHighlightedLines() {
    els.codeContainer.innerHTML = '';
    codeLines.forEach((line, idx) => {
      const row = document.createElement('div');
      row.className = 'tq-code-line';
      const lineNo = idx + 1;
      if (idx === selectedLineIdx) row.classList.add('selected');
      if (lineNo === currentExecLine) row.classList.add('executing');
      if (lineNo === errorExecLine) row.classList.add('error-line');

      const numEl = document.createElement('span');
      numEl.className = 'tq-line-num';
      numEl.textContent = String(lineNo);

      const codeEl = document.createElement('span');
      codeEl.className = 'tq-line-code';
      codeEl.innerHTML = highlightPythonLine(line);

      row.appendChild(numEl);
      row.appendChild(codeEl);
      row.addEventListener('click', () => {
        selectedLineIdx = (selectedLineIdx === idx) ? -1 : idx;
        syncEditorUI();
      });
      els.codeContainer.appendChild(row);
    });
  }

  function highlightPythonLine(line) {
    let esc = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Highlight comments
    esc = esc.replace(/(#.*)$/, '<span class="tok-com">$1</span>');
    // Strings
    esc = esc.replace(/("[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>');
    // Keywords
    esc = esc.replace(/\b(import|for|in|range|def|pass)\b/g, '<span class="tok-kw">$1</span>');
    // Turtle methods
    esc = esc.replace(/\b(turtle\.\w+)/g, '<span class="tok-fn">$1</span>');
    // Numbers
    esc = esc.replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
    return esc;
  }

  // --- Simulation & Step Execution ---
  function resetSimulation() {
    const level = getLevel();
    simState = {
      x: level.start.x,
      y: level.start.y,
      heading: level.start.heading,
      penDown: level.start.penDown !== undefined ? level.start.penDown : true,
      color: level.start.color || 'blue',
      width: 3,
      drawnLines: [],
      gems: (level.gems || []).map(g => ({ ...g, collected: false })),
      ops: 0
    };
    currentExecLine = -1;
    errorExecLine = -1;
    collisionPoint = null;
    particles = [];
    renderCanvas();
    updateStatsUI();
  }

  function prepareExecution() {
    const level = getLevel();
    const code = getCodeString();
    const metrics = Engine.analyzeCodeMetrics(code);
    if (metrics.hasMultiStatementLine) {
      showFeedback('Please put only one Python command per line (no semicolons).', 'error');
      return false;
    }

    let ast, steps;
    try {
      ast = Engine.parsePython(code);
      steps = Engine.compileSteps(ast);
    } catch (err) {
      errorExecLine = err.line || 1;
      syncEditorUI();
      showFeedback(err.message || 'Syntax error in your Python code.', 'error');
      return false;
    }

    if (steps.length === 0) {
      showFeedback('Add some Turtle commands first, then press Run!', 'info');
      return false;
    }

    resetSimulation();
    stepQueue = steps;
    stepCursor = 0;
    clearFeedback();
    return true;
  }

  function runProgram() {
    if (isRunning && isPaused) {
      isPaused = false;
      els.btnPause.textContent = '⏸ Pause';
      scheduleNextStep();
      return;
    }
    if (isRunning) return;
    if (!prepareExecution()) return;

    isRunning = true;
    isPaused = false;
    updateRunButtons();
    scheduleNextStep();
  }

  function stepOnce() {
    if (!isRunning) {
      if (!prepareExecution()) return;
      isRunning = true;
      isPaused = true;
      els.btnPause.textContent = '▶ Resume';
      updateRunButtons();
    }
    executeSingleStep();
  }

  function pauseProgram() {
    if (!isRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
      clearTimeout(animTimer);
      els.btnPause.textContent = '▶ Resume';
    } else {
      els.btnPause.textContent = '⏸ Pause';
      scheduleNextStep();
    }
  }

  function stopExecution() {
    clearTimeout(animTimer);
    isRunning = false;
    isPaused = false;
    els.btnPause.textContent = '⏸ Pause';
    currentExecLine = -1;
    updateRunButtons();
    if (!textMode) renderHighlightedLines();
  }

  function scheduleNextStep() {
    if (!isRunning || isPaused) return;
    const speedVal = Number(els.speedRange.value || 3);
    const delays = { 1: 480, 2: 260, 3: 140, 4: 55, 5: 12 };
    const delay = delays[speedVal] || 140;
    animTimer = setTimeout(() => {
      const cont = executeSingleStep();
      if (cont && isRunning && !isPaused) {
        scheduleNextStep();
      }
    }, delay);
  }

  function executeSingleStep() {
    const level = getLevel();
    if (stepCursor >= stepQueue.length) {
      finishExecution();
      return false;
    }

    const st = stepQueue[stepCursor++];
    currentExecLine = st.line;
    if (!textMode) renderHighlightedLines();

    if (st.kind === 'noop') {
      return true;
    }

    simState.ops++;
    if (st.kind === 'turn') {
      simState.heading = ((simState.heading + st.angle) % 360 + 360) % 360;
      playTone(320, 0.04, 'sine', 0.03);
    } else if (st.kind === 'pen') {
      simState.penDown = st.down;
    } else if (st.kind === 'color') {
      simState.color = st.color;
    } else if (st.kind === 'width') {
      simState.width = st.width;
    } else if (st.kind === 'move') {
      const rad = (simState.heading * Math.PI) / 180;
      const nx = simState.x + st.dist * Math.cos(rad);
      const ny = simState.y + st.dist * Math.sin(rad);

      const col = Engine.checkWallCollision(simState.x, simState.y, nx, ny, level);
      if (col.hit) {
        simState.x = col.hitX;
        simState.y = col.hitY;
        collisionPoint = { x: col.hitX, y: col.hitY };
        errorExecLine = st.line;
        hadCollisionThisLevel = true;
        playTone(140, 0.2, 'sawtooth', 0.1);
        renderCanvas();
        updateStatsUI();
        stopExecution();
        showFeedback(
          `💥 Oops! Your turtle bumped into a ${col.reason} on line ${st.line}. Fix line ${st.line} and try again!`,
          'error'
        );
        return false;
      }

      for (let g = 0; g < simState.gems.length; g++) {
        if (!simState.gems[g].collected &&
          Engine.distPointToSegment(simState.gems[g].x, simState.gems[g].y, simState.x, simState.y, nx, ny) <= 20) {
          simState.gems[g].collected = true;
          playTone(880, 0.09, 'triangle', 0.08);
          spawnSparkles(simState.gems[g].x, simState.gems[g].y, '#38bdf8', 10);
        }
      }

      if (simState.penDown && Math.abs(st.dist) > 0.01) {
        simState.drawnLines.push({
          x1: simState.x,
          y1: simState.y,
          x2: nx,
          y2: ny,
          color: simState.color,
          width: simState.width
        });
      }

      simState.x = nx;
      simState.y = ny;
      playTone(260, 0.03, 'sine', 0.025);
    }

    renderCanvas();
    updateStatsUI();
    return true;
  }

  function finishExecution() {
    stopExecution();
    const level = getLevel();
    const code = getCodeString();
    const metrics = Engine.analyzeCodeMetrics(code);

    const gemsCollected = simState.gems.filter(g => g.collected).length;
    const allGems = gemsCollected === simState.gems.length;
    const reachedFlag = !level.flag || Math.hypot(simState.x - level.flag.x, simState.y - level.flag.y) <= 20;
    const drawEval = level.targetDrawing
      ? Engine.evaluateDrawing(simState.drawnLines, level.targetDrawing, Boolean(level.requireColors))
      : { passed: true, coverage: 1, accuracy: 1 };

    if (allGems && reachedFlag && drawEval.passed) {
      let stars = 1;
      if (metrics.meaningfulLines <= level.targetLines) stars = 2;
      if (metrics.meaningfulLines <= level.threeStarLines) stars = 3;

      const prev = saveState.levels[level.id] || { stars: 0, bestLines: Infinity };
      const improved = stars > prev.stars || metrics.meaningfulLines < prev.bestLines;
      saveState.levels[level.id] = {
        stars: Math.max(prev.stars, stars),
        bestLines: Math.min(prev.bestLines || Infinity, metrics.meaningfulLines),
        lastCode: code
      };
      persistSaveState();

      // Check achievements
      if (level.id === 1) unlockAchievement('first_steps');
      if (hadCollisionThisLevel) unlockAchievement('debug_detective');
      if (level.id >= 9 && stars === 3) unlockAchievement('code_golfer');
      if (/\bdef\s+\w+\(\):/.test(code)) unlockAchievement('function_master');
      if (level.id === 40) unlockAchievement('grandmaster');
      if ([1,2,3,4,5,6,7,8].every(id => (saveState.levels[id]?.stars || 0) > 0)) unlockAchievement('maze_master');
      if ([9,10,11,12,13,14,15,16].every(id => (saveState.levels[id]?.stars || 0) > 0)) unlockAchievement('loop_legend');
      if ([17,18,19,20,21,22,23,24].every(id => (saveState.levels[id]?.stars || 0) > 0)) unlockAchievement('turtle_artist');

      playWinSound();
      spawnSparkles(simState.x, simState.y, '#facc15', 24);
      renderCanvas();
      updateStatsUI();
      showCompletionModal(level, stars, metrics.meaningfulLines, improved);
    } else {
      const reasons = [];
      if (!allGems) reasons.push(`collect all gems (${gemsCollected}/${simState.gems.length})`);
      if (!reachedFlag) reasons.push('reach the finish flag');
      if (!drawEval.passed) {
        const pct = Math.round(drawEval.coverage * 100);
        reasons.push(`match the target drawing (${pct}% covered)`);
      }
      showFeedback(`Almost there! You still need to: ${reasons.join(', ')}.`, 'info');
    }
  }

  function updateRunButtons() {
    els.btnRun.disabled = isRunning && !isPaused;
    els.btnPause.disabled = !isRunning;
    els.btnStop.disabled = !isRunning;
  }

  function updateStatsUI() {
    const level = getLevel();
    const metrics = Engine.analyzeCodeMetrics(getCodeString());
    const saved = saveState.levels[level.id];

    els.statLines.textContent = String(metrics.meaningfulLines);
    els.statTarget.textContent = `${level.threeStarLines} (⭐⭐⭐)`;
    els.statOps.textContent = String(simState ? simState.ops : 0);
    els.statGems.textContent = simState && simState.gems.length > 0
      ? `${simState.gems.filter(g => g.collected).length}/${simState.gems.length}`
      : '—';
    els.statBest.textContent = saved && saved.bestLines < Infinity ? `${saved.bestLines} lines` : '—';
    els.statStars.textContent = saved ? '⭐'.repeat(saved.stars) + '☆'.repeat(3 - saved.stars) : '☆☆☆';
    els.progressPill.textContent = `⭐ ${totalStarsEarned()}/120 • ${completedCount()}/40`;
  }

  function showFeedback(msg, kind = 'info') {
    els.feedback.textContent = msg;
    els.feedback.className = `tq-feedback visible ${kind}`;
  }

  function clearFeedback() {
    els.feedback.className = 'tq-feedback';
    els.feedback.textContent = '';
  }

  // --- Canvas Rendering ---
  function toCanvasXY(tx, ty) {
    const w = canvas.width;
    const h = canvas.height;
    return { x: w / 2 + tx, y: h / 2 - ty };
  }

  function spawnSparkles(tx, ty, color, count) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 1 + Math.random() * 2.5;
      particles.push({
        x: tx, y: ty,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 28,
        color
      });
    }
    requestAnimationFrame(tickParticles);
  }

  function tickParticles() {
    if (particles.length === 0) return;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);
    renderCanvas();
    if (particles.length > 0) requestAnimationFrame(tickParticles);
  }

  function renderCanvas() {
    const level = getLevel();
    const world = getWorld(level.world);
    const theme = WORLD_THEMES[world.theme] || WORLD_THEMES.training;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    // Grid lines every 40px
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= w; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy <= h; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // Target drawing faint guide
    if (level.targetDrawing) {
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 4;
      level.targetDrawing.forEach(seg => {
        const p1 = toCanvasXY(seg.x1, seg.y1);
        const p2 = toCanvasXY(seg.x2, seg.y2);
        ctx.strokeStyle = level.requireColors && seg.color
          ? seg.color
          : 'rgba(100, 116, 139, 0.35)';
        ctx.globalAlpha = level.requireColors ? 0.35 : 0.7;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.restore();
    }

    // Maze walls (bevelled 3D-style blocks)
    if (level.walls) {
      level.walls.forEach(wall => {
        const topLeft = toCanvasXY(wall.x, wall.y + wall.h);
        ctx.fillStyle = theme.wall;
        ctx.fillRect(topLeft.x, topLeft.y, wall.w, wall.h);
        // Top-left highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fillRect(topLeft.x, topLeft.y, wall.w, 4);
        ctx.fillRect(topLeft.x, topLeft.y, 4, wall.h);
        // Bottom-right shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.fillRect(topLeft.x, topLeft.y + wall.h - 4, wall.w, 4);
        ctx.fillRect(topLeft.x + wall.w - 4, topLeft.y, 4, wall.h);
        ctx.strokeStyle = theme.wallEdge;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(topLeft.x, topLeft.y, wall.w, wall.h);
      });
    }

    // Drawn turtle lines
    if (simState) {
      simState.drawnLines.forEach(line => {
        const p1 = toCanvasXY(line.x1, line.y1);
        const p2 = toCanvasXY(line.x2, line.y2);
        ctx.strokeStyle = line.color || 'blue';
        ctx.lineWidth = line.width || 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
    }

    // Finish Flag
    if (level.flag) {
      const fp = toCanvasXY(level.flag.x, level.flag.y);
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = '21px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏁', fp.x, fp.y);
      ctx.restore();
    }

    // Collectable Gems
    if (simState && simState.gems) {
      simState.gems.forEach(gem => {
        if (gem.collected) return;
        const gp = toCanvasXY(gem.x, gem.y);
        ctx.save();
        ctx.translate(gp.x, gp.y);
        // Crisp faceted diamond gem
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#0e7490';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(10, -2);
        ctx.lineTo(0, 11);
        ctx.lineTo(-10, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Highlight facet
        ctx.fillStyle = '#a5f3fc';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(5, -2);
        ctx.lineTo(0, 2);
        ctx.lineTo(-5, -2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }

    // Collision Marker
    if (collisionPoint) {
      const cp = toCanvasXY(collisionPoint.x, collisionPoint.y);
      ctx.save();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💥', cp.x, cp.y);
      ctx.restore();
    }

    // Particles
    particles.forEach(p => {
      const pp = toCanvasXY(p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 28);
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Turtle Avatar
    if (simState) {
      drawTurtleSprite(simState.x, simState.y, simState.heading);
    }
  }

  function drawTurtleSprite(tx, ty, headingDeg) {
    const pos = toCanvasXY(tx, ty);
    const skin = TURTLE_SKINS.find(s => s.id === saveState.skin) || TURTLE_SKINS[0];
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate((-headingDeg * Math.PI) / 180);

    // Legs
    ctx.fillStyle = skin.body;
    [[-6, -10], [6, -10], [-6, 10], [6, 10]].forEach(([lx, ly]) => {
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Head
    ctx.beginPath();
    ctx.arc(13, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(15, -2.2, 1.3, 0, Math.PI * 2);
    ctx.arc(15, 2.2, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Shell
    ctx.fillStyle = skin.shell;
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Direction chevron on shell
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-3, -4);
    ctx.lineTo(-3, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- Modals ---
  function openModal(title, bodyHtml, footerButtons = []) {
    els.modalTitle.textContent = title;
    els.modalBody.innerHTML = bodyHtml;
    els.modalFooter.innerHTML = '';
    footerButtons.forEach(cfg => {
      const b = document.createElement('button');
      b.className = `btn ${cfg.cls || ''}`;
      b.textContent = cfg.label;
      b.addEventListener('click', cfg.onClick);
      els.modalFooter.appendChild(b);
    });
    els.modalBackdrop.classList.add('open');
  }

  function closeModal() {
    els.modalBackdrop.classList.remove('open');
  }

  let helpSlideIdx = 0;
  let helpGridView = false;

  function showHelpModal(startIdx = 0) {
    helpSlideIdx = startIdx;
    helpGridView = false;
    renderHelpModal();
  }

  function renderHelpModal() {
    const steps = [
      {
        img: 'images/turtlequest/help-step-1.jpg',
        badge: 'Step 1 of 6 • Explore',
        title: 'Spot the Goal & Gems',
        desc: 'Look at the Game Canvas on the left. Guide your turtle along the open path, pick up any sparkling cyan gems, and stop on the checkered finish flag 🏁!',
        tip: '<strong>Drawing levels (World 3+):</strong> Follow the faint dashed outline on the canvas!'
      },
      {
        img: 'images/turtlequest/help-step-2.jpg',
        badge: 'Step 2 of 6 • Build Code',
        title: 'Press Buttons to Write Python',
        desc: 'Press ⬆️ Forward, ⬇️ Backward, ↶ Turn left, or ↷ Turn right in the middle panel. Every button immediately adds a real line of Python code on the right!',
        tip: '<code>turtle.forward(40)</code> moves 1 grid square, and <code>turtle.left(90)</code> turns a corner.'
      },
      {
        img: 'images/turtlequest/help-step-3.jpg',
        badge: 'Step 3 of 6 • Test It',
        title: 'Run or Step Through Your Program',
        desc: 'Click <strong>▶ Run</strong> to animate your turtle, or <strong>⏭ Step</strong> to execute one line at a time while watching the active Python line light up green.',
        tip: 'Use the <strong>Speed</strong> slider to slow down or speed up your turtle.'
      },
      {
        img: 'images/turtlequest/help-step-4.jpg',
        badge: 'Step 4 of 6 • Debug',
        title: 'Mistakes Help You Learn!',
        desc: 'If your turtle bumps into a wall 💥, the exact Python line that caused it lights up red. You never lose points for experimenting!',
        tip: 'Click any line in the Python editor to <strong>Edit</strong>, <strong>Move</strong>, or <strong>Delete</strong> it — or press <strong>↩ Undo</strong>.'
      },
      {
        img: 'images/turtlequest/help-step-5.jpg',
        badge: 'Step 5 of 6 • Level Up',
        title: 'Use Loops & Functions to Save Lines',
        desc: 'In World 2 you unlock <strong>🔁 Repeat</strong> to wrap repeated commands in a Python <code>for</code> loop. Later you will unlock colours, nested loops, and functions!',
        tip: 'Press <strong>↵ End repeat</strong> when you finish adding commands inside a loop.'
      },
      {
        img: 'images/turtlequest/help-step-6.jpg',
        badge: 'Step 6 of 6 • Adventure',
        title: 'Earn 3 Stars & Unlock 5 Worlds!',
        desc: 'Solve levels within the <strong>3-Star Target</strong> line count to earn ⭐⭐⭐, unlock new turtle skins, collect achievement badges, and download your PDF certificate!',
        tip: 'Open <strong>🗺️ World Map</strong> anytime to jump between all 40 levels, or click <strong>⭐</strong> for your certificate.'
      }
    ];

    if (helpGridView) {
      const cardsHtml = steps.map((s, i) =>
        `<div class="help-step-card" data-step="${i}">
          <img src="${s.img}" alt="${s.title}">
          <strong>${i + 1}. ${s.title}</strong>
          <span>${s.desc}</span>
        </div>`
      ).join('');
      openModal(
        '🐢 How to Play Turtle Quest — All 6 Steps',
        `<div class="help-steps-grid">${cardsHtml}</div>`,
        [
          { label: '◀ Slide View', cls: '', onClick: () => { helpGridView = false; renderHelpModal(); } },
          { label: 'Let’s Play! ▶', cls: 'btn-success', onClick: closeModal }
        ]
      );
      els.modalBody.querySelectorAll('.help-step-card[data-step]').forEach(card => {
        card.addEventListener('click', () => {
          helpGridView = false;
          helpSlideIdx = Number(card.getAttribute('data-step'));
          renderHelpModal();
        });
      });
      return;
    }

    const s = steps[helpSlideIdx];
    const dotsHtml = steps.map((_, i) =>
      `<button type="button" class="help-dot ${i === helpSlideIdx ? 'active' : ''}" data-dot="${i}" aria-label="Go to step ${i + 1}">${i + 1}</button>`
    ).join('');

    const bodyHtml = `
      <div class="help-slide">
        <img class="help-slide-img" src="${s.img}" alt="${s.title}">
        <div>
          <span class="help-slide-badge">${s.badge}</span>
          <h3 class="help-slide-title">${s.title}</h3>
          <p class="help-slide-desc">${s.desc}</p>
          <div class="help-slide-tip">💡 ${s.tip}</div>
        </div>
      </div>
      <div class="help-dots">${dotsHtml}</div>
    `;

    const footerBtns = [
      { label: '📋 View All 6', cls: '', onClick: () => { helpGridView = true; renderHelpModal(); } }
    ];
    if (helpSlideIdx > 0) {
      footerBtns.push({ label: '◀ Back', cls: '', onClick: () => { helpSlideIdx--; renderHelpModal(); } });
    }
    if (helpSlideIdx < steps.length - 1) {
      footerBtns.push({ label: 'Next ▶', cls: 'btn-primary', onClick: () => { helpSlideIdx++; renderHelpModal(); } });
    } else {
      footerBtns.push({ label: 'Start Playing! ▶', cls: 'btn-success', onClick: closeModal });
    }

    openModal('🐢 Welcome to Turtle Quest!', bodyHtml, footerBtns);

    els.modalBody.querySelectorAll('.help-dot[data-dot]').forEach(dot => {
      dot.addEventListener('click', () => {
        helpSlideIdx = Number(dot.getAttribute('data-dot'));
        renderHelpModal();
      });
    });
  }

  function showIntroModal(world) {
    const imgHtml = world.image
      ? `<img class="intro-hero-img" src="${world.image}" alt="${world.name}">`
      : '';
    openModal(
      `${world.badge} ${world.intro.title}`,
      `${imgHtml}<p>${world.intro.body}</p>
       <p><strong>Example Python:</strong></p>
       <pre style="background:var(--editor-bg);color:var(--editor-text);padding:12px;border-radius:8px;overflow:auto;">${world.intro.demoCode}</pre>`,
      [
        {
          label: 'Start Adventure! ▶',
          cls: 'btn-primary',
          onClick: closeModal
        }
      ]
    );
  }

  function showCompletionModal(level, stars, lines, improved) {
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    let golfHtml = '';
    if (level.id >= 9 && lines > level.threeStarLines) {
      golfHtml = `
        <div style="margin-top:12px;padding:12px;border-radius:10px;background:rgba(217,119,6,0.12);border:1px solid var(--warning);">
          <strong>⛳ Code Golf Challenge!</strong><br>
          You completed this level using <strong>${lines}</strong> lines of code. Can you do it in <strong>${level.threeStarLines}</strong>?
        </div>`;
    } else if (stars === 3) {
      golfHtml = `<p style="color:var(--success);font-weight:700;">🏆 Optimal 3-Star Python Solution!</p>`;
    }

    const buttons = [
      {
        label: '🔁 Improve Score',
        cls: '',
        onClick: closeModal
      }
    ];
    if (currentLevelIdx < LEVELS.length - 1) {
      buttons.push({
        label: 'Next Level ▶',
        cls: 'btn-success',
        onClick: () => {
          closeModal();
          loadLevel(currentLevelIdx + 1);
        }
      });
    }

    openModal(
      `🎉 Level ${level.id} Complete!`,
      `<div style="text-align:center;font-size:2.2rem;margin-bottom:8px;">${starStr}</div>
       <p><strong>${level.title}</strong> — ${lines} meaningful Python line(s), ${simState.ops} executed Turtle instruction(s).</p>
       ${improved ? '<p style="color:var(--primary);font-weight:700;">✨ New Personal Best!</p>' : ''}
       ${golfHtml}`,
      buttons
    );
  }

  function showWorldMapModal() {
    let html = '';
    WORLDS.forEach((w, wIdx) => {
      const worldLevels = LEVELS.filter(l => l.world === w.id);
      const worldStars = worldLevels.reduce((sum, l) => sum + (saveState.levels[l.id]?.stars || 0), 0);
      const maxWorldStars = worldLevels.length * 3;
      const bgStyle = w.image ? `style="background-image:url('${w.image}')"` : '';

      html += `<div class="world-card">
        <div class="realm-banner" ${bgStyle}>
          <div class="realm-banner-content">
            <div>
              <h3>${w.badge} World ${w.id}: ${w.name}</h3>
              <p>${w.subtitle} — ${w.description}</p>
            </div>
            <span class="realm-stars-pill">⭐ ${worldStars} / ${maxWorldStars}</span>
          </div>
        </div>
        <div class="level-grid">`;
      worldLevels.forEach(lvl => {
        const st = saveState.levels[lvl.id]?.stars || 0;
        const stars = '⭐'.repeat(st) + '☆'.repeat(3 - st);
        const cur = lvl.id === getLevel().id ? 'current' : '';
        const done = st > 0 ? 'completed' : '';
        html += `<button class="level-tile ${done} ${cur}" data-level-id="${lvl.id}">
          <span class="level-node-num">${lvl.id}</span>
          <span class="level-node-meta">
            <span class="level-tile-title">${lvl.title}</span>
            <span class="level-tile-stars">${stars}</span>
          </span>
        </button>`;
      });
      html += `</div></div>`;
      if (wIdx < WORLDS.length - 1) {
        html += `<div class="realm-connector" aria-hidden="true">••• ▼ •••</div>`;
      }
    });

    openModal('🗺️ Turtle Quest Adventure Map', html, [
      { label: 'Close', cls: 'btn-primary', onClick: closeModal }
    ]);

    els.modalBody.querySelectorAll('.level-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = Number(tile.getAttribute('data-level-id'));
        closeModal();
        loadLevel(id - 1);
      });
    });
  }

  function showRewardsModal() {
    const stars = totalStarsEarned();
    let html = `<h3>🐢 Turtle Appearances (${stars} ⭐ earned)</h3><div class="skin-row">`;
    TURTLE_SKINS.forEach(s => {
      const unlocked = stars >= s.minStars;
      const active = saveState.skin === s.id ? 'active' : '';
      html += `<button class="skin-btn ${active}" data-skin="${s.id}" ${unlocked ? '' : 'disabled'}>
        ${s.icon} ${s.name} ${unlocked ? '' : `(🔒 ${s.minStars}⭐)`}
      </button>`;
    });
    html += `</div><h3 style="margin-top:16px;">🏅 Achievements</h3><div class="badge-grid">`;
    ACHIEVEMENTS.forEach(a => {
      const unlocked = saveState.achievements.includes(a.id);
      html += `<div class="badge-card ${unlocked ? 'unlocked' : ''}">
        <div style="font-size:1.5rem;">${a.icon}</div>
        <strong>${a.title}</strong>
        <div style="font-size:0.8rem;color:var(--text-muted);">${a.desc}</div>
      </div>`;
    });
    html += `</div>
    <div style="margin-top:16px;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--surface-alt);">
      <h3 style="margin:0 0 8px;">📜 Download Certificate</h3>
      <p style="margin:0 0 8px;font-size:0.85rem;color:var(--text-muted);">Enter your name to generate a printable PDF certificate of your Turtle Quest progress (generated locally on your device).</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <input type="text" id="certNameInput" placeholder="Enter your name..." maxlength="60" aria-label="Student name for certificate"
          style="flex:1;min-width:180px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:inherit;font-size:16px;">
        <button type="button" class="btn btn-success" id="btnDownloadCert">⬇️ Download PDF</button>
      </div>
      <div id="certStatus" style="margin-top:6px;font-size:0.82rem;color:var(--danger);"></div>
    </div>`;

    openModal('🏆 Rewards & Progress', html, [
      {
        label: '🗑️ Reset Progress',
        cls: 'btn-danger',
        onClick: () => {
          if (confirm('Reset all Turtle Quest stars, achievements, and saved solutions?')) {
            localStorage.removeItem(STORAGE_KEY);
            saveState = loadSaveState();
            closeModal();
            loadLevel(0, false);
          }
        }
      },
      { label: 'Close', cls: 'btn-primary', onClick: closeModal }
    ]);

    els.modalBody.querySelectorAll('.skin-btn[data-skin]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveState.skin = btn.getAttribute('data-skin');
        persistSaveState();
        renderCanvas();
        showRewardsModal();
      });
    });

    const certBtn = document.getElementById('btnDownloadCert');
    const certInput = document.getElementById('certNameInput');
    const certStatus = document.getElementById('certStatus');
    if (certBtn && certInput) {
      certBtn.addEventListener('click', () => {
        const name = certInput.value.trim();
        if (!name) {
          certStatus.textContent = 'Please enter your name before downloading the certificate.';
          certInput.focus();
          return;
        }
        certStatus.textContent = '';
        downloadCertificatePdf(name);
      });
    }
  }

  function downloadCertificatePdf(studentName) {
    const w = 1123;
    const h = 794;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');

    // Background (warm cream to soft mint)
    const grad = g.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fffdf5');
    grad.addColorStop(1, '#ecfdf5');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);

    // Outer & inner decorative borders
    g.strokeStyle = '#0d9488';
    g.lineWidth = 14;
    g.strokeRect(24, 24, w - 48, h - 48);

    g.strokeStyle = '#f59e0b';
    g.lineWidth = 5;
    g.strokeRect(42, 42, w - 84, h - 84);

    // Header ribbon (vibrant teal-emerald gradient)
    const ribGrad = g.createLinearGradient(42, 74, w - 42, 152);
    ribGrad.addColorStop(0, '#0d9488');
    ribGrad.addColorStop(1, '#10b981');
    g.fillStyle = ribGrad;
    g.fillRect(42, 74, w - 84, 78);
    g.fillStyle = '#ffffff';
    g.font = 'bold 34px system-ui, -apple-system, sans-serif';
    g.textAlign = 'center';
    g.fillText('TURTLE QUEST — CERTIFICATE OF ACHIEVEMENT', w / 2, 125);

    // Subtitle
    g.fillStyle = '#475569';
    g.font = '22px system-ui, -apple-system, sans-serif';
    g.fillText('This certificate is proudly awarded to', w / 2, 215);

    // Student Name
    g.fillStyle = '#0f766e';
    g.font = 'bold 52px Georgia, serif';
    g.fillText(studentName, w / 2, 290);

    // Underline under name
    g.strokeStyle = '#fbbf24';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(240, 312);
    g.lineTo(w - 240, 312);
    g.stroke();

    // Achievement summary
    const stars = totalStarsEarned();
    const done = completedCount();
    const achCount = saveState.achievements.length;
    g.fillStyle = '#334155';
    g.font = '23px system-ui, -apple-system, sans-serif';
    g.fillText('for exploring Python programming, loops, and algorithms in Turtle Quest', w / 2, 370);

    // Stats boxes
    const boxes = [
      { label: 'Levels Completed', val: `${done} / 40`, accent: '#0d9488' },
      { label: 'Stars Earned', val: `${stars} / 120`, accent: '#d97706' },
      { label: 'Badges Unlocked', val: `${achCount} / ${ACHIEVEMENTS.length}`, accent: '#7c3aed' }
    ];
    boxes.forEach((b, idx) => {
      const bx = 170 + idx * 275;
      const by = 420;
      g.fillStyle = '#ffffff';
      g.fillRect(bx, by, 235, 105);
      g.strokeStyle = b.accent;
      g.lineWidth = 3;
      g.strokeRect(bx, by, 235, 105);
      g.fillStyle = b.accent;
      g.font = 'bold 34px system-ui, -apple-system, sans-serif';
      g.fillText(b.val, bx + 117, by + 52);
      g.fillStyle = '#64748b';
      g.font = 'bold 16px system-ui, -apple-system, sans-serif';
      g.fillText(b.label, bx + 117, by + 84);
    });

    // Gold Seal
    g.fillStyle = '#f59e0b';
    g.beginPath();
    g.arc(w / 2, 625, 48, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#b45309';
    g.lineWidth = 4;
    g.stroke();
    g.fillStyle = '#ffffff';
    g.font = 'bold 28px system-ui, sans-serif';
    g.fillText('★', w / 2, 635);

    // Date & Footer
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    g.fillStyle = '#475569';
    g.font = '18px system-ui, -apple-system, sans-serif';
    g.textAlign = 'left';
    g.fillText(`Awarded: ${dateStr}`, 95, 700);
    g.textAlign = 'right';
    g.fillText('Turtle Quest • Python Learning Adventure', w - 95, 700);

    // Convert canvas to JPEG bytes and wrap in a valid A4 Landscape PDF
    const dataUrl = c.toDataURL('image/jpeg', 0.92);
    const b64 = dataUrl.split(',')[1];
    const binStr = atob(b64);
    const imgBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      imgBytes[i] = binStr.charCodeAt(i);
    }

    const pdfBytes = buildImagePdf(imgBytes, w, h);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turtle-quest-certificate.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildImagePdf(jpegBytes, imgW, imgH) {
    // A4 Landscape in points: 841.89 x 595.28
    const pageW = 841.89;
    const pageH = 595.28;
    const enc = new TextEncoder();
    const parts = [];
    const offsets = [0];
    let byteLen = 0;

    function pushStr(s) {
      const b = enc.encode(s);
      parts.push(b);
      byteLen += b.length;
    }
    function pushBytes(b) {
      parts.push(b);
      byteLen += b.length;
    }

    pushStr('%PDF-1.4\n');
    offsets.push(byteLen);
    pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    offsets.push(byteLen);
    pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    offsets.push(byteLen);
    pushStr(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);

    offsets.push(byteLen);
    pushStr(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
    pushBytes(jpegBytes);
    pushStr('\nendstream\nendobj\n');

    const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
    offsets.push(byteLen);
    pushStr(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

    const xrefPos = byteLen;
    pushStr(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
    for (let i = 1; i < offsets.length; i++) {
      pushStr(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
    }
    pushStr(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

    const out = new Uint8Array(byteLen);
    let pos = 0;
    for (const p of parts) {
      out.set(p, pos);
      pos += p.length;
    }
    return out;
  }

  // --- Event Listeners ---
  document.querySelectorAll('.cmd-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => handleCommandButton(btn.getAttribute('data-cmd')));
  });

  [els.paramDist, els.paramAngle, els.paramRepeat, els.paramColor, els.paramFnName].forEach(el => {
    el.addEventListener('input', updateCommandPreviews);
    el.addEventListener('change', updateCommandPreviews);
  });

  els.btnRun.addEventListener('click', runProgram);
  els.btnStep.addEventListener('click', stepOnce);
  els.btnPause.addEventListener('click', pauseProgram);
  els.btnStop.addEventListener('click', stopExecution);
  els.btnResetTurtle.addEventListener('click', () => {
    stopExecution();
    resetSimulation();
    clearFeedback();
  });

  els.btnUndo.addEventListener('click', () => {
    if (undoStack.length === 0) return;
    redoStack.push({ lines: [...codeLines], stack: JSON.parse(JSON.stringify(blockStack)) });
    const prev = undoStack.pop();
    codeLines = prev.lines;
    blockStack = prev.stack;
    selectedLineIdx = -1;
    syncEditorUI();
    updateStatsUI();
  });

  els.btnRedo.addEventListener('click', () => {
    if (redoStack.length === 0) return;
    undoStack.push({ lines: [...codeLines], stack: JSON.parse(JSON.stringify(blockStack)) });
    const next = redoStack.pop();
    codeLines = next.lines;
    blockStack = next.stack;
    selectedLineIdx = -1;
    syncEditorUI();
    updateStatsUI();
  });

  els.btnClear.addEventListener('click', () => {
    pushUndo();
    codeLines = ['import turtle'];
    blockStack = [];
    selectedLineIdx = -1;
    syncEditorUI();
    updateStatsUI();
    resetSimulation();
    clearFeedback();
  });

  els.btnCopy.addEventListener('click', async () => {
    const code = getCodeString();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        showFeedback('✅ Python code copied to clipboard! You can paste it into Python Code Lab.', 'success');
        return;
      }
    } catch (_) { /* fall through to textarea fallback */ }

    try {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, code.length);
      const ok = document.execCommand('copy');
      ta.remove();
      if (ok) {
        showFeedback('✅ Python code copied to clipboard! You can paste it into Python Code Lab.', 'success');
        return;
      }
    } catch (_) { /* ignore */ }
    showFeedback('Switch to Text Mode to select and copy your Python code.', 'info');
  });

  function showHintModal() {
    const level = getLevel();
    const hints = level.hints || [];
    if (hints.length === 0) return;
    if (hintTier === 0) hintTier = 1;

    const labels = ['1. Think About It', '2. Helpful Command', '3. Python Example'];
    let bodyHtml = '';
    for (let i = 0; i < hintTier && i < hints.length; i++) {
      const isCode = i === 2;
      const content = isCode
        ? `<pre style="margin:6px 0 0;background:var(--editor-bg);color:var(--editor-text);padding:10px;border-radius:8px;overflow:auto;">${hints[i]}</pre>`
        : `<p style="margin:4px 0 0;">${hints[i]}</p>`;
      bodyHtml += `<div style="margin-bottom:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface-alt);">
        <strong style="color:var(--warning);">💡 ${labels[i] || `Hint ${i + 1}`}</strong>
        ${content}
      </div>`;
    }

    const footerBtns = [];
    if (hintTier < hints.length) {
      footerBtns.push({
        label: `Show Hint ${hintTier + 1}/${hints.length}`,
        cls: 'btn-warning',
        onClick: () => {
          hintTier++;
          showHintModal();
        }
      });
    }
    footerBtns.push({ label: 'Got it!', cls: 'btn-primary', onClick: closeModal });

    openModal(`💡 Hints — Level ${level.id}: ${level.title}`, bodyHtml, footerBtns);
  }

  els.btnHint.addEventListener('click', showHintModal);

  els.btnTextMode.addEventListener('click', () => {
    if (textMode) {
      codeLines = els.textEditor.value.split(/\r?\n/);
    }
    textMode = !textMode;
    syncEditorUI();
    updateStatsUI();
  });

  els.textEditor.addEventListener('input', () => {
    codeLines = els.textEditor.value.split(/\r?\n/);
    updateStatsUI();
  });

  // Line manipulation toolbar
  els.btnLineDelete.addEventListener('click', () => {
    if (selectedLineIdx <= 0 || selectedLineIdx >= codeLines.length) return;
    pushUndo();
    codeLines.splice(selectedLineIdx, 1);
    selectedLineIdx = Math.min(selectedLineIdx, codeLines.length - 1);
    if (selectedLineIdx === 0) selectedLineIdx = -1;
    syncEditorUI();
    updateStatsUI();
  });

  els.btnLineUp.addEventListener('click', () => {
    if (selectedLineIdx <= 1 || selectedLineIdx >= codeLines.length) return;
    pushUndo();
    const tmp = codeLines[selectedLineIdx - 1];
    codeLines[selectedLineIdx - 1] = codeLines[selectedLineIdx];
    codeLines[selectedLineIdx] = tmp;
    selectedLineIdx--;
    syncEditorUI();
  });

  els.btnLineDown.addEventListener('click', () => {
    if (selectedLineIdx <= 0 || selectedLineIdx >= codeLines.length - 1) return;
    pushUndo();
    const tmp = codeLines[selectedLineIdx + 1];
    codeLines[selectedLineIdx + 1] = codeLines[selectedLineIdx];
    codeLines[selectedLineIdx] = tmp;
    selectedLineIdx++;
    syncEditorUI();
  });

  els.btnLineEdit.addEventListener('click', () => {
    if (selectedLineIdx <= 0 || selectedLineIdx >= codeLines.length) return;
    const current = codeLines[selectedLineIdx];
    const updated = prompt('Edit Python line:', current);
    if (updated !== null && updated.trim() !== '') {
      pushUndo();
      codeLines[selectedLineIdx] = updated;
      syncEditorUI();
      updateStatsUI();
    }
  });

  els.btnPrevLevel.addEventListener('click', () => loadLevel(currentLevelIdx - 1));
  els.btnNextLevel.addEventListener('click', () => loadLevel(currentLevelIdx + 1));

  els.btnTheme.addEventListener('click', () => {
    saveState.theme = saveState.theme === 'dark' ? 'light' : 'dark';
    persistSaveState();
    applyTheme();
  });

  els.btnMute.addEventListener('click', () => {
    saveState.muted = !saveState.muted;
    persistSaveState();
    applyMute();
  });

  els.btnWorldMap.addEventListener('click', showWorldMapModal);
  els.btnHelp.addEventListener('click', () => showHelpModal(0));
  els.progressPill.addEventListener('click', showRewardsModal);
  els.btnModalClose.addEventListener('click', closeModal);
  els.modalBackdrop.addEventListener('click', (e) => {
    if (e.target === els.modalBackdrop) closeModal();
  });

  // Init
  applyTheme();
  applyMute();
  loadLevel(currentLevelIdx, true);
})();
