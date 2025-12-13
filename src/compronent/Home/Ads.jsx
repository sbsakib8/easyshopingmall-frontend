"use client";

import { useGetCenterBanner } from "@/src/utlis/banner/useCenterBanner";
import Image from "next/image";

function Ads() {
  const { ads, loading, error } = useGetCenterBanner();

  if (loading || error) return null;

  // ✅ AUTO-HIDE INACTIVE ADS
  const activeAds = Array.isArray(ads)
    ? ads.filter(
      (item) =>
        item?.status === "active" &&
        Array.isArray(item?.images) &&
        item.images.length > 0
    )
    : [];

  if (!activeAds.length) return null;

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2 px-3">
        {activeAds.map((item) => (
          <div key={item._id} className="flex justify-center">
            <div className="w-[150px] md:w-[200px] lg:w-[320px] xl:w-[360px]">
              <Image
                src={item.images[0]}
                width={400}
                height={400}
                alt={item.title || "Advertisement"}
                className="object-cover bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg hover:scale-110 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ads;
