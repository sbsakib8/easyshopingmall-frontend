"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Users,
  Settings,
  Search,
  TrendingUp,
  Eye,
  Star,
  DollarSign,
  BarChart3,
  Plus,
  ChevronRight,
  FileText,
  Globe,
  ArrowUp,
  Activity,
  Zap,
} from "lucide-react";
import { getAllUser, getUserProfile } from "@/src/hook/useAuth";
import { OrderAllAdminGet } from "@/src/utlis/useOrder";
import { ProductAllGet } from "@/src/hook/useProduct";
import useGetRevenue from "@/src/utlis/useGetRevenue";

const DashboardHome = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [userChange, setUserChange] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [orderChange, setOrderChange] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [productsChange, setProductsChange] = useState("0.0");
  const { totalRevenue } = useGetRevenue();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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

  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        const res = await getAllUser();
        const users = res?.users || [];

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const totalUsers = users.length;

        const yesterdayUsers = users.filter(
          (u) => new Date(u.createdAt) <= yesterday,
        ).length;

        let percentage = 0;
        if (yesterdayUsers > 0) {
          percentage = ((totalUsers - yesterdayUsers) / yesterdayUsers) * 100;
        }

        setUsersCount(totalUsers);
        setUserChange(percentage.toFixed(1));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsersStats();
  }, []);

  useEffect(() => {
    const fetchOrdersStats = async () => {
      try {
        const res = await OrderAllAdminGet();
        const orders = res.orders || res.data || [];

        const totalOrders = orders.length;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const toDateOnly = (dateStr) => {
          const d = new Date(dateStr);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const yesterdayOrders = orders.filter(
          (order) =>
            toDateOnly(order.createdAt).getTime() === yesterday.getTime(),
        ).length;

        let percentage = 0;
        if (yesterdayOrders > 0) {
          percentage =
            ((totalOrders - yesterdayOrders) / yesterdayOrders) * 100;
        }

        setOrdersCount(totalOrders);
        setOrderChange(percentage.toFixed(1));
      } catch (error) {
        console.error("Fetch orders error:", error);
      }
    };

    fetchOrdersStats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = [];
        let page = 1;
        let limit = 100;
        let totalFetched = 0;
        let totalCount = 0;

        do {
          const res = await ProductAllGet({ page, limit });
          const products = res.data || [];

          if (products.length === 0) break; // Fix: Prevent infinite loop if API returns empty array

          allProducts.push(...products);

          totalFetched += products.length;
          totalCount = res.totalCount || totalFetched;

          page++;
        } while (totalFetched < totalCount);

        const totalProducts = allProducts.length;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayProducts = allProducts.filter(
          (p) => new Date(p.createdAt) < yesterday,
        ).length;

        let percentage = 0;
        if (yesterdayProducts > 0) {
          percentage =
            ((totalProducts - yesterdayProducts) / yesterdayProducts) * 100;
        }

        setProductsCount(totalProducts);
        setProductsChange(percentage.toFixed(1));
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };

    fetchProducts();
  }, []);

  const statsCards = [
    {
      title: "Total Users",
      value: usersCount,
      change: `${userChange > 0 ? "+" : ""}${userChange}%`,
      changeType: userChange >= 0 ? "positive" : "negative",
      icon: Users,
      gradient: "from-gray-900 via-gray-800 to-black",
      shadowColor: "shadow-gray-900/50",
    },
    {
      title: "Total Orders",
      value: ordersCount,
      change: `${orderChange}%`,
      changeType: Number(orderChange) >= 0 ? "positive" : "negative",
      icon: ShoppingCart,
      gradient: "from-slate-900 via-gray-900 to-black",
      shadowColor: "shadow-slate-900/50",
    },
    {
      title: "Total Products",
      value: productsCount,
      change: `${productsChange > 0 ? "+" : ""}${productsChange}%`,
      changeType: productsChange >= 0 ? "positive" : "negative",
      icon: Package,
      gradient: "from-zinc-900 via-slate-800 to-gray-900",
      shadowColor: "shadow-zinc-900/50",
    },
    {
      title: "Total Revenue",
      value: totalRevenue,
      change: "+0.00%",
      changeType: "positive",
      icon: DollarSign,
      gradient: "from-black via-gray-900 to-slate-800",
      shadowColor: "shadow-black/50",
    },
  ];

  const quickActions = [
    {
      label: "Add Product",
      icon: Plus,
      gradient: "from-gray-800 to-black",
      description: "Create new product",
      route: "/dashboard/products/addproduct",
    },
    {
      label: "View Orders",
      icon: Eye,
      gradient: "from-slate-800 to-gray-900",
      description: "Check recent orders",
      route: "/dashboard/order/allorders",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      gradient: "from-zinc-800 to-slate-900",
      description: "View insights",
      route: "/dashboard/analytics/sales-report",
    },
    {
      label: "Customers",
      icon: Users,
      gradient: "from-gray-900 to-black",
      description: "Manage customers",
      route: "/dashboard/customers/all-customers",
    },
    {
      label: "Settings",
      icon: Settings,
      gradient: "from-slate-900 to-zinc-900",
      description: "Configure system",
      route: "/dashboard/settings/userupdate",
    },
    {
      label: "Reports",
      icon: FileText,
      gradient: "from-black to-gray-800",
      description: "Generate reports",
      route: "/dashboard/analytics",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      amount: "৳1,299",
      status: "Completed",
      time: "2 hours ago",
      avatar: "JD",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      amount: "৳899",
      status: "Processing",
      time: "4 hours ago",
      avatar: "JS",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      amount: "৳2,199",
      status: "Shipped",
      time: "6 hours ago",
      avatar: "MJ",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Wilson",
      amount: "৳1,599",
      status: "Pending",
      time: "8 hours ago",
      avatar: "SW",
    },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sales: "245 sold",
      price: "৳3,299",
      rating: 4.8,
      trend: "+15%",
    },
    {
      name: "Smart Watch",
      sales: "189 sold",
      price: "৳12,999",
      rating: 4.7,
      trend: "+12%",
    },
    {
      name: "Phone Case",
      sales: "156 sold",
      price: "৳599",
      rating: 4.9,
      trend: "+8%",
    },
    {
      name: "Bluetooth Speaker",
      sales: "134 sold",
      price: "৳2,199",
      rating: 4.6,
      trend: "+5%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <main className="lg:ml-15 py-5 px-2 lg:px-9">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 via-black to-slate-900 rounded-3xl p-6 sm:p-8 text-accent-content shadow-2xl shadow-black/50 relative overflow-hidden backdrop-blur-xl border border-gray-800/50">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full translate-y-12 -translate-x-12 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    {loading
                      ? "Loading..."
                      : `Welcome back, ${user?.name || "Admin"}! 👋`}
                  </h1>

                  <p className="text-gray-300 text-sm sm:text-base">
                    Here's what's happening with your store today
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((card) => (
            <div
              key={card.title}
              className={`group relative bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-gray-800/50 shadow-lg ${card.shadowColor} overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 rounded-3xl`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg ${card.shadowColor}`}
                  >
                    <card.icon className="w-6 h-6 text-accent-content" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{card.change}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-accent-content mb-2">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500">from last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Live Dashboard</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => action.route && router.push(action.route)}
                className="group relative bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-gray-800/30 shadow-lg overflow-hidden cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-30 rounded-2xl`}
                ></div>

                <div className="relative z-10 flex items-center gap-2">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg shadow-black/50`}
                  >
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-content" />
                  </div>
                  <div className="text-start">
                    <p className="text-sm font-bold text-accent-content mb-1">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-800/20 to-black/20 rounded-full -translate-y-16 translate-x-16 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-black/50">
                    <ShoppingCart className="w-5 h-5 text-accent-content" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-content">
                    Recent Orders
                  </h3>
                </div>
                <button className="group flex items-center space-x-2 text-gray-300 hover:text-accent-content text-sm font-semibold">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800/40 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-800 via-slate-800 to-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
                        <span className="text-accent-content font-bold text-sm">
                          {order.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-accent-content">
                            {order.id}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              order.status === "Completed"
                                ? "bg-green-900/50 text-green-300 border border-green-800/50"
                                : order.status === "Processing"
                                  ? "bg-yellow-900/50 text-yellow-300 border border-yellow-800/50"
                                  : order.status === "Shipped"
                                    ? "bg-blue-900/50 text-blue-300 border border-blue-800/50"
                                    : "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                            } backdrop-blur-sm`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.customer} • {order.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent-content">
                        {order.amount}
                      </p>
                      <div className="flex items-center space-x-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-800/20 to-gray-900/20 rounded-full -translate-y-16 -translate-x-16 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-zinc-800 via-gray-800 to-slate-900 shadow-lg shadow-black/50">
                    <Package className="w-5 h-5 text-accent-content" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-content">
                    Top Selling Products
                  </h3>
                </div>
                <button className="group flex items-center space-x-2 text-gray-300 hover:text-accent-content text-sm font-semibold">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {topProducts.map((product) => (
                  <div
                    key={product.name}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-900/50 to-black/30 border border-gray-800/40 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-zinc-800 via-gray-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
                        <Package className="w-5 h-5 text-accent-content" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-accent-content">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-xs text-gray-400">
                            {product.sales}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-300 font-medium">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent-content">
                        {product.price}
                      </p>
                      <div className="flex items-center space-x-1 text-green-400">
                        <ArrowUp className="w-3 h-3" />
                        <span className="text-xs font-bold">
                          {product.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Sales Chart Preview */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-800/10 to-black/10 rounded-full -translate-y-20 translate-x-20 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-800 to-black shadow-lg shadow-black/50">
                    <BarChart3 className="w-5 h-5 text-accent-content" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-content">
                    Sales Overview
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">This Month</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Mock Chart Area */}
              <div className="h-48 sm:h-64 bg-gradient-to-br from-gray-900/30 to-black/20 rounded-2xl border border-gray-800/30 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/50">
                    <BarChart3 className="w-8 h-8 text-accent-content" />
                  </div>
                  <p className="text-gray-300 font-medium">
                    Chart will be rendered here
                  </p>
                  <p className="text-sm text-gray-500">
                    Sales analytics visualization
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/40 shadow-xl shadow-black/30 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-800/10 to-gray-900/10 rounded-full translate-y-16 -translate-x-16 backdrop-blur-sm"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-slate-800 to-gray-900 shadow-lg shadow-black/50">
                  <Activity className="w-5 h-5 text-accent-content" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-accent-content">
                  Live Activity
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    action: "New order received",
                    time: "2 min ago",
                    type: "order",
                  },
                  {
                    action: "Product updated",
                    time: "5 min ago",
                    type: "product",
                  },
                  {
                    action: "Customer registered",
                    time: "12 min ago",
                    type: "user",
                  },
                  {
                    action: "Payment processed",
                    time: "18 min ago",
                    type: "payment",
                  },
                  {
                    action: "Review submitted",
                    time: "25 min ago",
                    type: "review",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                        activity.type === "order"
                          ? "bg-gradient-to-r from-gray-700 to-gray-800"
                          : activity.type === "product"
                            ? "bg-gradient-to-r from-slate-700 to-slate-800"
                            : activity.type === "user"
                              ? "bg-gradient-to-r from-zinc-700 to-zinc-800"
                              : activity.type === "payment"
                                ? "bg-gradient-to-r from-gray-800 to-black"
                                : "bg-gradient-to-r from-slate-800 to-gray-900"
                      }`}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-accent-content">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-200" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-xl text-gray-200 placeholder-gray-400 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-gray-700/50 shadow-lg shadow-black/20 border border-gray-800/30"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-800/10 to-black/10 opacity-0 group-focus-within:opacity-100 pointer-events-none"></div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 text-accent-content shadow-xl shadow-black/50 relative overflow-hidden backdrop-blur-xl border border-gray-700/50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-6 h-6" />
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                  Live
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">98.5%</p>
              <p className="text-sm text-gray-300">Server Uptime</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-6 text-accent-content shadow-xl shadow-black/50 relative overflow-hidden backdrop-blur-xl border border-gray-700/50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-6 h-6" />
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                  +12%
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">1,432</p>
              <p className="text-sm text-gray-300">Active Visitors</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-slate-900 rounded-2xl p-6 text-accent-content shadow-xl shadow-black/50 relative overflow-hidden backdrop-blur-xl border border-gray-700/50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-6 h-6" />
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                  Excellent
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">4.8</p>
              <p className="text-sm text-gray-300">Avg. Rating</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Glassmorphism effects */
        .glass {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #374151, #111827);
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4b5563, #1f2937);
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }

          .p-6 {
            padding: 1rem;
          }

          .p-8 {
            padding: 1.5rem;
          }

          .text-3xl {
            font-size: 1.5rem;
          }

          .text-2xl {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
