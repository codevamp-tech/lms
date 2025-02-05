import {
  getCourseProgress,
  markAsComplete,
  markAsInComplete,
  updateLectureProgress,
} from "@/features/api/course-progress/route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useCourseProgress = () => {
  const queryClient = useQueryClient();
  const getCourseProgressQuery = (courseId: string, userId: string) => {
    return useQuery({
      queryKey: ["course-progress", courseId],
      queryFn: () => getCourseProgress(courseId, userId),
      enabled: !!courseId,
      onSuccess: (data) => {},
      onError: (error) => {
        console.error("Error fetching course by ID:", error);
      },
    });
  };

  const updateLectureProgressMutation = useMutation({
    mutationFn: ({
      courseId,
      userId,
      lectureId,
    }: {
      courseId: string;
      userId: string;
      lectureId: string;
    }) => updateLectureProgress(courseId, userId, lectureId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress"], // Adjust query key as needed
      });
    },
    onError: (error) => {
      console.error("Error marking course as complete:", error);
    },
  });

  const markAsCompleteMutation = useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      markAsComplete(courseId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress"], // Adjust query key as needed
      });
    },
    onError: (error) => {
      console.error("Error marking course as complete:", error);
    },
  });

  const markAsInCompleteMutation = useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      markAsInComplete(courseId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress"],
      });
    },
    onError: (error) => {
      console.error("Error fetching course by ID:", error);
    },
  });

  return {
    markAsComplete: markAsCompleteMutation.mutate,
    markAsInComplete: markAsInCompleteMutation.mutate,
    updateLectureProgress: updateLectureProgressMutation.mutate,
    getCourseProgressQuery,
  };
};

export default useCourseProgress;
