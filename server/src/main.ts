// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, NextFunction, Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Keep bodyParser disabled so file uploads (multer) work and webhook can be bypassed
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    rawBody: true,
  });

  app.enableCors();

  // Global validation + transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that do not have any decorators
      // For multipart/form-data it's safer to NOT forbid non-whitelisted properties
      forbidNonWhitelisted: false,
      transform: true, // <-- enable conversion to DTO types
      transformOptions: {
        // enable implicit conversion of simple primitives (e.g. "123" -> 123)
        enableImplicitConversion: true,
      },
    }),
  );

  // Use express json() for all routes except a raw webhook route
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Keep exact path check you had — adjust if your webhook path differs
    if (req.originalUrl === '/course-purchase/webhook') {
      next();
    } else {
      json()(req, res, next);
    }
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
