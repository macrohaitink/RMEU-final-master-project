#!/usr/bin/env bash
# Copy the latest Model of Play report into the site and publish it to GitHub Pages.
# Usage: ./publish.sh            (commit message defaults to today's date)
#        ./publish.sh "message"
set -euo pipefail
cd "$(dirname "$0")"
./update_report.sh
git add -A
if git diff --cached --quiet; then
  echo "Nothing changed - site already up to date."
  exit 0
fi
git commit -m "${1:-Update site $(date +%Y-%m-%d)}"
git push
echo "Pushed. The live site updates in a minute or two."
