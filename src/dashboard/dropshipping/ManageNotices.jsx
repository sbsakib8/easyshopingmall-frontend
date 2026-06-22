"use client";

import { useAllNotices, createNotice, updateNotice, deleteNotice, toggleNoticeStatus } from "@/src/hook/useNotice";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
  ExternalLink,
  GripVertical,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";

const emptyForm = {
  title: "",
  description: "",
  keyPoints: [],
  button: { text: "", color: "#1976d2", url: "" },
  isActive: true,
  priority: 0,
};

const ManageNotices = () => {
  const { canModify } = useDashboardPermission();
  const { notices, loading, refetch } = useAllNotices();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newKeyPoint, setNewKeyPoint] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("button.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        button: { ...prev.button, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addKeyPoint = () => {
    if (newKeyPoint.trim() && !form.keyPoints.includes(newKeyPoint.trim())) {
      setForm((prev) => ({
        ...prev,
        keyPoints: [...prev.keyPoints, newKeyPoint.trim()],
      }));
      setNewKeyPoint("");
    }
  };

  const removeKeyPoint = (pointToRemove) => {
    setForm((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((point) => point !== pointToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        priority: Number(form.priority) || 0,
        keyPoints: form.keyPoints || [],
        button: {
          text: form.button.text || null,
          color: form.button.color || "#1976d2",
          url: form.button.url || null,
        },
      };

      let res;
      if (editingId) {
        res = await updateNotice(editingId, payload);
      } else {
        res = await createNotice(payload);
      }

      if (res.success) {
        toast.success(editingId ? "Notice updated" : "Notice created");
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        refetch();
      } else {
        toast.error(res.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      description: notice.description,
      keyPoints: notice.keyPoints || [],
      button: {
        text: notice.button?.text || "",
        color: notice.button?.color || "#1976d2",
        url: notice.button?.url || "",
      },
      isActive: notice.isActive,
      priority: notice.priority || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteNotice(id);
      if (res.success) {
        toast.success("Notice deleted");
        setDeleteConfirm(null);
        refetch();
      }
    } catch (err) {
      toast.error("Failed to delete notice");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleNoticeStatus(id);
      if (res.success) {
        toast.success(res.message);
        refetch();
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-purple-500/10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
                Manage{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Notices
                </span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Control notices shown to dropshipping users in their dashboard overview
              </p>
            </div>
            {canModify("dropshipping") && (
            <button
              onClick={openCreateForm}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Notice
            </button>
            )}
          </div>
        </div>

        {/* Notices List */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-slate-300">
                All Notices ({loading ? "..." : notices.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No notices yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create a notice to display in dropshipping user dashboard
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice._id}
                    className={`rounded-2xl p-5 border transition-all ${
                      notice.isActive
                        ? "bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-gray-600 hover:border-purple-500/50"
                        : "bg-gray-800/30 border-gray-700/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <GripVertical className="w-5 h-5 text-gray-500 mt-1 shrink-0 hidden sm:block" />
                        <div className="p-2 bg-purple-500/20 rounded-xl shrink-0">
                          <Bell className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-300">
                              {notice.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                notice.isActive
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                              }`}
                            >
                              {notice.isActive ? "Active" : "Inactive"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              Priority: {notice.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {notice.description}
                          </p>
                          {notice.keyPoints?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {notice.keyPoints.map((point, i) => (
                                <span
                                  key={i}
                                  className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                >
                                  {point}
                                </span>
                              ))}
                            </div>
                          )}
                          {notice.button?.text && notice.button?.url && (
                            <a
                              href={notice.button.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-lg text-xs font-bold text-white hover:opacity-80"
                              style={{ backgroundColor: notice.button.color || "#1976d2" }}
                            >
                              {notice.button.text}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {canModify("dropshipping") && (
                        <>
                        <button
                          onClick={() => handleToggle(notice._id)}
                          className={`p-2 rounded-xl transition-colors ${
                            notice.isActive
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                          }`}
                          title={notice.isActive ? "Deactivate" : "Activate"}
                        >
                          {notice.isActive ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(notice)}
                          className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(notice._id)}
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold">
                      {editingId ? "Edit Notice" : "Create Notice"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Notice title..."
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Notice description..."
                    rows={3}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Key Highlights */}
                <div className="border-t border-gray-700 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-gray-300">
                      Key Highlights (Optional)
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyPoint}
                      onChange={(e) => setNewKeyPoint(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyPoint();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="Add a highlight and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addKeyPoint}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 flex items-center gap-1 font-medium text-sm transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {form.keyPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.keyPoints.map((point) => (
                        <span
                          key={point}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
                        >
                          <Sparkles size={10} className="text-purple-400" />
                          {point}
                          <button
                            type="button"
                            onClick={() => removeKeyPoint(point)}
                            className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Short highlight points displayed as chips in the notice
                  </p>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Priority (higher = shown first)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-bold text-gray-300">
                    Active:
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.isActive ? "bg-purple-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        form.isActive ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-400">
                    {form.isActive ? "Visible to users" : "Hidden from users"}
                  </span>
                </div>

                {/* Button Section */}
                <div className="border-t border-gray-700 pt-5">
                  <h4 className="text-sm font-bold text-gray-300 mb-3">
                    Button (Optional)
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        name="button.text"
                        value={form.button.text}
                        onChange={handleChange}
                        placeholder="e.g., Learn More"
                        className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Button URL
                      </label>
                      <input
                        type="url"
                        name="button.url"
                        value={form.button.url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Button Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="button.color"
                          value={form.button.color}
                          onChange={handleChange}
                          className="w-10 h-10 rounded-lg border border-gray-600 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          name="button.color"
                          value={form.button.color}
                          onChange={handleChange}
                          placeholder="#1976d2"
                          className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  {canModify("dropshipping") && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Notice"
                    ) : (
                      "Create Notice"
                    )}
                  </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500/30 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-300">
                  Delete Notice
                </h2>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this notice? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageNotices;
