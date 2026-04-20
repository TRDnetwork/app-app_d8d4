/**
 * Sanitize filename to prevent directory traversal and other security issues
 * @param filename - The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  
  // Remove directory traversal sequences
  let sanitized = filename.replace(/\.\.\//g, '').replace(/\.\.\//g, '');
  
  // Remove any path separators
  sanitized = sanitized.replace(/[/\\]/g, '');
  
  // Remove