"use client";

import dynamic from "next/dynamic";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const ProductDashboard = dynamic(
  () => import("@/src/dashboard/product/allProductList/allProductList"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading products...</p></div> }
);

const PoductList=()=> {
 return (
 <DashboardGuard section="products">
 <ProductDashboard/>
 </DashboardGuard>
 )
}

export default PoductList
