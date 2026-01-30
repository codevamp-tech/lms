"use client";
import { useEffect, useState } from 'react';
import { fetchLiveSessions, createLiveSessionOrder, verifyLiveSessionPayment } from '@/features/api/live-session/route';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getUserIdFromToken } from '@/utils/helpers';
import toast from 'react-hot-toast';
import LiveSession from '@/components/admin/LiveSession';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface LiveSession {
    _id: string;
    title: string;
    description: string;
    instructor: {
        name: string;
    };
    dateTime: string;
    duration: number;
    price: number;
}

export default function LiveSessionsPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const userId = getUserIdFromToken();

    useEffect(() => {
        const getSessions = async () => {
            try {
                const data = await fetchLiveSessions();
                setSessions(data);
            } catch (error) {
                toast.error('Failed to load live sessions.');
            } finally {
                setIsLoading(false);
            }
        };
        getSessions();
    }, []);

    const handleEnroll = async (session: LiveSession) => {
        if (!userId) {
            router.push('/login');
            return;
        }

        try {
            const { order } = await createLiveSessionOrder(session._id, userId);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Mr English",
                description: `Enroll in ${session.title}`,
                order_id: order.id,
                handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) {
                    const data = await verifyLiveSessionPayment({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        sessionId: session._id,
                        userId,
                    });
                    if (data?.success) {
                        toast.success("Enrolled successfully!");
                        router.push('/my-learning');
                    } else {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: "Student Name", // Placeholder, ideally get from logged in user
                    email: "student@example.com", // Placeholder
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Failed to start enrollment process.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <LiveSession />
        </div>
    );
}
