import BalanceHistory from "@/src/dashboard/dropshipping/BalanceHistory";
import DashboardGuard from "@/src/utlis/DashboardGuard";

const BalanceHistoryPage = () => {
  return (
    <DashboardGuard section="dropshipping">
      <BalanceHistory />
    </DashboardGuard>
  );
};

export default BalanceHistoryPage;
