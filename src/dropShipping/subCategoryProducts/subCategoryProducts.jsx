"use client"
import { addToWishlistApi, removeFromWishlistApi } from '@/src/hook/useWishlist';
import { useGetProduct } from '@/src/utlis/userProduct';
import { useWishlist } from '@/src/utlis/useWishList';
import { ArrowDownToLine, Heart, Star } from 'lucide-react';
import { useRouter } from "next/navigation"
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

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
const ProductCard = React.memo(({ product, viewMode, toggleWishlist, wishlist, favorite, setFavorite, router }) => {
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
            onClick={() => router.push(`/productdetails/${product._id}`)}
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
                            <span className="bg-green-500 text-accent-content px-1 py-1 rounded text-[8px] font-semibold">NEW</span>
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
                        <span className="bg-red-500 text-accent-content px-3 py-1 rounded font-semibold text-xs">Out of Stock</span>
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

                    </div>
                    <div className='flex justify-between'>
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

                        {/* Action Buttons (Wishlist) */}
                        <div className={` bg-accent-content/50 rounded-md right-0  transition-opacity duration-300`}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleWishlist(product)
                                    // Local update for immediate feedback if needed, distinct from prop check
                                    if ((favorite && favorite.includes(product._id)) || (wishlist && wishlist.some(i => i.id === product._id))) {
                                        const removeItem = favorite ? favorite.filter(item => item !== product._id) : []
                                        return setFavorite(removeItem)
                                    }
                                    setFavorite([...favorite, product._id])
                                }}
                                className={`p-2 border cursor-pointer rounded-lg transition-all duration-300
              ${(wishlist && wishlist.some((item) => item.id === product._id) || (favorite && favorite.includes(product._id)))
                                        ? "text-red-500 bg-red-100"
                                        : "text-gray-400 bg-white/50 hover:text-red-500 hover:bg-red-50"
                                    }`}
                            >
                                <Heart
                                    className="w-5 h-5"
                                    fill={(wishlist && wishlist.some((item) => item.id === product._id)) || (favorite && favorite.includes(product._id)) ? "red" : "none"}
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
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
    const router = useRouter()
    const [favorite, setFavorite] = useState([])
    const dispatch = useDispatch()
    // Get all filter states from Redux
    const shopState = useSelector((state) => state.shop)
    const { viewMode } = shopState
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
    const { wishlist } = useWishlist()
    const user = useSelector((state) => state.user?.data)
    // Toggle wishlist (uses API + redux)
    const toggleWishlist = useCallback(async (product) => {
        if (!user?._id) {
            toast.error("Please sign in to add to wishlist")
            return
        }
        try {
            const exists = (wishlist || []).some((i) => i.id === product._id || favorite.includes(product._id))
            if (exists) {
                await removeFromWishlistApi(product._id, dispatch)
                toast.success("Removed from wishlist")
            } else {
                await addToWishlistApi(product._id, dispatch)
                toast.success("Added to wishlist")
            }
        } catch (err) {
            console.error("Wishlist toggle error:", err)
            toast.error("Failed to update wishlist")
        }
    }, [wishlist, favorite, dispatch]);

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
                        toggleWishlist={toggleWishlist}
                        wishlist={wishlist}
                        favorite={favorite}
                        setFavorite={setFavorite}
                        router={router}
                    />
                ))}
        </div>
    );

};

export default SubCategoryProducts;