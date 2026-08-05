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

## Adding real photos

Every image currently points at one of the five photos in `assets/img/hero/`.
To use a real photo, drop the file in and point the relevant `img` field at it.

| Field | Used for | Wanted |
|---|---|---|
| `hero.slides[].img` | homepage carousel | landscape, **≥2000px wide** |
| `packages[].img` | route card + that page's hero | landscape, ≥1200px wide |
| `dayLibrary.*.img` | the accordion image panel | landscape, ≥1200px wide |
| `fleet[].img` | turntable | **transparent PNG**, ≥1200px wide |

Two things worth knowing:

- **The current hero photos are only 900px wide.** They look soft on a desktop
  full-bleed hero. Replacing them with ≥2000px versions is the single biggest
  visual upgrade available.
- **When you change an image, change its `imgCaption` and `alt` to match.**
  The captions describe the actual photograph, not the day — so a photo of
  Batasia Loop is never captioned as somewhere it isn't.

If an image path is ever wrong or missing, the page falls back to generated
ridgeline artwork in the brand palette rather than a broken-image icon.

### Fleet PNGs

The six vehicle PNGs were cropped to the car and composited onto a common
900×520 transparent canvas, so all six sit at consistent visual weight on the
turntable. If you add a vehicle, match that: transparent background, car
bottom-aligned, same canvas. The Swift Dzire came in at 301px wide and was
upscaled — a larger source file would sharpen it up.

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

### Adding a domain later

1. Add a file called `CNAME` at the repo root containing just your domain,
   e.g. `darjeelingcarrental.com`.
2. At your registrar, point the domain at GitHub Pages: four `A` records for
   the apex (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and a
   `CNAME` for `www` → `paharlaya.github.io`.
3. Settings → Pages → **Enforce HTTPS** once the certificate is issued.

Then set `business.email` to an address on the new domain and rebuild.

---

## Before launch

- [ ] Set `business.email` — it is still `PLACEHOLDER@example.com`
- [ ] Replace the five hero photos with ≥2000px versions
- [ ] Send a test enquiry from a phone and confirm it reaches your WhatsApp
- [ ] Add real photos for the days and routes as they come in

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
