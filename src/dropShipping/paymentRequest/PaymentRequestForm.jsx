"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Phone,
  Hash,
} from "lucide-react";
import axios from "axios";
import { useGetUser } from "@/src/utlis/useGetuser";
import { UrlBackend } from "@/src/confic/urlExport";
import Container from "@/src/compronent/shared/Container";
import BackButton from "@/src/dropShipping/BackButton/BackButton";

const PaymentRequestForm = () => {
  const { user, refetch } = useGetUser();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(`${UrlBackend}/payment-request/my-requests`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const onSubmit = async (data) => {
    const amount = Number(data.amount);

    if (amount < 200) {
      toast.error("Minimum withdrawal amount is ৳200");
      return;
    }

    if (amount > (user?.balance || 0)) {
      toast.error("Insufficient balance for this withdrawal");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${UrlBackend}/payment-request/create`,
        {
          amount: amount,
          paymentMethod: data.paymentMethod,
          number: data.number,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Withdrawal request submitted successfully!");
        reset();
        fetchMyRequests();
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Container className="max-w-6xl p-4 md:p-8 space-y-8 ">
        <BackButton />

        {/* Notice Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-900 tracking-tight mb-1">
                Important Notice
              </h3>
              <ul className="text-amber-800/80 text-sm font-bold space-y-1 list-disc ml-4">
                <li>
                  Minimum withdrawal amount is{" "}
                  <span className="text-amber-900 font-black">৳200</span>.
                </li>
                <li>
                  Withdrawal requests are processed within{" "}
                  <span className="text-amber-900 font-black">24-72 hours</span>
                  .
                </li>
                <li>
                  Please double-check your account number before submitting.
                </li>
                <li>
                  Payments are only sent to verified accounts
                  (Bkash/Nagad/Rocket/Bank).
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Withdrawal Request
              </h2>
              <p className="text-gray-500 text-sm">
                Request a payout from your balance
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Receive via
                  </label>
                  <select
                    {...register("paymentMethod", { required: true })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                  >
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Amount (৳)
                    <span className="ml-2 text-emerald-600 normal-case font-bold">
                      Min: ৳200
                    </span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="number"
                      {...register("amount", {
                        required: true,
                        min: 200,
                      })}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div className="mt-1.5 ml-1 flex justify-between text-[10px] font-bold">
                    <span className="text-gray-400">
                      Available: ৳{user?.balance?.toLocaleString() || "0.00"}
                    </span>
                    {/* {watch('amount') > user?.balance && <span className="text-red-500">Exceeds balance</span>} */}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Your Account Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    type="text"
                    {...register("number", { required: true })}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? "Submitting..." : "Submit Withdrawal Request"}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Secure 256-bit Encrypted Transaction
              </p>
            </form>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Recent Requests
                </h2>
                <p className="text-gray-500 text-sm">
                  Status of your submitted payments
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl font-black text-sm">
                Balance: ৳{user?.balance?.toLocaleString() || "0.00"}
              </div>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">
                          ৳{req.amount}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {req.paymentMethod} • {req.number}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-600"
                          : req.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {req.status === "approved" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {req.status === "rejected" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {req.status === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {req.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400">
                      {req.transactionId
                        ? `TxID: ${req.transactionId}`
                        : "Processing..."}
                    </span>
                    <span className="text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {req.screenshot && (
                    <button
                      onClick={() => window.open(req.screenshot, "_blank")}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:underline"
                    >
                      <Upload className="w-3 h-3" />
                      View Payment Receipt
                    </button>
                  )}
                  {req.adminNote && (
                    <p className="mt-2 p-2 bg-white/50 rounded-lg text-[10px] text-gray-500 italic border-l-2 border-emerald-500">
                      Note: {req.adminNote}
                    </p>
                  )}
                </div>
              ))}
              {requests.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <Clock className="w-12 h-12 mb-4" />
                  <p className="font-bold">No requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PaymentRequestForm;
