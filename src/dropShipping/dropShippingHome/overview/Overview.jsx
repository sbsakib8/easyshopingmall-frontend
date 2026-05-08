import { ClockAlertIcon, Package, Sparkles, Rocket, Users, PlaySquare, LayoutDashboard, ClipboardList, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

function Overview() {
  const data = useSelector((state) => state.user.data);

  const overview = [
    {
      id: 1,
      text: "All Products",
      icon: <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600/70 mb-3" />,
      href: "/all-products",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 2,
      text: "New Products",
      icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600/70 mb-3" />,
      href: "/new-products",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 3,
      text: "Boost Products",
      icon: <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600/70 mb-3" />,
      href: "/boost-products",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 4,
      text: "Team System",
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600/70 mb-3" />,
      href: "/team-system",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 5,
      text: "Video",
      icon: <PlaySquare className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600/70 mb-3" />,
      href: "/video",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 6,
      text: "Seller Dashboard",
      icon: <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600/70 mb-3" />,
      href: "/seller-dashboard",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 7,
      text: "Order List",
      icon: <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600/70 mb-3" />,
      href: "/order-list",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
    {
      id: 8,
      text: "Blog",
      icon: <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-600/70 mb-3" />,
      href: "/blog",
      class: "bg-gradient-to-b from-white to-gray-50/50 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 text-gray-800"
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Overview
        </h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600 font-medium">Select Section</p>
        </div>
      </div>
 <div className='container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
 {overview.map(view => <Link key={view.id} className={`py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-10 cursor-pointer rounded-3xl relative overflow-hidden flex flex-col items-center justify-center ${view.class}`} href={view.href}>
 
 <div>{view?.icon}</div>
 <h2 className="text-center text-lg sm:text-xl font-bold relative z-10"> {view.text}</h2>
 </Link>)}
 </div>
 </div>
 );
}

export default Overview;
