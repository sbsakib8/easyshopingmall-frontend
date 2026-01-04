"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function BlockedUserRoute({ children }) {
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is blocked and not on the blocked page, redirect to blocked page
    const isBlocked = user?.status === "Blocked" || user?.status === "blocked";
    
    if (isBlocked && pathname !== "/blocked") {
      router.push("/blocked");
    }
  }, [user, router, pathname]);

  // If user is blocked and trying to access any page other than /blocked, show nothing
  const isBlocked = user?.status === "Blocked" || user?.status === "blocked";
  if (isBlocked && pathname !== "/blocked") {
    return null;
  }

  return <>{children}</>;
}
