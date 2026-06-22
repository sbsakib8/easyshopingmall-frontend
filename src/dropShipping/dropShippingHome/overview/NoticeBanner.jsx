"use client";

import { useActiveNotices } from "@/src/hook/useNotice";
import { Bell, ExternalLink, X } from "lucide-react";
import { useState } from "react";

const NoticeBanner = () => {
  const { notices, loading } = useActiveNotices();
  const [dismissedNotices, setDismissedNotices] = useState(new Set());

  if (loading || notices.length === 0) return null;

  const visibleNotices = notices.filter((n) => !dismissedNotices.has(n._id));

  if (visibleNotices.length === 0) return null;

  const handleDismiss = (noticeId) => {
    setDismissedNotices((prev) => new Set([...prev, noticeId]));
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      {visibleNotices.map((notice) => (
        <div
          key={notice._id}
          className="relative bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 md:p-5 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl shrink-0">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                {notice.title}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {notice.description}
              </p>
              {notice.keyPoints?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {notice.keyPoints.map((point, i) => (
                    <span
                      key={i}
                      className="bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[11px] px-2 py-0.5 rounded-full font-medium"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              )}
              {notice.button?.url && notice.button?.text && (
                <a
                  href={notice.button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: notice.button.color || "#1976d2" }}
                >
                  {notice.button.text}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <button
              onClick={() => handleDismiss(notice._id)}
              className="p-1.5 rounded-lg hover:bg-gray-200/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeBanner;
