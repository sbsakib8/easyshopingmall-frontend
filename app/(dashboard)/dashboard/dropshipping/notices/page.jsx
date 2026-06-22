"use client";

import dynamic from "next/dynamic";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const ManageNotices = dynamic(
  () => import("@/src/dashboard/dropshipping/ManageNotices"),
  { ssr: false }
);

export default function NoticesPage() {
  return (
    <DashboardGuard section="dropshipping">
      <ManageNotices />
    </DashboardGuard>
  );
}
