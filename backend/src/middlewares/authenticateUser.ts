import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithID } from '../index';

export const authenticateUser = (req: RequestWithID, res: Response, next: NextFunction) => {
  let token = undefined;
  if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1];
  }
  if (!token) {
    console.log('no token');
    return res.status(401).json({ message: 'Authentication token not found' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userID = Object(decoded).userID;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
