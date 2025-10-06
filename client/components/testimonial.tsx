"use client"
import { useState } from "react"
import { Star, Quote } from "lucide-react"

// Enhanced testimonial data with ratings and roles
const testimonials = [
  {
    id: 1,
    text: "All the trainers are inspiring. I have learned almost from all of them. I have learned so much in their classes and I am really grateful that I found such a platform.",
    author: "Sarah M.",
    role: "Business Professional",
    rating: 5,
    image: "/professional-woman-smiling.png",
  },
  {
    id: 2,
    text: "Mr. English is not only about English. It's about hundred different things. From confidence to personality development they got you all covered. I am really thankful to Gowhar sur for training.",
    author: "Rahul K.",
    role: "University Student",
    rating: 5,
    image: "/young-man-student.png",
  },
  {
    id: 3,
    text: "I am really impressed with how much I have learned at Mr. English training academy. The trainers are knowledgeable and very supportive.",
    author: "Priya S.",
    role: "Marketing Manager",
    rating: 5,
    image: "/professional-woman-confident.jpg",
  },
  {
    id: 4,
    text: "Reading books and doing my homework used to be a task, a really hectic one. However, not anymore, because now I can read and write without any problems. At Meta, the trainers make reading and learning new things a piece of cake.",
    author: "Amir H.",
    role: "High School Student",
    rating: 5,
    image: "/teenage-boy-studying.jpg",
  },
  {
    id: 5,
    text: "I thought I will only learn English at Mr. English training academy, but I ended up learning about myself and the world too. Juzlain Mam has helped me a lot in my journey.",
    author: "Fatima A.",
    role: "Career Changer",
    rating: 5,
    image: "/professional-woman-headshot.png",
  },
]

const TestimonialCard = ({
  text,
  author,
  role,
  rating,
  image,
  index,
}: {
  text: string
  author: string
  role: string
  rating: number
  image: string
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group relative bg-card rounded-2xl p-8 shadow-sm border border-border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${index % 2 === 0 ? "md:mt-8" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative quote mark */}
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
        <Quote className="w-8 h-8 text-primary-foreground" />
      </div>

      {/* Star rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 fill-secondary text-secondary transition-transform duration-300"
            style={{
              transitionDelay: isHovered ? `${i * 50}ms` : "0ms",
              transform: isHovered ? "scale(1.2) rotate(15deg)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Testimonial text */}
      <p className="text-foreground leading-relaxed mb-6 text-base">{text}</p>

      {/* Author info */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/40">
            <img src={image || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md">
            <svg className="w-3 h-3 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-lg">{author}</h4>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
      </div>

      {/* Hover accent line */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-b-2xl transition-all duration-500"
        style={{
          width: isHovered ? "100%" : "0%",
        }}
      />
    </div>
  )
}

const ModernTestimonials = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full">
              Student Success Stories
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground text-balance">
            Transforming Lives Through <span className="text-primary">Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover how our students have grown in confidence, skills, and success with Mr. English Training Academy
          </p>
        </div>

        {/* Testimonials grid with staggered layout */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              text={testimonial.text}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
              image={testimonial.image}
              index={index}
            />
          ))}
        </div>


      </div>
    </section>
  )
}

export default ModernTestimonials
