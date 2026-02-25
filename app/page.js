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
      "name": "EasyShoppingMallBD কী ধরনের প্ল্যাটফর্ম?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EasyShoppingMallBD একটি বাংলাদেশভিত্তিক ই-কমার্স ও অনলাইন আয়ের প্ল্যাটফর্ম। এখানে মানসম্মত পণ্য কেনার পাশাপাশি বিভিন্ন উপায়ে অনলাইনে কাজ ও আয়ের সুযোগ পাওয়া যায়।"
      }
    },
    {
      "@type": "Question",
      "name": "EasyShoppingMallBD-তে কীভাবে আয় করা যায়?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "এই প্ল্যাটফর্মে ইনভেস্টমেন্ট পার্টনারশিপ, নিজস্ব পণ্য বিক্রি (Seller Program), ড্রপশিপিং এবং অ্যাফিলিয়েট মার্কেটিং—এই চারটি পদ্ধতিতে কাজ করার সুযোগ রয়েছে। শর্ত অনুযায়ী অংশগ্রহণ করে আয় করা যায়।"
      }
    },
    {
      "@type": "Question",
      "name": "আমি কি নিজের পণ্য বিক্রি করতে পারি?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "হ্যাঁ, Seller Program-এর মাধ্যমে আপনি আপনার নিজস্ব পণ্য লিস্ট করতে পারেন। অর্ডার ম্যানেজমেন্ট ও পেমেন্ট প্রসেসিংয়ে প্ল্যাটফর্ম থেকে সহায়তা দেওয়া হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "ড্রপশিপিং কীভাবে কাজ করে?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ড্রপশিপিং পার্টনাররা স্টক না রেখেই পণ্য বিক্রি করতে পারেন। অর্ডার পাওয়া গেলে প্ল্যাটফর্ম থেকে সরাসরি গ্রাহকের কাছে পণ্য পাঠানো হয় এবং নির্ধারিত কমিশন প্রদান করা হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "অ্যাফিলিয়েট মার্কেটিং থেকে কীভাবে কমিশন পাওয়া যায়?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "আপনি ইউনিক প্রোডাক্ট লিংক বা কুপন কোড শেয়ার করবেন। আপনার শেয়ার করা লিংক থেকে সফল অর্ডার সম্পন্ন হলে নির্ধারিত কমিশন প্রদান করা হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "কেন EasyShoppingMallBD থেকে পণ্য কিনবো?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "আমরা যাচাইকৃত ও মানসম্মত পণ্য, সাশ্রয়ী মূল্য, নিরাপদ পেমেন্ট এবং দ্রুত ডেলিভারি সেবা প্রদান করি। নিয়মিত অফার ও গ্রাহক সাপোর্টের মাধ্যমে সহজ ও নির্ভরযোগ্য অনলাইন শপিং নিশ্চিত করা হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "কিভাবে অনলাইনে অর্ডার করবো?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "পছন্দের পণ্য নির্বাচন করে কার্টে যুক্ত করুন, এরপর চেকআউট পেজে আপনার তথ্য প্রদান করে অর্ডার নিশ্চিত করুন।"
      }
    },
    {
      "@type": "Question",
      "name": "বাংলাদেশের কোথায় কোথায় ডেলিভারি দেওয়া হয়?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "বাংলাদেশের সকল জেলা ও বিভাগে হোম ডেলিভারি সেবা প্রদান করা হয়। শহর ও গ্রাম উভয় এলাকায় কুরিয়ার সার্ভিসের মাধ্যমে পণ্য পৌঁছে দেওয়া হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "ডেলিভারি কত দিনে পাওয়া যাবে?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ঢাকার ভিতরে সাধারণত ১-৩ কার্যদিবস এবং ঢাকার বাইরে ২-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করা হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "পেমেন্টের কী কী মাধ্যম রয়েছে?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ এবং অন্যান্য মোবাইল ব্যাংকিং সেবা গ্রহণ করা হয়।"
      }
    },
    {
      "@type": "Question",
      "name": "পণ্য রিটার্ন বা এক্সচেঞ্জ করা যাবে কি?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ড্যামেজ বা ভুল পণ্য ডেলিভারি হলে নির্ধারিত সময়ের মধ্যে রিটার্ন বা এক্সচেঞ্জ করা যায়। বিস্তারিত জানতে রিটার্ন পলিসি দেখুন।"
      }
    },
    {
      "@type": "Question",
      "name": "কেনাকাটা কি নিরাপদ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "হ্যাঁ, নিরাপদ অর্ডার প্রসেসিং ও তথ্য সুরক্ষা নীতিমালা অনুসরণ করা হয়। গ্রাহকের ব্যক্তিগত তথ্য সুরক্ষিত রাখা হয়।"
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
