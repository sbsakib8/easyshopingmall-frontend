"use client";

import { Backdrop, Modal } from "@mui/material";
import { useRef } from "react";

const BannerEditModal = ({
  isOpen,
  onClose,
  editingBanner = {},
  formData,
  setFormData,
  onSubmit,
}) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
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
      <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-gray-700/50">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {editingBanner ? "✏️ Edit Banner" : "✨ Create New Banner"}
          </h2>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Banner Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Banner Images
            </label>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="images/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 flex items-center justify-center gap-3 font-semibold"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                📸 Upload Images
              </button>
              {formData.images && (
                <div className="relative">
                  <img
                    src={formData.images || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border border-gray-700/50"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Link URL
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Description
            </label>
            <textarea
              value={formData.Description}
              onChange={(e) =>
                setFormData({ ...formData, Description: e.target.value })
              }
              rows={4}
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-slate-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
              placeholder="Enter banner Description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-600/50 to-gray-700/50 border border-gray-600/50 text-gray-200 rounded-xl font-semibold hover:from-gray-500/60 hover:to-gray-600/60 transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-slate-300 rounded-xl font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:shadow-2xl hover:shadow-purple-500/25"
            >
              {editingBanner ? "💾 Update Banner" : "✨ Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BannerEditModal;
