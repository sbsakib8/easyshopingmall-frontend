import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", message: "New User Registered", isRead: false, time: "2 min ago" },
    { id: "2", message: "New Order Placed", isRead: false, time: "10 min ago" },
    { id: "3", message: "Stock updated successfully", isRead: true, time: "1 hr ago" },
  ]);

  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <span className="absolute -top-2 -right-2 w-6 h-6 
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
        <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 
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

          <div className="max-h-64 overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map((notify) => (
                <div
                  key={notify.id}
                  onClick={() => markAsRead(notify.id)}
                  className={`cursor-pointer rounded-lg p-3 mb-2 transition 
                  ${
                    notify.isRead
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-700 text-white shadow-md"
                  } hover:bg-gray-600`}
                >
                  <p className="text-sm">{notify.message}</p>
                  <span className="text-xs text-gray-400">{notify.time}</span>
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
