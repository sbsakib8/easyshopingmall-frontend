"use client";

import { OrderCreate, initPaymentSession, submitManualPayment } from "@/src/hook/useOrder";
import { cartClear } from "@/src/redux/cartSlice";
import { MapPin, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LocationSelects from "../LocationSelects";

export default function CheckoutComponent() {
  const user = useSelector((state) => state.user?.data);
  const dispatch = useDispatch();
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
    pincode: "", // Added pincode
  });

  const [paymentInfo, setPaymentInfo] = useState({ phoneNumber: "", transactionId: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [selectedManualMethod, setSelectedManualMethod] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);


  const isValidBDPhone = (phone) => /^01[3-9]\d{8}$/.test(phone); // BD phone format
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // simple email regex
  const detectDhaka = (address, city, area) => {
    const addr = [address, city, area].filter(Boolean).join(" ").toLowerCase();
    return addr.includes("dhaka") || addr.includes("ঢাকা");
  };


  // subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
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
    const delivery_address = {
      address_line: customerInfo.address,
      district: customerInfo.district,
      division: customerInfo.division,
      upazila_thana: customerInfo.area,
      pincode: customerInfo.pincode, // Use collected pincode
      country: "Bangladesh", // Assuming default
      mobile: customerInfo.phone ? Number(customerInfo.phone) : null,
    };

    // Determine payment_type based on selectedPayment or override
    let paymentType = "full";
    if (selectedPayment === 'ssl-delivery' || override.payDeliveryOnly) {
      paymentType = "delivery";
    }

    const payload = {
      userId: user._id,
      products: cartItems.map(item => {
        const product = item.productId || {};
        const price = item.price ?? product.price ?? 0;
        return {
          productId: product._id || item.productId,
          name: product.productName || item.name,
          image: product.images || item.image,
          quantity: item.quantity,
          price: price,
          totalPrice: (Number(price) || 0) * (Number(item.quantity) || 0),
          size: item.size || null,
          color: item.color || null,
          weight: item.weight || null,
        }
      }),

      delivery_address,
      deliveryCharge,
      subTotalAmt: subtotal,
      totalAmt: subtotal + deliveryCharge, // Total amount is always full order value

      payment_method: override.payment_method || (selectedPayment === 'manual' ? 'manual' : 'sslcommerz'),
      payment_type: paymentType, // Set payment_type here
      payment_details: {
        ...override.payment_details,
        ...(selectedPayment === 'manual' && override.manualPaymentMethod
          ? {
              manual_payment_method: override.manualPaymentMethod.method,
              provider_number: override.manualPaymentMethod.provider_number,
              transaction_id: override.manualPaymentMethod.transaction_id,
            }
          : {}),
      },
    };

    return OrderCreate(payload);
  };


  // One-click SSL (full or delivery-only)
  const handleProceedToPayment = async ({ payDeliveryOnly = false } = {}) => {
    const { name, phone, email, address, division, district, area, pincode } = customerInfo;

    // 1️⃣ Required fields
    if (!name || !phone || !address || !division || !district || !area || !pincode) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন (ঠিকানা সহ)");
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

      const paymentType = payDeliveryOnly ? "delivery" : "full";

      const delivery_address_for_payment_session = {
        address_line: customerInfo.address,
        district: customerInfo.district,
        division: customerInfo.division,
        upazila_thana: customerInfo.area,
        pincode: customerInfo.pincode,
        country: "Bangladesh",
        mobile: customerInfo.phone ? Number(customerInfo.phone) : null,
      };

      // 1️⃣ Create order (manual / pending for now, will be updated by SSL)
      const orderRes = await createOrder({
        payment_method: "sslcommerz",
        payment_type: paymentType,
      });

      console.log('Full orderRes after createOrder:', orderRes); // Added log

      const dbOrder = orderRes?.data;
      const dbOrderId = dbOrder?._id;

      if (!dbOrderId) {
        throw new Error("Order তৈরি করতে সমস্যা হয়েছে (ID পাওয়া যায়নি)");
      }

      // 2️⃣ Init SSL payment
      const paymentRes = await initPaymentSession({
        orderId: dbOrderId, // Send orderId
        payment_type: paymentType, // Send payment_type
        userId: user._id, // Explicitly send userId from frontend
        delivery_address: delivery_address_for_payment_session, // Send delivery address
      });

      const gatewayUrl = paymentRes?.url;

      if (!gatewayUrl) {
        throw new Error("Payment গেটওয়ে URL পাওয়া যায়নি");
      }

      toast.success("আপনাকে পেমেন্ট পেইজে পাঠানো হচ্ছে...");
      window.location.href = gatewayUrl;

    } catch (error) {
      console.error("SSLCommerz init error:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2)); // Added full error logging
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "পেমেন্ট শুরু করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };


  // Manual payment (full) or manual delivery payment
  const handleManualSubmit = async ({ deliveryOnly = false }) => {
    const { name, phone, email, address, division, district, area, pincode } = customerInfo;

    // 1️⃣ Required fields (copied from handleProceedToPayment)
    if (!name || !phone || !address || !division || !district || !area || !pincode) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন (ঠিকানা সহ)");
      return;
    }

    // 2️⃣ Phone validation (copied from handleProceedToPayment)
    if (!isValidBDPhone(phone)) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)");
      return;
    }

    // 3️⃣ Email validation (optional, copied from handleProceedToPayment)
    if (email && !isValidEmail(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
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

      // 1️⃣ Validate required payment info
      if (!paymentInfo.phoneNumber || !paymentInfo.transactionId) {
        toast.error("অনুগ্রহ করে পেমেন্ট নম্বর এবং ট্রানজ্যাকশন আইডি উভয়ই দিন");
        return;
      }
      if (!selectedManualMethod) {
        toast.error("অনুগ্রহ করে একটি ম্যানুয়াল পেমেন্ট পদ্ধতি নির্বাচন করুন");
        return;
      }

      console.log("paymentInfo:", paymentInfo); // Debug log for paymentInfo

      // 2️⃣ Create order in DB with payment_status pending
      // The createOrder helper already sets payment_method to "manual" and correct payment_type
      const orderRes = await createOrder({
        payment_method: "manual",
        payDeliveryOnly: deliveryOnly, // Pass this to helper to set payment_type
        manualPaymentMethod: {
          method: selectedManualMethod,
          provider_number: paymentInfo.phoneNumber,
          transaction_id: paymentInfo.transactionId,
        }, // Pass selected manual method and details
      });

      const order = orderRes?.data;
      const dbOrderId = order?._id;

      console.log("orderRes:", orderRes); // Debug log for orderRes
      console.log("dbOrderId:", dbOrderId); // Debug log for dbOrderId

      if (!dbOrderId) throw new Error("Order creation failed");


      // 3️⃣ Submit manual payment details to update the order
      const manualPaymentPayload = {
        orderId: dbOrderId,
        phoneNumber: paymentInfo.phoneNumber,
        transactionId: paymentInfo.transactionId,
        manualFor: deliveryOnly ? "delivery" : "full",
        manualMethod: selectedManualMethod, // Pass selected manual method
      };
      console.log("Submitting manual payment with payload:", manualPaymentPayload);
      await submitManualPayment(manualPaymentPayload);


      // ✅ Show user a success toast, but note it's pending
      toast.success(
        `ম্যানুয়াল পেমেন্ট জমা হয়েছে। অ্যাডমিনের কনফার্মেশনের অপেক্ষায় আছে।`
      );

      // 4️⃣ Optionally, store order locally to show on frontend
      setCreatedOrder(order);

      // 5️⃣ Clear cart and redirect
      dispatch(cartClear()); // Clear cart after successful manual payment
      window.location.href = '/';

    } catch (err) {
      console.error("Manual payment error:", err);
      const msg = err?.response?.data?.message || err?.message || "ম্যানুয়াল পেমেন্ট ব্যর্থ হয়েছে";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };





  const manualMethods = [
    {
      id: "bkash",
      name: "Bkash Personal",
      number: "01626420774",
    },
    {
      id: "nagad",
      name: "Nagad Personal",
      number: "01626420774",
    },
  ];


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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পোস্ট কোড *</label>
                    <input value={customerInfo.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} placeholder="পোস্ট কোড দিন" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    পেমেন্ট মেথড
                  </h4>

                  <div className="space-y-3">

                    {/* ================= Manual Payment ================= */}
                    <div
                      className={`p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'manual'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'}
      `}
                      onClick={() => setSelectedPayment('manual')}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPayment === 'manual'}
                          readOnly
                        />

                        <div className="flex-1 flex justify-between">
                          <div>
                            <div className="font-medium">
                              ম্যানুয়াল পেমেন্ট (Bkash / Nagad / Rocket)
                            </div>
                            <div className="text-xs text-gray-500">
                              আপনি প্রদত্ত নম্বরে পেমেন্ট করে ট্রানজ্যাকশন আইডি জমা দেবেন
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-gray-700">
                            ৳{(subtotal + deliveryCharge).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Manual Section */}
                      {selectedPayment === 'manual' && (
                        <div
                          className="mt-4 space-y-3"
                          onClick={(e) => e.stopPropagation()} // 🔥 key fix
                        >
                          {/* Manual Methods */}
                          {manualMethods.map((method) => {
                            const isActive = selectedManualMethod === method.id;

                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setSelectedManualMethod(method.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition
                  ${isActive
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-400'}
                `}
                              >
                                <div className="text-left">
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-xs text-gray-500">{method.number}</div>
                                </div>

                                <span
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isActive ? 'border-green-600' : 'border-gray-300'}
                  `}
                                >
                                  {isActive && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                                  )}
                                </span>
                              </button>
                            );
                          })}

                          {/* Inputs */}
                          <input
                            type="text"
                            placeholder="পেমেন্ট নম্বর (যেই নম্বর থেকে পেমেন্ট করেছেন)"
                            value={paymentInfo.phoneNumber}
                            onChange={(e) =>
                              handlePaymentInfoChange('phoneNumber', e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />

                          <input
                            type="text"
                            placeholder="ট্রানজ্যাকশন আইডি (Transaction ID)"
                            value={paymentInfo.transactionId}
                            onChange={(e) =>
                              handlePaymentInfoChange('transactionId', e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-xl"
                          />

                          {/* Submit Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => handleManualSubmit({ deliveryOnly: false })}
                              disabled={isProcessing || !selectedManualMethod}
                              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-2 rounded-xl font-semibold disabled:opacity-60"
                            >
                              {isProcessing ? 'সাবমিট করা হচ্ছে...' : 'ম্যানুয়াল (Full) সাবমিট করুন'}
                            </button>

                            <button
                              onClick={() => handleManualSubmit({ deliveryOnly: true })}
                              disabled={isProcessing || !selectedManualMethod}
                              className="w-full border border-gray-300 py-2 rounded-xl disabled:opacity-60"
                            >
                              {isProcessing
                                ? 'সাবমিট করা হচ্ছে...'
                                : `ম্যানুয়াল (Delivery ৳${deliveryCharge})`}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ================= SSL Full ================= */}
                    <label
                      className={`flex items-center p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'ssl'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'}
      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="ssl"
                        checked={selectedPayment === 'ssl'}
                        onChange={() => setSelectedPayment('ssl')}
                        className="mr-3"
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            One-click (SSLCommerz) — Full
                          </div>
                          <div className="text-xs text-gray-500">
                            শুধু ক্লিক করুন এবং পেমেন্ট গেটওয়ে খুলবে
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-gray-700">
                          ৳{(subtotal + deliveryCharge).toLocaleString()}
                        </div>
                      </div>
                    </label>

                    {/* ================= SSL Delivery ================= */}
                    <label
                      className={`flex items-center p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'ssl-delivery'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'}
      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="ssl-delivery"
                        checked={selectedPayment === 'ssl-delivery'}
                        onChange={() => setSelectedPayment('ssl-delivery')}
                        className="mr-3"
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Pay Delivery Fee Only (SSL)
                          </div>
                          <div className="text-xs text-gray-500">
                            আগে ডেলিভারি ফি দিন, পরে বাকি কনফার্ম
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-gray-700">
                          ৳{deliveryCharge}
                        </div>
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
