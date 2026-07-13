"use client";

import MediaLibrary from"@/src/dashboard/content/media-Library"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const media=()=> {
 return (
 <DashboardGuard section="content">
 <div>
 <MediaLibrary/>
 </div>
 </DashboardGuard>
 )
}

export default media
