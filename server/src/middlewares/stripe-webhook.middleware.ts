// src/middlewares/stripe-webhook.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';

@Injectable()
export class StripeWebhookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/course-purchase/webhook') {
      express.raw({ type: 'application/json' })(req, res, next);
    } else {
      next();
    }
  }
}