import Hero from "@/src/compronent/Home/Hero";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";
import { CategoryAllGet } from "@/src/hook/usecategory";
import { ProductAllGet } from "@/src/hook/useProduct";
import DropShippingHome from "@/src/dropShipping/dropShippingHome/dropShippingHome";
import { cookies } from "next/headers";
import { UrlBackend } from "@/src/confic/urlExport";

// Enable ISR with 5-minute revalidation for better performance
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Home - Best Online Shopping Experience in BD",
  description: "Welcome to EasyShoppingMallBD, your trusted partner for premium online shopping in Bangladesh. Quality products, secured payments, and lightning-fast delivery.",
};

async function getHomeData() {
  try {
    // Only fetch absolute must-haves on the server to speed up initial response
    const [banners, categories, productsResponse] = await Promise.all([
      HomeBannerAllGet(),
      CategoryAllGet(),
      ProductAllGet({ page: 1, limit: 20 }), // Fetch a smaller batch initially
    ]);

    return {
      banners: banners?.data || [],
      categories: categories?.data || [],
      products: productsResponse?.products || productsResponse?.data || productsResponse || [],
      ads: { center: [], left: [], right: [] }, // Load ads lazily on client
      subcategories: [] // Load subcategories lazily
    };
  } catch (error) {
    console.error("Error fetching home data via hooks:", error);
    return { banners: [], categories: [], products: [], ads: { center: [], left: [], right: [] } };
  }
}

async function getUser() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) return null;

    const res = await fetch(`${UrlBackend}/users/userprofile`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user || null;
  } catch (error) {
    console.error("Error fetching user profile on server:", error);
    return null;
  }
}

export default async function Home() {
  const [data, user] = await Promise.all([
    getHomeData(),
    getUser(),
  ]);

  const role = user?.role || 'USER';
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is EasyShoppingMallBD?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EasyShoppingMallBD is your trusted partner for premium online shopping in Bangladesh, offering quality products, secured payments, and lightning-fast delivery."
        }
      },
      {
        "@type": "Question",
        "name": "How can I place an order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout with your delivery details."
        }
      },
      {
        "@type": "Question",
        "name": "What are the delivery charges?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery charges vary depending on your location and the size of your order. You can see the exact charge at the checkout page."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer home delivery across Bangladesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide fast and reliable home delivery services all across Bangladesh."
        }
      },
      {
        "@type": "Question",
        "name": "What are the available payment methods?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support various secured payment methods, including Cash on Delivery and popular mobile banking services in Bangladesh."
        }
      }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {role === "DROPSHIPPING" ? <DropShippingHome initialData={data} /> : <Hero initialData={data} />}
    </div>
  );
}
