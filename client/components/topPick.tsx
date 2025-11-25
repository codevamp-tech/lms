"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Star, Zap, Clock, Users, Award } from "lucide-react"
import useCourses from "@/hooks/useCourses"
import Link from "next/link"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

const TopPickCourse = () => {
  const [topPick, setTopPick] = useState<any>(null)
  const { getPublishedCoursesQuery } = useCourses()
  const { data, isLoading } = getPublishedCoursesQuery(1, 10)

  useEffect(() => {
    if (data?.courses?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.courses.length)
      setTopPick(data.courses[randomIndex])
    }
  }, [data])

  if (isLoading || !topPick) {
    return <TopPickSkeleton />
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl transform -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-semibold tracking-wider uppercase text-primary bg-primary/10 rounded-full px-4 py-2 mb-4">
            ⭐ FEATURED COURSE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            This Week's Top English Course
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked by our English experts to accelerate your learning journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-8 lg:p-12 rounded-3xl border-2 border-primary/20 shadow-2xl bg-card backdrop-blur-sm hover:border-primary/40 transition-all"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-2/5"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
              <img
                src={topPick.courseThumbnail || "/images/default-course.jpg"}
                alt={topPick.courseTitle}
                className="relative w-full h-auto object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                Popular
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="mb-2">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/80 bg-primary/10 rounded-full px-3 py-1">
                {topPick.category}
              </span>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {topPick.courseTitle}
            </h3>
            {topPick.subTitle && (
              <p className="text-xl text-muted-foreground/80 font-medium mb-4">
                {topPick.subTitle}
              </p>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {topPick.description?.substring(0, 180) || topPick.courseDescription?.substring(0, 180)}...
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {topPick.courseLevel || "Self-paced"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {topPick.enrolledStudents?.length || 0}+ enrolled
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Certificate</span>
              </div>
              {topPick.lectures?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {topPick.lectures.length} {topPick.lectures.length === 1 ? "Lecture" : "Lectures"}
                  </span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className={
                      i < Math.floor(topPick.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {topPick.rating ? `${topPick.rating} / 5` : "No rating yet"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {topPick.coursePrice > 0 ? (
                  <>
                    <span className="text-4xl font-bold text-primary">₹{topPick.coursePrice}</span>
                    {topPick.courseMRP > topPick.coursePrice && (
                      <span className="text-2xl line-through text-muted-foreground">
                        ₹{topPick.courseMRP}
                      </span>
                    )}
                    {topPick.courseMRP > topPick.coursePrice && (
                      <span className="text-sm text-muted-foreground bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                        {Math.round(((topPick.courseMRP - topPick.coursePrice) / topPick.courseMRP) * 100)}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">FREE</span>
                    <span className="text-sm text-muted-foreground bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                      Limited offer
                    </span>
                  </>
                )}
              </div>
            </div>

            <Link href={`/course/course-detail/${topPick._id}`}>
              <Button size="lg" className="w-full lg:w-auto px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                <Zap className="mr-2 h-5 w-5" />
                Enroll Now & Start Learning
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

const TopPickSkeleton = () => (
  <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-10 p-8 lg:p-12 rounded-3xl border-2 shadow-2xl bg-card">
        <div className="w-full lg:w-2/5">
          <Skeleton className="w-full h-80 rounded-2xl" />
        </div>
        <div className="flex-1 w-full">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-6" />
          <div className="flex gap-6 mb-6">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-12 w-32 mb-8" />
          <Skeleton className="h-14 w-64" />
        </div>
      </div>
    </div>
  </section>
)

export default TopPickCourse