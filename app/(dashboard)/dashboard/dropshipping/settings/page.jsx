"use client";

import DropshippingSettings from "@/src/dashboard/dropshipping/DropshippingSettings";
import DashboardGuard from "@/src/utlis/DashboardGuard";

export default function Page() {
  return (
    <DashboardGuard section="dropshipping">
      <DropshippingSettings />
    </DashboardGuard>
  );
}
