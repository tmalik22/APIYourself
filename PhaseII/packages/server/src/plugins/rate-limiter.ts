import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Simple in-memory rate limiting store
const rateStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
function createRateLimit(windowMs = 15 * 60 * 1000, max = 100) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [k, v] of rateStore.entries()) {
      if (now > v.resetTime) {
        rateStore.delete(k);
      }
    }
    
    const record = rateStore.get(key);
    
    if (!record || now > record.resetTime) {
      // First request or window expired
      rateStore.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      return next();
    }
    
    if (record.count >= max) {
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`
      });
    }
    
    // Increment counter
    record.count++;
    rateStore.set(key, record);
    
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - record.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    
    next();
  };
}

// Configuration endpoint
router.get('/config', (req, res) => {
  res.json({
    description: 'Rate limiting configuration',
    defaultSettings: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    currentLimits: Array.from(rateStore.entries()).map(([ip, data]) => ({
      ip,
      count: data.count,
      resetTime: new Date(data.resetTime).toISOString()
    }))
  });
});

// Clear rate limits (admin endpoint)
router.post('/clear', (req, res) => {
  rateStore.clear();
  res.json({ success: true, message: 'Rate limits cleared' });
});

export default router;
export { createRateLimit };
