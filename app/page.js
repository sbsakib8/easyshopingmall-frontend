import { UrlBackend } from "@/src/confic/urlExport";
import HomeContent from "./HomeContent";

export const revalidate = 60;

async function getCategories() {
  try {
    const res = await fetch(`${UrlBackend}/categories`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch {
    return [];
  }
}

async function getSubCategories() {
  try {
    const res = await fetch(`${UrlBackend}/subcategories`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch {
    return [];
  }
}

async function getBanners() {
  try {
    const res = await fetch(`${UrlBackend}/homeBannerRoutes/get`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || (Array.isArray(json) ? json : []);
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${UrlBackend}/homepage/popular-products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, limit: 80 }),
      next: { revalidate: 300 }
    });

    if (!res.ok) return { products: [], totalCount: 0 };

    const json = await res.json();
    const products = json.data?.products || json.data || [];
    const totalCount = json.data?.totalCount || products.length;

    return { products, totalCount };

  } catch {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeContent initialData={initialData} />
    </>
  );
}