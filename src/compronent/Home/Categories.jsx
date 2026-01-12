"use client";
import React, { useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useGetcategory } from "@/src/utlis/usecategory";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";


function Categories() {
  const { category, loading, error } = useGetcategory(); 
  const [paused, setPaused] = useState(false);
  const loopData = [...(category || []), ...(category || [])];
  
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
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Hot
                </div>
              )}
              {/* Image */}
              <div className="h-32 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
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
                <button className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-1.5 rounded-md text-xs font-medium">
                  Explore Now
                </button>
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
