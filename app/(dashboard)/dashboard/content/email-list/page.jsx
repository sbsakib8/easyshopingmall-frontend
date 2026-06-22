"use client";

import ContactInboxDashboard from'@/src/dashboard/content/emailList'
import DashboardGuard from "@/src/utlis/DashboardGuard";

const email = ()=> {
 return (
 <DashboardGuard section="content">
 <div><ContactInboxDashboard/></div>
 </DashboardGuard>
 )
}

export default email
