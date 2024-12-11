import React from "react";
import Course from "./Course";

// Mock data for enrolled courses
const mockData = {
  user: {
    enrolledCourses: [
      {
        _id: "1",
        courseThumbnail: "https://via.placeholder.com/150",
        courseTitle: "React for Beginners",
        creator: {
          photoUrl: "https://via.placeholder.com/50",
          name: "John Doe",
        },
        courseLevel: "Beginner",
        coursePrice: 499,
      },
      {
        _id: "2",
        courseThumbnail: "https://via.placeholder.com/150",
        courseTitle: "Advanced JavaScript",
        creator: {
          photoUrl: "https://via.placeholder.com/50",
          name: "Jane Smith",
        },
        courseLevel: "Advanced",
        coursePrice: 799,
      },
      {
        _id: "3",
        courseThumbnail: "https://via.placeholder.com/150",
        courseTitle: "UI/UX Design Essentials",
        creator: {
          photoUrl: "https://via.placeholder.com/50",
          name: "Alex Johnson",
        },
        courseLevel: "Intermediate",
        coursePrice: 599,
      },
    ],
  },
};

const MyLearning = () => {
  // Replace the hook with mock data
  const myLearning = mockData.user.enrolledCourses || [];

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {myLearning.length === 0 ? (
          <p>You are not enrolled in any course.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearning.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
