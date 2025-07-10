import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Simple in-memory cache (can be replaced with real Redis)
class SimpleCache {
  private cache = new Map<string, { value: any; expires: number | null }>();
  
  set(key: string, value: any, ttlSeconds?: number): void {
    const expires = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
    this.cache.set(key, { value, expires });
  }
  
  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  keys(): string[] {
    // Clean expired keys first
    for (const [key, item] of this.cache.entries()) {
      if (item.expires && Date.now() > item.expires) {
        this.cache.delete(key);
      }
    }
    return Array.from(this.cache.keys());
  }
  
  size(): number {
    return this.cache.size;
  }
  
  exists(key: string): boolean {
    return this.get(key) !== null;
  }
}

const cache = new SimpleCache();

// Cache middleware creator
function createCacheMiddleware(ttlSeconds = 300) { // 5 minutes default
  return (req: Request & { cache?: any }, res: Response, next: NextFunction) => {
    const key = `${req.method}:${req.originalUrl}`;
    const cached = cache.get(key);
    
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function(data: any) {
      cache.set(key, data, ttlSeconds);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };
    
    req.cache = cache;
    next();
  };
}

// Cache management endpoints
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    size: cache.size(),
    keys: cache.keys().length,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

router.get('/keys', (req: Request, res: Response) => {
  const keys = cache.keys().map(key => ({
    key,
    exists: cache.exists(key)
  }));
  res.json({ keys });
});

router.get('/get/:key', (req: Request, res: Response) => {
  const value = cache.get(req.params.key);
  if (value === null) {
    return res.status(404).json({ error: 'Key not found or expired' });
  }
  res.json({ key: req.params.key, value });
});

router.post('/set', (req: Request, res: Response) => {
  const { key, value, ttl } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }
  
  cache.set(key, value, ttl);
  res.json({ 
    success: true, 
    message: `Key '${key}' set${ttl ? ` with TTL ${ttl}s` : ''}` 
  });
});

router.delete('/delete/:key', (req: Request, res: Response) => {
  const deleted = cache.delete(req.params.key);
  if (deleted) {
    res.json({ success: true, message: 'Key deleted' });
  } else {
    res.status(404).json({ error: 'Key not found' });
  }
});

router.delete('/clear', (req: Request, res: Response) => {
  cache.clear();
  res.json({ success: true, message: 'Cache cleared' });
});

// Bulk operations
router.post('/mset', (req: Request, res: Response) => {
  const { items, ttl } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array' });
  }
  
  let count = 0;
  for (const item of items) {
    if (item.key && item.value !== undefined) {
      cache.set(item.key, item.value, item.ttl || ttl);
      count++;
    }
  }
  
  res.json({ success: true, message: `${count} keys set` });
});

router.post('/mget', (req: Request, res: Response) => {
  const { keys } = req.body;
  if (!Array.isArray(keys)) {
    return res.status(400).json({ error: 'Keys must be an array' });
  }
  
  const results = keys.map(key => ({
    key,
    value: cache.get(key),
    exists: cache.exists(key)
  }));
  
  res.json({ results });
});

// Cache warming endpoint
router.post('/warm', async (req: Request, res: Response) => {
  const { endpoints } = req.body;
  if (!Array.isArray(endpoints)) {
    return res.status(400).json({ error: 'Endpoints must be an array' });
  }
  
  const results = [];
  for (const endpoint of endpoints) {
    try {
      // In a real implementation, you'd make HTTP requests to warm the cache
      // For demo, just set some dummy data
      const key = `GET:${endpoint}`;
      cache.set(key, { warmed: true, endpoint, timestamp: new Date() }, 300);
      results.push({ endpoint, success: true });
    } catch (error: any) {
      results.push({ endpoint, success: false, error: error.message });
    }
  }
  
  res.json({ 
    success: true, 
    message: `Cache warming completed for ${results.length} endpoints`,
    results 
  });
});

export default router;
export { createCacheMiddleware, cache };
