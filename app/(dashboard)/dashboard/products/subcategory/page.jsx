"use client";

import AddSubcategoriesComponent from "@/src/dashboard/product/categories/subCategory";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const categorieslist = () => {
  return (
    <DashboardGuard section="products">
      <div>
        <AddSubcategoriesComponent />
      </div>
    </DashboardGuard>
  );
};

export default categorieslist;
