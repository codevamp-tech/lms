"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { getUserIdFromToken } from "@/utils/helpers";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = getUserIdFromToken();

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleCancel} className="mr-2">Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
