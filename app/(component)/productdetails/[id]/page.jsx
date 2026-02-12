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

    return {
      title,
      description,
      openGraph: {
        title,
        description,
         images: [
      {
        url: image, 
        width: 800,
        height: 600,
        alt: "product image",
      },
    ],
        type: 'article',
      },
      keywords:[...product.tags,product.category[0].name,product.subCategory[0].name],
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
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