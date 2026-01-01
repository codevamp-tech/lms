"use client";

import { useEffect, useState } from "react";
import { MessageSquare, BookOpen, Bell } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: "SYSTEM" | "COURSE" | "CHAT";
  isRead: boolean;
  sentAt: string;
  userId?: { _id: string; name: string }; // Updated to reflect backend
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Fetch notifications again
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/all`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case "CHAT":
        return <MessageSquare className="w-5 h-5" />;
      case "COURSE":
        return <BookOpen className="w-5 h-5" />;
      case "SYSTEM":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Get colors based on type
  const getColors = (type: string) => {
    switch (type) {
      case "CHAT":
        return {
          bg: "bg-gradient-to-br from-purple-500 to-pink-500",
          glow: "shadow-purple-200",
        };
      case "COURSE":
        return {
          bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
          glow: "shadow-emerald-200",
        };
      case "SYSTEM":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-indigo-500",
          glow: "shadow-blue-200",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-500 to-gray-600",
          glow: "shadow-gray-200",
        };
    }
  };

  // Format time ago
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="w-full max-h-[400px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {notifications.length === 0 && (
        <div className="w-full p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
            <Bell className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-1">All caught up!</p>
          <p className="text-gray-500 text-sm">No new notifications</p>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {notifications.map((n) => {
          const colors = getColors(n.type);

          return (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`relative flex gap-4 px-5 py-4 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md group ${
                !n.isRead
                  ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/50"
                  : "bg-transparent"
              }`}
            >
              {/* Animated Icon with Gradient */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.glow} shadow-lg flex items-center justify-center text-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {getIcon(n.type)}
                </div>

                {/* Unread pulse indicator */}
                {!n.isRead && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h4
                      className={`text-base leading-snug transition-colors ${
                        !n.isRead
                          ? "font-bold text-gray-900"
                          : "font-semibold text-gray-700"
                      }`}
                    >
                      {n.title.replace(/^Reminder:\s*/, "")} {/* Remove "Reminder:" */}
                    </h4>

                    {/* Show recipient name */}
                    {n.userId?.name && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        To: {n.userId.name}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-full transition-all ${
                      !n.isRead
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getTimeAgo(n.sentAt)}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-2 transition-colors ${
                    !n.isRead ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  {n.body}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                      n.type === "CHAT"
                        ? "bg-purple-100 text-purple-700"
                        : n.type === "COURSE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {n.type}
                  </span>

                  {!n.isRead && (
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none rounded-lg"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
