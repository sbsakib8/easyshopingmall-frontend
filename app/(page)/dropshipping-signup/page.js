'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DropshippingSignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup?role=DROPSHIPPING');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F4FD]/40 to-white flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 text-gray-600 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#0092EE]" />
        <span className="text-sm font-medium text-gray-700">ড্রপশিপিং সাইনআপ পেজে নিয়ে যাওয়া হচ্ছে...</span>
      </div>
    </div>
  );
}
