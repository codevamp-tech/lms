"use client";
import React from "react";
import useLiveSessions from "@/hooks/useLiveSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LiveSessionData } from "@/features/api/live-session";
import { useRazorpay } from "@/providers/RazorpayProvider";

const EnrollLivePage = () => {
    const { getLiveSessionsQuery, enrollLiveSession } = useLiveSessions();
    const { data: sessions, isLoading, error } = getLiveSessionsQuery();
    const { isLoaded: isRazorpayLoaded } = useRazorpay();
    const [studentId, setStudentId] = React.useState<string | null>(null);
    
    React.useEffect(() => {
        const id = localStorage.getItem("userId");
        setStudentId(id);
    }, []);


    const handleEnroll = async (session: LiveSessionData) => {
        if (!studentId) {
            alert("Please log in to enroll.");
            return;
        }

        try {
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                alert("Razorpay Key ID is not configured. Please contact support.");
                return;
            }

            // Create a Razorpay order
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: session.price,
                    currency: "INR",
                    receipt: `receipt_for_${session._id}`,
                }),
            });
            const order = await orderResponse.json();

            // Open Razorpay checkout
            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: "Your Company Name",
                description: `Enroll in ${session.title}`,
                order_id: order.id,
                handler: async (response: any) => {
                    // Verify payment and enroll student
                    enrollLiveSession({ sessionId: session._id!, studentId });
                },
                prefill: {
                    name: localStorage.getItem("userName") || "",
                    email: "", // You can prefill the user's email if you have it
                },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Enrollment Error:", error);
            alert("An error occurred during enrollment. Please try again.");
        }
    };

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (error) {
        return <div>Error loading live sessions</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Available Live Sessions</h1>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sessions?.map((session: LiveSessionData) => (
                    <Card key={session._id} className="overflow-hidden">
                        {session.imageUrl && (
                            <div className="w-full h-48 overflow-hidden bg-gray-100">
                                <img src={session.imageUrl} alt={session.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{session.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{session.description}</p>
                            <p><strong>Date:</strong> {new Date(session.date).toLocaleString()}</p>
                            <p><strong>Duration:</strong> {session.duration} minutes</p>
                            <p><strong>Price:</strong> INR {session.price}</p>
                            {session.enrolledUsers?.includes(studentId!) ? (
                                <Button className="mt-4" disabled>Enrolled</Button>
                            ) : (
                                <Button onClick={() => handleEnroll(session)} className="mt-4" disabled={!isRazorpayLoaded}>
                                    {isRazorpayLoaded ? "Enroll" : "Loading..."}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EnrollLivePage;
