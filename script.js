const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d', { alpha: false });
const frameCount = 240;
const framePath = (frame) => `./new/ezgif-frame-${String(frame + 1).padStart(3, '0')}.jpg`;
const frames = new Array(frameCount);
const loaded = new Uint8Array(frameCount);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
const projectElements = [...document.querySelectorAll('.project-container')];
const PROJECT_STEP = 0.08;
// Extend the original five-project timeline instead of shortening each card's slot.
const postProjectOffset = (projectElements.length - 5) * PROJECT_STEP;
const timelineLength = 1 + postProjectOffset;

// The script is loaded after the markup: cache once, before the first animation frame.
const UI_ELEMENTS = {
  scrollProgressEl: document.getElementById('scroll-progress'),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, index) => [
    `scene${index + 1}`, document.getElementById(`scene-${String(index + 1).padStart(2, '0')}`)
  ])),
  sceneTelemetry: document.getElementById('scene-telemetry'),
  underline: document.querySelector('.blue-underline'),
  canvas
};
const navLinks = [...document.querySelectorAll('[data-scroll-target]')];
const navigationTargets = {
  'scene-01': 0,
  'scene-02': 0.12 / timelineLength,
  'scene-04': 0.28 / timelineLength,
  'scene-05': 0.36 / timelineLength,
  'scene-07': (0.78 + postProjectOffset) / timelineLength,
  'scene-telemetry': (0.84 + postProjectOffset) / timelineLength,
  'scene-08': (0.90 + postProjectOffset) / timelineLength,
  'scene-09': (0.95 + postProjectOffset) / timelineLength,
  'scene-10': (0.99 + postProjectOffset) / timelineLength
};
const loader = document.getElementById('preloader');
const loaderProgress = document.getElementById('loader-progress');
const loaderPercentage = document.getElementById('loader-percentage');
const loaderStatus = document.getElementById('loader-status');
const sequenceStatus = document.getElementById('sequence-status');
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalNumber = document.getElementById('modal-number');
const modalTechSection = document.getElementById('modal-tech-section');
const modalTech = document.getElementById('modal-tech');
const modalHighlightSection = document.getElementById('modal-highlight-section');
const modalHighlights = document.getElementById('modal-highlights');
const modalLive = document.getElementById('modal-live');
const modalRepo = document.getElementById('modal-repo');
const cursor = document.getElementById('custom-cursor');

// Project Modal Tabs & Deep-Dive Elements
const modalTabBtns = [...document.querySelectorAll('.modal-tab-btn')];
const modalTabPanels = [...document.querySelectorAll('.modal-tab-panel')];
const modalArchContent = document.getElementById('modal-arch-content');
const modalChallengesContent = document.getElementById('modal-challenges-content');
const modalSimulatorContent = document.getElementById('modal-simulator-content');

// RAKA-BOT Elements
const rakabotFab = document.getElementById('rakabot-fab');
const rakabotDialog = document.getElementById('rakabot-dialog');
const rakabotClose = document.getElementById('rakabot-close');
const rakabotForm = document.getElementById('rakabot-form');
const rakabotInput = document.getElementById('rakabot-input');
const rakabotChat = document.getElementById('rakabot-chat');
const rakabotChips = [...document.querySelectorAll('.rakabot-chip')];

// GitHub Telemetry Elements
const ghReposCount = document.getElementById('gh-repos-count');
const ghStarsCount = document.getElementById('gh-stars-count');
const ghActiveLang = document.getElementById('gh-active-lang');

// Audio Feedback Elements
const audioToggleBtn = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');

// Background Music Elements
const bgmToggleBtn = document.getElementById('bgm-toggle');
const bgmStateEl = document.getElementById('bgm-state');
const bgmHud = document.getElementById('bgm-hud');
const bgmHudPlayBtn = document.getElementById('bgm-hud-play-btn');
const bgmHudPlayIcon = document.getElementById('bgm-hud-play-icon');
const bgmHudMuteBtn = document.getElementById('bgm-hud-mute-btn');
const bgmHudVolume = document.getElementById('bgm-hud-volume');
const bgmHudVolText = document.getElementById('bgm-hud-vol-text');
const bgmHudClose = document.getElementById('bgm-hud-close');

// Theme Switcher Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const themeNameEl = document.getElementById('theme-name');
const themeDotEl = document.getElementById('theme-dot');

// Command Palette Elements
const cmdPalette = document.getElementById('command-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');
const cmdCloseBtn = document.getElementById('cmd-close');
const cmdPaletteBtn = document.getElementById('cmd-palette-btn');
const cmdQuickTags = [...document.querySelectorAll('.cmd-tag')];

// Pipeline Simulation Elements
const simulatePipelineBtn = document.getElementById('simulate-pipeline-btn');
const pipelineHud03 = document.getElementById('pipeline-hud-info');
const pipelineHud06 = document.getElementById('pipeline-hud-info-06');
const scene03Steps = [...document.querySelectorAll('#scene-03-flow .arch-step')];
const scene06Steps = [...document.querySelectorAll('#scene-06-flow .arch-step')];

// Matrix Canvas
const matrixCanvas = document.getElementById('matrix-canvas');

// Contact Modal & Toast Elements
const contactModal = document.getElementById('contact-modal');
const contactModalClose = document.getElementById('contact-modal-close');
const openContactModalBtn = document.getElementById('open-contact-modal');
const contactForm = document.getElementById('contact-form');
const contactSubmitBtn = document.getElementById('contact-submit-btn');
const toastContainer = document.getElementById('toast-container');

// Tech Stack & Filter Elements
const techBadges = [...document.querySelectorAll('.tech-badge')];
const techHudIndicator = document.getElementById('tech-hud-indicator');
const filterPills = [...document.querySelectorAll('.filter-pill')];

// Verified public URLs & media
const PROJECT_LINKS = {
  'project-1': { live: 'https://flow-suite-beige.vercel.app/', repository: 'https://github.com/ravadakaran/Flow-Suite' },
  'project-2': { live: '', repository: 'https://github.com/ravadakaran/NETFLIX-AI-WATCH-SPACES' },
  'project-3': { live: '', repository: 'https://github.com/ravadakaran/Intelligent-traffic-management' },
  'project-5': { live: '', repository: 'https://github.com/ravadakaran/multiple-disease-prediction-' },
  'project-4': { live: 'https://kifayati.vercel.app/', repository: 'https://github.com/ravadakaran/kifayati-2' },
  'project-6': {
    live: 'https://como-phi.vercel.app/',
    repository: 'https://github.com/ravadakaran/como'
  }
};

const PROJECT_VIDEOS = {
  // Optional video preview URLs (MP4 / WebM)
  'project-1': '',
  'project-2': '',
  'project-3': '',
  'project-4': '',
  'project-5': '',
  'project-6': ''
};

const projects = projectElements.map((element, index) => ({
  element,
  trigger: element.querySelector('.project-open'),
  number: String(index + 1).padStart(2, '0'),
  title: element.querySelector('h3').textContent,
  description: element.querySelector('.proj-desc').textContent,
  tech: element.querySelector('.proj-tech')?.textContent || '',
  highlights: (element.querySelector('.proj-highlight')?.textContent || '').replace(/^Highlight:\s*/i, ''),
  image: element.querySelector('img').src,
  imageAlt: element.querySelector('img').alt,
  video: PROJECT_VIDEOS[element.id] || '',
  categories: element.dataset.category || '',
  links: PROJECT_LINKS[element.id] || { live: '', repository: '' },
  timing: [0.30, 0.34, 0.38, 0.42].map(position => position + index * PROJECT_STEP)
}));

let targetFrame = 0;
let displayedFrame = 0;
let lastDrawnFrame = -1;
let animationFrame = 0;
let navigationFrame = 0;
let scrollableHeight = 0;
let activeNavTarget = null;
let overlay = null;
let lockedScrollY = 0;
let modalTrigger = null;
let loaderLeaving = false;
let loaderTimeout = 0;
let settledFrames = 0;
let failedFrames = 0;
let nextFrameToLoad = 0;
let activeRequests = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorScale = 1;
let cursorTicking = false;

// Web Audio API Synthesizer State
let audioCtx = null;
let soundEnabled = localStorage.getItem('raka_sound_enabled') === 'true';

// Background Music State (Mandragora - Shiva)
const BGM_TRACK_URL = './background/Mandragora-Shiva-SnapYT.App.mp3';
let bgmAudio = null;
let bgmPlaying = false;
let bgmTargetVolume = parseFloat(localStorage.getItem('raka_bgm_vol') || '0.35');
if (isNaN(bgmTargetVolume) || bgmTargetVolume < 0 || bgmTargetVolume > 1) bgmTargetVolume = 0.35;
let bgmMuted = localStorage.getItem('raka_bgm_muted') === 'true';
let bgmFadeTimer = null;
let bgmUserInitiated = localStorage.getItem('raka_bgm_enabled') === 'true';

// Theme Configuration
const THEMES = ['cyan', 'emerald', 'amber', 'violet'];
const THEME_NAMES = {
  cyan: 'CYAN',
  emerald: 'EMERALD',
  amber: 'AMBER',
  violet: 'VIOLET'
};
const THEME_FREQ_MULTIPLIER = {
  cyan: 1.0,
  emerald: 1.15,
  amber: 0.88,
  violet: 1.25
};
let currentTheme = localStorage.getItem('raka_theme') || 'cyan';
if (!THEMES.includes(currentTheme)) currentTheme = 'cyan';

// ==========================================
// CANVAS & SCROLL ENGINE
// ==========================================
function resizeCanvas() {
  scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(window.innerWidth * pixelRatio));
  const height = Math.max(1, Math.round(window.innerHeight * pixelRatio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    if (context) context.imageSmoothingEnabled = true;
    lastDrawnFrame = -1;
    drawFrame(Math.round(displayedFrame));
  }
  updateTargetFrame();
}

function findLoadedFrame(frame) {
  if (loaded[frame]) return frame;
  for (let distance = 1; distance < frameCount; distance += 1) {
    const previous = frame - distance;
    const next = frame + distance;
    if (previous >= 0 && loaded[previous]) return previous;
    if (next < frameCount && loaded[next]) return next;
  }
  return -1;
}

function drawFrame(frame) {
  if (!context) return;
  const frameToDraw = findLoadedFrame(Math.max(0, Math.min(frameCount - 1, frame)));
  if (frameToDraw < 0 || frameToDraw === lastDrawnFrame) return;

  const image = frames[frameToDraw];
  // Keep the existing right-edge crop and cover fit at every viewport size.
  const sourceWidth = Math.floor(image.naturalWidth * 0.875);
  const sourceHeight = image.naturalHeight;
  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = sourceWidth / sourceHeight;
  const width = imageRatio > canvasRatio ? canvas.height * imageRatio : canvas.width;
  const height = imageRatio > canvasRatio ? canvas.height : canvas.width / imageRatio;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  context.drawImage(image, 0, 0, sourceWidth, sourceHeight, x, y, width, height);
  lastDrawnFrame = frameToDraw;
}

function getScrollProgress() {
  return scrollableHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollableHeight)) : 0;
}

function updateTargetFrame() {
  if (overlay === 'project') return;
  targetFrame = getScrollProgress() * (frameCount - 1);
  if (!animationFrame) animationFrame = requestAnimationFrame(animate);
}

function animate() {
  const difference = targetFrame - displayedFrame;
  displayedFrame = reducedMotion.matches || Math.abs(difference) < 0.02
    ? targetFrame : displayedFrame + difference * 0.14;
  // Reduced motion keeps a static backdrop, but all scenes remain accessible.
  drawFrame(reducedMotion.matches ? 0 : Math.round(displayedFrame));
  updateUI(displayedFrame / (frameCount - 1));
  animationFrame = Math.abs(targetFrame - displayedFrame) >= 0.02
    ? requestAnimationFrame(animate) : 0;
}

function lockScroll(name) {
  cancelNavigation();
  lockedScrollY = window.scrollY;
  window.scrollTo({ top: lockedScrollY, behavior: 'instant' });
  overlay = name;
  root.classList.add('is-scroll-locked');
  if (name === 'project' || name === 'palette' || name === 'bot') {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  resetCursor();
}

function unlockScroll() {
  root.classList.remove('is-scroll-locked');
  overlay = null;
  scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: Math.min(lockedScrollY, scrollableHeight), behavior: 'instant' });
  updateTargetFrame();
}

// ==========================================
// PRELOADER: bounded requests, real progress, no dead ends
// ==========================================
function updateLoadingProgress() {
  loaderProgress.value = settledFrames;
  loaderPercentage.textContent = String(Math.round(settledFrames / frameCount * 100)).padStart(3, '0');
  if (settledFrames === frameCount) {
    loaderStatus.textContent = failedFrames
      ? 'Some frames were unavailable. Your portfolio is ready to explore.'
      : 'System ready. Let’s build something interesting.';
    dismissLoader();
  }
  updateSequenceStatus();
}

function updateSequenceStatus() {
  if (loader.open) return;
  let message = '';
  if (!context || failedFrames === frameCount) {
    message = 'Animation unavailable. All portfolio content is still accessible.';
  } else if (settledFrames < frameCount) {
    message = 'You’re in. The animation is still loading in the background.';
  } else if (failedFrames) {
    message = 'Some animation frames are unavailable. You can still explore everything.';
  }
  // Do not re-announce the same live-region message on every frame download.
  if (sequenceStatus.textContent !== message) sequenceStatus.textContent = message;
  sequenceStatus.hidden = !message;
}

function dismissLoader() {
  if (!loader.open || loaderLeaving) return;
  loaderLeaving = true;
  clearTimeout(loaderTimeout);
  loader.classList.add('is-leaving');
  setTimeout(() => {
    loader.close();
    unlockScroll();
    updateSequenceStatus();
    const initialTarget = window.location.hash.slice(1);
    if (Object.hasOwn(navigationTargets, initialTarget)) {
      navigateTo(initialTarget, { history: false, smooth: false });
    }
  }, reducedMotion.matches ? 0 : 450);
}

function loadNextFrames() {
  // Avoid flooding the browser with 240 simultaneous requests.
  while (activeRequests < 8 && nextFrameToLoad < frameCount) {
    const index = nextFrameToLoad++;
    const image = new Image();
    frames[index] = image;
    image.decoding = 'async';
    activeRequests += 1;
    let settled = false;
    const timeout = setTimeout(() => finish(false), 20000);
    function finish(success) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      activeRequests -= 1;
      settledFrames += 1;
      if (success) {
        loaded[index] = 1;
        drawFrame(reducedMotion.matches ? 0 : Math.round(displayedFrame));
      } else {
        failedFrames += 1;
        image.removeAttribute('src');
      }
      updateLoadingProgress();
      loadNextFrames();
    }
    // Register handlers BEFORE src, including for memory-cache hits.
    image.onload = () => finish(image.naturalWidth > 0);
    image.onerror = () => finish(false);
    image.src = framePath(index);
  }
}

// ==========================================
// NAVIGATION: target the fully visible part of each scene
// ==========================================
function cancelNavigation() {
  cancelAnimationFrame(navigationFrame);
  navigationFrame = 0;
}

function navigateTo(id, { history = true, smooth = true } = {}) {
  if (!Object.hasOwn(navigationTargets, id) || overlay) return;
  cancelNavigation();
  if (history && window.location.hash !== `#${id}`) {
    window.history.pushState(null, '', `#${id}`);
  }
  const startY = window.scrollY;
  const startTime = performance.now();
  const duration = reducedMotion.matches || !smooth ? 0 : 1200;
  const finish = () => {
    navigationFrame = 0;
    targetFrame = displayedFrame = getScrollProgress() * (frameCount - 1);
    drawFrame(reducedMotion.matches ? 0 : Math.round(displayedFrame));
    updateUI(navigationTargets[id]);
    document.getElementById(id).focus({ preventScroll: true });
  };
  const step = (now) => {
    const elapsed = duration ? Math.min(1, (now - startTime) / duration) : 1;
    const eased = elapsed < 0.5 ? 4 * elapsed ** 3 : 1 - (-2 * elapsed + 2) ** 3 / 2;
    const destination = navigationTargets[id] * scrollableHeight;
    window.scrollTo({ top: startY + (destination - startY) * eased, behavior: 'instant' });
    updateTargetFrame();
    if (elapsed < 1) navigationFrame = requestAnimationFrame(step);
    else finish();
  };
  if (duration) navigationFrame = requestAnimationFrame(step);
  else step(startTime);
}

function updateActiveNavigation(progress) {
  const active = progress < 0.06 ? 'scene-01'
    : progress < 0.24 ? 'scene-02'
      : progress < 0.32 ? 'scene-04'
        : progress < 0.72 + postProjectOffset ? 'scene-05'
          : progress >= 0.76 + postProjectOffset && progress < 0.83 + postProjectOffset ? 'scene-07'
            : progress >= 0.965 + postProjectOffset ? 'scene-10' : '';
  if (active === activeNavTarget) return;
  activeNavTarget = active;
  navLinks.forEach((link) => {
    if (link.dataset.scrollTarget === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

// ==========================================
// AUDIO SYNTHESIZER: Web Audio API (Zero dependencies)
// ==========================================
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    const mult = THEME_FREQ_MULTIPLIER[currentTheme] || 1.0;
    const tunedFreq = freq * mult;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(tunedFreq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch { /* Audio unavailable or blocked by browser policy */ }
}

function playNavSound() {
  playTone(880, 'sine', 0.05, 0.03);
}

function playModalOpenSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    osc2.frequency.setValueAtTime(330, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.18);
    osc2.stop(audioCtx.currentTime + 0.18);
  } catch {}
}

function playModalCloseSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(580, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch {}
}

function playSuccessSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.035, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.2);
    });
  } catch {}
}

function playErrorSound() {
  playTone(220, 'sawtooth', 0.2, 0.05);
}

function updateAudioToggleUI() {
  if (!audioToggleBtn || !audioIcon) return;
  audioToggleBtn.classList.toggle('is-active', soundEnabled);
  audioIcon.textContent = soundEnabled ? '🔊' : '🔇';
  audioToggleBtn.title = soundEnabled ? 'Audio Feedback Active (Click to Mute)' : 'Audio Feedback Muted (Click to Enable)';
  audioToggleBtn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
}

// ==========================================
// BACKGROUND MUSIC CONTROLLER (Mandragora - Shiva)
// ==========================================
function initBgmAudio() {
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.src = BGM_TRACK_URL;
    bgmAudio.loop = true;
    bgmAudio.preload = 'metadata';
    bgmAudio.volume = bgmMuted ? 0 : bgmTargetVolume;

    bgmAudio.addEventListener('ended', () => {
      bgmAudio.currentTime = 0;
      bgmAudio.play().catch(() => {});
    });

    bgmAudio.addEventListener('error', (e) => {
      console.warn('BGM Audio Error:', e);
      bgmPlaying = false;
      updateBgmUI();
    });
  }
}

function fadeBgmVolume(target, duration = 600, callback = null) {
  if (!bgmAudio) return;
  clearInterval(bgmFadeTimer);
  const startVol = bgmAudio.volume;
  const delta = target - startVol;
  const steps = 20;
  const stepTime = duration / steps;
  let currentStep = 0;

  bgmFadeTimer = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const newVol = Math.max(0, Math.min(1, startVol + delta * progress));
    bgmAudio.volume = newVol;
    if (currentStep >= steps) {
      clearInterval(bgmFadeTimer);
      bgmAudio.volume = target;
      if (callback) callback();
    }
  }, stepTime);
}

function playBgm(showToastMsg = true) {
  initBgmAudio();
  if (!bgmAudio) return;

  const actualTarget = bgmMuted ? 0 : bgmTargetVolume;
  bgmAudio.volume = 0;

  const playPromise = bgmAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      bgmPlaying = true;
      localStorage.setItem('raka_bgm_enabled', 'true');
      fadeBgmVolume(actualTarget, 650);
      updateBgmUI();
      if (showToastMsg) {
        showToast('▶ BGM: Mandragora — Shiva [35% Vol]', 'info');
      }
    }).catch((err) => {
      console.warn('BGM Play prevented by browser:', err);
      bgmPlaying = false;
      updateBgmUI();
    });
  }
}

function pauseBgm(showToastMsg = true) {
  if (!bgmAudio) return;
  fadeBgmVolume(0, 350, () => {
    bgmAudio.pause();
    bgmPlaying = false;
    localStorage.setItem('raka_bgm_enabled', 'false');
    updateBgmUI();
    if (showToastMsg) {
      showToast('⏸ BGM PAUSED', 'info');
    }
  });
}

function toggleBgm() {
  if (bgmPlaying) {
    pauseBgm();
  } else {
    playBgm();
    if (bgmHud) bgmHud.hidden = false;
  }
}

function setBgmVolume(val) {
  bgmTargetVolume = Math.max(0, Math.min(1, val));
  localStorage.setItem('raka_bgm_vol', String(bgmTargetVolume));
  if (bgmTargetVolume > 0 && bgmMuted) {
    bgmMuted = false;
    localStorage.setItem('raka_bgm_muted', 'false');
  }
  if (bgmAudio && bgmPlaying && !bgmMuted) {
    bgmAudio.volume = bgmTargetVolume;
  }
  updateBgmUI();
}

function toggleBgmMute() {
  bgmMuted = !bgmMuted;
  localStorage.setItem('raka_bgm_muted', String(bgmMuted));
  if (bgmAudio) {
    bgmAudio.volume = bgmMuted ? 0 : bgmTargetVolume;
  }
  updateBgmUI();
  showToast(bgmMuted ? '🔇 BGM MUTED' : `🔊 BGM UNMUTED (${Math.round(bgmTargetVolume * 100)}%)`, 'info');
}

function updateBgmUI() {
  const isPlaying = bgmPlaying && (!bgmAudio || !bgmAudio.paused);

  if (bgmToggleBtn) {
    bgmToggleBtn.classList.toggle('is-playing', isPlaying);
    bgmToggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    bgmToggleBtn.title = isPlaying
      ? 'Background Music Active: Mandragora - Shiva (Click to Pause)'
      : 'Background Music: Mandragora - Shiva (Click to Play)';
  }
  if (bgmStateEl) {
    bgmStateEl.textContent = isPlaying ? 'ON' : 'OFF';
  }

  if (bgmHudPlayIcon) {
    bgmHudPlayIcon.textContent = isPlaying ? '⏸' : '▶';
  }
  if (bgmHudPlayBtn) {
    bgmHudPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
    bgmHudPlayBtn.title = isPlaying ? 'Pause' : 'Play';
  }
  if (bgmHud) {
    bgmHud.classList.toggle('is-playing', isPlaying);
  }
  if (bgmHudVolume) {
    bgmHudVolume.value = String(bgmTargetVolume);
  }
  if (bgmHudVolText) {
    bgmHudVolText.textContent = bgmMuted ? 'MUTED' : `${Math.round(bgmTargetVolume * 100)}%`;
  }
  if (bgmHudMuteBtn) {
    bgmHudMuteBtn.textContent = bgmMuted || bgmTargetVolume === 0 ? '🔇' : (bgmTargetVolume < 0.5 ? '🔉' : '🔊');
    bgmHudMuteBtn.title = bgmMuted ? 'Unmute' : 'Mute';
  }
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `hud-toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" type="button" aria-label="Dismiss notification">×</button>
  `;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));

  const dismiss = () => {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 320);
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, 5000);
}

// ==========================================
// PROJECT DETAILS: modal media, focus, and actions
// ==========================================
function setProjectLink(element, url) {
  // Do not turn empty, placeholder, or non-web values into clickable links.
  let valid = false;
  try {
    const parsed = new URL(url);
    valid = parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch { /* No public URL has been configured. */ }
  element.hidden = !valid;
  if (valid) element.href = url;
  else element.removeAttribute('href');
}

function openProject(project) {
  if (overlay || project.element.inert || UI_ELEMENTS.scene5.inert) return;
  modalTrigger = project.trigger;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalNumber.textContent = `${project.number} / ${String(projects.length).padStart(2, '0')}`;
  
  if (project.video) {
    modalVideo.src = project.video;
    modalVideo.hidden = false;
    modalImage.hidden = true;
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.hidden = true;
    modalImage.hidden = false;
    modalImage.src = project.image;
    modalImage.alt = project.imageAlt;
  }

  modalTech.textContent = project.tech;
  modalTechSection.hidden = !project.tech;
  modalHighlights.textContent = project.highlights;
  modalHighlightSection.hidden = !project.highlights;
  setProjectLink(modalLive, project.links.live);
  setProjectLink(modalRepo, project.links.repository);
  populateProjectDetails(project);
  switchProjectTab('overview');
  lockScroll('project');
  modal.showModal();
  modal.scrollTop = 0;
  playModalOpenSound();
}

function closeProject() {
  if (!modal.open) return;
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
  modal.close();
  unlockScroll();
  if (modalTrigger && !modalTrigger.closest('[inert]')) modalTrigger.focus({ preventScroll: true });
  playModalCloseSound();
  resetCursor();
}

// ==========================================
// PROJECT MODAL TABS & DEEP-DIVE CATALOG
// ==========================================
const PROJECT_DETAILS = {
  'project-1': {
    architecture: [
      { layer: 'FRONTEND & CLIENT STATE', desc: 'React 19 / TypeScript / TanStack Query client with optimistic mutation updates and zero layout-shift rendering.' },
      { layer: 'API GATEWAY & MULTI-TENANCY', desc: 'NestJS REST architecture with custom TenantResolver middleware extracting sub-domains and routing headers to isolated schema pools.' },
      { layer: 'DATA PERSISTENCE & RLS', desc: 'PostgreSQL managed with Prisma ORM, utilizing Row-Level Security (RLS) policies and tenant_id compound indexing.' },
      { layer: 'SECURITY & OBSERVABILITY', desc: 'JWT + Refresh token rotation, role-based access control (RBAC), and automated audit logs for compliance.' }
    ],
    challenges: [
      { title: 'Strict Cross-Tenant Data Isolation', desc: 'Prevented cross-tenant data leakage by enforcing tenant-aware Prisma extension wrappers on every SQL query, verified by integration tests.' },
      { title: 'Sub-Millisecond Auth Guarding', desc: 'Optimized stateless JWT validation using in-memory public key caching, reducing endpoint auth overhead from 18ms to <1ms.' }
    ],
    metrics: ['99.9% Uptime SLA', '<40ms P95 API Latency', 'Zero Cross-Tenant Leakage'],
    sandbox: 'flowsuite'
  },
  'project-2': {
    architecture: [
      { layer: 'MULTIMODAL AI AGENTS', desc: 'Integrated Google Gemini 1.5 Pro / Flash models for contextual film scene analysis, character sentiment extraction, and real-time trivia generation.' },
      { layer: 'STREAMING MULTIPLEXER', desc: 'Event-driven WebSocket room synchronization enabling synchronized video playback across dozens of concurrent viewers.' },
      { layer: 'INTERACTIVE STORY ENGINE', desc: 'Algorithmic branch resolution engine that calculates audience voting distribution and queues alternative narrative cuts.' }
    ],
    challenges: [
      { title: 'Sub-Second LLM Streaming to Connected Peers', desc: 'Engineered token chunking pipelines directly over WebSockets, displaying Gemini insights without interrupting active video streaming.' },
      { title: 'Audio/Video Playback Sync Across High-Jitter Networks', desc: 'Implemented an NTP-style drift-compensation algorithm that synchronizes media playback within 50ms across participants.' }
    ],
    metrics: ['<800ms Time-To-First-Token', '50ms Sync Precision', 'Gemini Multimodal API'],
    sandbox: 'aifilm'
  },
  'project-3': {
    architecture: [
      { layer: 'COMPUTER VISION PIPELINE', desc: 'YOLOv8 deep learning network trained on custom vehicle datasets for bounding-box detection, vehicle classification (Car, Truck, Bus, Ambulance), and density scoring.' },
      { layer: 'TRACKING & TRAJECTORY', desc: 'ByteTrack multi-object tracker to mitigate occlusion and estimate vehicle velocity vectors at intersections.' },
      { layer: 'ADAPTIVE SIGNAL CONTROLLER', desc: 'Python FastAPI microservice calculating dynamic green-light durations based on directional queue density and emergency preemption.' }
    ],
    challenges: [
      { title: 'High Frame-Rate Edge Inference (>35 FPS)', desc: 'Quantized YOLOv8 PyTorch model to TensorRT FP16, dropping latency per frame from 84ms to 24ms on edge hardware.' },
      { title: 'Emergency Vehicle Siren & Visual Priority', desc: 'Built a fail-safe override listener with 99.4% precision that immediately triggers green priority corridors for ambulances.' }
    ],
    metrics: ['24ms Frame Latency', '99.4% Emergency Detection', '35% Congestion Reduction'],
    sandbox: 'traffic'
  },
  'project-4': {
    architecture: [
      { layer: 'DISTRIBUTED DATA INGESTION', desc: 'Asynchronous crawler pipeline extracting, normalizing, and structuring volatile catalog feeds across multi-vendor commerce portals.' },
      { layer: 'NORMALIZATION & ARBITRAGE', desc: 'Fuzzy string matching & Levenshtein distance grouping for cross-platform SKU identification and price comparison.' },
      { layer: 'EDGE SERVING CACHE', desc: 'Redis in-memory caching layer with TTL revalidation, serving cached arbitrage graphs in under 15ms.' }
    ],
    challenges: [
      { title: 'Anti-Scraping Evasion & Rate Limit Backoff', desc: 'Designed resilient exponential backoff retry algorithms with proxy rotation and headful browser fallback for dynamic SPAs.' },
      { title: 'Real-Time Price Volatility Sync', desc: 'Implemented webhooks and background queue workers (BullMQ) to re-index volatile price drops within seconds.' }
    ],
    metrics: ['100k+ Normalized SKUs', '<15ms Cached Lookups', 'Automated Price Arbitrage'],
    sandbox: 'kifayati'
  },
  'project-5': {
    architecture: [
      { layer: 'MACHINE LEARNING ENSEMBLE', desc: 'Scikit-Learn pipeline training Support Vector Machines, Random Forests, and XGBoost classifiers on clinical diagnostic datasets.' },
      { layer: 'FEATURE ENGINEERING', desc: 'StandardScaler normalization, PCA dimensionality reduction, and synthetic minority oversampling (SMOTE) to balance clinical cohorts.' },
      { layer: 'INFERENCE API & EXPLAINABILITY', desc: 'FastAPI microservice returning calibrated risk percentiles with feature importance weights for diagnostic transparency.' }
    ],
    challenges: [
      { title: 'Minimizing Clinical False Negatives', desc: 'Tuned probability decision thresholds using Precision-Recall AUC optimization to ensure high recall on critical diagnoses.' },
      { title: 'Fast, Interpretable Patient Assessment', desc: 'Delivered instant risk estimations with human-readable diagnostic drivers for clinical review.' }
    ],
    metrics: ['94.2% Diagnostic Accuracy', '0.96 ROC-AUC', '<10ms Model Evaluation'],
    sandbox: 'disease'
  },
  'project-6': {
    architecture: [
      { layer: 'NEXT.JS APPS ROUTER & REACT 19', desc: 'Modern responsive architecture leveraging Next.js App Router, React Server Components for SEO, and client islands for high-speed interactivity.' },
      { layer: 'LOCAL INVERTED INDEX ENGINE', desc: 'Client-side inverted index matching recipes against available user bar pantry items without roundtrip database latency.' },
      { layer: 'PERSISTENT USER PANTRY', desc: 'Local-first state architecture synchronizing saved cocktails, pantry ingredients, and custom notes.' }
    ],
    challenges: [
      { title: 'Instant Matching Across Hundreds of Cocktails', desc: 'Built an in-memory bitmask matching algorithm that checks 500+ recipes against arbitrary pantry ingredients in <2ms.' },
      { title: 'Brand-Aware Ingredient Substitutions', desc: 'Structured taxonomy handling generic vs premium spirits with intelligent fallback suggestions.' }
    ],
    metrics: ['<2ms Recipe Matching', '100% Client-Side Search', '500+ Hand-Curated Recipes'],
    sandbox: 'como'
  }
};

function switchProjectTab(tabKey) {
  modalTabBtns.forEach(btn => {
    const isMatch = btn.dataset.tab === tabKey;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  modalTabPanels.forEach(panel => {
    const isMatch = panel.id === `tab-${tabKey}`;
    panel.hidden = !isMatch;
    panel.classList.toggle('active', isMatch);
  });
  playTone(550, 'sine', 0.04, 0.02);
}

function populateProjectDetails(project) {
  const details = PROJECT_DETAILS[project.element.id];
  if (!details) return;

  if (modalArchContent) {
    modalArchContent.innerHTML = details.architecture.map(layer => `
      <div class="arch-layer-card">
        <div class="arch-layer-title">${escapeHTML(layer.layer)}</div>
        <div class="arch-layer-desc">${escapeHTML(layer.desc)}</div>
      </div>
    `).join('');
  }

  if (modalChallengesContent) {
    const challengesHtml = details.challenges.map(c => `
      <div class="arch-layer-card">
        <div class="arch-layer-title">${escapeHTML(c.title)}</div>
        <div class="arch-layer-desc">${escapeHTML(c.desc)}</div>
      </div>
    `).join('');

    const metricsHtml = `
      <div class="metric-pill-group">
        ${details.metrics.map(m => `<span class="metric-pill">${escapeHTML(m)}</span>`).join('')}
      </div>
    `;

    modalChallengesContent.innerHTML = challengesHtml + metricsHtml;
  }

  if (modalSimulatorContent) {
    modalSimulatorContent.innerHTML = renderProjectSandbox(details.sandbox);
    attachSandboxListeners(details.sandbox);
  }
}

function renderProjectSandbox(type) {
  switch (type) {
    case 'traffic':
      return `
        <div class="traffic-controller-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">LIVE ADAPTIVE INTERSECTION CONTROLLER</span>
            <span class="sandbox-readout" id="traffic-status-readout">STATUS: NOMINAL</span>
          </div>
          <div class="slider-group">
            <label for="traffic-density-input">
              <span>VEHICLE QUEUE DENSITY (YOLOv8 DETECTIONS)</span>
              <span id="density-val-display" style="color:var(--blue);font-weight:700;">35 vehicles/min</span>
            </label>
            <input type="range" id="traffic-density-input" class="sandbox-slider" min="5" max="100" value="35" />
          </div>
          <div class="signal-status-display">
            <div class="signal-lights-wrap">
              <span class="signal-light green active" id="sig-green"></span>
              <span class="signal-light yellow" id="sig-yellow"></span>
              <span class="signal-light red" id="sig-red"></span>
            </div>
            <div class="signal-timing-text" id="signal-timing-display">ACTIVE GREEN INTERVAL: 31s</div>
          </div>
          <button type="button" id="ambulance-override-btn" class="sandbox-action-btn">
            🚨 SIMULATE AMBULANCE SIREN OVERRIDE
          </button>
        </div>
      `;

    case 'disease':
      return `
        <div class="disease-calculator-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">CLINICAL RISK PREDICTOR (SCIKIT-LEARN ENSEMBLE)</span>
            <span class="sandbox-readout" id="disease-risk-score" style="color:#00ff9d;font-weight:700;">CALCULATED RISK: LOW (28%)</span>
          </div>
          <div class="slider-group">
            <label for="glucose-input"><span>FASTING GLUCOSE LEVEL (mg/dL)</span><span id="glucose-val" style="color:var(--blue);font-weight:700;">110 mg/dL</span></label>
            <input type="range" id="glucose-input" class="sandbox-slider" min="70" max="250" value="110" />
          </div>
          <div class="slider-group">
            <label for="bp-input"><span>SYSTOLIC BLOOD PRESSURE (mmHg)</span><span id="bp-val" style="color:var(--blue);font-weight:700;">120 mmHg</span></label>
            <input type="range" id="bp-input" class="sandbox-slider" min="80" max="190" value="120" />
          </div>
          <div class="slider-group">
            <label for="age-input"><span>PATIENT AGE</span><span id="age-val" style="color:var(--blue);font-weight:700;">34 yrs</span></label>
            <input type="range" id="age-input" class="sandbox-slider" min="18" max="85" value="34" />
          </div>
          <div class="risk-meter-container">
            <div class="risk-meter-bar">
              <div id="risk-meter-fill" class="risk-meter-fill" style="width:28%;background:#00ff9d;"></div>
            </div>
          </div>
        </div>
      `;

    case 'flowsuite':
      return `
        <div class="org-switcher-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">MULTI-TENANT SCHEMA & RLS ISOLATION ENGINE</span>
            <span class="sandbox-readout" style="color:var(--blue);font-weight:700;" id="tenant-query-time">QUERY LATENCY: 12ms</span>
          </div>
          <p style="font-size:0.75rem;opacity:0.8;">Select an enterprise tenant to simulate automated schema partitioning and zero cross-tenant data bleed:</p>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button type="button" class="sandbox-action-btn tenant-select-btn active" data-tenant="acme">Acme Corp (#101)</button>
            <button type="button" class="sandbox-action-btn tenant-select-btn" data-tenant="starlight">Starlight Labs (#102)</button>
            <button type="button" class="sandbox-action-btn tenant-select-btn" data-tenant="venture">Venture X (#103)</button>
          </div>
          <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:2px;font-size:0.75rem;line-height:1.6;" id="tenant-telemetry-box">
            <div><strong style="color:var(--blue);">ACTIVE SCHEMA:</strong> tenant_acme_101</div>
            <div><strong>AUTH STRATEGY:</strong> Subdomain TenantResolver + Prisma Context RLS</div>
            <div><strong>ISOLATION STATUS:</strong> <span style="color:#00ff9d;font-weight:700;">ENFORCED (0 Leakage)</span></div>
            <div><strong>MEMBER SEATS:</strong> 48 Active Users // Tier: Enterprise Scale</div>
          </div>
        </div>
      `;

    case 'como':
      return `
        <div class="bar-matcher-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">INVERTED-INDEX BAR PANTRY MATCHER</span>
            <span class="sandbox-readout" id="match-speed-readout" style="color:var(--blue);">MATCH LATENCY: 1.4ms</span>
          </div>
          <p style="font-size:0.75rem;opacity:0.8;">Click bottles in your home bar to compute instant cocktail recipe matching:</p>
          <div class="ingredient-chips-grid" id="bar-ingredient-chips">
            <button type="button" class="ingredient-chip selected" data-ing="Gin">Gin</button>
            <button type="button" class="ingredient-chip selected" data-ing="Campari">Campari</button>
            <button type="button" class="ingredient-chip selected" data-ing="Sweet Vermouth">Sweet Vermouth</button>
            <button type="button" class="ingredient-chip" data-ing="Lime">Lime Juice</button>
            <button type="button" class="ingredient-chip" data-ing="Vodka">Vodka</button>
            <button type="button" class="ingredient-chip" data-ing="Whiskey">Whiskey</button>
            <button type="button" class="ingredient-chip" data-ing="Bitters">Bitters</button>
          </div>
          <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border:1px solid var(--blue);border-radius:2px;font-size:0.8rem;" id="cocktail-result-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:var(--blue);font-size:0.9rem;">NEGRONI</strong>
              <span style="color:#00ff9d;font-weight:700;">100% MATCH</span>
            </div>
            <p style="font-size:0.75rem;margin-top:0.35rem;opacity:0.85;">Equal parts Gin, Sweet Vermouth, and Campari stirred over ice with an orange peel.</p>
          </div>
        </div>
      `;

    case 'aifilm':
      return `
        <div class="aifilm-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">GEMINI MULTIMODAL NARRATIVE PREDICTOR</span>
            <span class="sandbox-readout" style="color:var(--blue);">LATENCY: 420ms</span>
          </div>
          <p style="font-size:0.75rem;opacity:0.8;">Select a live storyline divergence to test Gemini 1.5 dynamic scene synthesis:</p>
          <div style="display:flex;gap:0.4rem;flex-direction:column;">
            <button type="button" class="sandbox-action-btn scene-choice-btn active" data-choice="airlock">Option A: Breach the derelict alien station airlock</button>
            <button type="button" class="sandbox-action-btn scene-choice-btn" data-choice="beacon">Option B: Broadcast high-gain distress beacon</button>
            <button type="button" class="sandbox-action-btn scene-choice-btn" data-choice="warp">Option C: Emergency spool warp drive to unknown sector</button>
          </div>
          <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border:1px solid var(--blue);border-radius:2px;font-size:0.8rem;line-height:1.6;" id="scene-narrative-output">
            <span style="color:var(--blue);font-weight:700;">[GEMINI MULTIMODAL PROMPT INGESTION]</span><br>
            Airlock decompression triggered. Pressure readings stabilize at 0.8 bar. Motion sensor detects low-frequency resonance within the bulkhead corridor. Audience vote locked.
          </div>
        </div>
      `;

    case 'kifayati':
      return `
        <div class="kifayati-ui">
          <div class="sandbox-header">
            <span class="sandbox-title">REAL-TIME MULTI-VENDOR ARBITRAGE SCANNER</span>
            <span class="sandbox-readout" style="color:#00ff9d;font-weight:700;">INDEX STATUS: ACTIVE</span>
          </div>
          <p style="font-size:0.75rem;opacity:0.8;">Simulate concurrent price scraping across 4 vendor pipelines with automated fuzzy SKU normalization:</p>
          <button type="button" id="run-arbitrage-btn" class="sandbox-action-btn">
            ⚡ RUN PARALLEL ARBITRAGE SCAN (4 STORES)
          </button>
          <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:2px;font-size:0.75rem;line-height:1.6;" id="arbitrage-results-box">
            <div><strong>TARGET SKU:</strong> Mechanical Keyboard Pro RGB (Fuzzy Match: 98.4%)</div>
            <div style="display:flex;justify-content:space-between;margin-top:0.3rem;">
              <span>Store A: $149.99</span>
              <span>Store B: $134.50</span>
              <span style="color:#00ff9d;font-weight:700;">Store C: $118.00 (BEST)</span>
              <span>Store D: $142.00</span>
            </div>
            <div style="color:var(--blue);margin-top:0.35rem;font-weight:700;">OPTIMAL ARBITRAGE DELTA: $31.99 (21.3% Savings) // Pipeline time: 14ms</div>
          </div>
        </div>
      `;

    default:
      return '<div class="sandbox-readout">Sandbox initialized for this project.</div>';
  }
}

function attachSandboxListeners(type) {
  if (type === 'traffic') {
    const slider = document.getElementById('traffic-density-input');
    const display = document.getElementById('density-val-display');
    const timingDisplay = document.getElementById('signal-timing-display');
    const overrideBtn = document.getElementById('ambulance-override-btn');
    const readout = document.getElementById('traffic-status-readout');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (display) display.textContent = `${val} vehicles/min`;
        const greenTime = Math.max(15, Math.min(60, Math.round(15 + val * 0.45)));
        if (timingDisplay) timingDisplay.textContent = `ACTIVE GREEN INTERVAL: ${greenTime}s`;
        playTone(350 + val * 3, 'sine', 0.03, 0.02);
      });
    }

    if (overrideBtn) {
      overrideBtn.addEventListener('click', () => {
        if (readout) {
          readout.textContent = 'SIREN DETECTED: EMERGENCY PREEMPTION ACTIVE';
          readout.style.color = '#ff3366';
        }
        if (timingDisplay) timingDisplay.textContent = 'AMBULANCE PRIORITY: SIGNAL FORCED GREEN';
        playTone(880, 'sawtooth', 0.15, 0.05);
        setTimeout(() => playTone(1174, 'sawtooth', 0.2, 0.05), 150);
        showToast('EMERGENCY VEHICLE PREEMPTION: Priority green wave granted', 'info');
      });
    }
  } else if (type === 'disease') {
    const glucoseInput = document.getElementById('glucose-input');
    const bpInput = document.getElementById('bp-input');
    const ageInput = document.getElementById('age-input');
    const glucoseVal = document.getElementById('glucose-val');
    const bpVal = document.getElementById('bp-val');
    const ageVal = document.getElementById('age-val');
    const riskScore = document.getElementById('disease-risk-score');
    const fill = document.getElementById('risk-meter-fill');

    const updateRisk = () => {
      const g = parseInt(glucoseInput?.value || 110, 10);
      const bp = parseInt(bpInput?.value || 120, 10);
      const a = parseInt(ageInput?.value || 34, 10);

      if (glucoseVal) glucoseVal.textContent = `${g} mg/dL`;
      if (bpVal) bpVal.textContent = `${bp} mmHg`;
      if (ageVal) ageVal.textContent = `${a} yrs`;

      const risk = Math.min(98, Math.max(5, Math.round((g - 70) * 0.35 + (bp - 80) * 0.25 + (a - 18) * 0.3)));
      const color = risk > 65 ? '#ff3366' : risk > 35 ? '#ffb700' : '#00ff9d';
      const label = risk > 65 ? 'ELEVATED' : risk > 35 ? 'MODERATE' : 'LOW';

      if (riskScore) {
        riskScore.textContent = `CALCULATED RISK: ${label} (${risk}%)`;
        riskScore.style.color = color;
      }
      if (fill) {
        fill.style.width = `${risk}%`;
        fill.style.background = color;
      }
      playTone(400 + risk * 4, 'sine', 0.03, 0.02);
    };

    [glucoseInput, bpInput, ageInput].forEach(inp => {
      if (inp) inp.addEventListener('input', updateRisk);
    });
  } else if (type === 'flowsuite') {
    const btns = [...document.querySelectorAll('.tenant-select-btn')];
    const box = document.getElementById('tenant-telemetry-box');
    const timeReadout = document.getElementById('tenant-query-time');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tenant = btn.dataset.tenant;
        playTone(600, 'sine', 0.05, 0.03);

        const lat = 10 + Math.floor(Math.random() * 6);
        if (timeReadout) timeReadout.textContent = `QUERY LATENCY: ${lat}ms`;

        if (box) {
          const names = {
            acme: { schema: 'tenant_acme_101', users: 48, tier: 'Enterprise Scale' },
            starlight: { schema: 'tenant_starlight_102', users: 16, tier: 'Growth Team' },
            venture: { schema: 'tenant_venture_103', users: 124, tier: 'Global Multi-Region' }
          };
          const data = names[tenant] || names.acme;
          box.innerHTML = `
            <div><strong style="color:var(--blue);">ACTIVE SCHEMA:</strong> ${data.schema}</div>
            <div><strong>AUTH STRATEGY:</strong> Subdomain TenantResolver + Prisma Context RLS</div>
            <div><strong>ISOLATION STATUS:</strong> <span style="color:#00ff9d;font-weight:700;">ENFORCED (0 Leakage)</span></div>
            <div><strong>MEMBER SEATS:</strong> ${data.users} Active Users // Tier: ${data.tier}</div>
          `;
        }
      });
    });
  } else if (type === 'como') {
    const chips = [...document.querySelectorAll('#bar-ingredient-chips .ingredient-chip')];
    const card = document.getElementById('cocktail-result-card');
    const speed = document.getElementById('match-speed-readout');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        playTone(580, 'sine', 0.04, 0.02);

        const selected = chips.filter(c => c.classList.contains('selected')).map(c => c.dataset.ing);
        if (speed) speed.textContent = `MATCH LATENCY: ${(0.8 + Math.random() * 0.8).toFixed(1)}ms`;

        if (!card) return;
        if (selected.includes('Gin') && selected.includes('Campari') && selected.includes('Sweet Vermouth')) {
          card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:var(--blue);font-size:0.9rem;">NEGRONI</strong>
              <span style="color:#00ff9d;font-weight:700;">100% MATCH</span>
            </div>
            <p style="font-size:0.75rem;margin-top:0.35rem;opacity:0.85;">Equal parts Gin, Sweet Vermouth, and Campari stirred over ice with an orange peel.</p>
          `;
        } else if (selected.includes('Gin') && selected.includes('Lime')) {
          card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:var(--blue);font-size:0.9rem;">GIMLET</strong>
              <span style="color:#00ff9d;font-weight:700;">100% MATCH</span>
            </div>
            <p style="font-size:0.75rem;margin-top:0.35rem;opacity:0.85;">Gin shaken with fresh lime juice and simple syrup. Crisp, tart, and aromatic.</p>
          `;
        } else if (selected.includes('Whiskey') && selected.includes('Bitters')) {
          card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:var(--blue);font-size:0.9rem;">OLD FASHIONED</strong>
              <span style="color:#00ff9d;font-weight:700;">100% MATCH</span>
            </div>
            <p style="font-size:0.75rem;margin-top:0.35rem;opacity:0.85;">Bourbon or Rye with Angostura bitters and orange zest over a large clear ice cube.</p>
          `;
        } else {
          card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="color:var(--white);font-size:0.9rem;">PARTIAL INGREDIENTS DETECTED</strong>
              <span style="color:#ffb700;font-weight:700;">MATCHING...</span>
            </div>
            <p style="font-size:0.75rem;margin-top:0.35rem;opacity:0.85;">Add Gin + Campari + Sweet Vermouth for a Negroni, or Whiskey + Bitters for an Old Fashioned.</p>
          `;
        }
      });
    });
  } else if (type === 'aifilm') {
    const btns = [...document.querySelectorAll('.scene-choice-btn')];
    const output = document.getElementById('scene-narrative-output');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playTone(720, 'sine', 0.05, 0.03);

        const choice = btn.dataset.choice;
        const narratives = {
          airlock: '<span style="color:var(--blue);font-weight:700;">[GEMINI MULTIMODAL INGESTION]</span><br>Airlock decompression triggered. Pressure readings stabilize at 0.8 bar. Motion sensor detects low-frequency resonance within the bulkhead corridor. Audience vote locked.',
          beacon: '<span style="color:var(--blue);font-weight:700;">[GEMINI MULTIMODAL INGESTION]</span><br>Distress beacon pulsed across subspace channels. Sensor sweep reveals three unrecognized warp signatures dropping out of hyperspace. Threat level elevated.',
          warp: '<span style="color:var(--blue);font-weight:700;">[GEMINI MULTIMODAL INGESTION]</span><br>Warp field coil energized at 104% tolerance. The ship breaches uncharted coordinates bordering an ionized accretion disc. Visual timeline fork updated.'
        };
        if (output) output.innerHTML = narratives[choice] || narratives.airlock;
      });
    });
  } else if (type === 'kifayati') {
    const btn = document.getElementById('run-arbitrage-btn');
    const box = document.getElementById('arbitrage-results-box');

    if (btn) {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        playTone(600, 'sine', 0.08, 0.03);
        if (box) box.innerHTML = '<span style="color:var(--blue);">[PARALLEL SCRAPING ACTIVE] Querying Store A, Store B, Store C, Store D...</span>';

        setTimeout(() => {
          btn.disabled = false;
          playSuccessSound();
          if (box) {
            const savings = (25 + Math.random() * 15).toFixed(2);
            box.innerHTML = `
              <div><strong>TARGET SKU:</strong> Mechanical Keyboard Pro RGB (Fuzzy Match: 98.4%)</div>
              <div style="display:flex;justify-content:space-between;margin-top:0.3rem;">
                <span>Store A: $149.99</span>
                <span>Store B: $134.50</span>
                <span style="color:#00ff9d;font-weight:700;">Store C: $118.00 (BEST)</span>
                <span>Store D: $142.00</span>
              </div>
              <div style="color:var(--blue);margin-top:0.35rem;font-weight:700;">OPTIMAL ARBITRAGE DELTA: $${savings} // Pipeline time: 14ms</div>
            `;
          }
        }, 600);
      });
    }
  }
}

// ==========================================
// RAKA-BOT AI SYSTEM ASSISTANT ENGINE
// ==========================================
let rakabotTrigger = null;

function openRakabot() {
  if (overlay || !rakabotDialog) return;
  rakabotTrigger = document.activeElement;
  lockScroll('bot');
  rakabotDialog.showModal();
  if (rakabotInput) rakabotInput.focus();
  playModalOpenSound();
}

function closeRakabot() {
  if (!rakabotDialog || !rakabotDialog.open) return;
  rakabotDialog.close();
  unlockScroll();
  if (rakabotTrigger && typeof rakabotTrigger.focus === 'function' && !rakabotTrigger.closest('[inert]')) {
    rakabotTrigger.focus({ preventScroll: true });
  }
  rakabotTrigger = null;
  playModalCloseSound();
  resetCursor();
}

function appendRakabotMessage(author, text, isUser = false) {
  if (!rakabotChat) return;
  const msgEl = document.createElement('div');
  msgEl.className = isUser ? 'user-msg' : 'bot-msg';
  msgEl.innerHTML = `
    <div class="msg-author">${escapeHTML(author)}</div>
    <div class="msg-text">${text}</div>
  `;
  rakabotChat.appendChild(msgEl);
  rakabotChat.scrollTop = rakabotChat.scrollHeight;
  if (!isUser) {
    playTone(660, 'sine', 0.08, 0.03);
  }
}

function getRakabotResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('yolo') || q.includes('traffic') || q.includes('vision') || q.includes('ambulance')) {
    return 'Karan engineered the <strong>Intelligent Traffic Management</strong> system using <strong>YOLOv8 + ByteTrack + FastAPI</strong>. It quantizes deep-learning models for 24ms edge inference, dynamically calculates green-light intervals based on directional congestion, and features an automated siren & visual emergency preemption protocol for ambulances.';
  }

  if (q.includes('flowsuite') || q.includes('saas') || q.includes('multi-tenant') || q.includes('nest')) {
    return '<strong>Flowsuite</strong> is a multi-tenant SaaS platform Karan built using <strong>React, TypeScript, NestJS, Prisma, and PostgreSQL</strong>. It enforces strict database Row-Level Security (RLS) with sub-domain tenant resolution middleware, preventing cross-tenant data bleed with <40ms P95 latency.';
  }

  if (q.includes('como') || q.includes('cocktail') || q.includes('drink') || q.includes('bar')) {
    return '<strong>Como</strong> is a cocktail & mocktail discovery web app built with <strong>Next.js (App Router), TypeScript, and Tailwind CSS</strong>. It features client-side inverted-index matching across 500+ recipes against whatever ingredients are in your personal home bar in <2ms.';
  }

  if (q.includes('disease') || q.includes('diabetes') || q.includes('medical') || q.includes('clinical')) {
    return 'Karan developed the <strong>Multiple Disease Prediction</strong> system using Scikit-Learn ensembles (SVM, Random Forest, XGBoost) and FastAPI. It achieves 94.2% clinical diagnostic accuracy with calibrated risk probability scoring across diabetes, heart disease, and Parkinson\'s.';
  }

  if (q.includes('gemini') || q.includes('film') || q.includes('watchroom') || q.includes('watch') || q.includes('netflix')) {
    return '<strong>AI Film / Watchroom</strong> integrates <strong>Google Gemini Multimodal AI</strong> with WebSocket collaborative rooms. It analyzes video frames in real-time, extracts character sentiment, and resolves dynamic branching narrative paths based on audience live voting.';
  }

  if (q.includes('kifayati') || q.includes('scrape') || q.includes('price') || q.includes('arbitrage')) {
    return '<strong>Kifayati</strong> is a high-throughput smart data aggregation platform that crawls, fuzzy-matches, and normalizes catalog feeds across multi-vendor stores to surface real-time price arbitrage with Redis in-memory caching (<15ms lookups).';
  }

  if (q.includes('stack') || q.includes('backend') || q.includes('frontend') || q.includes('tech') || q.includes('skills')) {
    return '<strong>Karan\'s Core Technology Stack:</strong><br>• <em>Frontend:</em> React 19, Next.js, TypeScript, Vite, Tailwind CSS, Canvas WebGL<br>• <em>Backend & APIs:</em> NestJS, Node.js, Express, Python FastAPI, Spring Boot<br>• <em>Databases:</em> PostgreSQL, MySQL, MongoDB, Prisma ORM, Redis<br>• <em>AI & ML:</em> YOLOv8, Computer Vision, Gemini Multimodal API, Scikit-Learn<br>• <em>Infra & Cloud:</em> Docker, Git, GitHub Actions, Vercel, Render, Neon';
  }

  if (q.includes('hire') || q.includes('job') || q.includes('available') || q.includes('role') || q.includes('interview') || q.includes('work')) {
    return '<strong>Yes! Karan is actively open</strong> to Full-Time roles, AI/ML Engineering opportunities, and high-impact Full-Stack architecture projects. You can transmit a direct message via the portfolio contact modal or reach out directly at <a href="mailto:ravadakaran733@gmail.com" class="text-blue" style="text-decoration:underline;">ravadakaran733@gmail.com</a>.';
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) {
    return 'You can view or download Karan\'s official resume here: <a href="./resume/resume.pdf" target="_blank" class="text-blue" style="text-decoration:underline;font-weight:700;">Ravada_Karan_Resume.pdf (Direct Link) ↗</a>.';
  }

  if (q.includes('experience') || q.includes('intern') || q.includes('navodita')) {
    return 'Karan worked as a <strong>Full-Stack Developer Intern at Navodita Infotech</strong>, where he engineered modern full-stack architectures, responsive frontend interfaces, robust database integrations, and scalable production deployment pipelines.';
  }

  if (q.includes('music') || q.includes('bgm') || q.includes('soundtrack') || q.includes('song') || q.includes('shiva') || q.includes('mandragora')) {
    if (q.includes('stop') || q.includes('pause') || q.includes('mute') || q.includes('off') || q.includes('quiet')) {
      if (bgmPlaying) pauseBgm();
      return 'Background music paused. You can resume the cyber soundtrack anytime by hitting <strong>BGM</strong> in the navbar or typing <strong>music</strong> in the command palette.';
    }
    if (!bgmPlaying) playBgm();
    if (bgmHud) bgmHud.hidden = false;
    return 'Now playing: <strong>"Shiva" by Mandragora</strong> from Karan\'s background cyber sound library. High-energy Brazilian psytrance configured to loop for high-intensity engineering sessions!';
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who')) {
    return 'Greetings! I am <strong>RAKA-BOT</strong>, the AI system persona representing <strong>Ravada Karan (Raka)</strong>. Ask me about his projects (Flowsuite, YOLOv8 Traffic, Como, AI Film), technical stack, hiring status, or click any prompt chip above!';
  }

  return 'I am tuned to Karan\'s technical engineering knowledge base. You can ask about his <strong>YOLOv8 Computer Vision system</strong>, <strong>Flowsuite multi-tenancy</strong>, <strong>AI Film with Gemini</strong>, his <strong>Full-Stack technologies</strong>, or whether he is <strong>available for hire</strong>!';
}

function handleRakabotSubmit(e) {
  if (e) e.preventDefault();
  if (!rakabotInput) return;
  const query = rakabotInput.value.trim();
  if (!query) return;
  appendRakabotMessage('YOU', escapeHTML(query), true);
  rakabotInput.value = '';
  playTone(500, 'sine', 0.05, 0.02);

  setTimeout(() => {
    const reply = getRakabotResponse(query);
    appendRakabotMessage('RAKA-BOT // AI CORE', reply, false);
  }, 350);
}

// ==========================================
// GITHUB TELEMETRY / PULSE SYNC
// ==========================================
async function syncGitHubTelemetry() {
  try {
    const response = await fetch('https://api.github.com/users/ravadakaran/repos?sort=updated&per_page=12');
    if (!response.ok) return;
    const repos = await response.json();
    if (Array.isArray(repos) && repos.length > 0) {
      if (ghReposCount) ghReposCount.textContent = `${repos.length}+`;
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      if (ghStarsCount) ghStarsCount.textContent = `★ ${Math.max(24, stars)}`;
      const languages = repos.map(r => r.language).filter(Boolean);
      const topLang = languages[0] || 'TypeScript';
      if (ghActiveLang) ghActiveLang.textContent = topLang;
    }
  } catch {
    if (ghReposCount) ghReposCount.textContent = '18+';
    if (ghStarsCount) ghStarsCount.textContent = '★ 24';
    if (ghActiveLang) ghActiveLang.textContent = 'TypeScript';
  }
}

// ==========================================
// CONTACT MODAL & FORM VALIDATION
// ==========================================
let contactModalTrigger = null;

function openContactModal(trigger = null) {
  if (overlay) return;
  contactModalTrigger = trigger instanceof Element ? trigger : (document.activeElement || null);
  lockScroll('contact');
  contactModal.showModal();
  contactModal.scrollTop = 0;
  playModalOpenSound();
}

function closeContactModal() {
  if (!contactModal.open) return;
  contactModal.close();
  unlockScroll();
  if (contactModalTrigger && typeof contactModalTrigger.focus === 'function' && !contactModalTrigger.closest('[inert]')) {
    contactModalTrigger.focus({ preventScroll: true });
  }
  contactModalTrigger = null;
  playModalCloseSound();
  resetCursor();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    let isValid = true;

    // Reset previous errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    messageInput.classList.remove('is-invalid');

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please provide your identity / name.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      emailError.textContent = 'Please provide a valid return email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
      messageError.textContent = 'Transmission message is too brief.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      playErrorSound();
      return;
    }

    // Real Web3Forms Transmission
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.classList.add('is-sending');
    playTone(440, 'sine', 0.1, 0.03);

    const formData = new FormData(contactForm);
    const formJson = JSON.stringify(Object.fromEntries(formData));

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: formJson
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200 && result.success) {
          playSuccessSound();
          showToast('TRANSMISSION DELIVERED: Message sent directly to Karan\'s inbox!', 'success');
          contactForm.reset();
          setTimeout(closeContactModal, 1500);
        } else {
          throw new Error(result.message || 'Transmission failed');
        }
      })
      .catch((err) => {
        console.warn('Web3Forms transmission error:', err);
        playErrorSound();
        showToast('TRANSMISSION FAILED: Network error. Please use the OPEN CLIENT (MAILTO) link below.', 'error');
      })
      .finally(() => {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.classList.remove('is-sending');
      });
  });
}

// ==========================================
// CATEGORY FILTERING & TECH STACK HUD
// ==========================================
function setProjectFilter(category) {
  playTone(660, 'sine', 0.05, 0.03);
  filterPills.forEach((pill) => {
    const isMatch = pill.dataset.filter === category;
    pill.classList.toggle('active', isMatch);
    pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  projects.forEach(({ element, categories }) => {
    const isVisible = category === 'all' || (categories && categories.includes(category));
    element.classList.toggle('is-filtered-out', !isVisible);
  });
}

filterPills.forEach((pill) => {
  pill.addEventListener('click', () => setProjectFilter(pill.dataset.filter));
});

const TECH_INFO = {
  'React': 'Component-driven reactive UIs utilized in Flowsuite, AI Film, and Como.',
  'TypeScript': 'Strict type-safe application architecture across full-stack repositories.',
  'JavaScript': 'ESNext, Web Audio API, and high-performance Canvas rendering engines.',
  'Vite': 'Blazing fast ESM dev server and optimized production bundler.',
  'Tailwind CSS': 'Utility-first styling systems with custom animations and fluid responsive design.',
  'Node.js': 'Event-driven asynchronous server runtimes for high-concurrency microservices.',
  'Express.js': 'RESTful API routing and middleware pipelines.',
  'NestJS': 'Enterprise-grade modular TypeScript backend architecture in Flowsuite.',
  'Spring Boot': 'Robust Java enterprise services with dependency injection and security.',
  'FastAPI': 'High-throughput async Python APIs powering AI model inference and traffic systems.',
  'Flask': 'Lightweight Python web framework for ML diagnostics endpoints.',
  'PostgreSQL': 'Relational data modeling, indexing, ACID compliance, and query tuning.',
  'MySQL': 'Structured relational storage engines with high read performance.',
  'MongoDB': 'Document-based flexible NoSQL schema for rapid prototyping and telemetry.',
  'Prisma': 'Next-generation ORM for type-safe database queries and migrations.',
  'Python': 'Primary language for machine learning, computer vision, and data pipelines.',
  'YOLOv8': 'Real-time object detection architecture driving Intelligent Traffic Management.',
  'Computer Vision': 'Video stream processing, density estimation, and bounding-box tracking.',
  'Machine Learning': 'Predictive classification ensembles (SVM, Random Forest, XGBoost).',
  'Gemini': 'Multimodal AI & LLM integration for conversational and contextual intelligence.',
  'LLM APIs': 'Prompt engineering, structured output parsing, and tool calling pipelines.',
  'Git': 'Version control, atomic commit hygiene, and collaborative workflows.',
  'GitHub': 'Repository hosting, GitHub Actions CI/CD automation, and open source work.',
  'Vercel': 'Edge deployments, serverless functions, and global CDN delivery.',
  'Render': 'Cloud application hosting and scalable backend deployments.',
  'Neon': 'Serverless Postgres with branchable database architecture.'
};

techBadges.forEach((badge) => {
  const tech = badge.dataset.tech;
  const selectBadge = () => {
    playTone(520, 'sine', 0.04, 0.025);
    techBadges.forEach((b) => b.classList.remove('is-selected'));
    badge.classList.add('is-selected');
    if (techHudIndicator && TECH_INFO[tech]) {
      techHudIndicator.textContent = `${tech.toUpperCase()}: ${TECH_INFO[tech]}`;
    }
  };
  badge.addEventListener('click', selectBadge);
  badge.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectBadge();
    }
  });
});

// ==========================================
// THEME SWITCHER
// ==========================================
function applyTheme(theme, playSound = false) {
  if (!THEMES.includes(theme)) theme = 'cyan';
  currentTheme = theme;
  if (theme === 'cyan') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('raka_theme', theme);
  if (themeNameEl) themeNameEl.textContent = THEME_NAMES[theme] || 'CYAN';
  if (playSound) {
    const mult = THEME_FREQ_MULTIPLIER[theme] || 1.0;
    playTone(550 * mult, 'sine', 0.1, 0.04);
    setTimeout(() => playTone(880 * mult, 'triangle', 0.12, 0.04), 80);
    showToast(`THEME ACTIVATED: ${THEME_NAMES[theme]}`, 'info');
  }
}

function cycleTheme() {
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
  applyTheme(nextTheme, true);
}

// ==========================================
// PIPELINE SIMULATION & INTERACTIVE STEPS
// ==========================================
let pipelineSimulating = false;
let simulationTimeouts = [];

function clearSimulation() {
  simulationTimeouts.forEach(t => clearTimeout(t));
  simulationTimeouts = [];
  pipelineSimulating = false;
  scene03Steps.forEach(s => s.classList.remove('is-simulating'));
  if (simulatePipelineBtn) {
    simulatePipelineBtn.disabled = false;
    simulatePipelineBtn.innerHTML = '<span class="pulse-icon" aria-hidden="true">▶</span> RUN PIPELINE SIMULATION';
  }
}

function setupPipelineSteps(steps, hudEl) {
  steps.forEach((step) => {
    const handleInspect = () => {
      if (pipelineSimulating) clearSimulation();
      steps.forEach(s => s.classList.remove('is-simulating', 'is-active-step'));
      step.classList.add('is-active-step');
      const stepName = step.dataset.step || step.textContent.trim();
      const detail = step.dataset.detail || '';
      if (hudEl) {
        hudEl.innerHTML = `<span class="hud-title">[STAGE: ${escapeHTML(stepName)}]</span> ${escapeHTML(detail)}`;
        hudEl.classList.add('is-highlighted');
      }
      playTone(480 + Math.random() * 200, 'sine', 0.06, 0.03);
    };

    step.addEventListener('click', handleInspect);
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleInspect();
      }
    });
  });
}

function runPipelineSimulation() {
  if (pipelineSimulating) {
    clearSimulation();
    if (pipelineHud03) {
      pipelineHud03.innerHTML = '<span class="hud-title">[PAUSED]</span> Pipeline simulation paused. Click any stage to inspect details at your own pace.';
    }
    return;
  }

  pipelineSimulating = true;
  if (simulatePipelineBtn) {
    simulatePipelineBtn.disabled = false;
    simulatePipelineBtn.innerHTML = '<span class="pulse-icon" aria-hidden="true">⏹</span> STOP SIMULATION';
  }

  if (pipelineHud03) {
    pipelineHud03.innerHTML = '<span class="hud-title">[TRANSMISSION]</span> Injecting synthetic data packet through architecture pipeline...';
    pipelineHud03.classList.add('is-highlighted');
  }

  const baseFreq = 300 * (THEME_FREQ_MULTIPLIER[currentTheme] || 1.0);
  const stepDelay = 2200; // 2.2s per stage so viewers can comfortably read the architecture details

  scene03Steps.forEach((step, idx) => {
    const t = setTimeout(() => {
      scene03Steps.forEach(s => s.classList.remove('is-simulating', 'is-active-step'));
      step.classList.add('is-simulating');
      const stepName = step.dataset.step || step.textContent.trim();
      const detail = step.dataset.detail || '';
      if (pipelineHud03) {
        pipelineHud03.innerHTML = `<span class="hud-title">[STAGE ${idx + 1}/${scene03Steps.length}: ${escapeHTML(stepName)}]</span> ${escapeHTML(detail)}`;
      }
      if (simulatePipelineBtn) {
        simulatePipelineBtn.innerHTML = `<span class="pulse-icon" aria-hidden="true">⏹</span> [STAGE ${idx + 1}/8: ${escapeHTML(stepName)}] STOP`;
      }
      playTone(baseFreq + idx * 70, 'sine', 0.14, 0.04);
    }, idx * stepDelay);
    simulationTimeouts.push(t);
  });

  const totalTime = scene03Steps.length * stepDelay;
  const finishTimeout = setTimeout(() => {
    scene03Steps.forEach(s => s.classList.remove('is-simulating'));
    pipelineSimulating = false;
    if (simulatePipelineBtn) {
      simulatePipelineBtn.innerHTML = '<span class="pulse-icon" aria-hidden="true">▶</span> RUN PIPELINE SIMULATION';
    }
    playSuccessSound();
    if (pipelineHud03) {
      pipelineHud03.innerHTML = '<span class="hud-title">[VERIFIED 100%]</span> End-to-end pipeline execution complete. All 8 architecture stages operational with zero bottlenecks.';
    }
    showToast('PIPELINE SIMULATION COMPLETE: All 8 stages verified', 'success');
  }, totalTime + 400);
  simulationTimeouts.push(finishTimeout);
}

// ==========================================
// COMMAND PALETTE (CTRL+K / CMD+K) & MINI CLI
// ==========================================
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CMD_ACTIONS = [
  // Navigation
  { id: 'nav-01', group: 'Navigation', icon: '⚡', title: 'Scene 01: System Poster', sub: 'Home / Hero', action: () => navigateTo('scene-01') },
  { id: 'nav-02', group: 'Navigation', icon: '👤', title: 'Scene 02: About Raka', sub: 'Identity & Vision', action: () => navigateTo('scene-02') },
  { id: 'nav-03', group: 'Navigation', icon: '🔄', title: 'Scene 03: Architecture & Systems Pipeline', sub: 'Interactive Flow', action: () => navigateTo('scene-03') },
  { id: 'nav-04', group: 'Navigation', icon: '💻', title: 'Scene 04: Technology Stack', sub: 'Frontend / Backend / AI', action: () => navigateTo('scene-04') },
  { id: 'nav-05', group: 'Navigation', icon: '🚀', title: 'Scene 05: Selected Work', sub: 'Interactive Projects', action: () => navigateTo('scene-05') },
  { id: 'nav-06', group: 'Navigation', icon: '⚙️', title: 'Scene 06: Behind the Interface', sub: 'Runtime Engineering', action: () => navigateTo('scene-06') },
  { id: 'nav-07', group: 'Navigation', icon: '💼', title: 'Scene 07: Experience & Endorsements', sub: 'Career & Testimonials', action: () => navigateTo('scene-07') },
  { id: 'nav-telemetry', group: 'Navigation', icon: '📡', title: 'Scene: System Telemetry & Pulse', sub: 'Live GitHub Metrics & Repos', action: () => navigateTo('scene-telemetry') },
  { id: 'nav-08', group: 'Navigation', icon: '🧠', title: 'Scene 08: Engineering Mindset', sub: 'Build / Break / Understand', action: () => navigateTo('scene-08') },
  { id: 'nav-09', group: 'Navigation', icon: '🔨', title: 'Scene 09: Currently Building', sub: 'Focus & Initiatives', action: () => navigateTo('scene-09') },
  { id: 'nav-10', group: 'Navigation', icon: '✉️', title: 'Scene 10: Direct Contact', sub: 'Transmission Link', action: () => navigateTo('scene-10') },

  // Projects
  { id: 'proj-1', group: 'Projects', icon: '📂', title: 'Flowsuite', sub: 'Multi-tenant SaaS Architecture', action: () => openProject(projects[0]) },
  { id: 'proj-2', group: 'Projects', icon: '📂', title: 'AI Film / Watchroom', sub: 'Interactive Storytelling & Gemini AI', action: () => openProject(projects[1]) },
  { id: 'proj-3', group: 'Projects', icon: '📂', title: 'Intelligent Traffic Management', sub: 'YOLOv8 Computer Vision & Priority Signal', action: () => openProject(projects[2]) },
  { id: 'proj-4', group: 'Projects', icon: '📂', title: 'Kifayati', sub: 'Smart Web Data Systems', action: () => openProject(projects[3]) },
  { id: 'proj-5', group: 'Projects', icon: '📂', title: 'Multiple Disease Prediction', sub: 'Machine Learning Classification', action: () => openProject(projects[4]) },
  { id: 'proj-6', group: 'Projects', icon: '📂', title: 'Como', sub: 'Cocktail Discovery & Bar Inventory Matching', action: () => openProject(projects[5]) },

  // Filter shortcuts
  { id: 'filter-all', group: 'Filter Work', icon: '🏷️', title: 'Filter: All Projects', sub: 'View all 6 engineered products', action: () => { navigateTo('scene-05'); setProjectFilter('all'); } },
  { id: 'filter-ai', group: 'Filter Work', icon: '🏷️', title: 'Filter: AI / Machine Learning', sub: 'YOLOv8, Gemini, ML models', action: () => { navigateTo('scene-05'); setProjectFilter('ai'); } },
  { id: 'filter-fullstack', group: 'Filter Work', icon: '🏷️', title: 'Filter: Full-Stack SaaS', sub: 'React, Next.js, TypeScript, NestJS', action: () => { navigateTo('scene-05'); setProjectFilter('fullstack'); } },
  { id: 'filter-systems', group: 'Filter Work', icon: '🏷️', title: 'Filter: Systems & Architecture', sub: 'Data flows, APIs, infra', action: () => { navigateTo('scene-05'); setProjectFilter('systems'); } },

  // Themes
  { id: 'theme-cyan', group: 'Themes', icon: '🎨', title: 'Theme: Electric Cyan', sub: 'Default cyberpunk neon blue', action: () => applyTheme('cyan', true) },
  { id: 'theme-emerald', group: 'Themes', icon: '🎨', title: 'Theme: Matrix Emerald', sub: 'High-tech terminal green', action: () => applyTheme('emerald', true) },
  { id: 'theme-amber', group: 'Themes', icon: '🎨', title: 'Theme: Cyberpunk Amber', sub: 'Warm retro futuristic gold', action: () => applyTheme('amber', true) },
  { id: 'theme-violet', group: 'Themes', icon: '🎨', title: 'Theme: Synthwave Violet', sub: 'Deep neon purple vibe', action: () => applyTheme('violet', true) },

  // System Commands
  { id: 'cmd-resume', group: 'System Commands', icon: '📄', title: 'cat resume.pdf', sub: 'Open / Download Resume PDF', action: () => window.open('./resume/resume.pdf', '_blank') },
  { id: 'cmd-contact', group: 'System Commands', icon: '📡', title: 'transmit message', sub: 'Open Direct Transmission Modal', action: () => openContactModal(cmdPaletteBtn) },
  { id: 'cmd-simulate', group: 'System Commands', icon: '▶️', title: 'simulate pipeline', sub: 'Run Scene 03 end-to-end data pipeline', action: () => { navigateTo('scene-03'); setTimeout(runPipelineSimulation, 700); } },
  { id: 'cmd-sound', group: 'System Commands', icon: '🔊', title: 'toggle audio feedback', sub: 'Toggle Web Audio SFX on/off', action: () => audioToggleBtn && audioToggleBtn.click() },
  { id: 'cmd-bgm', group: 'System Commands', icon: '🎵', title: 'toggle background music', sub: 'Mandragora — Shiva (Psytrance BGM)', action: toggleBgm },
  { id: 'cmd-bgm-hud', group: 'System Commands', icon: '🎛️', title: 'open music controller HUD', sub: 'Adjust BGM volume & player', action: () => { if (bgmHud) bgmHud.hidden = false; } },
  { id: 'cmd-bgm-mute', group: 'System Commands', icon: '🔇', title: 'mute / unmute background music', sub: 'Quickly toggle audio mute', action: toggleBgmMute },
  { id: 'cmd-bot', group: 'System Commands', icon: '🤖', title: 'ask raka-bot', sub: 'Open AI System Assistant', action: openRakabot },
  { id: 'cmd-matrix', group: 'System Commands', icon: '🟩', title: 'matrix', sub: 'Toggle Matrix Digital Rain easter egg', action: toggleMatrixRain }
];

let selectedCmdIndex = 0;
let filteredCmds = [];

function openCommandPalette() {
  if (overlay || !cmdPalette) return;
  lockScroll('palette');
  cmdPalette.showModal();
  if (cmdInput) {
    cmdInput.value = '';
    renderCmdResults('');
    cmdInput.focus();
  }
  playModalOpenSound();
}

function closeCommandPalette() {
  if (!cmdPalette || !cmdPalette.open) return;
  cmdPalette.close();
  unlockScroll();
  if (cmdPaletteBtn && typeof cmdPaletteBtn.focus === 'function' && !cmdPaletteBtn.closest('[inert]')) {
    cmdPaletteBtn.focus({ preventScroll: true });
  }
  playModalCloseSound();
  resetCursor();
}

function renderCmdResults(query) {
  const q = query.trim().toLowerCase();
  filteredCmds = CMD_ACTIONS.filter(item => {
    if (!q) return true;
    return item.title.toLowerCase().includes(q) ||
           item.sub.toLowerCase().includes(q) ||
           item.group.toLowerCase().includes(q) ||
           item.id.toLowerCase().includes(q);
  });

  selectedCmdIndex = 0;
  if (!cmdResults) return;

  if (filteredCmds.length === 0) {
    cmdResults.innerHTML = `
      <div class="cmd-empty">
        <p>No commands matched "${escapeHTML(query)}"</p>
        <p style="margin-top:0.5rem;font-size:0.75rem;opacity:0.6;">Try typing: work, ai, theme, resume, matrix, or contact</p>
      </div>
    `;
    return;
  }

  let html = '';
  let currentGroup = '';

  filteredCmds.forEach((item, index) => {
    if (item.group !== currentGroup) {
      currentGroup = item.group;
      html += `<div class="cmd-group-label">${currentGroup}</div>`;
    }
    const isSelected = index === selectedCmdIndex;
    html += `
      <div class="cmd-item ${isSelected ? 'is-selected' : ''}" data-index="${index}" role="option" aria-selected="${isSelected}">
        <div class="cmd-item-main">
          <span class="cmd-item-icon" aria-hidden="true">${item.icon}</span>
          <span class="cmd-item-title">${escapeHTML(item.title)}</span>
          <span class="cmd-item-sub">${escapeHTML(item.sub)}</span>
        </div>
        <span class="cmd-item-badge">${item.group}</span>
      </div>
    `;
  });

  cmdResults.innerHTML = html;
}

function selectCmdItem(index) {
  if (index < 0 || index >= filteredCmds.length) return;
  selectedCmdIndex = index;
  const items = cmdResults.querySelectorAll('.cmd-item');
  items.forEach((el, idx) => {
    const isMatch = idx === index;
    el.classList.toggle('is-selected', isMatch);
    el.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    if (isMatch) el.scrollIntoView({ block: 'nearest' });
  });
}

function executeSelectedCmd() {
  const item = filteredCmds[selectedCmdIndex];
  if (!item) return;
  closeCommandPalette();
  playTone(800, 'sine', 0.06, 0.04);
  setTimeout(() => {
    try {
      item.action();
    } catch (err) {
      console.error(err);
    }
  }, 100);
}

// ==========================================
// MATRIX DIGITAL RAIN EASTER EGG
// ==========================================
let matrixActive = false;
let matrixAnimId = 0;

function toggleMatrixRain() {
  if (!matrixCanvas) return;
  matrixActive = !matrixActive;
  if (matrixActive) {
    matrixCanvas.hidden = false;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const ctx = matrixCanvas.getContext('2d');
    const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[];:=+*~#$_λπ';
    const fontSize = 16;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#00f3ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      if (matrixActive) {
        matrixAnimId = requestAnimationFrame(drawMatrix);
      }
    }
    drawMatrix();
    showToast('MATRIX RAIN PROTOCOL: ACTIVATED (Type "matrix" again or click canvas to dismiss)', 'info');
    playTone(900, 'sine', 0.15, 0.05);

    matrixCanvas.onclick = () => toggleMatrixRain();
  } else {
    cancelAnimationFrame(matrixAnimId);
    matrixCanvas.hidden = true;
    showToast('MATRIX RAIN PROTOCOL: TERMINATED', 'info');
  }
}

// ==========================================
// CINEMATIC UI: preserve original scene and project timing
// ==========================================
const mapRange = (value, start, end) => Math.max(0, Math.min(1, (value - start) / (end - start)));
function fade(value, start, inEnd, outStart, end) {
  if (value < start || value > end) return 0;
  if (value >= inEnd && value <= outStart) return 1;
  return value < inEnd ? mapRange(value, start, inEnd) : 1 - mapRange(value, outStart, end);
}

function applyScene(element, opacity, transform = '') {
  element.style.opacity = opacity;
  element.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
  element.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
  if (element.inert !== (opacity <= 0.5)) element.inert = opacity <= 0.5;
  element.style.transform = reducedMotion.matches ? 'none' : transform;
}

function updateUI(progress) {
  const {
    scrollProgressEl, scene1, scene2, scene3, scene4, scene5,
    scene6, scene7, sceneTelemetry, scene8,
    underline, scene9, scene10
  } = UI_ELEMENTS;
  const scrollProgress = progress;
  progress *= timelineLength;
  scrollProgressEl.style.transform = `scaleX(${scrollProgress})`;
  updateActiveNavigation(progress);

  applyScene(scene1, fade(progress, -0.1, 0.0, 0.06, 0.10), `translate3d(0, ${mapRange(progress, 0, 0.10) * -100}px, 0)`);
  applyScene(scene2, fade(progress, 0.06, 0.10, 0.14, 0.18), `scale(${1 + mapRange(progress, 0.06, 0.18) * 0.2}) translateZ(0)`);
  applyScene(scene3, fade(progress, 0.14, 0.18, 0.22, 0.26));
  applyScene(scene4, fade(progress, 0.22, 0.26, 0.30, 0.34));
  applyScene(scene5, fade(progress, 0.30, 0.34, 0.70 + postProjectOffset, 0.74 + postProjectOffset));

  const applyProject = (element, start, inEnd, outStart, end) => {
    const scale = 1.1 - mapRange(progress, start, end) * 0.1;
    applyScene(element, fade(progress, start, inEnd, outStart, end), `scale(${scale}) translateZ(0)`);
  };
  projects.forEach(({ element, timing }) => applyProject(element, ...timing));

  // Everything after Selected Work moves together when a project is added.
  const closingProgress = progress - postProjectOffset;
  applyScene(scene6, fade(closingProgress, 0.70, 0.73, 0.75, 0.77));
  applyScene(scene7, fade(closingProgress, 0.76, 0.78, 0.81, 0.83));
  if (sceneTelemetry) {
    applyScene(sceneTelemetry, fade(closingProgress, 0.82, 0.84, 0.87, 0.89));
  }
  applyScene(scene8, fade(closingProgress, 0.88, 0.90, 0.92, 0.94));
  underline.style.transform = `scaleX(${mapRange(closingProgress, 0.89, 0.92)})`;
  applyScene(scene9, fade(closingProgress, 0.93, 0.95, 0.965, 0.98));
  applyScene(scene10, fade(closingProgress, 0.97, 0.985, 1.0, 1.0));

  canvas.style.transform = reducedMotion.matches ? 'none' : `translateZ(0) scale(${1 + scrollProgress * 0.5})`;
  canvas.style.filter = `brightness(${1 - mapRange(progress, 0.05, 0.1) * 0.7})`;
}

// ==========================================
// CURSOR: rAF updates, native cursor on touch and inside dialogs
// ==========================================
function requestCursorUpdate() {
  if (!cursorTicking) {
    cursorTicking = true;
    requestAnimationFrame(() => {
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
      cursorTicking = false;
    });
  }
}

function resetCursor() {
  cursor.textContent = '●';
  cursor.classList.remove('is-hovering');
  cursorScale = 1;
  requestCursorUpdate();
}

function updateCursorPreference() {
  root.classList.toggle('has-custom-cursor', finePointer.matches && !reducedMotion.matches);
  resetCursor();
  updateTargetFrame();
}

// ==========================================
// EVENT WIRING & STARTUP
// ==========================================
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('raka_sound_enabled', String(soundEnabled));
    updateAudioToggleUI();
    if (soundEnabled) {
      playTone(520, 'sine', 0.08, 0.04);
      showToast('AUDIO FEEDBACK ENABLED', 'info');
    } else {
      showToast('AUDIO FEEDBACK MUTED', 'info');
    }
  });
}

navLinks.forEach((link) => link.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  playNavSound();
  navigateTo(link.dataset.scrollTarget);
}));

projects.forEach((project) => project.trigger.addEventListener('click', () => openProject(project)));
document.getElementById('modal-close').addEventListener('click', closeProject);
document.getElementById('modal-contact').addEventListener('click', () => {
  const trigger = modalTrigger;
  closeProject();
  openContactModal(trigger);
});

modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProject();
});

let backdropPointerDown = false;
modal.addEventListener('pointerdown', (event) => { backdropPointerDown = event.target === modal; });
modal.addEventListener('click', (event) => {
  if (backdropPointerDown && event.target === modal) closeProject();
  backdropPointerDown = false;
});

// Contact Modal Events
if (openContactModalBtn) {
  openContactModalBtn.addEventListener('click', () => openContactModal(openContactModalBtn));
}
if (contactModalClose) {
  contactModalClose.addEventListener('click', closeContactModal);
}
if (contactModal) {
  contactModal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeContactModal();
  });
  let contactBackdropPointerDown = false;
  contactModal.addEventListener('pointerdown', (event) => { contactBackdropPointerDown = event.target === contactModal; });
  contactModal.addEventListener('click', (event) => {
    if (contactBackdropPointerDown && event.target === contactModal) closeContactModal();
    contactBackdropPointerDown = false;
  });
}

document.getElementById('loader-skip').addEventListener('click', dismissLoader);
loader.addEventListener('cancel', (event) => {
  event.preventDefault();
  dismissLoader();
});

window.addEventListener('scroll', updateTargetFrame, { passive: true });
window.addEventListener('resize', resizeCanvas, { passive: true });
window.addEventListener('wheel', cancelNavigation, { passive: true });
window.addEventListener('touchstart', cancelNavigation, { passive: true });
window.addEventListener('pointerdown', cancelNavigation, { passive: true });
window.addEventListener('keydown', (event) => {
  // Global Command Palette Shortcut (Cmd+K / Ctrl+K / /)
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (cmdPalette && cmdPalette.open) closeCommandPalette();
    else openCommandPalette();
    return;
  }
  if (event.key === '/' && !cmdPalette?.open) {
    const active = document.activeElement;
    const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);
    if (!isInput) {
      event.preventDefault();
      openCommandPalette();
      return;
    }
  }

  if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
    if (!overlay) cancelNavigation();
  }
});
window.addEventListener('hashchange', () => {
  // History navigation must not be discarded behind an open dialog
  if (overlay === 'project') closeProject();
  if (overlay === 'contact') closeContactModal();
  if (overlay === 'palette') closeCommandPalette();
  navigateTo(window.location.hash.slice(1) || 'scene-01', { history: false, smooth: false });
});

// Command Palette Keyboard & Click Events
if (cmdInput) {
  cmdInput.addEventListener('input', (e) => {
    renderCmdResults(e.target.value);
  });

  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectCmdItem((selectedCmdIndex + 1) % filteredCmds.length);
      playTone(700, 'sine', 0.03, 0.02);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectCmdItem((selectedCmdIndex - 1 + filteredCmds.length) % filteredCmds.length);
      playTone(700, 'sine', 0.03, 0.02);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelectedCmd();
    }
  });
}

if (cmdResults) {
  cmdResults.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.cmd-item');
    if (!itemEl) return;
    const idx = parseInt(itemEl.dataset.index, 10);
    if (!isNaN(idx)) {
      selectedCmdIndex = idx;
      executeSelectedCmd();
    }
  });
}

cmdQuickTags.forEach((tag) => {
  tag.addEventListener('click', () => {
    const cmd = tag.dataset.cmd || '';
    if (cmdInput) {
      cmdInput.value = cmd;
      renderCmdResults(cmd);
      cmdInput.focus();
    }
    playTone(600, 'sine', 0.04, 0.02);
  });
});

if (cmdCloseBtn) {
  cmdCloseBtn.addEventListener('click', closeCommandPalette);
}

if (cmdPalette) {
  cmdPalette.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeCommandPalette();
  });
  let paletteBackdropPointerDown = false;
  cmdPalette.addEventListener('pointerdown', (e) => {
    paletteBackdropPointerDown = e.target === cmdPalette;
  });
  cmdPalette.addEventListener('click', (e) => {
    if (paletteBackdropPointerDown && e.target === cmdPalette) closeCommandPalette();
    paletteBackdropPointerDown = false;
  });
}

if (cmdPaletteBtn) {
  cmdPaletteBtn.addEventListener('click', openCommandPalette);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', cycleTheme);
}

if (simulatePipelineBtn) {
  simulatePipelineBtn.addEventListener('click', runPipelineSimulation);
}

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
reducedMotion.addEventListener('change', updateCursorPreference);
finePointer.addEventListener('change', updateCursorPreference);

document.addEventListener('pointermove', (event) => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
  mouseX = event.clientX;
  mouseY = event.clientY;
  const interactive = event.target.closest('a, button, .tech-badge, .filter-pill');
  cursor.textContent = interactive?.classList.contains('project-open') ? 'VIEW' : interactive ? '→' : '●';
  cursor.classList.toggle('is-hovering', !!interactive);
  cursor.style.opacity = '1';
  requestCursorUpdate();
}, { passive: true });

document.addEventListener('pointerdown', () => { cursorScale = 0.8; requestCursorUpdate(); }, { passive: true });
document.addEventListener('pointerup', () => { cursorScale = 1; requestCursorUpdate(); }, { passive: true });
document.documentElement.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
window.addEventListener('blur', resetCursor);

// Register Service Worker for offline capabilities and caching
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.debug('Service Worker note:', err);
    });
  });
}

// Modal tab button events
modalTabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchProjectTab(btn.dataset.tab));
});

// RAKA-BOT Event Listeners
if (rakabotFab) {
  rakabotFab.addEventListener('click', openRakabot);
}
if (rakabotClose) {
  rakabotClose.addEventListener('click', closeRakabot);
}
if (rakabotDialog) {
  rakabotDialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeRakabot();
  });
  let botBackdropPointerDown = false;
  rakabotDialog.addEventListener('pointerdown', (e) => {
    botBackdropPointerDown = e.target === rakabotDialog;
  });
  rakabotDialog.addEventListener('click', (e) => {
    if (botBackdropPointerDown && e.target === rakabotDialog) closeRakabot();
    botBackdropPointerDown = false;
  });
}
if (rakabotForm) {
  rakabotForm.addEventListener('submit', handleRakabotSubmit);
}
rakabotChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.dataset.prompt;
    if (!prompt) return;
    if (rakabotInput) rakabotInput.value = prompt;
    handleRakabotSubmit();
  });
});

applyTheme(currentTheme, false);
setupPipelineSteps(scene03Steps, pipelineHud03);
setupPipelineSteps(scene06Steps, pipelineHud06);
syncGitHubTelemetry();
updateAudioToggleUI();
updateBgmUI();

// Background Music Listeners
if (bgmToggleBtn) {
  bgmToggleBtn.addEventListener('click', toggleBgm);
}
if (bgmHudPlayBtn) {
  bgmHudPlayBtn.addEventListener('click', toggleBgm);
}
if (bgmHudMuteBtn) {
  bgmHudMuteBtn.addEventListener('click', toggleBgmMute);
}
if (bgmHudVolume) {
  bgmHudVolume.addEventListener('input', (e) => {
    setBgmVolume(parseFloat(e.target.value));
  });
}
if (bgmHudClose) {
  bgmHudClose.addEventListener('click', () => {
    if (bgmHud) bgmHud.hidden = true;
  });
}

// User-gesture auto-resume if BGM was previously active
const handleFirstInteraction = () => {
  if (bgmUserInitiated && !bgmPlaying) {
    playBgm(false);
  }
};
window.addEventListener('click', handleFirstInteraction, { once: true });
window.addEventListener('keydown', handleFirstInteraction, { once: true });
window.addEventListener('touchstart', handleFirstInteraction, { once: true });

// Duck audio when tab is backgrounded
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (bgmAudio && bgmPlaying && !bgmMuted) {
      bgmAudio.volume = Math.max(0.05, bgmTargetVolume * 0.3);
    }
  } else {
    if (bgmAudio && bgmPlaying && !bgmMuted) {
      bgmAudio.volume = bgmTargetVolume;
    }
  }
});
root.style.setProperty('--timeline-length', String(timelineLength));
resizeCanvas();
updateUI(getScrollProgress());
updateCursorPreference();
lockScroll('loader');
loader.showModal();
loaderTimeout = setTimeout(dismissLoader, 15000);
if (context) loadNextFrames();
else dismissLoader();

