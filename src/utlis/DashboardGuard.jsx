"use client";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function DashboardGuard({ section, children }) {
  const { hasSectionAccess, isUserAdmin } = useDashboardPermission();
  const router = useRouter();

  const allowed = isUserAdmin || hasSectionAccess(section);

  if (!allowed) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-800/50 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-800/50">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You don&apos;t have permission to access the <span className="text-white font-semibold">{section}</span> section.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-800 transition-all border border-gray-600/50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
