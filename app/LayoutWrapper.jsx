"use client";

import { usePathname } from "next/navigation";
import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
import { useGetUser } from "@/src/utlis/useGetuser";
import { useDispatch, useSelector } from "react-redux";
import { userget, clearUser } from "@/src/redux/userSlice";
import { Suspense, useEffect } from "react";
import BlockedUserRoute from "@/src/utlis/BlockedUserRoute";
import DropshippingNavbar from "@/src/dropShipping/dropshippingNavbar/dropshippingNavbar";


export default function LayoutWrapper({ children, initialWebsiteInfo }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");
  const dispatch = useDispatch();
  
  // Use Redux state for immediate UI reaction after login
  const reduxUser = useSelector((state) => state.user.data);
  const { user: hookUser, loading } = useGetUser(); 
  
  // Use whichever is available, prioritizing Redux for real-time updates
  const user = reduxUser || hookUser;
  const role = user?.role;

  return (

    <BlockedUserRoute>
      <Suspense fallback={null}>
        {(!hideLayout && role !== "DROPSHIPPING" && !user?.roles?.includes("DROPSHIPPING")) ? <Header /> : ""}
        {(role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) && <DropshippingNavbar />}
      </Suspense>
      {children}
      {!hideLayout && <Footer initialData={initialWebsiteInfo} />}
    </BlockedUserRoute>
  );
}
