"use client";

import React, { useState } from "react";
// import { Modal } from "@/components/ui/modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export const Forgot = () => {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState("");

  const handleCancel = () => {
    window.location.href = "/login";
  };


  const handleSendResetLink = async () => {
    if (!email.trim()) {
      // Show an error if the email is empty
      setError("Please fill in your email address.");
      return;
    }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      toast.success("Password reset email sent!");
      setEmail("");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Tabs className="w-[400px]">
        <Card className="!bg-white">
          <CardHeader>
            <CardTitle className="!text-gray-800">Forgot Password</CardTitle>
            <p className="text-sm text-gray-500 my-4">
              Enter your registered email address, and we’ll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 !text-gray-600">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSendResetLink}>
              Send Reset Link
            </Button>
            <Button className="ml-2 !bg-gray-100 !text-black" onClick={handleCancel}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Tabs>
    </div>

  );
};
