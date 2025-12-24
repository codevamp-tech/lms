"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // 🔹 Fetch students
  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/users/students?page=${page}&limit=${ITEMS_PER_PAGE}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error(error.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  // 🔹 Open edit modal
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
    });
  };

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update student
  const handleUpdate = async () => {
    if (!editingStudent) return;

    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/users/students/${editingStudent._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update student");
      }

      toast.success("Student updated successfully");
      setEditingStudent(null);
      fetchStudents(currentPage);
    } catch (error: any) {
      toast.error(error.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 🔹 Filter students
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 🔹 Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // 🔹 Handle suggestion click
  const handleSuggestionClick = (email: string) => {
    setSearchTerm(email);
    setShowSuggestions(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 dark:bg-card">
      <div className="bg-white dark:bg-card rounded-lg shadow">
        {/* Header */}
        <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-white">
            Student List
          </h2>

          {/* Search */}
          <div className="w-full md:flex-1 max-w-md relative">
            <div className="flex items-center gap-2 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search students..."
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

            {/* Suggestions */}
            {showSuggestions && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(student.email)}
                  >
                    <div className="font-medium dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {student.email}
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    No matching students found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Loading students...
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No students match your search."
                  : "No students found."}
              </p>
            </div>
          ) : (
            <>
              {/* Responsive scroll */}
              <div className="h-96 overflow-x-auto rounded-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    <tr>
                      {["Name", "Email", "Phone", "Date", "Action"].map(
                        (head) => (
                          <th
                            key={head}
                            className="px-4 md:px-6 py-3 text-[12px] md:text-xs font-medium uppercase text-gray-500 dark:text-white tracking-wider text-left"
                          >
                            {head}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm font-medium text-gray-700 dark:text-white">
                          {student.name}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm text-gray-600 dark:text-gray-200">
                          {student.email}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm text-gray-600 dark:text-gray-200">
                          {student.phone || "-"}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-[12px] md:text-sm text-gray-600 dark:text-gray-200">
                          {student.createdAt
                            ? new Date(student.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row md:justify-end items-center gap-3 mt-4 text-center md:text-right">
                <span className="text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[90%] max-w-[380px]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Student
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}