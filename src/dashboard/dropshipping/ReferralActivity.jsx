"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import { OrderAllAdminGet } from "@/src/utlis/useOrder";

export default function ReferralActivity() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderAllAdminGet();
      const allOrders = res.orders || res.data || [];

      // Filter orders that were referred (Customer has a referrer)
      const referralOrders = allOrders.filter(
        (order) => order.userId?.referredBy,
      );
      setOrders(referralOrders);
      setError(null);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load referred customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group by Referred User (Customer)
  const referredUsersData = React.useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const customer = order.userId;
      if (!customer) return;

      if (!map.has(customer._id)) {
        map.set(customer._id, {
          customer: customer,
          referrer: customer.referredBy, // This is now populated by the backend
          totalSpent: 0,
          ordersCount: 0,
          completedCount: 0,
          joinDate: customer.createdAt,
          lastOrderDate: order.createdAt,
        });
      }

      const stats = map.get(customer._id);
      stats.totalSpent += order.totalAmt || 0;
      stats.ordersCount += 1;
      if (
        order.order_status === "delivered" ||
        order.order_status === "completed"
      ) {
        stats.completedCount += 1;
      }
      if (new Date(order.createdAt) > new Date(stats.lastOrderDate)) {
        stats.lastOrderDate = order.createdAt;
      }
    });

    // Filter: Register using referral code (implicit in map) AND complete at least one order
    return Array.from(map.values())
      .filter(
        (item) =>
          item.completedCount > 0 &&
          item.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(referredUsersData.length / itemsPerPage);
  const paginatedData = referredUsersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8 text-accent-content">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Referred Customers
                </h1>
                <p className="text-gray-400 mt-1">
                  Users registered via referral with at least one completed
                  purchase
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-2xl border border-gray-700 flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Active Referrals
                </p>
                <p className="text-2xl font-black text-white">
                  {referredUsersData.length}
                </p>
              </div>
              <button
                onClick={fetchOrders}
                className="p-2 hover:bg-gray-700 rounded-xl transition-all"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-32 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-gray-400 font-medium animate-pulse">
                Analyzing referral network...
              </p>
            </div>
          ) : referredUsersData.length > 0 ? (
            <div className="overflow-hidden">
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-gray-800">
                      <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">
                        Customer Information
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">
                        Referrer
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest text-center">
                        Orders
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">
                        Total Spent
                      </th>
                      <th className="px-8 py-5 text-xs font-black text-gray-500 uppercase tracking-widest">
                        Last Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {paginatedData.map((data) => (
                      <tr
                        key={data.customer._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg border border-emerald-500/20 shadow-inner">
                                {data.customer.name?.[0] || "U"}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {data.customer.name}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">
                                {data.customer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-300">
                              {data.referrer?.name || "System"}
                            </span>
                            <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-md w-fit mt-1">
                              Code: {data.referrer?.referralCode}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-lg font-black text-white">
                              {data.completedCount}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                              Delivered
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-emerald-400">
                              ৳{data.totalSpent.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">
                              LTV
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-300">
                              {new Date(
                                data.lastOrderDate,
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-gray-500 italic">
                              Latest Order
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Visible only on mobile */}
              <div className="md:hidden space-y-4">
                {paginatedData.map((data) => (
                  <div
                    key={data.customer._id}
                    className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      {/* Customer Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl border border-emerald-500/30 shadow-inner">
                            {data.customer.name?.[0] || "U"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        <div>
                          <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {data.customer.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {data.customer.email}
                          </p>
                        </div>
                      </div>

                      {/* Total Spent */}
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-400">
                          ৳{data.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          LTV
                        </p>
                      </div>
                    </div>

                    {/* Referrer */}
                    <div className="mt-5 pt-5 border-t border-gray-800 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          REFERRED BY
                        </p>
                        <p className="font-semibold text-gray-300">
                          {data.referrer?.name || "System"}
                        </p>
                        {data.referrer?.referralCode && (
                          <p className="text-[10px] text-gray-500 bg-gray-800 inline-block px-2.5 py-0.5 rounded-md mt-1">
                            Code: {data.referrer.referralCode}
                          </p>
                        )}
                      </div>

                      {/* Orders */}
                      <div className="text-center">
                        <p className="text-2xl font-black text-white">
                          {data.completedCount}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                          Delivered
                        </p>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="mt-4 text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(data.lastOrderDate).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-500 italic">
                        Latest Order
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border border-gray-700/50">
                <Users className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300">
                No customers found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any customers who registered via referral and
                have a completed order.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-800/20 p-6 rounded-3xl border border-gray-700/30">
            <p className="text-sm text-gray-500 font-medium">
              Showing{" "}
              <span className="text-white font-bold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-white font-bold">
                {Math.min(currentPage * itemsPerPage, referredUsersData.length)}
              </span>{" "}
              of{" "}
              <span className="text-white font-bold">
                {referredUsersData.length}
              </span>{" "}
              customers
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-700"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1),
                  )
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page !== array[index - 1] + 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="text-gray-600 self-end mb-3">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-12 h-12 rounded-2xl font-black transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 scale-110 border-0"
                              : "bg-gray-800 text-gray-500 hover:bg-gray-700 border border-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-700"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
