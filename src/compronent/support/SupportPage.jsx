"use client";

import { FacebookOutlined, Telegram, WhatsApp } from "@mui/icons-material";
import { ArrowUpRight, HelpCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Container from "../shared/Container";
import Section from "../shared/Section";

const SupportPage = () => {
  const supportChannels = [
    {
      id: "facebook_group",
      title: "অফিসিয়াল ফেসবুক গ্রুপ",
      subtitle: "আপডেট ও ঘোষণা",
      icon: FacebookOutlined,
      colorClass:
        "from-blue-500/20 to-blue-600/30 border-blue-400/30 text-blue-500",
      hoverBg: "hover:bg-blue-500/5",
      shadowColor: "shadow-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      btnBg:
        "bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 shadow-blue-500/20",
      description:
        "সর্বশেষ পণ্য রিলিজ, মার্কেটিং টিপস, ড্রপশিপিং টিউটোরিয়াল এবং লাইভ ইভেন্টের ঘোষণা পেতে আমাদের ফেসবুক পৃষ্ঠাটি লাইক ও ফলো করুন।",
      url: "https://www.facebook.com/share/g/1DsixBQwcE/",
      actionText: "গ্রুপে যোগ দিন",
    },
    {
      id: "facebook_page",
      title: "ফেসবুক পেজ",
      subtitle: "আমাদের অফিসিয়াল পেজ",
      icon: FacebookOutlined,
      colorClass:
        "from-blue-600/20 to-indigo-600/30 border-blue-500/30 text-blue-600",
      hoverBg: "hover:bg-blue-600/5",
      shadowColor: "shadow-blue-600/10",
      iconBg: "bg-blue-600/10 text-blue-600",
      btnBg:
        "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 shadow-blue-600/20",
      description:
        "আমাদের অফিসিয়াল ফেসবুক পেজ ভিজিট করুন নতুন সব প্রোডাক্টের আপডেট পেতে, যেকোনো প্রয়োজনে সরাসরি ইনবক্স করতে এবং আমাদের কমিউনিটির সাথে যুক্ত থাকতে।",
      url: "https://www.facebook.com/easyshoppingmall8",
      actionText: "পেজ ভিজিট করুন",
    },
    {
      id: "telegram_channel",
      title: "টেলিগ্রাম চ্যানেল",
      subtitle: "২৪/৭ ক্লায়েন্ট সার্কেল",
      icon: Telegram,
      colorClass:
        "from-cyan-500/20 to-blue-500/30 border-cyan-400/30 text-cyan-500",
      hoverBg: "hover:bg-cyan-500/5",
      shadowColor: "shadow-cyan-500/10",
      iconBg: "bg-cyan-500/10 text-cyan-500",
      btnBg:
        "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20",
      description:
        "আমাদের অফিসিয়াল টেলিগ্রাম কমিউনিটিতে যোগ দিন। এখানে আপনি নিয়মিত আপডেট, মার্কেটিংয়ের জন্য ডাউনলোডযোগ্য মিডিয়া অ্যাসেট, তাত্ক্ষণিক ড্রপশিপিং স্টক ফিড এবং একে অপরকে সহায়তা করা স্টোর মালিকদের একটি নেটওয়ার্ক পাবেন।",
      url: "https://t.me/easyshoppingmallbd",
      actionText: "টেলিগ্রাম চ্যানেলে যোগ দিন",
    },
    {
      id: "whatsapp_group",
      title: "হোয়াটসঅ্যাপ গ্রুপ",
      subtitle: "তাৎক্ষণিক কমিউনিটি সহায়তা",
      icon: WhatsApp,
      colorClass:
        "from-emerald-500/20 to-teal-500/30 border-emerald-400/30 text-emerald-500",
      hoverBg: "hover:bg-emerald-500/5",
      shadowColor: "shadow-emerald-500/10",
      iconBg: "bg-emerald-500/10 text-emerald-500",
      btnBg:
        "bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20",
      description:
        "সর্বশেষ পণ্য রিলিজ, মার্কেটিং টিপস, ড্রপশিপিং টিউটোরিয়াল এবং লাইভ ইভেন্টের ঘোষণা পেতে আমাদের হোয়াটসঅ্যাপ গ্রুপে যুক্ত হন।",
      url: "https://whatsapp.com/channel/0029Vb5hf5D7NoZuvTebe81q",
      actionText: "হোয়াটসঅ্যাপ গ্রুপে যোগ দিন",
    },
    {
      id: "whatsapp_contact",
      title: "হোয়াটসঅ্যাপ সাপোর্ট",
      subtitle: "সরাসরি এজেন্ট চ্যাট",
      icon: WhatsApp,
      colorClass:
        "from-emerald-500/20 to-teal-500/30 border-emerald-400/30 text-emerald-500",
      hoverBg: "hover:bg-emerald-500/5",
      shadowColor: "shadow-emerald-500/10",
      iconBg: "bg-emerald-500/10 text-emerald-500",
      btnBg:
        "bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20",
      description:
        "যেকোনো জরুরি জিজ্ঞাসা, অর্ডার ট্র্যাকিং, প্রোডাক্টের স্টক আপডেট অথবা তাৎক্ষণিক যেকোনো সহায়তার জন্য সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নাম্বারে মেসেজ করুন।",
      url: "https://wa.me/8801626420774",
      actionText: "হোয়াটসঅ্যাপে চ্যাট করুন",
    },
  ];

  return (
    <Section className="relative min-h-[calc(100vh-120px)] bg-[var(--color-bg)] py-16 md:py-24 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)]/10 blur-[150px] pointer-events-none animate-pulse-slower" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-[var(--color-secondary)]/5 blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary-content)] text-xs md:text-sm font-semibold tracking-wide uppercase animate-fade-in">
            <HelpCircle className="w-4 h-4 animate-spin-slow text-[var(--color-primary)]" />
            সহায়তা কেন্দ্র
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-neutral)] leading-tight animate-fade-in">
            আমরা আজ আপনাকে{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              কীভাবে সাহায্য করতে পারি
            </span>
            ?
          </h1>

          <p className="text-[var(--color-neutral)]/70 opacity-70 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            যোগাযোগের জন্য নিচের যেকোনো একটি চ্যানেল নির্বাচন করুন আমাদের
            সাপোর্ট এজেন্টদের সাথে সংযোগ স্থাপন করতে অথবা আমাদের কমিউনিটি গ্রুপে
            যোগ দিতে। আমরা আপনার ব্যবসাকে সহায়তা করতে ২৪/৭ উপলব্ধ আছি।
          </p>
        </div>

        {/* Glassmorphic Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8 mx-auto">
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;

            return (
              <div
                key={channel.id}
                style={{ animationDelay: `${index * 150}ms` }}
                className={`group relative flex flex-col justify-between rounded-3xl gap-4 p-6 md:p-8
                  bg-white/40 backdrop-blur-xl border border-white/40
                  hover:border-[var(--color-primary)]/30 hover:bg-white/60
                  transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:-translate-y-2
                  ${channel.shadowColor} animate-fade-in-up`}
              >
                {/* Background Hover Highlight */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${channel.colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm ${channel.iconBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[var(--color-neutral)] tracking-tight">
                          {channel.title}
                        </h3>
                        <p className="text-[10px] text-[var(--color-primary-content)]/60">
                          {channel.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Description */}
                  <p className="text-[var(--color-neutral)]/70 opacity-70 text-xs md:text-[15px] leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {/* Card Button */}
                <div className="relative z-10 mt-auto border-t border-white/20">
                  <Link
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-2 px-4 font-medium rounded-2xl cursor-pointer text-white text-sm tracking-wide
                      transition-all duration-300 shadow-md transform hover:scale-[1.02]
                      ${channel.btnBg}`}
                  >
                    <span>{channel.actionText}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Guarantee/Pledge Block */}
        <div className="max-w-4xl mx-auto mt-20 text-center animate-fade-in delay-300">
          <div className="p-8 md:p-10 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col md:flex-row items-center gap-6 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg md:text-xl font-bold text-[var(--color-neutral)]">
                আমাদের তাত্ক্ষণিক সহায়তার অঙ্গীকার
              </h4>
              <p className="text-xs md:text-sm text-[var(--color-neutral)]/75 leading-relaxed font-medium">
                আমরা আপনাকে প্রিমিয়াম সহায়তা প্রদানের জন্য নিবেদিত। যেকোনো
                গ্রুপে সংযুক্ত হওয়ার মাধ্যমে আপনি অগ্রাধিকার সমর্থন পাওয়ার
                নিশ্চয়তা পাবেন।
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Embedded CSS for smooth animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-fill-mode: both;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Section>
  );
};

export default SupportPage;
