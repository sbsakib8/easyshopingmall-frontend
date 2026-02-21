"use client"
import { addToCartApi, getCartApi } from "@/src/hook/useCart";
import { getProductDetailsApi } from "@/src/hook/useProductDetails";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";



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

  if (product.color.length) {
    toast.error("দয়া করে প্রোডাক্টের রং নির্বাচন করুন");
    return;
  }

  if (product.productSize.length) {
    toast.error("দয়া করে প্রোডাক্টের সাইজ নির্বাচন করুন");
    return;
  }

  if (!user?._id) {
    toast.error("কার্টে যোগ করতে হলে আগে লগইন করুন");
    return;
  }

  try {
    await addToCartApi(
      {
        userId: user._id,
        productId: product._id,
        quantity: 1,
        price: product.price,
      },
      dispatch,
    );

    toast.success(`${product.productName} সফলভাবে কার্টে যোগ করা হয়েছে`);

    // কার্ট রিফ্রেশ
    await getCartApi(user._id, dispatch);
    

  } catch (err) {
    console.error("Add to cart error:", err);
    const msg = err?.response?.data?.message || "কার্টে যোগ করতে ব্যর্থ হয়েছে";
    toast.error(msg);
    setisClicked(false)
  }
};
  return (
    <button
    disabled={isClicked}
      onClick={(e) => handleAddToCart(productId, e, user, dispatch)}
      className={`text-accent-content cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default AddtoCartBtn;