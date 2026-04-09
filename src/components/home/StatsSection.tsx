"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Users, Calendar, Award, Layers } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Stat {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Users, value: 150, suffix: "+", label: "Uye Firma" },
  { icon: Calendar, value: 2024, suffix: "", label: "Kurulus Yili" },
  { icon: Award, value: 25, suffix: "+", label: "Etkinlik" },
  { icon: Layers, value: 550, suffix: "+", label: "Alt Sektor" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic: fast start, slow end
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-b from-primary-50/50 to-white py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map(({ icon: Icon, value, suffix, label }, index) => (
              <div key={label} className="relative">
                {/* Vertical separator between cards on desktop */}
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-neutral-200" />
                )}
                <div className="text-center group hover:-translate-y-1 transition-all duration-300">
                  {/* Icon container */}
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors duration-300">
                    <Icon size={22} className="text-primary-600" />
                  </div>
                  {/* Decorative line */}
                  <div className="w-8 h-0.5 bg-secondary mx-auto mb-3" />
                  {/* Number */}
                  <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight leading-none">
                    <CountUp target={value} suffix={suffix} />
                  </p>
                  {/* Label */}
                  <p className="text-sm text-neutral-500 mt-2 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
