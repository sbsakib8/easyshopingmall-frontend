import { Target } from "lucide-react";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "./Charts";

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];

const MyAnalyticsCharts = ({ dsLoading, trendData, pipelineData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profit Trend Chart */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              Earnings Trend
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Sales + Referral Profit
          </div>
        </div>

        {dsLoading ? (
          <>
            <div className="h-[350px] w-full animate-pulse">
              <div className="w-full h-full bg-gray-50 rounded-xl p-4">
                <div className="relative h-full w-full">
                  <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-3 w-10 bg-gray-200 rounded"
                      />
                    ))}
                  </div>
                  <div className="absolute left-12 right-0 top-1/2 bottom-6">
                    <svg
                      className="w-full h-1/2"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0 70 Q 50 40, 100 60 T 200 30 T 300 50 T 400 25 T 500 45 T 600 35 T 700 55"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="6 6"
                      />
                    </svg>
                  </div>
                  <div className="absolute left-12 right-0 -bottom-6 flex justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <div
                        key={i}
                        className="h-3 w-6 bg-gray-200 rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient
                    id="colorValue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#14b8a6"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="#14b8a6"
                      stopOpacity={0}
                    />
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
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value) => [
                    `৳${value.toLocaleString()}`,
                    "Total Earned",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
            Status Mix
          </h3>
        </div>

        {dsLoading ? (
          <>
            <div className="h-[250px] w-full animate-pulse flex items-center justify-center">
              <div className="relative w-[180px] h-[180px] rounded-full">
                <div className="absolute inset-0 rounded-full border-[20px] border-slate-200 border-t-transparent border-r-transparent rotate-45" />
                <div className="absolute inset-0 rounded-full border-[20px] border-slate-300 border-b-transparent border-l-transparent -rotate-12" />
                <div className="absolute inset-0 rounded-full border-[20px] border-slate-100 border-t-transparent border-l-transparent rotate-12" />
                <div className="absolute inset-[45px] bg-white rounded-full" />
              </div>
            </div>
          </>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {dsLoading ? (
          <>
            <div className="grid grid-cols-2 gap-4 mt-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div
                    className={`h-3 bg-slate-200 rounded ${
                      idx % 2 === 0 ? "w-20" : "w-14"
                    }`}
                  />
                  <div className="h-3 w-5 bg-slate-200 rounded ml-auto" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pipelineData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-xs font-bold text-gray-600">
                  {item.name}
                </span>
                <span className="text-xs font-black text-gray-400 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnalyticsCharts;
