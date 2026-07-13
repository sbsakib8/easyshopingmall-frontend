"use client";

import AddCategoriesComponent from"@/src/dashboard/product/categories/addCategories"
import DashboardGuard from "@/src/utlis/DashboardGuard";

const addcategorie=()=> {
 return (
 <DashboardGuard section="products">
 <div>
 <AddCategoriesComponent/>
 </div>
 </DashboardGuard>
 )
}

export default addcategorie
