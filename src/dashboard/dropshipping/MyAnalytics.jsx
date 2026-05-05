"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  BarChart3, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  XCircle, 
  Activity, 
  RefreshCw, 
  Users 
} from "lucide-react";
import { getMyDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";

const MyAnalytics = () => {
  const data = useSelector((state) => state.user.data);
  const [dsAnalytics, setDsAnalytics] = useState(null);
  const [dsLoading, setDsLoading] = useState(false);

  useEffect(() => {
    const fetchDSAnalytics = async () => {
      setDsLoading(true);
      try {
        const res = await getMyDropshippingAnalytics();
        if (res.success) {
          setDsAnalytics(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch DS analytics", error);
      } finally {
        setDsLoading(false);
      }
    };

    if (data?._id && (data?.role === "DROPSHIPPING" || data?.roles?.includes("DROPSHIPPING"))) {
      fetchDSAnalytics();
    }
  }, [data?._id]);

  if (dsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Calculating your stats...</p>
      </div>
    );
  }

  if (!dsAnalytics && !dsLoading) {
    return (
      <div className="min-h-[60vh] text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">No analytics data available for your shop yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4 md:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Performance Analytics</h2>
          <p className="text-gray-500 text-sm">Real-time business insights for your shop</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          <button className="px-3 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-teal-600">All Time</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profit", value: dsAnalytics.summary.totalProfit, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pending Profit", value: dsAnalytics.summary.pendingProfit, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Referral Income", value: dsAnalytics.summary.referralIncome, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Loss (Cancelled)", value: dsAnalytics.summary.lostProfit, icon: XCircle, color: "text-red-500", bg: "bg-red-50" }
        ].map((kpi, idx) => (
          <div key={idx} className={`${kpi.bg} p-5 rounded-2xl border border-transparent hover:border-gray-200 transition-all shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`${kpi.color} bg-white p-1.5 rounded-lg shadow-sm`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{kpi.label}</span>
            </div>
            <p className={`text-2xl font-black ${kpi.color}`}>৳{kpi.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Middle Section: Pipeline and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-teal-500" />
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">Order Pipeline</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: "pending", label: "Pending", color: "bg-yellow-500", text: "text-yellow-600" },
              { key: "processing", label: "Processing", color: "bg-blue-500", text: "text-blue-600" },
              { key: "shipped", label: "Shipped", color: "bg-purple-500", text: "text-purple-600" },
              { key: "delivered", label: "Delivered", color: "bg-emerald-500", text: "text-emerald-600" }
            ].map((stage) => {
              const count = dsAnalytics.orderPipeline[stage.key] || 0;
              const total = dsAnalytics.summary.ordersCount || 1;
              const pct = (count / total) * 100;
              return (
                <div key={stage.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-gray-600">{stage.label}</span>
                    <span className={`text-xs font-black ${stage.text}`}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${stage.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {dsAnalytics.transactions.slice(0, 6).map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'profit' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {tx.type === 'profit' ? <DollarSign className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {tx.type === 'profit' ? 'Sales Profit' : `Referral: ${tx.user}`}
                    </p>
                    <p className="text-[10px] text-gray-400">Order #{tx.orderId.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-900">৳{tx.amount}</p>
                  <p className={`text-[10px] font-bold uppercase ${tx.status === 'credited' ? 'text-emerald-500' : tx.status === 'lost' ? 'text-red-500' : 'text-amber-500'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
            {dsAnalytics.transactions.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-xs italic">No recent transactions found</p>
            )}
          </div>
        </div>
      </div>

      {/* Referral Network List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">Referral Network Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Orders</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Income Generated</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dsAnalytics.referralNetwork.slice(0, 10).map((ref, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{ref.name}</p>
                    <p className="text-[10px] text-gray-400">Joined {new Date(ref.lastOrderDate || Date.now()).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-black text-gray-600">{ref.orderCount}</td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-blue-600">৳{ref.bonusEarned}</p>
                    {ref.pendingBonus > 0 && <p className="text-[10px] text-amber-500 font-bold">৳{ref.pendingBonus} pending</p>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${ref.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {ref.isActive ? 'Active' : 'Idle'}
                    </span>
                  </td>
                </tr>
              ))}
              {dsAnalytics.referralNetwork.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-xs italic">No referral network data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAnalytics;
