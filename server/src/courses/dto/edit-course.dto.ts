// src/courses/dto/edit-course.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

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

  // Change to number and transform
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'coursePrice must be a number' })
  coursePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'courseMRP must be a number' })
  courseMRP?: number;

  @IsOptional()
  companyId?: string;
}
