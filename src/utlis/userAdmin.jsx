"use client";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const DASHBOARD_ROLES = ["ADMIN", "MANAGER", "CPO"];

const AuthAdminRole = ({ children }) => {
  const { data } = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!data) {
      // router.push("/");
      return;
    }

    const userRole = data.role || "";
    const userRoles = data.roles || [];
    const hasDashboardAccess =
      DASHBOARD_ROLES.includes(userRole) ||
      userRoles.some((r) => DASHBOARD_ROLES.includes(r));

    if (pathname.startsWith("/dashboard") && !hasDashboardAccess) {
      router.push("/");
    }
  }, [data, pathname, router]);

  return <>{children}</>;
};

export default AuthAdminRole;
