"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/helpers";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId, router]);

  if (!userId) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
