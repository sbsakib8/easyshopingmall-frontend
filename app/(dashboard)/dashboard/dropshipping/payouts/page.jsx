import PayoutManagement from "@/src/dashboard/dropshipping/PayoutManagement";

export const metadata = {
    title: "Payment Requests | Admin Dashboard",
    description: "Review and approve manual payment requests from dropshippers.",
};

export default function PayoutsAdminPage() {
    return (
        <div className="p-6 md:p-8">
            <PayoutManagement />
        </div>
    );
}
