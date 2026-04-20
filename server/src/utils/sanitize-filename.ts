import * as path from 'path';

/**
 * Sanitizes filenames to prevent path traversal attacks
 * Removes or replaces dangerous characters and ensures safe filenames
 */
export function sanitizeFilename(filename: string): string {
  // SECURITY FIX: Use path.normalize to handle encoded traversal sequences
  const normalized = path.normalize(filename);
  const basename = path.basename(normalized);

  // Replace dangerous characters with underscores
  let sanitized = basename.replace(/[<>:"|?*\x00-\x1F]/g, '_');

  // Replace forward and backward slashes separately to prevent bypass
  sanitized = sanitized.replace(/\//g, '_');
  sanitized = sanitized.replace(/\\/g, '_');

  // Remove multiple consecutive dots and underscores
  sanitized = sanitized.replace(/\.+/g, '.');
  sanitized = sanitized.replace(/_+/g, '_');

  // Remove leading/trailing dots and underscores
  sanitized = sanitized.replace(/^[_\.]+/, '');
  sanitized = sanitized.replace(/[_\.]+$/, '');

  // Ensure filename has an extension
  if (!sanitized.includes('.')) {
    sanitized += '.txt';
  }

  // Limit filename length
  const ext = path.extname(sanitized);
  const name = path.basename(sanitized, ext);
  const truncatedName = name.substring(0, 100);

  return `${truncatedName}${ext}`;
}

// SECURITY FIX: Add validation for file extensions
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}