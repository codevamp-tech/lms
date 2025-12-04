import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CourseData,
  createCourse,
  CreateCourseResponse,
  getCreatorCourses,
  getCourseById,
  editCourse,
  getCourseLectures,
  togglePublishCourse,
  getPublishedCourses,
  deleteCourse,
  togglePrivateCourse,
  getAnalyticsSummary,
} from "../features/api/courses/route";
import toast from "react-hot-toast";
import { useEffect } from "react";

const useCourses = () => {
  const queryClient = useQueryClient();

  // Mutation for creating a course
  const createCourseMutation = useMutation<
    CreateCourseResponse,
    Error,
    CourseData
  >({
    mutationFn: createCourse,
    onSuccess: () => {
      console.log("Course created successfully");
    },
    onError: (error) => {
      console.error("Error creating course:", error);
    },
  });

  // Mutation for editing a course
  const editCourseMutation = useMutation<
    any,
    Error,
    { courseId: string; updatedData: any; thumbnail?: File }
  >({
    mutationFn: ({ courseId, updatedData, thumbnail }) =>
      editCourse(courseId, updatedData, thumbnail),
    onSuccess: () => {
      console.log("Course updated successfully");
    },
    onError: (error) => {
      console.error("Error updating course:", error.message);
    },
  });

  // Mutation for publishing a course
  const publishCourseMutation = useMutation<
    any,
    Error,
    { courseId: string; publish: boolean }
  >({
    mutationFn: ({ courseId, publish }) =>
      togglePublishCourse(courseId, publish),
    onSuccess: () => {
      console.log("Course updated successfully");
    },
    onError: (error) => {
      console.error("Error updating course:", error.message);
    },
  });

  const privateCourseMutation = useMutation<
    any,
    Error,
    { courseId: string; privated: boolean }
  >({
    mutationFn: ({ courseId, privated }) =>
      togglePrivateCourse(courseId, privated),
    onSuccess: () => {
      console.log("Course updated successfully");
    },
    onError: (error) => {
      console.error("Error updating course:", error.message);
    },
  });

  // Query for fetching courses by userId
  const getCreatorCoursesQuery = (
    userId: string,
    page: number,
    limit: number = 7
  ) => {
    const query = useQuery({
      queryKey: ["creatorCourses", userId, page], // Add page as a dependency
      queryFn: () => getCreatorCourses(userId, page, limit),
      enabled: !!userId, // Runs only if userId is provided
      placeholderData: (previousData) => previousData, // Keeps previous data while fetching new page
      staleTime: 5000, // Prevents UI flicker when switching pages
      refetchOnWindowFocus: false, // Prevents refetching on window focus
    });

    useEffect(() => {
      if (query.data) {
        console.log("Courses fetched successfully:", query.data);
      }
    }, [query.data]);

    useEffect(() => {
      if (query.error) {
        console.error("Error fetching courses:", query.error);
      }
    }, [query.error]);

    return query;
  };

 const useAnalyticsSummary = () => {
  const query = useQuery({
    queryKey: ["courseAnalyticsSummary"],
    queryFn: getAnalyticsSummary,
    staleTime: 5000,
    refetchOnWindowFocus: false
  });

  return query;
};

  // Query for fetching a course by ID
  const getCourseByIdQuery = (courseId: string) => {
    const query = useQuery({
      queryKey: ["course", courseId],
      queryFn: () => getCourseById(courseId),
      enabled: !!courseId,
      staleTime: 5000, // Prevents UI flicker when switching pages
      refetchOnWindowFocus: false, // Prevents refetching on window focus
    });

    useEffect(() => {
      if (query.data) {
        console.log("Course fetched successfully:", query.data);
      }
    }, [query.data]);

    useEffect(() => {
      if (query.error) {
        console.error("Error fetching course by ID:", query.error);
      }
    }, [query.error]);

    return query;
  };

  // Query for fetching a lectures by course ID
  const getCourseLecturesQuery = (courseId: string) => {
    const query = useQuery({
      queryKey: ["lectures", courseId],
      queryFn: () => getCourseLectures(courseId),
      enabled: !!courseId,
    });

    useEffect(() => {
      if (query.error) {
        console.error("Error fetching lectures:", query.error);
      }
    }, [query.error]);

    return query;
  };

  // Query for fetching published courses
  const getPublishedCoursesQuery = (
    page: number,
    limit: number,
    companyId: string | null,
    options?: { enabled: boolean }
  ) => {
    const query = useQuery({
      queryKey: ["publishedCourses", page, companyId], // Pass page as part of query key
      queryFn: () => getPublishedCourses(page, limit, companyId),
      staleTime: 5000, // Prevents UI flicker when switching pages
      enabled: options?.enabled,
    });

    useEffect(() => {
      if (query.data) {
        console.log("Courses fetched successfully:", query.data);
      }
    }, [query.data]);

    useEffect(() => {
      if (query.error) {
        console.error("Error fetching courses:", query.error);
      }
    }, [query.error]);

    return query;
  };

  const deleteCourseMutation = useMutation({
    mutationFn: ({ courseId }: { courseId: string }) => deleteCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["courses"], // Fixed typo: `querykey` -> `queryKey`
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete course:", error);
    },
  });

  return {
    createNewCourse: createCourseMutation.mutate,
    editCourse: editCourseMutation.mutate,
    publishCourse: publishCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    privateCourse: privateCourseMutation.mutate,
    getCreatorCoursesQuery,
    useAnalyticsSummary,
    getCourseByIdQuery,
    getCourseLecturesQuery,
    getPublishedCoursesQuery,
    isLoading: createCourseMutation.isPending,
    error: createCourseMutation.error || editCourseMutation.error,
  };
};

export default useCourses;
