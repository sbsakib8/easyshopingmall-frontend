"use client";
import React, { useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useGetcategory } from "@/src/utlis/usecategory";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";
import Button from "@/src/helper/Buttons/Button";
import Image from "next/image";
import { CategorySkeleton } from "../loading/Skeleton";


function Categories({ initialData }) {
  const { category: apiCategory, loading: apiLoading, error } = useGetcategory();
  const [category, setCategory] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [paused, setPaused] = useState(false);

  React.useEffect(() => {
    if (apiCategory) {
      setCategory(apiCategory);
      setLoading(false);
    }
  }, [apiCategory]);

  const loopData = [...(category || []), ...(category || [])];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 overflow-x-auto py-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-48 flex-shrink-0 bg-white p-4 rounded-xl shadow-md space-y-3">
              <div className="h-32 bg-gray-200 animate-pulse rounded-lg w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4 mx-auto"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Featured Categories
        </h2>
        <p className="text-gray-500 text-sm">
          Discover amazing products across all categories
        </p>
      </div>

      {/* Marquee container */}
      <div
        className="overflow-x-auto relative py-6 scrollbar-hide"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`flex gap-4 ${!paused ? "animate-marquee" : ""}`}
        >
          {loopData.map((item, idx) => (
            <Link href={"/shop"}
              key={idx}
              className="w-48 flex-shrink-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer relative"
            >
              {/* Trending Badge */}
              {item.trending && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-accent-content text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Hot
                </div>
              )}
              {/* Image */}
              <div className="h-32 overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={150}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Content */}
              <div className="p-3 text-center">
                <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.metaDescription} items</p>
                <div className="flex justify-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-btn-color/15 via-btn-color/55 to-btn-color/75 text-accent-content py-1.5 rounded-md text-xs font-medium">
                  Explore Now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Marquee Animation Style */}
      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        /* scrollbar hide */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Categories;
