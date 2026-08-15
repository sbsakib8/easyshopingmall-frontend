import PassiveIncomeClient from "./PassiveIncomeClient";

export const metadata = {
  title: "Passive Income Opportunities",
  description: "Earn passive income with EasyShoppingMallBD. Join Box Leader, Auditor, or Member tiers and earn commissions while you sleep.",
  keywords: ["passive income", "box leader", "auditor", "membership income", "earn while you sleep", "easy shopping mall passive income"],
  openGraph: {
    title: "Passive Income Opportunities - EasyShoppingMallBD",
    description: "Earn passive income with EasyShoppingMallBD. Join Box Leader, Auditor, or Member tiers.",
    url: "https://easyshoppingmallbd.com/passive-income",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passive Income Opportunities - EasyShoppingMallBD",
    description: "Earn passive income with EasyShoppingMallBD. Join Box Leader, Auditor, or Member tiers.",
  },
  alternates: { canonical: "/passive-income" },
  robots: { index: false, follow: true },
};

export default function PassiveIncomePage() {
  return <PassiveIncomeClient />;
}
