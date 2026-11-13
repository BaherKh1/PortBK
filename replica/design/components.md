# Component specs

Every component consumes tokens from `styles/tokens.css`. No raw hex values or one-off font sizes belong in page markup. This document describes the built components, their states and where they are used.

## Foundations

| Token group | Values |
| --- | --- |
| Surfaces | `--color-surface-accent` cobalt `#064cce`, `--color-surface-accent-deep` `#002472`, `--color-bg` paper `#f4f7fc`, `--color-surface` white, `--color-text` ink `#021239` |
| Ink on light | `--color-text` `#021239`, `--color-text-muted` `#314262` |
| Accents | `--color-highlight` lime `#b1ef4a`, `--color-warm` tangerine `#ff8338` |
| Display type | `--font-display` Bowlby One, uppercase, tight leading |
| Body type | `--font-sans` Bricolage Grotesque, weights 400–800 |
| Radius | `--radius-pill` for buttons and chips; `--radius-card` for images |
| Motion | `--motion-fast` 160 ms, `--motion-base` 280 ms, `--motion-slow` 700 ms, `--ease-out` |
| Layout | `--layout-gutter` clamp(1.25rem, 4vw, 4rem), `--layout-section` clamp(4.5rem, 10vw, 9rem), post measure 44rem |

Breakpoints are written mobile-first at `48rem`, `50rem`, `56rem` and `60rem`.

## Navigation

`.site-nav` with `.nav-logo`, `.nav-links`, `.btn--lime`.

- Fixed to the top, transparent over the hero, inverse text.
- `data-raised="true"` after 16 px of scroll paints ink `#021239`.
- `data-hidden="true"` translates the bar up when scrolling down past 120 px; scrolling up or focusing anything inside restores it.
- Links are hidden below 50rem; the wordmark and the booking button remain.
- Current page is marked with `aria-current="page"` on the matching link.
- Focus reveals the bar via `:focus-within`, so keyboard users never lose it.

## Buttons and links

- `.btn` base: pill, min-height 2.75rem, bold, no wrap; active state scales to 0.97.
- `.btn--lime`: lime fill, ink text, brighter lime on hover.
- `.btn--ghost`: 2 px inset ring in currentColor; on hover inverts to paper fill and ink text.
- `.link-arrow`: underlined inline link with a nudging arrow on hover. Used on product, project and blog links.
- `.skip-link`: fixed, translated off-screen until focused.

## Hero

`.hero` with `.wordmark`, `.avatar`, `.hero-col--left`, `.hero-col--right`, `.hero-foot`.

- Two-column grid on mobile that becomes a 12-column composition at 60rem; portrait sits in the middle, skill columns flank it.
- Wordmark is fluid at `22.5vw` with three offset text shadows (tangerine, lime, deep blue). Each letter rises in with a 45 ms stagger.
- Portrait is masked 8% at each edge; bobs gently on a 7 s loop.
- `.hero-foot` holds the intro paragraph and the two primary CTAs.

## Ticker

`.ticker` / `.ticker-track` / `.ticker-list`.

- Two identical lists, the second `aria-hidden`, animated with a 42 s linear translate.
- Pauses on hover and focus-within. Removed entirely under reduced motion, leaving one readable list.
- On narrow screens the items wrap to a vertical list instead of scrolling.

## Flagship product card

`.flagship` with modifiers `--warm` (Pollen, tangerine) and `--ink` (Relay, ink).

- Grid: copy, product mock, three facts. On mobile it stacks copy → image → facts.
- `.flagship-role` is a small uppercase role line; `.flagship-facts` is a three-column definition list with values above labels.
- Product mocks are original SVGs with explicit dimensions and lazy loading.
- External product links open in a new tab with `rel="noreferrer"`.

## Factory strip

`.factory-strip` is a full-width link above the Lab.

- Three overlapping cast portraits, “The office is quiet today”, and a “Visit the Factory →” affordance.
- Hover raises the strip and nudges the arrow; the whole block is one tab stop.

## Lab

`.lab`, `.lab-intro`, `.lab-filters`, `.chip`, `.lab-list`, `.lab-row`, `.lab-status`.

- Chips are `<button>` elements with `aria-pressed`. Counts are part of the label: All 10, Live 2, Building 4, Open source 2, Experiment 2.
- Each row is a `<li data-project data-group="…">` with an optional linked title, one-line description and a status pill.
- Filtering sets `hidden` on non-matching rows and updates a polite live region: “Showing 4 projects in Building.”
- Without JavaScript every row is visible; the chips simply do nothing.
- Status colours: Live uses the green token; other statuses use the ink outline pill.

## Services

`.work` / `.services` / `.service` / `.work-foot`.

- Three equal cards on cobalt with lime Bowlby headings. On mobile they stack.
- Foot holds a short availability line and the booking CTA.

## Client wall

`.trusted` / `.trusted-list`.

- A 5 × 2 grid of bordered tiles; two tiles take accent or ink variants; the last is the “Yours next?” CTA.
- Names are typographic placeholders, not logos. Nothing here is a real trademark.
- Tiles collapse to two columns on mobile.

## Timeline

`.path` / `.path-list`.

- Ordered list with a top rule per entry, cobalt year, bold role and one-sentence description.
- Six entries read as a career line; reorder or trim without touching CSS.

## Stack

`.stack` / `.stack-groups` / `.stack-group`.

- Four groups (Product, Agents, Growth, Infra) in a responsive grid.
- Items are plain text, not logos, so no brand permissions are needed.

## Channels

`.channels` / `.channel-list`.

- Rows with channel name, description and handle; the whole row is a link.
- Hover inverts the row to ink with paper text and shifts the handle.
- Blog points internally; social rows point to platform home pages as placeholders.

## Closing block

`.closing` / `.closing-wordmark` / `.closing-avatar` / `.closing-foot`.

- Oversized “LET'S BUILD” display line, front-facing portrait, and a deep-blue foot with the final CTA pair.
- The portrait is decorative in placement but carries descriptive alt text.

## Footer

`.site-footer` — ink bar, paper text, three items: copyright, blog link, location. Wraps to two lines on small screens.

## Factory page

- `.factory-page` sets the cobalt surface for the whole page.
- `.factory-hero`: display H1 in lime, tagline, intro, two CTAs.
- `.floor` / `.floor-rooms` / `.floor-room`: three rooms with counts and cast members. The pulsing dot signals activity; the copy is static and labelled as today's work.
- `.office` / `.office-frame`: framed illustration with a 16:10 crop, 3:4 on mobile, plus a caption that says it is a preview and a full-screen link.
- `.factory-cast`: five portraits with names and one-line personalities.
- `.factory-steps`: numbered four-step process (Triage, Build, Review, Merge) with large numerals.
- `.factory-cta`: cobalt CTA band with a short question and booking button.

## Blog

- `.blog-page` / `.blog-hero`: cobalt hero, lime display H1, one-line description.
- `.blog-list`: full-width rows separated by 2 px ink rules; each row contains date, title, summary and a “Read the post →” line. The whole row is the link.
- `.post-page` / `.post-head` / `.post-body`: cobalt head with back link, title, date and read time; body limited to 44rem with 1.7 line height.
- Post body supports `h2`, paragraphs, ordered and unordered lists, blockquotes, inline code, bold and links.
- Meta and JSON-LD are per post.

## 404

`.not-found` — centred cobalt panel, lime display “404”, one paragraph, two buttons (home, Factory). Marked `noindex`.

## States checklist

Every interactive component has: default, hover (pointer devices only), focus-visible (3 px ring, offset 3–4 px), active where relevant, and disabled/empty where relevant. Motion is removed under `prefers-reduced-motion: reduce`. Colour pairs were checked with the contrast script; all 19 pairs pass WCAG AA.
