"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Search, X, Edit, Delete, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateCompanyForm from './createCompany';
import Link from 'next/link';

interface Company {
  subscriptionType: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/companies/all-company');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError('Failed to fetch companies.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/companies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company._id !== id)
        );
      } else {
        console.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }

  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company List</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Company
        </button>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-medium">Create New Company</DialogTitle>
          </DialogHeader>
          <CreateCompanyForm
            onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchCompanies();
              // Refresh the list after successful submission
            }} />
        </DialogContent>
      </Dialog>
      <div className="mb-4 relative">
        <div className="flex items-center bg-card">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="dark:bg-navBackground">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-900">
            {paginatedCompanies.map(company => (
              <tr key={company._id} className="hover:bg-gray-50 dark:hover:bg-black">
                <td className="px-6 py-4 whitespace-nowrap">{company.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.subscriptionType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${company.status === 'Active'
                    ? 'bg-green-800 text-white'
                    : company.status === 'Inactive'
                      ? 'bg-red-800 text-white'
                      : 'bg-blue-500 text-white'
                    }`}>
                    {company.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/company/${company._id}`}>
                    <button
                      className=" transition-colors"
                    >
                      <Edit className="h-5 w-5 text-blue-600 hover:text-blue-900" />
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(company._id)}>
                    <Trash2 className="h-5 w-5 ml-3 text-red-600 hover:text-red-800" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCompanies.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyList;