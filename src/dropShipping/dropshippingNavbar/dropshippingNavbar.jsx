"use client";
import logo from "@/app/icon.png";
import { ChevronDown, ChevronRight, Heart, Menu, ShoppingCart, User, X, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const DropShippingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistCount = wishlistItems?.length || 0;
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

  // user data fatch
  const data = useSelector((state) => state.user.data);
  // Navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/all-products" },
    { name: "Profile", href: "/profile" },
    { name: "New Products", href: "/new-products" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Add to Cart", href: "/addtocart" },
    { name: "Order List", href: "/order-list" },
    { name: "Cart List", href: "/cart-list" },
    { name: "Sell & Profit", href: "/sell-profit" },
    { name: "Passive Income", href: "/passive-income", subLink: [{ name: "Box Leader", href: "/box-leader" }, { name: "Auditor", href: "/auditor" }, { name: "Member", href: "/member" }] },
    { name: "Referral Profile", href: "/referral-profile", subLink: [{ name: "Referral Profit", href: "/referral-profit" }] },
  ];

  if (data?.role === "DROP-SHIPPING") {
    navItems.push({ name: "Dashboard", href: "/" });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`bg-bg backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-200/50 transition-all duration-300 ${isScrolled ? "h-16 sm:h-20" : "h-20 sm:h-24 lg:h-[100px]"
          }`}
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-32">
          <div className="flex items-center justify-between py-2 sm:py-3 lg:py-4">
            {/* Enhanced Logo - Responsive */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
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
                <div className="relative">
                  <div
                    className={`w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12  from-emerald-500 via-green-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${isScrolled ? "animate-pulse" : ""
                      }`}
                  >

                    <Image src={logo} width={60} height={100} alt="Easy Shopping Mall Logo" />
                  </div>
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300 flex items-center">

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
                  <div className="p-2 rounded-xl bg-bg group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 shadow-sm">
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
              {/* Wishlist - Responsive */}
              <div className="relative cursor-pointer group">
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 group-hover:text-emerald-600 transition-all duration-300"
                >
                  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg group-hover:from-pink-100 group-hover:to-rose-100 transition-all duration-300 shadow-sm">
                    <Heart
                      size={16}
                      className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 group-hover:text-pink-600"
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-accent-content text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-bounce shadow-lg">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block lg:block">
                    <div className="text-xs text-accent font-bold">Wishlist</div>
                  </div>
                </Link>
              </div>
              {/* Cart - Responsive */}
              <div className="relative cursor-pointer group">
                <Link
                  href="/addtocart"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 group-hover:text-emerald-600 transition-all duration-300"
                >
                  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 shadow-sm">
                    <ShoppingCart
                      size={16}
                      className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300"
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-accent-content text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block lg:block">
                    <div className="text-xs text-accent font-bold">Cart</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Fully Responsive */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          {/* Backdrop/Overlay */}
          <div
            className="absolute min-h-screen inset-0 bg-black/40 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>

          {/* Side Menu */}
          <div
            className={`absolute top-0 left-0 h-screen w-screen sm:w-[320px] bg-bg shadow-2xl transition-transform duration-500 ease-in-out transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              } overflow-y-auto`}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Image onClick={toggleMobileMenu} src={logo} width={40} height={40} alt="Logo" />
                </Link>
                <span className="font-bold text-gray-800">MENU</span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item, index) => {
                const hasSubLinks = item.subLink && item.subLink.length > 0;
                const isExpanded = expandedItem === item.name;

                return (
                  <div key={index} className="space-y-1">
                    {hasSubLinks ? (
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                        className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 font-medium border border-transparent shadow-sm ${isExpanded
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-50"
                          }`}
                      >
                        <span className="text-base">{item.name}</span>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    ) : (
                      <Link
                        onClick={() => {
                          toggleMobileMenu();
                          setExpandedItem(null);
                        }}
                        href={item.href}
                        className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-emerald-50 shadow-sm group"
                      >
                        <span className="text-base group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                        {item.badge && (
                          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Sub-links with Animation */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-height-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                      style={{ maxHeight: isExpanded ? '400px' : '0' }}
                    >
                      <div className="pl-4 space-y-1 border-l-2 border-emerald-100 ml-4">
                        {item.subLink?.map((sub, sIndex) => (
                          <Link
                            key={sIndex}
                            href={sub.href}
                            onClick={() => {
                              toggleMobileMenu();
                              setExpandedItem(null);
                            }}
                            className="block py-2.5 px-4 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all duration-200"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default DropShippingNavbar;
