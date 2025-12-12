"use client";

import LocationSelects from "@/src/compronent/LocationSelects";
import { OrderCreate, initPaymentSession } from "@/src/hook/useOrder";
import { MapPin, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CheckoutComponent() {
  const user = useSelector((state) => state.user?.data);
  const { items } = useSelector((state) => state.cart || {});
  const cartItems = items || [];

  const [selectedPayment, setSelectedPayment] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    area: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({ phoneNumber: "", transactionId: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(60);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    if (user?.address) {
      setCustomerInfo((p) => ({ ...p, address: user.address }));
    }
  }, [user]);

  useEffect(() => {
    const addr = [customerInfo.address, customerInfo.city, customerInfo.area].filter(Boolean).join(" ").toLowerCase();
    if (!addr) return;
    if (addr.includes("dhaka") || addr.includes("ঢাকা")) {
      setDeliveryCharge(60);
    } else {
      setDeliveryCharge(120);
    }
  }, [customerInfo.address, customerInfo.city, customerInfo.area]);

  const handleInputChange = (field, value) => setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  const handlePaymentInfoChange = (field, value) => setPaymentInfo((prev) => ({ ...prev, [field]: value }));

  const createOrder = async (override = {}) => {
    const delivery_address = [customerInfo.address, customerInfo.area, customerInfo.city].filter(Boolean).join(", ");
    const payload = {
      userId: user?._id,
      products: cartItems,
      delivery_address,
      deliveryCharge,
      subtotal,
      total: subtotal + deliveryCharge,
      paymentMethod: override.paymentMethod || (selectedPayment === "manual" ? "manual" : "online"),
      paymentDetails: override.paymentDetails || undefined,
      ...override,
    };
    return OrderCreate(payload);
  };

  const handleProceedToPayment = async ({ payDeliveryOnly = false } = {}) => {
    if (!selectedPayment) { toast.error("অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন"); return; }
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) { toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন"); return; }
    if (!user?._id) { toast.error("অনুগ্রহ করে প্রথমে লগইন করুন"); return; }
    if (!cartItems.length) { toast.error("কার্ট খালি আছে"); return; }

    try {
      setIsProcessing(true);
      const orderRes = await createOrder({ paymentMethod: payDeliveryOnly ? "partial" : "online" });
      const dbOrder = orderRes?.data;
      const dbOrderId = dbOrder?._id;
      if (!dbOrderId) throw new Error("Order তৈরি করতে সমস্যা হয়েছে (ID পাওয়া যায়নি)");

      const amountToPay = payDeliveryOnly ? deliveryCharge : subtotal + deliveryCharge;
      const paymentRes = await initPaymentSession({
        dbOrderId,
        user: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: [customerInfo.address, customerInfo.area, customerInfo.city].filter(Boolean).join(", "),
        },
        amount: amountToPay,
        isPartialPayment: payDeliveryOnly,
      });

      const gatewayUrl = paymentRes?.url || paymentRes?.GatewayPageURL;
      if (!gatewayUrl) throw new Error("Payment গেটওয়ে URL পাওয়া যায়নি");

      toast.success("আপনাকে পেমেন্ট পেইজে পাঠানো হচ্ছে...");
      window.location.href = gatewayUrl;
    } catch (error) {
      console.error("SSLCommerz init error:", error);
      toast.error(error?.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async ({ deliveryOnly = false } = {}) => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) { toast.error("অনুগ্রহ করে প্রয়োজনীয় গ্রাহক তথ্য পূরণ করুন"); return; }
    if (!paymentInfo.phoneNumber || !paymentInfo.transactionId) { toast.error("অনুগ্রহ করে আপনার পেমেন্ট নম্বর এবং ট্রানজ্যাকশন আইডি দিন"); return; }
    if (!user?._id) { toast.error("অনুগ্রহ করে প্রথমে লগইন করুন"); return; }
    if (!cartItems.length) { toast.error("কার্ট খালি আছে"); return; }

    try {
      setIsProcessing(true);
      const orderRes = await createOrder({
        paymentMethod: "manual",
        paymentDetails: {
          providerNumber: paymentInfo.phoneNumber,
          transactionId: paymentInfo.transactionId,
          manualFor: deliveryOnly ? "delivery" : "full",
        },
        isPartialPayment: deliveryOnly,
      });

      const dbOrder = orderRes?.data;
      const dbOrderId = dbOrder?._id;
      if (!dbOrderId) throw new Error("Order ID missing after creation");

      toast.success("ম্যানুয়াল পেমেন্ট রেকর্ড করা হয়েছে — আমরা যাচাই করে কনফার্ম করব।");
      window.location.href = `/order/${dbOrderId}/pending`;
    } catch (err) {
      console.error("Manual payment submit error:", err);
      toast.error(err?.message || "ম্যানুয়াল পেমেন্ট সাবমিট করতে সমস্যা হয়েছে");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">EasyShoppingMall</h1>
            <p className="text-gray-600 text-sm">নিরাপদ ও দ্রুত অনলাইন শপিং</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">গ্রাহকের তথ্য</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম *</label>
                <input value={customerInfo.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="আপনার নাম লিখুন" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নম্বর *</label>
                <input value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল ঠিকানা</label>
                <input value={customerInfo.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="example@email.com" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">ডেলিভারি ঠিকানা</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">সম্পূর্ণ ঠিকানা *</label>
                <textarea value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম" className="w-full px-4 py-3 border rounded-xl bg-gray-50" rows={3} />
              </div>

              <LocationSelects customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
            </div>
          </div>
        </div>

        <div>
          {/* Right column with cart summary + payment remains same */}
        </div>
      </div>
    </div>
  );
}
