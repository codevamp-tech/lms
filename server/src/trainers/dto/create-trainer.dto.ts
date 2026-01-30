import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateTrainerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    expertise?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    studentsTaught?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    companyId?: string;
}
