"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const AuthAdminRole = ({ children }) => {
  const { data } = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // যদি user লগইন না করে থাকে
    if (!data) {
      router.push("/");
      return;
    }

    // যদি dashboard এ ঢুকতে চায় কিন্তু role !== admin
    if (pathname.startsWith("/dashboard") && data.role !== "ADMIN") {
      router.push("/");
    }
  }, [data, pathname, router]);

  return <>{children}</>;
};

export default AuthAdminRole;
