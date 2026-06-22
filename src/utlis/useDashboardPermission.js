"use client";
import { useSelector } from "react-redux";

const DASHBOARD_PERMISSIONS = {
  ADMIN: [
    "products",
    "orders",
    "customers",
    "dropshipping",
    "banner",
    "content",
    "coupons",
    "notifications",
    "analytics",
    "users",
    "settings",
  ],
  MANAGER: ["products", "orders", "customers", "dropshipping", "banner", "content"],
  CPO: ["products", "orders", "coupons"],
};

const SECTION_ROUTES = {
  products: ["/dashboard/products"],
  orders: ["/dashboard/order"],
  customers: ["/dashboard/customers"],
  dropshipping: ["/dashboard/dropshipping"],
  banner: ["/dashboard/banner"],
  content: ["/dashboard/content"],
  coupons: ["/dashboard/coupons"],
  analytics: ["/dashboard/analytics"],
  settings: ["/dashboard/settings"],
};

export function useDashboardPermission() {
  const { data } = useSelector((state) => state.user);
  const userRole = data?.role || "";
  const userRoles = data?.roles || [];

  const isUserAdmin =
    userRole === "ADMIN" || userRoles.includes("ADMIN");

  const allowedSections = (() => {
    if (isUserAdmin) return Object.keys(DASHBOARD_PERMISSIONS);

    for (const role of [userRole, ...(userRoles || [])]) {
      if (DASHBOARD_PERMISSIONS[role]) {
        return DASHBOARD_PERMISSIONS[role];
      }
    }
    return [];
  })();

  const hasSectionAccess = (section) => {
    if (isUserAdmin) return true;
    return allowedSections.includes(section);
  };

  const hasRouteAccess = (pathname) => {
    if (isUserAdmin) return true;
    for (const [section, prefixes] of Object.entries(SECTION_ROUTES)) {
      if (prefixes.some((prefix) => pathname.startsWith(prefix))) {
        return allowedSections.includes(section);
      }
    }
    return true;
  };

  const canModify = (section) => {
    if (isUserAdmin) return true;
    return allowedSections.includes(section);
  };

  return {
    isUserAdmin,
    userRole,
    userRoles,
    allowedSections,
    hasSectionAccess,
    hasRouteAccess,
    canModify,
  };
}
