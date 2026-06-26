"use client";

import Container from "@/src/compronent/shared/Container";
import { cn } from "@/src/utlis/utils";
import {
  Check,
  Clock,
  CreditCard,
  DollarSign,
  Film,
  Hash,
  ShieldCheck,
  X,
} from "lucide-react";
import useVideoAccessManagement from "./useVideoAccessManagement";
import AccessStats from "./AccessStats";
import AccessRequestTable from "./AccessRequestTable";
import CustomRequestsTab from "./CustomRequestsTab";
import { tabs } from "./useVideoAccessManagement";
import { Backdrop, Modal } from "@mui/material";

const VideoAccessManagement = () => {
  const {
    activeTab,
    setActiveTab,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    actionLoading,
    loadingCustom,
    customSearchTerm,
    setCustomSearchTerm,
    customFilterStatus,
    setCustomFilterStatus,
    deliveredUrlInput,
    setDeliveredUrlInput,
    adminNoteInput,
    setAdminNoteInput,
    actionConfirm,
    setActionConfirm,
    filteredRequests,
    filteredCustomRequests,
    stats,
    customStats,
    triggerUpdateStatus,
    triggerUpdateCustomRequest,
    handleConfirm,
    fetchAllCustomRequests,
  } = useVideoAccessManagement();

  return (
    <section className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 md:py-16">
      <Container className="space-y-10 overflow-hidden">
        {/* Header with Tab Switcher */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 md:p-7 lg:p-9 shadow-2xl overflow-hidden relative group flex flex-col xl:flex-row xl:items-center justify-between gap-5 lg:gap-8">
          <div className="relative z-10 flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 uppercase tracking-tight leading-tight">
              Dropshipping <span className="text-emerald-400">Media</span> Admin
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              Verify premium access payments and dispatch custom high-converting
              ad videos.
            </p>
          </div>

          <div className="self-end bg-white/5 backdrop-blur-md rounded-2xl flex relative z-10 lg:w-auto lg:min-w-[420px] w-min">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={loading || loadingCustom}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[min(10px,2.3vw)] md:text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap flex-1 sm:flex-none",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                <tab.icon size={14} className="hidden sm:inline-block" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: PREMIUM COURSE ACCESS VERIFICATION */}
        {activeTab === "premium_access" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                {
                  label: "Total Requests",
                  value: stats.total ?? 0,
                  icon: Hash,
                  color: "emerald",
                  prefix: "",
                },
                {
                  label: "Pending Approval",
                  value: stats.pending ?? 0,
                  icon: Clock,
                  color: "amber",
                  prefix: "",
                },
                {
                  label: "Approved Users",
                  value: stats.approved ?? 0,
                  icon: ShieldCheck,
                  color: "teal",
                  prefix: "",
                },
                {
                  label: "Total Revenue",
                  value: stats.revenue.toLocaleString() ?? 0,
                  icon: DollarSign,
                  color: "purple",
                  prefix: "৳",
                },
              ].map((stat, i) => (
                <AccessStats key={i} stats={stat} loading={loading} />
              ))}
            </div>

            <AccessRequestTable
              loading={loading}
              filteredRequests={filteredRequests}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              actionLoading={actionLoading}
              triggerUpdateStatus={triggerUpdateStatus}
            />
          </div>
        )}

        {/* TAB 2: CUSTOM DROPSHIPPER VIDEO REQUESTS */}
        {activeTab === "custom_requests" && (
          <CustomRequestsTab
            customStats={customStats}
            customSearchTerm={customSearchTerm}
            setCustomSearchTerm={setCustomSearchTerm}
            customFilterStatus={customFilterStatus}
            setCustomFilterStatus={setCustomFilterStatus}
            filteredCustomRequests={filteredCustomRequests}
            loadingCustom={loadingCustom}
            fetchAllCustomRequests={fetchAllCustomRequests}
            deliveredUrlInput={deliveredUrlInput}
            setDeliveredUrlInput={setDeliveredUrlInput}
            adminNoteInput={adminNoteInput}
            setAdminNoteInput={setAdminNoteInput}
            triggerUpdateCustomRequest={triggerUpdateCustomRequest}
            actionLoading={actionLoading}
          />
        )}
      </Container>

      {/* Custom Confirmation Modal */}
        <Modal
          open={actionConfirm.show}
          onClose={() => setActionConfirm((prev) => ({ ...prev, show: false }))}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(4px)",
              },
            },
          }}
          className="flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-md overflow-hidden bg-slate-900/90 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <button
              onClick={() =>
                setActionConfirm((prev) => ({ ...prev, show: false }))
              }
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col items-center text-center mt-2 space-y-4">
              <div
                className={cn(
                  "p-4 rounded-2xl",
                  actionConfirm.status === "approved" ||
                    actionConfirm.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : actionConfirm.status === "rejected"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400",
                )}
              >
                {actionConfirm.status === "approved" ||
                actionConfirm.status === "completed" ? (
                  <Check size={28} />
                ) : actionConfirm.status === "rejected" ? (
                  <X size={28} />
                ) : (
                  <Clock size={28} />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                  Confirm Action
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium px-2">
                  {actionConfirm.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() =>
                  setActionConfirm((prev) => ({ ...prev, show: false }))
                }
                className="flex-1 py-3 px-4 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 rounded-2xl text-xs md:text-sm font-semibold transition-all hover:text-white text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 py-3 px-4 text-xs md:text-sm font-semibold text-white rounded-2xl transition-all shadow-lg",
                  actionConfirm.status === "approved" ||
                    actionConfirm.status === "completed"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20"
                    : actionConfirm.status === "rejected"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/20"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20",
                )}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </Modal>
    </section>
  );
};

export default VideoAccessManagement;
