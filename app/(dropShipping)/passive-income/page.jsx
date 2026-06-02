"use client"
import React from 'react';
import { TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';

const PassiveIncome = () => {
  const sections = [
    { title: "Box Leader", icon: <Award className="w-8 h-8 text-yellow-500" />, desc: "Lead your own box and earn commissions on every sale." },
    { title: "Auditor", icon: <ShieldCheck className="w-8 h-8 text-blue-500" />, desc: "Verify quality and earn through our auditing program." },
    { title: "Member", icon: <Users className="w-8 h-8 text-green-500" />, desc: "Join the community and start earning passive rewards." }
  ];

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900">Passive Income Opportunities</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore various ways to earn while you sleep. Our multi-tier programs are designed to reward your leadership and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-4 hover:-translate-y-2 transition-transform cursor-pointer">
              <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <button className="text-primary font-bold text-sm hover:underline">Learn More →</button>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 p-12 rounded-[3rem] border border-primary/20">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Coming Soon: Automatic Payouts</h2>
          <p className="text-gray-600 font-medium">We are integrating a seamless payout system. Your earnings will be credited directly to your balance.</p>
        </div>
      </div>
    </div>
  );
};

export default PassiveIncome;
