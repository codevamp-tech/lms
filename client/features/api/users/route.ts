import axios from "axios";
import { setCookie } from "@/utils/helpers";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL ?? "https://lms-v4tz.onrender.com"
}/users`;

export const loginUser = async (loginInput: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, loginInput, {
      headers: { "Content-Type": "application/json" },
    });
    setCookie("token", data.token); // Save the JWT token
    return data;
  } catch (error: any) {
    // Check if error response exists
    if (error.response) {
      console.error("Login API Error:", error.response);
      // Handle specific error cases
      if (error.response.status === 500) {
        throw new Error(
          "An internal server error occurred. Please try again later."
        );
      } else {
        throw new Error(
          error.response.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } else {
      // Handle network or other errors
      console.error("Login API Error:", error.message);
      throw new Error(
        "An error occurred while connecting to the server. Please try again later."
      );
    }
  }
};

export const signupUser = async (signupInput: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/signup`, signupInput, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const fetchUserProfile = async (userId: string | null) => {
  if (!userId) {
    return null; // or an empty object {} depending on your preference
  }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/${userId}/profile`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const getInstructor = async (page = 1, limit = 7) => {
  try {
    const companyId = localStorage.getItem("companyId");

    const { data } = await axios.get(
      `${API_BASE_URL}/instructors?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${companyId}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructors"
    );
  }
};

export const updateUserProfile = async (
  userId: string,
  name: string,
  profilePhoto: File
) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    const { data } = await axios.patch(
      `${API_BASE_URL}/${userId}/update`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
};
