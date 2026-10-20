import AboutPage from "@/src/compronent/about/about"

export const revalidate = 86400;
export const metadata = {
  title: "আমাদের সম্পর্কে - EasyShoppingMall",
  description: "EasyShoppingMall সম্পর্কে বিস্তারিত জানুন, আমাদের মূল্যবোধ, লক্ষ্য এবং বাংলাদেশের সেরা অনলাইন শপিং সেবা সম্পর্কে।",
};

const about = () => {
  return (
    <>
      <AboutPage />
    </>
  )
}

export default about
