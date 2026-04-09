"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-900">
      {/* Grid texture overlay */}
      <div className="bg-grid-pattern absolute inset-0 pointer-events-none" />

      {/* Gradient mesh blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-7">
          <span className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 backdrop-blur-sm text-secondary-300 rounded-full px-5 py-1.5 text-sm tracking-wide font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
            Manisa Insaat Sektorunun Sesi
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}
        >
          Birlikte Guclu,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
            Birlikte Buyuk
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Manisa insaat malzemecileri olarak sektorumuzu ileriye tasiyoruz.
          Uyelerimize mesleki destek, dayanisma ve gelecege kapi araliyoruz.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/uyelik"
            className="inline-flex items-center justify-center bg-gradient-to-r from-secondary-500 to-secondary-400 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-[var(--shadow-glow-secondary)] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Uye Ol
          </Link>
          <Link
            href="/hakkimizda"
            className="inline-flex items-center justify-center border-2 border-white/20 text-white/80 px-8 py-4 rounded-full text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            Bizi Taniyin
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        <span className="text-white/30 text-xs tracking-widest uppercase">Kesfet</span>
        <ChevronDown
          size={28}
          className="text-white/30 animate-bounce"
          aria-label="Asagi kaydir"
        />
      </div>
    </section>
  );
}
