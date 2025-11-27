"use client"

import type React from "react"
import Image from "next/image";

import { loginUser, signupUser } from "@/features/api/users/route";
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
import { Mail, Lock, User, BookOpen } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const router = useRouter()
  const [signupError, setSignupError] = useState<string | null>(null);


  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, type: "signup" | "login") => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleSubmit = async (type: "signup" | "login") => {
    console.log('type', type);
    if (type === "signup") {
      try {
        await signupUser(signupInput);
        setSignupInput({ name: "", email: "", password: "", role: "student" });

        toast.success("Signup successful! You can now log in.");
      } catch (error: any) {
        if (error.response?.data?.message === 'Email already in use') {
          toast.error("Email is already registered. Please try a different email.");
        } else {
          toast.error("Email is already registered.Please try a different email.");
        }
      }
    } else {
      try {
        const response = await loginUser(loginInput);
        setLoginInput({ email: "", password: "" });

        if (response?.user) {
          const { _id, companyId, role, name } = response.user;

          if (companyId) {
            localStorage.setItem("companyId", String(companyId));
          }
          if (_id) {
            localStorage.setItem("userId", String(_id));
          }
          if (role) {
            localStorage.setItem("userRole", role);
          }
          if (name) {
            localStorage.setItem("userName", name);
          }
        }

        toast.success("Login successful!");

        if (response?.user?.role === "instructor") {
          router.push("/admin/dashboard");
        } else if (response?.user?.role === "student") {
          router.push("/");
        } else if (response?.user?.role === "admin") {
          router.push("/admin/addinstructor");
        } else if (response?.user?.role === "superadmin") {
          router.push("/admin/company");
        } else {
          toast.error("Unsupported role detected. Please contact support.");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please check your credentials.");

      }
    }
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

          {/* ⭐ UPDATED LEFT HEADER WITH LOGO */}
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col items-start">
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
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                  <Image
                    src="/img/MrLogo.png"
                    alt="Academy Icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Certified instructors</p>
                  <p className="text-xs text-secondary-foreground/70">
                    Learn from experienced trainers who specialise in spoken English.
                  </p>
                </div>
              </div>

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

              {/* Login */}
              <TabsContent value="login">
                <CardHeader className="space-y-2 pb-4 px-0">
                  <CardTitle className="text-2xl font-serif font-semibold tracking-tight">
                    Welcome back
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sign in to continue your learning journey.
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 px-0">
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
                        href="/forgot-password"
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
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4 px-0">
                  <Button
                    onClick={() => handleSubmit("login")}
                    className="h-11 w-full font-semibold"
                  >
                    Sign in
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    New to the academy?{" "}
                    <span className="font-medium text-blue-500 hover:underline">
                      Create your free account.
                    </span>
                  </p>
                </CardFooter>

              </TabsContent>

              {/* Signup */}
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
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters, with letters and numbers.
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
                    onClick={() => handleSubmit("signup")}
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
          </div >
        </div >

      </div >
    </div >
  )
}

export default Login
