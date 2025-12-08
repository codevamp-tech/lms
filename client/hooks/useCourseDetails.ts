import { useQuery } from '@tanstack/react-query';
import { getCoursedetailWithPurchaseStatus } from '@/features/api/course-purchase/route';

export const useCourseDetails = (courseId: string, userId?: string) => {
  return useQuery({
    queryKey: ['courseDetails', courseId, userId],
    queryFn: () => getCoursedetailWithPurchaseStatus(courseId, userId),
    enabled: !!courseId,
    refetchOnWindowFocus: true,

  });
};
