import ShopSettingsClient from "./ShopSettingsClient";

export const metadata = {
  title: "Shop Settings",
  description: "Manage your dropshipping business profile, payment details, and shop settings on EasyShoppingMallBD.",
  keywords: ["shop settings", "business profile", "payment settings", "easy shopping mall settings"],
  openGraph: {
    title: "Shop Settings - EasyShoppingMallBD Dropshipping",
    description: "Manage your dropshipping business profile and payment details.",
    url: "https://easyshoppingmallbd.com/shop-settings",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/shop-settings" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ShopSettingsClient />;
}
