"use client";

import CourierCostPage from "@/src/dashboard/courier/CourierCostPage";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page = () => {
  return (
    <DashboardGuard section="orders">
      <div>
        <CourierCostPage />
      </div>
    </DashboardGuard>
  );
};

export default page;
