"use client";
import { Logout, updateUserProfile } from "@/src/hook/useAuth";
import { clearUser, userget } from "@/src/redux/userSlice";
import AuthUserNothave from "@/src/utlis/AuthUserNothave";
import { OrderAllGet } from "@/src/utlis/useOrder";
import { useWishlist } from "@/src/utlis/useWishList";
import {
  Calendar,
  Camera,
  CreditCard,
  Edit3,
  Eye,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Save,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import OrderDetailsModal from "../productDetails/OrderDetailsModal";

const AccountPage = () => {
  // user data fatch
  const data = useSelector((state) => state.user.data);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: data?.name,
    email: data?.email,
    phone: data?.mobile,
    address: data?.address_details,
    dateOfBirth: "1995-05-15",
    gender: "Male",
  });

  const [orders, setOrders] = useState([]);
  const { wishlist, loading: wishlistLoading } = useWishlist();

  // derive addresses from user data if available
  const addresses =
    (data &&
      (data.addresses ||
        (data.address_details
          ? [
              {
                id: 1,
                type: "Home",
                address: data.address_details,
                isDefault: true,
              },
            ]
          : []))) ||
    [];

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // fetch user orders when user is available
  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      try {
        const res = await OrderAllGet();
        // API returns { success, message, data: [...] }
        const list = res?.data ?? res?.orders ?? res ?? [];
        if (mounted && Array.isArray(list)) {
          setOrders(list);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    if (data?._id) {
      loadOrders();
    }

    return () => {
      mounted = false;
    };
  }, [data?._id]);

  // Update profileData when user data loads
  useEffect(() => {
    if (data) {
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        phone: data.mobile || "",
        address: data.address_details || "",
        dateOfBirth: data.dateOfBirth || "1995-05-15",
        gender: data.gender || "Male",
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=55d63e852df7bcf0393b2dedd1d8aaa9`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("Failed to upload image to ImgBB");
      }
    } catch (error) {
      console.error("ImgBB upload error:", error);
      throw error;
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload and profile update
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    if (!data?._id) {
      toast.error("User ID not found");
      return;
    }

    setUploadingImage(true);

    try {
      // Upload to ImgBB
      const imageUrl = await uploadImageToImgBB(selectedImage);
      
      // Update profile with new image URL
      const updateData = {
        image: imageUrl,
      };

      const response = await updateUserProfile(data._id, updateData);

      if (response.success || response.data) {
        // Update Redux store with new image
        const updatedUser = {
          ...data,
          image: imageUrl,
        };
        
        dispatch(userget(updatedUser));

        toast.success("Profile picture updated successfully!");
        setShowImageUpload(false);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        toast.error(response.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!data?._id) {
      toast.error("User ID not found");
      return;
    }

    try {
      // Prepare update data - send only address_details (not address)
      const updateData = {
        name: profileData.name || "",
        email: profileData.email || "",
        mobile: profileData.phone || "",
        address: profileData.address || "",
        dateOfBirth: profileData.dateOfBirth || "",
        gender: profileData.gender || "",
      };

      console.log("=== BEFORE SENDING TO BACKEND ===");
      console.log("Data being sent:", updateData);
      console.log("Field check before sending:");
      console.log("  name:", !!updateData.name, "=>", updateData.name);
      console.log("  email:", !!updateData.email, "=>", updateData.email);
      console.log("  mobile:", !!updateData.mobile, "=>", updateData.mobile);
      console.log("  address_details:", !!updateData.address, "=>", updateData.address);
      console.log("  dateOfBirth:", !!updateData.dateOfBirth, "=>", updateData.dateOfBirth);
      console.log("  gender:", !!updateData.gender, "=>", updateData.gender);
      console.log("================================");

      // Call the update API
      const response = await updateUserProfile(data._id, updateData);

      console.log("=== AFTER RECEIVING FROM BACKEND ===");
      console.log("Complete response:", response);
      console.log("Response type:", typeof response);
      console.log("Response.success:", response.success);
      console.log("Response.data:", response.data);
      console.log("Response.user:", response.user);
      
      const returnedUser = response.user || response.data || response;
      console.log("\nReturned user object:", returnedUser);
      console.log("\nField check after receiving:");
      console.log("  name:", !!returnedUser?.name, "=>", returnedUser?.name);
      console.log("  email:", !!returnedUser?.email, "=>", returnedUser?.email);
      console.log("  mobile:", !!returnedUser?.mobile, "=>", returnedUser?.mobile);
      console.log("  address_details:", !!returnedUser?.address_details, "=>", returnedUser?.address_details);
      console.log("  dateOfBirth:", !!returnedUser?.dateOfBirth, "=>", returnedUser?.dateOfBirth);
      console.log("  gender:", !!returnedUser?.gender, "=>", returnedUser?.gender);
      
      console.log("\n=== COMPARISON ===");
      console.log("Sent address_details:", updateData.address_details);
      console.log("Received address_details:", returnedUser?.address_details);
      console.log("Match:", updateData.address_details === returnedUser?.address_details);
      console.log("Sent dateOfBirth:", updateData.dateOfBirth);
      console.log("Received dateOfBirth:", returnedUser?.dateOfBirth);
      console.log("Match:", updateData.dateOfBirth === returnedUser?.dateOfBirth);
      console.log("Sent gender:", updateData.gender);
      console.log("Received gender:", returnedUser?.gender);
      console.log("Match:", updateData.gender === returnedUser?.gender);
      console.log("================================");

      if (response.success || response.data) {
        // Update Redux store with new data
        const updatedUser = {
          ...data,
          name: updateData.name,
          email: updateData.email,
          mobile: updateData.mobile,
          address_details: updateData.address_details,
          dateOfBirth: updateData.dateOfBirth,
          gender: updateData.gender,
        };
        
        dispatch(userget(updatedUser));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("=== Error updating profile ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Shipped":
        return "text-blue-600 bg-blue-100";
      case "Processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const TabButton = ({ id, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center cursor-pointer space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group ${
        activeTab === id
          ? "bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg transform scale-105"
          : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
      }`}
    >
      <Icon
        className={`w-5 h-5 transition-transform duration-300 ${
          activeTab === id ? "scale-110" : "group-hover:scale-110"
        }`}
      />
      <span className="font-medium">{label}</span>
      {count && (
        <span
          className={`ml-auto px-2 py-1 text-xs rounded-full ${
            activeTab === id ? "bg-white/20" : "bg-blue-100 text-blue-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  // logout handel
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await Logout(router);
      if (res.success) {
        dispatch(clearUser());
        localStorage.removeItem("persist:root");
        router.push("/signin");
        toast.success("User logged out successfully");
      }
    } catch (error) {
      toast.error("Logout failed:", error);
    }
  };

  return (
    <AuthUserNothave>
      <div className="min-h-screen lg:mt-24 py-5 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-1">Manage your profile and account settings</p>
          </div>
        </div>

        <div className=" container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                {/* Profile Card */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 cursor-pointer bg-gradient-to-r   from-emerald-600 via-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <img
                        className=" w-22 h-22 cursor-pointer rounded-full"
                        src={data?.image}
                        alt=""
                      />
                    </div>
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="absolute cursor-pointer -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg mt-4 text-gray-900">{profileData.name}</h3>
                  <p className="text-gray-500 text-sm">{profileData.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 ">
                  <TabButton id="profile" icon={User} label="Profile" />
                  <TabButton
                    id="orders"
                    icon={Package}
                    label="Orders"
                    count={orders?.length || 0}
                  />
                  <TabButton
                    id="wishlist"
                    icon={Heart}
                    label="Wishlist"
                    count={wishlist?.length || 0}
                  />
                  <TabButton id="addresses" icon={MapPin} label="Addresses" />
                  <TabButton id="payments" icon={CreditCard} label="Payment Methods" />
                  <TabButton id="settings" icon={Settings} label="Settings" />
                </nav>
                <button
                  onClick={handleLogout}
                  className="flex gap-2 mt-10 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-3 px-20 md:px-18 rounded-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  <span>
                    <LogOut />
                  </span>
                  <span className="font-medium">LogOut</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                        <p className="text-gray-600">Update your personal information</p>
                      </div>
                      <button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className={`flex items-center  cursor-pointer space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isEditing
                            ? "bg-teal-500 hover:bg-teal-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        }`}
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span className=" hidden md:block">
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Enter your full name"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={profileData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Enter your email"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Enter your phone number"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={profileData.dateOfBirth || ""}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <select
                            value={profileData.gender || "Male"}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <textarea
                            value={profileData.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            rows="3"
                            placeholder="Enter your address"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 resize-none ${
                              !isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                  <div className="p-4 md:p-8">
                    {" "}
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Order History</h2>
                      <p className="text-sm md:text-base text-gray-600">
                        Track and manage your orders
                      </p>
                    </div>
                    <div className="space-y-4">
                      {orders.map((order, index) => {
                        console.log("orders", order)
                        const firstProduct = order.products && order.products[0];
                        const image =
                          firstProduct?.image?.[0] ||
                          firstProduct?.productId?.images?.[0] ||
                          "/banner/img/placeholder.png";

                        const id = order._id;

                        const date = order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "";
                        const itemsCount = (order.products && order.products.length) || 0;
                        const status = order.order_status || order.payment_status || "pending";
                        const totalAmt = order.totalAmt ?? order.subTotalAmt ?? 0;

                        return (
                          <div
                            key={id}
                            className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                            style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={image}
                                  alt="Order"
                                  className="w-14 h-14 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  {" "}
                                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                                    Order #{id.slice(-8)}{" "}
                                    {/* Puru ID mobile-e na dekhiye sesh 8 digit dekhano valo */}
                                  </h3>
                                  <p className="text-xs md:text-sm text-gray-500">
                                    {date} • {itemsCount} items
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full capitalize ${getStatusColor(
                                      status
                                    )}`}
                                  >
                                    {status}
                                  </span>
                                  <span className="font-bold text-base md:text-lg text-gray-900">
                                    ৳{totalAmt}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleViewOrder(order)}
                                  className="p-2 text-gray-400 cursor-pointer hover:text-teal-600 hover:bg-blue-50 rounded-lg transition-all duration-300 bg-gray-50 sm:bg-transparent"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {selectedOrder && (
                        <OrderDetailsModal
                          order={selectedOrder}
                          onClose={() => setSelectedOrder(null)}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === "wishlist" && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                      <p className="text-gray-600">Items you've saved for later</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(wishlist || []).map((item, index) => {
                        const prod = item?.productId || item || {};
                        const id = prod._id || prod.id || item.id;
                        const image =
                          prod.image ||
                          prod.images?.[0] ||
                          (Array.isArray(prod.image) ? prod.image[0] : null) ||
                          "/banner/img/placeholder.png";
                        const name = prod.productName || prod.name || item.name || "Product";
                        const price = prod.price ?? item.price ?? 0;

                        return (
                          <Link
                            href={`/productdetails/${id}`}
                            key={id || index}
                            className="border cursor-pointer border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-blue-300"
                            style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}
                          >
                            <div className="relative">
                              <img
                                src={image}
                                alt={name}
                                className="w-full  h-40 object-cover rounded-lg mb-4"
                              />
                              <button className="absolute cursor-pointer top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {name}
                            </h3>
                            <p className="text-lg font-bold text-blue-600 mb-3">৳{price}</p>
                            <div className="flex space-x-2">
                              <button className="flex-1 cursor-pointer bg-teal-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                Add to Cart
                              </button>
                              <button className="p-2 border cursor-pointer border-gray-200 rounded-lg hover:border-red-300 hover:text-red-500 transition-all duration-300">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === "addresses" && (
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                        <p className="text-gray-600">Manage your delivery addresses</p>
                      </div>
                      <button className="flex items-center cursor-pointer space-x-2 bg-teal-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                        <Plus className="w-4 h-4" />
                        <span>Add Address</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {addresses.map((address, index) => (
                        <div
                          key={address.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                          style={{
                            animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{address.type}</h3>
                                  {address.isDefault && (
                                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-1">{address.address}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 cursor-pointer hover:text-teal-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Methods Tab */}
                {activeTab === "payments" && (
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                        <p className="text-gray-600">Manage your payment options</p>
                      </div>
                      <button className="flex cursor-pointer items-center space-x-2 bg-teal-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                        <Plus className="w-4 h-4" />
                        <span>Add Card</span>
                      </button>
                    </div>

                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No payment methods added
                      </h3>
                      <p className="text-gray-500">Add a payment method to make checkout faster</p>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                      <p className="text-gray-600">Manage your account preferences</p>
                    </div>

                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { id: "email", label: "Email notifications", enabled: true },
                            { id: "sms", label: "SMS notifications", enabled: false },
                            { id: "push", label: "Push notifications", enabled: true },
                          ].map((setting) => (
                            <div key={setting.id} className="flex items-center justify-between">
                              <span className="text-gray-700">{setting.label}</span>
                              <button
                                className={`w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${
                                  setting.enabled ? "bg-teal-500" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                                    setting.enabled ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
                        <div className="space-y-3">
                          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                            Change Password
                          </button>
                          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                            Two-Factor Authentication
                          </button>
                          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                            Login History
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Update Profile Picture</h3>
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  disabled={uploadingImage}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Image Preview */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
                          {data?.image ? (
                            <img
                              src={data.image}
                              alt="Current"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-20 h-20 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110"
                    >
                      <Camera className="w-5 h-5 text-gray-600" />
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </div>
                </div>

                {/* File Info */}
                {selectedImage && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Camera className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedImage.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedImage.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Instructions */}
                {!selectedImage && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Click the camera icon to select an image
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowImageUpload(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                    disabled={uploadingImage}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImageUpload}
                    disabled={!selectedImage || uploadingImage}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      !selectedImage || uploadingImage
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthUserNothave>
  );
};

export default AccountPage;
