import { Save } from "lucide-react";

export default function ModuleForm({
  moduleFormData,
  setModuleFormData,
  courses,
  onSubmit,
  actionLoading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Parent Course
          </label>
          <select
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={moduleFormData.courseId}
            onChange={(e) =>
              setModuleFormData({
                ...moduleFormData,
                courseId: e.target.value,
              })
            }
          >
            <option value="" disabled>
              Select a Course
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Module Title
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={moduleFormData.title}
            onChange={(e) =>
              setModuleFormData({
                ...moduleFormData,
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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32 resize-y"
            value={moduleFormData.description}
            onChange={(e) =>
              setModuleFormData({
                ...moduleFormData,
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="flex items-center md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={moduleFormData.isActive}
                onChange={(e) =>
                  setModuleFormData({
                    ...moduleFormData,
                    isActive: e.target.checked,
                  })
                }
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Active
            </span>
          </label>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={actionLoading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          <Save size={16} />{" "}
          {actionLoading ? "Saving..." : "Save Module"}
        </button>
      </div>
    </form>
  );
}
