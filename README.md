# Nadia Benali — portfolio

A static portfolio built from scratch: home page, Factory page, a blog with three posts, a 404 page, RSS feed and sitemap. No framework, no build step, no dependencies. Open it over HTTP and it runs.

This is a clean-room rebuild. The layout and interaction patterns were measured from a reference site, but every line of HTML, CSS and JavaScript here was written fresh. All copy, names, products, metrics and artwork are original placeholders.

## Run it locally

The pages use root-absolute paths (`/styles/site.css`, `/assets/...`), so `file://` will not work. Serve the folder:

```bash
# any one of these
python -m http.server 4173
npx serve -l 4173
php -S localhost:4173
```

Then open <http://localhost:4173/>.

There is no install step and nothing to compile.

## Structure

```
/
├── index.html                     Home: hero, ticker, products, Factory strip,
│                                  Lab, services, clients, timeline, stack,
│                                  channels, closing
├── factory/
│   └── index.html                 The Factory: floor, office preview, cast,
│                                  four-step process, CTA
├── 404.html                       Not-found page (noindex)
├── blog/
│   ├── index.html                 Post list
│   ├── how-a-change-ships.html    Post, 11 Nov 2026
│   ├── pricing-the-payout.html    Post, 14 Oct 2026
│   ├── delete-a-feature.html      Post, 2 Sep 2026
│   └── rss.xml                    Feed with the same three posts
├── styles/
│   ├── tokens.css                 Colour, type, spacing, motion tokens, @font-face
│   └── site.css                   Components and responsive rules
├── scripts/
│   ├── site.js                    Hero + project-card motion, nav state, Lab filtering
│   └── scroll-restore.js          Forces reloads to open at the top
├── assets/
│   ├── avatar-up.svg              Hero portrait
│   ├── avatar-front.svg           Closing portrait
│   ├── favicon.svg                Favicon
│   ├── og.png                     Social card, 1200 × 630
│   ├── og.svg                     Source for the social card
│   ├── office.svg                 Factory office illustration
│   ├── shots/                     Pollen + Relay product mocks
│   ├── cast/                      Five agent characters
│   └── fonts/                     Self-hosted WOFF2 + OFL licences
├── sitemap.xml
├── robots.txt
└── replica/                       Recon, architecture, design and build notes
```

## Placeholders to replace before launch

Everything below is fictional. The site is designed so each one can be swapped without touching layout.

| What | Where | Current placeholder |
| --- | --- | --- |
| Name and wordmark | `<title>`, `nav-logo`, footer, JSON-LD | **Nadia Benali**, wordmark **NADIA** |
| Domain | canonical, Open Graph, `sitemap.xml`, `robots.txt`, RSS | `https://nadia.studio/` |
| Booking link | All “Let’s talk”, “Book a call”, “Yours next?” links | `https://cal.com/` |
| Email | Not present; add a `mailto:` if you want one | — |
| Products | Hero, products, footer, posts | Pollen and Relay |
| Product links | “pollen.studio”, “relay.money” | `https://example.com` |
| Lab projects | Ten rows in `#lab` | Crate, Open Mic, Cutroom, Cohort, Desk, The Build Show, Agent Bench, Prompt Kit, Loop, Mapa |
| Lab links | Project names | `https://example.com`, except Agent Bench → `/factory` |
| Client names | `#trusted` | Northwind, Lumen, Acme, Kite, Harbor, Studio One, Local Lab, Meridian, Foundry |
| Metrics | Ticker, product facts, posts | 120K members, €900K paid, 180M views, etc. |
| Social handles | `#content` and closing | `@nadiabuilds`, `nadia-benali`, platform homepages |
| GitHub link | Nav of Factory page, channels | `https://github.com/` |
| Office view | `/factory#office` | Static SVG illustration, labelled as a preview |
| Blog posts | `blog/` | Three posts written for this rebuild |
| Dates | Blog posts, footer | 2026 |

The Factory page says the office is a preview. It is not a live feed and no agents are actually running. Do not put real client logos or real personal data on this site until you have the rights to them.

## Design system

Tokens live in `styles/tokens.css` and are the only place raw values should appear. Components consume `var(--…)`.

- **Surface:** cobalt `#064cce`, deep cobalt `#002472`, paper `#f4f7fc`
- **Ink:** `#021239`, muted `#314262`
- **Highlight:** lime `#b1ef4a`, tangerine `#ff8338`
- **Type:** Bowlby One (display), Bricolage Grotesque (text)
- **Spacing / radius / motion:** tokenised in the same file

To rebrand, change the tokens first. Then update the SVGs in `assets/` that use hard-coded colour. A contrast pass was run on 19 text/background pairs with zero AA failures.

## Accessibility and behaviour

- Skip link, landmarks, one `h1` per page, visible focus rings.
- The hero is scroll-linked: side columns slide inward and fade in, the avatar scales and lifts, and the wordmark has a configurable parallax speed. All values live in `MOTION` at the top of `scripts/site.js`.
- Project cards pop in once when their top crosses 85% of the viewport: opacity, a 60 px rise, 0.92 scale and 2deg rotation settle on a back-out curve, with a 90 ms stagger per batch (capped at 400 ms). The heading leads by 100 ms. Screenshot, text and facts animate inside the card, and hover lift only unlocks once the entrance has settled. An inline head script sets `js-motion` before first paint, so cards are hidden without a flash but remain visible if JavaScript never runs. All timings are in `MOTION.projects`; hidden cards stay in the accessibility tree and tab order.
- Lab filters are real buttons with `aria-pressed`; results are announced through a polite live region. Filtering is an enhancement — all rows are visible without JavaScript.
- The fixed nav turns solid at 100 px, hides after 200 px while scrolling down, and returns on scroll up. It stays put while focused.
- `prefers-reduced-motion: reduce` disables the scroll-linked transforms and the ticker, and shows the hero in its final readable state.
- A reload always opens at the top: `scripts/scroll-restore.js` sets `history.scrollRestoration = "manual"` before load and re-scrolls to `0` if the browser restores late. Normal navigations, deep links with a hash, in-page anchors and back/forward are left alone.
- Images carry explicit dimensions to avoid layout shift; decorative art is `aria-hidden` or has empty `alt`.
- All pages work without JavaScript; only motion, filtering and nav state change.

## Fonts

Self-hosted in `assets/fonts/`:

- **Bowlby One** — SIL Open Font License 1.1 (`OFL-BowlbyOne.txt`)
- **Bricolage Grotesque** — SIL Open Font License 1.1 (`OFL-BricolageGrotesque.txt`)

Both are served locally; there are no Google Fonts requests at runtime.

## Deploying

Upload only the public site files:

```
index.html  factory/  blog/  404.html
styles/  scripts/  assets/
sitemap.xml  robots.txt
```

Do **not** upload `replica/` or `README.md`. `replica/` holds recon notes, reference screenshots of the original site and QA captures; it is internal working material, not part of the site and not licensed for publication.

Any static host works: Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx. Point the host’s 404 handler at `/404.html`. If you deploy to a subpath instead of a domain root, rewrite the root-absolute paths or add a `<base>` — this build assumes it owns the root.

After changing the domain, update: canonicals, Open Graph URLs, `sitemap.xml`, `robots.txt`, `blog/rss.xml`, and the JSON-LD blocks.

## Licence and credits

The code and copy in this repository are original work for this rebuild. The artwork is hand-built SVG, with a PNG social card rendered from it. Fonts are used under the OFL; their licence files are included. Do not reuse the reference site’s trademarks, client logos, screenshots or copy.
