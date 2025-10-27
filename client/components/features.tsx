"use client"
import { motion } from "framer-motion"
import { Video, Users, Award, Clock, Sparkles, TrendingUp } from "lucide-react"

const features = [
  {
    title: "Live Interactive Classes",
    desc: "Practice speaking with native instructors and fellow learners in real-time sessions.",
    Icon: Video,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Personalized Learning",
    desc: "AI-powered curriculum that adapts to your pace, level, and learning style.",
    Icon: Sparkles,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Expert Instructors",
    desc: "Learn from certified English teachers with years of international teaching experience.",
    Icon: Users,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Globally Recognized Certificates",
    desc: "Earn certificates that boost your career and academic opportunities worldwide.",
    Icon: Award,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Learn Anytime, Anywhere",
    desc: "Access courses 24/7 with lifetime access to all course materials and recordings.",
    Icon: Clock,
    color: "from-yellow-500 to-orange-500"
  },
  {
    title: "Yearly Seminars",
    desc: "Monitor your improvement with detailed analytics and personalized feedback.",
    Icon: TrendingUp,
    color: "from-indigo-500 to-purple-500"
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
            WHY CHOOSE US
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Master English
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and support for your English Training success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, desc, Icon, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl border-2 border-border bg-card p-8 hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              
              <div className="relative">
                <div className="mb-5">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                
                <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}