import BlogPage from "@/src/compronent/blog/blog"
import { BlogAllGet } from "@/src/hook/content/userBlogs";
import { CategoryAllGet } from "@/src/hook/usecategory";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Blog - Expert Tips & Shopping Guides",
  description: "Read our latest blog posts for expert shopping tips, trend alerts, and product guides from EasyShoppingMallBD.",
  openGraph: {
    title: "EasyShoppingMallBD Blog - Tips & Guides",
    description: "Stay updated with the latest shopping trends and expert advice from our blog.",
    type: "website",
  },
};

async function getBlogData() {
  try {
    const [blogsResponse, categoriesResponse] = await Promise.all([
      BlogAllGet(),
      CategoryAllGet()
    ]);

    return {
      blogs: blogsResponse?.data || [],
      categories: categoriesResponse?.data || []
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { blogs: [], categories: [] };
  }
}

const blog = async () => {
  const initialData = await getBlogData();

  return (
    <div>
      <BlogPage initialData={initialData} />
    </div>
  )
}

export default blog