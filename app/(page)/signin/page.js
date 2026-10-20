'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  LogIn
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

import logo from '@/app/icon.png';
import { auth } from '@/firebase';
import { googleSignIn, UserSignin } from '@/src/hook/useAuth';
import AuthRedirect from '@/src/utlis/authRedirect';
import Section from '@/src/compronent/shared/Section';
import { sanitizeEmail, sanitizeInput } from '@/src/lib/sanitize';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return toast.error('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন');
    }

    setIsLoading(true);
    const user = { email: sanitizeEmail(email), password };

    try {
      const res = await UserSignin(user, router, dispatch);
      if (res.success) {
        toast.success('সাইন ইন সফল হয়েছে!');
      } else {
        toast.error(res.message || 'সাইন ইন ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'ভুল ইমেইল বা পাসওয়ার্ড, আবার চেষ্টা করুন');
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in preserved
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await googleSignIn(
        {
          name: sanitizeInput(user.reloadUserInfo?.displayName || ''),
          email: sanitizeEmail(user.reloadUserInfo?.email || ''),
          image: user.reloadUserInfo?.photoUrl,
        },
        router,
        dispatch
      );
      toast.success('গুগল দিয়ে সাইন ইন সফল হয়েছে!');
    } catch (error) {
      console.error('Google sign-in failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <Section className="min-h-[calc(100vh-80px)] py-8 sm:py-12 flex justify-center items-center bg-gradient-to-b from-[#E5F4FD]/40 via-[#F8FAFC] to-white px-4">
        <div className="w-full max-w-[500px]">
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
                স্বাগতম! সাইন ইন করুন
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                আপনার ইমেইল ও পাসওয়ার্ড প্রদান করে একাউন্টে প্রবেশ করুন
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
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
                    disabled={isLoading || isGoogleLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold text-gray-700"
                  >
                    পাসওয়ার্ড (Password) <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="/forgotpassword"
                    className="text-xs font-semibold text-[#0092EE] hover:text-[#0077C2] hover:underline transition-colors"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showpassword ? 'text' : 'password'}
                    required
                    disabled={isLoading || isGoogleLoading}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50/60 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-xl border border-gray-200 focus:border-[#0092EE] focus:ring-4 focus:ring-[#0092EE]/15 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isLoading || isGoogleLoading}
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full mt-2 bg-[#0092EE] hover:bg-[#0077C2] active:bg-[#0067B3] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>সাইন ইন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>সাইন ইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Or Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold absolute">
                  অথবা (Or)
                </span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl shadow-xs hover:border-gray-300 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0092EE]" />
                ) : (
                  <FcGoogle className="text-xl" />
                )}
                <span className="text-sm">Google দিয়ে সাইন ইন করুন</span>
              </button>

              {/* Sign Up Link Navigation */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  এখনো কোনো অ্যাকাউন্ট নেই?{' '}
                  <Link
                    href="/signup"
                    className="font-bold text-[#0092EE] hover:text-[#0077C2] hover:underline transition-colors"
                  >
                    নতুন অ্যাকাউন্ট খুলুন (Sign Up)
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
};

export default Signin;
