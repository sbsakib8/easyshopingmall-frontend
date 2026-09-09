"use client";

import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
import DropshippingNavbar from "@/src/dropShipping/dropshippingNavbar/dropshippingNavbar";
import BlockedUserRoute from "@/src/utlis/BlockedUserRoute";
import { useGetUser } from "@/src/utlis/useGetuser";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateCoupon } from "@/src/redux/cartSlice";


export default function LayoutWrapper({ children, initialWebsiteInfo }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");
  const isDropshippingApp = [
    "/all-products", "/boost-products", "/new-products", "/seller-dashboard",
    "/order-list", "/my-analytics", "/passive-income", "/payment-request",
    "/referral-profile", "/team-system", "/video", "/shop-settings",
    "/search", "/dropshipping-addtocart", "/dropshipping-checkout",
  ].some((p) => pathname.startsWith(p)) || pathname.startsWith("/order-details") || pathname.startsWith("/sub-category");
  const showFloatingCart = !hideLayout && !isDropshippingApp;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateCoupon());
  }, [dispatch]);

  const { user, loading } = useGetUser();
  const userRole = (user?.role || "").toUpperCase();
  const userRoles = (user?.roles || []).map((r) => (r || "").toUpperCase());
  const isDropshipper = userRole === "DROPSHIPPING" || userRoles.includes("DROPSHIPPING");

  return (

    <BlockedUserRoute>
      <Suspense fallback={null}>
        {(!hideLayout && !isDropshipper) ? <Header /> : ""}
        {isDropshipper && <DropshippingNavbar />}
      </Suspense>
      <main>
        {children}
      </main>
      {!hideLayout && <Footer initialData={initialWebsiteInfo} />}
      {showFloatingCart}
    </BlockedUserRoute>
  );
}
