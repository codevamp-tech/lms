"use client"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Mic, Users } from "lucide-react"
import Link from "next/link"
import useCourses from "@/hooks/useCourses"
import Course from "./Course"
import { Skeleton } from "@/components/ui/skeleton"

const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])
  const [courses, setCourses] = useState<any[]>([])
  const { getPublishedCoursesQuery } = useCourses()
  const { data, isLoading } = getPublishedCoursesQuery(1, 10)

  useEffect(() => {
    if (data?.courses) {
      setCourses(data.courses)
    }
  }, [data])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="relative bg-gradient-to-br from-background via-secondary/30 to-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 px-6">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            variants={fadeInUp}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 rounded-full px-4 py-2 mb-6"
            >
              Popular English Courses
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl tracking-tight font-extrabold text-foreground mb-6"
            >
              <span className="block">Master English</span>
              <span className="block text-primary mt-2">From Basics to Fluency</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Whether you're starting your English journey or looking to achieve fluency, our comprehensive courses cover speaking, listening, reading, and writing skills with real-world applications.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                { icon: BookOpen, text: "Grammar & Vocabulary" },
                { icon: Mic, text: "Speaking Practice" },
                { icon: Users, text: "Group Sessions" }
              ].map((feature, i) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/courses">
                <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                  Explore All Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about-us">
                <Button size="lg" variant="outline" className="rounded-full">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="embla rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20" ref={emblaRef}>
              <div className="embla__container">
                {isLoading && Array.from({ length: 5 }).map((_, i) => <CourseSkeleton key={i} />)}
                {!isLoading &&
                  courses.map((course) => (
                    <div key={course._id} className="embla__slide ">
                      <Link
                        href={`/course/course-detail/${course._id}`}
                        className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                      >
                        {/* LEFT SIDE : Thumbnail */}
                        <div className="w-40 h-28 flex-shrink-0">
                          <img
                            src={course.courseThumbnail ?? ""}
                            alt="thumbnail"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* RIGHT SIDE : Info */}
                        <div className="flex flex-col w-full space-y-2">

                          {/* Title */}
                          <h1 className="font-bold text-lg line-clamp-1 hover:underline">
                            {course.courseTitle}
                          </h1>

                          {/* Subtitle */}
                          {course.subTitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {course.subTitle}
                            </p>
                          )}

                          {/* Instructor + Students */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                                alt="profile"
                                className="w-7 h-7 rounded-full object-cover border"
                              />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {course.creator?.name}
                              </span>
                            </div>

                            {course.enrolledStudents?.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {course.enrolledStudents.length} enrolled
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const CourseSkeleton = () => (
  <div className="embla__slide p-4">
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
)

export default HeroCarousel