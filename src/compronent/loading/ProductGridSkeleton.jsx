import React from 'react';
import { CardSkeleton } from './Skeleton';

/**
 * Product Grid Skeleton - Shows loading state for product grids
 * @param {number} count - Number of skeleton cards to show (default: 12)
 * @param {string} viewMode - "grid" or "list" view mode
 */
export const ProductGridSkeleton = ({ count = 12, viewMode = "grid" }) => {
    return (
        <div
            className={`${viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
                : "space-y-4"
                }`}
        >
            {[...Array(count)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};

/**
 * Shop Page Skeleton - Complete skeleton for shop page initial load
 */
export const ShopPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Filter Bar Skeleton */}
                <div className="bg-white lg:mt-28 rounded-lg shadow-md p-4 mb-6 animate-pulse">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 bg-gray-200 rounded w-40"></div>
                            <div className="h-10 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <div className="lg:w-80 space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Products Grid Skeleton */}
                    <div className="flex-1">
                        <ProductGridSkeleton count={15} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Search Results Skeleton - Shows while searching
 */
export const SearchResultsSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 animate-pulse">
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <ProductGridSkeleton count={8} />
        </div>
    );
};

export default ProductGridSkeleton;
