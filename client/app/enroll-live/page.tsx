"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const EnrollLivePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const target = e.target as HTMLFormElement & {
        name: { value: string };
        email: { value: string };
        whatsapp: { value: string };
        message: { value: string };
      };
      const data = {
        name: target.name.value,
        email: target.email.value,
        whatsapp: target.whatsapp.value,
        message: target.message.value,
        product: "Live Classes",
        price: "2999",
      };

      // Send enrollment request to server (will attempt sending email server-side if configured)
      const res = await fetch("/api/enroll-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit enrollment");

      // Persist quick purchase data and redirect to cart/payment page
      sessionStorage.setItem("quickPurchase", JSON.stringify(data));
      toast.success("Enrollment submitted — redirecting to payment...");
      router.push(`/cart?product=${encodeURIComponent(data.product)}&price=${data.price}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto bg-card p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Enroll for Live Classes</h1>
        <p className="mb-6 text-muted-foreground">Price: ₹2999</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number</label>
            <Input id="whatsapp" name="whatsapp" type="tel" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <Input id="message" name="message" />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => router.back()} type="button">Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Proceed to Payment"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollLivePage;
