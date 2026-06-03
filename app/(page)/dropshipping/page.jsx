import { BookOpen, Box, Calendar, DollarSign, ShieldCheck, ShoppingBag, Target, Users, Wallet } from "lucide-react";

export const metadata = {
    title: "Dropshipping - EasyShoppingMallBD",
    description: "Discover dropshipping opportunities and passive income with EasyShoppingMallBD.",
};

const DropshippingPage = () => {
    const lastUpdated = "৩ জুন ২০২৬";

    const sections = [
        {
            id: 1,
            icon: Box,
            title: "একই প্ল্যাটফর্মে Dropshipping",
            content: [
                "Easy Shopping Mall-এ আপনি শুধু পণ্য কিনতে বা বিক্রি করতে পারবেন না, বরং Dropshipping করে আয়ও করতে পারবেন।",
                "ড্রপশিপিং ব্যবসায় আপনাকে আগে পণ্য স্টক করে রাখতে হয় না।",
                "আপনি অর্ডার সংগ্রহ করবেন, আর আমরা সরবরাহ ও ডেলিভারি পরিচালনা করব।"
            ]
        },
        {
            id: 2,
            icon: ShoppingBag,
            title: "Buy & Sell Products",
            content: [
                "যেকোনো ব্যক্তি আমাদের প্ল্যাটফর্ম থেকে পণ্য কিনতে এবং বিক্রি করতে পারবেন।",
                "Seller হিসেবে আপনি নিজের পণ্য বিক্রি, Dropshipping করতে এবং প্রতিটি বিক্রয়ে লাভ করতে পারবেন।",
                "ব্যবসা শুরু করতে বড় বিনিয়োগের প্রয়োজন নেই।"
            ]
        },
        {
            id: 3,
            icon: Users,
            title: "Automatic Referral Income System",
            content: [
                "Dropshipper হিসেবে রেজিস্টার করলে আপনার জন্য একটি Unique Referral Code তৈরি হবে।",
                "Referral Code বন্ধু, পরিবার বা পরিচিতদের সাথে শেয়ার করুন।",
                "যারা আপনার কোড ব্যবহার করে অ্যাকাউন্ট খুলবে, তারা আপনার Referral Team-এ যুক্ত হবে।"
            ]
        },
        {
            id: 4,
            icon: DollarSign,
            title: "Product Referral Commission",
            content: [
                "Referral Team-এর সদস্যরা যখন পণ্য ক্রয় বা বিক্রয় করবে, আপনি কমিশন পাবেন।",
                "উদাহরণ: ১০০ জন Referral সদস্য থেকে দৈনিক ১০০ Transaction হলে আয় হতে পারে ১,০০০ টাকা।",
                "এটি আপনার Team-এর কার্যকলাপের উপর ভিত্তি করে স্বয়ংক্রিয়ভাবে চলবে।"
            ]
        },
        {
            id: 5,
            icon: BookOpen,
            title: "Course Referral Commission",
            content: [
                "আপনার Referral Team যদি Training Course ক্রয় করে, আপনি প্রতিটি Course Sale থেকে কমিশন পাবেন।",
                "উদাহরণ: ৫০ জন Course Purchase করলে আয় হতে পারে ১০,০০০ টাকা।"
            ]
        },
        {
            id: 6,
            icon: Target,
            title: "Build a Team, Build Passive Income",
            content: [
                "এই সিস্টেমে আপনি একা কাজ না করে একটি Team তৈরি করতে পারবেন।",
                "Team যত বড় ও সক্রিয় হবে, আপনার সম্ভাব্য আয় তত বাড়বে।",
                "আপনি কাজ করলেও আয় করবেন, আর Team কাজ করলেও আয় চালু থাকবে।"
            ]
        },
        {
            id: 7,
            icon: Wallet,
            title: "Smart Wallet System",
            content: [
                "আপনার সকল কমিশন স্বয়ংক্রিয়ভাবে Wallet Balance-এ যোগ হবে।",
                "Dashboard-এ আপনি দেখতে পারবেন আয়, Withdraw History ও Transaction History।",
                "সবকিছু Real-Time Tracking করা যাবে।"
            ]
        },
        {
            id: 8,
            icon: ShoppingBag,
            title: "Product Selling Profit",
            content: [
                "Referral Income ছাড়াও আপনি নিজে Product Sell করে লাভ করতে পারবেন।",
                "প্রতিটি Product Sale থেকে ১০০ টাকা থেকে ৩০০+ টাকা পর্যন্ত Profit করার সুযোগ থাকবে।",
                "একই প্ল্যাটফর্মে নিজস্ব বিক্রয় এবং Team কমিশন উভয়ই আয় করতে পারবেন।"
            ]
        },
        {
            id: 9,
            icon: BookOpen,
            title: "Training & Support",
            content: [
                "নতুন হলে আমাদের Training Course থেকে ড্রপশিপিং শিখতে পারবেন।",
                "Course-এ পাচ্ছেন Facebook Marketing, Page Setup, Ads, Video Marketing, Canva Design, Team Building ও আরও অনেক কিছু।",
                "Support Team সবসময় আপনাকে সহায়তা করবে।"
            ]
        },
        {
            id: 10,
            icon: ShieldCheck,
            title: "Our Goal",
            content: [
                "আমাদের লক্ষ্য একটি প্ল্যাটফর্ম তৈরি করা যেখানে সাধারণ মানুষ কম খরচে Online Business শুরু করতে পারে।",
                "নিজের আয় তৈরি করতে পারে এবং ধীরে ধীরে একটি শক্তিশালী ব্যবসায়িক Team গড়ে তুলতে পারে।",
                "আজই Easy Shopping Mall-এ যোগ দিন এবং আপনার Online Income Journey শুরু করুন।"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg">
            <div className="bg-gradient-to-b from-primary/10 to-transparent py-16 sm:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-6">
                        <Box className="w-10 h-10 text-secondary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent mb-6">
                        Dropshipping Opportunity
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-gray-600 leading-relaxed">
                        Easy Shopping Mall-এ আপনি Dropshipping, Referral Commission এবং Product Selling এর মাধ্যমে একটি শক্তিশালী আয়ের স্ট্রিম তৈরি করতে পারবেন।
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-500 font-medium mt-6">
                        <Calendar className="w-4 h-4" />
                        <span>শেষ আপডেট: {lastUpdated}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 gap-8">
                        {sections.map((section) => (
                            <div key={section.id} className="group bg-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-gray-200/40 border border-transparent hover:border-secondary/20 transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg shrink-0">
                                        <section.icon className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-accent">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-4">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4 text-gray-700">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                            <span className="text-lg leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center px-4">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 mb-6">
                            <div className="bg-white px-6 sm:px-10 py-5 rounded-full shadow-sm">
                                <p className="text-accent font-bold text-base sm:text-lg">
                                    Dropshipping এবং Referral Income দিয়ে আপনার Online Business Journey শুরু করুন।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropshippingPage;
