import React from 'react';
import Skeleton from './Skeleton';

const DetailSkeleton = () => {
    return (
        <div className="min-h-screen lg:mt-30 lg:py-10 bg-white">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center space-x-2 mb-8">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-2xl" />
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="w-full h-20 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-3/4" />
                            <div className="flex items-center space-x-2 pt-2">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="w-5 h-5" variant="circle" />
                                    ))}
                                </div>
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        {/* Price Skeleton */}
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-32" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>

                        {/* Color selection */}
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-24" />
                            <div className="flex space-x-3">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="w-10 h-10" variant="circle" />
                                ))}
                            </div>
                        </div>

                        {/* Size selection */}
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-20" />
                            <div className="flex flex-wrap gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="w-20 h-8 rounded-full" />
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-24" />
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-14 w-full rounded-xl" />
                                <Skeleton className="h-14 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailSkeleton;
