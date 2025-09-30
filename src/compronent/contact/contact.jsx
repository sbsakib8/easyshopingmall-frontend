"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, User, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen lg:mt-20 py-4 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden">
      

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 animate-slide-down">
            Get In Touch
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            আমাদের সাথে যোগাযোগ করুন এবং আমরা আপনার সকল প্রশ্নের উত্তর দেওয়ার জন্য প্রস্তুত
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:rotate-1 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">ফোন</h3>
                  <p className="text-gray-300">+880 1234-567890</p>
                  <p className="text-gray-300">+880 1987-654321</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:-rotate-1 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">ইমেইল</h3>
                  <p className="text-gray-300">info@ecommerce.com</p>
                  <p className="text-gray-300">support@ecommerce.com</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:rotate-1 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">ঠিকানা</h3>
                  <p className="text-gray-300">১২৩, গুলশান এভিনিউ</p>
                  <p className="text-gray-300">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:-rotate-1 group">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">অফিস সময়</h3>
                  <p className="text-gray-300">সোম - শুক্র: ৯:০০ - ১৮:০০</p>
                  <p className="text-gray-300">শনি: ১০:০০ - ১৬:০০</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20 hover:bg-white/15 transition-all duration-500">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
                আমাদের সাথে যোগাযোগ করুন
              </h2>

              {isSubmitted && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6 flex items-center space-x-3 animate-bounce">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <p className="text-green-300 font-medium">আপনার বার্তা সফলভাবে পাঠানো হয়েছে!</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="group">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <User className="inline w-4 h-4 mr-2" />
                      নাম *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      placeholder="আপনার নাম লিখুন"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <Mail className="inline w-4 h-4 mr-2" />
                      ইমেইল *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="group">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <Phone className="inline w-4 h-4 mr-2" />
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      placeholder="+880 1234-567890"
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="group">
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      <MessageSquare className="inline w-4 h-4 mr-2" />
                      বিষয় *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      placeholder="আপনার বার্তার বিষয়"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    <MessageSquare className="inline w-4 h-4 mr-2" />
                    বার্তা *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none group-hover:bg-white/10"
                    placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group"
                  >
                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                    বার্তা পাঠান
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 animate-fade-in">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            আমরা আপনার সেবায় নিয়োজিত
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            আমাদের দল ২৪/৭ আপনার সকল প্রয়োজনে সাহায্য করতে প্রস্তুত। যেকোনো প্রশ্ন বা সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;