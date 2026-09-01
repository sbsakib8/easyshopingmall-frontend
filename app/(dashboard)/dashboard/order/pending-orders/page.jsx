"use client";

import OrderManagementPage from "@/src/dashboard/order/OrderManagementPage";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const PendingOrders = () => {
  return (
    <DashboardGuard section="orders">
      <OrderManagementPage />
    </DashboardGuard>
  );
};

export default PendingOrders;
