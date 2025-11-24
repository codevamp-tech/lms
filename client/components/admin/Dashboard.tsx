"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getUserIdFromToken } from "@/utils/helpers"
import useCourses from "@/hooks/useCourses"
import Link from "next/link"

const StatCard: React.FC<{
  label: string
  value: string | number
  href?: string
  isLoading?: boolean
}> = ({ label, value, href, isLoading }) => {
  const content = (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="pb-3 sm:pb-4 md:pb-5">
        <CardTitle className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-700">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-3 md:pt-4">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 break-words line-clamp-2 sm:line-clamp-none">
          {isLoading ? "..." : value}
        </p>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

const Dashboard: React.FC = () => {
  const { getCreatorCoursesQuery } = useCourses()
  const userId = getUserIdFromToken()
  const { data: response, isLoading, error } = getCreatorCoursesQuery(userId, 1)
  const purchasedCourse = response?.courses || []

  const totalCourses = purchasedCourse?.length || 0

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px] p-4 sm:p-6 md:p-8 text-sm sm:text-base"
        role="status"
        aria-live="polite"
      >
        Loading courses...
      </div>
    )
  }

  const courseData = Array.isArray(purchasedCourse)
    ? purchasedCourse.map((course) => ({
      name: course.courseTitle,
      price: course.coursePrice,
    }))
    : []

  const totalRevenue = Array.isArray(purchasedCourse)
    ? purchasedCourse.reduce((acc, course) => {
      const enrolledStudents = course.enrolledStudents?.length || 0
      return acc + course.coursePrice * enrolledStudents
    }, 0)
    : 0

  const totalSales = Array.isArray(purchasedCourse)
    ? purchasedCourse.reduce((acc, course) => {
      const enrolledStudents = course.enrolledStudents?.length || 0
      return acc + enrolledStudents
    }, 0)
    : 0

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px] p-4 sm:p-6 md:p-8 text-sm sm:text-base text-red-600"
        role="alert"
      >
        Error: {error.message}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <StatCard label="Total Courses" value={totalCourses} href="/admin/courses" />
        <StatCard label="Total Sales" value={totalSales} />
        <StatCard label={`Total Revenue`} value={`₹ ${totalRevenue}`} />

        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader className="pb-3 sm:pb-4 md:pb-5 px-4 sm:px-6">
              <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-700">
                Course Prices
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <ResponsiveContainer width="100%" height={200} className="sm:h-64 md:h-80 lg:h-96 -mx-3 sm:-mx-6">
                <LineChart data={courseData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    angle={-45}
                    textAnchor="end"
                    interval={Math.max(0, Math.ceil(courseData.length / 5) - 1)}
                    tick={{ fontSize: 11 }}
                    height={80}
                    className="text-xs"
                    style={{ overflow: "visible" }}
                  />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} className="text-xs" width={40} />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Price"]}
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    wrapperClassName="text-xs sm:text-sm"
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {courseData.length === 0 && (
        <div className="flex items-center justify-center p-6 sm:p-8 md:p-12 text-center">
          <div>
            <p className="text-sm sm:text-base text-gray-500 mb-2">No courses available</p>
            <p className="text-xs sm:text-sm text-gray-400">Create your first course to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
