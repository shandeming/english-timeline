(() => {
  'use strict';
  const C = globalThis.EnglishTimeline;
  const PREFIX = 'english-timeline:';
  let settings = C.settings();
  let activeId = null;
  let marks = [];
  let ready = false;
  let generation = 0;
  let player, video, progress, markerLayer, toggle, panel, toast;
  let panelOpen = false;
  let toastTimer;
  let saveQueue = Promise.resolve();

  function el(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(label, className, action) {
    const node = el('button', className, label);
    node.type = 'button';
    node.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation(); action();
    });
    return node;
  }
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { if (toast) toast.hidden = true; }, 2200);
  }
  function playable() {
    return ready && activeId && video && Number.isFinite(video.duration) && video.duration > 0
      && !player?.classList.contains('ad-showing');
  }
  function persist() {
    // Capture the video and data now, so navigation cannot save into the next video.
    const id = activeId;
    const snapshot = marks.map(m => ({ ...m }));
    saveQueue = saveQueue.catch(() => {}).then(() => chrome.storage.local.set({ [PREFIX + id]: snapshot }))
      .catch(() => notify('Could not save marks. Please reload this tab.'));
  }
  function mark() {
    if (!playable()) { notify('Wait for the video to load or the ad to finish.'); return; }
    const time = video.currentTime;
    if (marks.some(m => Math.abs(m.time - time) < 0.6)) { notify('This moment is already marked.'); return; }
    marks.push({ id: crypto.randomUUID(), time });
    marks.sort((a, b) => a.time - b.time);
    persist(); render(); notify(`Marked ${C.formatTime(time)}`);
  }
  function replay(time) {
    if (!playable()) { notify('Wait for the video to load or the ad to finish.'); return; }
    video.currentTime = C.replayTime(time, settings.lead, video.duration);
    video.play().catch(() => notify('Press Play to continue.'));
  }
  function remove(id) {
    marks = marks.filter(m => m.id !== id);
    persist(); render();
  }
  function renderMarkers() {
    if (!markerLayer) return;
    markerLayer.replaceChildren();
    if (!playable()) return;
    for (const m of marks) {
      if (m.time > video.duration) continue;
      const tick = button('', 'et-marker', () => replay(m.time));
      tick.style.left = `${C.position(m.time, video.duration)}%`;
      tick.title = `Replay ${C.formatTime(m.time)} (${settings.lead}s lead-in)`;
      tick.setAttribute('aria-label', tick.title);
      // Stop YouTube's seek-bar handlers from interpreting a marker click as a scrub.
      for (const name of ['pointerdown', 'mousedown', 'touchstart', 'dblclick']) {
        tick.addEventListener(name, event => event.stopPropagation());
      }
      markerLayer.append(tick);
    }
  }
  function renderPanel() {
    if (!panel) return;
    panel.hidden = !panelOpen;
    toggle?.setAttribute('aria-expanded', String(panelOpen));
    if (!panelOpen) return;
    panel.replaceChildren();
    const head = el('div', 'et-head');
    head.append(el('strong', '', 'English Timeline'), button('×', 'et-close', () => { panelOpen = false; renderPanel(); }));
    panel.append(head);
    const help = el('p', 'et-help', `Press ${settings.key} to mark a moment. Click a time to replay.`);
    panel.append(help, button('＋ Mark this moment', 'et-add', mark));
    const controls = el('div', 'et-settings');
    const keyLabel = el('label', '', 'Shortcut ');
    const keyInput = el('input', 'et-key');
    keyInput.value = settings.key; keyInput.maxLength = 1;
    keyInput.setAttribute('aria-label', 'Mark shortcut: one letter or number');
    keyInput.addEventListener('change', () => {
      settings = C.settings({ ...settings, key: keyInput.value });
      saveSettings(); render();
    });
    keyLabel.append(keyInput);
    const leadLabel = el('label', '', 'Lead-in (s) ');
    const leadInput = el('input', 'et-lead');
    leadInput.type = 'number'; leadInput.min = '0'; leadInput.max = '30'; leadInput.step = '0.5';
    leadInput.value = String(settings.lead);
    leadInput.addEventListener('change', () => {
      settings = C.settings({ ...settings, lead: Number(leadInput.value) });
      saveSettings(); render();
    });
    leadLabel.append(leadInput); controls.append(keyLabel, leadLabel); panel.append(controls);
    const list = el('div', 'et-list');
    if (!ready) list.append(el('p', 'et-empty', 'Loading saved marks…'));
    else if (!marks.length) list.append(el('p', 'et-empty', 'No marks yet. Listen and press your shortcut.'));
    for (const m of marks) {
      const row = el('div', 'et-row');
      const jump = button(`▶ ${C.formatTime(m.time)}`, 'et-jump', () => replay(m.time));
      const del = button('×', 'et-delete', () => remove(m.id));
      del.title = `Delete mark at ${C.formatTime(m.time)}`;
      del.setAttribute('aria-label', del.title);
      row.append(jump, del); list.append(row);
    }
    panel.append(list, el('div', 'et-footer', `${marks.length} saved mark${marks.length === 1 ? '' : 's'} · Stored in this browser`));
  }
  function saveSettings() {
    chrome.storage.local.set({ 'english-timeline-settings': settings })
      .catch(() => notify('Could not save settings.'));
  }
  function render() { renderMarkers(); renderPanel(); }
  function cleanUI() {
    markerLayer?.remove(); toggle?.remove(); panel?.remove(); toast?.remove();
    markerLayer = toggle = panel = toast = null;
  }
  function attach() {
    const nextPlayer = activeId ? document.querySelector('#movie_player') : null;
    const nextVideo = nextPlayer?.querySelector('video');
    const nextProgress = nextPlayer?.querySelector('.ytp-progress-bar-container');
    const controls = nextPlayer?.querySelector('.ytp-left-controls');
    if (!nextPlayer || !nextVideo || !nextProgress || !controls) {
      cleanUI(); player = video = progress = null; return;
    }
    if (player === nextPlayer && video === nextVideo && progress === nextProgress
      && toggle?.isConnected && markerLayer?.isConnected && panel?.isConnected) return;
    cleanUI(); player = nextPlayer; video = nextVideo; progress = nextProgress;
    markerLayer = el('div', 'et-marker-layer'); progress.append(markerLayer);
    toggle = button('✦', 'et-toggle ytp-button', () => { panelOpen = !panelOpen; renderPanel(); });
    toggle.title = 'English Timeline — saved sentence marks';
    toggle.setAttribute('aria-label', 'Open English Timeline bookmarks');
    controls.append(toggle);
    panel = el('section', 'et-panel'); panel.setAttribute('aria-label', 'English Timeline bookmarks');
    for (const name of ['keydown', 'pointerdown', 'mousedown', 'dblclick']) {
      panel.addEventListener(name, event => event.stopPropagation());
    }
    toast = el('div', 'et-toast'); toast.hidden = true;
    toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    player.append(panel, toast); render();
  }
  let previousDuration = NaN;
  let previousAd = false;
  async function sync() {
    const id = C.videoId(location.href);
    if (id !== activeId) {
      activeId = id; ready = false; marks = []; panelOpen = false;
      const token = ++generation;
      attach(); render();
      if (id) {
        try {
          // Include queued writes when quickly leaving and returning to a video.
          await saveQueue;
          const saved = await chrome.storage.local.get(PREFIX + id);
          if (token !== generation) return;
          marks = C.cleanMarks(saved[PREFIX + id]); ready = true; render();
        } catch { if (token === generation) notify('Could not load marks. Please reload this tab.'); }
      }
    }
    attach();
    const ad = !!player?.classList.contains('ad-showing');
    if (video?.duration !== previousDuration || ad !== previousAd) {
      previousDuration = video?.duration; previousAd = ad; renderMarkers();
    }
  }
  document.addEventListener('keydown', event => {
    const target = event.composedPath()[0];
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey
      || target?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"], .et-panel')
      || target?.isContentEditable) return;
    if (event.key.toUpperCase() === settings.key && activeId) {
      event.preventDefault(); event.stopImmediatePropagation(); mark();
    }
  }, true);
  chrome.storage.local.get('english-timeline-settings').then(saved => {
    settings = C.settings(saved['english-timeline-settings']); render();
  }).catch(() => {});
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes['english-timeline-settings']) settings = C.settings(changes['english-timeline-settings'].newValue);
    // Do not replace in-memory marks on storage events: a queued earlier write
    // can arrive after the user has already added or removed another mark.
    render();
  });
  document.addEventListener('yt-navigate-finish', sync);
  document.addEventListener('fullscreenchange', () => { attach(); render(); });
  // YouTube replaces player controls during navigation; recover without observing every page mutation.
  setInterval(sync, 750);
  sync();
})();
