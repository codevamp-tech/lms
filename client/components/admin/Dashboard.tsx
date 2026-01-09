"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getUserIdFromToken } from "@/utils/helpers"
import useCourses from "@/hooks/useCourses"
import { TrendingUp, ShoppingCart, DollarSign, BookOpen, IndianRupee } from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useEffect, useState } from "react"

interface StatCardProps {
  label: string
  value: string | number
  href?: string
  isLoading?: boolean
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

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

  const totalCourses = response?.totalCourses ?? 0
  const totalSales = capturedPayments.length ?? 0
  const totalRevenue = response?.totalRevenue ?? 0

  // Example chart data (replace with backend chart data if available)
  const salesData = [
    { month: "Jan", sales: totalSales / 2 },
    { month: "Feb", sales: totalSales },
    { month: "Mar", sales: totalSales * 1.4 },
  ]

  const revenueData = [
    { name: "Revenue", value: totalRevenue },
    { name: "Courses", value: totalCourses * 500 },
  ]

  const coursesDistribution = [
    { name: "Paid", value: totalCourses },
    { name: "Free", value: totalCourses > 0 ? 2 : 0 },
  ]

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
        />
        <StatCard
          label="Total Sales"
          value={totalSales}
          icon={<ShoppingCart className="w-5 h-5" />}
          trendUp={totalSales > 0}
        />
        {/* <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="w-5 h-5" />}
          trendUp={totalRevenue > 0}
        /> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Line Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Bar Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coursesDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {coursesDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Courses Pie Chart */}
        {/* <Card className="p-4 lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coursesDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {coursesDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

      </div>
    </div>
  )
}

export default Dashboard
