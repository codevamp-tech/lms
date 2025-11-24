import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/Navbar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">


      {/* Sidebar */}
      <div className="w-full md:w-56 bg-white shadow-md md:min-h-screen sticky top-0 z-20">
        <Sidebar />
      </div>


      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10">
        <div className="mb-4 block md:hidden">
        </div>
        {children}
      </div>
    </div>
  );
}