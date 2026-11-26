/* Placeholder page for modules that are not built yet. Each page sets <body data-tab="..."> */
const DETAILS = {
  squad: {
    plan: ['Role fit of every player against the role templates from the Model of Play',
      'Age curve and expected development or decline', 'Contract length, wages and resale window',
      'Needs list: which roles to strengthen for 2027/28'],
    inputs: ['Model of Play KPIs and role templates', 'Player-match table (event data)', 'Contracts and wages'],
  },
  coach: {
    plan: ['Results against expectation (xG, xPts) over the coach\'s tenure', 'Style fit with the club\'s target playing model',
      'Coach scenario: retain, or replace with a coach who brings a new style', 'How each scenario changes the position requirements'],
    inputs: ['Model of Play KPIs', 'Match results and xG', 'Coach history across leagues'],
  },
  search: {
    plan: ['First filter on summary stats across all leagues and five seasons', 'Shrunk per-90 stats so small samples do not dominate',
      'Similarity and role-fit scores against each role template', 'Shortlist per position with event-data checks'],
    inputs: ['Summary stats (tier 1)', 'Event data for the shortlist (tier 2)', 'Role templates'],
  },
  roi: {
    plan: ['Fee ranges from comparable transfers', 'Monte Carlo resale value from age curves', 'NPV and risk per candidate',
      'Optimiser: role fit per euro under the wage cap, with a balance of at least zero'],
    inputs: ['Candidate shortlist', 'Fees and age curves', 'Budget and wage cap'],
  },
};

const tab = TABS.find(t => t.id === document.body.dataset.tab);
initShell(tab.id);
document.title = `${tab.label} · ${SITE.title}`;
const d = DETAILS[tab.id] || { plan: [], inputs: [] };
const related = TABS.filter(t => t.id !== tab.id)
  .map(t => `<li><a href="${t.href}">${t.label}</a> <span class="badge ${t.status}">${STATUS_LABEL[t.status]}</span></li>`).join('');

document.getElementById('content').innerHTML = `
  <section class="banner">
    <div class="stripes"></div><div class="shade"></div>
    <div class="wrap">
      <div class="crumbs"><a href="index.html">Home</a> / ${tab.label}</div>
      <h1 class="display">${tab.label}</h1>
      <div class="sub"><span class="badge ${tab.status}">${STATUS_LABEL[tab.status]}</span><span>Step ${tab.step} of the decision pipeline</span></div>
    </div>
  </section>
  <div class="wrap soon">
    <div>
      <h2>What this module will do</h2>
      <p>${tab.blurb}</p>
      <div class="box" style="margin-top:28px"><h3>Planned outputs</h3><ul>${d.plan.map(x => `<li>${x}</li>`).join('')}</ul></div>
    </div>
    <div>
      <div class="box"><h3>Inputs</h3><ul>${d.inputs.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div class="box" style="margin-top:28px"><h3>Other modules</h3><ul>${related}</ul></div>
    </div>
  </div>`;
