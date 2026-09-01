import DropshippingCartComponent from "@/src/dropShipping/dropshippingCart/DropshippingCartComponent";

export const metadata = {
  title: "Dropshipping Cart",
  description: "Manage your dropshipping cart on EasyShoppingMallBD. Review products, calculate profits, and place orders for your customers.",
  keywords: [
    "dropshipping cart",
    "dropshipping order list",
    "easy shopping mall cart",
    "dropshipping profit calculator",
  ],
  openGraph: {
    title: "Dropshipping Cart - EasyShoppingMallBD",
    description: "Manage your dropshipping cart on EasyShoppingMallBD. Review products, calculate profits, and place orders.",
    url: "https://easyshoppingmallbd.com/dropshipping-addtocart",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dropshipping Cart - EasyShoppingMallBD",
    description: "Manage your dropshipping cart on EasyShoppingMallBD. Review products, calculate profits, and place orders.",
  },
  alternates: {
    canonical: "/dropshipping-addtocart",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DropshippingCartPage() {
  return <DropshippingCartComponent />;
}
