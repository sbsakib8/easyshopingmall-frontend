"use client";
import { Logout, updateUserProfile, getAddress, createAddress, updateAddress } from "@/src/hook/useAuth";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import OrderDetailsModal from "../productDetails/OrderDetailsModal";

const AccountPage = () => {
  // user data fatch
  const data = useSelector((state) => state.user.data);

  // console.log("Profile Info Data:", data);

  // Get cart items from Redux store (same as header)
  const { items: cartItems } = useSelector((state) => state.cart);

  // Calculate cart product count (same as header)
  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: data?.name,
    email: data?.email,
    phone: data?.mobile,
    dateOfBirth: "1995-05-15",
    gender: "Male",
  });

  const [addressData, setAddressData] = useState({
    _id: "",
    address_line: "",
    district: "",
    division: "",
    upazila_thana: "",
    country: "Bangladesh",
    pincode: "",
    mobile: "",
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

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

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

  // Helper function to format date to yyyy-MM-dd
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Update profileData and fetch address when user data loads
  useEffect(() => {
    if (data) {
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        phone: data.mobile || "",
        dateOfBirth: formatDateForInput(data.date_of_birth),
        gender: data.gender || "",
      });

      // console.log("Address Details from Redux:", data.address_details);

      // Fetch addresses from API
      const loadAddresses = async () => {
        try {
          const addressResponse = await getAddress();
          // console.log("Address API Response:", addressResponse);

          if (addressResponse.success && addressResponse.data) {
            // Handle if data is an array or single object
            const addresses = Array.isArray(addressResponse.data)
              ? addressResponse.data
              : [addressResponse.data];

            if (addresses.length > 0) {
              const addr = addresses[0];
              setAddressData({
                _id: addr._id || "",
                address_line: addr.address_line || "",
                district: addr.district || "",
                division: addr.division || "",
                upazila_thana: addr.upazila_thana || "",
                country: addr.country || "Bangladesh",
                pincode: addr.pincode || "",
                mobile: addr.mobile || data.mobile || "",
              });
            }
          }
        } catch (error) {
          console.error("Failed to load addresses:", error);
          // Set defaults with user's mobile
          setAddressData(prev => ({
            ...prev,
            mobile: data.mobile || "",
          }));
        }
      };

      loadAddresses();
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
      // Build payload - only include fields with valid values
      const payload = {
        name: profileData.name || "",
        email: profileData.email || "",
        mobile: profileData.phone || "",
      };

      // Only add date_of_birth if it has a valid value
      if (profileData.dateOfBirth && profileData.dateOfBirth.trim() !== "") {
        payload.date_of_birth = profileData.dateOfBirth;
      }

      // Only add gender if it has a valid value
      if (profileData.gender && profileData.gender.trim() !== "") {
        payload.gender = profileData.gender;
      }

      // Add address data
      payload.address_data = {
        _id: addressData._id || undefined,
        address_line: addressData.address_line || "",
        district: addressData.district || "",
        division: addressData.division || "",
        upazila_thana: addressData.upazila_thana || "",
        country: addressData.country || "Bangladesh",
        pincode: addressData.pincode || "",
        mobile: addressData.mobile || profileData.phone || "",
      };

      const response = await updateUserProfile(data._id, payload);

      if (response.success || response.data) {
        // Update Redux with returned user data (includes populated address_details)
        const updatedUser = response.user || response.data;
        dispatch(userget(updatedUser));

        // Update local address state from the populated address_details
        if (updatedUser.address_details && updatedUser.address_details.length > 0) {
          const addr = updatedUser.address_details[0];
          setAddressData({
            _id: addr._id || "",
            address_line: addr.address_line || "",
            district: addr.district || "",
            division: addr.division || "",
            upazila_thana: addr.upazila_thana || "",
            country: addr.country || "Bangladesh",
            pincode: addr.pincode || "",
            mobile: addr.mobile || "",
          });
        }

        toast.success("Profile and address updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("=== Error updating profile ===");
      console.error("Error object:", error);
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
      className={`flex items-center cursor-pointer space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === id
        ? "bg-gradient-to-r  from-emerald-600 via-green-600 to-teal-600 text-accent-content shadow-lg transform scale-105"
        : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
        }`}
    >
      <Icon
        className={`w-5 h-5 transition-transform duration-300 ${activeTab === id ? "scale-110" : "group-hover:scale-110"
          }`}
      />
      <span className="font-medium">{label}</span>
      {count && (
        <span
          className={`ml-auto px-2 py-1 text-xs rounded-full ${activeTab === id ? "bg-white/20" : "bg-blue-100 text-blue-600"
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
                    <div className="w-24 h-24 cursor-pointer bg-gradient-to-r   from-emerald-600 via-green-600 to-teal-600 rounded-full flex items-center justify-center text-accent-content text-2xl font-bold shadow-lg">
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
                  <TabButton id="settings" icon={Settings} label="Settings" />
                </nav>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 mt-6 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-accent-content py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
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
                        className={`flex items-center  cursor-pointer space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${isEditing
                          ? "bg-teal-500 hover:bg-teal-800 text-accent-content shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          : "bg-green-500 hover:bg-green-600 text-accent-content shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
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
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
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
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
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
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
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
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-teal-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address Line</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.address_line || ""}
                            onChange={(e) => setAddressData({ ...addressData, address_line: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Street address, House/Building number"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">District</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.district || ""}
                            onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter district"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Division</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.division || ""}
                            onChange={(e) => setAddressData({ ...addressData, division: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter division"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Upazila/Thana</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.upazila_thana || ""}
                            onChange={(e) => setAddressData({ ...addressData, upazila_thana: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter upazila or thana"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pincode</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.pincode || ""}
                            onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter pincode"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={addressData.country || "Bangladesh"}
                            onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Enter country"
                            className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-green-500 transition-all duration-300 ${!isEditing ? "bg-gray-50" : "bg-white hover:border-gray-300"
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
                              <button className="flex-1 cursor-pointer bg-teal-500 hover:bg-green-600 text-accent-content py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
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
                  <div className="p-4 md:p-8">
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Delivery Address</h2>
                      <p className="text-sm md:text-base text-gray-600">Your saved delivery information</p>
                    </div>

                    {data && (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 md:p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-emerald-500 rounded"></span>
                          Current Delivery Information
                        </h3>

                        <div className="space-y-4">
                          {/* Profile Image Section */}
                          <div className="bg-white rounded-lg p-4 border border-emerald-100">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {data.image ? (
                                  <img
                                    src={data.image}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200 shadow-lg"
                                  />
                                ) : (
                                  <div className="w-24 h-24 rounded-full bg-emerald-200 flex items-center justify-center border-4 border-emerald-300 shadow-lg">
                                    <User className="w-12 h-12 text-emerald-600" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-xl">{data.name || "User"}</p>
                                <p className="text-base text-gray-600">{data.email || ""}</p>
                                {data.customerstatus && (
                                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 capitalize">
                                    {data.customerstatus}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Personal Information */}
                          <div className="bg-white rounded-lg p-4 border border-emerald-100">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-emerald-600" />
                              Personal Details
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Full Name</p>
                                <p className="text-gray-800 font-medium">{data.name || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Contact Number</p>
                                <p className="text-gray-800 font-medium">{data.mobile || "N/A"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Address Information */}
                          {(addressData.address_line || addressData.district || addressData.division || data.address_details) && (
                            <div className="bg-white rounded-lg p-4 border border-emerald-100">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                Address Information
                              </h4>
                              <div className="space-y-3 text-sm">
                                {addressData.address_line && (
                                  <div>
                                    <p className="text-gray-500 text-xs mb-1">Address Line</p>
                                    <p className="text-gray-800 font-medium">{addressData.address_line}</p>
                                  </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-3">
                                  {addressData.upazila_thana && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Upazila/Thana</p>
                                      <p className="text-gray-800 font-medium">{addressData.upazila_thana}</p>
                                    </div>
                                  )}
                                  {addressData.district && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">District</p>
                                      <p className="text-gray-800 font-medium">{addressData.district}</p>
                                    </div>
                                  )}
                                  {addressData.division && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Division</p>
                                      <p className="text-gray-800 font-medium">{addressData.division}</p>
                                    </div>
                                  )}
                                  {addressData.pincode && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Pincode</p>
                                      <p className="text-gray-800 font-medium">{addressData.pincode}</p>
                                    </div>
                                  )}
                                  {addressData.country && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Country</p>
                                      <p className="text-gray-800 font-medium">{addressData.country}</p>
                                    </div>
                                  )}
                                  {addressData.mobile && (
                                    <div>
                                      <p className="text-gray-500 text-xs mb-1">Contact Number</p>
                                      <p className="text-gray-800 font-medium">{addressData.mobile}</p>
                                    </div>
                                  )}
                                </div>
                                {!addressData.address_line && !addressData.district && data.address_details && (
                                  <div>
                                    <p className="text-gray-500 text-xs mb-1">Full Address</p>
                                    <p className="text-gray-800 font-medium">
                                      {typeof data.address_details === 'string'
                                        ? data.address_details
                                        : Array.isArray(data.address_details) && data.address_details.length > 0
                                          ? data.address_details[0]
                                          : "No address available"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Additional Contact */}
                          <div className="bg-white rounded-lg p-4 border border-emerald-100">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-emerald-600" />
                              Email Address
                            </h4>
                            <div className="text-sm">
                              <p className="text-gray-500 text-xs mb-1">Email</p>
                              <p className="text-gray-800 font-medium">{data.email || "N/A"}</p>
                            </div>
                          </div>

                          {/* Status Information */}
                          <div className="bg-white rounded-lg p-4 border border-emerald-100">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Status</h4>
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.verify_email
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {data.verify_email ? '✓ Email Verified' : '⚠ Email Not Verified'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">

                              </div>

                            </div>
                          </div>

                          {/* Member Since */}
                          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-600 text-xs mb-1">Member Since</p>
                                <p className="text-gray-800 font-bold">
                                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }) : 'N/A'}
                                </p>
                              </div>
                              <Calendar className="w-8 h-8 text-emerald-600 opacity-50" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                                className={`w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${setting.enabled ? "bg-teal-500" : "bg-gray-300"
                                  }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${setting.enabled ? "translate-x-6" : "translate-x-1"
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
                          <button
                            onClick={() => router.push('/forgotpassword')}
                            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                          >
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
                            <User className="w-20 h-20 text-accent-content" />
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
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${!selectedImage || uploadingImage
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-accent-content hover:shadow-lg hover:scale-105"
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
