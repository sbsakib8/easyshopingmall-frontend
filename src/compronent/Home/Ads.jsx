"use client";


import { useGetCenterBanner } from "@/src/utlis/banner/useCenterBanner";
import { useGetLeftBanner } from "@/src/utlis/banner/useLeftBanner";
import { useGetRightBanner } from "@/src/utlis/banner/userRightBanner";
import Image from "next/image";
import { useEffect, useState } from "react";


function Ads({ initialData }) {
  const { ads: apiAds, loading: apiLoading, error } = useGetCenterBanner();
  const { leftbanner: apiLeft, loading: leftLoadingApi, error: leftError } = useGetLeftBanner();
  const { rightbanner: apiRight, loading: rightLoadingApi, error: rightError } = useGetRightBanner();

  const [ads, setAds] = useState(initialData?.center || null);
  const [leftbanner, setLeftBanner] = useState(initialData?.left || null);
  const [rightbanner, setRightBanner] = useState(initialData?.right || null);
  const [loading, setLoading] = useState(!initialData);

  const [closedLeftAds, setClosedLeftAds] = useState([]);
  const [closedRightAds, setClosedRightAds] = useState([]);

  useEffect(() => {
    if (apiAds) setAds(apiAds);
    if (apiLeft) setLeftBanner(apiLeft);
    if (apiRight) setRightBanner(apiRight);
    if (apiAds || apiLeft || apiRight) setLoading(false);
  }, [apiAds, apiLeft, apiRight]);


  if (loading && !initialData) return null;


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


  // ✅ Filter active left banner ads
  const activeLeftAds = Array.isArray(leftbanner)
    ? leftbanner.filter(
      (item) =>
        item?.status === "active" &&
        Array.isArray(item?.images) &&
        item.images.length > 0
    )
    : [];


  console.log('=== ACTIVE LEFT ADS ===');
  console.log('activeLeftAds:', activeLeftAds);
  console.log('activeLeftAds count:', activeLeftAds.length);


  // ✅ Filter active right banner ads
  const activeRightAds = Array.isArray(rightbanner)
    ? rightbanner.filter(
      (item) =>
        item?.status === "active" &&
        Array.isArray(item?.images) &&
        item.images.length > 0
    )
    : [];


  console.log('=== ACTIVE RIGHT ADS ===');
  console.log('activeRightAds:', activeRightAds);
  console.log('activeRightAds count:', activeRightAds.length);

  // Filter out closed ads
  const visibleLeftAds = activeLeftAds.filter(ad => !closedLeftAds.includes(ad._id));
  const visibleRightAds = activeRightAds.filter(ad => !closedRightAds.includes(ad._id));

  // Handler to close individual left ad
  const handleCloseLeftAd = (adId) => {
    setClosedLeftAds(prev => [...prev, adId]);
  };

  // Handler to close individual right ad
  const handleCloseRightAd = (adId) => {
    setClosedRightAds(prev => [...prev, adId]);
  };

  return (
    <div className="">
      <div className="relative">
        {/* Left Side Ad - Absolutely positioned */}
        {visibleLeftAds.length > 0 && (
          <div className="hidden lg:block absolute left-2 top-[-100px] z-10">
            <div className="space-y-3">
              {visibleLeftAds.map((ad, index) => (
                <div key={ad._id || index} className="relative bg-white shadow-lg rounded-lg p-2 border-2 border-gray-300">
                  <div className="absolute top-0 left-0 bg-gray-700 text-accent-content text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                    Ad
                  </div>
                  <button
                    onClick={() => handleCloseLeftAd(ad._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-accent-content rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold z-10"
                    aria-label="Close this ad"
                  >
                    ×
                  </button>
                  <div className="w-[120px]">
                    <Image
                      src={ad.images[0]}
                      width={120}
                      height={200}
                      alt={ad.title || "Left Advertisement"}
                      className="object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Ads Grid - Always centered */}
        <div className="container mx-auto max-w-8xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-3">
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

        {/* Right Side Ad - Absolutely positioned */}
        {visibleRightAds.length > 0 && (
          <div className="hidden lg:block absolute right-2  top-[-100] z-10">
            <div className="space-y-3">
              {visibleRightAds.map((ad, index) => (
                <div key={ad._id || index} className="relative bg-white shadow-lg rounded-lg p-2 border-2 border-gray-300">
                  <div className="absolute top-0 left-0 bg-gray-700 text-accent-content text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                    Ad
                  </div>
                  <button
                    onClick={() => handleCloseRightAd(ad._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-accent-content rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold z-10"
                    aria-label="Close this ad"
                  >
                    ×
                  </button>
                  <div className="w-[120px]">
                    <Image
                      src={ad.images[0]}
                      width={120}
                      height={200}
                      alt={ad.title || "Right Advertisement"}
                      className="object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default Ads;



