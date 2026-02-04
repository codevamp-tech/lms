
"use client"

import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SuccessModal from "@/components/SuccessModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ChatBuddy {
  _id: string;
  name: string;
  photo?: string;
  bio?: string;
  bookedSlots: number;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const ChatBuddyPage = () => {
  const enquiryFormRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const MAX_SLOTS = 5;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
    preferredTimeToCall: "",
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
              whatsapp: data.get("whatsappNo"),
              status: "pending",
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ FIXED: works with form submit, no logic change
  const handleEnquiryAndPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBuddy = buddies.find(b => b._id === selectedBuddyId);

    if (!selectedBuddyId || !selectedBuddy) {
      toast.error("Please select an available chat buddy");
      return;
    }

    if (selectedBuddy.bookedSlots >= MAX_SLOTS) {
      toast.error("This chat buddy is fully booked. Please choose another.");
      return;
    }

    try {
      // 1️⃣ Load Razorpay
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((res) => (script.onload = res));
      }

      // 2️⃣ Create Order
      const priceDigits = courseData.price.match(/\d+/);
      const amountINR = priceDigits ? parseInt(priceDigits[0], 10) : 0;

      const orderResp = await fetch(`${API_URL}/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountINR,
          currency: "INR",
          receipt: `chatbuddy_${Date.now()}`,
        }),
      });

      if (!orderResp.ok) throw new Error("Order creation failed");
      const order = await orderResp.json();

      // 3️⃣ Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mr English Training Academy",
        description: "Chat Buddy Subscription",
        order_id: order.id,

        handler: async (response: any) => {
          try {
            // 4️⃣ AUTO CREATE ENQUIRY (NO EXTRA CLICK)
            const enquiryPayload = {
              name: formData.name,
              email: formData.email,
              whatsapp: formData.whatsappNo,
              type: "chat",
              status: "pending",
              price: courseData.price,
              chatBuddyId: selectedBuddyId,
              preferredTimeToCall: formData.preferredTimeToCall,

              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: order.currency,
            };

            const res = await fetch(`${API_URL}/enquiry`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(enquiryPayload),
            });

            if (!res.ok) {
              toast.error("Payment success but enquiry failed");
              return;
            }

            // toast.success("Payment & Enquiry completed 🎉");
            setShowSuccessModal(true); // Show Success Modal

            // Optional: Clear form or redirect? 
            // setFormData({ ... }) 
          } catch (err) {
            console.error(err);
            toast.error("Enquiry creation failed");
          }
        },

        theme: { color: "#b28704" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* Pagination State - Removed */
  const [buddies, setBuddies] = useState<ChatBuddy[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  // const ITEMS_PER_PAGE = 5;

  const fetchChatBuddies = async () => {
    try {
      setLoadingBuddies(true);
      const res = await fetch(`${API_URL}/chat-buddy?limit=100`);
      const data = await res.json();

      if (data.buddies && Array.isArray(data.buddies)) {
        setBuddies(data.buddies);

        // setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      } else if (Array.isArray(data)) {
        setBuddies(data);
      } else {
        console.error("Unexpected API response format:", data);
        setBuddies([]);
      }
    } catch (err) {
      console.error(err);
      setBuddies([]);
    } finally {
      setLoadingBuddies(false);
    }
  };

  useEffect(() => {
    fetchChatBuddies();
  }, []);


  const SlotTicks = ({ bookedSlots = 0 }: { bookedSlots: number }) => {
    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: MAX_SLOTS }).map((_, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full border flex items-center justify-center
            ${i < bookedSlots
                ? "bg-green-500 border-green-500"
                : "bg-gray-100 border-gray-300"
              }`}
          >
            {i < bookedSlots && (
              <span className="text-white text-xs">✓</span>
            )}
          </span>
        ))}
      </div>
    );
  };


  useEffect(() => {
    if (!selectedBuddyId) return;

    const selectedBuddy = buddies.find(
      (b) => b._id === selectedBuddyId
    );

    if (selectedBuddy && selectedBuddy.bookedSlots >= MAX_SLOTS) {
      toast.error("Selected chat buddy is full. Please choose another.");
      setSelectedBuddyId(""); // 🔥 auto reset
    }
  }, [buddies, selectedBuddyId]);

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
              <>
                <div className="space-y-4 h-[750px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                  {buddies.map((buddy) => (
                    <div
                      key={buddy._id}
                      className={`bg-white rounded-xl shadow-md p-4 flex items-start gap-4
    ${buddy.status === "full" ? "opacity-60" : ""}
  `}
                    >
                      <img
                        src={buddy.photo || "/placeholder-avatar.png"}
                        alt={buddy.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{buddy.name}</h3>

                          {buddy.status === "full" ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                              Full
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              Available
                            </span>
                          )}
                        </div>

                        {buddy.bio && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {buddy.bio}
                          </p>
                        )}

                        {/* ✅ Slot ticks */}
                        <SlotTicks bookedSlots={buddy.bookedSlots} />

                        {/* ❌ Full message */}
                        {buddy.bookedSlots >= MAX_SLOTS && (
                          <p className="text-xs text-red-600 mt-2 font-medium">
                            This chat buddy is fully booked.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>



                {/* Pagination Controls Removed */}
              </>
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
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="buddy" className="text-sm font-medium text-gray-700">
                        Select Chat Buddy
                      </Label>
                      <Select
                        value={selectedBuddyId}
                        onValueChange={(value) => setSelectedBuddyId(value)}
                      >
                        <SelectTrigger className="h-10 text-base">
                          <SelectValue placeholder="Choose your buddy" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px]">
                          {buddies.map((buddy) => (
                            <SelectItem
                              key={buddy._id}
                              value={buddy._id}
                              disabled={buddy.bookedSlots >= MAX_SLOTS}
                            >
                              {buddy.name} {buddy.bookedSlots >= MAX_SLOTS ? "(Full)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Chat Buddy Booked! 🎉"
        message="We have received your payment and booking details. Our team will contact you shortly on your WhatsApp number."
        buttonText="Awesome, thanks!"
      />
    </div >
  );
};

export default ChatBuddyPage;


