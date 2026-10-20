"use client";

import { useGetUser } from "@/src/utlis/useGetuser";
import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import { cn } from "@/src/utlis/utils";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  IoLocationOutline,
  IoLogoFacebook,
  IoTimeOutline,
} from "react-icons/io5";
import { MdAddCall, MdEmail } from "react-icons/md";
import Container from "../shared/Container";
import { toBengaliNumber } from "@/src/utlis/bengali";

const iconMap = {
  "fa-facebook": IoLogoFacebook,
  "fa-instagram": FaInstagram,
  "fa-twitter": FaTwitter,
  "fa-youtube": FaYoutube,
};

function Footer({ initialData }) {
  const { data: siteInfoFetched, loading: siteLoading } = useWebsiteInfo();
  const siteInfo = siteInfoFetched || initialData;
  const socialLinks = siteInfo?.socialLinks || [];
  const { user } = useGetUser();
  const isDropshippingUser =
    user?.role?.toUpperCase() === "DROPSHIPPING" ||
    user?.roles?.includes("DROPSHIPPING");

  const footerNavLinks = [
    {
      title: "কোম্পানি",
      links: [
        { label: "আমাদের সম্পর্কে", href: "/about" },
        { label: "যোগাযোগ", href: "/contact" },
        { label: "গোপনীয়তা নীতি", href: "/privacy-policy" },
        { label: "শর্তাবলী ও নিয়ম", href: "/terms-conditions" },
        { label: "ড্রপশিপিং", href: "/dropshipping" },
      ],
    },
    {
      title: "গ্রাহক সেবা",
      links: [
        { label: "সহায়তা কেন্দ্র", href: "/support" },
        { label: "ডেলিভারি তথ্য", href: "/delivery" },
        { label: "উইশলিস্ট", href: "/wishlist" },
        { label: "আমার কার্ট", href: "/addtocart" },
        { label: "আমার অ্যাকাউন্ট", href: "/account" },
      ],
    },
    {
      title: "জনপ্রিয় লিংক",
      links: [
        { label: "সকল পণ্য", href: "/shop" },
        { label: "ব্লগ ও টিপস", href: "/blog" },
        { label: "ড্রপশিপিং সাইনআপ", href: "/dropshipping-signup" },
        { label: "আমাদের সম্পর্কে", href: "/about" },
      ],
    },
  ];

  return (
    <footer
      className={cn("bg-bg-app border-t border-line text-ink", {
        "pb-24 md:pb-0": !isDropshippingUser,
      })}
    >
      <Container className="py-10 lg:py-14 space-y-8">
        {/* Main Grid */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="sm:col-span-3 lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-black text-primary tracking-tight">
              EasyShoppingMall
            </h3>
            <p className="text-sm text-muted max-w-sm">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত ও দ্রুততম অনলাইন শপিং প্ল্যাটফর্ম। আপনার পছন্দের পণ্য পৌঁছে দিচ্ছি আপনার দোরগোড়ায়।
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                <IoLocationOutline className="text-xl text-primary shrink-0" />
                <p className="text-sm text-ink/80">{siteInfo?.address || "ঢাকা, বাংলাদেশ"} </p>
              </div>
              <div className="flex items-center gap-2.5">
                <MdAddCall className="text-xl text-primary shrink-0" />
                <p className="text-sm text-ink/80"> কল করুন: {siteInfo?.number || "০১৮..."}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <MdEmail className="text-xl text-primary shrink-0" />
                <p className="text-sm text-ink/80"> ইমেইল: {siteInfo?.email || "support@easyshoppingmall.com"}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <IoTimeOutline className="text-xl text-primary shrink-0" />
                <p className="text-sm text-ink/80">{!isDropshippingUser ? "কাজের সময়: ২৪/৭ সাপোর্ট" : "কাজের সময়: সকাল ৯:০০ - সন্ধ্যা ৭:০০"}</p>
              </div>
            </div>
          </div>

          {footerNavLinks.map((item, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-base font-bold text-ink tracking-tight">
                {item.title}
              </h4>

              <div className="space-y-2.5">
                {item.links.map((link, i) => (
                  <Link
                    href={link.href}
                    key={i}
                    className="text-sm text-muted hover:text-primary hover:translate-x-1 transition-all duration-200 block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-line h-px"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted">
          <div>
            <p className="text-center sm:text-left">
              © {toBengaliNumber(new Date().getFullYear(), false)} EasyShoppingMall. সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink">আমাদের সাথে থাকুন:</span>

            {socialLinks
              .filter((link) => link.active)
              .map((link, index) => {
                const IconComponent = iconMap[link.icon];
                if (!IconComponent) return null;

                return (
                  <Link
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex justify-center items-center transition-all shadow-xs"
                  >
                    <IconComponent className="text-lg" />
                  </Link>
                );
              })}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
