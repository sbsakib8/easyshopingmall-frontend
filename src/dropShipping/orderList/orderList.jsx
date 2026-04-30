"use client"
import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Package, Calendar, User, Phone, TrendingUp, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMyOrders } from '@/src/utlis/useMyOrders';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    canceled: "bg-rose-100 text-rose-700 border-rose-200"
  };

  const displayStatus = status || "pending";

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyles[displayStatus] || "bg-gray-100 text-gray-600"}`}>
      {displayStatus}
    </span>
  );
};

const OrderList = () => {
  const { orders = [], loading, error } = useMyOrders();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Changed from 100 to 10 for better UX

  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      const matchesFilter = filter === "all" || order.order_status === filter;
      const customerName = order.address?.customer_name || "Unknown";
      const customerNumber = order.address?.mobile || "N/A";
      const orderIdStr = order.orderId || "";
      
      const searchTerms = searchQuery.toLowerCase();
      const matchesSearch = 
        customerName.toLowerCase().includes(searchTerms) ||
        orderIdStr.toLowerCase().includes(searchTerms) ||
        customerNumber.includes(searchTerms) ||
        order.products?.some(p => p.name?.toLowerCase().includes(searchTerms));

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const filterOptions = ["all", "pending", "processing", "delivered", "canceled"];

  return (
    <div className="min-h-screen bg-bg p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-color rounded-xl flex items-center justify-center shadow-sm">
              <Package className="text-black w-6 h-6" />
            </div>
            My Orders
          </h1>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${filter === option
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black w-5 h-5 transition-colors" />
          <input
            type="text"
            placeholder="Search by customer name, order ID, or product..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black shadow-sm transition-all text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-primary-color animate-spin" />
            <p className="text-slate-400 font-bold text-sm animate-pulse">Loading your orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map(order => {
                const firstProduct = order.products?.[0];
                const totalProfit = (order.products || []).reduce((sum, p) => sum + ((p.sellingPrice - p.price) * (p.quantity || 1)), 0);
                const totalSellPrice = (order.products || []).reduce((sum, p) => sum + (p.sellingPrice * (p.quantity || 1)), 0);
                const totalCost = (order.products || []).reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
                const orderIdDisplay = order.orderId?.slice(-8).toUpperCase() || "N/A";

                return (
                  <div key={order._id} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      <div className="flex items-center gap-5 w-full lg:w-2/5">
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                            <img
                              src={firstProduct?.image?.[0] || firstProduct?.images?.[0] || "/images/placeholder.jpg"}
                              alt={firstProduct?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -left-2">
                            <StatusBadge status={order.order_status} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">#{orderIdDisplay}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "No Date"}
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 truncate mb-2">
                            {firstProduct?.name || "No Product"} {order.products?.length > 1 && <span className="text-primary-color">+ {order.products.length - 1}</span>}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                              <User className="w-3 h-3" />
                              <span className="truncate">{order.address?.customer_name || "Unknown Customer"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                              <Phone className="w-3 h-3" />
                              <span>{order.address?.mobile || "No Phone"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:flex flex-1 justify-center">
                        <Link href={`/order-details/${order._id}`} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-50 bg-slate-50 text-slate-900 text-xs font-black hover:bg-black hover:text-white hover:border-black transition-all">
                          Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="w-full lg:w-1/3 flex justify-between lg:justify-end items-center gap-6 lg:text-right border-t border-slate-50 lg:border-t-0 pt-4 lg:pt-0">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Cost</p>
                          <p className="text-xs font-bold text-slate-600">৳ {totalCost.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Sell</p>
                          <p className="text-xs font-bold text-slate-900">৳ {totalSellPrice.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-black">Profit</p>
                          <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="text-sm font-black text-emerald-700">৳ {totalProfit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/order-details/${order._id}`} className="lg:hidden w-full py-4 rounded-2xl bg-black text-white font-black flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2">
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="text-slate-200 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No orders found</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">We couldn't find any orders matching your search or filters. Try adjusting them!</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-black transition-all"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>

            <div className="flex items-center gap-2">
              {getPageNumbers().map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-11 h-11 rounded-xl text-sm font-black transition-all border ${currentPage === num
                    ? "bg-black text-white border-black shadow-xl scale-110"
                    : "bg-white text-slate-400 border-slate-200 hover:border-black hover:text-black"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-black transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
