"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const AuthAdminRole = ({ children }) => {
  const { data } = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!data) {
      // router.push("/");
      return;
    }

    if (pathname.startsWith("/dashboard") && data.role !== "ADMIN" ) {
      router.push("/");
    }
  }, [data, pathname, router]);

  return <>{children}</>;
};

export default AuthAdminRole;
