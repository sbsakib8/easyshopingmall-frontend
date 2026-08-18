import SellerDashboardClient from "./SellerDashboardClient";

export const metadata = {
  title: "Seller Dashboard",
  description: "Manage your dropshipping business from the EasyShoppingMallBD seller dashboard. Track orders, revenue, and performance.",
  keywords: ["seller dashboard", "dropshipping dashboard", "business management", "easy shopping mall seller"],
  openGraph: {
    title: "Seller Dashboard - EasyShoppingMallBD Dropshipping",
    description: "Manage your dropshipping business from the EasyShoppingMallBD seller dashboard.",
    url: "https://easyshoppingmallbd.com/seller-dashboard",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/seller-dashboard" },
  robots: { index: false, follow: true },
};

export default function SellerDashboardPage() {
  return <SellerDashboardClient />;
}
