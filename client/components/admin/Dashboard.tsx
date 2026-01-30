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

interface CapturedPayment {
  id: string
  amount: number
  created_at: number
  email: string
  contact: string
  description: string
}

const Dashboard: React.FC = () => {
  const [capturedPayments, setCapturedPayments] = useState<CapturedPayment[]>([])
  const [capturedPaymentsLoading, setCapturedPaymentsLoading] = useState(false)
  
  const { useAnalyticsSummary } = useCourses()
  const userId = getUserIdFromToken()
  const { data: response, isLoading, error } = useAnalyticsSummary()

  console.log("Dashboard API Response ===>", response)

  // Fetch captured payments
  useEffect(() => {
    const fetchCapturedPayments = async () => {
      try {
        setCapturedPaymentsLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/razorpay/captured-payments?fetchAll=true`)
        if (!res.ok) throw new Error("Failed to fetch captured payments")
        const data = await res.json()
        setCapturedPayments(data.items || [])
      } catch (err) {
        console.error("Error fetching captured payments:", err)
      } finally {
        setCapturedPaymentsLoading(false)
      }
    }

    fetchCapturedPayments()
  }, [])

  const totalCourses = response?.totalCourses ?? 0
  const totalSales = capturedPayments.length ?? 0
  const totalRevenue = response?.totalRevenue ?? 0
  const totalCapturedAmount = capturedPayments.reduce((sum, payment) => sum + payment.amount, 0)

  // Generate sales data grouped by date (all available data)
  const generateSalesData = () => {
    const dateMap: { [key: string]: { date: string; sales: number } } = {}
    
    capturedPayments.forEach((payment) => {
      const date = new Date(payment.created_at * 1000)
      const dateStr = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
      
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { date: dateStr, sales: 0 }
      }
      dateMap[dateStr].sales += payment.amount / 100 // Convert paise to rupees
    })
    
    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort chronologically
  }

  // Generate product distribution data
  const generateProductDistribution = () => {
    const productMap: { [key: string]: { name: string; value: number; count: number } } = {}
    
    capturedPayments.forEach((payment) => {
      const productName = payment.description || "Unknown"
      
      if (!productMap[productName]) {
        productMap[productName] = { name: productName, value: 0, count: 0 }
      }
      productMap[productName].value += payment.amount / 100
      productMap[productName].count += 1
    })
    
    return Object.values(productMap).sort((a, b) => b.value - a.value)
  }

  const salesData = generateSalesData()
  const productDistribution = generateProductDistribution()

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <StatCard
          label="Total Captured Amount"
          value={`₹${(totalCapturedAmount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<IndianRupee className="w-5 h-5" />}
          isLoading={capturedPaymentsLoading}
          trendUp={totalCapturedAmount > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">

        {/* Sales Line Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Sales Trend (All Data)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                    label={{ value: "Sales", position: "insideLeft", offset: -5 }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Distribution Pie Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Product</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Distribution of total revenue across products</p>
          </CardHeader>
          <CardContent>
            {productDistribution.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Pie Chart */}
                <div className="flex-1 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {productDistribution.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Product Details List */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-80">
                  <h3 className="font-semibold text-foreground mb-4">Product Breakdown</h3>
                  {productDistribution.map((product, index) => {
                    const percentage = ((product.value / (totalCapturedAmount / 100)) * 100).toFixed(1)
                    return (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {product.name.substring(0, 30)}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {product.count} {product.count === 1 ? 'transaction' : 'transactions'}
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              ₹{product.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                No product data available
              </div>
            )}
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
