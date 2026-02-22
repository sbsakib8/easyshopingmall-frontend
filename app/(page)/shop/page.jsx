import ShopPage from "@/src/compronent/shop/shopComponent";
import { UrlBackend } from "@/src/confic/urlExport";

export const metadata = {
  title: "Shop - Huge Collection of Quality Products",
  description: "Browse our extensive collection of high-quality products across multiple categories. Best deals and fast delivery in Bangladesh.",
  openGraph: {
    title: "Shop Online at EasyShoppingMallBD",
    description: "Discover thousands of products at the best prices. Fashion, home goods and more.",
    type: "website",
    keywords: ["shop", "online", "products", "fashion", "home goods", "best deals", "fast delivery", "Bangladesh", "EasyShoppingMallBD", "men fashion", "woman fashion"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop - Huge Collection of Quality Products",
    "description": "Browse our extensive collection of high-quality products across multiple categories. Best deals and fast delivery in Bangladesh.",
    "url": "https://easyshoppingmallbd.com/shop",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": productsData.totalCount,
      "itemListElement": productsData.products.slice(0, 20).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://easyshoppingmallbd.com/product/${product._id}`,
        "name": product.name,
        "image": product.images?.[0] || product.image || "",
      }))
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopPage initialData={initialData} queryParams={resolvedSearchParams} />
    </div>
  )
}

export default shop