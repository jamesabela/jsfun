(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const STORAGE_KEY = 'flowchart-studio-v1';
  const THEME_KEY = 'flowchart-studio-theme';
  const darkTypes = {
    terminator: { fill: '#312e81', stroke: '#a5b4fc' },
    process: { fill: '#0c4a6e', stroke: '#7dd3fc' },
    decision: { fill: '#422006', stroke: '#fbbf24' },
    io: { fill: '#064e3b', stroke: '#6ee7b7' },
    subroutine: { fill: '#4c0519', stroke: '#fda4af' }
  };
  let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) darkMode = savedTheme === 'dark';
  } catch { /* The toggle also works without browser storage. */ }
  const workspace = document.querySelector('.workspace');
  let whiteboardView = null;
  const types = {
    terminator: { label: 'Start', fill: '#e0e7ff', stroke: '#4f46e5' },
    process: { label: 'Process', fill: '#e0f2fe', stroke: '#0284c7' },
    decision: { label: 'Condition?', fill: '#fffbeb', stroke: '#d97706' },
    io: { label: 'Input / Output', fill: '#ecfdf4', stroke: '#059669' },
    subroutine: { label: 'Subroutine', fill: '#ffe4e6', stroke: '#e11d48' }
  };
  let chart = { version: 1, title: 'My flowchart', nodes: [], edges: [] };
  let selected = null, tool = 'select', source = null, drag = null;
  let view = { x: 0, y: 0, scale: 1 }, history = [], future = [], editSnapshot = null;
  let idCounter = 0;
  let urlUpdateTimer = null;
  const uid = () => `item-${Date.now().toString(36)}-${++idCounter}`;
  const snapshot = () => JSON.stringify(chart);
  const svg = (tag, attrs = {}, text) => {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function status(message) { $('status').textContent = message; }
  function syncAddressBar() {
    clearTimeout(urlUpdateTimer);
    urlUpdateTimer = null;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.hash.slice(1));
    params.set('chart', snapshot());
    url.hash = params.toString();
    if (url.href === window.location.href) return;
    try {
      // Replace this entry without creating Back-button steps or triggering hashchange.
      window.history.replaceState(window.history.state, '', url.href);
    } catch {
      status('Address-bar link could not update — use Copy link or Download JSON');
    }
  }
  function scheduleURLUpdate() {
    clearTimeout(urlUpdateTimer);
    urlUpdateTimer = setTimeout(syncAddressBar, 350);
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, snapshot()); status('Draft saved in this browser'); }
    catch { status('Browser storage unavailable — use Save file to keep your work'); }
    scheduleURLUpdate();
  }
  function remember(before) {
    if (before === snapshot()) return;
    history.push(before); if (history.length > 100) history.shift();
    future = []; persist(); updateHistory();
  }
  function change(fn) { finishEdit(); const before = snapshot(); fn(); remember(before); render(); inspect(); }
  function finishEdit() { if (editSnapshot !== null) { remember(editSnapshot); editSnapshot = null; syncAddressBar(); } }
  function updateHistory() { $('undo').disabled = !history.length; $('redo').disabled = !future.length; }
  function restore(from, to) {
    finishEdit(); if (!from.length) return;
    to.push(snapshot()); chart = JSON.parse(from.pop()); selected = null; source = null;
    $('chart-title').value = chart.title; persist(); render(); inspect();
  }
  function linesFor(text, max) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (let word of paragraph.split(/\s+/)) {
        if (line && line.length + word.length + 1 > max) { lines.push(line); line = ''; }
        while (word.length > max) { if (line) { lines.push(line); line = ''; } lines.push(word.slice(0, max)); word = word.slice(max); }
        if (word) line += (line ? ' ' : '') + word;
      }
      lines.push(line);
    }
    return lines;
  }
  function dimensions(n) {
    const lines = linesFor(n.text, n.type === 'decision' ? 20 : 24);
    return { w: n.type === 'decision' ? 240 : 210, h: n.type === 'decision' ? Math.max(120, lines.length * 36 + 44) : Math.max(64, lines.length * 19 + 28), lines };
  }
  function nodeElement(n, clean = false) {
    const { w, h, lines } = dimensions(n), style = darkMode && !clean ? darkTypes[n.type] : types[n.type];
    const g = svg('g', { class: `node${selected?.id === n.id || source === n.id ? ' selected' : ''}`, transform: `translate(${n.x},${n.y})`, 'data-id': n.id, tabindex: 0, role: 'button', 'aria-label': `${n.type}: ${n.text}` });
    const attrs = { fill: style.fill, stroke: style.stroke, 'stroke-width': 2 };
    let shape;
    if (n.type === 'decision') shape = svg('polygon', { ...attrs, points: `0,${-h/2} ${w/2},0 0,${h/2} ${-w/2},0` });
    else if (n.type === 'io') shape = svg('polygon', { ...attrs, points: `${-w/2+22},${-h/2} ${w/2},${-h/2} ${w/2-22},${h/2} ${-w/2},${h/2}` });
    else shape = svg('rect', { ...attrs, x: -w/2, y: -h/2, width: w, height: h, rx: n.type === 'terminator' ? h/2 : 2 });
    g.append(shape);
    if (n.type === 'subroutine') g.append(svg('path', { d: `M${-w/2+12},${-h/2}V${h/2}M${w/2-12},${-h/2}V${h/2}`, stroke: style.stroke, 'stroke-width': 2 }));
    const text = svg('text', { 'text-anchor': 'middle', fill: darkMode && !clean ? '#f1f5f9' : '#1e293b', 'font-family': 'Arial, sans-serif', 'font-size': 14 });
    lines.forEach((line, i) => text.append(svg('tspan', { x: 0, y: -(lines.length-1)*9.5 + i*19 + 5 }, line)));
    g.append(text);
    if (!clean) g.append(svg('rect', { class: 'outline', x: -w/2-6, y: -h/2-6, width: w+12, height: h+12, rx: 8, fill: 'none', stroke: 'transparent', 'pointer-events': 'none' }));
    return g;
  }
  const directions = { top: [0,-1], bottom: [0,1], left: [-1,0], right: [1,0] };
  function anchor(n, side) {
    const { w,h } = dimensions(n), [dx,dy] = directions[side];
    // Input/output's slanted sides meet the centre line 11px in from each edge.
    return { x: n.x + dx*(w/2 - (n.type === 'io' ? 11 : 0)), y: n.y+dy*h/2 };
  }
  function route(e) {
    const a = chart.nodes.find(n => n.id === e.from), b = chart.nodes.find(n => n.id === e.to);
    const dx = b.x-a.x, dy = b.y-a.y;
    const horizontal = Math.abs(dx) > Math.abs(dy)*1.15;
    const from = e.fromSide !== 'auto' ? e.fromSide : horizontal ? (dx>=0?'right':'left') : (dy>=0?'bottom':'top');
    const to = e.toSide !== 'auto' ? e.toSide : horizontal ? (dx>=0?'left':'right') : (dy>=0?'top':'bottom');
    const start = anchor(a,from), end = anchor(b,to), da = directions[from], db = directions[to];
    const p = {x:start.x+da[0]*28,y:start.y+da[1]*28}, q = {x:end.x+db[0]*28,y:end.y+db[1]*28};
    let mid;
    if (da[0] && db[0]) {
      const x = da[0] === db[0] ? (da[0]>0?Math.max(p.x,q.x):Math.min(p.x,q.x)) : (p.x+q.x)/2;
      mid = [{x,y:p.y},{x,y:q.y}];
    } else if (da[1] && db[1]) {
      const y = da[1] === db[1] ? (da[1]>0?Math.max(p.y,q.y):Math.min(p.y,q.y)) : (p.y+q.y)/2;
      mid = [{x:p.x,y},{x:q.x,y}];
    } else mid = [da[0] ? {x:q.x,y:p.y} : {x:p.x,y:q.y}];
    if (e.via === 'left' || e.via === 'right') {
      // Keep imported loop paths outside the shapes, including after dragging.
      const extents = chart.nodes.map(n => n.x + (e.via === 'left' ? -1 : 1) * dimensions(n).w / 2);
      const x = e.via === 'left' ? Math.min(...extents) - 50 : Math.max(...extents) + 50;
      mid = [{x, y:p.y}, {x, y:q.y}];
    }
    const points = [start,p,...mid,q,end];
    let longest = { length: -1, x: 0, y: 0 };
    for (let i=1;i<points.length;i++) {
      const prev=points[i-1],curr=points[i],length=Math.hypot(curr.x-prev.x,curr.y-prev.y);
      if (length>longest.length) longest={length,x:(prev.x+curr.x)/2,y:(prev.y+curr.y)/2};
    }
    return { d: points.map((pt,i)=>`${i?'L':'M'}${pt.x},${pt.y}`).join(' '), label: longest, points };
  }
  function edgeElement(e, clean = false) {
    const r = route(e), g = svg('g', { class: `edge${selected?.id === e.id?' selected':''}`, 'data-id': e.id, tabindex: 0, role: 'button', 'aria-label': `Arrow${e.text?': '+e.text:''}` });
    if (!clean) g.append(svg('path',{d:r.d,fill:'none',stroke:'transparent','stroke-width':18}));
    g.append(svg('path',{class:'edge-line',d:r.d,fill:'none',stroke:darkMode&&!clean?'#cbd5e1':'#475569','stroke-width':2,'stroke-linejoin':'round','marker-end':'url(#arrow)'}));
    if (e.text) {
      const width = e.text.length*8+16;
      g.append(svg('rect',{x:r.label.x-width/2,y:r.label.y-12,width,height:24,rx:5,fill:darkMode&&!clean?'#1e293b':'#fff'}));
      g.append(svg('text',{x:r.label.x,y:r.label.y+5,'text-anchor':'middle',fill:darkMode&&!clean?'#f1f5f9':'#334155','font-size':13,'font-family':'Arial, sans-serif'},e.text));
    }
    return g;
  }
  function render() {
    const focusedId = document.activeElement?.closest('.node,.edge')?.dataset.id;
    $('nodes').replaceChildren(...chart.nodes.map(n=>nodeElement(n)));
    $('edges').replaceChildren(...chart.edges.map(e=>edgeElement(e)));
    if (focusedId) [...$('canvas').querySelectorAll('.node,.edge')].find(el=>el.dataset.id===focusedId)?.focus({preventScroll:true});
    $('empty-state').hidden = chart.nodes.length>0;
    $('counts').textContent = `${chart.nodes.length} shapes · ${chart.edges.length} arrows`;
    updateHistory(); applyView();
  }
  function selectedItem() { return selected && chart[selected.kind].find(item=>item.id===selected.id); }
  function inspect() {
    const item = selectedItem();
    $('no-selection').hidden = !!item; $('selection-fields').hidden = !item;
    if (!item) return;
    const isNode = selected.kind==='nodes';
    $('label-caption').textContent = isNode?'Shape text':'Arrow label (e.g. Yes / No)';
    $('label-input').maxLength = isNode?240:40;
    $('label-input').value = item.text;
    $('node-fields').hidden = !isNode; $('edge-fields').hidden = isNode; $('duplicate').hidden = !isNode;
    if (isNode) $('shape-type').value = item.type;
    else { $('edge-from').value=item.fromSide; $('edge-to').value=item.toSide; }
  }
  function select(kind,id) {
    finishEdit(); selected = id?{kind,id}:null;
    // Keep the clicked SVG element in place so native double-clicks still fire.
    $('canvas').querySelectorAll('.node,.edge').forEach(el=>el.classList.toggle('selected',el.dataset.id===id||el.dataset.id===source));
    inspect();
  }
  function setTool(next) {
    if (whiteboardView) next = 'pan';
    tool=next; source=null;
    for (const name of ['select','connect','pan']) $(name+'-tool').setAttribute('aria-pressed',String(name===tool));
    $('canvas').dataset.tool=tool;
    $('canvas-tip').textContent=tool==='connect'?'Click the starting shape, then the destination · Esc to cancel':tool==='pan'?'Drag the background to move around · Use + / − to zoom':'Drag shapes to arrange them · Double-click to edit';
    if (whiteboardView) $('canvas-tip').textContent = 'Drag anywhere to pan · Use + / − to zoom · Esc to exit';
    render();
  }
  function applyView() { $('viewport').setAttribute('transform',`translate(${view.x},${view.y}) scale(${view.scale})`); $('zoom-reset').textContent=Math.round(view.scale*100)+'%'; }
  function point(event) { const rect=$('canvas').getBoundingClientRect(); return {x:(event.clientX-rect.left-view.x)/view.scale,y:(event.clientY-rect.top-view.y)/view.scale}; }
  function zoom(factor) {
    const rect=$('canvas').getBoundingClientRect(),newScale=Math.min(2.5,Math.max(.2,view.scale*factor)),ratio=newScale/view.scale;
    view.x=rect.width/2-(rect.width/2-view.x)*ratio; view.y=rect.height/2-(rect.height/2-view.y)*ratio; view.scale=newScale; applyView();
  }
  function bounds() {
    if (!chart.nodes.length) return {x:0,y:0,w:600,h:400};
    let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    const include=(x,y)=>{left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);};
    chart.nodes.forEach(n=>{const {w,h}=dimensions(n);include(n.x-w/2,n.y-h/2);include(n.x+w/2,n.y+h/2);});
    chart.edges.forEach(e=>{const r=route(e);r.points.forEach(p=>include(p.x,p.y));if(e.text){include(r.label.x-e.text.length*4-8,r.label.y-12);include(r.label.x+e.text.length*4+8,r.label.y+12);}});
    return {x:left-40,y:top-40,w:right-left+80,h:bottom-top+80};
  }
  function fit() { const b=bounds(),rect=$('canvas').getBoundingClientRect(),availableHeight=Math.max(100,rect.height-64); view.scale=Math.min(1.2,Math.max(.05,Math.min(rect.width/b.w,availableHeight/b.h)));view.x=(rect.width-b.w*view.scale)/2-b.x*view.scale;view.y=(availableHeight-b.h*view.scale)/2-b.y*view.scale;applyView(); }
  function add(type) {
    setTool('select');
    change(()=>{
      const rect=$('canvas').getBoundingClientRect();
      let x=Math.round((rect.width/2-view.x)/view.scale/20)*20, y=Math.round((rect.height/2-view.y)/view.scale/20)*20;
      while(chart.nodes.some(n=>Math.abs(n.x-x)<120&&Math.abs(n.y-y)<85)){x+=40;y+=80;}
      const n={id:uid(),type,text:types[type].label,x,y};chart.nodes.push(n);selected={kind:'nodes',id:n.id};
    });
    const n=selectedItem(),r=$('canvas').getBoundingClientRect();
    if(n.x*view.scale+view.x>r.width-110||n.y*view.scale+view.y>r.height-60) fit();
  }
  function remove() { if(!selectedItem())return;change(()=>{const {kind,id}=selected;chart[kind]=chart[kind].filter(item=>item.id!==id);if(kind==='nodes')chart.edges=chart.edges.filter(e=>e.from!==id&&e.to!==id);selected=null;source=null;}); }
  function duplicate() { if(selected?.kind!=='nodes')return;change(()=>{const n={...selectedItem(),id:uid()};n.x+=40;n.y+=80;chart.nodes.push(n);selected={kind:'nodes',id:n.id};}); }
  function connect(id) {
    if(!source){source=id;select('nodes',id);status('Now select the destination shape');return;}
    if(source===id){status('Choose a different shape for the destination');return;}
    if(chart.edges.some(e=>e.from===source&&e.to===id)){status('These shapes are already connected');return;}
    change(()=>{const e={id:uid(),from:source,to:id,text:'',fromSide:'auto',toSide:'auto'};chart.edges.push(e);selected={kind:'edges',id:e.id};source=null;});
    status('Arrow added — select it to add a label');
  }
  $('canvas').addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const node=event.target.closest('.node'),edge=event.target.closest('.edge');
    if(tool==='connect'&&node){connect(node.dataset.id);return;}
    if(tool==='pan'||(!node&&!edge)) {
      if(tool!=='pan') select(null,null);
      drag={kind:'pan',x:event.clientX,y:event.clientY,vx:view.x,vy:view.y};
    } else if(node) {
      select('nodes',node.dataset.id); const n=selectedItem(),p=point(event);
      drag={kind:'node',id:n.id,x:p.x,y:p.y,nx:n.x,ny:n.y,before:snapshot()};
    } else if(edge) {select('edges',edge.dataset.id);return;}
    $('canvas').setPointerCapture(event.pointerId); event.preventDefault();
  });
  $('canvas').addEventListener('pointermove',event=>{
    if(!drag)return;
    if(drag.kind==='pan'){view.x=drag.vx+event.clientX-drag.x;view.y=drag.vy+event.clientY-drag.y;applyView();}
    else{const p=point(event),n=chart.nodes.find(n=>n.id===drag.id);n.x=Math.round((drag.nx+p.x-drag.x)/10)*10;n.y=Math.round((drag.ny+p.y-drag.y)/10)*10;render();}
  });
  function endDrag() {if(drag?.kind==='node')remember(drag.before);drag=null;}
  $('canvas').addEventListener('pointerup',endDrag);$('canvas').addEventListener('pointercancel',endDrag);
  $('canvas').addEventListener('dblclick',event=>{if(whiteboardView)return;const item=event.target.closest('.node,.edge') || document.elementFromPoint(event.clientX,event.clientY)?.closest('.node,.edge');if(item){select(item.classList.contains('node')?'nodes':'edges',item.dataset.id);$('label-input').focus();$('label-input').select();}});
  $('canvas').addEventListener('wheel',event=>{event.preventDefault();if(event.ctrlKey||event.metaKey)zoom(Math.exp(-event.deltaY*.01));else{view.x-=event.deltaX;view.y-=event.deltaY;applyView();}},{passive:false});
  document.querySelectorAll('[data-shape]').forEach(button=>button.addEventListener('click',()=>add(button.dataset.shape)));
  ['select','connect','pan'].forEach(name=>$(name+'-tool').addEventListener('click',()=>setTool(name)));
  $('label-input').addEventListener('input',()=>{const item=selectedItem();if(!item)return;if(editSnapshot===null)editSnapshot=snapshot();item.text=$('label-input').value;render();persist();});
  $('label-input').addEventListener('blur',finishEdit);
  $('chart-title').addEventListener('input',()=>{if(editSnapshot===null)editSnapshot=snapshot();chart.title=$('chart-title').value;persist();});
  $('chart-title').addEventListener('blur',finishEdit);
  $('shape-type').addEventListener('change',()=>change(()=>{selectedItem().type=$('shape-type').value;}));
  $('edge-from').addEventListener('change',()=>change(()=>{selectedItem().fromSide=$('edge-from').value;}));
  $('edge-to').addEventListener('change',()=>change(()=>{selectedItem().toSide=$('edge-to').value;}));
  $('delete').onclick=remove;$('duplicate').onclick=duplicate;
  $('undo').onclick=()=>restore(history,future);$('redo').onclick=()=>restore(future,history);
  $('zoom-in').onclick=()=>zoom(1.2);$('zoom-out').onclick=()=>zoom(1/1.2);$('zoom-reset').onclick=()=>zoom(1/view.scale);$('fit').onclick=fit;
  function applyTheme() {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    $('theme-toggle').textContent = darkMode ? '☀ Light' : '☾ Dark';
    $('theme-toggle').setAttribute('aria-pressed', String(darkMode));
    $('theme-toggle').title = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    $('canvas').querySelector('#arrow path').setAttribute('fill', darkMode ? '#cbd5e1' : '#475569');
    render();
  }
  $('theme-toggle').onclick = () => {
    darkMode = !darkMode;
    try { localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light'); } catch { /* Session-only preference. */ }
    applyTheme();
  };
  function restoreWhiteboard() {
    if (!whiteboardView) return;
    const previous = whiteboardView;
    whiteboardView = null;
    workspace.classList.remove('whiteboard');
    $('fullscreen').textContent = '⛶ Full screen';
    $('fullscreen').setAttribute('aria-pressed', 'false');
    $('fullscreen').title = 'Full-screen whiteboard view';
    view = previous.view;
    setTool(previous.tool);
    $('fullscreen').focus({ preventScroll: true });
  }
  async function exitWhiteboard() {
    try {
      if (document.fullscreenElement === workspace) await document.exitFullscreen();
    } catch {
      // The browser may already have exited fullscreen (for example with Esc).
    } finally {
      restoreWhiteboard();
    }
  }
  $('fullscreen').onclick = async () => {
    if (whiteboardView) { await exitWhiteboard(); return; }
    finishEdit();
    whiteboardView = { view: { ...view }, tool };
    selected = null;
    inspect();
    workspace.classList.add('whiteboard');
    $('fullscreen').textContent = '⛶ Exit full screen';
    $('fullscreen').setAttribute('aria-pressed', 'true');
    $('fullscreen').title = 'Exit whiteboard view (Esc)';
    setTool('pan');
    fit();
    try {
      if (workspace.requestFullscreen) await workspace.requestFullscreen();
    } catch {
      // Retain an expanded, in-page canvas when native fullscreen is unavailable.
    }
    if (whiteboardView) requestAnimationFrame(fitWhiteboard);
  };
  function fitWhiteboard() { if (whiteboardView) fit(); }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) restoreWhiteboard();
    else if (document.fullscreenElement === workspace) requestAnimationFrame(fitWhiteboard);
  });
  window.addEventListener('resize', () => { if (whiteboardView) requestAnimationFrame(fitWhiteboard); });
  function replaceChart(next) {change(()=>{chart=next;selected=null;source=null;$('chart-title').value=chart.title;});setTool('select');fit();}
  function showStarters(open) {
    $('igcse-options').hidden = !open;
    $('choose-igcse').setAttribute('aria-expanded', String(open));
  }
  function startBlank() {
    if(chart.nodes.length&&!confirm('Start a new chart? Save a file first if you want to keep this one. You can also undo this action.'))return;
    replaceChart({version:1,title:'My flowchart',nodes:[],edges:[]});
    showStarters(false);
  }
  $('new').onclick = startBlank;
  $('start-blank').onclick = startBlank;
  $('choose-igcse').onclick = () => showStarters($('igcse-options').hidden);
  const starters = window.FLOWCHART_STARTERS || [];
  for (const starter of starters) {
    const option = document.createElement('option');
    option.value = starter.id;
    option.textContent = starter.title;
    $('starter-select').append(option);
  }
  $('starter-select').addEventListener('change', () => {
    $('load-starter').disabled = !starters.some(starter => starter.id === $('starter-select').value);
  });
  $('load-starter').onclick = () => {
    const starter = starters.find(item => item.id === $('starter-select').value);
    if (!starter) return;
    if (chart.nodes.length && !confirm(`Replace this chart with ${starter.title}? You can undo this action.`)) return;
    // Validation copies the template so edits never alter a future starting point.
    replaceChart(validate(starter.chart));
    showStarters(false);
    $('choose-igcse').focus({ preventScroll: true });
    status(`${starter.title} loaded — ready to edit`);
    if (window.matchMedia('(max-width: 620px)').matches) {
      $('canvas-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  function filename(extension) {return (chart.title.trim()||'flowchart').replace(/[^a-z0-9 _-]/gi,'_').slice(0,100)+'.'+extension;}
  function download(blob,name) {const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('save').onclick=()=>{finishEdit();download(new Blob([JSON.stringify(chart,null,2)],{type:'application/json'}),filename('json'));$('export-menu').open=false;status('JSON downloaded — use Open to edit it again');};
  function chartLink(base = window.location.href) {
    const url = new URL(base);
    url.search = '';
    url.hash = new URLSearchParams({ chart: snapshot() }).toString();
    return url;
  }
  function updateClassroomLinks() {
    // Match the courses' public destination, even when editing from file:// or a local preview.
    const link = chartLink('https://jamesabela.github.io/jsfun/flowchart.html').href;
    const classroom = new URL('https://classroom.google.com/share');
    classroom.searchParams.set('url', link);
    $('classroomShareBtn').href = classroom.href;
    const teams = new URL('https://teams.microsoft.com/share');
    teams.searchParams.set('href', link);
    $('teamsShareBtn').href = teams.href;
  }
  $('export-menu').addEventListener('toggle', () => {
    if ($('export-menu').open) updateClassroomLinks();
  });
  for (const id of ['classroomShareBtn', 'teamsShareBtn']) {
    $(id).addEventListener('click', () => {
      finishEdit();
      updateClassroomLinks();
      $('export-menu').open = false;
    });
  }
  $('copy-link').onclick = async () => {
    finishEdit();
    const url = chartLink();
    const localFile = url.protocol === 'file:';
    $('export-menu').open = false;
    try {
      await navigator.clipboard.writeText(url.href);
      status(localFile
        ? 'Local-file link copied. Use Download JSON to share between devices.'
        : 'Link copied — it includes the current editable chart');
    } catch {
      // Clipboard access may be unavailable on local files or denied by the browser.
      $('copy-link-help').textContent = localFile
        ? 'Copy this link to reopen the chart on this device. Use Download JSON to share between devices.'
        : 'Automatic copying is unavailable. Copy the selected link to reopen this editable chart.';
      $('share-link').value = url.href;
      $('copy-link-dialog').showModal();
      $('share-link').focus();
      $('share-link').select();
      status('Chart link ready to copy');
    }
  };
  function validate(data) {
    if(!data||data.version!==1||typeof data.title!=='string'||data.title.length>100||!Array.isArray(data.nodes)||!Array.isArray(data.edges)||data.nodes.length>500||data.edges.length>1000)throw new Error('Invalid chart');
    const ids=new Set(),sides=['auto',...Object.keys(directions)];
    const validId=id=>typeof id==='string'&&id.length>0&&id.length<150&&!ids.has(id);
    const nodes=data.nodes.map(n=>{if(!n||!validId(n.id)||!Object.hasOwn(types,n.type)||typeof n.text!=='string'||n.text.length>240||![n.x,n.y].every(v=>Number.isFinite(v)&&Math.abs(v)<=20000))throw new Error('Invalid shape');ids.add(n.id);return {id:n.id,type:n.type,text:n.text,x:n.x,y:n.y};});
    const nodeIds=new Set(ids);
    const edges=data.edges.map(e=>{if(!e||!validId(e.id)||!nodeIds.has(e.from)||!nodeIds.has(e.to)||e.from===e.to||typeof e.text!=='string'||e.text.length>40||!sides.includes(e.fromSide)||!sides.includes(e.toSide)||(e.via!==undefined&&!['left','right'].includes(e.via)))throw new Error('Invalid arrow');ids.add(e.id);return {id:e.id,from:e.from,to:e.to,text:e.text,fromSide:e.fromSide,toSide:e.toSide,...(e.via?{via:e.via}:{})};});
    return {version:1,title:data.title,nodes,edges};
  }
  $('open').onclick=()=>$('file-input').click();
  $('file-input').addEventListener('change',async()=>{
    const file=$('file-input').files[0];if(!file)return;
    try{if(file.size>2_000_000)throw new Error('Too large');const next=validate(JSON.parse(await file.text()));if(chart.nodes.length&&!confirm('Open this file and replace the current chart? You can undo this action.'))return;replaceChart(next);status('Chart opened');}
    catch{status('Could not open this file. Choose a Flowchart Studio JSON file (up to 500 shapes).');}
    finally{$('file-input').value='';}
  });
  function exportSVG() {
    const b=bounds(),root=svg('svg',{xmlns:NS,viewBox:`${b.x} ${b.y} ${b.w} ${b.h}`,width:b.w,height:b.h});
    root.append(svg('title',{},chart.title),$('canvas').querySelector('defs').cloneNode(true),svg('rect',{x:b.x,y:b.y,width:b.w,height:b.h,fill:'#fff'}));
    root.querySelector('#arrow path').setAttribute('fill', '#475569');
    chart.edges.forEach(e=>root.append(edgeElement(e,true)));chart.nodes.forEach(n=>root.append(nodeElement(n,true)));
    return {text:new XMLSerializer().serializeToString(root),bounds:b};
  }
  $('svg-export').onclick=()=>{const out=exportSVG();download(new Blob([out.text],{type:'image/svg+xml'}),filename('svg'));$('export-menu').open=false;status('SVG exported');};
  $('png-export').onclick=()=>{
    const out=exportSVG(),url=URL.createObjectURL(new Blob([out.text],{type:'image/svg+xml'})),img=new Image();
    img.onload=()=>{try{const scale=Math.min(2,4096/out.bounds.w,4096/out.bounds.h),canvas=document.createElement('canvas');canvas.width=Math.ceil(out.bounds.w*scale);canvas.height=Math.ceil(out.bounds.h*scale);const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(blob){download(blob,filename('png'));status('PNG exported');}else status('PNG export failed — try SVG instead');},'image/png');}catch{status('PNG export failed — try SVG instead');}finally{URL.revokeObjectURL(url);}};
    img.onerror=()=>{URL.revokeObjectURL(url);status('PNG export failed — try SVG instead');};img.src=url;$('export-menu').open=false;
  };
  $('pptx-export').onclick = async () => {
    finishEdit();
    $('export-menu').open = false;
    const button = $('pptx-export');
    button.disabled = true;
    status('Creating PowerPoint…');
    try {
      if (typeof PptxGenJS === 'undefined') throw new Error('PowerPoint library unavailable');
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE';
      pptx.author = 'Flowchart Studio';
      pptx.title = chart.title || 'Flowchart';
      pptx.subject = 'Editable flowchart';
      const slide = pptx.addSlide();
      slide.background = { color: 'FFFFFF' };
      slide.addText(pptx.title, { x: 0.4, y: 0.2, w: 12.53, h: 0.4, fontFace: 'Arial', fontSize: 20, bold: true, color: '1E293B', margin: 0 });
      const b = bounds(), scale = Math.min(12.53 / b.w, 6.3 / b.h);
      const offsetX = (13.333 - b.w * scale) / 2;
      const offsetY = 0.8 + (6.3 - b.h * scale) / 2;
      const x = value => offsetX + (value - b.x) * scale;
      const y = value => offsetY + (value - b.y) * scale;
      // Separate editable line segments retain the canvas's orthogonal routes.
      chart.edges.forEach(edge => {
        const r = route(edge);
        const points = r.points.filter((p, i, all) => !i || p.x !== all[i - 1].x || p.y !== all[i - 1].y);
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], z = points[i];
          slide.addShape(pptx.ShapeType.line, {
            x: x(Math.min(a.x, z.x)), y: y(Math.min(a.y, z.y)),
            w: Math.abs(z.x - a.x) * scale, h: Math.abs(z.y - a.y) * scale,
            flipH: z.x < a.x, flipV: z.y < a.y,
            line: { color: '475569', width: 2 * scale * 72,
              endArrowType: i === points.length - 1 ? 'triangle' : 'none' }
          });
        }
        if (edge.text) {
          const width = edge.text.length * 8 + 16;
          slide.addText(edge.text, { x: x(r.label.x - width / 2), y: y(r.label.y - 12),
            w: width * scale, h: 24 * scale, fontFace: 'Arial', fontSize: 13 * scale * 72,
            color: '334155', fill: { color: 'FFFFFF' }, align: 'center', valign: 'middle', margin: 0, breakLine: false });
        }
      });
      const shapes = { terminator: 'flowChartTerminator', process: 'rect', decision: 'diamond', io: 'parallelogram', subroutine: 'flowChartPredefinedProcess' };
      chart.nodes.forEach(node => {
        const { w, h, lines } = dimensions(node), style = types[node.type];
        slide.addText(lines.join('\n'), {
          shape: pptx.ShapeType[shapes[node.type]],
          x: x(node.x - w / 2), y: y(node.y - h / 2), w: w * scale, h: h * scale,
          fill: { color: style.fill.slice(1) }, line: { color: style.stroke.slice(1), width: 2 * scale * 72 },
          fontFace: 'Arial', fontSize: 14 * scale * 72, color: '1E293B',
          align: 'center', valign: 'middle', margin: 0, wrap: false,
          objectName: `${node.type}: ${node.text}`
        });
      });
      const name = filename('pptx');
      const blob = await pptx.write({ outputType: 'blob', compression: true });
      download(blob, name);
      status('PowerPoint downloaded with editable shapes and arrows');
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      status('Could not create PowerPoint. Check that the vendor folder is beside flowchart.html.');
    } finally {
      button.disabled = false;
    }
  };
  window.addEventListener('beforeprint', () => {
    finishEdit();
    const title = document.createElement('h2');
    title.textContent = chart.title || 'Flowchart';
    const drawing = new DOMParser().parseFromString(exportSVG().text, 'image/svg+xml').documentElement;
    $('print-output').replaceChildren(title, drawing);
  });
  window.addEventListener('afterprint', () => $('print-output').replaceChildren());
  $('print').onclick=()=>{$('export-menu').open=false;window.print();};
  document.addEventListener('keydown',event=>{
    if (event.key === 'Escape' && whiteboardView) {
      event.preventDefault();
      exitWhiteboard();
      return;
    }
    if (event.key === 'Escape' && $('export-menu').open) {
      $('export-menu').open = false;
      $('export-menu').querySelector('summary').focus();
      return;
    }
    if(event.target.closest('input,textarea,select'))return;
    const command=event.ctrlKey||event.metaKey,key=event.key.toLowerCase();
    if(command&&key==='z'){event.preventDefault();if(event.shiftKey)restore(future,history);else restore(history,future);}
    else if(command&&key==='y'){event.preventDefault();restore(future,history);}
    else if(command&&key==='s'){event.preventDefault();$('save').click();}
    else if(command&&key==='d'){event.preventDefault();duplicate();}
    else if(key==='delete'||key==='backspace'){event.preventDefault();remove();}
    else if(key==='escape'){setTool('select');select(null,null);}
    else if(!command&&['v','c','h'].includes(key))setTool({v:'select',c:'connect',h:'pan'}[key]);
    else if(key==='enter'&&event.target.closest('.node,.edge')){const item=event.target.closest('.node,.edge');if(tool==='connect'&&item.classList.contains('node'))connect(item.dataset.id);else{select(item.classList.contains('node')?'nodes':'edges',item.dataset.id);$('label-input').focus();}}
    else if(selected?.kind==='nodes'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();change(()=>{const n=selectedItem(),step=event.shiftKey?40:10;n.x+=event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0;n.y+=event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0;});}
  });
  document.addEventListener('click',event=>{if(!event.target.closest('#export-menu'))$('export-menu').open=false;});
  window.addEventListener('pagehide',()=>{finishEdit();if(urlUpdateTimer!==null)syncAddressBar();});
  window.addEventListener('blur',()=>{if(urlUpdateTimer!==null)syncAddressBar();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&urlUpdateTimer!==null)syncAddressBar();});
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){chart=validate(JSON.parse(saved));$('chart-title').value=chart.title;status('Restored your browser draft');}}
  catch{status('Could not restore the draft — open a saved chart file if available');}
  function importURLChart() {
    clearTimeout(urlUpdateTimer);
    urlUpdateTimer = null;
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (!params.has('chart')) return;
    try {
      const payload = params.get('chart');
      if (payload.length > 2_000_000) throw new Error('Chart too large');
      const incoming = validate(JSON.parse(payload));
      replaceChart(incoming);
      status('Chart imported — ready to edit. Undo restores your previous draft.');
      // Keep the snapshot in the address bar; subsequent edits update it in place.
      syncAddressBar();
    } catch {
      status('Could not open the chart in this link. Your browser draft has been kept.');
    }
  }
  importURLChart();
  if (!new URLSearchParams(window.location.hash.slice(1)).has('chart')) syncAddressBar();
  window.addEventListener('hashchange', importURLChart);
  applyTheme();inspect();if(chart.nodes.length)requestAnimationFrame(fit);
})();
