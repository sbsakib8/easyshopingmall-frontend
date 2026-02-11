import Hero from "@/src/compronent/Home/Hero";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";
import { CategoryAllGet } from "@/src/hook/usecategory";
import { ProductAllGet } from "@/src/hook/useProduct";
import { CenterBannerAllGet } from "@/src/hook/useCernterBanner";
import { LeftBannerAllGet } from "@/src/hook/useLeftBanner";
import { RightBannerAllGet } from "@/src/hook/userRightBanner";
import { SubCategoryAllGet } from "@/src/hook/useSubcategory";
import DropShippingHome from "@/src/dropShipping/dropShippingHome/dropShippingHome";

// Enable ISR with 5-minute revalidation for better performance
export const revalidate = 300;

export const metadata = {
  title: "Home - Best Online Shopping Experience in BD",
  description: "Welcome to EasyShoppingMallBD, your trusted partner for premium online shopping in Bangladesh. Quality products, secured payments, and lightning-fast delivery.",
};

async function getHomeData() {
  try {
    const [banners, categories, productsResponse, centerAds, leftAds, rightAds, subCategories] = await Promise.all([
      HomeBannerAllGet(),
      CategoryAllGet(), // No dispatch passed so it works on server
      ProductAllGet({ page: 1, limit: 100 }),
      CenterBannerAllGet(),
      LeftBannerAllGet(),
      RightBannerAllGet(),
      SubCategoryAllGet()
    ]);

    return {
      banners: banners?.data || [],
      categories: categories?.data || [],
      subcategories: subCategories?.data || [],
      products: productsResponse?.products || productsResponse?.data || productsResponse || [],
      ads: {
        center: centerAds?.data || [],
        left: leftAds?.data || [],
        right: rightAds?.data || []
      }
    };
  } catch (error) {
    console.error("Error fetching home data via hooks:", error);
    return { banners: [], categories: [], products: [], ads: { center: [], left: [], right: [] } };
  }
}

export default async function Home() {
  const data = await getHomeData();

  const role = 'USER'
  return (
    <div>
      {role === "DROPSHIPPING" ? <DropShippingHome initialData={data} /> : <Hero initialData={data} />}
    </div>
  );
}
