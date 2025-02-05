import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();
  // Add body parser middleware with TypeScript types
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/course-purchase/webhook') {
      next();
    } else {
      json()(req, res, next);
    }
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
