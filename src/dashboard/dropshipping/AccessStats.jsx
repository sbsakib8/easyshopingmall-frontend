import { cn } from "@/src/utlis/utils";
import { Loader2 } from "lucide-react";

const AccessStats = ({ stats, loading }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 md:p-6 hover:bg-slate-800 transition-all group text-center",
      )}
    >
      <div className="flex justify-center">
        <div
          className={`p-4 bg-${stats.color}-500/10 text-${stats.color}-400 rounded-2xl transition-transform`}
        >
          <stats.icon />
        </div>
      </div>

      {loading ? (
        <span className="flex justify-center items-center">
          <Loader2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tighter tabular-nums animate-spin" />
        </span>
      ) : (
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tighter tabular-nums">
          {stats.prefix && stats.prefix}
          {stats.value}
        </p>
      )}

      <span className="text-xs sm:text-sm md:text-base font-medium text-slate-400 uppercase tracking-widest block mt-auto">
        {stats.label}
      </span>
    </div>
  );
};

export default AccessStats;
