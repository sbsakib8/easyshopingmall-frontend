"use client";

import BackButton from "@/src/dropShipping/BackButton/BackButton";
import { getWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist";
import { Grid, Heart, List, ShoppingCart, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "@/src/compronent/shared/Container";
import Image from "next/image";
import { cn } from "@/src/utlis/utils";
import WishlistPageLoading from "@/app/(page)/wishlist/loading";

const ProductCard = React.memo(
  ({ item = {}, viewMode = "grid", removeFromWishlist }) => {
    const renderStars = (rating) => {
      const value = rating || 0;

      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-2.5 ${
            i < Math.floor(value)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ));
    };

    return (
      <Link
        href={`/productdetails/${item.id}`}
        className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 active:scale-[0.985] flex flex-col h-full ${
          viewMode === "list" ? "flex-row" : ""
        }`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden flex-shrink-0 ${
            viewMode === "list"
              ? "w-40 md:w-48 lg:w-56 xl:w-64 h-[190px]"
              : "aspect-[4/3.2] h-28"
          }`}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Stock Badge */}
          {!item.inStock && (
            <div className="absolute bottom-4 right-1/2 translate-x-1/2 bg-red-600 text-white text-xs font-medium px-4 py-1.5 rounded-2xl shadow-md text-nowrap">
              Out of Stock
            </div>
          )}

          {/* Delete Button - Always Visible on Image */}
          <button
            onClick={(e) => {
              e.preventDefault();
              removeFromWishlist(item.id);
            }}
            className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white shadow-md rounded-2xl text-red-400/80 hover:text-red-500 transition-all active:scale-90 z-10"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4 gap-2">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base leading-tight text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 uppercase">
                {item.category}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div
            className={cn("flex gap-2 flex-wrap items-center", {
              "justify-start": viewMode === "list",
              "justify-between": viewMode === "grid",
            })}
          >
            <div className="flex text-amber-500">
              {renderStars(item.rating)}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {item.rating || 0} • {item.reviews || 0} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 tracking-tighter">
              ৳{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{item.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // addToCart(item);
            }}
            disabled={!item.inStock}
            title={item.inStock ? "Add to Cart" : "Out of Stock"}
            aria-label={item.inStock ? "Add to Cart" : "Out of Stock"}
            aria-description={item.inStock ? "Add to Cart" : "Out of Stock"}
            className={`w-full py-2 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] mt-auto ${
              item.inStock
                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="size-3.5 sm:size-4" />
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </Link>
    );
  },
);

const WishlistComponent = () => {
  const dispatch = useDispatch();
  const {
    data: wishlistItems = [],
    loading,
    error,
  } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.data);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [animatingItems, setAnimatingItems] = useState(new Set());

  useEffect(() => {
    if (user) {
      getWishlistApi(dispatch);
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <section className="min-h-dvh lg:pt-24 py-5 flex items-center justify-center bg-bg">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Please sign in
          </h2>
          <p className="text-gray-600 mb-4">
            You need to log in to view your wishlist.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-accent-content px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-green-700 transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </section>
    );
  }

  const removeFromWishlist = async (id) => {
    setAnimatingItems((prev) => new Set(prev).add(id));

    try {
      await removeFromWishlistApi(id, dispatch);
    } finally {
      setAnimatingItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const sortedAndFilteredItems = () => {
    let items = [...wishlistItems];

    // Filter
    if (filterBy === "inStock") {
      items = items.filter((item) => item.inStock);
    } else if (filterBy === "outOfStock") {
      items = items.filter((item) => !item.inStock);
    } else if (filterBy !== "all") {
      items = items.filter((item) => item.category?.toLowerCase() === filterBy);
    }

    // Sort
    switch (sortBy) {
      case "priceLow":
        items.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        items.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        items.sort(
          (a, b) =>
            new Date(b.addedAt || 0).getTime() -
            new Date(a.addedAt || 0).getTime(),
        );
        break;
    }

    return items;
  };

  // Loading + Error
  if (loading) return <WishlistPageLoading viewMode={viewMode} />;

  if (error)
    return (
      <section className="min-h-dvh relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 py-10 md:py-16">
        {/* Animated Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-0 -right-40 w-[700px] h-[700px] bg-teal-100/30 rounded-full blur-[120px] animate-float-medium"></div>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] animate-float-fast"></div>
        </div>
        {error}
      </section>
    );

  return (
    <section className="min-h-dvh relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 py-10 md:py-16">
      {/* Animated Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-0 -right-40 w-[700px] h-[700px] bg-teal-100/30 rounded-full blur-[120px] animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] animate-float-fast"></div>
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 animate-fade-in">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm sm:text-base opacity-80">
              {wishlistItems.length} items waiting for you
            </p>
          </div>

          <BackButton className="mb-6 w-min py-1.5 sm:py-2" />
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-5 md:p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 shadow-inner w-fit">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-teal-600 scale-105"
                    : "text-slate-600 hover:text-teal-600 hover:bg-white/60"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white shadow-md text-teal-600 scale-105"
                    : "text-slate-600 hover:text-teal-600 hover:bg-white/60"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer transition-all"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="inStock">In Stock Only</option>
                <option value="outOfStock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {sortedAndFilteredItems().length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500">Start adding items you love!</p>
          </div>
        ) : (
          <div
            className={cn("grid gap-4 lg:gap-6", {
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7":
                viewMode === "grid",
              "grid-cols-1": viewMode === "list",
            })}
          >
            {sortedAndFilteredItems().map((item, index) => (
              <ProductCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                removeFromWishlist={removeFromWishlist}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(40px, -35px) rotate(4deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-45px, 30px) rotate(-5deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(25px, -25px);
          }
        }

        .animate-float-slow {
          animation: float-slow 38s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 32s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 26s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default WishlistComponent;
