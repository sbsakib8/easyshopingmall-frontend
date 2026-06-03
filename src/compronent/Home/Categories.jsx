"use client";

import { useGetSubcategory } from "@/src/utlis/useSubcategory";
import { Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Skeleton from "../loading/Skeleton";
import Container from "../shared/Container";
import Section from "../shared/Section";

function Categories({ initialData }) {
  const { subcategory: apiCategory, loading: apiLoading } = useGetSubcategory();
  const [subCategory, setCategory] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (apiCategory) {
      setCategory(apiCategory);
      setLoading(false);
    }
  }, [apiCategory]);

  const loopData = [...(subCategory || []), ...(subCategory || [])];

  if (loading && !subCategory) {
    return (
      <Section>
        <Container>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-48 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <Skeleton className="w-full h-32 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary via-primary/60 to-secondary/30 bg-clip-text text-transparent leading-relaxed">
            Featured Sub-Categories
          </h2>
          <p className="text-slate-400 text-sm sm:text-sm md:text-base lg:text-lg">
            Discover amazing products across all sub-categories
          </p>
        </div>

        {/* Marquee container */}
        <div
          className="overflow-x-auto relative pt-3 scrollbar-hide"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className={`flex gap-4 ${!paused ? "animate-marquee" : ""}`}>
            {loopData.map((item, idx) => (
              <Link
                href={`/shop?category=${encodeURIComponent(item?.category?.name)}&subcategory=${encodeURIComponent(item?.name)}`}
                key={idx}
                className="bg-white/70 backdrop-blur-2xl border border-slate-100 w-48 flex-shrink-0 flex flex-col rounded-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer relative"
              >
                {/* Trending Badge */}
                {item.trending && (
                  <div className="absolute top-3 right-3 z-10 bg-accent text-accent-content text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Hot
                  </div>
                )}

                {/* Image */}
                <div className="h-32 flex-shrink-0 overflow-hidden relative">
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
                <div className="p-3 text-center flex-grow flex flex-col">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                    {item.name}
                  </h3>
                  {/* <p className="text-xs text-gray-500 line-clamp-4">{item.metaDescription} items</p> */}
                  <div className="flex justify-center gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button className="w-full bg-primary/80 hover:bg-primary transition-all text-primary-content py-1.5 rounded-md text-xs font-medium">
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Marquee Animation Style */}
        <style jsx>{`
          .animate-marquee {
            display: flex;
            animation: marquee 60s linear infinite;
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
      </Container>
    </Section>
  );
}

export default Categories;
