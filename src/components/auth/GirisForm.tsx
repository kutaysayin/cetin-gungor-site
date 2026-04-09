/* Uye giris formu — client component */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function GirisForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/portal");
      }
    } catch {
      setError("Bir hata olustu, lutfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-elevated p-8">
        {/* Baslik */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary-900 flex items-center justify-center mb-4">
            <Building2 size={26} className="text-secondary-400" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 text-center">
            Uye Giris Paneli
          </h2>
          <p className="text-neutral-500 text-sm mt-1 text-center">
            Uye portalina erisim icin giris yapin
          </p>
        </div>

        {/* Hata mesaji */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-800 mb-1.5"
            >
              Email Adresi
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@firma.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Sifre */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-800 mb-1.5"
            >
              Sifre
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-neutral-200 bg-neutral-50 text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all duration-200 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-700 transition-colors"
                aria-label={showPassword ? "Sifreyi gizle" : "Sifreyi goster"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Giris butonu */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            Giris Yap
          </Button>
        </form>

        {/* Alt link */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          Hesabiniz yok mu?{" "}
          <Link
            href="/kayit"
            className="text-secondary-600 font-medium hover:text-secondary-700 transition-colors"
          >
            Uyelik Basvurusu
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
