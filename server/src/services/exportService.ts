import { Readable, Transform } from 'stream';
import { stringify } from 'csv-stringify';
import { db } from '../config/database';
import { jobService, JobType, JobStatus } from './jobService';
import { StatusCodes } from 'http-status-codes';

// Export format
export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json'
}

// Export options
export interface ExportOptions {
  format: ExportFormat;
  fields?: string[]; // Specific fields to include
  filters?: Record<string, any>; // Query filters
  sort?: Record<string, 1 | -1>; // Sort options
  limit?: number; // Maximum number of records
}

// Export service class
export class ExportService {
  /**
   * Export data as a stream
   */
  async exportAsStream(
    resourceType: string,
    options: ExportOptions
  ): Promise<Readable> {
    // Get the collection for the resource type
    const collection = this.getCollection(resourceType);
    if (!collection) {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }

    // Build the query
    const query = options.filters || {};
    
    // Build the projection
    const projection: Record<string, 1 | 0> = {};
    if (options.fields) {
      options.fields.forEach(field => {
        projection[field] = 1;
      });
    }
    
    // Execute the query
    let cursor = collection.find(query);
    
    // Apply projection if specified
    if (Object.keys(projection).length > 0) {
      cursor = cursor.project(projection);
    }
    
    // Apply sort if specified
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    
    // Apply limit if specified
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }

    // Create a transform stream to format the data
    const transformStream = new Transform({
      objectMode: true,
      transform: (doc, encoding, callback) => {
        try {
          // Convert ObjectId to string
          const processedDoc = this.processDocument(doc);
          
          // Format based on export format
          switch (options.format) {
            case ExportFormat.CSV:
              // For CSV, we need to convert the document to an array of values
              // in the order of the fields
              const values = options.fields 
                ? options.fields.map(field => this.getFieldValue(processedDoc, field))
                : Object.values(processedDoc);
              
              callback(null, values);
              break;
              
            case ExportFormat.JSON:
              // For JSON, we can just stringify the document
              callback(null, JSON.stringify(processedDoc) + '\n');
              break;
              
            default:
              callback(new Error(`Unsupported export format: ${options.format}`));
          }
        } catch (error: any) {
          callback(error);
        }
      }
    });

    // Pipe the cursor to the transform stream
    cursor.stream().pipe(transformStream);
    
    // If exporting to CSV, add a header row
    if (options.format === ExportFormat.CSV) {
      const header = options.fields || Object.keys((await cursor.limit(1).toArray())[0] || {});
      const headerStream = new Readable({
        read() {
          this.push(header);
          this.push(null);
        }
      });
      
      // Combine the header stream with the transform stream
      return this.combineStreams(headerStream, transformStream);
    }

    return transformStream;
  }

  /**
   * Export data to CSV
   */
  async exportToCsv(
    resourceType: string,
    options: Omit<ExportOptions, 'format'>
  ): Promise<Readable> {
    return this.exportAsStream(resourceType, { ...options, format: ExportFormat.CSV });
  }

  /**
   * Export data to JSON
   */
  async exportToJson(
    resourceType: string,
    options: Omit<ExportOptions, 'format'>
  ): Promise<Readable> {
    return this.exportAsStream(resourceType, { ...options, format: ExportFormat.JSON });
  }

  /**
   * Process a document for export
   */
  private processDocument(doc: any): any {
    const processed: any = {};
    
    for (const [key, value] of Object.entries(doc)) {
      // Convert ObjectId to string
      if (value && value._bsontype === 'ObjectID') {
        processed[key] = value.toString();
      } 
      // Convert Date to ISO string
      else if (value instanceof Date) {
        processed[key]