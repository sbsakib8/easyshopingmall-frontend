import { Save } from "lucide-react";
import { isModuleFree, resolveVideoTypeForModule } from "./videoManagementHelpers";

export default function VideoForm({
  videoFormData,
  setVideoFormData,
  previewUrl,
  modules,
  courses,
  onSubmit,
  actionLoading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {previewUrl && (
        <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-slate-800 relative group">
          <iframe
            src={previewUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Parent Module
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={videoFormData.moduleId || ""}
            onChange={(e) => {
              const modId = e.target.value;
              const nextVideoType = resolveVideoTypeForModule(
                videoFormData.videoType,
                modId,
                modules,
                courses,
              );
              setVideoFormData({
                ...videoFormData,
                moduleId: modId,
                videoType: nextVideoType,
              });
            }}
          >
            <option value="">
              None (Standalone Video - Standard or Demo)
            </option>
            {modules.map((m) => {
              const parentCourse = courses.find(
                (c) => String(c._id) === String(m.courseId),
              );
              return (
                <option key={m._id} value={String(m._id)}>
                  {parentCourse ? `${parentCourse.title} > ` : ""}
                  {m.title}
                </option>
              );
            })}
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Video Title
          </label>
          <input
            type="text"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={videoFormData.title}
            onChange={(e) =>
              setVideoFormData({
                ...videoFormData,
                title: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            YouTube URL
          </label>
          <input
            type="text"
            required
            placeholder="https://youtu.be/..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={videoFormData.url}
            onChange={(e) =>
              setVideoFormData({
                ...videoFormData,
                url: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Access Type
          </label>
          <select
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={videoFormData.videoType}
            onChange={(e) =>
              setVideoFormData({
                ...videoFormData,
                videoType: e.target.value,
              })
            }
          >
            {(() => {
              if (!videoFormData.moduleId) {
                return (
                  <>
                    <option value="standard">
                      Standard (Public Marketing)
                    </option>
                    <option value="demo">
                      Demo (Public Preview)
                    </option>
                  </>
                );
              }
              const freeModule = isModuleFree(
                videoFormData.moduleId,
                modules,
                courses,
              );
              if (freeModule) {
                return (
                  <option value="free">
                    Free (For Free Course Module)
                  </option>
                );
              }
              return (
                <option value="premium">
                  Premium (For Premium Course Module)
                </option>
              );
            })()}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-y"
            value={videoFormData.description}
            onChange={(e) =>
              setVideoFormData({
                ...videoFormData,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={actionLoading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          <Save size={16} />{" "}
          {actionLoading ? "Saving..." : "Save Video"}
        </button>
      </div>
    </form>
  );
}
