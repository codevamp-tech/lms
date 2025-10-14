"use client";
import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "The trainers are inspiring. I've learned so much and am grateful for this platform.",
    author: "Sarah M.",
    role: "Business Professional",
    rating: 5,
    image: "/img/testimonial-1.jpg",
  },
  {
    id: 2,
    text: "It's more than just English; it's about confidence and personality development. Thank you!",
    author: "Rahul K.",
    role: "University Student",
    rating: 5,
    image: "/img/testimonial-2.jpg",
  },
  {
    id: 3,
    text: "I'm impressed with how much I've learned. The trainers are knowledgeable and supportive.",
    author: "Priya S.",
    role: "Marketing Manager",
    rating: 5,
    image: "/img/testimonial-3.jpg",
  },
  {
    id: 4,
    text: "Reading and learning new things are now a piece of cake. The trainers make it so easy.",
    author: "Amir H.",
    role: "High School Student",
    rating: 5,
    image: "/img/testimonial-4.jpg",
  },
  {
    id: 5,
    text: "I learned about myself and the world, not just English. The trainers have helped me a lot.",
    author: "Fatima A.",
    role: "Career Changer",
    rating: 5,
    image: "/img/testimonial-5.jpg",
  },
];

interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
  rating: number;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, author, role, rating, image }) => (
  <div className="bg-card rounded-2xl p-8 shadow-sm border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
    <Quote className="w-10 h-10 text-primary/50 mb-4" />
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-foreground leading-relaxed mb-6 text-base">{text}</p>
    <div className="flex items-center gap-4 pt-4 border-t border-border">
      <img
        src={image || "/placeholder.svg"}
        alt={author}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
      />
      <div>
        <h4 className="font-semibold text-foreground text-lg">{author}</h4>
        <p className="text-muted-foreground text-sm">{role}</p>
      </div>
    </div>
  </div>
);

const ModernTestimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-full">
            Student Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our students have grown in confidence, skills, and success.
          </p>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="embla__slide p-4">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedIndex === index ? "bg-primary scale-125" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonials;
