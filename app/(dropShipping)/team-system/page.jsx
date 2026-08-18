import TeamSystemPage from "@/src/dropShipping/TeamSystemPage/TeamSystemPage";

export const metadata = {
  title: "Team System",
  description: "Build your dropshipping team on EasyShoppingMallBD. Earn referral commissions by growing your network.",
  keywords: ["team system", "referral team", "network building", "easy shopping mall team"],
  openGraph: {
    title: "Team System - EasyShoppingMallBD Dropshipping",
    description: "Build your dropshipping team on EasyShoppingMallBD. Earn referral commissions.",
    url: "https://easyshoppingmallbd.com/team-system",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/team-system" },
  robots: { index: false, follow: true },
};

const TeamSystem = () => {
  return <TeamSystemPage />;
};

export default TeamSystem;
