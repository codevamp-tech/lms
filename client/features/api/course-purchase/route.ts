import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/course-purchase`;

export const getCoursedetailWithPurchaseStatus = async (courseId: string, userId?: string) => {
  console.log("Fetching course details for:", API_BASE_URL);
  try {
    const params = userId ? { userId } : {};
    const { data } = await axios.get(`${API_BASE_URL}/${courseId}`, {
      params,
    });
    // Normalize `purchased` based on any purchase record status returned from server.
    // Some backends may return a `coursePurchase` object with a `status` field
    // (eg. 'pending', 'paid', 'failed'). Only treat as purchased when status
    // clearly indicates success.
    let purchasedFlag = !!data?.purchased;
    const status = data?.coursePurchase?.status;
    if (status && typeof status === 'string') {
      const s = status.toLowerCase();
      purchasedFlag = s === 'paid' || s === 'success' || s === 'completed';
    }

    return { ...data, purchased: purchasedFlag };
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const createRazorpayOrder = async (courseId: string) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/${courseId}/create-razorpay-order`);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

export const verifyPayment = async (paymentDetails: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;        // ✅ ADD THIS
  courseId: string;      // ✅ ADD THIS
}) => {
  try {
    console.log("🔍 Verifying payment with details:", paymentDetails);

    const { data } = await axios.post(`${API_BASE_URL}/verify-payment`, paymentDetails);

    console.log("✅ Payment verification response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    throw error; // ✅ Throw error instead of just logging
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

export const enrollIdCourse = async ({ courseId, userId }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/enroll-student`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, userId }),
    }
  );

  return res.json();
};

