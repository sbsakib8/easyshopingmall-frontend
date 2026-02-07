import ContactPage from "@/src/compronent/contact/contact"
import { UrlBackend } from "@/src/confic/urlExport";

async function getWebsiteInfo() {
  try {
    const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data?.data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to fetch website info", error);
    return null;
  }
}

export const metadata = {
  title: "Contact Us - We're Here to Help",
  description: "Get in touch with EasyShoppingMallBD for any queries, support, or feedback. We're available 24/7 to assist you with your shopping needs.",
};

const contact = async () => {
  const siteInfo = await getWebsiteInfo();
  return (
    <div>
      <ContactPage initialSiteInfo={siteInfo} />
    </div>
  )
}

export default contact