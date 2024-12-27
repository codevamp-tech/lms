import React from "react";
import EditCourse from "@/components/admin/course/EditCourse";
import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@/lib/hydrate";

const EditCoursePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <EditCourse />
    </Hydrate>
  );
};

export default EditCoursePage;
