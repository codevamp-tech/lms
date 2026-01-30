"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loginUser, signupUser, sendOtp, verifyOtp, resendOtp } from "@/features/api/users/route";
import { useRouter } from "next/navigation";

export default function LoginModal({
  isOpen,
  onClose,
  defaultTab = "login",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}) {
  const router = useRouter();

  const [tab, setTab] = useState(defaultTab);

  // Auth method toggle
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("phone");

  // OTP Flow States
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    number: "",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOtpStep("phone");
      setOtpInput("");
      setPhoneInput("");
    }
  }, [isOpen]);

  const changeInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "signup" | "login"
  ) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput({ ...signupInput, [name]: value })
      : setLoginInput({ ...loginInput, [name]: value });
  };

  // Send OTP Handler
  const handleSendOtp = async () => {
    if (!phoneInput || phoneInput.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      await sendOtp(phoneInput, "sms");
      toast.success("OTP sent successfully!");
      setOtpStep("otp");
      setCountdown(30);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(phoneInput, otpInput);
      toast.success("Logged in!");

      const user = response?.user;
      if (user) {
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name ?? "");
        localStorage.setItem("userId", user._id);
        if (user.companyId) localStorage.setItem("companyId", String(user.companyId));
      }

      onClose();
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await resendOtp(phoneInput, "text");
      toast.success("OTP resent successfully!");
      setCountdown(30);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Email Login Handler
  const handleEmailLogin = async () => {
    try {
      const response = await loginUser(loginInput);
      toast.success("Logged in!");

      const user = response?.user;
      if (!user) return;

      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name ?? "");
      localStorage.setItem("userId", user._id);

      onClose();
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch {
      toast.error("Invalid credentials");
    }
  };

  // Signup Handler
  const handleSignup = async () => {
    try {
      await signupUser(signupInput);
      toast.success("Signup successful!");
      setTab("login");
    } catch {
      toast.error("Email already registered.");
    }
  };

  // Reset OTP flow
  const resetOtpFlow = () => {
    setOtpStep("phone");
    setOtpInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <Image
              src="/img/MrLogo.png"
              alt="Logo"
              width={160}
              height={50}
            />
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            {/* Auth Method Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={authMethod === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => { setAuthMethod("phone"); resetOtpFlow(); }}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                OTP
              </Button>
              <Button
                variant={authMethod === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMethod("email")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <div className="space-y-4">
              {/* Phone OTP Login */}
              {authMethod === "phone" && (
                <>
                  {otpStep === "phone" ? (
                    <>
                      <div>
                        <Label>Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            className="pl-10"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Enter 10-digit number"
                            maxLength={10}
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleSendOtp}
                        disabled={isLoading || phoneInput.length < 10}
                      >
                        {isLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={resetOtpFlow}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Change number
                      </button>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                          OTP sent to <span className="font-semibold">+91 {phoneInput}</span>
                        </p>
                      </div>

                      <div>
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          className="text-center text-lg tracking-widest"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otpInput.length !== 6}
                      >
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>

                      <div className="text-center">
                        {countdown > 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Resend in {countdown}s
                          </p>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="text-sm text-accent hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Email Login */}
              {authMethod === "email" && (
                <>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        className="pl-10"
                        value={loginInput.email}
                        onChange={(e) => changeInputHandler(e, "login")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="password"
                        type="password"
                        className="pl-10"
                        value={loginInput.password}
                        onChange={(e) => changeInputHandler(e, "login")}
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleEmailLogin}>
                    Login
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="name"
                    className="pl-10"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    className="pl-10"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>

              <div>
                <Label>Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="number"
                    type="tel"
                    className="pl-10"
                    value={signupInput.number}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="For OTP login"
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleSignup}>
                Create Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
