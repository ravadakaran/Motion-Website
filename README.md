# Raka portfolio

A static HTML/CSS/JavaScript portfolio with a 240-frame, scroll-linked canvas sequence. No build step or runtime dependencies are required.

## Preview

From this folder, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Any other static web server also works. Deploy `index.html`, `style.css`, `script.js`, `new/`, and `projects/` together.

## Interactions

- **Preloader:** shows progress as the 240 frame requests finish, with up to eight requests running at once. It supports **Enter now** and Escape, and automatically releases the page after 15 seconds even if requests stall. Frames continue loading after early entry. Failed frames use the nearest available image; missing animation never blocks the HTML content.
- **Navigation:** WORK, ABOUT, STACK, EXPERIENCE, CONTACT, and the logo scroll to the fully visible portion of their scenes. Hash links support direct entry and browser Back/Forward. Wheel, touch, pointer-down, and scroll/Tab keys interrupt automatic navigation.
- **Project details:** click a card or focus its Explore project button and press Enter. The native dialog contains keyboard focus, pauses the timeline, locks background scrolling, and restores focus/scroll position on close. Escape, Close, and the outer backdrop dismiss it.
- **Reduced motion:** automatic navigation is immediate, the backdrop stays static, and zoom/slide transforms and the custom cursor are disabled.

The base reading pace is controlled by `--base-scroll-height` on `body` in `style.css` (currently 3000vh). Each additional project extends the timeline rather than shortening the existing project slots. With six projects, the page spans 3232vh, preserving the previous scroll distance per section. Project timing, modal numbering, and navigation destinations are derived from the card count in `script.js`.

## Add your real links

Edit `PROJECT_LINKS` near the top of `script.js`:

```js
'project-1': {
  live: 'https://your-actual-demo.example',
  repository: 'https://github.com/your-account/your-repository'
}
```

Project mapping:

1. Flowsuite
2. AI Film / Watchroom
3. Intelligent Traffic Management
4. Kifayati
5. Multiple Disease Prediction
6. Como — cocktail and mocktail discovery with ingredient matching and a personal bar

Como’s [live site](https://como-phi.vercel.app/) and [GitHub repository](https://github.com/ravadakaran/como) are configured. Its cover, `projects/como.jpg`, is a locally stored screenshot of the live app; its description and technology stack were verified against the repository.

Only configured HTTP(S) URLs are shown. Empty links are hidden, and external links open with `noopener noreferrer`. The example above is illustrative; no demo or repository URLs have been invented in the portfolio.

Project titles, descriptions, images, stacks, and highlights are read from the existing cards in `index.html`, so there is one source of truth. Optional detail sections are omitted when a card has no corresponding content.

**Still needed before publishing:** configure the other projects’ public URLs, and verify the contact links in `index.html` use complete `https://` URLs and a `mailto:` address. The rest of the roadmap is in `todo_list.md`.

## Regression tests

Requirements: Node.js, npm, and Python on PATH.

```sh
npm ci
npx playwright install chromium
npm run check
npm test
```

The tests start and stop their own local server on port 4173. They cover real/cached frame loading, failed/stalled requests, loader skip/timeout, missing canvas support, all navigation destinations, history with an open modal, keyboard focus, all project dialogs, scroll locking, reduced motion, and mobile/landscape layouts.

To use an already installed Chrome instead of downloading Chromium:

```sh
# Bash
PLAYWRIGHT_CHANNEL=chrome npm test
```

```powershell
# PowerShell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm test
```

Failures save screenshots and traces in `test-results/`. Automated mobile checks emulate touch and viewport sizes in Chromium; a full real-device/Safari audit remains on the roadmap.
