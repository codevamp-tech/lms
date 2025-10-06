import HeroSection from '@/components/student/HeroSection'
import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from '@/lib/hydrate';
import HeroCrousel from '@/components/HeroCrousel';
import TopPickCourse from '@/components/topPick';
import ModernTestimonials from '@/components/testimonial';

export default function Home() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <HeroSection />
      <HeroCrousel />
      <TopPickCourse />
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <img
            src="/img/hero_page.jpg"
            alt="Hero Page"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
      <ModernTestimonials />
    </Hydrate>
  );
}
