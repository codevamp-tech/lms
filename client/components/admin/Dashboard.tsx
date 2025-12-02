"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getUserIdFromToken } from "@/utils/helpers"
import useCourses from "@/hooks/useCourses"

const StatCard: React.FC<{
  label: string
  value: string | number
  href?: string
  isLoading?: boolean
}> = ({ label, value, href, isLoading }) => {
  const content = (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-700">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-blue-600">
          {isLoading ? "..." : value}
        </p>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

const Dashboard: React.FC = () => {
  const { useAnalyticsSummary } = useCourses()
  const userId = getUserIdFromToken()

  const { data: response, isLoading, error } = useAnalyticsSummary()

  console.log("Dashboard API Response ===>", response)

  // Read values directly from API
  const totalCourses = response?.totalCourses ?? 0
  const totalSales = response?.totalSales ?? 0
  const totalRevenue = response?.totalRevenue ?? 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-600">
        Error: {error.message}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Courses" value={totalCourses} />
        <StatCard label="Total Sales" value={totalSales} />
        <StatCard label="Total Revenue" value={`₹${totalRevenue}`} />
      </div>

      {/* No Courses Message */}
      {totalCourses === 0 && (
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-gray-500 mb-2">No courses available</p>
            <p className="text-gray-400 text-sm">Create your first course to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
