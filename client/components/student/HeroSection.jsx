"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Award } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // 🔥 Dialog close button ref
  const closeRef = useRef(null);

  // Function to handle form submission
  const handleSubmit = async (e, offer) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const typeMap = {
      "English Course": "course",
      "Counselling Session by Founder": "counselling",
      "Chat Buddy": "chat",
    };

    const cleanTitle =
      typeof offer.title === "string"
        ? offer.title
        : offer.title.props.children.join(" ");

    const type = typeMap[cleanTitle] || "course";

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsappNo"),
      type: type,
      status: "open",
    };

    try {
      // Ensure Razorpay script is loaded
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

      // Parse numeric amount from offer.price (strip non-digits)
      const priceString = String(offer.price || "0");
      const priceDigits = priceString.match(/\d+/);
      const amountINR = priceDigits ? parseInt(priceDigits[0], 10) : 0;

      if (amountINR <= 0) {
        // If amount is zero or invalid, just submit enquiry without payment
        const resNoPay = await fetch(`${API_URL}/enquiry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!resNoPay.ok) throw new Error("Failed to submit enquiry");
        toast.success("Enquiry submitted");
        if (closeRef.current) closeRef.current.click();
        return;
      }

      // Create Razorpay order on server
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
        description: cleanTitle,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Attach razorpay details to enquiry payload
            const payload = {
              ...data,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              currency: order.currency,
            };

            const res = await fetch(`${API_URL}/enquiry`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              toast.error("Failed to save enquiry after payment");
              return;
            }

            toast.success("Payment successful and enquiry saved");
            if (closeRef.current) closeRef.current.click();
          } catch (err) {
            console.error("Error saving enquiry after payment:", err);
            toast.error("Error saving enquiry after payment");
          }
        },
        prefill: {
          name: formData.get("name") || "",
          email: formData.get("email") || "",
          contact: formData.get("whatsappNo") || "",
        },
        notes: {},
        theme: { color: "#b28704" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Payment failed or could not start checkout");
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="w-full">
        <img
          src="/img/hero_page.jpg"
          alt="Mr English Training Academy"
          className="w-full h-auto object-cover max-h-[500px] lg:max-h-[700px]"
        />
      </div>

      {/* Hero Section */}
      <div
        style={{ backgroundImage: `url('/img/hero-4.jpg')` }}
        className="relative py-8 lg:py-16 px-4 bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/20 backdrop-blur-sm" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent leading-snug py-2">
              Mr English Training Academy
            </h1>


            <motion.p
              variants={fadeIn}
              className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto mt-4"
            >
              Transform your English speaking skills with expert-led coaching.
            </motion.p>

            {/* Quick Enroll Boxes */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-10"
            >
              {[
                {
                  title: <>English<br />Course</>,
                  sub: "English Course",
                  price: "1499",
                  icon: BookOpen,
                  className:
                    "bg-gradient-to-r from-blue-500 to-cyan-500",
                },
                {
                  title: "Counselling Session by Founder",
                  sub: <>Counselling Session by <br /> Founder</>,
                  price: "499",
                  icon: MessageCircle,
                  className:
                    "bg-gradient-to-r from-green-500 to-lime-400",
                },
                {
                  title: <>Chat<br />Buddy</>,
                  sub: "Chat Buddy",
                  price: "2000/m",
                  icon: Award,
                  className:
                    "bg-gradient-to-r from-yellow-400 to-orange-400",
                },
              ].map((offer, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <div
                      className={`${offer.className} p-6 rounded-xl cursor-pointer shadow-lg hover:shadow-xl`}
                    >
                      <offer.icon className="w-10 h-10 mb-4 mx-auto" />
                      <h3 className="text-lg font-bold">{offer.title}</h3>
                      <p className="text-2xl font-bold">₹{offer.price}</p>
                    </div>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{offer.sub}</DialogTitle>
                      <DialogDescription>
                        Fill in your details to enroll
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e) => handleSubmit(e, offer)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Name</Label>
                          <Input name="name" required />
                        </div>
                        <div className="grid gap-2">
                          <Label>Email</Label>
                          <Input name="email" type="email" required />
                        </div>
                        <div className="grid gap-2">
                          <Label>Whatsapp Number</Label>
                          <Input
                            name="whatsappNo"
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                          />

                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>

                        <Button type="submit">Submit</Button>
                      </DialogFooter>

                      {/* 🔥 Hidden auto-close button */}
                      <DialogClose asChild>
                        <button ref={closeRef} style={{ display: "none" }} />
                      </DialogClose>
                    </form>
                  </DialogContent>
                </Dialog>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
