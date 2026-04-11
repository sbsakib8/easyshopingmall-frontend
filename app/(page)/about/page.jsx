import AboutPage from "@/src/compronent/about/about"

// Enable ISR with 24-hour revalidation
export const revalidate = 86400; 

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