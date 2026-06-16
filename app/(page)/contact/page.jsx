import ContactPage from "@/src/compronent/contact/contact"
import { UrlBackend } from "@/src/confic/urlExport";

export const revalidate = 86400;
async function getWebsiteInfo() {
  try {
    const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
      next: { revalidate: 86400 }
    });
    const data = await res.json();
    return data?.data?.[0] ?? null;
  } catch {
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
    <>
      <ContactPage initialSiteInfo={siteInfo} />
    </>
  )
}

export default contact
