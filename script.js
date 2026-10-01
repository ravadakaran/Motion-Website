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
  underline: document.querySelector('.blue-underline'),
  canvas
};
const navLinks = [...document.querySelectorAll('[data-scroll-target]')];
const navigationTargets = {
  'scene-01': 0,
  'scene-02': 0.12 / timelineLength,
  'scene-04': 0.28 / timelineLength,
  'scene-05': 0.36 / timelineLength,
  'scene-07': (0.83 + postProjectOffset) / timelineLength,
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

// Audio Feedback Elements
const audioToggleBtn = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');

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
  if (name === 'project') {
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
          : progress >= 0.80 + postProjectOffset && progress < 0.86 + postProjectOffset ? 'scene-07'
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
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
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

    // Submit state simulation
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.classList.add('is-sending');
    playTone(440, 'sine', 0.1, 0.03);

    setTimeout(() => {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.classList.remove('is-sending');
      playSuccessSound();
      showToast('TRANSMISSION SENT: Thank you for reaching out. I will reply promptly.', 'success');
      contactForm.reset();
      setTimeout(closeContactModal, 1200);
    }, 1100);
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
    scene6, scene7, scene8,
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
  applyScene(scene6, fade(closingProgress, 0.70, 0.74, 0.78, 0.82));
  applyScene(scene7, fade(closingProgress, 0.78, 0.82, 0.84, 0.88));
  applyScene(scene8, fade(closingProgress, 0.84, 0.88, 0.90, 0.94));
  underline.style.transform = `scaleX(${mapRange(closingProgress, 0.85, 0.89)})`;
  applyScene(scene9, fade(closingProgress, 0.90, 0.94, 0.95, 0.98));
  applyScene(scene10, fade(closingProgress, 0.95, 0.98, 1.0, 1.0));

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
  if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelNavigation();
});
window.addEventListener('hashchange', () => {
  // History navigation must not be discarded behind an open dialog
  if (overlay === 'project') closeProject();
  if (overlay === 'contact') closeContactModal();
  navigateTo(window.location.hash.slice(1) || 'scene-01', { history: false, smooth: false });
});

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

updateAudioToggleUI();
root.style.setProperty('--timeline-length', String(timelineLength));
resizeCanvas();
updateUI(getScrollProgress());
updateCursorPreference();
lockScroll('loader');
loader.showModal();
loaderTimeout = setTimeout(dismissLoader, 15000);
if (context) loadNextFrames();
else dismissLoader();

