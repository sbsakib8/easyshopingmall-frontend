import React from "react";
import { CreditCard, Info, RefreshCw, ShieldCheck } from "lucide-react";

const PaymentForm = ({
  paymentData,
  setPaymentData,
  onSubmit,
  submitting,
  title = "Submit Payment",
  price = 500,
}) => (
  <div className="bg-white border border-gray-100 rounded-[2.5rem] p-5 md:p-8 shadow-lg w-full">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
        <CreditCard className="text-emerald-600" size={24} />
      </div>
      <div>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-bold mt-0.5">
          আপনার বিকাশ / নগদ লেনদেনের বিবরণ দিন
        </p>
      </div>
    </div>
    <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 mb-8">
      <div className="flex items-center gap-2 mb-1.5">
        <Info className="text-emerald-600 w-4 h-4" />
        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
          পেমেন্ট নির্দেশিকা
        </span>
      </div>
      <p className="text-xs text-emerald-700 font-medium leading-relaxed">
        অনুগ্রহ করে আমাদের বিকাশ/নগদ নম্বরে{" "}
        <span className="font-bold">(01626420774)</span>{" "}
        <span className="font-black">&#2547;{price}</span> (সেন্ড মানি) পাঠান।
        এরপর নিচে লেনদেনের বিবরণ দিন।
      </p>
    </div>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
          Payment Method
        </label>
        <select
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
          value={paymentData.paymentMethod}
          onChange={(e) =>
            setPaymentData({ ...paymentData, paymentMethod: e.target.value })
          }
        >
          <option value="Bkash">Bkash</option>
          <option value="Nagad">Nagad</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
          Sender Number
        </label>
        <input
          type="text"
          required
          placeholder="017XXXXXXXX"
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
          value={paymentData.senderNumber}
          onChange={(e) =>
            setPaymentData({ ...paymentData, senderNumber: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
          Transaction ID
        </label>
        <input
          type="text"
          required
          placeholder="TRX123456789"
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
          value={paymentData.transactionId}
          onChange={(e) =>
            setPaymentData({ ...paymentData, transactionId: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <RefreshCw className="animate-spin" size={16} /> Submitting...
          </>
        ) : (
          <>
            <ShieldCheck size={16} /> {title}
          </>
        )}
      </button>
    </form>
  </div>
);

export default React.memo(PaymentForm);
