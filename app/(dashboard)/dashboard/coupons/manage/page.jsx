"use client";

import ManageCoupons from"@/src/dashboard/coupons/manageCoupons";
import { Suspense } from "react";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const CouponsPage = () => {
 return (
 <DashboardGuard section="coupons">
  <Suspense fallback={null}>
    <ManageCoupons />
  </Suspense>
 </DashboardGuard>
 );
};

export default CouponsPage;
