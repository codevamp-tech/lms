import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    LiveSessionData,
    createLiveSession,
    getLiveSessions,
    getLiveSessionById,
    updateLiveSession,
    deleteLiveSession,
    enrollLiveSession,
} from "../features/api/live-session";
import toast from "react-hot-toast";

const useLiveSessions = () => {
    const queryClient = useQueryClient();

    const getLiveSessionsQuery = () => {
        return useQuery({
            queryKey: ["liveSessions"],
            queryFn: getLiveSessions,
        });
    };

    const getLiveSessionByIdQuery = (sessionId: string) => {
        return useQuery({
            queryKey: ["liveSession", sessionId],
            queryFn: () => getLiveSessionById(sessionId),
            enabled: !!sessionId,
        });
    };

    const createLiveSessionMutation = useMutation({
        mutationFn: createLiveSession,
        onSuccess: () => {
            toast.success("Live session created successfully");
            queryClient.invalidateQueries({ queryKey: ["liveSessions"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create live session");
        },
    });

    const updateLiveSessionMutation = useMutation({
        mutationFn: ({ sessionId, updatedData }: { sessionId: string; updatedData: Partial<LiveSessionData> }) =>
            updateLiveSession(sessionId, updatedData),
        onSuccess: (data) => {
            toast.success("Live session updated successfully");
            queryClient.setQueryData(["liveSessions"], (oldData: LiveSessionData[] | undefined) => {
                if (!oldData) return [];
                return oldData.map(session => session._id === data._id ? data : session);
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update live session");
        },
    });

    const deleteLiveSessionMutation = useMutation({
        mutationFn: deleteLiveSession,
        onSuccess: () => {
            toast.success("Live session deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["liveSessions"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete live session");
        },
    });

    const enrollLiveSessionMutation = useMutation({
        mutationFn: ({ sessionId, studentId }: { sessionId: string; studentId: string }) =>
            enrollLiveSession(sessionId, studentId),
        onSuccess: () => {
            toast.success("Enrolled in live session successfully");
            queryClient.invalidateQueries({ queryKey: ["liveSessions"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to enroll in live session");
        },
    });

    return {
        getLiveSessionsQuery,
        getLiveSessionByIdQuery,
        createLiveSession: createLiveSessionMutation.mutate,
        updateLiveSession: updateLiveSessionMutation.mutate,
        deleteLiveSession: deleteLiveSessionMutation.mutate,
        enrollLiveSession: enrollLiveSessionMutation.mutate,
    };
};

export default useLiveSessions;