import ManageCoupons from"@/src/dashboard/coupons/manageCoupons";
import { Suspense } from "react";

const CouponsPage = () => {
 return (
 <>
  <Suspense fallback={null}>
    <ManageCoupons />
  </Suspense>
 </>
 );
};

export default CouponsPage;
