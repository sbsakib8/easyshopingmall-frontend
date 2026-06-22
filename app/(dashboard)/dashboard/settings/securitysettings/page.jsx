"use client";

import SecuritySettings from"@/src/dashboard/settings/securitySettings"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const securitySettings=()=> {
 return (
 <DashboardGuard section="settings">
 <div>
 <SecuritySettings/>
 </div>
 </DashboardGuard>
 )
}

export default securitySettings
