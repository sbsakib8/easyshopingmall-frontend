"use client";

import ProductAnalytics from"@/src/dashboard/analytics/productAnalytics"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=> {
 return (
 <DashboardGuard section="analytics">
 <div>
 <ProductAnalytics/>
 </div>
 </DashboardGuard>
 )
}

export default page
