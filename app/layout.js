import { Providers } from "@/src/helper/providers";
import { Lato, Roboto } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import ToasterClient from "./ToasterClient";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "EasyShoppingMallBD - Best Online Shopping in Bangladesh",
    template: "%s | EasyShoppingMallBD"
  },
  description: "EasyShoppingMallBD is your premier destination for online shopping in Bangladesh. Find the best products at unbeatable prices with fast delivery.",
  keywords: ["e-commerce", "online shopping", "Bangladesh", "electronics", "fashion", "EasyShoppingMallBD"],
  authors: [{ name: "EasyShoppingMallBD Team" }],
  creator: "EasyShoppingMallBD",
  publisher: "EasyShoppingMallBD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://easyshoppingmallbd.com"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EasyShoppingMallBD - Best Online Shopping in Bangladesh",
    description: "Shop the latest electronics, fashion, and home goods at EasyShoppingMallBD. quality products, competitive prices, and fast shipping.",
    url: "https://easyshoppingmallbd.com",
    siteName: "EasyShoppingMallBD",
    images: [
      {
        url: "/icon.png", // Using the icon as a default OG image if no other is provided
        width: 800,
        height: 600,
        alt: "EasyShoppingMallBD Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyShoppingMallBD - Best Online Shopping in Bangladesh",
    description: "Your one-stop shop for everything you need. Quality products and fast delivery across Bangladesh.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${lato.variable} ${roboto.variable} antialiased`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        < ToasterClient />
      </body>
    </html>
  );
}
