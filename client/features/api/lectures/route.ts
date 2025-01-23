import axios from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
}/lectures`;

export const createLecture = async (courseId: string, lectureData: any) => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/create/${courseId}`,
      lectureData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const getLectureById = async (lectureId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${lectureId}`);
    const lecture = await response.data;
    return lecture;
  } catch (error) {
    console.error("Error fetching lecture:", error);
  }
};

export const deleteLecture = async (lectureId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecture:", error);
  }
};

export const editLecture = async (
  lectureId: string,
  courseId: string,
  lectureData: any
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/edit/${courseId}/${lectureId}`,
      lectureData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating lecture:", error);
  }
};
