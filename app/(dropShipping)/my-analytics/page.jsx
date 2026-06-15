"use client";

import dynamic from "next/dynamic";

const MyAnalytics = dynamic(
  () => import("@/src/dashboard/dropshipping/MyAnalytics"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><p>Loading analytics...</p></div> }
);

export default function MyAnalyticsPage() {
  return <MyAnalytics />;
}
