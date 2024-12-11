"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";

const SIDEBAR_LINKS = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: ChartNoAxesColumn
  },
  {
    href: '/admin/courses',
    label: 'Courses',
    icon: SquareLibrary
  }
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen">
        <div className="space-y-4">
          {SIDEBAR_LINKS.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`
                flex items-center gap-2 
                transition-colors duration-200 
                hover:text-blue-600 
                ${pathname === link.href ? 'text-blue-600 font-semibold' : 'text-gray-700'}
              `}
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