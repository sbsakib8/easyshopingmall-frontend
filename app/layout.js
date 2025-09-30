import { Lato, Roboto } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import { Providers } from "@/src/helper/providers";
import  { Toaster } from 'react-hot-toast';

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
  title: "EasyShoppingMall",
  description: "Your one-stop online shop for everything you need.",
};

export default function RootLayout({ children }) {
    
  return (
    <html lang="en">
      <body className={`${lato.variable} ${roboto.variable} antialiased`}>
        <Providers>
        <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
          <Toaster position="top-right"/>
      </body>
    </html>
  );
}
