"use client";

import CenterBanner from"@/src/dashboard/Banners/centerBanner"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const centerbanner=()=> {
 return (
 <DashboardGuard section="banner">
 <div>
 <CenterBanner/>
 </div>
 </DashboardGuard>
 )
}

export default centerbanner
