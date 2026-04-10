import ShopPage from "@/src/compronent/shop/shopComponent";
import { UrlBackend } from "@/src/confic/urlExport";
import { Suspense } from "react";
import { ShopPageSkeleton } from "@/src/compronent/loading/ProductGridSkeleton";

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

async function getProducts() {
  try {
    const allProducts = [];
    let page = 1;
    let limit = 100;
    let totalFetched = 0;
    let totalCount = 0;

    do {
      const res = await fetch(`${UrlBackend}/products/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, limit }),
        next: { revalidate: 60 }
      });

      if (!res.ok) break;

      const json = await res.json();
      const products = json.data || json.products || (Array.isArray(json) ? json : []);
      if (products.length === 0) break;

      allProducts.push(...products);
      totalFetched += products.length;
      totalCount = json.totalCount || totalFetched;
      page++;
      
      // Prevent accidental infinite loops or excessive payload on server
      if (page > 50) break; 
    } while (totalFetched < totalCount);

    return { products: allProducts, totalCount: allProducts.length };

  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}

async function ShopContent({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  // Prefetch ALL products, categories and subcategories on the server for instant client-side experience
  const [productsData, categories, subcategories] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubCategories()
  ]);

  const initialData = {
    products: productsData.products,
    totalCount: productsData.totalCount,
    categories: categories,
    subcategories: subcategories
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
        "url": `https://easyshoppingmallbd.com/product/${product._id || product.id}`,
        "name": product.productName || product.name,
        "image": product.images?.[0] || product.image || "",
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopPage initialData={initialData} queryParams={resolvedSearchParams} />
    </>
  );
}

export default function Shop({ searchParams }) {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}