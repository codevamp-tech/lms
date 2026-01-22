import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/trainers`;

export interface TrainerData {
    name: string;
    email: string;
    phone?: string;
    expertise?: string;
    bio?: string;
    photoUrl?: string;
    experience?: string;
    studentsTaught?: string;
    rating?: number;
    isActive?: boolean;
    companyId?: string;
}

export interface Trainer extends TrainerData {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export const createTrainer = async (data: TrainerData): Promise<any> => {
    try {
        const response = await axios.post(API_BASE_URL, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to create trainer"
        );
    }
};

export const getTrainers = async (page = 1, limit = 10): Promise<any> => {
    if (typeof window === "undefined") {
        throw new Error("getTrainers must be called from the browser");
    }

    try {
        const companyId = localStorage.getItem("companyId") || "";
        const headers: Record<string, string> = {};
        if (companyId) {
            headers.Authorization = `Bearer ${companyId}`;
        }

        const { data } = await axios.get(API_BASE_URL, {
            params: { page, limit },
            headers,
        });
        return data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch trainers"
        );
    }
};

export const getTrainer = async (id: string): Promise<any> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/${id}`);
        return data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch trainer"
        );
    }
};

export const updateTrainer = async (
    id: string,
    data: Partial<TrainerData>
): Promise<any> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to update trainer"
        );
    }
};

export const deleteTrainer = async (id: string): Promise<any> => {
    try {
        const { data } = await axios.delete(`${API_BASE_URL}/${id}`);
        return data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to delete trainer"
        );
    }
};

export const toggleTrainerStatus = async (id: string): Promise<any> => {
    try {
        const { data } = await axios.patch(`${API_BASE_URL}/${id}/toggle-status`);
        return data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to toggle trainer status"
        );
    }
};
