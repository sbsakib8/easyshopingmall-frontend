"use client";
import { getWishlistApi, removeFromWishlistApi } from "@/src/hook/useWishlist";
import { Filter, Grid2x2, Heart, List, ShoppingCart, SortAsc, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WishlistComponent = () => {
  const dispatch = useDispatch();
  const { data: wishlistItems, loading, error } = useSelector((state) => state.wishlist);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    getWishlistApi(dispatch);
  }, [dispatch]);

  const removeFromWishlist = (productId) => {
    removeFromWishlistApi(productId, dispatch);
  };

  const addToCart = (item) => {
    const button = document.querySelector(`[data-cart-button="${item.id}"]`);
    if (button) {
      button.classList.add("animate-pulse");
      setTimeout(() => button.classList.remove("animate-pulse"), 600);
    }
    console.log("Added to cart:", item.name);
  };

  // 🧠 Sort + filter logic
  const sortedAndFilteredItems = () => {
    let items = [...wishlistItems];

    // Filter
    if (filterBy === "inStock") items = items.filter((i) => i.inStock);
    else if (filterBy === "outOfStock") items = items.filter((i) => !i.inStock);
    else if (filterBy !== "all") items = items.filter((i) => i.category.toLowerCase() === filterBy);

    // Sort
    switch (sortBy) {
      case "priceLow":
        items.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        items.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
    }

    return items;
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ));

  // 🌀 Loading + Error
  if (loading)
    return <div className="text-center py-16 text-gray-500 text-lg">Loading wishlist...</div>;

  if (error)
    return <div className="text-center py-16 text-red-500 text-lg">{error}</div>;

  const categories = ["all", "nike", "adidas", "puma", "reebok"];

  return (
    <div className="min-h-screen lg:mt-24 py-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 💎 HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-lg">{wishlistItems.length} items waiting for you</p>
          </div>

          {/* 🎛 Controls */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            {/* Filter */}
            <div className="flex items-center bg-white rounded-xl shadow-md px-3 py-2">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-transparent outline-none text-gray-700 text-sm"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
                {categories.map(
                  (cat) =>
                    cat !== "all" && (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center bg-white rounded-xl shadow-md px-3 py-2">
              <SortAsc className="w-4 h-4 mr-2 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-gray-700 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="flex bg-white rounded-xl shadow-md px-2 py-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-teal-100 text-teal-600" : "text-gray-500"}`}
              >
                <Grid2x2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-teal-100 text-teal-600" : "text-gray-500"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 🧡 Empty Wishlist */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500">Start adding items you love!</p>
          </div>
        ) : (
          // 🛍 GRID / LIST VIEW
          <div
            className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
              }`}
          >
            {sortedAndFilteredItems().map((item) => (
              <Link
                href={`/productdetails/${item.id}`}
                key={item.id}
                className={`group bg-white/80 rounded-3xl shadow-xl border overflow-hidden hover:scale-[1.02] transition-all duration-500 ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                  }`}
              >
                {/* 🖼 Image */}
                <div
                  className={`relative overflow-hidden ${viewMode === "list" ? "sm:w-1/3 h-52" : "h-64"
                    }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{item.discount}%
                    </div>
                  )}
                </div>

                {/* 🧾 Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-teal-600 transition-colors">
                        {item.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(item.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{renderStars(item.rating)}</div>
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-teal-600">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${item.originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    data-cart-button={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(item);
                    }}
                    disabled={!item.inStock}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${item.inStock
                      ? "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:scale-105"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistComponent;
