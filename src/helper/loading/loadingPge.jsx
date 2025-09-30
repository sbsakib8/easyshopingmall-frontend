"use client"
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Truck, Check } from 'lucide-react';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const steps = [
    { icon: ShoppingBag, text: 'দোকান প্রস্তুত করা হচ্ছে...', color: 'from-blue-500 to-blue-600' },
    { icon: Package, text: 'পণ্যসমূহ লোড করা হচ্ছে...', color: 'from-purple-500 to-purple-600' },
    { icon: Truck, text: 'ডেলিভারি তথ্য আপডেট করা হচ্ছে...', color: 'from-green-500 to-green-600' },
    { icon: Check, text: 'সব কিছু প্রস্তুত!', color: 'from-emerald-500 to-emerald-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setCurrentStep(0);
    } else if (progress < 50) {
      setCurrentStep(1);
    } else if (progress < 75) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [progress]);

  useEffect(() => {
    const texts = [
      'EasyShoppingMall এ স্বাগতম...',
      'আপনার পছন্দের পণ্য খুঁজে নিন...',
      'সেরা দামে সেরা পণ্য...',
      'নিরাপদ অনলাইন শপিং...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
      setLoadingText(texts[textIndex]);
      textIndex = (textIndex + 1) % texts.length;
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Moving Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto text-center">
        
        {/* Brand Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-4 shadow-2xl transform hover:scale-110 transition-all duration-500 animate-bounce">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EasyShoppingMall</h1>
          <p className="text-blue-200 text-sm">আপনার বিশ্বস্ত অনলাইন শপিং সাথী</p>
        </div>

        {/* Main Loading Animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            
            {/* Progress Ring */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`p-4 rounded-full bg-gradient-to-r ${steps[currentStep].color} transform transition-all duration-500 scale-110`}>
                <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="text-4xl font-bold text-white mb-2 font-mono">
            {progress}%
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mb-8">
          <div className="text-lg text-blue-200 mb-4 h-6 transition-all duration-500">
            {steps[currentStep].text}
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center space-x-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-125' 
                    : 'bg-white/20'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Dynamic Loading Text */}
        <div className="mb-8">
          <div className="h-6 flex items-center justify-center">
            <p className="text-white/80 text-sm animate-pulse transition-all duration-1000">
              {loadingText}
            </p>
          </div>
        </div>

        {/* Loading Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: '🛍️', text: 'হাজারো পণ্য' },
            { icon: '🚚', text: 'দ্রুত ডেলিভারি' },
            { icon: '💳', text: 'নিরাপদ পেমেন্ট' },
            { icon: '📞', text: '২৪/৭ সাপোর্ট' }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform transition-all duration-500 hover:scale-105"
              style={{ 
                animationDelay: `${index * 200}ms`,
                opacity: progress > index * 25 ? 1 : 0.3 
              }}
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-white/90 text-xs font-medium">{feature.text}</div>
            </div>
          ))}
        </div>

        {/* Loading Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-white/60">
          <p>💡 টিপস: লোডিং এর সময় আপনার wishlist চেক করুন</p>
        </div>

        {/* Pulsing Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;