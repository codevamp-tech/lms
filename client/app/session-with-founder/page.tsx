"use client"


import { MessageCircle } from "lucide-react";
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

const SessionWithFounderPage = () => {
  const enquiryFormRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

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
    title: "Counselling Session by Gowhar Amaan",
    sub: "course",
    price: "499",
    icon: MessageCircle,
    route: "/SessionWithFounder",
    className: "bg-gradient-to-r from-green-500 to-lime-400",
  };

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
            formPayload.type = "course";

            payload = { ...payload, ...formPayload };

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${courseData.className} text-white shadow-xl mb-6`}>
            <MessageCircle className="w-5 h-5 mr-2" />
            {courseData.title}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500">Counselling</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get 1-on-1 guidance from Gowhar Amaan, our founder, to unlock your full potential and get personalized career advice.
          </p>
          <p className="text-3xl font-bold text-green-600 mt-4">₹{courseData.price}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Session Content */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5">✓</span>
                  <span>30-minute live 1-on-1 video call with  Gowhar Amaan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5">✓</span>
                  <span>Personalized career roadmap & action plan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5">✓</span>
                  <span>Direct Q&A - ask anything about your goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5">✓</span>
                  <span>Goal setting & obstacle removal strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-0.5">✓</span>
                  <span>Recorded session for future reference</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Who is Gowhar Amaan?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Founder & Mentor</h3>
                      <p className="text-gray-600">10+ years experience</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-lime-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-lime-600">500+</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Students Mentored</h3>
                      <p className="text-gray-600">Success stories</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-emerald-600">95%</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Success Rate</h3>
                      <p className="text-gray-600">Career transformation</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-orange-600">24/7</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Support</h3>
                      <p className="text-gray-600">Post-session help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Form */}
          <div className="lg:sticky lg:top-8 lg:h-screen lg:flex lg:flex-col lg:justify-center">
            <div className="bg-gradient-to-br from-white/80 to-emerald-50/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${courseData.className} text-white mx-auto mb-4`}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Book Session
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Session</h2>
                <p className="text-gray-600">Secure your 1-on-1 session with Gowhar Amaan</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{courseData.price}</p>
              </div>

              <form id="enquiryForm" ref={enquiryFormRef} onSubmit={handleEnquiryAndPayment} className="space-y-6">
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
                  </div>
                  <div className="grid gap-2">
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
                      placeholder="10-digit number"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="preferredTimeToChat"
                      className="text-sm font-medium text-gray-700"
                    >
                      Preferred Time to Timing
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
                  <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 shadow-xl">
                    Book Session - ₹{courseData.price}
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

export default SessionWithFounderPage;
