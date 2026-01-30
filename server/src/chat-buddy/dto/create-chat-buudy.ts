import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatBuddyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
