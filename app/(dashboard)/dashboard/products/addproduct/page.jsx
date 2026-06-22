"use client";

import AddProductComponent from"@/src/dashboard/product/addproduct/addProduct"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const addproduct=()=> {
 return (
 <DashboardGuard section="products">
 <div>
 <AddProductComponent/>
 </div>
 </DashboardGuard>
 )
}

export default addproduct
