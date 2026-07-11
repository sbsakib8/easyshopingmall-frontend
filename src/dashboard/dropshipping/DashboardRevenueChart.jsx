"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "./Charts";

const DashboardRevenueChart = ({ transactions = [], loading }) => {
  const chartData = useMemo(() => {
    const groups = transactions.reduce((acc, tx) => {
      if (tx.status === "lost") return acc;
      const date = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = 0;
      acc[date] += tx.amount || 0;
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value,
        rawDate: new Date(name + ", " + new Date().getFullYear()),
      }))
      .sort((a, b) => a.rawDate - b.rawDate)
      .map(({ name, value }) => ({ name, value }));
  }, [transactions]);

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
              Revenue Trend
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold">
              Last 30 days
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Total
          </p>
          <p className="text-sm font-black text-emerald-600">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[200px] w-full animate-pulse bg-gray-50 rounded-xl" />
      ) : chartData.length === 0 ? (
        <div className="h-[200px] w-full flex items-center justify-center text-gray-400 text-sm font-semibold">
          No revenue data yet
        </div>
      ) : (
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="dashRevenueGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                dy={8}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  `৳${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dashRevenueGrad)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardRevenueChart;
