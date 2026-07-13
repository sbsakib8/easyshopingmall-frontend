import { cn } from "@/src/utlis/utils";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Search,
  User,
  Video,
  X,
} from "lucide-react";
import { statusColors } from "./useVideoAccessManagement";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";

const CoursePurchaseRequestSkeleton = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 md:p-6 flex flex-col justify-between gap-4 h-full overflow-hidden animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-700/50 flex-shrink-0" />
          <div className="min-w-0">
            <div className="h-4 w-28 bg-slate-700/50 rounded-lg mb-1.5" />
            <div className="h-2 w-20 bg-slate-700/50 rounded" />
          </div>
        </div>
        <div className="w-20 h-5 bg-slate-700/50 rounded-full" />
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-2.5 flex items-center gap-2">
        <div className="w-3.5 h-3.5 bg-slate-700/50 rounded shrink-0" />
        <div className="h-3 w-32 bg-slate-700/50 rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 space-y-1.5">
          <div className="h-2 w-20 bg-slate-700/50 rounded" />
          <div className="h-3 w-24 bg-slate-700/50 rounded" />
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 space-y-1.5">
          <div className="h-2 w-16 bg-slate-700/50 rounded" />
          <div className="h-3 w-20 bg-slate-700/50 rounded" />
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 space-y-1.5">
          <div className="h-2 w-18 bg-slate-700/50 rounded" />
          <div className="h-3 w-28 bg-slate-700/50 rounded" />
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 space-y-1.5">
          <div className="h-2 w-20 bg-slate-700/50 rounded" />
          <div className="h-3 w-24 bg-slate-700/50 rounded" />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-2xl w-fit">
        <div className="w-3.5 h-3.5 bg-slate-700/50 rounded" />
        <div className="h-3 w-32 bg-slate-700/50 rounded" />
      </div>

      <div className="flex items-center justify-end gap-3 mt-auto">
        <div className="h-9 w-32 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl" />
        <div className="w-9 h-9 bg-slate-700/50 rounded-2xl" />
      </div>

      <div className="p-4 bg-slate-900/50 rounded-2xl border-l-4 border-emerald-500/30 space-y-1.5">
        <div className="h-2 w-16 bg-slate-700/50 rounded" />
        <div className="h-3 w-full bg-slate-700/50 rounded" />
        <div className="h-3 w-3/4 bg-slate-700/50 rounded" />
      </div>
    </div>
  );
};

const AccessRequestTable = ({
  loading,
  filteredRequests,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  actionLoading,
  triggerUpdateStatus,
}) => {
  const { canModify } = useDashboardPermission();
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, TxID or sender number..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-2 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-semibold text-xs sm:text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest transition-all border",
                {
                  "bg-emerald-600 border-emerald-500 text-white shadow-lg":
                    filterStatus === status,
                  "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800":
                    filterStatus !== status,
                },
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <CoursePurchaseRequestSkeleton key={index} />
          ))
        ) : filteredRequests.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-14 opacity-20">
            <Search size={64} className="mb-4" />
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              No access requests found
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 md:p-6 hover:bg-slate-800/70 transition-all group flex flex-col justify-between gap-4 h-full overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 text-sm leading-tight truncate">
                      {req.userId?.name}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                      {req.userId?.email}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[8px] font-semibold uppercase tracking-widest whitespace-nowrap ${statusColors[req.status]}`}
                >
                  {req.status}
                </div>
              </div>

              {req.courseId?.title && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-2.5 flex items-center gap-2">
                  <Video size={14} className="text-indigo-400 shrink-0" />
                  <span className="text-[11px] font-bold text-indigo-300 truncate">
                    {req.courseId.title}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                    Payment Method
                  </p>
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 capitalize">
                    <ArrowUpRight size={12} /> {req.paymentMethod}
                  </p>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                    Paid Amount
                  </p>
                  <p className="text-xs font-semibold text-white">
                    ৳{req.amount}
                  </p>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                    Sender Number
                  </p>
                  <p className="text-xs font-semibold text-slate-200">
                    {req.senderNumber}
                  </p>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-2.5 border border-white/5 overflow-hidden">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1 overflow-hidden text-wrap">
                    Transaction ID
                  </p>
                  <p className="text-xs font-semibold text-slate-200 select-all cursor-copy">
                    {req.transactionId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-900/50 px-3 py-2 rounded-2xl w-fit">
                <Calendar size={14} />
                {new Date(req.createdAt).toLocaleString()}
              </div>

              {req.status === "pending" && canModify("dropshipping") && (
                <div className="flex items-center justify-end gap-3 mt-auto">
                  <button
                    onClick={() => triggerUpdateStatus(req._id, "approved")}
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-3 rounded-2xl text-xs font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check size={16} /> Approve Access
                  </button>

                  <button
                    onClick={() => triggerUpdateStatus(req._id, "rejected")}
                    disabled={actionLoading}
                    className="px-3 py-2 bg-slate-900/70 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all border border-white/5 disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {req.adminNote && (
                <div className="p-4 bg-slate-900/50 rounded-2xl border-l-4 border-emerald-500">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium mb-1">
                    Admin Note
                  </p>
                  <p className="text-xs text-slate-300 italic">
                    &quot;{req.adminNote}&quot;
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessRequestTable;
