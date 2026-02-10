"use client"
import { useGetProduct } from '@/src/utlis/userProduct';
import { ArrowDownToLine, Star } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const handleDownloadImage = async (e, imageUrl, productName) => {
  e.stopPropagation(); // ⛔ stop card click

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${productName || "product"}.jpg`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Image download failed:", error);
  }
};
const ProductCard = React.memo(({ product, viewMode }) => {
    if (!product) return null;
    // Render Stars Helper
    const ratingValue = product.rating || product.ratings || 0;
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-black"
                    }`}
            />
        ));
    };

    return (
        <div
            onClick={() => router.push(`/productdetails/${product.id}`)}
            className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
        >
            <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
                <img
                    src={product.images[0] || "/banner/img/placeholder.png"}
                    alt={product.productName}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "h-full" : "h-40 sm:h-44"}`}
                />

                {/* Badges */}
                <div className="absolute top-0 left-0 flex justify-between w-full">
                    <div className="flex items-start">
                        {product.isNew && (
                            <span className="bg-green-500 text-white px-1 py-1 rounded text-[8px] font-semibold">NEW</span>
                        )}
                    </div>
                    {product.productStatus && product.productStatus.length > 0 && !product.productStatus.includes("none") && (
                        <span className={` ${product.productStatus.includes("hot") ? 'text-red-500' : 'text-blue-400 '} max-h-6  bg-black px-1 py-1 rounded-md text-xs font-bold`}>
                            {Array.isArray(product.productStatus) ? product.productStatus[0] : product.productStatus}
                        </span>
                    )}
                </div>



                {product.productStock < 1 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded font-semibold text-xs">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className={`p-3 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                <div>
                    <h3 className={`font-semibold text-sm text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2`}>
                        {product.productName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {renderStars(ratingValue)}
                        </div>
                        <span className="text-xs text-gray-500">({product.ratings})</span>
                    </div>
                </div>

                <div>
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-base font-bold text-red-600">
                            Tk {product.price}
                        </span>
                        {product.productRank > product.price && (
                            <span className="text-xs font-semibold text-gray-400 line-through">
                                {product.productRank.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={(e) =>
                                handleDownloadImage(
                                    e,
                                    product.images?.[0],
                                    product.productName
                                )
                            }
                            className="btn bg-btn-color text-accent-content px-2 py-2 flex gap-2 rounded-sm cursor-pointer"
                        >
                            Download <ArrowDownToLine />
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
});

// products skiliton 
const ProductSkeleton = ({ viewMode }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${viewMode === "list" ? "flex" : ""
                }`}
        >
            {/* Image skeleton */}
            <div
                className={`bg-gray-200 ${viewMode === "list" ? "w-48 h-40" : "h-40 sm:h-44"
                    }`}
            />

            {/* Content skeleton */}
            <div className={`p-3 flex-1`}>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />

                    {/* rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>

                {/* price + button */}
                <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-8 bg-gray-300 rounded w-full" />
                </div>
            </div>
        </div>
    );
};


const SubCategoryProducts = ({ id }) => {
    // Get all filter states from Redux
    const shopState = useSelector((state) => state.shop)
    const {
        searchTerm,
        filterCategory,
        filterSubCategory,
        filterBrand,
        filterGender,
        priceRange,
        ratingFilter,
        sortBy,
        currentPage,
        viewMode,
        showFilters,
        debouncedSearchTerm
    } = shopState
    const [page, setPage] = useState(1);
    const formData = useMemo(
        () => ({
            page,
            limit: 5000,
            search: "",
        }),
        [page]
    );
    // product get
    const { product: products, loading: productsLoading } = useGetProduct(formData);
    const filteredProducts = products?.filter(p => p?.subCategory[0]?._id === id)



    return (
        <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">

            {productsLoading
                ? [...Array(10)].map((_, i) => (
                    <ProductSkeleton key={i} viewMode={viewMode} />
                ))
                : filteredProducts?.map((product) => (
                    <ProductCard
                        key={product._id}
                        viewMode={viewMode}
                        product={product}
                    />
                ))}
        </div>
    );

};

export default SubCategoryProducts;