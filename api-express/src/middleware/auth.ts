import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthenticatedRequest } from '../types';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

const authMiddleware = (req: IAuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
      return;
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET n\'est pas défini');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

export default authMiddleware;
