import { Injectable } from '@nestjs/common';
import { uploadVideoToCloudinary } from 'utils/cloudinary';

@Injectable()
export class VideoUploadService {

    async uploadToCloudinary(filePath: string) {
        try {
          const result = await uploadVideoToCloudinary(filePath); // Use the utility
          return result; // Return the Cloudinary result
        } catch (error) {
          throw new Error('Cloudinary upload failed');
        }
      }
}
