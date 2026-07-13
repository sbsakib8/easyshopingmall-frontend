"use client";

import CustomerGroups from"@/src/dashboard/customers/customerGroups"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=> {
 return (
 <DashboardGuard section="customers">
 <div>
 <CustomerGroups/>
 </div>
 </DashboardGuard>
 )
}

export default page
