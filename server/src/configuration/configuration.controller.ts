import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { uploadImageToCloudinary } from 'utils/cloudinary'; // Adjust the import path as needed

@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configService: ConfigurationService) {}

  // Create Configuration Endpoint
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Temporary folder for storing uploads
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  async createConfiguration(
    @UploadedFile() file: Express.Multer.File,
    @Body() createConfigurationDto: CreateConfigurationDto,
  ) {
    console.log('DTO Data:', createConfigurationDto);

    if (file) {
      try {
        // Upload the image to Cloudinary using the file path directly from the utility function
        const uploadResult = (await uploadImageToCloudinary(file.path)) as {
          secure_url: string;
        };
        // Save the Cloudinary secure URL into the DTO
        createConfigurationDto.image = uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return this.configService.create(createConfigurationDto);
  }

  @Get()
  async findAll() {
    return this.configService.findAll();
  }

  @Get('company/:companyId')
  async findByCompanyId(@Param('companyId') companyId: string) {
    return this.configService.findByCompanyId(companyId);
  }

  // Update Configuration Endpoint
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateConfigDto: UpdateConfigurationDto,
  ) {
    if (file) {
      try {
        // Upload the image to Cloudinary and update the DTO with the secure URL
        const uploadResult = (await uploadImageToCloudinary(file.path)) as {
          secure_url: string;
        };
        updateConfigDto.image = uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return this.configService.update(id, updateConfigDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.configService.delete(id);
  }
}
