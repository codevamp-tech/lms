"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

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
  const [users, setUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const companyId = localStorage.getItem("companyId");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    companyId: companyId,
  });

  useEffect(() => {
    // Fetch companies when the component mounts
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:3001/companies/all-company');
        const data = await response.json();
        if (response.ok) {
          setCompanies(data);
        } else {
          setError('Failed to fetch companies.');
        }
      } catch (err) {
        setError('An error occurred while fetching companies.');
      }
    };

    fetchCompanies();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/admins', {
        headers: {
          Authorization: `Bearer ${companyId}`, // Send companyId in Authorization header
        }
      }); // Replace with your backend API URL
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setAdmins(data.admins); // Assuming the response is an array of admins
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prev) => ({ ...prev, companyId: e.target.value }));
  };


  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (emailExists) {
      setError("This email is already registered");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users/addAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok && data._id) {
        await fetchAdmins();

        // Clear the form fields
        setNewUser({ name: "", email: "", password: "", role: "admin", companyId });

        // Close the form
        setIsFormVisible(false);

        // Show success toast
        toast.success(`User added as ${newUser.role}`);
      } else {
        setError("Failed to add user");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-card rounded-xl ">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Admin List</h2>
        <Button
          onClick={() => setIsFormVisible((prev) => !prev)}
        >
          {isFormVisible ? "Cancel" : "Add Admin"}
        </Button>
      </div>
      {isFormVisible && (
        <div className="mt-6 space-y-6 ">
          {error && <div className="text-red-500">{error}</div>}

          {/* Form Fields in Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label className="block text-sm font-medium text-gray-500">Name</Label>
              <Input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <Label className="block text-sm font-medium text-gray-500">Email</Label>
              <Input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <Label className="block text-sm font-medium text-gray-500">Password</Label>
              <Input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Company Section */}
          <div className="mt-4">
            <Label className="block text-sm font-medium text-gray-500 ">Company</Label>
            <select
              name="companyId"
              value={newUser.companyId}
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

          {/* Add User Button */}
          <Button
            onClick={handleAddUser}
          >
            Add Admin
          </Button>
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
                      'No company'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-4 text-center">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default AddUser;
