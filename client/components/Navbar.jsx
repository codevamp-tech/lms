"use client";

import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "./DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
// import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
// import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";

const Navbar = () => {
  // const { user } = useSelector((store) => store.auth);
  // const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const router = useRouter();

  const userId = getUserIdFromToken();
  const { data: user, isLoading, error, refetch } = useUserProfile(userId);

  const clearCookies = () => {
    const cookies = document.cookie.split("; ");
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const logoutHandler = async () => {
    clearCookies();
    router.push("/login");
    toast.success("You have been logged out.");
  };

  useEffect(() => {
    if (!userId) {
      clearCookies();
      // router.push("/login");
      refetch();
    }
  }, [userId, router]);
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success(data?.message || "User logged out.");
  //     router.push("/login"); // Redirect to login
  //   }
  // }, [isSuccess, data?.message, router]);
  // const user = {
  //   _id: "12345",
  //   name: "John Doe",
  //   email: "johndoe@example.com",
  //   photoUrl: "https://via.placeholder.com/50", // Replace with a real URL or placeholder
  //   role: "instructor", // Can be "instructor" or "student"
  //   courses: [
  //     {
  //       courseId: "1",
  //       courseTitle: "React for Beginners",
  //       courseProgress: 75, // Percentage of completion
  //     },
  //     {
  //       courseId: "2",
  //       courseTitle: "Advanced JavaScript",
  //       courseProgress: 50,
  //     },
  //   ],
  //   learningPath: [
  //     {
  //       pathId: "101",
  //       pathTitle: "Web Development",
  //       courses: [
  //         { courseId: "1", courseTitle: "React for Beginners" },
  //         { courseId: "2", courseTitle: "Advanced JavaScript" },
  //       ],
  //     },
  //   ],
  //   notifications: [
  //     {
  //       notificationId: "1",
  //       message: "Your course 'React for Beginners' is 75% completed.",
  //       timestamp: new Date().toISOString(),
  //     },
  //     {
  //       notificationId: "2",
  //       message: "A new course 'UI/UX Design Essentials' has been added.",
  //       timestamp: new Date().toISOString(),
  //     },
  //   ],
  // };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user profile</p>;

  return (
    <div className="h-16 dark:bg-navBackground bg-blue-500 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <img
            src="/img/logo.png"
            alt="logo"
            className="h-9 w-9  filter brightness-0 invert "
          />
          <Link href="/">
            <h1 className="hidden md:block font-extrabold text-2xl text-white">
              LMS
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/my-learning">My Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutHandler}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {(user?.role === "super admin" ||
                user?.role === "admin" ||
                user?.role === "instructor") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/admin/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DarkMode />
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex gap-3">
          <img
            src="/img/logo.png"
            alt="logo"
            className="h-9 w-9  filter brightness-0 invert "
          />
          <h1 className="font-extrabold text-2xl">LMS</h1>
        </div>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <Link href="/">E-Learning</Link>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link href="/my-learning">My Learning</Link>
          <Link href="/profile">Edit Profile</Link>
          <p onClick={() => router.push("/login")}>Log out</p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={() => router.push("/admin/dashboard")}
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
