import Carousels from "@/src/helper/Hero/Carousel";
import Ads from "./Ads";
import Categories from "./Categories";
import ChatBoot from "./ChatBoot";
import PopularProducts from "./popularProducts";

function Hero({ initialData }) {
  return (
    <>
      <Carousels initialData={initialData?.banners} />
      <Categories initialData={initialData?.subcategories} />
      <Ads initialData={initialData?.ads} />
      <PopularProducts initialData={initialData} />
      <ChatBoot></ChatBoot>
    </>
  );
}

export default Hero;
