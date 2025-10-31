import Course from "@/components/Course";
import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
}/courses`;

export interface CourseData {
  courseTitle: string;
  category: string;
  creatorId: string;
}

export interface CreateCourseResponse {
  course: {
    courseTitle: string;
    category: string;
    creator: string;
  };
  message: string;
}

export const createCourse = async (courseData: CourseData) => {
  // const companyId = localStorage.getItem("companyId");
  const companyId = "";
  try {
    const { data } = await axios.post(`${API_BASE_URL}`, courseData, {
      headers: {
        Authorization: `Bearer ${companyId}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const getCreatorCourses = async (
  userId: string,
  page: number = 1,
  limit: number = 7
) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/get-creator-courses`, {
      userId,
      page,
      limit,
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch courses");
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}`);
    const course = response.data;
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const editCourse = async (
  courseId: string,
  updatedData: any,
  thumbnail?: File
) => {
  try {
    const formData = new FormData();

    // Append JSON data
    Object.keys(updatedData).forEach((key) => {
      formData.append(key, updatedData[key]);
    });

    // Append thumbnail if it exists
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // Make the request
    const { data } = await axios.patch(
      `${API_BASE_URL}/${courseId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating Failed");
  }
};

export const getCourseLectures = async (courseId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}/lectures`);
    const lecture = response.data;
    return lecture;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const togglePublishCourse = async (
  courseId: string,
  publish: boolean
): Promise<string> => {
  // const companyId = localStorage.getItem("companyId");
  const companyId = "";
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${courseId}/toggle-publish`,
      null,
      {
        headers: {
          Authorization: `Bearer ${companyId}`, // Send companyId in Authorization header
        },
        params: { publish: publish?.toString() },
      }
    );

    return response.data.message;
  } catch (error: any) {
    console.error(
      "Error toggling course publish status:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to toggle publish status"
    );
  }
};

export const togglePrivateCourse = async (
  courseId: string,
  privated: boolean
): Promise<string> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${courseId}/toggle-private`,
      null,
      {
        params: { privated: privated?.toString() },
      }
    );

    return response.data.message;
  } catch (error: any) {
    console.error(
      "Error toggling course private status:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to toggle private status"
    );
  }
};

export const getPublishedCourses = async (
  page = 1,
  limit = 8,
  companyId: string | null
) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/published/all`, {
      params: { companyId, page, limit },
    });
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}/${courseId}`, {
      headers: { "Content-Type": "application/json" },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting Failed");
  }
};
