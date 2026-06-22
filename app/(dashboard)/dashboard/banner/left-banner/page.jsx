"use client";

import LeftBanner from"@/src/dashboard/Banners/leftBanner"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const leftbanner=()=> {
 return (
 <DashboardGuard section="banner">
 <div>
 <LeftBanner/>
 </div>
 </DashboardGuard>
 )
}

export default leftbanner
