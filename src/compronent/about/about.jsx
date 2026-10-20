"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Truck,
  Star,
  Heart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Award,
  Sparkles,
  PhoneCall,
} from "lucide-react";

import Container from "../shared/Container";
import Section from "../shared/Section";
import { cn } from "@/src/utlis/utils";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, number: "১০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
    { icon: ShoppingBag, number: "৫,০০০+", label: "মানসম্মত পণ্য" },
    { icon: Truck, number: "৬৪টি জেলায়", label: "ডেলিভারি সেবা" },
    { icon: Star, number: "৪.৯ / ৫", label: "পজিটিভ রিভিউ" },
  ];

  const values = [
    {
      icon: Heart,
      title: "গ্রাহক সন্তুষ্টি সর্বোচ্চ",
      description:
        "আমাদের প্রতিটি সিদ্ধান্তের কেন্দ্রবিন্দুতে গ্রাহক। সর্বোত্তম সেবা ও আন্তরিকতার মাধ্যমে গ্রাহকের আস্থাই আমাদের সবচেয়ে বড় অর্জন।",
      badge: "অগ্রাধিকার",
    },
    {
      icon: ShieldCheck,
      title: "শতভাগ সততা ও গুণগত মান",
      description:
        "আমরা প্রতিটি পণ্যের গুণগত মান কঠোরভাবে যাচাই করি। কোনো নকল বা নিম্নমানের পণ্যের সাথে কোনো আপস করা হয় না।",
      badge: "নিশ্চয়তা",
    },
    {
      icon: Truck,
      title: "দ্রুত ও নিরাপদ ডেলিভারি",
      description:
        "সারাদেশব্যাপী দ্রুততম সময়ে নিরাপদে আপনার পছন্দের পণ্য দোরগোড়ায় পৌঁছে দিতে আমাদের রয়েছে নিজস্ব দক্ষ লজিস্টিক নেটওয়ার্ক।",
      badge: "গতি",
    },
    {
      icon: Headphones,
      title: "২৪/৭ সার্বক্ষণিক সহায়তা",
      description:
        "অর্ডার করা থেকে ডেলিভারি পাওয়া পর্যন্ত যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম ২৪ ঘণ্টা আপনার পাশে সদা প্রস্তুত।",
      badge: "সহায়তা",
    },
  ];

  const whyChooseUs = [
    {
      title: "১০০% আসল ও প্রিমিয়াম পণ্য",
      desc: "সরাসরি বিশ্বস্ত প্রস্তুতকারক থেকে সংগৃহীত ভেরিফাইড কোয়ালিটি পণ্য।",
    },
    {
      title: "দেশজুড়ে ক্যাশ অন ডেলিভারি",
      desc: "পণ্য হাতে পেয়ে চেক করে পেমেন্ট করার সম্পূর্ণ নিরাপদ ও সহজ সুবিধা।",
    },
    {
      title: "সহজ রিটার্ন ও রিপ্লেসমেন্ট",
      desc: "পণ্যে কোনো সমস্যা থাকলে দ্রুত এবং ঝামেলামুক্ত সহজ রিটার্ন পলিসি।",
    },
    {
      title: "১০০% সুরক্ষিত পেমেন্ট গেটওয়ে",
      desc: "বিকাশ, নগদ, রকেট ও কার্ডে পেমেন্টের সর্বোচ্চ এনক্রিপ্টেড নিরাপত্তা ব্যবস্থা।",
    },
    {
      title: "সাশ্রয়ী মূল্য ও আকর্ষণীয় অফার",
      desc: "প্রতিটি ক্যাটাগরিতে বাজারের সেরা অফার, মেগা ডিসকাউন্ট ও ক্যাশব্যাক।",
    },
    {
      title: "২৪/৭ বন্ধুত্বপূর্ণ গ্রাহক সেবা",
      desc: "আপনার যেকোনো প্রশ্ন ও সমস্যার তাত্ক্ষণিক সমাধানের নিশ্চয়তা।",
    },
  ];

  return (
    <Section className="min-h-screen py-8 md:py-14 bg-bg">
      <Container className="space-y-16 md:space-y-24">
        {/* =========================================================
            HERO HEADER
            ========================================================= */}
        <div
          className={cn(
            "text-center max-w-3xl mx-auto space-y-4 transition-all duration-700 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>বিশ্বস্ততার সাথে অনলাইন শপিং</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight">
            আমাদের <span className="text-primary">সম্পর্কে</span>
          </h1>

          <p className="text-muted text-sm sm:text-base md:text-lg leading-relaxed">
            EasyShoppingMall বাংলাদেশের কোটি মানুষের কাছে সাশ্রয়ী মূল্যে সেরা মানের পণ্য এবং একটি নির্ভরযোগ্য, আধুনিক অনলাইন শপিং অভিজ্ঞতা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* =========================================================
            STATS SECTION
            ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={cn(
                  "bg-card rounded-2xl p-5 border border-line shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-center group",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-ink mb-1 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            SECTION 1: আমাদের সম্পর্কে (ABOUT US)
            ========================================================= */}
        <div className="bg-card rounded-3xl border border-line p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-light/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <div className="inline-block px-3 py-1 rounded-lg bg-primary-light text-primary text-xs font-bold uppercase tracking-wider">
              আমাদের গল্প
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              আমাদের সম্পর্কে
            </h2>

            <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
              <p>
                EasyShoppingMall যাত্রা শুরু করেছে একটি সহজ কিন্তু অত্যন্ত শক্তিশালী লক্ষ্য নিয়ে—বাংলাদেশের প্রতিটি অঞ্চলের সাধারণ মানুষের জন্য অনলাইন কেনাকাটাকে সহজ, নিরাপদ এবং আনন্দদায়ক করে তোলা।
              </p>
              <p>
                আমরা কেবল একটি ই-কমার্স প্ল্যাটফর্ম নই; আমরা আপনার প্রাত্যহিক জীবনের প্রয়োজনীয় পণ্য ও ফ্যাশন ট্রেন্ডের এক বিশ্বস্ত সঙ্গী। প্রযুক্তির উদ্ভাবন ও আন্তরিক সেবার মেলবন্ধনে আমরা প্রতিটি পণ্যের সঠিক মান ও ন্যায্য মূল্য নিশ্চিত করি, যেন আপনার প্রতিটি শপিং অভিজ্ঞতা হয় সন্তোষজনক।
              </p>
              <p>
                পোশাক, লাইফস্টাইল, গ্যাজেট, হোম ডেকর থেকে শুরু করে রূপচর্চা—আমাদের রয়েছে সুবিশাল পণ্যের সমাহার। আমরা বিশ্বাস করি, গুণগত মান এবং সততাই একটি প্রতিষ্ঠানের দীর্ঘস্থায়ী পথচলার আসল ভিত্তি।
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 2: আমাদের মূল্যবোধ (OUR VALUES)
            ========================================================= */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-block px-3 py-1 rounded-lg bg-primary-light text-primary text-xs font-bold uppercase tracking-wider">
              মূল নীতি
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              আমাদের মূল্যবোধ
            </h2>
            <p className="text-muted text-sm sm:text-base">
              যে নীতি ও আদর্শের উপর ভিত্তি করে আমরা প্রতিনিয়ত এগিয়ে চলছি
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-card rounded-2xl p-6 border border-line shadow-xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-muted">
                        {val.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-ink">
                      {val.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            SECTION 3: কেন EasyShoppingMall? (WHY CHOOSE US?)
            ========================================================= */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-block px-3 py-1 rounded-lg bg-accent-light text-accent text-xs font-bold uppercase tracking-wider">
              আমাদের স্বাতন্ত্র্য
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              কেন EasyShoppingMall?
            </h2>
            <p className="text-muted text-sm sm:text-base">
              হাজারো অনলাইন শপের ভিড়ে কেন আমরাই আপনার প্রথম পছন্দ
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl p-5 border border-line shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-ink">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            SECTION 4: আমাদের লক্ষ্য (OUR MISSION & VISION)
            ========================================================= */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary-light/50 via-card to-card rounded-3xl p-6 sm:p-8 border border-primary/20 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink">
              আমাদের লক্ষ্য (Mission)
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              বাংলাদেশের প্রতিটি প্রান্তের গ্রাহকের কাছে সেরা মানের পণ্য সুলভ মূল্যে পৌঁছে দেওয়া। স্বচ্ছতা, গুণগত মান এবং আধুনিক প্রযুক্তির সমন্বয়ে এমন এক ই-কমার্স অভিজ্ঞতা গড়ে তোলা, যেখানে প্রতিটি কেনাকাটা হবে সহজ এবং নিশ্চিত।
            </p>
          </div>

          <div className="bg-gradient-to-br from-tint-orange/50 via-card to-card rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink">
              আমাদের ভিশন (Vision)
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              দেশের শীর্ষস্থানীয় ও সর্বাধিক নির্ভরযোগ্য অনলাইন কেনাকাটার মাধ্যম হিসেবে প্রতিষ্ঠিত হওয়া। গ্রাহকের আস্থার প্রতীক হয়ে প্রযুক্তি ও সামাজিক দায়বদ্ধতার মাধ্যমে দেশের ডিজিটাল অর্থনীতিতে দৃঢ় ভূমিকা রাখা।
            </p>
          </div>
        </div>

        {/* =========================================================
            SECTION 5: আমাদের সাথে যুক্ত হন (JOIN US / CTA)
            ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-primary via-primary to-primary-end p-8 sm:p-12 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-24 -mt-24" />

          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>সহজ শপিংয়ের নতুন দিগন্ত</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              আমাদের সাথে যুক্ত হন
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              আজই শুরু করুন আপনার পছন্দের পণ্য কেনাকাটা এবং উপভোগ করুন আকর্ষণীয় অফার, ফ্রি ডেলিভারি ও দ্রুততম হোম ডেলিভারি সুবিধা!
            </p>

            <div className="flex flex-wrap justify-center gap-3.5 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-primary font-bold text-sm sm:text-base hover:bg-slate-100 shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <span>এখনই শপিং শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary-dark/60 hover:bg-primary-dark text-white border border-white/20 font-bold text-sm sm:text-base transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>যোগাযোগ করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AboutPage;
