"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, ArrowRight, Package, Heart } from "lucide-react";
import { useGetCenterBanner } from "@/src/utlis/banner/useCenterBanner";

export default function CenterPromoBanner() {
  const { ads } = useGetCenterBanner();
  const activeAd = Array.isArray(ads)
    ? ads.find(
        (item) =>
          item?.status === "active" &&
          Array.isArray(item?.images) &&
          item.images.length > 0
      )
    : null;

  if (activeAd?.images?.[0]) {
    return (
      <div className="container mx-auto px-4 max-w-7xl my-8">
        <div className="w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <Link href={activeAd.link || "/shop"}>
            <Image
              src={activeAd.images[0]}
              alt={activeAd.title || "Special Offer"}
              width={1400}
              height={300}
              className="w-full h-auto max-h-[220px] object-cover"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl my-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border border-amber-200/80 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left item */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                ২য় অর্ডার থেকে
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-accent tracking-tight">
                ফ্রি ডেলিভারি!
              </h3>
            </div>
          </div>

          {/* Center item - CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex w-10 h-10 rounded-xl bg-orange-200 text-accent items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <span>এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right item */}
          <div className="flex items-center gap-2 text-ink/80">
            <p className="text-xs sm:text-sm font-semibold">
              আপনার পছন্দের প্রোডাক্ট এখন আরও সহজে!
            </p>
            <Heart className="w-5 h-5 text-accent fill-accent/20 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
