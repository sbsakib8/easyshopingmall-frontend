import ProductDetails from "@/src/compronent/productDetails/productDetails"
import { getProductDetailsApi } from "@/src/hook/useProductDetails";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;
  try {
    const product = await getProductDetailsApi(id);
    if (!product) return {};

    const title = product.productName || product.name || "Product Details";
    const description = product.description || `Buy ${title} at the best price on EasyShoppingMallBD.`;
    const image = product.images?.[0] || "/icon.png";

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    const pageUrl = `${baseUrl}/productdetails/${id}`;
    const absoluteImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: 'article',
      },
      keywords: [...(product.tags || []), product.category?.[0]?.name, product.subCategory?.[0]?.name].filter(Boolean),
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [absoluteImageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Product Details",
    };
  }
}

const productdetailsid = async (props) => {
  const params = await props.params;
  const { id } = params;
  let initialProduct = null;

  try {
    initialProduct = await getProductDetailsApi(id);
  } catch (error) {
    console.error("Error fetching product details on server:", error);
  }

  return (
    <div>
      <ProductDetails initialProduct={initialProduct} productId={id} />
    </div>
  )
}

export default productdetailsid