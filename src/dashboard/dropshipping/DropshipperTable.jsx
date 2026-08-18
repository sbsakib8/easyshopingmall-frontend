"use client";

import { cn } from "@/src/utlis/utils";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import BalanceAdjustModal from "./BalanceAdjustModal";
import React from "react";

function EmptyState({
  icon: Icon = Users,
  title = "No Data Available",
  description = "There is no data to display at the moment.",
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-900/50 border border-gray-800 rounded-3xl ${className}`}
    >
      <div className="size-20 mx-auto bg-gray-800 rounded-3xl flex items-center justify-center mb-6 border border-gray-700">
        <Icon className="size-10 text-gray-500" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
        <p className="text-gray-500 max-w-sm">{description}</p>
      </div>
    </div>
  );
}

export default function DropshipperTable({
  loading,
  filteredDropshippers,
  paginatedDropshippers,
  totalPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  expandedDropshipper,
  setExpandedDropshipper,
}) {
  const [balanceModalDS, setBalanceModalDS] = useState(null);

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-900/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Partner Performance
            </h3>
            <p className="text-xs text-gray-500">
              Ranking of {filteredDropshippers.length ?? 0} registered
              dropshipping partners
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="py-6 border-b flex flex-wrap lg:flex-nowrap gap-4">
          <div className="relative flex-1 w-full max-w-md min-w-[170px] lg:min-w-[270px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or shop name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setExpandedDropshipper(null);
              }}
              className="w-full pl-12 bg-gray-950 border border-gray-700 focus:border-indigo-500 rounded-2xl py-3.5 text-sm text-slate-300 placeholder:text-slate-300 focus:outline-none transition-colors overflow-hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
                setExpandedDropshipper(null);
              }}
              className="bg-gray-950 border text-slate-300 border-gray-700 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="new">New (Last 30 days)</option>
              <option value="old">Older</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left">
          {!loading && filteredDropshippers.length > 0 && (
            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md z-20">
              <tr className="border-b border-gray-800">
                {[
                  {
                    label: "Partner Detail",
                    className: "px-8 text-left",
                  },
                  {
                    label: "Orders",
                    className: "px-4 text-center",
                  },
                  {
                    label: "Revenue",
                    className: "px-4 text-right",
                  },
                  {
                    label: "Total Profit",
                    className: "px-4 text-right",
                  },
                  {
                    label: "Balance",
                    className: "px-4 text-right",
                  },
                  {
                    label: "Referrals",
                    className: "px-8 text-center",
                  },
                ].map((header, index) => (
                  <th
                    key={index}
                    className={cn(
                      "py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]",
                      header.className,
                    )}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="animate-pulse border-b border-gray-800"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-700" />
                      <div className="whitespace-nowrap">
                        <div className="h-4 w-40 bg-slate-700 rounded mb-1.5" />
                        <div className="h-3 w-28 bg-slate-700 rounded" />
                      </div>
                      <div className="ml-auto w-4 h-4 bg-slate-700 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <div className="h-5 w-12 bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-700 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <div className="h-5 w-24 bg-slate-700 rounded ml-auto" />
                  </td>
                  <td className="px-4 py-6 text-right">
                    <div className="flex flex-col gap-1 items-end">
                      <div className="h-5 w-28 bg-slate-700 rounded" />
                      <div className="h-3 w-20 bg-slate-700 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <div className="h-5 w-24 bg-slate-700 rounded ml-auto" />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-700" />
                  </td>
                </tr>
              ))
            ) : filteredDropshippers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12">
                  <EmptyState
                    icon={Users}
                    title="No Partners Found"
                    description="No dropshipping partners match your search or filter criteria."
                  />
                </td>
              </tr>
            ) : (
              paginatedDropshippers.map((ds) => (
                <React.Fragment key={ds._id}>
                  <tr
                    className={`group cursor-pointer transition-all hover:bg-gray-800/20 ${expandedDropshipper === ds._id ? "bg-indigo-500/5" : ""}`}
                    onClick={() =>
                      setExpandedDropshipper(
                        expandedDropshipper === ds._id ? null : ds._id,
                      )
                    }
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 shadow-lg">
                          {ds.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="whitespace-nowrap">
                          <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">
                            {ds.name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5">
                            {ds.shopName}
                          </p>
                        </div>
                        {ds.referredUsers?.length > 0 && (
                          <ChevronRight
                            className={`w-4 h-4 text-gray-700 ml-auto transition-transform ${expandedDropshipper === ds._id ? "rotate-90 text-indigo-400" : ""}`}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white">
                          {ds.totalOrders}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase">
                          {ds.completedOrders} won
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-right">
                      <span className="text-sm font-black text-emerald-400">
                        ৳{ds.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-right">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-blue-400">
                          ৳{ds.profitPaid.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-purple-400/70 tracking-tighter">
                          ৳{ds.referralPaid.toLocaleString()} bonus
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-black text-amber-400">
                          ৳{ds.balance.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBalanceModalDS(ds);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                          title="Adjust Balance"
                        >
                          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-950 border border-gray-800 text-[10px] font-black text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                        {ds.referredUsers?.length || 0}
                      </span>
                    </td>
                  </tr>

                  {expandedDropshipper === ds._id && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-10 py-6 bg-gray-950/50 border-y border-indigo-500/10"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Award className="w-4 h-4 text-indigo-400" />
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                              Network Intelligence — {ds.name}'s Fleet
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {ds.referredUsers.map((ref, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center justify-between group/ref"
                              >
                                <div>
                                  <p className="text-xs font-black text-white">
                                    {ref.name}
                                  </p>
                                  <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">
                                    Orders: {ref.orderCount}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-purple-400">
                                    ৳{ref.bonusEarned.toLocaleString()}
                                  </p>
                                  <div
                                    className={`mt-1 h-1.5 w-8 rounded-full ml-auto ${ref.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gray-800"}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredDropshippers.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-end sm:justify-between px-4 py-3 border-t border-primary/20 bg-primary/5 text-sm">
          <div className="text-slate-200 text-xs hidden sm:block">
            Showing{" "}
            <span className="text-primary font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            –{" "}
            <span className="text-primary font-semibold">
              {Math.min(
                currentPage * itemsPerPage,
                filteredDropshippers.length,
              )}
            </span>{" "}
            of{" "}
            <span className="text-primary font-semibold">
              {filteredDropshippers.length}
            </span>{" "}
            partners
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-primary/25 bg-primary/10 text-slate-200 hover:bg-primary/25 hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="px-3 py-1 rounded-lg border border-primary/25 bg-primary/10 text-[11px] font-semibold text-slate-200 tabular-nums min-w-[52px] text-center">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-primary/25 bg-primary/10 text-slate-200 hover:bg-primary/25 hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Balance Adjust Modal */}
      <BalanceAdjustModal
        open={!!balanceModalDS}
        onClose={() => setBalanceModalDS(null)}
        user={balanceModalDS}
        onSuccess={() => setBalanceModalDS(null)}
      />
    </div>
  );
}
