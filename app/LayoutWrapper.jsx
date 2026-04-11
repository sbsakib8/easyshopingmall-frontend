"use client";

import { usePathname } from "next/navigation";
import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
import { useGetUser } from "@/src/utlis/useGetuser";
import { useDispatch } from "react-redux";
import { userget, clearUser } from "@/src/redux/userSlice";
import { Suspense, useEffect } from "react";
import BlockedUserRoute from "@/src/utlis/BlockedUserRoute";
import DropshippingNavbar from "@/src/dropShipping/dropshippingNavbar/dropshippingNavbar";


export default function LayoutWrapper({ children, initialWebsiteInfo }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");
  const { user, loading } = useGetUser();
  const role = user?.role;

  return (

    <BlockedUserRoute>
      <Suspense fallback={null}>
        {!hideLayout && role !== "DROPSHIPPING" ? <Header /> : ""}
        {role === "DROPSHIPPING" && <DropshippingNavbar />}
      </Suspense>
      {children}
      {!hideLayout && <Footer initialData={initialWebsiteInfo} />}
    </BlockedUserRoute>
  );
}
