import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/course-purchase`;

export const getCoursedetailWithPurchaseStatus = async (courseId: string, userId: string) => {
    try {
      const {data} = await axios.get(`${API_BASE_URL}/${courseId}`, {
        params: { userId }
      });
      return data;
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

export const createCheckout = async(courseId: string, userId: string) => {
  try {
    const {data} = await axios.post(`${API_BASE_URL}/${userId}/${courseId}/create-checkout-session`);
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const fetchPurchasedCourses = async (userId: string) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/purchased-courses/${userId}`,
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch purchased courses',
    );
  }
};
