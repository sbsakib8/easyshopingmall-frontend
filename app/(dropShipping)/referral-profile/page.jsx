"use client"
import React from 'react';
import { Share2, Users, Gift, Copy, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ReferralProfile = () => {
  const user = useSelector((state) => state.user.data);
  const referralCode = user?.referralCode || "EASY-USER-123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary-color/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-10 h-10 text-primary-color" />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Refer & Earn</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Invite your friends to EasyShoppingMall and earn 10 Taka for every 500 Taka they spend on their first delivered order.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 flex flex-col items-center space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Referral Code</p>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
              <span className="text-3xl font-black text-gray-900 tracking-tighter">{referralCode}</span>
              <button onClick={copyToClipboard} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                <Copy className="w-6 h-6 text-primary-color" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-gray-50 p-6 rounded-3xl text-center space-y-2">
              <Users className="w-6 h-6 text-blue-500 mx-auto" />
              <p className="text-2xl font-black text-gray-900">{user?.referralCount || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Referrals</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl text-center space-y-2">
              <Gift className="w-6 h-6 text-purple-500 mx-auto" />
              <p className="text-2xl font-black text-gray-900">৳0</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Earned</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl text-center space-y-2">
              <Check className="w-6 h-6 text-green-500 mx-auto" />
              <p className="text-2xl font-black text-gray-900">{user?.deliveredItemsCount || 0}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Items Sold</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xl font-black text-gray-900">How it works</h3>
            <ul className="space-y-4">
              {[
                "Share your unique referral code with friends.",
                "Friends sign up using your code.",
                "You get a bonus when they complete a purchase.",
                "Withdraw your earnings to your main balance."
              ].map((step, i) => (
                <li key={i} className="flex gap-4 text-sm font-medium text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-color/10 text-primary-color rounded-full flex items-center justify-center font-bold">{i+1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl space-y-4">
            <h3 className="text-xl font-black">Program Rules</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Referral bonuses are credited only for orders with a minimum value of 500 Taka. The bonus is added to your account after the order is successfully delivered and payment is confirmed.
            </p>
            <button className="w-full bg-primary-color text-black py-4 rounded-2xl font-black hover:opacity-90 transition-opacity">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProfile;
