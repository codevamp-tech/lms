"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { getUserIdFromToken } from "@/utils/helpers";
import { Star, StarHalf, BookOpen } from "lucide-react";
import Link from "next/link";
import ProtectedRoutes from "@/components/ProtectedRoutes";

const RatingStars = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 text-yellow-500 fill-current" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="h-4 w-4 text-yellow-500 fill-current" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-gray-500" />
      ))}
    </div>
  );
};

const Favorites = () => {
  interface Favorite {
    _id: string;
    courseId: {
      _id: string;
      courseThumbnail: string;
      courseTitle: string;
      category: string;
      coursePrice: number;
      courseMRP?: number;
    };
  }

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [courseRatings, setCourseRatings] = useState<{ [key: string]: { average: number; count: number } }>({});
  const userId = getUserIdFromToken();

  // Fetch Favorites
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}`);
      setFavorites(data);
    } catch (error) {
      toast.error("Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchRatings = useCallback(async () => {
    const ratings: { [key: string]: { average: number; count: number } } = {};
    for (const item of favorites) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ratings/${item.courseId._id}`);
        if (res.ok) {
          const data = await res.json();
          ratings[item.courseId._id] = data;
        }
      } catch (error) {
        console.error(`Error fetching rating for course ${item.courseId._id}:`, error);
      }
    }
    setCourseRatings(ratings);
  }, [JSON.stringify(favorites)]);

  // Fetch Ratings for Courses
  useEffect(() => {
    if (favorites.length > 0) {
      fetchRatings();
    }
  }, [favorites.length, fetchRatings]);

  // Remove Course from Favorites
  const removeFromFavorites = async (courseId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${courseId}/remove-favorites`, {
        data: { userId, courseId },
      });
      toast.success("Removed from favorites");
      fetchFavorites();
    } catch (error) {
      toast.error("Failed to remove course");
    }
  };

  return (
    <ProtectedRoutes>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Favorites</h1>
          {!loading && <div className="mb-2 text-sm sm:text-base text-gray-600">{favorites.length} Course(s) in favorites</div>}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : favorites.length === 0 ? (
          <p>
            Your cart is empty.{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Go back to courses
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4">
            {favorites.map((fav) => {
              const discountPercentage = fav.courseId.courseMRP && fav.courseId.coursePrice
                ? Math.round(((fav.courseId.courseMRP - fav.courseId.coursePrice) / fav.courseId.courseMRP) * 100)
                : 0;

              return (
                <Card key={fav._id} className="shadow-lg rounded-lg relative">
                  <img
                    src={fav.courseId.courseThumbnail}
                    alt={fav.courseId.courseTitle}
                    className="w-full h-36 sm:h-44 object-cover rounded-t-lg" />
                  {discountPercentage > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-bl-lg">
                      {discountPercentage}% OFF
                    </div>
                  )}

                  <CardContent className="gap-2 mt-2">
                    <Link href={`/course/course-detail/${fav.courseId._id}`}>
                      <h3 className="text-base sm:text-lg lg:text-xl hover:underline line-clamp-2">{fav.courseId.courseTitle}</h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold">₹{fav.courseId.coursePrice}</span>
                      {fav.courseId.courseMRP && fav.courseId.courseMRP > fav.courseId.coursePrice && (
                        <>
                          <span className="text-gray-500 line-through text-sm">₹{fav.courseId.courseMRP}</span>
                          <span className="text-green-600 text-sm font-medium">({discountPercentage}% off)</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                      <div className="flex items-center gap-1 mt-1">
                        {courseRatings[fav.courseId._id] ? (
                          <>
                            <RatingStars rating={courseRatings[fav.courseId._id].average} />
                            <span className="text-sm text-gray-500 ml-2">
                              ({courseRatings[fav.courseId._id].count} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No ratings yet</span>
                        )}
                      </div>
                      <Button
                        onClick={() => removeFromFavorites(fav.courseId._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm w-full sm:w-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
        }
      </div >
    </ProtectedRoutes>
  );
};

export default Favorites;