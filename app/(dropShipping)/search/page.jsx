export const dynamic = "force-dynamic";

import DropshippingSearch from "@/src/dropShipping/dropshippingSearch/DropshippingSearch";

export const metadata = {
  title: "Product Search",
  description: "Search products by name, title, or upload an image to find similar products for dropshipping on EasyShoppingMallBD.",
  keywords: ["product search", "find products", "image search", "easy shopping mall search", "dropshipping product search"],
  openGraph: {
    title: "Product Search - EasyShoppingMallBD Dropshipping",
    description: "Search products by name, title, or upload an image to find similar products.",
    url: "https://easyshoppingmallbd.com/search",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

const SearchPage = () => <DropshippingSearch />;

export default SearchPage;
