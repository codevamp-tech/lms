import React from "react";
import CourseProgress from "@/components/student/CourseProgress";
import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "@/lib/hydrate";

const CourseProgressPage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CourseProgress />
      </Hydrate>
  );
};

export default CourseProgressPage;
