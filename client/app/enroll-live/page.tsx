"use client";
import React from "react";
import useLiveSessions from "@/hooks/useLiveSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LiveSessionData } from "@/features/api/live-session";
import { useRazorpay } from "@/providers/RazorpayProvider";
import LoginModal from "@/components/student/loginModal";
import toast from "react-hot-toast";

const EnrollLivePage = () => {
    const { getLiveSessionsQuery, enrollLiveSession } = useLiveSessions();
    const { data: sessions, isLoading, error } = getLiveSessionsQuery();
    const { isLoaded: isRazorpayLoaded } = useRazorpay();
    const [studentId, setStudentId] = React.useState<string | null>(null);
    const [now, setNow] = React.useState<Date>(new Date());
    const [pendingPayment, setPendingPayment] = React.useState<any>(null);
    const [loginPopup, setLoginPopup] = React.useState<boolean>(false);


    React.useEffect(() => {
        const id = localStorage.getItem("userId");
        setStudentId(id);

        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // --- STATUS BASED ON DATE ---
    const getSessionStatus = (session: LiveSessionData) => {
        const start = new Date(session.date);
        const end = new Date(start.getTime() + session.duration * 60000);
        const thirtyMinutesBefore = new Date(start.getTime() - 30 * 60000);

        if (now < thirtyMinutesBefore) return "upcoming";
        if (now >= thirtyMinutesBefore && now <= end) return "live";
        return "completed";
    };

    // --- COUNTDOWN TIMER ---
    const getCountdown = (session: LiveSessionData) => {
        const start = new Date(session.date).getTime();
        const diff = start - now.getTime();

        if (diff <= 0) return "Class is starting...";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${hours}h : ${minutes}m : ${seconds}s`;
    };

    const handleJoin = (session: LiveSessionData) => {
        if (!session.link) {
            toast.error("Meeting link is not available yet!");
            return;
        }
        window.open(session.link, "_blank");
    };



    function waitForStudentId() {
        return new Promise<string>((resolve) => {
            const interval = setInterval(() => {
                const id = localStorage.getItem("userId");
                if (id) {
                    clearInterval(interval);
                    resolve(id);
                }
            }, 500);
        });
    }

    const handleEnroll = async (session: LiveSessionData) => {
        try {
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey) return toast.error("Razorpay Key Missing!");

            const orderResp = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: session.price,
                        currency: "INR",
                        receipt: `live_${session._id}_${Date.now()}`,
                    }),
                }
            );

            const order = await orderResp.json();

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "Live Session Enrollment",
                description: session.title,
                order_id: order.id,

                handler: async (payment) => {
                    const paymentData = {
                        razorpay_payment_id: payment.razorpay_payment_id,
                        razorpay_order_id: payment.razorpay_order_id,
                        razorpay_signature: payment.razorpay_signature,
                        sessionId: session._id,
                    };

                    // 🔥 User NOT logged in
                    if (!studentId) {
                        setPendingPayment(paymentData);
                        setLoginPopup(true);
                        return;
                    }

                    // User logged in → Enroll now
                    await finalizeEnrollment(paymentData, studentId);
                },
            };

            new (window as any).Razorpay(options).open();
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment failed");
        }
    };

    // 🔥 After Login completes → Auto enroll!
    async function finalizeEnrollment(paymentData: any, id: string) {
        try {
            await enrollLiveSession({ sessionId: paymentData.sessionId, studentId: id });
            toast.success("Enrollment successful!");
            window.location.reload();
        } catch (err) {
            toast.error("Enrollment failed after payment!");
        }
    }

    // 🔥 Watch for login + pending payment
    React.useEffect(() => {
        if (!pendingPayment) return;

        waitForStudentId().then((id) => {
            setStudentId(id);
            finalizeEnrollment(pendingPayment, id);
            setPendingPayment(null);
            setLoginPopup(false);
        });
    }, [pendingPayment]);


    if (isLoading) return <Loader2 className="animate-spin" />;
    if (error) return <div>Error loading live sessions</div>;

    return (
        <>
            <LoginModal
                open={loginPopup}
                onClose={() => setLoginPopup(false)} />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Available Live Sessions</h1>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {sessions?.map((session: LiveSessionData) => {
                        const status = getSessionStatus(session);
                        const isEnrolled = session.enrolledUsers?.includes(studentId!);

                        return (
                            <Card key={session._id} className="overflow-hidden">
                                {session.imageUrl && (
                                    <div className="w-full h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={session.imageUrl}
                                            alt={session.title}
                                            className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle>{session.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <p>{session.description}</p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(session.date).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Duration:</strong> {session.duration} minutes
                                    </p>
                                    <p>
                                        <strong>Price:</strong> INR {session.price}
                                    </p>

                                    {/* COUNTDOWN */}
                                    {status === "upcoming" && (
                                        <p className="text-blue-600 font-semibold mt-3">
                                            Starts in: {getCountdown(session)}
                                        </p>
                                    )}

                                    {/* BUTTONS */}
                                    {isEnrolled ? (
                                        <div className="flex flex-row gap-3 mt-4">
                                            {/* ENROLLED BUTTON */}
                                            <Button
                                                disabled
                                                className="bg-gray-600 text-white cursor-default"
                                            >
                                                Enrolled
                                            </Button>

                                            {/* JOIN NOW BUTTON */}
                                            <Button
                                                onClick={() => handleJoin(session)}
                                                disabled={status !== "live"}
                                                className={status === "live"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-400 text-white cursor-not-allowed"}
                                            >
                                                {status === "live"
                                                    ? "Join Now"
                                                    : "Join (Available 30 min before)"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleEnroll(session)}
                                            className="mt-4"
                                            disabled={!isRazorpayLoaded}
                                        >
                                            {isRazorpayLoaded ? "Enroll" : "Loading..."}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div></>
    );
};

export default EnrollLivePage;
