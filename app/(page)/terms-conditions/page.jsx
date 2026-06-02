import {
    FileText,
    Info,
    UserPlus,
    ShoppingCart,
    CreditCard,
    Ticket,
    Truck,
    RotateCcw,
    TrendingUp,
    Ban,
    Copyright,
    ShieldAlert,
    UserMinus,
    RefreshCw,
    Mail,
    Phone,
    Calendar,
    CheckCircle
} from "lucide-react";
import { UrlBackend } from "@/src/confic/urlExport";

export const metadata = {
    title: "Terms & Conditions - EasyShoppingMallBD",
    description: "Read the Terms & Conditions of EasyShoppingMallBD to understand the rules and guidelines for using our platform.",
};

const TermsConditions = async () => {
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
            icon: Info,
            title: "১. সাধারণ শর্তাবলী",
            content: [
                "EasyShoppingMallBD একটি ই-কমার্স ও অনলাইন আর্নিং প্ল্যাটফর্ম",
                "এই সাইট ব্যবহার করলে আপনি আমাদের নিয়ম মেনে চলতে সম্মত হচ্ছেন",
                "আমরা যেকোনো সময় শর্তাবলী পরিবর্তন করার অধিকার রাখি"
            ]
        },
        {
            id: 2,
            icon: UserPlus,
            title: "২. অ্যাকাউন্ট রেজিস্ট্রেশন",
            content: [
                "সঠিক ও আপডেট তথ্য দিয়ে অ্যাকাউন্ট তৈরি করতে হবে",
                "ভুয়া তথ্য দিলে অ্যাকাউন্ট সাসপেন্ড করা হতে পারে",
                "আপনার অ্যাকাউন্টের নিরাপত্তা আপনার নিজের দায়িত্ব"
            ]
        },
        {
            id: 3,
            icon: ShoppingCart,
            title: "৩. পণ্য ক্রয় ও অর্ডার",
            content: [
                "সকল অর্ডার স্টক ও অ্যাভেইলেবিলিটির উপর নির্ভরশীল",
                "আমরা প্রয়োজন অনুযায়ী অর্ডার বাতিল করতে পারি",
                "পণ্যের ছবি ও বর্ণনা বাস্তবের সাথে সামান্য ভিন্ন হতে পারে"
            ]
        },
        {
            id: 4,
            icon: CreditCard,
            title: "৪. পেমেন্ট শর্তাবলী",
            description: "আমাদের ওয়েবসাইটে ২ ধরনের পেমেন্ট সিস্টেম রয়েছে:",
            subsections: [
                {
                    subtitle: "🔹 Manual Payment",
                    items: [
                        "বিকাশ / নগদ / ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট",
                        "ভুল তথ্য দিলে অর্ডার বাতিল হতে পারে"
                    ]
                },
                {
                    subtitle: "🔹 SSLCommerz Payment Gateway",
                    items: [
                        "আমরা নিরাপদ পেমেন্টের জন্য SSLCommerz ব্যবহার করি",
                        "সব অনলাইন পেমেন্ট SSLCommerz দ্বারা প্রসেস হয়",
                        "আমরা কোনো কার্ড তথ্য সংরক্ষণ করি না"
                    ]
                }
            ]
        },
        {
            id: 5,
            icon: Ticket,
            title: "৫. কুপন ও রেফার সিস্টেম",
            content: [
                "কুপন কোড নির্দিষ্ট শর্ত অনুযায়ী কাজ করবে",
                "রেফার কোড ব্যবহার করে কমিশন পাওয়া যাবে",
                "প্রতারণা বা অপব্যবহার করলে অ্যাকাউন্ট বন্ধ করা হতে পারে"
            ]
        },
        {
            id: 6,
            icon: Truck,
            title: "৬. ডেলিভারি ও শিপিং",
            content: [
                "ডেলিভারি সময় লোকেশন অনুযায়ী পরিবর্তিত হতে পারে",
                "কুরিয়ার সমস্যার জন্য কিছু বিলম্ব হতে পারে",
                "ভুল ঠিকানা দিলে ডেলিভারি ব্যর্থ হতে পারে"
            ]
        },
        {
            id: 7,
            icon: RotateCcw,
            title: "৭. রিফান্ড ও রিটার্ন",
            content: [
                "নির্দিষ্ট শর্তে পণ্য রিটার্ন বা রিফান্ড দেওয়া হবে",
                "ব্যবহৃত বা ক্ষতিগ্রস্ত পণ্য রিটার্নযোগ্য নয়",
                "রিফান্ড প্রসেস হতে কিছু সময় লাগতে পারে"
            ]
        },
        {
            id: 8,
            icon: TrendingUp,
            title: "৮. অনলাইন আর্নিং সিস্টেম",
            description: "EasyShoppingMallBD-এ আপনি নিচের উপায়ে আয় করতে পারেন:",
            content: [
                "পণ্য বিক্রি (Seller Program)",
                "ড্রপশিপিং",
                "অ্যাফিলিয়েট মার্কেটিং",
                "ইনভেস্টমেন্ট পার্টনারশিপ"
            ],
            footer: "⚠️ ও গুরুত্বপূ্র্ণ: আপনার আয় সম্পূর্ণ আপনার কাজ ও পারফরম্যান্সের উপর নির্ভরশীল। আমরা কোনো নির্দিষ্ট আয় গ্যারান্টি দেই না।"
        },
        {
            id: 9,
            icon: Ban,
            title: "৯. নিষিদ্ধ কার্যকলাপ",
            description: "নিচের কাজগুলো সম্পূর্ণ নিষিদ্ধ:",
            content: [
                "ভুয়া অর্ডার করা",
                "সিস্টেম হ্যাক/বাগ এক্সপ্লয়েট করা",
                "ফেক রেফার তৈরি করা",
                "অন্য ইউজারকে প্রতারণা করা"
            ],
            footer: "এসব করলে আপনার অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করা হতে পারে"
        },
        {
            id: 10,
            icon: Copyright,
            title: "১০. মেধাস্বত্ব (Intellectual Property)",
            content: [
                "এই ওয়েবসাইটের সকল কন্টেন্ট (লোগো, ডিজাইন, টেক্সট) EasyShoppingMallBD-এর সম্পত্তি",
                "অনুমতি ছাড়া ব্যবহার করা যাবে না"
            ]
        },
        {
            id: 11,
            icon: ShieldAlert,
            title: "১১. দায়বদ্ধতা সীমাবদ্ধতা",
            content: [
                "আমরা সরাসরি বা পরোক্ষ কোনো ক্ষতির জন্য দায়ী নই",
                "সারভার ডাউন, পেমেন্ট সমস্যা বা টেকনিক্যাল ইস্যু হলে আমরা দায় নেব না"
            ]
        },
        {
            id: 12,
            icon: UserMinus,
            title: "১২. অ্যাকাউন্ট সাসপেনশন",
            description: "আমরা যেকোনো সময়—",
            content: [
                "আপনার অ্যাকাউন্ট সাসপেন্ড/ব্যান করতে পারি",
                "যদি আপনি নিয়ম ভঙ্গ করেন"
            ]
        },
        {
            id: 13,
            icon: RefreshCw,
            title: "১৩. নীতিমালা পরিবর্তন",
            content: [
                "আমরা যেকোনো সময় এই Terms আপডেট করতে পারি",
                "আপডেট হলে এই পেজে প্রকাশ করা হবে"
            ]
        },
        {
            id: 14,
            icon: Mail,
            title: "১৪. যোগাযোগ",
            description: "যদি কোনো প্রশ্ন থাকে, যোগাযোগ করুন:",
            contacts: [
                { type: "Email", icon: Mail, value: siteInfo?.email || "support@easyshoppingmallbd.com" },
                { type: "Phone", icon: Phone, value: siteInfo?.number || "শীঘ্রই আসছে" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg text-accent">
            <div className="bg-gradient-to-b from-primary/10 to-transparent py-16 sm:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-6">
                        <FileText className="w-10 h-10 text-secondary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                        Terms & Conditions
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
                        <p className="text-lg text-gray-700 leading-relaxed text-center font-medium">
                            EasyShoppingMallBD-এ আপনাকে স্বাগতম। এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মতি দিচ্ছেন। তাই অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন।
                        </p>
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
                                    <p className="text-gray-600 mb-6 font-medium text-lg">
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
                                                        <li key={i} className="flex items-start gap-3 text-gray-600">
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
                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all flex-1 min-w-0">
                                                <div className="text-secondary shrink-0">
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
                                    <div className={`mt-8 p-4 rounded-xl border font-medium ${section.title.includes("নিষিদ্ধ") ? "bg-red-50 border-red-100 text-red-700" : "bg-primary/5 border-primary/10 text-primary"}`}>
                                        {section.footer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center px-4">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 mb-6">
                            <div className="bg-white px-8 sm:px-12 py-6 rounded-full shadow-lg">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-accent mb-2 flex items-center justify-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-secondary" />
                                    শেষ কথা
                                </h2>
                                <p className="text-gray-600 font-bold text-lg">
                                    EasyShoppingMallBD ব্যবহার করার মাধ্যমে আপনি এই Terms & Conditions-এ সম্মতি দিচ্ছেন।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
