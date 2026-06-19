"use client";

import dynamic from "next/dynamic";

const DropshippingAnalytics = dynamic(
  () => import("@/src/dashboard/dropshipping/DropshippingAnalytics"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading analytics...</p></div> }
);

export default function Page() {
  return <DropshippingAnalytics />;
}
