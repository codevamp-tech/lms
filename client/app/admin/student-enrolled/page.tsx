"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Users, BookOpen, Mail, User } from "lucide-react";
import useCourses from "@/hooks/useCourses";
import { useUserProfile } from "@/hooks/useUsers";
import { getUserIdFromToken } from "@/utils/helpers";

interface User {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface Course {
  _id: string;
  courseTitle: string;
  coursePrice?: string;
  enrolledStudents: User[];
  totalEnrolled: number;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function CoursesWithStudents() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = getUserIdFromToken();
  const { data: user, isLoading: userLoading } = useUserProfile(userId);
  const [userRole, setUserRole] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
      setCurrentPage(1);
    }
  }, [user]);

  const { getAdminCoursesQuery } = useCourses();

  const { data, isLoading, error } = getAdminCoursesQuery(
    user?.role || "",
    user?.role === "instructor" ? userId : undefined,
    currentPage.toString()
  );

  useEffect(() => {
    if (data?.courses) {
      setCourses(
        data.courses.map((course: any) => ({
          ...course,
          enrolledStudents: [],
          totalEnrolled: course.enrolledStudents?.length || 0,
        }))
      );
    }
  }, [data]);

  const toggleAccordion = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/courses/${courseId}/sales`
      );

      const salesData = res.data.data;

      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? {
                ...course,
                enrolledStudents: salesData.enrolledUsers,
                totalEnrolled: salesData.totalEnrolled,
              }
            : course
        )
      );

      setExpandedCourse(courseId);
    } catch (err) {
      console.error("Failed to fetch enrolled students", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Courses
            </h1>
          </div>
          <p className="text-gray-600 ml-14">Manage your courses and track student enrollments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {courses.reduce((sum, course) => sum + course.totalEnrolled, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. per Course</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {courses.length > 0 
                    ? Math.round(courses.reduce((sum, course) => sum + course.totalEnrolled, 0) / courses.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-5 flex justify-between items-center bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                onClick={() => toggleAccordion(course._id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">{course.courseTitle}</h3>
                    <span>{course.coursePrice ? `Price: ${course.coursePrice}` : 'No price set'}   </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {course.totalEnrolled} {course.totalEnrolled === 1 ? 'student' : 'students'} enrolled
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {loading && expandedCourse === course._id && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    expandedCourse === course._id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {expandedCourse === course._id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {expandedCourse === course._id && (
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                  {course.enrolledStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No students enrolled yet</p>
                      <p className="text-gray-400 text-sm mt-1">Students will appear here once they enroll</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Enrolled Students ({course.enrolledStudents.length})
                      </h4>
                      <div className="grid gap-3">
                        {course.enrolledStudents.map((student) => (
                          <div
                            key={student._id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                          >
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {courses.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500">Create your first course to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}