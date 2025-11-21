"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react"; // Import Heart icon
import { Star, StarHalf } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Helper component to display star ratings with half star support
const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className="h-5 w-5 text-yellow-500 fill-current"
        />
      ))}
      {hasHalfStar && (
        <StarHalf
          key="half"
          className="h-5 w-5 text-yellow-500 fill-current "
        />
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="h-5 w-5 text-gray-300"
        />
      ))}
    </div>
  );
};

interface RatingData {
  average: number;
  count: number;
}

interface CourseProps {
  course: {
    _id: string;
    courseThumbnail: string;
    courseMRP: number;
    coursePrice: number;
    courseTitle: string;
    creator?: {
      photoUrl?: string;
      name: string;
    };
    courseLevel: string;
  };
  userId: string;
}

const Course: React.FC<CourseProps> = ({ course, userId }) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ratings/${course._id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch rating");
        }
        const data = await res.json();
        setRatingData(data);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    }

    async function checkIfFavorite() {
      if (!userId) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            courseId: course._id
          })
        });

        if (!res.ok) {
          throw new Error("Failed to check favorite status");
        }

        const data = await res.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    }

    if (course && course._id) {
      fetchRating();
      checkIfFavorite();
    }

    // Calculate discount percentage
    if (course.courseMRP && course.coursePrice) {
      const discount = ((course.courseMRP - course.coursePrice) / course.courseMRP) * 100;
      setDiscountPercentage(Math.round(discount));
    }
  }, [course, userId]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation since this is inside a Link component
    if (!userId) {
      // Handle not logged in state - redirect to login or show message
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${course._id}/add-favorites`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId: course._id
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelBadgeColors = (level) => {
    const levelLower = level?.toLowerCase() || "";
    switch (levelLower) {
      case "beginner":
        return "bg-green-700 text-white";
      case "intermediate":
      case "medium":
        return "bg-blue-600 text-white";
      case "advance":
        return "bg-red-700 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/course/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg">
              {discountPercentage}% OFF
            </div>
          )}
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className="absolute top-2 left-2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    course.creator?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                  alt="creator"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">{course.creator?.name}</h1>
            </div>
            <Badge
              className={`px-2 py-1 text-xs rounded-full ${getLevelBadgeColors(
                course.courseLevel
              )}`}
            >
              {course.courseLevel}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">₹{course.coursePrice}</span>
            {course.courseMRP > course.coursePrice && (
              <>
                <span className="text-gray-500 line-through text-sm">₹{course.courseMRP}</span>
                <span className="text-green-600 text-sm font-medium">({discountPercentage}% off)</span>
              </>
            )}
          </div>
          {ratingData ? (
            <div className="mt-2 flex items-center">
              <RatingStars rating={ratingData.average} />
              <span className="text-gray-600 text-sm ml-2 ">
                ({ratingData.count} reviews)
              </span>
            </div>
          ) : (
            <div className="mt-2 text-gray-600 text-sm">No ratings yet</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;