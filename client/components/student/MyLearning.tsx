"use client";
import { useEffect, useState } from 'react';
import { fetchPurchasedCourses } from '@/features/api/course-purchase/route';
import { fetchEnrolledLiveSessions } from '@/features/api/live-session/route';
import { getUserIdFromToken } from '@/utils/helpers';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface Course {
  _id: string;
  courseTitle: string;
  creator: {
    name: string;
  };
}

interface LiveSession {
  _id: string;
  title: string;
  instructor: {
    name: string;
  };
  dateTime: string;
  duration: number;
}

export default function MyLearning() {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [enrolledSessions, setEnrolledSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const getMyLearningData = async () => {
      if (!userId) return;
      try {
        const coursesData = await fetchPurchasedCourses(userId);
        setPurchasedCourses(coursesData.courses);
        const sessionsData = await fetchEnrolledLiveSessions(userId);
        setEnrolledSessions(sessionsData);
      } catch (error) {
        toast.error('Failed to load learning data.');
      } finally {
        setIsLoading(false);
      }
    };
    getMyLearningData();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
        My Learning
      </h1>
      
      <h2 className="text-3xl font-bold mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {purchasedCourses.map((course) => (
          <div key={course._id} className="bg-card dark:bg-gray-800/50 rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-bold mb-2">{course.courseTitle}</h3>
            <p className="text-muted-foreground mb-4">by {course.creator.name}</p>
            <Link href={`/course/course-progress/${course._id}`}>
              <Button className="w-full">Go to Course</Button>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">My Live Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrolledSessions.map((session) => (
          <div key={session._id} className="bg-card dark:bg-gray-800/50 rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-bold mb-2">{session.title}</h3>
            <p className="text-muted-foreground mb-4">with {session.instructor.name}</p>
            <p><strong>Date & Time:</strong> {new Date(session.dateTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> {session.duration} minutes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
