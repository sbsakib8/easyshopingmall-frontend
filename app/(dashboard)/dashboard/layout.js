import DashboardNebver from "@/src/dashboard/navber/nabverComponent";

export const metadata = {
  title: "Dashboard - EasyShoppingMall",
  description: "Your one-stop online shop for everything you need.",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <DashboardNebver>
        {children}  
        </DashboardNebver>     
      </body>
    </html>
  )
}