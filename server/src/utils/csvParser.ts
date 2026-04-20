import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { sanitizeFilename } from './sanitize-filename';

interface CSVOptions {
  delimiter?: string;
  headers?: boolean;
  skipEmptyLines?: boolean;
}

/**
 * CSV Parser utility for handling CSV file imports
 * Provides streaming parsing for large files and proper error handling
 */
export class CSVParser {
  /**
   * Parse CSV file from file path
   * @param filePath - Path to the CSV file
   * @param options - CSV parsing options
   * @returns Promise<Array<Record<string, any>>> - Parsed CSV data
   */
  static async parseFile(filePath: string, options: CSVOptions = {}): Promise<Array<Record<string, any>>> {
    // SECURITY FIX: Validate file path is within allowed directory
    const allowedDir = process.env.UPLOAD_DIR || '/tmp/shopsphere-imports';
    const resolvedPath = path.resolve(filePath);
    const resolvedDir = path.resolve(allowedDir);
    
    if (!resolvedPath.startsWith(resolvedDir)) {
      throw new Error('Invalid file path');
    }

    // SECURITY FIX: Validate file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error('File not found');
    }

    return new Promise((resolve, reject) => {
      const results: Array<Record<string, any>> = [];
      const stream = fs.createReadStream(filePath);
      
      stream
        .pipe(csv(options))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Parse CSV content from string
   * @param content - CSV content as string
   * @param options - CSV parsing options
   * @returns Promise<Array<Record<string, any>>> - Parsed CSV data
   */
  static async parse(content: string, options: CSVOptions = {}): Promise<Array<Record<string, any>>> {
    return new Promise((resolve, reject) => {
      const results: Array<Record<string, any>> = [];
      
      // Create a readable stream from the string
      const stream = require('stream');
      const readable = new stream.Readable();
      readable.push(content);
      readable.push(null);
      
      readable
        .pipe(csv(options))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Validate CSV structure based on expected headers
   * @param filePath - Path to the CSV file
   * @param expectedHeaders - Array of expected header names
   * @returns Promise<boolean> - Whether CSV has expected structure
   */
  static async validateStructure(filePath: string, expectedHeaders: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      
      stream
        .pipe(csv({ headers: true }))
        .on('headers', (headers) => {
          // Check if all expected headers are present
          const hasAllHeaders = expectedHeaders.every(header => 
            headers.includes(header)
          );
          
          stream.destroy(); // Stop processing after headers
          resolve(hasAllHeaders);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Get CSV headers
   * @param filePath - Path to the CSV file
   * @returns Promise<string[]> - Array of header names
   */
  static async getHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      
      stream
        .pipe(csv({ headers: true }))
        .on('headers', (headers) => {
          stream.destroy(); // Stop processing after headers
          resolve(headers);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
```

```typescript