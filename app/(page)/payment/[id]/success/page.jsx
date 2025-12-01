"use client";

import { CheckCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f4] px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">

                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={50} className="text-green-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you! Your order has been successfully placed.
                </p>

                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                    <ShoppingBag size={18} /> View Orders
                </Link>
            </div>
        </div>
    );
}
