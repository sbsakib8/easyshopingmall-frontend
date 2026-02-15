import React from 'react';
import Skeleton, { CardSkeleton, CategorySkeleton } from './Skeleton';
import ProductGridSkeleton from './ProductGridSkeleton';

const HomeSkeleton = () => {
    return (
        <div className="bg-bg min-h-screen">
            {/* Carousel Skeleton */}
            <div className='py-1 mt-10 lg:mt-30 h-[200px] sm:h-[400px] lg:h-[720px]'>
                <Skeleton className="w-[98%] h-full mx-auto rounded-xl sm:rounded-2xl" />
            </div>

            {/* Categories Strip Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-4 overflow-x-auto py-6 scrollbar-hide">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-48 flex-shrink-0 bg-white p-4 rounded-xl shadow-md space-y-3 border border-gray-100">
                            <div className="h-32 bg-gray-200 animate-pulse rounded-lg w-full"></div>
                            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4 mx-auto"></div>
                            <div className="h-8 bg-gray-200 animate-pulse rounded-md w-full mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ads Grid Skeleton */}
            <div className="container mx-auto max-w-8xl px-4 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-center">
                            <Skeleton className="w-[150px] md:w-[200px] lg:w-[320px] xl:w-[360px] h-40 md:h-60 lg:h-80 rounded-lg shadow-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Products Header Skeleton */}
            <div className="container mx-auto px-4 py-12 text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-48 mx-auto rounded-md" />
                <div className="flex justify-center flex-wrap gap-2 mt-8">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="container mx-auto px-4">
                <ProductGridSkeleton count={8} />
            </div>
        </div>
    );
};

export default HomeSkeleton;
