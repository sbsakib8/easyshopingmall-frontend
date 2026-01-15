"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package, TrendingUp, TrendingDown, AlertTriangle, Filter, Download, Upload, MoreHorizontal, Star, Zap, Target, BarChart3, X, DollarSign, Tag } from 'lucide-react';
import AnalyticsDashboard from './analytics';
import { useGetProduct } from '@/src/utlis/userProduct';
import { ProductDelete, ProductUpdate } from '@/src/hook/useProduct';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import socket from '@/src/confic/socket';
import { CreateNotification } from '@/src/hook/useNotification';

const InventoryDashboard = () => {


  // product get data
  const [page, setPage] = useState(1);
  const formData = useMemo(() => ({
    page,
    limit: 10,
    search: ""
  }), []);

  // product get 
  const { product, loading, error, refetch } = useGetProduct(formData)
  // get category data
  const allCategorydata = useSelector((state) => state.category.allCategorydata);
  const allsubCategorydata = useSelector((state) => state.subcategory.allsubCategorydata);


  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (product) {
      setProducts(product);
    }
  }, [product]);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState('products');
  const [lowStockThreshold, setLowStockThreshold] = useState(1);

  //  action function click handle 
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleView = (product) => {
    setViewModal(product);
  };

  const handleEdit = (product) => {
    setEditModal({ ...product });
  };

  const handleDelete = (id) => {
    setDeleteModal(id);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteModal) return;
      await ProductDelete(deleteModal);
      setDeleteModal(null);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  const [load, setLoad] = useState(false);
  const saveEdit = async () => {
    setLoad(true);
    try {
      const res = await ProductUpdate(editModal);
      if (res.success) {
        toast.success("Product updated successfully!");
        setProducts(products.map(p => p._id === editModal._id ? editModal : p));
        setEditModal(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setLoad(false);
    }
  };

  const updateEditField = (field, value) => {
    setEditModal({ ...editModal, [field]: value });
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


  // Calculate statistics
  const totalProducts = product?.length || 0;
  const totalCategories = allCategorydata?.data.length || 0;
  const totalSubCategories = allsubCategorydata?.data.length || 0;
  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) => {
      const matchesSearch =
        product?.productName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        product?.brand?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        product?._id?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        product?.productStock?.toString()?.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        product?.category?.some((cat) => cat.name === selectedCategory) ||
        product?.subCategory?.some((sub) => sub.name === selectedCategory);

      return matchesSearch && matchesCategory;
    });

    const sorted = filtered.slice().sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.productName.localeCompare(b.productName); 
        case "price":
          return a.price - b.price; 
        case "stock":
          return a.productStock - b.productStock; 
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy]);

console.log("products --->",products)
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p?.productStock <= 1).length;
    const outOfStockProducts = products.filter(p => p?.productStock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p?.price * p?.productStock), 0);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      inStockProducts: totalProducts - lowStockProducts - outOfStockProducts,
      totalValue
    };
  }, [products]);

  const getStockStatus = (product) => {
    if (!product) return { status: "Not Have", color: "bg-gray-400", textColor: "text-gray-600" };

    if (product.productStock === 0) {
      return { status: "Out of Stock", color: "bg-red-500", textColor: "text-red-600" };
    } else if (product.productStock > 0 && product.productStock <= lowStockThreshold) {
      return { status: "Low Stock", color: "bg-yellow-500", textColor: "text-yellow-600" };
    } else {
      return { status: "In Stock", color: "bg-green-500", textColor: "text-green-600" };
    }
  };

  const getStatusColor = (stock) => {
    if (stock <= 10) return 'from-red-500 to-pink-500';
    if (stock <= 25) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusText = (stock) => {
    if (stock <= 5) return 'Low Stock';
    if (stock <= 15) return 'Medium';
    return 'In Stock';
  };


  //  notification 
  useEffect(() => {
  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("notification:new", notif => {
    console.log("📩 New notification:", notif);
    setNotifications(prev => [notif, ...prev]);
    toast.success(`${notif.title}: ${notif.message}`);
  });

  return () => {
    socket.off("connect");
    socket.off("notification:new");
  };
}, []);

// ✅ Send Notification for Low or Out of Stock
const sendStockNotification = async (product) => {
  try {
    let notifType = "low-stock";
    let message = `Only ${product.productStock} units left`;

    if (product.productStock === 0) {
      notifType = "out-of-stock";
      message = "Product is Out of Stock ❌";
    }

    await CreateNotification({
      title: product.productName,
      message,
      type: notifType,
      referenceId: product._id,
      meta: { stock: product.productStock }
    });

    console.log("✅ Stock notification sent:", product.productName);
  } catch (error) {
    console.error("❌ Notification error:", error);
  }
};

useEffect(() => {
  if (products.length > 0) {
    products
      .filter(p => p.productStock <= lowStockThreshold)
      .forEach(product => {
        sendStockNotification(product);
      });
  }
}, [products, lowStockThreshold]);


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          
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

             <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 via-red-400 to-red-600 p-6 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-200">📦</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">{stats?.outOfStockProducts}</div>
                <div className="text-blue-100 font-medium">Out Of Stock </div>
                <div className="mt-2 text-xs text-blue-200">+12% from last month</div>
              </div>
            </div>

            {/* <div className="group relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 p-6 rounded-3xl shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 hover:scale-105 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-4xl animate-bounce delay-500">💰</div>
                </div>
                <div className="text-3xl font-black text-white mb-1">৳{stats.totalValue.toLocaleString()}</div>
                <div className="text-rose-100 font-medium">Total Value</div>
                <div className="mt-2 text-xs text-rose-200">Inventory worth</div>
              </div>
            </div> */}
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
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${selectedTab === tab.id
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
                      className=" px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:bg-gray-700/50"
                    >
                      <option value="All">All Categories</option>
                      {allCategorydata?.data.map(cat => (
                        <option key={cat._id} value={cat?.name}>{cat?.name}</option>
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
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-black/90 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    🔲 Grid
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${viewMode === 'table'
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
                    const stockPercentage = Math.min((product?.productStock / (lowStockThreshold * 2)) * 100, 100);

                    return (
                      <div
                        key={product?._id}
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
                            {product?.images ? <img src={product.images[0]} alt={product.productName} className="w-16 h-16 object-cover rounded-xl" /> : "📦"}
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
                              {product?.productName}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium">
                                {product?.category[0]?.name}
                              </span>
                              <span className="text-sm text-white/70 font-mono">{product?.sku}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-white">${product?.price}</span>
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${stockStatus.status === 'In Stock' ? 'bg-green-500/20 text-green-300' :
                              stockStatus.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                              <span>{stockStatus.status}</span>
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="space-y-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(product?.productStock)} text-white shadow-md`}>
                                {product?.productStock}
                              </span>
                              <p className="text-xs text-gray-400">{getStatusText(product?.productStock)}</p>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-700 ${stockPercentage > 50 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                  stockPercentage > 25 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                    'bg-gradient-to-r from-red-400 to-pink-500'
                                  }`}
                                style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-200 hover:scale-105 font-medium"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button onClick={() => handleView(product)} className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-200 hover:scale-105 font-medium">
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleDelete(product?._id)}
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
                          const stockStatus = getStockStatus(product?.productStock);
                          return (
                            <tr
                              key={product?._id}
                              className="border-b border-white/10 hover:bg-white/10 transition-all duration-300 group"
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                              }}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {product?.images ? <img src={product.images[0]} alt={product.productName} className="w-12 h-12 object-cover rounded-xl" /> : ""}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                                      {product.productName}
                                    </div>
                                    <div className="text-sm text-white/60 md:hidden">SKU: {product?.sku}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden md:table-cell font-mono text-sm">
                                {product?.sku}
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden lg:table-cell">
                                <span className="px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium">
                                  {product?.category[0].name}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(product?.productStock)} text-white shadow-md`}>
                                {product?.productStock}
                              </span>
                                  {product.trending === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                                  {product.trending === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/80 hidden lg:table-cell font-bold">
                                ${product?.price}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${stockStatus.status === 'In Stock' ? 'bg-green-500/20 text-green-300' :
                              stockStatus.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                              <span>{stockStatus.status}</span>
                            </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(product)}
                                    className="p-2 text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 hover:scale-110"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleView(product)} className="p-2 text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-all duration-200 hover:scale-110">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product?._id)}
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
              <AnalyticsDashboard />
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
                    .filter(p => p.productStock <= lowStockThreshold)
                    .map((product, index) => (
                      <div
                        key={product?._id}
                        className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {product?.images ? <img src={product.images[0]} alt={product.productName} className="w-12 h-12 object-cover rounded-xl" /> : ""}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{product?.productName}</h4>
                          <p className="text-sm text-white/70">
                            {product?.productStock === 0 ? "❌ Out of stock" : `⚠️ Only ${product?.productStock} units left`}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 hover:scale-105 font-semibold">
                          🔄 Restock
                        </button>
                      </div>
                    ))}

                  {products.filter(p => p.productStock <= lowStockThreshold).length === 0 && (
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

          {/* Edit Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Edit className="w-6 h-6" />
                    Edit Product
                  </h2>
                  <button
                    onClick={() => setEditModal(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Product Name</label>
                      <input
                        type="text"
                        value={editModal?.productName}
                        onChange={(e) => updateEditField('productName', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">SKU</label>
                      <input
                        type="text"
                        value={editModal?.sku}
                        onChange={(e) => updateEditField('sku', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Brand</label>
                      <input
                        type="text"
                        value={editModal?.brand}
                        onChange={(e) => updateEditField('brand', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Price</label>
                      <input
                        type="number"
                        value={editModal?.price}
                        onChange={(e) => updateEditField('price', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Discount (%)</label>
                      <input
                        type="number"
                        value={editModal?.discount}
                        onChange={(e) => updateEditField('discount', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Stock</label>
                      <input
                        type="number"
                        value={editModal?.productStock}
                        onChange={(e) => updateEditField('productStock', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editModal?.ratings}
                        onChange={(e) => updateEditField('ratings', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                      <textarea
                        value={editModal?.description}
                        onChange={(e) => updateEditField('description', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={saveEdit}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                    >
                      {load ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditModal(null)}
                      className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Modal */}

          {viewModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center z-10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    Product Details
                  </h2>
                  <button
                    onClick={() => setViewModal(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <img
                      src={viewModal?.images[0]}
                      alt={viewModal?.productName}
                      className="w-full md:w-64 h-64 rounded-xl object-cover border-2 border-purple-500/30"
                    />
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-white mb-2">{viewModal?.productName}</h3>
                      <div className="flex gap-2 mb-4">
                        {renderStars(viewModal?.ratings)}
                        <span className="text-white font-semibold">({viewModal?.ratings}.0)</span>
                      </div>
                      <p className="text-gray-300 mb-4">{viewModal?.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {viewModal?.category[0]?.name}
                        </span>
                        <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {viewModal?.subCategory[0]?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-cyan-400" />
                        <span className="text-gray-400 text-sm">SKU</span>
                      </div>
                      <p className="text-white font-semibold">{viewModal?.sku}</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-400 text-sm">Price</span>
                      </div>
                      <p className="text-white font-semibold text-2xl">৳{viewModal?.price}</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-400 text-sm">Discount</span>
                      </div>
                      <p className="text-emerald-400 font-semibold text-2xl">{viewModal?.discount}%</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-orange-400" />
                        <span className="text-gray-400 text-sm">Stock</span>
                      </div>
                      <p className="text-white font-semibold text-2xl">{viewModal?.productStock}</p>
                      <p className="text-gray-400 text-sm">{getStatusText(viewModal?.productStock)}</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <span className="text-gray-400 text-sm">Brand</span>
                      <p className="text-white font-semibold mt-2">{viewModal?.brand}</p>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                      <span className="text-gray-400 text-sm">Product ID</span>
                      <p className="text-emerald-400 font-mono text-sm mt-2">#{viewModal?._id}</p>
                    </div>
                  </div>

                  {viewModal?.images?.length > 1 && (
                    <div className="mt-6">
                      <h4 className="text-white font-semibold mb-3">All Images</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {viewModal?.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-32 rounded-lg object-cover border border-slate-600/50"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-full">
                    <Trash2 className="w-8 h-8 text-pink-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Delete Product</h2>
                </div>

                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
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