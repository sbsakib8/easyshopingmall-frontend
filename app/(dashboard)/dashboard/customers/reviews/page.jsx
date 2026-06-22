"use client";

import ReviewsPage from"@/src/dashboard/customers/reviewsComponent"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const page=()=> {
 return (
 <DashboardGuard section="customers">
 <div>
 <ReviewsPage/>
 </div>
 </DashboardGuard>
 )
}

export default page
