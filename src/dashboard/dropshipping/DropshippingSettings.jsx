"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Percent,
  Info
} from "lucide-react";
import { WebsiteinfoAllGet, WebsiteinfoUploade } from "@/src/hook/content/useWebsiteInfo";

export default function DropshippingSettings() {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [referralPercentage, setReferralPercentage] = useState(0);

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });


  const fetchData = async () => {
    try {
      setDataLoading(true);
      const res = await WebsiteinfoAllGet();
      const info = res.websiteinfo?.[0] || res.data?.[0];
      if (info) {
        setWebsiteInfo(info);
        setReferralPercentage(info.referralPercentage || 0);

      }

    } catch (err) {
      console.error("Fetch website info error:", err);
      showNotification("Failed to load settings.", "error");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSave = async () => {
    if (!websiteInfo?._id) {
      showNotification("No website configuration found to update.", "error");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...websiteInfo,
        referralPercentage: Number(referralPercentage)
      };


      await WebsiteinfoUploade(updateData, websiteInfo._id);
      showNotification("Referral settings updated successfully!");
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
      showNotification("Failed to update settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8 text-accent-content">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-6 right-6 z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn backdrop-blur-sm`}>
            {notification.type === 'success' ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Dropshipping Settings</h1>
              <p className="text-gray-400 mt-1">Configure global dropshipping parameters and referral incentives</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 md:p-10 shadow-2xl">
          {dataLoading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-gray-400 font-medium">Loading settings...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Referral Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-400">৳</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Referral Incentives</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                      Referral Bonus Amount (৳)
                    </label>
                    <div className="relative group">
                      <input
                        type="number"
                        value={referralPercentage}
                        onChange={(e) => setReferralPercentage(e.target.value)}
                        min="0"
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-6 py-4 text-2xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all group-hover:border-gray-600"
                        placeholder="0"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">৳</div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      This fixed amount in Taka will be awarded to the referrer for each successfully delivered order.
                    </p>
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 flex gap-4">
                    <Info className="w-8 h-8 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-indigo-300 font-bold mb-1">Fixed Bonus System</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        সিস্টেমটি এখন নির্দিষ্ট পরিমাণ বোনাস দেওয়ার জন্য সেট করা হয়েছে। রেফার করা কোনো ব্যবহারকারী প্রতিবার একটি অর্ডার সম্পন্ন করলে, ড্রপশিপার তার ব্যালেন্সে ঠিক এই নির্দিষ্ট পরিমাণ বোনাস পাবেন।
                      </p>
                    </div>
                  </div>
                </div>


              </section>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-700 flex justify-end gap-4">
                <button
                  onClick={fetchData}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-3 transition-all transform hover:-translate-y-1"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {loading ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
