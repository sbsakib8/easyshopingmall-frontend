"use client";

import UserRoleManager from"@/src/dashboard/settings/userUpdate"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const userupdate=()=> {
 return (
 <DashboardGuard section="settings">
 <div><UserRoleManager/></div>
 </DashboardGuard>
 )
}

export default userupdate
