import { Users } from "lucide-react";

const ReferralNetworkTable = ({
  dsLoading,
  dsAnalytics,
  referralTab,
  setReferralTab,
  summary,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="font-black text-gray-900 uppercase tracking-tight">
            Referral Network
          </h3>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100/50 w-full sm:w-auto">
          <button
            onClick={() => setReferralTab("partners")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              referralTab === "partners"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Partners ({summary?.referralCount})
          </button>
          <button
            onClick={() => setReferralTab("video_buyers")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              referralTab === "video_buyers"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Video Buyers ({(dsAnalytics?.videoReferrals || []).length})
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto scrollbar-hide overflow-x-auto">
        {referralTab === "partners" ? (
          <table className="w-full text-left min-w-[600px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Partner
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Sales
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Income
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dsLoading ? (
                <>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-200" />
                          <div>
                            <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                            <div className="h-3 w-20 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="h-5 w-10 bg-slate-200 rounded-lg mx-auto" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="h-4 w-20 bg-slate-200 rounded ml-auto mb-2" />
                        <div className="h-3 w-24 bg-slate-200 rounded ml-auto" />
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="h-6 w-20 bg-slate-200 rounded-full mx-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {dsAnalytics.referralNetwork.map((ref, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs">
                            {ref.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {ref.name}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              Joined{" "}
                              {new Date(
                                ref.lastOrderDate || Date.now(),
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                          {ref.orderCount}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-black text-blue-600">
                          ৳{ref.bonusEarned.toLocaleString()}
                        </p>
                        {ref.pendingBonus > 0 && (
                          <p className="text-[10px] text-amber-500 font-black tracking-tighter">
                            ৳{ref.pendingBonus.toLocaleString()} pending
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ref.isActive
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${ref.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {ref.isActive ? "Active" : "Idle"}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {dsAnalytics?.referralNetwork?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <Users className="w-10 h-10" />
                          <p className="text-xs font-black uppercase tracking-widest">
                            No Referral Data
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Buyer
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Course Purchased
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Paid Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Bonus Earned
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dsLoading ? (
                <>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-200" />
                          <div>
                            <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                            <div className="h-3 w-36 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="h-5 w-16 bg-slate-200 rounded-lg mx-auto" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="h-6 w-20 bg-slate-200 rounded-full mx-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {dsAnalytics?.videoReferrals?.map((ref, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                            {ref.buyerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {ref.buyerName}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[180px]">
                              {ref.buyerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-700 max-w-[220px] truncate">
                          {ref.courseTitle}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                          ৳{ref.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-black text-emerald-600">
                          ৳{ref.bonusAmount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ref.status === "approved"
                              ? "bg-emerald-100 text-emerald-600"
                              : ref.status === "pending"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ref.status === "approved"
                                ? "bg-emerald-500"
                                : ref.status === "pending"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {ref.status}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!dsAnalytics?.videoReferrals ||
                    (dsAnalytics?.videoReferrals?.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-8 py-20 text-center"
                        >
                          <div className="flex flex-col items-center gap-3 opacity-30">
                            <Users className="w-10 h-10" />
                            <p className="text-xs font-black uppercase tracking-widest">
                              No Video Referrals Data
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReferralNetworkTable;
