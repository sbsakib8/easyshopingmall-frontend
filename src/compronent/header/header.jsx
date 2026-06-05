"use client";

import logo from "@/app/icon.png";
import BottomNav from "@/src/compronent/header/BottomNav";
import Skeleton from "@/src/compronent/loading/Skeleton";
import Container from "@/src/compronent/shared/Container";
import { getCartApi } from "@/src/hook/useCart";
import { getWishlistApi } from "@/src/hook/useWishlist";
import { setSearchTerm } from "@/src/redux/shopSlice";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = ({ initialData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
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

            {/* Enhanced Search Bar  */}
            <div className="hidden lg:flex flex-1 max-w-xl justify-center mx-8">
              <div className="flex w-full shadow-lg rounded-2xl z-50  border border-gray-200/60 bg-bg backdrop-blur-sm">
                {/* Categories Button */}
                <div className="relative group/main" ref={dropdownRef}>
                  <button
                    onClick={toggleCategories}
                    className="flex items-center space-x-2 bg-bg px-4 lg:px-6 py-3 lg:py-4 hover:from-emerald-50 hover:to-teal-50 hover:text-secondary transition-all duration-300 group rounded-2xl"
                  >
                    <Menu
                      size={16}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    <span className="font-semibold text-sm lg:text-base">
                      Categories
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Categories Dropdown Container */}
                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Header */}
                      <div className="bg-secondary/80 p-4 rounded-t-2xl">
                        <h3 className="text-secondary-content font-bold text-lg flex items-center space-x-2">
                          <Star className="w-5 h-5 animate-pulse" />
                          <span>Shop by Category</span>
                        </h3>
                      </div>

                      {/* Main Categories List */}
                      <div className="py-2 relative">
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
                                  className={`flex items-center space-x-3 w-full px-6 py-4 transition-all duration-300 ${
                                    isActiveCategory
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
                  ${
                    isActiveCategory
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
                <div className="flex-1 relative flex items-center bg-bg rounded-2xl">
                  <Search
                    className="absolute left-4 lg:left-6 text-gray-400"
                    size={18}
                  />
                  <input
                    type="search"
                    placeholder="Search for products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 font-medium"
                  />
                  <button
                    onClick={() => {
                      // router.push(`/shop`);
                      setImageSearch(!imageSearch);
                    }}
                    className="w-12 cursor-pointer"
                  >
                    <Camera />
                  </button>
                  {/* image search dropdown */}
                  {imageSearch ? (
                    <div
                      ref={imageSearchRef}
                      className="hidden sm:flex flex-col  justify-center items-center min-w-66 min-h-36 absolute top-15 left-12 bg-amber-50 rounded-2xl shadow-2xl shadow-black-100 z-50"
                    >
                      {/*
                    <p className="my-4 text-green-600 font-semibold">
                        Search Product with Image
                      </p>
                      <div className="max-w-2/3 min-h-30 border-3 border-dotted border-green-300 bg-green-100 flex flex-col gap-2 justify-center items-center">
                        <p className="text-red-400">(JPG and PNG file only)</p>
                        <input
                          className="max-w-2/3 max-h-60 cursor-pointer bg-gray-200 py-1 rounded-2xl px-2"
                          type="file"
                          accept="image/*"
                        />
                      </div>

                    */}

                      <div>
                        <p>This feature is coming soon!</p>
                        <p>Thank you for your patience.</p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
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
                const isLoggedIn = !!data;
                const shouldShow =
                  (item.key === "account" && isLoggedIn) ||
                  (item.key === "signin" && !isLoggedIn) ||
                  (item.key !== "account" && item.key !== "signin");

                if (!shouldShow) return null;
                if (item.isAdminOnly && !isAdmin) return null;

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

          {/* Mobile/Tablet Search Bar - Responsive */}
          <div className="lg:hidden">
            <div className="shadow-lg rounded-xl sm:rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200/60">
              <div className="flex-1 relative flex items-center">
                <Search
                  className="absolute left-3 sm:left-4 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 font-medium text-sm sm:text-base"
                />
                <button
                  onClick={() => {
                    router.push("/shop");
                    setImageSearch(!imageSearch);
                  }}
                  className="w-12 cursor-pointer"
                >
                  <Camera />
                </button>
              </div>
            </div>
          </div>
        </Container>

        {/* image search dropdown */}
        {imageSearch && (
          <div className="flex flex-col lg:hidden justify-center items-center absolute inset-0  bg-white  shadow-2xl shadow-black-100 z-999 sm:w-80 mx-auto min-h-52 mt-25 rounded-sm">
            <button
              onClick={() => {
                setImageSearch(!imageSearch);
              }}
              className="absolute top-2 right-5 text-2xl"
            >
              X
            </button>
            <p className="my-4 text-green-600 font-semibold">
              Search Product with Image
            </p>
            <div className="max-w-2/3 min-h-30 border-3 border-dotted border-green-300 bg-green-100 flex flex-col justify-center items-center gap-2">
              <p className="text-secondary">(JPG and PNG file only)</p>
              <input
                className="max-w-2/3 max-h-60 cursor-pointer bg-gray-200 py-1 rounded-2xl px-2"
                type="file"
                accept="image/*"
              />
            </div>
          </div>
        )}

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
