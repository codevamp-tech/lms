"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Tabs } from "./ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import toast from "react-hot-toast";

export const Reset = () => {

  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get('token')

  const handleCancel = () => {
    window.location.href = "/login";
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      await fetch(`http://localhost:3001/users/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      toast.success("Password successfully reset!");
      setPassword("");
      setConfirmPassword("");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Tabs className="w-[400px]">
        <Card className="!bg-white">
          <CardHeader>
            <CardTitle className="!text-gray-800">Reset Password</CardTitle>
            <p className="text-sm text-gray-500 my-4">
              Enter and confirm your new password to reset it.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 !text-gray-600">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                name="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleResetPassword}>
              Reset Password
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
