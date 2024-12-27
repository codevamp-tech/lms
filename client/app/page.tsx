import HeroSection from '@/components/student/HeroSection'
import Courses from '@/components/student/Courses'
import { getQueryClient } from '@/lib/react-query';
import { dehydrate } from '@tanstack/react-query';
import { Hydrate } from '@/lib/hydrate';

export default function Home() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
    <HeroSection />
    <Courses />
    </Hydrate>
  );
}
