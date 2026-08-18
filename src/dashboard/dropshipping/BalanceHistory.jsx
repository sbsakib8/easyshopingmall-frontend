"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { getAllTransactions } from "@/src/hook/useBalanceTransaction";

const typeConfig = {
  manual_credit: { label: "Manual Credit", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: ArrowUpRight },
  manual_deduct: { label: "Manual Deduct", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: ArrowDownRight },
  courier_adjustment: { label: "Courier Adjust", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: ArrowDownRight },
  cod_return_deduction: { label: "COD Return", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: ArrowDownRight },
  order_payment: { label: "Order Payment", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: ArrowDownRight },
  profit: { label: "Profit", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: ArrowUpRight },
  referral_bonus: { label: "Referral Bonus", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: ArrowUpRight },
  withdrawal: { label: "Withdrawal", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", icon: ArrowDownRight },
};

const formatBDT = (amount) => {
  const abs = Math.abs(amount);
  return `${amount < 0 ? "-" : "+"}৳${abs.toLocaleString()}`;
};

const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-gray-700/40 ${className}`} />
);

export default function BalanceHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState([]);

  const fetchData = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await getAllTransactions(page, 30, search);
      if (res.success) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
        setSummary(res.data.summary || []);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const summaryStats = React.useMemo(() => {
    const stats = { totalCredit: 0, totalDeduct: 0, count: 0 };
    summary.forEach((s) => {
      if (s.totalAmount > 0) stats.totalCredit += s.totalAmount;
      else stats.totalDeduct += Math.abs(s.totalAmount);
      stats.count += s.count;
    });
    return stats;
  }, [summary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Balance History
                </h1>
                <p className="text-gray-400 mt-1">
                  All balance adjustments and transactions for dropshippers
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchData(currentPage, searchTerm)}
              className="p-2 hover:bg-gray-700 rounded-xl transition-all"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Transactions</p>
            <p className="text-2xl font-black text-white mt-1">{summaryStats.count}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Credited</p>
            <p className="text-2xl font-black text-green-400 mt-1">৳{summaryStats.totalCredit.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Deducted</p>
            <p className="text-2xl font-black text-red-400 mt-1">৳{summaryStats.totalDeduct.toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by dropshipper name or email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-black/20 border border-gray-700 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-white"
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonPulse key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-gray-800/50">
              {transactions.map((tx) => {
                const config = typeConfig[tx.type] || typeConfig.manual_deduct;
                const Icon = config.icon;
                return (
                  <div
                    key={tx._id}
                    className="px-6 py-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white">
                              {tx.userId?.name || "Unknown"}
                            </p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {tx.reason}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(tx.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {tx.performedBy && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                by {tx.performedBy.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg font-black ${tx.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {formatBDT(tx.amount)}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">
                          Balance: ৳{(tx.balanceAfter || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center gap-4 text-center">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
                <DollarSign className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300">No transactions found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No balance transactions have been recorded yet.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-800/20 p-6 rounded-3xl border border-gray-700/30">
            <p className="text-sm text-gray-500 font-medium">
              Page <span className="text-white font-bold">{pagination.currentPage}</span> of{" "}
              <span className="text-white font-bold">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={!pagination || currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-700"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                disabled={!pagination || currentPage >= pagination.totalPages}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
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
