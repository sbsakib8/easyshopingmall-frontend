"use client";

import logo from "@/app/icon.png";
import BottomNav from "@/src/compronent/header/BottomNav";
import Container from "@/src/compronent/shared/Container";
import { getCartApi } from "@/src/hook/useCart";
import { getWishlistApi } from "@/src/hook/useWishlist";
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories";
import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import { cn } from "@/src/utlis/utils";
import {
  BarChart3,
  Heart,
  LogIn,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = ({ initialData }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();

  const dispatch = useDispatch();
  const { data: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistCount = wishlistItems?.length || 0;
  const [isScrolled, setIsScrolled] = useState(false);

  // user data fatch
  const data = useSelector((state) => state.user.data);
  const isAdmin = data?.role === "ADMIN" || data?.roles?.includes("ADMIN");

  // Navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog", badge: "New" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  // load wishlist + cart for logged-in user
  useEffect(() => {
    if (data?._id) {
      getWishlistApi(dispatch);
      getCartApi(data._id, dispatch);
    }
  }, [dispatch, data?._id]);

  // Countdown timer state (will be driven by website info)
  const [timeLeft, setTimeLeft] = useState({
    days: initialData?.countdownDays || 0,
    hours: initialData?.countdownHours || 0,
    minutes: initialData?.countdownMinutes || 0,
    seconds: initialData?.countdownSeconds || 0,
  });
  const { data: siteInfoFetched, loading: siteLoading } = useWebsiteInfo();

  // Use initialData if available, otherwise fallback to fetched data
  const siteInfo = siteInfoFetched || initialData;
  // console.log(siteInfo)
  // Fetch categories + subcategories from hook
  const {
    categories,
    subcategories,
  } = useCategoryWithSubcategories();

  const menuCategories = (categories || []).map((cat) => ({
    ...cat,
    icon: cat.icon || cat.image || null,
    subcategories: (subcategories || []).filter(
      (s) => s.categoryId === cat.id || s.categoryId?._id === cat.id,
    ),
  }));

  if (isAdmin) {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!siteInfo?.countdownTargetDate) return;

    const targetTime = new Date(siteInfo.countdownTargetDate).getTime();

    const updateCountdown = () => {
      const now = Date.now(); // UTC-based timestamp
      const diff = Math.max(targetTime - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [siteInfo?.countdownTargetDate]);

  return (
    <>
      {/* Secondary Top Bar */}
      <section
        className={cn(
          "text-xs sm:text-sm transition-all duration-300  hidden sm:block bg-gradient-to-r from-secondary/30 from-0% via-accent/40 via-70% to-secondary/40",
          {
            "h-0 py-0 opacity-0": isScrolled,
          },
        )}
      >
        <Container className="py-1 flex items-center justify-center">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="8"
            loop="infinite"
            className="text-sm font-semibold text-info-content"
          >
            {siteInfo?.discountTitle}
          </marquee>
        </Container>
      </section>

      {/* Main Header */}
      <header
        className={cn(
          "sticky bg-primary/60 top-0 z-40 transition-all duration-300  backdrop-blur-md md:space-y-2",
          {
            "bg-primary/20": isScrolled,
          },
        )}
      >
        <Container className="space-y-2">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo - Responsive */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                <div className="relative">
                  <div
                    className={`w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12  from-emerald-500 via-green-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${
                      isScrolled ? "animate-pulse" : ""
                    }`}
                  >
                    <Image
                      src={logo}
                      width={60}
                      height={100}
                      alt="Easy Shopping Mall Logo"
                    />
                  </div>
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <Link href={"/"} className="flex flex-row ">
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                      EASY
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold text-gray-800">
                      SHOPPING
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                      MALL
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 mx-3">
              {[
                {
                  key: "account",
                  href: "/account",
                  label: "Account",
                  icon: User,
                  size: 18,
                  showWhenLoggedIn: true,
                  hoverColors:
                    "group-hover:from-emerald-100 group-hover:to-teal-100",
                },
                {
                  key: "signin",
                  href: "/signin",
                  label: "SignIn",
                  icon: data ? User : LogIn,
                  size: 16,
                  showWhenLoggedIn: false,
                  hoverColors:
                    "group-hover:from-emerald-100 group-hover:to-teal-100",
                },
                {
                  key: "wishlist",
                  href: "/wishlist",
                  label: "Wishlist",
                  icon: Heart,
                  size: 16,
                  smSize: 20,
                  showWhenLoggedIn: true,
                  badge: String(wishlistCount),
                  hoverColors:
                    "group-hover:from-pink-100 group-hover:to-rose-100",
                },
                {
                  key: "cart",
                  href: "/addtocart",
                  label: "Cart",
                  icon: ShoppingCart,
                  size: 16,
                  smSize: 20,
                  showWhenLoggedIn: true,
                  badge: String(cartItems?.length || 0),
                  hoverColors:
                    "group-hover:from-emerald-100 group-hover:to-teal-100",
                },
                {
                  key: "dashboard",
                  href: "/dashboard",
                  label: "",
                  icon: BarChart3,
                  size: 16,
                  smSize: 20,
                  showWhenLoggedIn: true,
                  onlyForMobile: true,
                  isAdminOnly: true,
                  hoverColors:
                    "group-hover:from-emerald-100 group-hover:to-teal-100",
                },
              ].map((item) => {
                const isLoggedIn = mounted ? !!data : false;
                const isAdminUser = mounted ? isAdmin : false;
                const shouldShow =
                  (item.key === "account" && isLoggedIn) ||
                  (item.key === "signin" && !isLoggedIn) ||
                  (item.key !== "account" && item.key !== "signin");

                if (!shouldShow) return null;
                if (item.isAdminOnly && !isAdminUser) return null;

                return (
                  <div
                    key={item.key}
                    className={cn("relative cursor-pointer group", {
                      "md:hidden": item.onlyForMobile,
                    })}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-700 group-hover:text-emerald-600 transition-all duration-300"
                    >
                      <div
                        className={`relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg ${item.hoverColors} transition-all duration-300 shadow-sm`}
                      >
                        <item.icon
                          size={item.size}
                          className={cn(
                            "sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300",
                            {
                              "group-hover:text-pink-600":
                                item.key === "wishlist",
                            },
                          )}
                        />

                        {/* Badge */}
                        {item.badge && (
                          <span
                            className={cn(
                              "absolute -top-1 bg-error/70 -right-1 text-error-content text-[10px] rounded-full size-4.5 flex items-center justify-center font-bold shadow-lg",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Label */}
                      {item.label && (
                        <div className="hidden md:block">
                          <div className="text-xs text-neutral font-bold">
                            {item.label}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>

        {/* Enhanced Navigation Menu - Responsive */}
        <Container className="hidden md:block pt-0!">
          <nav className=" items-center justify-between flex">
            <div className="flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative flex items-center space-x-1 text-primary-content hover:text-accent font-semibold transition-all duration-300 group hover:scale-105"
                >
                  <span className="text-sm lg:text-base">{item.name}</span>
                  {item.badge && (
                    <span className="bg-warning text-accent-content text-xs px-2 lg:px-3 py-0.5 lg:py-1 rounded-full font-bold shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </div>
          </nav>
        </Container>
      </header>

      <BottomNav
        cartCount={cartItems.length || 0}
        menuCategories={menuCategories}
      />
    </>
  );
};

export default Header;
