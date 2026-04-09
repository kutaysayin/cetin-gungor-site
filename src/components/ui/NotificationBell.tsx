"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    text: "Yeni etkinlik eklendi: TIMFED Bolge Toplantisi",
    time: "2 saat once",
    read: false,
  },
  {
    id: 2,
    text: "Aidat odemeniz basariyla alindi",
    time: "1 gun once",
    read: false,
  },
  {
    id: 3,
    text: "Yeni haber: Sektor bulusma etkinligi",
    time: "3 gun once",
    read: true,
  },
  {
    id: 4,
    text: "Uyelik basvurunuz onaylandi",
    time: "1 hafta once",
    read: true,
  },
];

export default function NotificationBell({
  scrolled,
}: {
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirimler"
        className={`relative p-2 rounded-full transition-all duration-200 ${
          scrolled
            ? "text-primary-600 hover:bg-primary-50"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary-800">
                Bildirimler
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs text-secondary-600 font-medium">
                  {unreadCount} yeni
                </span>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-primary-50/50 transition-colors duration-150 cursor-pointer border-b border-neutral-50 last:border-b-0 ${
                    !notif.read ? "bg-primary-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Unread dot */}
                    <div className="mt-1.5 shrink-0">
                      {!notif.read ? (
                        <span className="block w-2 h-2 rounded-full bg-secondary-500" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          !notif.read
                            ? "text-primary-800 font-medium"
                            : "text-neutral-600"
                        }`}
                      >
                        {notif.text}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-neutral-100">
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-secondary-600 hover:text-secondary-700 transition-colors"
              >
                Tum Bildirimleri Gor
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
