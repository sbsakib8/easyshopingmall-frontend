"use client";

import { Award, DollarSign, RefreshCw } from "lucide-react";
import React from "react";

function EmptyState({
  icon: Icon = Award,
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

export default function ActivityFeed({ loading, recentActivity }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Global Payout Stream
              </h3>
              <p className="text-xs text-gray-500">
                Live feed of system distributions
              </p>
            </div>
          </div>

          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-800 px-4 py-2 rounded-xl w-max ml-15 sm:ml-0">
            Real-time Audit
          </div>
        </div>

        {!loading && recentActivity.length === 0 && (
          <EmptyState
            icon={Award}
            title="No Recent Activity"
            description="There are no recent profit or referral events to display."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-gray-950/50 border border-gray-800/50 rounded-3xl animate-pulse"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-700 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-3 w-28 bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-700 rounded" />
                    </div>
                    <div className="h-5 w-32 bg-slate-700 rounded mt-2" />
                    <div className="h-3 w-40 bg-slate-700 rounded mt-3" />
                  </div>
                </div>
              ))
            : recentActivity.slice(0, 12).map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-gray-950/50 border border-gray-800/50 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      event.type === "profit"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-purple-500/10 text-purple-400"
                    }`}
                  >
                    {event.type === "profit" ? (
                      <DollarSign className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        Order #{event.orderId?.slice(-6).toUpperCase()}
                      </p>
                      <span className="text-[9px] font-bold text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-black text-white mt-0.5 truncate">
                      ৳{event.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase leading-none">
                      To: {event.dropshipper}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
