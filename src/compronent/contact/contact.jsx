"use client";
import socket from '@/src/confic/socket';
import { ContactCreate } from '@/src/hook/content/useContact';
import { CreateNotification } from '@/src/hook/useNotification';
import useWebsiteInfo from '@/src/utlis/useWebsiteInfo';
import { CheckCircle, Clock, Mail, MapPin, MessageSquare, Phone, Send, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { data: siteInfo, loading: siteLoading } = useWebsiteInfo();


  // socket test
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // socket connect 
    socket.on("connect", () => {
      // console.log("🟢 Socket connected:", socket.id);
    });

    //  notification 
    socket.on("notification:new", (notif) => {
      // console.log("📩 New notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
      toast.success(` ${notif.title}: ${notif.message}`);
    });

    // cleanup
    return () => {
      socket.off("connect");
      socket.off("notification:new");
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = formData;

    if (!name.trim()) {
      toast.error("অনুগ্রহ করে নাম লিখুন");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("অনুগ্রহ করে সঠিক ইমেইল দিন");
      return;
    }

    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (phone && !phoneRegex.test(phone)) {
      toast.error("অনুগ্রহ করে সঠিক ফোন নম্বর দিন (বাংলাদেশ ফরম্যাট)");
      return;
    }

    if (!subject.trim()) {
      toast.error("অনুগ্রহ করে বিষয় লিখুন");
      return;
    }

    if (!message.trim() || message.length < 10) {
      toast.error("বার্তাটি কমপক্ষে ১০ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const response = await ContactCreate(formData);
      setIsSubmitted(true);

      // Notify admin via socke
      await CreateNotification({
        title: "New Email Received",
        message: `${name} - ${subject}`,
        type: "email",
        referenceId: response.data._id,
        meta: { message: response.data.message },
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      alert("ফর্ম সাবমিট করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
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
                  <p className="text-gray-300">{siteInfo?.number}</p>
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
                  <p className="text-gray-300">{siteInfo?.email}</p>
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
                  <p className="text-gray-300">{siteInfo?.address}</p>
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
                  <p className="text-gray-300">{siteInfo?.deliveryText}</p>
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
                      required
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
                      required
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
                      required
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
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
    hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl 
    transition-all duration-300 group cursor-pointer 
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"}`}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                    )}

                    {loading ? "Sending..." : "বার্তা পাঠান"}
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