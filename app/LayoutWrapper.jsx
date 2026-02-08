"use client";

import { usePathname } from "next/navigation";
import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
import { useGetUser } from "@/src/utlis/useGetuser";
import { useDispatch } from "react-redux";
import { userget, clearUser } from "@/src/redux/userSlice";
import { useEffect } from "react";
import BlockedUserRoute from "@/src/utlis/BlockedUserRoute";
import DropshippingNavbar from "@/src/dropShipping/dropshippingNavbar/dropshippingNavbar";


export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");
  const { user, loading, error } = useGetUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(userget(user));
    } else {
      dispatch(clearUser()); 
    }
  }, [user, dispatch]);
const role = "DROP-SHIPPING"
console.log(!hideLayout && role !== "DROP-SHIPPING")
  return (
    <BlockedUserRoute>
      {!hideLayout && role !== "DROP-SHIPPING" ? <Header /> :""}
       <DropshippingNavbar/>  
      {children}
      {!hideLayout && <Footer />}
    </BlockedUserRoute>
  );
}
