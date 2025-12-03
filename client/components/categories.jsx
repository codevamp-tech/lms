"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, MessageSquare, Headphones, PenTool, Award, Users } from "lucide-react"

const items = [
  { label: "Speaking & Conversation", icon: MessageSquare, q: "speaking", desc: "Build fluency and confidence" },
  { label: "Grammar Mastery", icon: BookOpen, q: "grammar", desc: "Perfect your English structure" },
  { label: "Listening Skills", icon: Headphones, q: "listening", desc: "Understand native speakers" },
  { label: "Writing Excellence", icon: PenTool, q: "writing", desc: "Craft professional content" },
  { label: "Certification", icon: Award, q: "Certification", desc: "Ace your certification" },
  { label: "Business English", icon: Users, q: "business", desc: "Professional communication" },
]

export default function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            LEARNING PATHS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your English Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the skill you want to master and start learning with expert guidance
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ label, icon: Icon, q, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative border-2 rounded-2xl p-6 bg-card hover:bg-accent/20 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <Link href={label === 'Certification' ? '/certificate' : '/courses'} className="relative block">
                <div className="flex items-start gap-4 mb-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
                      {label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-medium">Explore courses</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}