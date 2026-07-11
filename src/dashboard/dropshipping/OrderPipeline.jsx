"use client";

import { useMemo } from "react";
import { GitBranch } from "lucide-react";

const STAGES = [
  { key: "pending", label: "Pending", color: "bg-amber-400", textColor: "text-amber-700" },
  { key: "processing", label: "Processing", color: "bg-blue-500", textColor: "text-blue-700" },
  { key: "shipped", label: "Shipped", color: "bg-indigo-500", textColor: "text-indigo-700" },
  { key: "delivered", label: "Delivered", color: "bg-emerald-500", textColor: "text-emerald-700" },
];

const OrderPipeline = ({ orderPipeline = {}, loading }) => {
  const { stages, total } = useMemo(() => {
    const counts = STAGES.map((s) => ({
      ...s,
      count: orderPipeline[s.key] || 0,
    }));
    const t = counts.reduce((sum, s) => sum + s.count, 0);
    return { stages: counts, total: t };
  }, [orderPipeline]);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <GitBranch className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
            Order Pipeline
          </h3>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase">
          {total} total
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="flex-1 h-4 bg-gray-100 rounded-full" />
              <div className="h-3 w-6 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm font-semibold">
          No orders yet
        </div>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const pct = total > 0 ? (stage.count / total) * 100 : 0;
            return (
              <div key={stage.key} className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider w-20 text-right ${stage.textColor}`}
                >
                  {stage.label}
                </span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-gray-600 w-8 text-right">
                  {stage.count}
                </span>
                {/* Arrow between stages */}
                {idx < stages.length - 1 && stage.count > 0 && (
                  <span className="absolute -right-2 text-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Visual connector dots */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          {stages.map((stage, idx) => (
            <div key={stage.key} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  stage.count > 0 ? stage.color : "bg-gray-200"
                }`}
              />
              {idx < stages.length - 1 && (
                <div
                  className={`w-6 h-0.5 ${
                    stage.count > 0 && stages[idx + 1]?.count > 0
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPipeline;
