# Darjeeling Car Rental Service — Khangri Karpoo
## Website design & build plan

**Status:** built. Ten pages generating clean, all assets resolving.
**Repo:** https://github.com/Paharlaya/DARJEELING-CAR-RENTAL-SERVICE

**Decisions locked:**
- Each itinerary card opens a **dedicated page** — nine of them
- Detail pages use a **day accordion on the left, synced image on the right**
- **No prices anywhere.** Every price slot is *Enquire on WhatsApp*, package pre-filled
- The enquiry form sends via **WhatsApp deep-link**, no backend
- Pages are named `package-01.html` … `package-09.html` (see §9 for the SEO trade-off)
- Contact: **+91 93062 20309**, Victoria Rd, Chauk Bazaar, Darjeeling 734101. Email still a placeholder
- Fleet: Wagon R, Swift Dzire, Innova, Innova Crysta, Bolero, Sumo Gold

---

## 1. What this site is

A premium marketing site for a Darjeeling/Sikkim taxi and tour operator: one homepage plus nine itinerary pages. Its single job is **to start a WhatsApp conversation about a specific package**. Everything on the page serves that one action.

Audience: domestic Indian travellers (Kolkata, Delhi, Bengaluru, Mumbai) planning a 4–7 day Himalayan trip, comparing three or four operators, deciding on trust and clarity. They are on a phone roughly 70% of the time.

Because prices are hidden, the site has to earn the enquiry on **credibility and clarity** instead of undercutting on a number. That raises the stakes on two things: the day-by-day has to be genuinely well presented, and contact has to be permanently within thumb reach.

---

## 2. Colour — sampled from the logo, nothing invented

I decoded `car-rental-logo.png` and pulled the actual dominant values rather than guessing at "gold black green". The logo's gold is a warm *antique* gold with a dark bronze shadow and a pale champagne highlight — noticeably softer and more expensive than the usual `#D4AF37` "luxury gold". That range is the whole personality of the palette.

| Token | Hex | Sampled from | Role |
|---|---|---|---|
| `--ink` | `#050C08` | logo background (`#000800`, `#040C04`) | page base, footer |
| `--forest` | `#0C1C14` | terraced field shadows (`#0C1C14`, `#0C1C10`) | cards, surfaces |
| `--forest-lift` | `#12281C` | terrace midtones (`#102018`) | hover surface, inputs |
| `--gold` | `#C1A063` | logo mid-gold | primary accent, rules, buttons |
| `--gold-hi` | `#E2C795` | gilded highlight (`#E0C490`, `#E0C08C`) | glints, gradient tops, focus rings |
| `--gold-deep` | `#7C643C` | gold shadow side (`#7C643C`, `#745C34`) | resting borders, dividers |
| `--bone` | `#F8F8F0` | logo lettering / snowcap (`#F8F8F0`, `#FCFCF4`) | light sections, primary text on dark |
| `--sage` | `#8A9A8C` | derived from forest + silver (`#C0BCAC`) | secondary text, captions |

**Deliberate omission:** no blue, no terracotta, no red. Nothing enters the palette that isn't in the logo.

Gold is used as **line, not fill**. Hairline rules, 1px borders, thin underlines, small-caps labels. Large gold fills are reserved for exactly two things: the WhatsApp CTA and the active carousel progress bar. This is what separates "premium" from "gaudy" — gold reads as expensive at 1px and cheap at 100px.

---

## 3. Typography

| Role | Face | Why this one |
|---|---|---|
| Display | **Bodoni Moda** | The logo wordmark *is* a high-contrast Didone with sharp bracketed serifs. Matching it makes the page feel like an extension of the logo rather than a container for it. The variable optical-size axis keeps the hero setting razor-thin while card and day titles thicken up and stay readable. |
| Body | **Jost** | Geometric sans in the Futura line. Didone + geometric-sans is the durable editorial-luxury pairing, and its wide round bowls stay legible at 15px on a phone — which is where this site actually lives. |
| Data | **IBM Plex Mono** | Package codes (`GLD-07`), route notation (`G3>L1>D2`), day numbers, distances, altitudes, seat counts. The business runs on trip sheets and permits; a mono face makes those figures read as *records*, not marketing. |

Type scale (1.25 ratio, fluid via `clamp()`): 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61px.

The display face gets four uses and no more — hero headline, section titles, card titles, day titles. Everywhere else is Jost or Plex Mono. Restraint is what keeps a Didone expensive.

---

## 4. The signature element: **the Ridgeline**

One idea carried all the way through, instead of scattered decoration.

A single gold hairline threads the site, changing job as it goes — because the product being sold is literally *a route through mountains*.

**On the homepage it runs horizontally.** Under the header it's a hairline band carrying the fret/meander pattern from the logo's outer ring, at 1px and 25% opacity. Between sections it becomes a **terrace contour** — a few nested gold curves echoing the stepped tea fields in the logo, replacing every `<hr>`. Under the fleet car it becomes the **turntable ellipse**.

**On every itinerary card it becomes the route chain:**

```
   NJP ─────●●●───── Gangtok ─────●●───── Darjeeling ─────▸ NJP
                        3 nights            2 nights
```

The operator's own package codes already encode this: `GKD-06 (G2>K1>D2)` means Gangtok 2 nights, Kalimpong 1, Darjeeling 2. That notation is **real data**, so I'm drawing it rather than inventing decorative `01 / 02 / 03` numbering. A traveller compares two packages at a glance without reading a word. Filled dots = nights in that town.

**On the detail page it rotates 90° and becomes the day spine** — a vertical gold rail down the left of the accordion, one node per day, the open day's node filled. You literally descend the ridgeline as you read the trip. Same line, same language, now doing the navigation.

**The risk I'm taking:** the ridgeline is one continuous SVG path per page, not four separate graphics, and it draws itself in on scroll via `stroke-dasharray`. The line advances as you travel down the page. Under `prefers-reduced-motion` it is simply present from the start, fully drawn. Justification: it makes the site feel like a journey rather than a stack of sections, which is the product.

---

## 5. Homepage structure

Exactly the order specified.

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]                    ☎ +91 …   ⌾ WhatsApp   ✉ Email   │  sticky, condenses on scroll
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ gold fret hairline ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│                                                              │
│                    ░░ 5-SLIDE CAROUSEL ░░                    │
│         Khangchendzonga, at four in the morning.              │  display headline, left-set
│         ────────────────────────                              │
│         Nine routes through Darjeeling & Sikkim.              │
│         [ See the routes ]   [ WhatsApp us ]                  │
│  ▬▬▬▬▬  ─────  ─────  ─────  ─────                          │  gold progress bars, not dots
│                                                              │
├──────────────── terrace contour divider ────────────────────┤
│  OUR ROUTES                                    on --bone     │
│  Nine itineraries, four to seven days.                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  image   │  │  image   │  │  image   │                    │
│  │ D-04     │  │ G-04     │  │ GD-05    │  ← mono code       │
│  │ Darjeeling│ │ Gangtok  │  │ Gangtok &│  ← Bodoni title    │
│  │          │  │          │  │ Darjeeling│                   │
│  │ ●●●route │  │ ●●●route │  │ ●●route  │  ← ridgeline       │
│  │ 3N / 4D  │  │ 3N / 4D  │  │ 4N / 5D  │  ← mono, gold      │
│  │ View →   │  │ View →   │  │ View →   │                    │
│  └──────────┘  └──────────┘  └──────────┘                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   rows of 3        │
│  │ GP-05    │  │ GL-05    │  │ GKD-06   │                    │
│  └──────────┘  └──────────┘  └──────────┘                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ GD-06    │  │ GP-06    │  │ GLD-07   │                    │
│  └──────────┘  └──────────┘  └──────────┘                   │
├──────────────── terrace contour divider ────────────────────┤
│  THE FLEET                                     on --ink      │
│                                                              │
│         ◂           ╔═══════════╗           ▸               │
│                      ║  car.png  ║                           │
│                     ╚═══════════╝                            │
│              ╰──── gold ellipse ────╯                        │
│      INNOVA CRYSTA · 6 seats · 4 bags · best for 4–6         │
│      ○ ● ○ ○                                                 │
├──────────────── terrace contour divider ────────────────────┤
│  PLAN YOUR JOURNEY                             on --forest   │
│  ┌────────────────────┐  ┌─────────────────────────┐         │
│  │ Name               │  │  ☎  +91 …               │         │
│  │ Phone / WhatsApp   │  │  ⌾  WhatsApp us         │         │
│  │ Package ▾ (prefill)│  │  ✉  email               │         │
│  │ Dates    Travellers│  │  ◉  Darjeeling, WB      │         │
│  │ Message            │  │                         │         │
│  │ [ Send on WhatsApp]│  │   ⟡ endless-knot mark   │         │
│  └────────────────────┘  └─────────────────────────┘         │
├──────────────────────────────────────────────────────────────┤
│  [logo mark]   routes · fleet · contact      © 2026          │  --ink
└──────────────────────────────────────────────────────────────┘
```

**Header.** Logo left, three contact affordances right as gold-hairline pills. Sticky. On scroll past the hero it condenses (96px → 64px, background from transparent to `--ink` at 92% with a backdrop blur, logo shrinks). On mobile the pills become icon-only, plus a **fixed bottom bar with Call and WhatsApp** — for this business that bar is the single highest-value element on the site.

**Carousel.** 5 full-bleed slides, slow Ken Burns drift, 6s each, crossfade. Vertical `--ink` scrim from the bottom so type never fights the photo. Headline is left-set, not centred — centred hero type is the templated default and it wastes the left reading edge. Indicators are five thin gold rules where the active one fills left-to-right, so you can see how long until it moves. Pauses on hover, on focus, and under `prefers-reduced-motion` (first slide only).

**Itineraries.** 3 × 3 on desktop, 2-up at ≤900px, 1-up at ≤600px. Ordered as a **ladder of increasing days** (4, 4, 5, 5, 5, 6, 6, 6, 7) so scanning down the grid is scanning up in commitment — the order itself carries information. With prices gone, **duration becomes the scannable figure** and gets the mono/gold treatment. Whole card is one link to its page. Hover: gold border brightens from `--gold-deep` to `--gold`, image scales 1.04, route chain draws in.

**Fleet.** Car PNGs on transparent backgrounds, centre-stage on the gold turntable ellipse with a soft gold floor-glow. Advancing rotates the outgoing car away and the incoming car in. Subtle tilt following the pointer on desktop. Specs in Plex Mono beneath.

**Contact.** Form left, direct-contact rail right with the logo's endless knot as a large low-opacity watermark. Fields: name, phone/WhatsApp, email, package, travel date, travellers, message. Submitting composes a WhatsApp message and opens it — see §8.

**Footer.** Quiet. Logo mark, three anchor links, copyright, one fret hairline.

---

## 6. Itinerary detail page — the standard template

One template, nine pages. Day accordion on the left, image panel on the right, as specified.

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]                    ☎   ⌾ WhatsApp   ✉               │  same sticky header
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ gold fret hairline ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│  ‹ All routes                                                │
│                          ░░ hero image, --ink scrim ░░       │
│  GLD-07                                                      │  mono, gold
│  7 Days Gangtok ·                                            │  Bodoni, large
│  Lachung · Darjeeling                                        │
│  6 NIGHTS / 7 DAYS                                           │  mono
│  NJP ──●●●── Gangtok ──●── Lachung ──●●── Darjeeling ──▸ NJP │  route chain
│  [ Enquire on WhatsApp ]                                     │
├──────────────── terrace contour divider ────────────────────┤
│  THE JOURNEY, DAY BY DAY                                     │
│                                                              │
│  ┌─ accordion (LHS, 7 cols) ───┐ ┌─ image (RHS, 5, sticky)─┐ │
│  │ ●  DAY 01                   │ │                         │ │
│  │ │  Bagdogra → Gangtok     ▲ │ │                         │ │
│  │ │                           │ │     day 01 image        │ │
│  │ │  Met at the airport and   │ │     (crossfades on      │ │
│  │ │  driven up along the      │ │      day change)        │ │
│  │ │  Tista. …                 │ │                         │ │
│  │ │                           │ │                         │ │
│  │ │  124 KM · 4 HRS · 1,650 M │ │                         │ │
│  │ │                           │ └─────────────────────────┘ │
│  │ ○  DAY 02                   │  TISTA VALLEY · 124 KM      │
│  │ │  Tsomgo Lake & Baba     ▾ │  ↑ mono caption             │
│  │ │  Mandir                   │                             │
│  │ ○  DAY 03                   │                             │
│  │ │  Gangtok → Lachung      ▾ │                             │
│  │ ○  DAY 04  Yumthang Valley▾ │                             │
│  │ ○  DAY 05  → Darjeeling   ▾ │                             │
│  │ ○  DAY 06  Tiger Hill     ▾ │                             │
│  │ ○  DAY 07  Departure      ▾ │                             │
│  └─────────────────────────────┘                             │
├──────────────── terrace contour divider ────────────────────┤
│  PLACES COVERED                                on --bone     │
│  ⟡ Gangtok  ⟡ Tsomgo Lake  ⟡ Lachung  ⟡ Yumthang  ⟡ …       │  gold hairline chips
│                                                              │
│  WHAT'S INCLUDED          NOT INCLUDED                       │  two columns
│  ✓ Vehicle, fuel, tolls   — Hotels & meals                   │
│  ✓ All transfers          — Entry fees & permits              │
│  ✓ Driver allowance       — Anything not listed               │
│                                                              │
│  VEHICLE   Innova Crysta · 6 seats · fuel, tolls & parking    │
├──────────────── terrace contour divider ────────────────────┤
│  OTHER ROUTES        3 cards, same design as homepage        │  on --ink
├──────────────────────────────────────────────────────────────┤
│  ENQUIRY FORM  +  FOOTER      identical to homepage          │
└──────────────────────────────────────────────────────────────┘
```

### How the accordion behaves

- **One day open at a time.** Day 1 is open on load.
- **Clicking a day** expands its copy on the left and **crossfades the right-hand image** to that day's photo. The image panel is `position: sticky` so it stays beside whichever day you're reading.
- **The day spine** is the ridgeline turned vertical: a 1px gold rail with one node per day. The open day's node fills solid gold and its title goes from `--sage` to `--bone`. Closed days keep a hollow node. The rail is the only decoration in this section — everything else is type.
- **Facts get the mono treatment.** Distance, drive time and altitude sit at the foot of each open day as a Plex Mono line, visually separated from the prose. These are the details that make an operator look like they know the road.
- **Mobile (≤820px):** the two columns collapse to one and the image moves *inside* the open day's panel, directly under its heading. No side panel, no cramming — the accordion still works exactly the same way.
- **Keyboard and a11y:** each day header is a real `<button>` with `aria-expanded` and `aria-controls`; panels are `role="region"` labelled by their header. Enter/Space toggles. Focus ring is `--gold-hi`. Content is in the DOM whether open or closed, so it is fully indexable and findable with ⌘F.
- **Deep links:** `…/gld-07.html#day-3` opens day 3 directly and scrolls to it. Useful when you want to send a customer straight to a specific day over WhatsApp.
- **Reduced motion:** panels snap open, images cut instead of crossfading.

---

## 7. The nine packages

Sorted into the ladder described in §5. Prices are recorded in the JSON for your internal reference but **rendered nowhere** — every price slot is an *Enquire on WhatsApp* action instead.

| # | Code | Title | Nights/Days | Route notation |
|---|---|---|---|---|
| 1 | `D-04` | 4 Days Darjeeling | 3N / 4D | D3 |
| 2 | `G-04` | 4 Days Gangtok | 3N / 4D | G3 |
| 3 | `GD-05` | 5 Days Gangtok & Darjeeling | 4N / 5D | G2>D2 |
| 4 | `GP-05` | 5 Days Gangtok & Pelling | 4N / 5D | G2>P2 |
| 5 | `GL-05` | 5 Days Gangtok & Lachung | 4N / 5D | G3>L1 |
| 6 | `GKD-06` | 6 Days Gangtok · Kalimpong · Darjeeling | 5N / 6D | G2>K1>D2 |
| 7 | `GD-06` | 6 Days Gangtok & Darjeeling | 5N / 6D | G3>D2 |
| 8 | `GP-06` | 6 Days Gangtok & Pelling | 5N / 6D | G3>P2 |
| 9 | `GLD-07` | 7 Days Gangtok · Lachung · Darjeeling | 6N / 7D | G3>L1>D2 |

Day-by-day content, places covered, inclusions and vehicle notes were captured for all nine.

**One thing I need to flag.** The source pages belong to sikkim.taxi / 99Taxi. I've taken the *facts* — durations, routes, places, night splits, which aren't anyone's property — but I will **rewrite every line of prose in your own voice** rather than paste theirs. Copying it verbatim would be a copyright problem, and it would make your site read like theirs, which defeats the point of a distinctive design. Their contact details (`+91 8900 771 888`, `99Taxi.in@gmail.com`) will not appear anywhere on your site; I need yours.

---

## 8. WhatsApp as the only conversion path

Every CTA on the site resolves to one `wa.me` deep link with the message pre-written.

**From an itinerary card or page:**

> Hi Khangri Karpoo — I'd like to enquire about **GLD-07, 7 Days Gangtok · Lachung · Darjeeling (6N/7D)**. Could you share the price and availability?

**From the enquiry form,** the same link with the fields folded in:

> Hi Khangri Karpoo — I'd like to enquire about **GLD-07 …**.
> Name: Anita Rao · Travelling: 14 Oct 2026 · Travellers: 4
> Message: We'd like an extra night in Pelling if possible.

Mechanics: one `WHATSAPP_NUMBER` constant in `assets/js/enquiry.js`, message built with `encodeURIComponent`, opened in a new tab. Works on desktop WhatsApp Web and hands off to the app on mobile. The package dropdown pre-fills when you arrive from a card, and the form validates name and phone before it will build the link. `tel:` and `mailto:` links stay in the header as fallbacks for people who don't use WhatsApp.

No backend, no API key, nothing to maintain or pay for.

---

## 9. Tech

Plain static **HTML + CSS + vanilla JS**. No framework, no runtime dependencies.

Ten pages that share a header, footer, enquiry form and card component is exactly the point where hand-copying HTML starts to rot, so there's one **zero-dependency Node build script** that renders the nine itinerary pages from `data/itineraries.json` and a single template. Verified available: **Node v22.19.0**. No `npm install`, no lockfile, no framework — just `node build.js`, and the output is plain static files that GitHub Pages serves as-is.

```
index.html                  ← generated
itineraries/
  package-01.html … package-09.html   ← generated, shortest route first
templates/
  index.html  itinerary.html          ← page shells with {{TOKENS}}
partials/
  header.html  footer.html  mobile-bar.html  enquiry.html
data/
  itineraries.json          ← single source of truth for everything
build.js                    ← zero-dep generator
assets/
  css/main.css              ← tokens first, then components
  js/
    site.js                 ← header condense, contour draw-in, reveals
    carousel.js             ← hero slides
    fleet.js                ← car turntable
    itinerary.js            ← day accordion + image sync + deep links
    enquiry.js              ← WhatsApp link builder + prefill
  img/
    logo.png                ← 424px web version; logo-full.png is the original
    hero/01–05.jpg          ← your five photos, JPEG-optimised
    fleet/*.png             ← your six cars, cropped to a common canvas
    placeholders/*.svg      ← generated fallback art
README.md                   ← how to edit content and rebuild
```

Two things worth recording about how this ended up:

**The day library.** The nine packages share their days — "Tsomgo Lake" appears in eight routes. Rather than repeat it eight times, each day is written once in `dayLibrary` and referenced by key (`"itinerary": ["arrive-gangtok", "tsomgo", …]`). 17 day entries cover all 48 days across the nine packages, so a correction lands everywhere at once. The build validates that each package's night counts and day counts agree with its notation, and fails loudly if not.

**Page naming.** `package-01.html` was the explicit request. It does cost some search visibility — `gld-07.html` puts the route code in the URL where both Google and the customer can read it. `build.js` carries a one-line `PAGE_NAMING` switch to flip back; all internal links follow automatically.

Fixing a typo means editing one JSON entry and running `node build.js`. The README documents this so content can be updated without me.

**Quality floor** (built in, not bolted on): responsive to 320px; visible gold focus rings on every interactive element; `prefers-reduced-motion` respected throughout; semantic landmarks and real `alt` text; carousel keyboard-operable and pausable; form labels properly associated; per-page `<title>`, meta description and Open Graph tags so WhatsApp link previews look right. Contrast checked against WCAG AA — `--bone` on `--ink` is ~17:1, `--gold` on `--ink` ~7.5:1, both pass comfortably.

Fonts via Google Fonts to start; I'll self-host in a follow-up pass if you want the extra ~200ms.

---

## 10. Assets — what's in, what's still wanted

**In and working.** Five hero photos (Darjeeling at dawn, a North Sikkim lake, Batasia Loop, Buddha Park at Ravangla, a Himalayan temple) converted to JPEG — 3.7 MB of PNG down to 880 KB. Six vehicle PNGs, each cropped to the car and composited onto a common 900 × 520 transparent canvas so all six sit at consistent visual weight on the turntable. The logo cut from 1.2 MB to 278 KB for the header, with the original kept as `logo-full.png`.

Every route card and every accordion image points at one of the five real photos, thematically matched. **Each image's caption describes the actual photograph, not the day** — so the Batasia Loop shot is never captioned as somewhere it isn't. When real photos arrive, the caption and `alt` should be updated with them.

**Still wanted, in order of how much it would improve the site:**

| Asset | Spec | Why it matters |
|---|---|---|
| Hero photos at full size | ≥2000px wide | The current five are only 900px. On a desktop full-bleed hero they look soft. This is the single biggest visual upgrade available. |
| A larger Swift Dzire PNG | transparent, ≥1200px wide | The source was 301px and had to be upscaled 3×, so it's the one soft car on the turntable. |
| Day photos | landscape, ≥1200px wide | 17 unique days. Real photos of Tsomgo, Yumthang, Lachung, Pelling and Kalimpong would carry the itinerary pages. |
| Route card photos | landscape, ≥1200px wide | Nine — one per package. Currently five photos rotate across the nine cards. |
| Email address | — | Still `PLACEHOLDER@example.com`. |

If any path breaks, pages fall back to generated ridgeline art in the brand palette rather than a broken-image icon — no stock photos pulled from a URL, so nothing licensed lands in the repo by accident.

---

## 11. Build order

1. Tokens, fonts, reset, the ridgeline SVG system
2. `data/itineraries.json` — all nine packages, prose rewritten
3. Sticky header, mobile contact bar, footer, partials
4. Hero carousel
5. Itinerary grid with route chains
6. Fleet turntable
7. `templates/itinerary.html` + `build.js` → the day accordion with image sync
8. Enquiry form + WhatsApp link builder + prefill
9. Responsive pass at 1440 / 1024 / 768 / 390 / 320
10. Accessibility + reduced-motion pass
11. Screenshot review, then a cut pass — remove one thing that isn't earning its place

---

## 12. What I rejected, and why

Worth recording so we don't drift back into it:

- **Cream background + high-contrast serif + terracotta accent.** The current default look for AI-generated design. Also wrong here: the logo lives on black, and putting it on cream throws away the gilt.
- **Numbered `01 / 02 / 03` markers on the cards.** The nine packages aren't a sequence, they're alternatives — numbering would imply an order that doesn't exist. The route chain says something true instead. (Day numbers on the detail page *are* a real sequence, so they stay.)
- **A stats band** ("500+ Happy Travellers · 10 Years · 24/7"). Unverifiable, on every template, and it delays the thing people came for.
- **Tabs instead of an accordion** for the days. Tabs hide the shape of the trip; an accordion lets you see all seven days at once and open one. For a 7-day itinerary, seeing the whole arc matters.
- **Full-width gold gradients and gold section fills.** Gold reads as expensive as a hairline and cheap as a wash.
- **Parallax on everything.** One orchestrated motion idea (the ridgeline drawing itself) lands harder than six competing effects, and it's the difference between a page that feels designed and one that feels generated.

---

## 13. Still open

1. **Email address** — still `PLACEHOLDER@example.com` in `data/itineraries.json`. Worth pointing at the domain once you buy one.
2. **Seat and luggage counts** — I set sensible figures per vehicle (Wagon R 4/1, Dzire 4/2, Innova 6/3, Crysta 6/4, Bolero 7/3, Sumo Gold 8/3). Correct any that are wrong and rebuild.
3. **Photos** — see §10.
4. **Verification I could not do here.** The browser tooling wasn't available in this session, so the site is verified structurally — all ten pages generate, every asset resolves, tags balance, no duplicate IDs, every image has alt text, one `<h1>` per page — but **it has not been looked at in a browser.** Worth opening it and checking the carousel timing, the accordion image sync, and the layout at phone width before it goes live.
