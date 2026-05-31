"use client";

import {
  X,
  Wallet,
  Smartphone,
  Copy,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "axios";
import React, { useState } from "react";
import { UrlBackend } from "@/src/confic/urlExport";
import { useSelector } from "react-redux";

const manualMethods = [
  {
    id: "bkash",
    name: "Bkash",
    number: "01626420774",
    logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/bkash.png",
  },
  {
    id: "nagad",
    name: "Nagad",
    number: "01626420774",
    logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/nagad.png",
  },
  {
    id: "rocket",
    name: "Rocket",
    number: "01626420774",
    logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/rocket.png",
  },
  {
    id: "upay",
    name: "Upay",
    number: "01626420774",
    logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/upay.png",
  },
];

const PaymentModal = ({ order, paymentType, onClose, onSuccess }) => {
  const user = useSelector((state) => state.user.data);
  const [paymentMethod, setPaymentMethod] = useState("balance");
  const [selectedManualMethod, setSelectedManualMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualDetails, setManualDetails] = useState({
    transactionId: "",
    senderNumber: "",
  });

  const amountToPay =
    paymentType === "delivery" ? order.deliveryCharge : order.totalAmt;

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (paymentMethod === "balance") {
      if ((user?.balance || 0) < amountToPay) {
        toast.error("Insufficient balance!");
        return;
      }
    } else if (paymentMethod === "manual") {
      if (!selectedManualMethod) {
        toast.error("Please select a payment method!");
        return;
      }
      if (!manualDetails.transactionId) {
        toast.error("Transaction ID is required!");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload = {
        paymentMethod,
        paymentType,
        manualDetails:
          paymentMethod === "manual"
            ? {
                provider: selectedManualMethod,
                transactionId: manualDetails.transactionId,
                senderNumber: manualDetails.senderNumber || "N/A",
              }
            : undefined,
      };

      const response = await axios.post(
        `${UrlBackend}/orders/${order._id}/pay-due`,
        payload,
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Payment successful!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-lg"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg md:max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Sticky Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-7 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl md:text-2xl font-black tracking-tight">
                অর্ডার পেমেন্ট করুন
              </h2>
              <p className="text-emerald-100 text-xs md:text-sm font-medium opacity-90">
                {paymentType === "delivery"
                  ? "Delivery Charge"
                  : "Full Payment"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8">
          {/* Amount Display */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">
                Total Payable
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-emerald-900 tracking-tighter">
                ৳{amountToPay.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl border border-emerald-100 text-center sm:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Order ID
              </p>
              <p className="font-black text-slate-700 text-base">
                #{(order.orderId || order._id || "").slice(-8)}
              </p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("balance")}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-200 ${
                  paymentMethod === "balance"
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-slate-100 hover:border-emerald-200 bg-slate-50"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl transition-colors ${paymentMethod === "balance" ? "bg-emerald-600 text-white" : "bg-white border border-slate-100"}`}
                >
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Wallet Balance</p>
                  <p
                    className={`text-sm font-semibold ${Number(user?.balance || 0) >= amountToPay ? "text-emerald-600" : "text-red-500"}`}
                  >
                    ৳{Number(user?.balance || 0).toLocaleString()}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("manual")}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-200 ${
                  paymentMethod === "manual"
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-slate-100 hover:border-emerald-200 bg-slate-50"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl transition-colors ${paymentMethod === "manual" ? "bg-emerald-600 text-white" : "bg-white border border-slate-100"}`}
                >
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Manual Payment</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Bkash • Nagad • Rocket
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Manual Payment Details */}
          {paymentMethod === "manual" && (
            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-3">
              <div className="grid grid-cols-4 gap-3">
                {manualMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedManualMethod(m.id)}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all ${
                      selectedManualMethod === m.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <img
                      src={m.logo}
                      className="w-9 h-9 object-contain mb-2"
                      alt={m.name}
                    />
                    <span className="text-[10px] font-bold text-slate-500">
                      {m.name}
                    </span>
                  </button>
                ))}
              </div>

              {selectedManualMethod && (
                <div className="space-y-5">
                  <div className="bg-slate-900 text-white p-5 rounded-3xl flex justify-between items-center">
                    <div>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        Send To
                      </p>
                      <p className="text-xl font-mono font-bold tracking-wider mt-1">
                        {
                          manualMethods.find(
                            (m) => m.id === selectedManualMethod,
                          )?.number
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const number = manualMethods.find(
                          (m) => m.id === selectedManualMethod,
                        )?.number;
                        navigator.clipboard.writeText(number);
                        toast.success("Number Copied!");
                      }}
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                        Transaction ID
                      </label>
                      <input
                        name="transactionId"
                        value={manualDetails.transactionId}
                        onChange={handleManualInputChange}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm font-medium"
                        placeholder="e.g. 9ABCDEF123"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                        Your Number
                      </label>
                      <input
                        name="senderNumber"
                        value={manualDetails.senderNumber}
                        onChange={handleManualInputChange}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm font-medium"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirm Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-5 rounded-3xl text-lg shadow-xl shadow-emerald-500/30 transition-all active:scale-[0.985] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                PROCESSING...
              </span>
            ) : (
              "CONFIRM & PAY NOW"
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400 font-medium tracking-widest pb-4">
            🔒 Secure & Encrypted Transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
