"use client";
import { dsCartClear, dsCartRemove, updateDsQuantityLocal, updateDsSellingPriceLocal } from '@/src/redux/dropshippingCartSlice';
import {
  ArrowRight,
  Calculator,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Shield,
  Clock,
  TrendingUp,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";

const DropshippingCartComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items = [], loading } = useSelector((state) => state.dropshippingCart);
  const user = useSelector((state) => state.user.data);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSellingPrice = items.reduce((sum, item) => {
    const sp = item.sellingPrice === "" ? 0 : (item.sellingPrice ?? item.price);
    return sum + (sp * item.quantity);
  }, 0);
  const totalProfit = totalSellingPrice - subtotal;

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      dispatch(dsCartRemove(productId));
      return;
    }
    dispatch(updateDsQuantityLocal({ productId, quantity: newQty }));
  };

  const handleUpdateSellingPrice = (productId, sellingPrice) => {
    dispatch(updateDsSellingPriceLocal({ productId, sellingPrice }));
  };

  const handleBlurSellingPrice = (productId, sellingPrice, costPrice) => {
    if (sellingPrice === "" || Number(sellingPrice) < costPrice) {
      toast.error("Selling price cannot be less than cost price");
      // Removed automatic reset to allow user to see/fix the invalid value
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const hasInvalidPrice = items.some(item =>
      item.sellingPrice === "" || Number(item.sellingPrice) < item.price
    );

    if (hasInvalidPrice) {
      toast.error("Selling price cannot be less than cost price. Please fix invalid prices before checkout.");
      return;
    }
    router.push("/dropshipping-checkout");
  };

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dropshipping cart.</p>
          <Link href="/signin" className="bg-primary text-black px-6 py-3 rounded-xl font-bold">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-emerald-600" />
              Dropshipping Cart
            </h1>
            <p className="text-gray-600 mt-2">Manage orders for your customers and maximize your profit.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your Balance</p>
              <p className="text-xl font-black text-emerald-600">৳{Number(user?.balance || 0).toLocaleString()}</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your dropshipping cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start adding products to your specialized dropshipping cart to begin fulfilling orders for your clients.</p>
            <Link href="/all-products" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all">
              Browse Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img src={item.productId.images?.[0]} alt={item.productId.productName} className="w-full md:w-32 h-32 object-cover rounded-2xl" />
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.productId.productName}</h3>
                          <p className="text-sm text-gray-500">Cost Price: <span className="font-bold">৳{item.price}</span></p>
                        </div>
                        <button onClick={() => dispatch(dsCartRemove(item.productId._id))} className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        {/* Quantity Control */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Quantity</label>
                          <div className="flex items-center gap-4 bg-gray-50 w-fit p-1 rounded-xl">
                            <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Selling Price Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Your Selling Price (৳)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={item.sellingPrice ?? item.price}
                              onChange={(e) => handleUpdateSellingPrice(item.productId._id, e.target.value)}
                              onBlur={(e) => handleBlurSellingPrice(item.productId._id, e.target.value, item.price)}
                              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-4 pr-12 font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
                            />
                            <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          </div>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            Estimated Profit: ৳{(((item.sellingPrice === "" ? 0 : (item.sellingPrice ?? item.price)) - item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Summary</h3>
                  <div className="w-12 h-1.5 bg-emerald-600 rounded-full" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Subtotal (Cost)</span>
                    <span className="text-gray-900 font-bold">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Total Selling Price</span>
                    <span className="text-gray-900 font-bold">৳{totalSellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">Your Profit</span>
                    <span className="text-2xl font-black text-emerald-600">৳{totalProfit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl space-y-3 border border-emerald-100">
                  <div className="flex items-center gap-3 text-emerald-600 font-black">
                    <Calculator className="w-5 h-5" />
                    <span>লাভের বিবরণ</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    গ্রাহক সফলভাবে অর্ডারটি গ্রহণ করার পর আপনার লাভ আপনার ব্যালেন্সে যোগ করা হবে।
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-1"
                >
                  <CreditCard className="w-6 h-6" />
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                    <Shield className="w-3 h-3" />
                    Secure Order
                  </div>
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Fast Fulfillment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropshippingCartComponent;
