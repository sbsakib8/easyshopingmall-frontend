"use client";

import PayoutManagement from "@/src/dashboard/dropshipping/PayoutManagement";
import DashboardGuard from "@/src/utlis/DashboardGuard";

export default function PayoutsAdminPage() {
    return (
        <DashboardGuard section="dropshipping">
            <div className="p-6 md:p-8">
                <PayoutManagement />
            </div>
        </DashboardGuard>
    );
}
