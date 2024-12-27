import axios from "axios";
import { setCookie } from "@/utils/helpers";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/users`;

export const loginUser = async (loginInput: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, loginInput, {
      headers: { "Content-Type": "application/json" },
    });
    setCookie("token", data.token);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
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

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/${userId}/profile`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
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
