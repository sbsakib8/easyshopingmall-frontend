export const dynamic = "force-dynamic";

import SubCategoryCardSection from "@/src/dropShipping/SubCategoryCardSection/SubCategoryCardSection";

export const metadata = {
  title: "New Products",
  description: "Explore newly added products for dropshipping on EasyShoppingMallBD. Be the first to sell trending items.",
  keywords: ["new products", "latest products", "dropshipping new arrivals", "easy shopping mall new products"],
  openGraph: {
    title: "New Products - EasyShoppingMallBD Dropshipping",
    description: "Explore newly added products for dropshipping on EasyShoppingMallBD.",
    url: "https://easyshoppingmallbd.com/new-products",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/new-products" },
  robots: { index: false, follow: true },
};

const NewProducts = () => <SubCategoryCardSection pageType="new-products" />;

export default NewProducts;
