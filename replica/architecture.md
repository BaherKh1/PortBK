# Architecture: portfolio clone (web)

Scope: a clean-room, static rebuild of the Melek Gharbi portfolio structure and behaviour, populated with the user's own placeholder identity and projects.
For: the user's own portfolio (web), static hosting.
Date: 2026-11-11

## Stack

| layer | choice | why |
| --- | --- | --- |
| pages | hand-authored HTML5 | seven public read-only pages; no runtime, no hydration, nothing to break |
| styling | one CSS layer with design tokens | the site is a design showcase; tokens keep the system portable and rebrandable |
| behaviour | one vanilla ES module, no dependencies | hero scroll motion, project-card reveals, nav scroll state and Lab filters only; the site works without it |
| content | authored HTML with `data-*` hooks | no CMS, no database, no build step; deploy the public files as-is |
| assets | original SVG illustrations and mock UI | no owned art, trademarks or product screenshots from the original |
| hosting | any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages) | zero servers, zero cost at this scale |
| analytics | none | not needed for a portfolio demo; add a privacy-friendly script later if wanted |

There is no database and no API. Everything is public, read-only static content. If a blog CMS is added later, keep the HTML output and put the content source behind a build step; do not turn the public site into a runtime app.

## Routes

| method | path | file | what it does | who | flow |
| --- | --- | --- | --- | --- | --- |
| GET | `/` | `index.html` | portfolio narrative | public | F01–F04, F06 |
| GET | `/factory` | `factory/index.html` | agent factory explainer | public | F04 |
| GET | `/blog/` | `blog/index.html` | post list | public | F05 |
| GET | `/blog/how-a-change-ships.html` | `blog/how-a-change-ships.html` | article | public | F05 |
| GET | `/blog/pricing-the-payout.html` | `blog/pricing-the-payout.html` | article | public | F05 |
| GET | `/blog/delete-a-feature.html` | `blog/delete-a-feature.html` | article | public | F05 |
| GET | `/404.html` | `404.html` | recovery | public | — |
| GET | `/blog/rss.xml` | `blog/rss.xml` | feed | public | F05 |
| GET | `/sitemap.xml` | `sitemap.xml` | crawl map | public | — |
| GET | `/robots.txt` | `robots.txt` | crawl policy | public | — |

Outbound only: booking link, product sites, project sites, social profiles. No scheduling backend, no forms, no uploads.

## Content model

The recon data model becomes authored HTML. There is no runtime content store; the shapes below document the repeated markup so it stays consistent:

```text
SITE        name, wordmark, role, location, intro, bookingUrl, socials
PRODUCTS    2 entries   name, tagline, role, body, url, facts[3], theme, shot
PROJECTS    10 entries  name, description, status, url|null, filterGroup
SERVICES    3 entries   title, body
CLIENTS     9 entries   name, tile, qualifier
TIMELINE    6 entries   year, org, note
STACK       4 groups    title, items[]
CHANNELS    4 entries   name, description, handle, url
POSTS       3 entries   slug, title, excerpt, date, minutes, body
FACTORY     cast[5], steps[4], status copy
```

Relationships: one person owns all content. `data-group` on each project drives filtering. The visible chip counts are authored in the markup beside each button; update them by hand when a project is added or its status changes. The live-region total is computed from the visible rows at runtime, so it cannot drift.

Status values and their filter groups:

| status | group |
| --- | --- |
| Live | Live |
| Private beta, Waitlist open, In production, Building | Building |
| Open source | Open source |
| Proof of concept, Experiment | Experiment |

Counts are derived at runtime for the live region only. The chip labels are static text, so keep them in sync when the project list changes. If JS is off, all rows stay visible and the chips act as no-ops.

## Parts that bite

- **Asset originality.** The hero character, cast art and product shots are the original's visual identity. Every one is rebuilt as original SVG/mock UI. Client logos become original wordmarks.
- **No mobile nav.** The original hides section links below 50rem and leaves only the logo and the booking button. Reproduce the behaviour, but add a visible in-page anchor row or keep the closing CTA reachable; test at 390 px.
- **Marquee accessibility.** The ticker duplicates content for a seamless loop. Mark the duplicate `aria-hidden`, pause on hover/focus, and stop it entirely under `prefers-reduced-motion`.
- **Wordmark animation.** Five letters with three offset shadows at 22.5vw can be costly. Animate transform/opacity only, not text-shadow; test on a mid-range phone.
- **External booking link.** The clone must not fake scheduling. Use one configurable URL, open it in a new tab and label the destination honestly.
- **Trademark and identity.** Do not ship the original's name, logos, client marks or copy. The placeholder persona is intentionally fictional and marked for replacement.
- **SEO with no build step.** Keep canonical URLs, Open Graph, JSON-LD, RSS and sitemap hand-written and consistent with the final domain.

## Build order

1. **Vertical slice (M1).** Shared shell, tokens, nav, footer, hero, ticker and closing CTA on `index.html`. Proves the visual system and the conversion path. Screens S01, S07.
2. **Home must-haves (M2).** Flagship cards, factory strip, Lab + filters, services, logo wall, timeline, stack, channels. S01, S06.
3. **Factory (M3).** Hero, quiet/live office mock, cast, steps, CTA. S02.
4. **Blog (M4).** Index, post, RSS, 404. S03, S04, S05.
5. **Polish and quality (M5).** Responsive pass, reduced motion, focus states, metadata, JSON-LD, OG image, sitemap, contrast check, screenshots.
