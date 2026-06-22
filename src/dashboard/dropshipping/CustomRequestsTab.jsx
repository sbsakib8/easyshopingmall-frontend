import { cn } from "@/src/utlis/utils";
import {
  Check,
  Clock,
  ExternalLink,
  Film,
  Link2,
  RefreshCw,
  Search,
  User,
  Video,
  FileText,
} from "lucide-react";
import { statusColors, customRequestTypeLabels } from "./useVideoAccessManagement";
import AccessStats from "./AccessStats";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";

const CustomRequestsTab = ({
  customStats,
  customSearchTerm,
  setCustomSearchTerm,
  customFilterStatus,
  setCustomFilterStatus,
  filteredCustomRequests,
  loadingCustom,
  fetchAllCustomRequests,
  deliveredUrlInput,
  setDeliveredUrlInput,
  adminNoteInput,
  setAdminNoteInput,
  triggerUpdateCustomRequest,
  actionLoading,
}) => {
  const { canModify } = useDashboardPermission();
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Video Orders",
            value: customStats.total ?? 0,
            icon: Film,
            color: "indigo",
          },
          {
            label: "Pending Processing",
            value: customStats.pending ?? 0,
            icon: Clock,
            color: "amber",
          },
          {
            label: "Completed Ads Delivered",
            value: customStats.completed ?? 0,
            icon: Check,
            color: "emerald",
          },
        ].map((stat, i) => (
          <AccessStats key={i} stats={stat} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by user name, email, or product name..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-2 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-200 placeholder-slate-500 font-semibold text-xs sm:text-sm md:text-base"
            value={customSearchTerm}
            onChange={(e) => setCustomSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {["all", "pending", "approved", "completed", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setCustomFilterStatus(status)}
                className={cn(
                  "px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-[8px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest transition-all border",
                  {
                    "bg-emerald-600 border-emerald-500 text-white shadow-lg":
                      customFilterStatus === status,
                    "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800":
                      customFilterStatus !== status,
                  },
                )}
              >
                {status}
              </button>
            ),
          )}
        </div>

        <button
          onClick={fetchAllCustomRequests}
          className="w-max p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-colors text-slate-400 hover:text-white"
          title="Refresh"
        >
          <RefreshCw
            size={20}
            className={cn("size-4 md:size-5", {
              "animate-spin": loadingCustom,
            })}
          />
        </button>
      </div>

      <div className="space-y-6">
        {filteredCustomRequests.map((req) => (
          <div
            key={req._id}
            className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-6 lg:p-8 hover:bg-slate-800/40 transition-all flex flex-col lg:flex-row gap-8 justify-between"
          >
            <div className="flex-1 space-y-5 md:space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-800 border border-slate-700/50 text-emerald-400 px-3 py-1.5 rounded-2xl text-[9px] md:text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
                    {customRequestTypeLabels[req.videoType] ||
                      req.videoType}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>

                <div
                  className={`px-4 py-1.5 rounded-full text-[9px] md:text-xs font-semibold uppercase tracking-widest whitespace-nowrap ${statusColors[req.status] || "bg-slate-700 text-white"}`}
                >
                  {req.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                    <User size={15} /> Dropshipper
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 text-base md:text-lg leading-tight">
                      {req.userId?.name || "Unknown Dropshipper"}
                    </p>
                    <p className="text-xs md:text-sm text-slate-400 mt-1 select-all">
                      {req.userId?.email}
                    </p>
                    {req.userId?.mobile && (
                      <p className="text-xs md:text-sm text-slate-400 mt-1 select-all">
                        {req.userId?.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-black/20 rounded-3xl p-5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                    <Video size={15} /> Target Product
                  </div>
                  <div className="flex items-center gap-4">
                    {req.productId?.images?.[0] ? (
                      <img
                        src={req.productId.images[0]}
                        alt={req.productId.productName}
                        className="w-12 h-12 object-cover rounded-2xl border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">
                        P
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-100 text-sm md:text-base line-clamp-2 leading-tight">
                        {req.productId?.productName || "Product Deleted"}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">
                        Price: ৳{req.productId?.price || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {req.notes && (
                <div className="bg-black/10 border border-white/5 rounded-3xl p-5">
                  <span className="text-[9px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">
                    CUSTOMER REQUIREMENTS & NOTES
                  </span>
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed select-all">
                    {req.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:w-96 shrink-0 flex flex-col bg-black/10 border border-white/5 rounded-3xl p-5 md:p-6 lg:p-7 h-full">
              <div className="space-y-5 flex-1">
                <h4 className="text-xs md:text-sm font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText size={16} /> Dispatch Controls
                </h4>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
                    Delivered Video URL
                  </label>
                  <div className="relative">
                    <Link2
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      size={16}
                    />
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-xs md:text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600"
                      value={deliveredUrlInput[req._id] || ""}
                      onChange={(e) =>
                        setDeliveredUrlInput({
                          ...deliveredUrlInput,
                          [req._id]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
                    Admin Note
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add an admin response note..."
                    className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl p-4 text-xs md:text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-y min-h-[100px]"
                    value={adminNoteInput[req._id] || ""}
                    onChange={(e) =>
                      setAdminNoteInput({
                        ...adminNoteInput,
                        [req._id]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-evenly gap-3">
                {[
                  ...(req.status === "completed"
                    ? [
                        {
                          label: "Open Delivered Video",
                          icon: ExternalLink,
                          onClick: () =>
                            window.open(req.deliveredVideoUrl, "_blank"),
                          variant: "secondary",
                        },
                        {
                          label: "Update Delivery Info",
                          onClick: () =>
                            triggerUpdateCustomRequest(
                              req._id,
                              "completed",
                            ),
                          variant: "primary",
                          disabled: actionLoading,
                          hidden: !canModify("dropshipping"),
                        },
                      ]
                    : [
                        ...(req.status === "pending" && canModify("dropshipping")
                          ? [
                              {
                                label: "Approve / Process",
                                onClick: () =>
                                  triggerUpdateCustomRequest(
                                    req._id,
                                    "approved",
                                  ),
                                variant: "primary",
                                disabled: actionLoading,
                              },
                            ]
                          : []),
                        ...(canModify("dropshipping")
                          ? [{
                              label: "Reject Order",
                              onClick: () =>
                                triggerUpdateCustomRequest(
                                  req._id,
                                  "rejected",
                                ),
                              variant: "danger",
                              disabled: actionLoading,
                            }]
                          : []),
                        ...(canModify("dropshipping")
                          ? [{
                              label: "Deliver Custom Ad Video",
                              icon: Check,
                              onClick: () =>
                                triggerUpdateCustomRequest(
                                  req._id,
                                  "completed",
                                ),
                              variant: "primary",
                              disabled: actionLoading,
                            }]
                          : []),
                      ]),
                ].filter(btn => !btn.hidden).map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.onClick}
                    disabled={actionLoading || btn.disabled}
                    className={cn(
                      "whitespace-nowrap py-2.5 px-2 flex-1 w-max rounded-2xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2",
                      btn.variant === "primary" &&
                        "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50",
                      btn.variant === "secondary" &&
                        "bg-slate-900 hover:bg-slate-800 text-white border border-white/10",
                      btn.variant === "danger" &&
                        "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30",
                      btn.variant === "link" &&
                        "bg-slate-900 hover:bg-slate-800 text-white border border-white/10",
                    )}
                  >
                    {btn.icon && <btn.icon size={16} />}
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredCustomRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 opacity-20">
            <Film size={64} className="mb-4" />
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest">
              No custom video orders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRequestsTab;
