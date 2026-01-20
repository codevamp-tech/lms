import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    NotFoundException,
    Patch,
    Delete,
    Query,
    Put,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @UseInterceptors(FileInterceptor('thumbnail'))
    async createBlog(
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() thumbnail?: Express.Multer.File,
    ) {
        try {
            const response = await this.blogService.createBlog(createBlogDto, thumbnail);
            return response;
        } catch (error) {
            return {
                message: 'Failed to create blog',
            };
        }
    }

    @Get()
    async getAllBlogs(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.blogService.getAllBlogs(Number(page), Number(limit));
    }

    @Get('published')
    async getPublishedBlogs(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.blogService.getPublishedBlogs(Number(page), Number(limit));
    }

    @Get(':blogId')
    async getBlogById(@Param('blogId') blogId: string): Promise<Blog> {
        try {
            const blog = await this.blogService.getBlogById(blogId);
            return blog;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Get('slug/:slug')
    async getBlogBySlug(@Param('slug') slug: string): Promise<Blog> {
        try {
            const blog = await this.blogService.getBlogBySlug(slug);
            return blog;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Patch(':blogId')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async updateBlog(
        @Param('blogId') blogId: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @UploadedFile() thumbnail: Express.Multer.File,
    ) {
        const blog = await this.blogService.updateBlog(
            blogId,
            updateBlogDto,
            thumbnail,
        );

        return {
            blog,
            message: 'Blog updated successfully.',
        };
    }

    @Delete(':blogId')
    async deleteBlog(
        @Param('blogId') blogId: string,
    ): Promise<{ message: string }> {
        return this.blogService.deleteBlog(blogId);
    }

    @Put(':blogId/toggle-publish')
    async togglePublishBlog(
        @Param('blogId') blogId: string,
        @Query('publish') publish: string,
    ) {
        const isPublished = publish === 'true';
        const statusMessage = await this.blogService.togglePublishStatus(
            blogId,
            isPublished,
        );

        return {
            message: `Blog is ${statusMessage}`,
        };
    }
}
