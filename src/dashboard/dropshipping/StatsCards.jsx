"use client";

import { Loader2 } from "lucide-react";
import React from "react";

export default function StatsCards({ kpiCards, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      {kpiCards.map((card, idx) => (
        <div
          key={idx}
          className="relative group overflow-hidden bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-4 md:p-6 transition-all hover:bg-gray-900/80 hover:scale-[1.02] hover:border-indigo-500/30"
        >
          <div
            className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${card.bg.replace("/10", "")} blur-2xl group-hover:scale-150 transition-transform duration-700`}
          />
          <div className="relative z-10 flex flex-col gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center shadow-inner`}
            >
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] mb-1">
                {card.label}
              </p>
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-blue-400" />
                </>
              ) : (
                <h3
                  className={`text-2xl font-black tracking-tight ${card.color}`}
                >
                  {card.isCurrency === false ? "" : "৳"}
                  {card.value.toLocaleString()}
                </h3>
              )}
              {card.subtitle && (
                <p className="text-[10px] text-gray-600 mt-1.5 font-bold uppercase tracking-tighter">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
