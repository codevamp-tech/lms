import React from "react";
import Profile from "@/components/student/Profile";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";
import ProtectedRoutes from "@/components/ProtectedRoutes";

const ProfilePage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <ProtectedRoutes>
      <Hydrate state={dehydratedState}>
        <Profile />
      </Hydrate>
    </ProtectedRoutes>
  );
};

export default ProfilePage;
