# Build log

## 2026-11-11

**Goal.** Rebuild the reference portfolio as an original static site: same information architecture and interaction feel, none of the original code, copy, artwork or trademarks.

### Recon

- Captured 18 reference screenshots at 1440 px plus full-page (`replica/screens/`).
- Recorded sections, flows, DOM structure, computed colours, type and breakpoints in `replica/recon.md`.
- Scored 43 features in `replica/features.csv`: 21 must, 10 should, 5 could, 7 skipped.
- Skipped anything owned by the reference: the 3D portrait and cast, real product screenshots, client logos, personal copy, and the external live-office feed.

### Architecture and design

- Chose plain HTML + tokenised CSS + one vanilla ES module. No framework, no build step, no runtime dependencies.
- Wrote `replica/architecture.md`: routes, content model, component map and build order.
- Defined `replica/design/tokens.json`, then `styles/tokens.css`. Palette: cobalt `#064cce`, deep `#002472`, ink `#021239`, paper `#f4f7fc`, lime `#b1ef4a`, tangerine `#ff8338`.
- Ran the contrast script on 19 text/background pairs: 0 AA failures.
- Downloaded Bowlby One and Bricolage Grotesque WOFF2 files with their OFL licences; self-hosted, no runtime Google Fonts request.

### Assets

All artwork built from scratch as SVG:

- Two portraits (looking up for the hero, front-facing for the closing).
- Five agent characters for the Factory.
- Pollen and Relay product mocks.
- Office illustration, favicon and 1200 × 630 social card.

No raster assets are used, so the site stays sharp at any size and the page weight stays low.

### Build order

1. Shared shell: tokens, base styles, nav, buttons, footer, skip link.
2. Home page: hero → ticker → flagship products → Factory strip → Lab → services → client wall → timeline → stack → channels → closing.
3. Factory page: hero → floor → office preview → cast → four steps → CTA.
4. Blog: index, three posts, RSS.
5. 404, sitemap, robots.
6. README with every placeholder documented.

Copy was written for this rebuild. Products, metrics, client names and the career line are fictional. The Factory office is a labelled static preview, not a live feed.

### Interaction

- `scripts/site.js` adds nav raised/hidden state and Lab filtering.
- Both are enhancements: with JavaScript off the nav stays visible and all ten Lab rows show.
- Filters use `aria-pressed` and announce results in a polite live region.
- Reduced motion disables the ticker, portrait bob and letter stagger.

### QA pass

- Served the site at `http://127.0.0.1:4173` and captured 21 full-page screenshots plus viewport and component crops at 390, 800 and 1440 px (`replica/clone-screens/`).
- Layout checks: no horizontal overflow, no missing `alt`, no broken images, one `h1` per page at every width.
- Lighthouse on home, Factory, blog index, post and 404: accessibility 100, best practices 100, SEO 100, no failures.
- Link check: 25 local links and assets, all 200. RSS and sitemap parse as valid XML.
- Lab filters: Building shows 4 of 10, `aria-pressed` moves, live region announces “Showing 4 projects in Building.”
- Nav: raised at 600 px, hidden scrolling down, restored scrolling up.
- Console clean on every page.

Fixes made during QA:

- `/factory` now resolves on any static server (`factory/index.html` instead of `factory.html`).
- Sticky footer so the 404 page fills the viewport and the footer sits at the bottom.
- Under reduced motion, animation delays are zeroed so hero text and controls are visible immediately.
- Floor rooms became three columns at 1200 px+, with larger cast and status dots aligned to each robot.
- Pollen and Relay mock SVGs adjusted so headlines no longer run under the stats cards.
- “Yours next?” tile now fills its tile instead of sitting inset.
- Office mock marked “DEMO” rather than “LIVE”; section heading changed to “Inside the office”.
- Social card rendered to PNG (`assets/og.png`) and every page points at it.

### Known gaps / next pass

- Keyboard traversal could not be exercised end to end because browser screenshots and key events need a visible desktop window; focus styles and the skip link were verified in the DOM, and Lighthouse reports no keyboard-visible failures.
- No print stylesheet and no page transitions (both optional).
- Replace every placeholder listed in `README.md` before any public launch.
- No git repository initialised yet.


## 2026-11-13 � scroll-driven hero

**Goal.** Add the reference hero motion to the existing static build without touching layout, copy, colours or type.

- Kept the vanilla stack: one ES module, `requestAnimationFrame`, no GSAP or Framer Motion, no new dependencies.
- Added `MOTION` at the top of `scripts/site.js` with every distance, range, easing power and duration: column slide (137 px / -131 px over 600 px), column fade (0.5 to 1 over 400 px), avatar scale (1 to 1.08 over 300 px) and lift (-20 px over 400 px), wordmark speed (1, with 0.7 documented for depth), nav thresholds (100 px solid, 200 px hide) and a 30 s ticker.
- Columns slide inward only at 960 px and wider, where the hero uses the absolute layout. Below that they stay side by side and only fade, so they cannot overlap. `minWidth` is in the config.
- Added an `.avatar-plane` wrapper so the existing entrance animation and the new scroll transform do not both animate `transform`. No layout change.
- Nav solid/hide thresholds moved into the config; hidden offset is `--nav-hide-y` (-100%). Ticker duration is `--ticker-duration` (30 s) with a matching CSS fallback.
- Hero uses `overflow-x: clip` with a `hidden` fallback; animated layers declare `will-change`; only `transform` and `opacity` are written.
- Reduced motion: JS skips all scroll transforms, clears inline styles, keeps the nav visible; CSS stops the ticker and forces the readable end state.

**QA.**

- Headless Chrome at 1440 and 390 px: at y=0 columns are at 0.5 opacity and zero offset; at y=300 the left is +119.88 px and right -114.63 px (cubic ease-out), avatar is 1.08, nav is navy and hidden; at y=600 columns reach +137 / -131 and opacity 1; scrolling up restores the navy nav.
- Mobile 390 px: zero lateral shift, opacity still animates, no horizontal overflow.
- Reduced motion: no transforms, columns fully visible, nav visible, ticker animation `none`.
- No console or page errors. Full screenshot suite re-run: 21 shots, 0 layout or accessibility flags.

## 2026-11-13 - project-card pop

**Goal.** Make the two cards in "Projects built around reliable releases" pop into place as they approach the viewport, without touching layout, copy, colours or type.

- Kept the vanilla stack: IntersectionObserver plus CSS transitions, no GSAP or Framer Motion, no new dependencies. Hero motion is unchanged.
- An inline head script adds `js-motion` to `<html>` before first paint, so the heading and cards are hidden with no flash. If `site.js` never runs, a 2000 ms timeout removes the class and the cards stay visible; `<noscript>` needs nothing extra.
- Cards start at opacity 0, `translateY(60px)`, `scale(0.92)`, `rotate(2deg)` and settle on `cubic-bezier(0.34, 1.56, 0.64, 1)` over 700 ms. Opacity finishes in 400 ms so the card is readable while it lands.
- Trigger is `rootMargin: 0 0 -15% 0` (top 85%). Each card is unobserved as it starts, so the pop plays once and never reverses or replays. A card that is already above the viewport on load renders in its final state.
- Heading observer starts the 600 ms / 24 px fade first. The first card is delayed to keep a ~100 ms lead; later cards get the remaining lead plus a 90 ms per-card stagger, capped at 400 ms. Batch order is sorted by viewport top then left, so it also works as a row/column grid.
- Inside each card: the screenshot settles from 1.08 over 900 ms after landing, copy fades up 12 px in 60 ms steps from 150 ms, and facts scale from 0.8 in 40 ms steps from 420 ms. Only `transform` and `opacity` animate.
- `will-change` is applied through `is-armed` and removed when the card's inner timers finish. Hover lift (-6 px, 1.02) is gated behind `is-settled`, so it cannot fight the entrance transform; the extra shadow is an `::after` opacity fade.
- Hidden cards are transformed, not removed from flow: they keep their final height, stay in the accessibility tree and remain tabbable. Focusing a hidden card reveals it immediately.
- Reduced motion: the observer path is skipped, the hidden class is dropped and every element is shown at its end state with no transition. A live media-query change also reveals everything and clears pending timers.
- All tunables live in `MOTION.projects` (trigger offset, durations, easing, stagger, max delay, start positions, hover values, inner choreography). JS writes them to `--pop-*` custom properties; CSS fallbacks mirror the config for the pre-init and no-JS states.
- The optional first-row parallax was left out on purpose: it would add a second scroll-tick listener for an effect the brief marked optional.

**QA.**

- Headless Chrome CDP run at 1440 x 900, 1440 x 1600 and 390 x 844: 37 assertions pass.
- Before the trigger the card is hidden and keeps its 950 px height. After it, opacity and transform are interpolating; measured transition durations are 400 ms (opacity) and 700 ms (transform).
- Heading starts first and settles at opacity 1 / no transform. Text delays step 150 / 210 / 270 / 330 ms; facts and screenshot reach scale 1.
- Same-batch cards received 84 ms and 174 ms delays in the final run: the heading lead is shared, then the 90 ms stagger. Layout offsets are identical before and after.
- Hover applies `matrix(1.02, 0, 0, 1.02, 0, -6)` and the shadow opacity reaches 1. Scrolling away and back re-runs no entrance animations.
- Reduced motion: no `js-motion` class, no running animations, final state immediately. JavaScript off: cards visible. `site.js` blocked: hidden briefly, then revealed by the 2000 ms fallback.
- Mobile 390 px: card animates in, no horizontal overflow. Screenshots at 1440 and 390 px confirm the hidden, mid-pop and settled states. Full suite re-run: 21 shots, 0 layout or accessibility flags.

## 2026-11-13 - reload starts at the top

**Goal.** A refresh or reload should always reopen the page at the top, regardless of the section the visitor was reading. No layout, copy, colour, font or animation changes.

- Added `scripts/scroll-restore.js`, loaded synchronously in the head of all seven pages, before the stylesheets.
- On a reload only, it sets `history.scrollRestoration = "manual"` early enough to cancel the browser restore, then re-scrolls to `0,0` immediately, on `load` and on non-persisted `pageshow`. The scroll uses `behavior: "instant"` so the page's `scroll-behavior: smooth` cannot turn the reset into a visible animation.
- Navigation type comes from Navigation Timing (`performance.getEntriesByType("navigation")[0].type === "reload"`), with the legacy `performance.navigation.type` as fallback.
- Every other path is untouched: normal navigations still start at the top by browser default, hash deep links still jump to their section, in-page anchors still scroll, and back/forward still restore the previous position.

**QA.**

- Headless Chrome CDP, 1440 x 900: 16 assertions pass.
- Home scrolled to 1500 px, then `Page.reload` -> `scrollY` 0, navigation type `reload`, `history.scrollRestoration` `manual`.
- Hero after reload is in its top state: column opacity 0.5, zero lateral translate.
- Blog scrolled to 400 px, reload -> 0.
- `/#projects` deep link jumps to 881 px; reloading that URL returns to 0. A `#skills` click still scrolls to 4849 px.
- Normal navigation to `/factory/` opens at 0 with `scrollRestoration` left on `auto`. Back from `/blog/` to `/factory/` restores 400 px, as before.
- `scroll-restore.js` present on home, Factory, blog index, a post and 404. No console errors.

## 2026-11-14 - mobile hero rebuilt to the reference

**Goal.** Make the hero below 769 px match the reference mobile composition and scroll motion, without touching copy, colours, fonts, the portrait or the desktop hero.

**Layout (`styles/site.css`, `@media (max-width: 48rem)`).**

- One blue stage plus two navy rows: grid areas `stage / left right / foot`, with `--hero-stage: max(65svh, min(44rem, 100vw))`. The 44rem floor keeps the head, yellow tag and shoulder crop composed on wide-but-short viewports; on phones the stage is exactly 65svh.
- Wordmark absolutely placed at `max(4.75rem, 12% of the stage)`, `font-size: 23.3vw`. Measured ink width is 88.0% at 360, 390, 430 and 768 px, with the orange/green/navy extrusion unchanged.
- Avatar: 80vw wide (capped at 34rem), `top: 21%`, `height: 79%`, so its bottom is exactly the stage bottom. `object-fit: cover` / `object-position: 50% 0` crops the portrait to head and shoulders, removes the old side fade and keeps the yellow tag. `transform-origin: bottom center`, z-index 2 above the wordmark, `overflow: hidden` on the hero clips the zoom. The entry animation is fade-only so the shoulders never lift off the navy edge.
- Navy panel is `.hero::after` at `grid-area: 2 / 1 / 4 / 3`, starting on the exact stage boundary. Columns and foot use 20px side padding, left/right alignment and weight unchanged.
- Mobile column type is `clamp(1rem, 5.2vw, 2rem)`. At the old 6vw the longest rows ("JENKINS CI/CD", "AGILE / SCRUM") wrapped on 360 and 390; the new size is within 2% of the reference's 20.67px at 390 and keeps every row on one line.

**Motion (`scripts/site.js`).**

- New `MOTION.mobile` block holds the breakpoint (768), stage height (65svh), floor (44rem), column pull (5vw), minimum gap (16px), ranges (400/300), avatar scale (1.06) and range (300), wordmark speed (0.8) and nav thresholds (80/160).
- `matchMedia("(max-width: 768px)")` selects the mode. Resize, orientation change, the media-query change and `document.fonts.ready` mark the pull for re-measure; the render loop re-measures once, not per scroll tick. Measurement temporarily clears the inline column transforms, measures the widest unwrapped text in each column with a `Range`, and caps the pull at `min(5vw, (naturalGap - 16) / 2)`.
- Columns translate inward by equal and opposite amounts, ease-out over 400 px; opacity goes 0.5 to 1 over 300 px; font size is untouched by scroll. The optional 40 ms row stagger was skipped so no per-row style is written each frame.
- Avatar scales 1 to 1.06 over 300 px from the bottom centre; the wordmark drifts at 0.8x; the nav turns solid at 80 px and hides past 160 px, returning on scroll up. Desktop keeps 100/200 and its original values.
- Only `transform` and `opacity` are animated, `will-change: transform` is set on the moving layers, and the wordmark layer hint is toggled with the mode. Reduced motion still uses `clearHero()` plus the CSS overrides: no transforms, side words at opacity 1.
- Contrast: `#f4f7fc` at 0.5 opacity over `#002472` is about 4.27:1, which passes AA for the bold large text of the columns, so 0.5 is kept.

**QA.**

- 61 headless Chrome CDP assertions pass at 360 x 780, 390 x 844, 430 x 932 and 768 x 1024.
- No horizontal overflow at any width. Avatar bottom equals the navy row top to within 0.5 px; mask is `none`; the avatar overlaps the wordmark bottom at every width.
- Stage: 507, 548.6, 605.8 and 704 px (65svh at the phone widths, the 44rem floor at 768). First side row: 535, 576.6, 633.8, 732 px, all above the fold. Widest-row gap: 66.8, 76, 89 and 303.3 px.
- At 390 px: column translates 0 -> 19.2 px at 300 -> 19.5 px at 400 (5vw cap), mirrored, gap still 37 px; opacity 0.5 -> 1 by 300; avatar 312 -> 330.8 px with the bottom flush; wordmark moves 240 px when the page moves 300; nav states `false/false -> true/false` at 90 -> `true/true` at 250 -> `true/false` after scrolling up.
- Reduced motion: columns `opacity: 1`, all four animated layers `transform: none`.
- Live 390 -> 1024 -> 768 resize switches avatar origin and re-measures the gap. Desktop 960, 1024 and 1440 keep the block hero, absolute wordmark/columns, top-centre avatar, mask and `object-fit: contain`.
- Screenshots at all four widths plus 390 and 360 at scrollY 300 confirm the navy panel starts flush, the side rows are one line, and the scroll state stays clipped.
