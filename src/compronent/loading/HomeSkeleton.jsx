"use client";

import Container from "../shared/Container";
import Section from "../shared/Section";

function CarouselSkeleton() {
  return (
    <Section className="py-4 md:py-8 bg-gradient-to-b from-primary/5 from-20% to-100% to-primary/30 animate-pulse">
      {/* Container matching your custom element's dimensions */}
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 2xl:px-16">
        <div className="py-0! relative h-[200px] sm:h-[400px] lg:h-[600px] w-full">
          {/* Main carousel container skeleton */}
          <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-200 shadow-2xl">
            {/* Main Image Placeholder */}
            <div className="w-full h-full bg-gray-300" />

            {/* Left Arrow Skeleton */}
            <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-400/40 backdrop-blur-sm" />

            {/* Right Arrow Skeleton */}
            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-400/40 backdrop-blur-sm" />

            {/* Progress Indicator Skeleton */}
            <div className="hidden md:block absolute top-4 right-4 bg-gray-400/40 backdrop-blur-sm rounded-full w-14 h-7" />
          </div>
        </div>

        {/* Dots indicator skeleton */}
        <div className="hidden lg:flex justify-center mt-6 space-x-2">
          <div className="w-8 h-3 rounded-full bg-gray-400" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </div>

        {/* Thumbnail navigation skeleton */}
        <div className="hidden lg:flex justify-center mt-4 space-x-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`w-16 h-10 rounded-lg bg-gray-300 ${
                index === 0
                  ? "ring-2 ring-gray-400 ring-offset-2"
                  : "opacity-60"
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FeaturedSubCategoriesSkeleton() {
  // Render a fixed number of card placeholders to fill the horizontal view
  const skeletonCards = Array.from({ length: 6 });

  return (
    <Section className="bg-transparent animate-pulse">
      {/* Container matching your layout spacing */}
      <Container className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Title Placeholder */}
          <div className="h-8 sm:h-10 md:h-12 w-64 sm:w-80 md:w-[450px] bg-gray-200 rounded-md" />
          {/* Subtitle Placeholder */}
          <div className="h-4 w-48 sm:w-60 bg-gray-200/70 rounded-md" />
        </div>

        {/* Marquee Row Placeholder */}
        <div className="overflow-hidden relative pt-3">
          <div className="flex gap-4 w-full">
            {skeletonCards.map((_, idx) => (
              <div
                key={idx}
                className="w-48 bg-gray-100 border border-gray-200/50 flex-shrink-0 flex flex-col rounded-md overflow-hidden"
              >
                {/* Image Aspect Box Placeholder */}
                <div className="h-32 w-full bg-gray-200" />

                {/* Content Container */}
                <div className="p-3 flex flex-col items-center flex-grow space-y-3">
                  {/* Title text line */}
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />

                  {/* Rating Stars Placeholder */}
                  <div className="flex justify-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-gray-200"
                      />
                    ))}
                  </div>

                  {/* Button Placeholder */}
                  <div className="mt-auto w-full h-7 bg-gray-200 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function PopularProductsSkeleton() {
  // Generates enough items to look natural across dense screen breaks (up to 2xl:grid-cols-7)
  const skeletonProducts = Array.from({ length: 14 });
  const skeletonCategories = Array.from({ length: 6 });

  return (
    <Section className="bg-transparent animate-pulse">
      <Container className="space-y-8">
        {/* Header & Controls Group */}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-8 sm:h-10 md:h-12 w-56 sm:w-72 md:w-[400px] bg-gray-200 rounded-md" />
            <div className="h-4 w-44 sm:w-56 bg-gray-200/70 rounded-md" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-md mx-auto w-full">
            <div className="h-9 w-full bg-gray-200 rounded-xl" />
          </div>

          {/* Categories Pill Horizontal Track */}
          <div className="w-full overflow-hidden flex items-center justify-center">
            <div className="flex items-center gap-3 pb-3 overflow-x-auto w-full max-w-3xl justify-start sm:justify-center">
              {skeletonCategories.map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 w-24 sm:w-28 rounded-full bg-gray-200 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Skeleton Matching exact layout responsive breaks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 pt-4">
          {skeletonProducts.map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden flex flex-col"
            >
              {/* Product Image Aspect Placeholder */}
              <div className="relative h-32 w-full bg-gray-200" />

              {/* Content Block */}
              <div className="p-3 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Title text block */}
                  <div className="h-3.5 w-11/12 bg-gray-200 rounded" />
                  {/* Category text block */}
                  <div className="h-3 w-7/12 bg-gray-100 rounded" />

                  {/* Rating block */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-gray-200"
                        />
                      ))}
                    </div>
                    <div className="h-3 w-5 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* Footer block (Price + Button) */}
                <div className="space-y-2.5 pt-2">
                  {/* Price Placeholder */}
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  {/* Add to Cart Button Placeholder */}
                  <div className="w-full h-7 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

const HomeSkeleton = () => {
  return (
    <>
      <CarouselSkeleton />
      <FeaturedSubCategoriesSkeleton />
      <PopularProductsSkeleton />
    </>
  );
};

export default HomeSkeleton;
