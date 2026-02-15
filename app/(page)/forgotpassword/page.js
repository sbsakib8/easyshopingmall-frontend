"use client";
import { changePassword, sendOtp, verifyOtp } from '@/src/hook/useAuth';
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock, Mail, ShoppingBag } from 'lucide-react';
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = () => {
    setError('');

    if (!email || !email.includes('@')) {
      setError('Valid email address din');
      return;
    }
    setLoading(true);
    sendOtp({ email })
      .then((res) => {
        if (res.success) {
          setStep(2);
        } else {
          setError(res.message || 'OTP pathano jaini. Punarbar chesta korun.');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'OTP pathano jaini. Punarbar chesta korun.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerifyOtp = () => {
    setError('');

    if (!otp || otp.length !== 6) {
      setError('6 digit OTP din');
      return;
    }

    setLoading(true);

    verifyOtp({ email, otp })
      .then((res) => {
        if (res.success) {
          setStep(3);
        } else {
          setError(res.message || 'OTP verify kora jaini. Punarbar chesta korun.');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'OTP verify kora jaini. Punarbar chesta korun.');
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // change password
  const handleChangePassword = () => {
    setError('');

    if (newPassword.length < 6) {
      setError('Password minimum 6 character hote hobe');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password match korche na');
      return;
    }

    setLoading(true);

    changePassword({ email, newpassword: newPassword })
      .then((res) => {
        if (res.success) {
          alert('Password successfully change hoyeche! Sign in page e redirect korche...');
          // window.location.href = '/signin';
          setStep(1);
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setError(res.message || 'Password change kora jaini. Punarbar chesta korun.');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Password change kora jaini. Punarbar chesta korun.');
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 33, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 66, text: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 opacity-0 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <ShoppingBag className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2 ">EasyShopping Mall</h1>
          <p className="text-black/80"> পাসওয়ার্ড রিসেট করতে ধাপগুলো অনুসরণ করুন </p>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 opacity-0 animate-slideUp">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${step >= num ? 'bg-green-600 text-accent-content scale-110' : 'bg-gray-200 text-gray-400'
                  }`}>
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step > num ? 'bg-green-600' : 'bg-gray-200'
                    }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 animate-shake">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ইমেইল দিন</h2>
                <p className="text-gray-600 mb-6">আপনার রেজিস্টার্ড ইমেইল ঠিকানা দিন</p>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aapnar@email.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-accent-content py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ওটিপি যাচাই করুন</h2>
                <p className="text-gray-600 mb-6">
                  <span className="font-medium text-purple-600">{email}</span> আপনাকে পাঠানো ৬ সংখ্যার কোডটি দিন
                </p>

                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-center text-2xl tracking-widest font-semibold"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-accent-content py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full text-purple-600 text-sm hover:underline transition-all"
              >
                ওটিপি আসছে না? আবার পাঠান।
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2"> নতুন পাসওয়ার্ড সেট করুন </h2>
                <p className="text-gray-600 mb-6"> একটি শক্তিশালী পাসওয়ার্ড নির্বাচন করুন </p>

                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Notun Password"
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {newPassword && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Password Strength</span>
                        <span className={`font-semibold ${passwordStrength.strength === 100 ? 'text-green-600' :
                          passwordStrength.strength === 66 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Password Confirm Korun"
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-accent-content py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Change Password
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 animate-fadeIn">
          <a href="/signin" className="text-green-500  hover:underline flex items-center justify-center gap-2 transition-all">
            <ArrowRight className="w-4 h-4 rotate-180" />
            সাইন ইন পেজে ফিরে যান
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        @media (max-width: 640px) {
          .text-3xl {
            font-size: 1.75rem;
          }
          
          .p-8 {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
export default ForgotPassword;