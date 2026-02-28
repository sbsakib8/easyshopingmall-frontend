
export const metadata = {
    title: "Privacy Policy",
    description: "Read the Privacy Policy of EasyShoppingMallBD to understand how we collect, use, and protect your personal information.",
};

const PrivacyPolicy = () => {
    return (
        <div className="bg-bg">
            <div className="max-w-4xl mx-auto px-4 py-16 text-accent">
            <h1 className="text-4xl font-bold mb-8 text-accent">Privacy Policy</h1>
            <p className="mb-6">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">1. Introduction</h2>
                <p>
                    Welcome to EasyShoppingMallBD. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">2. Information We Collect</h2>
                <p className="mb-4">
                    We collect personal information that you voluntarily provide to us when registering at the Website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Website or otherwise contacting us.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Name and Contact Data (email address, phone number, and other similar contact data).</li>
                    <li>Credentials (passwords, password hints, and similar security information used for authentication and account access).</li>
                    <li>Payment Data (data necessary to process your payment if you make purchases).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">3. How We Use Your Information</h2>
                <p className="mb-4">
                    We use personal information collected via our Website for a variety of business purposes described below:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send you marketing and promotional communications.</li>
                    <li>To fulfill and manage your orders.</li>
                    <li>To deliver services to the user.</li>
                    <li>To respond to user inquiries/offer support to users.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">4. Sharing Your Information</h2>
                <p>
                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">5. Data Security</h2>
                <p>
                    We aim to protect your personal information through a system of organizational and technical security measures. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">6. Your Rights</h2>
                <p>
                    In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">7. Contact Us</h2>
                <p>
                    If you have questions or comments about this policy, you may email us at support@easyshoppingmall.com.
                </p>
            </section>
        </div>
        </div>
    );
};

export default PrivacyPolicy;
