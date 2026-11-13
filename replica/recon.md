# Recon map: Melek Gharbi portfolio (web)

Scope: the public portfolio site at <https://melek.bakchich.cc> — home page, Factory page, blog index, blog post, and the responsive/interaction behaviour around them.
For: a clean-room rebuild for the user (identity/content decision pending).
Date: 2026-11-11

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Home page | https://melek.bakchich.cc/ | rendered page read at 800 px and 1000 px widths; DOM, computed styles and screenshots |
| 2 | Factory page | https://melek.bakchich.cc/factory | hero, live office feed, cast, 4-step process, CTA |
| 3 | Blog index | https://melek.bakchich.cc/blog | one published post on 2026-11-11 |
| 4 | Blog post | https://melek.bakchich.cc/blog/how-my-software-factory-works | article layout, 2 min read |
| 5 | RSS | https://melek.bakchich.cc/blog/rss.xml | feed linked from `<head>` |
| 6 | Public outbound links | ba9chich.com, clip2earn.money, aurastack.link, ihateediting.ai, demonetized.xyz, github.com/manfromtunis, github.com/artguru-tech-team/claude-skills-public, cal.com/melek-gharbi/secret | destinations, not cloned |
| 7 | Public style sheet | /_next/static/immutable/chunks/2l2n7u6mmtdjg.css | read for tokens, breakpoints and layout metrics only; no CSS or JS copied into the build |

Notes on method: no login, no paywall, no bulk crawl. No JS bundles were read. Screenshots in `replica/screens/` are reference only and never ship.

## Core loop

A visitor scans proof of work (metrics, two flagship products, Lab experiments, timeline, stack), decides Melek can build and sell their product, and books a call.

## Design tokens observed

| token | value |
| --- | --- |
| cobalt | `#064cce` (lab override `lab(35.7781% 23.7932 -73.5839)`) |
| cobalt-deep | `#002472` |
| ink | `#021239` |
| ink-soft | `#314262` |
| paper | `#f4f7fc` |
| lime | `#b1ef4a` |
| lime-bright | `#befd5a` |
| tangerine | `#ff8338` |
| live green | `#46b427` |
| gutter | `clamp(1.25rem, 4vw, 4rem)` |
| section rhythm | `clamp(4.5rem, 10vw, 9rem)` |
| display face | Bowlby One 400 (Google Fonts) |
| text face | Bricolage Grotesque 200–800 variable (Google Fonts) |
| body | 17 px / 1.55 |
| radius | 999 px pills, 0.75–2 rem cards |
| motion ease | `cubic-bezier(.22, 1, .36, 1)` |

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Home | `/` | proof of work and conversion to a call | fixed nav, wordmark hero, avatar, hero lists, ticker, 2 flagship cards, factory strip, Lab + filters, 3 services, logo wall, timeline, stack, channels, closing CTA, footer | desktop/tablet at 800 & 1000 px, scrolled nav (raised/hidden), filtered Lab, hover states, motion-on/off |
| S02 | Factory | `/factory` (nav, strip, Lab row) | explain the agent team and show the office | hero, quiet/live office status, live iframe, 5 cast cards, 4 process steps, CTA, footer | office quiet (empty floor); live state not captured |
| S03 | Blog index | `/blog` (nav, channel list, footer) | list posts | cobalt hero, post list, read time, footer | one post; empty state not present |
| S04 | Blog post | `/blog/how-my-software-factory-works` | long-form article | back link, cobalt post head, meta, article body, CTA, footer | one post, 2 min |
| S05 | 404 | unknown route | recover lost visitors | not captured — infer from shared shell | unknown |
| S06 | Lab filtered | S01, filter chips | narrow the project list | chip group with counts, list rows | All 10, Live 2, Building 4, Open source 2, Experiment 2 |
| S07 | Nav scrolled | S01, scroll | keep navigation available | fixed bar, `data-raised`, `data-hidden` | top / raised / hidden, focus-within |

## Flows

```text
F01 Visitor evaluates Melek and books a call
    S01 hero -> metrics ticker -> flagship cards -> Lab -> services -> closing CTA -> cal.com
    happy path clicks: 1 (closing "Book a call"; nav "Let's talk" is the shortcut)
    edge: external booking in a new tab, no Cal.com availability, mobile nav links hidden

F02 Visitor checks one flagship product
    S01 products -> Bakchich / Clip2Earn card -> product site
    happy path clicks: 1
    edge: screenshot fails to load, external site down

F03 Visitor browses the Lab by status
    S01 Lab -> pick a chip -> read rows -> optional outbound project link
    happy path clicks: 2
    edge: no results (not reachable with the fixed counts), long descriptions wrap, external links

F04 Visitor inspects the Factory
    S01 factory strip -> S02 hero -> office status -> live iframe -> cast -> steps -> book a call
    happy path clicks: 2
    edge: office quiet, iframe blocked/slow, third-party unavailable

F05 Visitor reads the blog
    S01 channels or nav -> S03 index -> S04 post -> back to all posts
    happy path clicks: 2
    edge: one post only, RSS reader

F06 Mobile visitor
    S07 nav -> hero -> sections -> closing CTA
    happy path clicks: hero CTA to products, then closing CTA
    edge: nav section links hidden below 50rem; only logo and Let's talk remain
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Fixed nav | transparent over hero, raised ink, hidden-on-scroll-down | top, raised, hidden, focus-within | S01–S04 |
| Wordmark | hero `MELEK`, closing `LET'S BUILD` | letter stagger, reduced motion | S01 |
| Avatar | looking up (hero), facing camera (closing), idle video | static, video playing, masked edges | S01 |
| Section title | 800 weight, balanced, max 16ch | — | all |
| Button | lime, ghost outline | default, hover, active, focus-visible | all |
| Text link / arrow link | underlined bold, arrow nudge | default, hover, focus | all |
| Ticker | duplicated track, 42 s marquee | running, paused (hover), reduced motion | S01 |
| Flagship card | tangerine (Bakchich), ink (Clip2Earn) | 2-col at 56rem, stack below | S01 |
| Description list | metrics with big dd / small dt | wrap | S01 |
| Lab filter chip | pressed/unpressed, count badge | all, live, building, open source, experiment | S01, S06 |
| Lab row | linked or static; 2-col at 56rem | hover title shift, last border | S01 |
| Status | Live (green), Building (orange), Open source (cobalt), other (ink-soft) | dot + label | S01, S02 |
| Service card | top 45% rule + lime Bowlby title | — | S01 |
| Logo tile | white, decathlon blue `#3643ba`, minassa ink `#14141f`, lime CTA | aspect 4/3, 2 or 5 columns | S01 |
| Timeline item | 3 px top rule, cobalt year | 2/3/6 columns by width | S01 |
| Stack group | top 45% rule + lime title | 2–4+ columns | S01 |
| Channel row | rule, name, description, handle; invert on hover | desktop 3-col | S01 |
| Closing block | wordmark + avatar + deep-blue foot | desktop overlay foot | S01 |
| Footer | ink bar | — | all |
| Factory status | quiet dot (lime, pulsing) / live | quiet, live | S02 |
| Floor room | tangerine / lime / paper rotation | empty, occupied | S02 |
| Cast card | 5-up, illustration + name + joke | — | S02 |
| Process step | number + title + copy | — | S02 |
| Blog list row | date, title, excerpt, read time | hover arrow | S03 |
| Article body | 44rem measure, h2 rhythm, code, lists | — | S04 |
| Live region | polite announcements | idle | S01 |

## Inferred data model

```text
Person        name, role, location, intro, avatar_look_up, avatar_front,
              email_link, linkedin, instagram, github, booking_url
              evidence: S01 hero, closing, footer
              confidence: high

Metric        label, value, position
              evidence: S01 ticker + flagship facts
              confidence: high

Product       slug, name, tagline, role, body, url, accent (tangerine|ink),
              screenshot, facts[{label, value}], order
              evidence: S01 flagship cards
              confidence: high

Project       slug, name, description, status, url|null, order
              status: Live | Private beta | Building | Waitlist open |
                      In production | Open source | Proof of concept | Experiment
              evidence: S01 Lab rows + filter counts
              confidence: high

FilterGroup   label, statuses[], count (derived)
              evidence: S06 chips
              confidence: high

Service       title, description, order
              evidence: S01 "Three ways I can help"
              confidence: high

Client        name, logoSvg|null, tileBackground, qualifier
              evidence: S01 logo wall
              confidence: high

TimelineEntry year, org, note, order
              evidence: S01 "How I got here"
              confidence: high

StackGroup    title, items[], order
              evidence: S01 stack grid
              confidence: high

Channel       name, description, handle, url, order
              evidence: S01 channels
              confidence: high

Post          slug, title, excerpt, published_at, reading_minutes, body
              evidence: S03, S04, RSS
              confidence: high

FactoryAgent  name, line, illustration
              evidence: S02 cast
              confidence: high

FactoryStep   number, title, description
              evidence: S02 steps
              confidence: high

OfficeState   quiet|live, occupied_rooms[], stale_after
              evidence: S02 floor + iframe, S01 strip
              confidence: medium (live feed is external)

Room          name, agents[]
              evidence: S02; empty in captured state
              confidence: guess
```

Relationships: Person 1-n Product, Person 1-n Project, Person 1-n Service, Person 1-n TimelineEntry, Person 1-n Channel, Person 1-n Post, Project n-n FilterGroup, Person 1-n StackGroup 1-n StackItem, FactoryAgent n-n Room.

## Feature matrix

See `features.csv`. Must: 21, should: 10, could: 5, skip: 7.

## Out of scope (cannot or should not be cloned)

- **Live office feed** (`office.bakchich.cc`) — a third-party runtime service and its live data. Rebuild as a static "office" mock with a quiet/live flag, or leave the iframe slot empty.
- **Original 3D character** (`avatar-3d.webp`, `avatar-idle.webm`, `avatar-front.png`) — owned artwork. Replace with an original illustration and animation.
- **Original product screenshots** (`/screens/bakchich-home.webp`, `/screens/clip2earn-brands.webp`) — shots of the real products. Replace with original mock UI.
- **Client logos** (Orange, Decathlon, Microsoft for Startups, AWS Startups, Cloudflare, Product of the Year, Marseille Innovation, Minassa, Sintegra) — trademarks. Replace with original wordmarks/placeholders or the user's real clients with permission.
- **Melek's personal story and copy** — unless the user is Melek or has permission, the clone should carry the user's own name, projects and words.
- **Cal.com booking flow** — link out to a real scheduler; do not rebuild scheduling.
- **Blog CMS / analytics / private APIs** — none are exposed publicly; content is static/MDX.

## Size

Screens 4 (+ states), flows 6, entities 13. Hard parts: original 3D avatar assets, faithful marquee + wordmark animation, the live office integration, and getting the type scale right across breakpoints. Everything else is static content and CSS. **Size: S** (a weekend for a static rebuild), **M** if the Factory live office is rebuilt for real.
