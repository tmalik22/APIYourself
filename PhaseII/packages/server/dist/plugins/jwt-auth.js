"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const express_1 = require("express");
const crypto = __importStar(require("crypto"));
const router = (0, express_1.Router)();
// Simple JWT implementation (for demo - use jsonwebtoken in production)
class SimpleJWT {
    constructor(secret = 'demo-secret-change-in-production') {
        this.secret = secret;
    }
    sign(payload, expiresIn = '1h') {
        const header = { alg: 'HS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const exp = now + this.parseExpiry(expiresIn);
        const claims = { ...payload, iat: now, exp };
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
        const signature = crypto
            .createHmac('sha256', this.secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64url');
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    verify(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }
        const [header, payload, signature] = parts;
        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', this.secret)
            .update(`${header}.${payload}`)
            .digest('base64url');
        if (signature !== expectedSignature) {
            throw new Error('Invalid signature');
        }
        const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
        // Check expiration
        if (claims.exp && Date.now() / 1000 > claims.exp) {
            throw new Error('Token expired');
        }
        return claims;
    }
    parseExpiry(expiresIn) {
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match)
            return 3600; // default 1 hour
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 3600;
            case 'd': return value * 86400;
            default: return 3600;
        }
    }
}
const jwt = new SimpleJWT();
// In-memory user store (use database in production)
const users = new Map();
users.set('admin@example.com', {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // hash in production
    name: 'Admin User',
    role: 'admin'
});
// Authentication middleware
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    const user = users.get(email);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    });
    res.json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
});
// Register endpoint
router.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name required' });
    }
    if (users.has(email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const user = {
        id: Date.now().toString(),
        email,
        password, // hash in production
        name,
        role: 'user'
    };
    users.set(email, user);
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    });
    res.status(201).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
});
// Profile endpoint (protected)
router.get('/profile', requireAuth, (req, res) => {
    res.json({ user: req.user });
});
// Refresh token endpoint
router.post('/refresh', requireAuth, (req, res) => {
    const newToken = jwt.sign({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    });
    res.json({ success: true, token: newToken });
});
// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.default = router;
//# sourceMappingURL=jwt-auth.js.map