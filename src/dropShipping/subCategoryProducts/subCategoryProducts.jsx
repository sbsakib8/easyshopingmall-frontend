"use client";

import {
  addToWishlistApi,
  removeFromWishlistApi,
} from "@/src/hook/useWishlist";
import { isProductNew } from "@/src/utlis/filterHelpers";
import { useGetProduct } from "@/src/utlis/userProduct";
import { useWishlist } from "@/src/utlis/useWishList";

import {
  ArrowDownToLine,
  Heart,
  Star,
  Search,
  Sparkles,
  ShoppingCart,
  Loader2,
} from "lucide-react";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { dsCartAdd } from "@/src/redux/dropshippingCartSlice";
import Container from "@/src/compronent/shared/Container";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import SubCategoryProductsLoading from "@/app/(dropShipping)/sub-category/[id]/loading";

// Helper for image download
const handleDownloadImage = async (e, imageUrl, productName) => {
  e.stopPropagation();
  if (!imageUrl) return;

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
    toast.error("Download failed");
  }
};

const ProductCard = React.memo(
  ({ product, wishlist, dispatch, dsCartItems, user, wishlistLoading }) => {
    const router = useRouter();

    if (!product) return null;

    // Optimized Wishlist Check
    const isWishlisted = useMemo(() => {
      return (wishlist || []).some(
        (item) => item?._id === product._id || item?.id === product._id,
      );
    }, [wishlist, product._id]);

    const ratingValue = useMemo(() => {
      return Number(product.rating || product.ratings || 0);
    }, [product.rating, product.ratings]);

    const renderStars = useCallback((rating) => {
      return [...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-2.5 lg:size-3.5 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ));
    }, []);

    // Optimized Add to Cart
    const handleAddToCart = useCallback(() => {
      if (!user?._id) {
        toast.error("Please login to add to cart");
        return;
      }

      dispatch(
        dsCartAdd({
          productId: product,
          quantity: 1,
          price: product.price || 0,
          sellingPrice: product.price || 0,
          profit: 0,
        }),
      );

      toast.success("Added to dropshipping cart");
    }, [user?._id, dispatch, product]);

    // Optimized Wishlist Toggle
    const toggleWishlist = useCallback(async () => {
      if (!user?._id) {
        toast.error("Please sign in to add to wishlist");
        return;
      }

      try {
        if (isWishlisted) {
          await removeFromWishlistApi(product._id, dispatch);
          toast.success("Removed from wishlist");
        } else {
          await addToWishlistApi(product._id, dispatch);
          toast.success("Added to wishlist");
        }
      } catch (err) {
        console.error("Wishlist toggle error:", err);
        toast.error("Failed to update wishlist");
      }
    }, [isWishlisted, user?._id, product._id, dispatch]);

    return (
      <div
        onClick={() => router.push(`/productdetails/${product._id}`)}
        className={`group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full animate-fade-up`}
      >
        {/* Image Section */}
        <div
          className={`relative aspect-2/3 overflow-hidden w-full h-14 md:h-32`}
        >
          <Image
            src={product.images?.[0] || (Array.isArray(product.image) ? product.image[0] : product.image) || "/img/product.jpg"}
            alt={product.productName}
            width={200}
            height={170}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105`}
          />

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-emerald-500 text-white text-[7px] md:text-[10px] md:font-medium px-1.5 md:px-2.5 py-1 rounded-xl shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Action Buttons on Image - Always Visible */}
          <div className="absolute top-3 right-3 md:flex flex-col gap-2 z-20 hidden">
            {/* Save Button */}
            <button
              onClick={(e) =>
                handleDownloadImage(e, product.images?.[0], product.productName)
              }
              className="bg-white/95 hover:bg-white shadow-md p-2 rounded-xl text-slate-700 hover:text-slate-900 transition-all active:scale-90"
              title="Save Image"
            >
              <ArrowDownToLine className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist();
              }}
              disabled={wishlistLoading}
              aria-busy={wishlistLoading}
              aria-disabled={wishlistLoading}
              className={`shadow-md p-2 rounded-xl transition-all active:scale-90 ${
                isWishlisted
                  ? "bg-red-50 text-red-500"
                  : "bg-white/95 hover:bg-white text-slate-700 hover:text-red-500"
              }`}
              title={
                wishlistLoading
                  ? "Loading..."
                  : isWishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
              }
            >
              <Heart
                className={`w-4 h-4 transition-all ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {product.productStock < 1 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="bg-red-600 text-white px-2 py-1 md:px-5 md:py-2 rounded-2xl md:font-medium text-[7px] md:text-sm md:tracking-wider">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Section - Rest remains unchanged */}
        <div className={`flex-1 flex flex-col p-1.5 md:p-3.5`}>
          {/* Title & Brand */}
          <div>
            <h3 className="md:font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 md:line-clamp-1 text-[10px] md:text-base md:leading-tight md:mb-1">
              {product.productName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-3 uppercase hidden md:block">
              {product.brand || "No Brand"}
            </p>

            {/* Rating + Price */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {renderStars(ratingValue)}
                </div>
                <span className="text-xs font-medium text-slate-500">
                  ({ratingValue})
                </span>
              </div>

              <p className="text-sm lg:text-base font-semibold text-slate-900 tracking-tight">
                ৳{product.price}
              </p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={product.productStock < 1}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-2 px-1.5 rounded-2xl font-medium text-xs tracking-wider md:flex items-center justify-center gap-2 shadow-md active:scale-[0.97] transition-all hidden"
            >
              <ShoppingCart className="size-3.5" />
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    );
  },
);

const EmptyProducts = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-sm min-h-[50vh] px-4 py-6">
      <div className="mb-8 relative">
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center">
          <Search className="w-9 h-9 text-slate-300" />
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-3 max-w-sm">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          No Products Found
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          We couldn't find any products in this category. New items are arriving
          soon!
        </p>
      </div>

      <button
        onClick={() => router.push("/all-products")}
        className="mt-8 px-4 py-2 md:px-8 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
      >
        Explore All Products
      </button>
    </div>
  );
};

const SubCategoryProductsContent = ({ id }) => {
  const params = useSearchParams();
  const pageType = params.get("pageType");
  const dispatch = useDispatch();
  const viewMode = useSelector((state) => state.shop.viewMode);
  const dsCartItems = useSelector((state) => state.dropshippingCart.items);
  const user = useSelector((state) => state.user?.data);
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const [page, setPage] = useState(1);
  const limit = 30;

  const formData = useMemo(
    () => ({
      page,
      limit,
      search: "",
      subCategoryId: id,
      sortBy: pageType === "new-products" ? "newest" : undefined,
    }),
    [page, id, pageType],
  );

  useEffect(() => {
    setPage(1);
  }, [id]);

  const {
    product: products,
    totalCount,
    loading: productsLoading,
  } = useGetProduct(formData);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    switch (pageType) {
      case "new-products":
        return products.filter((product) => isProductNew(product.createdAt));
      case "boost-products":
        return products.filter((product) => product.isBoost === true);
      default:
        return products;
    }
  }, [products, pageType]);

  const totalPages = Math.ceil((totalCount || 0) / limit);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const showStartDots = page > 3;
  const showEndDots =
    pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (productsLoading) {
    return <SubCategoryProductsLoading count={12} />;
  }

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Animated Gradient Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(16,185,129,0.15)_0%,transparent_50%)] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_70%_60%,rgba(45,212,191,0.15)_0%,transparent_50%)] animate-pulse-slower"></div>

        {/* Subtle Moving Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-200 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-float-slow"></div>
      </div>

      <Container className="relative z-10 space-y-6 md:space-y-10">
        {filteredProducts.length === 0 ? (
          <EmptyProducts />
        ) : (
          <>
            <div className="flex items-center justify-center">
              <h2 className="text-center font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-emerald-800 uppercase tracking-wider sm:tracking-widest break-words animate-fade-up">
                {productsLoading ? (
                  <Skeleton className="h-10! w-40! sm:h-14! md:h-16! lg:h-20!" />
                ) : (
                  filteredProducts[0].subCategory[0].name
                )}
              </h2>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-6 2xl:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  viewMode={viewMode}
                  product={product}
                  wishlist={wishlist}
                  wishlistLoading={wishlistLoading}
                  dispatch={dispatch}
                  dsCartItems={dsCartItems}
                  user={user}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap px-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <Loader2
                    className={`w-4 h-4 rotate-180 ${productsLoading ? "animate-spin" : ""}`}
                  />
                </button>

                {showStartDots && (
                  <button
                    onClick={() => setPage(1)}
                    className="w-10 h-10 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:border-emerald-600"
                  >
                    1
                  </button>
                )}

                {showStartDots && (
                  <span className="text-slate-400 font-black">...</span>
                )}

                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all border ${page === p ? "bg-gradient-to-r from-emerald-600 to-teal-600 border-transparent text-white shadow-md scale-110" : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"}`}
                  >
                    {p}
                  </button>
                ))}

                {showEndDots && (
                  <span className="text-slate-400 font-black">...</span>
                )}

                {showEndDots && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-10 h-10 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:border-primary"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <Loader2
                    className={`w-4 h-4 ${productsLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};

const SubCategoryProducts = (props) => (
  <Suspense fallback={<SubCategoryProductsLoading />}>
    <SubCategoryProductsContent {...props} />
  </Suspense>
);

export default SubCategoryProducts;
