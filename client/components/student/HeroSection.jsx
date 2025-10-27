"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, MessageCircle, Award } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchHandler = (e) => {
    e.preventDefault()
    if (searchQuery.trim() !== "") {
      router.push(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("")
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <>
      {/* Full-width Banner Image */}
      <div className="w-full">
        <img 
          src="/img/hero_page.jpg" 
          alt="Mr English Training Academy  Banner"
          className="w-full h-auto object-cover max-h-[500px] md:max-h-[500px] lg:max-h-[700px]"
        />
      </div>

      {/* Hero Section */}
      <div
        style={{ backgroundImage: `url('/img/hero-4.jpg')` }}
        className="relative py-8 px-4 bg-cover bg-center bg-no-repeat"
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/20 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Brand Name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-3 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mr English Training Academy
              </h1>
              <div className="h-1 w-40 mx-auto bg-gradient-to-r from-primary to-purple-600 rounded-full" />
            </motion.div>

            <motion.span
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block text-sm font-semibold tracking-wider uppercase text-primary bg-primary/10 rounded-full px-4 py-2 mb-4"
            >
              Master English with Confidence
            </motion.span>

            <motion.h2
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-foreground text-balance"
            >
              Transform Your English Speaking Skills
            </motion.h2>

            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Join thousands of learners who have improved their English communication, grammar, and confidence with our expert-led courses and personalized learning paths.
            </motion.p>

            {/* Search form */}
            <motion.form
              onSubmit={searchHandler}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center bg-card rounded-full shadow-2xl overflow-hidden max-w-2xl mx-auto mb-6 border-2 border-primary/20 hover:border-primary/40 transition-all"
              aria-label="Search courses"
            >
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for English courses..."
                aria-label="Search courses"
                className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-foreground placeholder-muted-foreground bg-transparent text-lg"
              />
              <Button type="submit" size="lg" className="px-8 py-6 rounded-none">
                Search
              </Button>
            </motion.form>

            {/* Quick Enroll Boxes */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
            >
              {[
                { title: "Zero to Hero English Course", price: "999", icon: BookOpen },
                { title: "Counselling Session by Founder", price: "749", icon: MessageCircle },
                { title: "Chat Buddy", price: "199", icon: Award }
              ].map((offer, i) => (
                <Dialog key={offer.title}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                      className="bg-card hover:bg-accent cursor-pointer p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all"
                    >
                      <offer.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-lg font-bold mb-2">{offer.title}</h3>
                      <p className="text-2xl font-bold text-primary">₹{offer.price}</p>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{offer.title}</DialogTitle>
                      <DialogDescription>Fill in your details to enroll</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const data = {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        whatsapp: formData.get('whatsapp'),
                        message: formData.get('message'),
                        product: offer.title,
                        price: offer.price
                      };
                      // Save to session storage
                      sessionStorage.setItem('quickPurchase', JSON.stringify(data));
                      // Redirect to payment page
                      router.push(`/cart?product=${encodeURIComponent(offer.title)}&price=${offer.price}`);
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="whatsapp">WhatsApp Number</Label>
                          <Input id="whatsapp" name="whatsapp" type="tel" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Input id="message" name="message" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Proceed to Payment</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              ))}
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mb-8"
            >
              {[
                { icon: BookOpen, label: "500+ Lessons", value: "500+" },
                { icon: MessageCircle, label: "Live Practice", value: "Daily" },
                { icon: Award, label: "Certified", value: "100%" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-full border border-border"
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Secondary action */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.5, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                onClick={() => router.push(`/course/search?query`)} 
                size="lg"
                className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Explore All Courses
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8"
              >
                Start Free Trial
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default HeroSection