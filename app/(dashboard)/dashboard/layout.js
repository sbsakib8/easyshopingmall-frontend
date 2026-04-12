import DashboardNebver from"@/src/dashboard/navber/nabverComponent";
import AuthAdminRole from"@/src/utlis/userAdmin";

export const metadata = {
 title:"Dashboard - EasyShoppingMall",
 description:"Your one-stop online shop for everything you need.",
};

export default function DashboardLayout({children}) {
 return (
 <AuthAdminRole>
 <DashboardNebver>
 {children} 
 </DashboardNebver>
 </AuthAdminRole>
 )
}