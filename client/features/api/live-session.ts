import { axiosInstance } from "@/lib/axios";

export interface LiveSessionData {
    _id?: string;
    title: string;
    description?: string;
    date: Date;
    duration: number;
    price: number;
    instructor: string;
    companyId: string;
    meetLink?: string;
    enrolledUsers?: string[];
    imageUrl?: string;
}

export const createLiveSession = async (sessionData: LiveSessionData): Promise<LiveSessionData> => {
    const response = await axiosInstance.post("/live-session", sessionData);
    return response.data;
};

export const getLiveSessions = async (): Promise<LiveSessionData[]> => {
    const response = await axiosInstance.get("/live-session");
    return response.data;
};

export const getLiveSessionById = async (sessionId: string): Promise<LiveSessionData> => {
    const response = await axiosInstance.get(`/live-session/${sessionId}`);
    return response.data;
};

export const updateLiveSession = async (sessionId: string, updatedData: Partial<LiveSessionData>): Promise<LiveSessionData> => {
    const response = await axiosInstance.put(`/live-session/${sessionId}`, updatedData);
    return response.data;
};

export const deleteLiveSession = async (sessionId: string): Promise<void> => {
    await axiosInstance.delete(`/live-session/${sessionId}`);
};

export const enrollLiveSession = async (sessionId: string, studentId: string): Promise<LiveSessionData> => {
    const response = await axiosInstance.post(`/live-session/${sessionId}/enroll`, { studentId });
    return response.data;
};
