import Container from "@/src/compronent/shared/Container";
import { Skeleton } from "@mui/material";

const ProductSkeleton = ({ viewMode }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse flex flex-col h-full ${viewMode === "list" ? "flex-row" : ""}`}
  >
    {/* Image Skeleton */}
    <div
      className={`relative bg-slate-200 overflow-hidden ${viewMode === "list" ? "w-52 sm:w-60 shrink-0" : "w-full"}`}
    >
      <div
        className={`w-full ${viewMode === "list" ? "h-full" : "h-32 sm:h-40"}`}
      />

      {/* Skeleton Badges Position */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        <div className="h-5 w-12 bg-slate-300 rounded-xl" />
        <div className="h-5 w-14 bg-slate-300 rounded-xl" />
      </div>

      {/* Skeleton Action Buttons (Top Right) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <div className="w-9 h-9 bg-white/80 rounded-xl" />
        <div className="w-9 h-9 bg-white/80 rounded-xl" />
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 flex flex-col p-4 sm:p-5">
      <div className="space-y-3 flex-1">
        {/* Title */}
        <div className="h-5 bg-slate-200 rounded-lg w-[85%]" />

        {/* Brand */}
        <div className="h-3 bg-slate-200 rounded w-28" />

        {/* Rating + Price Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-slate-200 rounded" />
            ))}
          </div>
          {/* Price */}
          <div className="h-7 bg-slate-200 rounded-lg w-20" />
        </div>
      </div>

      {/* Action Buttons Area */}
      <div className="mt-auto space-y-3 pt-4">
        {/* Add to Cart Button */}
        <div className="h-11 bg-slate-200 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);

const SubCategoryProductsLoading = ({ count = 10, viewMode }) => {
  return (
    <section>
      <Container className="space-y-6 md:space-y-10">
        {/* Title Skeleton */}
        <div className="flex items-center justify-center">
          <h2 className="text-center font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-emerald-800 uppercase tracking-wider sm:tracking-widest break-words animate-fade-up">
            <Skeleton className="h-10! w-40! sm:h-14! md:h-16! lg:h-20!" />
          </h2>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
          {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2 flex-wrap px-4 animate-pulse">
          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-100">
            <div className="w-4 h-4 bg-slate-300 rounded" />
          </div>

          <div className="w-9 h-9 bg-slate-100 rounded-xl" />
          <span className="text-slate-300 font-black text-xl">...</span>

          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="w-10 h-10 bg-slate-100 rounded-xl" />
          ))}

          <span className="text-slate-300 font-black text-xl">...</span>
          <div className="w-9 h-9 bg-slate-100 rounded-xl" />

          <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-100">
            <div className="w-4 h-4 bg-slate-300 rounded" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SubCategoryProductsLoading;