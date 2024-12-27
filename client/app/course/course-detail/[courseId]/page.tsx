import React from "react";
import CourseDetail from "@/components/student/CourseDetail";
import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@/lib/hydrate";

const CourseDetailsPage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CourseDetail />
    </Hydrate>
  );
};

export default CourseDetailsPage;
