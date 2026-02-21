"use client";
import { CardSkeleton } from "@/src/compronent/loading/Skeleton";
import AddtoCartBtn from "@/src/helper/Buttons/AddtoCartBtn";
import { getWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist";
import { Eye, Grid, Heart, List, Share2, ShoppingCart, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WishlistComponent = () => {
  const dispatch = useDispatch();
  const { data: wishlistItems = [], loading, error } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.data);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [animatingItems, setAnimatingItems] = useState(new Set());
  // console.log("wishlistItems:", wishlistItems);


  useEffect(() => {
    if (user) {
      getWishlistApi(dispatch);
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="min-h-screen lg:pt-24 py-5 flex items-center justify-center bg-bg">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to log in to view your wishlist.</p>
          <Link
            href="/signin"
            className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-accent-content px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-green-700 transition-all"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
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
          (a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
        );
        break;
    }

    return items;
  };

  const renderStars = (rating) => {
    const value = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(value) ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  // Loading + Error
  if (loading)
    return (
      <div className="min-h-screen lg:pt-24 py-6 bg-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen lg:pt-24 py-6 bg-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb  -8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-btn-color bg-clip-text text-transparent mb-4 animate-fade-in">
            My Wishlist
          </h1>
          <p className="text-gray-600 text-lg">{wishlistItems.length} items waiting for you</p>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid"
                  ? "bg-white shadow-md text-teal-600"
                  : "text-gray-600 hover:text-green-600"
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list"
                  ? "bg-white shadow-md text-teal-600"
                  : "text-gray-600 hover:text-green-600"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 bg-white cursor-pointer border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
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
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500">Start adding items you love!</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
              }`}
          >
            {sortedAndFilteredItems().map((item, index) => (
              <Link
                href={`/productdetails/${item.id}`}
                key={item.id}
                className={`group cursor-pointer bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:scale-105 ${animatingItems.has(item.id) ? "animate-pulse opacity-50 scale-95" : ""
                  } ${viewMode === "list" ? "flex" : ""}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.6s ease-out forwards",
                }}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-64"
                    }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Discount Badge */}
                  {/* {item.discount && (
                    <div className="absolute top-3 left-3 bg-secondary text-accent-content px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      -{item.discount}%
                    </div>
                  )} */}

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute top-3 right-3 bg-secondary text-accent-content px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </div>
                  )}

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button className="p-3 bg-white/90 cursor-pointer rounded-full hover:bg-white hover:scale-110 transition-all duration-300">
                      <Eye className="w-5 h-5 text-gray-800" />
                    </button>
                    <button className="p-3 cursor-pointer bg-white/90 rounded-full hover:bg-white hover:scale-110 transition-all duration-300">
                      <Share2 className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-gray-600">
                      {item.rating || 0} ({item.reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-secondary">
                      ৳{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ৳{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      data-cart-button={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        // addToCart(item);
                      }}
                      disabled={!item.inStock}
                      className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${item.inStock
                        ? "bg-btn-color hover:to-btn-color/80 text-accent-content shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <AddtoCartBtn 
                      productId={item.id} 
                      className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}</AddtoCartBtn>
                    </button>
                     
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
    </div>
  );
};

export default WishlistComponent;
