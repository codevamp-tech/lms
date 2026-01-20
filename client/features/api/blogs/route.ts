import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/blogs`;

export interface BlogData {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    authorId: string;
}

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    thumbnail?: string;
    author: {
        _id: string;
        name: string;
        photoUrl?: string;
    };
    category?: string;
    tags?: string[];
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogsResponse {
    blogs: Blog[];
    totalPages: number;
    currentPage: number;
    totalBlogs: number;
}

export const createBlog = async (blogData: BlogData, thumbnail?: File) => {
    try {
        const formData = new FormData();

        formData.append("title", blogData.title);
        formData.append("content", blogData.content);
        formData.append("authorId", blogData.authorId);

        if (blogData.excerpt) {
            formData.append("excerpt", blogData.excerpt);
        }
        if (blogData.category) {
            formData.append("category", blogData.category);
        }
        if (blogData.tags && blogData.tags.length > 0) {
            formData.append("tags", JSON.stringify(blogData.tags));
        }
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const { data } = await axios.post(`${API_BASE_URL}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create blog");
    }
};

export const getBlogs = async (page = 1, limit = 10): Promise<BlogsResponse> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}`, {
            params: { page, limit },
        });
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
};

export const getPublishedBlogs = async (page = 1, limit = 10): Promise<BlogsResponse> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/published`, {
            params: { page, limit },
        });
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch published blogs");
    }
};

export const getBlogById = async (blogId: string): Promise<Blog> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/${blogId}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch blog");
    }
};

export const getBlogBySlug = async (slug: string): Promise<Blog> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/slug/${slug}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch blog");
    }
};

export const updateBlog = async (
    blogId: string,
    updatedData: Partial<BlogData>,
    thumbnail?: File
) => {
    try {
        const formData = new FormData();

        Object.keys(updatedData).forEach((key) => {
            const value = updatedData[key as keyof typeof updatedData];
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const { data } = await axios.patch(`${API_BASE_URL}/${blogId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update blog");
    }
};

export const deleteBlog = async (blogId: string) => {
    try {
        const { data } = await axios.delete(`${API_BASE_URL}/${blogId}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete blog");
    }
};

export const togglePublishBlog = async (
    blogId: string,
    publish: boolean
): Promise<string> => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${blogId}/toggle-publish`,
            null,
            {
                params: { publish: publish.toString() },
            }
        );
        return response.data.message;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to toggle publish status"
        );
    }
};
