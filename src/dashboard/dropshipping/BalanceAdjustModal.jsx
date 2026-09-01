"use client";

import { useState } from "react";
import { Modal, Backdrop } from "@mui/material";
import {
  X,
  DollarSign,
  Minus,
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { adjustBalance } from "@/src/hook/useBalanceTransaction";

export default function BalanceAdjustModal({ open, onClose, user, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("manual_deduct");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    if (type !== "manual_credit" && (user.balance || 0) < numAmount) {
      toast.error(`Insufficient balance. Current: ৳${(user.balance || 0).toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      const res = await adjustBalance({
        userId: user._id,
        amount: numAmount,
        type,
        reason: reason.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        setAmount("");
        setReason("");
        setType("manual_deduct");
        onSuccess?.(res.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to adjust balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      className="flex items-center justify-center p-4"
    >
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Adjust Balance</h2>
              <p className="text-gray-400 text-sm">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Balance */}
        <div className="px-6 pt-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Current Balance
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              ৳{(user.balance || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("manual_deduct")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  type === "manual_deduct"
                    ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Minus className="w-4 h-4" />
                Deduct
              </button>
              <button
                type="button"
                onClick={() => setType("manual_credit")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  type === "manual_credit"
                    ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <Plus className="w-4 h-4" />
                Credit
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Amount (৳)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g., Courier double charged delivery fee for order #12345"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              required
            />
          </div>

          {/* Warning for deduct */}
          {type !== "manual_credit" && amount && parseFloat(amount) > 0 && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-300 text-xs">
                Deducting ৳{parseFloat(amount).toLocaleString()} will{" "}
                {parseFloat(amount) > (user.balance || 0)
                  ? "exceed current balance"
                  : `bring balance to ৳${((user.balance || 0) - parseFloat(amount)).toLocaleString()}`}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              type === "manual_deduct"
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : type === "manual_deduct" ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {loading
              ? "Processing..."
              : type === "manual_deduct"
                ? "Deduct Balance"
                : "Credit Balance"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
