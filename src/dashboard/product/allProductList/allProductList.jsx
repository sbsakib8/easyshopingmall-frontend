"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Package, Tag, Grid, Eye, Edit, Trash2, Star,  Plus,
   Download, RefreshCw,
  TrendingUp, ArrowUp,  MoreVertical, 
   DollarSign, Activity, Zap, Globe,
} from 'lucide-react';

const ProductDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Avanie Special Ring',
      description: 'Avanie Special Ring',
      category: 'Jewellery',
      subCategory: 'Women',
      brand: 'Avanie',
      price: 40000,
      salePrice: 300,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop',
      stock: 15,
      sales: 245
    },
    {
      id: 2,
      name: 'Realme Narzo N63',
      description: 'Lorem Ipsum is sim...',
      category: 'Electronics',
      subCategory: 'Mobiles',
      brand: 'Realme',
      price: 11999,
      salePrice: 12499,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
      stock: 32,
      sales: 189
    },
    {
      id: 3,
      name: 'Oppo K12x 5G 12...',
      description: 'Lorem Ipsum is sim...',
      category: 'Electronics',
      subCategory: 'Mobiles',
      brand: 'OPPO',
      price: 15999,
      salePrice: 14999,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=100&h=100&fit=crop',
      stock: 28,
      sales: 156
    },
    {
      id: 4,
      name: 'CHUWI Intel Core...',
      description: 'Lorem Ipsum is sim...',
      category: 'Electronics',
      subCategory: 'Laptops',
      brand: 'CHUWI',
      price: 25999,
      salePrice: 24999,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
      stock: 12,
      sales: 134
    },
    {
      id: 5,
      name: 'JioBook 11 with...',
      description: 'Lorem Ipsum is sim...',
      category: 'Electronics',
      subCategory: 'Laptops',
      brand: 'JIO',
      price: 15999,
      salePrice: 18999,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=100&h=100&fit=crop',
      stock: 8,
      sales: 98
    },
    {
      id: 6,
      name: 'Gaming Keyboard',
      description: 'RGB Mechanical Keyboard',
      category: 'Electronics',
      subCategory: 'Accessories',
      brand: 'Corsair',
      price: 8999,
      salePrice: 7499,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop',
      stock: 45,
      sales: 267
    }
  ]);

  // Calculate statistics
  const totalProducts = products.length;
  const categories = [...new Set(products.map(p => p.category))];
  const totalCategories = categories.length;
  const subCategories = [...new Set(products.map(p => p.subCategory))];
  const totalSubCategories = subCategories.length;

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'} transition-all duration-300`}
      />
    ));
  };

  const getStatusColor = (stock) => {
    if (stock <= 10) return 'from-red-500 to-pink-500';
    if (stock <= 25) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusText = (stock) => {
    if (stock <= 10) return 'Low Stock';
    if (stock <= 25) return 'Medium';
    return 'In Stock';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/3 to-blue-600/3 rounded-full blur-3xl animate-bounce-slow"></div>
      </div>
      {/* Main Content */}
      <div className={`transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-9`}>
        
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                 All Product <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin</span>
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {currentTime.toLocaleDateString('en-BD')}
                  </p>
                  <p className="text-blue-300 text-sm">
                    {currentTime.toLocaleTimeString('en-BD')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              title: 'Total Products',
              value: totalProducts,
              change: '+12.5%',
              icon: Package,
              gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
              bgGradient: 'from-emerald-500/10 to-cyan-500/10'
            },
            {
              title: 'Total Categories',
              value: totalCategories,
              change: '+8.2%',
              icon: Tag,
              gradient: 'from-purple-500 via-violet-500 to-indigo-500',
              bgGradient: 'from-purple-500/10 to-indigo-500/10'
            },
            {
              title: 'Sub Categories',
              value: totalSubCategories,
              change: '+3.1%',
              icon: Grid,
              gradient: 'from-blue-500 via-sky-500 to-cyan-500',
              bgGradient: 'from-blue-500/10 to-cyan-500/10'
            },
            {
              title: 'Total Sales',
              value: '৳2,45,320',
              change: '+15.3%',
              icon: DollarSign,
              gradient: 'from-amber-500 via-orange-500 to-red-500',
              bgGradient: 'from-amber-500/10 to-red-500/10'
            }
          ].map((card, index) => (
            <div
              key={card.title}
              className={`group relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl p-6 rounded-3xl border border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-slideUp overflow-hidden`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glowing border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <ArrowUp className="w-4 h-4 animate-bounce" />
                    <span className="text-sm font-bold">{card.change}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    vs last month
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/30 shadow-2xl p-6 sm:p-8 mb-8 animate-slideUp" style={{animationDelay: '0.6s'}}>
          <div className="flex flex-col space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Best Selling Products
                  </h2>
                  <p className="text-sm text-gray-400">Showing {filteredProducts.length} of {totalProducts} products</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Data</span>
                </div>
              </div>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Category Filter
                  </label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:bg-gray-700/50"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, brand, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-gray-700/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105">
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-700/30 shadow-2xl overflow-hidden animate-slideUp" style={{animationDelay: '0.8s'}}>
          
          {/* Desktop Table Header */}
          <div className="hidden lg:block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4 border-b border-gray-700/50">
            <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm uppercase tracking-wide">
              <div className="col-span-3">Product Details</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Brand</div>
              <div className="col-span-2">Pricing</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Rating</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Products</h3>
              <span className="text-blue-100 text-sm">{filteredProducts.length} items</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/30 max-h-96 lg:max-h-none overflow-y-auto">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="group px-4 sm:px-6 py-4 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-gray-600/50 group-hover:border-blue-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">{product.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-400 font-medium">{product.sales} sales</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-blue-400 font-medium">ID: #{product.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 group-hover:bg-blue-500/30 transition-all duration-300">
                      {product.category}
                    </span>
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {product.subCategory}
                      </span>
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 border border-gray-600/50 group-hover:from-gray-600 group-hover:to-gray-500 transition-all duration-300">
                      {product.brand}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      {product.price !== product.salePrice && (
                        <span className="text-xs text-gray-500 line-through block">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="font-bold text-lg text-emerald-400 block">
                        {formatPrice(product.salePrice)}
                      </span>
                      {product.price !== product.salePrice && (
                        <span className="text-xs text-orange-400 font-medium">
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="col-span-1">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(product.stock)} text-white shadow-md`}>
                        {product.stock}
                      </span>
                      <p className="text-xs text-gray-400">{getStatusText(product.stock)}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-xs text-gray-400">{product.rating}.0</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/25">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-emerald-500/25">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-red-500/25"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 transform hover:scale-110">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  <div className="flex items-start space-x-4">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-gray-600/50 group-hover:border-blue-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">{product.description}</p>
                          
                          {/* Mobile Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {product.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {product.subCategory}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-600/50 text-gray-300">
                              {product.brand}
                            </span>
                          </div>

                          {/* Mobile Price and Stats */}
                          <div className="flex items-center justify-between">
                            <div>
                              {product.price !== product.salePrice && (
                                <span className="text-xs text-gray-500 line-through block">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                              <span className="font-bold text-base sm:text-lg text-emerald-400">
                                {formatPrice(product.salePrice)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="flex items-center space-x-1 mb-1">
                                  {renderStars(product.rating)}
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(product.stock)} text-white`}>
                                  {product.stock} left
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/30">
                        <div className="flex items-center space-x-1 text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-medium">{product.sales} sales</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <Eye size={14} />
                          </button>
                          <button className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-gray-600/20 to-gray-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-gray-600/30">
                <Package className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 animate-fadeInUp" style={{animationDelay: '1s'}}>
          {[
            { title: 'Server Uptime', value: '98.5%', icon: Zap, color: 'from-green-500 to-emerald-500', status: 'Live' },
            { title: 'Active Visitors', value: '1,432', icon: Globe, color: 'from-blue-500 to-indigo-500', status: '+12%' },
            { title: 'Avg. Rating', value: '4.8', icon: Star, color: 'from-purple-500 to-pink-500', status: 'Excellent' },
            { title: 'Revenue Today', value: '৳12,450', icon: DollarSign, color: 'from-amber-500 to-orange-500', status: '+8%' }
          ].map((metric, index) => (
            <div 
              key={metric.title}
              className={`bg-gradient-to-br ${metric.color} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden animate-slideUp`}
              style={{animationDelay: `${1000 + (index * 150)}ms`}}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className="w-6 h-6" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">{metric.status}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm opacity-90">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fadeInUp" style={{animationDelay: '1.2s'}}>
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <Activity className="w-4 h-4" />
            <span>Showing {filteredProducts.length} of {totalProducts} products</span>
            <span>•</span>
            <span>Last updated: {currentTime.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(10px) rotate(-1deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        /* Enhanced responsiveness */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
          
          .p-6 {
            padding: 1rem;
          }
          
          .p-8 {
            padding: 1.5rem;
          }
          
          .text-3xl {
            font-size: 1.5rem;
          }
          
          .text-2xl {
            font-size: 1.25rem;
          }

          .animate-slideUp,
          .animate-fadeInUp,
          .animate-slideDown {
            animation-duration: 0.4s;
          }
        }

        @media (max-width: 768px) {
          .animate-slideUp,
          .animate-fadeInUp,
          .animate-slideDown {
            animation-duration: 0.5s;
          }
        }

        /* Glassmorphism enhancements */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        /* Loading shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        /* Hover glow effects */
        .hover-glow:hover {
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15),
                      0 10px 20px rgba(139, 92, 246, 0.1);
        }

        /* Enhanced mobile interactions */
        @media (hover: none) and (pointer: coarse) {
          .group:active {
            transform: scale(0.98);
          }
          
          .transform:active {
            transform: scale(0.95);
          }
        }

        /* Dark theme enhancements */
        .dark-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.1),
                      0 0 40px rgba(139, 92, 246, 0.05);
        }

        /* Advanced animations */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.2),
                        0 0 40px rgba(139, 92, 246, 0.1);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductDashboard;