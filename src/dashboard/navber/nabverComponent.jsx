"use client"
import NotificationDropdown from "@/src/helper/notification"
import { useGetcategory } from "@/src/utlis/usecategory"
import { useGetSubcategory } from "@/src/utlis/useSubcategory"
import {
  AppWindow,
  BarChart3,
  BookImage,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Home,
  ImageDown,
  ImageIcon,
  ImagePlus,
  Menu,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldUser,
  ShoppingCart,
  Tag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { MdEmail } from "react-icons/md"
import { useSelector } from "react-redux"

const DashboardNebver = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [expandedMenus, setExpandedMenus] = useState({})
  const [isHovered, setIsHovered] = useState(false);


  // admin user data get
  const data = useSelector((state) => state.user.data);
  // console.log('data', data);


  // category get    
  const { category, loading, error } = useGetcategory()
  // subcategory all get 
  const { } = useGetSubcategory()


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  const menuItems = [
    {
      id: 1,
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: 2,
      label: "Products",
      icon: Package,
      path: "/dashboard/products/allproducts",
      submenu: [
        { path: "products/allproducts", id: 11, label: "All Products", icon: Package },
        { path: "products/addproduct", id: 12, label: "Add Product", icon: Plus },
        { path: "products/subcategory", id: 13, label: "SubCategory", icon: Tag },
        { path: "products/addcategorie", id: 14, label: "Categorie", icon: Tag },
        { path: "products/inventory", id: 16, label: "Inventory", icon: BarChart3 },
      ],
    },
    {
      id: 3,
      label: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/order/allorders",
      submenu: [
        { path: "/order/allorders", id: 16, label: "All Orders", icon: ShoppingCart },
        { path: "/order/pending-orders", id: 17, label: "Pending Orders", icon: Clock },
        { path: "/order/shipped-orders", id: 18, label: "Shipped Orders", icon: Truck },
      ],
    },
    {
      id: 4,
      label: "Customers",
      icon: Users,
      path: "/dashboard/customers/all-customers",
      submenu: [
        { path: "/customers/all-customers", id: 19, label: "All Customers", icon: Users },
        { path: "/customers/customer-groups", id: 20, label: "Customer Groups", icon: Users },
        { path: "/customers/reviews", id: 22, label: "reviews", icon: MessageSquare },
      ],
    },
    {
      id: 5,
      label: "Analytics",
      icon: TrendingUp,
      path: "/dashboard/analytics/sales-report",
      submenu: [
        { path: "/analytics/sales-report", id: 23, label: "Sales Report", icon: BarChart3 },
        { path: "/analytics/product-analytics", id: 24, label: "Product Analytics", icon: Package },
        { path: "/analytics/customer-analytics", id: 25, label: "Customer Analytics", icon: Users },
        { path: "/analytics/traffic-analytics", id: 26, label: "Traffic Analytics", icon: Globe },
      ],
    },
    {
      id: 6,
      label: "Banners",
      icon: AppWindow,
      path: "/dashboard/banner/home-slider",
      submenu: [
        { path: "/banner/home-slider", id: 27, label: "Home Slider", icon: BookImage },
        { path: "/banner/center-banner", id: 28, label: "Center Banner", icon: ImagePlus },
        { path: "/banner/left-banner", id: 29, label: "Left Banner", icon: ImageIcon },
        { path: "/banner/right-banner", id: 30, label: "Right Banner", icon: ImageDown },
      ],
    },
    {
      id: 7,
      label: "Content",
      icon: FileText,
      path: "/dashboard/content/blogs",
      submenu: [
        { path: "/content/blogs", id: 31, label: "Blogs", icon: FileText },
        { path: "/content/media-library", id: 32, label: "Media Library", icon: ImageIcon },
        { path: "/content/email-list", id: 50, label: "Email", icon: MdEmail },
      ],
    },
    {
      id: 8,
      label: "Settings",
      icon: Settings,
      path: "/dashboard/settings/generalsettings",
      submenu: [
        { path: "/settings/userupdate", id: 53, label: "User Manage", icon: ShieldUser },
        { path: "/settings/generalsettings", id: 33, label: "General Settings", icon: Settings },
        { path: "/settings/paymentsettings", id: 34, label: "Payment Settings", icon: DollarSign },
        { path: "/settings/shippingsettings", id: 35, label: "Shipping Settings", icon: Truck },
        { path: "/settings/securitysettings", id: 36, label: "Security", icon: Shield },
      ],
    },
  ]

  return (
    <div className=" bg-gradient-to-br from-gray-900 via-black to-gray-800 ">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4 ">
              <button
                onClick={toggleSidebar}
                className="group p-3 rounded-xl bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700/50"
              >
                <Menu className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <Link href="/" className="flex items-center space-x-3 animate-fadeIn">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/50 animate-pulse border border-gray-600/30">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    EasyShopingMall
                  </h1>
                  <p className="text-xs text-gray-400 font-medium">Admin Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-700/50 bg-black/70 backdrop-blur-sm text-white placeholder-gray-400 focus:bg-black/90 focus:outline-none focus:ring-4 focus:ring-gray-600/30 focus:border-gray-600 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-800/20 to-black/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Mobile search button */}
              <button className="md:hidden p-3 rounded-xl bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg border border-gray-700/50">
                <Search className="w-5 h-5 text-white" />
              </button>

              {/* Notification  */}

              <NotificationDropdown />

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700/60">
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg shadow-black/50 transform group-hover:scale-110 transition-all duration-300 border border-gray-600/50">
                    {
                      data?.image ? <img className=" w-9 h-9 rounded-full cursor-pointer" src={data?.image} alt="image" /> : <span className="text-white font-bold text-sm group-hover:animate-pulse">{data?.name?.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{data?.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{data?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-500 ease-out ${sidebarOpen || isHovered ? "w-full md:w-72" : "w-0 md:w-20"} bg-black/95 backdrop-blur-xl border-r border-gray-800/50 shadow-2xl shadow-black/20 overflow-hidden`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black/20 to-gray-800/20 pointer-events-none"></div>

        <div className="flex flex-col h-full relative z-10  ">
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={item.id} className="animate-slideInLeft" style={{ animationDelay: `${index * 0.1}s` }}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.id)
                      if (item.submenu) {
                        toggleSubmenu(item.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeMenu === item.id
                      ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-xl shadow-black/50 transform scale-105 border border-gray-600/50"
                      : "text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-black/50 hover:shadow-lg hover:shadow-black/20 hover:scale-105 hover:text-white border border-transparent hover:border-gray-700/30"
                      }`}
                  >
                    {/* Animated background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeMenu === item.id ? "opacity-30" : ""}`}
                    ></div>

                    <Link  onClick={toggleSidebar}  href={`${item.path}`} className="flex items-center space-x-4 relative z-10">
                      <div
                        className={`p-2 rounded-xl transition-all duration-300 ${activeMenu === item.id
                          ? "bg-white/10 shadow-lg backdrop-blur-sm"
                          : "group-hover:bg-gray-700/30"
                          }`}
                      >
                        <item.icon
                          className={`w-5 h-5 transition-all duration-300 ${activeMenu === item.id
                            ? "text-white scale-110"
                            : "text-gray-400 group-hover:text-white group-hover:scale-110"
                            }`}
                        />
                      </div>
                      {(sidebarOpen || isHovered) && (
                        <span
                          className={`transition-all duration-300 ${sidebarOpen || isHovered ? "opacity-100 transform translate-x-0" : "opacity-0 transform translate-x-4"
                            } font-medium`}
                        >
                          {item.label}
                        </span>
                      )}
                    </Link>
                    {item.submenu && (sidebarOpen || isHovered) && (
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 relative z-10 ${expandedMenus[item.id] ? "rotate-90 text-white" : "text-gray-500"
                          } ${activeMenu === item.id ? "text-white" : ""}`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu &&(sidebarOpen || isHovered) && (
                    <div
                     onClick={toggleSidebar}
                      className={`mt-3 ml-6 space-y-2 overflow-hidden transition-all duration-500 transform ${expandedMenus[item.id]
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4"
                        }`}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          href={`/dashboard/${subItem.path}`}
                          key={subItem.id}
                          onClick={() => setActiveMenu(subItem.id)}
                          className={`group flex items-center space-x-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 transform hover:scale-105 ${activeMenu === subItem.id
                            ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg shadow-black/30 border border-gray-600/50"
                            : "text-gray-400 hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-black/30 hover:text-white hover:shadow-md border border-transparent hover:border-gray-700/20"
                            } animate-slideInRight`}
                          style={{ animationDelay: `${subIndex * 0.05}s` }}
                        >
                          <div
                    
                            className={`p-1.5 rounded-lg transition-all duration-300 ${activeMenu === subItem.id ? "bg-white/10 backdrop-blur-sm" : "group-hover:bg-gray-700/20"
                              }`}
                          >
                            <subItem.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <span className="font-medium">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800/50">
            {sidebarOpen || isHovered && (
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl shadow-black/50 transform hover:scale-105 transition-all duration-300 group overflow-hidden border border-gray-700/50">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:animate-bounce border border-gray-600/30">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">EasyShoppingMall</p>
                    <p className="text-xs text-gray-300">you can manage dashboard</p>
                  </div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-3 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </aside>
   

      {/* Main Content */}
      <main
        className={`
    pt-16 transition-all duration-500 ease-out min-h-screen
    ${sidebarOpen || isHovered ? "pl-72" : "pl-0"}
    md:pl-0
  `}
      >
        {children}
      </main>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Updated scrollbar to black theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #374151, #111827);
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4b5563, #1f2937);
        }

        /* Enhanced mobile responsive adjustments */
        @media (max-width: 768px) {
          .animate-slideInLeft {
            animation-duration: 0.4s;
          }
          
          /* Added mobile-specific blur and spacing adjustments */
          .backdrop-blur-xl {
            backdrop-filter: blur(20px);
          }
        }

        @media (max-width: 640px) {
          /* Enhanced mobile responsiveness */
          .space-x-4 > * + * {
            margin-left: 0.75rem;
          }
          
          .space-x-3 > * + * {
            margin-left: 0.5rem;
          }
        }

        /* Enhanced glassmorphism effect for black theme */
        .glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Updated gradient text animation for black theme */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .gradient-animate {
          background: linear-gradient(-45deg, #ffffff, #e5e7eb, #9ca3af, #6b7280);
          background-size: 400% 400%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Updated hover glow effects for black theme */
        .glow-on-hover:hover {
          box-shadow: 0 0 20px rgba(107, 114, 128, 0.5),
                      0 0 40px rgba(75, 85, 99, 0.3),
                      0 0 60px rgba(55, 65, 81, 0.2);
        }

        /* Added enhanced blur effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }

        /* Added responsive text sizing */
        @media (max-width: 480px) {
          .text-xl {
            font-size: 1.125rem;
          }
          
          .text-sm {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}

export default DashboardNebver
