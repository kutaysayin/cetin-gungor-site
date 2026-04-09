/* Tuzuk akordeon bileseni — Framer Motion AnimatePresence ile acilip kapanir */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface TuzukMadde {
  no: number;
  baslik: string;
  icerik: string[];
}

interface TuzukAccordionProps {
  maddeler: TuzukMadde[];
}

export default function TuzukAccordion({ maddeler }: TuzukAccordionProps) {
  const [acikMadde, setAcikMadde] = useState<number | null>(null);

  function toggle(no: number) {
    setAcikMadde((prev) => (prev === no ? null : no));
  }

  return (
    <div className="space-y-3">
      {maddeler.map((madde) => {
        const acik = acikMadde === madde.no;
        return (
          <div
            key={madde.no}
            className={[
              "rounded-2xl overflow-hidden border transition-all duration-200",
              acik
                ? "border-secondary/40 border-l-4 border-l-secondary shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "border-neutral-200",
            ].join(" ")}
          >
            <button
              onClick={() => toggle(madde.no)}
              aria-expanded={acik}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className={[
                  "flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors duration-200",
                  acik ? "bg-secondary text-white" : "bg-primary text-white",
                ].join(" ")}>
                  {madde.no}
                </span>
                <span className="font-semibold text-primary leading-snug">
                  Madde {madde.no}: {madde.baslik}
                </span>
              </span>
              <motion.span
                animate={{ rotate: acik ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className={[
                  "flex-shrink-0 transition-colors",
                  acik ? "text-secondary" : "text-neutral-400",
                ].join(" ")}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {acik && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-3 bg-neutral-50/60">
                    {madde.icerik.map((paragraf, i) => (
                      <p
                        key={i}
                        className="text-neutral-600 leading-relaxed text-[0.9375rem]"
                      >
                        {paragraf}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
