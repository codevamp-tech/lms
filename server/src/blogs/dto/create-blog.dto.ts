import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    excerpt?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value.split(',').map((tag: string) => tag.trim());
            }
        }
        return value;
    })
    tags?: string[];

    @IsString()
    @IsNotEmpty()
    authorId: string;
}
