"use client";   
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Heart, Shield, Truck, Award, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, number: "1,000+", label: "Happy Customers" },
    { icon: ShoppingBag, number: "5000", label: "Products" },
    { icon: Award, number: "1 Years", label: "Experience" },
    { icon: Star, number: "4.9", label: "Rating" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "আমাদের গ্রাহকদের সন্তুষ্টিই আমাদের প্রধান লক্ষ্য। প্রতিটি সেবায় আমরা গ্রাহকের চাহিদাকে সর্বোচ্চ অগ্রাধিকার দিয়ে থাকি।"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "আপনার নিরাপত্তা আমাদের কাছে অগ্রাধিকার। আমরা সর্বোচ্চ নিরাপত্তা ব্যবস্থা নিশ্চিত করে আপনার শপিং অভিজ্ঞতা সুরক্ষিত রাখি।"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "দ্রুত ও নির্ভরযোগ্য ডেলিভারি সেবা। আমরা সারাদেশব্যাপী দ্রুততম সময়ে আপনার পণ্য পৌঁছে দেওয়ার জন্য প্রতিশ্রুতিবদ্ধ।"
    }
  ];

  const features = [
    "বাংলাদেশের সবচেয়ে বড় পণ্যের সংগ্রহ",
    "২৪/৭ কাস্টমার সাপোর্ট",
    "সহজ রিটার্ন ও এক্সচেঞ্জ নীতি",
    "নিরাপদ পেমেন্ট সিস্টেম",
    "ক্যাশ অন ডেলিভারি সুবিধা",
    "দেশব্যাপী ফ্রি ডেলিভারি"
  ];

  return (
    <div className="min-h-screen lg:mt-20 py-5 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-secondary/40"></div>
        <div className={`container mx-auto px-4 py-16 md:py-24 relative transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6 animate-pulse">
              EasyShoppingMall
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন শপিং গন্তব্য
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: `${index * 200}ms` }}>
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gradient-to-r from-btn-color/80 via-btn-color/95 to-btn-color rounded-full group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">আমাদের সম্পর্কে</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6 text-lg">
                  ২০২৫ সাল থেকে EasyShoppingMall বাংলাদেশের মানুষের কাছে গুণগত পণ্য সাশ্রয়ী মূল্যে পৌঁছে দেওয়ার 
                  লক্ষ্যে কাজ করে যাচ্ছে। আমাদের স্বপ্ন হলো প্রতিটি বাংলাদেশী পরিবারের কাছে সহজ ও নিরাপদ 
                  অনলাইন শপিং সুবিধা পৌঁছে দেওয়া।
                </p>
                <p className="text-lg">
                  আমরা বিশ্বাস করি যে, প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে আমরা মানুষের জীবনযাত্রার মান উন্নয়নে 
                  অবদান রাখতে পারি। তাই আমাদের প্রতিটি সেবা ডিজাইন করা হয়েছে গ্রাহকের সুবিধাকে মাথায় রেখে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gradient-to-r from-base-300/50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">আমাদের মূল্যবোধ</h2>
            <p className="text-gray-600 text-lg">যে নীতিগুলো আমাদের পরিচালনা করে</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: `${index * 300}ms` }}>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-btn-color/80 via-btn-color/95 to-btn-color rounded-full">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">কেন EasyShoppingMall?</h2>
              <p className="text-gray-600 text-lg">আমাদের বিশেষত্বগুলো যা আমাদের আলাদা করে তোলে</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <CheckCircle className="w-6 h-6 text-btn-color flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gradient-to-r from-btn-color/80 via-btn-color/95 to-btn-color text-accent-content">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">আমাদের লক্ষ্য</h2>
            <p className="text-xl leading-relaxed mb-8">
              আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি মানুষের কাছে সহজ, নিরাপদ এবং আনন্দদায়ক অনলাইন 
              শপিং অভিজ্ঞতা পৌঁছে দেওয়া। আমরা চাই প্রত্যেকটি গ্রাহক যেন আমাদের সাথে শপিং করে 
              সন্তুষ্ট এবং খুশি হয়ে ফিরে যান।
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">আমাদের সাথে যুক্ত হন</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            আজই শুরু করুন আপনার অনলাইন শপিং যাত্রা এবং অভিজ্ঞতা নিন সেরা সেবার।
          </p>
          <Link href='/shop' className="bg-gradient-to-r from-btn-color/80 via-btn-color/95 to-btn-color text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
            এখনই শপিং শুরু করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;