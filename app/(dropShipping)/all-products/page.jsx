export const dynamic = "force-dynamic";

import SubCategoryCardSection from "@/src/dropShipping/SubCategoryCardSection/SubCategoryCardSection";

export const metadata = {
  title: "All Products",
  description: "Browse all available products for dropshipping on EasyShoppingMallBD. Find trending products to sell and earn profit.",
  keywords: ["all products", "dropshipping products", "easy shopping mall products", "trending products bangladesh"],
  openGraph: {
    title: "All Products - EasyShoppingMallBD Dropshipping",
    description: "Browse all available products for dropshipping on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/all-products",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/all-products" },
  robots: { index: false, follow: true },
};

const AllProducts = () => <SubCategoryCardSection pageType="all-products" />;

export default AllProducts;
