import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const videoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  try {
    const { data } = await axios.post(`${API_BASE_URL}/video-upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Uploading Failed");
  }
};
