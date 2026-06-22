"use client";

import VideoAccessManagement from "@/src/dashboard/dropshipping/VideoAccessManagement";
import DashboardGuard from "@/src/utlis/DashboardGuard";

export default function VideoRequestsAdminPage() {
  return (
    <DashboardGuard section="dropshipping">
      <VideoAccessManagement />
    </DashboardGuard>
  );
}
