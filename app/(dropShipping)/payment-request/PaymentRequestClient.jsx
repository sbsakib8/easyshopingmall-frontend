"use client";

import dynamic from "next/dynamic";

const PaymentRequestForm = dynamic(
  () => import("@/src/dropShipping/paymentRequest/PaymentRequestForm"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    ),
  }
);

export default function PaymentRequestClient() {
  return (
    <div className="pt-2 min-h-screen bg-slate-50/50">
      <PaymentRequestForm />
    </div>
  );
}
