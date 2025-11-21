import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLiveSessionDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly instructor: string; // Will be instructor's ID

    @IsDate()
    @Type(() => Date)
    readonly date: Date;

    @IsString()
    @IsNotEmpty()
    readonly companyId: string;

    @IsNumber()
    readonly duration: number;

    @IsNumber()
    readonly price: number;
}
