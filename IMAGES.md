# Photo status

Near complete. **40 of 48 day panels** and **8 of 9 route cards** are on their
own photographs.

## Outstanding

| What | File | Why it matters |
|---|---|---|
| **1 day photo** | `assets/img/days/arrive-gangtok.jpg` | The Bagdogra → Gangtok drive: the Tista valley road, river one side, terraced hillside the other. **This single file is the last 8 stand-in panels** — it appears on 8 of the 9 itineraries |
| **1 route photo** | `assets/img/routes/gp-06.jpg` | PKG-08, Gangtok & Pelling. See below |

## Two to look at

**`gp-06` — the photo supplied was Everest from Tibet.** It's the north face
from the Rongbuk side, not Sikkim. Selling a Pelling package with it is a
credibility risk, so it's parked at
`assets/img/routes/_parked-gp-06-everest-tibet.jpg` (gitignored, not shipped)
and that card falls back to the Ravangla Buddha, which is genuinely on the
route. Replace with Pemayangtse Monastery or the Rabdentse ruins.

**`gld-07` is Gurudongmar Lake**, and that itinerary goes to Yumthang, not
Gurudongmar. It's in use — it is North Sikkim and it's the strongest image in
the set — with alt text that doesn't claim it's on the route. Swap it if you'd
rather not imply the stop.

## Things worth improving, not urgent

- **Resolution.** Everything supplied is 900px or smaller; route photos double
  as the full-width banner on their itinerary page, where 1800px+ would be
  sharper. They are acceptable as delivered.
- **`depart-gangtok`** is the Tsomgo/Nathu La road, not the descent to
  Bagdogra. Captioned honestly for what it shows.
- **`depart-pelling`** is the same Chenrezig statue as `pelling-sights`, so it
  appears twice on PKG-04 and PKG-08. A descent shot would fix that.
- **`gd-06`** is a tea plantation that may not be Darjeeling — the terrain
  reads more like South India. Captioned neutrally.

## Adding or replacing a photo

Name the file to match the slot, drop it in `assets/img/days/` or
`assets/img/routes/`, then:

```sh
./tools/prep-images.sh   # converts avif / heic / webp to jpg, warns on crops
node build.js
```

Tell me afterwards so the caption and alt text can be updated with it —
**captions on this site describe the photograph, not the day**, which is what
stops a Batasia Loop photo being labelled as somewhere it isn't.
