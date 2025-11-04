import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/course-progress`;

export const getCourseProgress = async (courseId: string, userId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/${courseId}/${userId}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const updateLectureProgress = async (
  courseId: string,
  userId: string,
  lectureId: string
) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/${courseId}/${userId}/${lectureId}/view`
    );
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const markAsComplete = async (courseId: string, userId: string) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/${courseId}/${userId}/complete`
    );
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const markAsInComplete = async (courseId: string, userId: string) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/${courseId}/${userId}/incomplete`
    );
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};
