import {
  createLecture,
  deleteLecture,
  editLecture,
  getLectureById,
} from "@/features/api/lectures/route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useLectures = () => {
  const queryClient = useQueryClient();

  // Mutation for creating a lecture
  const createLectureMutation = useMutation<
    any,
    Error,
    {
      courseId: string;
      lectureData: {
        lectureTitle?: string;
        videoInfo?: { videoUrl?: string; publicId?: string };
        isPreviewFree?: boolean;
      };
    }
  >({
    mutationFn: ({ courseId, lectureData }) =>
      createLecture(courseId, lectureData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lectures", variables.courseId],
      });
    },
    onError: (error) => {
      console.error("Error updating course:", error);
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: (lectureId: string) => deleteLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lectures"],
      });
    },
    onError: (error) => {
      console.error("Error deleting lecture:", error.message);
    },
  });

  // Mutation for editing a lecture
  const editLectureMutation = useMutation<
    any,
    Error,
    {
      courseId: string;
      lectureId: string;
      lectureData: {
        lectureTitle?: string;
        videoInfo?: { videoUrl?: string; publicId?: string };
        isPreviewFree?: boolean;
      };
    }
  >({
    mutationFn: ({ courseId, lectureId, lectureData }) =>
      editLecture(lectureId, courseId, lectureData),
    onSuccess: () => {
      console.log("Lecture updated successfully");
    },
    onError: (error) => {
      console.error("Error updating lecture:", error.message);
    },
  });

  // Query for fetching a lecture by ID
  const getLectureByIdQuery = (lectureId: string) => {
    return useQuery({
      queryKey: ["lecture", lectureId],
      queryFn: () => getLectureById(lectureId),
      enabled: !!lectureId,
      onSuccess: (data) => {
        console.log("Course fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching course by ID:", error);
      },
    });
  };

  return {
    createLecture: createLectureMutation.mutateAsync,
    deleteLecture: deleteLectureMutation.mutate,
    editLecture: editLectureMutation.mutate,
    getLectureByIdQuery,
  };
};

export default useLectures;
