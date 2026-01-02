"use client";
import React from "react";
import useLiveSessions from "@/hooks/useLiveSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Video, Clock, CalendarDays, CheckCircle, Clock1, Clock10Icon, ClockAlert } from "lucide-react";
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

        if (diff <= 0) return "Starting Soon...";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);


        return `${hours}h : ${minutes}m `;
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
                        receipt: `live_${session._id.slice(-6)}_${Date.now().toString().slice(-6)}`,
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

                    if (!studentId) {
                        setPendingPayment(paymentData);
                        setLoginPopup(true);
                        return;
                    }

                    await createPaymentRecord(paymentData, studentId, session);
                },
            };

            new (window as any).Razorpay(options).open();
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment failed");
        }
    };

    async function finalizeEnrollment(paymentData: any, id: string) {
        try {
            await enrollLiveSession({ sessionId: paymentData.sessionId, studentId: id });
            toast.success("Enrollment successful!");
            setTimeout(() => window.location.reload(), 500);
        } catch (err) {
            toast.error("Enrollment failed after payment!");
        }
    }

    async function createPaymentRecord(paymentData: any, id: string, session: LiveSessionData) {
        try {
            const createPaymentDto = {
                userId: id,
                liveSessionId: paymentData.sessionId,
                amount: session.price,
                currency: "INR",
                paymentFor: "LIVE_SESSION",
                razorpayOrderId: paymentData.razorpay_order_id,
                razorpayPaymentId: paymentData.razorpay_payment_id,
                razorpaySignature: paymentData.razorpay_signature,
                status: "COMPLETED",
            };

            const paymentResp = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/payments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(createPaymentDto),
                }
            );

            if (!paymentResp.ok) {
                throw new Error("Failed to create payment record");
            }

            await finalizeEnrollment(paymentData, id);
        } catch (err) {
            console.error("Payment record creation error:", err);
            toast.error("Failed to save payment record!");
        }
    }

    React.useEffect(() => {
        if (!pendingPayment) return;

        waitForStudentId().then((id) => {
            setStudentId(id);
            const sessionId = pendingPayment.sessionId;
            const sessionData = sessions?.find((s: LiveSessionData) => s._id === sessionId);
            if (sessionData) {
                createPaymentRecord(pendingPayment, id, sessionData);
            }
            setPendingPayment(null);
            setLoginPopup(false);
        });
    }, [pendingPayment, sessions]);

    if (isLoading) return <Loader2 className="animate-spin" />;
    if (error) return <div>Error loading live sessions</div>;

    return (
        <>
            <LoginModal open={loginPopup} onClose={() => setLoginPopup(false)} />

            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Live Learning Sessions
                </h1>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {sessions?.map((session: LiveSessionData) => {
                        const status = getSessionStatus(session);
                        const isEnrolled = session.enrolledUsers?.includes(studentId!);

                        return (
                            <Card
                                key={session._id}
                                className="shadow-lg rounded-xl hover:shadow-2xl transition p-0 overflow-hidden"
                            >
                                {/* Image */}
                                {session.imageUrl && (
                                    <div className="relative h-48 bg-gray-100">
                                        <img
                                            src={session.imageUrl}
                                            alt={session.title}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Status Badge */}
                                        <Badge
                                            className={`absolute top-3 right-3 px-3 py-1 ${status === "live"
                                                ? "bg-red-600"
                                                : status === "upcoming"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-500"
                                                }`}
                                        >
                                            {status.toUpperCase()}
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold flex justify-between">
                                        {session.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm text-gray-700">
                                    <p className="flex items-center gap-2">
                                        <CalendarDays size={18} />{" "}
                                        {new Date(session.date).toLocaleString()}
                                    </p>

                                    <p className="flex items-center gap-2">
                                        <Clock size={18} /> Duration: {session.duration} min
                                    </p>

                                    <p className="text-lg font-bold text-green-600">
                                        ₹ {session.price}
                                    </p>

                                    {/* Countdown Section */}
                                    {status === "upcoming" && (
                                        <p className="text-blue-600 gap-3 flex font-semibold px-2 py-1 rounded w-fit">
                                            Starts in: {getCountdown(session)}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="pt-4">
                                        {isEnrolled ? (
                                            <div className="flex gap-3">
                                                <Button disabled className="flex-1 bg-gray-600">
                                                    <CheckCircle size={18} className="mr-2" />
                                                    Enrolled
                                                </Button>

                                                <Button
                                                    onClick={() => handleJoin(session)}
                                                    className={`flex-1 ${status === "live"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-gray-400 cursor-not-allowed"
                                                        } text-white`}
                                                    disabled={status !== "live"}
                                                >
                                                    <Video size={18} className="mr-2" />
                                                    {status === "live" ? "Join Now" : "Join Soon"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => handleEnroll(session)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                disabled={!isRazorpayLoaded}
                                            >
                                                {isRazorpayLoaded ? "Enroll Now" : "Loading..."}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default EnrollLivePage;
