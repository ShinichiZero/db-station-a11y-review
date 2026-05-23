const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;

export function sanitizePlainText(input, maxLength = 5000) {
  return String(input || '')
    .replace(CONTROL_CHARS_REGEX, ' ')
    .trim()
    .slice(0, maxLength);
}

export function validateUrl(rawUrl) {
  const sanitized = sanitizePlainText(rawUrl, 2048);

  if (!sanitized) {
    return { isValid: false, error: 'Please enter a station page URL.' };
  }

  try {
    const parsed = new URL(sanitized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Only HTTP or HTTPS URLs are allowed.' };
    }

    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, error: 'Enter a valid URL, for example https://www.bahnhof.de/.' };
  }
}
