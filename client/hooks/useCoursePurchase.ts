import { getCoursedetailWithPurchaseStatus } from "@/features/api/course-purchase/route";
import { useQuery } from "@tanstack/react-query";

const useCoursePurchase = () =>{
    // Query for fetching a course by ID
  const getCourseDetailsWithPurchaseStatusQuery = (courseId: string, userId: string) => {
    return useQuery({
      queryKey: ["course-details", courseId],
      queryFn: () => getCoursedetailWithPurchaseStatus(courseId, userId),
      enabled: !!courseId,
      onSuccess: (data) => {
        console.log("Course fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching course by ID:", error);
      },
    });
  };

  return {
    getCourseDetailsWithPurchaseStatusQuery,
  }

}

export default useCoursePurchase;