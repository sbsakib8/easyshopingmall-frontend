"use client";

import VideoManagement from "@/src/dashboard/dropshipping/VideoManagement";
import DashboardGuard from "@/src/utlis/DashboardGuard";

export default function ManageVideosAdminPage() {
  return (
    <DashboardGuard section="dropshipping">
      <VideoManagement />
    </DashboardGuard>
  );
}
