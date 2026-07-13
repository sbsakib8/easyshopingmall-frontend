"use client";

import InventoryDashboard from"@/src/dashboard/product/inventory/inventoryComponent"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const inventory=()=> {
 return (
 <DashboardGuard section="products">
 <div>
 <InventoryDashboard/>
 </div>
 </DashboardGuard>
 )
}

export default inventory
