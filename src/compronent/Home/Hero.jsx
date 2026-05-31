import Carousels from "@/src/helper/Hero/Carousel";
import Ads from "./Ads";
import Categories from "./Categories";
import ChatBoot from "./ChatBoot";
import PopularProducts from "./popularProducts";

function Hero({ initialData }) {
  return (
    <div className="bg-bg md:pt-28 lg:pt-10">
      <div className=" py-1 mt-10 lg:mt-12  h-[200px] sm:h-[400px] lg:h-[720px] bg-bg  ">
        <Carousels initialData={initialData?.banners} />
      </div>

      <div className="mt-5 bg-bg">
        <Categories initialData={initialData?.subcategories} />
      </div>
      <Ads initialData={initialData?.ads} />
      <PopularProducts initialData={initialData} />
      <ChatBoot></ChatBoot>
    </div>
  );
}

export default Hero;
