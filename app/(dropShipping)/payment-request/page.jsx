import PaymentRequestClient from "./PaymentRequestClient";

export const metadata = {
    title: "Payment Request",
    description: "Request balance top-up on EasyShoppingMallBD by submitting payment proof. Quick and secure payment processing for dropshippers.",
    keywords: ["payment request", "balance top-up", "dropshipping payment", "easy shopping mall payment"],
    openGraph: {
        title: "Payment Request - EasyShoppingMallBD Dropshipping",
        description: "Request balance top-up on EasyShoppingMallBD by submitting payment proof.",
        url: "https://easyshoppingmallbd.com/payment-request",
        siteName: "EasyShoppingMallBD",
        type: "website",
    },
    alternates: { canonical: "/payment-request" },
    robots: { index: false, follow: true },
};

export default function PaymentRequestPage() {
    return <PaymentRequestClient />;
}
