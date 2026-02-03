"use client"
import { motion } from "framer-motion"
import { Star, Award, Users } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { getInitials } from "../lib/utils"

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainers/active`);
        if (response.data.success) {
          setInstructors(response.data.trainers);
        }
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>Loading instructors...</p>
        </div>
      </section>
    );
  }

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
              key={ins._id || i}
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
                  {ins.photoUrl ? (
                    <img
                      src={ins.photoUrl}
                      alt={ins.name}
                      className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-xl"
                    />
                  ) : (
                    <div className="mx-auto h-32 w-32 rounded-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-xl">
                      {getInitials(ins.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                  {ins.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">{ins.expertise}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>{ins.experience} Experience</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{ins.studentsTaught} Students Taught</span>
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
