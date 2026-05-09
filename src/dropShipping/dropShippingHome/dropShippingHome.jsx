import React from'react';
import Carousels from'@/src/helper/Hero/Carousel'
import ChatBoot from'@/src/compronent/Home/ChatBoot';
import Overview from'./overview/Overview';
const DropShippingHome = ({initialData}) => {
 
 return (
 <div className="min-h-screen bg-[#F9FAFB]">
  <div className="relative z-10">
   <div className='py-1 mt-10 h-[200px] sm:h-[400px] lg:h-[720px] bg-white border-b border-gray-200/50 shadow-sm'>
    <div className='py-1 h-[200px] sm:h-[400px] lg:h-[720px]'>
     <Carousels initialData={initialData?.banners} />
    </div>
    <ChatBoot></ChatBoot>
   </div>
   <Overview/>
  </div>
 </div>
 );
};

export default DropShippingHome;