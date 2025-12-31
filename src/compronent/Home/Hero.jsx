
import Carousels from '@/src/helper/Hero/Carousel'
import Ads from './Ads'
import Categories from './Categories'
import PopularProducts from './popularProducts'
import ChatBoot from './ChatBoot'


function Hero() {
  return (
    <div>
      <div className=' py-1 lg:mt-28  h-[500px] sm:h-[600px] lg:h-[750px] bg-[#F3F4F6]  '>
        <Carousels />
      </div>

      <Categories />
      <Ads />
      <PopularProducts />
      <ChatBoot></ChatBoot>
    </div>

  )
}

export default Hero