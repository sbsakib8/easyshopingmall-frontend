"use client";

import { useGetLeftBanner } from "@/src/utlis/banner/useLeftBanner";
import { useGetRightBanner } from "@/src/utlis/banner/userRightBanner";
import Image from "next/image";
import { useState } from "react";

function SideBanners() {
  const { leftbanner, loading: leftLoading, error: leftError } = useGetLeftBanner();
  const { rightbanner, loading: rightLoading, error: rightError } = useGetRightBanner();

  const [closedLeftAds, setClosedLeftAds] = useState([]);
  const [closedRightAds, setClosedRightAds] = useState([]);

  const activeLeftAds = Array.isArray(leftbanner)
    ? leftbanner.filter(
      (item) =>
        item?.status === "active" &&
        Array.isArray(item?.images) &&
        item.images.length > 0
    )
    : [];

  const activeRightAds = Array.isArray(rightbanner)
    ? rightbanner.filter(
      (item) =>
        item?.status === "active" &&
        Array.isArray(item?.images) &&
        item.images.length > 0
    )
    : [];

  const visibleLeftAds = activeLeftAds.filter(ad => !closedLeftAds.includes(ad._id));
  const visibleRightAds = activeRightAds.filter(ad => !closedRightAds.includes(ad._id));

  const closeLeftAd = (adId) => {
    setClosedLeftAds([...closedLeftAds, adId]);
  };

  const closeRightAd = (adId) => {
    setClosedRightAds([...closedRightAds, adId]);
  };

  return (
    <>
      {/* Left Side Ad - Fixed position */}
      {visibleLeftAds.length > 0 && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="space-y-3">
            {visibleLeftAds.map((ad, index) => (
              <div key={ad._id || index} className="relative bg-white shadow-lg rounded-lg p-2 border-2 border-gray-300">
                <div className="absolute top-0 left-0 bg-gray-700 text-accent-content text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                  Ad
                </div>
                <button
                  onClick={() => closeLeftAd(ad._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-accent-content rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold z-10"
                  aria-label="Close this ad"
                >
                  ×
                </button>
                <div className="w-[180px]">
                  <Image
                    src={ad.images[0]}
                    width={180}
                    height={240}
                    alt={ad.title || "Left Advertisement"}
                    className="object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Side Ad - Fixed position */}
      {visibleRightAds.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="space-y-3">
            {visibleRightAds.map((ad, index) => (
              <div key={ad._id || index} className="relative bg-white shadow-lg rounded-lg p-2 border-2 border-gray-300">
                <div className="absolute top-0 left-0 bg-gray-700 text-accent-content text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                  Ad
                </div>
                <button
                  onClick={() => closeRightAd(ad._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-accent-content rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold z-10"
                  aria-label="Close this ad"
                >
                  ×
                </button>
                <div className="w-[180px]">
                  <Image
                    src={ad.images[0]}
                    width={180}
                    height={240}
                    alt={ad.title || "Right Advertisement"}
                    className="object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SideBanners;
