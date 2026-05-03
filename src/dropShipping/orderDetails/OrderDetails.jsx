"use client";
import React, { useState } from 'react';
import { useOrderDetails } from '@/src/utlis/useOrderDetails';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PaymentModal from './PaymentModal';

import { useDispatch, useSelector } from 'react-redux';

const OrderDetails = ({ id }) => {
  const { order, loading, error, refetch } = useOrderDetails(id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('delivery'); // 'delivery' or 'full'
  const user = useSelector((state) => state.user.data);

  const handleOpenPayment = (type) => {
    setSelectedPaymentType(type);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="text-slate-400 font-bold text-sm animate-pulse">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 text-center">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Not Found</h2>
          <p className="text-gray-500 font-medium">{error || "We couldn't retrieve this order's details."}</p>
          <Link href="/order-list" className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const addr = order.address || {};
  const products = order.products || [];
  const orderIdDisplay = order.orderId || order._id || "—";

  // Use dropshipper's own branding if available
  const displayBrandName = user?.shopName || "EasyShoppingMall";
  const displayBrandLogo = user?.shopLogo;

  return (
    <div className="min-h-screen bg-bg py-10 px-4 md:px-0">
      {/* Payment Prompt Section (Only if pending and not yet paid) */}
      {(order.order_status === 'pending' || order.order_status === 'processing') && order.payment_status !== 'paid' && order.payment_status !== 'submitted' && (
        <div className="max-w-2xl mx-auto mt-6 bg-accent-content shadow-sm rounded-[2rem] overflow-hidden border border-slate-100 p-8 text-center space-y-6">
          <p className="text-emerald-700 font-black text-xl md:text-2xl tracking-tighter">
            অর্ডার টি অ্যাপ্রুভ করতে ডেলিভারি চার্জ পে করুন।
          </p>

          <div className="flex justify-center">
            <button 
              onClick={() => handleOpenPayment('delivery')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black py-4 px-10 rounded-2xl flex items-center gap-2 transform transition hover:scale-105 shadow-xl shadow-emerald-500/20"
            >
              ডেলিভারি চার্জ পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
          </div>

          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">অথবা</p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => handleOpenPayment('full')}
              className="bg-slate-50 hover:bg-emerald-50 text-emerald-900 border border-slate-100 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transform transition hover:translate-y-[-2px] flex-1"
            >
              ফুল পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
            <button 
              onClick={() => handleOpenPayment('delivery')}
              className="bg-slate-50 hover:bg-emerald-50 text-emerald-900 border border-slate-100 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transform transition hover:translate-y-[-2px] flex-1"
            >
              আংশিক পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
          </div>

          <p className="text-emerald-700 font-bold text-sm bg-emerald-50 py-3 rounded-xl">
            অ্যাপস এর ব্যালান্স থেকেও পেমেন্ট করতে পারবেন।
          </p>
        </div>
      )}

      {/* Payment Submitted Message */}
      {order.payment_status === 'submitted' && (
        <div className="max-w-2xl mx-auto mt-6 bg-amber-50 shadow-sm rounded-[2rem] overflow-hidden border border-amber-100 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
          </div>
          <p className="text-amber-800 font-black text-lg tracking-tight">
            আপনার পেমেন্ট তথ্য জমা দেওয়া হয়েছে।
          </p>
          <p className="text-amber-700 text-sm font-medium">
            অ্যাডমিন আপনার পেমেন্ট ভেরিফাই করার পর অর্ডার টি অ্যাপ্রুভ করা হবে। অনুগ্রহ করে অপেক্ষা করুন।
          </p>
        </div>
      )}

      {isPaymentModalOpen && (
        <PaymentModal 
          order={order} 
          paymentType={selectedPaymentType}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={refetch}
        />
      )}

      <div className="max-w-2xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-[3rem] overflow-hidden border border-slate-100 mt-8">

        {/* Header section */}
        <div className="text-center py-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-3 h-3 rounded-full ${order.order_status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
            <h2 className="text-slate-400 uppercase tracking-[0.3em] text-[10px] font-black">{order.order_status} INVOICE</h2>
          </div>

          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            {displayBrandLogo ? (
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/30 border-4 border-white">
                <img src={displayBrandLogo} alt={displayBrandName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform rotate-6 hover:rotate-0 transition-all duration-500">
                <span className="text-white text-4xl font-black italic">E</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{displayBrandName}</h1>
          <p className="text-slate-400 text-sm font-medium">Your trusted dropshipping partner</p>
        </div>

        <div className="px-10">
          <hr className="border-t-2 border-dashed border-slate-100" />
        </div>

        {/* Customer & Order Info Section */}
        <div className="p-10 space-y-6">
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Order ID</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">:</span>
              <span className="text-slate-950 font-black tracking-tight text-lg">{orderIdDisplay}</span>
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Mobile</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">:</span>
              <span className="text-slate-800 font-bold">{addr.mobile || "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Name</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">:</span>
              <span className="text-slate-800 font-black">{addr.customer_name || "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-start gap-4">
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">Address</span>
            <div className="flex items-start gap-2">
              <span className="text-slate-300 mt-0.5">:</span>
              <span className="text-slate-600 font-medium leading-relaxed">
                {[addr.address_line, addr.upazila_thana, addr.district, addr.division].filter(Boolean).join(" > ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">COD TK</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">:</span>
              <span className="text-emerald-600 font-black text-2xl tracking-tighter"> ৳{order.totalAmt?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Product Table Section */}
        <div className="px-10 pb-12">
          <div className="border-2 border-slate-50 rounded-[2rem] overflow-hidden shadow-inner bg-slate-50/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest border-x border-slate-200">Details</th>
                  <th className="px-6 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const img = product.image?.[0] || product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop";
                  return (
                    <tr key={index} className="border-b border-slate-100 last:border-b-0 hover:bg-white transition-colors">
                      <td className="px-6 py-6 align-top w-28">
                        <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transform hover:scale-110 transition-transform">
                          <img
                            src={img}
                            alt="product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-6 align-top border-x border-slate-200">
                        <div className="space-y-2">
                          <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{product.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Code:</span>
                            <span className="text-xs font-bold text-slate-800">{product.productId?.toString().slice(-6).toUpperCase()}</span>
                          </div>
                          {product.size && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase">Size:</span>
                              <span className="text-xs font-bold text-slate-800">{product.size}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Qty:</span>
                            <span className="text-xs font-bold text-slate-800">{product.quantity} X ৳{product.sellingPrice || product.price}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 align-middle text-center">
                        <span className="text-emerald-600 font-black text-xl tracking-tighter">৳{(product.totalPrice || (product.price * product.quantity)).toLocaleString()}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer section */}
        <div className="px-10 pb-12 space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-inner">
            <p className="text-emerald-900 font-bold text-center leading-relaxed">
              Dear <span className="text-emerald-600 font-black">{addr.customer_name}</span>, thanks for confirming the order. 🎉
            </p>
          </div>

          {(user?.shopAddress || user?.shopWebsite) && (
            <div className="text-center space-y-1">
              {user?.shopAddress && <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{user.shopAddress}</p>}
              {user?.shopWebsite && (
                <a href={user.shopWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-xs font-bold hover:underline">
                  {user.shopWebsite.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;