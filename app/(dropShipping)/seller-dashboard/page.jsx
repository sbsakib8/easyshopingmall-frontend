"use client"
import React, { useMemo } from 'react';
import { FiBox, FiClock, FiSettings, FiCheckCircle, FiCornerUpLeft } from "react-icons/fi";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { useMyOrders } from '@/src/utlis/useMyOrders';
import { Loader2 } from 'lucide-react';

function SallerDashboard() {
  const { orders = [], loading } = useMyOrders();

  const stats = useMemo(() => {
    const calculateStats = (filteredOrders) => {
      const orderCount = filteredOrders.length;
      const profit = filteredOrders.reduce((sum, order) => 
        sum + (order.products?.reduce((pSum, p) => pSum + ((p.sellingPrice - p.price) * p.quantity), 0) || 0), 0
      );
      const sellPrice = filteredOrders.reduce((sum, order) => 
        sum + (order.products?.reduce((pSum, p) => pSum + (p.sellingPrice * p.quantity), 0) || 0), 0
      );
      return { orderCount, profit, sellPrice };
    };

    const all = calculateStats(orders);
    const pending = calculateStats(orders.filter(o => o.order_status === 'pending'));
    const processing = calculateStats(orders.filter(o => o.order_status === 'processing'));
    const delivered = calculateStats(orders.filter(o => o.order_status === 'delivered'));
    const returned = calculateStats(orders.filter(o => o.order_status === 'returned' || o.order_status === 'cancelled'));

    return [
      {
        id: 1,
        title: "total order",
        order: all.orderCount,
        profit: all.profit,
        sellPrice: all.sellPrice,
        arrow1: "right",
        arrow2: "right",
        icon: <FiBox className="text-3xl text-secondary" />,
      },
      {
        id: 2,
        title: "PENDING",
        order: pending.orderCount,
        profit: pending.profit,
        sellPrice: pending.sellPrice,
        arrow1: "right",
        arrow2: "right",
        icon: <FiClock className="text-3xl text-secondary" />,
      },
      {
        id: 3,
        title: "PROCESSING",
        order: processing.orderCount,
        profit: processing.profit,
        sellPrice: processing.sellPrice,
        arrow1: "left",
        arrow2: "right",
        icon: <FiSettings className="text-3xl text-secondary" />,
      },
      {
        id: 4,
        title: "DELIVERED",
        order: delivered.orderCount,
        profit: delivered.profit,
        sellPrice: delivered.sellPrice,
        arrow1: "right",
        arrow2: "left",
        icon: <FiCheckCircle className="text-3xl text-secondary" />,
      },
      {
        id: 5,
        title: "RETURNED",
        order: returned.orderCount,
        profit: returned.profit,
        sellPrice: returned.sellPrice,
        arrow1: "right",
        arrow2: "right",
        icon: <FiCornerUpLeft className="text-3xl text-secondary" />,
      },
    ];
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-color animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Seller Dashboard
          </h2>
          <p className="text-gray-500 text-sm">Real-time Performance Metrics</p>
        </div>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {stats.map((view) => (
            <div
              key={view.id}
              className="rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
            >
              {/* Left Icon (circle) */}
              <div className="w-[80px] h-[80px] rounded-full bg-primary-color/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {view.icon}
              </div>

              {/* Right content */}
              <div className="flex-grow flex flex-col gap-4 w-full">
                {/* Title Box */}
                <div className="w-full text-center md:text-left text-xl font-black uppercase tracking-wider text-gray-900">
                  {view.title}
                </div>

                {/* Stats row */}
                <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                  {/* Order Count */}
                  <div className="bg-gray-50 border border-gray-100 font-bold rounded-2xl px-6 py-3 flex items-center justify-center text-sm shadow-sm">
                    COUNT: {view.order}
                  </div>

                  {/* Arrow 1 */}
                  <div className="items-center text-secondary hidden md:flex">
                    {view.arrow1 === "right" ? (
                      <FaLongArrowAltRight size={20} />
                    ) : (
                      <FaLongArrowAltLeft size={20} />
                    )}
                  </div>

                  {/* Profit */}
                  <div className="bg-green-50 border border-green-100 text-green-700 font-black rounded-2xl px-6 py-3 flex items-center justify-center text-sm shadow-sm">
                    PROFIT: ৳{view.profit.toLocaleString()}
                  </div>

                  {/* Arrow 2 */}
                  <div className="items-center text-secondary hidden md:flex">
                    {view.arrow2 === "right" ? (
                      <FaLongArrowAltRight size={20} />
                    ) : (
                      <FaLongArrowAltLeft size={20} />
                    )}
                  </div>

                  {/* Sell Price */}
                  <div className="bg-purple-50 border border-purple-100 text-purple-700 font-black rounded-2xl px-6 py-3 flex items-center justify-center text-sm shadow-sm">
                    VOLUME: ৳{view.sellPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SallerDashboard;
