import Link from 'next/link';

export default function Forbidden() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-secondary mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">
                    দুঃখিত, এই পেজটি শুধুমাত্র ড্রপশিপিং ব্যবহারকারীদের জন্য সীমাবদ্ধ। যদি আপনি মনে করেন এটি একটি ভুল, তাহলে অনুগ্রহ করে সাপোর্টের সাথে যোগাযোগ করুন।
                </p>
                <Link
                    href="/"
                    className="bg-btn-color text-accent-content font-semibold py-2 px-6 rounded transition-colors duration-200"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
