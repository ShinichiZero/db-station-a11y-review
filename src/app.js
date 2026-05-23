import { frankfurtHbfFixture } from './fixtures.js';
import { createReportModel, toMarkdown } from './reportLogic.js';
import { sanitizePlainText, validateUrl } from './sanitize.js';

const form = document.querySelector('#station-form');
const urlInput = document.querySelector('#station-url');
const manualInput = document.querySelector('#manual-input');
const errorRegion = document.querySelector('#form-error');
const reportRegion = document.querySelector('#report-region');
const outputRoot = document.querySelector('#report-output');
const exportButton = document.querySelector('#export-markdown');
const demoButton = document.querySelector('#load-demo');

let currentReport = null;

const CORS_NOTICE = 'GitHub Pages runs in the browser. Live cross-origin fetches may be blocked by CORS, so this app supports fixture mode and manual HTML/text input fallback.';

function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function makeHeading(level, text) {
  const heading = document.createElement(`h${level}`);
  heading.textContent = text;
  return heading;
}

function makeList(items, labelKey, noteKey) {
  const list = document.createElement('ul');
  items.forEach((item) => {
    const listItem = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${item[labelKey]} — ${item.status}: `;
    listItem.append(strong, document.createTextNode(item[noteKey]));
    list.appendChild(listItem);
  });
  return list;
}

function makeTable(headers, rows, keys) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    keys.forEach((key) => {
      const td = document.createElement('td');
      td.textContent = row[key];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  return table;
}

function renderReport(report) {
  clearChildren(outputRoot);

  const sections = [
    ['A. Station page overview', () => {
      const list = document.createElement('ul');
      [
        `Station: ${report.stationName}`,
        `URL: ${report.stationUrl}`,
        `Source: ${report.sourceLabel}`,
        `Generated: ${report.generatedAt}`,
        `CORS limitation: ${report.corsNotice}`
      ].forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      return list;
    }],
    ['B. Traveler summary', () => {
      const wrapper = document.createElement('div');
      const readiness = document.createElement('p');
      readiness.append('Traveler readiness: ');
      const strong = document.createElement('strong');
      strong.textContent = report.travelerReadiness;
      readiness.appendChild(strong);
      const risk = document.createElement('p');
      risk.textContent = report.riskSummary;
      wrapper.append(readiness, risk);
      return wrapper;
    }],
    ['C. “Can I complete this journey task?” checklist', () => makeList(report.travelerTasks, 'task', 'notes')],
    ['D. Technical accessibility checks', () => makeList(report.technicalChecks, 'check', 'notes')],
    ['E. Assistance and mobility service discoverability', () => {
      const p = document.createElement('p');
      p.textContent = `${report.assistance.discoverability}: ${report.assistance.notes}`;
      return p;
    }],
    ['F. PDF friction analysis', () => {
      const p = document.createElement('p');
      p.textContent = report.pdfFriction;
      return p;
    }],
    ['G. Plain-language risk summary', () => {
      const p = document.createElement('p');
      p.textContent = report.riskSummary;
      return p;
    }],
    ['H. Manual screen reader notes', () => {
      const ul = document.createElement('ul');
      report.manualScreenReaderNotes.forEach((note) => {
        const li = document.createElement('li');
        li.textContent = note;
        ul.appendChild(li);
      });
      return ul;
    }],
    ['I. Redesign recommendations', () => {
      const ul = document.createElement('ul');
      report.redesignRecommendations.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      return ul;
    }],
    ['J. Evidence table', () => makeTable(['ID', 'Source', 'Finding', 'Confidence'], report.evidence, ['id', 'source', 'finding', 'confidence'])],
    ['K. “Needs verification” table', () => makeTable(['Topic', 'Why manual verification is needed'], report.needsVerification, ['topic', 'why'])]
  ];

  sections.forEach(([title, contentFactory], index) => {
    const section = document.createElement('section');
    section.className = 'report-section';
    section.appendChild(makeHeading(3, title));
    section.appendChild(contentFactory());

    if (index === 0 && report.manualInputExcerpt) {
      const excerpt = document.createElement('p');
      excerpt.textContent = `Manual input excerpt: ${report.manualInputExcerpt}`;
      section.appendChild(excerpt);
    }

    outputRoot.appendChild(section);
  });

  const disclaimer = document.createElement('p');
  disclaimer.className = 'disclaimer';
  disclaimer.textContent = 'Automated checks cannot guarantee legal compliance. Human assistive-technology testing is required for WCAG 2.2 AA, BITV 2.0, BFSG, and EN 301 549 aligned outcomes.';
  outputRoot.appendChild(disclaimer);

  reportRegion.hidden = false;
  exportButton.disabled = false;
}

function generateFromFixture(url, manualText) {
  const manualExcerpt = manualText ? sanitizePlainText(manualText, 300) : '';
  const report = createReportModel(frankfurtHbfFixture, {
    stationUrl: url || frankfurtHbfFixture.stationUrl,
    corsNotice: CORS_NOTICE,
    manualInputExcerpt: manualExcerpt || ''
  });
  return report;
}

function showError(message) {
  errorRegion.textContent = message;
  errorRegion.hidden = false;
}

function clearError() {
  errorRegion.textContent = '';
  errorRegion.hidden = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError();

  const validation = validateUrl(urlInput.value);
  if (!validation.isValid) {
    showError(validation.error);
    return;
  }

  const report = generateFromFixture(validation.normalizedUrl, manualInput.value);
  currentReport = report;
  renderReport(report);
});

demoButton.addEventListener('click', () => {
  clearError();
  urlInput.value = frankfurtHbfFixture.stationUrl;
  currentReport = generateFromFixture(frankfurtHbfFixture.stationUrl, manualInput.value);
  renderReport(currentReport);
});

exportButton.addEventListener('click', () => {
  if (!currentReport) {
    return;
  }

  const markdown = toMarkdown(currentReport);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = href;
  downloadLink.download = 'traveler-accessibility-report.md';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(href);
});
