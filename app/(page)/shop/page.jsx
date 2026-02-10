import ShopPage from "@/src/compronent/shop/shopComponent";
import { UrlBackend } from "@/src/confic/urlExport";

export const metadata = {
  title: "Shop - Huge Collection of Quality Products",
  description: "Browse our extensive collection of high-quality products across multiple categories. Best deals and fast delivery in Bangladesh.",
  openGraph: {
    title: "Shop Online at EasyShoppingMallBD",
    description: "Discover thousands of products at the best prices. Fashion, electronics, home goods and more.",
    type: "website",
  },
};

async function getCategories() {
  try {
    const res = await fetch(`${UrlBackend}/category/get`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getSubCategories() {
  try {
    const res = await fetch(`${UrlBackend}/sub_category/get`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

async function getProducts(searchParams) {
  try {
    const { search, category, subcategory, sortBy } = searchParams || {};

    // Construct the body for the POST request (matching your backend expectation)
    const body = {
      limit: 100, // Optimized limit for initial server render
      search: search || "",
      categoryId: category || "all",
      subCategoryId: subcategory || "all",
      sortBy: sortBy || "name"
    };

    const res = await fetch(`${UrlBackend}/products/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      next: { revalidate: 60, tags: ['products'] } // Cache for 60 seconds
    });

    if (!res.ok) return { products: [], totalCount: 0 };

    const json = await res.json();
    const products = json.products || json.data || json || [];
    const totalCount = json.totalCount || products.length || 0;

    return { products, totalCount };

  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}

const shop = async ({ searchParams }) => {
  // Await searchParams if it's a promise (Next.js 15+ changes, but safe to await in recent versions)
  const resolvedSearchParams = await searchParams;

  const [productsData, categories, subcategories] = await Promise.all([
    getProducts(resolvedSearchParams),
    getCategories(),
    getSubCategories()
  ]);

  const initialData = {
    products: productsData.products,
    totalCount: productsData.totalCount,
    categories,
    subcategories
  };

  return (
    <div>
      <ShopPage initialData={initialData} queryParams={resolvedSearchParams} />
    </div>
  )
}

export default shop