"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesColumn,
  SquareLibrary,
  Store,
  UserPlus,
} from "lucide-react";
import { getUserIdFromToken } from "@/utils/helpers";
import { useUserProfile } from "@/hooks/useUsers";

const SIDEBAR_LINKS = {
  admin: [
    {
      href: "/admin/addinstructor",
      label: "Add Instructor",
      icon: UserPlus,
    },
  ],
  superadmin: [
    {
      href: "/admin/company",
      label: "Create Company",
      icon: Store,
    },
    {
      href: "/admin/addAdmin",
      label: "Create Admin",
      icon: UserPlus,
    },
  ],
  instructor: [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: ChartNoAxesColumn,
    },
    {
      href: "/admin/courses",
      label: "Courses",
      icon: SquareLibrary,
    },
  ],
};

const Sidebar = () => {
  const userId = getUserIdFromToken();
  const { data: user } = useUserProfile(userId);
  const pathname = usePathname();

  const userRole = user?.role;
  const sidebarLinks = SIDEBAR_LINKS[userRole] || [];

  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-400 dark:border-gray-700 p-5 sticky top-0 h-screen">
        <div className="space-y-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 transition-colors duration-200 hover:text-blue-600 ${
                pathname === link.href
                  ? "text-blue-600 font-semibold"
                  : "dark:text-white text-gray-700"
              }`}
            >
              <link.icon size={22} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
