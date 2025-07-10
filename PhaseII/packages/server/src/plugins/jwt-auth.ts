import { Router, Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

const router = Router();

// Simple JWT implementation (for demo - use jsonwebtoken in production)
class SimpleJWT {
  private secret: string;
  
  constructor(secret: string = 'demo-secret-change-in-production') {
    this.secret = secret;
  }
  
  sign(payload: any, expiresIn: string = '1h'): string {
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
  
  verify(token: string): any {
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
  
  private parseExpiry(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // default 1 hour
    
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
const users = new Map<string, any>();
users.set('admin@example.com', {
  id: '1',
  email: 'admin@example.com',
  password: 'admin123', // hash in production
  name: 'Admin User',
  role: 'admin'
});

// Authentication middleware
function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Login endpoint
router.post('/login', (req: Request, res: Response) => {
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
router.post('/register', (req: Request, res: Response) => {
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
router.get('/profile', requireAuth, (req: Request & { user?: any }, res: Response) => {
  res.json({ user: req.user });
});

// Refresh token endpoint
router.post('/refresh', requireAuth, (req: Request & { user?: any }, res: Response) => {
  const newToken = jwt.sign({ 
    id: req.user.id, 
    email: req.user.email, 
    name: req.user.name, 
    role: req.user.role 
  });
  
  res.json({ success: true, token: newToken });
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
export { requireAuth };
