#!/usr/bin/env node
/**
 * Darjeeling Car Rental Service — static site builder
 *
 * Reads  data/itineraries.json
 * Writes index.html + itineraries/<slug>.html (one per package)
 *
 * Zero dependencies. Run:  node build.js
 *
 * Edit content in data/itineraries.json, never in the generated HTML —
 * the HTML is overwritten on every build.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data/itineraries.json"), "utf8"));
const { business: biz, hero, fleet, dayLibrary, packages, included, excluded } = data;

/**
 * How the nine itinerary pages are named.
 *   "sequential" -> package-01.html … package-09.html
 *   "slug"       -> d-04.html, gld-07.html …  (better for search: the route
 *                   code is in the URL, so both Google and the customer can
 *                   see what the page is before opening it)
 * Flip this and re-run to switch; all internal links follow automatically.
 */
const PAGE_NAMING = "sequential";

const pageFile = (p, i) =>
  PAGE_NAMING === "slug" ? `${p.slug}.html` : `package-${String(i + 1).padStart(2, "0")}.html`;

/** code -> filename, so every link resolves the same way from anywhere */
const FILE = {};
packages.forEach((p, i) => (FILE[p.code] = pageFile(p, i)));

/**
 * code -> the label shown to customers: PKG-01 … PKG-09, numbered in the order
 * packages appear (shortest route first), so the label matches the filename —
 * PKG-07 is package-07.html.
 *
 * The `code` field in itineraries.json (D-04, GLD-07 …) is INTERNAL ONLY and
 * is never rendered. It carries the route and duration, which makes it useful
 * for matching a page against your own rate card, so it is worth keeping.
 */
const DISPLAY = {};
packages.forEach((p, i) => (DISPLAY[p.code] = `PKG-${String(i + 1).padStart(2, "0")}`));

/* -- helpers ------------------------------------------------------------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/** Deterministic placeholder so a missing photo degrades to brand art,
 *  not a broken-image icon. Drop the real file in and it lights up. */
const PLACEHOLDERS = 6;
function placeholderFor(key) {
  let h = 0;
  for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return `ridge-${(h % PLACEHOLDERS) + 1}`;
}

function img({ src, alt, base = "", cls = "", eager = false, ph }) {
  const fallback = `${base}assets/img/placeholders/${ph || placeholderFor(src)}.svg`;
  return (
    `<img src="${base}${src}" alt="${esc(alt || "")}"` +
    (cls ? ` class="${cls}"` : "") +
    (eager ? ` loading="eager" fetchpriority="high"` : ` loading="lazy"`) +
    ` decoding="async"` +
    ` onerror="this.onerror=null;this.src='${fallback}';this.classList.add('is-placeholder')">`
  );
}

/* -- WhatsApp: the only conversion path -------------------------------- */

function waUrl(message) {
  return `https://wa.me/${biz.whatsapp}?text=${encodeURIComponent(message)}`;
}
const WA_GENERAL = waUrl(
  `Hi ${biz.subName} — I'd like to enquire about a tour of Darjeeling and Sikkim. Could you share prices and availability?`
);
function waForPackage(p) {
  return waUrl(
    `Hi ${biz.subName} — I'd like to enquire about ${DISPLAY[p.code]}, ${p.title} (${p.nights}N/${p.days}D). Could you share the price and availability?`
  );
}

/* -- icons ------------------------------------------------------------- */

const ICON = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 6.2 2 2 0 0 1 6 4z"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2zm0 2a7.9 7.9 0 1 1-4 14.7l-.4-.2-2.5.7.7-2.4-.2-.4A7.9 7.9 0 0 1 12 4zm-3.3 3.9c-.2 0-.5.1-.7.3-.3.3-.8.8-.8 1.7 0 1 .7 2 .8 2.1.1.2 1.4 2.3 3.5 3.1 1.7.7 2.1.6 2.5.5.5 0 1.3-.5 1.5-1 .2-.6.2-1 .1-1.1l-1.5-.7c-.2 0-.4-.1-.5.1l-.6.8c-.1.1-.2.2-.4.1a5.9 5.9 0 0 1-2.7-2.4c-.1-.2 0-.3.1-.4l.4-.5c.1-.2 0-.3 0-.4l-.6-1.5c-.2-.4-.4-.4-.5-.4z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 12H5m5-6-6 6 6 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg>`,
  // The endless knot from the logo's base cartouche — watermark only
  knot: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M30 30h40v40H30z"/><path d="M40 20v20M60 20v20M40 60v20M60 60v20M20 40h20M20 60h20M60 40h20M60 60h20"/><path d="M40 40h20v20H40z"/></svg>`,
};

/* -- the Ridgeline, in its several jobs -------------------------------- */

/** Terrace contour divider — nested curves echoing the logo's stepped fields */
function terrace(surface, variant = 0) {
  const sets = [
    [
      "M0 62C180 62 240 40 420 40S660 20 840 22S1080 34 1200 30",
      "M0 74C200 74 280 54 460 54S700 34 880 36S1100 48 1200 44",
      "M0 50C160 50 220 28 400 26S640 8 820 10S1060 20 1200 16",
    ],
    [
      "M0 30C160 34 260 56 440 56S680 38 860 36S1080 52 1200 58",
      "M0 44C180 48 280 68 460 68S700 50 880 48S1100 62 1200 70",
      "M0 18C140 22 240 42 420 42S660 24 840 22S1060 36 1200 42",
    ],
    [
      "M0 56C140 40 300 24 480 30S760 58 920 52S1100 30 1200 24",
      "M0 70C150 54 310 38 490 44S770 70 930 64S1110 44 1200 38",
      "M0 42C130 26 290 12 470 18S750 46 910 40S1090 18 1200 12",
    ],
  ];
  const paths = sets[variant % sets.length].map((d) => `<path d="${d}"/>`).join("");
  // White is the base surface, so it needs no modifier class
  const mod = surface && surface !== "white" ? ` terrace--${surface}` : "";
  return `<div class="terrace terrace--draw${mod}" aria-hidden="true"><svg viewBox="0 0 1200 80" preserveAspectRatio="none">${paths}</svg></div>`;
}

/** Route chain — the operator's own G3>D2 notation, drawn.
 *  Filled dots are nights in that town. Data, not decoration. */
function routeChain(p, cls = "") {
  const dots = (n) =>
    `<span class="route__nights" aria-hidden="true">${'<span class="route__dot"></span>'.repeat(n)}</span>`;
  const line = '<span class="route__line" aria-hidden="true"></span>';

  let html = `<span class="route__node">${esc(biz.gateway)}</span>`;
  for (const stay of p.stays) {
    html += `<span class="route__seg">${line}${dots(stay.nights)}${line}</span>`;
    html += `<span class="route__node">${esc(stay.place)}<span class="visually-hidden">, ${stay.nights} night${stay.nights > 1 ? "s" : ""}</span></span>`;
  }
  html += `<span class="route__seg">${line}</span><span class="route__node route__end">${esc(biz.gateway)}</span>`;

  const label = `Route: ${biz.gateway} to ${p.stays.map((s) => `${s.place}, ${s.nights} night${s.nights > 1 ? "s" : ""}`).join(", then ")}, then back to ${biz.gateway}`;
  return `<p class="route ${cls}" role="img" aria-label="${esc(label)}">${html}</p>`;
}

/* -- components -------------------------------------------------------- */

function card(p, base = "") {
  const href = `${base}itineraries/${FILE[p.code]}`;
  // One link per card, stretched over the whole card by CSS. The photo, the
  // title and "View route" are all the same target, and screen readers get a
  // single link rather than two identical ones.
  return `<article class="card reveal">
  <div class="card__img">
    ${img({ src: p.img, alt: p.alt, base })}
    <span class="card__code">${DISPLAY[p.code]}</span>
  </div>
  <div class="card__body">
    <h3 class="card__title display"><a class="card__link" href="${href}">${esc(p.title)}</a></h3>
    ${routeChain(p)}
    <p class="card__summary">${esc(p.summary)}</p>
    <div class="card__meta">
      <span class="card__duration">${p.nights}N / ${p.days}D</span>
      <span class="link-arrow">View route ${ICON.arrow}</span>
    </div>
  </div>
</article>`;
}

function resolveDays(p) {
  return p.itinerary.map((entry, i) => {
    const key = typeof entry === "string" ? entry : entry.ref;
    const base = dayLibrary[key];
    if (!base) throw new Error(`Unknown day key "${key}" in package ${p.code}`);
    const day = { ...base, ...(typeof entry === "object" ? entry : {}) };
    day.key = key;
    day.n = i + 1;
    return day;
  });
}

function dayBlock(day, isFirst, base) {
  const num = String(day.n).padStart(2, "0");
  return `<li class="day${isFirst ? " is-open" : ""}" id="day-${day.n}">
  <span class="day__node" aria-hidden="true"></span>
  <h3>
    <button class="day__toggle" type="button" id="day-tab-${day.n}"
            aria-expanded="${isFirst ? "true" : "false"}" aria-controls="day-panel-${day.n}"
            data-day="${day.n}">
      <span class="day__num">Day ${num}</span>
      <span class="day__title">${esc(day.title)}</span>
      <span class="day__chev">${ICON.chevron}</span>
    </button>
  </h3>
  <div class="day__panel" id="day-panel-${day.n}" role="region" aria-labelledby="day-tab-${day.n}">
    <div>
      <div class="day__copy">
        <figure class="day__inline-img">
          ${img({ src: day.img, alt: day.alt, base, ph: placeholderFor(day.key) })}
          <figcaption class="day__inline-caption">${esc(day.imgCaption)}</figcaption>
        </figure>
        ${day.body.map((para) => `<p>${esc(para)}</p>`).join("\n        ")}
        <p class="day__facts">${esc(day.facts)}</p>
      </div>
    </div>
  </div>
</li>`;
}

function dayImage(day, isFirst, base) {
  return img({
    src: day.img,
    alt: day.alt,
    base,
    cls: isFirst ? "is-active" : "",
    ph: placeholderFor(day.key),
  }).replace("<img ", `<img data-day="${day.n}" data-caption="${esc(day.imgCaption)}" `);
}

/* -- partials ---------------------------------------------------------- */

function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function commonVars(base) {
  return {
    BASE: base,
    PHONE: biz.phone,
    PHONE_DISPLAY: esc(biz.phoneDisplay),
    WA_URL: WA_GENERAL,
    EMAIL: esc(biz.email),
    ADDRESS: esc(biz.address),
    ADDRESS_SHORT: esc(biz.addressShort),
    MAPS_URL: biz.mapsUrl,
    NAME: esc(biz.name),
    SUB_NAME: esc(biz.subName),
    YEAR: String(new Date().getFullYear()),
    ICON_PHONE: ICON.phone,
    ICON_WA: ICON.wa,
    ICON_MAIL: ICON.mail,
    ICON_PIN: ICON.pin,
    ICON_ARROW: ICON.arrow,
    ICON_KNOT: ICON.knot,
  };
}

function packageOptions(selected) {
  return packages
    .map(
      (p) =>
        `<option value="${DISPLAY[p.code]}"${DISPLAY[p.code] === selected ? " selected" : ""}>${DISPLAY[p.code]} — ${esc(p.title)}</option>`
    )
    .join("\n          ");
}

/* -- placeholder art --------------------------------------------------- */
/* Brand-palette ridgelines, so a missing photo still looks intentional.  */

function writePlaceholders() {
  const dir = path.join(ROOT, "assets/img/placeholders");
  fs.mkdirSync(dir, { recursive: true });

  const ridges = [
    ["M0 300 L160 190 L250 240 L390 120 L520 215 L640 150 L800 260 L900 205 L1000 300Z", "M0 300 L120 245 L300 285 L470 220 L620 270 L790 225 L1000 300Z"],
    ["M0 300 L110 210 L210 250 L330 150 L470 235 L600 175 L740 245 L880 190 L1000 300Z", "M0 300 L180 260 L340 290 L500 240 L680 285 L860 245 L1000 300Z"],
    ["M0 300 L140 160 L280 230 L400 175 L540 250 L700 165 L850 235 L1000 300Z", "M0 300 L150 255 L320 280 L480 235 L650 275 L820 240 L1000 300Z"],
    ["M0 300 L190 205 L300 255 L430 140 L560 225 L690 180 L830 250 L1000 300Z", "M0 300 L130 265 L290 285 L450 245 L610 280 L800 250 L1000 300Z"],
    ["M0 300 L100 235 L240 165 L370 240 L500 185 L650 255 L800 195 L1000 300Z", "M0 300 L170 270 L330 292 L510 250 L690 282 L850 255 L1000 300Z"],
    ["M0 300 L130 185 L260 245 L410 160 L550 240 L710 190 L860 255 L1000 300Z", "M0 300 L140 258 L310 288 L470 242 L640 278 L830 248 L1000 300Z"],
  ];

  ridges.forEach(([far, near], i) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Himalayan ridgeline">
  <rect width="1000" height="300" fill="#0C1C14"/>
  <circle cx="812" cy="72" r="26" fill="none" stroke="#7C643C" stroke-width="1.5"/>
  <path d="${far}" fill="#050C08" opacity="0.55"/>
  <path d="${far}" fill="none" stroke="#C1A063" stroke-width="1.25" opacity="0.5"/>
  <path d="${near}" fill="#050C08" opacity="0.9"/>
  <path d="${near}" fill="none" stroke="#C1A063" stroke-width="1" opacity="0.32"/>
</svg>
`;
    fs.writeFileSync(path.join(dir, `ridge-${i + 1}.svg`), svg);
  });

  // Fleet fallback: a vehicle silhouette, not a broken icon
  fs.writeFileSync(
    path.join(dir, "car.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 240" role="img" aria-label="Vehicle silhouette">
  <path d="M40 176h560" stroke="#7C643C" stroke-width="1.5" fill="none"/>
  <path d="M92 176c-14 0-24-10-24-24v-22c0-10 6-18 16-21l58-16 30-27c8-7 18-11 28-11h122c12 0 23 5 30 14l24 30 62 12c14 3 24 15 24 29v12c0 10-8 18-18 18z"
        fill="none" stroke="#C1A063" stroke-width="1.75" opacity="0.85"/>
  <path d="M162 108l24-22c5-5 12-8 19-8h96c8 0 15 3 20 10l17 20z" fill="none" stroke="#C1A063" stroke-width="1.25" opacity="0.5"/>
  <circle cx="176" cy="176" r="30" fill="#050C08" stroke="#C1A063" stroke-width="1.75"/>
  <circle cx="452" cy="176" r="30" fill="#050C08" stroke="#C1A063" stroke-width="1.75"/>
  <circle cx="176" cy="176" r="12" fill="none" stroke="#7C643C" stroke-width="1.25"/>
  <circle cx="452" cy="176" r="12" fill="none" stroke="#7C643C" stroke-width="1.25"/>
</svg>
`
  );
  return ridges.length + 1;
}

/* -- pages ------------------------------------------------------------- */

function buildIndex(partials) {
  const base = "";
  const v = commonVars(base);

  const slides = hero.slides
    .map(
      (s, i) =>
        `<div class="hero__slide${i === 0 ? " is-active" : ""}" data-caption="${esc(s.caption)}" aria-hidden="${i === 0 ? "false" : "true"}">
        ${img({ src: s.img, alt: s.alt, base, eager: i === 0 })}
      </div>`
    )
    .join("\n      ");

  const navBars = hero.slides
    .map(
      (s, i) =>
        `<button class="hero__bar" type="button" data-slide="${i}" aria-current="${i === 0 ? "true" : "false"}"><span class="visually-hidden">Show slide ${i + 1}: ${esc(s.caption)}</span></button>`
    )
    .join("\n        ");

  const cars = fleet
    .map(
      (f, i) =>
        `<div class="fleet__car${i === 0 ? " is-active" : ""}" data-car="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
          ${img({ src: f.img, alt: `${f.name}, ${f.type}`, base, ph: "car" })}
        </div>`
    )
    .join("\n        ");

  const carDots = fleet
    .map(
      (f, i) =>
        `<button class="fleet__dot" type="button" data-car="${i}" aria-current="${i === 0 ? "true" : "false"}"><span class="visually-hidden">${esc(f.name)}</span></button>`
    )
    .join("\n        ");

  const fleetData = JSON.stringify(
    fleet.map((f) => ({ name: f.name, type: f.type, seats: f.seats, bags: f.bags, bestFor: f.bestFor }))
  );

  const html = fill(read("templates/index.html"), {
    ...v,
    ...partials,
    HERO_EYEBROW: esc(hero.eyebrow),
    HERO_HEADLINE: esc(hero.headline),
    HERO_SUB: esc(hero.sub),
    HERO_SLIDES: slides,
    HERO_NAV: navBars,
    HERO_CAPTION: esc(hero.slides[0].caption),
    CARDS: packages.map((p) => card(p, base)).join("\n"),
    FLEET_CARS: cars,
    FLEET_DOTS: carDots,
    FLEET_DATA: esc(fleetData),
    FLEET_NAME: esc(fleet[0].name),
    FLEET_SPECS: `${esc(fleet[0].type)} · <b>${esc(fleet[0].seats)}</b> · ${esc(fleet[0].bags)} · ${esc(fleet[0].bestFor)}`,
    TERRACE_1: terrace("white", 0),
    TERRACE_2: terrace("white", 1),
    TERRACE_3: terrace("white", 2),
  });

  fs.writeFileSync(path.join(ROOT, "index.html"), html);
  return "index.html";
}

function buildItinerary(p, partials) {
  const base = "../";
  const v = commonVars(base);
  const days = resolveDays(p);

  // Sanity check: nights in the notation must match the stated duration
  const stayNights = p.stays.reduce((n, s) => n + s.nights, 0);
  if (stayNights !== p.nights) {
    throw new Error(`${p.code}: stays total ${stayNights} nights but "nights" says ${p.nights}`);
  }
  if (days.length !== p.days) {
    throw new Error(`${p.code}: ${days.length} day entries but "days" says ${p.days}`);
  }

  const related = packages.filter((x) => x.code !== p.code).slice(0, 3);

  const html = fill(read("templates/itinerary.html"), {
    ...v,
    ...fill_partials(partials, p),
    CODE: DISPLAY[p.code],
    CANONICAL: FILE[p.code],
    IT_TITLE: esc(p.title),
    SUMMARY: esc(p.summary),
    META_DESC: esc(p.metaDescription),
    DURATION: `${p.nights} nights / ${p.days} days`,
    NOTATION: esc(p.notation),
    HERO_IMG: img({ src: p.img, alt: p.alt, base, eager: true }),
    ROUTE: routeChain(p, "it-hero__route"),
    DAYS: days.map((d, i) => dayBlock(d, i === 0, base)).join("\n"),
    DAY_IMAGES: days.map((d, i) => dayImage(d, i === 0, base)).join("\n          "),
    DAY_CAPTION: esc(days[0].imgCaption),
    HIGHLIGHTS: p.highlights.map((h) => `<li>${esc(h)}</li>`).join("\n            "),
    CHIPS: p.places.map((pl) => `<li class="chip">${esc(pl)}</li>`).join("\n          "),
    INCLUDED: included.map((x) => `<li>${esc(x)}</li>`).join("\n            "),
    EXCLUDED: excluded.map((x) => `<li>${esc(x)}</li>`).join("\n            "),
    VEHICLE: esc(p.vehicle),
    WA_PKG_URL: waForPackage(p),
    RELATED: related.map((r) => card(r, base)).join("\n"),
    TERRACE_1: terrace("white", 1),
    TERRACE_2: terrace("white", 2),
    TERRACE_3: terrace("white", 0),
    TERRACE_4: terrace("white", 1),
  });

  const file = FILE[p.code];
  fs.writeFileSync(path.join(ROOT, "itineraries", file), html);
  return `itineraries/${file}`;
}

/** The enquiry partial needs the package pre-selected on itinerary pages. */
function fill_partials(partials, p) {
  return {
    ...partials,
    ENQUIRY: fill(partials.ENQUIRY_RAW, {
      ...commonVars("../"),
      PACKAGE_OPTIONS: packageOptions(p ? DISPLAY[p.code] : null),
    }),
  };
}

/* -- run --------------------------------------------------------------- */

function main() {
  fs.mkdirSync(path.join(ROOT, "itineraries"), { recursive: true });

  const nPlaceholders = writePlaceholders();

  const rawHeader = read("partials/header.html");
  const rawFooter = read("partials/footer.html");
  const rawBar = read("partials/mobile-bar.html");
  const rawEnquiry = read("partials/enquiry.html");

  const written = [];

  // Homepage — no package pre-selected
  written.push(
    buildIndex({
      HEADER: fill(rawHeader, commonVars("")),
      FOOTER: fill(rawFooter, commonVars("")),
      MOBILE_BAR: fill(rawBar, commonVars("")),
      ENQUIRY: fill(rawEnquiry, { ...commonVars(""), PACKAGE_OPTIONS: packageOptions(null) }),
    })
  );

  // Nine itinerary pages
  for (const p of packages) {
    written.push(
      buildItinerary(p, {
        HEADER: fill(rawHeader, commonVars("../")),
        FOOTER: fill(rawFooter, commonVars("../")),
        MOBILE_BAR: fill(rawBar, commonVars("../")),
        ENQUIRY_RAW: rawEnquiry,
      })
    );
  }

  // Leftover tokens are a build bug, not a runtime surprise — catch them here.
  let leaks = 0;
  for (const f of written) {
    const body = fs.readFileSync(path.join(ROOT, f), "utf8");
    const found = body.match(/\{\{\w+\}\}/g);
    if (found) {
      leaks += found.length;
      console.warn(`  ! ${f}: unresolved ${[...new Set(found)].join(", ")}`);
    }
  }

  console.log(`Built ${written.length} pages, ${nPlaceholders} placeholder graphics.`);
  written.forEach((f) => console.log(`  · ${f}`));
  if (biz.email.startsWith("PLACEHOLDER")) {
    console.log(`\n  Note: email is still a placeholder — set business.email in data/itineraries.json`);
  }
  if (leaks) {
    console.error(`\nFailed: ${leaks} unresolved template token(s).`);
    process.exit(1);
  }
}

main();
