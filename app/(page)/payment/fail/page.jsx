"use client";

import { Home, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center animate-fadeIn">
                <XCircle className="mx-auto text-red-600 w-20 h-20 mb-4" />

                <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
                <p className="text-gray-500 mt-2">
                    Something went wrong. Your payment could not be processed.
                </p>

                <div className="mt-6 space-y-3">
                    <Link
                        href="/checkout"
                        className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl py-2 hover:bg-red-700 transition"
                    >
                        <RotateCcw size={18} /> Try Again
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
