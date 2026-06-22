"use client";

import PaymentSettings from"@/src/dashboard/settings/paymentSettings"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const paymentsettings=()=> {
 return (
 <DashboardGuard section="settings">
 <div>
 <PaymentSettings/>
 </div>
 </DashboardGuard>
 )
}

export default paymentsettings
