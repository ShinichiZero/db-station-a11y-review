import { describe, expect, it } from 'vitest';
import { buildPlainLanguageRisk, calculateTravelerReadiness, createReportModel, toMarkdown } from '../src/reportLogic.js';
import { frankfurtHbfFixture } from '../src/fixtures.js';

describe('report logic', () => {
  it('calculates readiness based on statuses', () => {
    const ready = calculateTravelerReadiness([{ status: 'Pass' }, { status: 'Pass' }]);
    const caution = calculateTravelerReadiness([{ status: 'Pass' }, { status: 'Partial' }]);
    const unknown = calculateTravelerReadiness([
      { status: 'Pass' },
      { status: 'Needs manual verification' },
      { status: 'Needs manual verification' },
      { status: 'Needs manual verification' }
    ]);
    const helpNeeded = calculateTravelerReadiness([{ status: 'Fail' }, { status: 'Pass' }]);

    expect(ready).toBe('Ready');
    expect(caution).toBe('Usable with caution');
    expect(unknown).toBe('Not enough information');
    expect(helpNeeded).toBe('Assistance likely needed');
  });

  it('builds plain-language risk summary', () => {
    expect(buildPlainLanguageRisk('Assistance likely needed', [{ status: 'Pass' }])).toContain('high');
    expect(buildPlainLanguageRisk('Not enough information', [{ status: 'Pass' }])).toContain('uncertain');
    expect(buildPlainLanguageRisk('Usable with caution', [{ status: 'Pass' }])).toContain('moderate');
  });

  it('creates markdown output with required sections', () => {
    const model = createReportModel(frankfurtHbfFixture, {
      stationUrl: frankfurtHbfFixture.stationUrl,
      corsNotice: 'CORS limitation note',
      manualInputExcerpt: 'Manual note'
    });

    const markdown = toMarkdown(model);

    expect(markdown).toContain('## A. Station page overview');
    expect(markdown).toContain('## K. Needs verification table');
    expect(markdown).toContain('Manual input excerpt: Manual note');
  });
});
