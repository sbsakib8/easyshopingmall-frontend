"use client";

import React from "react";
import { Truck, ShieldCheck, Award, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "ফ্রি ডেলিভারি",
    subtitle: "(২য় অর্ডার থেকে)",
  },
  {
    icon: Award,
    title: "১০০% অরিজিনাল",
    subtitle: "পণ্য নিশ্চিত",
  },
  {
    icon: ShieldCheck,
    title: "সিকিউর পেমেন্ট",
    subtitle: "সুরক্ষিত লেনদেন",
  },
  {
    icon: Headphones,
    title: "২৪/৭ সাপোর্ট",
    subtitle: "আপনার পাশে সবসময়",
  },
];

export default function TrustBadges() {
  return (
    <div className="container mx-auto px-4 max-w-7xl my-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {badges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={idx}
              className="bg-card rounded-2xl p-3 sm:p-4 border border-line shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm text-white">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-ink truncate">
                  {badge.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted truncate">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
