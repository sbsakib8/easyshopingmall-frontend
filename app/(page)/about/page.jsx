import AboutPage from "@/src/compronent/about/about"

// Enable ISR with 1-hour revalidation
export const revalidate = 3600; 

export const metadata = {
  title: "About Us - Our Story & Mission",
  description: "Learn more about EasyShoppingMallBD, our values, and our commitment to bringing the best online shopping experience to Bangladesh.",
};

const about = () => {
  return (
    <div>
      <AboutPage />
    </div>
  )
}

export default about