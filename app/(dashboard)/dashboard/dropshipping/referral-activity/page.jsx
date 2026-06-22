"use client";

import ReferralActivity from "@/src/dashboard/dropshipping/ReferralActivity";
import DashboardGuard from "@/src/utlis/DashboardGuard";

export default function Page() {
  return (
    <DashboardGuard section="dropshipping">
      <ReferralActivity />
    </DashboardGuard>
  );
}
