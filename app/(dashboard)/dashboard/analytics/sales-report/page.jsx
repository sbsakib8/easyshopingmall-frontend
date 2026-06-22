"use client";

import dynamic from "next/dynamic";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const SalesReportDashboard = dynamic(
  () => import("@/src/dashboard/analytics/salesReport"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading analytics...</p></div> }
);

const page=()=> {
 return (
 <DashboardGuard section="analytics">
 <div>
 <SalesReportDashboard/>
 </div>
 </DashboardGuard>
 )
}

export default page
