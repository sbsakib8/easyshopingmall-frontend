"use client";

import AllCustomersPage from"@/src/dashboard/customers/allCustomers"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=> {
 return (
 <DashboardGuard section="customers">
 <div>
 <AllCustomersPage/>
 </div>
 </DashboardGuard>
 )
}

export default page
