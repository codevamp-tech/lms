"use client"
import { motion } from "framer-motion"
import { Star, Award, Users } from "lucide-react"

const instructors = [
  { 
    name: "Emma Williams", 
    title: "IELTS & TOEFL Expert", 
    img: "/instructor-1.jpg",
    experience: "15+ years",
    students: "5,000+",
    rating: 4.9
  },
  { 
    name: "Michael Chen", 
    title: "Business English Specialist", 
    img: "/instructor-2.jpg",
    experience: "12+ years",
    students: "4,200+",
    rating: 4.8
  },
  { 
    name: "Sarah Thompson", 
    title: "Conversation & Fluency Coach", 
    img: "/instructor-3.jpg",
    experience: "10+ years",
    students: "6,800+",
    rating: 5.0
  },
]

export default function Instructors() {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            MEET YOUR MENTORS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learn from World-Class Instructors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our certified English teachers bring decades of experience and proven teaching methodologies
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((ins, i) => (
            <motion.div
              key={ins.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-2xl border-2 border-border bg-card p-8 hover:border-primary/50 transition-all shadow-lg hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative text-center">
                <div className="mb-6 relative inline-block">
                  <img
                    src={ins.img || "/placeholder.svg"}
                    alt={ins.name}
                    className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                  {ins.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">{ins.title}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>{ins.experience} Experience</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{ins.students} Students Taught</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-foreground">{ins.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}