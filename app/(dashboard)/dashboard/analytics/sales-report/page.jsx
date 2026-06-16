"use client";

import dynamic from "next/dynamic";

const SalesReportDashboard = dynamic(
  () => import("@/src/dashboard/analytics/salesReport"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading analytics...</p></div> }
);

const page=()=> {
 return (
 <div>
 <SalesReportDashboard/>
 </div>
 )
}

export default page