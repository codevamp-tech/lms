import React, { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const CoursePage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPageClient />
    </Suspense>
  );
};

export default CoursePage;
