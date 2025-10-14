import { fetchUserProfile } from "@/features/api/users/route";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    select: (data) => data.user,
  });
};
