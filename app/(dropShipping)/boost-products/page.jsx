export const dynamic = "force-dynamic";

import SubCategoryCardSection from "@/src/dropShipping/SubCategoryCardSection/SubCategoryCardSection";

export const metadata = {
  title: "Boost Products",
  description: "Discover boosted and promoted products for dropshipping on EasyShoppingMallBD. High-demand products with better margins.",
  keywords: ["boost products", "promoted products", "dropshipping boost", "easy shopping mall boost"],
  openGraph: {
    title: "Boost Products - EasyShoppingMallBD Dropshipping",
    description: "Discover boosted and promoted products for dropshipping on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/boost-products",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/boost-products" },
  robots: { index: false, follow: true },
};

const BoostProducts = () => (
  <SubCategoryCardSection pageType="boost-products" />
);

export default BoostProducts;
