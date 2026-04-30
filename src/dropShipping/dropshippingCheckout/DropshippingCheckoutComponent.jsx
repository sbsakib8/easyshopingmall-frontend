"use client";
import { dsCartClear } from '@/src/redux/dropshippingCartSlice';
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { UrlBackend } from '@/src/confic/urlExport';
import LocationSelects from '@/src/compronent/LocationSelects';

/* ─────────────────────────────────────────────
   Dropshipping brand palette (no main-site tokens)
   Primary accent  → emerald-600 / #059669
   Card bg         → white
   Page bg         → slate-50
   Section header  → emerald gradient
───────────────────────────────────────────── */

// Reusable section card wrapper for DS checkout
const DSCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center gap-3">
      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Shared input style for DS checkout
const dsInput =
  "w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";

const dsLabel = "block text-sm font-semibold text-slate-600 mb-2";

const DropshippingCheckoutComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.dropshippingCart);
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    const hasInvalidPrice = items.some(item =>
      item.sellingPrice === "" || Number(item.sellingPrice) < item.price
    );
    if (items.length > 0 && hasInvalidPrice) {
      toast.error("Please set a valid selling price for all items before checking out.");
      router.push("/dropshipping-addtocart");
    }
  }, [items, router]);

  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    area: '',
    division: '',
    country: 'Bangladesh',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    senderNumber: '',
  });

  const [selectedManualMethod, setSelectedManualMethod] = useState('');

  const manualMethods = [
    { id: "bkash", name: "Bkash", number: "01626420774", color: "#E2136E", logo: "💳" },
    { id: "nagad", name: "Nagad", number: "01626420774", color: "#F6521F", logo: "💳" },
    { id: "rocket", name: "Rocket", number: "01626420774", color: "#8C3494", logo: "💳" },
    { id: "upay", name: "Upay", number: "01626420774", color: "#1B4DBE", logo: "💳" },
  ];

  const subtotal = items.reduce((sum, item) => {
    const sp = item.sellingPrice === "" ? 0 : (item.sellingPrice ?? item.price);
    return sum + (sp * item.quantity);
  }, 0);
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    const dhakaDistricts = [
      "Dhaka", "ঢাকা", "Dhanmondi", "Gulshan", "Mirpur", "Motijheel",
      "Uttara", "Mohammadpur", "Tejgaon", "Kamrangirchar"
    ];
    if (dhakaDistricts.includes(customerInfo.district)) {
      setDeliveryCharge(80);
    } else if (customerInfo.district) {
      setDeliveryCharge(130);
    } else {
      setDeliveryCharge(100);
    }
  }, [customerInfo.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.district || !customerInfo.division || !customerInfo.area) {
      toast.error("Please fill in all customer address details");
      return;
    }
    if (paymentMethod === 'balance' && (user?.balance || 0) < total) {
      toast.error("Insufficient balance for this order");
      return;
    }
    if (paymentMethod === 'manual') {
      if (!selectedManualMethod) {
        toast.error("Please select a manual payment method (Bkash/Nagad/etc.)");
        return;
      }
      if (!paymentDetails.transactionId || paymentDetails.transactionId.trim() === '') {
        toast.error("Please enter the Transaction ID to verify your manual payment.");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload = {
        userId: user._id,
        products: items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          costPrice: item.price,
          sellingPrice: item.sellingPrice || item.price,
        })),
        delivery_address: {
          address_line: customerInfo.address,
          district: customerInfo.district,
          division: customerInfo.division,
          upazila_thana: customerInfo.area,
          country: customerInfo.country,
          mobile: customerInfo.phone,
          customer_name: customerInfo.name
        },
        payment_method: paymentMethod,
        payment_type: "full",
        payment_details: paymentMethod === 'manual' ? {
          provider: selectedManualMethod,
          senderNumber: paymentDetails.senderNumber || "00000000000",
          transactionId: paymentDetails.transactionId,
          manual: {
            provider: selectedManualMethod,
            transactionId: paymentDetails.transactionId,
            senderNumber: paymentDetails.senderNumber || "00000000000"
          }
        } : {},
        totalAmt: total,
        deliveryCharge,
      };

      const response = await axios.post(`${UrlBackend}/orders/manual`, payload, { withCredentials: true });

      if (response.data.success) {
        toast.success("Dropshipping order placed successfully!");
        dispatch(dsCartClear());
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── Order success screen ── */
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-lg w-full border border-slate-100">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">অর্ডার সফল!</h2>
          <p className="text-slate-500 mb-2 text-sm font-semibold uppercase tracking-widest">Order Successful</p>
          <p className="text-gray-500 mb-10 leading-relaxed text-sm">
            Your dropshipping order has been received. Fulfillment starts immediately. Your profit will be credited once the customer receives the order.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/order-list"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-emerald-100 block"
            >
              Track Orders
            </Link>
            <Link href="/all-products" className="text-gray-500 font-semibold hover:text-emerald-600 transition-colors text-sm">
              Continue Sourcing →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main checkout screen ── */
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link
            href="/dropshipping-addtocart"
            className="hover:text-emerald-600 transition-colors"
          >
            DS Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-emerald-600 font-bold">Checkout</span>
        </nav>

        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            Dropshipping Checkout
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in the customer details and choose a payment method to place the order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ════ LEFT COLUMN ════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Customer Details */}
            <DSCard icon={MapPin} title="গ্রাহকের তথ্য — Customer Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={dsLabel}>পূর্ণ নাম *</label>
                  <input
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="গ্রাহকের নাম লিখুন"
                    className={dsInput}
                  />
                </div>
                <div>
                  <label className={dsLabel}>মোবাইল নম্বর *</label>
                  <input
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="01XXXXXXXXX"
                    className={dsInput}
                  />
                </div>
              </div>
            </DSCard>

            {/* 2. Shipping Address */}
            <DSCard icon={Truck} title="ডেলিভারি ঠিকানা — Shipping Address">
              <div>
                <label className={dsLabel}>সম্পূর্ণ ঠিকানা *</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম"
                  className={`${dsInput} resize-none`}
                  rows={3}
                />
              </div>
            </DSCard>

            {/* 3. Location Selects (DS variant) */}
            <LocationSelects
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              isDropshipping={true}
            />

            {/* 4. Payment Method */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide">পেমেন্ট পদ্ধতি — Payment Method</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Method toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Balance */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('balance')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'balance'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-emerald-200 bg-white'
                      }`}
                  >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${paymentMethod === 'balance' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">Pay with Balance</p>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Available: ৳{Number(user?.balance || 0).toLocaleString()}
                      </p>
                    </div>
                    {paymentMethod === 'balance' && (
                      <span className="ml-auto w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-black">✓</span>
                      </span>
                    )}
                  </button>

                  {/* Manual */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('manual')}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'manual'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-emerald-200 bg-white'
                      }`}
                  >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${paymentMethod === 'manual' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">Manual Payment</p>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Bkash / Nagad / Rocket</p>
                    </div>
                    {paymentMethod === 'manual' && (
                      <span className="ml-auto w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-black">✓</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Manual payment details */}
                {paymentMethod === 'manual' && (
                  <div className="space-y-5 pt-2">
                    <p className="text-sm font-semibold text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      📢 Send <span className="font-black text-amber-700">৳{total.toLocaleString()}</span> to the number shown below and enter the transaction details.
                    </p>

                    {/* Gateway buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {manualMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedManualMethod(method.id)}
                          className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all ${selectedManualMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          <span className="font-black text-gray-900 text-sm">{method.name}</span>
                          <span className="text-xs text-emerald-600 font-bold mt-1">{method.number}</span>
                          {selectedManualMethod === method.id && (
                            <span className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-wider">Selected ✓</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* TrxID & Sender */}
                    {selectedManualMethod && (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Transaction ID *</label>
                            <input
                              name="transactionId"
                              value={paymentDetails.transactionId}
                              onChange={handlePaymentInputChange}
                              placeholder="e.g. 9ABCDEFGH"
                              className={dsInput}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Sender Number</label>
                            <input
                              name="senderNumber"
                              value={paymentDetails.senderNumber}
                              onChange={handlePaymentInputChange}
                              placeholder="01XXXXXXXXX"
                              className={dsInput}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 sticky top-8 overflow-hidden">
              {/* Sidebar header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                <h3 className="text-lg font-black text-white">Order Summary</h3>
                <p className="text-emerald-100 text-xs mt-0.5">{items.length} item(s) in cart</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Product list */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.productId._id} className="flex gap-3 items-start">
                      <img
                        src={item.productId.images?.[0]}
                        alt={item.productId.productName}
                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                          {item.productId.productName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.quantity} × ৳{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          Sell @ ৳{(item.sellingPrice || item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Product Cost</span>
                    <span className="text-gray-800">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-500">
                    <span>Delivery Charge</span>
                    <span className="text-gray-800">৳{deliveryCharge.toLocaleString()}</span>
                  </div>
                  {customerInfo.district && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      {deliveryCharge === 80 ? '🏙️ Dhaka delivery rate applied' : '🚚 Outside Dhaka delivery rate applied'}
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-slate-100">
                    <span>Total Cost</span>
                    <span className="text-emerald-600">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-100 hover:opacity-90 transition-all disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    'Place Dropshipping Order →'
                  )}
                </button>

                {/* Trust badge */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    Secured & Verified Dropshipping Transaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropshippingCheckoutComponent;
