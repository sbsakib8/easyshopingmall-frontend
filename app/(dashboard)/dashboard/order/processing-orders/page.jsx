"use client";

import PendingOrdersPage from "@/src/dashboard/order/pendingOrder";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const PendingOrders = () => {
  return (
    <DashboardGuard section="orders">
      <PendingOrdersPage />
    </DashboardGuard>
  );
};

export default PendingOrders;
