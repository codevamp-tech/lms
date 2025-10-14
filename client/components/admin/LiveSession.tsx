import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Loader2, CheckCircle, Users, Calendar } from "lucide-react";

const LiveSession = () => {
    const [meetLink, setMeetLink] = useState("");
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartSession = async () => {
        setIsLoading(true);

        try {
            const companyId = localStorage.getItem("companyId");
            if (!companyId) {
                alert("Company ID not found. Please log in again.");
                setIsLoading(false);
                return;
            }

            const response = await fetch("https://lms-v4tz.onrender.com/live-session/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ companyId }),
            });

            const data = await response.json();
            console.log("Response from server:", data, response);

            if (response.ok ) {
                setMeetLink(data.meetLink);
                setIsSessionStarted(true);
            } else {
                alert(data.message || "Failed to start session.");
            }
        } catch (error) {
            console.error("Error starting session:", error);
            alert("An error occurred while starting the session.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsSessionStarted(false);
        setMeetLink("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Live Session
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Start an instant live session and invite all students from your company.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    {!isSessionStarted ? (
                        <Card className="border-0 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center text-xl">
                                    <Video className="mr-2 w-6 h-6" />
                                    Start a New Live Session
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                {/* Feature Cards */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Instant Meeting</h3>
                                            <p className="text-sm text-gray-600">Google Meet link generated automatically</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Auto Invites</h3>
                                            <p className="text-sm text-gray-600">All students notified via email</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
                                    <ol className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3 flex-shrink-0">1</span>
                                            <span>Click the button below to create an instant Google Meet session</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3 flex-shrink-0">2</span>
                                            <span>Meet link is automatically generated</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3 flex-shrink-0">3</span>
                                            <span>Email invitations sent to all students in your company</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3 flex-shrink-0">4</span>
                                            <span>Join the meeting and start teaching!</span>
                                        </li>
                                    </ol>
                                </div>

                                <Button
                                    onClick={handleStartSession}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                            Creating Session...
                                        </>
                                    ) : (
                                        <>
                                            <Video className="mr-2 h-6 w-6" />
                                            Create and Start Session
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                <CardTitle className="flex items-center text-xl">
                                    <CheckCircle className="mr-2 w-6 h-6" />
                                    Live Session Created Successfully!
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                {/* Success Message */}
                                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <p className="text-lg font-semibold text-green-900 mb-2">
                                        Session Created!
                                    </p>
                                    <p className="text-sm text-green-700">
                                        ✓ Invitations sent to all students
                                    </p>
                                </div>

                                {/* Meeting Link Section */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Meeting Link:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={meetLink}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                                        />
                                        <Button
                                            onClick={() => {
                                                navigator.clipboard.writeText(meetLink);
                                                alert("Link copied to clipboard!");
                                            }}
                                            variant="outline"
                                            className="px-4 py-3"
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <a href={meetLink} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Video className="mr-2 h-6 w-6" />
                                            Join Live Session
                                        </Button>
                                    </a>

                                    <Button
                                        variant="outline"
                                        className="w-full py-6 text-base"
                                        onClick={handleReset}
                                    >
                                        Start New Session
                                    </Button>
                                </div>

                                {/* Help Text */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>💡 Tip:</strong> Keep this tab open. You can return here to copy the link or start a new session.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Need help? Contact support or check the documentation.</p>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
};

export default LiveSession;