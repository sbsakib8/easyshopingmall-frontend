import React from 'react';
import Carousels from '@/src/helper/Hero/Carousel'
import ChatBoot from '@/src/compronent/Home/ChatBoot';
import Overview from './overview/Overview';
const DropShippingHome = ({ initialData }) => {
    
    return (
        <div>
            <div className=' py-1 mt-10 h-[200px] sm:h-[400px] lg:h-[720px] bg-[#F3F4F6]'>
                <div className=' py-1  h-[200px] sm:h-[400px] lg:h-[720px] bg-[#F3F4F6]  '>
                    <Carousels initialData={initialData?.banners} />
                </div>
                <ChatBoot></ChatBoot>
            </div>
            <Overview/>
        </div>
    );
};

export default DropShippingHome;