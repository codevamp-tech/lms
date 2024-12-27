import React from "react";
import EditLecture from "@/components/admin/lecture/EditLecture";
import { Hydrate } from "@/lib/hydrate";
import { getQueryClient } from "@/lib/react-query";
import { dehydrate } from "@tanstack/react-query";

const EditLecturePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <EditLecture />
    </Hydrate>
  );
};

export default EditLecturePage;
