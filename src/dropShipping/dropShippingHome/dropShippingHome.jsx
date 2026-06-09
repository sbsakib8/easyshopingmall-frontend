import ChatBoot from "@/src/compronent/Home/ChatBoot";
import Carousels from "@/src/helper/Hero/Carousel";
import Overview from "./overview/Overview";

const DropShippingHome = ({ initialData }) => {
  return (
    <>
      <Carousels initialData={initialData?.banners} />
      <ChatBoot></ChatBoot>
      <Overview />
    </>
  );
};

export default DropShippingHome;
