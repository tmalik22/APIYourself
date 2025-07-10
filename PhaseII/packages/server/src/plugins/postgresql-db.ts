import { Router, Request, Response } from 'express';

const router = Router();

// Simple in-memory database simulation (replace with real PostgreSQL)
class SimpleDB {
  private tables = new Map<string, { schema: any; rows: any[] }>();
  
  createTable(name: string, schema: any): void {
    this.tables.set(name, { schema, rows: [] });
  }
  
  dropTable(name: string): boolean {
    return this.tables.delete(name);
  }
  
  getTables(): string[] {
    return Array.from(this.tables.keys());
  }
  
  getSchema(tableName: string): any {
    const table = this.tables.get(tableName);
    return table ? table.schema : null;
  }
  
  insert(tableName: string, data: any): any {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table '${tableName}' does not exist`);
    
    // Validate against schema
    for (const [field, config] of Object.entries(table.schema)) {
      const fieldConfig = config as any;
      if (fieldConfig.required && (data[field] === undefined || data[field] === null)) {
        throw new Error(`Field '${field}' is required`);
      }
      if (fieldConfig.type && data[field] !== undefined) {
        if (fieldConfig.type === 'number' && typeof data[field] !== 'number') {
          throw new Error(`Field '${field}' must be a number`);
        }
        if (fieldConfig.type === 'string' && typeof data[field] !== 'string') {
          throw new Error(`Field '${field}' must be a string`);
        }
      }
    }
    
    const id = table.rows.length + 1;
    const row = { id, ...data, created_at: new Date().toISOString() };
    table.rows.push(row);
    return row;
  }
  
  select(tableName: string, where?: any, limit?: number, offset?: number): any[] {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table '${tableName}' does not exist`);
    
    let results = table.rows;
    
    // Apply where conditions
    if (where) {
      results = results.filter(row => {
        for (const [key, value] of Object.entries(where)) {
          if (row[key] !== value) return false;
        }
        return true;
      });
    }
    
    // Apply pagination
    if (offset) results = results.slice(offset);
    if (limit) results = results.slice(0, limit);
    
    return results;
  }
  
  update(tableName: string, id: number, data: any): any {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table '${tableName}' does not exist`);
    
    const rowIndex = table.rows.findIndex(row => row.id === id);
    if (rowIndex === -1) throw new Error(`Row with id ${id} not found`);
    
    table.rows[rowIndex] = { 
      ...table.rows[rowIndex], 
      ...data, 
      updated_at: new Date().toISOString() 
    };
    return table.rows[rowIndex];
  }
  
  delete(tableName: string, id: number): boolean {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table '${tableName}' does not exist`);
    
    const rowIndex = table.rows.findIndex(row => row.id === id);
    if (rowIndex === -1) return false;
    
    table.rows.splice(rowIndex, 1);
    return true;
  }
  
  count(tableName: string, where?: any): number {
    return this.select(tableName, where).length;
  }
}

const db = new SimpleDB();

// Create some default tables
db.createTable('users', {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number', required: false }
});

db.createTable('products', {
  name: { type: 'string', required: true },
  price: { type: 'number', required: true },
  description: { type: 'string', required: false },
  category: { type: 'string', required: false }
});

// Database info endpoints
router.get('/info', (req: Request, res: Response) => {
  const tables = db.getTables().map(name => ({
    name,
    schema: db.getSchema(name),
    rowCount: db.count(name)
  }));
  
  res.json({
    database: 'SimpleDB (PostgreSQL simulation)',
    tables,
    totalTables: tables.length
  });
});

router.get('/tables', (req: Request, res: Response) => {
  const tables = db.getTables();
  res.json({ tables });
});

// Table management
router.post('/tables', (req: Request, res: Response) => {
  try {
    const { name, schema } = req.body;
    if (!name || !schema) {
      return res.status(400).json({ error: 'Table name and schema required' });
    }
    
    db.createTable(name, schema);
    res.json({ success: true, message: `Table '${name}' created` });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tables/:name', (req: Request, res: Response) => {
  try {
    const deleted = db.dropTable(req.params.name);
    if (deleted) {
      res.json({ success: true, message: `Table '${req.params.name}' dropped` });
    } else {
      res.status(404).json({ error: 'Table not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tables/:name/schema', (req: Request, res: Response) => {
  const schema = db.getSchema(req.params.name);
  if (!schema) {
    return res.status(404).json({ error: 'Table not found' });
  }
  res.json({ schema });
});

// CRUD operations
router.post('/tables/:name/rows', (req: Request, res: Response) => {
  try {
    const row = db.insert(req.params.name, req.body);
    res.status(201).json({ success: true, data: row });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tables/:name/rows', (req: Request, res: Response) => {
  try {
    const { limit, offset, ...where } = req.query;
    const rows = db.select(
      req.params.name, 
      Object.keys(where).length > 0 ? where : undefined,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    
    res.json({ 
      success: true, 
      data: rows,
      count: rows.length,
      total: db.count(req.params.name)
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tables/:name/rows/:id', (req: Request, res: Response) => {
  try {
    const rows = db.select(req.params.name, { id: parseInt(req.params.id) });
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Row not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/tables/:name/rows/:id', (req: Request, res: Response) => {
  try {
    const row = db.update(req.params.name, parseInt(req.params.id), req.body);
    res.json({ success: true, data: row });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tables/:name/rows/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.delete(req.params.name, parseInt(req.params.id));
    if (deleted) {
      res.json({ success: true, message: 'Row deleted' });
    } else {
      res.status(404).json({ error: 'Row not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Bulk operations
router.post('/tables/:name/bulk', (req: Request, res: Response) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows)) {
      return res.status(400).json({ error: 'Rows must be an array' });
    }
    
    const results = [];
    for (const rowData of rows) {
      try {
        const row = db.insert(req.params.name, rowData);
        results.push({ success: true, data: row });
      } catch (error: any) {
        results.push({ success: false, error: error.message, data: rowData });
      }
    }
    
    res.json({ 
      success: true, 
      message: `Bulk insert completed`,
      results 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Query endpoint (for custom queries)
router.post('/query', (req: Request, res: Response) => {
  try {
    const { table, operation, data, where, limit, offset } = req.body;
    
    if (!table) {
      return res.status(400).json({ error: 'Table name required' });
    }
    
    let result;
    switch (operation) {
      case 'select':
        result = db.select(table, where, limit, offset);
        break;
      case 'insert':
        result = db.insert(table, data);
        break;
      case 'count':
        result = db.count(table, where);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
export { db };
