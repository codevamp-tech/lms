import React from "react";
import CourseTable from "@/components/admin/course/CourseTable";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";

const AdminCoursePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CourseTable />
    </Hydrate>
  );
};

export default AdminCoursePage;
