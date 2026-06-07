"use client";

import Container from "@/src/compronent/shared/Container";
import Section from "@/src/compronent/shared/Section";
import BackButton from "@/src/dropShipping/BackButton/BackButton";
import { useGetUser } from "@/src/utlis/useGetuser";
import { useMyOrders } from "@/src/utlis/useMyOrders";
import { TrendingUp, Wallet } from "lucide-react";
import React, { useMemo } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCornerUpLeft,
  FiSettings,
} from "react-icons/fi";

function SellerDashboard() {
  const { orders = [], loading: ordersLoading } = useMyOrders();
  const { user, loading: userLoading } = useGetUser();

  const stats = useMemo(() => {
    const calculateStats = (filteredOrders) => {
      const orderCount = filteredOrders.length;

      const profit = filteredOrders.reduce((sum, order) => {
        // If the order already has profitAmount (delivered), use it
        if (order.profitGiven && order.profitAmount) {
          return sum + order.profitAmount;
        }
        // Otherwise calculate potential profit
        const potentialProfit =
          order.products?.reduce((pSum, p) => {
            const cost = Number(p.price) || 0;
            const selling = Number(p.sellingPrice) || cost;
            return pSum + (selling - cost) * (p.quantity || 1);
          }, 0) || 0;
        return sum + potentialProfit;
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
    const pending = calculateStats(
      orders.filter((o) => o.order_status === "pending"),
    );
    const processing = calculateStats(
      orders.filter(
        (o) => o.order_status === "processing" || o.order_status === "shipped",
      ),
    );
    const delivered = calculateStats(
      orders.filter(
        (o) => o.order_status === "delivered" || o.order_status === "completed",
      ),
    );
    const returned = calculateStats(
      orders.filter(
        (o) => o.order_status === "returned" || o.order_status === "cancelled",
      ),
    );

    return [
      {
        id: 1,
        title: "Total Orders",
        order: all.orderCount,
        profit: all.profit,
        sellPrice: all.sellPrice,
        icon: <FiBox />,
        color: "emerald",
      },
      {
        id: 2,
        title: "Pending Orders",
        order: pending.orderCount,
        profit: pending.profit,
        sellPrice: pending.sellPrice,
        icon: <FiClock />,
        color: "amber",
      },
      {
        id: 3,
        title: "In Progress",
        order: processing.orderCount,
        profit: processing.profit,
        sellPrice: processing.sellPrice,
        icon: <FiSettings />,
        color: "blue",
      },
      {
        id: 4,
        title: "Delivered",
        order: delivered.orderCount,
        profit: delivered.profit,
        sellPrice: delivered.sellPrice,
        icon: <FiCheckCircle />,
        color: "emerald",
      },
      {
        id: 5,
        title: "Returned/Cancelled",
        order: returned.orderCount,
        profit: returned.profit,
        sellPrice: returned.sellPrice,
        icon: <FiCornerUpLeft />,
        color: "red",
      },
    ];
  }, [orders]);

  return (
    <Section className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <BackButton className="mb-4 -mt-2" />
        {/* Header & Balance Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
              {userLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `Welcome Back, ${user?.name?.split(" ")[0]}! 👋`
              )}
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-semibold leading-relaxed">
              Track your sales, profits, and orders in real-time
            </p>
          </div>

          {/* Balance Widget */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-3xl p-6 md:p-7 text-white shadow-2xl shadow-emerald-600/25 relative overflow-hidden group hover:shadow-emerald-600/40 transition-shadow">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-75">
                  Available Balance
                </span>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-2 uppercase tracking-widest font-semibold">
                  Your Balance
                </p>
                <h3 className="text-4xl md:text-5xl font-black leading-tight mb-2">
                  {userLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `৳${Number(user?.balance || 0).toLocaleString()}`
                  )}
                </h3>
                <p className="text-xs font-semibold opacity-80">
                  Ready to withdraw anytime
                </p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${
                    item.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.color === "amber"
                        ? "bg-amber-100 text-amber-600"
                        : item.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  {React.cloneElement(item.icon, { size: 16 })}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {item.title}
                </p>
                {ordersLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <p className="text-xl md:text-2xl font-black text-gray-900">
                    {item.order}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Performance List */}
        <div className="flex flex-col gap-4 mb-8">
          {stats.map((view) => (
            <div
              key={view.id}
              className="rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Left Icon */}
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  view.color === "emerald"
                    ? "bg-emerald-100 text-emerald-600"
                    : view.color === "amber"
                      ? "bg-amber-100 text-amber-600"
                      : view.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                }`}
              >
                {React.cloneElement(view.icon, {
                  className: "text-xl md:text-2xl",
                })}
              </div>

              {/* Content */}
              <div className="flex-grow flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
                    {view.title}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 rounded-full border border-emerald-100/50">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 p-3 md:p-4 rounded-xl border border-gray-200">
                    <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
                      Orders
                    </p>
                    {ordersLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <p className="text-lg md:text-xl font-black text-gray-900">
                        {view.order}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-3 md:p-4 rounded-xl border border-emerald-100">
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1.5">
                      Profit
                    </p>
                    {ordersLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <p className="text-lg md:text-xl font-black text-emerald-700">
                        ৳{view.profit.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-50/50 p-3 md:p-4 rounded-xl border border-teal-100">
                    <p className="text-[9px] md:text-[10px] font-black text-teal-700 uppercase tracking-wider mb-1.5">
                      Volume
                    </p>
                    {ordersLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <p className="text-lg md:text-xl font-black text-teal-700">
                        ৳{view.sellPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual accent line */}
              <div className="absolute right-0 top-0 h-full w-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500" />
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 pt-6">
          <a
            href="/my-analytics"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <TrendingUp
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            View Analytics
          </a>
          <a
            href="/order-list"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-emerald-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold uppercase tracking-wide text-xs md:text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group"
          >
            <FiBox
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Manage Orders
          </a>
        </div>
      </Container>
    </Section>
  );
}

export default SellerDashboard;
