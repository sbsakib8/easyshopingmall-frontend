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
      <FloatingCartCard />
    </BlockedUserRoute>
  );
}
