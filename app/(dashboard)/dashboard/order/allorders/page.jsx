"use client";

import CompletedOrdesPager from "@/src/dashboard/order/completedOrder";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const CompletedOrders = () => {
  return (
    <DashboardGuard section="orders">
      <CompletedOrdesPager />
    </DashboardGuard>
  );
};

export default CompletedOrders;
