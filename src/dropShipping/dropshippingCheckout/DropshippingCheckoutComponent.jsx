"use client";
import { dsCartClear } from '@/src/redux/dropshippingCartSlice';
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  ShieldCheck,
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
      router.push("/dropshipping-cart");
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
    { id: "bkash", name: "Bkash Personal", number: "01626420774" },
    { id: "nagad", name: "Nagad Personal", number: "01626420774" },
    { id: "rocket", name: "Rocket Personal", number: "01626420774" },
    { id: "upay", name: "Upay Personal", number: "01626420774" },
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-lg w-full border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Order Successful!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Your dropshipping order has been received. We'll start fulfillment immediately. Your profit will be added to your balance once the customer pays.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/order-list" className="bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all">
              Track Orders
            </Link>
            <Link href="/all-products" className="text-gray-500 font-bold hover:text-black transition-colors">
              Continue Sourcing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-bold uppercase tracking-widest">
          <Link href="/dropshipping-cart" className="hover:text-primary-color transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Customer & Shipping Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-btn-color p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bg bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent-content" />
                  </div>
                  <h2 className="text-xl font-semibold text-accent-content">গ্রাহকের তথ্য (Customer Details)</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম *</label>
                    <input name="name" value={customerInfo.name} onChange={handleInputChange} placeholder="গ্রাহকের নাম লিখুন" className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-color outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নম্বর *</label>
                    <input name="phone" value={customerInfo.phone} onChange={handleInputChange} placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-color outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-btn-color p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bg bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent-content" />
                  </div>
                  <h2 className="text-xl font-semibold text-accent-content">ডেলিভারি ঠিকানা (Shipping Address)</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">সম্পূর্ণ ঠিকানা *</label>
                    <textarea name="address" value={customerInfo.address} onChange={handleInputChange} placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম" className="w-full px-4 py-3 border rounded-xl bg-bg focus:ring-2 focus:ring-primary-color outline-none" rows={3} />
                  </div>
                </div>
              </div>
            </div>

            <LocationSelects customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} isDropshipping={true} />

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-color/10 rounded-2xl">
                  <CreditCard className="w-6 h-6 text-primary-color" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('balance')}
                  className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left ${paymentMethod === 'balance' ? 'border-primary-color bg-primary-color/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'balance' ? 'bg-primary-color text-black' : 'bg-gray-100 text-gray-400'}`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Pay with Balance</p>
                    <p className="text-xs text-gray-500 font-bold">Current: ৳{Number(user?.balance || 0).toLocaleString()}</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('manual')}
                  className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left ${paymentMethod === 'manual' ? 'border-primary-color bg-primary-color/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'manual' ? 'bg-primary-color text-black' : 'bg-gray-100 text-gray-400'}`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Manual Payment</p>
                    <p className="text-xs text-gray-500 font-bold">Bkash/Nagad/Rocket</p>
                  </div>
                </button>
              </div>

              {/* Transaction details input for manual payment */}
              {paymentMethod === 'manual' && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm font-bold text-gray-700">Select a payment gateway and send ৳{total.toLocaleString()} to the given number.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manualMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedManualMethod(method.id)}
                        className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all ${selectedManualMethod === method.id ? 'border-primary-color bg-primary-color/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <span className="font-black text-gray-900">{method.name}</span>
                        <span className="text-xs text-primary-color font-bold">{method.number}</span>
                      </button>
                    ))}
                  </div>

                  {selectedManualMethod && (
                    <div className="mt-4 p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Transaction ID</label>
                          <input
                            name="transactionId"
                            value={paymentDetails.transactionId}
                            onChange={handlePaymentInputChange}
                            placeholder="e.g. 9ABCDEFGH"
                            className="w-full bg-white border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-primary-color shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sender Number</label>
                          <input
                            name="senderNumber"
                            value={paymentDetails.senderNumber}
                            onChange={handlePaymentInputChange}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-primary-color shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-8 space-y-8">
              <h3 className="text-2xl font-black text-gray-900">Order Summary</h3>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.productId._id} className="flex gap-4">
                    <img src={item.productId.images?.[0]} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.productId.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Product Cost</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Delivery Charge</span>
                  <span>৳{deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-4">
                  <span>Total Cost</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-primary-color text-black py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 transform hover:-translate-y-1"
              >
                {isProcessing ? 'Processing...' : 'Place Dropshipping Order'}
              </button>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Secured & Verified Dropshipping Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropshippingCheckoutComponent;
