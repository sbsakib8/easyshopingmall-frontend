'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Tag, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  Check, 
  X, 
  Loader2, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

import logo from '@/app/icon.png';
import { auth } from '@/firebase';
import { googleSignIn, UseAuth } from '@/src/hook/useAuth';
import AuthRedirect from '@/src/utlis/authRedirect';
import Section from '@/src/compronent/shared/Section';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '@/src/lib/sanitize';

const getPasswordChecks = (pwd) => ({
  length: pwd.length >= 6,
  uppercase: /[A-Z]/.test(pwd),
  lowercase: /[a-z]/.test(pwd),
  number: /[0-9]/.test(pwd),
});

const getPasswordStrength = (pwd) => {
  const checks = getPasswordChecks(pwd);
  const passed = Object.values(checks).filter(Boolean).length;
  if (pwd.length === 0) return { strength: 0, text: '', color: '', checks };
  if (passed <= 1) return { strength: 25, text: 'দুর্বল (Weak)', color: 'bg-red-500', textColor: 'text-red-500', checks };
  if (passed <= 2) return { strength: 50, text: 'মোটামুটি (Fair)', color: 'bg-amber-500', textColor: 'text-amber-500', checks };
  if (passed <= 3) return { strength: 75, text: 'ভালো (Good)', color: 'bg-blue-500', textColor: 'text-blue-500', checks };
  return { strength: 100, text: 'শক্তিশালী (Strong)', color: 'bg-emerald-500', textColor: 'text-emerald-500', checks };
};

function Signup() {
  const [role, setRole] = useState('USER'); // 'USER' | 'DROPSHIPPING'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setpassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
    const roleParam = searchParams.get('role');
    if (roleParam && (roleParam.toUpperCase() === 'DROPSHIPPING' || roleParam.toUpperCase() === 'USER')) {
      setRole(roleParam.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error('অনুগ্রহ করে আপনার পুরো নাম লিখুন');
    }
    if (!email.trim()) {
      return toast.error('অনুগ্রহ করে আপনার ইমেইল লিখুন');
    }
    if (!number.trim()) {
      return toast.error('অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন');
    }
    if (password.length < 6) {
      return toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    }

    setIsLoading(true);

    const user = {
      name: sanitizeInput(name),
      email: sanitizeEmail(email),
      mobile: sanitizePhone(number),
      password,
      referralCode: sanitizeInput(referralCode),
      role,
    };

    try {
      const res = await UseAuth(user, router);
      if (res.success) {
        toast.success('রেজিস্ট্রেশন সফল হয়েছে! দয়া করে সাইন ইন করুন।');
      } else {
        toast.error(res.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in kept intact for existing backend/auth integrity
  const handleGoogleSignIn = async () => {
    if (!number) {
      return toast.error('Please enter your number');
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await googleSignIn(
        {
          name: user.reloadUserInfo?.displayName || name,
          email: user.reloadUserInfo?.email || email,
          mobile: sanitizePhone(number),
          referralCode: sanitizeInput(referralCode),
          image: user.reloadUserInfo?.photoUrl,
          role,
        },
        router,
        dispatch
      );
    } catch (error) {
      console.error('Google sign-in failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <AuthRedirect>
      <Section className="min-h-[calc(100vh-80px)] py-8 sm:py-12 flex justify-center items-center bg-gradient-to-b from-[#E5F4FD]/40 via-[#F8FAFC] to-white px-4">
        <div className="w-full max-w-[580px]">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,146,238,0.08)] border border-[#E3EAF1] p-6 sm:p-10 transition-all duration-300">
            {/* Brand Header & Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-3 group mb-4">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0092EE]/10 to-[#0092EE]/5 border border-[#0092EE]/20 flex items-center justify-center p-2 shadow-sm group-hover:scale-105 group-hover:border-[#0092EE] transition-all duration-300">
                  <Image
                    src={logo}
                    alt="EasyShoppingMallBD Logo"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0092EE] rounded-full border-2 border-white animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                    <span className="text-[#0092EE]">EASY</span>
                    <span className="text-[#12263A] ml-1">SHOPPING</span>
                    <span className="text-[#0092EE] ml-1">MALL</span>
                  </div>
                  <p className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase mt-0.5">
                    EasyShoppingMallBD.com
                  </p>
                </div>
              </Link>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                নতুন একাউন্ট তৈরি করুন
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                আপনার সঠিক তথ্য প্রদান করে সহজ শপিংয়ের অভিজ্ঞতা উপভোগ করুন
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5">
                আপনি কীভাবে যুক্ত হতে চান?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role 1: Customer (USER) */}
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  disabled={isLoading}
                  className={`relative flex items-start gap-3.5 p-4 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer ${
                    role === 'USER'
                      ? 'border-[#0092EE] bg-[#E5F4FD]/50 shadow-sm ring-2 ring-[#0092EE]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      role === 'USER'
                        ? 'bg-[#0092EE] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#12263A]">
                        আমি কিনতে চাই
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      সাধারণ কাস্টমার হিসেবে কেনাকাটা করুন
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0077C2]">
                      Customer Account
                    </span>
                  </div>
                  {role === 'USER' && (
                    <div className="absolute top-3 right-3 text-[#0092EE]">
                      <CheckCircle2 className="w-5 h-5 fill-[#0092EE] text-white" />
                    </div>
                  )}
                </button>

                {/* Role 2: Dropshipping (DROPSHIPPING) */}
                <button
                  type="button"
                  onClick={() => setRole('DROPSHIPPING')}
                  disabled={isLoading}
                  className={`relative flex items-start gap-3.5 p-4 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer ${
                    role === 'DROPSHIPPING'
                      ? 'border-[#0092EE] bg-[#E5F4FD]/50 shadow-sm ring-2 ring-[#0092EE]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      role === 'DROPSHIPPING'
                        ? 'bg-[#0092EE] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#12263A]">
                        আমি ড্রপশিপিং করতে চাই
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      বিনা পুঁজিতে পণ্য বিক্রি করে আয় করুন
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Dropshipper Account
                    </span>
                  </div>
                  {role === 'DROPSHIPPING' && (
                    <div className="absolute top-3 right-3 text-[#0092EE]">
                      <CheckCircle2 className="w-5 h-5 fill-[#0092EE] text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="FullName"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  পূর্ণ নাম (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="FullName"
                    type="text"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  ইমেইল (Email Address) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile Number Field */}
              <div>
                <label
                  htmlFor="number"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  মোবাইল নম্বর (Phone Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="number"
                    type="tel"
                    required
                    disabled={isLoading}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  পাসওয়ার্ড (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showpassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    {showpassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">পাসওয়ার্ড নিরাপত্তা:</span>
                      <span className={`font-bold ${passwordStrength.textColor}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                      {[
                        { key: 'length', label: 'কমপক্ষে ৬ অক্ষর' },
                        { key: 'uppercase', label: 'একটি বড় হাতের অক্ষর (A-Z)' },
                        { key: 'lowercase', label: 'একটি ছোট হাতের অক্ষর (a-z)' },
                        { key: 'number', label: 'একটি সংখ্যা (0-9)' },
                      ].map(({ key, label }) => {
                        const passed = passwordStrength.checks[key];
                        return (
                          <div key={key} className="flex items-center gap-1.5 text-[11px]">
                            {passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            )}
                            <span className={passed ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Referral Code Field */}
              <div>
                <label
                  htmlFor="referralCode"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  রেফার কোড (Referral Code - Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <input
                    id="referralCode"
                    type="text"
                    disabled={isLoading}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="রেফার কোড থাকলে লিখুন (ঐচ্ছিক)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (password.length > 0 && passwordStrength.strength < 50)}
                className="w-full mt-2 bg-[#0092EE] hover:bg-[#0077C2] active:bg-[#0067B3] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>একাউন্ট তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>সাইন আপ সম্পন্ন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Sign Up with Google - hidden as requested: display: none */}
              <div
                style={{ display: 'none' }}
                className="hidden"
                aria-hidden="true"
              >
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex justify-center items-center gap-2 py-3 border border-gray-300 rounded-xl"
                >
                  <FcGoogle className="text-xl" />
                  <span>Sign Up with Google</span>
                </button>
              </div>

              {/* Sign In Link Navigation */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
                  <Link
                    href="/signin"
                    className="font-bold text-[#0092EE] hover:text-[#0077C2] hover:underline transition-colors"
                  >
                    সাইন ইন করুন (Sign In)
                  </Link>
                </p>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>আপনার তথ্য ১০০% সুরক্ষিত এবং এনক্রিপ্টেড</span>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </AuthRedirect>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#0092EE]" />
            <span className="text-sm font-medium">লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <Signup />
    </Suspense>
  );
}
