/**
 * Input Sanitizer Utility
 * Prevents Stored XSS by stripping executable scripts, event handlers (onload, onerror),
 * javascript: pseudo-protocols, iframes, objects, and embed tags from user/staff input.
 */
export function sanitizeHtmlContent(input: string | null | undefined): string {
  if (!input) return '';

  return input
    // Strip <script>...</script> tags and inner script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip <iframe>...</iframe>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip <object>...<object>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip <embed>...<embed>
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Strip inline event handlers like onerror=, onload=, onclick=
    .replace(/\son\w+\s*=\s*(['"])(.*?)\1/gi, '')
    .replace(/\son\w+\s*=\s*([^>\s]+)/gi, '')
    // Strip javascript: pseudo-protocol in URLs
    .replace(/javascript\s*:/gi, 'no-javascript:');
}
