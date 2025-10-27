"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"
import { Star, Quote, Award, TrendingUp, Users } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, useInView, useAnimation } from "framer-motion"
import { useRef } from "react"

const testimonials = [
  {
    id: 1,
    text: "Mr English Training Academy  completely transformed my speaking confidence. The instructors are patient and encouraging. I can now communicate fluently in business meetings!",
    author: "Shahista Nabi.",
    role: "Business Professional",
    rating: 5,
    image: "/img/testimonial-1.webp",
    achievement: "Achieved IELTS 8.0"
  },
  {
    id: 2,
    text: "The interactive sessions and personalized feedback helped me overcome my fear of speaking English. Now I can express myself confidently in any situation!",
    author: "Saqib Majeed",
    role: "University Student",
    rating: 5,
    image: "/img/testimonial-2.webp",
    achievement: "Studying in USA"
  },
  {
    id: 3,
    text: "I've tried many English courses, but Mr English Training Academy  stands out with its practical approach and real-world applications. Highly recommended!",
    author: "Umra Hasan",
    role: "Marketing Manager",
    rating: 5,
    image: "/img/testimonial-3.webp",
    achievement: "Promoted to Team Lead"
  },
  {
    id: 4,
    text: "The grammar and vocabulary modules are excellent. The bite-sized lessons fit perfectly into my busy schedule. My English has improved dramatically!",
    author: "Amir Khan",
    role: "High School Student",
    rating: 5,
    image: "/img/testimonial-4.webp",
    achievement: "Top 5% in Class"
  },
  {
    id: 5,
    text: "From basic conversations to professional presentations, this platform covered it all. The certificate I earned helped me land my dream job!",
    author: "Fatima Zahra",
    role: "Career Changer",
    rating: 5,
    image: "/img/testimonial-5.webp",
    achievement: "New Career Path"
  },
]

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Students", color: "text-blue-500" },
  { icon: Award, value: "95%", label: "Success Rate", color: "text-green-500" },
  { icon: TrendingUp, value: "8.5/10", label: "Personality Development", color: "text-purple-500" },
]

interface TestimonialCardProps {
  text: string
  author: string
  role: string
  rating: number
  image: string
  achievement: string
  index: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, author, role, rating, image, achievement, index }) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-gray-100 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/40 h-full relative overflow-hidden group"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 0.8, rotate: 0 }}
        whileHover={{ scale: 1, rotate: 5 }}
        transition={{ duration: 0.8 }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="flex items-start gap-4 mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <Quote className="w-12 h-12 text-primary/30 flex-shrink-0" />
          <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 + i * 0.1 }}
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.p
          className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
        >
          "{text}"
        </motion.p>
        
        <motion.div
          className="flex items-center gap-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
        >
          <motion.img
            src={image || "/placeholder.svg"}
            alt={author}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{author}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{role}</p>
            <motion.div
              className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {achievement}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const ModernTestimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef(null)
  const statsRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 2000) // Change slide every 2 seconds

    return () => clearInterval(autoplay)
  }, [emblaApi])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Animated background decorations */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="container mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-6"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-semibold text-primary uppercase tracking-wider px-6 py-2 bg-primary/10 rounded-full inline-block"
          >
            SUCCESS STORIES
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white text-balance"
          >
            What Our Students{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Achieve
            </motion.span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of successful English learners who transformed their lives with{" "}
            <span className="font-semibold text-primary">Mr English Training Academy</span>
          </motion.p>

          {/* Stats Section */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700"
              >
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={statsInView ? { scale: 1 } : { scale: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] p-4">
                  <TestimonialCard {...testimonial} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <motion.div
            className="flex justify-center mt-10 space-x-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  selectedIndex === index 
                    ? "bg-primary w-12 h-3" 
                    : "bg-gray-300 dark:bg-gray-600 w-3 h-3 hover:bg-primary/50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform your English skills and unlock new opportunities. Join our community of successful learners today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
          >
            Start Learning Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default ModernTestimonials