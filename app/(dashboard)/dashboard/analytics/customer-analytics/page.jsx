"use client";

import CustomerAnalyticsDashboard from"@/src/dashboard/analytics/customerAnalytics"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=> {
 return (
 <DashboardGuard section="analytics">
 <div>
 <CustomerAnalyticsDashboard/>
 </div>
 </DashboardGuard>
 )
}

export default page
