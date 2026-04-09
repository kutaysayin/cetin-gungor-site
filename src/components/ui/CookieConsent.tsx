/**
 * CookieConsent bileseni
 * Ilk ziyarette cerez onay banner'i gosterir.
 * localStorage ile tercih kaydedilir.
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept(value: "all" | "essential") {
    localStorage.setItem("cookie-consent", value);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4 md:pb-6"
        >
          <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-100 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Metin */}
            <p className="text-sm text-neutral-700 leading-relaxed flex-1">
              Bu web sitesi, deneyiminizi iyilestirmek icin cerezleri
              kullanmaktadir.{" "}
              <Link
                href="/cerez-politikasi"
                className="text-accent-600 font-medium hover:underline"
              >
                Cerez Politikasi
              </Link>
            </p>

            {/* Butonlar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => accept("essential")}
                className="px-4 py-2 text-sm font-medium text-primary-700 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
              >
                Sadece Zorunlu
              </button>
              <button
                onClick={() => accept("all")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
