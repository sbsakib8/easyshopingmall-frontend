import { IoLocationOutline } from "react-icons/io5";
import { MdAddCall } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5"
import Link from "next/link";
import { IoLogoFacebook } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
function Footer() {
  return (
    <footer className='w-[98%] lg:w-[95%] mx-auto my-6'>
        {/* main div */}
        <div className='flex flex-wrap justify-between items-center gap-4 lg:gap-0 py-4 px-2 lg:px-0'>

            <div className='w-[400px] h-auto'>
                <h3 className="text-[22px] font-bold text-black">EasyShoppingMall</h3>
                <p className=" text-[17px] mt-2 text-gray-500">Awesome grocery store website template</p>

                <div className=" mt-5">

                    <div className='flex items-center gap-2 my-3'>
                        <IoLocationOutline className=" text-[20px] text-primary-color font-medium"/>
                        <p className=" text-[16px] text-gray-500">Address: Dhaka, Gazipur,Joydebpur,1700 </p>
                    </div>
                    <div className='flex items-center gap-2 my-3'>
                        <MdAddCall  className=" text-[20px] text-primary-color font-medium"/>
                        <p className=" text-[16px] text-gray-500"> Call Us: +91 - 540-025-124553</p>
                    </div>
                    <div className='flex items-center gap-2 my-3'>
                        <MdEmail  className=" text-[20px] text-primary-color font-medium"/>
                        <p className=" text-[16px] text-gray-500"> Email: sale@Nest.com</p>
                    </div>
                    <div className='flex items-center gap-2 my-3'>
                        <IoTimeOutline  className=" text-[20px] text-primary-color font-medium"/>
                        <p className=" text-[16px] text-gray-500">Hours: 10:00 - 18:00, Mon - Sat</p>
                    </div>
                </div>
            </div>

            <div className='w-[200px] h-auto mt-3 '>
                <h3 className=" text-[20px] text-black font-bold">Company</h3>
                <div>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>About</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'Delivery'}>Delivery Information</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Privacy Policy</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Terms & Conditions</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Contact Us</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Support Center
</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Careers</Link></p>
                </div>
            </div>

            <div className='w-[200px] h-auto mt-3 '>
                <h3 className=" text-[20px] text-black font-bold">Corporate</h3>
                <div>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>About</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'Delivery'}>Delivery Information</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Privacy Policy</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Terms & Conditions</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Contact Us</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Support Center
</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Careers</Link></p>
                </div>
            </div>

            <div className='w-[200px] h-auto mt-3 '>
                <h3 className=" text-[20px] text-black font-bold">Popular</h3>
                <div>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>About</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'Delivery'}>Delivery Information</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Privacy Policy</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Terms & Conditions</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Contact Us</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Support Center
</Link></p>
                    <p className=" text-[16px] my-3 text-gray-500 hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'about'}>Careers</Link></p>
                </div>
            </div>

        </div>
       <p className=" w-[98%] bg-black h-[1px] "></p>

       <div className=" flex flex-col md:flex-row justify-between items-center mt-3">
            <div>
                <p className=" text-center text-wrap text-gray-500 text-[16px] my-4">© 2023 EasyShoppingMall. All rights reserved.</p>
            </div>

           <div className=" flex justify-between items-center gap-4">
                <div>
                    <h3 className="text-[19px] font-medium text-black">Follow Us</h3>
                </div>
                <div>
                    <h3 className="w-10 h-10 bg-primary-color hover:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 delay-100 "><IoLogoFacebook className="text-2xl text-white"/></h3>
                </div>
                <div>
                    <h3 className="w-10 h-10 bg-primary-color hover:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 delay-100 "><FaTwitter className="text-2xl text-white"/></h3>
                </div>
                <div>
                   <h3 className="w-10 h-10 bg-primary-color hover:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 delay-100 "><FaInstagram className="text-2xl text-white"/></h3>
                </div>
                <div>
                     <h3 className="w-10 h-10 bg-primary-color hover:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 delay-100 "><FaYoutube className="text-2xl text-white"/></h3>
                </div>
           </div>
       </div>
    </footer>
  )
}

export default Footer