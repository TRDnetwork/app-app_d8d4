import fs from 'fs';
import path from 'path';

// Parse CSV file with input validation
export const parseCSV = async (filePath: string): Promise<any[]> => {
  // Validate file path to prevent path traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(path.join(__dirname, '../../uploads'))) {
    throw new Error('Invalid file path');
  }
  
  // Check if file exists and is a regular file
  const stats = await fs.promises.stat(normalizedPath);
  if (!stats.isFile()) {
    throw new Error('Path is not a file');
  }
  
  // Check file size (max 10MB)
  if (stats.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds limit');
  }
  
  // Check file extension
  const ext = path.extname(normalizedPath).toLowerCase();
  if (ext !== '.csv') {
    throw new Error('Invalid file type');
  }
  
  // Read and parse CSV file
  const content = await fs.promises.readFile(normalizedPath, 'utf-8');
  const lines = content.split('\n');
  
  // Parse CSV data
  const result = [];
  const headers = lines[0].split(',').map(h => h.trim());
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = lines[i].split(',').map(v => v.trim());
    const obj: any = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    result.push(obj);
  }
  
  return result;
};
// PERF: Added input validation to prevent path traversal in CSV parser
```

```typescript