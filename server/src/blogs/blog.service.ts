import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';

@Injectable()
export class BlogService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) { }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .concat('-', Date.now().toString());
    }

    async createBlog(createBlogDto: CreateBlogDto, thumbnail?: Express.Multer.File) {
        try {
            const { title, content, excerpt, category, tags, authorId } = createBlogDto;

            if (!title || !content) {
                throw new Error('Title and content are required.');
            }

            const slug = this.generateSlug(title);

            let thumbnailUrl: string | undefined;

            // Handle thumbnail upload if provided
            if (thumbnail) {
                try {
                    const uploaded = await uploadMedia(thumbnail.buffer, {
                        folder: 'blog_thumbnails',
                        resource_type: 'image',
                    });

                    if (uploaded && uploaded.secure_url) {
                        thumbnailUrl = uploaded.secure_url;
                    }
                } catch (uploadError) {
                    console.error('Thumbnail upload error:', uploadError);
                    // Continue without thumbnail if upload fails
                }
            }

            const blog = await this.blogModel.create({
                title,
                slug,
                content,
                excerpt,
                category,
                tags,
                author: authorId,
                thumbnail: thumbnailUrl,
            });

            return {
                blog,
                message: 'Blog created successfully.',
            };
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new InternalServerErrorException('Failed to create blog');
        }
    }

    async getAllBlogs(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const blogs = await this.blogModel
                .find()
                .populate({ path: 'author', select: 'name photoUrl' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalBlogs = await this.blogModel.countDocuments();

            return {
                blogs,
                totalPages: Math.ceil(totalBlogs / limit),
                currentPage: page,
                totalBlogs,
            };
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw new InternalServerErrorException('Failed to fetch blogs');
        }
    }

    async getBlogById(blogId: string): Promise<Blog> {
        const blog = await this.blogModel
            .findById(blogId)
            .populate({ path: 'author', select: 'name photoUrl' });

        if (!blog) {
            throw new NotFoundException('Blog not found!');
        }
        return blog;
    }

    async getBlogBySlug(slug: string): Promise<Blog> {
        const blog = await this.blogModel
            .findOne({ slug })
            .populate({ path: 'author', select: 'name photoUrl' });

        if (!blog) {
            throw new NotFoundException('Blog not found!');
        }
        return blog;
    }

    async updateBlog(
        blogId: string,
        updateBlogDto: UpdateBlogDto,
        thumbnail?: Express.Multer.File,
    ): Promise<Blog> {
        const blog = await this.blogModel.findById(blogId);
        if (!blog) {
            throw new NotFoundException('Blog not found!');
        }

        let blogThumbnail = blog.thumbnail;

        // Handle thumbnail upload
        if (thumbnail) {
            try {
                // Delete existing thumbnail if any
                if (blog.thumbnail) {
                    const publicId = blog.thumbnail.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await deleteMediaFromCloudinary(publicId);
                    }
                }

                // Upload buffer to Cloudinary
                const uploaded = await uploadMedia(thumbnail.buffer, {
                    folder: 'blog_thumbnails',
                    resource_type: 'image',
                });

                if (uploaded && uploaded.secure_url) {
                    blogThumbnail = uploaded.secure_url;
                } else {
                    throw new Error('Failed to upload thumbnail.');
                }
            } catch (error) {
                console.error('Thumbnail upload error:', error);
                throw new InternalServerErrorException(`Thumbnail upload failed: ${error.message}`);
            }
        }

        // Update slug if title changed
        let updateData: any = { ...updateBlogDto, thumbnail: blogThumbnail };
        if (updateBlogDto.title && updateBlogDto.title !== blog.title) {
            updateData.slug = this.generateSlug(updateBlogDto.title);
        }

        // Set publishedAt if publishing for the first time
        if (updateBlogDto.isPublished && !blog.isPublished) {
            updateData.publishedAt = new Date();
        }

        const updatedBlog = await this.blogModel.findByIdAndUpdate(
            blogId,
            updateData,
            { new: true },
        );

        if (!updatedBlog) {
            throw new NotFoundException('Failed to update blog.');
        }

        return updatedBlog;
    }

    async deleteBlog(blogId: string): Promise<{ message: string }> {
        try {
            const blog = await this.blogModel.findById(blogId);
            if (!blog) {
                throw new NotFoundException(`Blog with ID ${blogId} not found.`);
            }

            // Delete thumbnail from Cloudinary if exists
            if (blog.thumbnail) {
                const publicId = blog.thumbnail.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await deleteMediaFromCloudinary(publicId);
                }
            }

            await this.blogModel.findByIdAndDelete(blogId);

            return {
                message: 'Blog deleted successfully.',
            };
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw new InternalServerErrorException('Failed to delete blog.');
        }
    }

    async togglePublishStatus(
        blogId: string,
        isPublished: boolean,
    ): Promise<string> {
        const blog = await this.blogModel.findById(blogId);

        if (!blog) {
            throw new NotFoundException('Blog not found!');
        }

        blog.isPublished = isPublished;
        if (isPublished && !blog.publishedAt) {
            blog.publishedAt = new Date();
        }
        await blog.save();

        return isPublished ? 'Published' : 'Unpublished';
    }

    async getPublishedBlogs(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const blogs = await this.blogModel
                .find({ isPublished: true })
                .populate({ path: 'author', select: 'name photoUrl' })
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalBlogs = await this.blogModel.countDocuments({ isPublished: true });

            return {
                blogs,
                totalPages: Math.ceil(totalBlogs / limit),
                currentPage: page,
                totalBlogs,
            };
        } catch (error) {
            console.error('Error fetching published blogs:', error);
            throw new InternalServerErrorException('Failed to fetch published blogs');
        }
    }

    async getBlogsByAuthorId(
        authorId: string,
        page = 1,
        limit = 10,
        isPublished?: boolean,
    ) {
        const skip = (page - 1) * limit;

        const filter: any = { author: authorId };

        if (isPublished !== undefined) {
            filter.isPublished = isPublished;
        }

        try {
            const blogs = await this.blogModel
                .find(filter)
                .populate({ path: 'author', select: 'name photoUrl' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalBlogs = await this.blogModel.countDocuments(filter);

            return {
                blogs, // ✅ empty array is valid
                totalPages: Math.ceil(totalBlogs / limit),
                currentPage: page,
                totalBlogs,
            };
        } catch (error) {
            console.error('Error fetching blogs by author:', error);
            throw new InternalServerErrorException(
                'Failed to fetch blogs by author',
            );
        }
    }
}
