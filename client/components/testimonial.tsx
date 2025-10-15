"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"
import { Star, Quote } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    text: "MR ENGLISH LEARNING completely transformed my speaking confidence. The instructors are patient and encouraging. I can now communicate fluently in business meetings!",
    author: "Sarah M.",
    role: "Business Professional",
    rating: 5,
    image: "/img/testimonial-1.jpg",
    achievement: "Achieved IELTS 8.0"
  },
  {
    id: 2,
    text: "The interactive sessions and personalized feedback helped me overcome my fear of speaking English. Now I can express myself confidently in any situation!",
    author: "Rahul K.",
    role: "University Student",
    rating: 5,
    image: "/img/testimonial-2.jpg",
    achievement: "Studying in USA"
  },
  {
    id: 3,
    text: "I've tried many English courses, but MR ENGLISH LEARNING stands out with its practical approach and real-world applications. Highly recommended!",
    author: "Priya S.",
    role: "Marketing Manager",
    rating: 5,
    image: "/img/testimonial-3.jpg",
    achievement: "Promoted to Team Lead"
  },
  {
    id: 4,
    text: "The grammar and vocabulary modules are excellent. The bite-sized lessons fit perfectly into my busy schedule. My English has improved dramatically!",
    author: "Amir H.",
    role: "High School Student",
    rating: 5,
    image: "/img/testimonial-4.jpg",
    achievement: "Top 5% in Class"
  },
  {
    id: 5,
    text: "From basic conversations to professional presentations, this platform covered it all. The certificate I earned helped me land my dream job!",
    author: "Fatima A.",
    role: "Career Changer",
    rating: 5,
    image: "/img/testimonial-5.jpg",
    achievement: "New Career Path"
  },
]

interface TestimonialCardProps {
  text: string
  author: string
  role: string
  rating: number
  image: string
  achievement: string
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, author, role, rating, image, achievement }) => (
  <div className="bg-card rounded-3xl p-8 shadow-lg border-2 border-border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 h-full">
    <div className="flex items-start gap-4 mb-6">
      <Quote className="w-12 h-12 text-primary/30 flex-shrink-0" />
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </div>
    
    <p className="text-foreground leading-relaxed mb-6 text-base italic">
      "{text}"
    </p>
    
    <div className="flex items-center gap-4 pt-6 border-t-2 border-border">
      <img
        src={image || "/placeholder.svg"}
        alt={author}
        className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
      />
      <div className="flex-1">
        <h4 className="font-bold text-lg text-foreground">{author}</h4>
        <p className="text-sm text-muted-foreground mb-1">{role}</p>
        <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          {achievement}
        </div>
      </div>
    </div>
  </div>
)

const ModernTestimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  return (
    <motion.section
      className="py-24 px-6 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full inline-block">
            SUCCESS STORIES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            What Our Students Achieve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful English learners who transformed their lives with MR ENGLISH LEARNING
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="embla__slide p-4">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  selectedIndex === index 
                    ? "bg-primary w-12 h-3" 
                    : "bg-muted w-3 h-3 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default ModernTestimonials