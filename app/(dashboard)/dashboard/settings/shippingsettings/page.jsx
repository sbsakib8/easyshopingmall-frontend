"use client";

import ShippingSettings from"@/src/dashboard/settings/shippingSetting"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const shippingSettings=()=> {
 return (
 <DashboardGuard section="settings">
 <div>
 <ShippingSettings/>
 </div>
 </DashboardGuard>
 )
}

export default shippingSettings
