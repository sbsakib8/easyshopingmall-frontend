"use client"
import React, { useState, useMemo } from 'react';
import {
  Search, ChevronRight, Package, Calendar, User, Phone,
  TrendingUp, Loader2, Home, ShoppingBag, Clock, CheckCircle2,
  XCircle, Truck, BarChart3, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useMyOrders } from '@/src/utlis/useMyOrders';

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:    { cls: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Clock className="w-3 h-3" /> },
    processing: { cls: "bg-blue-50 text-blue-700 border-blue-200",         icon: <Truck className="w-3 h-3" /> },
    shipped:    { cls: "bg-indigo-50 text-indigo-700 border-indigo-200",   icon: <Truck className="w-3 h-3" /> },
    delivered:  { cls: "bg-emerald-50 text-emerald-700 border-emerald-200",icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled:  { cls: "bg-rose-50 text-rose-700 border-rose-200",         icon: <XCircle className="w-3 h-3" /> },
    completed:  { cls: "bg-teal-50 text-teal-700 border-teal-200",         icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const s = status?.toLowerCase() || "pending";
  const cfg = map[s] || { cls: "bg-gray-100 text-gray-600 border-gray-200", icon: <Clock className="w-3 h-3" /> };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${cfg.cls}`}>
      {cfg.icon} {s}
    </span>
  );
};

/* ── Stat card ── */
const StatCard = ({ label, value, sub, accent }) => (
  <div className={`bg-white rounded-2xl p-4 border shadow-sm flex flex-col gap-1 ${accent ? 'border-emerald-100' : 'border-slate-100'}`}>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className={`text-xl font-black ${accent ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</p>
    {sub && <p className="text-[11px] text-slate-400 font-medium">{sub}</p>}
  </div>
);

const OrderList = () => {
  const { orders = [], loading, error } = useMyOrders();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(o => o.order_status === "delivered").length;
    const pending = orders.filter(o => o.order_status === "pending").length;
    const totalProfit = orders
      .filter(o => o.order_status === "delivered")
      .reduce((sum, o) =>
        sum + (o.products || []).reduce((s, p) =>
          s + ((Number(p.sellingPrice || 0) - Number(p.costPrice || p.price || 0)) * (p.quantity || 1)), 0
        ), 0);
    return { total, delivered, pending, totalProfit };
  }, [orders]);

  /* ── Filter + search ── */
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      const matchesFilter = filter === "all" || order.order_status === filter;

      // Backend stores address as `address` field
      const addr = order.address || {};
      const customerName = addr.customer_name || "Unknown";
      const customerMobile = String(addr.mobile || "");
      const orderIdStr = order.orderId || order._id || "";
      const searchTerms = searchQuery.toLowerCase();
      const matchesSearch =
        customerName.toLowerCase().includes(searchTerms) ||
        orderIdStr.toLowerCase().includes(searchTerms) ||
        customerMobile.includes(searchTerms) ||
        (order.products || []).some(p =>
          (p.name || "").toLowerCase().includes(searchTerms)
        );

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  const handleFilterChange = (f) => { setFilter(f); setCurrentPage(1); };
  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const filterOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "completed"];

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-emerald-600 font-bold">My Orders</span>
        </nav>

        {/* ── Page header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
              <p className="text-xs text-slate-400 font-medium">{orders.length} total orders found</p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                  filter === option
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Orders" value={stats.total} sub="all time" />
          <StatCard label="Delivered" value={stats.delivered} sub="completed" />
          <StatCard label="Pending" value={stats.pending} sub="awaiting" />
          <StatCard label="Total Profit" value={`৳${stats.totalProfit.toLocaleString()}`} sub="from delivered" accent />
        </div>

        {/* ── Search ── */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 w-4 h-4 transition-colors" />
          <input
            type="text"
            placeholder="Search by customer name, order ID, phone or product…"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 shadow-sm transition-all text-sm font-medium placeholder-slate-400"
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-slate-400 font-bold text-sm animate-pulse">Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-10 text-center">
            <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <p className="text-rose-600 font-bold">Failed to load orders. Please refresh and try again.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentOrders.length > 0 ? (
              currentOrders.map(order => {
                // Backend always stores address as `address`
                const addr = order.address || {};
                const firstProduct = order.products?.[0];
                const productImg = firstProduct?.image?.[0] || firstProduct?.images?.[0] || "/images/placeholder.jpg";

                // Profit: DS orders have sellingPrice; regular orders just have price
                const totalCost = (order.products || []).reduce((s, p) =>
                  s + (Number(p.costPrice || p.price || 0) * (p.quantity || 1)), 0);
                const totalSell = (order.products || []).reduce((s, p) =>
                  s + (Number(p.sellingPrice || p.price || 0) * (p.quantity || 1)), 0);
                const totalProfit = totalSell - totalCost;
                const isDS = order.products?.some(p => p.sellingPrice > 0 && p.sellingPrice !== p.price);

                const orderIdDisplay = (order.orderId || order._id || "").slice(-8).toUpperCase();
                const dateStr = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-slate-100 rounded-[1.75rem] p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">

                      {/* Product thumbnail + info */}
                      <div className="flex items-center gap-4 w-full lg:w-5/12">
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                            <img
                              src={productImg}
                              alt={firstProduct?.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -left-2">
                            <StatusBadge status={order.order_status} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-tight">#{orderIdDisplay}</span>
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                              <Calendar className="w-3 h-3" /> {dateStr}
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 truncate text-sm">
                            {firstProduct?.name || "No Product"}
                            {(order.products?.length || 0) > 1 && (
                              <span className="text-emerald-500 ml-1">+{order.products.length - 1}</span>
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                              <User className="w-3 h-3" />
                              {addr.customer_name || "Unknown Customer"}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                              <Phone className="w-3 h-3" />
                              {addr.mobile || "No Phone"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* View details (desktop center) */}
                      <div className="hidden lg:flex flex-1 justify-center">
                        <Link
                          href={`/order-details/${order._id}`}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-black hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Financials */}
                      <div className="w-full lg:w-auto flex justify-between lg:justify-end items-center gap-4 lg:gap-6 border-t border-slate-50 lg:border-0 pt-3 lg:pt-0">
                        <div className="text-center">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Cost</p>
                          <p className="text-xs font-bold text-slate-600">৳{totalCost.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">
                            {isDS ? "Sell" : "Total"}
                          </p>
                          <p className="text-xs font-bold text-slate-900">৳{(isDS ? totalSell : order.totalAmt || totalSell).toLocaleString()}</p>
                        </div>
                        {isDS && (
                          <div className="text-center">
                            <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-black">Profit</p>
                            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                              <span className="text-sm font-black text-emerald-700">৳{totalProfit.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View details (mobile) */}
                      <Link
                        href={`/order-details/${order._id}`}
                        className="lg:hidden w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                      >
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Package className="text-slate-200 w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">No orders found</h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
                  {searchQuery || filter !== "all"
                    ? "No orders match your filters. Try adjusting them."
                    : "You haven't placed any orders yet. Start sourcing!"}
                </p>
                {!searchQuery && filter === "all" && (
                  <Link
                    href="/all-products"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Browse Products <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-emerald-400 transition-all"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>

            <div className="flex items-center gap-1.5">
              {getPageNumbers().map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-xl text-sm font-black transition-all border ${
                    currentPage === num
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-110"
                      : "bg-white text-slate-400 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-emerald-400 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <p className="text-center text-[11px] text-slate-400 font-medium">
          Showing {currentOrders.length} of {filteredOrders.length} orders
          {filter !== "all" && ` · Filtered by "${filter}"`}
        </p>
      </div>
    </div>
  );
};

export default OrderList;
