"use client";

import HomeSliderPage from"@/src/dashboard/Banners/homeSlider"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const homeslider=()=> {
 return (
 <DashboardGuard section="banner">
 <div>
 <HomeSliderPage/>
 </div>
 </DashboardGuard>
 )
}

export default homeslider
