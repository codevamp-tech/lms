"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const router = useRouter()


  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, type: "signup" | "login") => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleSubmit = (type: "signup" | "login") => {
    if (type === "signup") {
      signupUser(signupInput)
      setSignupInput({
        name: "",
        email: "",
        password: "",
      })
    } else {
      loginUser(loginInput)
      setLoginInput({ email: "", password: "" })
      router.push('/')
    }
  };

  return (
    <div className="flex items-center h-full w-full bg-gray-50 justify-center pt-15">
      <img
        src="/img/tree-1.png"
        alt="Left Tree"
        className="absolute bottom-[0rem] left-20 w-60 md:w-84 lg:w-80 "
      />
      <img
        src="/img/tree-2.png"
        alt="Right Tree"
        className="absolute bottom-[0rem] right-20 w-48 md:w-64 lg:w-70"
      />
      <Tabs defaultValue="login" className="w-[400px] ">
        <TabsList className="grid w-full grid-cols-2 !bg-gray-100 !text-black">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="signup" >
          <Card className="!bg-white">
            <CardHeader>
              <CardTitle className="!text-gray-800">Signup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 !text-gray-600">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. John Doe"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. johndoe@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Enter a strong password"
                  type="password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubmit("signup")}
              >
                {"Signup"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card className="!bg-white">
            <CardHeader>
              <CardTitle className="!text-gray-800">Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 !text-gray-600">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. johndoe@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Enter your password"
                  type="password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubmit("login")}
              >
                {"Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
