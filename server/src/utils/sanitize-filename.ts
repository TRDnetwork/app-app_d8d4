/**
 * Sanitizes filenames to prevent path traversal attacks
 * Removes or replaces dangerous characters and ensures safe filenames
 */
export function sanitizeFilename(filename: string): string {
  // Remove directory traversal sequences
  filename = filename.replace(/\.\.\//g, '');
  filename = filename.replace(/\.\.\//g, '');
  
  // Replace dangerous characters with underscores
  filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  
  // Remove multiple consecutive dots and underscores
  filename = filename.replace(/\.+/g, '.');
  filename = filename.replace(/_+/g, '_');
  
  // Remove leading/trailing dots and underscores
  filename = filename.replace(/^[_\.]+/, '');
  filename = filename.replace(/[_\.]+$/, '');
  
  // Ensure filename has an extension
  if (!filename.includes('.')) {
    filename += '.txt';
  }
  
  // Limit filename length
  const nameParts = filename.split('.');
  const extension = nameParts.pop();
  const name = nameParts.join('.').substring(0, 100);
  
  return `${name}.${extension}`;
}

// SECURITY FIX: Add validation for file extensions
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.toLowerCase().split('.').pop() || '';
  return allowedExtensions.includes(`.${ext}`);
}
```

```typescript