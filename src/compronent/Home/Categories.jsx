"use client";

import { useGetSubcategory } from "@/src/utlis/useSubcategory";
import { Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FeaturedSubCategoriesSkeleton } from "../loading/HomeSkeleton";
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

  if (loading && !subCategory) <FeaturedSubCategoriesSkeleton />;

  return (
    <Section>
      <Container className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent leading-relaxed">
            জনপ্রিয় সাব-ক্যাটাগরি
          </h2>
          <p className="text-muted text-sm sm:text-sm md:text-base lg:text-lg">
            বিভিন্ন সাব-ক্যাটাগরির সেরা পণ্য ব্রাউজ করুন
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
                href={`/shop?category=${encodeURIComponent(item?.category?.name || '')}&subcategory=${encodeURIComponent(item?.name || '')}`}
                key={idx}
                className="bg-card border border-line w-48 shrink-0 flex flex-col rounded-2xl hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer relative"
              >
                {/* Trending Badge */}
                {item.trending && (
                  <div className="absolute top-3 right-3 z-10 bg-accent text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-bold">
                    <TrendingUp className="w-3 h-3" /> হট
                  </div>
                )}

                {/* Image */}
                <div className="h-32 shrink-0 overflow-hidden relative bg-slate-50">
                  <Image
                    src={item.image || "/img/product.jpg"}
                    alt={item.name}
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-3 text-center flex-grow flex flex-col">
                  <h3 className="text-sm font-bold text-ink line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex justify-center gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < 4
                            ? "fill-amber-400 text-amber-400"
                            : "text-line"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button className="w-full bg-primary hover:bg-primary-dark transition-all text-white py-1.5 rounded-xl text-xs font-semibold shadow-xs">
                      ব্রাউজ করুন
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
