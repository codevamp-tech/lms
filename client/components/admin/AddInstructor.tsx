"use client";
import { getInstructor } from "@/features/api/users/route";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";

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
  const { data: user } = useUserProfile(userId);
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

  const ITEMS_PER_PAGE = 7;

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/addinstructor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newInstructor),
        }
      );

      const data = await response.json();

      if (response.ok && data._id) {
        setInstructors((prev) => [...prev, data]);
        setNewInstructor({
          name: "",
          email: "",
          password: "",
          role: "instructor",
          companyId: companyId || "",
        });
        setShowAddForm(false);
      } else {
        toast.error("This email is already registered.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unknown error occurred");
    }
  };

  const handleChangeStatus = async (id: string, status: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/toggle-status/${id}?status=${!status}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === id
            ? { ...instructor, isStatus: !status }
            : instructor
        )
      );

      toast.success(
        `Instructor ${!status ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to toggle instructor status");
    }
  };

  const fetchInstructors = async (page = 1) => {
    try {
      const data = await getInstructor(page, ITEMS_PER_PAGE);

      if (data?.success && Array.isArray(data.instructors)) {
        setInstructors(data.instructors);
        setTotalPages(data.totalPages ?? 1);
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

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedInstructors = filteredInstructors;

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
    <div className="p-4 md:p-6 lg:p-8 dark:bg-card">
      {user?.role === "admin" && (
        <div className="bg-white dark:bg-card rounded-lg shadow">

          {/* Header */}
          <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-white">
              Instructors
            </h2>

            {/* Search */}
            <div className="w-full md:flex-1 max-w-md relative">
              <div className="flex items-center gap-2 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 100)
                  }
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

              {/* Suggestions */}
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredInstructors.map((instructor) => (
                    <div
                      key={instructor._id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onMouseDown={() =>
                        handleSuggestionClick(instructor.email)
                      }
                    >
                      <div className="font-medium dark:text-white">
                        {instructor.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {instructor.email}
                      </div>
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

            {/* Add button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
              Add Instructor
            </button>
          </div>

          {/* Add Instructor Form */}
          {showAddForm && (
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={newInstructor.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 block text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
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
                  className="w-full mt-1 block text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
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
                  className="w-full mt-1 block text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>

              <Button className="w-full md:w-auto dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleAddInstructor}>
                Save
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="p-6">
            {paginatedInstructors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No instructors match your search."
                      : "No instructors found. Click 'Add Instructor' to create one."}
                  </div>
                </td>
              </tr>
            ) : (
              <div>
                {/* Responsive scroll */}
                <div className="h-96 overflow-x-auto rounded-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                      <tr>
                        {["Name", "Email", "Date", "Status"].map((head) => (
                          <th
                            key={head}
                            className="px-4 md:px-6 py-3 text-[12px] md:text-xs font-medium uppercase text-gray-500 dark:text-white tracking-wider text-left"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {paginatedInstructors.map((instructor) => (
                        <tr key={instructor._id}>
                          <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm font-medium text-gray-700 dark:text-white">
                            {instructor.name || "N/A"}
                          </td>

                          <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm text-gray-600 dark:text-gray-200">
                            {instructor.email}
                          </td>

                          <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm text-gray-600 dark:text-gray-200">
                            {instructor.createdAt
                              ? new Date(
                                instructor.createdAt as string
                              ).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="px-4 md:px-6 py-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleChangeStatus(
                                  instructor._id,
                                  instructor.isStatus
                                )
                              }
                              className={`w-[70px] md:w-[82px] text-white ${instructor.isStatus
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                              {instructor.isStatus ? "Active" : "Inactive"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row md:justify-end items-center gap-3 mt-4 text-center md:text-right">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-full md:w-auto"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-full md:w-auto"
                  >
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