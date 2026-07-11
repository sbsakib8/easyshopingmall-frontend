"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";

const MonthlyProfitSummary = ({ transactions = [], loading }) => {
  const { thisMonth, lastMonth, change } = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    let thisMonthProfit = 0;
    let lastMonthProfit = 0;

    transactions.forEach((tx) => {
      if (tx.type !== "profit" || tx.status === "lost") return;
      const txDate = new Date(tx.date);
      if (txDate >= thisMonthStart) {
        thisMonthProfit += tx.amount || 0;
      } else if (txDate >= lastMonthStart && txDate <= lastMonthEnd) {
        lastMonthProfit += tx.amount || 0;
      }
    });

    const changePercent =
      lastMonthProfit > 0
        ? Math.round(
            ((thisMonthProfit - lastMonthProfit) / lastMonthProfit) * 100,
          )
        : null;

    return {
      thisMonth: thisMonthProfit,
      lastMonth: lastMonthProfit,
      change: changePercent,
    };
  }, [transactions]);

  const isUp = change !== null && change >= 0;

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <DollarSign className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
          Monthly Profit
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-8 w-32 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* This Month */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-2">
              This Month
            </p>
            <p className="text-xl md:text-2xl font-black text-emerald-700">
              ৳{thisMonth.toLocaleString()}
            </p>
          </div>

          {/* Last Month */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 p-4 rounded-xl border border-gray-200">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
              Last Month
            </p>
            <p className="text-xl md:text-2xl font-black text-gray-700">
              ৳{lastMonth.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Change Indicator */}
      {!loading && (
        <div className="mt-4 flex items-center gap-2">
          {change !== null ? (
            <>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isUp
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(change)}%
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">
                vs last month
              </span>
            </>
          ) : (
            <span className="text-[10px] text-gray-400 font-semibold">
              No data from last month
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyProfitSummary;
