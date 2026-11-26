# Inter Decision Tool – website prototype

Static site (no build step) for GitHub Pages.

```
index.html               Home
model-of-play.html       Model of Play tab (embeds reports/model-of-play.html)
squad-audit.html …       Placeholder tabs (Squad Audit, Coach Audit, Candidate Search, ROI Model)
reports/                 Generated reports, copied in by update_report.sh
assets/js/site.js        Shared header/footer + SITE (season, dates) and TABS (menu) config
assets/js/mop.js         Sidebar contents, deep links and auto-height for the embedded report
assets/js/module.js      Content of the placeholder tabs
assets/css/site.css      All styles
```

## Preview locally
The Model of Play sidebar needs the page served over http (browsers block reading an iframe from `file://`):

```
cd site && python3 -m http.server 8000   # then open http://localhost:8000
```

## Update the report
1. Rebuild the report in `99_report.ipynb` as usual.
2. `./site/update_report.sh`
3. Edit `SITE.dataThrough` / `SITE.updated` in `assets/js/site.js` (and the numbers on the home-page cards in `index.html`).

## Add or rename a tab
Edit `TABS` in `assets/js/site.js` (label, file, side of the crest, status, pipeline step), then copy one of the
placeholder HTML files and change `data-tab`.

## Publish on GitHub Pages
Push the contents of this folder to a repository (or to `/docs` of an existing one), then
Settings → Pages → Deploy from a branch → `main` / root (or `/docs`). `.nojekyll` is included.
Note: GitHub Pages sites are public even when the repository is private on free plans.
