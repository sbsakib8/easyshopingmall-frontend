"use client";

import { submitManualPayment } from "@/src/hook/useOrder";
import { cartClear } from "@/src/redux/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


export default function ManualPaymentForm({ order, selectedManualMethod, manualMethods, setManualOrderStep }) {
  const [paymentInfo, setPaymentInfo] = useState({ senderNumber: "", transactionId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();


  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const isValidBDPhone = (phone) => /^01[3-9]\d{8}$/.test(phone);

  const handleSubmitPayment = async () => {
    // Frontend Validation
    if (!paymentInfo.senderNumber || !paymentInfo.transactionId) {
      toast.error("অনুগ্রহ করে পেমেন্ট নম্বর এবং ট্রানজ্যাকশন আইডি উভয়ই দিন");
      return;
    }
    if (paymentInfo.transactionId.length < 6) {
      toast.error("ট্রানজ্যাকশন আইডি কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    if (!isValidBDPhone(paymentInfo.senderNumber)) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX) পেমেন্ট নম্বরের জন্য");
      return;
    }
    if (!selectedManualMethod) {
      toast.error("অনুগ্রহ করে একটি ম্যানুয়াল পেমেন্ট পদ্ধতি নির্বাচন করুন");
      return;
    }

    try {
      setIsSubmitting(true);

      const manualPaymentPayload = {
        orderId: order._id,
        provider: selectedManualMethod,
        senderNumber: paymentInfo.senderNumber,
        transactionId: paymentInfo.transactionId,
        paidFor: order.payment_type || "full", // Use order's payment_type, default to full
      };

      // console.log("Submitting manual payment with payload:", manualPaymentPayload);
      await submitManualPayment(manualPaymentPayload);

      toast.success(
        `ম্যানুয়াল পেমেন্ট জমা হয়েছে। অ্যাডমিনের কনফার্মেশনের অপেক্ষায় আছে।`
      );

      // Clear cart and update step
      dispatch(cartClear());
      setManualOrderStep('payment_submitted');

    } catch (err) {
      console.error("Manual payment submission error:", err);
      const msg = err?.response?.data?.message || err?.message || "ম্যানুয়াল পেমেন্ট জমা দিতে ব্যর্থ হয়েছে";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800 text-lg">পেমেন্টের তথ্য জমা দিন</h3>
      <p className="text-sm text-gray-700">
        আপনার পেমেন্ট করার পর, নিচের ফর্মে আপনার মোবাইল নম্বর এবং ট্রানজ্যাকশন আইডি (Transaction ID) জমা দিন।
      </p>

      {/* Manual Methods Display */}
      {selectedManualMethod && (
        <div className="bg-gray-100 p-3 rounded-lg text-sm border border-gray-200">
          <p className="font-semibold">{manualMethods.find(m => m.id === selectedManualMethod)?.name}:{' '}
            <span className="font-bold text-green-600">{manualMethods.find(m => m.id === selectedManualMethod)?.number}</span>
          </p>
          <p className="text-xs text-gray-500">Amount to send: ৳{order?.totalAmt?.toLocaleString()}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="আপনার মোবাইল নম্বর (যেই নম্বর থেকে পেমেন্ট করেছেন)"
        value={paymentInfo.senderNumber}
        onChange={(e) => handlePaymentInfoChange('senderNumber', e.target.value)}
        className="w-full px-3 py-2 border rounded-xl"
        disabled={isSubmitting}
      />

      <input
        type="text"
        placeholder="ট্রানজ্যাকশন আইডি (Transaction ID)"
        value={paymentInfo.transactionId}
        onChange={(e) => handlePaymentInfoChange('transactionId', e.target.value)}
        className="w-full px-3 py-2 border rounded-xl"
        disabled={isSubmitting}
      />

      <button
        onClick={handleSubmitPayment}
        disabled={isSubmitting || !selectedManualMethod}
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
      >
        {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'পেমেন্ট জমা দিন'}
      </button>
    </div>
  );
}
