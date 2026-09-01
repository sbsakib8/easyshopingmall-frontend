import DropshippingCheckoutClient from "./DropshippingCheckoutClient";

export const metadata = {
  title: "Dropshipping Checkout",
  description: "Complete your dropshipping order fulfillment on EasyShoppingMallBD. Fast processing and delivery for dropshippers.",
  keywords: [
    "dropshipping checkout",
    "dropshipping order",
    "easy shopping mall checkout",
    "dropshipping payment",
  ],
  openGraph: {
    title: "Dropshipping Checkout - EasyShoppingMallBD",
    description: "Complete your dropshipping order fulfillment on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/dropshipping-checkout",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dropshipping Checkout - EasyShoppingMallBD",
    description: "Complete your dropshipping order fulfillment on EasyShoppingMallBD.",
  },
  alternates: {
    canonical: "/dropshipping-checkout",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DropshippingCheckoutPage() {
  return <DropshippingCheckoutClient />;
}
