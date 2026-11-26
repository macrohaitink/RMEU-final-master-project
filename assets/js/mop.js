/* Model of Play tab: embeds the generated report and drives it from the site's sidebar.
 * The report stays exactly as gm_report.write_report() produces it; this script only hides its own
 * title block and contents (the page banner and sidebar replace them) and restyles headings to match the site.
 */
initShell('mop');

const frame = document.getElementById('report');
const toc = document.getElementById('toc');
const tocList = document.getElementById('toc-list');
const tocCurrent = document.getElementById('toc-current');
const header = document.getElementById('site-header');
document.getElementById('mop-sub').innerHTML =
  `<span>${SITE.season}</span><span>${SITE.source}</span><span>Updated ${SITE.updated}</span>`;

const EMBED_CSS = `
  html, body { overflow: hidden !important; background: #fff !important; }
  main { max-width: none !important; padding: 0 2px 24px !important; }
  main > header, main > nav { display: none !important; }
  :root { --accent: #0a2fd6; }
  h2, h3, h4 { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing: .01em; }
  h2 { font-size: 44px; font-weight: 800; line-height: 1; border-bottom-width: 3px; margin-top: 72px; }
  main > section:first-of-type > h2 { margin-top: 0; }
  h3 { font-size: 32px; font-weight: 700; line-height: 1.05; }
  h4 { font-size: 24px; font-weight: 700; line-height: 1.1; }
  .num { font-weight: 700; }
  body { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
`;

let doc = null;
let links = [];          // [{id, a}]

function headerOffset() {
  // sticky part of the site header (utility strip scrolls away) + the mobile contents bar
  let h = header.querySelector('.bar').offsetHeight;
  if (getComputedStyle(toc).position === 'sticky' && window.innerWidth <= 1060) h += toc.querySelector('.toc-toggle').offsetHeight;
  return h + 16;
}

function frameHeight() {
  if (!doc) return;
  const h = doc.body.offsetHeight;
  if (h && Math.abs(frame.offsetHeight - h) > 1) frame.style.height = h + 'px';
}

function targetTop(el) {
  return frame.getBoundingClientRect().top + window.scrollY + el.getBoundingClientRect().top;
}

function goTo(id, smooth = true) {
  if (!doc) return;
  const el = doc.getElementById(id);
  if (!el) return;
  // open any collapsed chapter that contains the target, and the target itself if it is collapsible
  for (let d = el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
  const own = el.querySelector(':scope > details');
  if (own) own.open = true;
  frameHeight();
  window.scrollTo({ top: targetTop(el) - headerOffset(), behavior: smooth ? 'smooth' : 'auto' });
  history.replaceState(null, '', '#' + id);
}

function buildToc() {
  const src = doc.querySelector('nav ul.toc');
  if (!src) { tocList.innerHTML = '<li>No contents found in the report.</li>'; return; }
  const ul = src.cloneNode(true);
  ul.removeAttribute('class');
  ul.id = 'toc-list';
  tocList.replaceWith(ul);
  links = [...ul.querySelectorAll('a[href^="#"]')].map(a => ({ id: a.getAttribute('href').slice(1), a }));
  ul.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    toc.classList.remove('open');
    goTo(a.getAttribute('href').slice(1));
  });
}

let ticking = false;
function spy() {
  ticking = false;
  if (!links.length) return;
  const line = headerOffset() + 40;
  const fTop = frame.getBoundingClientRect().top;
  let current = null;
  for (const l of links) {
    const el = doc.getElementById(l.id);
    if (!el || !el.getClientRects().length) continue;
    if (fTop + el.getBoundingClientRect().top <= line) current = l;
  }
  links.forEach(l => l.a.classList.toggle('active', l === current));
  tocCurrent.textContent = current ? current.a.textContent.replace(/^[\d.]+/, '').trim() : '';
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });

toc.querySelector('.toc-toggle').addEventListener('click', () => {
  const open = toc.classList.toggle('open');
  toc.querySelector('.toc-toggle').setAttribute('aria-expanded', open);
});

function fallback() {
  document.getElementById('mop').classList.add('fallback');
  tocList.innerHTML = '<li style="color:var(--muted);font-size:13px">Contents are shown inside the report when the page is opened as a local file.</li>';
}

frame.addEventListener('load', () => {
  try {
    doc = frame.contentDocument;
    if (!doc || !doc.body) throw new Error('report not accessible');
  } catch (err) { doc = null; fallback(); return; }

  // fonts + restyle
  const fonts = doc.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;600;700&display=swap';
  doc.head.appendChild(fonts);
  const style = doc.createElement('style');
  style.textContent = EMBED_CSS;
  doc.head.appendChild(style);

  // report generation stamp -> banner
  const sub = doc.querySelector('main > header .sub');
  if (sub) document.getElementById('mop-sub').innerHTML =
    sub.textContent.split('·').map(s => `<span>${s.trim()}</span>`).join('');

  buildToc();

  // in-report anchor links scroll the outer page
  doc.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    goTo(a.getAttribute('href').slice(1));
  });
  doc.addEventListener('toggle', () => { frameHeight(); spy(); }, true);

  const RO = frame.contentWindow.ResizeObserver || window.ResizeObserver;
  new RO(frameHeight).observe(doc.body);
  frameHeight();
  spy();

  const hash = location.hash.slice(1);
  if (hash) { goTo(hash, false); setTimeout(() => goTo(hash, false), 700); }
});

window.addEventListener('hashchange', () => goTo(location.hash.slice(1)));
