"use client";

import dynamic from "next/dynamic";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const DropshippingAnalytics = dynamic(
  () => import("@/src/dashboard/dropshipping/DropshippingAnalytics"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading analytics...</p></div> }
);

export default function Page() {
  return (
    <DashboardGuard section="dropshipping">
      <DropshippingAnalytics />
    </DashboardGuard>
  );
}
