import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://lms-v4tz.onrender.com";

export const imageUpload = async (file) => {
  const formData = new FormData();
  // Append with key "image" to match FileInterceptor('image')
  formData.append("image", file);

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/images/upload`,
      formData,
      {
        // **Do not manually set Content-Type header here.**
        // Axios will automatically set the correct Content-Type with boundaries.
      }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Uploading Failed");
  }
};
