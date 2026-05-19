import Container from "@/src/compronent/shared/Container";
import { Skeleton } from "@mui/material";

const ProductSkeleton = () => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse`}
  >
    {/* Image Section Skeleton */}
    <div className="relative aspect-2/3 overflow-hidden w-full h-14 md:h-32 bg-slate-200">
      {/* Fake Image */}
      <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

      {/* Fake Badges */}
      <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3">
        <div className="bg-slate-300 h-5 md:h-6 w-12 md:w-16 rounded-xl" />
      </div>

      {/* Fake Action Buttons (Top Right) */}
      <div className="absolute top-3 right-3 hidden md:flex flex-col gap-2">
        <div className="bg-white/90 w-9 h-9 rounded-xl" />
        <div className="bg-white/90 w-9 h-9 rounded-xl" />
      </div>
    </div>

    {/* Content Section Skeleton */}
    <div className="flex-1 flex flex-col p-1.5 md:p-3.5">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-[92%]" />

        {/* Brand */}
        <div className="h-3 bg-slate-200 rounded w-24 mt-3 hidden md:block" />
      </div>

      {/* Rating + Price - Desktop */}
      <div className="hidden md:flex items-center justify-between mt-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Fake Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-slate-200 rounded" />
            ))}
          </div>
          <div className="h-3 bg-slate-200 rounded w-8" />
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="hidden md:block mt-auto">
        <div className="h-10 md:h-11 w-full bg-slate-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

const SubCategoryProductsLoading = ({ count = 10, }) => {
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-6 2xl:gap-8">
          {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
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
