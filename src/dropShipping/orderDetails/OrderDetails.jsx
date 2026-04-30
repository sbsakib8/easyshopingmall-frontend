'use client'
import React from 'react';
import { useOrderDetails } from '@/src/utlis/useOrderDetails';
import { Package, MapPin, Phone, User, CreditCard, ChevronRight, Loader2 } from 'lucide-react';

const OrderDetails = ({ id }) => {
  const { order, loading, error } = useOrderDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-color animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
          <p className="text-gray-500">We couldn't retrieve the details for this order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-10 px-4 md:px-0">
      {/* Payment Prompt Section - Only show if pending */}
      {order.order_status === "pending" && (
        <div className="max-w-2xl mx-auto mt-6 bg-accent-content/80 shadow-sm rounded-lg overflow-hidden border border-slate-100 p-8 text-center space-y-6">
          <p className="text-secondary font-bold text-xl md:text-2xl">
            অর্ডার টি অ্যাপ্রুভ করতে ডেলিভারি চার্জ পে করুন।
          </p>
          <div className="flex justify-center">
            <button className="bg-btn-color hover:bg-btn-color text-accent-content font-bold py-3 px-8 rounded-lg flex items-center gap-2 transform shadow-md">
              ডেলিভারি চার্জ পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
          </div>
          <p className="text-slate-500 font-medium text-lg">অথবা</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-btn-color hover:bg-btn-color text-accent-content font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transform shadow-md flex-1">
              ফুল পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
            <button className="bg-btn-color hover:bg-btn-color text-accent-content font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transform shadow-md flex-1">
              আংশিক পেমেন্ট করুন <span className="text-xl">»</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-accent-content/80 shadow-sm rounded-lg overflow-hidden border border-slate-100 mt-8">
        {/* Header section */}
        <div className="text-center py-8">
          <h2 className="text-slate-500 uppercase tracking-widest text-sm font-semibold mb-6">INVOICE</h2>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-color rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0">
              <span className="text-white text-4xl font-black italic">E</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">EasyShoppingMall</h1>
          <p className="text-slate-500 text-sm">Mohammadpur, Dhaka, Bangladesh</p>
        </div>

        <hr className="border-t border-slate-100 mx-8" />

        {/* Customer & Order Info Section */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-slate-600 font-medium">Order ID</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">:</span>
              <span className="text-slate-950 font-black tracking-tight">{order.orderId}</span>
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-slate-600 font-medium">Mobile</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">:</span>
              <span className="text-slate-800">{order.address?.mobile}</span>
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-slate-600 font-medium">Name</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">:</span>
              <span className="text-slate-800 font-medium">{order.address?.customer_name}</span>
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-slate-600 font-medium">Address</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">:</span>
              <span className="text-slate-600 leading-relaxed">
                {order.address?.address_line}, {order.address?.upazila_thana}, {order.address?.district}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-slate-600 font-medium uppercase text-sm">COD TK</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">:</span>
              <span className="text-secondary font-black text-lg">৳ {order.totalAmt}</span>
            </div>
          </div>
        </div>

        {/* Product Table Section */}
        <div className="px-8 pb-10">
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-slate-700 font-bold text-sm">Image</th>
                  <th className="px-4 py-3 text-slate-700 font-bold text-sm border-x border-slate-200">Product_Info</th>
                  <th className="px-4 py-3 text-slate-700 font-bold text-sm">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((product, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-4 align-top w-28">
                      <div className="w-20 h-24 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/50">
                        <img
                          src={product.image?.[0] || "https://via.placeholder.com/150"}
                          alt="product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top border-x border-slate-200">
                      <div className="space-y-1">
                        <p className="text-slate-950 font-bold text-sm leading-tight mb-2">{product.name}</p>
                        {product.size && <p className="text-slate-600 text-xs">Size: <span className="font-bold">{product.size}</span></p>}
                        {product.color && <p className="text-slate-600 text-xs">Color: <span className="font-bold">{product.color}</span></p>}
                        <p className="text-slate-600 text-xs">Qty: <span className="font-bold">{product.quantity}</span></p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span className="text-secondary font-bold text-lg">৳{product.sellingPrice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-8 pb-12">
          <p className="text-slate-700 font-medium italic">
            Dear {order.address?.customer_name}, thanks for confirming the order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;