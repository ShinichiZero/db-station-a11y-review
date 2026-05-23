import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import axe from 'axe-core';

const projectRoot = path.resolve(import.meta.dirname, '..');

function loadHtml(fileName) {
  const filePath = path.join(projectRoot, fileName);
  return readFileSync(filePath, 'utf8');
}

describe('static page accessibility smoke checks', () => {
  it('index page has no critical axe violations in static markup', async () => {
    document.open();
    document.write(loadHtml('index.html'));
    document.close();

    const result = await axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'color-contrast': { enabled: false }
      }
    });

    const seriousOrCritical = result.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact)
    );

    expect(seriousOrCritical).toHaveLength(0);
  });
});
