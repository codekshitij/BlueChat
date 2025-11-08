import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: string; username: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user as { userId: string; username: string };
    console.log('Auth middleware - User from token:', req.user);
    next();
  });
}
