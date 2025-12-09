"use client"
import { Skeleton } from "@/components/ui/skeleton"
import type React from "react"

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import useCourses from "@/hooks/useCourses"
import useLiveSessions from "@/hooks/useLiveSessions"
import { getUserIdFromToken } from "@/utils/helpers"
import Course from "@/components/student/Course"
import { ArrowLeft, BookOpen, Video, Clock, Calendar, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface CourseType {
  _id: string
  isPrivate: boolean
  category: string
  companyId: string
  courseThumbnail: string
  courseMRP: number
  coursePrice: number
  courseTitle: string
  creator?: {
    photoUrl?: string
    name: string
  }
  courseLevel: string
}

interface LiveSessionData {
  _id: string
  title: string
  date: string
  duration: number
  price: number
  imageUrl?: string
  enrolledUsers?: string[]
  link?: string
}

const CoursesPage = () => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showOtherCompanies, setShowOtherCompanies] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const bottomRef = useRef(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId")
    setCompanyId(storedCompanyId)
    setIsInitialized(true)

    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const { getPublishedCoursesQuery } = useCourses()
  const { getLiveSessionsQuery } = useLiveSessions()
  const userId = getUserIdFromToken()

  const { data, isLoading } = getPublishedCoursesQuery(currentPage, 8, companyId)
  const { data: sessionsData, isLoading: sessionsLoading } = getLiveSessionsQuery()

  const publicCourses = data?.courses?.filter((course) => !course.isPrivate) || []

  const courseCategory = [...new Set(publicCourses.map((course) => course.category))]

  const filteredCourses = companyId
    ? data?.courses?.filter((course) => (showOtherCompanies ? true : course.companyId === companyId))
    : publicCourses

  const categoryFilteredCourses = selectedCategory
    ? filteredCourses.filter((course) => course.category === selectedCategory)
    : filteredCourses

  useEffect(() => {
    if (isLoading) return
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < data?.totalPages) {
          setCurrentPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 },
    )

    if (bottomRef.current) observerRef.current.observe(bottomRef.current)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [isLoading, currentPage, data?.totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const getSessionStatus = (session: LiveSessionData) => {
    const start = new Date(session.date)
    const end = new Date(start.getTime() + session.duration * 60000)
    const thirtyMinutesBefore = new Date(start.getTime() - 30 * 60000)

    if (now < thirtyMinutesBefore) return "upcoming"
    if (now >= thirtyMinutesBefore && now <= end) return "live"
    return "completed"
  }

  const getCountdown = (session: LiveSessionData) => {
    const start = new Date(session.date).getTime()
    const diff = start - now.getTime()

    if (diff <= 0) return "Starting Soon..."

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff / (1000 * 60)) % 60)

    return `${hours}h ${minutes}m`
  }

  if (!isInitialized) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ===== SECTION 1: RECORDED COURSES ===== */}
        <section className="mb-4 sm:mb-5">
          {/* Section Header with Icon */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Recorded Courses</h2>
            </div>
          </div>

          {/* Courses Grid - Consistent card dimensions (equal height/width) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
            {isLoading && data?.courses?.length === 0 ? (
              Array.from({ length: 8 }).map((_, index) => <CourseSkeleton key={index} />)
            ) : categoryFilteredCourses?.length > 0 ? (
              categoryFilteredCourses.map((course) => <Course key={course._id} course={course} userId={userId} />)
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={BookOpen}
                  title="No recorded courses available"
                  description="Check back soon for more on-demand content"
                />
              </div>
            )}

            {isLoading && data?.courses?.length > 0 && (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-pulse flex space-x-2">
                  <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 w-3"></div>
                  <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 w-3 animation-delay-200"></div>
                  <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 w-3 animation-delay-400"></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-10 w-full"></div>
          </div>
        </section>



        {/* ===== SECTION 2: LIVE LEARNING SESSIONS ===== */}
        <section className="mt-4">
          {/* Section Header with Live Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Live  Sessions
                </h2>
              </div>
            </div>
          </div>
          {/* Live Sessions Grid - Consistent card dimensions with left border accent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
            {sessionsLoading ? (
              Array.from({ length: 6 }).map((_, index) => <LiveSessionSkeleton key={index} />)
            ) : sessionsData && sessionsData.length > 0 ? (
              sessionsData.map((session: LiveSessionData) => {
                const status = getSessionStatus(session)
                const isEnrolled = session.enrolledUsers?.includes(userId!)

                return (
                  <LiveSessionCard
                    key={session._id}
                    session={session}
                    status={status}
                    isEnrolled={isEnrolled}
                    countdown={getCountdown(session)}
                  />
                )
              })
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={Video}
                  title="No live sessions scheduled"
                  description="New sessions will be added soon"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CoursesPage

// ===== COMPONENT: Live Session Card (for consistent layout and styling) =====
interface LiveSessionCardProps {
  session: LiveSessionData
  status: string
  isEnrolled: boolean
  countdown: string
}

const LiveSessionCard = ({ session, status, isEnrolled, countdown }: LiveSessionCardProps) => {


  return (
    <Link href={`/enroll-live`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        {/* Image Container - Fixed Height */}
        {session.imageUrl && (
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
            <img
              src={session.imageUrl || "/placeholder.svg"}
              alt={session.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* Status Badge - Positioned overlay */}

          </div>
        )}

        {/* Content Container - Flexbox to push button to bottom */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-3 line-clamp-2 flex-shrink-0">
            {session.title}
          </h3>

          {/* Info Section */}
          <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex-shrink-0">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">
                {new Date(session.date).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(session.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span>{session.duration} minutes</span>
            </p>
          </div>

          {/* Price */}
          <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex-shrink-0">
            ₹{session.price.toLocaleString()}
          </div>
        </div>
      </Card>
    </Link>
  )
}

// ===== COMPONENT: Empty State =====
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16">
    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{description}</p>
  </div>
)

// ===== COMPONENT: Loading State =====
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-48 mx-auto mb-3" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="mb-16">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
)

// ===== COMPONENT: Course Skeleton (Loading state for recorded courses) =====
const CourseSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm">
    <Skeleton className="w-full h-40 sm:h-48" />
    <div className="p-4 sm:p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
)

// ===== COMPONENT: Live Session Skeleton (Loading state for live sessions) =====
const LiveSessionSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm border-l-4 border-blue-500">
    <Skeleton className="w-full h-40 sm:h-48" />
    <div className="p-4 sm:p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-6 w-1/3 mt-4" />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  </div>
)
