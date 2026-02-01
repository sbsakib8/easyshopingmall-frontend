import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
    const baseClass = 'animate-pulse bg-gray-200';
    const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-md';

    return (
        <div className={`${baseClass} ${variantClass} ${className}`}>
            <style jsx>{`
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: .5;
                }
            }
        `}</style>
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-3 space-y-3">
            <Skeleton className="w-full h-40 sm:h-44" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/5" />
                </div>
                <Skeleton className="h-8 w-full mt-2" />
            </div>
        </div>
    );
};

export const CategorySkeleton = () => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <Skeleton variant="circle" className="w-12 h-12 sm:w-16 sm:h-16" />
            <Skeleton className="h-3 w-12 sm:w-16" />
        </div>
    );
};

export const BlogSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex gap-3">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
