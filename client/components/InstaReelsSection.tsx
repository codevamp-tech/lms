"use client"

import { motion } from "framer-motion"

const reels = [
  "https://www.instagram.com/reel/REEL_ID_1/embed",
  "https://www.instagram.com/reel/REEL_ID_2/embed",
  "https://www.instagram.com/reel/REEL_ID_3/embed",
]

export default function InstaReelsSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            LEARN WITH US
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            English Tips from Instagram Reels
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch short, practical English lessons shared daily on our Instagram
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reels.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-muted"
            >
              <iframe
                src={src}
                className="w-full h-[480px]"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          ))}
        </div>

        {/* Button linking to your Instagram profile */}
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/mr_english_training_academy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            View More on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
