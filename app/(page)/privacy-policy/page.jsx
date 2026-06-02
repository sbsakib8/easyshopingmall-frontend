import {
    ShieldCheck,
    Database,
    UserCheck,
    CreditCard,
    Ticket,
    Lock,
    Share2,
    Cookie,
    Fingerprint,
    TrendingUp,
    RefreshCw,
    Mail,
    Phone,
    Info,
    Calendar
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";

export const metadata = {
    title: "Privacy Policy - EasyShoppingMallBD",
    description: "Read the Privacy Policy of EasyShoppingMallBD to understand how we collect, use, and protect your personal information.",
};

const PrivacyPolicy = async () => {
    let siteInfo = null;
    try {
        const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const result = await res.json();
        siteInfo = result?.data?.[0] ?? null;
    } catch (error) {
        console.error("Error fetching website info:", error);
    }

    const lastUpdated = "১১ এপ্রিল ২০২৬";

    const sections = [
        {
            id: 1,
            icon: Database,
            title: "১. আমরা কী ধরনের তথ্য সংগ্রহ করি",
            content: [
                "ব্যক্তিগত তথ্য (নাম, মোবাইল নাম্বার, ইমেইল)",
                "ঠিকানা (ডেলিভারির জন্য)",
                "পেমেন্ট সংক্রান্ত তথ্য (Manual Payment / SSLCommerz)",
                "ব্রাউজিং তথ্য (IP Address, Device Info)",
                "কুপন কোড ও রেফার কোড ব্যবহারের তথ্য"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            icon: UserCheck,
            title: "২. তথ্য কীভাবে ব্যবহার করা হয়",
            content: [
                "আপনার অর্ডার প্রসেস করতে",
                "পেমেন্ট যাচাই করতে",
                "ডেলিভারি সম্পন্ন করতে",
                "কাস্টমার সাপোর্ট দিতে",
                "রেফার/কুপন সিস্টেম পরিচালনা করতে",
                "সাইটের নিরাপত্তা ও উন্নতির জন্য"
            ],
            color: "from-emerald-500 to-teal-500"
        },
        {
            id: 3,
            icon: CreditCard,
            title: "৩. পেমেন্ট সিস্টেম",
            description: "আমাদের ওয়েবসাইটে দুই ধরনের পেমেন্ট সিস্টেম রয়েছে:",
            subsections: [
                {
                    subtitle: "🔹 Manual Payment",
                    items: [
                        "আপনি বিকাশ/নগদ/ব্যাংকের মাধ্যমে পেমেন্ট করতে পারেন",
                        "এই ক্ষেত্রে আপনার দেওয়া তথ্য যাচাই করা হতে পারে"
                    ]
                },
                {
                    subtitle: "🔹 SSLCommerz Payment Gateway",
                    items: [
                        "আমরা নিরাপদ পেমেন্টের জন্য SSLCommerz ব্যবহার করি",
                        "আপনার কার্ড বা মোবাইল ব্যাংকিং তথ্য সরাসরি SSLCommerz দ্বারা প্রসেস হয়",
                        "আমরা কোনো সংবেদনশীল কার্ড তথ্য সংরক্ষণ করি না"
                    ]
                }
            ],
            color: "from-indigo-500 to-purple-500"
        },
        {
            id: 4,
            icon: Ticket,
            title: "৪. কুপন ও রেফার সিস্টেম",
            description: "EasyShoppingMallBD-এ কুপন ও রেফার প্রোগ্রাম রয়েছে:",
            content: [
                "কুপন কোড ব্যবহার করলে ডিসকাউন্ট পাওয়া যায়",
                "রেফার কোডের মাধ্যমে নতুন ইউজার আনলে কমিশন পাওয়া যায়",
                "এই সিস্টেম ব্যবহারের সময় আপনার কার্যকলাপ ট্র্যাক করা হতে পারে"
            ],
            color: "from-pink-500 to-rose-500"
        },
        {
            id: 5,
            icon: Lock,
            title: "৫. আপনার তথ্য আমরা কীভাবে সুরক্ষিত রাখি",
            description: "আমরা আপনার তথ্য সুরক্ষার জন্য—",
            content: [
                "সিকিউর সার্ভার ব্যবহার করি",
                "ডাটা এনক্রিপশন প্রয়োগ করি",
                "অননুমোদিত অ্যাক্সেস প্রতিরোধ করি"
            ],
            color: "from-amber-500 to-orange-500"
        },
        {
            id: 6,
            icon: Share2,
            title: "৬. তৃতীয় পক্ষের সাথে তথ্য শেয়ার",
            description: "আমরা আপনার তথ্য বিক্রি করি না। তবে নিচের ক্ষেত্রে শেয়ার করা হতে পারে—",
            content: [
                "পেমেন্ট প্রসেসর (SSLCommerz)",
                "ডেলিভারি সার্ভিস",
                "আইনগত প্রয়োজনে (যদি প্রয়োজন হয়)"
            ],
            color: "from-blue-600 to-indigo-600"
        },
        {
            id: 7,
            icon: Cookie,
            title: "৭. কুকিজ (Cookies)",
            description: "আমাদের ওয়েবসাইট কুকিজ ব্যবহার করতে পারে:",
            content: [
                "ইউজার এক্সপেরিয়েন্স উন্নত করতে",
                "লগইন তথ্য মনে রাখতে",
                "সাইটের পারফরম্যান্স বিশ্লেষণ করতে"
            ],
            color: "from-yellow-400 to-amber-500"
        },
        {
            id: 8,
            icon: Fingerprint,
            title: "৮. আপনার অধিকার",
            description: "আপনি চাইলে—",
            content: [
                "আপনার তথ্য দেখতে পারবেন",
                "ভুল তথ্য সংশোধন করতে পারবেন",
                "আপনার অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারবেন"
            ],
            color: "from-teal-400 to-emerald-500"
        },
        {
            id: 9,
            icon: TrendingUp,
            title: "৯. অনলাইন আয়ের সুযোগ সংক্রান্ত তথ্য",
            description: "EasyShoppingMallBD একটি প্ল্যাটফর্ম যেখানে আপনি—",
            content: [
                "পণ্য বিক্রি করতে পারেন",
                "ড্রপশিপিং করতে পারেন",
                "অ্যাফিলিয়েট মার্কেটিং করতে পারেন",
                "ইনভেস্টমেন্ট পার্টনার হতে পারেন"
            ],
            footer: "⚠️ দ্রষ্টব্য: আপনার আয় নির্ভর করবে আপনার কাজ, দক্ষতা ও পারফরম্যান্সের উপর। আমরা নির্দিষ্ট আয় গ্যারান্টি দেই না।",
            color: "from-violet-500 to-fuchsia-500"
        },
        {
            id: 10,
            icon: RefreshCw,
            title: "১০. নীতিমালা পরিবর্তন",
            content: [
                "আমরা যেকোনো সময় এই Privacy Policy আপডেট করতে পারি। আপডেট হলে এই পেজে জানানো হবে।"
            ],
            color: "from-gray-500 to-slate-600"
        },
        {
            id: 11,
            icon: Mail,
            title: "১১. যোগাযোগ",
            description: "যদি কোনো প্রশ্ন থাকে, আমাদের সাথে যোগাযোগ করুন:",
            contacts: [
                { type: "Email", icon: Mail, value: siteInfo?.email || "support@easyshoppingmallbd.com" },
                { type: "Phone", icon: Phone, value: siteInfo?.number || "শীঘ্রই আসছে" }
            ],
            color: "from-cyan-500 to-blue-500"
        }
    ];

    return (
        <div className="min-h-screen bg-bg">
            <div className="bg-gradient-to-b from-primary/10 to-transparent py-16 sm:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-6">
                        <ShieldCheck className="w-10 h-10 text-secondary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent mb-6">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>শেষ আপডেট: {lastUpdated}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 mb-12 border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-secondary shrink-0">
                                <Info className="w-6 h-6" />
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                EasyShoppingMallBD-এ আপনাকে স্বাগতম। আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।
                                এই Privacy Policy-তে আমরা ব্যাখ্যা করছি কীভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
                            </p>
                        </div>
                    </div>

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

                                {section.description && (
                                    <p className="text-gray-600 mb-6 font-medium text-lg leading-relaxed">
                                        {section.description}
                                    </p>
                                )}

                                {section.content && (
                                    <ul className="space-y-4">
                                        {section.content.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4 text-gray-700">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                                <span className="text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {section.subsections && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        {section.subsections.map((sub, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h3 className="text-xl font-bold text-accent mb-4">{sub.subtitle}</h3>
                                                <ul className="space-y-3">
                                                    {sub.items.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-base">
                                                            <div className="mt-2 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.contacts && (
                                    <div className="flex flex-col lg:flex-row gap-4 mt-6">
                                        {section.contacts.map((contact, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md min-w-0 flex-1">
                                                <div className="shrink-0 text-secondary">
                                                    <contact.icon className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{contact.type}</p>
                                                    <p className="text-accent font-semibold truncate text-sm sm:text-base">{contact.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.footer && (
                                    <div className="mt-8 p-4 bg-rose-50 rounded-xl border border-rose-100 italic text-rose-700 font-medium whitespace-pre-wrap">
                                        {section.footer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center px-4">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 mb-6">
                            <div className="bg-white px-6 sm:px-10 py-5 rounded-full shadow-sm">
                                <p className="text-accent font-bold text-base sm:text-lg">
                                    EasyShoppingMallBD ব্যবহার করার মাধ্যমে আপনি এই Privacy Policy-তে সম্মতি দিচ্ছেন।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
