# db-station-a11y-review

A portfolio-ready static GitHub Pages app that turns station-page evidence into a **Traveler Accessibility Report** focused on practical traveler tasks.

## Purpose

This project helps people consume, verify, and trust station accessibility information by combining:

- traveler task readiness checks
- technical accessibility heuristics
- explicit “Needs manual verification” labeling
- plain-language risk summaries

Primary demo fixture: **Deutsche Bahn Frankfurt (Main) Hbf** content categories.

## Screenshots

- Home screen example: https://github.com/user-attachments/assets/62338c8f-1e98-47f2-bcbb-0a975e05ed87
- `docs/screenshots/report.png` (add generated report view screenshot)

## Local setup

```bash
npm install
npm run lint
npm test
npm run test:accessibility
npm run build
```

Then open `index.html` in a browser or serve the folder with a static server.

## GitHub Pages deployment

This is a static app. Two simple options:

1. Deploy root files directly from the default branch using GitHub Pages “Deploy from branch”.
2. Use the build output in `dist/` in your deployment workflow.

## Accessibility methodology

See [`methodology.html`](./methodology.html) for the scoring model and legal framing.

- WCAG 2.2 AA target
- BITV 2.0 and BFSG readiness framing
- EN 301 549-style practical review patterns

## Security and trust approach

- URL validation and sanitization
- no unsafe dynamic HTML injection from user input
- explicit CORS limitation handling
- no trackers and no secrets

## Known limitations

- Automated checks cannot prove legal compliance.
- Human VoiceOver/NVDA testing is still required.
- Browser CORS can block live fetching on GitHub Pages.
- The Frankfurt Hbf data is a fixture model and not live operational truth.

## Legal disclaimer

This project is an accessibility support tool, not legal advice. Automated checks cannot guarantee legal compliance. Human assistive-technology testing and legal review are required.
