import ShopPage from "@/src/compronent/shop/shopComponent"
import { ProductAllGet } from "@/src/hook/useProduct";
import { CategoryAllGet } from "@/src/hook/usecategory";
import { SubCategoryAllGet } from "@/src/hook/useSubcategory";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Shop - Huge Collection of Quality Products",
  description: "Browse our extensive collection of high-quality products across multiple categories. Best deals and fast delivery in Bangladesh.",
  openGraph: {
    title: "Shop Online at EasyShoppingMallBD",
    description: "Discover thousands of products at the best prices. Fashion, electronics, home goods and more.",
    type: "website",
  },
};

async function getShopData(searchParams) {
  try {
    const { search, category, subcategory, sortBy } = searchParams || {};

    const [productsResponse, categories, subCategories] = await Promise.all([
      ProductAllGet({
        limit: 1000,
        search: search || "",
        categoryId: category || "all",
        subCategoryId: subcategory || "all",
        sortBy: sortBy || "name"
      }),
      CategoryAllGet(),
      SubCategoryAllGet()
    ]);

    return {
      products: productsResponse?.products || productsResponse?.data || productsResponse || [],
      categories: categories?.data || [],
      subcategories: subCategories?.data || [],
      totalCount: productsResponse?.totalCount || 0
    };
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return { products: [], categories: [], subcategories: [], totalCount: 0 };
  }
}

const shop = async (props) => {
  const searchParams = await props.searchParams;
  const initialData = await getShopData(searchParams);

  return (
    <div>
      <ShopPage initialData={initialData} queryParams={searchParams} />
    </div>
  )
}

export default shop