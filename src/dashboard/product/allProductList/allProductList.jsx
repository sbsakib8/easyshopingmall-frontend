"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Package,
  Tag,
  Grid,
  Eye,
  Edit,
  Trash2,
  Star,
  Plus,
  Download,
  RefreshCw,
  X,
  TrendingUp,
  ArrowUp,
  MoreVertical,
  DollarSign,
  Activity,
  Zap,
  Globe,
} from "lucide-react";
import { useGetProduct } from "@/src/utlis/userProduct";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { UrlFrontend } from "@/src/confic/urlExport";
import toast from "react-hot-toast";
import { ProductDelete, ProductUpdate } from "@/src/hook/useProduct";
import { useGetAllOrders } from "@/src/utlis/useGetAllOrders";
import useGetRevenue from "@/src/utlis/useGetRevenue";
import * as XLSX from "xlsx"

const ProductDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [spin, setSpin] = useState(false)
  const Router = useRouter();
  // data
  const [page, setPage] = useState(1);
  const formData = useMemo(
    () => ({
      page,
      limit: 5000,
      search: "",
    }),
    [page]
  );

  // product get
  const { product,totalCount,refetch } = useGetProduct(formData);
  // console.log("totalCount--->",totalCount)
  const allCategorydata = useSelector((state) => state.category.allCategorydata);
  const allsubCategorydata = useSelector((state) => state.subcategory.allsubCategorydata);

  // demo Sample product data after remove
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (product) {
      setProducts(product);
      
    }
  }, [product, allCategorydata, allsubCategorydata]);
  // console.log("allCategorydata---->",allCategorydata)
  // Calculate statistics
  const totalProducts = product?.length || 0;
  const totalCategories = allCategorydata?.data.length || 0;
  const totalSubCategories = allsubCategorydata?.data.length || 0;
  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const matchesSearch =
        product?.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.productStock?.toString().includes(searchTerm);
      const matchesCategory =
        selectedCategory === "All" ||
        product?.category?.some((cat) => cat.name === selectedCategory) ||
        product?.subCategory?.some((sub) => sub.name === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        } transition-all duration-300`}
      />
    ));
  };

  const getStatusColor = (stock) => {
    if (stock <= 10) return "from-red-500 to-pink-500";
    if (stock <= 25) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  const getStatusText = (stock) => {
    if (stock <= 5) return "Low Stock";
    if (stock <= 15) return "Medium";
    return "In Stock";
  };

  // handle
  const addProdcut = () => {
    Router.push(`${UrlFrontend}/dashboard/products/addproduct`);
  };

  //  handleExport
  const handleExport = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(products)
    ws["!cols"] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 40 },
    { wch: 40 },
  ]
    XLSX.utils.book_append_sheet(wb,ws,"MyProducts")
    XLSX.writeFile(wb,"productsData.xlsx")
    // const dataStr = JSON.stringify(products, null, 2);
    // const dataBlob = new Blob([dataStr], { type: "application/json" });
    // const url = URL.createObjectURL(dataBlob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "products-export.json";
    // link.click();
  };

  // refetch
  const reFreshData = async() => {
    setSpin(true)
    setPage(page+1)
   await refetch();
   setSpin(false)
  };

  //  action function click handle
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

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
        setProducts(products.map((p) => (p._id === editModal._id ? editModal : p)));
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

// toal sale calculation 
//  const { allOrders, loading: ordersLoading } = useGetAllOrders()
//  const completedOrders = allOrders?.filter(order => order.order_status==="completed")
//  const toalIncome = completedOrders?.reduce((sum,o)=>sum+o.totalAmt,0)
 const {totalRevenue,loading:revenueLoading} = useGetRevenue()
//  console.log("allOrders--->",allOrders)
//  console.log("completedOrders--->",completedOrders)
//  console.log("toalIncome--->",toalIncome)
//  console.log("totalRevenue--->",totalRevenue)

// if(loading)return <p>Loading...</p>
// console.log(loading)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/3 to-blue-600/3 rounded-full blur-3xl animate-bounce-slow"></div>
      </div>
      {/* Main Content */}
      <div className={`transition-all duration-500 lg:ml-15 py-5 px-2 lg:px-9`}>
        {/* Welcome Banner */}
        <div className="mb-8 animate-slideDown">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  All Product{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Admin
                  </span>
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {currentTime.toLocaleDateString("en-BD")}
                  </p>
                  <p className="text-blue-300 text-sm">{currentTime.toLocaleTimeString("en-BD")}</p>
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
              title: "Total Products",
              value: totalCount,
              change: "+12.5%",
              icon: Package,
              gradient: "from-emerald-500 via-teal-500 to-cyan-500",
              bgGradient: "from-emerald-500/10 to-cyan-500/10",
            },
            {
              title: "Total Categories",
              value: totalCategories,
              change: "+8.2%",
              icon: Tag,
              gradient: "from-purple-500 via-violet-500 to-indigo-500",
              bgGradient: "from-purple-500/10 to-indigo-500/10",
            },
            {
              title: "Sub Categories",
              value: totalSubCategories,
              change: "+3.1%",
              icon: Grid,
              gradient: "from-blue-500 via-sky-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/10",
            },
            {
              title: "Total Sales",
              value: totalRevenue,
              change: "+15.3%",
              icon: DollarSign,
              gradient: "from-amber-500 via-orange-500 to-red-500",
              bgGradient: "from-amber-500/10 to-red-500/10",
            },
          ].map((card, index) => (
            <div
              key={card?.title}
              className={`group relative bg-gradient-to-br ${card?.bgGradient} backdrop-blur-xl p-6 rounded-3xl border border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-slideUp overflow-hidden`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card?.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${card?.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <ArrowUp className="w-4 h-4 animate-bounce" />
                    <span className="text-sm font-bold">{card?.change}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">{card?.title}</p>
                  <p className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                    {card?.value}
                  </p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div
          className="bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/30 shadow-2xl p-6 sm:p-8 mb-8 animate-slideUp"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Best Selling Products
                  </h2>
                  {/* <p className="text-sm text-gray-400">
                    Showing {filteredProducts?.length} of {totalProducts} products
                  </p> */}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Data</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {allCategorydata?.data.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, ID , SKU , Stock , brand, ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-gray-700/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={addProdcut}
                  className="flex items-center cursor-pointer space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={()=>reFreshData()}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${spin?'animate-spin':''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div
          className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-700/30 shadow-2xl overflow-hidden animate-slideUp"
          style={{ animationDelay: "0.8s" }}
        >
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
              <span className="text-blue-100 text-sm">{filteredProducts?.length} items</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/30 max-h-96 lg:max-h-none overflow-y-auto">
            {filteredProducts?.slice(0,20)?.sort((a,b)=>a?.productStock-b?.productStock)?.map((product, index) => (
              <div
                key={index}
                className="group px-4 sm:px-6 py-4 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={product?.images[0]}
                        alt={product?.productName}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-gray-600/50 group-hover:border-blue-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm mb-1">
                        {product?.productName}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">{product?.sku}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-400 font-medium"> sales</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-blue-400 font-medium">
                          ID: #{product?._id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 group-hover:bg-blue-500/30 transition-all duration-300">
                      {product?.category[0]?.name}
                    </span>
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {product?.subCategory[0]?.name}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 border border-gray-600/50 group-hover:from-gray-600 group-hover:to-gray-500 transition-all duration-300">
                      {product?.brand}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="space-y-1">
                      <span className="text-xs text-blue-500 block">{product?.discount}%</span>
                      <span className="font-bold text-lg text-emerald-400 block">
                        {product?.price}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(
                          product?.productStock
                        )} text-white shadow-md`}
                      >
                        {product?.productStock}
                      </span>
                      <p className="text-xs text-gray-400">
                        {getStatusText(product?.productStock)}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(product?.ratings)}
                    </div>
                    <p className="text-xs text-gray-400">{product?.ratings}.0</p>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(product)}
                        className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/25"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-emerald-500/25"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product?._id)}
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
                        src={product?.images[0]}
                        alt={product?.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-gray-600/50 group-hover:border-blue-500/50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base mb-1">
                            {product?.productName}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">{product?.brand}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {product?.category[0]?.name}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {product?.subCategory[0]?.name}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-600/50 text-gray-300">
                              {product?.sku}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="col-span-2">
                              <div className="space-y-1">
                                <span className="text-xs text-blue-500 block">
                                  {product?.discount}%
                                </span>
                                <span className="font-bold text-lg text-emerald-400 block">
                                  {product?.price}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="flex items-center space-x-1 mb-1">
                                  {renderStars(product?.ratings)}
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor(
                                    product?.productStock
                                  )} text-white`}
                                >
                                  {product?.productStock} left
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/30">
                        <div className="flex items-center space-x-1 text-green-700">
                          <span className="text-xs font-medium">Stock</span>
                          <span className="text-xs font-medium">{product?.productStock}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(product)}
                            className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product?._id)}
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
          {filteredProducts?.length === 0 && (
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
        {/* <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 animate-fadeInUp"
          style={{ animationDelay: "1s" }}
        >
          {[
            {
              title: "Server Uptime",
              value: "98.5%",
              icon: Zap,
              color: "from-green-500 to-emerald-500",
              status: "Live",
            },
            {
              title: "Active Visitors",
              value: "1,432",
              icon: Globe,
              color: "from-blue-500 to-indigo-500",
              status: "+12%",
            },
            {
              title: "Avg. Rating",
              value: "4.8",
              icon: Star,
              color: "from-purple-500 to-pink-500",
              status: "Excellent",
            },
            {
              title: "Revenue Today",
              value: "৳12,450",
              icon: DollarSign,
              color: "from-amber-500 to-orange-500",
              status: "+8%",
            },
          ].map((metric, index) => (
            <div
              key={metric.title}
              className={`bg-gradient-to-br ${metric.color} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden animate-slideUp`}
              style={{ animationDelay: `${1000 + index * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className="w-6 h-6" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">
                    {metric.status}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{metric.value}</p>
                <p className="text-sm opacity-90">{metric.title}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Footer */}
        {/* <div className="mt-12 text-center animate-fadeInUp" style={{ animationDelay: "1.2s" }}>
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <Activity className="w-4 h-4" />
            <span>
              Showing {filteredProducts?.length} of {totalProducts} products
            </span>
            <span>•</span>
            <span>Last updated: {currentTime.toLocaleString("en-BD")}</span>
          </div>
        </div> */}
      </div>
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
      clg
      {/* Edit Modal */}
      {editModal && (
        (
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
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editModal?.productName}
                      onChange={(e) => updateEditField("productName", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">SKU</label>
                    <input
                      type="text"
                      value={editModal?.sku}
                      onChange={(e) => updateEditField("sku", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Brand</label>
                    <input
                      type="text"
                      value={editModal?.brand}
                      onChange={(e) => updateEditField("brand", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      value={editModal?.price}
                      onChange={(e) => updateEditField("price", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={editModal?.discount}
                      onChange={(e) => updateEditField("discount", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Stock</label>
                    <input
                      type="number"
                      value={editModal?.productStock}
                      onChange={(e) => updateEditField("productStock", Number(e.target.value))}
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
                      onChange={(e) => updateEditField("ratings", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Product Size
                    </label>
                    <input
                      type="text"
                      value={editModal?.productSize?.join(", ") || ""}
                      onChange={(e) =>
                        updateEditField(
                          "productSize",
                          e.target.value.split(",").map((s) => s.trim())
                        )
                      }
                      placeholder="M, L, XL"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Product Color
                    </label>
                    <input
                      type="text"
                      value={editModal?.color?.join(", ") || ""}
                      onChange={(e) =>
                        updateEditField(
                          "color",
                          e.target.value.split(",").map((c) => c.trim())
                        )
                      }
                      placeholder="Black, Brown, Red"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Product Rank
                    </label>
                    <input
                      type="number"
                      value={editModal?.productRank || ""}
                      onChange={(e) => updateEditField("productRank", Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={editModal?.description}
                      onChange={(e) => updateEditField("description", e.target.value)}
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
        ))}
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
          0%,
          100% {
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
          0%,
          100% {
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
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

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

        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        .hover-glow:hover {
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15), 0 10px 20px rgba(139, 92, 246, 0.1);
        }

        @media (hover: none) and (pointer: coarse) {
          .group:active {
            transform: scale(0.98);
          }

          .transform:active {
            transform: scale(0.95);
          }
        }

        .dark-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(139, 92, 246, 0.05);
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1);
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
