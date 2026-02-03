"use client"

import type React from "react"
import Image from "next/image";

import { loginUser, signupUser, sendOtp, verifyOtp, resendOtp } from "@/features/api/users/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, BookOpen, Phone, ArrowLeft, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const Login = () => {
  const router = useRouter();

  // Auth method toggle
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  // OTP Flow States
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email/Password States
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    number: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, type: "signup" | "login") => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
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
      setCountdown(30); // 30 seconds cooldown
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

      if (response?.user) {
        const { _id, companyId, role, name, phone } = response.user;

        if (companyId) localStorage.setItem("companyId", String(companyId));
        if (_id) localStorage.setItem("userId", String(_id));
        if (role) localStorage.setItem("userRole", role);
        if (name) localStorage.setItem("userName", name);
      }

      toast.success("Login successful!");

      // Navigate based on role
      if (response?.user?.role === "instructor") {
        router.push("/admin/courses");
      } else if (response?.user?.role === "student") {
        router.push("/");
      } else if (response?.user?.role === "admin") {
        router.push("/admin/add-instructor");
      } else if (response?.user?.role === "superadmin") {
        router.push("/admin/company");
      } else {
        router.push("/");
      }
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

  // Email/Password Login Handler
  const handleEmailLogin = async () => {
    try {
      const response = await loginUser(loginInput);
      setLoginInput({ email: "", password: "" });

      if (response?.user) {
        const { _id, companyId, role, name } = response.user;

        if (companyId) localStorage.setItem("companyId", String(companyId));
        if (_id) localStorage.setItem("userId", String(_id));
        if (role) localStorage.setItem("userRole", role);
        if (name) localStorage.setItem("userName", name);
      }

      toast.success("Login successful!");

      if (response?.user?.role === "instructor") {
        router.push("/admin/courses");
      } else if (response?.user?.role === "student") {
        router.push("/");
      } else if (response?.user?.role === "admin") {
        router.push("/admin/add-instructor");
      } else if (response?.user?.role === "superadmin") {
        router.push("/admin/company");
      } else {
        toast.error("Unsupported role detected. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Signup Handler
  const handleSignup = async () => {
    try {
      await signupUser(signupInput);
      setSignupInput({ name: "", email: "", password: "", role: "student", number: "" });
      toast.success("Signup successful! You can now log in.");
    } catch (error: any) {
      toast.error("Email is already registered. Please try a different email.");
    }
  };

  // Reset OTP flow
  const resetOtpFlow = () => {
    setOtpStep("phone");
    setOtpInput("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl border bg-background/80 shadow-xl backdrop-blur-sm">

        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-secondary/90 text-secondary-foreground p-10 xl:p-14 flex-col justify-between relative">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="flex flex-col items-start cursor-pointer" onClick={() => router.push("/")}>
              <Image
                src="/img/MrLogo.png"
                alt="Mr English Training Academy"
                width={200}
                height={65}
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl xl:text-4xl font-serif font-semibold tracking-tight">
                Master English with confidence
              </h1>
              <p className="text-secondary-foreground/75 text-sm leading-relaxed">
                Build real-world communication skills with guided practice, expert
                instructors, and a curriculum designed for fast progress.
              </p>
            </div>

            <div className="space-y-4">
              {/* <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quick OTP Login</p>
                  <p className="text-xs text-secondary-foreground/70">
                    Sign in instantly with your phone number via SMS OTP.
                  </p>
                </div>
              </div> */}

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                  <BookOpen className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Structured programs</p>
                  <p className="text-xs text-secondary-foreground/70">
                    Step-by-step courses for students, job seekers, and professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex items-center justify-between text-xs text-secondary-foreground/70">
            <p>Trusted by learners across multiple cities.</p>
            <p>100% online + classroom options.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-6 flex flex-col items-center justify-center lg:hidden">
              <Image
                src="/img/MrLogo.png"
                alt="Mr English Training Academy"
                width={200}
                height={65}
                className="mb-4"
                priority
              />
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 rounded-lg bg-muted p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-md text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-md text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <CardHeader className="space-y-2 pb-4 px-0">
                  <CardTitle className="text-2xl font-serif font-semibold tracking-tight">
                    Welcome back
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sign in to continue your learning journey.
                  </p>
                </CardHeader>

                {/* Auth Method Toggle */}
                {/* <div className="flex gap-2 mb-4">
                  <Button
                    variant={authMethod === "phone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setAuthMethod("phone"); resetOtpFlow(); }}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone OTP
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
                </div> */}

                <CardContent className="space-y-4 px-0">
                  {/* Phone OTP Login */}
                  {/* {authMethod === "phone" && (
                    <>
                      {otpStep === "phone" ? (
                        // Step 1: Enter Phone Number
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                            <div className="relative">
                              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="phone"
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="Enter 10-digit number"
                                className="h-11 pl-10"
                                maxLength={10}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              We'll send you a 6-digit OTP via SMS
                            </p>
                          </div>

                          <Button
                            onClick={handleSendOtp}
                            disabled={isLoading || phoneInput.length < 10}
                            className="h-11 w-full font-semibold"
                          >
                            {isLoading ? "Sending..." : "Send OTP"}
                          </Button>
                        </div>
                      ) : (
                        // Step 2: Enter OTP
                        <div className="space-y-4">
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

                          <div className="space-y-2">
                            <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
                            <Input
                              id="otp"
                              type="text"
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="Enter 6-digit OTP"
                              className="h-11 text-center text-lg tracking-widest"
                              maxLength={6}
                            />
                          </div>

                          <Button
                            onClick={handleVerifyOtp}
                            disabled={isLoading || otpInput.length !== 6}
                            className="h-11 w-full font-semibold"
                          >
                            {isLoading ? "Verifying..." : "Verify & Login"}
                          </Button>

                          <div className="text-center">
                            {countdown > 0 ? (
                              <p className="text-sm text-muted-foreground">
                                Resend OTP in {countdown}s
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
                        </div>
                      )}
                    </>
                  )} */}

                  {/* Email Login */}
                  {authMethod === "email" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="login-email"
                            name="email"
                            type="email"
                            value={loginInput.email}
                            onChange={(e) => changeInputHandler(e, "login")}
                            placeholder="you@example.com"
                            className="h-11 pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                          <Link
                            href="/forget-password"
                            className="text-xs font-medium text-accent hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="login-password"
                            name="password"
                            type="password"
                            value={loginInput.password}
                            onChange={(e) => changeInputHandler(e, "login")}
                            placeholder="Enter your password"
                            className="h-11 pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleEmailLogin}
                        className="h-11 w-full font-semibold"
                      >
                        Sign in
                      </Button>
                    </>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-4 px-0">
                  <p className="text-sm text-center text-muted-foreground">
                    New to the academy?{" "}
                    <span className="font-medium text-blue-500 hover:underline cursor-pointer">
                      Create your free account.
                    </span>
                  </p>
                </CardFooter>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <CardHeader className="space-y-2 pb-4 px-0">
                  <CardTitle className="text-2xl font-serif font-semibold tracking-tight">
                    Create your account
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Join the academy and start improving your English today.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        name="name"
                        value={signupInput.name}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="John Doe"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={signupInput.email}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="you@example.com"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={signupInput.password}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="Create a strong password"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-mobile" className="text-sm font-medium">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-mobile"
                        name="number"
                        type="tel"
                        value={signupInput.number}
                        onChange={(e) => changeInputHandler(e, "signup")}
                        placeholder="9876543210"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can use this for quick OTP login later.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Account type</Label>
                    <Input
                      type="text"
                      value="Student"
                      readOnly
                      className="h-11 cursor-not-allowed border-dashed bg-muted/50 text-muted-foreground"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4 px-0">
                  <Button
                    onClick={handleSignup}
                    className="h-11 w-full font-semibold"
                  >
                    Create account
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-accent hover:underline"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
