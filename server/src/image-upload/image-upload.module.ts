// image-upload.module.ts
import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  exports: [ImageUploadService], // If you need to use it elsewhere
})
export class ImageUploadModule {}
