export const dynamic = "force-dynamic";

import DropshippingSearch from "@/src/dropShipping/dropshippingSearch/DropshippingSearch";

export const metadata = {
  title: "Product Search | Easy Shopping Mall",
  description: "Search products by name, title, or upload an image to find similar products.",
};

const SearchPage = () => <DropshippingSearch />;

export default SearchPage;
