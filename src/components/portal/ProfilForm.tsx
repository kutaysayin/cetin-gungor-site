/**
 * Profil duzenleme formu — istemci bileseni
 * Ad, email, telefon, firma, sektor, adres, bio alanlari.
 * Ayrica sifre degistirme bolumu.
 */
"use client";

import { useState } from "react";
import { Camera, Save, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

const sektorSecenekleri = [
  "Yapi Malzemeleri",
  "Demir-Celik",
  "Ahsap & Parke",
  "Cam & Aluminyum",
  "Boya & Kaplama",
  "Elektrik Malzemeleri",
  "Sihhi Tesisat",
  "Insaat Makinalari",
  "Zemin & Seramik",
  "Yalitim Malzemeleri",
  "Diger",
];

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  sector: string | null;
  address: string | null;
  bio: string | null;
}

interface ProfilFormProps {
  user: UserData;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type AlertType = "success" | "error";

interface AlertMessage {
  type: AlertType;
  text: string;
}

export default function ProfilForm({ user }: ProfilFormProps) {
  const [profileData, setProfileData] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    companyName: user.companyName ?? "",
    sector: user.sector ?? "",
    address: user.address ?? "",
    bio: user.bio ?? "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileAlert, setProfileAlert] = useState<AlertMessage | null>(null);
  const [passwordAlert, setPasswordAlert] = useState<AlertMessage | null>(null);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileAlert(null);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();

      if (res.ok) {
        setProfileAlert({ type: "success", text: "Profiliniz basariyla guncellendi." });
      } else {
        setProfileAlert({ type: "error", text: data.error ?? "Bir hata olustu." });
      }
    } catch {
      setProfileAlert({ type: "error", text: "Sunucu hatasi. Lutfen tekrar deneyin." });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordAlert(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordAlert({ type: "error", text: "Yeni sifreler eslesmiyor." });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordAlert({ type: "error", text: "Sifre en az 6 karakter olmalidir." });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changePassword: true,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordAlert({ type: "success", text: "Sifreniz basariyla degistirildi." });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordAlert({ type: "error", text: data.error ?? "Bir hata olustu." });
      }
    } catch {
      setPasswordAlert({ type: "error", text: "Sunucu hatasi. Lutfen tekrar deneyin." });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Profil bilgileri formu */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100">
          <h2 className="font-semibold text-primary">Kisisel Bilgiler</h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Ad, iletisim ve firma bilgilerinizi guncelleyin.
          </p>
        </div>

        <form onSubmit={handleProfileSave} className="p-6 space-y-6">
          {/* Avatar ve bilgi */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {getInitials(user.name)}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary-500 text-white flex items-center justify-center shadow-md hover:bg-secondary-600 transition-colors"
                title="Fotograf Degistir (Sprint 5)"
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="font-semibold text-primary">{user.name}</p>
              <p className="text-sm text-neutral-400">{user.email}</p>
              <p className="text-xs text-neutral-300 mt-1">
                Avatar destegi yakinda eklenecek.
              </p>
            </div>
          </div>

          {/* Alert */}
          {profileAlert && (
            <div
              className={[
                "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium",
                profileAlert.type === "success"
                  ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                  : "bg-red-50 text-red-700 ring-1 ring-red-100",
              ].join(" ")}
            >
              {profileAlert.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {profileAlert.text}
            </div>
          )}

          {/* Form alanlari — grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ad Soyad */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Ad Soyad
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                placeholder="Ad Soyad"
                required
              />
            </div>

            {/* Email (salt okunur) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-400 bg-neutral-50 cursor-not-allowed"
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Telefon
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                placeholder="+90 5XX XXX XX XX"
              />
            </div>

            {/* Firma Adi */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Firma Adi
              </label>
              <input
                type="text"
                value={profileData.companyName}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, companyName: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                placeholder="Firma Adi A.S."
              />
            </div>

            {/* Sektor */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Sektor
              </label>
              <select
                value={profileData.sector}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, sector: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all bg-white"
              >
                <option value="">Sektor secin...</option>
                {sektorSecenekleri.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Adres */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Adres
              </label>
              <textarea
                value={profileData.address}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, address: e.target.value }))
                }
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all resize-none"
                placeholder="Firma adresi..."
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Hakkimda
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, bio: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all resize-none"
                placeholder="Kisa bir tanitim yazisi..."
              />
            </div>
          </div>

          {/* Kaydet butonu */}
          <div className="flex justify-end">
            <Button type="submit" loading={profileLoading} size="sm">
              <Save size={15} />
              Kaydet
            </Button>
          </div>
        </form>
      </div>

      {/* Sifre degistirme bolumu */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100">
          <h2 className="font-semibold text-primary">Sifre Degistir</h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Guvenliginiz icin sifrenizi duzenli olarak degistirin.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          {/* Sifre alert */}
          {passwordAlert && (
            <div
              className={[
                "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium",
                passwordAlert.type === "success"
                  ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                  : "bg-red-50 text-red-700 ring-1 ring-red-100",
              ].join(" ")}
            >
              {passwordAlert.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {passwordAlert.text}
            </div>
          )}

          {/* Mevcut sifre */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
              Mevcut Sifre
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))
                }
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                placeholder="Mevcut sifreniz"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Yeni sifre */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Yeni Sifre
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Sifre tekrar */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">
                Sifre Tekrar
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                placeholder="Yeni sifreyi tekrar girin"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading} size="sm">
              <Lock size={15} />
              Sifre Degistir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
