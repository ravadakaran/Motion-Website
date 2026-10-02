# Portfolio Action Items & Roadmap (TODO)

Track progress for new features, performance optimizations, and deployment preparation.

---

## 🚀 Immediate Next Actions
- [x] **Resume PDF Integration**:
  - [x] Update navbar `RESUME ↗` CTA and contact links to directly link to local [`resume/resume.pdf`](file:///d:/New%20Portfolio/resume/resume.pdf) with fallback download options
  - [x] Add direct preview/download trigger in Scene 10 (Contact)
- [x] **Real Contact Form Transmission**:
  - [x] Wire [`#contact-form`](file:///d:/New%20Portfolio/index.html) to serverless email service (Web3Forms) so messages deliver directly to `ravadakaran733@gmail.com`
  - [x] Add graceful offline/network failure handling and mailto fallback

---

## ⚡ Phase 2: Interactive Cyber Experiences
- [x] **Cyber Command Palette (`Ctrl+K` / `Cmd+K` & Mini CLI)**:
  - [x] Quick-jump navigation across all scenes (`Scene 01` to `Scene 10`)
  - [x] Instant project search & filter shortcuts (`all`, `ai`, `fullstack`, `systems`)
  - [x] Terminal commands: `help`, `skills`, `projects`, `contact`, `theme`, `clear`, `cat resume`, `matrix`
  - [x] Full keyboard navigation (Arrow keys, Enter, Escape)
- [x] **Cyber HUD Accent Theme Switcher**:
  - [x] Dynamic accent switcher with custom CSS variables:
    - ⚡ Electric Cyan (`#00f3ff`) [Default]
    - 🟢 Matrix Emerald (`#00ff9d`)
    - 🟡 Cyberpunk Amber (`#ffb700`)
    - 🟣 Synthwave Violet (`#bd00ff`)
  - [x] Synchronized Web Audio API frequency shifts matching the chosen theme
  - [x] Persistent theme selection in `localStorage`
- [x] **Interactive System Architecture & Pipeline Simulator**:
  - [x] Make Scene 03 (`IDEA → DESIGN → FRONTEND → API → BACKEND → DATABASE → AI → DEPLOYMENT`) and Scene 06 interactive
  - [x] Animated data packet pulses along the pipeline on hover/click
  - [x] Interactive HUD inspector revealing protocols, latency, and Karan's stack choices at each stage
- [x] **Matrix Digital Rain Easter Egg**:
  - [x] Canvas-driven digital code rain overlay triggered via command palette (`matrix`) or click-to-dismiss
- [x] **Background Music Audio Engine (`Mandragora - Shiva`)**:
  - [x] Integrate high-energy psytrance soundtrack (`background/Mandragora-Shiva-SnapYT.App.mp3`)
  - [x] Cyber navbar controller with animated 4-bar equalizer visualizer
  - [x] Mini HUD audio dock with volume slider, play/pause controls, and track metadata
  - [x] Smooth fade-in / fade-out to prevent audio pops
  - [x] Command Palette (`⌘K`) quick commands and RAKA-BOT conversational controls
  - [x] `localStorage` persistence and gesture-safe browser playback

---

## 🤖 Phase 3: AI & Systems Engineer Showcase
- [x] **Interactive Project Modal Upgrades**:
  - [x] Tabbed deep-dive in [`#project-modal`](file:///d:/New%20Portfolio/index.html):
    - `Overview` (Cover media, description, live links)
    - `Architecture` (System topology & data flow for all 6 projects)
    - `Challenges & Metrics` (Latency benchmarks, uptime SLAs, and solutions)
    - `Interactive Sandbox` (Project-specific live interactive simulation)
  - [x] Mini interactive widgets:
    - Adaptive intersection traffic signal controller & ambulance override
    - Clinical risk prediction slider & live gauge
    - Multi-tenant schema isolation & RLS switcher
    - Inverted-index home bar cocktail recipe matcher
    - Gemini multimodal branching predictor
    - Real-time parallel multi-store price arbitrage scanner
- [x] **RAKA-BOT / Cyber System Assistant**:
  - [x] Floating cyberpunk AI FAB trigger and dialog terminal
  - [x] Quick prompt chips (YOLOv8, Flowsuite, Backend stack, Availability, Resume & Contact)
  - [x] Natural language intent recognition with synthesized audio feedback
  - [x] Integrated into Command Palette (`ask raka-bot`, `cmd-bot`)
- [x] **Live GitHub Activity / Pulse Widget**:
  - [x] Dedicated **System Telemetry & Open-Source Pulse Scene** (`#scene-telemetry`) with 4-KPI metrics HUD, pinned repo architecture cards, code spectrum distribution bar, and live API sync
  - [x] Asynchronous GitHub REST API fetcher with resilient offline cache fallbacks
  - [x] Restored Scene 07 to a clean, spacious 2-column Career & Endorsements layout

---

## 🎨 Phase 4: Performance & Visual Polish
- [ ] **Project Asset Optimization (WebP / AVIF)**:
  - [ ] Convert 6+ MB of high-res JPG project covers (`flowsuite.jpg`, `ai_film.jpg`, `traffic.jpg`, `kifayati.jpg`, `disease.jpg`) to modern WebP (~80% bandwidth reduction)
  - [ ] Add `<picture>` responsive source tags with WebP/JPG fallbacks
- [ ] **Ambient Cyber Grid / Particle FX**:
  - [ ] Subtle interactive canvas starfield or cyber grid responding softly to pointer movement when idle

---

## ✅ Completed Milestones
- [x] **Social & SEO Meta Tags** (`og:image`, `twitter:card`, canonical URLs, meta keywords)
- [x] **Favicon & Web Manifest** (`favicon.svg`, `site.webmanifest`, theme-color `#050505`)
- [x] **Interactive Cyber Contact Modal** (`#contact-modal`, validation, HUD toasts, mailto fallback)
- [x] **Project Rich Media & Filtering** (dialog modal, category tags `ALL`, `AI / ML`, `FULL-STACK`, `SYSTEMS`)
- [x] **Tech Stack Badge HUD** (click/hover architecture descriptions)
- [x] **Web Audio API Synthesizer** (sci-fi SFX, navbar mute/unmute toggle, `localStorage` persistence)
- [x] **Service Worker Caching** (`sw.js` Cache-First runtime caching for frame sequences & assets)
- [x] **Career & Testimonials Section** (Scene 07 experience list & peer endorsements)
- [x] **240-Frame Canvas Sequence Engine** (bounded request queue, preloader progress & bypass)

---

*Last updated: 2026-10-01*
