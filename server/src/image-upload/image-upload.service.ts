// image-upload.service.ts
import { Injectable } from '@nestjs/common';
import { uploadImageToCloudinary } from 'utils/cloudinary'; // Adjust path as needed
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ImageUploadService {
  async uploadImage(filePath: string) {
    try {
      const result = await uploadImageToCloudinary(filePath);

      // Delete local file after successful Cloudinary upload
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      return result;
    } catch (error) {
      console.error('Error in ImageUploadService:', error);
      throw new Error('Cloudinary image upload failed');
    }
  }
}
