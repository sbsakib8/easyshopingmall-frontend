'use client'
import Hero from "@/src/compronent/Home/Hero";
import HomeSkeleton from "@/src/compronent/loading/HomeSkeleton";
import DropShippingHome from "@/src/dropShipping/dropShippingHome/dropShippingHome";
import { CategoryAllGet } from "@/src/hook/usecategory";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";
import { ProductAllGet } from "@/src/hook/useProduct";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HomeContent({ initialData }) {
  const user = useSelector((state) => state.user.data);
  const role = user?.role || 'USER';
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    async function fetchRemainingProducts() {
      try {
        let page = 2; // Start from page 2 since page 1 (first 12) is already display
        let limit = 40;
        let fetchedCount = 0;
        const maxBackgroundProducts = 200; // Limit background fetch to keep things fast

        while (fetchedCount < maxBackgroundProducts) {
          const res = await ProductAllGet({ page, limit });
          const products = res.data || res.products || [];
          if (products.length === 0) break;

          setData(prev => ({
            ...prev,
            products: [...prev.products, ...products]
          }));

          fetchedCount += products.length;
          page++;
          if (products.length < limit) break;
        }
      } catch (error) {
        console.error("Background product fetch failed:", error);
      }
    }

    if (initialData) {
      // If we have initial data, render it immediately and then fetch more in background
      fetchRemainingProducts();
      return;
    }

    async function fetchHomeData() {
      try {
        const [banners, categories, productsRes] = await Promise.all([
          HomeBannerAllGet(),
          CategoryAllGet(),
          ProductAllGet({ page: 1, limit: 12 })
        ]);

        const initialProducts = productsRes?.data || productsRes?.products || [];
        setData({
          banners: banners?.data || [],
          categories: categories?.data || [],
          products: initialProducts,
          ads: { center: [], left: [], right: [] },
        });
        setLoading(false);

        // After initial fetch, get more
        fetchRemainingProducts();
      } catch (error) {
        console.error("Error fetching home data:", error);
        setData({ banners: [], categories: [], products: [], ads: { center: [], left: [], right: [] } });
        setLoading(false);
      }
    }

    fetchHomeData();
  }, [initialData]);

  // Removed initial loading skeleton to provide immediate page structure


  return (
    <>
      {role === "DROPSHIPPING" ?
        <DropShippingHome initialData={data} /> :
        <Hero initialData={data} />
      }
    </>
  );
}
