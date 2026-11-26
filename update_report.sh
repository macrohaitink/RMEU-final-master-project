#!/usr/bin/env bash
# Copy the latest generated game model report into the site.
# Run from anywhere: ./site/update_report.sh   (then commit + push to publish)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${1:-$HERE/../MoP/report/Internazionale_game_model_2026-2027.html}"
cp "$SRC" "$HERE/reports/model-of-play.html"
echo "Copied $(basename "$SRC") -> reports/model-of-play.html"
echo "Remember to update SITE.dataThrough / SITE.updated in assets/js/site.js and the home-page cards if numbers changed."
