import { randomBytes } from 'crypto';

export function generateShortCode(length = 8) {
  // Convert to base64 and make it URL-safe
  return randomBytes(Math.ceil(length * 0.75))
    .toString('base64') // Base64 encoding
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove trailing '='
    .substring(0, length); // Limit length
}
