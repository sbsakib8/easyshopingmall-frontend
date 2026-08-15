import ReferralProfileClient from "./ReferralProfileClient";

export const metadata = {
  title: "Refer & Earn Program",
  description: "Invite friends to EasyShoppingMallBD and earn ৳10 for every ৳500 they spend. Share your referral code and start earning today.",
  keywords: ["referral program", "refer and earn", "referral code", "easy shopping mall referral", "earn by referring"],
  openGraph: {
    title: "Refer & Earn Program - EasyShoppingMallBD",
    description: "Invite friends to EasyShoppingMallBD and earn ৳10 for every ৳500 they spend.",
    url: "https://easyshoppingmallbd.com/referral-profile",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refer & Earn Program - EasyShoppingMallBD",
    description: "Invite friends to EasyShoppingMallBD and earn ৳10 for every ৳500 they spend.",
  },
  alternates: { canonical: "/referral-profile" },
  robots: { index: false, follow: true },
};

export default function ReferralProfilePage() {
  return <ReferralProfileClient />;
}
