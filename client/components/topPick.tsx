"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Zap, Clock, Users, Calendar, Video } from "lucide-react"
import useLiveSessions from "@/hooks/useLiveSessions"
import Link from "next/link"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { LiveSessionData } from "@/features/api/live-session"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

const TopPickCourse = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSessionData[]>([])
  const { getLiveSessionsQuery } = useLiveSessions()
  const { data: liveSessions, isLoading } = getLiveSessionsQuery()
  
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay({ delay: 5000, stopOnInteraction: true })])

  useEffect(() => {
    if (liveSessions && liveSessions.length > 0) {
      // Filter for future sessions and sort by date ascending (nearest first)
      const now = new Date()
      const futureSessions = liveSessions
        .filter(session => new Date(session.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      if (futureSessions.length > 0) {
        setUpcomingSessions(futureSessions)
      } else {
        // Fallback: Just show the most recent ones if no upcoming
        const sortedAll = [...liveSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUpcomingSessions(sortedAll);
      }
    }
  }, [liveSessions])

  if (isLoading || upcomingSessions.length === 0) {
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
            🔴 LIVE SESSIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Upcoming Live Classes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our expert instructors for interactive live learning sessions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {upcomingSessions.map((session, index) => {
                const sessionDate = new Date(session.date);
                return (
                  <div key={session._id || index} className="flex-[0_0_100%] min-w-0 pl-4 pr-4 pb-8 pt-4">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-8 lg:p-12 rounded-3xl border-2 border-primary/20 shadow-2xl bg-card backdrop-blur-sm hover:border-primary/40 transition-all mx-auto h-full">
                      <div className="w-full lg:w-2/5">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                          <img
                            src={session.imageUrl || "/images/default-live.jpg"}
                            alt={session.title}
                            className="relative w-full h-auto object-cover rounded-2xl shadow-xl aspect-video"
                          />
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                            LIVE
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                          {session.title}
                        </h3>

                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          {session.description?.substring(0, 180)}...
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {sessionDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {sessionDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({session.duration} min)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {session.enrolledUsers?.length || 0}+ enrolled
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Interactive</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                          <div className="flex items-center justify-center lg:justify-start gap-3">
                            {session.price > 0 ? (
                              <span className="text-4xl font-bold text-primary">₹{session.price}</span>
                            ) : (
                              <span className="text-4xl font-bold text-green-600 dark:text-green-400">FREE</span>
                            )}
                          </div>
                        </div>

                        <Button size="lg" className="w-full lg:w-auto px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                          <Link href={`/enroll-live`}>
                            <Zap className="mr-2 h-5 w-5" />
                            Enroll Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
      <div className="flex flex-col lg:flex-row items-center gap-10 p-8 lg:p-12 rounded-3xl border-2 shadow-2xl bg-card max-w-6xl mx-auto">
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
        </div>
      </div>
    </div>
  </section>
)

export default TopPickCourse