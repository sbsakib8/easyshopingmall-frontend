"use client";

import { OrderCreate, initPaymentSession } from "@/src/hook/useOrder";
import { MapPin, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LocationSelects from "../LocationSelects";

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
    division: "",
    district: "",
    area: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({ phoneNumber: "", transactionId: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(60);

  const isValidBDPhone = (phone) => /^01[3-9]\d{8}$/.test(phone); // BD phone format
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // simple email regex
  const detectDhaka = (address, city, area) => {
    const addr = [address, city, area].filter(Boolean).join(" ").toLowerCase();
    return addr.includes("dhaka") || addr.includes("ঢাকা");
  };


  // subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const total = subtotal + deliveryCharge;
  console.log('cartItems', cartItems);

  useEffect(() => {
    // if user already has an address prefills
    if (user?.address) {
      setCustomerInfo((p) => ({ ...p, address: user.address }));
    }
  }, [user]);


  useEffect(() => {
    // Only allow 60 or 120
    const dhakaDistricts = [
      "Dhaka", "ঢাকা", "Dhanmondi", "Gulshan", "Mirpur", "Motijheel",
      "Uttara", "Mohammadpur", "Tejgaon", "Kamrangirchar"
    ];

    if (dhakaDistricts.includes(customerInfo.district)) {
      setDeliveryCharge(60);
    } else if (customerInfo.district) {
      setDeliveryCharge(120);
    }
  }, [customerInfo.district]);


  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const distObj = districts.find(d => d.district === district);
    setUpazilaList(distObj?.upazilas || []);
    setCustomerInfo(prev => ({ ...prev, district, area: "", division: selectedDivision }));
  };


  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Create order helper
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

  // One-click SSL (full or delivery-only)
  const handleProceedToPayment = async ({ payDeliveryOnly = false } = {}) => {
    const { name, phone, email, address, city, area } = customerInfo;

    // 1️⃣ Required fields
    if (!name || !phone || !address) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    // 2️⃣ Phone validation
    if (!isValidBDPhone(phone)) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)");
      return;
    }

    // 3️⃣ Email validation (optional)
    if (email && !isValidEmail(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    if (!selectedPayment) {
      toast.error("অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    if (!user?._id) {
      toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
      return;
    }

    if (!cartItems.length) {
      toast.error("কার্ট খালি আছে");
      return;
    }

    try {
      setIsProcessing(true);

      // 1) create order in DB (status: pending)
      const orderRes = await createOrder({ paymentMethod: payDeliveryOnly ? "partial" : "online" });
      const dbOrder = orderRes?.data;
      const dbOrderId = dbOrder?._id;

      if (!dbOrderId) throw new Error("Order তৈরি করতে সমস্যা হয়েছে (ID পাওয়া যায়নি)");

      // 2) init payment session
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
      const msg = error?.response?.data?.message || error?.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual payment (full) or manual delivery payment
  const handleManualSubmit = async ({ deliveryOnly = false } = {}) => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("অনুগ্রহ করে প্রয়োজনীয় গ্রাহক তথ্য পূরণ করুন");
      return;
    }

    if (!paymentInfo.phoneNumber || !paymentInfo.transactionId) {
      toast.error("অনুগ্রহ করে আপনার পেমেন্ট নম্বর এবং ট্রানজ্যাকশন আইডি দিন");
      return;
    }

    if (!user?._id) {
      toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
      return;
    }

    if (!cartItems.length) {
      toast.error("কার্ট খালি আছে");
      return;
    }

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

      // go to pending page
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
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600bg-clip-text text-transparent">
                  EasyShoppingMall
                </h1>
                <p className="text-gray-600 text-sm">নিরাপদ ও দ্রুত অনলাইন শপিং</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">গ্রাহকের তথ্য</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Delivery Address */}


            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">ডেলিভারি ঠিকানা</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">সম্পূর্ণ ঠিকানা *</label>
                    <textarea value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম" className="w-full px-4 py-3 border rounded-xl bg-gray-50" rows={3} />
                  </div>

                </div>
              </div>
            </div>
            <LocationSelects customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">অর্ডার সামারি</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 && <div className="text-center py-6 text-gray-500">কার্ট খালি।</div>}

                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="relative">
                        <img src={item.productId.images?.[0] || item.image || "/placeholder.svg"} alt={item.productId?.productName || item.name || "Product"} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">{item.quantity}</div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.productId?.productName || item.name || "Unnamed Product"}</h3>
                        <div className="flex items-center space-x-1 mt-1"><Star className="w-3 h-3 text-yellow-400" /><span className="text-xs text-gray-600">{item.ratings || "5"}</span></div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">৳{(item.totalPrice || (item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">৳{(item.price || 0).toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between text-gray-700"><span>সাবটোটাল</span><span className="font-medium">৳{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-700"><span className="flex items-center space-x-1"><Truck className="w-4 h-4" /><span>ডেলিভারি চার্জ</span></span><span className="font-medium">৳{deliveryCharge}</span></div>
                  <div className="border-t border-gray-200 pt-3"><div className="flex justify-between text-xl font-bold text-gray-900"><span>মোট</span><span className="text-blue-600">৳{(subtotal + deliveryCharge).toLocaleString()}</span></div></div>
                </div>

                {/* Payment Methods */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">পেমেন্ট মেথড</h4>

                  <div className="space-y-3">
                    {/* Manual (Full) */}
                    <label className={`flex items-center p-3 rounded-xl border ${selectedPayment === 'manual' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} cursor-pointer`}>
                      <input type="radio" name="payment" value="manual" checked={selectedPayment === 'manual'} onChange={() => setSelectedPayment('manual')} className="mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">ম্যানুয়াল পেমেন্ট (Bkash / Nagad / Rocket)</div>
                            <div className="text-xs text-gray-500">আপনি প্রদত্ত নম্বরে পেমেন্ট করে ট্রানজ্যাকশন আইডি জমা দেবেন</div>
                          </div>
                          <div className="text-sm font-semibold text-gray-700">৳{(subtotal + deliveryCharge).toLocaleString()}</div>
                        </div>

                        {selectedPayment === 'manual' && (
                          <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"><div><div className="font-medium">Bkash Personal</div><div className="text-xs text-gray-500">01626420774</div></div><div className="text-xs text-gray-400">Account</div></div>
                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"><div><div className="font-medium">Nagad</div><div className="text-xs text-gray-500">01626420774</div></div><div className="text-xs text-gray-400">Account</div></div>

                            <div className="grid grid-cols-1 gap-2 mt-2">
                              <input type="text" placeholder="পেমেন্ট নম্বর (যেই নম্বর থেকে পেমেন্ট করেছেন)" value={paymentInfo.phoneNumber} onChange={(e) => handlePaymentInfoChange('phoneNumber', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                              <input type="text" placeholder="ট্রানজ্যাকশন আইডি (Transaction ID)" value={paymentInfo.transactionId} onChange={(e) => handlePaymentInfoChange('transactionId', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />

                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleManualSubmit({ deliveryOnly: false })} disabled={isProcessing} className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-2 rounded-xl font-semibold disabled:opacity-60">{isProcessing ? 'সাবমিট করা হচ্ছে...' : 'ম্যানুয়াল (Full) সাবমিট করুন'}</button>
                                <button onClick={() => handleManualSubmit({ deliveryOnly: true })} disabled={isProcessing} className="w-full border border-gray-300 py-2 rounded-xl">{isProcessing ? 'সাবমিট করা হচ্ছে...' : `ম্যানুয়াল (Delivery ৳${deliveryCharge})`}</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* SSL Full */}
                    <label className={`flex items-center p-3 rounded-xl border ${selectedPayment === 'ssl' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} cursor-pointer`}>
                      <input type="radio" name="payment" value="ssl" checked={selectedPayment === 'ssl'} onChange={() => setSelectedPayment('ssl')} className="mr-3" />
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">One-click (SSLCommerz) — Full</div>
                          <div className="text-xs text-gray-500">শুধু ক্লিক করুন এবং পেমেন্ট গেটওয়ে খুলবে</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">৳{(subtotal + deliveryCharge).toLocaleString()}</div>
                      </div>
                    </label>

                    {/* SSL Delivery-only */}
                    <label className={`flex items-center p-3 rounded-xl border ${selectedPayment === 'ssl-delivery' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} cursor-pointer`}>
                      <input type="radio" name="payment" value="ssl-delivery" checked={selectedPayment === 'ssl-delivery'} onChange={() => setSelectedPayment('ssl-delivery')} className="mr-3" />
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">Pay Delivery Fee Only (SSL)</div>
                          <div className="text-xs text-gray-500">আগে ডেলিভারি ফি দিন, পরে বাকি কনফার্ম</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">৳{deliveryCharge}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-green-50 rounded-xl">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">১০০% নিরাপদ পেমেন্ট</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button onClick={() => {
                    if (selectedPayment !== 'ssl') { setSelectedPayment('ssl'); return; }
                    handleProceedToPayment({ payDeliveryOnly: false });
                  }} disabled={isProcessing} className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-3 rounded-xl font-semibold disabled:opacity-60">{isProcessing ? 'প্রসেসিং হচ্ছে...' : 'One-Click SSL — Full'}</button>

                  <button onClick={() => { if (selectedPayment !== 'ssl-delivery') { setSelectedPayment('ssl-delivery'); return; } handleProceedToPayment({ payDeliveryOnly: true }); }} disabled={isProcessing} className="w-full border border-gray-300 py-3 rounded-xl font-semibold">{isProcessing ? 'প্রসেসিং হচ্ছে...' : `Pay Delivery Only (৳${deliveryCharge})`}</button>

                  <button onClick={() => { if (selectedPayment !== 'manual') { setSelectedPayment('manual'); return; } const el = document.querySelector('input[placeholder="ট্রানজ্যাকশন আইডি (Transaction ID)"]'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold">Pay Manually (Bkash / Nagad)</button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের <span className="text-blue-600 font-medium">শর্তাবলী</span> মেনে নিচ্ছেন</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
