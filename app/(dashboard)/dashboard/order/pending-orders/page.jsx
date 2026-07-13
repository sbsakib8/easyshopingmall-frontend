"use client";

import OrderManagement from "@/src/dashboard/order/orderList";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const allorder = () => {
  return (
    <DashboardGuard section="orders">
      <OrderManagement />
    </DashboardGuard>
  );
};

export default allorder;
