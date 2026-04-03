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


export default function LayoutWrapper({ children, initialWebsiteInfo }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");
  const { user, loading } = useGetUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(userget(user));
    } else {
      dispatch(clearUser());
    }
  }, [user, dispatch]);
  const role = user?.role
  if (loading) return <>
  <div className="w-full animate-pulse">

  {/* NAVBAR */}
  <div className="flex items-center justify-between px-6 py-4 bg-[#e6e2c9]">

    {/* left */}
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      <div className="h-6 w-48 bg-gray-300 rounded"></div>
    </div>

    {/* middle */}
    <div className="hidden md:block">
      <div className="h-8 w-40 bg-gray-300 rounded-full"></div>
    </div>

    {/* right */}
    <div className="flex items-center gap-6">
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
      <div className="h-6 w-16 bg-gray-300 rounded"></div>
    </div>

  </div>


  {/* BANNER */}
  <div className="grid lg:grid-cols-1 gap-4 p-4">

    {/* left text section */}
    <div className="bg-gray-200 rounded-xl p-8 flex flex-col gap-4">

      <div className="h-8 w-2/3 bg-gray-300 rounded"></div>
      <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-8 w-1/2 bg-gray-300 rounded"></div>

      <div className="mt-4 h-12 w-52 bg-gray-300 rounded-full"></div>
      <div className="h-12 w-44 bg-gray-300 rounded-full"></div>

      <div className="mt-6 h-5 w-40 bg-gray-300 rounded"></div>
      <div className="h-5 w-56 bg-gray-300 rounded"></div>

    </div> 

  </div>

</div>
  </>
  return (
    <BlockedUserRoute>
      {!hideLayout && role !== "DROPSHIPPING" ? <Header /> : ""}
      {role === "DROPSHIPPING" && <DropshippingNavbar />}
      {children}
      {!hideLayout && <Footer initialData={initialWebsiteInfo} />}
    </BlockedUserRoute>
  );
}
