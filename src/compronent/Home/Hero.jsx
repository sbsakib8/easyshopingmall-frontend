"use client";

import Carousels from "@/src/helper/Hero/Carousel";
import TrustBadges from "./TrustBadges";
import SubcategoryProductSections from "./SubcategoryProductSections";
import Categories from "./Categories";
import Ads from "./Ads";
import ChatBoot from "./ChatBoot";
import PopularProducts from "./popularProducts";

function Hero({ initialData }) {
  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Main Hero Carousel */}
      <Carousels initialData={initialData?.banners} />

      {/* 2. Trust Feature Badges */}
      <TrustBadges />

      {/* 3. Subcategories with 20 Products each (One-by-one carousel) & Center Banner in middle */}
      <SubcategoryProductSections initialData={initialData} />

      {/* 4. Side Ads if active */}
      <Ads initialData={initialData?.ads} />

      {/* 5. Featured Subcategories marquee */}
      <Categories initialData={initialData?.subcategories} />

      {/* 6. All Popular Products collection */}
      <PopularProducts initialData={initialData} />

      {/* 7. Chatbot */}
      <ChatBoot />
    </div>
  );
}

export default Hero;
