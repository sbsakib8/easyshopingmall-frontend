"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import socket from "../confic/socket"; // socket.io client instance
import { useGetnotification } from "../utlis/useNotificationsGet";
import { NotificationAllRead, NotificationDelete, NotificationSingleRead } from "../hook/useNotification";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  //  backend থেকে notification ফেচ
  const { notification, loading, error, refetch } = useGetnotification();
  const [notifications, setNotifications] = useState([]);

  //  প্রথমবার load হওয়ার পর notification state এ সেট করা
  useEffect(() => {
    if (notification && Array.isArray(notification)) {
      setNotifications(notification);
      refetch();
    }
  }, [notification]);

  //  socket.io থেকে live notification পাওয়া
  useEffect(() => {
    socket.on("connect", () => console.log("🟢 Socket connected:", socket.id));

    socket.on("notification:new", (notif) => {
      console.log("📩 New notification:", notif);
      setTimeout(() => {
        setNotifications((prev) => [notif, ...prev]);
      }, 500);
    });

    return () => {
      socket.off("connect");
      socket.off("notification:new");
    };
  }, []);

  // 🔹 Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 🔹 Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 🔹 Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await NotificationSingleRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // 🔹 Mark all as read
  const markAllAsRead = async () => {
    try {
      await NotificationAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // 🔹 Delete single notification
const handleDelete = async (id) => {
  try {
    // API call
    const res = await NotificationDelete(id);

    if (res?.success) {
      // frontend থেকে remove করা
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("🗑️ Notification deleted successfully!");
    } else {
      toast.error(res?.message || "Failed to delete notification");
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    toast.error("❌ Something went wrong while deleting!");
  }
};

  // 🔹 Dropdown বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  

  const timeAgo = (timestamp) => {
  const now = new Date();
  const created = new Date(timestamp);
  const diff = Math.floor((now - created) / 1000); // seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

  return `${Math.floor(diff / 86400)} days ago`;
};

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={toggleDropdown}
        className="relative cursor-pointer p-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 
        hover:from-gray-600 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 
        shadow-lg hover:shadow-xl border border-gray-600/50 group"
      >
        <Bell className="w-5 h-5 text-white group-hover:animate-bounce" />

        {unreadCount > 0 && (
          <span
            className="absolute -top-2 -right-2 w-6 h-6 
          bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full 
          flex items-center justify-center animate-pulse shadow-lg 
          border border-red-500/50"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 
        rounded-xl shadow-xl p-3 animate-fadeIn z-50"
        >
          <div className="flex justify-between items-center py-2 px-1">
            <h3 className="text-white font-semibold">Notifications</h3>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Mark all as read
            </button>
          </div>

          <div
            className="max-h-64 overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {notifications?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No notifications
              </p>
            ) : (
              notifications?.map((notify) => (
                <div
                  key={notify._id}
                  onClick={() => markAsRead(notify._id)}
                  className={`  cursor-pointer rounded-lg p-3 mb-2 transition 
                  ${
                    notify.isRead
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-700 text-white shadow-md"
                  } hover:bg-gray-600`}
                >
                  <div className=" relative w-full  ">
                    <span onClick={() => handleDelete(notify._id)} className=" absolute top-0 right-0 hover:text-red-600 "><IoCloseSharp className=" text-2xl"/></span>
                  </div>
                  <p className="text-sm font-medium">{notify.title}</p>
                  <p className="text-xs text-gray-300">{notify.message}</p>
                  <span className="text-[11px] text-gray-500">
                    {timeAgo(notify.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
