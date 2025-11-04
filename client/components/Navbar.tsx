"use client";

import {
  Heart,
  LogOut,
  Menu,
  School,
  ShoppingCart,
  User,
  Shield,
  Settings,
  LayoutDashboard,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
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
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const userId = getUserIdFromToken();
  const { data: user, isLoading, error, refetch } = useUserProfile(userId);
  const [logo, setLogo] = useState<string>("/img/MrLogo.png");

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
      refetch();
    }
  }, [userId, router, refetch]);

  const fetchLogo = useCallback(async () => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/configurations/company/${companyId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch company logo: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].image) {
        setLogo(data[0].image);
      }
    } catch (error) {
      console.error(`Error fetching logo:, ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error fetching user profile</p>;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Company Logo"
              className="h-32 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user?.role === "student" && (
            <>
              <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
            </ul>
             <ul className="space-y-3">
              <li>
                <Link 
                  href="/about-us" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  About us
                </Link>
              </li>
            </ul>
             <ul className="space-y-3">
              <li>
                <Link 
                  href="/courses" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Courses
                </Link>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/our-team" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Our team
                </Link>
              </li>
            </ul>
             <ul className="space-y-3">
              <li>
                <Link 
                  href="/blogs" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Blogs
                </Link>
              </li>
            </ul>
             <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact-us" 
                  className="text-black hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
            </>
          )}
          {user?.role === "instructor" && (
            <>
              <Link
                href="/admin/dashboard"
                className="transition-colors hover:text-foreground/80"
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user?.role === "student" && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/favorites" aria-label="Favorites">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/cart" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </div>
          )}
          {/* New CTAs: Enroll for Live Classes and Download App */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/enroll-live">
              <Button variant="outline" className="hidden md:inline-flex">Enroll for Live Classes</Button>
            </Link>
            <Link href="/download-app">
              <Button variant="outline" className="hidden md:inline-flex">Download App</Button>
            </Link>
          </div>
          <DarkMode />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItems user={user} />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
          <div className="md:hidden">
            <MobileNavbar user={user} logoutHandler={logoutHandler} />
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownMenuItems = ({ user }) => {
  if (!user) return null;

  return (
    <>
      {user.role === "superadmin" && (
        <Link href="/admin/company">
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Add Company</span>
          </DropdownMenuItem>
        </Link>
      )}
      {user.role === "admin" && (
        <>
          <Link href="/admin/addinstructor">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Add Instructor</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/admin/configuration">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </>
      )}
      {user.role === "instructor" && (
        <>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/admin/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
        </>
      )}
      {user.role === "student" && (
        <>
          <Link href="/my-learning">
            <DropdownMenuItem className="cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>My Learning</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
          </Link>
        </>
      )}
    </>
  );
};

const MobileNavbar = ({ user, logoutHandler }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center space-x-2">
              <School className="h-6 w-6" />
              <span className="font-bold">MR ENGLISH LEARNING</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <nav className="flex flex-col space-y-2">
          <MobileNavLinks user={user} />
        </nav>
        <Separator className="my-4" />
        <SheetFooter className="mt-auto">
          <Button
            onClick={logoutHandler}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const MobileNavLinks = ({ user }) => {
  if (!user) return null;
  return (
    <>
      {user.role === "student" && (
        <>
          <Link
            href="/courses"
            className="p-2 rounded-md hover:bg-muted"
          >
            Courses
          </Link>
          <Link
            href="/my-learning"
            className="p-2 rounded-md hover:bg-muted"
          >
            My Learning
          </Link>
          <Link
            href="/favorites"
            className="p-2 rounded-md hover:bg-muted"
          >
            Favorites
          </Link>
          <Link
            href="/cart"
            className="p-2 rounded-md hover:bg-muted"
          >
            Shopping Cart
          </Link>
          <Link
            href="/profile"
            className="p-2 rounded-md hover:bg-muted"
          >
            Edit Profile
          </Link>
        </>
      )}
      {user.role === "instructor" && (
        <>
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-md hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="p-2 rounded-md hover:bg-muted"
          >
            Edit Profile
          </Link>
          <Link
            href="/admin/live-session"
            className="p-2 rounded-md hover:bg-muted"
          >
            Live Session
          </Link>
        </>
      )}
      {user.role === "admin" && (
        <>
          <Link
            href="/admin/addinstructor"
            className="p-2 rounded-md hover:bg-muted"
          >
            Add Instructor
          </Link>
          <Link
            href="/admin/configuration"
            className="p-2 rounded-md hover:bg-muted"
          >
            Settings
          </Link>
        </>
      )}
      {user.role === "superadmin" && (
        <>
          <Link
            href="/admin/company"
            className="p-2 rounded-md hover:bg-muted"
          >
            Add Company
          </Link>
        </>
      )}
      {/* General CTAs available in mobile menu */}
      <Link href="/enroll-live" className="p-2 rounded-md hover:bg-muted">Enroll for Live Classes</Link>
      <Link href="/download-app" className="p-2 rounded-md hover:bg-muted">Download App</Link>
    </>
  );
};

export default Navbar;
