import { MessageCircle, MessageSquareText } from "lucide-react";
import React from "react";

import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

const ChatBoot = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      
      {/* Messenger */}
      <a
        href="#"
        title="Messenger"
        className="hover:scale-110 transition-transform duration-300"
      >
        <FaFacebookMessenger className="text-blue-600 text-4xl drop-shadow-md" />
      </a>

      {/* WhatsApp */}
      <a
        href="#"
        title="WhatsApp"
        className="hover:scale-110 transition-transform duration-300"
      >
        <FaWhatsapp className="text-green-500 text-4xl drop-shadow-md" />
      </a>

      {/* AI Chat */}
      <button
        title="AI Chat"
        className="hover:scale-110 transition-transform duration-300"
      >
     <MessageSquareText
          className="w-8 h-8 text-slate-700 hover:text-indigo-600
          hover:scale-110 transition-all duration-300 drop-shadow-sm"
        />
      </button>

    </div>
  );
};

export default ChatBoot;
