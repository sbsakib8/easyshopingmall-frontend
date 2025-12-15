"use client";

import { AlertTriangle, CornerUpLeft, Home } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center animate-fadeIn">
                <AlertTriangle className="mx-auto text-yellow-500 w-20 h-20 mb-4" />

                <h1 className="text-2xl font-bold text-gray-800">Payment Pending</h1>
                <p className="text-gray-500 mt-2">
                    You Panding the payment process. No amount was charged.
                </p>

                <div className="mt-6 space-y-3">
                    <Link
                        href="/checkout"
                        className="flex items-center justify-center gap-2 bg-yellow-500 text-white rounded-xl py-2 hover:bg-yellow-600 transition"
                    >
                        <CornerUpLeft size={18} /> Go Back to Checkout
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition"
                    >
                        <Home size={18} /> Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
