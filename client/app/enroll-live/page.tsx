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

    const [studentId, setStudentId] = React.useState(null);
    const [now, setNow] = React.useState(new Date());
    const [pendingPayment, setPendingPayment] = React.useState(null);
    const [loginPopup, setLoginPopup] = React.useState(false);
    const [razorpayPhone, setRazorpayPhone] = React.useState(null);

    React.useEffect(() => {
        const id = localStorage.getItem("userId");
        setStudentId(id);
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getSessionStatus = (session: LiveSessionData) => {
        const start = new Date(session.date);
        const end = new Date(start.getTime() + session.duration * 60000);
        const thirtyMinutesBefore = new Date(start.getTime() - 30 * 60000);
        if (now < thirtyMinutesBefore) return "upcoming";
        if (now >= thirtyMinutesBefore && now <= end) return "live";
        return "completed";
    };

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

    // Create account using phone number from Razorpay
    const createAccountWithPhone = async (phoneNumber: string, paymentData: any) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/register-with-phone`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone: phoneNumber,
                        name: `User ${phoneNumber.slice(-4)}`,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create account");
            }

            const userData = await response.json();

            console.log('userData>>>', userData);

            // Store user data
            localStorage.setItem("userId", userData.userId || userData.user._id);
            setStudentId(userData.userId || userData.user._id);

            toast.success("Account created automatically!");

            // Complete the enrollment
            const sessionData = sessions?.find((s: LiveSessionData) => s._id === paymentData.sessionId);
            if (sessionData) {
                await createPaymentRecord(paymentData, userData.userId || userData._id, sessionData);
            }

            return userData.userId || userData._id;
        } catch (err) {
            console.error("Account creation error:", err);
            toast.error("Failed to create account automatically.");
            return null;
        }
    };

    // Handle login modal close
    const handleLoginModalClose = async () => {
        setLoginPopup(false);

        // If user closes modal and has pending payment, create account automatically
        if (pendingPayment && razorpayPhone) {
            toast.loading("Creating your account automatically...");
            await createAccountWithPhone(razorpayPhone, pendingPayment);
            setPendingPayment(null);
            setRazorpayPhone(null);
        } else if (pendingPayment && !razorpayPhone) {
            // If somehow we don't have phone, show error
            toast.error("Unable to create account. Please contact support.");
        }
    };

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
                prefill: {
                    contact: "",
                },
                handler: async (payment) => {
                    const paymentData = {
                        razorpay_payment_id: payment.razorpay_payment_id,
                        razorpay_order_id: payment.razorpay_order_id,
                        razorpay_signature: payment.razorpay_signature,
                        sessionId: session._id,
                    };

                    // If user is not logged in, show login popup
                    if (!studentId) {
                        try {
                            // Fetch payment details to get phone number
                            const paymentDetails = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/razorpay/payment-details/${payment.razorpay_payment_id}`,
                                {
                                    method: "GET",
                                    headers: { "Content-Type": "application/json" },
                                }
                            );

                            const details = await paymentDetails.json();
                            const phoneNumber = details.contact || details.phone;

                            if (phoneNumber) {
                                setRazorpayPhone(phoneNumber); // Store phone for later use
                                setPendingPayment(paymentData);
                                setLoginPopup(true); // Show login popup first
                            } else {
                                toast.error("Unable to retrieve phone number from payment");
                                setPendingPayment(paymentData);
                                setLoginPopup(true);
                            }
                        } catch (err) {
                            console.error("Error fetching payment details:", err);
                            toast.error("Payment successful but unable to complete enrollment");
                        }
                        return;
                    }

                    // If user is already logged in, complete enrollment directly
                    await createPaymentRecord(paymentData, studentId, session);
                },
                modal: {
                    ondismiss: function () {
                        if (!studentId) {
                            toast.error("Payment cancelled. Please try again to enroll.");
                        }
                    }
                }
            };

            new (window as any).Razorpay(options).open();
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment failed");
        }
    };

    async function finalizeEnrollment(paymentData: any, id: string) {
        try {
            await enrollLiveSession({
                sessionId: paymentData.sessionId,
                studentId: id,
            });
            toast.success("Enrollment successful!");
            setTimeout(() => window.location.reload(), 1000);
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
                razorpayOrderId: paymentData.razorpay_order_id,
                razorpayPaymentId: paymentData.razorpay_payment_id,
                razorpaySignature: paymentData.razorpay_signature,
                paymentFor: "live_session",
                status: "success",
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

    // Handle manual login success from LoginModal
    React.useEffect(() => {
        if (!pendingPayment) return;

        const checkLogin = setInterval(() => {
            const id = localStorage.getItem("userId");
            if (id) {
                clearInterval(checkLogin);
                setStudentId(id);
                const sessionId = pendingPayment.sessionId;
                const sessionData = sessions?.find((s: LiveSessionData) => s._id === sessionId);
                if (sessionData) {
                    createPaymentRecord(pendingPayment, id, sessionData);
                }
                setPendingPayment(null);
                setRazorpayPhone(null);
                setLoginPopup(false);
            }
        }, 500);

        // Cleanup after 30 seconds
        const timeout = setTimeout(() => {
            clearInterval(checkLogin);
        }, 30000);

        return () => {
            clearInterval(checkLogin);
            clearTimeout(timeout);
        };
    }, [pendingPayment, sessions]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading live sessions
            </div>
        );

    return (
        <>
            <LoginModal
                isOpen={loginPopup}
                onClose={handleLoginModalClose}
            />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    Live Learning Sessions
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions?.map((session: LiveSessionData) => {
                        const status = getSessionStatus(session);
                        const isEnrolled = session.enrolledUsers?.includes(studentId!);

                        return (
                            <Card key={session._id} className="relative overflow-hidden">
                                {session.imageUrl && (
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={session.imageUrl}
                                            alt={session.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge
                                            className={`absolute top-2 right-2 ${status === "live"
                                                ? "bg-red-600"
                                                : status === "upcoming"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-600"
                                                }`}
                                        >
                                            {status.toUpperCase()}
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{session.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CalendarDays className="w-4 h-4" />
                                        {new Date(session.date).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        Duration: {session.duration} min
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹ {session.price}
                                    </div>

                                    {status === "upcoming" && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="text-sm font-semibold text-blue-800">
                                                Starts in: {getCountdown(session)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {isEnrolled ? (
                                            <div className="flex-1 flex gap-2">
                                                <Badge className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="w-4 h-4" /> Enrolled
                                                </Badge>
                                                <Button
                                                    onClick={() => handleJoin(session)}
                                                    className={`flex-1 ${status === "live"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-gray-400 cursor-not-allowed"
                                                        } text-white`}
                                                    disabled={status !== "live"}
                                                >
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