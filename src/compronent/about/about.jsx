"use client";

import { cn } from "@/src/utlis/utils";
import {
  Award,
  CheckCircle,
  Heart,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "../shared/Container";
import Section from "../shared/Section";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, number: "1,000+", label: "Happy Customers" },
    { icon: ShoppingBag, number: "5000", label: "Products" },
    { icon: Award, number: "1 Years", label: "Experience" },
    { icon: Star, number: "4.9", label: "Rating" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "আমাদের গ্রাহকদের সন্তুষ্টিই আমাদের প্রধান লক্ষ্য। প্রতিটি সেবায় আমরা গ্রাহকের চাহিদাকে সর্বোচ্চ অগ্রাধিকার দিয়ে থাকি।",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "আপনার নিরাপত্তা আমাদের কাছে অগ্রাধিকার। আমরা সর্বোচ্চ নিরাপত্তা ব্যবস্থা নিশ্চিত করে আপনার শপিং অভিজ্ঞতা সুরক্ষিত রাখি।",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "দ্রুত ও নির্ভরযোগ্য ডেলিভারি সেবা। আমরা সারাদেশব্যাপী দ্রুততম সময়ে আপনার পণ্য পৌঁছে দেওয়ার জন্য প্রতিশ্রুতিবদ্ধ।",
    },
  ];

  const features = [
    "বাংলাদেশের সবচেয়ে বড় পণ্যের সংগ্রহ",
    "২৪/৭ কাস্টমার সাপোর্ট",
    "সহজ রিটার্ন ও এক্সচেঞ্জ নীতি",
    "নিরাপদ পেমেন্ট সিস্টেম",
    "ক্যাশ অন ডেলিভারি সুবিধা",
    "দেশব্যাপী ফ্রি ডেলিভারি",
  ];

  return (
    <Section className="min-h-dvh py-5 bg-bg">
      <Container className="space-y-16">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary via-primary/60 to-secondary/30 bg-clip-text text-transparent leading-relaxed">
            EasyShoppingMall
          </h1>
          <p className="text-slate-400 text-sm sm:text-sm md:text-base lg:text-lg">
            বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন শপিং গন্তব্য
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={index}
                className={cn(
                  "relative text-center group cursor-pointer p-4 rounded-2xl transition-all duration-700 transform ease-out",
                  "bg-white/30 backdrop-blur-sm border border-[var(--color-base-400)]/20 shadow-sm shadow-[var(--color-neutral)]/5",
                  "hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Subtle background glow mapping */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Minimalist Smaller Icon Container using Primary Colors */}
                <div className="mb-3.5 flex justify-center relative z-10">
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] transition-all duration-300 transform group-hover:scale-105 group-hover:bg-[var(--color-neutral)] group-hover:text-[var(--color-neutral-content)]">
                    <IconComponent className="w-5 h-5 transition-transform duration-500 group-hover:rotate-6" />
                  </div>
                </div>

                {/* Smaller, Elegant Stat Number (Neutral Color Theme) */}
                <div className="relative z-10 text-2xl sm:text-3xl font-bold text-[var(--color-neutral)] tracking-tight mb-1 transition-colors duration-300 group-hover:text-[var(--color-primary-content)]">
                  {stat.number}
                </div>

                {/* Muted, Smaller Stat Label */}
                <div className="relative z-10 text-xs sm:text-sm font-medium text-[var(--color-neutral)]/60 transition-colors duration-300 group-hover:text-[var(--color-neutral)]/80">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              আমাদের সম্পর্কে
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-2 text-sm md:text-base lg:text-lg">
                ২০২৫ সাল থেকে EasyShoppingMall বাংলাদেশের মানুষের কাছে গুণগত
                পণ্য সাশ্রয়ী মূল্যে পৌঁছে দেওয়ার লক্ষ্যে কাজ করে যাচ্ছে।
                আমাদের স্বপ্ন হলো প্রতিটি বাংলাদেশী পরিবারের কাছে সহজ ও নিরাপদ
                অনলাইন শপিং সুবিধা পৌঁছে দেওয়া।
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                আমরা বিশ্বাস করি যে, প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে আমরা
                মানুষের জীবনযাত্রার মান উন্নয়নে অবদান রাখতে পারি। তাই আমাদের
                প্রতিটি সেবা ডিজাইন করা হয়েছে গ্রাহকের সুবিধাকে মাথায় রেখে।
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              আমাদের মূল্যবোধ
            </h2>
            <p className="text-sm md:text-base lg:text-lg">
              যে নীতিগুলো আমাদের পরিচালনা করে
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-4 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <div className="flex justify-center items-center">
                  <div className="p-4 bg-primary/15 rounded-full">
                    <value.icon className="w-8 h-8 text-primary-content" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              কেন EasyShoppingMall?
            </h2>
            <p className="text-sm md:text-base lg:text-lg">
              আমাদের বিশেষত্বগুলো যা আমাদের আলাদা করে তোলে
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center text-sm lg:text-base space-x-2.5 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CheckCircle className="w-6 h-6 text-btn-color flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            আমাদের লক্ষ্য
          </h2>
          <p className="text-sm md:text-base lg:text-lg">
            আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি মানুষের কাছে সহজ, নিরাপদ এবং
            আনন্দদায়ক অনলাইন শপিং অভিজ্ঞতা পৌঁছে দেওয়া। আমরা চাই প্রত্যেকটি
            গ্রাহক যেন আমাদের সাথে শপিং করে সন্তুষ্ট এবং খুশি হয়ে ফিরে যান।
          </p>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            আমাদের সাথে যুক্ত হন
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-8">
            আজই শুরু করুন আপনার অনলাইন শপিং যাত্রা এবং অভিজ্ঞতা নিন সেরা সেবার।
          </p>
          <Link
            href="/shop"
            className="bg-primary/80 hover:bg-primary text-primary-content px-4 py-2.5 rounded-full text-base font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            এখনই শপিং শুরু করুন
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default AboutPage;
