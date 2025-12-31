
"use client"

import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const ChatBuddyPage = () => {
  const enquiryFormRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [selectedBuddyId, setSelectedBuddyId] = useState("");

  function waitForFormData(): Promise<any> {
    return new Promise((resolve) => {
      const checkForm = setInterval(() => {
        const form = enquiryFormRef.current;

        if (form) {
          clearInterval(checkForm);

          form.onsubmit = (e) => {
            e.preventDefault();

            const data = new FormData(form);

            resolve({
              name: data.get("name"),
              email: data.get("email"),
              whatsappNo: data.get("whatsappNo"),
              status: "open",
            });
          };
        }
      }, 50);
    });
  }

  const courseData = {
    title: "Chat Buddy",
    sub: "chat",
    price: "2000/m",
    icon: Award,
    route: "/chatBuddy",
    className: "bg-gradient-to-r from-yellow-400 to-orange-400",
  };

  // ✅ FIXED: works with form submit, no logic change
  const handleEnquiryAndPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const offer = courseData;

    try {
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = resolve;
        });
      }

      const priceDigits = String(offer.price).match(/\d+/);
      const amountINR = priceDigits ? parseInt(priceDigits[0], 10) : 0;

      const orderResp = await fetch(`${API_URL}/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountINR,
          currency: "INR",
          receipt: `enquiry_receipt_${Date.now()}`,
        }),
      });

      if (!orderResp.ok) throw new Error("Failed to create payment order");
      const order = await orderResp.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mr English Training Academy",
        description: offer.title,
        order_id: order.id,

        handler: async (response: any) => {
          try {
            let payload: any = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: order.currency,
            };

            toast.success("Payment successful");

            setSelectedEnquiry(offer);

            const formPayload = await waitForFormData();
            formPayload.type = "chat";

            formPayload.buddyId = selectedBuddyId;

            const res = await fetch(`${API_URL}/enquiry`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              toast.error("Failed to save enquiry");
              return;
            }

            toast.success("Enquiry saved successfully");
            closeRef.current?.click();
          } catch (err) {
            console.error(err);
            toast.error("Error saving enquiry");
          }
        },

        theme: { color: "#b28704" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [buddies, setBuddies] = useState<ChatBuddy[]>([]);
  const [loadingBuddies, setLoadingBuddies] = useState(true);

  const fetchChatBuddies = async () => {
    try {
      const res = await fetch(`${API_URL}/chat-buddy`);
      const data = await res.json();
      setBuddies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBuddies(false);
    }
  };

  useState(() => {
    fetchChatBuddies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${courseData.className} text-white shadow-xl mb-6`}>
            <Award className="w-5 h-5 mr-2" />
            {courseData.title}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">24/7 Chat Buddy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlimited messaging support with expert buddies to help you practice, learn, and grow every single day.
          </p>
          <p className="text-3xl font-bold text-orange-600 mt-4">₹{courseData.price}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Chat Buddy Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Chat Buddies
            </h2>

            {loadingBuddies ? (
              <p className="text-gray-500">Loading chat buddies...</p>
            ) : buddies.length === 0 ? (
              <p className="text-gray-500">No chat buddies available</p>
            ) : (
              <div className="space-y-4">
                {buddies.map((buddy) => (
                  <div
                    key={buddy._id}
                    className="bg-white rounded-xl shadow-md p-4 flex items-start gap-4"
                  >
                    <img
                      src={buddy.photo || "/placeholder-avatar.png"}
                      alt={buddy.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{buddy.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${buddy.status === "online"
                            ? "bg-green-100 text-green-700"
                            : buddy.status === "busy"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {buddy.status}
                        </span>
                      </div>

                      {buddy.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {buddy.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Enrollment Form */}
          <div className="lg:sticky lg:top8 lg:h-screen lg:flex lg:flex-col lg:justify-center">
            <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${courseData.className} text-white mx-auto mb-4`}>
                  <Award className="w-4 h-4 mr-1" />
                  Get Your Buddy
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Chatting Today</h2>
                <p className="text-gray-600">Connect with your personal chat buddy</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">₹{courseData.price}</p>
              </div>

              <form ref={enquiryFormRef} onSubmit={handleEnquiryAndPayment} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      placeholder="Enter your full name"
                    />


                    <div className="grid gap-2">
                      <Label htmlFor="buddy" className="text-sm font-medium text-gray-700">
                        Select Chat Buddy
                      </Label>
                      <select
                        id="buddy"
                        name="buddy"
                        required
                        value={selectedBuddyId}
                        onChange={(e) => setSelectedBuddyId(e.target.value)}
                        className="h-12 text-lg rounded-md border border-input bg-background px-3"
                      >
                        <option value="">Choose your buddy</option>
                        {buddies.map((buddy) => (
                          <option key={buddy._id} value={buddy._id}>
                            {buddy.name} ({buddy.status})
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      placeholder="your@email.com"
                    />
                  </div> */}
                  <div className="grid gap-2">
                    <Label htmlFor="whatsappNo" className="text-sm font-medium text-gray-700">WhatsApp Number</Label>
                    <Input
                      id="whatsappNo"
                      name="whatsappNo"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.whatsappNo}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      placeholder="10-digit number (Primary chat)"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="preferredTimeToChat"
                      className="text-sm font-medium text-gray-700"
                    >
                      Preferred Time to Call
                    </Label>

                    <select
                      id="preferredTimeToCall"
                      name="preferredTimeToCall"
                      required
                      value={formData.preferredTimeToCall}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredTimeToCall: e.target.value,
                        })
                      }
                      className="h-12 text-lg rounded-md border border-input bg-background px-3"
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (6 AM – 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
                      <option value="evening">Evening (5 PM – 9 PM)</option>
                      <option value="night">Night (9 PM – 12 AM)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl">
                    Get Chat Buddy - ₹{courseData.price}
                  </Button>

                </div>
              </form>

            </div>
          </div>
        </div>
      </div>

      {/* Hidden close button */}
      <button ref={closeRef} style={{ display: "none" }} />
    </div>
  );
};

export default ChatBuddyPage;
