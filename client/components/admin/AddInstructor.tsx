"use client";
import { getInstructor } from "@/features/api/users/route";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";
import { toggleInstructorStatus } from "@/features/api/users/route";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { headers } from "next/headers";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { error } from "console";

interface Instructor {
  createdAt: ReactNode;
  isStatus: boolean;
  InstructorStatus: string;
  status: string;
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

const AddInstructor: React.FC = () => {
  const userId = getUserIdFromToken();
  const { data: user, refetch } = useUserProfile(userId);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    password: "",
    email: "",
    role: "instructor",
    companyId: "",
  });

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
      setNewInstructor((prev) => ({ ...prev, companyId: storedCompanyId }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();


    const emailExists = instructors.some(
      (instructor) =>
        instructor.email.toLowerCase() === newInstructor.email.toLowerCase()
    );
    if (emailExists) {
      toast.error("This email is already registered");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users/addinstructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructor),
      });

      const data = await response.json();

      if (response.ok && data._id) {
        setInstructors((prevInstructors) => [...prevInstructors, data]);
        setNewInstructor({ name: "", email: "", password: "", role: "instructor", companyId: companyId || "" });
        setShowAddForm(false);
      } else if (data.error?.includes('Email already in use')) {
        toast.error("This email is already registered. Please use a different email.");
      } else {
        toast.error("This email is already registered. Please use a different email.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unknown error occurred");
    }
  };

  const handleChangeStatus = async (id: string, status: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/users/toggle-status/${id}?status=${!status}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();

      setInstructors(prev =>
        prev.map(instructor =>
          instructor._id === id ? { ...instructor, isStatus: !status } : instructor
        )
      );

      toast.success(`Instructor ${!status ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      toast.error("Failed to toggle instructor status");
    }
  };
  const ITEMS_PER_PAGE = 7;

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const fetchInstructors = async (page = 1) => {
    try {
      const data = await getInstructor(page,);
      if (data.success && Array.isArray(data.instructors)) {
        setInstructors(data.instructors);
        setTotalPages(data.totalPages); // Use totalPages from the API
      } else {
        toast.error("Unexpected response format");
      }
    } catch (err) {
      toast.error("Failed to fetch instructors");
    }
  };

  useEffect(() => {
    fetchInstructors(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log("paginated", paginatedInstructors);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSuggestionClick = (email: string) => {
    setSearchTerm(email);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="p-4 dark:bg-card">
      {user?.role === "admin" && (
        <div className="bg-white dark:bg-card rounded-lg shadow">
          <div className="p-6 flex justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-white">Instructors</h2>
            <div className="flex-1 max-w-md relative">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  className="pl-10 pr-8 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredInstructors.map((instructor) => (
                    <div
                      key={instructor._id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onMouseDown={() => handleSuggestionClick(instructor.email)}
                    >
                      <div className="font-medium dark:text-white">{instructor.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{instructor.email}</div>
                    </div>
                  ))}
                  {filteredInstructors.length === 0 && (
                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                      No matching instructors found
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Instructor
            </button>
          </div>

          {/* {error && (
            <div className="p-4 text-red-500 text-sm bg-red-100 dark:bg-red-900 rounded-lg">
              {error}
            </div>
          )} */}

          {showAddForm && (
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newInstructor.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={newInstructor.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={newInstructor.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 sm:text-sm"
                  />

                </div>
                <Button
                  onClick={handleAddInstructor}
                  className="dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </div>
          )}
          <div className="p-6">
            {paginatedInstructors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ?
                      "No instructors match your search." :
                      "No instructors found. Click 'Add Instructor' to create one."
                    }
                  </div>
                </td>
              </tr>
            ) : (
              <div>
                <div className=" h-96 overflow-hidden rounded-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {paginatedInstructors.map((instructor) => (
                        <tr key={instructor._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-500 dark:text-white">
                              {instructor.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-white">
                              {instructor.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-white">
                              {instructor.createdAt ? new Date(instructor.createdAt as string).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              onClick={() => handleChangeStatus(instructor._id, instructor.isStatus)}
                              className={instructor.isStatus ? 'bg-green-500 hover:bg-green-600 hover:text-white text-white w-[82px]' : 'bg-red-500 hover:bg-red-600 hover:text-white text-white'}
                            >
                              {instructor.isStatus ? 'Active' : 'Inactive'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-2 mt-4">

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInstructor;
