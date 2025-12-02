"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getUserIdFromToken } from "@/utils/helpers"
import useCourses from "@/hooks/useCourses"
import { TrendingUp, ShoppingCart, DollarSign, BookOpen, IndianRupee } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  href?: string
  isLoading?: boolean
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, href, isLoading, icon, trend, trendUp = true }) => {
  const content = (
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-foreground">
            {isLoading ? <span className="animate-pulse">−−−</span> : value}
          </p>
          {trend && (
            <p className={`text-xs font-medium flex items-center gap-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
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
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="inline-flex animate-spin">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-destructive">Unable to load dashboard</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your teaching performance overview.</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Courses"
          value={totalCourses}
          icon={<BookOpen className="w-5 h-5" />}
        // trend={totalCourses > 0 ? "+2 this month" : "Start creating"}
        />
        <StatCard
          label="Total Sales"
          value={totalSales}
          icon={<ShoppingCart className="w-5 h-5" />}
          // trend={totalSales > 0 ? `${totalSales} transactions` : "No sales yet"}
          trendUp={totalSales > 0}
        />
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="w-5 h-5" />}
          // trend={totalRevenue > 0 ? "↑ 12% from last month" : "Generate revenue"}
          trendUp={totalRevenue > 0}
        />
      </div>

      {/* Empty State */}
      {totalCourses === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card/30 p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">No courses yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first course to start earning and building your teaching portfolio
              </p>
            </div>
            <Link
              href="/add-instructor"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Create Your First Course
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      {/* {totalCourses > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-lg bg-card/50 border border-border">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Avg. Students</p>
            <p className="text-2xl font-bold text-foreground mt-1">{Math.round(totalSales / totalCourses) || 0}</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalSales > 0 ? "85%" : "−−%"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Avg. Revenue</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              ₹
              {totalRevenue > 0
                ? (totalRevenue / totalCourses).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })
                : "0"}
            </p>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Dashboard
