"use client"

import HeroSection from "@/components/student/HeroSection"
import { getQueryClient } from "@/lib/react-query"
import { dehydrate } from "@tanstack/react-query"
import { Hydrate } from "@/lib/hydrate"
import HeroCrousel from "@/components/HeroCrousel"
import TopPickCourse from "@/components/topPick"
import ModernTestimonials from "@/components/testimonial"
import { motion } from "framer-motion"
import Categories from "@/components/categories"
import Features from "@/components/features"
import Instructors from "@/components/instructors"
import CTASection from "@/components/cta"
import LearningMethodology from "@/components/learning-methodology"
import InstaReelsSection from "@/components/InstaReelsSection"
// import SuccessMetrics from "@/components/success-metrics"

export default function Home() {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)
  
  return (
    <Hydrate state={dehydratedState}>
      <HeroSection />
      <HeroCrousel />
      
      {/* <SuccessMetrics /> */}
      
      <TopPickCourse />
      
      <Categories />
      
      < InstaReelsSection />
      
      <LearningMethodology />
      
      <Features />
      
      <Instructors />

      <motion.section
        className="py-16 px-6 bg-gradient-to-b from-background to-secondary/20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        aria-labelledby="spotlight-title"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
              OUR COMMUNITY
            </span>
            <h2 id="spotlight-title" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              English Training in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our vibrant learning community where students practice, grow, and achieve their English goals together
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all"
          >
            <img
              src="/img/hero_page.jpg"
              alt="Students collaborating and learning English together"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      <CTASection />
      <ModernTestimonials />
    </Hydrate>
  )
}