"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
exports.createCacheMiddleware = createCacheMiddleware;
const express_1 = require("express");
const router = (0, express_1.Router)();
// Simple in-memory cache (can be replaced with real Redis)
class SimpleCache {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ttlSeconds) {
        const expires = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
        this.cache.set(key, { value, expires });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (item.expires && Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    keys() {
        // Clean expired keys first
        for (const [key, item] of this.cache.entries()) {
            if (item.expires && Date.now() > item.expires) {
                this.cache.delete(key);
            }
        }
        return Array.from(this.cache.keys());
    }
    size() {
        return this.cache.size;
    }
    exists(key) {
        return this.get(key) !== null;
    }
}
const cache = new SimpleCache();
exports.cache = cache;
// Cache middleware creator
function createCacheMiddleware(ttlSeconds = 300) {
    return (req, res, next) => {
        const key = `${req.method}:${req.originalUrl}`;
        const cached = cache.get(key);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }
        // Override res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = function (data) {
            cache.set(key, data, ttlSeconds);
            res.setHeader('X-Cache', 'MISS');
            return originalJson(data);
        };
        req.cache = cache;
        next();
    };
}
// Cache management endpoints
router.get('/stats', (req, res) => {
    res.json({
        size: cache.size(),
        keys: cache.keys().length,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});
router.get('/keys', (req, res) => {
    const keys = cache.keys().map(key => ({
        key,
        exists: cache.exists(key)
    }));
    res.json({ keys });
});
router.get('/get/:key', (req, res) => {
    const value = cache.get(req.params.key);
    if (value === null) {
        return res.status(404).json({ error: 'Key not found or expired' });
    }
    res.json({ key: req.params.key, value });
});
router.post('/set', (req, res) => {
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
router.delete('/delete/:key', (req, res) => {
    const deleted = cache.delete(req.params.key);
    if (deleted) {
        res.json({ success: true, message: 'Key deleted' });
    }
    else {
        res.status(404).json({ error: 'Key not found' });
    }
});
router.delete('/clear', (req, res) => {
    cache.clear();
    res.json({ success: true, message: 'Cache cleared' });
});
// Bulk operations
router.post('/mset', (req, res) => {
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
router.post('/mget', (req, res) => {
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
router.post('/warm', async (req, res) => {
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
        }
        catch (error) {
            results.push({ endpoint, success: false, error: error.message });
        }
    }
    res.json({
        success: true,
        message: `Cache warming completed for ${results.length} endpoints`,
        results
    });
});
exports.default = router;
//# sourceMappingURL=redis-cache.js.map