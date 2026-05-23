# Contributing

Thanks for contributing to **db-station-a11y-review**.

## Development workflow

1. Install dependencies: `npm install`
2. Run quality checks:
   - `npm run lint`
   - `npm test`
   - `npm run test:accessibility`
   - `npm run build`
3. Keep changes focused and include tests for logic changes.

## Accessibility expectations

- Preserve semantic HTML and keyboard accessibility.
- Keep visible focus states.
- Do not rely on color alone.
- Prefer simple native controls over custom widgets.

## Security expectations

- Validate and sanitize any user input.
- Avoid unsanitized `innerHTML` usage.
- Do not add secrets or analytics trackers.
