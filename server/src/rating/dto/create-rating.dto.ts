import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
} from "class-validator";

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;   // frontend sends this → required

  @IsString()
  @IsOptional()
  courseId: string; // controller injects

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
