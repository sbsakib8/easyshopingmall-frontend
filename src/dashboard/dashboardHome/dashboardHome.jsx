"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Users,
  Settings,
  TrendingUp,
  Eye,
  Star,
  DollarSign,
  BarChart3,
  Plus,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Activity,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";
import { getUserProfile } from "@/src/hook/useAuth";
import { useDashboardStats } from "@/src/utlis/useDashboardStats";
import Container from "@/src/compronent/shared/Container";

const statusColors = {
  pending: "bg-yellow-900/50 text-yellow-300 border border-yellow-800/50",
  processing: "bg-blue-900/50 text-blue-300 border border-blue-800/50",
  shipped: "bg-purple-900/50 text-purple-300 border border-purple-800/50",
  completed: "bg-green-900/50 text-green-300 border border-green-800/50",
  cancelled: "bg-red-900/50 text-red-300 border border-red-800/50",
  return: "bg-orange-900/50 text-orange-300 border border-orange-800/50",
};

const dateRanges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

const DashboardHome = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    switch (range) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      default:
        return { startDate: undefined, endDate: undefined };
    }
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    };
  };

  const dateRange = getDateRange(activeRange);
  const { data: stats, loading: statsLoading } = useDashboardStats(
    activeRange !== "all" ? dateRange : undefined
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.user || res.data || res);
      } catch (error) {
        console.error("User not logged in");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatCurrency = (val) => `৳${(val || 0).toLocaleString()}`;

  const ChangeBadge = ({ value, size = "sm" }) => {
    if (value === 0 || value === undefined) return null;
    const isPositive = value > 0;
    return (
      <span className={`inline-flex items-center gap-0.5 ${size === "sm" ? "text-xs" : "text-sm"} font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(value)}%
      </span>
    );
  };

  const filteredRecentOrders = (stats?.recentOrders || []).filter((order) => {
    if (!searchTerm) return true;
    const name = order?.userId?.name || "";
    const id = order?.orderId || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section className="min-h-dvh bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden py-8 md:py-12">
      <Container>
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 via-black to-slate-900 rounded-3xl p-6 sm:p-8 text-slate-300 shadow-2xl shadow-black/50 relative overflow-hidden backdrop-blur-xl border border-gray-800/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 backdrop-blur-sm" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full translate-y-12 -translate-x-12 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  {loading ? "Loading..." : `Welcome back, ${user?.name || "Admin"}! 👋`}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  Here&apos;s what&apos;s happening with your business today
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right flex flex-col items-end">
                <p className="text-lg font-semibold text-gray-200">
                  {currentTime.toLocaleDateString("en-BD")}
                </p>
                <p className="text-gray-400 text-sm">
                  {currentTime.toLocaleTimeString("en-BD")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Period:</span>
          </div>
          {dateRanges.map((r) => (
            <button
              key={r.value}
              onClick={() => setActiveRange(r.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeRange === r.value
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-700/50 hover:text-gray-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* ── TODAY'S BUSINESS ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Today&apos;s Business
            </h2>
            <ChangeBadge value={stats?.changes?.orders} size="md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Today's Orders",
                value: stats?.today?.orders ?? 0,
                icon: ShoppingCart,
                gradient: "from-blue-600 to-cyan-600",
                bg: "from-blue-900/30 to-cyan-900/20",
                sub: `${stats?.today?.pending || 0} pending · ${stats?.today?.processing || 0} processing`,
              },
              {
                title: "Today's Sales",
                value: formatCurrency(stats?.today?.revenue),
                icon: DollarSign,
                gradient: "from-green-600 to-emerald-600",
                bg: "from-green-900/30 to-emerald-900/20",
                sub: `${stats?.today?.completed || 0} completed`,
              },
              {
                title: "Today's Delivery",
                value: stats?.today?.delivered ?? 0,
                icon: Truck,
                gradient: "from-purple-600 to-pink-600",
                bg: "from-purple-900/30 to-pink-900/20",
                sub: `৳${(stats?.today?.deliveryRevenue || 0).toLocaleString()} revenue`,
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`relative bg-gradient-to-br ${card.bg} backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-gray-800/50 shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform`}
              >
                <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <ChangeBadge value={stats?.changes?.[card.title.includes("Orders") ? "orders" : card.title.includes("Sales") ? "revenue" : "delivered"]} />
                  </div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-300">
                    {statsLoading ? (
                      <span className="inline-block w-16 h-8 bg-gray-700/50 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOTAL BUSINESS ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800">
              <BarChart3 className="w-5 h-5 text-slate-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Total Business Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {[
              { label: "Total Orders", value: stats?.totals?.orders ?? 0, icon: ShoppingCart, color: "text-blue-400" },
              { label: "Total Sales", value: formatCurrency(stats?.totals?.revenue), icon: DollarSign, color: "text-green-400" },
              { label: "Total Delivery", value: stats?.totals?.completed ?? 0, icon: Truck, color: "text-purple-400" },
              { label: "Users", value: stats?.totals?.users ?? 0, icon: Users, color: "text-cyan-400" },
              { label: "Products", value: stats?.totals?.products ?? 0, icon: Package, color: "text-orange-400" },
              { label: "Pending", value: stats?.totals?.pending ?? 0, icon: Clock, color: "text-yellow-400" },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-gray-800/50 shadow-lg hover:bg-white/10 transition-all"
              >
                <card.icon className={`w-6 h-6 mb-2 ${card.color}`} />
                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                {statsLoading ? (
                  <div className="w-12 h-6 bg-gray-700/50 rounded animate-pulse" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-slate-300">{card.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Status Breakdown ── */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-slate-300">Order Status Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Pending", value: stats?.totals?.pending ?? 0, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { label: "Processing", value: stats?.totals?.processing ?? 0, icon: RefreshCw, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Shipped", value: stats?.totals?.shipped ?? 0, icon: Truck, color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Completed", value: stats?.totals?.completed ?? 0, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
                { label: "Cancelled", value: stats?.totals?.cancelled ?? 0, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
                { label: "Returned", value: stats?.totals?.returned ?? 0, icon: RefreshCw, color: "text-orange-400", bg: "bg-orange-500/10" },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} rounded-2xl p-4 border border-gray-800/30`}>
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs text-gray-400">{item.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-300">{statsLoading ? "..." : item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {[
              { label: "Add Product", icon: Plus, gradient: "from-gray-800 to-black", description: "Create new product", route: "/dashboard/products/addproduct" },
              { label: "View Orders", icon: Eye, gradient: "from-slate-800 to-gray-900", description: "Check recent orders", route: "/dashboard/order/allorders" },
              { label: "Analytics", icon: BarChart3, gradient: "from-zinc-800 to-slate-900", description: "View insights", route: "/dashboard/analytics/sales-report" },
              { label: "Customers", icon: Users, gradient: "from-gray-900 to-black", description: "Manage customers", route: "/dashboard/customers/all-customers" },
              { label: "Settings", icon: Settings, gradient: "from-slate-900 to-zinc-900", description: "Configure system", route: "/dashboard/settings/userupdate" },
              { label: "Dropshipping", icon: Truck, gradient: "from-blue-900 to-indigo-900", description: "Manage DS orders", route: "/dashboard/order/allorders" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => action.route && router.push(action.route)}
                className="group relative bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-gray-800/30 shadow-lg overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-30 rounded-2xl`} />
                <div className="relative z-10 flex items-center gap-2">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg shadow-black/50`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  </div>
                  <div className="text-start">
                    <p className="text-sm font-bold text-slate-300 mb-1">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent Orders + Top Products ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-800/20 to-black/20 rounded-full -translate-y-16 translate-x-16 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-black/50">
                    <ShoppingCart className="w-5 h-5 text-slate-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-300">Recent Orders</h3>
                </div>
                <button
                  onClick={() => router.push("/dashboard/order/allorders")}
                  className="flex items-center space-x-1 text-gray-400 hover:text-slate-300 text-sm font-semibold"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-slate-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {statsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-gray-800/30 border border-gray-800/40">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-2xl" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-gray-700/50 rounded" />
                          <div className="h-2 w-32 bg-gray-700/30 rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-gray-700/50 rounded" />
                    </div>
                  ))
                ) : filteredRecentOrders.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No orders found</p>
                  </div>
                ) : (
                  filteredRecentOrders.map((order) => {
                    const name = order?.userId?.name || "Customer";
                    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                    const diff = Date.now() - new Date(order.createdAt).getTime();
                    const mins = Math.floor(diff / 60000);
                    const timeAgo = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.floor(mins / 60)}h ago` : `${Math.floor(mins / 1440)}d ago`;

                    return (
                      <div key={order._id} className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800/40 backdrop-blur-sm hover:bg-gray-800/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-800 via-slate-800 to-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
                            <span className="text-slate-300 font-bold text-xs">{initials}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-bold text-slate-300">#{order?.orderId?.slice(-8) || "------"}</p>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[order?.order_status] || "bg-gray-800/50 text-gray-300 border border-gray-700/50"}`}>
                                {order?.order_status?.charAt(0).toUpperCase() + order?.order_status?.slice(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{name} · {timeAgo}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-300">৳{(order?.totalAmt || 0).toLocaleString()}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-800/20 to-gray-900/20 rounded-full -translate-y-16 -translate-x-16 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-zinc-800 via-gray-800 to-slate-900 shadow-lg shadow-black/50">
                    <Package className="w-5 h-5 text-slate-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-300">Top Selling Products</h3>
                </div>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {statsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-gray-800/30 border border-gray-800/40">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-2xl" />
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-gray-700/50 rounded" />
                          <div className="h-2 w-20 bg-gray-700/30 rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-gray-700/50 rounded" />
                    </div>
                  ))
                ) : (stats?.topProducts || []).length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No product sales data yet</p>
                  </div>
                ) : (
                  stats.topProducts.map((product, index) => (
                    <div key={`${product.name}-${index}`} className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800/40 backdrop-blur-sm hover:bg-gray-800/30 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-zinc-800 via-gray-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
                          <Package className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-300">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.totalSold} sold</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-400">৳{(product.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Financial Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: "Revenue Collected", value: formatCurrency(stats?.totals?.amountPaid), icon: DollarSign, color: "text-green-400", bg: "from-green-900/30 to-emerald-900/20" },
            { label: "Amount Due", value: formatCurrency(stats?.totals?.amountDue), icon: TrendingUp, color: "text-red-400", bg: "from-red-900/30 to-rose-900/20" },
            { label: "Coupon Discounts", value: formatCurrency(stats?.totals?.couponDiscount), icon: Star, color: "text-yellow-400", bg: "from-yellow-900/30 to-amber-900/20" },
            { label: "Delivery Revenue", value: formatCurrency(stats?.totals?.deliveryCompleted), icon: Truck, color: "text-purple-400", bg: "from-purple-900/30 to-pink-900/20" },
          ].map((card) => (
            <div key={card.label} className={`bg-gradient-to-br ${card.bg} backdrop-blur-xl p-5 rounded-2xl border border-gray-800/50 shadow-xl`}>
              <card.icon className={`w-6 h-6 mb-2 ${card.color}`} />
              <p className="text-xs text-gray-400 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-slate-300">
                {statsLoading ? <span className="inline-block w-20 h-6 bg-gray-700/50 rounded animate-pulse" /> : card.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default DashboardHome;
