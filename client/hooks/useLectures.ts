import {
  createLecture,
  deleteLecture,
  editLecture,
  getLectureById,
} from "@/features/api/lectures/route";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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
        companyId: string;
      };
    }
  >({
    mutationFn: ({ courseId, lectureData }) =>
      createLecture(courseId, lectureData, lectureData.companyId),
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
    const query = useQuery({
      queryKey: ["lecture", lectureId],
      queryFn: () => getLectureById(lectureId),
      enabled: !!lectureId,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (query.data) {
        console.log("Lecture fetched successfully:", query.data);
      }
    }, [query.data]);

    useEffect(() => {
      if (query.error) {
        console.error("Error fetching lecture by ID:", query.error);
      }
    }, [query.error]);

    return query;
  };

  return {
    createLecture: createLectureMutation.mutateAsync,
    deleteLecture: deleteLectureMutation.mutate,
    editLecture: editLectureMutation.mutate,
    getLectureByIdQuery,
  };
};

export default useLectures;
