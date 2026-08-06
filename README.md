# Darjeeling Car Rental Service — Khangri Karpoo

Marketing site: one homepage plus nine itinerary pages. Plain HTML, CSS and
JavaScript — no framework, no `npm install`, nothing to pay for. Deploys to
GitHub Pages by pushing to `main`.

Design notes and the reasoning behind the layout live in [`plan.md`](plan.md).

---

## Editing content

**All content lives in one file: [`data/itineraries.json`](data/itineraries.json).**
Never edit the HTML directly — it is regenerated and your changes would be lost.

After any edit:

```sh
node build.js
```

That rewrites `index.html` and the nine files in `itineraries/`.

### Common edits

| To change | Edit |
|---|---|
| Phone, WhatsApp, email, address | `business` at the top |
| Hero headline, sub-line, slide captions | `hero` |
| Vehicles, seat counts, "best for" | `fleet` |
| A day's wording, distance, altitude | `dayLibrary` — see below |
| A package's title, summary, places, vehicle | `packages` |
| What's included / not included | `included` / `excluded` at the bottom |

### The day library

The nine packages share their days. "Tsomgo Lake" appears in eight routes, so
it is written **once** in `dayLibrary` and each package refers to it by key:

```json
"itinerary": ["arrive-gangtok", "tsomgo", "gangtok-to-lachung", ...]
```

Fix a typo in the Tsomgo day and it is fixed on all eight pages at once. To
override one field for a single package, use an object instead of a string:

```json
"itinerary": ["arrive-gangtok", { "ref": "depart-gangtok", "facts": "130 KM · 5 HRS" }]
```

The build checks itself: if the nights in a package's `stays` don't add up to
its `nights`, or the number of days doesn't match `days`, it fails with the
reason instead of publishing something wrong.

---

## Photos

Current status and what is still wanted: **[`IMAGES.md`](IMAGES.md)**.

To add or replace one, name the file to match its slot and drop it in
`assets/img/days/` or `assets/img/routes/`, then:

```sh
./tools/prep-images.sh   # avif/heic/webp -> jpg, warns on crops and low res
node build.js
```

A correctly named file is picked up with no JSON edit. **Update that entry's
`imgCaption` and `alt` with it** — captions describe the photograph, not the
day, which is what stops a Batasia Loop photo being labelled as somewhere it
isn't.

If a path is ever wrong, the page falls back to generated ridgeline artwork in
the brand palette rather than a broken-image icon.

### Fleet PNGs

The six vehicles were cropped to the car and composited onto a common 900×520
transparent canvas so they sit at consistent visual weight on the turntable.
Match that if you add one. The Swift Dzire came in at 301px and was upscaled —
a larger source would sharpen it.


---

## Package labels and page names

Customers see **`PKG-01` … `PKG-09`**, numbered in the order packages appear in
`packages` (shortest route first). The label matches the filename, so `PKG-07`
is always `package-07.html`.

The `code` field in `itineraries.json` (`D-04`, `GLD-07`, …) is **internal only
and never rendered**. It encodes the route and duration, which makes it handy
for matching a page against your own rate card, so it is worth keeping — but
changing it will not change anything a customer sees.

Reordering `packages` renumbers both the labels and the filenames. If a page is
already indexed by Google or shared over WhatsApp, inserting a package above it
will change its URL — add new packages at the end to avoid that.

`build.js` has a switch near the top:

```js
const PAGE_NAMING = "sequential";  // package-01.html …
// const PAGE_NAMING = "slug";     // d-04.html, gld-07.html …
```

`"slug"` is better for search — the route code ends up in the URL, so both
Google and the customer can see what a page is before opening it. Flip the
constant and re-run; every internal link follows automatically.

---

## How the enquiry flow works

There is no backend. Every call to action builds a `wa.me` link with the
message already written:

- **A route card or page** → "I'd like to enquire about GLD-07, 7 Days
  Gangtok · Lachung · Darjeeling (6N/7D)…"
- **The enquiry form** → the same, plus name, phone, dates and travellers

Nothing is sent until the customer presses send inside WhatsApp. The number
comes from `business.whatsapp` — change it in one place and it updates
everywhere, including the mobile Call/WhatsApp bar.

Prices appear nowhere on the site by design. They are kept in the JSON for
reference only and are never rendered.

---

## Running it locally

Open `index.html` directly, or serve the folder so the relative paths behave
exactly as they will in production:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Deploying to GitHub Pages

1. Push to `main`.
2. Repository **Settings → Pages → Source: Deploy from a branch**, branch
   `main`, folder `/ (root)`.
3. The site appears at
   `https://paharlaya.github.io/DARJEELING-CAR-RENTAL-SERVICE/`.

Every path in the site is relative, so it works both at that sub-path and at a
bare domain later. `.nojekyll` is committed so GitHub serves the files as-is
instead of running them through Jekyll.

### The domain

Live at **https://darjeelingcarrentalservice.com**. `CNAME` at the repo root
holds the domain; DNS points the apex at GitHub's four A records with `www`
as a CNAME to `paharlaya.github.io`.

If the domain ever changes, edit **`business.siteUrl`** in
`data/itineraries.json` and the `CNAME` file, then rebuild. Every canonical
URL, sitemap entry and social preview derives from that one value.

---

## SEO and metadata

All generated by `node build.js` — none of it is maintained by hand:

| File | What it does |
|---|---|
| `sitemap.xml` | All 10 indexable pages, homepage at priority 1.0 |
| `robots.txt` | Allows everything, points at the sitemap, keeps `templates/` `partials/` `tools/` out of the index |
| `404.html` | Styled to match, `noindex`, lists every route so a dead link still converts |
| `site.webmanifest` | Installable on a phone home screen, themed |

Per page: a unique title and description, an absolute canonical, Open Graph
and Twitter tags with **absolute** image URLs (a relative `og:image` does not
resolve when WhatsApp or Google fetches it), and JSON-LD.

The structured data is generated from the same content the page renders, so it
cannot drift: `TaxiService` and `WebSite` on the homepage, and `TouristTrip`
plus `BreadcrumbList` on each itinerary — which is what lets Google show the
breadcrumb trail under the result.

Every `<img>` carries its real `width` and `height`, read out of the file
header at build time. Without those the browser cannot reserve space and the
page jumps as images load, which is the largest single source of layout shift.
The hero image is preloaded at high priority for a faster Largest Contentful
Paint.


---

## Live

**https://darjeelingcarrentalservice.com** — pushing to `main` deploys, which
takes about 3–6 minutes.

Remaining, both cosmetic:

- [ ] `assets/img/routes/gp-06.jpg` — a Pelling photo. The one supplied was
      Everest from Tibet, so it is parked and that card falls back to the
      Ravangla Buddha, which is genuinely on the route
- [ ] Submit `sitemap.xml` in Google Search Console once the domain is verified


---

## File map

```
index.html                 generated — do not edit
itineraries/package-*.html generated — do not edit
data/itineraries.json      all content lives here
templates/                 page shells with {{TOKENS}}
partials/                  header, footer, mobile bar, enquiry form
build.js                   the generator (zero dependencies)
assets/css/main.css        tokens first, then components
assets/js/                 carousel, fleet, accordion, enquiry, shared
assets/img/                logo, hero, fleet, placeholders
plan.md                    design rationale
```
