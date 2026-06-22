"use client";

import RightBanner from"@/src/dashboard/Banners/rightBanner"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const Rightbanner=()=> {
 return (
 <DashboardGuard section="banner">
 <div>
 <RightBanner/>
 </div>
 </DashboardGuard>
 )
}

export default Rightbanner
