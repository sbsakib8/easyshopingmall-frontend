"use client";
import logo from "@/app/icon.png";
import { getCartApi } from "@/src/hook/useCart";
import { getWishlistApi } from "@/src/hook/useWishlist";
import { useCategoryWithSubcategories } from "@/src/utlis/useCategoryWithSubcategories";
import { useGetProduct } from "@/src/utlis/userProduct";
import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import { Camera, ChevronDown, Heart, Menu, Search, ShoppingCart, Star, User, X, Zap } from "lucide-react";
import Skeleton from '@/src/compronent/loading/Skeleton';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/src/redux/shopSlice";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showLiveResults, setShowLiveResults] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();
  const { data: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistCount = wishlistItems?.length || 0;
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const [imageSearch, setImageSearch] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    setHoveredCategoryId(null);
    setIsCategoriesOpen(false);
  }, [pathname]);

  // user data fatch
  const data = useSelector((state) => state.user.data);

  // load wishlist + cart for logged-in user
  useEffect(() => {
    if (data?._id) {
      getWishlistApi(dispatch);
      getCartApi(data._id, dispatch);
    }
  }, [dispatch, data?._id]);

  // Countdown timer state (will be driven by website info)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { data: siteInfo, loading: siteLoading } = useWebsiteInfo();
  // console.log(siteInfo)
  // Fetch categories + subcategories from hook
  const {
    categories,
    subcategories,
    loading: categoriesLoading,
    getSubcategoriesForCategory,
  } = useCategoryWithSubcategories();

  // Attach nested subcategory names to each category for the old UI structure
  const menuCategories = (categories || []).map((cat) => ({
    ...cat,
    icon: cat.icon || cat.image || null,
    subcategories: (subcategories || [])
      .filter((s) => s.categoryId === cat.id || s.categoryId?._id === cat.id)
      .map((s) => s.name),
  }));



  // Navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "blog", badge: "New" },
    { name: "Contact", href: "contact" },
  ];

  if (data?.role === "ADMIN") {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const { searchTerm: reduxSearchTerm } = useSelector((state) => state.shop || {});

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
    } else if (debouncedSearch === '' && searchQuery === '' && pathname === "/shop") {
      dispatch(setSearchTerm(""));
      router.push('/shop');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  // Show live results when user types at least 2 chars
  useEffect(() => {
    // allow single-character suggestions (helpful for quick lookups)
    if (debouncedSearch && debouncedSearch.length >= 1) setShowLiveResults(true);
    else setShowLiveResults(false);
  }, [debouncedSearch]);

  // Load products once and filter client-side for live suggestions
  const productParams = useMemo(() => ({ page: 1, limit: 200, search: "" }), []);
  const { product: productResp, loading: productsLoading } = useGetProduct(productParams);

  const allProducts = useMemo(() => {
    const list = productResp?.products ?? productResp?.data ?? productResp ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((p) => ({
      id: p._id || p.id || (p._id?.toString && p._id.toString()) || String(p.id || ""),
      name: p.name || p.productName || p.title || "Untitled",
      price: Number(p.price ?? p.sell_price ?? p.amount) || 0,
      originalPrice: Number(p.originalPrice ?? p.oldPrice ?? p.mrp ?? 0) || 0,
      image: p.image || p.images?.[0] || "/banner/img/placeholder.png",
      rating: Number(p.rating ?? p.ratings) || 4,
      reviews: Number(p.reviews ?? p.reviewCount ?? 0) || 0,
      createdAt: p.createdAt || p.created_at || p.createdDate,
    }));
  }, [productResp]);

  const liveResults = useMemo(() => {
    if (!debouncedSearch || debouncedSearch.length < 1) return [];
    const q = debouncedSearch.toLowerCase();
    return allProducts
      .filter((p) => (p.name || "").toLowerCase().includes(q) || String(p.price || "").includes(q))
      .slice(0, 6);
  }, [allProducts, debouncedSearch]);

  // Additional helpers for dropdown cards
  const wishlistIds = useSelector(
    (state) => new Set((state.wishlist?.data || []).map((i) => i.id))
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  const toggleWishlistLocal = async (productId) => {
    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlistApi(productId, dispatch);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistApi(productId, dispatch);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCartFromHeader = async (prod) => {
    if (!data?._id) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    try {
      await addToCartApi(
        {
          userId: data._id,
          productId: prod.id || prod._id || prod._id?.toString(),
          quantity: 1,
          price: prod.price || prod.sell_price || 0,
        },
        dispatch
      );
      toast.success(`${prod.name || prod.productName || "Product"} added to cart`);
      getCartApi(data._id, dispatch);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <>
      <div
        className={`bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-white text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 relative overflow-hidden transition-all duration-300 ${isScrolled ? "h-0 py-0 opacity-0" : "h-auto lg:h-[60px]"
          } hidden sm:block`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-32 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-7 right-40 w-1 h-1 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="px-2 sm:px-4 lg:px-32 mx-auto text-center flex flex-col lg:flex-row justify-between items-center relative z-10 space-y-2 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="font-semibold tracking-wide text-center">
                {siteLoading
                  ? "Loading offers..."
                  : siteInfo?.offerText || "FREE delivery & 40% Discount for next 3 orders!"}
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/30 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-0.5 sm:space-x-1 animate-pulse">
                <span className="font-bold text-sm sm:text-lg">
                  {timeLeft.days.toString().padStart(2, "0")}
                </span>
                <span className="text-xs opacity-90">Days</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/40"></div>
              <div className="flex items-center space-x-0.5 sm:space-x-1 animate-pulse delay-75">
                <span className="font-bold text-sm sm:text-lg">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-xs opacity-90">Hr</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/40"></div>
              <div className="flex items-center space-x-0.5 sm:space-x-1 animate-pulse delay-150">
                <span className="font-bold text-sm sm:text-lg">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-xs opacity-90">Min</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/40"></div>
              <div className="flex items-center space-x-0.5 sm:space-x-1 animate-pulse delay-200">
                <span className="font-bold text-sm sm:text-lg text-yellow-300">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-xs opacity-90">Sec</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span className="font-medium">Need help? Call: {siteInfo?.number}</span>
          </div>
        </div>
      </div>

      {/* Secondary Top Bar */}
      <div
        className={`bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200/80 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 backdrop-blur-sm transition-all duration-300 ${isScrolled ? "h-0 py-0 opacity-0" : "h-auto sm:h-[50px] lg:h-[80px]"
          } hidden sm:block`}
      >
        <div className="px-2 sm:px-5 lg:px-32 mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-2 sm:space-x-4 lg:space-x-6 mb-2 sm:mb-0">
            <Link
              href="/about"
              className="text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/account"
              className="text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative group"
            >
              My Account
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative group"
            >
              Wishlist
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="hidden lg:flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              <span>{siteInfo?.deliveryText || "We deliver everyday from 7:00 to 22:00"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Dropdown with Enhanced Styling */}
            {/* <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200/60 shadow-sm hover:shadow-md"
              >
                <span className="font-medium text-xs sm:text-sm">{language}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                  {['English', 'বাংলা', 'العربية'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLanguageOpen(false); }}
                      className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 transition-all duration-200 font-medium"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Currency Dropdown with Enhanced Styling */}
            {/* <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200/60 shadow-sm hover:shadow-md"
              >
                <span className="font-medium text-xs sm:text-sm">{currency}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-20 sm:w-24 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                  {['USD', 'BDT', 'EUR'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => { setCurrency(curr); setIsCurrencyOpen(false); }}
                      className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 transition-all duration-200 font-medium"
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            <Link
              href="/account?tab=orders"
              className="text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative group font-medium text-xs sm:text-sm"
            >
              Track Order
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
        <div className="py-2 overflow-hidden hidden sm:block bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400">
          <marquee behavior="scroll" direction="left" scrollamount="8" loop="infinite" className="text-sm font-semibold text-gray-800">
            {siteInfo?.discountTitle}
          </marquee>
        </div>
      </div>

      {/* Marquee Banner */}

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
                    {/* <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-white rounded-lg sm:rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md sm:rounded-lg"></div>
                    </div> */}
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

            {/* Enhanced Search Bar  */}
            <div className="hidden lg:flex flex-1 max-w-3xl mx-8">
              <div className="flex w-full shadow-lg rounded-2xl z-50  border border-gray-200/60 bg-white/90 backdrop-blur-sm">
                {/* Categories Button */}
                <div className="relative group/main">
                  {" "}
                  <button
                    onClick={toggleCategories}
                    className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 lg:px-6 py-3 lg:py-4 hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 transition-all duration-300 group"
                  >
                    <Menu
                      size={16}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    <span className="font-semibold text-sm lg:text-base">Categories</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {/* Categories Dropdown Container */}
                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-t-2xl">
                        <h3 className="text-white font-bold text-lg flex items-center space-x-2">
                          <Star className="w-5 h-5 animate-pulse" />
                          <span>Shop by Category</span>
                        </h3>
                      </div>

                      {/* Main Categories List */}
                      <div className="py-2 relative">
                        {categoriesLoading ? (
                          <div className="py-2 space-y-1">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="flex items-center space-x-3 px-6 py-4">
                                <Skeleton variant="circle" className="w-6 h-6" />
                                <Skeleton className="h-5 w-32" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          menuCategories.map((category) => {
                            const activeSub = category.subcategories.find(
                              (sub) => pathname === `/shop?category=${encodeURIComponent(sub)}`
                            );
                            const isActiveCategory = hoveredCategoryId === category.id || activeSub;

                            return (
                              <div
                                key={category.id}
                                className="static"
                                onMouseEnter={() => setHoveredCategoryId(category.id)}
                                onMouseLeave={() => setHoveredCategoryId(null)}
                              >
                                <button
                                  className={`flex items-center space-x-3 w-full px-6 py-4 transition-all duration-300 ${isActiveCategory
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "hover:bg-emerald-50 text-gray-700"
                                    }`}
                                >
                                  <span className="text-xl">{category.icon}</span>
                                  <span className="font-semibold">{category.name}</span>
                                  <ChevronDown
                                    size={14}
                                    className="ml-auto -rotate-90 text-gray-400"
                                  />
                                </button>


                                <div
                                  className={`absolute left-full top-0 ml-[2px] w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl transition-all duration-300 ease-out z-[60] 
                  ${isActiveCategory
                                      ? "opacity-100 visible translate-x-0"
                                      : "opacity-0 invisible -translate-x-4"
                                    }`}
                                >
                                  <div className="bg-gray-50/50 p-4 border-b rounded-t-2xl">
                                    <h4 className="font-bold text-gray-800">{category.name}</h4>
                                  </div>

                                  <div className="py-2">
                                    {category.subcategories.map((sub) => (
                                      <Link
                                        key={sub}
                                        href={`/shop?category=${encodeURIComponent(sub)}`}
                                        className="block px-6 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 font-medium"
                                      >
                                        {sub}
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
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 lg:left-6 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for products, categories or brands"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery || "")}`);
                    }}
                    className="w-full pl-12 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 font-medium"
                  />
                  <button onClick={() => {
                    router.push(`/shop`)
                    setImageSearch(!imageSearch)
                  }} className="w-12 cursor-pointer" >
                    <Camera />
                  </button>
                  {/* image searche dropdown */}
                  {imageSearch ? <div className="hidden sm:flex flex-col  justify-center items-center min-w-96 min-h-60 absolute top-15 left-0 bg-amber-50 rounded-2xl shadow-2xl shadow-black-100 z-50">

                    <p className="my-4 text-green-600 font-semibold">Search Product with Image</p>
                    <div className="max-w-2/3 min-h-30 border-3 border-dotted border-green-300 bg-green-100 flex flex-col gap-2 justify-center items-center">
                      <p className="text-red-400">(JPG and PNG file only)</p>
                      <input className="max-w-2/3 max-h-60 cursor-pointer bg-gray-200 py-1 rounded-2xl px-2" type="file" accept="image/*" />
                    </div>
                  </div> : ""}

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

              {/* Wishlist - Responsive */}
              <div className="relative cursor-pointer group">
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 group-hover:text-emerald-600 transition-all duration-300"
                >
                  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-pink-100 group-hover:to-rose-100 transition-all duration-300 shadow-sm">
                    <Heart
                      size={16}
                      className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 group-hover:text-pink-600"
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-bounce shadow-lg">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block lg:block">
                    <div className="text-xs text-gray-500 font-medium">Wishlist</div>
                  </div>
                </Link>
              </div>

              {/* Cart - Responsive */}
              <div className="relative cursor-pointer group">
                <Link
                  href="/addtocart"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 group-hover:text-emerald-600 transition-all duration-300"
                >
                  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 shadow-sm">
                    <ShoppingCart
                      size={16}
                      className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300"
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block lg:block">
                    <div className="text-xs text-gray-500 font-medium">Cart</div>
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-emerald-100 hover:to-teal-100 text-gray-700 hover:text-emerald-600 transition-all duration-300 shadow-sm"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Search Bar - Responsive */}
          <div className="lg:hidden pb-2 sm:pb-4">
            <div className="shadow-lg rounded-xl sm:rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-3 sm:left-4 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm sm:text-base"
                />
                <button onClick={() => {
                  router.push("/shop")
                  setImageSearch(!imageSearch)
                }} className="w-12 cursor-pointer" >
                  <Camera />
                </button>

              </div>
            </div>
          </div>
        </div>
        {/* image searche dropdown */}
        {imageSearch ? <div className="flex flex-col lg:hidden justify-center items-center absolute inset-0  bg-white  shadow-2xl shadow-black-100 z-999 sm:w-80 mx-auto min-h-52 mt-25 rounded-sm">
          <button onClick={() => { setImageSearch(!imageSearch) }} className="absolute top-2 right-5 text-2xl" >X</button>
          <p className="my-4 text-green-600 font-semibold">Search Product with Image</p>
          <div className="max-w-2/3 min-h-30 border-3 border-dotted border-green-300 bg-green-100 flex flex-col justify-center items-center gap-2">
            <p className="text-red-400">(JPG and PNG file only)</p>
            <input className="max-w-2/3 max-h-60 cursor-pointer bg-gray-200 py-1 rounded-2xl px-2" type="file" accept="image/*" />
          </div>
        </div> : ""}
        {/* Enhanced Navigation Menu - Responsive */}
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-gray-200/60 backdrop-blur-sm">
          <div className="container mx-auto px-2 sm:px-4 hidden lg:block">
            <nav className="hidden lg:flex items-center justify-between py-3 lg:py-4">
              <div className="flex items-center space-x-4 lg:space-x-8">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="relative flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-semibold transition-all duration-300 group hover:scale-105"
                  >
                    <span className="text-sm lg:text-base">{item.name}</span>
                    {item.badge && (
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 lg:px-3 py-0.5 lg:py-1 rounded-full font-bold shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Fully Responsive */}
        {isMobileMenuOpen && (
          <div className="lg:hidden 
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

              {/* Mobile Categories Section */}
              <div className="border-t max-h-[25vh] overflow-y-scroll border-gray-200/60 pt-3 sm:pt-4 mt-3 sm:mt-4 sm:hidden">
                <button
                  onClick={toggleCategories}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 rounded-xl transition-all duration-300 font-medium shadow-sm hover:bg-emerald-50"
                >
                  <span className="text-sm font-semibold">Categories</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="mt-2 space-y-2 bg-gradient-to-r from-gray-50 to-white rounded-xl p-2 animate-in slide-in-from-top-3 duration-300">
                    {menuCategories.map((category, index) => {
                      const isOpen = openMobileCategory === index;

                      return (
                        <div
                          key={category.id}
                          className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                        >
                          {/* Category */}
                          <button
                            onClick={() => setOpenMobileCategory(isOpen ? null : index)}
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{category.icon}</span>
                              <span className="text-sm">{category.name}</span>
                            </div>

                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                }`}
                            />
                          </button>

                          {/* Subcategories (FAQ style) */}
                          {isOpen && (
                            <div className="px-4 pb-3 space-y-1 animate-in slide-in-from-top-2">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  onClick={toggleMobileMenu}
                                  href={`/shop?category=${encodeURIComponent(sub)}`}
                                  className="block py-2 px-2 rounded-md text-sm text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Quick Actions */}
              {/* <div className="border-t border-gray-200/60 pt-3 sm:pt-4 mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 sm:p-4 rounded-xl flex flex-col items-center space-y-1 sm:space-y-2 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 cursor-pointer group shadow-lg">
                  <Package size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-bold text-xs sm:text-sm text-center">30% Off Sale</span>
                  <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-full text-xs font-bold">Limited</span>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 sm:p-4 rounded-xl flex flex-col items-center space-y-1 sm:space-y-2 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 cursor-pointer group shadow-lg">
                  <Star size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold text-xs sm:text-sm text-center">Trending</span>
                  <span className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-xs font-bold">Hot</span>
                </div>
              </div> */}

              {/* Mobile Contact Info */}
              {/* <div className="border-t border-gray-200/60 pt-3 sm:pt-4 mt-3 sm:mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm">Need Help?</span>
                </div>
                <div className="text-emerald-600 font-semibold text-sm sm:text-base">+258 3268 21485</div>
              </div> */}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
