
import Carousels from '@/src/helper/Hero/Carousel'
import Ads from './Ads'
import Categories from './Categories'
import PopularProducts from './popularProducts'
import ChatBoot from './ChatBoot'


function Hero({ initialData }) {
  return (
    <div>
      <div className=' py-1 mt-10 lg:mt-30  h-[200px] sm:h-[400px] lg:h-[720px] bg-[#F3F4F6]  '>
        <Carousels initialData={initialData?.banners} />
      </div>

      <div className='mt-5'>
        <Categories initialData={initialData?.categories} />
      </div>
      <Ads initialData={initialData?.ads} />
      <PopularProducts initialData={initialData} />
      <ChatBoot></ChatBoot>
    </div>

  )
}

export default Hero