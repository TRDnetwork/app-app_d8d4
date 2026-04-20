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
    // SECURITY FIX: Use path.resolve and ensure the normalized path starts with the allowed directory
    const allowedDir = path.resolve(process.env.UPLOAD_DIR || '/tmp/shopsphere-imports');
    const normalizedPath = path.resolve(filePath);

    // Ensure the normalized path starts with the allowed directory and doesn't contain any traversal
    if (!normalizedPath.startsWith(allowedDir) || normalizedPath.includes('..')) {
      throw new Error('Invalid file path');
    }

    // SECURITY FIX: Validate file exists and is a file (not directory)
    if (!fs.existsSync(normalizedPath)) {
      throw new Error('File not found');
    }

    if (fs.statSync(normalizedPath).isDirectory()) {
      throw new Error('Path is a directory, not a file');
    }

    return new Promise((resolve, reject) => {
      const results: Array<Record<string, any>> = [];
      const stream = fs.createReadStream(normalizedPath);

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
}