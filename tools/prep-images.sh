#!/usr/bin/env bash
#
# Convert delivered photos to web JPEGs, in place.
#
#   ./tools/prep-images.sh
#
# Handles .avif, .heic, .heif, .png, .tif, .webp dropped into assets/img/days,
# assets/img/routes or assets/img/hero, and leaves a .jpg beside each one with
# the same basename — which is what build.js looks for.
#
# The originals are left alone. They are gitignored, so they can sit in the
# folder as your masters without bloating the repository.
#
# Tune with env vars:  QUALITY=82 MAXW=2400 ./tools/prep-images.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

QUALITY="${QUALITY:-78}"
MAXW="${MAXW:-2000}"

shopt -s nullglob nocaseglob

converted=0
for dir in assets/img/days assets/img/routes assets/img/hero; do
  [ -d "$dir" ] || continue
  for src in "$dir"/*.avif "$dir"/*.heic "$dir"/*.heif "$dir"/*.png "$dir"/*.tif "$dir"/*.tiff "$dir"/*.webp; do
    out="${src%.*}.jpg"

    if ! sips -s format jpeg -s formatOptions "$QUALITY" "$src" --out "$out" >/dev/null 2>&1; then
      echo "  ! could not read $src — skipped"
      continue
    fi

    w=$(sips -g pixelWidth "$out" 2>/dev/null | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$out" 2>/dev/null | awk '/pixelHeight/{print $2}')
    if [ -n "${w:-}" ] && [ "$w" -gt "$MAXW" ]; then
      sips -Z "$MAXW" "$out" >/dev/null 2>&1
      w=$(sips -g pixelWidth "$out" | awk '/pixelWidth/{print $2}')
      h=$(sips -g pixelHeight "$out" | awk '/pixelHeight/{print $2}')
    fi

    size=$(ls -lh "$out" | awk '{print $5}')
    note=""
    # if/fi rather than `[ ] && x`, which returns 1 when the test is false and
    # would trip `set -e` on any photo that needs no warning
    case "$dir" in
      */days)
        # Day panels are 4:3 — a wider photo still loses some width
        if [ $((w * 3)) -gt $((h * 4)) ]; then
          note="  (wider than 4:3 — sides will be cropped a little)"
        fi
        ;;
      */routes)
        if [ "$w" -lt 1800 ]; then
          note="  (under 1800px — soft as a page banner)"
        fi
        ;;
    esac

    echo "  $(basename "$src") -> $(basename "$out")  ${w}x${h}  $size$note"
    converted=$((converted + 1))
  done
done

if [ "$converted" -eq 0 ]; then
  echo "Nothing to convert."
else
  echo
  echo "Converted $converted file(s). Now run: node build.js"
fi
