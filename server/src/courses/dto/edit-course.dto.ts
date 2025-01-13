import { IsOptional, IsString, IsNumber } from 'class-validator';

export class EditCourseDto {
  @IsString()
  courseTitle: string;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  courseLevel?: string;

  @IsOptional()
  @IsNumber()
  coursePrice?: number;
}
