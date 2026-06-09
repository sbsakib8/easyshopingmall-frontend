"use client"
import { addToCartApi, getCartApi } from "@/src/hook/useCart";
import { getProductDetailsApi } from "@/src/hook/useProductDetails";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { dsCartAdd } from "@/src/redux/dropshippingCartSlice";
import { cn } from "@/src/utlis/utils";



const AddtoCartBtn = ({ className, children, productId }) => {
const [isClicked, setisClicked] = useState(false)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

const handleAddToCart = async (productId, e, user, dispatch) => {
  setisClicked(true)
  e.preventDefault();
 setTimeout(() => {
   setisClicked(false)
 }, 1000);
  const product = await getProductDetailsApi(productId);

  if (!product) {
    toast.error("প্রোডাক্টের তথ্য পাওয়া যায়নি");
    setisClicked(false);
    return;
  }

  if (!user?._id) {
    toast.error("কার্টে যোগ করতে হলে আগে লগইন করুন");
    setisClicked(false);
    return;
  }

  try {
    if (user?.role === "DROPSHIPPING" || user?.roles?.includes("DROPSHIPPING")) {
      // Dropshipping Cart (Local)
      const dsCost = product.dropshippingPrice ?? product.price ?? product.sell_price ?? 0;
      dispatch(dsCartAdd({
        productId: {
          _id: product._id || product.id,
          productName: product.productName,
          images: product.images || [],
        },
        quantity: 1,
        price: dsCost,
        sellingPrice: dsCost,
      }));

      toast.success(`${product.productName} sourcing কার্টে যোগ করা হয়েছে`);
    } else {
      // Normal Cart (API)
      await addToCartApi(
        {
          userId: user._id,
          productId: product._id || product.id,
          quantity: 1,
          price: product.price || product.sell_price || 0,
        },
        dispatch,
      );

      toast.success(`${product.productName} সফলভাবে কার্টে যোগ করা হয়েছে`);
      await getCartApi(user._id, dispatch);
    }
  } catch (err) {

    console.error("Add to cart error:", err);
    const msg = err?.response?.data?.message || "কার্টে যোগ করতে ব্যর্থ হয়েছে";
    toast.error(msg);
    setisClicked(false)
  }
};
  return (
    <div
    disabled={isClicked}
      onClick={(e) => handleAddToCart(productId, e, user, dispatch)}
      className={cn("text-primary-content cursor-pointer", className)}
    >
      {children}
    </div>
  );
};

export default AddtoCartBtn;
