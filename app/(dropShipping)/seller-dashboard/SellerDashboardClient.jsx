"use client";

import Container from "@/src/compronent/shared/Container";
import Section from "@/src/compronent/shared/Section";
import BackButton from "@/src/dropShipping/BackButton/BackButton";
import { useGetUser } from "@/src/utlis/useGetuser";
import { useMyOrders } from "@/src/utlis/useMyOrders";
import { getMyDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";
import DashboardRevenueChart from "@/src/dashboard/dropshipping/DashboardRevenueChart";
import MonthlyProfitSummary from "@/src/dashboard/dropshipping/MonthlyProfitSummary";
import OrderPipeline from "@/src/dashboard/dropshipping/OrderPipeline";
import {
  TrendingUp,
  Wallet,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCornerUpLeft,
  FiSettings,
} from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  return: "bg-red-100 text-red-700",
};

export default function SellerDashboardClient() {
  const { orders = [], loading: ordersLoading } = useMyOrders();
  const { user, loading: userLoading } = useGetUser();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await getMyDropshippingAnalytics();
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const topProducts = useMemo(() => {
    const productMap = {};
    orders.forEach((order) => {
      order.products?.forEach((p) => {
        const key = p.productId?._id || p.productId || p.name;
        if (!productMap[key]) {
          productMap[key] = {
            name: p.name || p.productId?.productName || "Product",
            quantity: 0,
            revenue: 0,
          };
        }
        productMap[key].quantity += p.quantity || 1;
        productMap[key].revenue +=
          (Number(p.sellingPrice) || Number(p.price) || 0) * (p.quantity || 1);
      });
    });
    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orders],
  );

  const stats = useMemo(() => {
    const calculateStats = (filteredOrders) => {
      const orderCount = filteredOrders.length;
      const profit = filteredOrders.reduce((sum, order) => {
        if (order.profitGiven && order.profitAmount) {
          return sum + order.profitAmount;
        }
        const potentialProfit =
          order.products?.reduce((pSum, p) => {
            const cost = Number(p.price) || 0;
            const selling = Number(p.sellingPrice) || cost;
            return pSum + (selling - cost) * (p.quantity || 1);
          }, 0) || 0;
        return sum + potentialProfit + (Number(order.couponDiscount) || 0);
      }, 0);
      const sellPrice = filteredOrders.reduce(
        (sum, order) =>
          sum +
          (order.products?.reduce(
            (pSum, p) =>
              pSum +
              (Number(p.sellingPrice) || Number(p.price)) * (p.quantity || 1),
            0,
          ) || 0),
        0,
      );
      return { orderCount, profit, sellPrice };
    };

    const all = calculateStats(orders);
    const pending = calculateStats(orders.filter((o) => o.order_status === "pending"));
    const processing = calculateStats(orders.filter((o) => o.order_status === "processing" || o.order_status === "shipped"));
    const delivered = calculateStats(orders.filter((o) => o.order_status === "delivered" || o.order_status === "completed"));
    const returned = calculateStats(orders.filter((o) => o.order_status === "returned" || o.order_status === "cancelled"));

    return [
      { id: 1, title: "Total Orders", order: all.orderCount, profit: all.profit, sellPrice: all.sellPrice, icon: <FiBox />, color: "emerald" },
      { id: 2, title: "Pending Orders", order: pending.orderCount, profit: pending.profit, sellPrice: pending.sellPrice, icon: <FiClock />, color: "amber" },
      { id: 3, title: "In Progress", order: processing.orderCount, profit: processing.profit, sellPrice: processing.sellPrice, icon: <FiSettings />, color: "blue" },
      { id: 4, title: "Delivered", order: delivered.orderCount, profit: delivered.profit, sellPrice: delivered.sellPrice, icon: <FiCheckCircle />, color: "emerald" },
      { id: 5, title: "Returned/Cancelled", order: returned.orderCount, profit: returned.profit, sellPrice: returned.sellPrice, icon: <FiCornerUpLeft />, color: "red" },
    ];
  }, [orders]);

  return (
    <Section className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <BackButton className="mb-4 -mt-2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
              {userLoading ? <span className="animate-pulse">Loading...</span> : `Welcome Back, ${user?.name?.split(" ")[0]}! 👋`}
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-semibold leading-relaxed">Track your sales, profits, and orders in real-time</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-3xl p-6 md:p-7 text-white shadow-2xl shadow-emerald-600/25 relative overflow-hidden group hover:shadow-emerald-600/40 transition-shadow">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"><Wallet className="w-5 h-5" /></div>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-75">Available Balance</span>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-2 uppercase tracking-widest font-semibold">Your Balance</p>
                <h3 className="text-4xl md:text-5xl font-black leading-tight mb-2">
                  {userLoading ? <span className="animate-pulse">Loading...</span> : `৳${Number(user?.balance || 0).toLocaleString()}`}
                </h3>
                <p className="text-xs font-semibold opacity-80">Ready to withdraw anytime</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <MonthlyProfitSummary transactions={analytics?.transactions || []} loading={analyticsLoading} />
          <DashboardRevenueChart transactions={analytics?.transactions || []} loading={analyticsLoading} />
          <OrderPipeline orderPipeline={analytics?.orderPipeline || {}} loading={analyticsLoading} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {stats.map((item) => (
            <div key={item.id} className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${item.color === "emerald" ? "bg-emerald-100 text-emerald-600" : item.color === "amber" ? "bg-amber-100 text-amber-600" : item.color === "blue" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}>
                  {React.cloneElement(item.icon, { size: 16 })}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.title}</p>
                {ordersLoading ? <span className="animate-pulse">Loading...</span> : <p className="text-xl md:text-2xl font-black text-gray-900">{item.order}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-4 h-4" /></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Recent Orders</h3>
              </div>
              <a href="/order-list" className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="p-5 md:p-6 pt-3">
              {ordersLoading ? (
                <div className="space-y-3 animate-pulse">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="flex items-center gap-3"><div className="h-3 w-20 bg-gray-100 rounded" /><div className="flex-1 h-3 bg-gray-100 rounded" /><div className="h-3 w-12 bg-gray-100 rounded" /></div>))}</div>
              ) : recentOrders.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8 font-semibold">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{order.orderId || order._id?.slice(-8)?.toUpperCase()}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-900">৳{Number(order.totalAmt || 0).toLocaleString()}</p>
                        <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5 ${STATUS_COLORS[order.order_status] || "bg-gray-100 text-gray-600"}`}>{order.order_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><ShoppingBag className="w-4 h-4" /></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Top Products</h3>
              </div>
            </div>
            <div className="p-5 md:p-6 pt-3">
              {ordersLoading ? (
                <div className="space-y-3 animate-pulse">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="flex items-center gap-3"><div className="h-8 w-8 bg-gray-100 rounded-lg" /><div className="flex-1 h-3 bg-gray-100 rounded" /><div className="h-3 w-10 bg-gray-100 rounded" /></div>))}</div>
              ) : topProducts.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8 font-semibold">No products sold yet</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, idx) => {
                    const maxQty = topProducts[0]?.quantity || 1;
                    const barWidth = (product.quantity / maxQty) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center shrink-0"><span className="text-[10px] font-black text-emerald-700">#{idx + 1}</span></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                          <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${barWidth}%` }} /></div>
                        </div>
                        <div className="text-right shrink-0"><p className="text-xs font-black text-gray-900">{product.quantity}</p><p className="text-[10px] text-gray-400 font-semibold">sold</p></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 pt-6 pb-4">
          <a href="/my-analytics" className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md group">
            <TrendingUp size={16} className="group-hover:scale-110 transition-transform" />View Analytics
          </a>
          <a href="/order-list" className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group">
            <FiBox size={16} className="group-hover:scale-110 transition-transform" />Manage Orders
          </a>
        </div>
      </Container>
    </Section>
  );
}
