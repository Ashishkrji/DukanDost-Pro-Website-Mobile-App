import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      ownerId?: string;
      role?: string;
      shopId?: string;
    }
  }
}
