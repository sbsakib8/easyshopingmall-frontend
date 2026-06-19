"use client";

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
  const role = user?.role || "USER";
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // If server-fetched data has real content, use it; otherwise fetch client-side
    const hasContent = initialData?.products?.length > 0 || initialData?.categories?.length > 0;
    if (hasContent) {
      setData(initialData);
      setLoading(false);
      return;
    }

    // Fallback fetch only if initialData was not provided (e.g. client-side navigation issues)
    async function fetchHomeData() {
      try {
        setLoading(true);
        const [banners, categories, productsRes] = await Promise.all([
          HomeBannerAllGet(),
          CategoryAllGet(),
          ProductAllGet({ page: 1, limit: 100 }),
        ]);

        const products = productsRes?.data || productsRes?.products || [];
        setData({
          banners: banners?.data || [],
          categories: categories?.data || [],
          products: products,
          ads: { center: [], left: [], right: [] },
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setLoading(false);
      }
    }

    fetchHomeData();
  }, [initialData]);

  if (loading && !data) return <HomeSkeleton />;

  const isDropshipper = role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING");
  const filteredBanners = (data?.banners || []).filter(banner => {
    if (isDropshipper) {
      return banner.sliderFor === "DROPSHIPPING";
    } else {
      return banner.sliderFor === "USER" || !banner.sliderFor;
    }
  });

  const displayData = {
    ...data,
    banners: filteredBanners
  };

  return (
    <>
      {role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING") ? (
        <DropShippingHome initialData={displayData} />
      ) : (
        <Hero initialData={displayData} />
      )}
    </>
  );
}
