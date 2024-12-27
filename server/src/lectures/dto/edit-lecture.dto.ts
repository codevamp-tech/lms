import { IsBoolean, IsOptional, IsString, IsObject, IsNotEmpty } from 'class-validator';

export class EditLectureDto {
  @IsString()
  @IsNotEmpty()
  lectureTitle?: string;

  @IsOptional()
  @IsObject()
  videoInfo?: {
    videoUrl?: string;
    publicId?: string;
  };

  @IsOptional()
  @IsBoolean()
  isPreviewFree?: boolean;
}
