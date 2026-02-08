"use client";
import logo from "@/app/icon.png";
import {Menu, User, X, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DropShippingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
 
  const pathname = usePathname();

  // user data fatch
  const data = useSelector((state) => state.user.data);

  // Navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "blog", badge: "New" },
    { name: "Contact", href: "contact" },
  ];

  if (data?.role === "DROP-SHIPPING") {
    navItems.push({ name: "Dashboard", href: "/" });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div
        className={`bg-gradient-to-r  from-secondary via-secondary/70 to-secondary text-white text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 relative overflow-hidden transition-all duration-300 ${isScrolled ? "h-0 py-0 opacity-0" : "h-auto lg:h-[60px]"
          } hidden sm:block`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-32 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-7 right-40 w-1 h-1 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
        </div>
      </div>
    

      {/* Main Header */}
      <header
        className={`bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-200/50 transition-all duration-300 ${isScrolled ? "h-16 sm:h-20" : "h-20 sm:h-24 lg:h-[100px]"
          }`}
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-32">
          <div className="flex items-center justify-between py-2 sm:py-3 lg:py-4">
            {/* Enhanced Logo - Responsive */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                <div className="relative">
                  <div
                    className={`w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12  from-emerald-500 via-green-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${isScrolled ? "animate-pulse" : ""
                      }`}
                  >
                    <Image src={logo} width={60} height={100} alt="Easy Shopping Mall Logo" />
                  </div>
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <Link href={"/"} className="flex flex-row ">
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      EASY
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold text-gray-800">
                      SHOPPING
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      MALL
                    </span>
                  </Link>
                </div>
              </div>
            </div>
           

            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {data ? (
                <Link
                  href="/account"
                  className="flex items-center  text-gray-700 hover:text-emerald-600 transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 shadow-sm">
                    <User
                      size={18}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className=" hidden lg:block text-xs text-gray-500 font-medium">
                      Account
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center  text-gray-700 hover:text-emerald-600 transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 shadow-sm">
                    <User
                      size={18}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className=" hidden lg:block text-xs text-gray-500 font-medium">SignIn</div>
                  </div>
                </Link>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className=" p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-emerald-100 hover:to-teal-100 text-gray-700 hover:text-emerald-600 transition-all duration-300 shadow-sm"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>     
        </div>
        
        {/* Enhanced Mobile Menu - Fully Responsive */}
        {isMobileMenuOpen && (
          <div className=" 
 bg-white/95 backdrop-blur-md border-t border-gray-200/60 animate-in slide-in-from-top-5 duration-300">
            <nav className="px-2 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2 max-h-96 overflow-visible">
              {navItems.map((item, index) => (
                <Link
                  onClick={toggleMobileMenu}
                  key={index}
                  href={item.href}
                  className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 rounded-lg sm:rounded-xl transition-all duration-300 font-medium shadow-sm"
                >
                  <span className="text-sm sm:text-base">{item.name}</span>
                  {item.badge && (
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default DropShippingNavbar;
