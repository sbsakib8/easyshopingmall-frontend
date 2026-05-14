"use client";
import { dsCartClear } from '@/src/redux/dropshippingCartSlice';
import {
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Copy,
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
      toast.error("চেকআউট করার আগে অনুগ্রহ করে সব পণ্যের সঠিক বিক্রয় মূল্য সেট করুন।");
      router.push("/dropshipping-addtocart");
    }
  }, [items, router]);

  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'delivery'
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
    { id: "bkash", name: "Bkash", number: "01626420774", color: "#E2136E", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/bkash.png" },
    { id: "nagad", name: "Nagad", number: "01626420774", color: "#F6521F", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/nagad.png" },
    { id: "rocket", name: "Rocket", number: "01626420774", color: "#8C3494", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/rocket.png" },
    { id: "upay", name: "Upay", number: "01626420774", color: "#1B4DBE", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/upay.png" },
  ];

  const subtotal = items.reduce((sum, item) => {
    const sp = item.sellingPrice === "" ? 0 : (item.sellingPrice ?? item.price);
    return sum + (sp * item.quantity);
  }, 0);

  const totalProfit = items.reduce((sum, item) => {
    const sp = item.sellingPrice === "" ? 0 : (item.sellingPrice ?? item.price);
    return sum + ((sp - item.price) * item.quantity);
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
      toast.error("অনুগ্রহ করে গ্রাহকের ঠিকানার সব তথ্য প্রদান করুন");
      return;
    }
    if (paymentMethod === 'balance') {
      const amountToPay = paymentType === 'delivery' ? deliveryCharge : total;
      if ((user?.balance || 0) < amountToPay) {
        toast.error("এই অর্ডারের জন্য আপনার পর্যাপ্ত ব্যালেন্স নেই");
        return;
      }
    }
    if (paymentMethod === 'cod') {
      // No payment check needed for COD
    }
    if (paymentMethod === 'manual') {
      if (!selectedManualMethod) {
        toast.error("অনুগ্রহ করে একটি পেমেন্ট মেথড (বিকাশ/নগদ/ইত্যাদি) সিলেক্ট করুন");
        return;
      }
      if (!paymentDetails.transactionId || paymentDetails.transactionId.trim() === '') {
        toast.error("আপনার পেমেন্ট যাচাই করতে ট্রানজেকশন আইডি প্রদান করুন।");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload = {
        userId: user._id,
        products: items.map(item => ({
          productId: item.productId._id,
          name: item.productId.productName,
          image: item.productId.images || [],
          quantity: item.quantity,
          costPrice: item.price,
          sellingPrice: item.sellingPrice || item.price,
          size: item.size || null,
          color: item.color || null,
          weight: item.weight || null,
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
        payment_type: paymentMethod === 'cod' ? 'cod' : paymentType,
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
        toast.success("আপনার ড্রপশিপিং অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!");
        dispatch(dsCartClear());
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "অর্ডার দিতে ব্যর্থ হয়েছে");
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
          <p className="text-slate-500 mb-2 text-sm font-semibold uppercase tracking-widest">অর্ডার সফল হয়েছে</p>
          <p className="text-gray-500 mb-10 leading-relaxed text-sm">
            আপনার ড্রপশিপিং অর্ডারটি গ্রহণ করা হয়েছে। আপনার লাভ গ্রাহক পণ্যটি বুঝে পাওয়ার পর আপনার ব্যালেন্সে যোগ হবে।
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/order-list"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-emerald-100 block"
            >
              অর্ডার ট্র্যাক করুন
            </Link>
            <Link href="/all-products" className="text-gray-500 font-semibold hover:text-emerald-600 transition-colors text-sm">
              পণ্য খোঁজা চালিয়ে যান →
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
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link
            href="/dropshipping-addtocart"
            className="hover:text-emerald-600 transition-colors"
          >
            কার্টে ফিরে যান
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-emerald-600 font-bold">চেকআউট</span>
        </nav>

        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            ড্রপশিপিং চেকআউট
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            অর্ডার করতে গ্রাহকের তথ্য পূরণ করুন এবং পেমেন্ট পদ্ধতি বেছে নিন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ════ LEFT COLUMN ════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Customer Details */}
            <DSCard icon={MapPin} title="গ্রাহকের তথ্য">
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
            <DSCard icon={Truck} title="ডেলিভারি ঠিকানা">
              <div>
                <label className={dsLabel}>কোথায় ডেলিভারি নিতে চান? *</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="যেমন: বাড়ি নং ১২, রোড ৫, শান্তিবাগ"
                  className={`${dsInput} resize-none`}
                  rows={3}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                সহজে খুঁজে পাওয়ার জন্য বিস্তারিত ঠিকানা লিখুন।
              </p>
            </DSCard>

            {/* 3. Location Selects (DS variant) */}
            <LocationSelects
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              isDropshipping={true}
            />

            {/* 4. Payment Method */}
            {/* 4. Payment Method */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">পেমেন্ট</h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">নিরাপদ চেকআউট</span>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* ── Payment Type Selection (Full vs COD) ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      অর্ডারের ধরন
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ১ (২ এর মধ্যে)</span>
                  </div>

                  {paymentMethod === 'cod' ? (
                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm font-bold text-emerald-800">
                        ক্যাশ অন ডেলিভারি (COD) সিলেক্ট করা হয়েছে।
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        গ্রাহক পণ্যটি বুঝে পাওয়ার পর আপনি মোট ৳{total.toLocaleString()} পরিশোধ করবেন।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentType('full')}
                        className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left overflow-hidden ${paymentType === 'full'
                          ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10'
                          : 'border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-white'
                          }`}
                      >
                        <div className={`p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${paymentType === 'full' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-black text-sm transition-colors ${paymentType === 'full' ? 'text-emerald-900' : 'text-gray-900'}`}>সম্পূর্ণ পেমেন্ট</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-tight">দ্রুত ডেলিভারি পেতে এখনই সম্পূর্ণ টাকা পরিশোধ করুন</p>
                        </div>
                        {paymentType === 'full' && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">সুপারিশকৃত</span>
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('delivery')}
                        className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentType === 'delivery'
                          ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10'
                          : 'border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-white'
                          }`}
                      >
                        <div className={`p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${paymentType === 'delivery' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-black text-sm transition-colors ${paymentType === 'delivery' ? 'text-emerald-900' : 'text-gray-900'}`}>সিওডি / ডেলিভারি চার্জ</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-tight">অর্ডার কনফার্ম করতে এখনই শুধুমাত্র ডেলিভারি চার্জ পরিশোধ করুন</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-black text-slate-300">
                    <span className="bg-white px-3">এরপর পেমেন্ট মাধ্যম সিলেক্ট করুন</span>
                  </div>
                </div>

                {/* ── Payment Method Toggle (Balance vs Manual vs COD) ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      পেমেন্টের উৎস
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase">ধাপ ২ (২ এর মধ্যে)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Balance */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('balance')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'balance'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10'
                        : 'border-slate-200 hover:border-emerald-200 bg-white'
                        }`}
                    >
                      <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${paymentMethod === 'balance' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-xs transition-colors ${paymentMethod === 'balance' ? 'text-emerald-900' : 'text-gray-900'}`}>ব্যালেন্স</p>
                        <p className={`text-[10px] font-bold truncate ${Number(user?.balance || 0) < (paymentType === 'delivery' ? deliveryCharge : total) ? 'text-red-500' : 'text-emerald-600'}`}>
                          ৳{Number(user?.balance || 0).toLocaleString()}
                        </p>
                      </div>
                      {paymentMethod === 'balance' && (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Manual */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'manual'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10'
                        : 'border-slate-200 hover:border-emerald-200 bg-white'
                        }`}
                    >
                      <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${paymentMethod === 'manual' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-xs transition-colors ${paymentMethod === 'manual' ? 'text-emerald-900' : 'text-gray-900'}`}>ম্যানুয়াল</p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate">মোবাইল ব্যাংকিং</p>
                      </div>
                      {paymentMethod === 'manual' && (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`group flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'cod'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-500/10'
                        : 'border-slate-200 hover:border-emerald-200 bg-white'
                        }`}
                    >
                      <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${paymentMethod === 'cod' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-xs transition-colors ${paymentMethod === 'cod' ? 'text-emerald-900' : 'text-gray-900'}`}>সিওডি</p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate">ডেলিভারির সময় পেমেন্ট</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Manual payment details with animation-ready container */}
                {paymentMethod === 'manual' && (
                  <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                      <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900 leading-snug">
                          নিচের যেকোনো একটি নাম্বারে <span className="text-lg font-black underline decoration-amber-400 decoration-4 underline-offset-2">৳{(paymentType === 'delivery' ? deliveryCharge : total).toLocaleString()}</span> সেন্ড মানি করুন।
                        </p>
                        <p className="text-xs text-amber-700 font-semibold mt-1">টাকা পাঠানোর পর ট্রানজেকশন আইডি এবং আপনার নাম্বারটি নিচে দিন।</p>
                      </div>
                    </div>

                    {/* Gateway buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {manualMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedManualMethod(method.id)}
                          className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selectedManualMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50 shadow-inner'
                            : 'border-slate-100 hover:border-slate-300 bg-white hover:shadow-sm'
                            }`}
                        >
                          <div className="w-12 h-12 mb-3 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                            <img src={method.logo} alt={method.name} className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100" />
                          </div>
                          <span className={`font-black text-xs uppercase tracking-wider ${selectedManualMethod === method.id ? 'text-emerald-700' : 'text-slate-600'}`}>{method.name}</span>

                          {selectedManualMethod === method.id && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Selected Method Details */}
                    {selectedManualMethod && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Number Display with Copy */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-slate-900 rounded-2xl text-white">
                          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">টাকা পাঠান এই নাম্বারে</p>
                            <p className="text-2xl font-black tracking-widest">{manualMethods.find(m => m.id === selectedManualMethod)?.number}</p>
                          </div>
                          <button
                            onClick={() => {
                              const num = manualMethods.find(m => m.id === selectedManualMethod)?.number;
                              navigator.clipboard.writeText(num);
                              toast.success("নাম্বার কপি করা হয়েছে!");
                            }}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                          >
                            <Copy className="w-4 h-4" />
                            নাম্বার কপি করুন
                          </button>
                        </div>

                        {/* Transaction Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                              ট্রানজেকশন আইডি <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                              <input
                                name="transactionId"
                                value={paymentDetails.transactionId}
                                onChange={handlePaymentInputChange}
                                placeholder="উদাঃ 9ABCDEFGH"
                                className={`${dsInput} pl-11 !bg-white group-focus-within:!ring-emerald-500/20`}
                              />
                              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                              আপনার {selectedManualMethod.toUpperCase()} নাম্বার <span className="text-slate-300">(ঐচ্ছিক)</span>
                            </label>
                            <div className="relative group">
                              <input
                                name="senderNumber"
                                value={paymentDetails.senderNumber}
                                onChange={handlePaymentInputChange}
                                placeholder="01XXXXXXXXX"
                                className={`${dsInput} pl-11 !bg-white group-focus-within:!ring-emerald-500/20`}
                              />
                              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
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
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 sticky top-8 overflow-hidden transition-all hover:shadow-xl">
              {/* Sidebar header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">অর্ডার সারাংশ</h3>
                  <div className="bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <p className="text-white text-[10px] font-black">{items.length} টি পণ্য</p>
                  </div>
                </div>
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest opacity-80">আপনার ড্রপশিপিং অর্ডারটি পর্যালোচনা করুন</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Product list with better styling */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.productId._id} className="group flex gap-4 items-start p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="relative">
                        <img
                          src={item.productId.images?.[0]}
                          alt={item.productId.productName}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105"
                        />
                        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-emerald-600 transition-colors">
                          {item.productId.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ক্রয় মূল্য:</p>
                          <p className="text-xs font-bold text-slate-600">৳{item.price.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">বিক্রয় মূল্য:</p>
                          <p className="text-xs font-black text-emerald-600">৳{(item.sellingPrice || item.price).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">লাভ:</p>
                          <p className="text-xs font-black text-blue-600">৳{((item.sellingPrice || item.price) - item.price).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown - More refined */}
                <div className="space-y-4 pt-6 border-t border-dashed border-slate-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">সাবটোটাল (পণ্যের দাম)</span>
                    <span className="font-black text-slate-900">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-500">ডেলিভারি চার্জ</span>
                      {customerInfo.district && (
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">
                          {deliveryCharge === 80 ? '🏙️ ঢাকা সিটির হার' : '🚚 ঢাকার বাইরের হার'}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-slate-900">৳{deliveryCharge.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-600">আপনার সম্ভাব্য লাভ</span>
                    <span className="font-black text-blue-700">৳{totalProfit.toLocaleString()}</span>
                  </div>


                  <div className="pt-4 border-t-2 border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">অর্ডারের মোট মূল্য</span>
                      <span className="text-base font-bold text-slate-500 line-through opacity-50">৳{(total + 50).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em]">এখন পরিশোধযোগ্য</span>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">নিরাপদ লেনদেন</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                          ৳{(paymentMethod === 'cod' ? 0 : (paymentType === 'delivery' ? deliveryCharge : total)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {(paymentType === 'delivery' || paymentMethod === 'cod') && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100 animate-in zoom-in duration-300">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span className="text-[10px] font-black text-amber-800 uppercase">ডেলিভারির সময় প্রদেয়</span>
                        </div>
                        <span className="text-sm font-black text-amber-700">
                          ৳{(paymentMethod === 'cod' ? total : subtotal).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Place order button - Bigger & More Vibrant */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="group relative w-full bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-black text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="uppercase tracking-widest text-sm">অর্ডার প্রসেস হচ্ছে...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      এখনই অর্ডার করুন
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    ৫,০০০+ ড্রপশিপারের বিশ্বস্ত
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
