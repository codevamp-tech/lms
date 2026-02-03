// src/courses/dto/edit-course.dto.ts
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_3_month_validity?: boolean;

  @IsOptional()
  @Type(() => Date)
  courseExpiryDate?: Date;
}
