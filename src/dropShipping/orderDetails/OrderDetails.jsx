'use client'
import React from 'react';
import { useOrderDetails } from '@/src/utlis/useOrderDetails';
import {
  Package, MapPin, Phone, User, CreditCard, ChevronRight,
  Loader2, Home, Calendar, Clock, CheckCircle2, XCircle,
  Truck, TrendingUp, ArrowLeft, ReceiptText, Hash
} from 'lucide-react';
import Link from 'next/link';

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:    { cls: "bg-amber-50 text-amber-700 border-amber-200",      icon: <Clock className="w-4 h-4" /> },
    processing: { cls: "bg-blue-50 text-blue-700 border-blue-200",         icon: <Truck className="w-4 h-4" /> },
    shipped:    { cls: "bg-indigo-50 text-indigo-700 border-indigo-200",   icon: <Truck className="w-4 h-4" /> },
    delivered:  { cls: "bg-emerald-50 text-emerald-700 border-emerald-200",icon: <CheckCircle2 className="w-4 h-4" /> },
    cancelled:  { cls: "bg-rose-50 text-rose-700 border-rose-200",         icon: <XCircle className="w-4 h-4" /> },
    completed:  { cls: "bg-teal-50 text-teal-700 border-teal-200",         icon: <CheckCircle2 className="w-4 h-4" /> },
  };
  const s = status?.toLowerCase() || "pending";
  const cfg = map[s] || { cls: "bg-gray-100 text-gray-600 border-gray-200", icon: <Clock className="w-4 h-4" /> };
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black uppercase border ${cfg.cls}`}>
      {cfg.icon} {s}
    </span>
  );
};

/* ── Info row ── */
const InfoRow = ({ label, value, mono }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest w-28 shrink-0 pt-0.5">{label}</span>
    <span className={`flex-1 text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>
      {value || <span className="text-slate-300 italic">—</span>}
    </span>
  </div>
);

const OrderDetails = ({ id }) => {
  const { order, loading, error } = useOrderDetails(id);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="text-slate-400 font-bold text-sm animate-pulse">Loading order details…</p>
        </div>
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 bg-white rounded-3xl p-12 shadow-sm border border-slate-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Order Not Found</h2>
          <p className="text-slate-400 text-sm">We couldn't retrieve the details for this order.</p>
          <Link
            href="/order-list"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  /* ── Data normalisation ── */
  // Backend always stores address under `address` key
  const addr = order.address || {};
  const products = order.products || [];

  const totalCost = products.reduce((s, p) =>
    s + (Number(p.costPrice || p.price || 0) * (p.quantity || 1)), 0);
  const totalSell = products.reduce((s, p) =>
    s + (Number(p.sellingPrice || p.price || 0) * (p.quantity || 1)), 0);
  const totalProfit = totalSell - totalCost;
  const isDS = products.some(p => p.sellingPrice > 0 && p.sellingPrice !== p.price);

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-BD", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      })
    : "—";

  const orderIdDisplay = order.orderId || order._id || "—";

  /* ── Payment info (nested under payment_details.manual) ── */
  const paymentMethod  = order.payment_method  || "—";
  const paymentStatus  = order.payment_status  || "pending";
  const manualPayment  = order.payment_details?.manual || {};
  const paymentProvider  = manualPayment.provider      || null;
  const transactionId    = manualPayment.transactionId || null;
  const senderNumber     = manualPayment.senderNumber  || null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/order-list" className="hover:text-emerald-600 transition-colors">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-emerald-600 font-bold truncate max-w-[120px]">#{orderIdDisplay.slice(-8).toUpperCase()}</span>
        </nav>

        {/* ── Invoice card ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Header stripe */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Invoice</p>
                <p className="text-white font-black text-base">EasyShoppingMall</p>
              </div>
            </div>
            <StatusBadge status={order.order_status} />
          </div>

          {/* Order meta */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono text-slate-700">{orderIdDisplay}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {dateStr}
            </span>
          </div>

          <div className="p-6 space-y-5">

            {/* ── Customer info ── */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" /> Customer & Delivery
              </h3>
              <div className="bg-slate-50 rounded-2xl px-4">
                <InfoRow label="Name"     value={addr.customer_name} />
                <InfoRow label="Mobile"   value={addr.mobile} />
                <InfoRow label="Division" value={addr.division} />
                <InfoRow label="District" value={addr.district} />
                <InfoRow label="Upazila"  value={addr.upazila_thana} />
                <InfoRow label="Address"  value={addr.address_line} />
                {addr.pincode && <InfoRow label="Post Code" value={addr.pincode} />}
              </div>
            </div>

            {/* ── Payment info ── */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Payment
              </h3>
              <div className="bg-slate-50 rounded-2xl px-4">
                <InfoRow label="Method"  value={paymentMethod} />
                <InfoRow label="Type"    value={order.payment_type || "—"} />
                <InfoRow label="Status"  value={
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    paymentStatus === "paid"      ? "bg-emerald-100 text-emerald-700" :
                    paymentStatus === "submitted" ? "bg-blue-100 text-blue-700" :
                    paymentStatus === "failed"    ? "bg-rose-100 text-rose-700" :
                    paymentStatus === "refunded"  ? "bg-purple-100 text-purple-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{paymentStatus}</span>
                } />
                {paymentProvider && <InfoRow label="Provider"   value={paymentProvider} />}
                {senderNumber   && <InfoRow label="Sender No." value={senderNumber} />}
                {transactionId  && <InfoRow label="TrxID"      value={transactionId} mono />}
              </div>
            </div>

            {/* ── Products table ── */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" /> Products ({products.length})
              </h3>

              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Qty</th>
                      <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                        {isDS ? "Cost / Sell" : "Price"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((product, i) => {
                      const img = product.image?.[0] || product.images?.[0] || "/images/placeholder.jpg";
                      const costPrice = Number(product.costPrice || product.price || 0);
                      const sellPrice = Number(product.sellingPrice || product.price || 0);
                      const profit = (sellPrice - costPrice) * (product.quantity || 1);
                      return (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                                <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">{product.name || "Unknown"}</p>
                                <div className="flex gap-2 mt-0.5 flex-wrap">
                                  {product.size  && <span className="text-[10px] text-slate-400 font-semibold">Size: {product.size}</span>}
                                  {product.color && <span className="text-[10px] text-slate-400 font-semibold">Color: {product.color}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-xs font-black text-slate-700">
                              {product.quantity || 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isDS ? (
                              <div>
                                <p className="text-xs text-slate-400 font-semibold">Cost: ৳{costPrice.toLocaleString()}</p>
                                <p className="text-sm font-black text-slate-900">Sell: ৳{sellPrice.toLocaleString()}</p>
                                {profit > 0 && (
                                  <p className="text-xs font-black text-emerald-600">+৳{profit.toLocaleString()}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm font-black text-slate-900">৳{sellPrice.toLocaleString()}</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Totals ── */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-500">
                <span>Product Cost</span>
                <span className="text-slate-700">৳{totalCost.toLocaleString()}</span>
              </div>
              {isDS && (
                <div className="flex justify-between text-sm font-semibold text-slate-500">
                  <span>Total Selling Price</span>
                  <span className="text-slate-700">৳{totalSell.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-slate-500">
                <span>Delivery Charge</span>
                <span className="text-slate-700">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-emerald-600">৳{(order.totalAmt || order.total || 0).toLocaleString()}</span>
              </div>
              {isDS && totalProfit > 0 && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Your Profit
                  </span>
                  <span className="text-lg font-black text-emerald-600">৳{totalProfit.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* ── Thank you note ── */}
            <p className="text-xs text-slate-400 italic text-center px-4">
              Dear {addr.customer_name || "Customer"}, thank you for your order with EasyShoppingMall. 🎉
            </p>
          </div>
        </div>

        {/* ── Back button ── */}
        <div className="flex justify-center pb-6">
          <Link
            href="/order-list"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;