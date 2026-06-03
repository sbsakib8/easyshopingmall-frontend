import AboutPage from "@/src/compronent/about/about"

// Enable ISR with 24-hour revalidation
export const dynamic = 'force-dynamic';
export const metadata = {
  title: "About Us - Our Story & Mission",
  description: "Learn more about EasyShoppingMallBD, our values, and our commitment to bringing the best online shopping experience to Bangladesh.",
};

const about = () => {
  return (
    <>
      <AboutPage />
    </>
  )
}

export default about
