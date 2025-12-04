"use client";

import React from "react";
import useLiveSessions from "@/hooks/useLiveSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Loader2, Trash } from "lucide-react";
import LiveSessionForm from "./LiveSessionForm";
import { LiveSessionData } from "@/features/api/live-session";

const LiveSession = () => {
    const { getLiveSessionsQuery, deleteLiveSession } = useLiveSessions();
    const { data: sessions, isLoading, error } = getLiveSessionsQuery();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
                Error loading live sessions
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
                        Live Sessions
                    </h1>
                    <div className="flex justify-center sm:justify-end">
                        <LiveSessionForm />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions?.map((session: LiveSessionData) => (
                        <Card key={session._id} className="shadow-md hover:shadow-lg transition-all overflow-hidden">
                            {session.imageUrl && (
                                <div className="w-full h-48 overflow-hidden bg-gray-100">
                                    <img src={session.imageUrl} alt={session.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-lg font-bold break-words">
                                    {session.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>{session.description}</p>
                                <p>
                                    <strong>Date:</strong> {new Date(session.date).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Duration:</strong> {session.duration} minutes
                                </p>
                                <p>
                                    <strong>Price:</strong> ₹{session.price}
                                </p>
                                <p>
                                    <strong>Instructor:</strong> {session.instructor}
                                </p>
                                {/* <p>
                                    <strong>Link:</strong> {session.link}
                                </p> */}

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <LiveSessionForm session={session} />

                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => deleteLiveSession(session._id!)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>

                                    <a
                                        href={session.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                    >
                                        <Button className="flex items-center gap-1">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveSession;
