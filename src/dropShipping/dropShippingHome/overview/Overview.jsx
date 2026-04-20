import {ClockAlertIcon, Clipboard} from"lucide-react";
import Link from"next/link";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function Overview() {
 const data = useSelector((state) => state.user.data);

 const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Referral code copied!");
 };

 const overview = [
 {
 id: 1,
 text:"All Products",
 icon:"",
 href:"/all-products",
 class:"bg-base-400"
},
 {
 id: 2,
 text:"New Products",
 icon:"",
 href:"/new-products",
 class:"bg-base-500"
},
 {
 id: 3,
 text:"Boost Products",
 icon:"",
 href:"/boost-products",
 class:"bg-base-600"
},
 {
 id: 4,
 text:"Team System",
 icon:"",
 href:"/team-system",
 class:"bg-base-700"
},
 {
 id: 5,
 text:"Video",
 icon:"",
 href:"/video",
 class:"bg-base-800"
},
 {
 id: 6,
 text:"Seller Dashboard",
 icon:"",
 href:"/seller-dashboard",
 class:"bg-base-800/60"
},
 {
 id: 7,
 text:"Order List",
 icon:"",
 href:"/order-list",
 class:"bg-blue-400"
},
 {
 id: 8,
 text:"Blog",
 icon: <ClockAlertIcon/>,
 href:"/blog",
 class:"bg-red-400"
},
 ]

 return (
 <div className="container mx-auto px-4 py-8">
 {/* Header */}
  <div className="text-center mb-5">
  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
  Over View
  </h2>
  <div className="flex flex-col items-center gap-2">
    <p className="text-gray-500 text-sm">Select Section</p>
    {data?.referralCode && (
      <div className="flex items-center gap-3 bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-full mt-2">
        <span className="text-sm font-medium text-gray-600">Referral Code:</span>
        <span className="text-lg font-bold text-teal-600 tracking-wider">{data.referralCode}</span>
        <button 
          onClick={() => copyToClipboard(data.referralCode)}
          className="p-1.5 hover:bg-teal-50 rounded-full transition-colors text-teal-600 cursor-pointer"
          title="Copy Referral Code"
        >
          <Clipboard className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
  </div>
 <div className='container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
 {overview.map(view => <Link key={view.id} className={`py-20 md:px-20 cursor-pointer rounded-2xl relative ${view.class}`} href={view.href}>
 <h2 className="text-center text-lg font-bold"> {view.text}</h2>
 <p className="absolute top-5 right-3">{view?.icon}</p>
 </Link>)}
 </div>
 </div>
 );
}

export default Overview;
