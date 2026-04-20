import path from 'path';

// Sanitize filename to prevent path traversal attacks
export const sanitizeFilename = (filename: string): string => {
  // Remove any directory traversal sequences
  const sanitized = filename
    .replace(/(\.\.\/|\/\.\.)/g, '') // Remove ../ and /..
    .replace(/(\\|\/)/g, '') // Remove path separators
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters except . _ -
    .substring(0, 255); // Limit length to 255 characters
  
  // Ensure the filename has a valid extension
  const ext = path.extname(sanitized);
  if (!ext) {
    return sanitized + '.jpg'; // Default to .jpg if no extension
  }
  
  // Allow only specific file extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  if (!allowedExtensions.includes(ext.toLowerCase())) {
    return sanitized.substring(0, sanitized.length - ext.length) + '.jpg';
  }
  
  return sanitized;
};
// PERF: Enhanced filename sanitization to prevent path traversal
```

```typescript