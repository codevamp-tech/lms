import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBlogs,
    getPublishedBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    togglePublishBlog,
    BlogData,
} from "@/features/api/blogs/route";

export const useBlogs = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["blogs", page, limit],
        queryFn: () => getBlogs(page, limit),
    });
};

export const usePublishedBlogs = (page = 1, limit = 50) => {
    return useQuery({
        queryKey: ["publishedBlogs", page, limit],
        queryFn: () => getPublishedBlogs(page, limit),
    });
};

export const useBlogById = (blogId: string) => {
    return useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => getBlogById(blogId),
        enabled: !!blogId,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogData, thumbnail }: { blogData: BlogData; thumbnail?: File }) =>
            createBlog(blogData, thumbnail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            blogId,
            data,
            thumbnail,
        }: {
            blogId: string;
            data: Partial<BlogData>;
            thumbnail?: File;
        }) => updateBlog(blogId, data, thumbnail),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog", variables.blogId] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (blogId: string) => deleteBlog(blogId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

export const useTogglePublishBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ blogId, publish }: { blogId: string; publish: boolean }) =>
            togglePublishBlog(blogId, publish),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog", variables.blogId] });
        },
    });
};

export default function useBlogHooks() {
    return {
        getBlogsQuery: useBlogs,
        getBlogByIdQuery: useBlogById,
        createBlogMutation: useCreateBlog,
        updateBlogMutation: useUpdateBlog,
        deleteBlogMutation: useDeleteBlog,
        togglePublishMutation: useTogglePublishBlog,
    };
}
