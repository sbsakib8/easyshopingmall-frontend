import MyAnalyticsClient from "./MyAnalyticsClient";

export const metadata = {
  title: "My Analytics",
  description: "View your dropshipping analytics on EasyShoppingMallBD. Track revenue, orders, and performance metrics.",
  keywords: ["analytics", "dropshipping analytics", "revenue tracking", "easy shopping mall analytics"],
  openGraph: {
    title: "My Analytics - EasyShoppingMallBD Dropshipping",
    description: "View your dropshipping analytics on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/my-analytics",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/my-analytics" },
  robots: { index: false, follow: true },
};

export default function MyAnalyticsPage() {
  return <MyAnalyticsClient />;
}
