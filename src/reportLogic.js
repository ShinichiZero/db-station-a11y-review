export const SCORE_ORDER = ['Pass', 'Partial', 'Fail', 'Needs manual verification', 'Not applicable'];

function countByStatus(items) {
  return items.reduce((acc, item) => {
    const key = item.status;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export function calculateTravelerReadiness(taskItems) {
  const counts = countByStatus(taskItems);

  if ((counts.Fail || 0) > 0) {
    return 'Assistance likely needed';
  }

  if ((counts['Needs manual verification'] || 0) >= 3) {
    return 'Not enough information';
  }

  if ((counts.Partial || 0) > 0 || (counts['Needs manual verification'] || 0) > 0) {
    return 'Usable with caution';
  }

  return 'Ready';
}

export function buildPlainLanguageRisk(readiness, technicalChecks) {
  const techCounts = countByStatus(technicalChecks);

  if (readiness === 'Assistance likely needed' || (techCounts.Fail || 0) > 0) {
    return 'Risk is high: travelers should expect barriers and may need support before departure.';
  }

  if (readiness === 'Not enough information') {
    return 'Risk is uncertain: critical details are missing and must be manually verified.';
  }

  if (readiness === 'Usable with caution') {
    return 'Risk is moderate: core journey tasks may be possible, but friction remains likely.';
  }

  return 'Risk appears low for listed tasks, pending periodic manual re-checks.';
}

export function createReportModel(stationData, context) {
  const travelerReadiness = calculateTravelerReadiness(stationData.travelerTasks);
  const riskSummary = buildPlainLanguageRisk(travelerReadiness, stationData.technicalChecks);

  return {
    stationName: stationData.stationName,
    stationUrl: context.stationUrl,
    sourceLabel: stationData.sourceLabel,
    generatedAt: new Date().toISOString(),
    travelerReadiness,
    travelerTasks: stationData.travelerTasks,
    technicalChecks: stationData.technicalChecks,
    assistance: stationData.assistance,
    pdfFriction: stationData.pdfFriction,
    riskSummary,
    manualScreenReaderNotes: stationData.manualScreenReaderNotes,
    redesignRecommendations: stationData.redesignRecommendations,
    evidence: stationData.evidence,
    needsVerification: stationData.needsVerification,
    corsNotice: context.corsNotice,
    manualInputExcerpt: context.manualInputExcerpt
  };
}

export function toMarkdown(report) {
  const tasks = report.travelerTasks
    .map((task) => `- [${task.status}] **${task.task}**: ${task.notes}`)
    .join('\n');

  const checks = report.technicalChecks
    .map((item) => `- [${item.status}] **${item.check}**: ${item.notes}`)
    .join('\n');

  const notes = report.manualScreenReaderNotes.map((note) => `- ${note}`).join('\n');
  const recommendations = report.redesignRecommendations.map((item) => `- ${item}`).join('\n');
  const evidenceRows = report.evidence.map((row) => `| ${row.id} | ${row.source} | ${row.finding} | ${row.confidence} |`).join('\n');
  const verificationRows = report.needsVerification.map((row) => `| ${row.topic} | ${row.why} |`).join('\n');

  return `# Traveler Accessibility Report\n\n` +
    `## A. Station page overview\n` +
    `- Station: ${report.stationName}\n` +
    `- URL: ${report.stationUrl}\n` +
    `- Source: ${report.sourceLabel}\n` +
    `- Generated: ${report.generatedAt}\n\n` +
    `## B. Traveler summary\n` +
    `- Traveler readiness: **${report.travelerReadiness}**\n` +
    `- Plain-language risk: ${report.riskSummary}\n\n` +
    `## C. Can I complete this journey task? checklist\n${tasks}\n\n` +
    `## D. Technical accessibility checks\n${checks}\n\n` +
    `## E. Assistance and mobility service discoverability\n` +
    `- Status: ${report.assistance.discoverability}\n` +
    `- Notes: ${report.assistance.notes}\n\n` +
    `## F. PDF friction analysis\n${report.pdfFriction}\n\n` +
    `## G. Plain-language risk summary\n${report.riskSummary}\n\n` +
    `## H. Manual screen reader notes\n${notes}\n\n` +
    `## I. Redesign recommendations\n${recommendations}\n\n` +
    `## J. Evidence table\n| ID | Source | Finding | Confidence |\n| --- | --- | --- | --- |\n${evidenceRows}\n\n` +
    `## K. Needs verification table\n| Topic | Why manual verification is needed |\n| --- | --- |\n${verificationRows}\n\n` +
    `---\n` +
    `Automated checks cannot guarantee legal compliance. Human assistive-technology testing is required for WCAG 2.2 AA, BITV 2.0, BFSG, and EN 301 549-aligned outcomes.\n` +
    `\n` +
    `CORS note: ${report.corsNotice}\n` +
    (report.manualInputExcerpt ? `\nManual input excerpt: ${report.manualInputExcerpt}\n` : '');
}
