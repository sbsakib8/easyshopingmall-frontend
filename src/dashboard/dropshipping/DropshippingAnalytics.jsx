"use client";

import Container from "@/src/compronent/shared/Container";
import { getDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";
import { cn } from "@/src/utlis/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Loader2,
  PieChartIcon,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import React, {
  Activity as ActivityComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
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
} from "recharts";

const COLORS = [
  "#6366f1",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

function EmptyState({
  icon: Icon = TrendingUp,
  title = "No Data Available",
  description = "There is no data to display at the moment.",
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-900/50 border border-gray-800 rounded-3xl",
        className,
      )}
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

export default function DropshippingAnalytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [expandedDropshipper, setExpandedDropshipper] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const fetchData = async () => {
    setLoading(true);
    let startDate, endDate;
    const now = new Date();

    if (dateRange === "today") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();
      endDate = now.toISOString();
    } else if (dateRange === "7days") {
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      endDate = new Date().toISOString();
    } else if (dateRange === "30days") {
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      endDate = new Date().toISOString();
    } else if (dateRange === "custom") {
      startDate = customDates.start
        ? new Date(customDates.start).toISOString()
        : null;
      endDate = customDates.end
        ? new Date(customDates.end).toISOString()
        : null;
    }

    try {
      const res = await getDropshippingAnalytics(startDate, endDate);

      if (!res?.success) {
        setData({});
        return;
      }

      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== "custom" || (customDates.start && customDates.end)) {
      fetchData();
    }
  }, [dateRange, customDates]);

  // Process data for trends
  const trendData = useMemo(() => {
    if (!data?.recentActivity) return [];

    const groups = data.recentActivity.reduce((acc, event) => {
      const date = new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) acc[date] = { name: date, revenue: 0, profit: 0 };
      acc[date].profit += event.amount;

      return acc;
    }, {});

    return Object.values(groups)
      .map((d) => ({
        ...d,
        rawDate: new Date(d.name + ", " + new Date().getFullYear()),
      }))
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [data?.recentActivity]);

  const pipelineData = useMemo(() => {
    if (!data?.orderPipeline) return [];

    return Object.entries(data.orderPipeline)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [data?.orderPipeline]);

  const { summary = {}, dropshippers = [], recentActivity = [] } = data;

  // Filtered & Paginated Data
  const filteredDropshippers = React.useMemo(() => {
    return dropshippers
      .filter((ds) => {
        const matchesSearch =
          !searchTerm ||
          ds.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          ds.shopName?.toLowerCase().includes(searchTerm.trim().toLowerCase());

        let matchesFilter = true;
        if (filterType === "new" || filterType === "old") {
          const joinedDate = new Date(ds.joinedAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          if (filterType === "new") {
            matchesFilter = joinedDate >= thirtyDaysAgo;
          } else {
            matchesFilter = joinedDate < thirtyDaysAgo;
          }
        }
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
  }, [dropshippers, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredDropshippers.length / itemsPerPage);
  const paginatedDropshippers = filteredDropshippers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const kpiCards = [
    {
      label: "Total Revenue",
      value: summary.totalRevenue ?? 0,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Profit Paid",
      value: summary.totalProfitPaid ?? 0,
      icon: Wallet,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Referral Paid",
      value: summary.totalReferralPaid ?? 0,
      icon: Award,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Net Income",
      value: summary.platformNetIncome ?? 0,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Pending Orders",
      value: summary.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      isCurrency: false,
    },
    {
      label: "Active Partners",
      value: summary.activeDropshippers ?? 0,
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      isCurrency: false,
      subtitle: `${summary?.totalDropshippers ?? 0} registered`,
    },
  ];

  const pipelineDataLength = pipelineData?.length ?? 0;
  const trendDataLength = trendData?.length ?? 0;

  return (
    <section className="min-h-screen bg-slate-950 py-10 md:py-16 animate-in fade-in duration-700">
      <Container className="space-y-10 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em]">
              <Activity className="w-4 h-4" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-white tracking-tight lg:whitespace-nowrap">
              Dropshipping <span className="text-indigo-500">Analytics</span>
            </h1>
            <p className="text-gray-500 md:text-base xl:text-lg max-w-2xl text-sm">
              Monitor revenue streams, partner performance, and platform growth
              in real-time.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl flex items-center self-end overflow-hidden w-max">
              {[
                { id: "today", label: "Today" },
                { id: "7days", label: "7 Days" },
                { id: "30days", label: "30 Days" },
                { id: "all", label: "All Time" },
                { id: "custom", label: "Custom" },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id)}
                  className={`flex-shrink-0 px-3 p-2 sm:px-5 sm:py-3 text-[10px] sm:text-sm font-semibold uppercase tracking-widest rounded-xl transition-all snap-center whitespace-nowrap active:scale-95 ${
                    dateRange === range.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/80"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <ActivityComponent
              mode={dateRange === "custom" ? "visible" : "hidden"}
            >
              {/* Date Range Picker */}
              <div className="flex items-center justify-end gap-3 animate-in slide-in-from-right-4 duration-300">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* Start Date */}
                  <DatePicker
                    label="Start Date"
                    value={customDates.start ? dayjs(customDates.start) : null}
                    onChange={(newValue) =>
                      setCustomDates((prev) => ({ ...prev, start: newValue }))
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": {
                            bgcolor: "#0F172A",
                            border: "none !important",
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: { xs: "10px", md: "14px" },
                            paddingRight: { xs: "4px", md: "8px" },

                            "& fieldset": {
                              borderColor: "#334155",
                            },
                            "&:hover fieldset": {
                              borderColor: "#64748B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#818CF8",
                              boxShadow: "0 0 0 2px rgba(129, 140, 248, 0.3)",
                            },
                          },

                          /* Responsive Input Field Padding */
                          "& .MuiInputBase-input": {
                            py: { xs: "0px", md: "8.5px" },
                            px: { xs: "8px", md: "14px" },
                          },

                          /* Responsive Label Formatting */
                          "& .MuiInputLabel-root": {
                            color: "#FFFFFF !important",
                            fontSize: { xs: "10px", md: "14px" },
                            transform: {
                              xs: "translate(10px, 7px) scale(1)",
                              md: "translate(14px, 9px) scale(1)",
                            },
                            "&.MuiInputLabel-shrink": {
                              transform: {
                                xs: "translate(14px, -8px) scale(0.8)",
                                md: "translate(14px, -9px) scale(0.75)",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#C7D2FE !important",
                          },

                          /* White Calendar Icon - Scaled smaller on mobile */
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#FFFFFF",
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                          },
                        },
                      },
                    }}
                  />

                  <div className="w-4 h-[2px] bg-gray-700 rounded-full flex-shrink-0" />

                  {/* End Date */}
                  <DatePicker
                    label="End Date"
                    value={customDates.end ? dayjs(customDates.end) : null}
                    onChange={(newValue) =>
                      setCustomDates((prev) => ({ ...prev, end: newValue }))
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": {
                            bgcolor: "#0F172A",
                            border: "none !important",
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: { xs: "10px", md: "14px" },
                            paddingRight: { xs: "4px", md: "8px" },

                            "& fieldset": {
                              borderColor: "#334155",
                            },
                            "&:hover fieldset": {
                              borderColor: "#64748B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#818CF8",
                              boxShadow: "0 0 0 2px rgba(129, 140, 248, 0.3)",
                            },
                          },

                          "& .MuiInputBase-input": {
                            py: { xs: "0px", md: "8.5px" },
                            px: { xs: "8px", md: "14px" },
                          },

                          "& .MuiInputLabel-root": {
                            color: "#FFFFFF !important",
                            fontSize: { xs: "10px", md: "14px" },
                            transform: {
                              xs: "translate(10px, 7px) scale(1)",
                              md: "translate(14px, 9px) scale(1)",
                            },
                            "&.MuiInputLabel-shrink": {
                              transform: {
                                xs: "translate(14px, -8px) scale(0.8)",
                                md: "translate(14px, -9px) scale(0.75)",
                              },
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#C7D2FE !important",
                          },

                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#FFFFFF",
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </ActivityComponent>
          </div>
        </div>

        {/* Section 1: KPI Grid */}
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

        {/* Section 2: Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payout Trend Chart */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-[3rem] p-8 relative overflow-hidden group space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                    Payout Trend
                  </h3>
                  <p className="text-xs text-gray-500">
                    Historical profit distribution analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-black text-gray-500 uppercase tracking-widest bg-gray-950/50 px-4 py-2 rounded-xl ml-12 sm:ml-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  Platform Payouts
                </div>
              </div>
            </div>

            {loading ? (
              <>
                <div className="overflow-x-auto scrollbar-hide rounded-2xl border border-gray-800 bg-gray-900/50 p-1 animate-pulse">
                  <div className="min-w-[700px] md:min-w-full h-[380px] md:h-[420px] relative bg-slate-950/50 rounded-xl overflow-hidden">
                    {/* Fake Y Axis */}
                    <div className="absolute left-4 top-6 bottom-12 w-10 flex flex-col justify-between text-right">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-3 w-8 bg-slate-700 rounded" />
                      ))}
                    </div>

                    {/* Fake Chart Area */}
                    <div className="absolute inset-0 pt-8 pb-12 px-14">
                      {/* Fake Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between py-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-px w-full bg-slate-800" />
                        ))}
                      </div>

                      {/* Fake Area / Curve */}
                      <div className="absolute bottom-12 left-12 right-8 h-3/4">
                        <div
                          className="w-full h-full bg-gradient-to-t from-indigo-500/30 to-transparent rounded"
                          style={{
                            clipPath:
                              "polygon(0 85%, 8% 65%, 18% 75%, 32% 45%, 48% 55%, 65% 35%, 78% 50%, 92% 28%, 100% 40%, 100% 100%, 0 100%)",
                          }}
                        />
                        {/* Highlight line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-400/80" />
                      </div>
                    </div>

                    {/* Fake X Axis Labels */}
                    <div className="absolute bottom-6 left-14 right-8 flex justify-between">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-10 bg-slate-700 rounded text-center"
                        />
                      ))}
                    </div>

                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2.5s_infinite]" />
                  </div>
                </div>
              </>
            ) : trendDataLength === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No Trend Data Available"
                description="There is no sales or payout data for the selected time period."
              />
            ) : (
              <>
                <div className="w-full">
                  <div className="overflow-x-auto scrollbar-hide rounded-2xl border border-gray-800 bg-gray-900/50 p-1">
                    <div className="min-w-[700px] md:min-w-full h-[380px] md:h-[420px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient
                              id="colorAdmin"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#6366f1"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#6366f1"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#1e293b"
                          />

                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#94a3b8",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                            interval={0} // Show all labels
                          />

                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#94a3b8",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                            tickFormatter={(val) =>
                              `৳${val > 999 ? (val / 1000).toFixed(1) + "k" : val}`
                            }
                          />

                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e2937",
                              borderRadius: "18px",
                              border: "1px solid #475569",
                              boxShadow: "0 30px 60px -15px rgb(0 0 0 / 0.7)",
                              padding: "16px 20px",
                              color: "#f8fafc",
                            }}
                            itemStyle={{ color: "#c7d2fe", fontWeight: 700 }}
                            labelStyle={{
                              color: "#94a3b8",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                            formatter={(value) => [
                              `৳${value.toLocaleString()}`,
                              "Total Payouts",
                            ]}
                            cursor={{ stroke: "#818cf8", strokeWidth: 2 }}
                          />

                          <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorAdmin)"
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Status Mix */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-[3rem] p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  Status Mix
                </h3>
                <p className="text-xs text-gray-500">
                  Order lifecycle distribution
                </p>
              </div>
            </div>

            {loading ? (
              <>
                <div className="h-[280px] w-full flex items-center justify-center">
                  <div className="relative w-[240px] h-[240px] animate-pulse">
                    {/* Donut background */}
                    <div className="w-full h-full rounded-full border-[35px] border-slate-700 relative">
                      {/* Hollow center */}
                      <div className="absolute inset-[38px] bg-slate-900 rounded-full" />

                      {/* Fake colored segments */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(#a855f7 0deg 80deg, #06b6d4 80deg 160deg, #eab308 160deg 250deg, #ef4444 250deg 360deg)`,
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {[...Array.from({ length: 4 })].map((_, idx) => (
                  <div
                    kay={idx}
                    className="flex items-center gap-1.5 justify-between p-2 rounded-xl bg-gray-950/30 border border-gray-800/50 animate-pulse"
                  >
                    <div className="flex items-center gap-2">
                      {/* Colored dot skeleton */}
                      <div className="size-2.5 rounded-full bg-slate-700" />

                      {/* Label skeleton */}
                      <div className="h-3 w-20 bg-slate-700 rounded" />
                    </div>

                    {/* Value skeleton */}
                    <div className="h-3 w-12 bg-slate-700 rounded" />
                  </div>
                ))}
              </>
            ) : pipelineDataLength !== 0 ? (
              <>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="rgba(0,0,0,0)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "15px",
                          border: "1px solid #1e293b",
                          color: "#ffffff",
                          fontSize: "13px",
                          padding: "8px 12px",
                        }}
                        itemStyle={{ color: "#ffffff" }}
                        labelStyle={{ color: "#cbd5e1" }}
                        cursor={{ stroke: "#64748b", strokeWidth: 1 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-x-6 gap-y-3 mt-6">
                  {pipelineData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 justify-between p-2 rounded-xl bg-gray-950/30 border border-gray-800/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="size-2.5 flex items-center justify-center rounded-full"
                          style={{
                            backgroundColor: COLORS[idx % COLORS.length],
                          }}
                        />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-white">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={PieChartIcon}
                title="No Pipeline Data"
                description="There is no data available to display in the pipeline chart."
              />
            )}
          </div>
        </div>

        {/* Section 3: Performance Table */}
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
                    setExpandedDropshipper(null); // reset expanded on filter
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
                          <span className="text-sm font-black text-amber-400">
                            ৳{ds.balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-950 border border-gray-800 text-[10px] font-black text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                            {ds.referredUsers?.length || 0}
                          </span>
                        </td>
                      </tr>

                      <ActivityComponent
                        mode={
                          expandedDropshipper === ds._id ? "visible" : "hidden"
                        }
                      >
                        <tr>
                          <td
                            colSpan={6}
                            className="px-10 py-6 bg-gray-950/50 border-y border-indigo-500/10"
                          >
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
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
                      </ActivityComponent>
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
        </div>

        {/* Section 4: Activity Feed */}
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

            {/* No Data State */}

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
      </Container>
    </section>
  );
}
