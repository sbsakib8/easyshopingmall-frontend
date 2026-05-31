import PaymentRequestForm from "@/src/dropShipping/paymentRequest/PaymentRequestForm";

export const metadata = {
    title: "Payment Request | Dropshipping Dashboard",
    description: "Request balance top-up by submitting payment proof.",
};

export default function PaymentRequestPage() {
    return (
        <div className="pt-2 min-h-screen bg-slate-50/50">
            <PaymentRequestForm />
        </div>
    );
}
