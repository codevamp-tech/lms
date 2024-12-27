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

  const logoutHandler = async () => {
    // await logoutUser();
    console.log("LOGOUT")
  };

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
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link href="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-Learning
            </h1>
          </Link>
        </div>
        {/* User icons and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
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
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/signup")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
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
              <Button type="submit" onClick={() => router.push("/admin/dashboard")}>
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
