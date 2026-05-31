"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  Package,
  Calendar,
  User,
  Phone,
  TrendingUp,
  Loader2,
  Home,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useMyOrders } from "@/src/utlis/useMyOrders";
import Container from "@/src/compronent/shared/Container";
import Image from "next/image";
import { cn } from "@/src/utlis/utils";
import BackButton from "../BackButton/BackButton";

/* ── Status badge ── */
const StatusBadge = ({ status, className = "" }) => {
  const map = {
    pending: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    processing: {
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Truck className="w-3 h-3" />,
    },
    shipped: {
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: <Truck className="w-3 h-3" />,
    },
    delivered: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    cancelled: {
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle className="w-3 h-3" />,
    },
    completed: {
      cls: "bg-teal-50 text-teal-700 border-teal-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  const s = status?.toLowerCase() || "pending";
  const cfg = map[s] || {
    cls: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <Clock className="w-3 h-3" />,
  };

  return (
    <span
      className={cn(
        `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${cfg.cls}`,
        className,
      )}
    >
      {cfg.icon} {s}
    </span>
  );
};

/* ── Stat card ── */
const StatCard = ({ label, value, sub, accent }) => (
  <div
    className={`bg-white rounded-2xl p-4 border shadow-sm flex flex-col gap-1 ${accent ? "border-emerald-100" : "border-slate-100"}`}
  >
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p
      className={`text-xl font-black ${accent ? "text-emerald-600" : "text-slate-900"}`}
    >
      {value}
    </p>
    {sub && <p className="text-[11px] text-slate-400 font-medium">{sub}</p>}
  </div>
);

/* ── Payment details helper ── */
const PaymentInfo = ({ order }) => {
  const getMethodLabel = (method) => {
    switch (method) {
      case "manual": return "Manual Pay";
      case "sslcommerz": return "Online Pay";
      case "balance": return "Wallet Balance";
      case "cod": return "COD";
      default: return method || "N/A";
    }
  };

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    submitted: "text-blue-600 bg-blue-50 border-blue-200",
    paid: "text-emerald-600 bg-emerald-50 border-emerald-200",
    failed: "text-rose-600 bg-rose-50 border-rose-200",
    refunded: "text-purple-600 bg-purple-50 border-purple-200",
  };

  const status = order.payment_status || "pending";
  const colorClass = statusColors[status] || "text-gray-600 bg-gray-50 border-gray-200";

  // Initial payment amount — what the dropshipper paid upfront
  const initialPayType = order.payment_type;
  const initialPayAmt =
    initialPayType === "delivery"
      ? order.deliveryCharge || order.amount_paid || 0
      : initialPayType === "full"
      ? order.amount_paid || order.totalAmt || 0
      : 0; // COD = 0 upfront

  return (
    <div className="flex flex-col gap-1.5 text-[11px] font-bold">
      {/* Method + status */}
      <div className="flex items-center gap-1.5">
        <span className="text-slate-700 uppercase tracking-tight text-xs">
          {getMethodLabel(order.payment_method)}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded border text-[8px] uppercase tracking-wider font-extrabold",
            colorClass
          )}
        >
          {status}
        </span>
      </div>

      {/* Initial payment label */}
      {initialPayType === "delivery" && (
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">প্রাথমিক:</span>
          <span className="text-blue-600 font-black text-[10px]">৳{initialPayAmt.toLocaleString()} ডেলিভারি</span>
        </div>
      )}
      {initialPayType === "full" && (
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">প্রাথমিক:</span>
          <span className="text-emerald-600 font-black text-[10px]">৳{initialPayAmt.toLocaleString()} ফুল</span>
        </div>
      )}
      {initialPayType === "cod" && (
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">প্রাথমিক:</span>
          <span className="text-slate-500 font-black text-[10px]">COD (৳0)</span>
        </div>
      )}

      {/* COD due */}
      {order.amount_due > 0 && (
        <p className="text-amber-600 text-[10px] font-bold">
          ৳{order.amount_due.toLocaleString()} বাকি
        </p>
      )}
    </div>
  );
};

/* ── Products list helper ── */
const ProductsList = ({ products, compact = false }) => {
  if (!products || products.length === 0) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex flex-col gap-1">
      {products.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-700 line-clamp-1 max-w-[120px]" title={p.name}>
            {p.name}
          </span>
          <span className="text-[9px] text-slate-400 font-medium flex-shrink-0">
            ×{p.quantity || 1}
          </span>
          {(p.sellingPrice || p.price) > 0 && (
            <span className="text-[9px] font-black text-emerald-600 flex-shrink-0">
              ৳{((p.sellingPrice || p.price) * (p.quantity || 1)).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};


const OrderList = () => {
  const { orders = [], loading, error } = useMyOrders();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(
      (o) => o.order_status === "delivered",
    ).length;
    const pending = orders.filter((o) => o.order_status === "pending").length;
    const totalProfit = orders
      .filter((o) => o.order_status === "delivered")
      .reduce(
        (sum, o) =>
          sum +
          (o.products || []).reduce(
            (s, p) =>
              s +
              (Number(p.sellingPrice || 0) -
                Number(p.costPrice || p.price || 0)) *
                (p.quantity || 1),
            0,
          ),
        0,
      );
    return { total, delivered, pending, totalProfit };
  }, [orders]);

  /* ── Filter + search ── */
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
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
        (order.products || []).some((p) =>
          (p.name || "").toLowerCase().includes(searchTerms),
        );

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  const handleFilterChange = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const filterOptions = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "completed",
  ];

  return (
    <section className="min-h-screen bg-slate-50 py-10 md:py-16">
      <Container className="space-y-6">
        <BackButton />

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-emerald-600 font-bold">My Orders</span>
        </nav>

        {/* ── Page header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
              <p className="text-xs text-slate-400 font-medium">
                {orders.length} total orders found
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
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
          <StatCard
            label="Total Profit"
            value={`৳${stats.totalProfit.toLocaleString()}`}
            sub="from delivered"
            accent
          />
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
            <p className="text-slate-400 font-bold text-sm animate-pulse">
              Loading your orders…
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-10 text-center">
            <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <p className="text-rose-600 font-bold">
              Failed to load orders. Please refresh and try again.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentOrders.length > 0 ? (
              <>
                {/* ====================== DESKTOP TABLE ====================== */}
                <div className="hidden md:block">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            অর্ডার
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            পণ্য সমূহ
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            গ্রাহক
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            তারিখ
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            স্ট্যাটাস
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            পেমেন্ট
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                            ক্রয় মূল্য
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                            বিক্রয় মূল্য
                          </th>
                          {currentOrders.some((o) =>
                            o.products?.some(
                              (p) =>
                                p.sellingPrice > 0 &&
                                p.sellingPrice !== p.price,
                            ),
                          ) && (
                            <th className="px-6 py-4 text-right text-xs font-bold text-emerald-600 uppercase tracking-wider">
                              লাভ
                            </th>
                          )}
                          <th className="px-6 py-4 w-28 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            বিস্তারিত
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentOrders.map((order) => {
                          const addr = order.address || {};
                          const firstProduct = order.products?.[0];
                          const productImg =
                            firstProduct?.image?.[0] ||
                            firstProduct?.images?.[0] ||
                            "/images/placeholder.jpg";

                          const totalCost = (order.products || []).reduce(
                            (s, p) =>
                              s +
                              Number(p.costPrice || p.price || 0) *
                                (p.quantity || 1),
                            0,
                          );
                          const totalSell = (order.products || []).reduce(
                            (s, p) =>
                              s +
                              Number(p.sellingPrice || p.price || 0) *
                                (p.quantity || 1),
                            0,
                          ) - (order.couponDiscount || 0);
                          const totalProfit = totalSell - totalCost;
                          const isDS = order.products?.some(
                            (p) =>
                              p.sellingPrice > 0 && p.sellingPrice !== p.price,
                          );

                          const orderIdDisplay = (
                            order.orderId ||
                            order._id ||
                            ""
                          )
                            .slice(-8)
                            .toUpperCase();
                          const dateStr = order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—";

                          return (
                            <tr
                              key={order._id}
                              className="hover:bg-slate-50 transition-colors group"
                            >
                              {/* Order ID + thumbnail */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 min-w-[140px]">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                    <Image
                                      src={productImg}
                                      alt={firstProduct?.name}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="font-mono text-xs text-slate-500">
                                    #{orderIdDisplay}
                                  </p>
                                </div>
                              </td>

                              {/* Products list with qty × selling price */}
                              <td className="px-6 py-4 min-w-[200px]">
                                <ProductsList products={order.products} />
                              </td>

                              {/* Customer */}
                              <td className="px-6 py-4">
                                <div className="space-y-1 min-w-[140px]">
                                  <p className="font-medium text-slate-800 text-sm">
                                    {addr.customer_name || "Unknown"}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {addr.mobile}
                                  </p>
                                </div>
                              </td>

                              {/* Date */}
                              <td className="px-6 py-4 text-xs text-slate-600 text-nowrap">
                                {dateStr}
                              </td>

                              {/* Status */}
                              <td className="px-6 py-4">
                                <StatusBadge status={order.order_status} />
                              </td>

                              {/* Payment */}
                              <td className="px-6 py-4 border-l border-slate-100/50">
                                <PaymentInfo order={order} />
                              </td>

                              {/* Cost */}
                              <td className="px-6 py-4 text-right font-medium text-slate-600 text-sm">
                                ৳{totalCost.toLocaleString()}
                              </td>

                              {/* Sell */}
                              <td className="px-6 py-4 text-right font-semibold text-slate-900 text-sm">
                                ৳{totalSell.toLocaleString()}
                              </td>

                              {/* Profit (DS only) */}
                              {isDS && (
                                <td className="px-6 py-4 text-right">
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl font-bold text-sm">
                                    <TrendingUp className="w-3.5 h-3.5" />৳
                                    {totalProfit.toLocaleString()}
                                  </div>
                                </td>
                              )}

                              {/* Actions */}
                              <td className="px-6 py-4 text-right">
                                <Link
                                  href={`/order-details/${order._id}`}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 transition-all text-sm font-semibold"
                                >
                                  বিস্তারিত
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ====================== MOBILE CARDS ====================== */}
                <div className="md:hidden grid grid-cols-2 gap-6">
                  {currentOrders.map((order) => {
                    const addr = order.address || {};
                    const firstProduct = order.products?.[0];
                    const productImg =
                      firstProduct?.image?.[0] ||
                      firstProduct?.images?.[0] ||
                      "/images/placeholder.jpg";

                    const totalCost = (order.products || []).reduce(
                      (s, p) =>
                        s +
                        Number(p.costPrice || p.price || 0) * (p.quantity || 1),
                      0,
                    );
                    const totalSell = (order.products || []).reduce(
                      (s, p) =>
                        s +
                        Number(p.sellingPrice || p.price || 0) *
                          (p.quantity || 1),
                      0,
                    );
                    const totalProfit = totalSell - totalCost;
                    const isDS = order.products?.some(
                      (p) => p.sellingPrice > 0 && p.sellingPrice !== p.price,
                    );

                    const orderIdDisplay = (order.orderId || order._id || "")
                      .slice(-8)
                      .toUpperCase();
                    const dateStr = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <div
                        key={order._id}
                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                      >
                        {/* Image Section with Overlays */}
                        <div className="relative">
                          <div className="aspect-[4/3] h-32 sm:h-40 w-full overflow-hidden bg-slate-100">
                            <Image
                              src={productImg}
                              alt={firstProduct?.name || ""}
                              width={300}
                              height={225}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="absolute top-3 left-0 w w-full flex items-center justify-between gap-1.5 flex-wrap p-3">
                            {/* Status Badge */}
                            <div>
                              <StatusBadge
                                status={order.order_status}
                                className="text-[10px] sm:text-xs font-medium"
                              />
                            </div>

                            {/* Order ID */}
                            <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-2xl shadow text-[10px] sm:text-xs font-mono text-slate-600">
                              #{orderIdDisplay}
                            </div>
                          </div>

                          {/* View Icon Button - Floating on Image */}
                          <Link
                            href={`/order-details/${order._id}`}
                            className="absolute bottom-3 right-3 bg-white shadow-md hover:bg-emerald-600 hover:text-white p-2 sm:p-3 rounded-2xl transition-all duration-200 active:scale-90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="size-4 sm:size-5" />
                          </Link>
                        </div>

                        {/* Content Section */}
                        <div className="p-3 sm:p-5">
                          {/* Product Name */}
                          <h3 className="font-bold text-slate-900 text-base sm:text-[17px] leading-tight line-clamp-1 mb-2">
                            {firstProduct?.name}
                            {(order.products?.length || 0) > 1 && (
                              <span className="text-emerald-500">
                                {" "}
                                +{order.products.length - 1}
                              </span>
                            )}
                          </h3>

                          {/* Products with selling prices */}
                          <div className="mb-3 space-y-1">
                            {(order.products || []).map((p, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-[10px]"
                              >
                                <span className="text-slate-600 font-medium line-clamp-1 max-w-[60%]">
                                  {p.name}
                                </span>
                                <span className="text-emerald-600 font-black">
                                  {p.quantity || 1}×৳
                                  {(
                                    p.sellingPrice ||
                                    p.price ||
                                    0
                                  ).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Customer & Date Info */}
                          <div className="space-y-2 mb-3 text-sm hidden sm:block">
                            <div className="flex items-center gap-3 text-slate-700">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="font-medium line-clamp-1">
                                {addr.customer_name || "Unknown Customer"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span>{addr.mobile || "No number"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-xs">{dateStr}</span>
                            </div>
                          </div>

                          <div className="py-2 border-t border-slate-100/80">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                              পেমেন্ট বিবরণ:
                            </p>
                            <PaymentInfo order={order} />
                          </div>

                          {/* Financial Summary */}
                          <div className="space-y-2 py-3 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                ক্রয় মূল্য:
                              </p>
                              <p className="text-sm font-semibold text-slate-700">
                                ৳{totalCost.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {isDS ? "বিক্রয় মূল্য:" : "মোট:"}
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                ৳{totalSell.toLocaleString()}
                              </p>
                            </div>
                            {isDS && (
                              <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-2 py-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                  লাভ:
                                </p>
                                <p className="text-sm font-black text-emerald-700">
                                  ৳{totalProfit.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Package className="text-slate-200 w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  No orders found
                </h3>
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:border-emerald-400 transition-all"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>

            <div className="flex items-center gap-1.5">
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-medium md:font-bold transition-all border ${
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
      </Container>
    </section>
  );
};

export default OrderList;
