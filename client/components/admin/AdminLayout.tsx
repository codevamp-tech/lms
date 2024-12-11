import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/Navbar';

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        {children}
      </div>
    </div>
  );
}