# Security Policy

## Reporting a vulnerability

Please open a private security advisory or contact the maintainer with:

- issue summary
- impact
- reproduction steps
- suggested remediation

## Supported versions

This project currently supports the latest default branch.

## Security posture

- Static client-only architecture
- User input is validated and sanitized
- No embedded secrets
- Dependency audit script: `npm run audit`
