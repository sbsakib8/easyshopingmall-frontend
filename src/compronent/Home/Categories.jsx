"use client";
import React, { useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useGetcategory } from "@/src/utlis/usecategory";
import { HomeBannerAllGet } from "@/src/hook/useHomeBanner";

const categoridata = [
  { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80", items: "1,234", trending: true },
  { id: 2, name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80", items: "892", trending: false },
  { id: 3, name: "Home & Garden", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80", items: "567", trending: true },
  { id: 4, name: "Sports", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80", items: "423", trending: false },
  { id: 5, name: "Books", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", items: "789", trending: false },
  { id: 6, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80", items: "1,012", trending: true },
  { id: 7, name: "Automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=300&q=80", items: "334", trending: false },
  { id: 8, name: "Technology", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80", items: "1,456", trending: true },
  { id: 9, name: "Food & Drinks", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80", items: "678", trending: false },
  { id: 10, name: "Travel", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80", items: "445", trending: true }
];

function Categories() {
  const { category, loading, error } = useGetcategory(); 
  const [paused, setPaused] = useState(false);
  const loopData = [...(category || []), ...(category || [])]; 

  console.log('looping', loopData);
  
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
