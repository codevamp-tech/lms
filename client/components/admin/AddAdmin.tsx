"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Search, Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyId: Company | null;
}

const AddUser: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    companyId: "",
  });

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      setNewUser((prev) => ({ ...prev, companyId: storedCompanyId }));
    }
  }, []);

  useEffect(() => {
    // Fetch companies when the component mounts
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/all-company`
        );
        const data = await response.json();
        if (response.ok) {
          setCompanies(data.companies);
        } else {
          toast.error("Failed to fetch companies.");
        }
      } catch (err) {
        toast.error("An error occurred while fetching companies.");
      }
    };

    fetchCompanies();
  }, []);

  const fetchAdmins = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admins?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${companyId}`, // Ensure companyId is a valid token
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAdmins(data.admins); // Set state
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prev) => ({ ...prev, companyId: e.target.value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the email is checked against the actual list of admins
    const emailExists = admins.some(
      (admin) => admin.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (emailExists) {
      toast.error("Email is already registered");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/addAdmin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (response.ok && data._id) {
        await fetchAdmins();

        // Clear the form fields
        setNewUser({ name: "", email: "", password: "", role: "admin", companyId: companyId || "" });

        // Close the form
        setIsFormVisible(false);

        // Show success toast
        toast.success(`User added as ${newUser.role}`);
      } else {
        toast.error("Failed to add user");
      }
    } catch (err) {
      toast.error("An error occurred while adding the user.");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/admin/${adminId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete admin");
      }
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (err) {
      toast.error("Error deleting admin");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-card rounded-xl ">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
          Admin List
        </h2>
        <Button onClick={() => setIsFormVisible((prev) => !prev)}>
          {isFormVisible ? "Cancel" : "Add Admin"}
        </Button>
      </div>
      {isFormVisible && (
        <div className="mt-6 space-y-6 ">
          {/* Form Fields in Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="companyId">Company</Label>
              <select
                id="companyId"
                name="companyId"
                value={newUser.companyId || ""}
                onChange={handleCompanyChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-card text-gray-500 dark:text-white"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company Section */}

          {/* Add User Button */}
          <Button onClick={handleAddUser}>Add Admin</Button>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 dark:text-gray-400 dark:bg-navBackground">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(admins) && admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin._id} className="border-t dark:text-white">
                  <td className="py-3 px-4">{admin.name}</td>
                  <td className="py-3 px-4">{admin.email}</td>
                  <td className="py-3 px-4">{admin.role}</td>
                  <td className="py-3 px-4">
                    {admin.companyId ? (
                      <span>{admin.companyId.name}</span>
                    ) : (
                      "No company"
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-4 text-center">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUser;
