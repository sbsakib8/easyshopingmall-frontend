"use client";
import React, { useMemo } from 'react';
import { FiBox, FiClock, FiSettings, FiCheckCircle, FiCornerUpLeft } from "react-icons/fi";
import { useMyOrders } from '@/src/utlis/useMyOrders';
import { useGetUser } from '@/src/utlis/useGetuser';
import { Loader2, TrendingUp, Wallet, Activity } from 'lucide-react';

function SallerDashboard() {
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
        const potentialProfit = order.products?.reduce((pSum, p) => {
          const cost = Number(p.price) || 0;
          const selling = Number(p.sellingPrice) || cost;
          return pSum + ((selling - cost) * (p.quantity || 1));
        }, 0) || 0;
        return sum + potentialProfit;
      }, 0);

      const sellPrice = filteredOrders.reduce((sum, order) => 
        sum + (order.products?.reduce((pSum, p) => pSum + ((Number(p.sellingPrice) || Number(p.price)) * (p.quantity || 1)), 0) || 0), 0
      );

      return { orderCount, profit, sellPrice };
    };

    const all = calculateStats(orders);
    const pending = calculateStats(orders.filter(o => o.order_status === 'pending'));
    const processing = calculateStats(orders.filter(o => o.order_status === 'processing' || o.order_status === 'shipped'));
    const delivered = calculateStats(orders.filter(o => o.order_status === 'delivered' || o.order_status === 'completed'));
    const returned = calculateStats(orders.filter(o => o.order_status === 'returned' || o.order_status === 'cancelled'));

    return [
      {
        id: 1,
        title: "Total Orders",
        order: all.orderCount,
        profit: all.profit,
        sellPrice: all.sellPrice,
        icon: <FiBox />,
        color: "emerald"
      },
      {
        id: 2,
        title: "Pending Orders",
        order: pending.orderCount,
        profit: pending.profit,
        sellPrice: pending.sellPrice,
        icon: <FiClock />,
        color: "amber"
      },
      {
        id: 3,
        title: "In Progress",
        order: processing.orderCount,
        profit: processing.profit,
        sellPrice: processing.sellPrice,
        icon: <FiSettings />,
        color: "blue"
      },
      {
        id: 4,
        title: "Delivered",
        order: delivered.orderCount,
        profit: delivered.profit,
        sellPrice: delivered.sellPrice,
        icon: <FiCheckCircle />,
        color: "emerald"
      },
      {
        id: 5,
        title: "Returned/Cancelled",
        order: returned.orderCount,
        profit: returned.profit,
        sellPrice: returned.sellPrice,
        icon: <FiCornerUpLeft />,
        color: "red"
      },
    ];
  }, [orders]);

  if (ordersLoading || userLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="container mx-auto px-4 py-8 lg:px-12">
        {/* Header & Balance Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              Welcome Back, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-gray-500 font-medium">Here's what's happening with your store today.</p>
          </div>

          {/* Balance Widget */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                   <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <Wallet className="w-6 h-6" />
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest opacity-80">Available Balance</span>
                </div>
                <div className="mt-4">
                   <h3 className="text-3xl font-black">৳{Number(user?.balance || 0).toLocaleString()}</h3>
                   <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-tighter">Withdraw anytime to your account</p>
                </div>
             </div>
             {/* Decorative circles */}
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${
                            item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                            item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                            item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                            'bg-red-50 text-red-600'
                        }`}>
                            {React.cloneElement(item.icon, { size: 18 })}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.title}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{item.order}</span>
                        <span className="text-xs font-bold text-gray-400">Orders</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Detailed Performance List */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {stats.map((view) => (
            <div
              key={view.id}
              className="rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-8 bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-500/20 transition-all group relative overflow-hidden"
            >
              {/* Left Icon */}
              <div className={`w-[70px] h-[70px] rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${
                  view.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  view.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  view.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  'bg-red-50 text-red-600'
              }`}>
                {React.cloneElement(view.icon, { className: "text-3xl" })}
              </div>

              {/* Content */}
              <div className="flex-grow flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                      {view.title}
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                        <Activity className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Real-time</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                    <p className="text-xl font-black text-gray-800">{view.order}</p>
                  </div>

                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Total Profit</p>
                    <p className="text-xl font-black text-emerald-700">৳{view.profit.toLocaleString()}</p>
                  </div>

                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
                    <p className="text-[10px] font-black text-teal-600/60 uppercase tracking-widest mb-1">Total Volume</p>
                    <p className="text-xl font-black text-teal-700">৳{view.sellPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Visual trend indicator */}
              <div className="absolute right-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500" />
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href="/my-analytics" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm group">
                <TrendingUp size={16} className="group-hover:scale-110 transition-transform" />
                Detailed Analytics
            </a>
            <a href="/order-list" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm group">
                <FiBox size={16} className="group-hover:scale-110 transition-transform" />
                Manage Orders
            </a>
        </div>
      </div>
    </div>
  );
}

export default SallerDashboard;
