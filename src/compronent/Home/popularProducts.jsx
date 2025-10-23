"use client";
import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Laptop,
  Footprints,
  Coffee,
  Sparkles,
  Heart,
  Gem,
  Star,
  Eye,
  ShoppingCart,
  TrendingUp,
  Award,
  Gift,
  Zap,
  Search,
} from "lucide-react";
import Link from "next/link";

// 🧠 Import your hooks
import { useGetcategory } from "../../utlis/usecategory";
import { useGetProduct } from "../../utlis/userProduct";

const PopularProducts = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isWishlist, setIsWishlist] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const productParams = useMemo(() => ({ page: 1, limit: 20, search: "" }), []);

  // ✅ Fetch data dynamically
  const { category, loading: categoryLoading } = useGetcategory();
  const { product, loading: productLoading, error } = useGetProduct(productParams);

  const loading = categoryLoading || productLoading;

  // 🧩 Merge structured dataset
  const mergedData = useMemo(() => {
    if (!product || !category) return { products: [], categories: [] };

    const categories = category.map((c) => ({
      id: c.name?.toUpperCase(),
      name: c.name?.toUpperCase(),
      icon: c.icon || <Sparkles className="w-4 h-4" />,
      color: c.color || "from-slate-500 to-gray-600",
    }));

    const products = product.map((p) => ({
      id: p._id,
      name: p.productName,
      image: p.images?.[0] || "",
      price: p.price,
      originalPrice: p.oldPrice || p.price,
      rating: p.rating || 4.5,
      category: p.category?.[0]?.name?.toUpperCase() || "GENERAL",
      badge: p.tags?.[0] || "New",
    }));

    return { products, categories };
  }, [product, category]);

  const currentProducts = useMemo(() => {
    if (activeCategory === "ALL") return mergedData.products;
    return mergedData.products.filter((p) => p.category === activeCategory);
  }, [mergedData.products, activeCategory]);

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentProducts, searchTerm]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      Trending: "bg-gradient-to-r from-pink-500 to-rose-500",
      Hot: "bg-gradient-to-r from-red-500 to-orange-500",
      New: "bg-gradient-to-r from-green-500 to-emerald-500",
      Sale: "bg-gradient-to-r from-purple-500 to-violet-500",
      Bestseller: "bg-gradient-to-r from-blue-500 to-indigo-500",
      Featured: "bg-gradient-to-r from-amber-500 to-yellow-500",
      Premium: "bg-gradient-to-r from-gray-700 to-gray-900",
      Popular: "bg-gradient-to-r from-teal-500 to-cyan-500",
      Sport: "bg-gradient-to-r from-orange-500 to-red-500",
      Luxury: "bg-gradient-to-r from-purple-600 to-pink-600",
      Organic: "bg-gradient-to-r from-green-600 to-lime-600",
      Eco: "bg-gradient-to-r from-emerald-600 to-teal-600",
      Smart: "bg-gradient-to-r from-indigo-600 to-blue-600",
      Exclusive: "bg-gradient-to-r from-violet-600 to-purple-600",
    };
    return colors[badge] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const toggleWishlist = (id) => {
    setIsWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-gray-600">
        Loading popular products...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-red-500">
        Error loading products
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header & Categories */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Popular Products
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover amazing products across all categories
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>


          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`flex items-center space-x-2 px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === "ALL"
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200"
                }`}
            >
              All
            </button>
            {mergedData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200"
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <Link
              href={`/productdetails/${p.id}`}
              key={p.id}
              className="group bg-white/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border border-white/50 cursor-pointer overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute top-3 left-3 ${getBadgeColor(
                    p.badge
                  )} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
                >
                  {p.badge}
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(p.id);
                    }}
                    className={`p-2 rounded-full shadow-md ${isWishlist[p.id]
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:text-red-500"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlist[p.id] ? "fill-current" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                  {p.name}
                </h3>
                <div className="flex items-center mb-3">
                  {renderStars(p.rating)}
                  <span className="text-xs text-gray-500 ml-2">
                    ({p.rating})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-600">
                      ${p.price}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${p.originalPrice}
                      </span>
                    )}
                  </div>
                  {p.originalPrice > p.price && (
                    <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                      -{Math.round(
                        ((p.originalPrice - p.price) / p.originalPrice) * 100
                      )}
                      %
                    </div>
                  )}
                </div>
                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-2xl font-semibold flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </Link>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;
