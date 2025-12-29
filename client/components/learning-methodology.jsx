"use client"
import { motion } from "framer-motion"
import { BookOpen, Users, Target, CheckCircle } from "lucide-react"
import Link from "next/link"


const steps = [
  {
    step: "01",
    title: "Assess Your Level",
    desc: "Take our comprehensive English assessment to identify your current proficiency and learning needs.",
    icon: Target,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "02",
    title: "Personalized Learning Path",
    desc: "Get a customized curriculum designed specifically for your goals, whether it's business, academics, or daily conversation.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "03",
    title: "Interactive Practice",
    desc: "Join live sessions with native speakers, participate in group discussions, and practice real-world scenarios.",
    icon: Users,
    color: "from-orange-500 to-red-500"
  },
  {
    step: "04",
    title: "Achieve Fluency",
    desc: "Track your progress, earn certificates, and speak English with confidence in any situation.",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500"
  },
]

export default function LearningMethodology() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            OUR METHODOLOGY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Path to English Mastery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven 4-step approach that takes you from beginner to confident English speaker
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              <div className="flex gap-6">
                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: i * 0.15 + 0.2, 
                      type: "spring" 
                    }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {item.step}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="absolute top-20 left-8 w-0.5 h-24 bg-gradient-to-b from-muted-foreground/30 to-transparent hidden md:block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>

                  {/* Hover effect line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`h-1 mt-4 rounded-full bg-gradient-to-r ${item.color} origin-left`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
            <Link href="/courses">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            Start Your Journey Today
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}