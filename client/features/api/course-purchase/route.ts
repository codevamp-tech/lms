import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/course-purchase`;

export const getCoursedetailWithPurchaseStatus = async (courseId: string, userId: string) => {
  console.log("Fetching course details for:", API_BASE_URL);
    try {
      const {data} = await axios.get(`${API_BASE_URL}/${courseId}`, {
        params: { userId }
      });
      return data;
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

export const createRazorpayOrder = async(courseId: string, userId: string) => {
  try {
    const {data} = await axios.post(`${API_BASE_URL}/${userId}/${courseId}/create-razorpay-order`);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

export const verifyPayment = async(paymentDetails: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) => {
  try {
    const {data} = await axios.post(`${API_BASE_URL}/verify-payment`, paymentDetails);
    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
  }
}

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
