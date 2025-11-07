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
        return <Loader2 className="animate-spin" />;
    }

    if (error) {
        return <div>Error loading live sessions</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Live Sessions</h1>
                    <LiveSessionForm />
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {sessions?.map((session: LiveSessionData) => (
                        <Card key={session._id}>
                            <CardHeader>
                                <CardTitle>{session.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{session.description}</p>
                                <p><strong>Date:</strong> {new Date(session.date).toLocaleString()}</p>
                                <p><strong>Duration:</strong> {session.duration} minutes</p>
                                <p><strong>Price:</strong> ${session.price}</p>
                                <p><strong>Instructor:</strong> {session.instructor}</p>
                                <div className="flex space-x-2 mt-4">
                                    <LiveSessionForm session={session} />
                                    <Button variant="outline" onClick={() => deleteLiveSession(session._id!)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                    <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                                        <Button>
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