"use client";

import { FacebookOutlined, Telegram, WhatsApp } from "@mui/icons-material";
import { ArrowUpRight, HelpCircle, ShieldCheck } from "lucide-react";
import Container from "../shared/Container";
import Section from "../shared/Section";
import Link from "next/link";

const SupportPage = () => {
  const supportChannels = [
    {
      id: "facebook",
      title: "Official Facebook Page",
      subtitle: "Updates & Announcements",
      icon: FacebookOutlined,
      colorClass:
        "from-blue-500/20 to-blue-600/30 border-blue-400/30 text-blue-500",
      hoverBg: "hover:bg-blue-500/5",
      shadowColor: "shadow-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      btnBg:
        "bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500 hover:to-blue-600 shadow-blue-500/20",
      description:
        "Like and follow our Facebook page to get the latest product releases, marketing tips, dropshipping tutorials, and live event announcements.",
      url: "https://facebook.com/easyshopingmall",
      actionText: "Visit Facebook Page",
    },
    {
      id: "messenger",
      title: "Facebook Messenger Group",
      subtitle: "Fast Agent Chat",
      icon: FacebookOutlined,
      colorClass:
        "from-purple-500/20 to-pink-500/30 border-purple-400/30 text-purple-500",
      hoverBg: "hover:bg-purple-500/5",
      shadowColor: "shadow-purple-500/10",
      iconBg: "bg-purple-500/10 text-purple-500",
      btnBg:
        "bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/20",
      description:
        "Chat directly with our customer care agents or join our active messenger group for quick query resolutions, stock availability checks, and general assistance.",
      url: "https://m.me/easyshopingmall",
      actionText: "Open Messenger Chat",
    },
    {
      id: "telegram",
      title: "Telegram Support & Channel",
      subtitle: "24/7 Client Circle",
      icon: Telegram,
      colorClass:
        "from-cyan-500/20 to-blue-500/30 border-cyan-400/30 text-cyan-500",
      hoverBg: "hover:bg-cyan-500/5",
      shadowColor: "shadow-cyan-500/10",
      iconBg: "bg-cyan-500/10 text-cyan-500",
      btnBg:
        "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20",
      description:
        "Join our official Telegram community. Here you will find regular updates, downloadable media assets for marketing, instant dropshipping stock feeds, and a network of store owners supporting each other.",
      url: "https://t.me/easyshopingmall",
      actionText: "Join Telegram Channel",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Group Hub",
      subtitle: "Instant Community Help",
      icon: WhatsApp,
      colorClass:
        "from-emerald-500/20 to-teal-500/30 border-emerald-400/30 text-emerald-500",
      hoverBg: "hover:bg-emerald-500/5",
      shadowColor: "shadow-emerald-500/10",
      iconBg: "bg-emerald-500/10 text-emerald-500",
      btnBg:
        "bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20",
      description:
        "Stay connected on WhatsApp. Our group offers daily hot-selling product suggestions, immediate order verification, platform configuration help, and delivery status alerts.",
      url: "https://wa.me/message/easyshopingmall",
      actionText: "Join WhatsApp Community",
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
            Support Center
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-neutral)] leading-tight animate-fade-in">
            How Can We{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Help You
            </span>{" "}
            Today?
          </h1>

          <p className="text-[var(--color-neutral)]/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            Select one of our communication channels below to connect with our
            support agents or join our community groups. We are available 24/7
            to support your business.
          </p>
        </div>

        {/* Glassmorphic Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;

            return (
              <div
                key={channel.id}
                style={{ animationDelay: `${index * 150}ms` }}
                className={`group relative flex flex-col justify-between rounded-3xl p-6 md:p-8
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
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm ${channel.iconBg}`}
                      >
                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-neutral)] tracking-tight">
                          {channel.title}
                        </h3>
                        <p className="text-xs text-[var(--color-primary-content)]/60">
                          {channel.subtitle}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-neutral)]/40 group-hover:text-[var(--color-primary)] transition-colors duration-300"
                    >
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>

                  {/* Card Description */}
                  <p className="text-[var(--color-neutral)]/80 text-sm md:text-[15px] leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {/* Card Button */}
                <div className="relative z-10 pt-6 mt-6 border-t border-white/20">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 font-bold rounded-2xl cursor-pointer text-white text-sm tracking-wide
                      transition-all duration-300 shadow-md transform hover:scale-[1.02]
                      ${channel.btnBg}`}
                  >
                    <span>{channel.actionText}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
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
                Our Instant Support Pledge
              </h4>
              <p className="text-xs md:text-sm text-[var(--color-neutral)]/75 leading-relaxed font-medium">
                We are dedicated to providing you with premium assistance.
                Connecting to any group guarantees you receive priority support.
                If your issue requires custom account settings adjustments, we
                will coordinate directly via messenger or email within 15
                minutes.
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
