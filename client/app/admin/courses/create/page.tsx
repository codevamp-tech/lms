import React from "react";
import AddCourse from "@/components/admin/course/AddCourse";
import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@/lib/hydrate";

const CreateCoursePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <AddCourse />
    </Hydrate>
  );
};

export default CreateCoursePage;
