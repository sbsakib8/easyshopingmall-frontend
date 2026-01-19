
import Carousels from '@/src/helper/Hero/Carousel'
import Ads from './Ads'
import Categories from './Categories'
import PopularProducts from './popularProducts'
import ChatBoot from './ChatBoot'


function Hero() {
  return (
    <div>
      <div className=' py-1 mt-10 lg:mt-30  h-[300px] sm:h-[400px] lg:h-[700px] bg-[#F3F4F6] overflow-hidden '>
        <Carousels />
      </div>

     <div className='mt-5'>
       <Categories />
     </div>
      <Ads />
      <PopularProducts />
      <ChatBoot></ChatBoot>
    </div>

  )
}

export default Hero