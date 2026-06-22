"use client";

import ShippedOrdersPage from"@/src/dashboard/order/shippedOrder"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const shippedorder=()=> {
 return (
 <DashboardGuard section="orders">
 <div>
 <ShippedOrdersPage/>
 </div>
 </DashboardGuard>
 )
}

export default shippedorder
