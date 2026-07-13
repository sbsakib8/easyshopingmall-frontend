"use client";

import {
  DropshippingOrderUpdate,
  UpdateOrderKeyPoints,
} from "@/src/utlis/useOrder";
import { Backdrop, Modal } from "@mui/material";
import {
  Calendar,
  FileText,
  Loader2,
  Package,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "from-yellow-400 to-orange-400",
  },
  {
    value: "processing",
    label: "Processing",
    color: "from-blue-500 to-cyan-500",
  },
  { value: "shipped", label: "Shipped", color: "from-purple-500 to-pink-500" },
  {
    value: "delivered",
    label: "Delivered",
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "completed",
    label: "Completed",
    color: "from-green-500 to-emerald-500",
  },
  { value: "cancelled", label: "Cancelled", color: "from-red-500 to-rose-500" },
  { value: "return", label: "Return", color: "from-orange-500 to-amber-500" },
];

const DropshippingStatusUpdateModal = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!order) return null;

  const [status, setStatus] = useState(order?.order_status || "pending");
  const [note, setNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [shippedBy, setShippedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyPoints, setKeyPoints] = useState(order?.keyPoints || []);
  const [newKeyPoint, setNewKeyPoint] = useState("");
  const [updatingKeyPoints, setUpdatingKeyPoints] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const statusData = {
        status,
        note: note || undefined,
        trackingNumber: trackingNumber || undefined,
        estimatedDelivery: estimatedDelivery || undefined,
        shippedBy: shippedBy || undefined,
      };

      const res = await DropshippingOrderUpdate(order._id, statusData);

      if (res.success) {
        toast.success(`Order status updated to "${status}"`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const addKeyPoint = () => {
    if (!newKeyPoint.trim()) return;
    if (keyPoints.includes(newKeyPoint.trim())) return;
    const updated = [...keyPoints, newKeyPoint.trim()];
    saveKeyPoints(updated);
  };

  const removeKeyPoint = (point) => {
    const updated = keyPoints.filter((p) => p !== point);
    saveKeyPoints(updated);
  };

  const saveKeyPoints = async (updated) => {
    setUpdatingKeyPoints(true);
    try {
      const res = await UpdateOrderKeyPoints(order._id, updated);
      if (res.success) {
        setKeyPoints(updated);
        setNewKeyPoint("");
        toast.success("Key highlights updated");
      } else {
        toast.error(res.message || "Failed to update highlights");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update highlights");
    } finally {
      setUpdatingKeyPoints(false);
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
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Update Dropshipping Order</h2>
                <p className="text-blue-200 text-sm">{order.orderId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-5">
            {/* Status Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Package className="w-4 h-4 text-blue-400" />
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Status Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status update..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tracking Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Truck className="w-4 h-4 text-green-400" />
                Tracking Number (Optional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., BD-TRACK-123456"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estimated Delivery */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Estimated Delivery Date (Optional)
              </label>
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Shipped By */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <User className="w-4 h-4 text-cyan-400" />
                Shipped By (Optional)
              </label>
              <input
                type="text"
                value={shippedBy}
                onChange={(e) => setShippedBy(e.target.value)}
                placeholder="e.g., Staff name or courier service"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Key Highlights */}
            <div className="pt-4 border-t border-gray-600">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Key Highlights
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyPoint}
                  onChange={(e) => setNewKeyPoint(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addKeyPoint())
                  }
                  placeholder="Add a highlight and press Enter"
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addKeyPoint}
                  disabled={!newKeyPoint.trim() || updatingKeyPoints}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              {keyPoints.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {keyPoints.map((point, i) => (
                    <span
                      key={i}
                      className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
                    >
                      {point}
                      <button
                        type="button"
                        onClick={() => removeKeyPoint(point)}
                        disabled={updatingKeyPoints}
                        className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DropshippingStatusUpdateModal;
