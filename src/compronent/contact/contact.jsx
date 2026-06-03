"use client";

import socket from "@/src/confic/socket";
import { ContactCreate } from "@/src/hook/content/useContact";
import { CreateNotification } from "@/src/hook/useNotification";
import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import { cn } from "@/src/utlis/utils";
import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Container from "../shared/Container";
import Section from "../shared/Section";

const ContactPage = ({ initialSiteInfo }) => {
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
  const { data: fetchedData } = useWebsiteInfo();
  const siteInfo = initialSiteInfo || fetchedData;

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

  const contactInfo = [
    {
      id: 1,
      title: "ফোন",
      value: siteInfo?.number || "017XX-XXXXXX",
      icon: Phone,
      gradient: "from-emerald-500 to-teal-500",
      hoverRotate: "hover:rotate-2",
    },
    {
      id: 2,
      title: "ইমেইল",
      value: siteInfo?.email || "info@example.com",
      icon: Mail,
      gradient: "from-pink-500 to-rose-500",
      hoverRotate: "hover:-rotate-2",
    },
    {
      id: 3,
      title: "ঠিকানা",
      value: siteInfo?.address || "ঢাকা, বাংলাদেশ",
      icon: MapPin,
      gradient: "from-violet-500 to-purple-500",
      hoverRotate: "hover:rotate-1",
    },
    {
      id: 4,
      title: "অফিস সময়",
      value: siteInfo?.deliveryText || "সকাল ৯টা - বিকেল ৬টা",
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      hoverRotate: "hover:-rotate-1",
    },
  ];

  const formFields = [
    {
      id: "name",
      name: "name",
      label: "নাম *",
      type: "text",
      placeholder: "আপনার নাম লিখুন",
      icon: User,
      required: true,
      halfWidth: true,
    },
    {
      id: "email",
      name: "email",
      label: "ইমেইল *",
      type: "email",
      placeholder: "your@email.com",
      icon: Mail,
      required: true,
      halfWidth: true,
    },
    {
      id: "phone",
      name: "phone",
      label: "ফোন নম্বর",
      type: "tel",
      placeholder: "+880 1234-567890",
      icon: Phone,
      required: false,
      halfWidth: true,
    },
    {
      id: "subject",
      name: "subject",
      label: "বিষয় *",
      type: "text",
      placeholder: "আপনার বার্তার বিষয়",
      icon: MessageSquare,
      required: true,
      halfWidth: true,
    },
    {
      id: "message",
      name: "message",
      label: "বার্তা *",
      type: "textarea",
      placeholder: "আপনার বার্তা বিস্তারিত লিখুন...",
      icon: MessageSquare,
      required: true,
      halfWidth: false,
      rows: 4,
    },
  ];

  return (
    <Section className="min-h-dvh bg-gray-100">
      <Container className="space-y-12">
        {/* Header Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-btn-color leading-relaxed">
            Get In Touch
          </h1>
          <p className="text-slate-400 text-sm sm:text-sm md:text-base lg:text-lg animate-slide-up">
            আমাদের সাথে যোগাযোগ করুন এবং আমরা আপনার সকল প্রশ্নের উত্তর দেওয়ার
            জন্য প্রস্তুত
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-5",
                    "hover:bg-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl",
                    "hover:scale-[1.03] hover:-translate-y-1",
                    item.hoverRotate,
                  )}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Even Smaller Icon */}
                    <div
                      className={cn(
                        `w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl
         bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 shadow-inner`,
                        item.gradient,
                      )}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>

                    {/* Smaller Content */}
                    <div className="flex-1 pt-0.5">
                      <h3 className="text-lg md:text-xl font-semibold text-btn-color mb-1.5 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-secondary-content/70 leading-relaxed text-xs md:text-sm break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl transition-all duration-500">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-btn-color mb-8 text-center">
                আমাদের সাথে যোগাযোগ করুন
              </h2>

              {isSubmitted && (
                <div className="bg-secondary/10 text-secondary-content/60 border border-primary/40 rounded-2xl p-4 mb-6 flex items-center space-x-3 animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                  <p className="font-medium">
                    আপনার বার্তা সফলভাবে পাঠানো হয়েছে!
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Dynamic Grid Layout Wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => {
                    const IconComponent = field.icon;

                    return (
                      <div
                        key={field.id}
                        className={cn(
                          "group flex flex-col",
                          field.halfWidth
                            ? "col-span-1"
                            : "col-span-1 md:col-span-2",
                        )}
                      >
                        {/* Input Label */}
                        <label className="block text-[var(--color-neutral)]/80 text-sm font-semibold mb-3 transition-colors group-focus-within:text-[var(--color-btn-color)]">
                          <IconComponent className="inline w-4 h-4 mr-2 text-[var(--color-neutral)]/60 group-focus-within:text-[var(--color-btn-color)] transition-colors" />
                          {field.label}
                        </label>

                        {/* Conditional Input Rendering */}
                        {field.type === "textarea" ? (
                          <textarea
                            name={field.name}
                            id={field.id}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            rows={field.rows}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={cn(
                              "w-full px-6 py-4 rounded-2xl transition-all duration-300 resize-none outline-none text-[var(--color-neutral)] font-medium",
                              "bg-white/60 border border-[var(--color-base-400)]/40 placeholder-[var(--color-neutral)]/40",
                              "hover:bg-white/80 hover:border-[var(--color-base-400)]/80",
                              "focus:bg-white focus:ring-2 focus:ring-[var(--color-btn-color)]/30 focus:border-[var(--color-btn-color)]",
                            )}
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            id={field.id}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={cn(
                              "w-full px-6 py-4 rounded-2xl transition-all duration-300 outline-none text-[var(--color-neutral)] font-medium",
                              "bg-white/60 border border-[var(--color-base-400)]/40 placeholder-[var(--color-neutral)]/40",
                              "hover:bg-white/80 hover:border-[var(--color-base-400)]/80",
                              "focus:bg-white focus:ring-2 focus:ring-[var(--color-btn-color)]/30 focus:border-[var(--color-btn-color)]",
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Modern Action Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={cn(
                      "inline-flex items-center justify-center px-12 py-4 font-bold rounded-2xl cursor-pointer transition-all duration-300 transform select-none",
                      "bg-[var(--color-btn-color)] text-white shadow-lg shadow-[var(--color-btn-color)]/20",
                      loading
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:scale-[1.03] hover:bg-[var(--color-btn-color)]/90 hover:shadow-xl hover:shadow-[var(--color-btn-color)]/30",
                    )}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <Send className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                    )}

                    {loading ? "Sending..." : "বার্তা পাঠান"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-base-400/30 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-neutral/5 animate-fade-in transition-all duration-300 hover:shadow-2xl hover:border-base-400/60">
          {/* Heading */}
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral mb-4 leading-tight">
            আমরা আপনার <span className="text-btn-color">সেবায় নিয়োজিত</span>
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-neutral/80 max-w-2xl mx-auto leading-relaxed font-medium">
            আমাদের ডেডিকেটেড টিম ২৪/৭ আপনার সকল প্রয়োজনে সাহায্য করতে প্রস্তুত।
            যেকোনো প্রশ্ন বা সমস্যার জন্য দ্বিধাহীনভাবে আমাদের সাথে যোগাযোগ
            করুন।
          </p>
        </div>
      </Container>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
      `}</style>
    </Section>
  );
};

export default ContactPage;
