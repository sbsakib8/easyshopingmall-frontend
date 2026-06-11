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
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Delivery Information", href: "/delivery" },
        { label: "Dropshipping", href: "/dropshipping" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Contact Us", href: "/contact" },
        { label: "Support Center", href: "/" },
        { label: "Careers", href: "/" },
      ],
    },
    {
      title: "Corporate",
      links: [
        { label: "About", href: "/about" },
        { label: "Delivery Information", href: "/delivery" },
        { label: "Dropshipping", href: "/dropshipping" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Contact Us", href: "/contact" },
        { label: "Support Center", href: "/" },
        { label: "Careers", href: "/" },
      ],
    },
    {
      title: "Popular",
      links: [
        { label: "About", href: "/about" },
        { label: "Delivery Information", href: "/delivery" },
        { label: "Dropshipping", href: "/dropshipping" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Contact Us", href: "/contact" },
        { label: "Support Center", href: "/" },
        { label: "Careers", href: "/" },
      ],
    },
  ];

  return (
    <footer
      className={cn("bg-primary/10", {
        "pb-26 md:pb-0": !isDropshippingUser,
      })}
    >
      <Container className="py-8 lg:py-12 space-y-6">
        {/* main div */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="sm:col-span-3 lg:col-span-2">
            <h3 className="text-[22px] font-bold text-accent-content">
              EasyShoppingMall
            </h3>

            <div>
              <div className="flex items-center gap-2 my-3">
                <IoLocationOutline className=" text-[20px] text-primary font-medium" />
                <p className=" text-[16px]">{siteInfo?.address || ""} </p>
              </div>
              <div className="flex items-center gap-2 my-3">
                <MdAddCall className=" text-[20px] text-primary font-medium" />
                <p className=" text-[16px]"> Call Us: {siteInfo?.number}</p>
              </div>
              <div className="flex items-center gap-2 my-3">
                <MdEmail className=" text-[20px] text-primary font-medium" />
                <p className=" text-[16px]"> Email: {siteInfo?.email}</p>
              </div>
              <div className="flex items-center gap-2 my-3">
                <IoTimeOutline className=" text-[20px] text-primary font-medium" />
                <p className=" text-[16px]">{!isDropshippingUser ? "Working Hours: 24/7" : "Working Hours: 9:00 AM - 7:00 PM"}</p>
              </div>
            </div>
          </div>

          {footerNavLinks.map((item, index) => (
            <div key={index} className="">
              <h3 className="text-[20px] text-accent-content font-bold mb-4">
                {item.title}
              </h3>

              <div className="space-y-3">
                {item.links.map((link, i) => (
                  <Link
                    href={link.href}
                    key={i}
                    className={cn(
                      "text-[16px] block hover:text-primary cursor-pointer transition-all duration-200 hover:ml-4",
                      "hover:transition-all hover:duration-200",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-200 h-[1px]"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className=" text-center text-wrap text-[16px]">
              © {new Date().getFullYear()} EasyShoppingMall. All rights
              reserved.
            </p>
          </div>

          <div className="flex justify-between items-center gap-4">
            <h3 className="text-[19px] font-medium text-accent">Follow Us:</h3>

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
                    className="w-10 h-10 bg-secondary/80 hover:bg-secondary rounded-full
                     flex justify-center items-center cursor-pointer
                     transition-all duration-200 delay-100"
                  >
                    <IconComponent className="text-2xl text-secondary-content" />
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
