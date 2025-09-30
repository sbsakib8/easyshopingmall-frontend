"use client"
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Trash2, Share2, Eye, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';

const WishlistComponent = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 324,
      inStock: true,
      discount: 33,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Stylish Leather Jacket",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 156,
      inStock: true,
      discount: 31,
      category: "Fashion"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 249.99,
      originalPrice: 349.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 892,
      inStock: false,
      discount: 29,
      category: "Electronics"
    },
    {
      id: 4,
      name: "Designer Sunglasses",
      price: 159.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 78,
      inStock: true,
      discount: 20,
      category: "Fashion"
    },
    {
      id: 5,
      name: "Wireless Gaming Mouse",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 234,
      inStock: true,
      discount: 20,
      category: "Electronics"
    },
    {
      id: 6,
      name: "Cozy Winter Sweater",
      price: 49.99,
      originalPrice: 79.99,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 167,
      inStock: true,
      discount: 38,
      category: "Fashion"
    }
  ]);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [animatingItems, setAnimatingItems] = useState(new Set());

  const removeFromWishlist = (id) => {
    setAnimatingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      setWishlistItems(items => items.filter(item => item.id !== id));
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const addToCart = (item) => {
    // Animation effect
    const button = document.querySelector(`[data-cart-button="${item.id}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 600);
    }
    console.log('Added to cart:', item.name);
  };

  const sortedAndFilteredItems = () => {
    let items = [...wishlistItems];
    
    // Filter
    if (filterBy === 'inStock') {
      items = items.filter(item => item.inStock);
    } else if (filterBy === 'outOfStock') {
      items = items.filter(item => !item.inStock);
    } else if (filterBy !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === filterBy);
    }
    
    // Sort
    switch (sortBy) {
      case 'priceLow':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    return items;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen lg:mt-24 py-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            My Wishlist
          </h1>
          <p className="text-gray-600 text-lg">
            {wishlistItems.length} items waiting for you
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-md text-teal-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-md text-teal-600'
                    : 'text-gray-600 hover:text-green-600'
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
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {sortedAndFilteredItems().map((item, index) => (
              <Link
               href={`/productdetails/${item.id}`}
                key={item.id}
                className={`group cursor-pointer bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:scale-105 ${
                  animatingItems.has(item.id) ? 'animate-pulse opacity-50 scale-95' : ''
                } ${viewMode === 'list' ? 'flex' : ''}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-64'
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Discount Badge */}
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      -{item.discount}%
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute top-3 right-3 bg-red-700/80 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-gray-600">
                      {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-teal-600">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      data-cart-button={item.id}
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        item.inStock
                          ? 'bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 hover:from-teal-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
            <p className="text-purple-100 mb-6">
              You have {wishlistItems.filter(item => item.inStock).length} items available in stock
            </p>
            <button className="bg-white cursor-pointer text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              Add All to Cart
            </button>
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