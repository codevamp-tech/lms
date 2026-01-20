import React from "react";
import BlogTable from "@/components/admin/blog/BlogTable";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";

const AdminBlogsPage = () => {
    const queryClient = getQueryClient();
    const dehydratedState = dehydrate(queryClient);

    return (
        <Hydrate state={dehydratedState}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Blog Management</h1>
                <BlogTable />
            </div>
        </Hydrate>
    );
};

export default AdminBlogsPage;
