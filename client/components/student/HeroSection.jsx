"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div
      style={{
        backgroundImage: `url('/img/hero-4.jpg')`,
      }}
      className="relative py-24 px-4  text-center  bg-cover bg-center bg-no-repeat"
    >
      <div className="max-w-3xl mx-auto h-96 flex justify-end items-center">
        <div className="">
          <h1 className="dark:text-gray-600 text-4xl font-bold mb-4">
            Find the Best Courses for You
          </h1>
          <p className="dark:text-gray-600 mb-8">
            Discover, Learn, and Upskill with our wide range of courses
          </p>

          <form
            onSubmit={searchHandler}
            className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
          >
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Courses"
              className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <Button type="submit" className="px-6 py-3 rounded-r-full">
              Search
            </Button>
          </form>
          <Button
            onClick={() => router.push(`/course/search?query`)}
            className="bg-white dark:bg-gray-800 text-blue-500 rounded-full hover:bg-gray-200 "
          >
            Explore Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
