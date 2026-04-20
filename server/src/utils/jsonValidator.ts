import fs from 'fs';
import path from 'path';

// Validate JSON file with input validation
export const validateJSON = async (filePath: string, schema: any): Promise<any> => {
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
  if (ext !== '.json') {
    throw new Error('Invalid file type');
  }
  
  // Read and parse JSON file
  const content = await fs.promises.readFile(normalizedPath, 'utf-8');
  
  // Parse JSON
  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    throw new Error('Invalid JSON format');