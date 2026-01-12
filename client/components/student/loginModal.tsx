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
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, signupUser } from "@/features/api/users/route";
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

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const changeInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "signup" | "login"
  ) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput({ ...signupInput, [name]: value })
      : setLoginInput({ ...loginInput, [name]: value });
  };

  const handleSubmit = async (type: "signup" | "login") => {
    if (type === "signup") {
      try {
        await signupUser(signupInput);
        toast.success("Signup successful!");
        setTab("login");
      } catch {
        toast.error("Email already registered.");
      }
    } else {
      try {
        const response = await loginUser(loginInput);
        toast.success("Logged in!");

        const user = response?.user;
        if (!user) return;

        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name ?? "");
        localStorage.setItem("userId", user._id);

        onClose(); // ⭐ close modal after login
        setTimeout(() => {
          router.refresh();
        }, 1000)
      } catch {
        toast.error("Invalid credentials");
      }
    }
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
            <div className="space-y-4">
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

              <Button className="w-full" onClick={() => handleSubmit("login")}>
                Login
              </Button>
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

              <Button className="w-full" onClick={() => handleSubmit("signup")}>
                Create Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
