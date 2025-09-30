"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package, TrendingUp, TrendingDown, AlertTriangle, Filter, Download, Upload, MoreHorizontal, Star, Zap, Target, BarChart3 } from 'lucide-react';
import AnalyticsDashboard from './analytics';

const InventoryDashboard = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      stock: 45,
      price: 299.99,
      lowStockThreshold: 10,
      status: "active",
      supplier: "Tech Corp",
      lastUpdated: "2025-08-28",
      image: "🎧",
      trending: "up"
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      sku: "TS-002",
      category: "Clothing",
      stock: 8,
      price: 29.99,
      lowStockThreshold: 15,
      status: "active",
      supplier: "Fashion Co",
      lastUpdated: "2025-08-27",
      image: "👕",
      trending: "down"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      sku: "SW-003",
      category: "Electronics",
      stock: 0,
      price: 199.99,
      lowStockThreshold: 5,
      status: "out_of_stock",
      supplier: "Smart Tech",
      lastUpdated: "2025-08-26",
      image: "⌚",
      trending: "neutral"
    },
    {
      id: 4,
      name: "Leather Wallet Premium",
      sku: "LW-004",
      category: "Accessories",
      stock: 125,
      price: 89.99,
      lowStockThreshold: 10,
      status: "active",
      supplier: "Leather Works",
      lastUpdated: "2025-08-28",
      image: "👛",
      trending: "up"
    },
    {
      id: 5,
      name: "Gaming Mouse RGB",
      sku: "GM-005",
      category: "Electronics",
      stock: 32,
      price: 79.99,
      lowStockThreshold: 8,
      status: "active",
      supplier: "Gaming Pro",
      lastUpdated: "2025-08-29",
      image: "🖱️",
      trending: "up"
    },
    {
      id: 6,
      name: "Yoga Mat Professional",
      sku: "YM-006",
      category: "Sports",
      stock: 3,
      price: 39.99,
      lowStockThreshold: 8,
      status: "active",
      supplier: "Sports Plus",
      lastUpdated: "2025-08-25",
      image: "🧘",
      trending: "down"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    price: '',
    supplier: '',
    lowStockThreshold: '',
    description: ''
  });

  const categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Sports', 'Food & Beverage'];

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return b.price - a.price;
        case 'stock': return b.stock - a.stock;
        case 'category': return a.category.localeCompare(b.category);
        default: return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, products]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      inStockProducts: totalProducts - lowStockProducts - outOfStockProducts,
      totalValue
    };
  }, [products]);

  const getStockStatus = (product) => {
    if (product.stock === 0) return { status: "Out of Stock", color: "bg-red-500", textColor: "text-red-600" };
    if (product.stock <= product.lowStockThreshold) return { status: "Low Stock", color: "bg-yellow-500", textColor: "text-yellow-600" };
    return { status: "In Stock", color: "bg-green-500", textColor: "text-green-600" };
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.category) {
      const product = {
        id: Date.now(),
        ...newProduct,
        stock: parseInt(newProduct.stock) || 0,
        price: parseFloat(newProduct.price) || 0,
        lowStockThreshold: parseInt(newProduct.lowStockThreshold) || 10,
        status: "active",
        lastUpdated: new Date().toISOString().split('T')[0],
        image: "📦",
        trending: "neutral"
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', sku: '', category: '', stock: '', price: '', supplier: '', lowStockThreshold: '', description: '' });
      setShowModal(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({...product, stock: product.stock.toString(), price: product.price.toString(), lowStockThreshold: product.lowStockThreshold.toString()});
    setShowModal(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.sku && newProduct.category) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...newProduct,
              id: editingProduct.id,
              stock: parseInt(newProduct.stock) || 0,
              price: parseFloat(newProduct.price) || 0,
              lowStockThreshold: parseInt(newProduct.lowStockThreshold) || 10,
              lastUpdated: new Date().toISOString().split('T')[0],
              image: editingProduct.image,
              trending: editingProduct.trending
            }
          : p
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({ name: '', sku: '', category: '', stock: '', price: '', supplier: '', lowStockThreshold: '', description: '' });
      setShowModal(false);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="transition-all  duration-500 lg:ml-15 py-5 px-2 lg:px-10">
        <div className="w-[99%]  mx-auto">
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
                  Inventory <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</span>! 
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
             
            </div>
          </div>
        </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-200">📦</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats.totalProducts}</div>
                <div className="text-blue-100 font-medium">Total Products</div>
                <div className="mt-2 text-xs text-blue-200">+12% from last month</div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-300">✅</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats.inStockProducts}</div>
                <div className="text-green-100 font-medium">In Stock</div>
                <div className="mt-2 text-xs text-green-200">Well stocked items</div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-400">⚠️</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats.lowStockProducts}</div>
                <div className="text-amber-100 font-medium">Low Stock</div>
                <div className="mt-2 text-xs text-amber-200">Needs attention</div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 p-6 rounded-3xl shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 hover:scale-105 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-500">💰</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">${stats.totalValue.toLocaleString()}</div>
                <div className="text-rose-100 font-medium">Total Value</div>
                <div className="mt-2 text-xs text-rose-200">Inventory worth</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 inline-flex space-x-2">
              {[
                { id: 'products', label: 'Products', icon: Package, emoji: '📦' },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📊' },
                { id: 'alerts', label: 'Alerts', icon: AlertTriangle, emoji: '🚨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-white/90 to-white/70 text-gray-800 shadow-lg scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tab.emoji}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Tab */}
          {selectedTab === 'products' && (
            <>
              {/* Search and Controls */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-hover:text-white/80 transition-colors" />
                      <input
                        type="text"
                        placeholder="🔍 Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 w-full sm:w-80 hover:bg-white/25"
                      />
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/25"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-gray-800 text-white">{cat}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/25"
                    >
                      <option value="name" className="bg-gray-800">Sort by Name</option>
                      <option value="price" className="bg-gray-800">Sort by Price</option>
                      <option value="stock" className="bg-gray-800">Sort by Stock</option>
                      <option value="category" className="bg-gray-800">Sort by Category</option>
                    </select>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 flex-1 lg:flex-none justify-center font-semibold">
                      <Upload className="w-5 h-5" />
                      <span>📤 Import</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex-1 lg:flex-none justify-center font-semibold">
                      <Download className="w-5 h-5" />
                      <span>📥 Export</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({ name: '', sku: '', category: '', stock: '', price: '', supplier: '', lowStockThreshold: '', description: '' });
                        setShowModal(true);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 flex-1 lg:flex-none justify-center font-semibold"
                    >
                      <Plus className="w-5 h-5" />
                      <span>✨ Add Product</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-end mb-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-black/90 text-white shadow-lg' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    🔲 Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'table' 
                        ? 'bg-white/90 text-gray-800 shadow-lg' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    📋 Table
                  </button>
                </div>
              </div>

              {/* Products Display */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product);
                    const stockPercentage = Math.min((product.stock / (product.lowStockThreshold * 2)) * 100, 100);

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                      >
                        {/* Trending Badge */}
                        {product.trending === 'up' && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            🔥 HOT
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                            {product.image}
                          </div>
                          <div className="relative">
                            <button className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium">
                                {product.category}
                              </span>
                              <span className="text-sm text-white/70 font-mono">{product.sku}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-white">${product.price}</span>
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                              stockStatus.status === 'In Stock' ? 'bg-green-500/20 text-green-300' :
                              stockStatus.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              <span>{stockStatus.status}</span>
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-white/80">
                              <span>Stock: {product.stock} units</span>
                              {product.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                              {product.trending === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-700 ${
                                  stockPercentage > 50 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                  stockPercentage > 25 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                  'bg-gradient-to-r from-red-400 to-pink-500'
                                }`}
                                style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-200 hover:scale-105 font-medium"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-200 hover:scale-105 font-medium">
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 hover:scale-105 font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table View */
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-rose-600/50 border-b border-white/20">
                          <th className="px-6 py-4 text-left font-bold text-white">Product</th>
                          <th className="px-6 py-4 text-left font-bold text-white hidden md:table-cell">SKU</th>
                          <th className="px-6 py-4 text-left font-bold text-white hidden lg:table-cell">Category</th>
                          <th className="px-6 py-4 text-left font-bold text-white">Stock</th>
                          <th className="px-6 py-4 text-left font-bold text-white hidden lg:table-cell">Price</th>
                          <th className="px-6 py-4 text-left font-bold text-white">Status</th>
                          <th className="px-6 py-4 text-left font-bold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product, index) => {
                          const stockStatus = getStockStatus(product);
                          return (
                            <tr
                              key={product.id}
                              className="border-b border-white/10 hover:bg-white/10 transition-all duration-300 group"
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                              }}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {product.image}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-white/60 md:hidden">SKU: {product.sku}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden md:table-cell font-mono text-sm">
                                {product.sku}
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden lg:table-cell">
                                <span className="px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-white">{product.stock}</span>
                                  {product.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                                  {product.trending === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden lg:table-cell font-bold">
                                ${product.price}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                                  stockStatus.status === 'In Stock' ? 'bg-green-500/20 text-green-300' :
                                  stockStatus.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-red-500/20 text-red-300'
                                }`}>
                                  <span>{stockStatus.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="p-2 text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 hover:scale-110"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-all duration-200 hover:scale-110">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-110"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
             <AnalyticsDashboard/>
            </div>
          )}

          {/* Alerts Tab */}
          {selectedTab === 'alerts' && (
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <span>🚨 Stock Alerts</span>
                </h2>
                
                <div className="space-y-4">
                  {products
                    .filter(p => p.stock <= p.lowStockThreshold)
                    .map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="text-3xl">{product.image}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{product.name}</h4>
                          <p className="text-sm text-white/70">
                            {product.stock === 0 ? "❌ Out of stock" : `⚠️ Only ${product.stock} units left`}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 hover:scale-105 font-semibold">
                          🔄 Restock
                        </button>
                      </div>
                    ))}

                  {products.filter(p => p.stock <= p.lowStockThreshold).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-8xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-white mb-2">All Good!</h3>
                      <p className="text-white/70">No stock alerts at the moment. Everything is well-stocked!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Product Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-xl text-white border border-white/30 rounded-3xl p-8 w-full max-w-2xl transform transition-all duration-500 scale-100 hover:scale-[1.02] shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                    {editingProduct ? '✏️ Edit Product' : '✨ Add New Product'}
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">📝 Product Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">🏷️ SKU</label>
                      <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="SKU-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">📂 Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                      >
                        <option value="">Select Category</option>
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">📦 Stock Quantity</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">💰 Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">🏭 Supplier</label>
                      <input
                        type="text"
                        value={newProduct.supplier}
                        onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">⚠️ Low Stock Threshold</label>
                      <input
                        type="number"
                        value={newProduct.lowStockThreshold}
                        onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300"
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">📄 Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300 resize-none"
                        placeholder="Enter product description"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      setNewProduct({ name: '', sku: '', category: '', stock: '', price: '', supplier: '', lowStockThreshold: '', description: '' });
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-white hover:text-black rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
                  >
                    {editingProduct ? '💾 Update Product' : '✨ Add Product'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && selectedTab === 'products' && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
              <div className="text-8xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-white/70 mb-6 text-lg">Try adjusting your search criteria or add new products</p>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ name: '', sku: '', category: '', stock: '', price: '', supplier: '', lowStockThreshold: '', description: '' });
                  setShowModal(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold text-lg"
              >
                ✨ Add First Product
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .gradient-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }

        /* Hover effects */
        .hover-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
        }

        /* Responsive grid */
        @media (max-width: 768px) {
          .mobile-stack {
            display: block !important;
          }
          
          .mobile-stack > * {
            width: 100% !important;
            margin-bottom: 1rem;
          }
        }

        /* Progress bar animation */
        .progress-bar {
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Card hover animations */
        .card-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        /* Button pulse effect */
        .btn-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }

        /* Text animations */
        .text-shimmer {
          background: linear-gradient(90deg, #ffffff 0%, #a78bfa 50%, #ffffff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InventoryDashboard;