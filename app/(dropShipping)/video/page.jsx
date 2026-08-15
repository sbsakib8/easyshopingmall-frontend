import VideoClient from "./VideoClient";

export const metadata = {
  title: "Dropshipping Training Videos",
  description: "Watch training videos to learn dropshipping strategies, marketing tips, and business growth techniques on EasyShoppingMallBD.",
  keywords: ["dropshipping training", "video tutorials", "marketing videos", "easy shopping mall training"],
  openGraph: {
    title: "Dropshipping Training Videos - EasyShoppingMallBD",
    description: "Watch training videos to learn dropshipping strategies and marketing tips.",
    url: "https://easyshoppingmallbd.com/video",
    siteName: "EasyShoppingMallBD",
    type: "website",
  },
  alternates: { canonical: "/video" },
  robots: { index: false, follow: true },
};

const VideoPage = () => {
  return <VideoClient />;
};

export default VideoPage;
