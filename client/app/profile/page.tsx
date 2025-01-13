import React from "react";
import Profile from "@/components/student/Profile";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";

const ProfilePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Profile />
    </Hydrate>
  );
};

export default ProfilePage;
