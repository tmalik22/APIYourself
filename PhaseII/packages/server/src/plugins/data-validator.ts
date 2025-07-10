import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Validation schemas store
const schemas = new Map<string, any>();

// Built-in validation functions
const validators = {
  required: (value: any) => value !== undefined && value !== null && value !== '',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min: number) => (value: string) => value && value.length >= min,
  maxLength: (max: number) => (value: string) => value && value.length <= max,
  number: (value: any) => !isNaN(Number(value)),
  integer: (value: any) => Number.isInteger(Number(value)),
  min: (min: number) => (value: number) => Number(value) >= min,
  max: (max: number) => (value: number) => Number(value) <= max,
  pattern: (regex: RegExp) => (value: string) => regex.test(value),
  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

// Validation middleware creator
function createValidator(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas.get(schemaName);
    if (!schema) {
      return res.status(500).json({ error: `Validation schema '${schemaName}' not found` });
    }
    
    const errors: any[] = [];
    const data = req.body;
    
    for (const [field, rules] of Object.entries(schema.fields)) {
      const value = data[field];
      const fieldRules = rules as any;
      
      for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
        let validator;
        
        if (ruleName === 'required') {
          validator = validators.required;
        } else if (typeof ruleValue === 'boolean' && ruleValue) {
          validator = validators[ruleName as keyof typeof validators];
        } else if (typeof ruleValue === 'number') {
          validator = (validators as any)[ruleName]?.(ruleValue);
        } else if (ruleValue instanceof RegExp) {
          validator = validators.pattern(ruleValue);
        }
        
        if (validator && !validator(value)) {
          errors.push({
            field,
            rule: ruleName,
            message: `Field '${field}' failed validation rule '${ruleName}'`,
            value
          });
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        errors
      });
    }
    
    next();
  };
}

// Schema management endpoints
router.get('/schemas', (req, res) => {
  const schemaList = Array.from(schemas.entries()).map(([name, schema]) => ({
    name,
    description: schema.description,
    fields: Object.keys(schema.fields)
  }));
  res.json({ schemas: schemaList });
});

router.post('/schemas', (req, res) => {
  const { name, description, fields } = req.body;
  
  if (!name || !fields) {
    return res.status(400).json({ error: 'Name and fields are required' });
  }
  
  schemas.set(name, { description, fields });
  res.json({ success: true, message: `Schema '${name}' created` });
});

router.get('/schemas/:name', (req, res) => {
  const schema = schemas.get(req.params.name);
  if (!schema) {
    return res.status(404).json({ error: 'Schema not found' });
  }
  res.json(schema);
});

router.delete('/schemas/:name', (req, res) => {
  if (schemas.delete(req.params.name)) {
    res.json({ success: true, message: 'Schema deleted' });
  } else {
    res.status(404).json({ error: 'Schema not found' });
  }
});

// Test validation endpoint
router.post('/validate/:schemaName', (req: Request, res: Response, next: NextFunction) => {
  const validator = createValidator(req.params.schemaName);
  validator(req, res, (err) => {
    if (err) return next(err);
    res.json({ success: true, message: 'Validation passed', data: req.body });
  });
});

// Add some default schemas
schemas.set('user', {
  description: 'User registration validation',
  fields: {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    name: { required: true, minLength: 2, maxLength: 50 }
  }
});

schemas.set('product', {
  description: 'Product validation',
  fields: {
    name: { required: true, maxLength: 100 },
    price: { required: true, number: true, min: 0 },
    description: { maxLength: 500 }
  }
});

export default router;
export { createValidator };
