"use client";

import TrafficAnalyticsDashboard from"@/src/dashboard/analytics/trafficAnalytics"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=>{
 return (
 <DashboardGuard section="analytics">
 <div>
 <TrafficAnalyticsDashboard/>
 </div>
 </DashboardGuard>
 )
}

export default page
