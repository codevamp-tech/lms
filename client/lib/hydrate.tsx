"use client";

import {
  HydrationBoundary as RQHydrationBoundary,
  type HydrationBoundaryProps,
} from "@tanstack/react-query";

function Hydrate(props: HydrationBoundaryProps) {
  return <RQHydrationBoundary {...props} />;
}

export { Hydrate };
