'use client'
import Hero from "@/src/compronent/Home/Hero";
import HomeSkeleton from "@/src/compronent/loading/HomeSkeleton";
import DropShippingHome from "@/src/dropShipping/dropShippingHome/dropShippingHome";
import { CategoryAllGet } from "@/src/hook/usecategory";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";
import { ProductAllGet } from "@/src/hook/useProduct";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HomeContent() {
  const user = useSelector((state) => state.user.data);
  const role = user?.role || 'USER';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [banners, categories, productsResponse] = await Promise.all([
          HomeBannerAllGet(),
          CategoryAllGet(),
          ProductAllGet({ page: 1, limit: 20 }),
        ]);

        setData({
          banners: banners?.data || [],
          categories: categories?.data || [],
          products: productsResponse?.products || productsResponse?.data || productsResponse || [],
          ads: { center: [], left: [], right: [] }, // Keep logic same as before
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
        setData({ banners: [], categories: [], products: [], ads: { center: [], left: [], right: [] } });
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      {role === "DROPSHIPPING" ?
        <DropShippingHome initialData={data} /> :
        <Hero initialData={data} />
      }
    </>
  );
}
