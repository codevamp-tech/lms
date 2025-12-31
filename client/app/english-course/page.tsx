"use client"


import { BookOpen } from "lucide-react";
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

const EnglishCoursePage = () => {
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
    title: "English Course",
    sub: "course",
    price: "1499",
    icon: BookOpen,
    route: "/englishCourse",
    className: "bg-gradient-to-r from-blue-500 to-cyan-500",
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
            formPayload.type = "Course";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${courseData.className} text-white shadow-xl mb-6`}>
            <BookOpen className="w-5 h-5 mr-2" />
            {courseData.title}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Master English <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Fluently</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your communication skills with our comprehensive English course. Perfect for beginners to advanced learners.
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-4">₹{courseData.price}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Course Content */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                  <span>Grammar mastery from basic to advanced</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                  <span>Conversational English for real-world scenarios</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                  <span>Vocabulary expansion with 1000+ essential words</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                  <span>Pronunciation perfection with native speakers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                  <span>Writing skills for emails, essays & professional docs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Structure</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">12 Weeks</h3>
                      <p className="text-gray-600">Live sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-green-600">24</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Modules</h3>
                      <p className="text-gray-600">Comprehensive coverage</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-purple-600">50+</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Practice Tests</h3>
                      <p className="text-gray-600">Real exam simulation</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-lg font-bold text-orange-600">Lifetime</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Access</h3>
                      <p className="text-gray-600">Course materials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Form */}
          <div className="lg:sticky lg:top-8 lg:h-screen lg:flex lg:flex-col lg:justify-center">
            <div className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${courseData.className} text-white mx-auto mb-4`}>
                  <BookOpen className="w-4 h-4 mr-1" />
                  Enroll Now
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h2>
                <p className="text-gray-600">Fill your details to enroll in English Course</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">₹{courseData.price}</p>
              </div>

              <form id="enquiryForm" ref={enquiryFormRef} onSubmit={handleEnquiryAndPayment}
                className="space-y-6">
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
                </div>

                <div className="pt-4 space-y-3">
                  <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl">
                    Enroll Now - ₹{courseData.price}
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

export default EnglishCoursePage;
