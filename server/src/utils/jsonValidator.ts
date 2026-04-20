import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as path from 'path';

/**
 * JSON Validator utility for validating JSON data against schemas
 * Uses Ajv for JSON Schema validation with additional formats
 */
export class JSONValidator {
  private static ajv = new Ajv({ allErrors: true });
  static formatter = addFormats(JSONValidator.ajv);

  /**
   * Validate data against schema
   * @param data - Data to validate
   * @param schema - JSON Schema
   * @returns { valid: boolean, errors: string[] }
   */
  static validate(data: any, schema: any): { valid: boolean; errors?: string[] } {
    const valid = JSONValidator.ajv.validate(schema, data);
    return {
      valid: !!valid,
      errors: JSONValidator.ajv.errors?.map((e) => e.message || 'Validation error') || [],
    };
  }

  /**
   * Validate JSON file
   * @param filePath - Path to the JSON file
   * @returns Promise<any> - Parsed and validated JSON data
   */
  static async validateFile(filePath: string): Promise<any> {
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

    // Read file
    const content = fs.readFileSync(normalizedPath, 'utf8');

    // Validate and parse
    return this.validateAndParse(content);
  }

  /**
   * Validate and parse JSON string
   * @param content - JSON string
   * @returns any - Parsed JSON
   */
  static validateAndParse(content: string): any {
    let data