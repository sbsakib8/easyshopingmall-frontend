import { DollarSign, Clock, Target, TrendingUp } from "lucide-react";

const MyStatsCards = ({ summary, data, dsLoading }) => {
  const kpis = [
    {
      label: "Available Balance",
      value: summary?.currentBalance || data?.balance || 0,
      icon: Target,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
      trend: "Includes video & sales bonuses",
      isPrimary: true,
    },
    {
      label: "Total Sales Profit",
      value: summary?.totalProfit || 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "Historical sales earnings",
    },
    {
      label: "Pending Revenue",
      value: summary?.pendingProfit || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      trend: "Awaiting approval/delivery",
    },
    {
      label: "Referral Income",
      value: summary?.referralIncome || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "Network & Video referrals",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`${kpi.bg} p-6 rounded-[2.5rem] border ${kpi.border} relative overflow-hidden group transition-transform shadow-sm ${kpi.isPrimary ? "ring-2 ring-teal-500/20 ring-offset-2" : ""}`}
        >
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-gray-400 max-w-[120px] text-right leading-tight">
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-1">
                {dsLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <span className={`text-3xl font-black ${kpi.color}`}>
                    ৳{kpi.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${kpi.color.replace("text", "bg")} blur-2xl`}
          />
        </div>
      ))}
    </div>
  );
};

export default MyStatsCards;
