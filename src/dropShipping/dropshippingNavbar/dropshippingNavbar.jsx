"use client";
import logo from"@/app/icon.png";
import {ChevronDown, ChevronRight, Heart, Menu, ShoppingCart, User, X, Home, Package, Sparkles, TrendingUp, ClipboardList, Settings, Coins, Users, LayoutDashboard} from "lucide-react";
import Image from"next/image";
import Link from"next/link";
import {useRouter} from"next/navigation";
import {useState} from"react";
import {useSelector} from"react-redux";
import { useGetUser } from "@/src/utlis/useGetuser";

const DropShippingNavbar = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [expandedItem, setExpandedItem] = useState(null);
 const router = useRouter();
 const [isScrolled, setIsScrolled] = useState(false);
 const [showBalance, setShowBalance] = useState(false);
 const {data: wishlistItems} = useSelector((state) => state.wishlist);
 const {items: cartItems} = useSelector((state) => state.dropshippingCart);
 const wishlistCount = wishlistItems?.length || 0;
 const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

 // user data fatch
 const { user: data, refetch: refetchUser } = useGetUser();
 // Navigation items
  const navItems = [
  {name:"Home", href:"/", icon: <Home size={18} />},
  {name:"All Products", href:"/all-products", icon: <Package size={18} />},
  {name:"Profile", href:"/profile", icon: <User size={18} />},
  {name:"New Products", href:"/new-products", icon: <Sparkles size={18} />},
  {name:"Wishlist", href:"/wishlist", icon: <Heart size={18} />},
  {name:"Sell & Profit", href:"/dropshipping-addtocart", icon: <TrendingUp size={18} />},
  {name:"Order List", href:"/order-list", icon: <ClipboardList size={18} />},
  {name:"My Analytics", href:"/my-analytics", icon: <TrendingUp size={18} />},
  {name:"Shop Settings", href:"/shop-settings", icon: <Settings size={18} />},

  {name:"Passive Income", href:"/passive-income", icon: <Coins size={18} />, subLink: [{name:"Box Leader", href:"/box-leader"}, {name:"Auditor", href:"/auditor"}, {name:"Member", href:"/member"}]},
  {name:"Referral Profile", href:"/referral-profile", icon: <Users size={18} />, subLink: [{name:"Referral Profit", href:"/referral-profit"}]},
  {name:"Payment Request", href:"/payment-request", icon: <Coins size={18} />},
  ];

 if (data?.role === "DROPSHIPPING" || data?.roles?.includes("DROPSHIPPING")) {
  navItems.push({name:"Dashboard", href:"/seller-dashboard", icon: <LayoutDashboard size={18} />});
}

 const toggleMobileMenu = () => {
 setIsMobileMenuOpen(!isMobileMenuOpen);
};

 return (
 <>
 {/* Main Header */}
 <header
 className={`bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200/50 ${isScrolled ?"h-16 sm:h-20":"h-20 sm:h-24 lg:h-[100px]"
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
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm border ${
            isMobileMenuOpen
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-100 hover:shadow-md"
          }`}
        >
          {isMobileMenuOpen ? (
            <X size={20} className="sm:w-6 sm:h-6" />
          ) : (
            <Menu size={20} className="sm:w-6 sm:h-6" />
          )}
        </button>
 <div className="relative">
 <div
  className={`w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl ${isScrolled ?"":""
 }`}
 >

 <Image src={logo} width={60} height={100} alt="Easy Shopping Mall Logo"/>
 </div>
 <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
 </div>
 <div className="hidden lg:flex transform items-center">

 <Link href={"/"} className="flex flex-row">
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
 {/* Balance Box */}
 <div
 onClick={() => {
     setShowBalance(!showBalance);
     if (!showBalance) refetchUser();
 }}
 className="flex items-center bg-white border border-gray-200 rounded-full p-1 cursor-pointer hover:shadow-md group select-none relative overflow-hidden min-w-[150px] h-10"
 >
 {/* coin icon */}
 <div
 className={`w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm z-10 ${showBalance ?"translate-x-[108px]":"translate-x-0"
}`}
 >
 ৳
 </div>

 <div className="absolute left-10 right-10 flex items-center justify-center">
 <span
 className={`text-[13.5px] pl-2 font-bold text-gray-700 whitespace-nowrap ${showBalance ?"opacity-0 -translate-x-4":"opacity-100 translate-x-0"
}`}
 >
 ব্যালেন্স দে...
 </span>
 <span
 className={`text-[13.5px] font-bold text-emerald-600 absolute whitespace-nowrap ${showBalance ?"opacity-100 translate-x-[-28px]":"opacity-0 translate-x-4"
}`}
 >
 ৳ {Number(data?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 </span>
 </div>
 </div>

 {data ? (
  <Link
  href="/account"
  className="flex items-center text-gray-700 hover:text-emerald-600 cursor-pointer group"
  >
  <div className="p-2 rounded-xl bg-bg group-hover:bg-emerald-600/10 shadow-sm transition-colors">
 <User
 size={18}
 className=""
 />
 </div>
 <div>
 <div className="hidden lg:block text-xs text-gray-500 font-medium">
 Account
 </div>
 </div>
 </Link>
 ) : (
  <Link
  href="/signin"
  className="flex items-center text-gray-700 hover:text-emerald-600 cursor-pointer group"
  >
  <div className="p-2 rounded-xl bg-white border border-gray-100 group-hover:bg-emerald-600/10 shadow-sm transition-colors">
 <User
 size={18}
 className=""
 />
 </div>
 <div>
 <div className="hidden lg:block text-xs text-gray-500 font-medium">SignIn</div>
 </div>
 </Link>
 )}
 {/* Wishlist - Responsive */}
 <div className="relative cursor-pointer group">
  <Link
  href="/wishlist"
  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-emerald-600 group"
  >
  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg group-hover:bg-pink-50 shadow-sm transition-colors">
 <Heart
 size={16}
 className="sm:w-5 sm:h-5 group-hover:text-pink-600"
 />
 {wishlistCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-accent-content text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg">
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
  href="/dropshipping-addtocart"
  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-emerald-600 group"
  >
  <div className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bg group-hover:bg-emerald-600/10 shadow-sm transition-colors">
 <ShoppingCart
 size={16}
 className="sm:w-5 sm:h-5"
 />
 {cartCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-teal-600 text-accent-content text-xs rounded-full h-4 w-4 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg">
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
    className={`fixed inset-0 z-50 ${
      isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    {/* Backdrop/Overlay */}
    <div
      className="absolute min-h-screen inset-0 bg-black/60 backdrop-blur-md"
      onClick={toggleMobileMenu}
    ></div>

    {/* Side Menu */}
    <div
      className={`absolute top-0 left-0 h-screen w-[280px] sm:w-[320px] bg-white/80 backdrop-blur-2xl border-r border-white/50 shadow-[0_0_40px_rgba(0,0,0,0.1)] ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-y-auto flex flex-col`}
    >
      <div className="p-6 bg-white/30 border-b border-gray-200/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <Link href="/">
              <Image onClick={toggleMobileMenu} src={logo} width={35} height={35} alt="Logo" className="object-contain" />
            </Link>
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-wide">MENU</span>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white/60 hover:bg-white border border-gray-200 rounded-full group shadow-sm"
        >
          <X size={20} className="text-gray-700" />
        </button>
      </div>
      
      <nav className="p-4 space-y-2 flex-grow">
        {navItems.map((item, index) => {
          const hasSubLinks = item.subLink && item.subLink.length > 0;
          const isExpanded = expandedItem === item.name;

          return (
            <div key={index} className="space-y-1">
              {hasSubLinks ? (
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-full font-medium ${
                    isExpanded
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className={isExpanded ? "rotate-180" : ""}>
                    <ChevronDown size={16} />
                  </div>
                </button>
              ) : (
                <Link
                  onClick={() => {
                    toggleMobileMenu();
                    setExpandedItem(null);
                  }}
                  href={item.href}
                  className="w-full flex items-center justify-between py-2.5 px-4 text-gray-600 hover:bg-gray-100 hover:text-black rounded-full font-medium group"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Sub-links (Instant Toggle) */}
              <div
                className={`${isExpanded ? "block mt-2" : "hidden"}`}
              >
                <div className="pl-6 space-y-0.5 border-l-2 border-gray-100 ml-4 mt-1">
                  {item.subLink?.map((sub, sIndex) => (
                    <Link
                      key={sIndex}
                      href={sub.href}
                      onClick={() => {
                        toggleMobileMenu();
                        setExpandedItem(null);
                      }}
                      className="block py-2 px-4 text-[13px] text-gray-500 hover:text-black hover:bg-gray-100 rounded-full font-medium"
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
      
      {/* Optional Footer or Logout in Menu if needed */}
      <div className="p-6 border-t border-gray-200/50 bg-gray-50/30">
        <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-widest">
          Easy Shopping Mall &copy; 2026
        </p>
      </div>
    </div>
  </div>
 </header>
 </>
 );
};

export default DropShippingNavbar;
