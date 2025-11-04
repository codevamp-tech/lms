import axios from "axios";
import { setCookie } from "@/utils/helpers";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

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

/**
 * Fetch instructors with safe localStorage access (Next.js friendly).
 * @param page page number (default 1)
 * @param limit items per page (default 7)
 * @returns response data from the API
 */
export const getInstructor = async (page = 1, limit = 7): Promise<any> => {
  // localStorage isn't available on the server — fail fast or handle differently
  if (typeof window === "undefined") {
    throw new Error("getInstructor must be called from the browser (localStorage is not available on server).");
  }

  try {
    // read stored token/value safely
    const raw = localStorage.getItem("companyId");

    // try to parse if it looks like JSON, otherwise fallback to raw string
    let token: string | null = null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // if parsed is an object with token property, pick that (common pattern)
        if (typeof parsed === "string") token = parsed;
        else if (parsed && typeof parsed === "object" && "token" in parsed) token = String((parsed as any).token);
        else token = String(parsed);
      } catch {
        // not JSON — use raw value directly
        token = raw;
      }
    }

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/instructors`,
      {
        params: { page, limit },
        headers,
      }
    );

    return data;
  } catch (err: any) {
    // better error message extraction
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch instructors";
    throw new Error(message);
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
