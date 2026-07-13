"use client";

import GeneralSettings from"@/src/dashboard/settings/generalSettings"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const generalsetting=()=> {
 return (
 <DashboardGuard section="settings">
 <div>
 <GeneralSettings/>
 </div>
 </DashboardGuard>
 )
}

export default generalsetting
