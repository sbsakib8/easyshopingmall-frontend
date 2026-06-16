"use client";

import dynamic from "next/dynamic";

const ProductDashboard = dynamic(
  () => import("@/src/dashboard/product/allProductList/allProductList"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading products...</p></div> }
);

const PoductList=()=> {
 return (
 <>
 <ProductDashboard/>
 </>
 )
}

export default PoductList