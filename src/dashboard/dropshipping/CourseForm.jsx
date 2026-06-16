import { Save } from "lucide-react";

export default function CourseForm({
  courseType,
  setCourseType,
  courseFormData,
  setCourseFormData,
  onSubmit,
  actionLoading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Course Access Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setCourseType("free");
                setCourseFormData({
                  ...courseFormData,
                  price: 0,
                  discountPrice: 0,
                  referralBonus: 0,
                });
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                courseType === "free"
                  ? "bg-blue-500/10 border-blue-500/80 ring-2 ring-blue-500/20"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-200">
                  Free Course
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${courseType === "free" ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}
                >
                  {courseType === "free" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Free for all registered dropshipping users.
              </p>
            </div>

            <div
              onClick={() => {
                setCourseType("paid");
                if (courseFormData.price === 0) {
                  setCourseFormData({
                    ...courseFormData,
                    price: 500,
                    discountPrice: 0,
                    referralBonus: 0,
                  });
                }
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                courseType === "paid"
                  ? "bg-blue-500/10 border-blue-500/80 ring-2 ring-blue-500/20"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-200">
                  Paid / Premium Course
                </span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${courseType === "paid" ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}
                >
                  {courseType === "paid" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Requires premium access plan payment to unlock.
              </p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Course Title
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={courseFormData.title}
            onChange={(e) =>
              setCourseFormData({
                ...courseFormData,
                title: e.target.value,
              })
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-y"
            value={courseFormData.description}
            onChange={(e) =>
              setCourseFormData({
                ...courseFormData,
                description: e.target.value,
              })
            }
          />
        </div>

        {courseType === "paid" ? (
          <>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Price (৳)
              </label>
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                <span className="absolute left-4 top-3 text-slate-500">
                  ৳
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={courseFormData.price}
                  onChange={(e) =>
                    setCourseFormData({
                      ...courseFormData,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Discount Price (৳)
              </label>
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                <span className="absolute left-4 top-3 text-slate-500">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={courseFormData.discountPrice}
                  onChange={(e) =>
                    setCourseFormData({
                      ...courseFormData,
                      discountPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Referral Bonus (৳)
              </label>
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                <span className="absolute left-4 top-3 text-slate-500">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={courseFormData.referralBonus}
                  onChange={(e) =>
                    setCourseFormData({
                      ...courseFormData,
                      referralBonus: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-[10px] font-black text-slate-500/50 uppercase tracking-widest mb-2">
              Price (৳)
            </label>
            <div className="relative opacity-50 cursor-not-allowed">
              <span className="absolute left-4 top-3 text-slate-500">
                ৳
              </span>
              <input
                type="text"
                disabled
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-400 outline-none"
                value="Free (0 ৳)"
              />
            </div>
          </div>
        )}

        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={courseFormData.isActive}
                onChange={(e) =>
                  setCourseFormData({
                    ...courseFormData,
                    isActive: e.target.checked,
                  })
                }
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Published
            </span>
          </label>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={actionLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <Save size={16} />{" "}
          {actionLoading ? "Saving..." : "Save Course"}
        </button>
      </div>
    </form>
  );
}
