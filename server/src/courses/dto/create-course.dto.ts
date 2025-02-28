import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  creatorId: string;

  @IsNotEmpty()
  companyId: string; // This will be passed from the frontend
}
