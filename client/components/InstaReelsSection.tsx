"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

const reels = [
  `
  <blockquote class="instagram-media"
    data-instgrm-permalink="https://www.instagram.com/reel/DS2OsnaCUCJ/"
    data-instgrm-version="14"
    style="width:100%; margin:0 auto;">
  </blockquote>
  `,
  `
  <blockquote class="instagram-media"
    data-instgrm-permalink="https://www.instagram.com/reel/DSz7hdqEnB0/"
    data-instgrm-version="14"
    style="width:100%; margin:0 auto;">
  </blockquote>
  `,
  `
  <blockquote class="instagram-media"
    data-instgrm-permalink="https://www.instagram.com/reel/DSxFDrpCW70/"
    data-instgrm-version="14"
    style="width:100%; margin:0 auto;">
  </blockquote>
  `,
]

export default function InstaReelsSection() {
  useEffect(() => {
    if (!(window as any).instgrm) {
      const script = document.createElement("script")
      script.src = "https://www.instagram.com/embed.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        ;(window as any).instgrm?.Embeds?.process()
      }
    } else {
      ;(window as any).instgrm.Embeds.process()
    }
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">
            English Tips from Instagram Reels
          </h2>
          <p className="text-muted-foreground">
            Watch daily English lessons from our Instagram
          </p>
        </div>

        {/* Reels */}
        <div className="grid md:grid-cols-3 gap-8">
          {reels.map((embed, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white p-2"
              dangerouslySetInnerHTML={{ __html: embed }}
            />
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/mr_english_training_academy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-primary text-white font-semibold"
          >
            View More on Instagram
          </a>
        </div>

      </div>
    </section>
  )
}
