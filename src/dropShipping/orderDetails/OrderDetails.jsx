"use client";

import { useState } from "react";
import { useOrderDetails } from "@/src/utlis/useOrderDetails";
import { Modal } from "@mui/material";
import Link from "next/link";
import PaymentModal from "@/src/dropShipping/orderDetails/PaymentModal";

import {
  Loader2,
  AlertCircle,
  Truck,
  CreditCard,
  Wallet,
  ArrowRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import Container from "@/src/compronent/shared/Container";
import { cn } from "@/src/utlis/utils";
import Image from "next/image";
import BackButton from "../BackButton/BackButton";

const OrderDetails = ({ id }) => {
  const { order, loading, error, refetch } = useOrderDetails(id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("delivery"); // 'delivery' or 'full'
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
          <p className="text-slate-400 font-bold text-sm animate-pulse">
            Loading order details…
          </p>
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
          <p className="text-gray-500 font-medium">
            {error || "We couldn't retrieve this order's details."}
          </p>
          <Link
            href="/order-list"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const addr = order.address || {};
  const products = order.products || [];
  const orderIdDisplay = order.orderId || order._id || "—";

  // Payment method label helpers
  const paymentMethodLabel = {
    manual: "Manual (bKash / Nagad / Rocket)",
    sslcommerz: "SSLCommerz (Card / Mobile)",
    balance: "App Balance",
    cod: "Cash on Delivery (COD)",
  };
  const paymentTypeLabel = {
    full: "Full Payment",
    delivery: "Delivery Charge Only",
    cod: "Cash on Delivery",
  };
  const paymentStatusBadge = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-700" },
    paid: { label: "Paid ✓", cls: "bg-emerald-100 text-emerald-700" },
    failed: { label: "Failed", cls: "bg-rose-100 text-rose-700" },
    refunded: { label: "Refunded", cls: "bg-purple-100 text-purple-700" },
  };
  const pyMethodDisplay = paymentMethodLabel[order.payment_method] || order.payment_method || "—";
  const pyTypeDisplay = paymentTypeLabel[order.payment_type] || order.payment_type || "—";
  const pyStatusInfo = paymentStatusBadge[order.payment_status] || { label: order.payment_status || "—", cls: "bg-slate-100 text-slate-600" };

  // Payment status helpers
  const hasPaidDelivery =
    order.payment_type === "delivery" &&
    (order.payment_status === "paid" ||
      order.payment_status === "submitted");
  const hasPaidFull =
    order.payment_type === "full" &&
    (order.payment_status === "paid" ||
      order.payment_status === "submitted");
  // Show payment prompt if order is active and full payment hasn't been made
  const showPaymentPrompt =
    (order.order_status === "pending" || order.order_status === "processing") &&
    !hasPaidFull;

  // Use dropshipper's own branding if available
  const displayBrandName = user?.shopName || "EasyShoppingMall";
  const displayBrandLogo = user?.shopLogo;

  return (
    <>
      <section className="min-h-screen bg-bg py-10">
        <Container className="px-2 max-w-2xl space-y-6">
          <BackButton />

          {/* Payment Prompt Section */}
          {showPaymentPrompt && (
            <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100 p-8 md:p-10 text-center space-y-8 relative">
              {/* Background Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 pointer-events-none" />

              <div className="relative space-y-8">
                {/* Main Message */}
                <div className="space-y-3">
                  <div className="mx-auto size-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Truck className="size-9 text-emerald-600" />
                  </div>
                  <h1 className="text-emerald-800 font-black text-lg sm:text-xl md:text-2xl leading-tight tracking-tight">
                    অর্ডার টি অ্যাপ্রুভ করতে{" "}
                    <br className="hidden sm:block" />
                    ডেলিভারি চার্জ পে করুন
                  </h1>
                </div>

                {/* Primary Action Button — Delivery Charge */}
                <div className="relative">
                  <button
                    onClick={() => !hasPaidDelivery && handleOpenPayment("delivery")}
                    disabled={hasPaidDelivery}
                    className={cn(
                      "w-full font-semibold py-3 px-4 rounded-3xl text-base transition-all duration-300 flex items-center justify-center gap-3 group",
                      (hasPaidDelivery || hasPaidFull || order.payment_type === "full")
                        ? "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-1 active:scale-[0.985]"
                    )}
                  >
                    <Truck className="w-6 h-6 group-hover:rotate-12 transition-transform hidden sm:inline-block" />
                    <p>ডেলিভারি চার্জ পেমেন্ট করুন</p>
                    {hasPaidDelivery ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ সম্পন্ন
                      </span>
                    ) : (
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  <p className="text-slate-400 font-black text-sm uppercase tracking-[3px]">
                    অথবা
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>

                {/* Secondary Options */}
                <div className="flex flex-col sm:flex-row items-center justify-evenly gap-2">
                  {/* Full Payment */}
                  <button
                    onClick={() => handleOpenPayment("full")}
                    disabled={hasPaidFull}
                    className={cn(
                      "group border-2 py-3 px-4 rounded-3xl font-semibold transition-all duration-300 flex flex-1 w-full items-center justify-center gap-3 text-base",
                      hasPaidFull
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-200 text-emerald-800 hover:-translate-y-1 active:scale-[0.98]"
                    )}
                  >
                    <CreditCard className="w-5 h-5 hidden sm:inline-block transition-transform group-hover:scale-110" />
                    <span>ফুল পেমেন্ট করুন</span>
                    {hasPaidFull && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ সম্পন্ন
                      </span>
                    )}
                  </button>

                  {/* Partial / Delivery Payment */}
                  <button
                    onClick={() => !hasPaidDelivery && handleOpenPayment("delivery")}
                    disabled={hasPaidDelivery}
                    className={cn(
                      "group border-2 py-3 px-4 rounded-3xl font-semibold transition-all duration-300 flex flex-1 w-full items-center justify-center gap-3 text-base",
                      hasPaidDelivery
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-200 text-emerald-800 hover:-translate-y-1 active:scale-[0.98]"
                    )}
                  >
                    <Truck className="w-5 h-5 hidden sm:inline-block transition-transform group-hover:scale-110" />
                    <span>আংশিক পেমেন্ট করুন</span>
                    {hasPaidDelivery && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ সম্পন্ন
                      </span>
                    )}
                  </button>
                </div>

                {/* App Balance Note */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl py-3 px-4 sm:py-4 sm:px-6">
                  <p className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs sm:text-sm">
                    <Wallet className="w-5 h-5 hidden sm:inline-block" />
                    অ্যাপস এর ব্যালান্স থেকেও পেমেন্ট করতে পারবেন
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Submitted Message */}
          {order.payment_status === "submitted" && (
            <div className="bg-amber-50 shadow-sm rounded-[2rem] overflow-hidden border border-amber-100 p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              </div>
              <p className="text-amber-800 font-black text-lg tracking-tight">
                আপনার পেমেন্ট তথ্য জমা দেওয়া হয়েছে।
              </p>
              <p className="text-amber-700 text-sm font-medium">
                অ্যাডমিন আপনার পেমেন্ট ভেরিফাই করার পর অর্ডার টি অ্যাপ্রুভ করা
                হবে। অনুগ্রহ করে অপেক্ষা করুন।
              </p>
            </div>
          )}

          <div className="bg-white shadow-2xl shadow-slate-200/60 rounded-[2.75rem] overflow-hidden border border-slate-100">
            {/* Header Section */}
            <div className="relative px-6 pt-10 pb-8 text-center bg-gradient-to-b from-slate-50 to-white">
              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${order.order_status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`}
                />
                <p className="text-slate-400 uppercase tracking-[0.125em] text-xs font-semibold">
                  {order.order_status} INVOICE
                </p>
              </div>

              {/* Brand Logo */}
              <div className="flex justify-center mb-4">
                {displayBrandLogo ? (
                  <div className="size-16 rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-500">
                    <Image
                      src={displayBrandLogo}
                      alt={displayBrandName}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl hover:rotate-6 transition-transform duration-500">
                    <span className="text-white text-3xl font-bold tracking-tighter">
                      E
                    </span>
                  </div>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tighter mb-1">
                {displayBrandName}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-medium">
                Your Trusted Dropshipping Partner
              </p>
            </div>

            {/* Order & Customer Information */}
            <div className="px-3.5 md:px-6 mb-6">
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Order ID
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-base font-medium text-slate-900">
                        {orderIdDisplay}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Mobile
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-base font-medium text-slate-900">
                        {addr.mobile || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Customer Name
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-base font-medium text-slate-900">
                        {addr.customer_name || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400 align-top pt-6">
                        Address
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-base font-medium text-slate-900">
                        {[
                          addr.address_line,
                          addr.upazila_thana,
                          addr.district,
                          addr.division,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/50">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        COD Amount
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5">
                        <span className="text-base sm:text-lg font-medium text-emerald-600 tracking-tighter">
                          ৳{order.totalAmt?.toLocaleString()}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Payment Method
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-sm font-medium text-slate-800">
                        {pyMethodDisplay}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Payment Type
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-sm font-medium text-slate-800">
                        {pyTypeDisplay}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                        Payment Status
                      </td>
                      <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5">
                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${pyStatusInfo.cls}`}>
                          {pyStatusInfo.label}
                        </span>
                      </td>
                    </tr>

                    {order.payment_method === "manual" && order.payment_details?.manual?.provider && (
                      <tr className="hover:bg-slate-50 transition-colors bg-blue-50/30">
                        <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                          Provider
                        </td>
                        <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 text-xs sm:text-sm font-semibold text-slate-800 capitalize">
                          {order.payment_details.manual.provider}
                          {order.payment_details.manual.senderNumber && (
                            <span className="text-slate-500 font-normal ml-2">
                              — {order.payment_details.manual.senderNumber}
                            </span>
                          )}
                        </td>
                      </tr>
                    )}

                    {order.payment_method === "manual" && order.payment_details?.manual?.transactionId && (
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 w-32 md:w-40 font-bold text-xs uppercase tracking-widest text-slate-400">
                          Txn ID
                        </td>
                        <td className="px-3.5 py-2.5 md:px-5.5 md:py-4.5 font-mono text-xs text-slate-700 break-all">
                          {order.payment_details.manual.transactionId}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products Section */}
            <div className="px-6 pb-10">
              <div className="bg-slate-50/70 border border-slate-100 rounded-3xl overflow-x-auto hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white">
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Item
                      </th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Details
                      </th>
                      <th className="px-8 py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product, index) => {
                      const img =
                        product.image?.[0] ||
                        product.images?.[0] ||
                        "/placeholder.jpg";
                      return (
                        <tr
                          key={index}
                          className="hover:bg-white transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="w-20 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                              <Image
                                src={img}
                                alt={product.name}
                                width={200}
                                height={300}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-8 py-6  min-w-[250px]">
                            <div className="space-y-2">
                              <h4 className="font-bold text-slate-900 leading-tight">
                                {product.name}
                              </h4>
                              <div className="text-xs space-y-1 text-slate-600">
                                <p>
                                  Code:{" "}
                                  <span className="font-mono font-bold">
                                    {product.productId
                                      ?.toString()
                                      .slice(-6)
                                      .toUpperCase()}
                                  </span>
                                </p>
                                <p>
                                  Qty:{" "}
                                  <span className="font-semibold">
                                    {product.quantity} × ৳
                                    {product.sellingPrice || product.price}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-lg font-semibold text-emerald-600 tracking-tighter">
                              ৳
                              {(
                                product.totalPrice ||
                                product.price * product.quantity
                              ).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:hidden">
                {products.map((product) => {
                  const img =
                    product.image?.[0] ||
                    product.images?.[0] ||
                    "/placeholder.jpg";

                  const unitPrice = product.sellingPrice || product.price;
                  const totalPrice =
                    product.totalPrice || unitPrice * product.quantity;

                  return (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 active:scale-[0.985]">
                      {/* Image Top */}
                      <div className="relative h-20 w-full bg-slate-100">
                        <Image
                          src={img}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />

                        {/* Quantity Badge */}
                        <div className="absolute top-1.5 right-1.5 bg-white text-slate-800 text-[10px] px-2 py-0.5 rounded-2xl shadow-md flex items-center gap-1">
                          Qty:{" "}
                          <span className="text-emerald-600">
                            {product.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-2.5 space-y-2">
                        {/* Product Name */}
                        <h4 className="font-medium text-sm text-slate-900 line-clamp-2">
                          {product.name}
                        </h4>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                          {product.productId && (
                            <p className="text-slate-500">
                              Code:{" "}
                              <span className="font-mono text-slate-700">
                                {product.productId
                                  .toString()
                                  .slice(-6)
                                  .toUpperCase()}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="flex flex-col justify-between text-[10px]">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <p className=" text-slate-500 mb-0.5">
                              Unit Price:
                            </p>
                            <p className="font-medium text-xs text-slate-800">
                              ৳{unitPrice?.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <p className=" text-slate-500 mb-0.5">Total:</p>
                            <p className="font-medium  text-xs text-emerald-600 tracking-tighter">
                              ৳{totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Message */}
            <div className="mx-6 md:mx-10 mb-10 bg-emerald-50 border border-emerald-100 rounded-3xl p-3 sm:p-5 text-center">
              <p className="text-emerald-800 font-medium leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
                Dear{" "}
                <span className="font-black text-emerald-700">
                  {addr.customer_name}
                </span>
                , thank you for your order! 🎉 We are processing it now.
              </p>
            </div>

            {/* Shop Info */}
            {(user?.shopAddress || user?.shopWebsite) && (
              <div className="px-6 md:px-10 pb-10 text-center text-xs text-slate-400 space-y-1">
                {user.shopAddress && <p>{user.shopAddress}</p>}
                {user.shopWebsite && (
                  <Link
                    href={user.shopWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {user.shopWebsite.replace(/^https?:\/\//, "")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Modal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        closeAfterTransition
      >
        <PaymentModal
          order={order}
          paymentType={selectedPaymentType}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={refetch}
        />
      </Modal>
    </>
  );
};

export default OrderDetails;
