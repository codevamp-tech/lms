"use client";

import React from "react";
import SearchPage from "@/components/student/SearchPage";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { Hydrate } from "@/lib/hydrate";

const SearchPageClient = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <SearchPage />
    </Hydrate>
  );
};

export default SearchPageClient;
