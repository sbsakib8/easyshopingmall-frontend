"use client";

import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
import DropshippingNavbar from "@/src/dropShipping/dropshippingNavbar/dropshippingNavbar";
import BlockedUserRoute from "@/src/utlis/BlockedUserRoute";
import FloatingCartCard from "@/src/compronent/shared/FloatingCartCard";
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
  const role = user?.role;

  return (

    <BlockedUserRoute>
      <Suspense fallback={null}>
        {(!hideLayout && role !== "DROPSHIPPING" && !user?.roles?.includes("DROPSHIPPING")) ? <Header /> : ""}
        {(role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) && <DropshippingNavbar />}
      </Suspense>
      <main>
        {children}
      </main>
      {!hideLayout && <Footer initialData={initialWebsiteInfo} />}
      {showFloatingCart && <FloatingCartCard />}
    </BlockedUserRoute>
  );
}
