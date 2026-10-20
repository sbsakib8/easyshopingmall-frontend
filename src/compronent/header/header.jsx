"use client";

import logo from "@/app/icon.png";
import BottomNav from "@/src/compronent/header/BottomNav";
import Skeleton from "@/src/compronent/loading/Skeleton";
import Container from "@/src/compronent/shared/Container";
import { getCartApi } from "@/src/hook/useCart";
import { getWishlistApi } from "@/src/hook/useWishlist";
import { setDebouncedSearch, setSearchTerm } from "@/src/redux/shopSlice";
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories";
import { useSearchProduct } from "@/src/utlis/useSearchProduct";
import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import { cn } from "@/src/utlis/utils";
import {
  BarChart3,
  Camera,
  ChevronDown,
  Heart,
  LogIn,
  Menu,
  Search,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = ({ initialData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showLiveResults, setShowLiveResults] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();
  const { data: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistCount = wishlistItems?.length || 0;
  const cartCount = (cartItems || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageSearch, setImageSearch] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const imageSearchRef = useRef(null);

  useEffect(() => {
    setHoveredCategoryId(null);
    setIsCategoriesOpen(false);
  }, [pathname]);

  // user data fatch
  const data = useSelector((state) => state.user.data);
  const DASHBOARD_ROLES = ["ADMIN", "MANAGER", "CPO"];
  const isAdmin = data?.role === "ADMIN" || data?.roles?.includes("ADMIN");
  const hasDashboardAccess =
    DASHBOARD_ROLES.includes(data?.role) ||
    data?.roles?.some((r) => DASHBOARD_ROLES.includes(r));

  // Navigation items
  const navItems = [
    { name: "হোম", href: "/" },
    { name: "শপ", href: "/shop" },
    { name: "ব্লগ", href: "/blog", badge: "নতুন" },
    { name: "যোগাযোগ", href: "/contact" },
    { name: "আমাদের সম্পর্কে", href: "/about" },
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
    loading: categoriesLoading,
    getSubcategoriesForCategory,
  } = useCategoryWithSubcategories();

  const menuCategories = (categories || []).map((cat) => ({
    ...cat,
    icon: cat.icon || cat.image || null,
    subcategories: (subcategories || []).filter(
      (s) => s.categoryId === cat.id || s.categoryId?._id === cat.id,
    ),
  }));

  if (hasDashboardAccess) {
    navItems.push({ name: "ড্যাশবোর্ড", href: "/dashboard" });
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

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const { searchTerm: reduxSearchTerm } = useSelector(
    (state) => state.shop || {},
  );

  // Sync internal searchQuery with reduxSearchTerm if on shop page
  useEffect(() => {
    if (pathname === "/shop") {
      setSearchQuery(reduxSearchTerm || "");
    }
  }, [reduxSearchTerm, pathname]);

  // Debounce input to avoid excessive work
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Auto-search as user types (using debounced value)
  // Auto-search as user types (using debounced value)
  useEffect(() => {
    if (debouncedSearch) {
      if (pathname !== "/shop") {
        router.push(`/shop?search=${encodeURIComponent(debouncedSearch)}`);
      }
      dispatch(setSearchTerm(debouncedSearch));
    } else if (
      debouncedSearch === "" &&
      searchQuery === "" &&
      pathname === "/shop"
    ) {
      dispatch(setSearchTerm(""));
      router.push("/shop");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  // Show live results when user types at least 2 chars
  useEffect(() => {
    // allow single-character suggestions (helpful for quick lookups)
    if (debouncedSearch && debouncedSearch.length >= 1)
      setShowLiveResults(true);
    else setShowLiveResults(false);
  }, [debouncedSearch]);

  // Immediate search on Enter key or form submit
  const handleSearchSubmit = useCallback((e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      dispatch(setSearchTerm(q));
      dispatch(setDebouncedSearch(q));
      if (pathname !== "/shop") {
        router.push(`/shop?search=${encodeURIComponent(q)}`);
      } else {
        router.push(`/shop?search=${encodeURIComponent(q)}`, { scroll: false });
      }
    } else {
      dispatch(setSearchTerm(""));
      dispatch(setDebouncedSearch(""));
      if (pathname === "/shop") {
        router.push("/shop", { scroll: false });
      }
    }
    setShowLiveResults(false);
  }, [searchQuery, dispatch, pathname, router]);

  // Close dropdown and image search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
        setHoveredCategoryId(null);
      }

      if (
        imageSearchRef.current &&
        !imageSearchRef.current.contains(event.target)
      ) {
        setImageSearch(!imageSearch);
      }
    };

    // Add event listener when dropdown is open
    if (isCategoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Add event listener when image search is open
    if (imageSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoriesOpen, imageSearch]);

  // Use the dedicated search hook for live suggestions (400ms internal debounce)
  const { data: searchResults, loading: searchLoading } = useSearchProduct({
    search: searchQuery,
    limit: 6,
  });

  const liveResults = useMemo(() => {
    const list = searchResults?.data || searchResults?.products || [];
    if (!Array.isArray(list)) return [];

    return list.map((p) => ({
      id: p._id || p.id || String(p.id || ""),
      name: p.name || p.productName || p.title || "Untitled",
      price: Number(p.price ?? p.sell_price ?? 0) || 0,
      originalPrice: Number(p.originalPrice ?? p.oldPrice ?? 0) || 0,
      image: p.image || p.images?.[0] || "/img/product.jpg",
      rating: Number(p.rating ?? p.ratings) || 4,
      reviews: Number(p.reviews ?? p.reviewCount ?? 0) || 0,
    }));
  }, [searchResults]);

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
          "sticky bg-white/95 top-0 z-40 transition-all duration-300 backdrop-blur-md md:space-y-2 border-b border-line shadow-xs",
          {
            "bg-white shadow-md": isScrolled,
          },
        )}
      >
        <Container className="space-y-2 py-1">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo - Responsive */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                <div className="relative">
                  <div
                    className={`w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 ${isScrolled ? "animate-pulse" : ""
                      }`}
                  >
                    <Image
                      src={logo}
                      width={60}
                      height={100}
                      alt="Easy Shopping Mall Logo"
                    />
                  </div>
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <Link href={"/"} className="flex flex-row items-center">
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-black text-primary">
                      EASY
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-black text-ink ml-1">
                      SHOPPING
                    </span>
                    <span className="text-[13px] sm:text-xl lg:text-2xl font-black text-primary ml-1">
                      MALL
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar  */}
            <div className="hidden lg:flex flex-1 max-w-xl justify-center mx-8">
              <div className="flex w-full shadow-sm rounded-2xl z-50 border border-line bg-bg backdrop-blur-sm">
                {/* Categories Button */}
                <div className="relative group/main" ref={dropdownRef}>
                  <button
                    onClick={toggleCategories}
                    className="flex items-center space-x-2 bg-bg px-4 lg:px-6 py-3 lg:py-3.5 hover:bg-primary-light hover:text-primary transition-all duration-300 group rounded-2xl cursor-pointer"
                  >
                    <Menu
                      size={16}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    <span className="font-bold text-sm lg:text-base text-ink">
                      ক্যাটাগরি
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Categories Dropdown Container */}
                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-line rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Header */}
                      <div className="bg-primary p-4 rounded-t-2xl">
                        <h3 className="text-black font-bold text-lg flex items-center space-x-2">
                          <Star className="w-5 h-5 animate-pulse" />
                          <span>ক্যাটাগরি ব্রাউজ করুন</span>
                        </h3>
                      </div>

                      {/* Main Categories List */}
                      <div className="py-2 relative ">
                        {categoriesLoading ? (
                          <div className="py-2 space-y-1">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-3 px-6 py-4"
                              >
                                <Skeleton
                                  variant="circle"
                                  className="w-6 h-6"
                                />
                                <Skeleton className="h-5 w-32" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          menuCategories.map((category) => {
                            const activeSub = category.subcategories.find(
                              (sub) =>
                                pathname === "/shop" &&
                                searchParams.get("category") ===
                                category.name &&
                                searchParams.get("subcategory") === sub.name,
                            );
                            const isActiveCategory =
                              hoveredCategoryId === category.id ||
                              activeSub ||
                              (pathname === "/shop" &&
                                searchParams.get("category") === category.name);

                            return (
                              <div
                                key={category.id}
                                className="static"
                                onMouseEnter={() =>
                                  setHoveredCategoryId(category.id)
                                }
                                onMouseLeave={() => setHoveredCategoryId(null)}
                              >
                                <button
                                  onClick={() => {
                                    router.push(
                                      `/shop?category=${encodeURIComponent(category.slug || category.name)}`,
                                    );
                                    setIsCategoriesOpen(false);
                                  }}
                                  className={`flex items-center space-x-3 text-black w-full px-6 py-4 transition-all duration-300 ${isActiveCategory
                                    ? "bg-secondary/10 text-secondary"
                                    : "hover:bg-secondary/10 text-secondary-content"
                                    }`}
                                >
                                  <span className="text-xl">
                                    {category.icon}
                                  </span>
                                  <span className="font-semibold">
                                    {category.name}
                                  </span>
                                  <ChevronDown
                                    size={14}
                                    className="ml-auto -rotate-90 text-gray-400"
                                  />
                                </button>

                                <div
                                  className={`absolute left-full top-0 ml-[2px] bg-white w-64 rounded-2xl shadow-2xl transition-all duration-300 ease-out z-[60]
                  ${isActiveCategory
                                      ? "opacity-100 visible translate-x-0"
                                      : "opacity-0 invisible -translate-x-4"
                                    }`}
                                >
                                  <div className="bg-secondary/80 p-4 rounded-t-2xl">
                                    <h4 className="font-bold text-secondary-content">
                                      {category.name}
                                    </h4>
                                  </div>

                                  <div className="py-2">
                                    {category.subcategories.map((sub) => (
                                      <Link
                                        onClick={() =>
                                          setIsCategoriesOpen(false)
                                        }
                                        key={sub.name}
                                        href={`/shop?category=${encodeURIComponent(category.slug || category.name)}&subcategory=${encodeURIComponent(sub.slug || sub.name)}`}
                                        className="block px-6 py-3 text-secondary-content hover:text-secondary hover:bg-secondary/10 transition-colors duration-200 font-medium"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center bg-bg rounded-2xl">
                  <Search
                    className="absolute left-4 lg:left-6 text-gray-400"
                    size={18}
                  />
                  <input
                    type="search"
                    placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি অনুসন্ধান করুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-3.5 bg-transparent focus:outline-none text-ink placeholder:text-muted font-medium text-sm lg:text-base"
                  />
                  <button
                    type="submit"
                    className="px-3 lg:px-4 text-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    <Search size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSearch(!imageSearch);
                    }}
                    className="w-12 cursor-pointer text-muted hover:text-primary transition-colors"
                  >
                    <Camera />
                  </button>
                  {/* image search dropdown */}
                  {imageSearch ? (
                    <div
                      ref={imageSearchRef}
                      className="hidden sm:flex flex-col justify-center items-center min-w-66 min-h-36 absolute top-15 left-12 bg-white rounded-2xl shadow-xl border border-line z-50 p-4"
                    >
                      <div className="text-center">
                        <p className="font-bold text-ink">ছবি দিয়ে অনুসন্ধান</p>
                        <p className="text-xs text-muted mt-1">শীঘ্রই এই সুবিধা যুক্ত হচ্ছে!</p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </form>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 mx-3">
              {[
                {
                  key: "account",
                  href: "/account",
                  label: "অ্যাকাউন্ট",
                  icon: User,
                  size: 18,
                  showWhenLoggedIn: true,
                  hoverColors: "group-hover:bg-primary-light",
                },
                {
                  key: "signin",
                  href: "/signin",
                  label: "লগইন",
                  icon: data ? User : LogIn,
                  size: 16,
                  showWhenLoggedIn: false,
                  hoverColors: "group-hover:bg-primary-light",
                },
                {
                  key: "wishlist",
                  href: "/wishlist",
                  label: "উইশলিস্ট",
                  icon: Heart,
                  size: 16,
                  smSize: 20,
                  showWhenLoggedIn: true,
                  badge: String(wishlistCount),
                  hoverColors: "group-hover:bg-accent-light",
                },
                {
                  key: "cart",
                  href: "/addtocart",
                  label: "কার্ট",
                  icon: ShoppingCart,
                  size: 16,
                  smSize: 20,
                  showWhenLoggedIn: true,
                  badge: String(cartItems?.length || 0),
                  hoverColors: "group-hover:bg-primary-light",
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
                  hoverColors: "group-hover:bg-primary-light",
                },
              ].map((item) => {
                const isLoggedIn = mounted ? !!data : false;
                const isAdminUser = mounted ? hasDashboardAccess : false;
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
                      className="flex items-center space-x-1 sm:space-x-2 text-ink group-hover:text-primary transition-all duration-300"
                    >
                      <div
                        className={cn(
                          "relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg transition-all duration-300 shadow-sm",
                          item.hoverColors,
                          { "hidden sm:block": item.key === "signin" }
                        )}
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
                        <div className={cn(item.key === "signin" ? "" : "hidden md:block")}>
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

          {/* Mobile/Tablet Search Bar - Responsive */}
          <div className="lg:hidden">
            <form onSubmit={handleSearchSubmit} className="shadow-lg rounded-xl sm:rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60">
              <div className="flex-1 relative flex items-center">
                <Search
                  className="absolute left-3 sm:left-4 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি অনুসন্ধান করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent focus:outline-none text-ink placeholder:text-muted font-medium text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="px-2 text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <Search size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageSearch(!imageSearch);
                  }}
                  className="w-12 cursor-pointer text-muted hover:text-primary transition-colors"
                >
                  <Camera />
                </button>
              </div>
            </form>
          </div>
        </Container>

        {/* image search dropdown */}
        {imageSearch && (
          <div className="flex flex-col lg:hidden justify-center items-center absolute inset-0 bg-white shadow-2xl z-999 sm:w-80 mx-auto min-h-52 mt-25 rounded-2xl border border-line p-4">
            <button
              onClick={() => {
                setImageSearch(!imageSearch);
              }}
              className="absolute top-2 right-5 text-2xl text-muted hover:text-ink cursor-pointer"
            >
              ×
            </button>
            <p className="my-4 text-primary font-semibold">
              ছবি দিয়ে অনুসন্ধান
            </p>
            <div className="max-w-2/3 min-h-30 border-2 border-dashed border-primary/40 bg-primary-light/40 flex flex-col justify-center items-center gap-2 rounded-xl p-4 text-center">
              <p className="text-xs text-muted">শীঘ্রই এই সুবিধা যুক্ত হচ্ছে!</p>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Menu - Responsive */}
        <Container className="hidden md:block pt-0!">
          <nav className="items-center justify-between flex border-t border-line/60 pt-2 pb-1">
            <div className="flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative flex items-center space-x-1.5 text-ink/80 hover:text-primary font-semibold transition-all duration-300 group hover:scale-102 py-1"
                >
                  <span className="text-sm lg:text-base">{item.name}</span>
                  {item.badge && (
                    <span className="bg-primary text-black text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </div>
          </nav>
        </Container>
      </header>

      <BottomNav
        cartCount={cartItems?.length || 0}
        menuCategories={menuCategories}
      />
    </>
  );
};

export default Header;
