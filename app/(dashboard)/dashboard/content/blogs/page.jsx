"use client";

import BlogsAdminDashboard from"@/src/dashboard/content/blogesComponent"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const blogs=()=> {
 return (
 <DashboardGuard section="content">
 <div>
 <BlogsAdminDashboard/>
 </div>
 </DashboardGuard>
 )
}

export default blogs
