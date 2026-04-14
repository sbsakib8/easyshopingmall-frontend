import { UrlBackend } from "@/src/confic/urlExport";
import HomeContent from "./HomeContent";

// Enable revalidation
export const dynamic = 'force-dynamic';

async function getCategories() {
  try {
    const res = await fetch(`${UrlBackend}/categories`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getSubCategories() {
  try {
    const res = await fetch(`${UrlBackend}/subcategories`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

async function getBanners() {
  try {
    const res = await fetch(`${UrlBackend}/homeBannerRoutes/get`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch (error) {
    console.error("Error fetching banners:", error);
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

    const seenIds = new Set();

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

      products.forEach(p => {
        const id = p._id || p.id;
        if (id && !seenIds.has(id)) {
          allProducts.push(p);
          seenIds.add(id);
        }
      });

      totalFetched += products.length;
      totalCount = json.totalCount || totalFetched;
      page++;

      if (page > 30) break;
    } while (totalFetched < totalCount);

    return { products: allProducts, totalCount: allProducts.length };

  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}

export default async function Home() {
  const [banners, categories, subcategories, productsData] = await Promise.all([
    getBanners(),
    getCategories(),
    getSubCategories(),
    getProducts()
  ]);

  const initialData = {
    banners: banners,
    categories: categories,
    subcategories: subcategories,
    products: productsData.products,
    totalCount: productsData.totalCount,
    ads: null,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EasyShoppingMallBD",
    "url": "https://easyshoppingmallbd.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://easyshoppingmallbd.com/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EasyShoppingMallBD",
    "url": "https://easyshoppingmallbd.com",
    "logo": "https://easyshoppingmallbd.com/icon.png",
    "sameAs": [
      "https://www.facebook.com/EasyShoppingMallBD",
    ]
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeContent initialData={initialData} />
    </div>
  );
}
