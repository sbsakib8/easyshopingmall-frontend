"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logout } from "@/src/hook/useAuth";

export default function BlockedPage() {
  const user = useSelector((state) => state.user.data);
  const router = useRouter();

  useEffect(() => {
    // If user is not blocked, redirect to home
    const isBlocked = user?.status === "Blocked" || user?.status === "blocked";
    
    if (!isBlocked) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await Logout(router);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isBlocked = user?.status === "Blocked" || user?.status === "blocked";
  if (!isBlocked) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Blocked</h1>
        
        <p className="text-gray-600 mb-6">
          Your account has been blocked by the administrator. If you believe this is a mistake, 
          please contact support for assistance.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>

        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact us at support@easyshoppingmallbd.com
        </p>
      </div>
    </div>
  );
}
