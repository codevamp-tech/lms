"use client";
import { getInstructor } from "@/features/api/users/route";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Instructor {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

const AddInstructor: React.FC = () => {
  const userId = getUserIdFromToken();
  const { data: user, isLoading, error: profileError, refetch } = useUserProfile(userId);

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for the new instructor form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    password: "",
    email: "",
    role: "instructor", // Default role
  });

  const fetchInstructors = async () => {
    try {
      const data = await getInstructor();

      if (data.success && Array.isArray(data.instructors)) {
        setInstructors(data.instructors);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/users/addinstructor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInstructor),
      });
      const data = await response.json();
      if (response.ok && data._id) {
        setInstructors((prevInstructors) => [
          ...prevInstructors,
          data,
        ]);
        setNewInstructor({ name: "", email: "", password: "", role: "instructor" });
        setShowAddForm(false);
      } else {
        setError("Failed to add instructor:");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    }
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 dark:bg-card">
      {user?.role === "admin" && (
        <div className="bg-white dark:bg-card rounded-lg shadow">
          <div className="p-6  flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-white">Intructors</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white  px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Instructor
            </button>
          </div>

          {showAddForm && (
            <div className="p-6 ">
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-500 dark:text-white">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={newInstructor.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full  px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-500 dark:text-white">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={newInstructor.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium dark:text-white text-gray-500 ">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={newInstructor.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <Button
                  onClick={handleAddInstructor}>
                  Save
                </Button>
              </div>
            </div>
          )}

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4 ">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto h-96  rounded-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead >
                    <tr>
                      <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" divide-y divide-gray-200 dark:divide-gray-800">
                    {instructors.map((instructor) => (
                      <tr key={instructor._id} >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-500 dark:text-white">{instructor.name || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-white">{instructor.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize dark:text-white">{instructor.role}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInstructor;
