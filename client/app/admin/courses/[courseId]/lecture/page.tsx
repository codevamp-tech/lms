import React from "react";
import CreateLecture from "@/components/admin/lecture/CreateLecture";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";

const CreateLecturePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CreateLecture />
    </Hydrate>
  );
};

export default CreateLecturePage;
