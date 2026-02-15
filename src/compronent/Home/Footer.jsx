import useWebsiteInfo from "@/src/utlis/useWebsiteInfo";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { IoLocationOutline, IoLogoFacebook, IoTimeOutline } from "react-icons/io5";
import { MdAddCall, MdEmail } from "react-icons/md";
const iconMap = {
    "fa-facebook": IoLogoFacebook,
    "fa-instagram": FaInstagram,
    "fa-twitter": FaTwitter,
    "fa-youtube": FaYoutube,
};


function Footer({ initialData }) {
    const { data: siteInfoFetched, loading: siteLoading } = useWebsiteInfo();
    const siteInfo = siteInfoFetched || initialData;
    const socialLinks = siteInfo?.socialLinks || [];


    return (
        <footer className=' px-20 mx-auto bg-red-400/80'>
            {/* main div */}
            <div className='w-[98%] lg:w-[95%] flex flex-wrap justify-between items-center gap-4 lg:gap-0 py-4 px-2 lg:px-0'>

                <div className='w-[400px] h-auto'>
                    <h3 className="text-[22px] font-bold text-accent-content"> EasyShoppingMall</h3>
                    <p className=" text-[17px] mt-2 text-accent">Awesome grocery store website template</p>

                    <div className=" mt-5">

                        <div className='flex items-center gap-2 my-3'>
                            <IoLocationOutline className=" text-[20px] text-primary-color font-medium" />
                            <p className=" text-[16px] text-accent">{siteInfo?.address || ''} </p>
                        </div>
                        <div className='flex items-center gap-2 my-3'>
                            <MdAddCall className=" text-[20px] text-primary-color font-medium" />
                            <p className=" text-[16px] text-accent"> Call Us: {siteInfo?.number}</p>
                        </div>
                        <div className='flex items-center gap-2 my-3'>
                            <MdEmail className=" text-[20px] text-primary-color font-medium" />
                            <p className=" text-[16px] text-accent"> Email: {siteInfo?.email}</p>
                        </div>
                        <div className='flex items-center gap-2 my-3'>
                            <IoTimeOutline className=" text-[20px] text-primary-color font-medium" />
                            <p className=" text-[16px] text-accent">{siteInfo?.deliveryText}</p>
                        </div>
                    </div>
                </div>

                <div className='w-[200px] h-auto mt-3 '>
                    <h3 className=" text-[20px] text-accent-content font-bold">Company</h3>
                    <div>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/about'}>About</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/delivery'}>Delivery Information</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Privacy Policy</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Terms & Conditions</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/contact'}>Contact Us</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Support Center
                        </Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Careers</Link></p>
                    </div>
                </div>

                <div className='w-[200px] h-auto mt-3 '>
                    <h3 className=" text-[20px] text-accent-content font-bold">Corporate</h3>
                    <div>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/about'}>About</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/delivery'}>Delivery Information</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Privacy Policy</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Terms & Conditions</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/contact'}>Contact Us</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Support Center
                        </Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Careers</Link></p>
                    </div>
                </div>

                <div className='w-[200px] h-auto mt-3 '>
                    <h3 className=" text-[20px] text-accent-content font-bold">Popular</h3>
                    <div>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/about'}>About</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/delivery'}>Delivery Information</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Privacy Policy</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Terms & Conditions</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/contact'}>Contact Us</Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Support Center
                        </Link></p>
                        <p className=" text-[16px] my-3 text-accent hover:text-primary-color cursor-pointer hover:transition-al hover:ml-4 hover:duration-200"><Link href={'/'}>Careers</Link></p>
                    </div>
                </div>

            </div>
            <p className=" w-[98%] bg-black h-[1px] "></p>

            <div className=" flex flex-col md:flex-row justify-between items-center mt-3">
                <div>
                    <p className=" text-center text-wrap text-accent text-[16px] my-4">© 2026 EasyShoppingMall. All rights reserved.</p>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <h3 className="text-[19px] font-medium text-accent">Follow Us</h3>

                    {socialLinks
                        .filter(link => link.active)
                        .map((link, index) => {
                            const IconComponent = iconMap[link.icon];
                            if (!IconComponent) return null;

                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-primary-color hover:bg-gray-700 rounded-full 
                     flex justify-center items-center cursor-pointer 
                     transition-all duration-200 delay-100"
                                >
                                    <IconComponent className="text-2xl text-white" />
                                </a>
                            );
                        })}
                </div>

            </div>
        </footer>
    )
}

export default Footer