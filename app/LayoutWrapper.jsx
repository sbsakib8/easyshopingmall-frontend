"use client";

import { usePathname } from "next/navigation";
import Header from "@/src/compronent/header/header";
import Footer from "@/src/compronent/Home/Footer";
  
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/dashboard");

  

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
