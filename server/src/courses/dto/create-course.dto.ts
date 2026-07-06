import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsString()
  creatorId: string;

  @IsOptional()
  @IsString()
  companyId?: string; // This will be passed from the frontend
}
