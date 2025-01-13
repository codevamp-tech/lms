import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideoUploadService } from './video-upload.service';

@Controller('video-upload')
export class VideoUploadController {
  constructor(private readonly videoUploadService: VideoUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Multer configuration (e.g., where the file is saved temporarily)
      storage: diskStorage({
        destination: './uploads', // Local storage before uploading to Cloudinary
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      // Pass the file path to the service for uploading to Cloudinary
      const result = await this.videoUploadService.uploadToCloudinary(
        file.path,
      );
      return {
        success: true,
        message: 'File uploaded successfully.',
        data: result, // Return the Cloudinary result (e.g., URL)
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error uploading file');
    }
  }
}
