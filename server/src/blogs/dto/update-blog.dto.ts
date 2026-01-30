import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBlogDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

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

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    isPublished?: boolean;
}
