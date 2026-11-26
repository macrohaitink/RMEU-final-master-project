/* Inter Decision Tool – shared site shell.
 * Edit SITE / TABS to change the menu, season labels and module status on every page at once.
 */
const SITE = {
  title: 'Inter Decision Tool',
  season: 'Serie A 2026/27',
  dataThrough: 'Matchweek 12',
  updated: '26 Nov 2026',
  source: 'Opta event data via Scoresway',
};

/* side: 'left' | 'right' of the crest. status: 'live' | 'progress' | 'planned' */
const TABS = [
  { id: 'mop', label: 'Model of Play', href: 'model-of-play.html', side: 'left', status: 'live', step: 2,
    blurb: 'How Inter play in each phase, measured against the other 19 Serie A teams.' },
  { id: 'squad', label: 'Squad Audit', href: 'squad-audit.html', side: 'left', status: 'planned', step: 3,
    blurb: 'Role fit, age curve, contracts and needs for every player in the current squad.' },
  { id: 'coach', label: 'Coach Audit', href: 'coach-audit.html', side: 'left', status: 'planned', step: 3,
    blurb: 'Results against expectation and style fit: retain the coach or replace them, and with what profile.' },
  { id: 'search', label: 'Candidate Search', href: 'candidate-search.html', side: 'right', status: 'planned', step: 4,
    blurb: 'Shrunk stats, similarity and role-fit scores to build a shortlist for each position.' },
  { id: 'roi', label: 'ROI Model', href: 'roi-model.html', side: 'right', status: 'planned', step: 4,
    blurb: 'Fee ranges, Monte Carlo resale, NPV and risk, then a squad optimiser under the wage cap.' },
];

const STATUS_LABEL = { live: 'Live', progress: 'In progress', planned: 'Planned' };

function navLink(t, current) {
  const cur = t.id === current ? ' aria-current="page"' : '';
  return `<a class="nav-link" href="${t.href}"${cur}>${t.label}</a>`;
}

function renderHeader(current) {
  const el = document.getElementById('site-header');
  if (!el) return;
  const left = TABS.filter(t => t.side === 'left').map(t => navLink(t, current)).join('');
  const right = TABS.filter(t => t.side === 'right').map(t => navLink(t, current)).join('');
  const all = TABS.map(t => navLink(t, current)).join('');
  el.className = 'site-header';
  el.innerHTML = `
    <div class="utility">
      <span>${SITE.season}</span><span class="dot">·</span><span>Data through ${SITE.dataThrough}</span>
      <span class="utility-right">Updated ${SITE.updated}</span>
    </div>
    <div class="bar">
      <nav class="nav nav-left" aria-label="Primary">${left}</nav>
      <a class="crest" href="index.html" aria-label="${SITE.title} home">
        <img src="assets/img/crest-white.svg" alt="">
      </a>
      <nav class="nav nav-right" aria-label="Primary, continued">${right}</nav>
      <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <nav class="drawer" aria-label="Mobile">${'<a class="nav-link" href="index.html">Home</a>' + all}</nav>`;
  const burger = el.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = el.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const links = TABS.map(t => `<li><a href="${t.href}">${t.label}</a></li>`).join('');
  el.className = 'site-footer';
  el.innerHTML = `
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <img src="assets/img/crest-white.svg" alt="">
        <div><b>${SITE.title}</b><span>Squad planning for 2027/28</span></div>
      </div>
      <div><h4>Modules</h4><ul>${links}</ul></div>
      <div><h4>Data</h4><ul><li>${SITE.source}</li><li>${SITE.season}, through ${SITE.dataThrough}</li><li>League used as context (other 19 teams)</li><li>No raw data files are published. The site shows derived metrics, with selected match events plotted for illustration.</li></ul></div>
    </div>
    <div class="wrap footer-legal">Prototype · Updated ${SITE.updated}</div>`;
}

function initShell(current) {
  renderHeader(current);
  renderFooter();
}
