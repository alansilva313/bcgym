import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_gym_key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
