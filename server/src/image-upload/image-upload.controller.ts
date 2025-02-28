// image-upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageUploadService } from './image-upload.service';

@Controller('images')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    try {
      // This is where the error occurs if imageUploadService is undefined.
      const uploadResult = await this.imageUploadService.uploadImage(file.path);
      return uploadResult;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new HttpException(
        'Image upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
