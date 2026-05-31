import React from "react";
import Container from "@/src/compronent/shared/Container";
import { cn } from "@/src/utlis/utils";

const ProductCardSkeleton = ({ viewMode = "grid" }) => {
  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full animate-pulse ${
        viewMode === "list" ? "flex-row" : ""
      }`}
    >
      {/* Image Section Skeleton */}
      <div
        className={`relative overflow-hidden flex-shrink-0 bg-slate-200 ${
          viewMode === "list"
            ? "w-40 md:w-48 lg:w-56 xl:w-64 h-[190px]"
            : "aspect-[4/3.2] h-28"
        }`}
      >
        {/* Fake Image */}
        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />

        {/* Fake Delete Button */}
        <div className="absolute top-4 left-4 p-2 bg-white/80 rounded-2xl w-9 h-9" />

        {/* Fake Stock Badge Position */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-300 h-6 w-28 rounded-2xl" />
      </div>

      {/* Content Section Skeleton */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Title & Category */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-[88%]" />
          <div className="h-4 bg-slate-200 rounded w-[65%]" />
          <div className="h-3 bg-slate-200 rounded w-20 mt-1" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-slate-200 rounded" />
            ))}
          </div>
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>

        {/* Price */}
        <div className="h-5 bg-slate-200 rounded w-24" />

        {/* Add to Cart Button */}
        <div className="mt-auto h-9 bg-slate-200 rounded-2xl w-full" />
      </div>
    </div>
  );
};

const WishlistPageLoading = ({ viewMode = "grid" }) => {
  return (
    <>
      <section className="min-h-dvh relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 py-10 md:py-16">
        {/* Animated Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-0 -right-40 w-[700px] h-[700px] bg-teal-100/30 rounded-full blur-[120px] animate-float-medium"></div>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] animate-float-fast"></div>
        </div>

        <Container className="space-y-8">
          <div className="flex items-center justify-between mb-8 animate-pulse">
            {/* Left Side - Title & Subtitle */}
            <div className="space-y-3">
              {/* Title Skeleton */}
              <div className="h-9 sm:h-11 w-56 sm:w-72 bg-slate-200 rounded-2xl" />

              {/* Subtitle Skeleton */}
              <div className="h-5 w-48 sm:w-60 bg-slate-200 rounded-xl" />
            </div>

            {/* Back Button Skeleton */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-sm">
              {/* Icon Circle */}
              <div className="w-9 h-9 bg-slate-200 rounded-full" />

              {/* Label */}
              <div className="h-5 w-16 bg-slate-200 rounded-lg hidden sm:block" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-5 md:p-6 mb-8 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* View Toggle Skeleton */}
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 w-fit">
                <div className="p-3 rounded-xl bg-white shadow-md w-11 h-11" />
                <div className="p-3 rounded-xl w-11 h-11" />
              </div>

              {/* Filters & Sort Skeleton */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Filter Select Skeleton */}
                <div className="w-full sm:w-56 h-12 bg-slate-200 rounded-2xl" />

                {/* Sort Select Skeleton */}
                <div className="w-full sm:w-56 h-12 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>

          <div
            className={cn("grid gap-4 lg:gap-6", {
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7":
                viewMode === "grid",
              "grid-cols-1": viewMode === "list",
            })}
          >
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default WishlistPageLoading;
