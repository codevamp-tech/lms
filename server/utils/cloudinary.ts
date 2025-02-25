import { v2 as cloudinary } from 'cloudinary'; // Using the v2 version of cloudinary
import * as dotenv from 'dotenv';
import * as stream from 'stream';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { existsSync, unlinkSync } from 'fs';

dotenv.config(); // Load environment variables from .env file

// Configuring Cloudinary with environment variables
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

// Upload media to Cloudinary (Buffer or file path)
export const uploadMedia = async (
  file: Buffer | string,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> => {
  try {
    // If the file is a Buffer, use upload_stream (for large files or direct streams)
    if (file instanceof Buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'uploads', // Folder name in Cloudinary
            resource_type: options.resource_type || 'auto', // Auto-detect the resource type (image, video, etc.)
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('No upload result'));
          },
        );

        // Create a readable stream from the buffer and pipe it to Cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file);
        bufferStream.pipe(uploadStream);
      });
    }

    // If file is a string (i.e., file path), use Cloudinary's upload method
    const uploadResponse = await cloudinary.uploader.upload(file as string, {
      ...options,
      resource_type: options.resource_type || 'auto',
      folder: options.folder || 'uploads',
    });
    return uploadResponse;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Cloudinary upload failed');
  }
};

// Utility for uploading videos to Cloudinary (specific to video files)
export const uploadVideoToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'lecture_videos',
      resource_type: 'video',
    });

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    return result; // Return the Cloudinary result (e.g., file URL)
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    throw new Error('Cloudinary upload failed');
  }
};

// Utility for deleting media from Cloudinary by public ID
export const deleteMediaFromCloudinary = async (
  publicId: string,
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId); // Delete media by public ID
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Cloudinary delete failed');
  }
};

// Utility for deleting videos from Cloudinary by public ID
export const deleteVideoFromCloudinary = async (
  publicId: string,
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' }); // Specify resource type as video
  } catch (error) {
    console.error('Cloudinary video delete error:', error);
    throw new Error('Cloudinary video delete failed');
  }
};

export async function uploadImageToCloudinary(filePath: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
  });
}
