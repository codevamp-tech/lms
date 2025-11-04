import { useQuery } from "@tanstack/react-query";
import { fetchPurchasedCourses } from "@/features/api/course-purchase/route";

export const usePurchasedCourses = (userId: string) => {
  return useQuery({
    queryKey: ["purchasedCourses", userId],
    queryFn: () => fetchPurchasedCourses(userId),
    enabled: !!userId,
    select: (data) => data.courses,
  });
};