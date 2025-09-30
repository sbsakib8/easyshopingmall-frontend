"use client";
import React, { useState } from "react";
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
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";

const PopularProducts = () => {
  const [activeCategory, setActiveCategory] = useState("FASHION");
  const [isWishlist, setIsWishlist] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Mock product data since the original data import isn't available
  const products = {
    FASHION: [
      { id: 1, name: "Premium Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", price: 29.99, originalPrice: 39.99, rating: 4.5, category: "FASHION", badge: "Trending" },
      { id: 2, name: "Designer Denim Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", price: 89.99, originalPrice: 119.99, rating: 4.8, category: "FASHION", badge: "Hot" },
      { id: 3, name: "Elegant Summer Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", price: 59.99, originalPrice: 79.99, rating: 4.6, category: "FASHION", badge: "New" },
      { id: 4, name: "Casual Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", price: 79.99, originalPrice: 99.99, rating: 4.4, category: "FASHION", badge: "Sale" }
    ],
    ELECTRONICS: [
      { id: 5, name: "Wireless Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", price: 159.99, originalPrice: 199.99, rating: 4.7, category: "ELECTRONICS", badge: "Bestseller" },
      { id: 6, name: "Smart Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", price: 299.99, originalPrice: 399.99, rating: 4.5, category: "ELECTRONICS", badge: "Featured" }
    ],
    BAGS: [
      { id: 7, name: "Leather Backpack", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", price: 89.99, originalPrice: 129.99, rating: 4.6, category: "BAGS", badge: "Premium" },
      { id: 8, name: "Travel Duffle Bag", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", price: 69.99, originalPrice: 99.99, rating: 4.3, category: "BAGS", badge: "Popular" }
    ],
    FOOTWEAR: [
      { id: 9, name: "Running Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", price: 129.99, originalPrice: 159.99, rating: 4.8, category: "FOOTWEAR", badge: "Sport" },
      { id: 10, name: "Formal Oxford", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400", price: 189.99, originalPrice: 229.99, rating: 4.5, category: "FOOTWEAR", badge: "Luxury" }
    ],
    GROCERIES: [
      { id: 11, name: "Organic Coffee Beans", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", price: 24.99, originalPrice: 29.99, rating: 4.7, category: "GROCERIES", badge: "Organic" },
      { id: 12, name: "Premium Tea Collection", image: "https://images.unsplash.com/photo-1597318109810-b93dd87a3e9c?w=400", price: 34.99, originalPrice: 44.99, rating: 4.6, category: "GROCERIES", badge: "Premium" }
    ],
    BEAUTY: [
      { id: 13, name: "Skincare Set", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 79.99, originalPrice: 99.99, rating: 4.8, category: "BEAUTY", badge: "Bestseller" },
      { id: 14, name: "Makeup Palette", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", price: 49.99, originalPrice: 69.99, rating: 4.4, category: "BEAUTY", badge: "Trending" }
    ],
    WELLNESS: [
      { id: 15, name: "Yoga Mat Premium", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", price: 39.99, originalPrice: 54.99, rating: 4.6, category: "WELLNESS", badge: "Eco" },
      { id: 16, name: "Fitness Tracker", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400", price: 89.99, originalPrice: 119.99, rating: 4.5, category: "WELLNESS", badge: "Smart" }
    ],
    JEWELLERY: [
      { id: 17, name: "Diamond Ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", price: 299.99, originalPrice: 399.99, rating: 4.9, category: "JEWELLERY", badge: "Luxury" },
      { id: 18, name: "Gold Necklace", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", price: 199.99, originalPrice: 249.99, rating: 4.7, category: "JEWELLERY", badge: "Exclusive" }
    ]
  };

  const categories = [
    { id: "FASHION", name: "FASHION", icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-pink-500 to-rose-500" },
    { id: "ELECTRONICS", name: "ELECTRONICS", icon: <Laptop className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-blue-500 to-indigo-500" },
    { id: "BAGS", name: "BAGS", icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-amber-500 to-orange-500" },
    { id: "FOOTWEAR", name: "FOOTWEAR", icon: <Footprints className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-teal-500 to-cyan-500" },
    { id: "GROCERIES", name: "GROCERIES", icon: <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-emerald-500 to-green-500" },
    { id: "BEAUTY", name: "BEAUTY", icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-purple-500 to-violet-500" },
    { id: "WELLNESS", name: "WELLNESS", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-lime-500 to-green-500" },
    { id: "JEWELLERY", name: "JEWELLERY", icon: <Gem className="w-4 h-4 sm:w-5 sm:h-5" />, color: "from-yellow-500 to-amber-500" },
  ];

  const currentProducts = products[activeCategory] || [];
  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Trending': 'bg-gradient-to-r from-pink-500 to-rose-500',
      'Hot': 'bg-gradient-to-r from-red-500 to-orange-500',
      'New': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'Sale': 'bg-gradient-to-r from-purple-500 to-violet-500',
      'Bestseller': 'bg-gradient-to-r from-blue-500 to-indigo-500',
      'Featured': 'bg-gradient-to-r from-amber-500 to-yellow-500',
      'Premium': 'bg-gradient-to-r from-gray-700 to-gray-900',
      'Popular': 'bg-gradient-to-r from-teal-500 to-cyan-500',
      'Sport': 'bg-gradient-to-r from-orange-500 to-red-500',
      'Luxury': 'bg-gradient-to-r from-purple-600 to-pink-600',
      'Organic': 'bg-gradient-to-r from-green-600 to-lime-600',
      'Eco': 'bg-gradient-to-r from-emerald-600 to-teal-600',
      'Smart': 'bg-gradient-to-r from-indigo-600 to-blue-600',
      'Exclusive': 'bg-gradient-to-r from-violet-600 to-purple-600'
    };
    return colors[badge] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const toggleWishlist = (productId) => {
    setIsWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      

      {/* Header Section */}
      <div className="relative z-10">
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

            {/* Search Bar */}
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

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-indigo-500/25`
                      : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                {activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase()} Collection
              </h2>
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <Link href={`/productdetails/${product.id}`}
                key={product.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/50 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "slideInUp 0.8s ease-out forwards",
                  opacity: 0,
                }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badge */}
                  <div className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                    {product.badge}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        isWishlist[product.id]
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlist[product.id] ? 'fill-current' : ''}`} />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/10 backdrop-blur-sm">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-2 rounded-full font-semibold shadow-xl transform scale-95 group-hover:scale-100 transition-all duration-300 hover:bg-white">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3 space-x-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      ({product.rating})
                    </span>
                    <div className="flex-1"></div>
                    <Gift className="w-4 h-4 text-indigo-500" />
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/btn">
                    <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto shadow-lg">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or browse different categories</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Glassmorphism effect */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default PopularProducts;