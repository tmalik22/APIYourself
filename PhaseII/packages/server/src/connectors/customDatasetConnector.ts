import { Request, Response } from 'express';
import { Connector } from './baseConnector';

export class CustomDatasetConnector implements Connector {
  providerId = 'custom-dataset';

  getAuthUrl(): string {
    // For custom datasets, we don't need OAuth - just redirect to setup
    return `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=setup&plugin=custom-dataset`;
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      // Handle JSON upload or manual entry
      const jsonData = req.body.jsonData || req.query.sample_data;
      
      if (!jsonData) {
        // Return sample structure for manual entry
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=custom-dataset`);
        return;
      }

      const schema = await this.getSchema(JSON.stringify(jsonData));
      console.log('Custom dataset schema:', schema);

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=success&plugin=custom-dataset`);
    } catch (error) {
      console.error('Custom dataset setup error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard?auth_status=error&plugin=custom-dataset`);
    }
  }

  async getSchema(jsonData: string): Promise<any> {
    try {
      const data = JSON.parse(jsonData);
      
      // Handle different JSON structures
      let sampleObject;
      if (Array.isArray(data)) {
        sampleObject = data[0] || {};
      } else {
        sampleObject = data;
      }

      // Analyze the structure to create schema
      const fields: any[] = [];
      for (const [key, value] of Object.entries(sampleObject)) {
        fields.push({
          name: key,
          type: this.inferFieldType(value),
          required: value !== null && value !== undefined,
          sample: value
        });
      }

      return {
        name: 'Custom Dataset',
        recordCount: Array.isArray(data) ? data.length : 1,
        fields: fields,
        sampleData: Array.isArray(data) ? data.slice(0, 3) : [data]
      };
    } catch (error) {
      console.error('Error parsing custom dataset:', error);
      return { 
        error: 'Failed to parse JSON data',
        supportedFormats: [
          'Array of objects: [{"name": "John", "age": 30}]',
          'Single object: {"name": "John", "age": 30}',
          'Nested objects: {"user": {"name": "John", "profile": {"age": 30}}}'
        ]
      };
    }
  }

  private inferFieldType(value: any): string {
    if (value === null || value === undefined) return 'text';
    
    const type = typeof value;
    
    switch (type) {
      case 'string':
        // Try to detect special string types
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'email';
        if (/^https?:\/\//.test(value)) return 'url';
        return 'text';
      case 'number':
        return Number.isInteger(value) ? 'number' : 'number';
      case 'boolean':
        return 'boolean';
      case 'object':
        if (Array.isArray(value)) return 'array';
        return 'object';
      default:
        return 'text';
    }
  }
}
