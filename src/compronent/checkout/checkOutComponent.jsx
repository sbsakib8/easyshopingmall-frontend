"use client";

import { createManualPaymentOrder, createSslPaymentOrder, submitManualPayment } from "@/src/hook/useOrder";
import { applyCouponCode } from "@/src/hook/useCoupon";
import { ProductNotification, ProductUpdate } from "@/src/hook/useProduct";
import { cartClear, setCoupon, clearCoupon } from "@/src/redux/cartSlice";
import { AlertTriangle, Copy, MapPin, Shield, ShoppingBag, ShoppingCart, Star, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LocationSelects from "../LocationSelects";
import ReactPlayer from 'react-player'



import { userget } from "@/src/redux/userSlice";
import { cartSuccess } from "@/src/redux/cartSlice";

export default function CheckoutComponent({ initialUser, initialCartItems }) {
  const user = useSelector((state) => state.user?.data) || initialUser;
  const dispatch = useDispatch();
  const { items, appliedCoupon, couponDiscount } = useSelector((state) => state.cart || {});
  // Use Redux items if available (client updates), otherwise fall back to server initial items
  const cartItems = items?.length > 0 ? items : (initialCartItems || []);

  const [showGuideVideo, setShowGuideVideo] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    division: "",
    district: "",
    area: "",
    pincode: "",
  });

  // Hydrate Redux from Server Data (Optional but recommended for consistency)
  useEffect(() => {
    if (initialUser && !items?.length) {
      // Only hydrate if Redux is empty to avoid overwriting client-side changes
      // Logic can be adjusted based on needs
    }
    // We can dispatch to sync state if needed, but local state usage above handles the view.
    if (initialUser && user?._id !== initialUser._id) {
      dispatch(userget({ data: initialUser }));
    }
    if (initialCartItems?.length > 0 && items?.length === 0) {
      dispatch(cartSuccess(initialCartItems));
    }
  }, [initialUser, initialCartItems, dispatch]);

  const [selectedManualMethod, setSelectedManualMethod] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [manualOrderStep, setManualOrderStep] = useState('initial');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [manualPaymentInfo, setManualPaymentInfo] = useState({ senderNumber: "", transactionId: "" })
  const [usedTransactionIds, setUsedTransactionIds] = useState([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const isValidBDPhone = (phone) => /^01[3-9]\d{8}$/.test(phone);
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // simple email regex
  const detectDhaka = (address, city, area) => {
    const addr = [address, city, area].filter(Boolean).join(" ").toLowerCase();
    return addr.includes("dhaka") || addr.includes("ঢাকা");
  };


  // subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  // Calculate total with discount
  const [total, setTotal] = useState(subtotal + deliveryCharge);

  useEffect(() => {
    let tmpTotal = subtotal + deliveryCharge - couponDiscount;
    if (tmpTotal < 0) tmpTotal = 0;
    setTotal(tmpTotal);
  }, [subtotal, deliveryCharge, couponDiscount]);
  // console.log('cartItems', cartItems);


  useEffect(() => {
    // Auto-populate customer info from user data
    if (user) {
      const updates = {
        name: user.name || "",
        phone: user.mobile || "",
        email: user.email || "",
      };

      // If user has saved address details, populate them
      if (user.address_details && user.address_details.length > 0) {
        const savedAddress = user.address_details[0];
        updates.address = savedAddress.address_line || "";
        updates.division = savedAddress.division || "";
        updates.district = savedAddress.district || "";
        updates.area = savedAddress.upazila_thana || "";
        updates.pincode = savedAddress.pincode || "";
      }

      setCustomerInfo((prev) => ({ ...prev, ...updates }));
    }
  }, [user]);



  useEffect(() => {
    // Only allow 60 or 120
    const dhakaDistricts = [
      "Dhaka", "ঢাকা", "Dhanmondi", "Gulshan", "Mirpur", "Motijheel",
      "Uttara", "Mohammadpur", "Tejgaon", "Kamrangirchar"
    ];

    if (dhakaDistricts.includes(customerInfo.district)) {
      setDeliveryCharge(80);
    } else if (customerInfo.district) {
      setDeliveryCharge(130);
    }
  }, [customerInfo.district]);


  useEffect(() => {
    if (manualPaymentInfo.transactionId && usedTransactionIds.includes(manualPaymentInfo.transactionId)) {
      toast.error("এই ট্রানজ্যাকশন আইডি ইতিমধ্যেই ব্যবহার হয়েছে!");
    }
  }, [manualPaymentInfo.transactionId]);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const distObj = districts.find(d => d.district === district);
    setUpazilaList(distObj?.upazilas || []);
    setCustomerInfo(prev => ({ ...prev, district, area: "", division: selectedDivision }));
  };


  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Minimal subtotal requirement to apply ANY coupon? Logic handled at backend mostly
    setIsApplyingCoupon(true);
    try {
      const resp = await applyCouponCode({
        code: couponCode,
        checkoutAmount: subtotal,
        cartItems: cartItems
      });

      if (resp.success) {
        toast.success(resp.message || "Coupon applied!");
        dispatch(setCoupon({
          coupon: resp.coupon,
          discountAmount: resp.discountAmount
        }));
      } else {
        toast.error(resp.message || "Invalid or inactive coupon");
        dispatch(clearCoupon());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying coupon");
      dispatch(clearCoupon());
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    dispatch(clearCoupon());
    toast.success("Coupon removed");
  }



  // Create order helper
  const createOrder = async (override = {}) => {
    const delivery_address = {
      address_line: customerInfo.address,
      district: customerInfo.district,
      division: customerInfo.division,
      upazila_thana: customerInfo.area,
      pincode: customerInfo?.pincode || 0, // Use collected pincode
      country: "Bangladesh", // Assuming default
      mobile: customerInfo.phone ? Number(customerInfo.phone) : null,
    };

    // Determine payment_type based on selectedPayment or override
    let paymentType = "full";
    if (selectedPayment === 'ssl-delivery' || override.payDeliveryOnly) {
      paymentType = "delivery";
    }

    const payload = {
      userId: user._id,
      products: cartItems.map(item => {
        const product = item.productId || {};
        const price = item.price ?? product.price ?? 0;
        return {
          productId: product._id || item.productId,
          name: product.productName || item.name,
          image: product.images || item.image,
          quantity: item.quantity,
          price: price,
          totalPrice: (Number(price) || 0) * (Number(item.quantity) || 0),
          size: item.size || null,
          color: item.color || null,
          weight: item.weight || null,
        }
      }),

      delivery_address,
      deliveryCharge,
      subTotalAmt: subtotal,
      totalAmt: total, // Total amount is always full order value

      payment_method: override.payment_method || (selectedPayment === 'manual' ? 'manual' : 'sslcommerz'),
      payment_type: paymentType, // Set payment_type here
      payment_details: (override.payment_method === 'manual' || selectedPayment === 'manual') ? null : (override.payment_details || {}),
      appliedCoupon: appliedCoupon?.code || null,
    };

    if (payload.payment_method === 'manual') {
      return createManualPaymentOrder(payload);
    } else if (payload.payment_method === 'sslcommerz') {
      return createSslPaymentOrder(payload);
    } else {
      // Fallback or error, though the logic above should prevent this
      console.error("Unknown payment method:", payload.payment_method);
      throw new Error("Invalid payment method selected for order creation.");
    }
  };


  // One-click SSL (full or delivery-only)
  // const handleProceedToPayment = async ({ payDeliveryOnly = false } = {}) => {
  //   const { name, phone, email, address, division, district, area, pincode } = customerInfo;

  //   // 1️⃣ Required fields
  //   if (!name || !phone || !address || !division || !district || !area || !pincode) {
  //     toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন (ঠিকানা সহ)");
  //     return;
  //   }

  //   // 2️⃣ Phone validation
  //   if (!isValidBDPhone(phone)) {
  //     toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)");
  //     return;
  //   }

  //   // 3️⃣ Email validation (optional)
  //   if (email && !isValidEmail(email)) {
  //     toast.error("সঠিক ইমেইল ঠিকানা দিন");
  //     return;
  //   }

  //   if (!selectedPayment) {
  //     toast.error("অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন");
  //     return;
  //   }

  //   if (!user?._id) {
  //     toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
  //     return;
  //   }

  //   if (!cartItems.length) {
  //     toast.error("কার্ট খালি আছে");
  //     return;
  //   }

  //   try {
  //     setIsProcessing(true);

  //     const paymentType = payDeliveryOnly ? "delivery" : "full";

  //     // Create order (manual / pending for now, will be updated by SSL)
  //     const orderRes = await createOrder({
  //       payment_method: "sslcommerz",
  //       payment_type: paymentType,
  //     });


  //     const dbOrder = orderRes?.data;
  //     const dbOrderId = dbOrder?._id;

  //     if (!dbOrderId) {
  //       throw new Error("Order তৈরি করতে সমস্যা হয়েছে (ID পাওয়া যায়নি)");
  //     }

  //     //  Init SSL payment
  //     const paymentRes = await initPaymentSession({
  //       orderId: dbOrderId,
  //       payment_type: paymentType,
  //       userId: user._id,
  //       success_url: `${window.location.origin}/payment/success`,
  //     });

  //     const gatewayUrl = paymentRes?.url;

  //     if (!gatewayUrl) {
  //       throw new Error("Payment গেটওয়ে URL পাওয়া যায়নি");
  //     }

  //     toast.success("আপনাকে পেমেন্ট পেইজে পাঠানো হচ্ছে...");
  //     window.location.href = gatewayUrl;

  //   } catch (error) {
  //     console.error("SSLCommerz init error:", error);
  //     const msg =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "পেমেন্ট শুরু করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।";
  //     toast.error(msg);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  // console.log('cart', { createdOrder.or }
  // );



  const handleManualPaymentInfoChange = (field, value) => {
    setManualPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualOrderAndPaymentSubmission = async ({ payDeliveryOnly = false }) => {
    const { name, phone, email, address, division, district, area, pincode } = customerInfo;
    const { senderNumber, transactionId } = manualPaymentInfo;




    // 1️⃣ Required fields
    if (!name || !phone || !address || !division || !district || !area) {
      toast.error("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন (ঠিকানা সহ)");
      return;
    }

    if (!isValidBDPhone(phone)) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)");
      return;
    }

    if (email && !isValidEmail(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    if (!selectedManualMethod) {
      toast.error("অনুগ্রহ করে একটি ম্যানুয়াল পেমেন্ট পদ্ধতি নির্বাচন করুন");
      return;
    }

    // 2️⃣ Manual payment validation
    if (!senderNumber || !transactionId) {
      toast.error("অনুগ্রহ করে পেমেন্ট নম্বর এবং ট্রানজ্যাকশন আইডি উভয়ই দিন");
      return;
    }

    if (transactionId.length < 6) {
      toast.error("ট্রানজ্যাকশন আইডি কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (!isValidBDPhone(senderNumber)) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX) পেমেন্ট নম্বরের জন্য");
      return;
    }

    // 3️⃣ Check for duplicate transaction ID
    if (usedTransactionIds.includes(transactionId)) {
      toast.error("এই ট্রানজ্যাকশন আইডি ইতিমধ্যেই ব্যবহার হয়েছে!");
      return;
    }

    if (!user?._id) {
      toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
      return;
    }

    if (!cartItems.length) {
      toast.error("কার্ট খালি আছে");
      return;
    }

    try {
      setIsProcessing(true);

      // 4️⃣ Build payload for backend
      const delivery_address = {
        address_line: address,
        district,
        division,
        upazila_thana: area,
        pincode: pincode || 0,
        country: "Bangladesh",
        mobile: Number(phone),
      };

      const productsPayload = cartItems.map(item => {
        const product = item.productId || {};
        const price = item.price ?? product.price ?? 0;
        return {
          productId: product._id || item.productId,
          name: product.productName || item.name,
          image: product.images || item.image,
          quantity: item.quantity,
          price: price,
          totalPrice: (Number(price) || 0) * (Number(item.quantity) || 0),
          size: item.size || null,
          color: item.color || null,
          weight: item.weight || null,
        };
      });

      const payload = {
        userId: user._id,
        products: productsPayload,
        delivery_address,
        deliveryCharge,
        subTotalAmt: subtotal,
        totalAmt: total,
        payment_method: "manual",
        payment_type: payDeliveryOnly ? "delivery" : "full",
        payment_details: {
          provider: selectedManualMethod,
          senderNumber,
          transactionId,
        },
        appliedCoupon: appliedCoupon?.code || null,
      };

      // 5️⃣ Send order creation request
      const orderRes = await createManualPaymentOrder(payload);
      const order = orderRes?.data;
      const dbOrderId = order?._id;

      if (!dbOrderId) {
        throw new Error("Order তৈরি করতে সমস্যা হয়েছে (ID পাওয়া যায়নি)");
      }

      // 6️⃣ Submit manual payment
      const paymentSubmissionRes = await submitManualPayment({
        orderId: dbOrderId,
        provider: selectedManualMethod,
        senderNumber,
        transactionId,
        paidFor: payDeliveryOnly ? "delivery" : "full",
      });

      setUsedTransactionIds(prev => [...prev, transactionId]);

      toast.success("অর্ডার এবং পেমেন্ট সফলভাবে জমা হয়েছে!");
      if (orderRes) {
        // toast.success("✅ Product added successfully!");
        // resetForm();


        await ProductNotification({
          title: "New Order Added",
          message: `Order is now live!`,
          type: "Order",
          referenceId: orderRes.data._id,
          // meta: { category: response.data.category },
        });
      } else {
        toast.error(response?.message || "পণ্য যোগ করা যায়নি");
      }

      // 7️⃣ Clear cart and update state
      dispatch(cartClear());
      setCreatedOrder({
        ...order,
        payment_type: paymentSubmissionRes.order?.payment_details?.manual?.paidFor || order.payment_type,
        payment_status: paymentSubmissionRes.order?.payment_status || order.payment_status,
      });
      setManualOrderStep('payment_submitted');

      // update product stock 
      cartItems.forEach(async item => {
        // stock verification 
        if (item.productId.productStock < item.quantity) {
          toast.error("অতিরিক্ত পরিমাণ যোগ করা হয়েছে")
          return
        }
        const updatedQuantity = item.productId.productStock - item.quantity
        const res = await ProductUpdate({ _id: item.productId._id, productStock: updatedQuantity })
        console.log(res)
      })

    } catch (err) {
      console.error("Manual order and payment submission error:", err);
      const msg = err?.response?.data?.message || err?.message || "ম্যানুয়াল অর্ডার ও পেমেন্ট জমা দিতে ব্যর্থ হয়েছে";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };


  const copyOrderId = () => {
    if (!createdOrder?.orderId) return;
    navigator.clipboard.writeText(createdOrder.orderId)
      .then(() => {
        toast.success("Order ID copied to clipboard!");
      })
      .catch(() => {
        toast.error("অর্ডার আইডি কপি করা যায়নি");
      });
  };




  const manualMethods = [
    {
      id: "bkash",
      name: "Bkash Personal",
      number: "01626420774",
    },
    {
      id: "nagad",
      name: "Nagad Personal",
      number: "01626420774",
    },
    {
      id: "rocket",
      name: "Rocket Personal",
      number: "01626420774",
    },
    {
      id: "upay",
      name: "Upay Personal",
      number: "01626420774",
    },
  ];


  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      {/* <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-accent-content" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600bg-clip-text text-transparent">
                  EasyShoppingMall
                </h1>
                <p className="text-gray-600 text-sm">নিরাপদ ও দ্রুত অনলাইন শপিং</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="w-full px-5 flex justify-center items-center pt-16 gap-2 ">
        <button className="text-sm bg-primary-color px-3 py-2 rounded-2xl">সম্পূর্ণ অর্ডার গাইডলাইন এখানে দেখুন</button>
        <img onClick={() => setShowGuideVideo(!showGuideVideo)} src="https://cdn-icons-png.freepik.com/256/13983/13983898.png?semt=ais_white_label" className="w-10 h-10 cursor-pointer" alt="" />
      </div>
      {/* guide video  */}
      {showGuideVideo && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn ">
        <ReactPlayer
          controls
          light={<img
            src={"https://i.ytimg.com/vi/_qETiv0aTdA/hqdefault.jpg?sqp=-oaymwFBCPYBEIoBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGBEgcihFMA8=&rs=AOn4CLA03DMupVKsylFc6VGl5wp6b0b4pg"}
            alt={`thumbnel `}
            className=" w-96 h-96  rounded-xl md:rounded-2xl"
          />}
          playIcon={<img className='w-12 h-12 absolute rounded-full' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7dAm2xeRPWO5PJWhJnhfUeG3Syl3ws8wnw&s"} />}
          width={660}
          height={315}
          volume={0.5}
          playing={true}
          src="https://youtu.be/_qETiv0aTdA?feature=shared"
        />
        <button onClick={() => setShowGuideVideo(!showGuideVideo)} className="text-xl bg-secondary py-1 px-3 rounded-full absolute top-10 right-10 cursor-pointer">X</button>
      </div>}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-btn-color p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bg bg-opacity-20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent-content" />
                  </div>
                  <h2 className="text-xl font-semibold text-accent-content">গ্রাহকের তথ্য</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম *</label>
                    <input value={customerInfo.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="আপনার নাম লিখুন" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নম্বর *</label>
                    <input value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল ঠিকানা</label>
                    <input value={customerInfo.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="example@email.com" className="w-full px-4 py-3 border rounded-xl bg-gray-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}


            <div className="bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-btn-color p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bg bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent-content" />
                  </div>
                  <h2 className="text-xl font-semibold text-accent-content">ডেলিভারি ঠিকানা</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">সম্পূর্ণ ঠিকানা *</label>
                    <textarea value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড নম্বর, এলাকার নাম" className="w-full px-4 py-3 border rounded-xl bg-bg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পোস্ট কোড </label>
                    <input value={customerInfo?.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} placeholder="পোস্ট কোড দিন" className="w-full px-4 py-3 border rounded-xl bg-bg" />
                  </div>

                </div>
              </div>
            </div>
            <LocationSelects customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-bg p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-content rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold text-accent">অর্ডার সামারি</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 && <div className="text-center py-6 text-gray-500">কার্ট খালি।</div>}

                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex items-center space-x-4 p-4 bg-bg shadow-xl rounded-xl">
                      <div className="relative">
                        <img src={item.productId.images?.[0] || item.image || "/placeholder.svg"} alt={item.productId?.productName || item.name || "Product"} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-accent-content font-bold">{item.quantity}</div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.productId?.productName || item.name || "Unnamed Product"}</h3>
                        <div className="flex items-center space-x-1 mt-1"><Star className="w-3 h-3 text-yellow-400" /><span className="text-xs text-gray-600">{item.ratings || "5"}</span></div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">৳{(item.totalPrice || (item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">৳{(item.price || 0).toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 p-4 bg-bg shadow-xl rounded-xl">
                  <div className="flex justify-between text-gray-700"><span>সাবটোটাল</span><span className="font-medium">৳{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-700"><span className="flex items-center space-x-1"><Truck className="w-4 h-4" /><span>ডেলিভারি চার্জ</span></span><span className="font-medium">৳{deliveryCharge}</span></div>

                  {/* Coupon section calculation */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>ডিসকাউন্ট ({appliedCoupon.code}) <button onClick={removeCoupon} className="text-red-500 text-xs ml-2 underline">সরান</button></span>
                      <span className="font-medium">- ৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3"><div className="flex justify-between text-xl font-bold text-gray-900"><span>মোট</span><span className="text-blue-600">৳{total.toLocaleString()}</span></div></div>
                </div>

                {/* Coupon Input UI */}
                <div className="mb-6 p-4 bg-bg shadow-xl rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">কুপন কোড (যদি থাকে)</h4>
                  <div className="flex gap-2">
                    <input
                      disabled={appliedCoupon != null}
                      type="text"
                      placeholder="কুপন লিখুন"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      disabled={!couponCode || isApplyingCoupon || appliedCoupon != null}
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    পেমেন্ট মেথড
                  </h4>

                  <div className="space-y-3">

                    {/* ================= Manual Payment ================= */}
                    <div
                      className={`manual-payment-section p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'manual'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-bg'}
      `}
                      onClick={() => setSelectedPayment('manual')}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPayment === 'manual'}
                          readOnly
                        />

                        <div className="flex-1 flex justify-between">
                          <div>
                            <div className="font-medium">
                              ম্যানুয়াল পেমেন্ট (Bkash / Nagad / Rocket)
                            </div>
                            <div className="text-xs text-gray-500">
                              আপনি প্রদত্ত নম্বরে পেমেন্ট করে ট্রানজ্যাকশন আইডি জমা দেবেন
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-gray-700">
                            ৳{total.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Manual Section */}
                      {selectedPayment === 'manual' && manualOrderStep === 'initial' && (
                        <div
                          className="mt-4 space-y-3"
                          onClick={(e) => e.stopPropagation()} // 🔥 key fix
                        >
                          {/* Manual Methods */}
                          {manualMethods.map((method) => {
                            const isActive = selectedManualMethod === method.id;

                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setSelectedManualMethod(method.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition
                  ${isActive
                                    ? 'border-btn-color bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-400'}
                `}
                              >
                                <div className="text-left">
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-xs text-gray-500">{method.number}</div>
                                </div>

                                <span
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isActive ? 'border-green-600' : 'border-gray-300'}
                  `}
                                >
                                  {isActive && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                                  )}
                                </span>
                              </button>
                            );
                          })}

                          {/* Input fields for manual payment details */}
                          <div className="pt-2 space-y-3">
                            <input
                              type="text"
                              placeholder="আপনার মোবাইল নম্বর (যেই নম্বর থেকে পেমেন্ট করেছেন)"
                              value={manualPaymentInfo.senderNumber}
                              onChange={(e) => handleManualPaymentInfoChange('senderNumber', e.target.value)}
                              className="w-full px-3 py-3 border rounded-xl text-xs"
                              disabled={isProcessing}
                            />

                            <input
                              type="text"
                              placeholder="ট্রানজ্যাকশন আইডি (Transaction ID)"
                              value={manualPaymentInfo.transactionId}
                              onChange={(e) => handleManualPaymentInfoChange('transactionId', e.target.value)}
                              className="w-full px-3 py-3 border rounded-xl text-xs"
                              disabled={isProcessing}
                            />

                            {/* ⚠️ Transaction ID Warning */}
                            <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <p className="text-xs text-yellow-700 leading-snug">
                                <strong>সতর্কতা:</strong> একবার ব্যবহৃত ট্রানজ্যাকশন আইডি আবার ব্যবহার করবেন না।
                                ভুল বা ডুপ্লিকেট ট্রানজ্যাকশন আইডি দিলে আপনার অর্ডার বাতিল হতে পারে।
                              </p>
                            </div>

                          </div>

                          {/* New Payment Buttons */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleManualOrderAndPaymentSubmission({ payDeliveryOnly: true })}
                              disabled={isProcessing || !selectedManualMethod}
                              className="flex-1 bg-blue-600 text-accent-content py-3 rounded-xl font-semibold disabled:opacity-60"
                            >
                              {isProcessing ? 'প্রসেসিং হচ্ছে...' : `ডেলিভারি চার্জ দিন ৳${deliveryCharge}`}
                            </button>
                            <button
                              onClick={() => handleManualOrderAndPaymentSubmission({ payDeliveryOnly: false })}
                              disabled={isProcessing || !selectedManualMethod}
                              className="flex-1 bg-green-600 text-accent-content py-3 rounded-xl font-semibold disabled:opacity-60"
                            >
                              {isProcessing ? 'প্রসেসিং হচ্ছে...' : `সম্পূর্ণ পেমেন্ট দিন ৳${total.toLocaleString()}`}
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedPayment === 'manual' && manualOrderStep === 'order_created' && createdOrder && (
                        <div className="mt-4 space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <h3 className="font-bold text-blue-800 text-lg">ম্যানুয়াল পেমেন্ট নির্দেশাবলী</h3>
                          <p className="text-sm text-blue-700">
                            আপনার অর্ডার <strong>#{createdOrder?.orderId}
                            </strong> সফলভাবে তৈরি হয়েছে।
                            অনুগ্রহ করে নিচের ধাপগুলো অনুসরণ করে পেমেন্ট সম্পন্ন করুন।
                          </p>
                          <p className="font-medium text-blue-700">
                            মোট প্রদেয়: ৳{createdOrder.totalAmt.toLocaleString()}
                          </p>

                          {/* Render payment instructions based on selectedManualMethod */}
                          {selectedManualMethod && (
                            <div className="bg-blue-100 p-3 rounded-lg text-sm">
                              <p>Send ৳{createdOrder.totalAmt.toLocaleString()} to:</p>
                              {manualMethods.find(m => m.id === selectedManualMethod)?.name}:{' '}
                              <strong>{manualMethods.find(m => m.id === selectedManualMethod)?.number}</strong>
                              <p className="mt-1 text-xs text-blue-600">
                                <i>(দয়া করে ব্যক্তিগত নম্বরে সেন্ড মানি করুন)</i>
                              </p>
                            </div>
                          )}

                          <p className="text-sm text-blue-700 mt-2">
                            পেমেন্ট করার পর, নিচের ফর্মে ট্রানজ্যাকশন আইডি এবং আপনার মোবাইল নম্বর জমা দিন।
                          </p>
                          {/* ManualPaymentForm Component - This section is now likely redundant if payments are submitted upfront.
                            I am keeping it here for now, but its rendering conditions should prevent it from showing. */}
                          {/* <ManualPaymentForm
                          order={createdOrder}
                          selectedManualMethod={selectedManualMethod}
                          manualMethods={manualMethods}
                          setManualOrderStep={setManualOrderStep}
                        /> */}
                        </div>
                      )}

                      {selectedPayment === 'manual' && manualOrderStep === 'payment_submitted' && (
                        <div className="mt-4 space-y-3 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                          <h3 className="font-bold text-green-800 text-lg">পেমেন্ট জমা হয়েছে!</h3>
                          <p className="text-sm text-green-700">
                            আপনার পেমেন্টের তথ্য সফলভাবে জমা দেওয়া হয়েছে। অ্যাডমিনের কনফার্মেশনের জন্য অপেক্ষা করুন।
                          </p>

                          {/* Order ID with copy icon */}
                          <div className="mt-4 flex items-center justify-center space-x-2">
                            <span className="font-medium text-gray-900">Order ID:</span>
                            <span className="font-semibold text-blue-600">{createdOrder?.orderId.substring(0, 8)}</span>
                            <Copy
                              size={24}
                              className="cursor-pointer text-gray-500 hover:text-gray-700"
                              onClick={copyOrderId}
                            />
                          </div>

                          <Link
                            href="/account"
                            className="inline-flex items-center gap-2 bg-green-600 text-accent-content px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition mt-3"
                          >
                            <ShoppingBag size={18} /> আমার অর্ডারগুলো দেখুন
                          </Link>
                        </div>
                      )}



                    </div>

                    {/* ================= SSL Full ================= */}
                    {/* <label
                      disabled
                      className={`flex items-center p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'ssl'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'}
      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="ssl"
                        checked={selectedPayment === 'ssl'}
                        onChange={() => setSelectedPayment('ssl')}
                        className="mr-3"
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            One-click (SSLCommerz) — Full
                          </div>
                          <div className="text-xs text-gray-500">
                            শুধু ক্লিক করুন এবং পেমেন্ট গেটওয়ে খুলবে
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-gray-700">
                          ৳{(subtotal + deliveryCharge).toLocaleString()}
                        </div>
                      </div>
                    </label> */}

                    {/* ================= SSL Delivery ================= */}
                    {/* <label
                      disabled
                      className={`flex items-center p-3 rounded-xl border cursor-pointer
        ${selectedPayment === 'ssl-delivery'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 bg-white'}
      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="ssl-delivery"
                        checked={selectedPayment === 'ssl-delivery'}
                        onChange={() => setSelectedPayment('ssl-delivery')}
                        className="mr-3"
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Pay Delivery Fee Only (SSL)
                          </div>
                          <div className="text-xs text-gray-500">
                            আগে ডেলিভারি ফি দিন, পরে বাকি কনফার্ম
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-gray-700">
                          ৳{deliveryCharge}
                        </div>
                      </div>
                    </label> */}

                  </div>
                </div>


                <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-green-50 rounded-xl">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">১০০% নিরাপদ পেমেন্ট</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <button onClick={() => {
                    if (selectedPayment !== 'ssl') { setSelectedPayment('ssl'); return; }
                    handleProceedToPayment({ payDeliveryOnly: false });
                  }} disabled={isProcessing} className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-accent-content py-3 rounded-xl font-semibold disabled:opacity-60">{isProcessing ? 'প্রসেসিং হচ্ছে...' : 'One-Click SSL — Full'}</button>

                  <button onClick={() => { if (selectedPayment !== 'ssl-delivery') { setSelectedPayment('ssl-delivery'); return; } handleProceedToPayment({ payDeliveryOnly: true }); }} disabled={isProcessing} className="w-full border border-gray-300 py-3 rounded-xl font-semibold">{isProcessing ? 'প্রসেসিং হচ্ছে...' : `Pay Delivery Only (৳${deliveryCharge})`}</button> */}

                  <button onClick={() => {
                    if (selectedPayment !== 'manual') {
                      setSelectedPayment('manual');
                      setManualOrderStep('initial'); // Reset step when selecting manual payment
                    }
                    const el = document.querySelector('.manual-payment-section'); // Add a class to the manual payment div
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                    disabled={isProcessing}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold">
                    Pay Manually (Bkash / Nagad)
                  </button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের <span className="text-blue-600 font-medium">শর্তাবলী</span> মেনে নিচ্ছেন</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
